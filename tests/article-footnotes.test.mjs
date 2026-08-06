import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const articlesDirectory = "src/content/articles";

test("article MDX enables GFM footnotes", async () => {
  const config = await readFile("astro.config.mjs", "utf8");

  assert.match(config, /mdx\(\{\s*gfm:\s*true\s*\}\)/);
});

test("every article footnote reference has exactly one definition", async () => {
  const entries = await readdir(articlesDirectory, { withFileTypes: true });
  const articlePaths = entries
    .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
    .map((entry) => path.join(articlesDirectory, entry.name));

  for (const articlePath of articlePaths) {
    const source = await readFile(articlePath, "utf8");
    const references = [
      ...source.matchAll(/\[\^([^\]]+)\](?!:)/g),
    ].map((match) => match[1]);
    const definitions = [
      ...source.matchAll(/^\[\^([^\]]+)\]:/gm),
    ].map((match) => match[1]);

    const uniqueReferences = new Set(references);
    const uniqueDefinitions = new Set(definitions);

    for (const reference of uniqueReferences) {
      assert.ok(
        uniqueDefinitions.has(reference),
        `${articlePath} is missing a definition for [^${reference}]`,
      );
    }

    assert.equal(
      definitions.length,
      uniqueDefinitions.size,
      `${articlePath} has a duplicate footnote definition`,
    );
  }
});
