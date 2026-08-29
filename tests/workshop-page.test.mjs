import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const expectedProgramIds = [
  "workshop-notes",
  "character-mannequin",
  "avatar-host",
  "before-after",
  "alter-ego",
];

test("Workshop preserves the program registry while public navigation uses system layers", () => {
  const hierarchy = read("src/data/site-hierarchy.ts");
  const primaryBlock = hierarchy.slice(
    hierarchy.indexOf("export const primaryWorkshopPrograms"),
    hierarchy.indexOf("export const historicalWorkshopPrograms"),
  );
  const historicalBlock = hierarchy.slice(
    hierarchy.indexOf("export const historicalWorkshopPrograms"),
    hierarchy.indexOf("export const workshopProgramDefinitions"),
  );

  const positions = expectedProgramIds.map((id) => primaryBlock.indexOf(`id: "${id}"`));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.doesNotMatch(primaryBlock, /id: "cute-corrupted"/);
  assert.match(historicalBlock, /id: "cute-corrupted"[\s\S]*name: "EZIZE Origins"/);
  assert.match(historicalBlock, /inNav: false[\s\S]*status: "historical"/);

  const navigation = read("src/data/navigation.ts");
  assert.match(navigation, /label: "Overview", href: "\/workshop\/"/);
  assert.match(navigation, /label: "Projects", href: "\/workshop\/projects\/"/);
  assert.match(navigation, /label: "Workshop Notes", href: "\/workshop\/workshop-notes\/"/);
  assert.doesNotMatch(primaryBlock, /id: "stylefusion"/);
  assert.match(hierarchy.slice(hierarchy.indexOf("export const supportingWorkshopPrograms")), /id: "stylefusion"/);
});

test("Workshop navigation leads with system layers and keeps featured projects available", () => {
  const navigation = read("src/data/navigation.ts");
  const overviewPosition = navigation.indexOf('label: "Overview"');
  const projectsPosition = navigation.indexOf('label: "Projects"');
  const notesPosition = navigation.indexOf('label: "Workshop Notes"');
  const ezizePosition = navigation.indexOf('label: "EZIZE"');
  const futureCarriagePosition = navigation.indexOf('label: "Future Carriage"');

  assert.ok(overviewPosition >= 0);
  assert.ok(projectsPosition > overviewPosition);
  assert.ok(notesPosition > projectsPosition);
  assert.ok(ezizePosition > notesPosition);
  assert.ok(futureCarriagePosition > notesPosition);
  assert.match(navigation, /href: "\/ezize\/"/);
  assert.match(navigation, /href: "\/workshop\/future-carriage\/"/);
});

