import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import YAML from "yaml";
import { isArticlePublicAt } from "../src/lib/article-publication.ts";

const slug = "dragons-lair-was-better-once-we-stopped-playing-it";
const articlePath = `src/content/articles/${slug}.mdx`;
const source = readFileSync(articlePath, "utf8");
const frontmatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
assert.ok(frontmatterMatch, "article frontmatter should parse");
const frontmatter = YAML.parse(frontmatterMatch[1]);
const body = source.slice(frontmatterMatch[0].length);

test("the Dragon's Lair article owns the August 23 slot in the six-day queue", () => {
  assert.equal(frontmatter.title, "Dragon's Lair is better on YouTube");
  assert.equal(frontmatter.canonical, `/articles/${slug}/`);
  assert.equal(frontmatter.publishedAt, "2026-08-23T16:20:00-07:00");
  assert.equal(frontmatter.status, "published");
  assert.equal(frontmatter.draft, false);
  assert.equal(frontmatter.mesh.section, "technology");
  assert.deepEqual(frontmatter.mesh.series, []);

  const collisions = readdirSync("src/content/articles", { recursive: true })
    .filter((name) => /\.mdx?$/.test(name) && name !== `${slug}.mdx`)
    .filter((name) => {
      const candidate = readFileSync(`src/content/articles/${name}`, "utf8");
      return /^publishedAt:\s*2026-08-23T16:20:00-07:00$/m.test(candidate);
    });
  assert.deepEqual(collisions, []);
});

test("the article stays private until its release instant", () => {
  const release = new Date(frontmatter.publishedAt);
  assert.equal(isArticlePublicAt(frontmatter, new Date(release.getTime() - 1)), false);
  assert.equal(isArticlePublicAt(frontmatter, release), true);
});

test("the article preserves the supplied personal history and value argument", () => {
  const words = body.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’.\-]*\b/gu) ?? [];
  assert.ok(words.length >= 1_500 && words.length <= 2_000, `article body has ${words.length} words`);
  assert.doesNotMatch(body, /—/);
  assert.match(body, /The peer-group judgment was immediate: \*Dragon’s Lair\* was a waste\./);
  assert.match(body, /Then there was \*LED Storm\*\. A friend and I competed at it repeatedly\./);
  assert.match(body, /Difficulty was not the objection\./);
  assert.match(body, /I played \*Mortal Kombat\* in the arcade first\. The home ports came later\./);
  assert.match(body, /I did not outgrow games\. Games grew into the machine I already wanted to understand\./);
  assert.match(body, /We were waiting for the movie to escape\./);
  assert.match(body, /\/articles\/hit-the-source-directly\//);

  for (const kind of ["timeline", "quarters", "canon", "hardware"]) {
    assert.match(body, new RegExp(`<ArcadeFigure kind="${kind}"`));
  }
});

test("the graphics remain live, accessible, and clear about evidence boundaries", () => {
  const figures = readFileSync(`src/components/articles/${slug}/ArcadeFigure.astro`, "utf8");
  assert.match(figures, /Read the graphic transcript/);
  assert.match(figures, /The personal line is memory/);
  assert.match(figures, /not audited average play time/);
  assert.match(figures, /prefers-reduced-motion/);
});

test("the publication assets match the verified immutable manifest", () => {
  const manifest = JSON.parse(readFileSync(`reports/${slug}/asset-manifest.json`, "utf8"));
  assert.equal(manifest.article_slug, slug);
  assert.equal(manifest.scheduled_publication, "2026-08-23T16:20:00-07:00");
  assert.equal(manifest.assets.length, 2);
  assert.equal(manifest.policy.new_keys_only, true);
  assert.equal(manifest.policy.overwrite_existing, false);

  for (const asset of manifest.assets) {
    assert.ok(existsSync(asset.source_file), `${asset.asset_id} source should exist`);
    const localHash = createHash("sha256").update(readFileSync(asset.source_file)).digest("hex");
    assert.equal(localHash, asset.sha256, `${asset.asset_id} local hash`);
    assert.equal(asset.remote_sha256, asset.sha256, `${asset.asset_id} remote hash`);
    assert.equal(asset.verification_status, "verified", `${asset.asset_id} verification`);
    assert.match(asset.collision_check, /destination absent/);
    assert.match(asset.public_url, new RegExp(`^https://cdn\\.hob\\.farm/articles/${slug}/`));
    assert.ok(asset.width > 0 && asset.height > 0);
    assert.ok(asset.alt_text && asset.caption && asset.rights_basis);
  }
});
