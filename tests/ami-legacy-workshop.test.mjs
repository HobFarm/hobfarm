import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Ami's durable intro video is registered without a temporary provider URL", () => {
  const registry = read("src/data/media-registry.ts");

  assert.match(registry, /"workshop\.ami-legacy\.intro\.video"/);
  assert.match(registry, /ami-legacy\/Ami_Intro_with_captions\.mp4/);
  assert.match(registry, /"active", "images\/ami01\.WEBP", 1080, 1920/);
  assert.doesNotMatch(registry, /app\.heygen\.com\/videos\/ami-intro/);
  assert.doesNotMatch(registry, /[?&](?:Expires|Signature|Key-Pair-Id)=/i);
});

test("Legacy has a complete Workshop case study with the intro, design rules, and source library", () => {
  const page = read("src/pages/workshop/future-carriage/index.astro");

  for (const id of [
    "workshop.ami-legacy.intro.video",
    "workshop.ami-legacy.hero",
    "workshop.ami-legacy.model-3917.vehicle",
    "workshop.ami-legacy.autonomous-coach",
    "workshop.ami-legacy.history.gig-3917",
    "workshop.ami-legacy.history.diligence",
    "workshop.ami-legacy.history.phaeton",
    "workshop.ami-legacy.history.vis-a-vis",
  ]) {
    assert.match(page, new RegExp(id.replaceAll(".", "\\.")));
  }

  assert.match(page, /Future Carriage: A Concept Campaign from Historical Carriage Design/);
  assert.match(page, /No horses/);
  assert.match(page, /Two wheels/);
  assert.match(page, /Four wheels/);
  assert.match(page, /When the historical number is legible, it becomes the model name/);
  assert.match(page, /<video/);
  assert.match(page, /poster=/);
  assert.match(page, /preload="none"/);
  assert.doesNotMatch(page.match(/<video[\s\S]*?>/)?.[0] ?? "", /autoplay/);
  assert.match(page, /uploadDate: "2026-07-22"/);
  assert.match(page, /duration: "PT36S"/);
  assert.match(page, /Historical source/);
  assert.match(page, /Product study/);
  assert.match(page, /Campaign deliverables/);
  assert.match(page, /Production record/);
  assert.match(page, /href="https:\/\/picryl\.com\/"/);
  assert.match(page, /PICRYL source \/ Public domain \/ CC0 1\.0/);
  assert.match(page, /href="https:\/\/www\.metmuseum\.org\/art\/collection\/search\/378670"/);
  assert.match(page, /The Met Open Access \/ Public domain/);
  assert.doesNotMatch(page, /attribution pending/i);
  assert.match(page, /href="\/contact\/\?subject=creative-project"/);
});

test("Workshop and the avatar host study lead readers into Ami's Legacy follow-up", () => {
  const index = read("src/components/workshop/WorkshopMediaIndex.astro");
  const hostStudy = read("src/pages/workshop/avatar-host/index.astro");

  assert.match(index, /workshop\.ami-legacy\.hero/);
  assert.match(index, /href="\/workshop\/future-carriage\/"/);
  assert.match(index, /The Electric Future Wagon/);
  assert.match(hostStudy, /href: "\/workshop\/future-carriage\/"/);
  assert.match(hostStudy, /36-second HobFarm introduction/);
  assert.match(hostStudy, /Open the full Ami \/ Legacy study/);
});
