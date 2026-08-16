import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the canonical definition, active Workshop programs, and historical origin stay in place", () => {
  const definition = read("docs/character-system/hobfarm-stylefusion-definition.md");
  const hierarchy = read("src/data/site-hierarchy.ts");

  assert.match(definition, /StyleFusion is a separate HobFarm reference-image application/);
  assert.match(definition, /A generated image, character Sheet, Hero, Poster, reel, or product packet is a downstream asset/);
  for (const label of ["Before & After", "Alter Ego", "EZIZE Origins", "Character / Mannequin", "StyleFusion", "Workshop Notes"]) {
    assert.match(hierarchy, new RegExp(label.replace(/[&/]/g, ".")));
  }
  assert.match(hierarchy, /specialized extraction agents/);
  assert.doesNotMatch(hierarchy, /Style references translated into explicit visual ingredients/);
});

test("the Sophia and Stella visual system no longer imports a StyleFusion map", () => {
  const lab = read("src/pages/workshop/visual-lab/index.astro");
  const map = read("src/components/workshop/VisualSystemMap.astro");

  assert.equal(existsSync(new URL("../src/components/workshop/StyleFusionMap.astro", import.meta.url)), false);
  assert.match(lab, /VisualSystemMap/);
  assert.match(lab, /Visual system source map/);
  assert.doesNotMatch(lab, /StyleFusionMap|StyleFusion source-role map/);
  assert.doesNotMatch(map, /StyleFusion/);
});

test("the private prototype is source-backed, noindex, and keeps raw/private assets out", () => {
  const page = read("src/pages/workshop/stylefusion/prototype.astro");
  const schema = read("src/content.config.ts");
  const tuxedo = read("src/content/stylefusion-studies/tuxedo-cat-fusion.md");
  const failed = read("src/content/stylefusion-studies/failed-subject-extraction.md");

  assert.match(page, /noindex/);
  assert.match(page, /ReferenceRoleDeck/);
  assert.match(page, /FusionPipeline/);
  assert.match(page, /IRInspector/);
  assert.match(page, /AgentConfidencePanel/);
  assert.match(page, /CompiledDocumentViewer/);
  assert.match(page, /DownstreamAssetRail/);
  assert.match(schema, /const stylefusionStudies = defineCollection/);
  assert.match(tuxedo, /irVersion: "5\.1"/);
  assert.match(tuxedo, /extractionModel: "gpt-5\.5"/);
  assert.match(tuxedo, /confidence: 0\.93/);
  assert.match(failed, /subjectExtractionFailed: true/);
  assert.match(failed, /confidence: 0 }/);
  assert.doesNotMatch(tuxedo + failed, /approvedForPublicDisplay: true|https:\/\/cdn\.hob\.farm|image:/);
  assert.doesNotMatch(page, /https?:\/\/(?!hob\.farm)/);
});

test("project and Workshop copy end the app at the Complete Export", () => {
  const project = read("src/components/projects/StyleFusionProjectPage.astro");
  const workshop = read("docs/character-system/hobfarm-workshop-system.md");
  const route = read("src/pages/workshop/[program].astro");

  assert.match(project, /Complete Export/);
  assert.match(project, /later Character \/ Mannequin workflow/);
  assert.doesNotMatch(project, /generation JSON, compact prompts, character sheets/);
  assert.match(workshop, /The Complete Export is the StyleFusion artifact/);
  assert.match(route, /Assign approved reference roles/);
  assert.match(route, /Export the diagnostic document/);
});
