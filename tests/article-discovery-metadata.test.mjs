import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parse } from "yaml";
import {
  getArticleDek,
  getArticleDescription,
  getArticleDocumentTitle,
  getArticleSeoTitle,
} from "../src/lib/article-metadata.ts";

function frontmatter(path) {
  const source = readFileSync(path, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, `${path} needs YAML frontmatter`);
  return parse(match[1]);
}

test("article discovery metadata uses one backwards-compatible fallback contract", () => {
  const legacy = {
    title: "Editorial title",
    excerpt: "Archive excerpt",
  };
  assert.equal(getArticleSeoTitle(legacy), "Editorial title");
  assert.equal(getArticleDocumentTitle(legacy), "Editorial title | HobFarm");
  assert.equal(getArticleDek(legacy), "Archive excerpt");
  assert.equal(getArticleDescription(legacy), "Archive excerpt");

  const authored = {
    ...legacy,
    seoTitle: "Search title",
    dek: "Visible dek",
    description: "Search description",
  };
  assert.equal(getArticleDocumentTitle(authored), "Search title | HobFarm");
  assert.equal(getArticleDek(authored), "Visible dek");
  assert.equal(getArticleDescription(authored), "Search description");
});

test("the Hamburger Train acceptance article separates its H1 and search title", () => {
  const article = frontmatter("src/content/articles/new-wave-future-of-rock-and-roll.mdx");
  assert.equal(article.title, "You're the Guy From the Hamburger Train");
  assert.match(article.seoTitle, /^You're the Guy From the Hamburger Train: Paul Reubens,/);
  assert.match(article.seoTitle, /Cheech & Chong's Nice Dreams, Primus and New Wave$/);
  assert.match(article.dek, /^Paul Reubens says the line in Cheech & Chong's Nice Dreams\./);
  assert.match(article.dek, /Primus uses the scene to open “Hamburger Train” on Pork Soda/);
  assert.equal(
    getArticleDocumentTitle(article),
    `${article.seoTitle} | HobFarm`,
  );
});

test("the search preview command exposes the authored metadata and mesh", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/preview-article-search.mjs", "new-wave-future-of-rock-and-roll"],
    { encoding: "utf8" },
  );

  for (const label of [
    "Editorial H1:",
    "Search title:",
    "Meta description:",
    "Visible dek start:",
    "Canonical URL:",
    "Primary concepts:",
    "Primary entities:",
  ]) {
    assert.ok(output.includes(label), `preview should include ${label}`);
  }
  assert.match(output, /Paul Reubens \(people\)/);
  assert.match(output, /Nice Dreams \(1981\) \(works\)/);
});

test("structured metadata uses reader-facing mesh labels", () => {
  const articles = readFileSync("src/lib/articles.ts", "utf8");
  assert.match(articles, /getEditorialSubject\(id\)\?\.label/);
  assert.match(articles, /getEditorialSeries\(id\)\?\.label/);
});
