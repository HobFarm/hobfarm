import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const sha256 = (path) =>
  createHash("sha256")
    .update(readFileSync(new URL(`../${path}`, import.meta.url)))
    .digest("hex");

test("supplied mannequin and Wonderland graphics remain exact local source files", () => {
  assert.equal(
    sha256("public/media/workshop/character-mannequin/mannequin-to-character-workflow.png"),
    "ecdd95c39da7c3ddc9fa0dbe8654b9235ea4ee87b1744fe246cbb175a917ba4b",
  );
  assert.equal(
    sha256("public/media/other-alice/other-alice-wonderland-world-map.png"),
    "595e1117dd8c1d054ab229b8c11201a0923a68e67c4ed909b2ef02b5be3023b6",
  );

  const registry = read("src/data/media-registry.ts");
  assert.match(registry, /workshop\.character-mannequin\.workflow/);
  assert.match(registry, /other-alice\.wonderland\.world-map/);
});

test("homepage gives the publication one compact architecture explanation", () => {
  const homepage = read("src/pages/index.astro");
  const component = read("src/components/home/HomeWorkshop.astro");
  const ezize = read("src/components/home/HomeEzizeFeature.astro");

  assert.match(homepage, /<HomeWorkshop \/>/);
  assert.equal((homepage.match(/<HomeWorkshop \/>/g) ?? []).length, 1);
  assert.match(homepage, /<HomeEzizeFeature \/>/);
  assert.ok(homepage.indexOf("<MagazineFrontPage />") < homepage.indexOf("<HomeEzizeFeature />"));
  assert.ok(homepage.indexOf("<HomeEzizeFeature />") < homepage.indexOf("<HomeSectionOverview />"));
  assert.doesNotMatch(homepage, /HomePublicationBridge|HomeSupportBand/);
  assert.doesNotMatch(homepage, /<VisualSystemFeature \/>/);

  for (const phrase of [
    "How HobFarm works",
    "Useful work can stand alone and still connect",
    "Articles are the largest public reading surface",
    "The underlying system can begin anywhere",
    "Explore the Workshop",
    "How the HobFarm system works",
  ]) {
    assert.match(component, new RegExp(phrase.replace(/[.]/g, "\\.")));
  }
  assert.match(ezize, /EZIZE/);
  assert.match(ezize, /Insert one coin/);
  assert.match(component, /WorkshopNodeMesh compact/);
  assert.doesNotMatch(component, /EZIZE|current-project/);
  assert.doesNotMatch(component, /WorkshopProjectGrid|WorkshopMethodStrip/);
});

test("the long Process Film is removed from the compact hub and homepage", () => {
  const workshop = read("src/pages/workshop/index.astro");
  const homepage = read("src/components/home/HomeWorkshop.astro");

  assert.doesNotMatch(homepage, /WorkshopProcessFilm|autoplay/);
  assert.doesNotMatch(workshop, /WorkshopProcessFilm|id="process-film"/);
  assert.match(workshop, /Selected projects/);
  assert.match(workshop, /Projects grow\. Build them so they can\./);
});

