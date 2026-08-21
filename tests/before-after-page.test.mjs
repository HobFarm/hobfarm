import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("Before & After uses a dedicated archive route", () => {
  const route = "src/pages/workshop/before-and-after/index.astro";
  assert.equal(existsSync(join(root, route)), true);

  const page = read(route);
  const genericRoute = read("src/pages/workshop/[program].astro");

  assert.match(page, /BeforeAfterArchive/);
  assert.match(page, /Before & After: History, Restoration and Alternate Futures \| HobFarm/);
  assert.match(page, /"@type": "CollectionPage"/);
  assert.match(page, /"@type": "VideoObject"/);
  assert.match(page, /uploadDate: "2026-07-15T10:24:59Z"/);
  assert.match(page, /uploadDate: "2026-07-15T10:27:06Z"/);
  assert.match(genericRoute, /program\.id !== "before-after"/);
});

test("archive provides controlled motion and an accessible comparison", () => {
  const archive = read("src/components/workshop/BeforeAfterArchive.astro");

  assert.match(archive, /data-featured-toggle/);
  assert.match(archive, /data-featured-replay/);
  assert.match(archive, /prefers-reduced-motion: reduce/);
  assert.match(archive, /connection\?\.saveData/);
  assert.match(archive, /BeforeAfterCompare/);
  assert.equal((archive.match(/\bautoplay\b/g) ?? []).length, 0, "videos should start through the guarded client script");
});

test("archive media is registered under durable CDN paths", () => {
  const registry = read("src/data/media-registry.ts");
  const expectedIds = [
    "before-after.shit-to-shine.source",
    "before-after.shit-to-shine.after",
    "before-after.shit-to-shine.video",
    "before-after.north-shore.before",
    "before-after.north-shore.after",
    "before-after.north-shore.video",
    "before-after.salton-city.before",
    "before-after.salton-city.after",
    "before-after.salton-city.video",
  ];

  for (const id of expectedIds) assert.match(registry, new RegExp(`"${id}":`));
  assert.doesNotMatch(registry, /salton-city-2026\.png/);
  assert.match(registry, /salton-city-2065\.png/);
});

test("archive entries distinguish documentary and invented material", () => {
  const northShore = read("src/content/gallery/before-and-after/north-shore-1960s-2010s.md");
  const saltonCity = read("src/content/gallery/before-and-after/salton-city-1965-alternate-2065.md");
  const laundry = read("src/content/gallery/before-and-after/shit-to-shine-01.md");

  assert.match(northShore, /editorialMode: documentary-comparison/);
  assert.match(northShore, /1960s \/ 2010s/);
  assert.match(northShore, /desertsun\.com/);
  assert.match(saltonCity, /editorialMode: counterfactual-history/);
  assert.match(saltonCity, /alternate 2065/i);
  assert.match(laundry, /editorialMode: speculative-restoration/);
});
