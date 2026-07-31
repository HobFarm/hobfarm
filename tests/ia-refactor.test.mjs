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
  assert.match(search, /hobfarm:open-search/);
  assert.match(search, /closest\("\[data-search-trigger\]"\)/);
});

test("Workshop visibility keeps route generation separate from navigation", () => {
  const hierarchy = read("src/data/site-hierarchy.ts");
  const navigation = read("src/data/navigation.ts");
  const programRoute = read("src/pages/workshop/[program].astro");

  const visibleOrder = [
    'id: "character-mannequin"',
    'id: "alter-ego"',
    'id: "cute-corrupted"',
    'id: "before-after"',
    'id: "workshop-notes"',
  ].map((token) => hierarchy.indexOf(token));

  assert.ok(visibleOrder.every((position) => position >= 0));
  assert.deepEqual(visibleOrder, [...visibleOrder].sort((a, b) => a - b));
  assert.match(hierarchy, /id: "stylefusion"[^\n]*inNav: false, noindex: true/);
  assert.match(navigation, /workshopPrograms\.filter\(\(entry\) => entry\.inNav !== false\)/);
  assert.match(programRoute, /return workshopPrograms[\s\S]*\.map\(\(program\)/);
  assert.match(programRoute, /noindex=\{program\.noindex === true\}/);
});

test("department pages can surface related systems, drops, workshop notes, and comics", () => {
  const department = read("src/pages/departments/[slug].astro");

  assert.match(department, /import ComicCard/);
  assert.match(department, /import DropCard/);
  assert.match(department, /getProductsByDepartment/);
  assert.match(department, /visualSystemsForDepartment/);
  assert.match(department, /Workshop notes/);
  assert.match(department, /Visual systems/);
  assert.match(department, /Drops/);
  assert.match(department, /Comics/);
});

test("about page presents the independent publisher and its operating paths", () => {
  const about = read("src/pages/about/index.astro");

  for (const phrase of [
    "independent publisher of articles, media, games, and creative systems",
    "Articles are the editorial center",
    "Workshop shows how the work is made",
    "Academy teaches practical workflows",
    "HobFarm is currently run by one person",
    "not currently hiring",
  ]) {
    assert.match(about, new RegExp(phrase));
  }

  assert.doesNotMatch(about, /import AboutMedia/);
  assert.doesNotMatch(about, /import AboutPitch/);
  assert.match(about, /href:\s*"\/workshop\/"/);
  assert.match(about, /href:\s*"\/shop\/"/);
  assert.match(about, /href:\s*"\/contact\/"/);
});

test("archive surfaces are reframed without changing routes", () => {
  const gallery = read("src/pages/gallery/index.astro");
  const video = read("src/pages/video/index.astro");
  const characters = read("src/pages/characters/index.astro");

  assert.match(gallery, /Gallery Archive/);
  assert.match(video, /Video Archive/);
  assert.match(characters, /Character Index/);

  assert.match(gallery, /canonical="\/gallery\/"/);
  assert.match(video, /canonical="\/video\/"/);
  assert.match(characters, /canonical="\/characters\/"/);
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
