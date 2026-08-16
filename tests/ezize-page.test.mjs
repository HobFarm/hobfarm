import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("EZIZE has a canonical public explainer with honest private-alpha status", () => {
  const page = read("src/pages/ezize/index.astro");

  assert.match(page, /title="EZIZE \| HobFarm"/);
  assert.match(page, /canonical="\/ezize\/"/);
  assert.match(page, /Cake v0\.4/);
  assert.match(page, /Critter v0\.3/);
  assert.match(page, /Character v0\.1/);
  assert.match(page, /Open EZIZE · Private alpha/);
  assert.match(page, /href: "https:\/\/ez\.hob\.farm\/"/);
  assert.match(page, /customDomainReady: true/);
  assert.match(page, /Owner access only/);
  assert.match(page, /public generation is not open/);
  assert.doesNotMatch(page, /access pending|domain pending|awaiting verification/i);
  assert.doesNotMatch(page, /Application coming soon/);
  assert.match(page, /Recipe probability/);
  assert.match(page, /Observed population/);
  assert.match(page, /Visual distinction/);
  assert.match(page, /Collector preference/);
  assert.match(page, /alien chef decorating a cake/);
  assert.match(page, /2336×3504 portrait PNG/);
  assert.match(page, /OpenAI GPT Image/);
  assert.match(page, /HobFarm/);
  assert.match(page, /Grimoire/);
  assert.match(page, /Wildcard Machine/);
  assert.match(page, /OpenAI/);
  assert.match(page, /PNG download/);
  assert.match(page, /Development record/);
  assert.match(page, /Insert coin\. Get an EZ\./);
  assert.match(page, /What is an EZ\?/);
  assert.match(page, /One pull\. One recipe\. One EZ\./);
  assert.match(page, /Ledger identity and provenance/);
  assert.match(page, /One pull produces an[\s\S]*<strong>EZ<\/strong>; more than one are <strong>EZs<\/strong>/);
  assert.match(page, /An EZ does not need a HobFarm gallery/);
  assert.match(page, /no specific gallery, collection, or adoptable listing is live yet/);
  assert.match(page, /<EzizeEvidence priority \/>/);
  assert.doesNotMatch(page, /\beasie\b/i);
  assert.doesNotMatch(page, /NFT|blockchain|OpenSea|on-chain|mint(?:ed|ing|able)?/i);
});

test("EZIZE public evidence uses cropped and responsive local media", () => {
  const component = read("src/components/workshop/EzizeEvidence.astro");
  const registry = read("src/data/media-registry.ts");

  for (const path of [
    "public/media/ezize/ezize-app-private-alpha-480.webp",
    "public/media/ezize/ezize-app-private-alpha-640.webp",
    "public/media/ezize/ezize-corrupted-cake-640.webp",
    "public/media/ezize/ezize-corrupted-cake-1200.webp",
  ]) {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), true, `${path} must exist`);
  }

  assert.match(component, /srcset=/);
  assert.match(component, /Private-alpha probability machine, cropped to the public-safe generation window/);
  assert.match(registry, /"ezize\.app\.private-alpha"/);
  assert.match(registry, /"ezize\.output\.corrupted-cake"/);
});

test("former Cute and Corrupted product routes resolve directly to EZIZE", () => {
  const redirects = read("public/_redirects");
  const navigation = read("src/data/navigation.ts");
  const hierarchy = read("src/data/site-hierarchy.ts");
  const programRoute = read("src/pages/workshop/[program].astro");

  for (const route of [
    "/gallery/cute-corrupted/",
    "/visual-systems/cute-corrupted/",
    "/departments/cute-corrupted/",
    "/cute-and-corrupted/",
  ]) {
    assert.match(redirects, new RegExp(`${route.replaceAll("/", "\\/")}\\s+\\/ezize\\/\\s+301`));
  }
  assert.match(navigation, /label: "EZIZE", href: "\/ezize\/"/);
  assert.match(hierarchy, /id: "cute-corrupted"[\s\S]*name: "EZIZE Origins"[\s\S]*href: "\/workshop\/cute-and-corrupted\/"/);
  assert.match(hierarchy, /inNav: false[\s\S]*status: "historical"/);
  assert.match(programRoute, /workshopPrograms[\s\S]*getStaticPaths/);
});
