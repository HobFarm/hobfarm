import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");
const exists = (file) => existsSync(join(root, file));

const requiredFiles = [
  "src/lib/agent-corpus.ts",
  "src/pages/llms.txt.ts",
  "src/pages/llms-full.txt.ts",
  "src/pages/sitemap.xml.ts",
  "src/pages/index.md.ts",
  "src/pages/about/index.md.ts",
  "src/pages/articles/index.md.ts",
  "src/pages/articles/llms.txt.ts",
  "src/pages/articles/[...slug]/index.md.ts",
  "src/pages/gallery/index.md.ts",
  "src/pages/gallery/llms.txt.ts",
  "src/pages/gallery/[...slug]/index.md.ts",
  "src/pages/workshop/index.md.ts",
  "src/pages/workshop/llms.txt.ts",
  "src/pages/products/llms.txt.ts",
  "src/pages/shop/index.md.ts",
  "src/pages/academy/index.md.ts",
  "src/pages/academy/llms.txt.ts",
  "src/pages/grimoire/index.md.ts",
  "src/pages/legal/usage/index.md.ts",
  "src/pages/presents/index.md.ts",
  "src/pages/presents/llms.txt.ts",
  "src/pages/presents/[series]/index.md.ts",
  "src/pages/presents/other-alice-adventures/cast/[character]/index.md.ts",
  "functions/_middleware.ts",
  "public/.well-known/agent-skills/index.json",
  "public/.well-known/agent-skills/read-hobfarm-corpus/SKILL.md",
];

test("agent-readable corpus routes and markdown alternates are wired", () => {
  for (const file of requiredFiles) {
    assert.equal(exists(file), true, `${file} should exist`);
  }

  const corpus = read("src/lib/agent-corpus.ts");
  for (const route of [
    "https://hob.farm/about/",
    "https://hob.farm/workshop/stylefusion/",
    "https://hob.farm/grimoire/",
    "https://hob.farm/gallery/asset-lab/atomic-noir-color-system/",
    "https://hob.farm/visual-systems/",
    "https://hob.farm/workshop/",
    "https://hob.farm/legal/usage/",
    "https://hob.farm/shop/",
    "https://hob.farm/articles/",
    "https://hob.farm/gallery/",
    "https://hob.farm/presents/",
    "https://hob.farm/presents/other-alice-adventures/",
    "https://hob.farm/presents/other-alice-adventures/cast/alice/",
  ]) {
    assert.match(
      corpus,
      new RegExp(route.replaceAll("/", "\\/").replaceAll(".", "\\.")),
    );
  }
});

