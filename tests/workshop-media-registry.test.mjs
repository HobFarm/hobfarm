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
  const character = read("src/components/workshop/CharacterMannequinStudies.astro");
  const notes = read("src/components/workshop/StyleCardArchive.astro");
  const route = read("src/pages/workshop/[program].astro");

  assert.match(character, /From Generic Female #37 to a Designed Character/);
  assert.match(character, /This is a decision study, not a StyleFusion case/);
  assert.match(notes, /informal style experiments/);
  assert.match(route, /program\.id === "character-mannequin"/);
  assert.match(route, /program\.id === "workshop-notes"/);
});

test("every Workshop video declares a poster and defers loading", () => {
  const files = [
    read("src/components/workshop/StyleFusionMediaStudies.astro"),
    read("src/components/workshop/CharacterMannequinStudies.astro"),
    read("src/components/workshop/StyleCardArchive.astro"),
    read("src/components/workshop/WorkshopMediaIndex.astro"),
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
