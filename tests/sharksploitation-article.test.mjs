import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/sharksploitation.mdx";
const hermitPath =
  "src/content/articles/hermit-does-not-have-to-pay-for-repairs.mdx";
const workflowPath = ".github/workflows/publish-sharksploitation.yml";
const scriptPath = "scripts/publish-scheduled-sharksploitation.mjs";
const manifestPath = "reports/sharksploitation/asset-manifest.json";
const seedsPath = "reports/sharksploitation/future-article-seeds.json";

const field = (source, name) =>
  source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim();

function articleWordCount(article) {
  const body = article
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^import .*$/gm, "")
    .replace(/^\[\^[^\]]+\]:.*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[\^.*?\]/g, "")
    .replace(/[#*_`>]/g, " ");
  return body.match(/[\p{L}\p{N}][\p{L}\p{N}’'–—-]*/gu)?.length ?? 0;
}

test("Sharksploitation is complete and scheduled 24 hours after Hermit", async () => {
  const [article, hermit, workflow, script] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(hermitPath, "utf8"),
    readFile(workflowPath, "utf8"),
    readFile(scriptPath, "utf8"),
  ]);

  assert.equal(field(article, "pubDate"), "2026-08-07");
  assert.equal(field(article, "publishedAt"), "2026-08-07T16:20:00-07:00");
  assert.equal(field(article, "status"), "scheduled");
  assert.equal(field(article, "draft"), "false");
  assert.equal(
    Date.parse(field(article, "publishedAt")) -
      Date.parse(field(hermit, "publishedAt")),
    24 * 60 * 60 * 1000,
  );
  assert.match(workflow, /cron: "20 23 7 8 \*"/);
  assert.match(workflow, /node scripts\/publish-scheduled-sharksploitation\.mjs/);
  assert.match(script, /2026-08-07T16:20:00-07:00/);
  assert.match(article, /The shark never had to come ashore\./);
  assert.doesNotMatch(article, /contentWarnings|Content note:/i);

  const wordCount = articleWordCount(article);
  assert.ok(wordCount >= 2400 && wordCount <= 3200, `article word count is ${wordCount}`);
});

test("Sharksploitation includes its editorial graphics, sources, and exact embeds", async () => {
  const article = await readFile(articlePath, "utf8");

  assert.match(article, /<SharksploitationCycle \/>/);
  assert.match(article, /<SharksploitationFigure \/>/);
  assert.match(article, /<MondoCaneSequence \/>/);
  assert.match(article, /<ObsessionScale \/>/);
  assert.match(article, /<AtlanticSharkMap \/>/);
  assert.match(article, /youtube-nocookie\.com\/embed\/U1fu_sA7XhE/);
  assert.match(article, /youtube\.com\/watch\?v=KPT6RpqhYTU/);
  assert.match(article, /The production method does the work\./);
});

test("Sharksploitation upload assets exist and document their rights", async () => {
  const [article, manifestSource, seedsSource] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(manifestPath, "utf8"),
    readFile(seedsPath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const seeds = JSON.parse(seedsSource);

  assert.equal(manifest.assets.length, 4);
  assert.equal(manifest.generation.mode, "stylized-concept");
  assert.ok(manifest.generation.exact_prompt);
  assert.equal(seeds.branch_label, "The Exploitation Factory");
  assert.equal(seeds.articles.length, 5);

  for (const asset of manifest.assets) {
    await access(asset.source_file);
    assert.ok(asset.rights_basis);
    assert.equal(asset.upload_status, "ready");
    assert.equal(asset.verification_status, "destination-absent");
  }

  assert.match(article, /sharksploitation-hero\.webp/);
  assert.match(article, /sharksploitation-social-1200x630\.jpg/);
});
