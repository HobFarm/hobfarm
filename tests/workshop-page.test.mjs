import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const expectedProgramIds = [
  "workshop-notes",
  "character-mannequin",
  "avatar-host",
  "before-after",
  "cute-corrupted",
  "alter-ego",
];

test("Workshop uses one primary program registry in the required order", () => {
  const hierarchy = read("src/data/site-hierarchy.ts");
  const primaryBlock = hierarchy.slice(
    hierarchy.indexOf("export const primaryWorkshopPrograms"),
    hierarchy.indexOf("export const supportingWorkshopPrograms"),
  );

  const positions = expectedProgramIds.map((id) => primaryBlock.indexOf(`id: "${id}"`));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));

  const navigation = read("src/data/navigation.ts");
  assert.match(navigation, /workshopPrograms\.filter/);
  assert.match(navigation, /entry\.inNav !== false/);
  assert.doesNotMatch(primaryBlock, /id: "stylefusion"/);
  assert.match(hierarchy.slice(hierarchy.indexOf("export const supportingWorkshopPrograms")), /id: "stylefusion"/);
});

test("Workshop navigation places Future Carriage after Avatar & Host", () => {
  const navigation = read("src/data/navigation.ts");
  const avatarPosition = navigation.indexOf('entry.id === "avatar-host"');
  const futureCarriagePosition = navigation.indexOf('label: "Future Carriage"');

  assert.ok(avatarPosition >= 0);
  assert.ok(futureCarriagePosition > avatarPosition);
  assert.match(navigation, /href: "\/workshop\/future-carriage\/"/);
});

test("Workshop hub follows the requested section hierarchy", () => {
  const page = read("src/pages/workshop/index.astro");
  const markers = [
    "workshop-hero",
    "notes-intro",
    'id="method"',
    'id="programs"',
    '<section class="future-carriage"',
    'aria-labelledby="outputs-heading"',
    "tools-section",
    "final-routes",
  ];
  const positions = markers.map((marker) => page.indexOf(marker));

  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.match(page, /One method\. Many kinds of work\./);
  assert.match(page, /getMedia\("workshop\.graphics\.hero"\)/);
  assert.doesNotMatch(page, /workshop-hero__layout \{ grid-template-columns:/);
  assert.match(page, /The production record behind HobFarm\./);
  assert.match(page, /Start with the source\. Keep the decisions visible\./);
  assert.match(page, /Five demonstrations of the same method\./);
});

test("Workshop hub exposes all primary routes and keeps StyleFusion supporting", () => {
  const page = read("src/pages/workshop/index.astro");
  const hierarchy = read("src/data/site-hierarchy.ts");

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

  assert.match(page, /Tools and applications/);
  assert.match(page, /\/workshop\/stylefusion\//);
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

test("Future Carriage connects the stable base, Ami, and the full case study", () => {
  const hub = read("src/pages/workshop/index.astro");
  const caseStudy = read("src/pages/workshop/future-carriage/index.astro");

  assert.match(hub, /Ami as recurring avatar and spokesperson/);
  assert.match(hub, /href="\/workshop\/avatar-host\/"/);
  assert.match(hub, /href="\/workshop\/character-mannequin\/"/);
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
    "Research the source",
    "Define the base",
    "Build the transformation",
    "Direct the result",
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
