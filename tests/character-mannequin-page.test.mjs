import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Character / Mannequin follows the nine-section method structure", () => {
  const route = read("src/pages/workshop/character-mannequin/index.astro");
  const page = read("src/components/workshop/CharacterMannequinPage.astro");
  const combined = `${route}\n${page}`;

  for (const phrase of [
    "The sheet is the constant.",
    "Lock the format. Change the layers. Prove the output.",
    "Act 1 / The sheet",
    "Act 2 / The input",
    "Act 3 / The transformation",
    "Act 4 / The series",
    "The pipeline matters more than the app.",
    "Finished files will appear when a verified release exists.",
    "Continue through HobFarm",
  ]) {
    assert.match(combined, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.equal([...page.matchAll(/^\s*<section\b/gm)].length, 9);
});

test("repeated stage, decision, lock, and offer markup is removed", () => {
  const page = read("src/components/workshop/CharacterMannequinPage.astro");
  const chapter = read("src/components/workshop/CharacterLookChapter.astro");
  const data = read("src/data/character-mannequin.ts");

  for (const removed of [
    "Fixed geometry",
    "Identity slots",
    "Wardrobe system",
    "Camera coverage",
    "Scene direction",
    "Motion proof",
    "The picture is the output. The design record is the work.",
    "Stayed locked",
    "characterOffers",
    "designDecisions",
    "themedCharacter",
  ]) {
    assert.doesNotMatch(`${page}\n${chapter}\n${data}`, new RegExp(removed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.equal(existsSync(new URL("../src/components/workshop/CharacterOfferShelf.astro", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/components/workshop/DesignDecisionMatrix.astro", import.meta.url)), false);
  assert.equal((page.match(/character_page_commission_cta/g) ?? []).length, 1);
});

test("the four look chapters share one data shape and distinguish styling from identity", () => {
  const data = read("src/data/character-mannequin.ts");
  const page = read("src/components/workshop/CharacterMannequinPage.astro");
  const chapter = read("src/components/workshop/CharacterLookChapter.astro");

  assert.match(data, /axis: "styling"/);
  assert.match(data, /axis: "identity"/);
  assert.match(data, /files: "coming-soon"/);
  assert.match(data, /outfit: MediaRef/);
  assert.match(data, /character: MediaRef/);
  assert.match(data, /scene: MediaRef/);
  assert.match(data, /motion: MediaRef/);
  assert.doesNotMatch(data, /locked: string\[\]/);
  assert.match(page, /characterLooks\.map\(\(look\) => <CharacterLookChapter look=\{look\}/);
  assert.match(chapter, /look\.axis === "identity"/);
});

test("the sheet and Cyberpop specification use the locked ten-field schema", () => {
  const data = read("src/data/character-mannequin.ts");
  const page = read("src/components/workshop/CharacterMannequinPage.astro");

  for (const field of ["Palette", "Skin", "Hair", "Eyes", "Garment", "Materials", "Hardware", "Footwear", "Accessories", "Motif"]) {
    assert.match(data, new RegExp(`"${field}"`));
  }
  assert.match(data, /Hardware: "None"/);
  assert.match(data, /Accessories: "None"/);
  assert.match(data, /Motif: "None"/);
  assert.match(page, /characterSpecFields\.map/);
  assert.match(page, /spec-diff__row/);
  assert.match(page, /row\.changed/);
});

test("new Character / Mannequin assets are registered with matched dimensions", () => {
  const data = read("src/data/character-mannequin.ts");

  for (const file of [
    "clean-base-001-sheet.png",
    "cyberpop-y2kfut-001-sheet.png",
    "cyberpop-bauhaus-character.png",
    "cyberpop-bauhaus-scene.png",
  ]) {
    assert.match(data, new RegExp(file.replaceAll(".", "\\.")));
  }
  assert.equal((data.match(/1672,\s*\n\s*941,/g) ?? []).length >= 4, true);
  assert.equal((data.match(/941,\s*\n\s*1672,/g) ?? []).length >= 2, true);
  assert.match(data, /cdn\.gallery/);
});

test("sheet transformation uses the existing comparison primitive and full-size fallbacks", () => {
  const page = read("src/components/workshop/CharacterMannequinPage.astro");

  assert.match(page, /import BeforeAfterCompare/);
  assert.match(page, /aspect="aspect-\[1672\/941\]"/);
  assert.match(page, /Open clean base full size/);
  assert.match(page, /Open resolved sheet full size/);
  assert.match(page, /target="_blank"/);
});

test("Character stages are progressive, keyboard-addressable, and poster-first", () => {
  const chapter = read("src/components/workshop/CharacterLookChapter.astro");
  const page = read("src/components/workshop/CharacterMannequinPage.astro");

  assert.match(chapter, /role="tablist"/);
  assert.match(chapter, /role="tab"/);
  assert.match(chapter, /aria-selected=/);
  assert.match(chapter, /role="tabpanel"/);
  assert.match(chapter, /preload="none"/);
  assert.match(chapter, /poster=/);
  assert.doesNotMatch(chapter, /autoplay/);
  assert.match(page, /event\.key === "ArrowRight"/);
  assert.match(page, /other !== video && !other\.paused/);
});

test("Character workflow film is poster-first and respects reduced motion", () => {
  const page = read("src/components/workshop/CharacterMannequinPage.astro");
  const registry = read("src/data/media-registry.ts");

  assert.match(page, /Lock the format\. Change the layers\. Prove the output\./);
  assert.match(page, /<video controls muted playsinline preload="none" poster=/);
  assert.doesNotMatch(page, /<video[^>]*autoplay/);
  assert.match(page, /prefers-reduced-motion:reduce/);
  assert.match(page, /\.workflow-film__media video\{display:none\}/);
  assert.match(page, /\.workflow-film__still\{display:block\}/);

  for (const file of ["mannequin-workflow-film.mp4", "mannequin-workflow-film-poster.png"]) {
    assert.match(registry, new RegExp(file.replaceAll(".", "\\.")));
  }
});

test("research copy remains an explicit editorial placeholder", () => {
  const page = read("src/components/workshop/CharacterMannequinPage.astro");

  assert.match(page, /<details class="research-record">/);
  assert.match(page, /Editorial placeholder\./);
  assert.match(page, /final rewrite and attribution pass/);
  assert.doesNotMatch(page, /Aesthetics Wiki/);
});

test("Character page links the tool-agnostic method to both supplied Flows", () => {
  const data = read("src/data/character-mannequin.ts");
  const page = read("src/components/workshop/CharacterMannequinPage.astro");

  assert.match(data, /kRlIkuiEdy0X1wC4n56O/);
  assert.match(data, /eSYyxDGUCh4xbWjUuBKs/);
  assert.match(data, /try\.elevenlabs\.io\/xyeeptwpw4d6/);
  assert.match(page, /The pipeline matters more than the app\./);
  assert.match(page, /rel="sponsored nofollow noopener noreferrer"/);
});
