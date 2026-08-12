import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const slug = "every-sentence-is-a-keynote-conclusion";
const articlePath = `src/content/articles/${slug}.mdx`;
const figurePath = `src/components/articles/${slug}/KeynoteFigure.astro`;
const assetRoot = `public/articles/${slug}`;

function field(source, name) {
  const match = source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"));
  assert.ok(match, `${name} is missing.`);
  return match[1].trim();
}

function articleWordCount(source) {
  const body = source
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^import .+;$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/## Source notes[\s\S]*$/, "")
    .replace(/```[\s\S]*?```/g, " ");
  return body.split(/\s+/).filter(Boolean).length;
}

test("Every Sentence Is a Keynote Conclusion owns the August 15 follow-up slot", async () => {
  const [article, trilogyAnchor, names] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile("src/content/articles/reviewing-request-for-safety.mdx", "utf8"),
    readdir("src/content/articles"),
  ]);

  assert.equal(field(article, "title"), '"Every Sentence Is a Keynote Conclusion"');
  assert.equal(field(article, "canonical"), '"/articles/every-sentence-is-a-keynote-conclusion/"');
  assert.equal(field(article, "pubDate"), "2026-08-15");
  assert.equal(field(article, "publishedAt"), "2026-08-15T16:20:00-07:00");
  assert.equal(field(article, "status"), "scheduled");
  assert.equal(
    Date.parse(field(article, "publishedAt")) - Date.parse(field(trilogyAnchor, "publishedAt")),
    24 * 60 * 60 * 1000,
  );

  const collisions = [];
  for (const name of names.filter((name) => /\.mdx?$/.test(name))) {
    if (name === `${slug}.mdx`) continue;
    const source = await readFile(`src/content/articles/${name}`, "utf8");
    if (/^publishedAt:\s*2026-08-15T16:20:00-07:00$/m.test(source)) collisions.push(name);
  }
  assert.deepEqual(collisions, []);
});

test("the article keeps the supplied argument and evidence boundaries", async () => {
  const article = await readFile(articlePath, "utf8");
  const words = articleWordCount(article);

  assert.ok(words >= 4200 && words <= 5600, `Article word count ${words} is outside the feature brief.`);
  assert.match(article, /I cannot open his draft history and prove how the post was made/);
  assert.match(article, /It is a plausible system risk and a reason to preserve provenance, not a measured forecast/);
  assert.match(article, /HobFarm project files are context and editorial controls, not fine-tuning/);
  assert.match(article, /delete the sentence that sounds finished only because both halves line up/);
  assert.match(article, /^\s*section:\s*technology$/m);
  assert.match(article, /^department:\s*workshop-notes$/m);
  assert.match(article, /^format:\s*workshop-note$/m);
  assert.doesNotMatch(article, /—/);
  assert.doesNotMatch(article, /\[HERO|\[FIGURE|TODO|TBD/);
  assert.doesNotMatch(article, /src=.*linkedin|<img[^>]+linkedin/i);
});

test("the visual package is original, readable, and complete", async () => {
  const [article, figure, hero, heroWebp, socialWebp] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(figurePath, "utf8"),
    readFile(`${assetRoot}/hero.svg`, "utf8"),
    stat(`${assetRoot}/hero.webp`),
    stat(`${assetRoot}/social.webp`),
  ]);

  for (const kind of [
    "default-paragraph",
    "paper-versus-post",
    "market-dilution",
    "fingerprint-depth",
    "cross-media",
    "recursion",
    "workflow",
  ]) {
    assert.match(article, new RegExp(`<KeynoteFigure kind="${kind}"`));
  }

  assert.equal((article.match(/<KeynoteFigure /g) ?? []).length, 7);
  assert.match(figure, /Read this graphic as text/);
  assert.match(figure, /@media \(max-width: 800px\)/);
  assert.match(hero, /<svg/);
  assert.match(hero, /RHETORIC/);
  assert.match(hero, /EDITORIAL PATH/);
  assert.ok(heroWebp.size > 30_000);
  assert.ok(socialWebp.size > 20_000);
});

test("the one-time publisher protects the exact August 15 release", async () => {
  const [scheduler, workflow] = await Promise.all([
    readFile("scripts/publish-scheduled-every-sentence-is-a-keynote-conclusion.mjs", "utf8"),
    readFile(".github/workflows/publish-every-sentence-is-a-keynote-conclusion.yml", "utf8"),
  ]);

  assert.match(scheduler, /expectedPublication = "2026-08-15T16:20:00-07:00"/);
  assert.match(scheduler, /Date\.now\(\) < Date\.parse\(expectedPublication\)/);
  assert.match(workflow, /cron: "20 23 15 8 \*"/);
  assert.match(workflow, /node scripts\/publish-scheduled-every-sentence-is-a-keynote-conclusion\.mjs/);
  assert.match(workflow, /git rm \.github\/workflows\/publish-every-sentence-is-a-keynote-conclusion\.yml/);
});
