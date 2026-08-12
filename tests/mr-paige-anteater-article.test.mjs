import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const articlePath =
  "src/content/articles/mr-paige-theres-an-anteater-behind-you.mdx";
const manifestPath =
  "reports/mr-paige-theres-an-anteater-behind-you/asset-manifest.json";

const field = (source, name) =>
  source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim();

function articleWordCount(article) {
  const body = article
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^import .*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>]/g, " ");
  return body.match(/[\p{L}\p{N}][\p{L}\p{N}’'–—-]*/gu)?.length ?? 0;
}

test("Mr. Paige published on August 9 with durable release metadata", async () => {
  const article = await readFile(articlePath, "utf8");

  assert.equal(field(article, "pubDate"), "2026-08-09");
  assert.equal(field(article, "publishedAt"), "2026-08-09T16:20:00-07:00");
  assert.equal(field(article, "status"), "published");
  assert.equal(field(article, "draft"), "false");
  assert.equal(field(article, "department"), "magazine-time-machine");
  assert.equal(field(article, "format"), "article");

  const wordCount = articleWordCount(article);
  assert.ok(wordCount >= 4500 && wordCount <= 7500, `article word count is ${wordCount}`);
});

test("the visual essay preserves the verified route and rights boundary", async () => {
  const article = await readFile(articlePath, "utf8");

  assert.match(article, /Mr\. Paige, there’s an anteater behind you/);
  assert.match(article, /deoxyribonucleic acid/);
  assert.match(article, /<MrPaigeVideoEmbed/);
  assert.match(article, /videoId="fWRqEBsVeSE"/);
  assert.match(article, /dali-anteater-paris-1969\.jpg/);
  assert.match(article, /Photographer unknown/);
  assert.match(article, /<MorphologyGraphic \/>/);
  assert.match(article, /<ImageFirstGraphic \/>/);
  assert.match(article, /<MrPaigeTimeline \/>/);
  assert.match(article, /<ArtworkRecords group="early" \/>/);
  assert.match(article, /The supplied scans were used for research but are not reproduced here/);
  assert.doesNotMatch(article, /official clips overlap/i);
  assert.doesNotMatch(article, /[A-Z]:\\|\.github\/workflows|src\/content|asset-manifest/i);
});

test("article assets and production records exist", async () => {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  assert.equal(manifest.assets.length, 4);
  assert.equal(manifest.embeds[0].video_id, "fWRqEBsVeSE");
  assert.equal(manifest.generation.mode, "historical-scene");
  assert.ok(manifest.generation.exact_prompt);

  for (const asset of manifest.assets) {
    await access(asset.source_file);
    assert.ok(asset.width > 0);
    assert.ok(asset.height > 0);
    assert.ok(asset.rights_basis);
  }
});
