import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("visual lab is noindex, outside the sitemap, and built from production components", () => {
  const page = read("src/pages/workshop/visual-lab/index.astro");
  const config = read("astro.config.mjs");

  assert.match(page, /noindex/);
  assert.match(config, /"\/workshop\/visual-lab\/"/);
  assert.match(config, /"\/workshop\/stylefusion\/prototype\/"/);
  assert.match(config, /!privatePrototypePaths\.has\(pathname\)/);
  for (const component of [
    "SheetToHero",
    "VisualSystemMap",
    "ProductAssetStack",
    "AssetManifest",
    "ToolRouteNote",
    "AmbientVideoFrame",
    "RelatedContentRail",
  ]) {
    assert.match(page, new RegExp(component));
  }
});

test("visual lab uses existing Sophia and Stella data and capped previews", () => {
  const page = read("src/pages/workshop/visual-lab/index.astro");

  assert.match(page, /getVisualSystem\("sophia-stella"\)/);
  assert.match(page, /mediaImageUrl/);
  assert.match(page, /width: 1200/);
  assert.match(page, /buyerFile: true/);
  assert.doesNotMatch(page, /J10\.webp/);
  assert.doesNotMatch(page, /ChatGPT Image Jul/);
});

test("Sophia and Stella are labeled as a visual system, not a StyleFusion run", () => {
  const page = read("src/pages/workshop/visual-lab/index.astro");
  const map = read("src/components/workshop/VisualSystemMap.astro");

  assert.match(page, /VisualSystemMap/);
  assert.match(page, /title="Visual system source map"/);
  assert.doesNotMatch(page, /StyleFusionMap|StyleFusion source-role map/);
  assert.doesNotMatch(map, /StyleFusion/);
});

test("comparison and video enhancements preserve keyboard, touch, reduced-motion, and lazy behavior", () => {
  const compare = read("src/components/ui/BeforeAfterCompare.astro");
  const video = read("src/components/media/AmbientVideoFrame.astro");

  assert.match(compare, /role="slider"/);
  assert.match(compare, /ArrowLeft/);
  assert.match(compare, /pointerdown/);
  assert.match(compare, /touch-action: pan-y/);
  assert.match(compare, /prefers-reduced-motion: reduce/);
  assert.match(video, /preload="none"/);
  assert.match(video, /data-video-src=\{src\}/);
  assert.match(video, /button\.addEventListener\("click"/);
  assert.match(video, /<noscript>/);
  assert.doesNotMatch(video, /autoplay/);
});

test("asset presentation names buyer files without loading them", () => {
  const stack = read("src/components/workshop/ProductAssetStack.astro");
  const manifest = read("src/components/workshop/AssetManifest.astro");

  assert.match(stack, /items\.filter\(\(item\) => item\.preview\)/);
  assert.match(stack, /Buyer-file entries are named/);
  assert.match(manifest, /Buyer file — not public/);
});
