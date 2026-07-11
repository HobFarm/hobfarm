import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("articles route and collection layer exist without exposing public blog routes", () => {
  const routeFiles = [
    "src/pages/articles/index.astro",
    "src/pages/articles/[...slug].astro",
    "src/pages/articles/tags/index.astro",
    "src/pages/articles/tags/[tag].astro",
  ];

  for (const file of routeFiles) {
    assert.equal(existsSync(join(root, file)), true, `${file} should exist`);
  }

  const contentConfig = read("src/content.config.ts");
  const pagesConfig = read(".pages.yml");

  assert.equal(existsSync(join(root, "src/content/articles")), true, "articles content directory should exist");
  assert.equal(existsSync(join(root, "src/content/blog")), false, "legacy blog content directory should be retired");
  assert.match(contentConfig, /const articles = defineCollection/);
  assert.match(contentConfig, /base:\s*"\.\/src\/content\/articles"/);
  assert.doesNotMatch(contentConfig, /const blog = defineCollection/);
  assert.match(pagesConfig, /name:\s*articles/);
  assert.match(pagesConfig, /path:\s*src\/content\/articles/);
  assert.doesNotMatch(pagesConfig, /name:\s*blog/);
});

test("departments taxonomy and routes exist", () => {
  const files = [
    "src/data/departments.ts",
    "src/pages/departments/index.astro",
    "src/pages/departments/[slug].astro",
  ];
  for (const file of files) {
    assert.equal(existsSync(join(root, file)), true, `${file} should exist`);
  }
});

test("active department hero images are defined and rendered on department surfaces", () => {
  const departments = read("src/data/departments.ts");
  const homepage = read("src/components/home/SiteSections.astro");
  const departmentHub = read("src/pages/departments/index.astro");
  const departmentDetail = read("src/pages/departments/[slug].astro");
  const funnies = read("src/pages/departments/funnies.astro");

  const expectedHeroImages = {
    "magazine-time-machine": "magazine-time-machine-hero.png",
    funnies: "funnies-hero.png",
    "cute-corrupted": "cute-corrupted-hero.png",
    "before-after-eras": "before-after-hero.png",
    "hobfarm-presents": "hobfarm-presents-hero.png",
    "workshop-notes": "workshop-hero.png",
    "essays-arguments": "essay-hero.png",
  };

  for (const [slug, image] of Object.entries(expectedHeroImages)) {
    assert.match(
      departments,
      new RegExp(
        `slug:\\s*"${slug}"[\\s\\S]*?heroImage:\\s*"https://cdn\\.hob\\.farm/hero-images/${image}"`,
      ),
      `${slug} should define the expected CDN hero image`,
    );
  }

  assert.match(homepage, /section\.image/);
  assert.match(departmentHub, /dep\.heroImage/);
  assert.match(departmentDetail, /department\.heroImage/);
  assert.match(funnies, /department\.heroImage/);
});

test("the retired articles category route is gone", () => {
  assert.equal(
    existsSync(join(root, "src/pages/articles/category/[category].astro")),
    false,
    "articles category route should be replaced by /departments and redirects",
  );
});

test("navigation prefers Articles over Blog", () => {
  const navigation = read("src/data/navigation.ts");

  assert.match(navigation, /label:\s*"Articles",\s*href:\s*"\/articles"/);
  assert.doesNotMatch(navigation, /label:\s*"Blog"/);
});

test("legacy blog URLs redirect to canonical articles URLs", () => {
  const redirects = read("public/_redirects");

  assert.match(redirects, /\/blog\s+\/articles\/\s+301/);
  assert.match(redirects, /\/blog\/posts\/:slug\s+\/articles\/:slug\s+301/);
  assert.match(redirects, /\/blog\/category\/:category\s+\/departments\/:category\/\s+301/);
  assert.match(redirects, /\/blog\/tags\/:tag\s+\/articles\/tags\/:tag\s+301/);
});

test("legacy category URLs redirect to canonical department pages", () => {
  const redirects = read("public/_redirects");

  assert.match(redirects, /\/articles\/category\/fake-ads\s+\/departments\/satire\/\s+301/);
  assert.match(redirects, /\/articles\/category\/technical\s+\/departments\/workshop-notes\/\s+301/);
  assert.match(
    redirects,
    /\/articles\/category\/cultural-thread\s+\/departments\/essays-arguments\/\s+301/,
  );
  assert.match(
    redirects,
    /\/blog\/category\/cultural-thread\/\s+\/departments\/essays-arguments\/\s+301/,
  );
  assert.match(
    redirects,
    /\/articles\/category\/before-after\s+\/departments\/before-after-eras\/\s+301/,
  );
});

test("search index resolves article entries to canonical departments", () => {
  const searchIndex = read("src/lib/search-index.ts");

  assert.match(searchIndex, /resolveDepartment/);
});

