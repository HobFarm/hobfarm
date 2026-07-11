import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage presents the five broad HobFarm sections", () => {
  const homepage = read("src/pages/index.astro");
  const component = read("src/components/home/SiteSections.astro");
  const data = read("src/data/site-sections.ts");

  assert.match(homepage, /<SiteSections \/>/);
  assert.match(component, /Five doors into the same studio/);
  assert.match(component, /Browse by format/);

  for (const label of ["HobFarm Presents", "Funnies", "Workshop", "Academy", "Shop"]) {
    assert.match(data, new RegExp(`label: "${label}"`));
  }
});

test("homepage separates sections from content formats", () => {
  const data = read("src/data/site-sections.ts");

  for (const label of ["Articles", "Gallery", "Characters", "Video", "Support"]) {
    assert.match(data, new RegExp(`label: "${label}"`));
  }

  assert.match(data, /3 Degrees of Dick Miller/);
  assert.match(data, /images, two-packs, character sheets, hero shots, posters, videos, commissions/);
});
