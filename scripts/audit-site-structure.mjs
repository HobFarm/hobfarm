import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { auditEditorialMesh } from "./audit-editorial-mesh.mjs";
import {
  editorialSections,
  editorialSeriesIds,
} from "../src/data/editorial-mesh.ts";

const root = process.cwd();
const distRoot = path.join(root, "dist", "client");
const reportRoot = path.join(root, "reports", "site-structure");
const siteOrigin = "https://hob.farm";
const falseLegacy3dm = [
  "the-censor-eats-its-own-tail",
  "they-had-names-doll-family",
  "topless-party-in-outer-space",
];
const forbiddenBroadAliases = [
  'Recommendation algorithms", ["algorithms"]',
  'Streaming media", ["streaming"]',
  'Universal Pictures", ["Universal"]',
  'AI image generation", ["generative image models"]',
];

if (!fs.existsSync(distRoot)) {
  console.error("Missing dist/client. Run npm run build before audit:site-structure.");
  process.exit(1);
}

fs.mkdirSync(reportRoot, { recursive: true });

function filesUnder(directory) {
  return fs
    .readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name));
}

function routeForFile(file) {
  const relative = path.relative(distRoot, file).replaceAll("\\", "/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  return `/${relative}`;
}

function normalizePathname(value) {
  try {
    const url = new URL(value, siteOrigin);
    if (url.origin !== siteOrigin) return undefined;
    return decodeURIComponent(url.pathname.replace(/\/+/g, "/"));
  } catch {
    return undefined;
  }
}

function routeExists(pathname, routeSet, redirectSources, sourceRouteSet = new Set()) {
  if (!pathname) return true;
  if (routeSet.has(pathname) || redirectSources.has(pathname) || sourceRouteSet.has(pathname)) return true;
  if (!pathname.endsWith("/") && (routeSet.has(`${pathname}/`) || sourceRouteSet.has(`${pathname}/`))) return true;
  if (pathname.endsWith("/") && (routeSet.has(pathname.slice(0, -1)) || sourceRouteSet.has(pathname.slice(0, -1)))) return true;
  return false;
}

function htmlLinks(html) {
  return [...html.matchAll(/\bhref=(["'])(.*?)\1/gi)].map((match) => match[2]);
}

function canonicalFromHtml(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    if (!/\brel=["'][^"']*canonical[^"']*["']/i.test(tag)) continue;
    return tag.match(/\bhref=(["'])(.*?)\1/i)?.[2];
  }
  return undefined;
}

function jsonLdFromHtml(html, route, errors) {
  const entries = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      entries.push(JSON.parse(match[1].trim()));
    } catch (error) {
      errors.push(`${route}: invalid JSON-LD (${error.message})`);
    }
  }
  return entries;
}

function schemaTypes(value, found = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) schemaTypes(item, found);
  } else if (value && typeof value === "object") {
    const type = value["@type"];
    if (typeof type === "string") found.add(type);
    for (const item of Object.values(value)) schemaTypes(item, found);
  }
  return found;
}

function schemaNodes(value, found = []) {
  if (Array.isArray(value)) {
    for (const item of value) schemaNodes(item, found);
    return found;
  }
  if (!value || typeof value !== "object") return found;
  if (value["@type"]) found.push(value);
  for (const item of Object.values(value)) schemaNodes(item, found);
  return found;
}

function redirectMap() {
  const redirects = new Map();
  const source = fs.readFileSync(path.join(root, "public", "_redirects"), "utf8");
  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [from, to, status] = trimmed.split(/\s+/);
    if (from?.startsWith("/") && to && status) redirects.set(from, { to, status });
  }
  return redirects;
}

function publicArticlePath(article) {
  const slug = article.slug.split("/").at(-1);
  return article.data.mesh?.series?.includes("3dm")
    ? `/presents/3-degrees-of-dick-miller/${slug}/`
    : `/articles/${article.slug}/`;
}

const allFiles = filesUnder(distRoot);
const routeFiles = allFiles.filter((file) => /\.(html|xml|json|txt)$/.test(file));
const routeSet = new Set(routeFiles.map(routeForFile));
const sourceRouteSet = new Set(
  filesUnder(path.join(root, "src", "pages"))
    .map((file) => path.relative(path.join(root, "src", "pages"), file).replaceAll("\\", "/"))
    .filter((file) => /\.(astro|mjs|js|ts)$/.test(file) && !file.includes("["))
    .map((file) => {
      const withoutExtension = file.replace(/\.(astro|mjs|js|ts)$/, "");
      return withoutExtension === "index"
        ? "/"
        : withoutExtension.endsWith("/index")
          ? `/${withoutExtension.slice(0, -"index".length)}`
          : `/${withoutExtension}`;
    }),
);
const redirects = redirectMap();
const redirectSources = new Set(redirects.keys());
const errors = [];
const warnings = [];
const meshAudit = auditEditorialMesh();
errors.push(...meshAudit.errors.map((error) => `mesh: ${error}`));
warnings.push(...meshAudit.warnings.map((warning) => `mesh: ${warning}`));

const registrySource = fs.readFileSync(path.join(root, "src", "data", "editorial-mesh.ts"), "utf8");
for (const alias of forbiddenBroadAliases) {
  if (registrySource.includes(alias)) errors.push(`registry: forbidden broad alias remains: ${alias}`);
}

const htmlInventory = [];
const canonicalOwners = new Map();
const brokenLinks = [];
const inbound = new Map();
const discoveryPrefixes = [
  "/articles/",
  ...editorialSections.map((section) => `/articles/${section.slug}/`),
];

for (const file of routeFiles.filter((candidate) => candidate.endsWith(".html"))) {
  const route = routeForFile(file);
  const html = fs.readFileSync(file, "utf8");
  const canonical = canonicalFromHtml(html);
  const canonicalPath = canonical ? normalizePathname(canonical) : undefined;
  const indexable = !/<meta\b[^>]*name=["']robots["'][^>]*noindex/i.test(html);
  const jsonLd = jsonLdFromHtml(html, route, errors);
  const types = [...schemaTypes(jsonLd)];
  const internalLinks = [];

  if (indexable && !canonical) errors.push(`${route}: indexable HTML has no canonical`);
  if (canonicalPath && canonicalPath !== route && !routeExists(canonicalPath, routeSet, redirectSources, sourceRouteSet)) {
    errors.push(`${route}: canonical target does not exist: ${canonicalPath}`);
  }
  if (canonical && canonicalPath === route) {
    const owners = canonicalOwners.get(canonical) ?? [];
    owners.push(route);
    canonicalOwners.set(canonical, owners);
  }

  for (const href of htmlLinks(html)) {
    if (/^(?:#|mailto:|tel:|javascript:)/i.test(href)) continue;
    const target = normalizePathname(href);
    if (!target || target.startsWith("/api/") || target.startsWith("/cdn-cgi/")) continue;
    if (/\.(?:css|js|mjs|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|mp4|webm|zip|pdf)$/i.test(target)) continue;
    internalLinks.push(target);
    const sources = inbound.get(target) ?? new Set();
    sources.add(route);
    inbound.set(target, sources);
    if (!routeExists(target, routeSet, redirectSources, sourceRouteSet)) brokenLinks.push({ source: route, target });
  }

  htmlInventory.push({
    route,
    file: path.relative(root, file).replaceAll("\\", "/"),
    canonical,
    canonicalOwner: canonicalPath === route,
    indexable,
    jsonLdTypes: types,
    internalLinks: [...new Set(internalLinks)].sort(),
  });
}

for (const [canonical, owners] of canonicalOwners) {
  if (owners.length > 1) errors.push(`canonical ${canonical} is shared by ${owners.join(", ")}`);
}
for (const broken of brokenLinks) errors.push(`${broken.source}: broken internal link ${broken.target}`);

const now = Date.now();
const releasedArticles = meshAudit.articles.filter(({ data }) => {
  if (data.draft || ["draft", "archived"].includes(data.status)) return false;
  const date = new Date(data.publishedAt ?? data.pubDate ?? 0).getTime();
  return Number.isFinite(date) && date <= now;
});
const unreleasedArticles = meshAudit.articles.filter((article) => !releasedArticles.includes(article));
const releasedPaths = releasedArticles.map(publicArticlePath);

for (const article of releasedArticles) {
  const route = publicArticlePath(article);
  if (!routeSet.has(route)) errors.push(`${article.slug}: released article route is missing: ${route}`);
  const html = routeSet.has(route)
    ? fs.readFileSync(path.join(distRoot, route === "/" ? "index.html" : route.slice(1), "index.html"), "utf8")
    : "";
  const section = editorialSections.find((candidate) => candidate.slug === article.data.mesh?.section);
  if (html && section && !html.includes(section.label)) errors.push(`${route}: article does not expose its primary section`);
  if (html && route.startsWith("/articles/")) {
    const nodes = jsonLdFromHtml(html, route, errors).flatMap((value) => schemaNodes(value));
    const articleNode = nodes.find((node) => node["@type"] === "Article");
    const webpageNode = nodes.find((node) => node["@type"] === "WebPage");
    if (!articleNode) errors.push(`${route}: missing Article JSON-LD`);
    if (!webpageNode) errors.push(`${route}: missing WebPage JSON-LD`);
    if (articleNode && !String(articleNode["@id"] ?? "").endsWith("#article")) errors.push(`${route}: Article JSON-LD has no stable @id`);
    if (articleNode && !articleNode.mainEntityOfPage) errors.push(`${route}: Article JSON-LD has no mainEntityOfPage`);
    if (article.data.mesh?.subjects.length && !articleNode?.about) errors.push(`${route}: Article JSON-LD omits canonical subjects`);
    const entityCount = article.data.mesh
      ? Object.values(article.data.mesh.entities).reduce((count, values) => count + values.length, 0)
      : 0;
    if (entityCount && !articleNode?.mentions) errors.push(`${route}: Article JSON-LD omits named-entity mentions`);
    if (article.data.sourceNotes?.length && !articleNode?.citation) errors.push(`${route}: Article JSON-LD omits source citations`);
  }
}

for (const section of editorialSections) {
  const route = `/articles/${section.slug}/`;
  const file = path.join(distRoot, "articles", section.slug, "index.html");
  if (!fs.existsSync(file)) {
    errors.push(`${route}: section archive is missing`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const expected = releasedArticles.filter((article) => article.data.mesh?.section === section.slug);
  for (const article of expected) {
    if (!html.includes(publicArticlePath(article))) errors.push(`${route}: missing article link ${publicArticlePath(article)}`);
  }
  if (!jsonLdFromHtml(html, route, errors).some((value) => schemaTypes(value).has("CollectionPage"))) {
    errors.push(`${route}: missing CollectionPage JSON-LD`);
  }
}

for (const seriesId of editorialSeriesIds) {
  const members = releasedArticles.filter((article) => article.data.mesh?.series?.includes(seriesId));
  if (!members.length) warnings.push(`series ${seriesId}: no released members`);
}

for (const slug of falseLegacy3dm) {
  const oldRoute = `/presents/3-degrees-of-dick-miller/${slug}/`;
  const articleRoute = `/articles/${slug}/`;
  if (routeSet.has(oldRoute)) errors.push(`${oldRoute}: false legacy 3DM page is still built`);
  if (!routeSet.has(articleRoute)) errors.push(`${articleRoute}: canonical article page is missing`);
  if (redirects.get(oldRoute)?.to !== articleRoute) errors.push(`${oldRoute}: permanent redirect to ${articleRoute} is missing`);
}

const sitemapFiles = routeFiles.filter((file) => /sitemap.*\.xml$/.test(file));
const sitemapTargets = new Set();
const forbiddenSitemapPrefixes = [
  "/account",
  "/api/",
  "/login",
  "/articles/tags/",
  "/academy/checkout/",
  "/membership/success/",
  "/shop/order-received/",
  "/workshop/stylefusion/prototype/",
  "/workshop/visual-lab/",
];
for (const file of sitemapFiles) {
  const route = routeForFile(file);
  const xml = fs.readFileSync(file, "utf8");
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const target = normalizePathname(match[1]);
    sitemapTargets.add(target);
    if (!routeExists(target, routeSet, redirectSources, sourceRouteSet)) errors.push(`${route}: sitemap target does not exist: ${target}`);
    if (forbiddenSitemapPrefixes.some((prefix) => target === prefix || target.startsWith(prefix))) {
      errors.push(`${route}: private, transactional, or thin route is in the sitemap: ${target}`);
    }
    const htmlTarget = htmlInventory.find((entry) => entry.route === target);
    if (htmlTarget && !htmlTarget.indexable) errors.push(`${route}: noindex route is in the sitemap: ${target}`);
  }
}

for (const requiredRoute of [
  "/",
  "/about/",
  "/articles/",
  "/articles/topics/",
  ...editorialSections.map((section) => `/articles/${section.slug}/`),
  "/presents/",
  "/workshop/",
  "/workshop/projects/",
  "/workshop/projects/hobfarm/",
  "/workshop/workshop-notes/",
  "/academy/",
  "/shop/",
]) {
  if (!sitemapTargets.has(requiredRoute)) errors.push(`sitemaps: missing required public route ${requiredRoute}`);
}

for (const file of routeFiles.filter((candidate) => /(?:^|[\\/])rss\.xml$/.test(candidate))) {
  const route = routeForFile(file);
  const xml = fs.readFileSync(file, "utf8");
  if (!/<rss\b/i.test(xml) || !/<channel>/i.test(xml)) errors.push(`${route}: invalid RSS root`);
  const dates = [];
  for (const item of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const link = item[1].match(/<link>(?:<!\[CDATA\[)?([^<\]]+)/)?.[1]?.trim();
    const pubDate = item[1].match(/<pubDate>([^<]+)<\/pubDate>/)?.[1]?.trim();
    if (!link) errors.push(`${route}: RSS item has no link`);
    if (link) {
      const target = normalizePathname(link);
      if (!routeExists(target, routeSet, redirectSources, sourceRouteSet)) errors.push(`${route}: RSS item target does not exist: ${target}`);
      if (!new URL(link, siteOrigin).pathname.endsWith("/")) errors.push(`${route}: RSS item does not use its canonical trailing slash: ${link}`);
    }
    if (!pubDate || !Number.isFinite(Date.parse(pubDate))) errors.push(`${route}: RSS item has an invalid publication date`);
    else dates.push(Date.parse(pubDate));
  }
  if (dates.some((date, index) => index > 0 && date > dates[index - 1])) errors.push(`${route}: RSS items are not newest first`);
}

const leakSurfaces = ["/rss.xml", "/articles/mesh.json", "/sitemap.xml"];
for (const route of leakSurfaces) {
  const file = route === "/rss.xml"
    ? path.join(distRoot, "rss.xml")
    : path.join(distRoot, route.slice(1));
  if (!fs.existsSync(file)) {
    errors.push(`${route}: required discovery surface is missing`);
    continue;
  }
  const body = fs.readFileSync(file, "utf8");
  for (const article of unreleasedArticles) {
    const slug = article.slug.split("/").at(-1);
    if (body.includes(slug)) errors.push(`${route}: unreleased article leaked: ${slug}`);
  }
  if (route === "/articles/mesh.json" && body.includes("sourceArtifacts")) errors.push(`${route}: source artifacts leaked into the public graph`);
}

const robots = fs.readFileSync(path.join(distRoot, "robots.txt"), "utf8");
for (const sitemap of ["/sitemap-index.xml", "/sitemap.xml"]) {
  if (!robots.includes(`${siteOrigin}${sitemap}`)) errors.push(`/robots.txt: missing sitemap declaration ${sitemap}`);
  if (!routeSet.has(sitemap)) errors.push(`${sitemap}: declared sitemap is missing from the build`);
}

const discoveryRoutes = htmlInventory
  .filter((entry) => discoveryPrefixes.some((prefix) => entry.route === prefix || entry.route.startsWith("/articles/page/")))
  .map((entry) => entry.route);
const orphans = releasedPaths
  .filter((route) => {
    const sources = new Set([
      ...(inbound.get(route) ?? []),
      ...(inbound.get(route.slice(0, -1)) ?? []),
    ]);
    return ![...sources].some((source) => discoveryRoutes.includes(source));
  })
  .map((route) => ({ route, reason: "No inbound link from the Articles hub, pagination, or its primary section." }));
for (const orphan of orphans) errors.push(`${orphan.route}: orphaned released article`);

const routeInventory = {
  generatedAt: new Date().toISOString(),
  buildRoot: path.relative(root, distRoot).replaceAll("\\", "/"),
  counts: {
    files: allFiles.length,
    routes: routeFiles.length,
    html: htmlInventory.length,
    releasedArticles: releasedArticles.length,
    redirects: redirects.size,
  },
  routes: [
    ...htmlInventory,
    ...routeFiles
      .filter((file) => !file.endsWith(".html"))
      .map((file) => ({
        route: routeForFile(file),
        file: path.relative(root, file).replaceAll("\\", "/"),
        type: path.extname(file).slice(1),
      })),
  ].sort((a, b) => a.route.localeCompare(b.route)),
};

fs.writeFileSync(path.join(reportRoot, "route-inventory.json"), `${JSON.stringify(routeInventory, null, 2)}\n`);
fs.writeFileSync(path.join(reportRoot, "orphans.json"), `${JSON.stringify({ generatedAt: routeInventory.generatedAt, orphans }, null, 2)}\n`);

const auditMarkdown = [
  "# Site structure audit",
  "",
  `Generated: ${routeInventory.generatedAt}`,
  "",
  "## Summary",
  "",
  `- ${routeInventory.counts.routes} built route files, including ${routeInventory.counts.html} HTML pages.`,
  `- ${routeInventory.counts.releasedArticles} released article routes inspected.`,
  `- ${errors.length} structural errors.`,
  `- ${warnings.length} review warnings.`,
  `- ${orphans.length} orphaned released articles.`,
  "",
  "## Structural errors",
  "",
  ...(errors.length ? errors.map((error) => `- ${error}`) : ["- None."]),
  "",
  "## Review warnings",
  "",
  ...(warnings.length ? warnings.map((warning) => `- ${warning}`) : ["- None."]),
  "",
].join("\n");
fs.writeFileSync(path.join(reportRoot, "audit.md"), auditMarkdown);

console.log(`Site structure audit: ${routeInventory.counts.routes} routes, ${routeInventory.counts.releasedArticles} released articles`);
console.log(`${errors.length} structural errors; ${warnings.length} review warnings; ${orphans.length} orphans.`);
if (errors.length) {
  for (const error of errors.slice(0, 30)) console.error(`ERROR ${error}`);
  if (errors.length > 30) console.error(`ERROR ...and ${errors.length - 30} more (see reports/site-structure/audit.md)`);
  process.exitCode = 1;
}
