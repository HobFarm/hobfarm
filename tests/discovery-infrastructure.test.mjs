import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("sitemaps exclude thin discovery and private transaction routes", async () => {
  const [config, curated, tagIndex, tagDetail, membership, headers] = await Promise.all([
    read("astro.config.mjs"),
    read("src/pages/sitemap.xml.ts"),
    read("src/pages/articles/tags/index.astro"),
    read("src/pages/articles/tags/[tag].astro"),
    read("src/pages/membership/success.astro"),
    read("public/_headers"),
  ]);

  assert.match(config, /pathname\.startsWith\("\/articles\/tags\/"\)/);
  assert.match(config, /academyCourseManifests/);
  assert.match(config, /noindexAcademyPaths/);
  for (const route of [
    "/academy/checkout/complete/",
    "/membership/success/",
    "/shop/order-received/",
  ]) {
    assert.ok(config.includes(`"${route}"`), `${route} must be excluded from the generated sitemap`);
    assert.ok(headers.includes(route.replace(/\/$/, "*")) || headers.includes("/academy/checkout/*"));
  }
  assert.match(tagIndex, /\bnoindex\b/);
  assert.match(tagDetail, /\bnoindex\b/);
  assert.match(membership, /\bnoindex\b/);

  assert.match(curated, /selectedWorkshopProjects/);
  for (const route of ["/workshop/projects/", "/workshop/workshop-notes/"]) {
    assert.ok(curated.includes(route));
  }
  assert.doesNotMatch(curated, /\/articles\/tags\//);
});

test("robots keeps public retrieval open and training crawlers separate", async () => {
  const robots = await read("public/robots.txt");
  const [publicPolicy, trainingPolicy] = robots.split("# Large-scale training crawlers");

  assert.match(publicPolicy, /User-agent:\s*\*/);
  assert.match(publicPolicy, /Content-signal:\s*search=yes, ai-input=yes, ai-train=no/);
  for (const agent of [
    "Googlebot",
    "Bingbot",
    "OAI-SearchBot",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
  ]) {
    assert.ok(publicPolicy.includes(agent), `${agent} should be documented as allowed for public retrieval`);
  }
  for (const agent of ["ClaudeBot", "Google-Extended", "GPTBot"]) {
    assert.match(trainingPolicy, new RegExp(`User-agent: ${agent}`));
  }
  assert.doesNotMatch(trainingPolicy, /User-agent: (?:OAI-SearchBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User)/);
});

test("public feeds use canonical article URLs, release dates, and optional images", async () => {
  const feeds = await Promise.all([
    read("src/pages/rss.xml.js"),
    read("src/pages/articles/[category]/rss.xml.ts"),
    read("src/pages/presents/rss.xml.ts"),
    read("src/pages/workshop/workshop-notes/rss.xml.ts"),
  ]);

  for (const feed of feeds) {
    assert.match(feed, /getPublishedArticles\(\)/);
    assert.match(feed, /getArticleDate/);
    assert.match(feed, /link:\s*`\$\{articlePath\([^)]+\)\}\/`/);
    assert.match(feed, /media:content/);
  }

  assert.match(feeds[3], /getArticleDepartment\(entry\.data\) === "workshop-notes"/);
  const workshopProgram = await read("src/pages/workshop/[program].astro");
  assert.match(workshopProgram, /\/workshop\/workshop-notes\/rss\.xml/);
});

test("the post-deploy discovery checklist covers external state", async () => {
  const checklist = await read("docs/discovery-post-deploy-checklist.md");
  for (const item of [
    "Google Search Console",
    "Bing Webmaster Tools",
    "Crawler Hints",
    "Security Events",
    "utm_source=chatgpt.com",
  ]) {
    assert.ok(checklist.includes(item));
  }
});

test("Bing ownership verification is published at the site root", async () => {
  const verification = await read("public/BingSiteAuth.xml");
  assert.match(verification, /^<\?xml version="1\.0"\?>/);
  assert.match(verification, /<users>\s*<user>[A-F0-9]{32}<\/user>\s*<\/users>/);
});
