import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("Other Alice pages explain the premise and distinguish the character", () => {
  const series = read("src/data/story-series.ts");
  const characters = read("src/data/characters.ts");
  const hub = read("src/pages/departments/hobfarm-presents/index.astro");

  assert.match(series, /What is Other Alice\?/);
  assert.match(series, /Is Other Alice evil\?/);
  assert.match(series, /Lewis Carroll's public-domain Wonderland/);
  assert.match(characters, /Other Alice: Character Guide/);
  assert.match(characters, /curiosity without an adequate stopping mechanism/);
  assert.match(hub, /HobFarm's series imprint/);
  assert.match(hub, /Illustrated Fiction/);
  assert.doesNotMatch(hub, /Strange Recurring Worlds/);
});

test("Other Alice fiction is discoverable through search and structured pages", () => {
  const searchIndex = read("src/lib/search-index.ts");
  const seriesPage = read(
    "src/pages/departments/hobfarm-presents/[series]/index.astro",
  );
  const characterPage = read("src/pages/characters/[character].astro");
  const adventurePage = read(
    "src/pages/departments/hobfarm-presents/[series]/[slug].astro",
  );

  assert.match(searchIndex, /type: "adventure"/);
  assert.match(searchIndex, /type: "series"/);
  assert.match(searchIndex, /type: "character"/);
  assert.match(seriesPage, /CreativeWorkSeries/);
  assert.match(characterPage, /ProfilePage/);
  assert.match(adventurePage, /BreadcrumbList/);
  assert.match(adventurePage, /ShareButtons/);
  assert.equal(
    existsSync(
      join(root, "src/pages/departments/hobfarm-presents/[series]/index.md.ts"),
    ),
    true,
  );
  assert.equal(
    existsSync(join(root, "src/pages/characters/[character]/index.md.ts")),
    true,
  );
});

test("The Wrong Tunnel is preserved as an editorial draft", () => {
  const path = "src/content/adventures/adventure-no-01-the-wrong-tunnel.md";
  assert.equal(existsSync(join(root, path)), true);

  const adventure = read(path);
  assert.match(adventure, /series:\s*other-alice-adventures/);
  assert.match(adventure, /number:\s*1/);
  assert.match(adventure, /status:\s*draft/);
  assert.match(adventure, /draft:\s*true/);
  assert.match(adventure, /Ciryl Spade was smoking chive/);
  assert.match(adventure, /This side makes the tunnel larger/);
});

test("Adventure pages use one cover placement and specific related labels", () => {
  const adventurePage = read(
    "src/pages/departments/hobfarm-presents/[series]/[slug].astro",
  );
  const boundaryTable = read(
    "src/content/adventures/adventure-no-01-the-boundary-table.md",
  );

  assert.doesNotMatch(adventurePage, /Portrait cover \/ opening plate/);
  assert.match(adventurePage, /the hero is the only cover placement/);
  assert.match(adventurePage, /relatedArticleTitle/);
  assert.match(
    boundaryTable,
    /relatedArticleTitle:\s*"How the Money Eats the Medium"/,
  );
});

test("Other Alice world and resident galleries use the supplied R2 plates", () => {
  const series = read("src/data/story-series.ts");
  const worldGuide = read("src/data/other-alice-world-guide.ts");
  const sourceData = `${series}\n${worldGuide}`;
  const seriesPage = read(
    "src/pages/departments/hobfarm-presents/[series]/index.astro",
  );
  const worldGallery = read(
    "src/components/presents/WorldConceptGallery.astro",
  );
  const residentGallery = read("src/components/presents/ResidentGallery.astro");

  for (const filename of [
    "oaa-wonderland-wasteland-aerial.png",
    "oaa-concept-landscape-city-center.png",
    "oaa-concept-landscape-jungle.png",
    "oaa-concept-landscape-forest.png",
    "oaa-concept-landscape-boundary.png",
    "oaa-concept-landscape-tundra.png",
    "oaa-concept-landscape-wasteland.png",
    "other-alice-character-sheet.webp",
    "chester-character-portrait.webp",
    "mad-hatter-diamond-highlands-concept.webp",
    "wonderland-circular-world-concept.webp",
    "oaa-ciryl-portrait-.png",
    "oaa-club-bears-portrait-.png",
    "oaa-queen-of-hearts-portrait-.png",
  ]) {
    assert.match(sourceData, new RegExp(filename.replaceAll(".", "\\.")));
  }

  assert.match(seriesPage, /OtherAliceStartPage/);
  assert.match(seriesPage, /WorldConceptGallery/);
  assert.match(seriesPage, /ResidentGallery/);
  assert.match(worldGallery, /width=\{concept\.width\}/);
  assert.match(worldGallery, /loading="lazy"/);
  assert.match(residentGallery, /entry\.category === "faction"/);
});

test("agent-readable Other Alice copy includes the visual atlas and residents", () => {
  const agentCorpus = read("src/lib/agent-corpus.ts");
  const searchIndex = read("src/lib/search-index.ts");

  assert.match(agentCorpus, /series\.worldAtlas\.concepts/);
  assert.match(agentCorpus, /series\.residents\.entries/);
  assert.match(agentCorpus, /Image source:/);
  assert.match(searchIndex, /series\.worldAtlas\?\.concepts/);
  assert.match(searchIndex, /series\.residents\?\.entries/);
});
