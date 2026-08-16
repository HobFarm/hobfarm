import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("primary IA demotes archives while keeping search discoverable", () => {
  const navigation = read("src/data/navigation.ts");
  const nav = read("src/components/global/Navigation.astro");
  const mobile = read("src/components/global/MobileNav.astro");
  const search = read("src/components/global/Search.astro");

  assert.match(navigation, /label:\s*"Shop",\s*href:\s*"\/shop\/"/);
  assert.doesNotMatch(navigation, /topNavLinks[\s\S]*label:\s*"Gallery"/);
  assert.doesNotMatch(navigation, /topNavLinks[\s\S]*label:\s*"Video"/);
  assert.doesNotMatch(navigation, /topNavLinks[\s\S]*label:\s*"Characters"/);
  assert.match(navigation, /label:\s*"Presents"[\s\S]*children:/);
  assert.match(navigation, /label:\s*"Workshop"[\s\S]*children:/);
  assert.doesNotMatch(navigation, /View all Workshop|View all Presents|Departments directory/);

  assert.match(nav, /data-search-trigger/);
  assert.match(mobile, /data-search-trigger/);
  for (const summary of mobile.matchAll(/<summary[\s\S]*?<\/summary>/g)) {
    assert.doesNotMatch(summary[0], /<a\b/, "mobile submenu toggles must not nest links inside summary");
  }
  assert.match(search, /hobfarm:open-search/);
  assert.match(search, /closest\("\[data-search-trigger\]"\)/);
});

test("Presents feature fallbacks are keyed by series identity, not nav position", () => {
  const presents = read("src/pages/presents/index.astro");

  assert.match(presents, /const seriesById = new Map/);
  for (const id of ["other-alice", "3dm", "magazine-time-machine", "funnies", "hobfarm-tv"]) {
    assert.match(presents, new RegExp(`seriesById\\.get\\("${id}"\\)`));
  }
  assert.doesNotMatch(presents, /presentsSeries\[\d+\]/);
});

test("Workshop visibility keeps route generation separate from navigation", () => {
  const hierarchy = read("src/data/site-hierarchy.ts");
  const navigation = read("src/data/navigation.ts");
  const programRoute = read("src/pages/workshop/[program].astro");
  const workshopHub = read("src/pages/workshop/index.astro");

  const primary = hierarchy.slice(hierarchy.indexOf("export const primaryWorkshopPrograms"), hierarchy.indexOf("export const historicalWorkshopPrograms"));
  const historical = hierarchy.slice(hierarchy.indexOf("export const historicalWorkshopPrograms"), hierarchy.indexOf("export const workshopProgramDefinitions"));
  const visibleOrder = [
    'id: "workshop-notes"',
    'id: "character-mannequin"',
    'id: "avatar-host"',
    'id: "before-after"',
    'id: "alter-ego"',
  ].map((token) => primary.indexOf(token));

  assert.ok(visibleOrder.every((position) => position >= 0));
  assert.deepEqual(visibleOrder, [...visibleOrder].sort((a, b) => a - b));
  assert.doesNotMatch(primary, /id: "cute-corrupted"/);
  assert.match(historical, /id: "cute-corrupted"[\s\S]*name: "EZIZE Origins"/);
  assert.match(hierarchy, /id: "stylefusion"[^\n]*inNav: false, noindex: false/);
  assert.match(navigation, /label: "Overview", href: "\/workshop\/"/);
  assert.match(navigation, /label: "Projects", href: "\/workshop\/projects\/"/);
  assert.match(navigation, /label: "Workshop Notes", href: "\/workshop\/workshop-notes\/"/);
  assert.match(programRoute, /return workshopPrograms[\s\S]*\.map\(\(program\)/);
  assert.match(programRoute, /program\.id !== "avatar-host"/);
  assert.match(programRoute, /getProcessPipelineBySlug\(program\.processSlug\)/);
  assert.match(programRoute, /noindex=\{program\.noindex === true\}/);
  assert.match(workshopHub, /WorkshopProjectGrid surface="workshop"/);
  assert.match(workshopHub, /ProjectGrowthDiagram/);
  assert.match(workshopHub, /EzizeEvidence/);
  assert.match(workshopHub, /Selected projects/);
});

test("Editorial section archives keep sections, specials, subjects, and feeds separate", () => {
  const archive = read("src/components/archive/EditorialSectionArchive.astro");
  const categoryRoute = read("src/pages/articles/[category].astro");

  assert.match(archive, /EditorialSectionRail/);
  assert.match(archive, /Newest in/);
  assert.match(archive, /Specials in this section/);
  assert.match(archive, /Common subjects/);
  assert.match(archive, /Section RSS/);
  assert.match(categoryRoute, /editorialSections\.map/);
  assert.doesNotMatch(categoryRoute, /legacyCandidates/);
});

test("about page presents the independent publisher and its operating paths", () => {
  const about = [
    read("src/pages/about/index.astro"),
    read("src/data/about.ts"),
    read("src/components/about/AboutHero.astro"),
    read("src/components/about/AboutHobFarmRoutes.astro"),
    read("src/components/about/AboutContactBlock.astro"),
  ].join("\n");

  for (const phrase of [
    "independent publication and working studio",
    "Articles are the editorial center",
    "Workshop keeps the sources",
    "Academy follows a method after real Workshop evidence",
    "I currently run HobFarm alone",
    "Kris Reynolds, the person who operates it",
    "d00d</strong> is the editorial byline",
    "For employment, production, web, editorial, collaboration, and referral inquiries",
  ]) {
    assert.match(about, new RegExp(phrase));
  }

  assert.doesNotMatch(about, /import AboutMedia/);
  assert.doesNotMatch(about, /import AboutPitch/);
  assert.match(about, /href:\s*"\/workshop\/projects\/hobfarm\/"/);
  assert.match(about, /href:\s*"\/shop\/"/);
  assert.match(about, /href:\s*"\/contact\/\?subject=employment"/);
});

test("archive surfaces are reframed without changing routes", () => {
  const gallery = read("src/pages/gallery/index.astro");

  assert.match(gallery, /Gallery Archive/);
  assert.match(gallery, /canonical="\/gallery\/"/);
});

test("the media-archive routes are retired", () => {
  // A video lives with the thing it is about, Workshop is the home for tools
  // and systems, and a character lives on the page for its own world.
  for (const dir of ["src/pages/video", "src/pages/projects", "src/pages/characters"]) {
    assert.equal(existsSync(join(root, dir)), false, `${dir} should be gone`);
  }
});

test("media inventory script is wired as a referenced-asset report", () => {
  const pkg = JSON.parse(read("package.json"));

  assert.equal(pkg.scripts.inventory, "node scripts/media-inventory.mjs");
  assert.equal(existsSync(join(root, "scripts/media-inventory.mjs")), true);

  const script = read("scripts/media-inventory.mjs");
  assert.match(script, /reports\/media-inventory\.json/);
  assert.match(script, /reports\/media-inventory\.csv/);
  assert.match(script, /leakRisk/);
  assert.match(script, /referenced assets only/);
});