test("llms corpus excludes private, raw, paid, and thin discovery surfaces", () => {
  const corpus = read("src/lib/agent-corpus.ts");

  assert.match(corpus, /PRIVATE_BOUNDARIES/);
  assert.match(corpus, /getPublicAgentArticles/);
  assert.match(corpus, /getPublicAgentGalleryEntries/);
  assert.match(corpus, /getPublicProducts/);
  assert.match(corpus, /draft/);
  assert.match(corpus, /status/);

  for (const forbidden of [
    "/account/",
    "/login/",
    "/api/",
    "/articles/tags/",
    "stylefusion-prompts",
    "stylefusion-export",
    ".zip",
    ".psd",
    ".txt",
    "paidAssetPolicy",
    "irFile",
  ]) {
    assert.match(
      corpus,
      new RegExp(
        `forbiddenAgentPattern[\\s\\S]*${forbidden.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      ),
      `agent corpus should explicitly guard ${forbidden}`,
    );
  }
});

test("global headers advertise discovery and deliberate content signals", () => {
  const headers = read("public/_headers");

  assert.match(
    headers,
    /Link:\s*<\/sitemap\.xml>; rel="sitemap"; type="application\/xml"/,
  );
  assert.match(
    headers,
    /Link:\s*<\/llms\.txt>; rel="alternate"; type="text\/plain"/,
  );
  assert.match(
    headers,
    /Link:\s*<\/\.well-known\/agent-skills\/index\.json>; rel="service-desc"; type="application\/json"/,
  );
  assert.match(
    headers,
    /Content-Signal:\s*ai-train=no, search=yes, ai-input=yes/,
  );
  assert.match(headers, /\/api\/\*/);
  assert.match(headers, /\/account\*/);
  assert.match(headers, /\/login\*/);
  assert.match(
    headers,
    /Content-Signal:\s*ai-train=no, search=no, ai-input=no/,
  );
});

test("robots policy allows public agent reading while protecting private and training-only access", () => {
  const robots = read("public/robots.txt");

  assert.match(robots, /User-agent:\s*\*/);
  assert.match(
    robots,
    /Content-signal:\s*search=yes, ai-input=yes, ai-train=no, use=reference/,
  );
  assert.match(robots, /Disallow:\s*\/login/);
  assert.match(robots, /Disallow:\s*\/account/);
  assert.match(robots, /Disallow:\s*\/api\//);
  assert.match(robots, /User-agent:\s*GPTBot[\s\S]*Disallow:\s*\//);
  assert.match(robots, /User-agent:\s*Google-Extended[\s\S]*Disallow:\s*\//);
  assert.doesNotMatch(robots, /User-agent:\s*OAI-SearchBot/);
  assert.doesNotMatch(robots, /User-agent:\s*Google-CloudVertexBot/);
});

test("markdown negotiation middleware serves markdown only for public content routes", () => {
  const middleware = read("functions/_middleware.ts");

  assert.match(middleware, /Accept/);
  assert.match(middleware, /text\/markdown/);
  assert.match(middleware, /Content-Type": "text\/markdown; charset=utf-8"/);
  assert.match(middleware, /Vary": "Accept"/);
  assert.match(
    middleware,
    /Content-Signal": "ai-train=no, search=yes, ai-input=yes"/,
  );
  assert.match(middleware, /PRIVATE_PREFIXES/);
  assert.match(middleware, /MARKDOWN_PREFIXES/);
  assert.doesNotMatch(middleware, /mcp|oauth|x402/i);
});

test("agent skill index is valid and matches the skill digest", () => {
  const manifest = JSON.parse(
    read("public/.well-known/agent-skills/index.json"),
  );
  const skill = read(
    "public/.well-known/agent-skills/read-hobfarm-corpus/SKILL.md",
  );
  const digest = createHash("sha256").update(skill).digest("hex");

  assert.equal(
    manifest.$schema,
    "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  );
  assert.equal(Array.isArray(manifest.skills), true);
  assert.equal(manifest.skills.length, 1);
  assert.equal(manifest.skills[0].name, "read-hobfarm-corpus");
  assert.equal(manifest.skills[0].type, "skill-md");
  assert.equal(
    manifest.skills[0].url,
    "/.well-known/agent-skills/read-hobfarm-corpus/SKILL.md",
  );
  assert.equal(manifest.skills[0].digest, `sha256:${digest}`);
  assert.match(skill, /name: read-hobfarm-corpus/);
  assert.match(skill, /description: Discover, read, cite/);
  assert.match(skill, /Do not use HobFarm public content for model training/);
  assert.match(skill, /Private and Paid Boundaries/);
  assert.match(skill, /Cite the canonical HobFarm URL/);
});

test("no fake protocol discovery catalogs are added", () => {
  for (const file of [
    "public/.well-known/oauth-authorization-server",
    "public/.well-known/oauth-protected-resource",
    "public/.well-known/mcp.json",
    "public/.well-known/webmcp.json",
    "public/.well-known/api-catalog.json",
    "public/.well-known/x402.json",
  ]) {
    assert.equal(
      exists(file),
      false,
      `${file} should not exist without a real implementation`,
    );
  }
});

test("public sitemap alias is curated and excludes private surfaces", () => {
  const sitemap = read("src/pages/sitemap.xml.ts");

  assert.match(sitemap, /getPublicAgentArticles/);
  assert.match(sitemap, /getPublicAgentGalleryEntries/);
  assert.match(sitemap, /getPublicAgentProjects/);
  assert.match(sitemap, /getPublicAgentGrimoireEntries/);
  assert.match(sitemap, /Content-Type": "application\/xml; charset=utf-8"/);
  assert.doesNotMatch(sitemap, /articles\/tags/);
  assert.doesNotMatch(sitemap, /\/api\//);
  assert.doesNotMatch(sitemap, /\/account\//);
  assert.doesNotMatch(sitemap, /\/login\//);
});

test("agent-readable public surfaces expose appropriate structured data", () => {
  const styleFusion = read(
    "src/components/projects/StyleFusionProjectPage.astro",
  );
  const shop = read("src/pages/shop/index.astro");
  const workshop = read("src/pages/workshop/index.astro");
  const academy = read("src/pages/academy/index.astro");
  const grimoire = read("src/pages/grimoire/index.astro");
  const legalLayout = read("src/layouts/LegalLayout.astro");
  const galleryDetail = read("src/components/gallery/GalleryDetail.astro");

  assert.match(styleFusion, /"@type": "CreativeWork"/);
  assert.match(styleFusion, /FAQPage/);
  assert.match(styleFusion, /mainEntity/);
  assert.match(shop, /shopJsonLd/);
  assert.match(shop, /"@type": "CollectionPage"/);
  assert.match(shop, /"@type": "ItemList"/);
  assert.doesNotMatch(shop, /"@type": "Product"/);
  assert.match(workshop, /workshopJsonLd/);
  assert.match(workshop, /CollectionPage/);
  assert.match(academy, /academyJsonLd/);
  assert.match(grimoire, /grimoireJsonLd/);
  assert.match(legalLayout, /legalJsonLd/);
  assert.match(legalLayout, /"@type": "CreativeWork"/);
  assert.match(galleryDetail, /ImageObject/);
  assert.match(galleryDetail, /BreadcrumbList/);
});
