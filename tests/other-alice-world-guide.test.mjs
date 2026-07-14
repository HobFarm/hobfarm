import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Other Alice World Guide exposes game-codex sections", async () => {
  const page = await read("src/pages/departments/hobfarm-presents/[series]/world-guide.astro");
  for (const id of ["database", "world-system", "regions", "courts", "residents", "bestiary", "archive", "unsuited", "terms"]) {
    assert.match(page, new RegExp(`id=\\"${id}\\"`));
  }
  assert.match(page, /data-guide-filter/);
  assert.match(page, /data-guide-entry/);
});

test("World Guide data contains the four Houses, sovereignty rule, and established Unsuited beings", async () => {
  const data = await read("src/data/other-alice-world-guide.ts");
  for (const id of ["hearts", "diamonds", "spades", "clubs"]) {
    assert.match(data, new RegExp(`id: \\"${id}\\"`));
  }
  assert.match(data, /Hearts possess de jure sovereignty/);
  assert.match(data, /The Hearts own the map/);
  assert.match(data, /name: "Chester"/);
  assert.match(data, /name: "The Caterpillar"/);
  assert.match(data, /OTHER_ALICE_WORLD_GUIDE_MEDIA_ROOT/);
});

test("Other Alice timeline consistently uses the locked eight-and-ten chronology", async () => {
  const files = await Promise.all([
    read("src/data/story-series.ts"),
    read("src/data/characters.ts"),
    read("src/data/other-alice-world-guide.ts"),
  ]);
  const combined = files.join("\n");
  assert.match(combined, /arrivalAge: 8/);
  assert.match(combined, /wonderlandYears: 10/);
  assert.match(combined, /ten Wonderland years/i);
  assert.match(combined, /outsideElapsed: "200 years"/i);
  assert.match(combined, /roughly the 2070s/i);
  assert.doesNotMatch(combined, /arrivalAge: 7/);
  assert.doesNotMatch(combined, /wonderlandYears: 11/);
  assert.doesNotMatch(combined, /150 to 200/i);
});

test("Other Alice data exposes the Hatter, Diamond Highlands, and concept-art system", async () => {
  const files = await Promise.all([
    read("src/data/other-alice-world-guide.ts"),
    read("src/data/characters.ts"),
    read("src/components/presents/other-alice/OtherAliceStartPage.astro"),
  ]);
  const combined = files.join("\n");
  assert.match(combined, /hatterWorldFeature/);
  assert.match(combined, /The Diamond Highlands/);
  assert.match(combined, /Mad Tea Party/);
  assert.match(combined, /Open canon questions/);
  assert.match(combined, /otherAliceConceptArt/);
  assert.match(combined, /melting-rabbit-project-mark\.webp/);
});

test("Other Alice exposes dedicated political and relationship pages", async () => {
  const files = await Promise.all([
    read("src/pages/departments/hobfarm-presents/other-alice-adventures/houses/index.astro"),
    read("src/pages/departments/hobfarm-presents/other-alice-adventures/web-of-wonderland/index.astro"),
    read("src/components/presents/other-alice/OaaRelationshipWeb.astro"),
  ]);
  const combined = files.join("\n");
  assert.match(combined, /Who rules Wonderland\?/);
  assert.match(combined, /data-map-tab/);
  assert.match(combined, /What happens when a House stops\?/);
  assert.match(combined, /data-web-filter/);
  assert.match(combined, /Evidence:/);
});

test("series, Presents, and character pages link to the World Guide", async () => {
  const files = await Promise.all([
    read("src/pages/departments/hobfarm-presents/index.astro"),
    read("src/pages/departments/hobfarm-presents/[series]/index.astro"),
    read("src/pages/characters/[character].astro"),
  ]);
  files.forEach((source) => assert.match(source, /OTHER_ALICE_WORLD_GUIDE_PATH/));
});
