import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/songs-we-learned-backwards.mdx";
const componentRoot = "src/components/articles/songs-we-learned-backwards";

function field(source, name) {
  const match = source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"));
  assert.ok(match, `${name} is missing.`);
  return match[1].trim();
}

function articleWordCount(source) {
  const body = source
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^import .+;$/gm, "")
    .replace(/<[^>]+>/g, " ");
  return body.split(/\s+/).filter(Boolean).length;
}

test("Songs We Learned Backwards owns the August 19 publication slot", async () => {
  const [article, predecessor, names] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile("src/content/articles/before-wavy-gravy-was-ice-cream.mdx", "utf8"),
    readdir("src/content/articles"),
  ]);

  assert.equal(field(article, "title"), '"Songs We Learned Backwards"');
  assert.equal(field(article, "canonical"), '"/articles/songs-we-learned-backwards/"');
  assert.equal(field(article, "pubDate"), "2026-08-19");
  assert.equal(field(article, "publishedAt"), "2026-08-19T16:20:00-07:00");
  assert.equal(field(article, "status"), "scheduled");
  assert.equal(new Date(field(article, "publishedAt")).getUTCDay(), 3);
  assert.equal(
    Date.parse(field(article, "publishedAt")) - Date.parse(field(predecessor, "publishedAt")),
    24 * 60 * 60 * 1000,
  );

  const collisions = [];
  for (const name of names.filter((name) => /\.mdx?$/.test(name))) {
    if (name === "songs-we-learned-backwards.mdx") continue;
    const source = await readFile(`src/content/articles/${name}`, "utf8");
    if (/^publishedAt:\s*2026-08-19T16:20:00-07:00$/m.test(source)) collisions.push(name);
  }
  assert.deepEqual(collisions, []);
});

test("the article keeps the four listening pairs bounded, sourced, and lightweight", async () => {
  const [article, card, chronologies, discovery] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(`${componentRoot}/ListeningPair.astro`, "utf8"),
    readFile(`${componentRoot}/TwoChronologies.astro`, "utf8"),
    readFile(`${componentRoot}/DiscoveryLoop.astro`, "utf8"),
  ]);

  assert.equal((article.match(/<ListeningPair/g) ?? []).length, 4);
  for (const expected of [
    "Eugene McDaniels",
    "Beastie Boys featuring Q-Tip",
    "Quincy Jones",
    "The Pharcyde",
    "Labi Siffre",
    "Eminem",
    "Bob James",
    "Run-DMC",
  ]) {
    assert.match(article, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(article, /interpolation/);
  assert.match(article, /replayed for the new recording/);
  assert.match(article, /one layer in a production built from several records/);
  assert.match(article, /<TwoChronologies \/>/);
  assert.match(article, /<DiscoveryLoop \/>/);
  assert.match(chronologies, /Historical time/);
  assert.match(chronologies, /Personal listening time/);
  assert.match(discovery, /The discovery loop/);
  assert.doesNotMatch(card, /<iframe|autoplay/i);
  assert.match(card, /target="_blank"/);
  assert.match(card, /focus-visible/);
});

test("the article preserves the personal argument, internal paths, and editorial boundaries", async () => {
  const article = await readFile(articlePath, "utf8");
  const words = articleWordCount(article);

  assert.ok(words >= 1800 && words <= 3000, `Article word count ${words} is outside the feature brief.`);
  assert.match(article, /I had heard it before/);
  assert.match(article, /My memory does not/);
  assert.match(article, /I ran lights for the Pharcyde/);
  assert.match(article, /I stage-managed Rakim and DJ Jazzy Jeff/);
  assert.match(article, /\/articles\/the-number-one-song-ive-never-heard\//);
  assert.match(article, /\/articles\/i-want-my-mtv\//);
  assert.match(article, /\/articles\/from-wetlands-to-the-wash\//);
  assert.doesNotMatch(article, /—/);
  assert.doesNotMatch(article, /\bTikTok\b/);
  assert.doesNotMatch(article, /\bstole\b/i);
  assert.doesNotMatch(article, /Draft receipt|\[HERO|\[FIGURE|\[INTERNAL LINK/);
});

test("the one-time publisher protects the exact August 19 release", async () => {
  const [scheduler, workflow] = await Promise.all([
    readFile("scripts/publish-scheduled-songs-we-learned-backwards.mjs", "utf8"),
    readFile(".github/workflows/publish-songs-we-learned-backwards.yml", "utf8"),
  ]);

  assert.match(scheduler, /expectedPublication = "2026-08-19T16:20:00-07:00"/);
  assert.match(scheduler, /Date\.now\(\) < Date\.parse\(expectedPublication\)/);
  assert.match(workflow, /cron: "20 23 19 8 \*"/);
  assert.match(workflow, /node scripts\/publish-scheduled-songs-we-learned-backwards\.mjs/);
  assert.match(workflow, /git rm \.github\/workflows\/publish-songs-we-learned-backwards\.yml/);
});

test("the supplied hero and social crop are verified immutable R2 objects", async () => {
  const [article, manifest] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile("reports/songs-we-learned-backwards/asset-manifest.json", "utf8").then(JSON.parse),
  ]);

  assert.match(article, /songs-we-learned-backwards-hero-v1\.webp/);
  assert.match(article, /songs-we-learned-backwards-social-v1\.webp/);
  assert.match(article, /^heroAlt:\s*"Vintage collage/m);
  assert.equal(manifest.article_slug, "songs-we-learned-backwards");
  assert.equal(manifest.policy.new_keys_only, true);
  assert.equal(manifest.policy.overwrite_existing, false);
  assert.deepEqual(manifest.policy.allowed_prefixes, ["articles/songs-we-learned-backwards/"]);
  assert.equal(manifest.source_originals[0].sha256, "98b037373f5772c97f564d85c0bc9bbe9cddd430c863e9018180db9cc12b5abe");
  assert.equal(manifest.assets.length, 2);
  assert.ok(manifest.assets.every((asset) => asset.upload_status === "uploaded"));
  assert.ok(manifest.assets.every((asset) => asset.verification_status === "verified"));
  assert.ok(manifest.assets.every((asset) => asset.remote_sha256 === asset.sha256));
  assert.ok(manifest.assets.every((asset) => asset.public_response_sha256 === asset.sha256));
});
