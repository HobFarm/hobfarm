import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import {
  parseArticleSource,
  selectLatestEligibleArticle,
  validateDeployHookUrl,
} from "../scripts/release-scheduled-articles.mjs";

const root = process.cwd();
const workflowDirectory = join(root, ".github", "workflows");
const scriptDirectory = join(root, "scripts");

const read = (path) => readFile(join(root, path), "utf8");
const readDirectory = async (path) => {
  try {
    return await readdir(path, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
};
const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("remaining one-time article publishers are paired and self-removing", async () => {
  const [workflowEntries, scriptEntries] = await Promise.all([
    readDirectory(workflowDirectory),
    readDirectory(scriptDirectory),
  ]);
  const workflows = workflowEntries
    .filter((entry) => entry.isFile() && /^publish-.+\.yml$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();
  const scripts = scriptEntries
    .filter((entry) => entry.isFile() && /^publish-scheduled-.+\.mjs$/.test(entry.name))
    .map((entry) => `scripts/${entry.name}`)
    .sort();
  const referencedScripts = new Set();

  for (const workflowName of workflows) {
    const workflowPath = `.github/workflows/${workflowName}`;
    const workflow = await read(workflowPath);
    const command = workflow.match(/\bnode\s+(scripts\/publish-scheduled-[a-z0-9-]+\.mjs)\b/);
    assert.ok(command, `${workflowPath} must call one publication helper`);

    const scriptPath = command[1];
    referencedScripts.add(scriptPath);
    const script = await read(scriptPath);

    assert.match(workflow, new RegExp(`git rm ${escapeRegExp(workflowPath)}`));
    assert.match(workflow, new RegExp(`git rm ${escapeRegExp(scriptPath)}`));
    assert.match(workflow, /if: steps\.article\.outputs\.published == 'true'/);

    const articlePath = script.match(/const articlePath = resolve\(\s*"([^"]+)"\s*\);/)?.[1];
    const release = script.match(/const expectedPublication = "([^"]+)";/)?.[1];
    assert.ok(articlePath, `${scriptPath} must identify one article`);
    assert.ok(release && Number.isFinite(Date.parse(release)), `${scriptPath} must use a valid release instant`);

    const article = await read(articlePath);
    assert.match(article, new RegExp(`^publishedAt:\\s*${escapeRegExp(release)}$`, "m"));
    assert.match(article, /^status:\s*(?:scheduled|published)$/m);
  }

  assert.deepEqual(
    [...referencedScripts].sort(),
    scripts,
    "Every remaining publication helper must be owned by an active self-removing workflow.",
  );
});

test("article tests verify durable content behavior, not one-time task artifacts", async () => {
  const testEntries = await readdir(join(root, "tests"), { withFileTypes: true });
  const forbiddenWorkflowPath = [".github", "workflows", "publish-"].join("/");
  const forbiddenScriptName = ["publish", "scheduled"].join("-");

  for (const entry of testEntries) {
    if (!entry.isFile() || !entry.name.endsWith(".test.mjs") || entry.name === "publication-infrastructure.test.mjs") {
      continue;
    }
    const source = await read(`tests/${entry.name}`);
    assert.equal(source.includes(forbiddenWorkflowPath), false, `${entry.name} references a one-time workflow`);
    assert.equal(source.includes(forbiddenScriptName), false, `${entry.name} references a one-time helper`);
  }
});

test("repository guidance defines the publication automation boundary", async () => {
  const guidance = await read("docs/codex/publishing-surfaces.md");
  assert.match(
    guidance,
    /Use existing publication infrastructure\. Content is data inside the publishing system, not a reason to create another publishing system\./,
  );
  assert.match(guidance, /Do not create an article-specific workflow, cron job, deployment path, build pipeline, permanent CI test/);
  assert.match(guidance, /Test durable publishing behavior/);
});

test("one durable workflow monitors scheduled releases without mutating articles", async () => {
  const workflow = await read(".github/workflows/release-scheduled-articles.yml");
  const helper = await read("scripts/release-scheduled-articles.mjs");

  assert.match(workflow, /timezone: "America\/Los_Angeles"/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /cancel-in-progress: false/);
  assert.match(workflow, /secrets\.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL/);
  assert.match(workflow, /node scripts\/release-scheduled-articles\.mjs/);
  assert.doesNotMatch(workflow, /\bgit\s+(?:add|commit|push|rm)\b/);
  assert.match(helper, /selectLatestEligibleArticle/);
  assert.match(helper, /Article is already live/);
  assert.match(helper, /triggering the protected Pages deploy hook/);
});

test("scheduled release selection follows the publication clock and evidence state", () => {
  const articleRoot = join(root, "src", "content", "articles");
  const article = (name, frontmatter) =>
    parseArticleSource(
      `---\n${frontmatter}\n---\n`,
      join(articleRoot, name),
      articleRoot,
    );
  const articles = [
    article("older.mdx", "title: Older\npublishedAt: 2026-08-29T16:20:00-07:00\nstatus: published"),
    article(
      "due.mdx",
      'title: Due\ncanonical: "/articles/due/"\npublishedAt: 2026-08-30T16:20:00-07:00\nstatus: scheduled',
    ),
    article("future.mdx", "title: Future\npublishedAt: 2026-08-31T16:20:00-07:00\nstatus: scheduled"),
    article("draft.mdx", "title: Draft\npublishedAt: 2026-08-30T16:21:00-07:00\nstatus: scheduled\ndraft: true"),
    article("archived.mdx", "title: Archived\npublishedAt: 2026-08-30T16:22:00-07:00\nstatus: archived"),
  ].filter(Boolean);

  assert.equal(
    selectLatestEligibleArticle(
      articles,
      new Date("2026-08-30T16:19:59-07:00"),
    )?.title,
    "Older",
  );
  const due = selectLatestEligibleArticle(
    articles,
    new Date("2026-08-30T16:20:01-07:00"),
  );
  assert.equal(due?.title, "Due");
  assert.equal(due?.route, "/articles/due/");
});

test("scheduled release hooks are restricted to Cloudflare HTTPS endpoints", () => {
  assert.doesNotThrow(() =>
    validateDeployHookUrl(
      "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/example",
    ),
  );
  assert.throws(() => validateDeployHookUrl("http://api.cloudflare.com/example"));
  assert.throws(() => validateDeployHookUrl("https://example.com/hook"));
});