test("search index includes published comics without adding them to articles", () => {
  const searchIndex = read("src/lib/search-index.ts");

  assert.match(searchIndex, /getPublishedComics/);
  assert.match(searchIndex, /type:\s*"comic"/);
  assert.doesNotMatch(searchIndex, /\/articles\/\$\{comic/);
});

test("Funnies comics subsystem routes and data exist", () => {
  const files = [
    "src/pages/departments/funnies.astro",
    "src/pages/funnies/[series]/index.astro",
    "src/pages/funnies/[series]/[slug].astro",
    "src/pages/characters/[character].astro",
    "src/data/comic-series.ts",
    "src/lib/comics.ts",
  ];
  for (const file of files) {
    assert.equal(existsSync(join(root, file)), true, `${file} should exist`);
  }
});

test("Larry cartoons series content and uploaded CDN comics are wired", () => {
  const series = read("src/data/comic-series.ts");
  const funnies = read("src/pages/departments/funnies.astro");
  const seriesPage = read("src/pages/funnies/[series]/index.astro");
  const expectedComics = [
    "larry-gothcat-hulmut-heidi-dinner.jpg",
    "larry-helmut-bauhaus.jpg",
    "larry-helmut-cabaret.jpg",
    "larry-helmut-poodles.jpg",
    "larry-leon-berger.jpg",
    "larry-poker.jpg",
  ];

  assert.match(
    funnies,
    /Single-panel cartoons, recurring cast members, old comic-strip logic/,
  );
  assert.match(series, /Larry is a retired Prussian officer in dachshund form/);
  assert.match(series, /title:\s*"Larry Cartoons"/);
  assert.match(series, /heroImage:\s*"https:\/\/cdn\.hob\.farm\/funnies\/larry\/larry-hero\.png"/);
  assert.match(series, /supportingCast/);
  assert.match(seriesPage, /series\.heroImage/);
  assert.match(seriesPage, /series\.engine/);
  assert.match(seriesPage, /series\.supportingCast/);

  for (const file of expectedComics) {
    const path = `src/content/comics/${file.replace(/\.(jpg|png)$/, ".md")}`;
    assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
    assert.match(read(path), new RegExp(`https://cdn\\.hob\\.farm/funnies/larry/${file}`));
  }
});

test("all Funnies pages use the shared contained-media hero", () => {
  const heroComponent = "src/components/funnies/FunniesHero.astro";
  const routeFiles = [
    "src/pages/departments/funnies.astro",
    "src/pages/funnies/[series]/index.astro",
    "src/pages/funnies/[series]/[slug].astro",
  ];

  assert.equal(existsSync(join(root, heroComponent)), true, `${heroComponent} should exist`);

  const hero = read(heroComponent);
  assert.match(hero, /<header class="overflow-hidden">/);
  assert.match(hero, /<figure[\s\S]*data-funnies-hero-media/);
  assert.match(hero, /<img[\s\S]*class="[^"]*object-contain/);
  assert.doesNotMatch(hero, /<header class="[^"]*(rounded|border|bg-base)/);
  assert.doesNotMatch(hero, /backdrop-blur/);
  assert.doesNotMatch(hero, /absolute inset-0 size-full object-cover/);
  assert.doesNotMatch(hero, /lg:min-h-\[500px\]/);
  assert.match(hero, /<slot name="meta"/);

  const seriesPage = read("src/pages/funnies/[series]/index.astro");
  assert.match(seriesPage, /fallbackHeroImage/);

  for (const file of routeFiles) {
    const source = read(file);
    assert.match(source, /import FunniesHero from "@\/components\/funnies\/FunniesHero\.astro"/);
    assert.match(source, /<FunniesHero/);
  }
});

test("legacy funny-pages department redirects to funnies", () => {
  const redirects = read("public/_redirects");

  assert.match(redirects, /\/departments\/funny-pages\s+\/departments\/funnies\/\s+301/);
});

test("search and rss use the canonical article path helper", () => {
  const searchIndex = read("src/lib/search-index.ts");
  const rss = read("src/pages/rss.xml.js");

  assert.match(searchIndex, /type:\s*"article"/);
  assert.match(searchIndex, /href:\s*articlePath\(post\)/);
  assert.match(rss, /link:\s*articlePath\(post\)/);
});

test("article share controls include a generated share post", () => {
  const shareButtons = read("src/components/articles/ShareButtons.astro");
  const articleLayout = read("src/layouts/ArticleLayout.astro");

  assert.match(shareButtons, /data-share-post/);
  assert.match(shareButtons, /data-copy-share-post/);
  assert.match(shareButtons, /data-native-share/);
  assert.match(shareButtons, /Share post/);
  assert.match(articleLayout, /tags=\{frontmatter\.tags\}/);
});

test("article embeds allow trusted media players through CSP", () => {
  const headers = read("public/_headers");

  assert.match(headers, /Content-Security-Policy:/);
  assert.match(headers, /frame-src[^;\n]*https:\/\/open\.spotify\.com/);
  assert.match(headers, /frame-src[^;\n]*https:\/\/www\.youtube\.com/);
  assert.match(headers, /frame-src[^;\n]*https:\/\/www\.youtube-nocookie\.com/);
});
