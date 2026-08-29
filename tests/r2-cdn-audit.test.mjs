import assert from "node:assert/strict";
import test from "node:test";
import {
  extractReferencesFromText,
  r2KeyFromCdnUrl,
} from "../scripts/lib/media-reference-scan.mjs";
import { compareBucketSummary } from "../scripts/lib/r2-audit-metrics.mjs";

test("bucket summary lag is advisory while the paginated inventory stays authoritative", () => {
  const comparison = compareBucketSummary(
    { available: true, objectCount: 2254, bucketSizeLabel: "4.76 GB" },
    2257,
  );

  assert.equal(comparison.objectCountMatches, false);
  assert.equal(comparison.objectCountDifference, 3);
  assert.equal(comparison.authoritativeObjectCountSource, "cursor-paginated R2 object API");
  assert.match(comparison.advisory, /may lag/);
});

test("CDN URL normalization recovers direct and transformed R2 keys", () => {
  assert.equal(
    r2KeyFromCdnUrl("https://cdn.hob.farm/articles/example/hero image.webp?width=1200"),
    "articles/example/hero image.webp",
  );
  assert.equal(
    r2KeyFromCdnUrl(
      "https://hob.farm/cdn-cgi/image/width=1200,format=auto/https://cdn.hob.farm/articles/example/hero.webp",
    ),
    "articles/example/hero.webp",
  );
  assert.equal(
    r2KeyFromCdnUrl(
      "https://cdn.hob.farm/cdn-cgi/image/width=760,quality=82,format=auto/ezize/example.png",
    ),
    "ezize/example.png",
  );
});

test("the scanner finds direct, transformed, and folder/file references", () => {
  const objectKeys = new Set([
    "articles/example/hero.webp",
    "articles/example/process.png",
    "gallery/example/poster.jpg",
  ]);
  const text = `---
title: Example
publishedAt: 2026-08-01T16:20:00-07:00
folder: "gallery/example"
hero:
  type: image
  file: "poster.jpg"
---
const hero = "https://cdn.hob.farm/articles/example/hero.webp";
const process = "https://hob.farm/cdn-cgi/image/width=900/https://cdn.hob.farm/articles/example/process.png";
`;
  const references = extractReferencesFromText({
    text,
    sourceFile: "src/content/gallery/example.md",
    objectKeys,
    now: new Date("2026-08-28T12:00:00Z"),
  });

  assert.deepEqual(
    [...new Set(references.map((reference) => reference.r2Key))].sort(),
    [...objectKeys].sort(),
  );
  assert.ok(references.some((reference) => reference.referenceKind === "transformed-cdn-url"));
  assert.ok(references.every((reference) => reference.status === "active"));
});

test("draft content references are staged", () => {
  const references = extractReferencesFromText({
    text: `---\ndraft: true\nfolder: "gallery/future"\nhero:\n  file: "future.webp"\n---\n`,
    sourceFile: "src/content/gallery/future.md",
    objectKeys: new Set(["gallery/future/future.webp"]),
  });

  assert.equal(references.length, 1);
  assert.equal(references[0].status, "staged");
});

test("helper templates resolve static call arguments", () => {
  const references = extractReferencesFromText({
    text: `
const cdn = (path) => \`https://cdn.hob.farm/\${path}\`;
function processVideo(folder, file, poster) {
  return {
    src: cdn(\`pages/process/\${folder}/\${file}\`),
    poster: cdn(\`pages/process/\${folder}/\${poster}\`),
  };
}
const record = processVideo("motion", "result.mp4", "poster.jpg");
`,
    sourceFile: "src/data/example.ts",
    objectKeys: new Set([
      "pages/process/motion/result.mp4",
      "pages/process/motion/poster.jpg",
    ]),
  });

  assert.deepEqual(
    [...new Set(references.map((reference) => reference.r2Key))].sort(),
    ["pages/process/motion/poster.jpg", "pages/process/motion/result.mp4"],
  );
});

test("future canonical keys stay staged instead of becoming active references", () => {
  const references = extractReferencesFromText({
    text: `const record = { futureCanonicalKey: "workshop/example/future.webp" };`,
    sourceFile: "src/data/media-registry.ts",
    objectKeys: new Set(["workshop/example/future.webp"]),
  });

  assert.equal(references.length, 1);
  assert.equal(references[0].status, "staged");
});
