import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Workshop media is addressed through the central registry", () => {
  const registry = read("src/data/media-registry.ts");
  const route = read("src/pages/workshop/[program].astro");
  const landing = read("src/components/workshop/WorkshopMediaIndex.astro");

  for (const id of [
    "stylefusion.cathedral.hero",
    "stylefusion.hellcat.poster",
    "character.fashion.sheet",
    "character.generic-37.result",
    "academy.banner.video",
    "mtm.banner.video",
    "workshop.psygoth.zima.design-v2",
    "workshop.psygoth.nina.design-v2",
    "workshop.psygoth.em.design-v2",
  ]) {
    assert.match(registry, new RegExp(id.replaceAll(".", "\\.")));
  }
  assert.match(route, /getMedia/);
  assert.match(landing, /getMedia/);
  assert.doesNotMatch(landing, /https:\/\/cdn\.hob\.farm/);
});

test("StyleFusion keeps private references separate from public generated and downstream media", () => {
  const page = read("src/components/workshop/StyleFusionMediaStudies.astro");

  assert.match(page, /ReferenceRoleDeck/);
  assert.match(page, /Generated result/);
  assert.match(page, /Downstream production/);
  assert.match(page, /Complete Export text record/);
  assert.match(page, /<details class="inspector">/);
  assert.doesNotMatch(page, /approvedForPublicDisplay: true/);
  assert.doesNotMatch(page, /https:\/\/cdn\.hob\.farm/);
});

test("Character and note studies stay outside the StyleFusion application evidence", () => {
  const character = read("src/components/workshop/CharacterMannequinPage.astro");
  const characterRoute = read("src/pages/workshop/character-mannequin/index.astro");
  const notes = read("src/components/workshop/StyleCardArchive.astro");
  const route = read("src/pages/workshop/[program].astro");

  assert.match(character, /Two styles on one mannequin\. One style on two mannequins\./);
  assert.match(character, /The look survives without producing the same picture\./);
  assert.doesNotMatch(character, /The picture is the output\. The design record is the work\./);
  assert.match(characterRoute, /CharacterMannequinPage/);
  assert.match(notes, /informal style experiments/);
  assert.match(route, /program\.id !== "character-mannequin"/);
  assert.match(route, /program\.id === "workshop-notes"/);
});

test("every Workshop video declares a poster and defers loading", () => {
  const files = [
    read("src/components/workshop/StyleFusionMediaStudies.astro"),
    read("src/components/workshop/CharacterLookChapter.astro"),
    read("src/components/workshop/StyleCardArchive.astro"),
    read("src/components/workshop/WorkshopMediaIndex.astro"),
    read("src/components/workshop/WorkshopProcessFilm.astro"),
  ];

  for (const source of files) {
    const videoTags = source.match(/<video[\s\S]*?>/g) ?? [];
    assert.ok(videoTags.length > 0);
    for (const tag of videoTags) {
      assert.match(tag, /poster=/);
      assert.match(tag, /preload="none"/);
    }
  }
});
