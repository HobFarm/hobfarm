import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/before-wavy-gravy-was-ice-cream.mdx";
const componentRoot = "src/components/articles/wavy-gravy";

function field(source, name) {
  const match = source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"));
  assert.ok(match, `${name} is missing.`);
  return match[1].trim();
}

function articleWordCount(source) {
  const body = source.replace(/^---[\s\S]*?---/, "").replace(/<[^>]+>/g, " ");
  return body.split(/\s+/).filter(Boolean).length;
}

test("article uses the requested title and the queued slot after Wetlands", async () => {
  const [article, predecessor, names] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile("src/content/articles/from-wetlands-to-the-wash.mdx", "utf8"),
    readdir("src/content/articles"),
  ]);

  assert.equal(field(article, "title"), '"Before Wavy Gravy Was Ice Cream"');
  assert.equal(field(article, "canonical"), '"/articles/before-wavy-gravy-was-ice-cream/"');
  assert.equal(field(article, "pubDate"), "2026-08-18");
  assert.equal(field(article, "publishedAt"), "2026-08-18T16:20:00-07:00");
  assert.equal(field(article, "status"), "scheduled");
  assert.equal(
    Date.parse(field(article, "publishedAt")) - Date.parse(field(predecessor, "publishedAt")),
    24 * 60 * 60 * 1000,
  );

  const collisions = [];
  for (const name of names.filter((name) => /\.mdx?$/.test(name))) {
    if (name === "before-wavy-gravy-was-ice-cream.mdx") continue;
    const source = await readFile(`src/content/articles/${name}`, "utf8");
    if (/^publishedAt:\s*2026-08-18T16:20:00-07:00$/m.test(source)) collisions.push(name);
  }
  assert.deepEqual(collisions, []);

  const words = articleWordCount(article);
  assert.ok(words >= 4000 && words <= 7000, `Article word count ${words} is outside the feature brief.`);
  assert.doesNotMatch(article, /—/);
  assert.doesNotMatch(article, /photographs? (?:were |was )?(?:taken )?(?:in )?201[23]/i);
  assert.match(article, /early 2010s/);
  assert.match(article, /Before Wavy Gravy was a retired ice cream flavor/);
  assert.match(article, /Wavy Gravy\*\* was explicitly named for Hugh Romney's Wavy Gravy persona/);
  assert.match(article, /Cherry Garcia[\s\S]*Phish Food[\s\S]*Bonnaroo Buzz/);
});

test("multimedia uses owned assets, live-text graphics, and official fallbacks", async () => {
  const [article, pbs, spotify, archive, headers, manifestSource, manifest] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(`${componentRoot}/WavyPbsPlayer.astro`, "utf8"),
    readFile(`${componentRoot}/WavySpotifyCard.astro`, "utf8"),
    readFile(`${componentRoot}/ArchiveRecordShelf.astro`, "utf8"),
    readFile("public/_headers", "utf8"),
    readFile("reports/wavy-gravy/asset-manifest.json", "utf8"),
    readFile("reports/wavy-gravy/asset-manifest.json", "utf8").then(JSON.parse),
  ]);

  for (const component of [
    "BeforeLabelTimeline",
    "SceneNetwork",
    "PleaseForceLoop",
    "WorkContinues",
    "WavyImagePair",
    "WavyPbsPlayer",
    "WavySpotifyCard",
    "ArchiveRecordShelf",
  ]) {
    assert.match(article, new RegExp(`<${component}`), `${component} is not used.`);
  }

  assert.match(pbs, /player\.pbs\.org\/viralplayer\/3031061174/);
  assert.match(pbs, /data-player-load/);
  assert.doesNotMatch(pbs, /autoplay/);
  assert.match(headers, /img-src[^;\n]*https:\/\/image\.pbs\.org/);
  assert.match(headers, /frame-src[^;\n]*https:\/\/player\.pbs\.org/);
  assert.match(spotify, /open\.spotify\.com\/track\/5b2Zf1kc0M7KNfCnBV4vWO/);
  assert.doesNotMatch(spotify, /<iframe/);
  assert.match(archive, /reuse notices require more clearance/);
  assert.doesNotMatch(archive, /<img/);

  assert.equal(manifest.assets.length, 4);
  assert.equal(manifest.policy.new_keys_only, true);
  assert.equal(manifest.policy.overwrite_existing, false);
  assert.deepEqual(manifest.policy.allowed_prefixes, ["articles/wavy-gravy/"]);
  assert.ok(manifest.assets.every((asset) => asset.upload_status === "uploaded"));
  assert.ok(manifest.assets.every((asset) => asset.verification_status === "verified"));
  assert.match(article, /before-wavy-gravy-was-ice-cream-hero-v2\.webp/);
  assert.match(article, /before-wavy-gravy-was-ice-cream-social-v2\.webp/);
  assert.match(manifestSource, /f56dc39f9e9e8572cedc7304486448de09cb2eed9dc48c27beb500c9126246ca/);
  assert.match(manifestSource, /f1a9c49328e8f151eb2c2401c5afef8baf14dbd2bcdf500f2d6ac69048c040f1/);
  assert.match(manifestSource, /de7d21c23375f3d672261ee458ad8816a369a2c534a5a342d088b5c48f5d9b34/);
});

test("one-time publisher protects the exact August 18 release", async () => {
  const [scheduler, workflow] = await Promise.all([
    readFile("scripts/publish-scheduled-before-wavy-gravy-was-ice-cream.mjs", "utf8"),
    readFile(".github/workflows/publish-before-wavy-gravy-was-ice-cream.yml", "utf8"),
  ]);

  assert.match(scheduler, /expectedPublication = "2026-08-18T16:20:00-07:00"/);
  assert.match(scheduler, /Date\.now\(\) < Date\.parse\(expectedPublication\)/);
  assert.match(workflow, /cron: "20 23 18 8 \*"/);
  assert.match(workflow, /node scripts\/publish-scheduled-before-wavy-gravy-was-ice-cream\.mjs/);
  assert.match(workflow, /git rm \.github\/workflows\/publish-before-wavy-gravy-was-ice-cream\.yml/);
});

test("article preserves uncertainty and the supplied editorial boundaries", async () => {
  const article = await readFile(articlePath, "utf8");

  assert.match(article, /At least, that is how Hugh told it\./);
  assert.match(article, /The story is a recollection, not a recording of the exchange\./);
  assert.match(article, /Camp's official history dates its founding to 1975/);
  assert.match(article, /Wavy's own current biography says 1979/);
  assert.match(article, /It is tempting to call this harm reduction/);
  assert.match(article, /not operating from a current clinical protocol/);
  assert.match(article, /There is no direct lineage/);
  assert.doesNotMatch(article, /HobFarm (?:is|was) named after (?:the )?Hog Farm/i);
  assert.doesNotMatch(article, /synthetic portrait|historical recreation|AI reconstruction/i);
});
