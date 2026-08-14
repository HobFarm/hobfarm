import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

function collectAstroFiles(directory) {
  return readdirSync(join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectAstroFiles(path);
    return extname(entry.name) === ".astro" ? [path] : [];
  });
}

test("BaseLayout provides the first-focus skip link and one main-content target", () => {
  const layout = read("src/layouts/BaseLayout.astro");
  const body = layout.match(/<body\b[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? "";
  const targetMatches = layout.match(/id="main-content"/g) ?? [];

  assert.match(body, /^\s*<a class="skip-link" href="#main-content">Skip to content<\/a>/);
  assert.equal(targetMatches.length, 1, "BaseLayout must contain exactly one main-content target");
  assert.match(layout, /<main id="main-content" tabindex="-1"\s/);
  assert.match(layout, /\.skip-link:focus-visible/);
  assert.match(layout, /z-index:\s*2147483647/);
});

test("normal page and specialized layout sources cannot add a second main landmark or skip target", () => {
  const candidates = [...collectAstroFiles("src/pages"), ...collectAstroFiles("src/layouts")];
  const duplicateTargets = [];
  const nestedMainLandmarks = [];

  for (const file of candidates) {
    const source = read(file);
    const normalizedFile = file.replaceAll("\\", "/");
    if (normalizedFile !== "src/layouts/BaseLayout.astro" && /id=["']main-content["']/.test(source)) {
      duplicateTargets.push(relative(root, join(root, file)));
    }
    if (normalizedFile !== "src/layouts/BaseLayout.astro" && /<main\b/.test(source)) {
      nestedMainLandmarks.push(relative(root, join(root, file)));
    }
  }

  assert.deepEqual(duplicateTargets, [], "Only BaseLayout may define main-content");
  assert.deepEqual(nestedMainLandmarks, [], "BaseLayout pages must not nest another main landmark");
});
