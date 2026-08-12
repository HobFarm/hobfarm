import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/the-future-was-already-there.mdx";
const componentRoot = "src/components/articles/the-future-was-already-there";
const assetRoot = "public/articles/the-future-was-already-there";

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

test("The Future Was Already There owns the August 20 publication slot", async () => {
  const [article, predecessor, names] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile("src/content/articles/songs-we-learned-backwards.mdx", "utf8"),
    readdir("src/content/articles"),
  ]);

  assert.equal(field(article, "title"), '"The Future Was Already There"');
  assert.equal(field(article, "canonical"), '"/articles/the-future-was-already-there/"');
  assert.equal(field(article, "pubDate"), "2026-08-20");
  assert.equal(field(article, "publishedAt"), "2026-08-20T16:20:00-07:00");
  assert.ok(["scheduled", "published"].includes(field(article, "status")));
  assert.equal(
    Date.parse(field(article, "publishedAt")) - Date.parse(field(predecessor, "publishedAt")),
    24 * 60 * 60 * 1000,
  );

  const collisions = [];
  for (const name of names.filter((name) => /\.mdx?$/.test(name))) {
    if (name === "the-future-was-already-there.mdx") continue;
    const source = await readFile(`src/content/articles/${name}`, "utf8");
    if (/^publishedAt:\s*2026-08-20T16:20:00-07:00$/m.test(source)) collisions.push(name);
  }
  assert.deepEqual(collisions, []);
});

test("the article keeps the supplied argument and evidence boundaries", async () => {
  const article = await readFile(articlePath, "utf8");
  const words = articleWordCount(article);

  assert.ok(words >= 2500 && words <= 4000, `Article word count ${words} is outside the feature brief.`);
  assert.match(article, /I did not make my first YouTube video for YouTube/);
  assert.match(article, /I did not witness the first creation of the Bush mural that day/);
  assert.match(article, /The disagreement was not a plot turn with a villain/);
  assert.match(article, /Henderson City Council Ward III—not mayor/);
  assert.match(article, /The future was already there\. It just did not have a play button yet\./);
  assert.doesNotMatch(article, /Tim(?:othy)? Clorius was born on|Tim(?:othy)? Clorius's birthday/i);
  assert.doesNotMatch(article, /Trish Nash[^\n.]{0,60}(?:mayoral candidate|ran for mayor|running for mayor)/i);
  assert.doesNotMatch(article, /\[HERO|\[TIMELINE|\[GRAPHIC|TODO|TBD/);
});

test("multimedia uses original graphics and click-to-load author video", async () => {
  const [article, video, timeline, branches, hero, heroWebp, socialWebp] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(`${componentRoot}/PortlandVideo.astro`, "utf8"),
    readFile(`${componentRoot}/PortlandTimeline.astro`, "utf8"),
    readFile(`${componentRoot}/ThreeBranches.astro`, "utf8"),
    readFile(`${assetRoot}/hero.svg`, "utf8"),
    stat(`${assetRoot}/hero.webp`),
    stat(`${assetRoot}/social.webp`),
  ]);

  assert.match(article, /videoId="C0dVSdSdou0"/);
  assert.match(article, /videoId="kg-OKeXpeWo"/);
  assert.match(article, /original HobFarm graphics built from live text and vector shapes/);
  assert.match(video, /youtube-nocookie\.com\/embed/);
  assert.match(video, /button\.addEventListener\("click"/);
  assert.match(video, /prefers-reduced-motion/);
  assert.match(timeline, /Three systems become one job/);
  assert.match(branches, /These were lenses, not fixed roles/);
  assert.match(hero, /<svg/);
  assert.match(hero, /ONE CAMERA \/ THREE PATHS/);
  assert.ok(heroWebp.size > 30_000);
  assert.ok(socialWebp.size > 20_000);
  assert.doesNotMatch(article, /<img[^>]+(?:pressherald|thebollard|mikerichart)/i);
});
