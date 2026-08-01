import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("comic tags link to a real Funnies tag archive", async () => {
  const [detail, archive, helpers] = await Promise.all([
    read("src/pages/presents/funnies/[series]/[slug].astro"),
    read("src/pages/presents/funnies/tags/[tag].astro"),
    read("src/lib/comics.ts"),
  ]);

  assert.match(detail, /href=\{comicTagPath\(tag\)\}/);
  assert.doesNotMatch(detail, /\/articles\/tags\//);
  assert.match(helpers, /return `\/presents\/funnies\/tags\/\$\{encodeURIComponent\(tag\)\}`/);
  assert.match(archive, /getComicTagCounts\(allComics\)/);
  assert.match(archive, /comicsWithTag\(allComics, tag\)/);
  assert.match(archive, /<ComicCard comic=\{comic\} \/>/);
});