test("Workshop hub follows the requested section hierarchy", () => {
  const page = read("src/pages/workshop/index.astro");
  const markers = [
    "workshop-hero",
    'id="method"',
    'id="growth"',
    'id="ezize"',
    'id="projects"',
    "notes-section",
    "final-routes",
  ];
  const positions = markers.map((marker) => page.indexOf(marker));

  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.match(page, /One method for different projects\./);
  assert.match(page, /HobFarm work moves between research, writing, visual direction, software, and publishing\./);
  assert.match(page, /getMedia\("workshop\.graphics\.hero"\)/);
  assert.doesNotMatch(page, /workshop-hero__layout \{ grid-template-columns:/);
  const hero = page.slice(page.indexOf('<section class="workshop-hero"'), page.indexOf('<section id="method"'));
  assert.ok(hero.indexOf('class="workshop-hero__title"') < hero.indexOf("</figure>"));
  assert.ok(hero.indexOf('class="workshop-hero__after"') > hero.indexOf("</figure>"));
  assert.ok(hero.indexOf('<p class="deck">') > hero.indexOf("</figure>"));
  assert.match(page, /Start with the source\. Keep the decisions visible\./);
  assert.match(page, /Projects grow\. Build them so they can\./);
  assert.match(page, /Separate experiments became one working machine\./);
  assert.match(page, /Selected projects/);
  assert.doesNotMatch(page, /A schema is not necessarily JSON\./);
  assert.doesNotMatch(page, /Build the system around the job\./);
  assert.doesNotMatch(page, /<SchemaRepresentation/);
  assert.doesNotMatch(page, /<ProviderProjection/);
});

test("Workshop hub exposes the project registry, EZIZE, and one notes section", () => {
  const page = read("src/pages/workshop/index.astro");
  const hierarchy = read("src/data/site-hierarchy.ts");
  const projects = read("src/data/workshop-projects.ts");

  for (const href of [
    "/workshop/workshop-notes/",
    "/workshop/character-mannequin/",
    "/workshop/avatar-host/",
    "/workshop/before-and-after/",
    "/workshop/cute-and-corrupted/",
    "/workshop/alter-ego/",
  ]) {
    assert.match(hierarchy, new RegExp(href.replaceAll("/", "\\/")));
  }

  assert.match(page, /<WorkshopProjectGrid surface="workshop" \/>/);
  assert.match(projects, /id: "ezize"/);
  assert.match(projects, /destination: "\/ezize\/"/);
  assert.match(projects, /id: "stylefusion"/);
  assert.equal([...page.matchAll(/<section class="notes-section"/g)].length, 1);
});

test("program navigation derives previous and next links from the shared order", () => {
  const component = read("src/components/workshop/WorkshopProgramNav.astro");
  const dynamicRoute = read("src/pages/workshop/[program].astro");
  const character = read("src/components/workshop/CharacterMannequinPage.astro");
  const beforeAfter = read("src/components/workshop/BeforeAfterArchive.astro");
  const avatarHost = read("src/pages/workshop/avatar-host/index.astro");

  assert.match(component, /primaryWorkshopPrograms/);
  assert.match(component, /rel="prev"/);
  assert.match(component, /rel="next"/);
  assert.match(dynamicRoute, /WorkshopProgramNav currentId=\{program\.id\}/);
  assert.match(character, /WorkshopProgramNav currentId="character-mannequin"/);
  assert.match(beforeAfter, /WorkshopProgramNav currentId="before-after"/);
  assert.match(avatarHost, /WorkshopProgramNav currentId="avatar-host"/);
  assert.doesNotMatch(component, /historicalWorkshopPrograms/);
  assert.match(dynamicRoute, /workshopProgramDefinitions\.find/);
  assert.match(dynamicRoute, /Historical origin \/ current project: EZIZE/);
});

test("generic placeholder program copy is gone", () => {
  const route = read("src/pages/workshop/[program].astro");
  const hierarchy = read("src/data/site-hierarchy.ts");
  const combined = `${route}\n${hierarchy}`;

  assert.doesNotMatch(combined, /A working frame for the next pass/);
  assert.doesNotMatch(combined, /This page establishes the program/);
  assert.match(combined, /Define the shared mannequin/);
  assert.match(combined, /Write two distinct personas/);
  assert.match(combined, /failure or revision/);
});

test("Future Carriage remains a selected project with its full case study", () => {
  const hub = read("src/pages/workshop/index.astro");
  const projects = read("src/data/workshop-projects.ts");
  const caseStudy = read("src/pages/workshop/future-carriage/index.astro");

  assert.match(hub, /<WorkshopProjectGrid surface="workshop" \/>/);
  assert.match(projects, /id: "future-carriage"/);
  assert.match(projects, /destination: "\/workshop\/future-carriage\/"/);
  assert.match(caseStudy, /View the avatar host system/);
  assert.match(caseStudy, /Follow the stable-base method/);
});

test("approved avatar media stays data-only until durable public assets exist", () => {
  const media = read("src/data/avatar-host-media.ts");
  const page = read("src/pages/workshop/avatar-host/index.astro");

  assert.match(media, /status: "approved"/);
  assert.match(media, /localMasterAvailable: true/);
  assert.match(media, /durationSeconds: 30\.48/);
  assert.match(media, /videoUrl\?: string/);
  assert.match(media, /transcriptUrl\?: string/);
  assert.match(media, /durationSeconds\?: number/);
  assert.match(media, /destinationUrls: readonly string\[\]/);
  assert.doesNotMatch(media, /voiceId|avatarGroupId|selectedLookIds|heygen\.com|video_id/i);
  const campaignRecord = media.match(/id: "ami-future-carriage-campaign"[\s\S]*?\n  },/)?.[0] ?? "";
  assert.doesNotMatch(campaignRecord, /videoUrl:|transcriptUrl:/);
  assert.doesNotMatch(page, /ami-future-carriage-campaign[\s\S]{0,300}<video/);
});

test("Workshop method uses five durable production stages", () => {
  const data = read("src/data/workshop-page.ts");
  const component = read("src/components/workshop/WorkshopMethodStrip.astro");
  const page = read("src/pages/workshop/index.astro");

  for (const title of [
    "Conceptualize and research",
    "Define the base",
    "Build the transformation",
    "Direct and test",
    "Publish and extend",
  ]) {
    assert.match(data, new RegExp(`title: "${title}"`));
  }

  for (const mediaId of [
    "workshop.method.research-source",
    "workshop.method.define-base",
    "workshop.method.build-transformation",
    "workshop.method.direct-result",
    "workshop.method.publish-extend",
  ]) {
    assert.match(component, new RegExp(mediaId.replaceAll(".", "\\.")));
  }

  assert.match(component, /showMedia\?: boolean/);
  assert.match(page, /<WorkshopMethodStrip showMedia \/>/);
});

test("public Workshop templates use the shared visible and structured breadcrumb source", () => {
  const breadcrumb = read("src/components/global/Breadcrumbs.astro");
  assert.match(breadcrumb, /<nav aria-label="Breadcrumb"/);
  assert.match(breadcrumb, /<a href=\{item\.href\}>/);
  assert.match(breadcrumb, /"@type": "BreadcrumbList"/);
  assert.match(breadcrumb, /itemListElement: items\.map/);

  for (const path of [
    "src/pages/workshop/index.astro",
    "src/pages/workshop/avatar-host/index.astro",
    "src/pages/workshop/future-carriage/index.astro",
    "src/pages/workshop/workshop-notes/psygoth/index.astro",
    "src/components/projects/StyleFusionProjectPage.astro",
    "src/components/workshop/CharacterMannequinPage.astro",
    "src/components/workshop/BeforeAfterArchive.astro",
  ]) {
    const source = read(path);
    assert.match(source, /import Breadcrumbs from "@\/components\/global\/Breadcrumbs\.astro"/);
    assert.match(source, /<Breadcrumbs items=/);
  }

  const route = read("src/pages/workshop/[program].astro");
  const process = read("src/components/process/ProcessMethodPage.astro");
  assert.match(route, /const programBreadcrumbs =/);
  assert.match(route, /breadcrumbs=\{programBreadcrumbs\}/);
  assert.match(process, /breadcrumbs && <div class="mb-8"><Breadcrumbs items=\{breadcrumbs\}/);

  const beforeAfterPage = read("src/pages/workshop/before-and-after/index.astro");
  assert.doesNotMatch(beforeAfterPage, /"@type": "BreadcrumbList"/);
});
