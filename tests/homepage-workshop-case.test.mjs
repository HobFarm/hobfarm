import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage replaces the long Sophia and Stella feature with a broad Workshop overview", () => {
  const homepage = read("src/pages/index.astro");
  const component = read("src/components/home/HomeWorkshop.astro");

  assert.match(homepage, /<HomeWorkshop \/>/);
  assert.doesNotMatch(homepage, /<VisualSystemFeature \/>/);

  for (const phrase of [
    "Start with an idea. Build the visual system that makes it work",
    "Five projects. Five different production problems",
    "One identity, from brief to motion",
    "Research. Define. Build. Direct. Finish",
    "Enter the Workshop",
    "Start a project",
  ]) {
    assert.match(component, new RegExp(phrase));
  }
});

test("homepage Process Film is poster-first and pauses outside the viewport", () => {
  const component = read("src/components/workshop/WorkshopProcessFilm.astro");
  const homepage = read("src/components/home/HomeWorkshop.astro");

  assert.match(homepage, /variant="vertical"/);
  assert.match(homepage, /autoplay=\{true\}/);
  assert.match(component, /data-src=\{film\.videoSrc\}/);
  assert.match(component, /preload="none"/);
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /video\.pause\(\)/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /process-film__static/);
  assert.match(component, /src=\{film\.posterSrc\}/);
  assert.match(component, /data-manual-playback="true"/);
  assert.match(component, /loadVideo\(manualPlayback\)/);
  assert.doesNotMatch(component, /if \(!video \|\| reduceMotion\) return;/);
});

test("homepage Workshop paths use diverse media and real routes", () => {
  const component = read("src/components/home/HomeWorkshop.astro");
  const projects = read("src/data/workshop-projects.ts");
  const combined = `${component}\n${projects}`;

  for (const href of [
    "/workshop/character-mannequin/",
    "/workshop/before-and-after/",
    "/workshop/stylefusion/",
    "/workshop/ami-legacy/",
    "/departments/hobfarm-presents/other-alice-adventures/world-guide/",
    "/workshop/#process-film",
  ]) {
    assert.match(combined, new RegExp(href.replaceAll("/", "\\/")));
  }

  for (const token of [
    "workshop.ami-legacy.model-3917.vehicle",
    "before-after.shit-to-shine.source",
    "workshop.process.zima.mannequin",
    "stylefusion.banner.image",
    "oaa-map-wonderland-living-atlas",
  ]) {
    assert.match(combined, new RegExp(token));
  }
});
