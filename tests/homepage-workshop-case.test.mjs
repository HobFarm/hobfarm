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
    "Start with an idea. Build the rules that make it work",
    "Build a character",
    "Put a photograph to work",
    "Give every reference a job",
    "Build the tool",
    "The latest Workshop Notes",
    "Compact case study",
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

  for (const href of [
    "/workshop/character-mannequin/",
    "/workshop/before-and-after/",
    "/workshop/stylefusion/",
    "/workshop/workshop-notes/",
    "/workshop/#process-film",
  ]) {
    assert.match(component, new RegExp(href.replaceAll("/", "\\/")));
  }

  for (const token of [
    "photoSource",
    "photoAfter",
    "neutral",
    "zima",
    "styleFusion",
    "cuteCorrupted",
    "recentHero",
  ]) {
    assert.match(component, new RegExp(token));
  }
});
