import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const articlePath =
  "src/content/articles/susan-denbergs-american-dream.mdx";
const headersPath = "public/_headers";
const publication = "2026-08-02T17:20:00-07:00";

function field(source, name) {
  return source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim();
}

test("Susan Denberg feature keeps its release metadata, licensed media, and Playboy reporting boundary", async () => {
  const [article, headers] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(headersPath, "utf8"),
  ]);

  const status = field(article, "status");

  assert.equal(field(article, "publishedAt"), publication);
  assert.equal(field(article, "pubDate"), "2026-08-02");
  assert.ok(["scheduled", "published"].includes(status));

  assert.match(article, /Frankenstein_Created_Woman_%26_The_Mummy/);
  assert.match(article, /tile\.loc\.gov\/storage-services/);
  assert.match(article, /Resorts_World_Las_Vegas/);
  assert.match(headers, /img-src[^;\n]*https:\/\/upload\.wikimedia\.org/);
  assert.match(headers, /img-src[^;\n]*https:\/\/tile\.loc\.gov/);
  assert.match(article, /CC BY-SA 2\.0/);
  assert.doesNotMatch(article, /The supplied scans are being used as a primary source, not republished/);
  assert.doesNotMatch(article, /The pictorial’s nude centerfold and full magazine pages do not appear here/);
  assert.doesNotMatch(article, /playboy-centerfold\.(?:jpg|jpeg|png|webp)/i);
});
