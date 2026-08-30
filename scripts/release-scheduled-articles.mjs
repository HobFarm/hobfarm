import { readdir, readFile } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ARTICLE_EXTENSIONS = new Set([".md", ".mdx"]);
const DEFAULT_ARTICLE_ROOT = resolve("src/content/articles");
const DEFAULT_SITE_ORIGIN = "https://hob.farm";
const DEFAULT_VERIFY_TIMEOUT_MS = 10 * 60 * 1000;
const DEFAULT_VERIFY_INTERVAL_MS = 15 * 1000;

function scalar(frontmatter, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = frontmatter.match(new RegExp(`^${escaped}:\\s*(.+?)\\s*$`, "m"));
  if (!match) return undefined;
  const value = match[1].trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

export function parseArticleFrontmatter(source) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return {};
  const frontmatter = match[1];
  return {
    title: scalar(frontmatter, "title"),
    canonical: scalar(frontmatter, "canonical"),
    publishedAt: scalar(frontmatter, "publishedAt"),
    pubDate: scalar(frontmatter, "pubDate"),
    status: scalar(frontmatter, "status"),
    draft: scalar(frontmatter, "draft")?.toLowerCase() === "true",
  };
}

function normalizeRoute(value) {
  if (!value) return undefined;
  let pathname = value;
  if (/^https?:\/\//i.test(value)) pathname = new URL(value).pathname;
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function parseArticleSource(source, filePath, articleRoot = DEFAULT_ARTICLE_ROOT) {
  const data = parseArticleFrontmatter(source);
  const releaseValue = data.publishedAt ?? data.pubDate;
  const releaseTime = releaseValue ? Date.parse(releaseValue) : Number.NaN;
  if (!Number.isFinite(releaseTime)) return undefined;

  const relativeId = relative(articleRoot, filePath)
    .replace(/\\/g, "/")
    .replace(/\.(md|mdx)$/i, "");
  const route = normalizeRoute(data.canonical) ?? `/articles/${relativeId}/`;

  return {
    filePath,
    title: data.title ?? relativeId,
    route,
    releaseValue,
    releaseTime,
    status: (data.status ?? "published").toLowerCase(),
    draft: data.draft,
  };
}

export function selectLatestEligibleArticle(articles, now = new Date()) {
  const nowTime = now.getTime();
  return articles
    .filter(
      (article) =>
        !article.draft &&
        article.status !== "draft" &&
        article.status !== "archived" &&
        article.releaseTime <= nowTime,
    )
    .sort(
      (a, b) =>
        b.releaseTime - a.releaseTime || a.route.localeCompare(b.route),
    )[0];
}

async function listArticleFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listArticleFiles(entryPath)));
    else if (entry.isFile() && ARTICLE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(entryPath);
    }
  }
  return files;
}

export async function loadArticles(articleRoot = DEFAULT_ARTICLE_ROOT) {
  const files = await listArticleFiles(articleRoot);
  const articles = await Promise.all(
    files.map(async (filePath) =>
      parseArticleSource(await readFile(filePath, "utf8"), filePath, articleRoot),
    ),
  );
  return articles.filter(Boolean);
}

async function routeStatus(url, fetchImpl = fetch) {
  let response = await fetchImpl(url, {
    method: "HEAD",
    redirect: "follow",
    headers: { "user-agent": "HobFarm scheduled publication monitor" },
  });
  if (response.status === 405) {
    response = await fetchImpl(url, {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": "HobFarm scheduled publication monitor" },
    });
    await response.body?.cancel();
  }
  return response.status;
}

export function validateDeployHookUrl(value) {
  if (!value) {
    throw new Error(
      "CLOUDFLARE_PAGES_DEPLOY_HOOK_URL is not configured in GitHub Actions.",
    );
  }
  const url = new URL(value);
  if (url.protocol !== "https:" || url.hostname !== "api.cloudflare.com") {
    throw new Error("The configured Pages deploy hook must use https://api.cloudflare.com/.");
  }
  return url.toString();
}

async function triggerDeployment(hookUrl, fetchImpl = fetch) {
  const response = await fetchImpl(hookUrl, {
    method: "POST",
    redirect: "manual",
    headers: { "user-agent": "HobFarm scheduled publication monitor" },
  });
  if (!response.ok) {
    throw new Error(`Cloudflare rejected the Pages deploy hook with HTTP ${response.status}.`);
  }
}

const wait = (milliseconds) =>
  new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

function numericSetting(value, fallback) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export async function runScheduledRelease({
  now = new Date(),
  articleRoot = DEFAULT_ARTICLE_ROOT,
  siteOrigin = process.env.PUBLICATION_SITE_ORIGIN ?? DEFAULT_SITE_ORIGIN,
  hookUrl = process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL,
  dryRun = false,
  fetchImpl = fetch,
  verifyTimeoutMs = numericSetting(
    process.env.PUBLICATION_VERIFY_TIMEOUT_MS,
    DEFAULT_VERIFY_TIMEOUT_MS,
  ),
  verifyIntervalMs = numericSetting(
    process.env.PUBLICATION_VERIFY_INTERVAL_MS,
    DEFAULT_VERIFY_INTERVAL_MS,
  ),
} = {}) {
  const articles = await loadArticles(articleRoot);
  const article = selectLatestEligibleArticle(articles, now);
  if (!article) {
    console.log("No article is eligible for publication yet.");
    return { action: "none", reason: "no-eligible-article" };
  }

  const articleUrl = new URL(article.route, siteOrigin).toString();
  console.log(
    `Latest eligible article: ${article.title} (${article.releaseValue}) at ${articleUrl}`,
  );

  const initialStatus = await routeStatus(articleUrl, fetchImpl);
  if (initialStatus >= 200 && initialStatus < 400) {
    console.log(`Article is already live (HTTP ${initialStatus}); no deployment needed.`);
    return { action: "none", reason: "already-live", article };
  }

  if (dryRun) {
    console.log(`Article is not live (HTTP ${initialStatus}); a Pages rebuild would be triggered.`);
    return { action: "would-deploy", article, initialStatus };
  }

  const validatedHookUrl = validateDeployHookUrl(hookUrl);
  console.log(`Article is not live (HTTP ${initialStatus}); triggering the protected Pages deploy hook.`);
  await triggerDeployment(validatedHookUrl, fetchImpl);

  const deadline = Date.now() + verifyTimeoutMs;
  while (Date.now() < deadline) {
    await wait(verifyIntervalMs);
    const status = await routeStatus(articleUrl, fetchImpl);
    if (status >= 200 && status < 400) {
      console.log(`Article is live after deployment (HTTP ${status}).`);
      return { action: "deployed", article, status };
    }
    console.log(`Waiting for deployment; article route returned HTTP ${status}.`);
  }

  throw new Error(
    `Cloudflare accepted the deploy hook, but ${articleUrl} did not become live within ${Math.round(verifyTimeoutMs / 1000)} seconds.`,
  );
}

function argumentValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const nowValue = argumentValue("--now");
  const now = nowValue ? new Date(nowValue) : new Date();
  if (Number.isNaN(now.getTime())) {
    console.error(`Invalid --now value: ${nowValue}`);
    process.exitCode = 1;
  } else {
    runScheduledRelease({
      now,
      dryRun:
        process.argv.includes("--dry-run") ||
        process.env.PUBLICATION_DRY_RUN === "true",
    }).catch((error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
  }
}
