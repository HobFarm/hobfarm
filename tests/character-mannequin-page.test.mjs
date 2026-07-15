import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Character / Mannequin has a dedicated process-led route", () => {
  const route = read("src/pages/workshop/character-mannequin/index.astro");
  const page = read("src/components/workshop/CharacterMannequinPage.astro");
  const combined = `${route}\n${page}`;

  for (const phrase of [
    "One mannequin. Three looks. Three worlds.",
    "The Character Assembly Line",
    "The face stays. The job changes.",
    "The picture is the output. The design record is the work.",
    "Buy the finished piece, or commission the whole build.",
    "Need a character that does not exist yet?",
  ]) {
    assert.match(combined, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const removed of [
    "A working frame for the next pass.",
    "From Generic Female #37 to a Designed Character",
    "The program is ready for its first entry.",
  ]) {
    assert.doesNotMatch(combined, new RegExp(removed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Character hero stacks landscape artwork beneath the headline", () => {
  const page = read("src/components/workshop/CharacterMannequinPage.astro");

  assert.match(page, /heroGraphic\.width >= page\.heroGraphic\.height \? "horizontal" : "vertical"/);
  assert.match(page, /`hero-grid--\$\{heroArrangement\}`/);
  assert.match(page, /hero-grid--horizontal \.hero-copy h1 \{ width: 100%; max-width: none;/);
  assert.match(page, /hero-grid--vertical \{ grid-template-columns:/);
  assert.doesNotMatch(page, /\.hero-grid \{ grid-template-columns:/);
});

test("Character / Mannequin manifest covers the verified production media", () => {
  const data = read("src/data/character-mannequin.ts");

  for (const file of [
    "mannequin1-portrait.png",
    "mannequin1-character-sheet.png",
    "mannequin2-portrait.png",
    "mannequin2-character-sheet.png",
    "outfit1.png",
    "outfit2.png",
    "outfit3.png",
    "mannequin-outfit1.png",
    "mannequin-outfit2.png",
    "mannequin-outfit3.png",
    "character-scene-outfit1.png",
    "character-scene-outfit2.png",
    "character-scene-outfit3.png",
    "character2-scene-outfit3.mp4",
  ]) {
    assert.match(data, new RegExp(file.replaceAll(".", "\\.")));
  }

  assert.match(data, /cdn\.gallery/);
  assert.match(data, /mannequinLibraryGraphic: null/);
  assert.match(data, /productStatus: "coming-soon"/);
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
  assert.match(page, /prefers-reduced-motion/);
  assert.match(page, /other !== video && !other\.paused/);
});

test("Character commerce keeps unverified offers non-buyable", () => {
  const data = read("src/data/character-mannequin.ts");
  const shelf = read("src/components/workshop/CharacterOfferShelf.astro");
  const contact = read("src/components/ContactForm.tsx");

  assert.match(data, /status: "coming-soon"/);
  assert.match(data, /status: "inquiry"/);
  assert.match(shelf, /offer\.status === "inquiry"/);
  assert.doesNotMatch(shelf, /externalUrl/);
  assert.match(contact, /custom-character/);
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
