import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/the-automobile-has-no-family-tree.mdx";

function field(source, name) {
  const match = source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"));
  assert.ok(match, `${name} is missing.`);
  return match[1].trim();
}

function wordCount(source) {
  return source
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^import .+;$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

test("The Automobile Has No Family Tree follows the van by exactly 24 hours", async () => {
  const [article, van] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile("src/content/articles/the-cursed-chevy-part-1.mdx", "utf8"),
  ]);

  assert.equal(field(article, "canonical"), '"/articles/the-automobile-has-no-family-tree/"');
  assert.equal(field(article, "publishedAt"), "2026-09-01T16:20:00-07:00");
  assert.equal(field(article, "status"), "scheduled");
  assert.equal(
    Date.parse(field(article, "publishedAt")) - Date.parse(field(van, "publishedAt")),
    24 * 60 * 60 * 1000,
  );
});

test("the article keeps the supplied design argument and strict series boundary", async () => {
  const article = await readFile(articlePath, "utf8");
  const words = wordCount(article);

  assert.ok(words >= 5000 && words <= 8000, `Article word count ${words} is outside the feature brief.`);
  assert.match(article, /section: art-design/);
  assert.match(article, /series: \[\]/);
  assert.doesNotMatch(article, /magazine-time-machine|Magazine Time Machine/);
  assert.match(article, /The first Plymouth Prowler I saw was in 1999/);
  assert.match(article, /The future car is usually an old idea/);
  assert.match(article, /California Used to Race Here/);
  assert.match(article, /<AutomobileNodeMesh \/>/);
  assert.equal((article.match(/<AutomobileSystemDiagram/g) ?? []).length, 8);
  assert.doesNotMatch(article, /\[HERO|\[FIGURE|\[CHECK|\[RECEIPT|notes_for_implementation|production draft/);
  assert.doesNotMatch(article, /—/);
});

test("the selected article media is verified, immutable, and rights-documented", async () => {
  const [manifest, ledger] = await Promise.all([
    readFile("reports/automobile-family-tree/asset-manifest.json", "utf8").then(JSON.parse),
    readFile("reports/automobile-family-tree/rights-ledger.md", "utf8"),
  ]);

  assert.equal(manifest.bucket, "hobfarm-cdn");
  assert.equal(manifest.policy.new_keys_only, true);
  assert.equal(manifest.policy.overwrite_existing, false);
  assert.deepEqual(manifest.policy.allowed_prefixes, ["articles/classic-cars/automobile-family-tree/"]);
  assert.equal(manifest.assets.length, 24);
  assert.ok(manifest.assets.every((asset) => asset.upload_status === "uploaded"));
  assert.ok(manifest.assets.every((asset) => asset.verification_status === "verified"));
  assert.ok(manifest.assets.every((asset) => asset.remote_sha256 === asset.sha256));
  assert.ok(manifest.assets.every((asset) => asset.public_response_sha256 === asset.sha256));
  assert.match(ledger, /Photograph by HobFarm/);
  assert.match(ledger, /Creative Commons Attribution-Share Alike 4\.0/);
  assert.match(ledger, /solar-aircraft-midget-racer-1946-2019/);
});
