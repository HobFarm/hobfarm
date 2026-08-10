import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/from-wetlands-to-the-wash.mdx";
const componentRoot = "src/components/articles/bblv";

function field(source, name) {
  const match = source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"));
  assert.ok(match, `${name} is missing.`);
  return match[1].trim();
}

function articleWordCount(source) {
  const body = source.replace(/^---[\s\S]*?---/, "").replace(/<[^>]+>/g, " ");
  return body.split(/\s+/).filter(Boolean).length;
}

test("article preserves its route, boundaries, and publication slot", async () => {
  const [article, predecessor] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile("src/content/articles/i-want-my-mtv.mdx", "utf8"),
  ]);

  assert.equal(field(article, "title"), '"From Wetlands to the Wash"');
  assert.equal(field(article, "canonical"), '"/articles/from-wetlands-to-the-wash/"');
  assert.equal(field(article, "pubDate"), "2026-08-15");
  assert.equal(field(article, "publishedAt"), "2026-08-15T16:20:00-07:00");
  assert.equal(field(article, "status"), "scheduled");
  assert.equal(Date.parse(field(article, "publishedAt")) - Date.parse(field(predecessor, "publishedAt")), 24 * 60 * 60 * 1000);
  assert.match(article, /This article is my independent HobFarm work/);
  assert.match(article, /No legitimate public box-office receipt/);
  assert.doesNotMatch(article, /approximately 800|approximate 800|roughly 800|about 800/i);
  assert.doesNotMatch(article, /—/);

  const words = articleWordCount(article);
  assert.ok(words >= 4500 && words <= 7000, `Article word count ${words} is outside the feature brief.`);
});

test("multimedia and original graphics remain present", async () => {
  const [article, video, player] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(`${componentRoot}/BblvVideo.astro`, "utf8"),
    readFile(`${componentRoot}/BblvMediaWatch.astro`, "utf8"),
  ]);

  for (const component of [
    "WashRoute",
    "DualTimeline",
    "BowlFamily",
    "OpeningCalendar",
    "PaluzziDetail",
    "PublicComparison",
  ]) {
    assert.match(article, new RegExp(`<${component}`), `${component} is not used.`);
  }

  assert.match(article, /linq-garage-flood-2026-v1-480p-h264\.mp4/);
  assert.match(article, /jrad-brooklyn-bowl-las-vegas-2026-v1-480p-h264\.mp4/);
  assert.match(video, /preload="metadata"/);
  assert.match(video, /playsinline/);
  assert.match(player, /youtube-nocookie\.com/);
  assert.match(player, /data-player-load/);
});

test("one-time publisher protects the exact August 15 release", async () => {
  const [scheduler, workflow] = await Promise.all([
    readFile("scripts/publish-scheduled-from-wetlands-to-the-wash.mjs", "utf8"),
    readFile(".github/workflows/publish-from-wetlands-to-the-wash.yml", "utf8"),
  ]);

  assert.match(scheduler, /expectedPublication = "2026-08-15T16:20:00-07:00"/);
  assert.match(scheduler, /Date\.now\(\) < Date\.parse\(expectedPublication\)/);
  assert.match(workflow, /cron: "20 23 15 8 \*"/);
  assert.match(workflow, /git rm \.github\/workflows\/publish-from-wetlands-to-the-wash\.yml/);
});

test("MTV ending now treats Woodstock as a future seed", async () => {
  const [article, evidence] = await Promise.all([
    readFile("src/content/articles/i-want-my-mtv.mdx", "utf8"),
    readFile("src/components/articles/i-want-my-mtv/MtvEvidence.astro", "utf8"),
  ]);

  assert.match(article, /That is a future article, once I scan the photographs\./);
  assert.match(evidence, /full photo set will be scanned for a future article/);
  assert.doesNotMatch(article, /That is the next article\./);
});
