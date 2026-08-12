import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const slug = "reviewing-request-for-safety";
const articlePath = `src/content/articles/${slug}.mdx`;
const figurePath = `src/components/articles/${slug}/ReviewFigure.astro`;

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
    .replace(/^\[\^[^\]]+\]:.+$/gm, "")
    .replace(/```[\s\S]*?```/g, " ");
  return body.split(/\s+/).filter(Boolean).length;
}

test("Reviewing Request for Safety owns the August 14 trilogy slot", async () => {
  const [article, predecessor, successor, names] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile("src/content/articles/the-model-is-free.mdx", "utf8"),
    readFile("src/content/articles/every-sentence-is-a-keynote-conclusion.mdx", "utf8"),
    readdir("src/content/articles"),
  ]);

  assert.equal(field(article, "title"), '"Reviewing Request for Safety"');
  assert.equal(field(article, "canonical"), '"/articles/reviewing-request-for-safety/"');
  assert.equal(field(article, "pubDate"), "2026-08-14");
  assert.equal(field(article, "publishedAt"), "2026-08-14T16:20:00-07:00");
  assert.ok(["scheduled", "published"].includes(field(article, "status")));
  assert.equal(
    Date.parse(field(article, "publishedAt")) - Date.parse(field(predecessor, "publishedAt")),
    24 * 60 * 60 * 1000,
  );
  assert.equal(
    Date.parse(field(successor, "publishedAt")) - Date.parse(field(article, "publishedAt")),
    24 * 60 * 60 * 1000,
  );

  const collisions = [];
  for (const name of names.filter((name) => /\.mdx?$/.test(name))) {
    if (name === `${slug}.mdx`) continue;
    const source = await readFile(`src/content/articles/${name}`, "utf8");
    if (/^publishedAt:\s*2026-08-14T16:20:00-07:00$/m.test(source)) collisions.push(name);
  }
  assert.deepEqual(collisions, []);
});

test("the article preserves the argument and evidence boundaries", async () => {
  const article = await readFile(articlePath, "utf8");
  const words = articleWordCount(article);

  assert.ok(words >= 2600 && words <= 3800, `Article word count ${words} is outside the production brief.`);
  assert.match(article, /The schema was there\. The system decided which parts mattered\./);
  assert.match(article, /AI does not only answer the request\. It decides what the request is\./);
  assert.match(article, /Sometimes the user knew exactly what they wanted and got tired of defending it from the tool\./);
  assert.match(article, /The request is being reviewed\. The user should review the review\./);
  assert.match(article, /It is request-boundary evidence\. It is not Grok's internal reasoning trace\./);
  assert.match(article, /displayed process narration/);
  assert.match(article, /This comparison does something smaller/);
  assert.match(article, /^\s*section:\s*technology$/m);
  assert.match(article, /^department:\s*workshop-notes$/m);
  assert.match(article, /^format:\s*workshop-note$/m);
  assert.doesNotMatch(article, /—/);
  assert.doesNotMatch(article, /\[RECEIPT|\[HERO|\[FIGURE|TODO|TBD/);
  assert.doesNotMatch(article, /resume-screenshot|resume screenshot|<img[^>]+resume/i);
  assert.doesNotMatch(article, /Meta(?:'s)? (?:private|internal) (?:chain-of-thought|reasoning trace)/i);
});

test("the visual package keeps the comparison narrow and accessible", async () => {
  const [article, figure, hero, social, contactSheet] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(figurePath, "utf8"),
    stat("assets/reviewing-request-for-safety/hero-v2.webp"),
    stat("assets/reviewing-request-for-safety/social-v2.webp"),
    stat("assets/reviewing-request-for-safety/experiment-contact-sheet.webp"),
  ]);

  for (const kind of [
    "two-schemas",
    "priority-inversion",
    "experiment",
    "interpretation-stack",
    "meta-process",
    "interpretation-debt",
    "slop-pipeline",
  ]) {
    assert.match(article, new RegExp(`<ReviewFigure kind="${kind}"`));
  }
  assert.equal((article.match(/<ReviewFigure /g) ?? []).length, 7);
  assert.match(figure, /Read this graphic as text/);
  assert.match(figure, /illustrates a failure mode\. It does not rank providers\./);
  assert.ok(hero.size > 30_000);
  assert.ok(social.size > 20_000);
  assert.ok(contactSheet.size > 100_000);
});

test("the asset manifest preserves source bytes and August 14 labels", async () => {
  const manifest = JSON.parse(await readFile("reports/reviewing-request-for-safety/asset-manifest.json", "utf8"));
  assert.equal(manifest.article_slug, slug);
  assert.equal(manifest.scheduled_publication, "2026-08-14T16:20:00-07:00");
  assert.equal(manifest.assets.length, 15);
  assert.ok(manifest.assets.every((asset) => /^[a-f0-9]{64}$/.test(asset.sha256)));
  assert.ok(manifest.assets.every((asset) => asset.destination_key.startsWith(`articles/${slug}/`)));

  const diagrams = await readdir("assets/reviewing-request-for-safety/diagrams");
  assert.equal(diagrams.filter((name) => name.endsWith(".svg")).length, 7);
  for (const name of diagrams.filter((name) => name.endsWith(".svg"))) {
    const source = await readFile(`assets/reviewing-request-for-safety/diagrams/${name}`, "utf8");
    assert.match(source, /<title/);
    assert.match(source, /<desc/);
    assert.match(source, /08\.14\.2026/);
    assert.doesNotMatch(source, /08\.20\.2026/);
  }
});
