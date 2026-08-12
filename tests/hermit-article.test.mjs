import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const articlePath =
  "src/content/articles/hermit-does-not-have-to-pay-for-repairs.mdx";
const assetManifestPath = "reports/hermit/asset-manifest.json";
const sourcesPath = "reports/hermit/sources.json";

const field = (source, name) =>
  source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim();

function articleWordCount(article) {
  const body = article
    .split("## Sources and further viewing")[0]
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^import .*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[\^.*?\]/g, "")
    .replace(/[#*_`>]/g, " ");
  return body.match(/[\p{L}\p{N}][\p{L}\p{N}’'–—-]*/gu)?.length ?? 0;
}

test("Hermit article is complete and published on August 6 at 4:20 p.m. Pacific", async () => {
  const article = await readFile(articlePath, "utf8");

  assert.equal(field(article, "pubDate"), "2026-08-06");
  assert.equal(field(article, "publishedAt"), "2026-08-06T16:20:00-07:00");
  assert.equal(field(article, "status"), "published");
  assert.equal(field(article, "draft"), "false");
  assert.match(article, /yesterday’s article about the American Dream/);
  assert.match(article, /\/articles\/fear-and-loathing-after-the-american-dream\//);
  assert.match(article, /## Sources and further viewing/);

  const wordCount = articleWordCount(article);
  assert.ok(wordCount >= 1600 && wordCount <= 2200, `article word count is ${wordCount}`);
});

test("Hermit article includes the evidence graphics and exact video embeds", async () => {
  const article = await readFile(articlePath, "utf8");

  assert.match(article, /<HermitTimeline \/>/);
  assert.match(article, /<SurvivalSupplyChain \/>/);
  assert.match(article, /<RoadRepairChain \/>/);
  assert.match(article, /youtube-nocookie\.com\/embed\/494SoD2zh2U/);
  assert.match(article, /youtube-nocookie\.com\/embed\/UZQdYvVXaug/);
  assert.doesNotMatch(article, /North Woods hermit/i);
  assert.doesNotMatch(article, /believed (?:that )?the war (?:was|had not) ended/i);
  assert.doesNotMatch(article, /wikipedia\.org\/wiki\/(?:Shōichi_Yokoi|Hiroo_Onoda)/i);
  assert.doesNotMatch(article, /src=["'][^"']*(?:Getty|Associated Press|\bAP\b)/i);
});

test("Hermit article local assets exist and have documented rights", async () => {
  const [article, assetManifestSource, sourcesSource] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(assetManifestPath, "utf8"),
    readFile(sourcesPath, "utf8"),
  ]);
  const manifest = JSON.parse(assetManifestSource);
  const sources = JSON.parse(sourcesSource);

  assert.equal(manifest.assets.length, 3);
  assert.equal(sources.assets.length, 4);
  assert.equal(sources.excluded_sources.length, 1);

  for (const asset of manifest.assets) {
    await access(asset.source_file);
    assert.match(article, new RegExp(asset.destination_key.split("/").at(-1).replaceAll(".", "\\.")));
    assert.ok(asset.rights_basis);
    assert.equal(asset.upload_status, "ready");
    assert.equal(asset.verification_status, "destination-absent");
  }

  for (const source of sources.assets) {
    assert.ok(source.source_url);
    assert.ok(source.license);
    assert.ok(source.required_attribution);
  }
});
