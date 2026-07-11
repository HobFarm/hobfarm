import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage workshop case study explains the full character-development path", () => {
  const component = read("src/components/home/VisualSystemFeature.astro");

  for (const phrase of [
    "From a mannequin to a world",
    "Define the taste",
    "Build the mannequin",
    "Split the identity",
    "Direct the camera",
    "Compose for the screen that will show it",
    "Turn the system into things people can watch, use, and collect",
  ]) {
    assert.match(component, new RegExp(phrase));
  }
});

test("homepage workshop case study covers target aspect ratios", () => {
  const component = read("src/components/home/VisualSystemFeature.astro");

  for (const ratio of ["21:9", "16:9", "9:16", "2:3", "3:4", "4:5", "1:1"]) {
    assert.match(component, new RegExp(`ratio: "${ratio.replace(":", "\\:")}"`));
  }
});

test("homepage workshop case study keeps paid sheets capped and links the full path", () => {
  const component = read("src/components/home/VisualSystemFeature.astro");

  assert.match(component, /mediaImageUrl\(variant\.sheetPreviews\[0\]\.folder/);
  assert.match(component, /width: 900/);
  assert.match(component, /href="\/workshop\/"/);
  assert.match(component, /href="\/academy\/"/);
  assert.match(component, /href="\/shop\/sophia-stella-sheet-pack\/"/);
  assert.match(component, /class="media-frame aspect-\[3\/4\] max-h-\[30rem\]"/);
});
