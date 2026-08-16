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
  assert.ok(homepage.indexOf("<HomeWorkshop />") < homepage.indexOf("<SiteSections />"));

  for (const label of ["Articles", "HobFarm Presents", "Workshop", "Academy", "Shop", "About & Support"]) {
    assert.match(data, new RegExp(`name: "${label.replace("&", "&")}"`));
  }
  assert.match(data, /parent: "presents"[\s\S]*name: "Funnies"|name: "Funnies"[\s\S]*parent: "presents"/);
  const primary = data.slice(data.indexOf("export const primaryWorkshopPrograms"), data.indexOf("export const historicalWorkshopPrograms"));
  const historical = data.slice(data.indexOf("export const historicalWorkshopPrograms"), data.indexOf("export const workshopProgramDefinitions"));
  assert.doesNotMatch(primary, /cute-corrupted|Cute & Corrupted|EZIZE Origins/);
  assert.match(historical, /id: "cute-corrupted"[\s\S]*name: "EZIZE Origins"/);
  assert.match(historical, /inNav: false[\s\S]*status: "historical"/);
});

test("homepage separates sections from content formats", () => {
  const data = read("src/data/site-sections.ts");

  for (const label of ["Articles", "Gallery", "Video", "Support"]) {
    assert.match(data, new RegExp(`label: "${label}"`));
  }

  assert.match(data, /3 Degrees of Dick Miller/);
  assert.match(data, /Verified direct products and marketplace shelves/);
  assert.match(data, /correct shelf for HobFarm products/);
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
