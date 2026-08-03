import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage presents the six final HobFarm sections", () => {
  const homepage = read("src/pages/index.astro");
  const component = read("src/components/home/SiteSections.astro");
  const data = read("src/data/site-hierarchy.ts");

  assert.match(homepage, /<SiteSections \/>/);
  assert.match(component, /Six ways into HobFarm/);
  assert.match(component, /Browse by format/);
  assert.ok(homepage.indexOf("<HomeCreativeInquiry />") < homepage.indexOf("<SiteSections />"));

  for (const label of ["Articles", "HobFarm Presents", "Workshop", "Academy", "Shop", "About & Support"]) {
    assert.match(data, new RegExp(`name: "${label.replace("&", "&")}"`));
  }
  assert.match(data, /parent: "presents"[\s\S]*name: "Funnies"|name: "Funnies"[\s\S]*parent: "presents"/);
  assert.match(data, /parent: "workshop"[\s\S]*name: "Cute & Corrupted"|name: "Cute & Corrupted"[\s\S]*parent: "workshop"/);
});

test("homepage separates sections from content formats", () => {
  const data = read("src/data/site-sections.ts");

  for (const label of ["Articles", "Gallery", "Video", "Support"]) {
    assert.match(data, new RegExp(`label: "${label}"`));
  }

  assert.match(data, /3 Degrees of Dick Miller/);
  assert.match(data, /images, two-packs, character sheets, hero shots, posters, videos, commissions/);
});

test("homepage offers clear paths to explore, learn, or hire HobFarm", () => {
  const inquiry = read("src/components/home/HomeCreativeInquiry.astro");

  assert.match(inquiry, /Use the work at the level you need\./);
  assert.match(inquiry, /scene-specific VFX and AI-assisted visual production for independent film/);
  assert.match(inquiry, /Discuss a custom project/);

  for (const href of ["/workshop/", "/academy/", "/services/"]) {
    assert.match(inquiry, new RegExp(`href: "${href.replaceAll("/", "\\/")}"`));
  }

  assert.doesNotMatch(inquiry, /const audiences/);
});
