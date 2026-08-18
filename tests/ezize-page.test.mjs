import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("EZIZE has a canonical public product story for the live probability machine", () => {
  const page = read("src/pages/ezize/index.astro");

  assert.match(page, /title="EZIZE: The HobFarm Probability Machine"/);
  assert.match(page, /new URL\("\/ezize\/", siteOrigin\)/);
  assert.match(page, /const appUrl = "https:\/\/ezize\.hob\.farm\/"/);
  assert.doesNotMatch(page, /https:\/\/ez\.hob\.farm\//);
  assert.doesNotMatch(page, /private[- ]alpha|owner access only|public generation is not open/i);
  assert.match(page, /Insert coin\.<br \/>Get a collectible EZ\./);
  assert.match(page, /Cake/);
  assert.match(page, /Critter/);
  assert.match(page, /Character/);
  assert.match(page, /Cute/);
  assert.match(page, /Corrupted/);
  assert.match(page, /AI renders the final image\. EZIZE decides what image to ask for\./);
  assert.match(page, /Generation Path Odds are the theoretical chance that the same version of EZIZE would make the same sequence of weighted selections again\./);
  assert.match(page, /Generation Path Odds do not mean an identical pixel-for-pixel image would render again\. They describe the machine's selection path\./);
  assert.match(page, /EZ-76BD76D0A0822404/);
  assert.match(page, /ezize-76bd76d0a0822404-sheet\.png/);
  assert.match(page, /ezize-76bd76d0a0822404\.mp4/);
  assert.match(page, /1 EZ coin = 1 complete collectible EZ\./);
  for (const pack of ["$5", "$9", "$17", "$42", "$80"]) assert.match(page, new RegExp(pack.replace("$", "\\$")));
  for (const route of ["terms", "privacy", "refunds", "license"]) assert.match(page, new RegExp(`\\/ezize\\/${route}\\/`));
  assert.match(page, /YOUR EZ IS YOURS TO USE\./);
  assert.match(page, /not cryptocurrency, blockchain tokens, an investment/);
  assert.doesNotMatch(page, /\b(?:NFTs?|OpenSea|on-chain|mint(?:ed|ing|able)?|wallets?)\b/i);
});

test("EZIZE publishes dedicated service terms, privacy, refunds, and output rights", () => {
  const terms = read("src/pages/ezize/terms.astro");
  const privacy = read("src/pages/ezize/privacy.astro");
  const refunds = read("src/pages/ezize/refunds.astro");
  const license = read("src/pages/ezize/license.astro");

  assert.match(terms, /Kris Reynolds in Las Vegas, Nevada/);
  assert.match(terms, /One EZ coin pays for one complete EZ generation/);
  assert.match(terms, /Each successfully paid month adds five EZ coins/);
  assert.match(privacy, /Account creation does not subscribe you to marketing/);
  assert.match(privacy, /HobFarm does not store full payment-card numbers or security codes/);
  assert.match(refunds, /within 14 days of purchase if none of the coins/);
  assert.match(refunds, /technical failure prevents EZIZE from delivering a completed output/);
  assert.match(license, /worldwide, perpetual, non-exclusive, transferable, sublicensable, royalty-free license/);
  assert.match(license, /does not promise that your EZ is eligible for copyright protection/);
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
