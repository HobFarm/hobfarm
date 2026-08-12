import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Trash Mountain is complete and published in the requested August 11 slot", async () => {
  const [article, data, timeline, proof, mechanism, ledger] = await Promise.all([
    read("src/content/articles/trash-mountain.mdx"),
    read("src/data/trash-mountain.ts"),
    read("src/components/articles/trash-mountain/SatelliteTimeline.astro"),
    read("src/components/articles/trash-mountain/BeforeAfterProof.astro"),
    read("src/components/articles/trash-mountain/WasteSlopeMechanism.astro"),
    read("src/components/articles/trash-mountain/CaseLedger.astro"),
  ]);

  assert.match(article, /pubDate: 2026-08-11/);
  assert.match(article, /publishedAt: 2026-08-11T16:20:00-07:00/);
  assert.match(article, /status: published/);
  assert.match(article, /draft: false/);
  assert.match(article, /canonical: "\/articles\/trash-mountain\/"/);
  for (let index = 1; index <= 11; index += 1) {
    assert.match(`${article}\n${data}`, new RegExp(`trash-${String(index).padStart(3, "0")}-`));
  }

  for (const date of ["2000-10-20", "2007-02-10", "2015-01-16", "2019-05-06", "2020-10-29", "2025-02-25"]) {
    assert.match(timeline, new RegExp(date));
  }

  assert.match(proof, /conakry-020-homes-before-2019-05-06\.png/);
  assert.match(proof, /conakry-021-homes-after-2019-12-06\.png/);
  assert.match(article, /conakry-022-southern-edge-2025-02-25\.png/);
  assert.match(mechanism, /leachate rises/);
  assert.match(mechanism, /curved failure surface/);
  assert.match(ledger, /fatalWasteSlopeEvents\.map/);

  const eventIds = data.match(/id: "E\d{2}"/g) ?? [];
  assert.equal(eventIds.length, 22);
  assert.match(data, /1 official \/ 3 in later technical reporting/);
  assert.match(data, /28 in the latest strong missing-person update located/);
});

test("Trash Mountain media manifest is non-overwriting and excludes the unlicensed reference image", async () => {
  const [article, manifestText] = await Promise.all([
    read("src/content/articles/trash-mountain.mdx"),
    read("reports/trash-mountain/asset-manifest.json"),
  ]);
  const manifest = JSON.parse(manifestText);

  assert.equal(manifest.article_slug, "trash-mountain");
  assert.equal(manifest.policy.new_keys_only, true);
  assert.equal(manifest.policy.overwrite_existing, false);
  assert.deepEqual(manifest.policy.allowed_prefixes, ["articles/trash-mountain/"]);
  assert.equal(manifest.assets.length, 37);
  assert.equal(manifest.excluded_assets.length, 1);
  assert.equal(manifest.excluded_assets[0].asset_id, "R01");
  assert.equal(manifest.assets.some((asset) => asset.asset_id === "R01"), false);
  assert.doesNotMatch(article, /guineematin-reference-only\.png/);

  const googleAssets = manifest.assets.filter((asset) => asset.asset_id.startsWith("G"));
  assert.equal(googleAssets.length, 16);
  assert.ok(googleAssets.every((asset) => asset.destination_key.startsWith("articles/trash-mountain/google-earth/")));

  const ownedAssets = manifest.assets.filter((asset) => asset.asset_id.startsWith("U"));
  assert.equal(ownedAssets.length, 11);
  assert.ok(ownedAssets.every((asset) => asset.credit === "HobFarm / user"));
});
