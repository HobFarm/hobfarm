import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("known missing media references are removed without replacement assets", () => {
  const projects = [
    read("src/content/workshop/hobbot.md"),
    read("src/content/workshop/stylefusion.md"),
    read("src/pages/presents/hobfarm-tv/index.astro"),
    read("src/components/projects/StyleFusionProjectPage.astro"),
  ].join("\n");
  const astro = read("src/content/stack/astro.md");

  assert.doesNotMatch(projects, /pages\/home\/hero-bg-video\.mp4/);
  assert.doesNotMatch(astro, /site\/stack\/astro\.svg/);
  assert.match(astro, /Astro 6/);
});

test("HobFarm TV has no shows and invents none", () => {
  const page = read("src/pages/presents/hobfarm-tv/index.astro");

  // 3DM and Magazine Time Machine started as show concepts and became article
  // sections. They are siblings under Presents, not HobFarm TV shows, and the
  // legacy records that made them look like shows are gone. Real shows will
  // live at /presents/hobfarm-tv/shows/ when they exist.
  assert.doesNotMatch(page, /getCollection\("workshop"\)/);
  assert.doesNotMatch(page, /`\/projects\//);
  assert.doesNotMatch(page, /View show/);
  assert.match(page, /The Shows/);
});

test("Presents keeps an h2 for every series, including logo-led sections", () => {
  const page = read("src/pages/presents/index.astro");

  assert.match(page, /<h2 class:list=\{\[entry\.logo && "sr-only"\]\}>\{entry\.name\}<\/h2>/);
  assert.doesNotMatch(page, /!entry\.logo && <h2>/);
});

test("Presents series calls to action keep explicit readable colors", () => {
  const page = read("src/pages/presents/index.astro");

  assert.match(page, /\.series-cta\{[^}]*color:#ece9f5/);
  assert.match(page, /\.series-cta:hover,\.series-cta:focus-visible\{[^}]*color:#07060b/);
  assert.doesNotMatch(page, /\.series-cta\{[^}]*color:inherit/);
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
