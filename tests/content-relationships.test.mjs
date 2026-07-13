import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const relationshipFields = [
  "relatedWorkshop",
  "relatedAcademy",
  "relatedProducts",
  "relatedArticles",
  "relatedCharacters",
  "relatedVisualSystems",
];

test("relationship fields stay optional across schemas and PagesCMS", () => {
  const schema = read("src/content.config.ts");
  const pages = read(".pages.yml");

  for (const field of relationshipFields) {
    assert.match(schema, new RegExp(`${field}: z\\.array\\(z\\.string\\(\\)\\)\\.optional\\(\\)`));
    assert.match(pages, new RegExp(`name: ${field}`));
  }
  assert.match(schema, /\.enum\(\["standard-non-exclusive", "exclusive", "custom"\]\)/);
});

test("one resolver omits unknown ids and covers every relationship kind", () => {
  const resolver = read("src/lib/content-relationships.ts");

  assert.match(resolver, /export async function resolveRelatedContent/);
  assert.match(resolver, /if \(!item \|\| seen\.has\(item\.href\)\) return/);
  for (const field of relationshipFields) {
    assert.match(resolver, new RegExp(`relationships\\.${field}`));
  }
  assert.doesNotMatch(resolver, /placeholder/i);
});

test("the shared rail is the only relationship presentation component", () => {
  const rail = read("src/components/relationships/RelatedContentRail.astro");

  assert.match(rail, /ResolvedRelatedContent/);
  assert.match(rail, /items\.length > 0/);
  assert.match(rail, /aria-labelledby/);
  assert.match(rail, /overflow-x: auto/);
});

test("Sophia and Stella relationship ids resolve to existing local sources", () => {
  const product = read("src/content/products/sophia-stella-sheet-pack.md");
  const hierarchy = read("src/data/site-hierarchy.ts");
  const academy = read("src/data/avatar-content-system.ts");
  const visualSystems = read("src/data/visual-systems.ts");

  for (const id of ["cute-and-corrupted", "character-mannequin"]) {
    assert.match(product, new RegExp(`- ${id}`));
    assert.match(hierarchy, new RegExp(`slug: "${id}"`));
  }
  assert.match(product, /- avatar-content-system/);
  assert.match(academy, /slug: "avatar-content-system"/);
  assert.match(product, /- sophia-stella/);
  assert.match(visualSystems, /id: "sophia-stella"/);
});
