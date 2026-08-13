import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("EZIZE has a canonical public explainer with honest product status", () => {
  const page = read("src/pages/ezize/index.astro");

  assert.match(page, /title="EZIZE \| HobFarm"/);
  assert.match(page, /canonical="\/ezize\/"/);
  assert.match(page, /Cake v0\.4/);
  assert.match(page, /Critter v0\.3/);
  assert.match(page, /Character v0\.1/);
  assert.match(page, /Application coming soon/);
  assert.match(page, /Generation probability/);
  assert.match(page, /Number minted/);
  assert.match(page, /Market value/);
  assert.match(page, /HobFarm/);
  assert.match(page, /Grimoire/);
  assert.match(page, /Wildcard Machine/);
  assert.match(page, /OpenAI/);
  assert.match(page, /Base/);
  assert.match(page, /OpenSea/);
});

test("former Cute and Corrupted product routes resolve directly to EZIZE", () => {
  const redirects = read("public/_redirects");
  const navigation = read("src/data/navigation.ts");

  for (const route of [
    "/gallery/cute-corrupted/",
    "/visual-systems/cute-corrupted/",
    "/departments/cute-corrupted/",
    "/cute-and-corrupted/",
  ]) {
    assert.match(redirects, new RegExp(`${route.replaceAll("/", "\\/")}\\s+\\/ezize\\/\\s+301`));
  }
  assert.match(navigation, /label: "EZIZE", href: "\/ezize\/"/);
});
