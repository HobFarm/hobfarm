import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Workshop is organized around visual development and the HobFarm method", () => {
  const page = read("src/pages/workshop/index.astro");
  const data = read("src/data/workshop-page.ts");
  const combined = `${page}\n${data}`;

  for (const phrase of [
    "Build the visual language before you build the image",
    "Specs preserve intent. Renders are snapshots",
    "Style DNA",
    "Character DNA",
    "Lane DNA",
    "One mannequin. Two lives. A complete media system",
    "A repeatable path from influence to finished work",
    "The Workshop does not end at the tutorial",
  ]) {
    assert.match(combined, new RegExp(phrase.replace(/[+]/g, "\\+")));
  }
});

test("Workshop method follows six durable production stages", () => {
  const data = read("src/data/workshop-page.ts");

  for (const title of [
    "Collect the taste",
    "Define the style DNA",
    "Lock the character",
    "Create meaningful variation",
    "Direct the frame",
    "Build the media packet",
  ]) {
    assert.match(data, new RegExp(`title: "${title}"`));
  }
});

test("Workshop uses capped Sophia and Stella media and real downstream paths", () => {
  const page = read("src/pages/workshop/index.astro");

  assert.match(page, /mediaImageUrl/);
  assert.match(page, /width, quality: 84/);
  assert.match(page, /visualSystemPath\(system\.slug\)/);
  assert.match(page, /\/shop\/sophia-stella-sheet-pack\//);
  assert.match(page, /\/academy\//);
});

test("Workshop preserves complete poster and video artwork in compact frames", () => {
  const page = read("src/pages/workshop/index.astro");

  assert.match(page, /class="media-frame media-frame--compact"/);
  assert.doesNotMatch(page, /pairPoster[\s\S]{0,500}object-cover object-top/);
});

test("Workshop research shelf uses authoritative sources", () => {
  const data = read("src/data/workshop-page.ts");

  for (const domain of ["disneyanimation.com", "moma.org", "adobe.com", "runwayml.com"]) {
    assert.match(data, new RegExp(domain.replace(".", "\\.")));
  }
});
