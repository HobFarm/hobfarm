import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const articleRoot = join(process.cwd(), "src/content/articles");

function articleFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return articleFiles(path);
    return /\.mdx?$/.test(entry.name) ? [path] : [];
  });
}

test("raw article images reserve layout space and declare loading behavior", () => {
  for (const file of articleFiles(articleRoot)) {
    const source = readFileSync(file, "utf8");
    const images = source.match(/<img\b[\s\S]*?\/?>/gi) ?? [];

    for (const image of images) {
      assert.match(image, /\balt\s*=/, `${file} has an image without alt text`);
      assert.match(image, /\bwidth\s*=/, `${file} has an image without width`);
      assert.match(image, /\bheight\s*=/, `${file} has an image without height`);
      assert.match(image, /\bloading\s*=\s*["'{](?:lazy|eager)/, `${file} has an image without explicit loading behavior`);
      assert.match(image, /\bdecoding\s*=\s*["'{]async/, `${file} has an image without async decoding`);
    }
  }
});
