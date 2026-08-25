import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import YAML from "yaml";
import { isArticlePublicAt } from "../src/lib/article-publication.ts";

const articlePath = "src/content/articles/i-stopped-writing-prompts-and-built-a-machine-instead.mdx";
const source = readFileSync(articlePath, "utf8");
const frontmatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
assert.ok(frontmatterMatch, "article frontmatter should parse");
const frontmatter = YAML.parse(frontmatterMatch[1]);
const body = source.slice(frontmatterMatch[0].length);

test("the EZIZE Workshop Note sits between Dragon's Lair and Deserts Remember Water", () => {
  const predecessorSource = readFileSync("src/content/articles/dragons-lair-was-better-once-we-stopped-playing-it.mdx", "utf8");
  const predecessorMatch = predecessorSource.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(predecessorMatch);
  const predecessor = YAML.parse(predecessorMatch[1]);
  const successorSource = readFileSync("src/content/articles/deserts-remember-water.mdx", "utf8");
  const successorMatch = successorSource.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(successorMatch);
  const successor = YAML.parse(successorMatch[1]);

  assert.equal(frontmatter.title, "I Stopped Writing Prompts and Built a Machine Instead");
  assert.equal(frontmatter.canonical, "/articles/i-stopped-writing-prompts-and-built-a-machine-instead/");
  assert.equal(frontmatter.publishedAt, "2026-08-24T16:20:00-07:00");
  assert.equal(Date.parse(frontmatter.publishedAt) - Date.parse(predecessor.publishedAt), 86_400_000);
  assert.equal(Date.parse(successor.publishedAt) - Date.parse(frontmatter.publishedAt), 86_400_000);
  assert.equal(frontmatter.status, "published");
  assert.equal(frontmatter.draft, false);
  assert.equal(frontmatter.department, "workshop-notes");
  assert.equal(frontmatter.format, "workshop-note");
  assert.equal(frontmatter.mesh.section, "technology");
  assert.deepEqual(frontmatter.mesh.series, []);
  assert.equal(frontmatter.hero, "https://cdn.hob.farm/ezize/ezize-hero.png");
  assert.equal(frontmatter.heroImage, "https://cdn.hob.farm/ezize/ezize-hero.png");
  assert.equal(frontmatter.socialImage, "https://cdn.hob.farm/ezize/ezize-hero.png");
  assert.equal(frontmatter.thumbnail, "https://cdn.hob.farm/ezize/ezize-square.jpg");

  const collisions = readdirSync("src/content/articles", { recursive: true })
    .filter((name) => /\.mdx?$/.test(name) && name !== "i-stopped-writing-prompts-and-built-a-machine-instead.mdx")
    .filter((name) => {
      const candidate = readFileSync(`src/content/articles/${name}`, "utf8");
      return /^publishedAt:\s*2026-08-24T16:20:00-07:00$/m.test(candidate);
    });
  assert.deepEqual(collisions, []);
});

test("the article stays private until its release instant", () => {
  const release = new Date(frontmatter.publishedAt);
  assert.equal(isArticlePublicAt(frontmatter, new Date(release.getTime() - 1)), false);
  assert.equal(isArticlePublicAt(frontmatter, release), true);
});

test("the article explains the machine without the retired ownership model", () => {
  const words = body.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’.-]*\b/gu) ?? [];
  assert.ok(words.length >= 2_200 && words.length <= 3_000, `article body has ${words.length} words`);
  assert.doesNotMatch(body, /—/);
  assert.match(body, /digital collectible image/);
  assert.match(body, /Cake is not Character with food substituted into the subject field\./);
  assert.match(body, /The schema became the stable contract\. The packs became the adjustable content layer\./);
  assert.match(body, /1,000,000/);
  assert.match(body, /549 compiled choices/);
  assert.match(body, /The forms stay distinct, but they can still rhyme\./);
  assert.match(body, /I press MAKE IMAGE\. The machine decides what happens next\./);
  assert.match(body, /\/articles\/hit-the-source-directly\//);
  assert.match(body, /\/ezize\//);

  for (const kind of ["system-flow", "audit", "trace"]) {
    assert.match(body, new RegExp(`<EzizeArticleFigure kind="${kind}"`));
  }
  for (const kind of ["gpk", "alien-chef", "corrupted-cake", "corrupted-critter"]) {
    assert.match(body, new RegExp(`<EzizeArticleMedia kind="${kind}"`));
  }
  assert.match(body, /<EzizeEvidence \/>/);

  const retiredTerms = /\b(?:NFTs?|blockchain|OpenSea|on-chain|mint(?:ed|ing|able)?)\b/i;
  assert.doesNotMatch(source, retiredTerms);
  const productPage = readFileSync("src/pages/ezize/index.astro", "utf8");
  assert.match(productPage, /not cryptocurrency, blockchain tokens, an investment/);
  assert.doesNotMatch(productPage, /\b(?:NFTs?|OpenSea|on-chain|mint(?:ed|ing|able)?|wallets?)\b/i);
  assert.doesNotMatch(readFileSync("src/pages/workshop/index.astro", "utf8"), retiredTerms);
});

test("the article media matches its generated asset manifest", () => {
  const manifest = JSON.parse(readFileSync("reports/ezize-article/asset-manifest.json", "utf8"));
  const publicRoot = "public/articles/i-stopped-writing-prompts-and-built-a-machine-instead";

  assert.equal(manifest.articleSlug, "i-stopped-writing-prompts-and-built-a-machine-instead");
  assert.equal(manifest.outputs.length, 11);
  assert.equal(manifest.omittedSuppliedAssets.length, 2);

  for (const output of manifest.outputs) {
    const path = `${publicRoot}/${output.file}`;
    assert.equal(existsSync(path), true, `${path} should exist`);
    const bytes = readFileSync(path);
    assert.equal(bytes.length, output.bytes, `${output.file} byte size`);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), output.sha256, `${output.file} hash`);
    assert.ok(output.width > 0 && output.height > 0);
    assert.equal(output.mime, "image/webp");
  }

  assert.equal(existsSync(`${publicRoot}/07-corrupted-cake-ui.png`), false);
  assert.equal(existsSync(`${publicRoot}/09-corrupted-critter-ui.png`), false);
});
