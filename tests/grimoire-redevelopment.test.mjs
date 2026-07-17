import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("Grimoire publishes the redevelopment page and preserves the old landing as source", () => {
  const landing = read("src/pages/grimoire/index.astro");
  const archivedLanding = "src/archive/grimoire/index.astro";

  assert.match(landing, /becoming Wonderland's game engine/);
  assert.match(landing, /The knowledge graph/);
  assert.match(landing, /Under redevelopment/);
  assert.ok(existsSync(join(root, archivedLanding)));
  assert.match(read(archivedLanding), /GrimoireHero/);
});

test("former Grimoire documents redirect to the redevelopment page and leave discovery", () => {
  const features = read("src/data/public-features.ts");
  const detail = read("src/pages/grimoire/[...slug].astro");
  const archive = read("src/pages/grimoire/cross-pollination/index.astro");
  const search = read("src/lib/search-index.ts");
  const corpus = read("src/lib/agent-corpus.ts");

  assert.match(features, /PUBLIC_GRIMOIRE_ARCHIVE_ENABLED = false/);
  assert.match(detail, /Astro\.redirect\("\/grimoire\/", 302\)/);
  assert.match(archive, /Astro\.redirect\("\/grimoire\/", 302\)/);
  assert.match(search, /PUBLIC_GRIMOIRE_ARCHIVE_ENABLED/);
  assert.match(corpus, /if \(!PUBLIC_GRIMOIRE_ARCHIVE_ENABLED\) return \[\]/);
});
