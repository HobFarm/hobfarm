import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/same-same-but-different.mdx";
const matrixPath = "src/data/same-same-but-different-provider-matrix.json";
const manifestPath = "reports/same-same-but-different/asset-manifest.json";

function field(source, name) {
  return source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim();
}

function articleWordCount(source) {
  const body = source.split(/^---$/m).slice(2).join("\n");
  const plain = body
    .replace(/^import .+$/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_`>]/g, " ");
  return plain.split(/\s+/).filter(Boolean).length;
}

test("article preserves the August 6 time capsule and August 12 release metadata", async () => {
  const article = await readFile(articlePath, "utf8");

  const status = field(article, "status");
  assert.equal(field(article, "pubDate"), "2026-08-12");
  assert.equal(field(article, "publishedAt"), "2026-08-12T16:20:00-07:00");
  assert.equal(field(article, "canonical"), '"/articles/same-same-but-different/"');
  assert.equal(field(article, "draft"), "false");
  assert.ok(["scheduled", "published"].includes(status));
  assert.match(article, /System state recorded August 6, 2026/);
});

test("article keeps the requested argument, receipts, links, and evidence limits", async () => {
  const article = await readFile(articlePath, "utf8");

  assert.match(article, /unfollowing anyone promoting Higgsfield[\s\S]*respect your followers, don't sell your ass/);
  assert.match(article, /A model benchmark tests an endpoint under selected conditions/);
  assert.match(article, /A platform evaluation tests the endpoint plus wrapper/);
  assert.match(article, /A production audit asks whether the whole arrangement produced something I could use/);
  assert.match(article, /No platform won outside a job/);
  assert.doesNotMatch(article, /anonymous-partner-receipt|maerik-receipt/i);
  assert.doesNotMatch(article, /benefit-bearing partner program/i);
  assert.doesNotMatch(article, /—/);
  assert.match(article, /they cannot prompt the elf out of Maeric/);
  assert.match(article, /Mara is different/);
  assert.match(article, /Some traits are baked into the model's associations/);
  assert.match(article, /StyleFusionReceipt/);
  assert.match(article, /ProviderMatrix/);
  assert.equal(article.match(/<ArticleDiagram kind=/g)?.length, 6);

  for (const href of [
    "/articles/invisible-variable/",
    "/articles/same-model-different-surface/",
    "/articles/goth-get-boots/",
    "/articles/i-could-be-playing-civilization/",
    "/articles/hello-world/",
    "/articles/how-to-fix-slop/",
    "/articles/you-do-not-own-the-ai-you-pay-for/",
    "/articles/too-big-for-the-box/",
  ]) {
    assert.ok(article.includes(`](${href})`), `Missing required link ${href}`);
  }

  const words = articleWordCount(article);
  assert.ok(words >= 5200 && words <= 7000, `Article word count ${words} is outside the brief.`);
});

test("provider matrix contains all 45 dated entries and a no-script-readable renderer", async () => {
  const [matrix, component] = await Promise.all([
    readFile(matrixPath, "utf8").then(JSON.parse),
    readFile("src/components/articles/same-same-but-different/ProviderMatrix.astro", "utf8"),
  ]);

  assert.equal(matrix.snapshot_date, "2026-08-06");
  assert.equal(matrix.verified_at, "2026-08-06");
  assert.equal(matrix.publish_date, "2026-08-12");
  assert.equal(matrix.provider_count, 45);
  assert.equal(matrix.providers.length, 45);
  assert.equal(new Set(matrix.providers.map((entry) => entry.provider_or_service)).size, 45);
  assert.ok(matrix.providers.every((entry) => entry.checked_at === "2026-08-06"));
  assert.ok(matrix.providers.every((entry) =>
    entry.official_sources.startsWith("https://") ||
    entry.provider_or_service === "HyperFrames (HobFarm stack)"
  ));
  assert.match(component, /data-provider-search/);
  assert.match(component, /data-provider-filter/);
  assert.match(component, /<details/);
  assert.match(component, /<noscript>/);
});

test("publication assets and editable diagrams match the local manifest", async () => {
  const manifest = await readFile(manifestPath, "utf8").then(JSON.parse);

  assert.equal(manifest.delivery, "repository-local");
  assert.equal(manifest.r2_objects_added, 0);
  assert.equal(manifest.assets.length, 11);

  for (const asset of manifest.assets) {
    const bytes = await readFile(asset.path);
    assert.equal(bytes.length, asset.bytes, `${asset.id} byte count changed`);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      asset.sha256,
      `${asset.id} checksum changed`,
    );
  }

  for (const asset of manifest.assets.filter((entry) => entry.mime === "image/svg+xml")) {
    const svg = await readFile(asset.path, "utf8");
    assert.match(svg, /<title(?:\s[^>]*)?>/, `${asset.id} needs an SVG title`);
    assert.match(svg, /<desc(?:\s[^>]*)?>/, `${asset.id} needs an SVG description`);
  }
});

test("StyleFusion receipt is summarized without publishing the private export", async () => {
  const [receipt, component] = await Promise.all([
    readFile("reports/same-same-but-different/stylefusion-receipt.md", "utf8"),
    readFile("src/components/articles/same-same-but-different/StyleFusionReceipt.astro", "utf8"),
  ]);

  assert.match(receipt, /dff33f4757a801b2938c2416a39d8222c43300665a69e14d5ffbcc68a0637479/);
  assert.match(receipt, /records no generated outputs/i);
  assert.match(component, /records zero generation runs/i);
  assert.match(component, /subject, style and composition/);
  await assert.rejects(readFile("public/articles/same-same-but-different/psygoth-room1.stylefusion.md"));
});
