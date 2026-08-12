import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/the-model-is-free.mdx";
const predecessorPath = "src/content/articles/same-same-but-different.mdx";
const manifestPath = "reports/the-model-is-free/asset-manifest.json";

function field(source, name) {
  return source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim();
}

function articleWordCount(source) {
  const body = source.split(/^---$/m).slice(2).join("\n");
  const prose = body.split(/^## Source notes and publication receipts$/m)[0];
  const plain = prose
    .replace(/^import .+$/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\[\^[^\]]+\]/g, " ")
    .replace(/[#*_`>]/g, " ");
  return plain.split(/\s+/).filter(Boolean).length;
}

test("article is dated exactly 24 hours after Same Same, But Different", async () => {
  const [article, predecessor] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(predecessorPath, "utf8"),
  ]);

  const predecessorTimestamp = field(predecessor, "publishedAt");
  const articleTimestamp = field(article, "publishedAt");
  assert.equal(predecessorTimestamp, "2026-08-12T16:20:00-07:00");
  assert.equal(articleTimestamp, "2026-08-13T16:20:00-07:00");
  assert.equal(
    Date.parse(articleTimestamp) - Date.parse(predecessorTimestamp),
    24 * 60 * 60 * 1000,
  );
  assert.equal(field(article, "pubDate"), "2026-08-13");
  assert.equal(field(article, "canonical"), '"/articles/the-model-is-free/"');
  assert.equal(field(article, "draft"), "false");
  assert.ok(["scheduled", "published"].includes(field(article, "status")));
});

test("article keeps the requested argument, evidence limits, and editorial links", async () => {
  const article = await readFile(articlePath, "utf8");

  assert.match(article, /Hardware and service state recorded August 6, 2026/);
  assert.match(article, /Open weights democratize permission\. Affordable compute democratizes access\./);
  assert.match(article, /Rent the GPU\. Own the workflow\./);
  assert.match(article, /The machine did not get slower\. The workload moved\./);
  assert.match(article, /Affordability includes replacement\./);
  assert.match(article, /A break-even chart without my actual jobs/);
  assert.match(article, /This is a vendor technical demonstration/);
  assert.doesNotMatch(article, /—/);
  assert.equal(article.match(/<ArticleDiagram kind=/g)?.length, 5);
  assert.equal(article.match(/<FeedScreenshot \/>/g)?.length, 1);

  for (const href of [
    "/articles/same-same-but-different/",
    "/articles/you-do-not-own-the-ai-you-pay-for/",
    "/articles/too-big-for-the-box/",
    "/articles/everything-is-still-loading/",
  ]) {
    assert.ok(article.includes(`](${href})`), `Missing required link ${href}`);
  }

  const words = articleWordCount(article);
  assert.ok(words >= 1700 && words <= 2500, `Article word count ${words} is outside the brief.`);
});

test("publication assets match the manifest and retain editable sources", async () => {
  const manifest = await readFile(manifestPath, "utf8").then(JSON.parse);

  assert.equal(manifest.article_slug, "the-model-is-free");
  assert.equal(manifest.scheduled_publication, "2026-08-13T16:20:00-07:00");
  assert.equal(manifest.predecessor_publication, "2026-08-12T16:20:00-07:00");
  assert.equal(manifest.schedule_difference_seconds, 86400);
  assert.equal(manifest.assets.length, 8);
  assert.deepEqual(manifest.policy.allowed_prefixes, ["articles/the-model-is-free/"]);
  assert.equal(manifest.policy.overwrite_existing, false);

  for (const asset of manifest.assets) {
    const bytes = await readFile(asset.source_file);
    assert.equal(bytes.length, asset.bytes, `${asset.asset_id} byte count changed`);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      asset.sha256,
      `${asset.asset_id} checksum changed`,
    );
  }

  const diagrams = manifest.assets.filter((asset) => asset.content_type === "image/svg+xml");
  assert.equal(diagrams.length, 5);
  for (const asset of diagrams) {
    const svg = await readFile(asset.source_file, "utf8");
    assert.match(svg, /<title(?:\s[^>]*)?>/, `${asset.asset_id} needs an SVG title`);
    assert.match(svg, /<desc(?:\s[^>]*)?>/, `${asset.asset_id} needs an SVG description`);
    assert.doesNotMatch(svg, /WORKING DIAGRAM/);
  }

  await Promise.all([
    readFile("_cdn/articles/the-model-is-free/source/the-model-is-free-hero-master.png"),
    readFile("_cdn/articles/the-model-is-free/source/a16z-open-weights-feed-original.png"),
  ]);
});

test("article media components expose full-size files and text alternatives", async () => {
  const [diagrams, screenshot] = await Promise.all([
    readFile("src/components/articles/the-model-is-free/ArticleDiagram.astro", "utf8"),
    readFile("src/components/articles/the-model-is-free/FeedScreenshot.astro", "utf8"),
  ]);

  assert.match(diagrams, /Read this diagram as text/);
  assert.match(diagrams, /Open the editable SVG/);
  assert.match(diagrams, /width="1600" height="1000"/);
  assert.match(screenshot, /data-lightbox/);
  assert.match(screenshot, /captured August 6, 2026/);
  assert.match(screenshot, /width="596"/);
});
