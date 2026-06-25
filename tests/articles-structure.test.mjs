import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("articles route layer exists without exposing public blog routes", () => {
  const routeFiles = [
    "src/pages/articles/index.astro",
    "src/pages/articles/[...slug].astro",
    "src/pages/articles/category/[category].astro",
    "src/pages/articles/tags/index.astro",
    "src/pages/articles/tags/[tag].astro",
  ];

  for (const file of routeFiles) {
    assert.equal(existsSync(join(root, file)), true, `${file} should exist`);
  }
});

test("navigation prefers Articles over Blog", () => {
  const navigation = read("src/data/navigation.ts");

  assert.match(navigation, /label:\s*"Articles",\s*href:\s*"\/articles"/);
  assert.doesNotMatch(navigation, /label:\s*"Blog"/);
});

test("legacy blog URLs redirect to canonical articles URLs", () => {
  const redirects = read("public/_redirects");

  assert.match(redirects, /\/blog\s+\/articles\/\s+301/);
  assert.match(redirects, /\/blog\/posts\/:slug\s+\/articles\/:slug\s+301/);
  assert.match(redirects, /\/blog\/category\/:category\s+\/articles\/category\/:category\s+301/);
  assert.match(redirects, /\/blog\/tags\/:tag\s+\/articles\/tags\/:tag\s+301/);
});

test("search and rss point article entries at /articles", () => {
  const searchIndex = read("src/lib/search-index.ts");
  const rss = read("src/pages/rss.xml.js");

  assert.match(searchIndex, /type:\s*"article"/);
  assert.match(searchIndex, /href:\s*`\/articles\/\$\{stripExt\(post\.id\)\}`/);
  assert.match(rss, /link:\s*`\/articles\/\$\{post\.id\}\/`/);
});

test("article share controls include a generated share post", () => {
  const shareButtons = read("src/components/articles/ShareButtons.astro");
  const articleLayout = read("src/layouts/ArticleLayout.astro");

  assert.match(shareButtons, /data-share-post/);
  assert.match(shareButtons, /data-copy-share-post/);
  assert.match(shareButtons, /data-native-share/);
  assert.match(shareButtons, /Share post/);
  assert.match(articleLayout, /tags=\{frontmatter\.tags\}/);
});