test("homepage Workshop summary and promoted EZIZE release link to their real routes", () => {
  const component = read("src/components/home/HomeWorkshop.astro");
  const ezize = read("src/components/home/HomeEzizeFeature.astro");
  const projects = read("src/data/workshop-projects.ts");

  for (const href of ["/workshop/", "/workshop/projects/hobfarm/"]) {
    assert.match(component, new RegExp(href.replaceAll("/", "\\/")));
  }

  assert.match(ezize, /href="\/ezize\/"/);
  assert.match(ezize, /https:\/\/ezize\.hob\.farm\//);
  assert.match(ezize, /ezize-hero\.png/);
  assert.match(ezize, /ezize-efb0ab2e5ad02c37\.png/);
  assert.match(ezize, /ezize-d6b613e86a33f971\.png/);
  assert.match(ezize, /ezize-76bd76d0a0822404\.png/);
  assert.match(component, /WorkshopNodeMesh compact/);
  assert.doesNotMatch(component, /WorkshopProjectGrid|WorkshopMethodStrip/);

  for (const field of [
    "startingMaterial",
    "productionProblem",
    "stages",
    "possibleOutputs",
    "approvedAssets",
    "visualVariant",
  ]) {
    assert.match(projects, new RegExp(field));
  }
});

test("Other Alice and Future Carriage proof remains available without dominating the homepage", () => {
  const homepage = read("src/pages/index.astro");
  const alice = read("src/components/home/HomeOtherAlice.astro");
  const frontPage = read("src/components/home/MagazineFrontPage.astro");
  const features = read("src/data/homepage-features.ts");
  const carriage = read("src/components/home/HomeFutureCarriage.astro");

  assert.doesNotMatch(homepage, /<HomeOtherAlice \/>/);
  assert.doesNotMatch(homepage, /<HomeFutureCarriage \/>/);
  assert.ok(homepage.indexOf("<HomeWorkshop />") < homepage.indexOf("<SiteSections />"));
  assert.match(alice, /Wonder Machine remembers what happened/);
  assert.match(alice, /persistent story shaped by what the player notices/);
  assert.match(alice, /other-alice\.alice\.first-home/);
  assert.doesNotMatch(alice, /other-alice\.wonderland\.world-map/);
  assert.match(frontPage, /href="\/presents\/"/);
  assert.match(features, /other-alice\.alice\.workshop/);
  assert.match(carriage, /Self-directed HobFarm concept campaign/);
  assert.match(carriage, /workshop\.ami-legacy\.hero/);
  assert.match(carriage, /workshop\.ami-legacy\.history\.gig-3917/);
  assert.match(carriage, /workshop\.ami-legacy\.model-3917\.vehicle/);
  assert.match(carriage, /workshop\.ami-legacy\.history\.diligence/);
  assert.match(carriage, /workshop\.ami-legacy\.autonomous-coach/);
  assert.match(carriage, /workshop\.ami-legacy\.model-3917\.ami/);
  assert.match(carriage, /Avatar spokesperson/);
  assert.doesNotMatch(carriage, /redwood-(?:lifestyle|profile)/);
  assert.ok(
    carriage.indexOf("workshop.ami-legacy.history.diligence") <
      carriage.indexOf("workshop.ami-legacy.history.gig-3917"),
  );
  assert.match(carriage, /future-carriage__pair/);
  assert.match(carriage, /Open the complete case study/);
});

test("creative-project inquiry is contextual and accepted by the contact backend", () => {
  const page = read("src/pages/contact.astro");
  const form = read("src/components/ContactForm.tsx");
  const endpoint = read("functions/api/contact.ts");

  assert.match(page, /Tell me what you're trying to make/);
  assert.match(page, /starting material, the result you want, the formats that would be useful, your timing/);
  assert.match(page, /initialSubject=\{requestedSubject\}/);
  assert.match(page, /Employment and professional inquiries/);
  assert.match(page, /Customer and security help/);
  assert.match(form, /Describe private material without pasting it into the form/);
  assert.match(endpoint, /"creative-project"/);
  assert.match(endpoint, /"custom-character"/);
});

test("homepage proof and project paths expose stable analytics hooks", () => {
  const files = [
    read("src/components/home/MagazineFrontPage.astro"),
    read("src/components/home/HomeEzizeFeature.astro"),
    read("src/components/home/HomeWorkshop.astro"),
    read("src/components/workshop/WorkshopProjectGrid.astro"),
    read("src/components/home/HomeOtherAlice.astro"),
    read("src/components/home/HomeFutureCarriage.astro"),
    read("src/components/home/HomeCreativeInquiry.astro"),
    read("src/components/home/SiteSections.astro"),
    read("src/components/ContactForm.tsx"),
  ].join("\n");

  for (const event of [
    "homepage_hero_read",
    "homepage_hero_workshop",
    "homepage_cover_story_open",
    "homepage_project_open",
    "homepage_projects_open",
    "homepage_other_alice_open",
    "homepage_grimoire_open",
    "homepage_future_carriage_open",
    "homepage_project_inquiry_begin",
    "homepage_directory_open",
    "creative_project_form_submit",
  ]) {
    assert.match(files, new RegExp(`data-event[^\\n]*${event}|${event}[^\\n]*data-event`));
  }
});
