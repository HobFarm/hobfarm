import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import YAML from "yaml";
import { isArticlePublicAt } from "../src/lib/article-publication.ts";

const articlePath = "src/content/articles/the-feed-is-the-problem.mdx";
const source = readFileSync(articlePath, "utf8");
const frontmatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
assert.ok(frontmatterMatch, "article frontmatter should parse");
const frontmatter = YAML.parse(frontmatterMatch[1]);
const body = source.slice(frontmatterMatch[0].length);

test("The Feed Is the Problem follows the RSS article and preserves the five-day queue", () => {
  const schedule = [
    ["hit-the-source-directly.mdx", "2026-08-21T16:20:00-07:00"],
    ["the-feed-is-the-problem.mdx", "2026-08-22T16:20:00-07:00"],
    ["deserts-remember-water.mdx", "2026-08-23T16:20:00-07:00"],
    ["i-stopped-writing-prompts-and-built-a-machine-instead.mdx", "2026-08-24T16:20:00-07:00"],
    ["salton-sea-needs-an-outlet.mdx", "2026-08-25T16:20:00-07:00"],
  ];
  const timestamps = schedule.map(([filename, expected]) => {
    const article = readFileSync(`src/content/articles/${filename}`, "utf8");
    const actual = article.match(/^publishedAt:\s*(.+)$/m)?.[1].trim();
    assert.equal(actual, expected);
    return Date.parse(actual);
  });
  for (let index = 1; index < timestamps.length; index += 1) {
    assert.equal(timestamps[index] - timestamps[index - 1], 86_400_000);
  }

  assert.equal(frontmatter.title, "The Feed Is the Problem");
  assert.equal(frontmatter.canonical, "/articles/the-feed-is-the-problem/");
  assert.equal(frontmatter.status, "scheduled");
  assert.equal(frontmatter.draft, false);
  assert.equal(frontmatter.mesh.section, "culture");
  assert.deepEqual(frontmatter.mesh.series, []);
});

test("the scheduled follow-up stays private until its release instant", () => {
  const release = new Date(frontmatter.publishedAt);
  assert.equal(isArticlePublicAt(frontmatter, new Date(release.getTime() - 1)), false);
  assert.equal(isArticlePublicAt(frontmatter, release), true);
});

test("the article keeps the supplied argument and its medical and causal boundaries", () => {
  const words = body.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’.-]*\b/gu) ?? [];
  assert.ok(words.length >= 2_500 && words.length <= 3_500, `article body has ${words.length} words`);
  assert.doesNotMatch(body, /—/);
  assert.match(body, /Behavior is observable\. Motivation is inferred\./);
  assert.match(body, /Therapy is not the villain in this story\. Medication is not the feed\./);
  assert.match(body, /I cannot connect those findings into a claim that social media caused the increase in therapy or medication\./);
  assert.match(body, /A feed is not a friend\./);
  assert.match(body, /I choose a source\. The source publishes\./);
  assert.match(body, /\/articles\/hit-the-source-directly\//);
  assert.match(body, /<SubscribeToHobFarm/);

  for (const kind of ["accounting", "loop", "pipelines", "friend", "curriculum"]) {
    assert.match(body, new RegExp(`<FeedFigure kind="${kind}"`));
  }
});

test("the figures expose live text transcripts and distinguish evidence from synthesis", () => {
  const figures = readFileSync("src/components/articles/the-feed-is-the-problem/FeedFigure.astro", "utf8");
  assert.match(figures, /Read the graphic transcript/);
  assert.match(figures, /measured relationship/);
  assert.match(figures, /system synthesis/);
  assert.match(figures, /prefers-reduced-motion/);
  assert.match(figures, /Quality still depends on the source/);
});

test("the two publication assets match the verified immutable manifest", () => {
  const manifest = JSON.parse(readFileSync("reports/the-feed-is-the-problem/asset-manifest.json", "utf8"));
  assert.equal(manifest.article_slug, "the-feed-is-the-problem");
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
    assert.match(asset.public_url, /^https:\/\/cdn\.hob\.farm\/articles\/the-feed-is-the-problem\//);
    assert.ok(asset.width > 0 && asset.height > 0);
    assert.ok(asset.alt_text && asset.caption && asset.rights_basis);
  }
});
