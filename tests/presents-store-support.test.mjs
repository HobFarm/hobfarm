import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Presents exposes the new editorial journey", async () => {
  const page = await read("src/pages/presents/index.astro");
  for (const anchor of ["3dm", "magazine-time-machine", "other-alice", "funnies", "hobfarm-tv"]) {
    assert.match(page, new RegExp(`entry.id|${anchor}`));
  }
  assert.match(page, /prefers-reduced-motion/);
});

test("support platforms have one funding job each", async () => {
  const platforms = await read("src/data/support-platforms.ts");
  assert.match(platforms, /https:\/\/ko-fi\.com\/hobfarm\//);
  for (const id of ["kofi", "hobfarm", "shop", "academy"]) {
    assert.match(platforms, new RegExp(`id: "${id}"`));
  }
  assert.doesNotMatch(platforms, /patreon/i);
});

test("shop products use durable detail routes", async () => {
  const products = await read("src/lib/products.ts");
  const card = await read("src/components/shop/DropCard.astro");
  assert.match(products, /`\/shop\/\$\{productSlug\(product\)\}\/`/);
  assert.match(card, /View details/);
});
