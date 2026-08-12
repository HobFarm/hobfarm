import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/the-number-one-song-ive-never-heard.mdx";

function field(source, name) {
  return source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim();
}

function articleWordCount(source) {
  const body = source.split(/^---$/m).slice(2).join("\n");
  const plain = body
    .replace(/^import .+$/gm, " ")
    .replace(/^\[\^[^\]]+\]:.*$/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_`>]/g, " ");
  return plain.split(/\s+/).filter(Boolean).length;
}

test("article uses the fixed route, release metadata, and updated draft", async () => {
  const article = await readFile(articlePath, "utf8");

  assert.equal(field(article, "pubDate"), "2026-08-13");
  assert.equal(field(article, "publishedAt"), "2026-08-13T16:19:00-07:00");
  assert.ok(["scheduled", "published"].includes(field(article, "status")));
  assert.equal(field(article, "draft"), "false");
  assert.equal(field(article, "canonical"), '"/articles/the-number-one-song-ive-never-heard/"');
  assert.match(article, /Another random Spotify video playlist handed me Salvatore Ganacci’s “Horse.”/);
  assert.match(article, /Sissy Spacek and David Strathairn disappeared through a portal/);
  assert.match(article, /many people said they had never heard|enough people said the same thing/i);
  assert.match(article, /does not claim (?:that )?nobody knew it/i);
  assert.doesNotMatch(article, /—/);

  const words = articleWordCount(article);
  assert.ok(words >= 1800 && words <= 2500, `Article word count ${words} is outside the brief.`);
});

test("article includes the requested receipts and accessible visual systems", async () => {
  const [article, wall, trails, videos, palace, nirvana] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile("src/components/articles/the-number-one-song/SixtySixWall.astro", "utf8"),
    readFile("src/components/articles/the-number-one-song/DiscoveryTrails.astro", "utf8"),
    readFile("src/components/articles/the-number-one-song/VideoTrailGrid.astro", "utf8"),
    readFile("src/components/articles/the-number-one-song/SpotifyReceipt.astro", "utf8"),
    readFile("src/components/articles/the-number-one-song/NirvanaTotpFigure.astro", "utf8"),
  ]);

  for (const component of ["SpotifyReceipt", "SixtySixWall", "DeliverySystems", "DiscoveryTrails", "NirvanaTotpFigure", "VideoTrailGrid"]) {
    assert.match(article, new RegExp(`<${component}`));
  }

  assert.equal((wall.match(/title: "/g) ?? []).length, 15);
  assert.ok((wall.match(/officialcharts\.com/g) ?? []).length >= 15);
  assert.match(wall, /double A-side chart entry/);
  assert.match(trails, /aria-label/);
  assert.match(videos, /data-lazy-video/);
  assert.equal((videos.match(/videoId: "/g) ?? []).length, 5);
  assert.doesNotMatch(videos, /<iframe/);
  assert.match(videos, /Five doors in the trail/);
  assert.match(nirvana, /nirvana-top-of-the-pops-1991\.webp/);
  assert.match(nirvana, /6s4KXiXVFAI/);
  assert.match(nirvana, /official release archive/);
  assert.match(palace, /width: 645/);
  assert.match(palace, /width: 776/);
});

test("publication metadata preserves exact release order around the August 13 collision", async () => {
  const [article, predecessor, following, articleLib] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile("src/content/articles/same-same-but-different.mdx", "utf8"),
    readFile("src/content/articles/the-model-is-free.mdx", "utf8"),
    readFile("src/lib/articles.ts", "utf8"),
  ]);

  const release = Date.parse(field(article, "publishedAt"));
  assert.ok(Date.parse(field(predecessor, "publishedAt")) < release);
  assert.ok(release < Date.parse(field(following, "publishedAt")));
  assert.match(articleLib, /data\.publishedAt \?\? data\.pubDate/);
});

test("five article assets are recorded as verified immutable R2 objects", async () => {
  const manifest = await readFile(
    "reports/the-number-one-song-ive-never-heard/asset-manifest.json",
    "utf8",
  ).then(JSON.parse);

  assert.equal(manifest.bucket, "hobfarm-cdn");
  assert.equal(manifest.policy.new_keys_only, true);
  assert.equal(manifest.policy.overwrite_existing, false);
  assert.equal(manifest.generation.calls, 1);
  assert.equal(manifest.assets.length, 5);
  assert.ok(manifest.assets.every((asset) => asset.upload_status === "uploaded"));
  assert.ok(manifest.assets.every((asset) => asset.verification_status === "verified"));
  assert.ok(manifest.assets.every((asset) => asset.remote_sha256 === asset.sha256));
  assert.ok(manifest.assets.every((asset) => asset.verified_cache_control?.includes("immutable")));
});
