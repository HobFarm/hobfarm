import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("known missing media references are removed without replacement assets", () => {
  const projects = [
    read("src/content/projects/hobbot.md"),
    read("src/content/projects/grimoire.md"),
    read("src/pages/projects/hobfarm-tv/index.astro"),
    read("src/pages/projects/[...slug].astro"),
  ].join("\n");
  const astro = read("src/content/stack/astro.md");

  assert.doesNotMatch(projects, /pages\/home\/hero-bg-video\.mp4/);
  assert.doesNotMatch(astro, /site\/stack\/astro\.svg/);
  assert.match(astro, /Astro 6/);
});

test("video archive links 3DM directly to its canonical Presents route", () => {
  const page = read("src/pages/video/index.astro");

  assert.match(page, /const showPath/);
  assert.match(page, /\/departments\/hobfarm-presents\/3-degrees-of-dick-miller\//);
  assert.match(page, /href=\{showPath\(show\.id\)\}/);
});

test("Presents keeps an h2 for every series, including logo-led sections", () => {
  const page = read("src/pages/departments/hobfarm-presents/index.astro");

  assert.match(page, /<h2 class:list=\{\[entry\.logo && "sr-only"\]\}>\{entry\.name\}<\/h2>/);
  assert.doesNotMatch(page, /!entry\.logo && <h2>/);
});

test("Workshop teaser is poster-first and user-controlled", () => {
  const page = read("src/pages/workshop/index.astro");
  const teaser = page.slice(page.indexOf("{pairVideo &&"), page.indexOf("</video>") + 8);

  assert.match(teaser, /poster=\{pairPoster/);
  assert.match(teaser, /controls/);
  assert.match(teaser, /preload="none"/);
  assert.doesNotMatch(teaser, /autoplay/);
});

test("product social metadata uses a direct CDN preview", () => {
  const page = read("src/pages/shop/[slug].astro");

  assert.match(page, /const socialPreview = mediaUrl/);
  assert.match(page, /image=\{socialPreview\}/);
  assert.match(page, /image: socialPreview/);
  assert.doesNotMatch(page, /image=\{preview\}/);
});

test("media inventory covers rendered source files as well as content and data", () => {
  const inventory = read("scripts/media-inventory.mjs");

  for (const root of [
    "src/content",
    "src/data",
    "src/pages",
    "src/components",
    "src/layouts",
  ]) {
    assert.match(inventory, new RegExp(root.replace("/", "\\/")));
  }
  assert.match(inventory, /scanRoots,/);
  assert.match(inventory, /row\.id = String\(index \+ 1\)/);
});
