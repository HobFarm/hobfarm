import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const lessonRoot = new URL("../src/content/academy/intellectual-self-defense/", import.meta.url);

test("the free course uses the shared Academy collection and generic routes", () => {
  const schema = read("src/content.config.ts");
  const registry = read("src/data/academy-courses.ts");
  const courseRoute = read("src/pages/academy/[courseSlug]/index.astro");
  const lessonRoute = read("src/pages/academy/[courseSlug]/[lessonSlug].astro");

  assert.match(schema, /const academy = defineCollection/);
  assert.match(registry, /slug: "intellectual-self-defense"/);
  assert.match(registry, /slug: avatarCourse\.slug/);
  assert.match(courseRoute, /contentAcademyCourses/);
  assert.match(lessonRoute, /getCollection\("academy"/);
  assert.ok(existsSync(new URL("../src/pages/academy/avatar-content-system/index.astro", import.meta.url)));
});
test("all nine ordered lessons are public and link back to the article", () => {
  const lessonFiles = readdirSync(lessonRoot).filter((name) => /\.(md|mdx)$/.test(name)).sort();
  assert.equal(lessonFiles.length, 9);

  lessonFiles.forEach((name, index) => {
    const lesson = read(`src/content/academy/intellectual-self-defense/${name}`);
    assert.match(lesson, new RegExp(`order: ${index}(?:\\r?\\n|$)`));
    assert.match(lesson, /relatedArticle: "\/articles\/the-card-catalog-started-talking-back\/"/);
    assert.match(lesson, /draft: false/);
    assert.match(lesson, /https:\/\/cdn\.hob\.farm\/self-defense\//);
  });
});

test("the feature and course form a verified two-way relationship", () => {
  const article = read("src/content/articles/the-card-catalog-started-talking-back.mdx");
  const registry = read("src/data/academy-courses.ts");
  const resolver = read("src/lib/content-relationships.ts");
  const layout = read("src/layouts/ArticleLayout.astro");

  assert.match(article, /relatedAcademy:\s+\- intellectual-self-defense/);
  assert.match(article, /relatedAcademy:[\s\S]*\- avatar-content-system/);
  assert.match(article, /https:\/\/cdn\.hob\.farm\/articles\/the-card-catalog-started-talking-back\/hero-card-catalog-talks-back-v1-og\.webp/);
  assert.match(article, /<SelfDefenseCourseCta \/>/);
  assert.match(registry, /articleHref: "\/articles\/the-card-catalog-started-talking-back\/"/);
  assert.match(resolver, /getAcademyCourse/);
  assert.match(layout, /RelatedContentRail/);
});

test("the article diagrams reserve space and load without a zero-height lazy trap", () => {
  const article = read("src/content/articles/the-card-catalog-started-talking-back.mdx");
  const figure = read("src/components/academy/AcademyFigure.astro");

  assert.equal(article.match(/loading="eager"/g)?.length, 3);
  assert.equal(article.match(/width=\{1600\}/g)?.length, 3);
  assert.equal(article.match(/height=\{900\}/g)?.length, 3);
  assert.match(figure, /width=\{width\}/);
  assert.match(figure, /height=\{height\}/);
  assert.match(figure, /loading=\{loading\}/);
  assert.match(figure, /\.academy-figure a \{ display: block; width: 100%; \}/);
});

test("the article separates the free course from the paid avatar follow-on", () => {
  const articleCta = read("src/components/articles/self-defense/SelfDefenseCourseCta.astro");
  const avatarData = read("src/data/avatar-content-system.ts");
  const membership = read("src/components/membership/OnboardingView.tsx");

  assert.match(articleCta, /Free HobFarm Academy course/);
  assert.match(articleCta, /Paid follow-on/);
  assert.match(articleCta, /Preview the paid avatar course/);
  assert.match(avatarData, /priceLabel: "\$5\/month"/);
  assert.match(avatarData, /freeLessonCount: 4/);
  assert.match(avatarData, /paidLessonCount: 12/);
  assert.match(membership, /Intellectual Self-Defense for Ordinary People remains free and public/);
  assert.doesNotMatch(membership, /title: "Digital Asset Packs"/);
});

test("the manifest is new-key-only and complete for both approved prefixes", () => {
  const manifest = JSON.parse(read("reports/intellectual-self-defense-asset-manifest.json"));
  assert.equal(manifest.bucket, "hobfarm-cdn");
  assert.equal(manifest.policy.new_keys_only, true);
  assert.equal(manifest.policy.overwrite_existing, false);
  assert.equal(manifest.policy.delete_or_rename_existing, false);
  assert.equal(manifest.assets.length, 31);

  const keys = new Set();
  for (const asset of manifest.assets) {
    assert.ok(
      asset.destination_key.startsWith("articles/the-card-catalog-started-talking-back/") ||
      asset.destination_key.startsWith("self-defense/"),
    );
    assert.equal(asset.public_url, `https://cdn.hob.farm/${asset.destination_key}`);
    assert.equal(asset.replacement_policy, "new-key-only; version filename on conflict; never overwrite");
    assert.match(asset.sha256, /^[a-f0-9]{64}$/);
    assert.ok(asset.bytes > 0);
    assert.equal(asset.upload_status, "uploaded");
    assert.equal(asset.verification_status, "verified");
    assert.equal(asset.remote_sha256, asset.sha256);
    assert.equal(asset.http_status, 200);
    assert.ok(asset.verified_content_type.startsWith(asset.content_type.split(";")[0]));
    assert.equal(keys.has(asset.destination_key), false, `duplicate key: ${asset.destination_key}`);
    keys.add(asset.destination_key);
  }
});

test("the course ships editable sources and two print-friendly worksheets", () => {
  const downloadRoot = "assets/intellectual-self-defense/downloads";
  for (const name of [
    "research-chatbot-custom-instructions.md",
    "creative-source-file-starter.md",
    "ai-output-receipt.md",
    "receipt-report.md",
    "my-intellectual-self-defense-protocol-v1.md",
    "ai-output-receipt-print.html",
    "my-intellectual-self-defense-protocol-v1-print.html",
  ]) {
    assert.ok(existsSync(new URL(`../${downloadRoot}/${name}`, import.meta.url)), name);
  }

  const worksheetRoute = read("src/pages/academy/[courseSlug]/worksheets/[worksheetSlug].astro");
  assert.match(worksheetRoute, /@media print/);
  assert.match(worksheetRoute, /ai-output-receipt/);
  assert.match(worksheetRoute, /my-intellectual-self-defense-protocol-v1/);
});
