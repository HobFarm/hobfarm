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

test("The Feed Is the Problem follows the RSS article and preserves the six-day queue", () => {
  const schedule = [
    ["hit-the-source-directly.mdx", "2026-08-21T16:20:00-07:00"],
    ["the-feed-is-the-problem.mdx", "2026-08-22T16:20:00-07:00"],
    ["dragons-lair-was-better-once-we-stopped-playing-it.mdx", "2026-08-23T16:20:00-07:00"],
    ["i-stopped-writing-prompts-and-built-a-machine-instead.mdx", "2026-08-24T16:20:00-07:00"],
    ["deserts-remember-water.mdx", "2026-08-25T16:20:00-07:00"],
    ["salton-sea-needs-an-outlet.mdx", "2026-08-26T16:20:00-07:00"],
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

test("the article explains the complete engagement economy and keeps its causal boundaries", () => {
  const narrative = body.split(/^\[\^doom-paper\]:/m)[0];
  const words = narrative.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’.-]*\b/gu) ?? [];
  assert.ok(words.length >= 3_000 && words.length <= 3_700, `article narrative has ${words.length} words`);
  assert.doesNotMatch(body, /—/);
  assert.doesNotMatch(body, /CDC|psychiatric|medication|overmedicat/i);
  assert.match(body, /Behavior is observable\. Motivation is inferred\./);
  assert.match(body, /one upstream system that can contribute to distress, amplify it, or keep it running/);
  assert.match(body, /Therapy deals with the person after the session\. The platform gets paid for the session\./);
  assert.match(body, /Beginning February 1, 2027/);
  assert.match(body, /10 million qualified Shorts views during the previous 90 days/);
  assert.match(body, /remain in the YouTube Partner Program/);
  assert.match(body, /long-form revenue is not affected/);
  assert.match(body, /20 million qualified Shorts views during the previous 90 days and 1,000 subscribers/);
  assert.match(body, /The rule is scheduled, not active as I write this/);
  assert.match(body, /Meta denies them/);
  assert.match(body, /advertising revenue rose 27 percent.*delivered ad impressions rose 14 percent/s);
  assert.match(body, /A feed is not a friend\./);
  assert.match(body, /I choose a source\. The source publishes\./);
  assert.match(body, /I use social platforms as databases with bad front doors\./);
  assert.match(body, /I chose to stop using their shit as the client\./);
  assert.match(body, /\/articles\/hit-the-source-directly\//);
  assert.match(body, /\/articles\/instagram-funnel-buckets\//);
  assert.match(body, /\/articles\/how-the-money-eats-the-medium\//);
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
  assert.match(figures, /10,000,000 qualified views/);
  assert.match(figures, /channel can remain in YPP/);
  assert.match(figures, /Shorts ad and subscription revenue pauses/);
  assert.match(figures, /Allegation under trial\. Meta denies the allegation\./);
});

test("the two publication assets match the verified immutable manifest", () => {
  const manifest = JSON.parse(readFileSync("reports/the-feed-is-the-problem/asset-manifest.json", "utf8"));
  assert.equal(manifest.article_slug, "the-feed-is-the-problem");
  assert.equal(manifest.assets.length, 2);
  assert.equal(manifest.policy.new_keys_only, true);
  assert.equal(manifest.policy.overwrite_existing, false);
  assert.equal(manifest.live_figures.length, 1);
  assert.equal(manifest.live_figures[0].figure_id, "reader-creator-platform-loop");
  assert.equal(manifest.live_figures[0].dimensions.minimum_qa_viewport_css_pixels, 390);
  assert.match(manifest.live_figures[0].sha256, /^[a-f0-9]{64}$/);

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
