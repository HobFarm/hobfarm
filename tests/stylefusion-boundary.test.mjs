import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the canonical definition, active Workshop programs, and historical origin stay in place", () => {
  const definition = read("docs/character-system/hobfarm-stylefusion-definition.md");
  const hierarchy = read("src/data/site-hierarchy.ts");

  assert.match(definition, /StyleFusion is a separate working HobFarm reference-image application/);
  assert.match(definition, /The pack is the canonical visual record/);
  assert.match(definition, /Generated images, character Sheets, Heroes, Posters, videos, and product packets are results or downstream assets/);
  for (const label of ["Before & After", "Alter Ego", "EZIZE Origins", "Character / Mannequin", "StyleFusion", "Workshop Notes"]) {
    assert.match(hierarchy, new RegExp(label.replace(/[&/]/g, ".")));
  }
  assert.match(hierarchy, /reusable modular pack/);
  assert.match(hierarchy, /positive generation prose/);
  assert.doesNotMatch(hierarchy, /Intermediate Representation|specialized extraction agents/);
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

test("current project and Workshop copy keep the pack canonical and providers downstream", () => {
  const project = read("src/components/projects/StyleFusionProjectPage.astro");
  const media = read("src/data/media-registry.ts");
  const workshop = read("docs/character-system/hobfarm-workshop-system.md");
  const route = read("src/pages/workshop/[program].astro");

  assert.match(project, /\.stylefusion\.zip/);
  assert.match(project, /The pack stays canonical; the provider remains replaceable/);
  assert.match(project, /positive prose/);
  assert.match(project, /Targeted module rewrite · current build study/);
  assert.match(project, /They are implemented and tested locally; the application deployment is in progress/);
  assert.match(project, /three times to eighteen seconds/);
  assert.match(project, /One pose\. Two subjects\. Four interpretations\./);
  assert.match(project, /content system and a research instrument/);
  assert.match(project, /\/workshop\/workshop-notes\//);
  for (const asset of [
    "grok-video-stylefusion-untitled-blend.mp4",
    "grok-video-stylefusion-untitled-blend.jpg",
    "chatgpt-stylefusion-untitled-blend.png",
    "chatgpt-pose-character.png",
    "chatgpt-pose-character2.png",
    "grok-pose-character1.jpg",
    "grok-pose-character2.jpg",
  ]) {
    assert.match(media, new RegExp(asset.replaceAll(".", "\\.")));
  }
  assert.doesNotMatch(project, /Complete Export|Intermediate Representation|Visual IR|exclusion guidance/);
  assert.match(workshop, /The downloadable `\.stylefusion\.zip` pack is the portable StyleFusion artifact/);
  assert.match(workshop, /negative or exclusion list/);
  assert.doesNotMatch(route, /StyleFusionMediaStudies|specialized extraction agents|Export the diagnostic document/);
});
