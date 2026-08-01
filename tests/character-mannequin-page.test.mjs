import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Character / Mannequin is a five-section visual demonstration", () => {
  const page = read("src/components/workshop/CharacterMannequinPage.astro");

  for (const phrase of [
    "Start with the base.",
    "A neutral sheet gives every change the same place to begin.",
    "Two styles on one mannequin. One style on two mannequins.",
    "The look survives without producing the same picture.",
    "This page shows the result. A course can teach the mechanics.",
  ]) {
    assert.match(page, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.equal([...page.matchAll(/^\s*<section\b/gm)].length, 5);
});

test("the story order is clean base, dress blonde, black leather blonde, then black leather green", () => {
  const page = read("src/components/workshop/CharacterMannequinPage.astro");
  const data = read("src/data/character-mannequin.ts");

  const pageOrder = [
    page.indexOf('label: "Clean base"'),
    page.indexOf('label: "Dress / Blonde"'),
    page.indexOf('label: "Black leather / Blonde"'),
    page.indexOf('label: "Black leather / Green"'),
  ];
  assert.deepEqual([...pageOrder].sort((a, b) => a - b), pageOrder);
  assert.equal(pageOrder.every((index) => index >= 0), true);

  const lookOrder = [
    data.indexOf('id: "yellow-pool"'),
    data.indexOf('id: "black-marble"'),
    data.indexOf('id: "green-art-deco"'),
  ];
  assert.deepEqual([...lookOrder].sort((a, b) => a - b), lookOrder);
  assert.equal(lookOrder.every((index) => index >= 0), true);
});

test("the sequence contains two styling examples and one identity transfer", () => {
  const data = read("src/data/character-mannequin.ts");
  const chapter = read("src/components/workshop/CharacterLookChapter.astro");

  assert.equal((data.match(/^    axis: "styling"/gm) ?? []).length, 2);
  assert.equal((data.match(/^    axis: "identity"/gm) ?? []).length, 1);
  assert.match(chapter, /The first two examples restyle the blonde mannequin/);
  assert.match(chapter, /keeps the black leather look/);
  assert.match(chapter, /Continuity note\./);
});

test("tool, affiliate, research, Cyberpop, ivory, and commission material is absent", () => {
  const combined = [
    read("src/components/workshop/CharacterMannequinPage.astro"),
    read("src/data/character-mannequin.ts"),
  ].join("\n");

  for (const removed of [
    "ElevenLabs",
    "affiliate",
    "Editorial placeholder",
    "Cyberpop",
    "Bauhaus",
    "ivory-noir",
    "outfit2.png",
    "custom-character",
    "commission",
  ]) {
    assert.doesNotMatch(combined, new RegExp(removed, "i"));
  }
});

test("Clean Base 001 remains the hero and the three sheets share a lightbox", () => {
  const data = read("src/data/character-mannequin.ts");
  const page = read("src/components/workshop/CharacterMannequinPage.astro");

  assert.match(data, /heroGraphic:\s*cleanBaseSheet/);
  assert.match(data, /clean-base-001-sheet\.png/);
  assert.match(page, /data-lightbox-group="character-sheet-library"/);
  assert.match(page, /<Lightbox client:only="react" \/>/);
});

test("the black leather transfer is shown directly on both mannequins", () => {
  const data = read("src/data/character-mannequin.ts");
  const page = read("src/components/workshop/CharacterMannequinPage.astro");

  assert.match(data, /mannequin-outfit3\.png/);
  assert.match(data, /mannequin2-outfit3\.png/);
  assert.match(page, /data-lightbox-group="black-look-transfer"/);
  assert.match(page, /Same mannequin, different looks/);
  assert.match(page, /Different mannequin, same look/);
});

test("look stages are keyboard-addressable, character-first, and poster-first", () => {
  const chapter = read("src/components/workshop/CharacterLookChapter.astro");
  const page = read("src/components/workshop/CharacterMannequinPage.astro");

  for (const semantic of ['role="tablist"', 'role="tab"', 'role="tabpanel"']) assert.match(chapter, new RegExp(semantic));
  assert.match(chapter, /stage\.key === "character" \? "true" : "false"/);
  assert.match(chapter, /preload="none"/);
  assert.match(chapter, /poster=/);
  assert.doesNotMatch(chapter, /autoplay/);
  assert.match(page, /event\.key === "ArrowRight"/);
  assert.match(page, /other !== video && !other\.paused/);
});

test("route metadata follows the three-example sequence", () => {
  const route = read("src/pages/workshop/character-mannequin/index.astro");
  const data = read("src/data/character-mannequin.ts");

  assert.match(route, /characterLooks\.map/);
  assert.match(data, /Mannequin, Outfit, and Character Continuity/);
  assert.match(data, /one outfit carrying across a different character and rendering style/);
});
