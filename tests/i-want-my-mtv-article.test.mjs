import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/i-want-my-mtv.mdx";
const componentRoot = "src/components/articles/i-want-my-mtv";
const assetRoot = "public/images/articles/i-want-my-mtv";

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

test("article preserves the protected route, release slot, and longform brief", async () => {
  const article = await readFile(articlePath, "utf8");

  assert.equal(field(article, "title"), '"I Want My MTV"');
  assert.equal(field(article, "canonical"), '"/articles/i-want-my-mtv/"');
  assert.equal(field(article, "pubDate"), "2026-08-14");
  assert.equal(field(article, "publishedAt"), "2026-08-14T16:20:00-07:00");
  assert.equal(field(article, "status"), "scheduled");
  assert.equal(field(article, "draft"), "false");
  assert.match(article, /MTV did not disappear\. It became raw material\./);
  assert.match(article, /I have not verified which one Spotify is serving/);
  assert.match(article, /rights explanation remains an informed inference/);
  assert.match(article, /participant account/);

  const words = articleWordCount(article);
  assert.ok(words >= 4000 && words <= 6000, `Article word count ${words} is outside the brief.`);
});

test("the one-time publisher protects the next vacant standard slot", async () => {
  const [article, predecessor, scheduler, workflow] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile("src/content/articles/the-model-is-free.mdx", "utf8"),
    readFile("scripts/publish-scheduled-i-want-my-mtv.mjs", "utf8"),
    readFile(".github/workflows/publish-i-want-my-mtv.yml", "utf8"),
  ]);

  const release = Date.parse(field(article, "publishedAt"));
  const priorStandardSlot = Date.parse(field(predecessor, "publishedAt"));
  assert.equal(release - priorStandardSlot, 24 * 60 * 60 * 1000);
  assert.match(scheduler, /expectedPublication = "2026-08-14T16:20:00-07:00"/);
  assert.match(scheduler, /Date\.now\(\) < Date\.parse\(expectedPublication\)/);
  assert.match(scheduler, /status:\\s\*scheduled/);
  assert.match(workflow, /cron: "20 23 14 8 \*"/);
  assert.match(workflow, /git rm \.github\/workflows\/publish-i-want-my-mtv\.yml/);
});

test("the article uses six click-to-load official videos with durable fallbacks", async () => {
  const [article, player] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(`${componentRoot}/MediaWatchCard.astro`, "utf8"),
  ]);

  assert.equal((article.match(/<MediaWatchCard /g) ?? []).length, 6);
  assert.match(player, /youtube-nocookie\.com\/embed/);
  assert.match(player, /Watch on YouTube/);
  assert.match(player, /document\.createElement\("iframe"\)/);
  assert.doesNotMatch(player, /autoplay=1/);
  assert.doesNotMatch(player, /<iframe/);

  for (const id of ["ct-qa6SjRZo", "PE5f561Y1x4", "fregObNcHC8", "9EKi2E9dVY8", "0bpQIBjnvdk", "NkRkuI0ZgX0"]) {
    assert.match(article, new RegExp(id));
  }
});

test("all five supplied images and four editorial graphics are represented", async () => {
  const [article, evidence] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(`${componentRoot}/MtvEvidence.astro`, "utf8"),
  ]);
  const assets = await readdir(assetRoot);

  for (const filename of [
    "stone-roses-love-spreads-master-slate.png",
    "spotify-morphine-video-queue-wide.png",
    "spotify-alt-video-queue-sidebar.png",
    "spotify-jeremy-radio.png",
    "woodstock-99-author-photo.jpg",
  ]) {
    assert.ok(assets.includes(filename), `${filename} is missing.`);
    assert.match(evidence, new RegExp(filename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const component of ["MtvSignalMap", "MtvSeedChannels", "MtvCatalogMatrix", "MtvSchedule"]) {
    assert.match(article, new RegExp(`<${component}`));
  }

  assert.match(evidence, /identified by the author as Carson Daly/);
  assert.match(evidence, /rough archival teaser; the full photo set will be scanned/);
});

test("supplied source images remain byte-identical after descriptive renaming", async () => {
  const expected = {
    "stone-roses-love-spreads-master-slate.png": "8350781e4a781f724e003d7b22efbd7507b974e33679ef8011a169062abb0ea7",
    "spotify-morphine-video-queue-wide.png": "f40e596f2727f61758c96000c3667350336a5b9484253b4b363a9909649e89d5",
    "spotify-alt-video-queue-sidebar.png": "02e766e19e4196ca00cbd7e9038687fa5111e502581068601778259f586339f5",
    "spotify-jeremy-radio.png": "40d1f7d0d5369bb2a9ac039f97e0dc909985fbb5d9ba2338b87ff05217ac6e49",
    "woodstock-99-author-photo.jpg": "0bd949a6ed556dd1c88edf404a111553670ce0d3dc2c9374962142626f8e7ce5",
  };

  for (const [filename, hash] of Object.entries(expected)) {
    const file = await readFile(`${assetRoot}/${filename}`);
    assert.equal(createHash("sha256").update(file).digest("hex"), hash, filename);
  }
});
