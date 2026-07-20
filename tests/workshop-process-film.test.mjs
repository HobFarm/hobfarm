import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const manifest = JSON.parse(read("src/data/workshop-process-film.json"));

test("one manifest powers vertical and wide Workshop Process Films", () => {
  assert.equal(manifest.version, 2);
  assert.equal(manifest.stages.length, 6);
  assert.equal(manifest.variants.vertical.width, 1080);
  assert.equal(manifest.variants.vertical.height, 1920);
  assert.equal(manifest.variants.wide.width, 1920);
  assert.equal(manifest.variants.wide.height, 1080);

  assert.deepEqual(
    manifest.stages.map((stage) => stage.label),
    [
      "Write the brief",
      "Build the mannequin",
      "Define the visual language",
      "Dress the character",
      "Direct the frame",
      "Turn the character into an avatar",
    ],
  );
});

test("the canonical chain keeps Zima source, bridge, scene, and avatar media together", () => {
  const source = JSON.stringify(manifest);

  for (const asset of [
    "workshop/images/zima01.WEBP",
    "zima-neutral-mannequin-sheet-v1.png",
    "zima-visual-language-wardrobe-v1.png",
    "psygoth-zima-blue-v2.png",
    "workshop/psygoth/zima-primary.webp",
    "workshop/psygoth/zima-primary.mp4",
  ]) {
    assert.match(source, new RegExp(asset.replaceAll(".", "\\.")));
  }

  for (const stage of manifest.stages) {
    assert.ok(stage.locked.length > 0);
    assert.ok(stage.variable.length > 0);
    assert.ok(stage.timing.vertical.duration > 0);
    assert.ok(stage.timing.wide.duration > 0);
  }
});

test("the revised film uses versioned v2 outputs without invalidating v1 source plates", () => {
  assert.match(manifest.variants.vertical.videoSrc, /mannequin-to-avatar\/v2\/renders\/.+-v2\.mp4$/);
  assert.match(manifest.variants.wide.posterSrc, /mannequin-to-avatar\/v2\/posters\/.+-v2\.jpg$/);
  assert.match(JSON.stringify(manifest.stages), /mannequin-to-avatar\/v1\/stills\/zima-neutral-mannequin-sheet-v1\.png/);
});

test("Process Film component exposes controls, keyboard buttons, analytics hooks, and reduced-motion fallback", () => {
  const component = read("src/components/workshop/WorkshopProcessFilm.astro");

  for (const token of [
    "workshop_process_film_entered_viewport",
    "workshop_process_film_play",
    "workshop_process_film_pause",
    "workshop_process_film_replay",
    "workshop_process_stage_selected",
    "hobfarm:analytics",
    "aria-pressed",
    "prefers-reduced-motion: reduce",
  ]) {
    assert.match(component, new RegExp(token));
  }
});
