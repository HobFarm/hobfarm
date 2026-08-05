import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Character / Mannequin is a five-section provenance and continuity demonstration", () => {
  const page = read("src/components/workshop/CharacterMannequinPage.astro");

  for (const phrase of [
    "Give the character its own base.",
    "The base now belongs to the examples on the page.",
    "The character sheets guessed the outfits.",
    "The outfit test starts after the identity lock.",
    "The look survives without producing the same picture.",
    "This page shows the result. A course can teach the mechanics.",
  ]) {
    assert.match(page, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.equal([...page.matchAll(/^\s*<section\b/gm)].length, 5);
});

test("the story separates portrait, clean base, inferred sheet, and directed outfit stages", () => {
  const page = read("src/components/workshop/CharacterMannequinPage.astro");
  const data = read("src/data/character-mannequin.ts");

  const pageOrder = [
    page.indexOf('label: "Style files → portraits"'),
    page.indexOf('label: "Portraits → clean bases"'),
    page.indexOf('label: "Later sheet inference"'),
    page.indexOf('label: "Directed outfit tests"'),
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
  assert.match(chapter, /The first two examples restyle the clean blonde base/);
  assert.match(chapter, /keeps the separately defined black leather look/);
  assert.match(chapter, /Neither inferred character-sheet outfit is part of the identity lock/);
  assert.match(chapter, /Continuity note\./);
});

test("the actual sheet tool is named while unrelated sales and archive material stays absent", () => {
  const combined = [
    read("src/components/workshop/CharacterMannequinPage.astro"),
    read("src/data/character-mannequin.ts"),
  ].join("\n");

  assert.match(combined, /ElevenLabs character-sheet workflow/);
  assert.match(combined, /AI relics/);

  for (const removed of [
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

test("the new portrait-led identity bases replace the unrelated generic base", () => {
  const data = read("src/data/character-mannequin.ts");
  const page = read("src/components/workshop/CharacterMannequinPage.astro");

  assert.match(data, /heroGraphic:\s*blondeIdentityBase/);
  assert.match(data, /blonde-identity-base-v2\.png/);
  assert.match(data, /green-zombie-identity-base-v2\.png/);
  assert.match(data, /mannequin1-portrait\.png/);
  assert.match(data, /mannequin2-portrait\.png/);
  assert.doesNotMatch(data, /clean-base-001-sheet\.png/);
  assert.match(page, /data-lightbox-group="character-sheet-library"/);
  assert.match(page, /<Lightbox client:only="react" \/>/);

  assert.ok(readFileSync(new URL("../public/media/workshop/character-mannequin/blonde-identity-base-v2.png", import.meta.url)).length > 1_000_000);
  assert.ok(readFileSync(new URL("../public/media/workshop/character-mannequin/green-zombie-identity-base-v2.png", import.meta.url)).length > 1_000_000);
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
  assert.match(data, /separating model-inferred sheet clothing from directed outfit and scene experiments/);
});
