import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import YAML from "yaml";
import { isArticlePublicAt } from "../src/lib/article-publication.ts";

const articlePath = "src/content/articles/hit-the-source-directly.mdx";
const source = readFileSync(articlePath, "utf8");
const frontmatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
assert.ok(frontmatterMatch, "article frontmatter should parse");
const frontmatter = YAML.parse(frontmatterMatch[1]);
const body = source.slice(frontmatterMatch[0].length);

test("Hit the Source Directly owns the next exact publication slot", () => {
  const predecessorSource = readFileSync("src/content/articles/the-future-was-already-there.mdx", "utf8");
  const predecessorYaml = predecessorSource.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(predecessorYaml);
  const predecessor = YAML.parse(predecessorYaml[1]);

  const release = new Date(frontmatter.publishedAt);
  const priorRelease = new Date(predecessor.publishedAt);
  assert.equal(frontmatter.title, "Hit the Source Directly");
  assert.equal(frontmatter.publishedAt, "2026-08-21T16:20:00-07:00");
  assert.equal(release.getTime() - priorRelease.getTime(), 86_400_000);
  assert.equal(frontmatter.status, "scheduled");
  assert.equal(frontmatter.draft, false);
  assert.equal(frontmatter.mesh.section, "technology");
  assert.deepEqual(frontmatter.mesh.series, []);
});

test("the scheduled article is excluded before release and public at the boundary", () => {
  const release = new Date(frontmatter.publishedAt);
  assert.equal(isArticlePublicAt(frontmatter, new Date(release.getTime() - 1)), false);
  assert.equal(isArticlePublicAt(frontmatter, release), true);

  const combinedFeed = readFileSync("src/pages/rss.xml.js", "utf8");
  const sectionFeed = readFileSync("src/pages/articles/[category]/rss.xml.ts", "utf8");
  assert.match(combinedFeed, /getPublishedArticles\(\)/);
  assert.match(sectionFeed, /getPublishedArticles\(\)/);
  assert.match(sectionFeed, /mesh\?\.section === section\.slug/);
});

test("the article carries the required argument, provenance, and practical path", () => {
  const words = body.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’.-]*\b/gu) ?? [];
  assert.ok(words.length >= 2_500 && words.length <= 4_000, `article body has ${words.length} words`);
  assert.doesNotMatch(body, /—/);
  assert.match(body, /RSS bypasses the engagement factory/);
  assert.match(body, /RSS does not solve the quality problem/);
  assert.match(body, /The Future Was Already There/);
  assert.match(body, /Evan Schwartz converted the 2025 results/);
  assert.doesNotMatch(body, /Eric Schwartz/);
  assert.match(body, /Karpathy did not curate the 92 blogs/);
  assert.match(body, /https:\/\/hob\.farm\/rss\.xml/);
  for (const kind of ["timeline", "pipelines", "opml", "consumers"]) {
    assert.match(body, new RegExp(`<RSSFigure kind="${kind}"`));
  }
});

test("feed discovery and human subscription routes stay connected", () => {
  const baseLayout = readFileSync("src/layouts/BaseLayout.astro", "utf8");
  const articleLayout = readFileSync("src/layouts/ArticleLayout.astro", "utf8");
  const subscribePage = readFileSync("src/pages/subscribe/index.astro", "utf8");
  const subscribeComponent = readFileSync("src/components/articles/SubscribeToHobFarm.astro", "utf8");

  assert.match(baseLayout, /rel="alternate" type="application\/rss\+xml"/);
  assert.match(articleLayout, /SubscribeToHobFarm/);
  assert.match(subscribePage, /editorialSections\.map/);
  assert.match(subscribePage, /If the feed opens as raw XML/);
  assert.match(subscribeComponent, /No copy button\?/);
  assert.match(subscribeComponent, /aria-live="polite"/);
});

test("the six publication assets match the verified immutable manifest", () => {
  const manifest = JSON.parse(readFileSync("reports/hit-the-source-directly/asset-manifest.json", "utf8"));
  assert.equal(manifest.article_slug, "hit-the-source-directly");
  assert.equal(manifest.assets.length, 6);
  assert.equal(manifest.policy.new_keys_only, true);
  assert.equal(manifest.policy.overwrite_existing, false);

  for (const asset of manifest.assets) {
    assert.ok(existsSync(asset.source_file), `${asset.asset_id} source should exist`);
    const localBytes = readFileSync(asset.source_file);
    const localHash = createHash("sha256").update(localBytes).digest("hex");
    assert.equal(localHash, asset.sha256, `${asset.asset_id} local hash`);
    assert.equal(asset.remote_sha256, asset.sha256, `${asset.asset_id} remote hash`);
    assert.equal(asset.verification_status, "verified", `${asset.asset_id} verification`);
    assert.match(asset.collision_check, /destination absent/);
    assert.match(asset.public_url, /^https:\/\/cdn\.hob\.farm\/articles\/hit-the-source-directly\//);
    assert.ok(asset.width > 0 && asset.height > 0);
    assert.ok(asset.alt_text && asset.caption && asset.rights_basis);
  }
});
