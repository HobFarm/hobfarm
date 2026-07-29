import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Workshop leads with selected outcomes before method and program depth", () => {
  const page = read("src/pages/workshop/index.astro");
  const data = read("src/data/workshop-page.ts");
  const projects = read("src/data/workshop-projects.ts");
  const photography = read("src/components/workshop/WorkshopPhotographySource.astro");
  const psygoth = read("src/components/workshop/WorkshopPsyGothLanes.astro");
  const combined = `${page}\n${data}\n${projects}\n${photography}\n${psygoth}`;

  for (const phrase of [
    "Bring the idea. Build the visual system",
    "Start with the outcome, then open the production record",
    "What can be built here",
    "A historical drawing becomes a product campaign",
    "Style DNA",
    "Character DNA",
    "Lane DNA",
    "Follow the decisions, not just the finished frame",
    "Put the photograph to work",
    "One base can still lead two lives",
    "One structure, three elemental lanes",
    "One production method. Five useful stages",
    "The Workshop does not end at the tutorial",
  ]) {
    assert.match(combined, new RegExp(phrase.replace(/[+]/g, "\\+")));
  }

  assert.ok(page.indexOf('id="selected-projects"') < page.indexOf('id="programs"'));
  assert.ok(page.indexOf('id="method"') < page.indexOf('id="programs"'));
});

test("Workshop method follows five concise production stages", () => {
  const data = read("src/data/workshop-page.ts");

  for (const title of [
    "Research",
    "Define",
    "Build",
    "Direct",
    "Finish and deliver",
  ]) {
    assert.match(data, new RegExp(`title: "${title}"`));
  }
});

test("Workshop homepage capabilities and landing grid share one selected-project source", () => {
  const page = read("src/pages/workshop/index.astro");
  const home = read("src/components/home/HomeWorkshop.astro");
  const projects = read("src/data/workshop-projects.ts");

  assert.match(page, /WorkshopProjectGrid surface="workshop"/);
  assert.match(home, /getWorkshopProject/);

  for (const id of [
    "future-carriage",
    "before-after",
    "stylefusion",
    "character-mannequin",
    "other-alice-world",
  ]) {
    assert.match(projects, new RegExp(`id: "${id}"`));
  }
});

test("Workshop uses capped Sophia and Stella media and real downstream paths", () => {
  const page = read("src/pages/workshop/index.astro");

  assert.match(page, /mediaImageUrl/);
  assert.match(page, /width, quality: 84/);
  assert.match(page, /getVisualSystem\("sophia-stella"\)/);
  assert.match(page, /Learn the character system/);
  assert.match(page, /Browse character assets on DeviantArt/);
  assert.doesNotMatch(page, /View the character pack/);
});

test("Workshop preserves complete poster and video artwork in compact frames", () => {
  const page = read("src/pages/workshop/index.astro");

  assert.match(page, /class="media-frame media-frame--compact"/);
  assert.doesNotMatch(page, /pairPoster[\s\S]{0,500}object-cover object-top/);
});

test("Workshop exposes the wide Process Film, stage transcript, and source routes", () => {
  const page = read("src/pages/workshop/index.astro");
  const component = read("src/components/workshop/WorkshopProcessFilm.astro");

  assert.match(page, /variant="wide"/);
  assert.match(page, /id="process-film"/);
  assert.match(page, /WorkshopPhotographySource/);
  assert.match(page, /WorkshopPsyGothLanes/);
  assert.match(component, /Read the complete stage transcript/);
  assert.match(component, /data-process-stage/);
  assert.match(component, /Locked/);
  assert.match(component, /Variable/);
});

test("Workshop research shelf uses authoritative sources", () => {
  const data = read("src/data/workshop-page.ts");

  for (const domain of ["disneyanimation.com", "moma.org", "adobe.com", "runwayml.com"]) {
    assert.match(data, new RegExp(domain.replace(".", "\\.")));
  }
});
