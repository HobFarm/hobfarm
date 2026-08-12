import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/i-may-have-inspired-it.md";
const sourceArticlePath = "src/content/articles/hey-its-that-guy.mdx";
const assetRoot = "public/images/articles/i-may-have-inspired-it";

function field(source, name) {
  return source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim();
}

test("Bangor and Derry article is dated exactly 48 hours before the Crypt article", async () => {
  const [article, sourceArticle] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(sourceArticlePath, "utf8"),
  ]);

  const publication = field(article, "publishedAt");
  const sourcePublication = field(sourceArticle, "publishedAt");
  const status = field(article, "status");
  const sourceStatus = field(sourceArticle, "status");

  assert.equal(publication, "2026-08-01T17:20:00-07:00");
  assert.equal(sourcePublication, "2026-08-03T17:20:00-07:00");
  assert.equal(
    Date.parse(sourcePublication) - Date.parse(publication),
    48 * 60 * 60 * 1000,
  );
  assert.equal(field(article, "pubDate"), "2026-08-01");
  assert.ok(["scheduled", "published"].includes(status));
  assert.ok(["scheduled", "published"].includes(sourceStatus));
});

test("article uses the supplied public-safe photo set and preserves its reporting boundary", async () => {
  const article = await readFile(articlePath, "utf8");
  const requiredAssets = [
    "01-birdbath-hero.jpg",
    "02-thomas-hill-standpipe.jpg",
    "03-kenduskeag-downtown.jpg",
    "04-kenduskeag-natural.jpg",
    "05-hampden-academy-old.jpg",
    "06-hampden-academy-gym.jpg",
    "07-bucksport-mill-2014.jpg",
    "08-buck-monument.jpg",
  ];

  for (const filename of requiredAssets) {
    await access(`${assetRoot}/${filename}`);
    assert.ok(article.includes(filename), `Article does not use ${filename}`);
  }

  assert.match(article, /I may have inspired \*It\*\./);
  assert.match(article, /I have no proof\./);
  assert.match(article, /not an allegation that Stephen King observed or copied/);
  assert.match(article, /exact childhood home, street address, walking route/);
  assert.doesNotMatch(article, /09-standpipe-interior\.jpg/);
});
