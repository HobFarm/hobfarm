import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Other Alice World Guide exposes game-codex sections", async () => {
  const page = await read("src/pages/departments/hobfarm-presents/[series]/world-guide.astro");
  for (const id of ["database", "world-system", "regions", "courts", "residents", "unsuited", "terms"]) {
    assert.match(page, new RegExp(`id=\\"${id}\\"`));
  }
  assert.match(page, /data-guide-filter/);
  assert.match(page, /data-guide-entry/);
});

test("World Guide data contains the four courts and established Unsuited beings", async () => {
  const data = await read("src/data/other-alice-world-guide.ts");
  for (const name of ["The Heart Court", "The Diamond Court", "The Spade Court", "The Club Court"]) {
    assert.match(data, new RegExp(name));
  }
  assert.match(data, /name: "Chester"/);
  assert.match(data, /name: "The Caterpillar"/);
  assert.match(data, /OTHER_ALICE_WORLD_GUIDE_MEDIA_ROOT/);
});

test("Other Alice timeline consistently uses the new science-fiction chronology", async () => {
  const files = await Promise.all([
    read("src/data/story-series.ts"),
    read("src/data/characters.ts"),
    read("src/data/other-alice-world-guide.ts"),
  ]);
  const combined = files.join("\n");
  assert.doesNotMatch(combined, /entered Wonderland at seven/i);
  assert.doesNotMatch(combined, /eleven Wonderland years/i);
  assert.doesNotMatch(combined, /roughly 150 years/i);
  assert.match(combined, /ten Wonderland years/i);
  assert.match(combined, /2060s/);
  assert.match(combined, /two hundred/i);
});

test("series, Presents, and character pages link to the World Guide", async () => {
  const files = await Promise.all([
    read("src/pages/departments/hobfarm-presents/index.astro"),
    read("src/pages/departments/hobfarm-presents/[series]/index.astro"),
    read("src/pages/characters/[character].astro"),
  ]);
  files.forEach((source) => assert.match(source, /OTHER_ALICE_WORLD_GUIDE_PATH/));
});
