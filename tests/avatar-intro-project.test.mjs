import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the Avatar course uses Ami's intro as a reusable field project", () => {
  const data = read("src/data/avatar-content-system.ts");
  const landing = read("src/pages/academy/avatar-content-system/index.astro");
  const freeOverview = read("src/pages/academy/avatar-content-system/free.astro");
  const courseIndex = read("src/pages/academy/avatar-content-system/course/index.astro");
  const snippetCards = read("src/components/academy/SnippetCards.tsx");
  const registry = read("src/data/media-registry.ts");

  assert.match(data, /title: "Ami's reusable avatar introduction"/);
  assert.match(data, /status: "Rendered"/);
  assert.match(data, /duration: "36 seconds"/);
  assert.match(data, /The spoken video stays general/);
  assert.match(data, /name: "Ko-fi intro"/);
  assert.match(data, /name: "Social introduction"/);
  assert.match(data, /name: "Course field project"/);
  assert.match(data, /name: "Workshop follow-up"/);
  assert.match(data, /workshopHref: "\/workshop\/ami-legacy\/"/);
  assert.match(landing, /id="ami-intro-project"/);
  assert.match(landing, /workshop\.ami-legacy\.intro\.video/);
  assert.match(landing, /<video/);
  assert.match(landing, /preload="none"/);
  assert.match(landing, /poster=/);
  assert.match(landing, /See what Ami introduces next/);
  assert.match(landing, /Open HobFarm on Ko-fi/);
  assert.match(registry, /Ami_Intro_with_captions\.mp4/);
  assert.match(freeOverview, /id="intro-project"/);
  assert.match(freeOverview, /avatarIntroPrompts/);
  assert.match(courseIndex, /Open the field project map/);
  assert.match(snippetCards, /min-h-11/);
  assert.match(snippetCards, /focus-visible:outline/);
});

test("one master video gets destination-specific publishing wrappers", () => {
  const data = read("src/data/avatar-content-system.ts");
  const paid = read("src/data/avatar-content-system-paid.ts");
  const diagram = read("src/components/academy/CourseDiagram.astro");

  assert.match(data, /Keep the video platform-neutral/);
  assert.match(data, /Turn one master video into placement captions/);
  assert.match(paid, /title: "Publish the Intro and Schedule the Social Cut"/);
  assert.match(paid, /For Ko-fi, add the master video as the profile introduction/);
  assert.match(paid, /For social media, create a post or reel with the same master export/);
  assert.match(paid, /07-publishing/);
  assert.doesNotMatch(`${data}\n${paid}`, /07-scheduled-posts/);
  assert.match(diagram, /Placement published/);
  assert.match(diagram, /"Publish"/);
});
