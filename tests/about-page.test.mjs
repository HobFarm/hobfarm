import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = [
  "src/pages/about/index.astro",
  "src/pages/about/index.md.ts",
  "src/data/about.ts",
  "src/components/about/AboutHero.astro",
  "src/components/about/AboutWhy.astro",
  "src/components/about/AboutCapabilityGrid.astro",
  "src/components/about/AboutProductionGrounding.astro",
  "src/components/about/AboutMethodMap.astro",
  "src/components/about/AboutSelectedWork.astro",
  "src/components/about/AboutHobFarmRoutes.astro",
  "src/components/about/AboutContactBlock.astro",
];

const source = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");

test("About page is person-first and includes the required professional routes", () => {
  for (const expected of [
    "Kris Reynolds",
    "What is HobFarm?",
    "Publisher / Digital media / Production systems",
    "Las Vegas, Nevada",
    "/articles/",
    "/workshop/",
    "/workshop/stylefusion/",
    "/workshop/before-and-after/",
    "/presents/",
    "/academy/",
    "/shop/",
    "/support/",
    "/contact/?subject=employment",
    "https://www.linkedin.com/in/krisreynoldslv/",
  ]) {
    assert.match(source, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("About page keeps direct personal contact details out of public source", () => {
  assert.doesNotMatch(source, /kris@hob\.farm/i);
  assert.doesNotMatch(source, /mailto:/i);
  assert.doesNotMatch(source, /streetAddress|telephone|phone number:\s*\+?\d/i);
});

test("About page publishes Person and Organization structured data", () => {
  assert.match(source, /"@type": "Person"/);
  assert.match(source, /"@type": "Organization"/);
  assert.match(source, /jobTitle: "Publisher and Digital Media Producer"/);
  assert.match(source, /homeLocation/);
});

test("About page uses Kris Reynolds's Hayworth Avenue photograph as responsive hero media", () => {
  assert.match(source, /getMedia\("about\.hero\.hayworth-avenue"\)/);
  assert.match(source, /about-hero-hayworth-avenue-\$\{width\}\.webp/);
  assert.match(source, /South Hayworth Avenue, just south of Beverly Boulevard/);
  assert.match(source, /looking north \/ photograph by Kris Reynolds/);
  assert.doesNotMatch(source, /temporary Workshop image/);
});

test("About page exposes stable analytics hooks without adding a vendor", () => {
  for (const event of [
    "about_hero_workshop_open",
    "about_hero_articles_open",
    "about_hero_contact_open",
    "about_hero_linkedin_open",
    "about_selected_work_open",
    "about_final_contact_open",
  ]) {
    assert.match(source, new RegExp(event));
  }
});
