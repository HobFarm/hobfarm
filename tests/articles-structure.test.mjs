import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("articles route and collection layer exist without exposing public blog routes", () => {
  const routeFiles = [
    "src/pages/articles/index.astro",
    "src/pages/articles/page/[page].astro",
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

test("the Articles index links every archive page without repeating the cover story", () => {
  const articlesPage = read("src/pages/articles/index.astro");
  const archivePage = read("src/pages/articles/page/[page].astro");
  const pagination = read("src/lib/article-pagination.ts");

  assert.match(articlesPage, /getArticleArchivePage\(allPosts, 1\)/);
  assert.match(articlesPage, /<ArticlePagination currentPage=\{1\} totalPages=\{totalPages\}/);
  assert.match(archivePage, /Array\.from\(\{ length: Math\.max\(0, totalPages - 1\) \}/);
  assert.match(archivePage, /getArticleArchivePage\(allPosts, page\)/);
  assert.match(pagination, /const start = 1 \+ \(safePage - 1\) \* ARTICLE_CARDS_PER_PAGE/);
  assert.match(pagination, /return articles\.slice\(start, start \+ ARTICLE_CARDS_PER_PAGE\)/);
});

test("category taxonomy and routes exist", () => {
  const files = [
    "src/data/departments.ts",
    "src/pages/articles/[category].astro",
    "src/components/archive/CategoryArchive.astro",
  ];
  for (const file of files) {
    assert.equal(existsSync(join(root, file)), true, `${file} should exist`);
  }

  // /departments/ is retired: Presents sections, Workshop programs, and
  // editorial categories each own their own prefix.
  assert.equal(
    existsSync(join(root, "src/pages/departments")),
    false,
    "the /departments/ route tree should be gone",
  );
});

test("departmentPath routes each category to its owning section", () => {
  const departments = read("src/data/departments.ts");

  assert.match(departments, /presentsSections/);
  assert.match(departments, /"hobfarm-presents":\s*"\/presents\/"/);
  assert.match(departments, /"magazine-time-machine":\s*"\/presents\/magazine-time-machine\/"/);
  assert.match(departments, /"workshop-notes":\s*"\/workshop\/workshop-notes\/"/);
  assert.match(departments, /"cute-corrupted":\s*"\/workshop\/cute-and-corrupted\/"/);
  assert.match(departments, /`\/articles\/\$\{canonical\}\/`/);
});

test("active department hero images are defined and rendered on department surfaces", () => {
  const departments = read("src/data/departments.ts");
  const hierarchy = read("src/data/site-hierarchy.ts");
  const homepage = read("src/components/home/SiteSections.astro");
  const presentsHub = read("src/pages/presents/index.astro");
  const categoryArchive = read("src/components/archive/CategoryArchive.astro");
  const funnies = read("src/pages/presents/funnies/index.astro");

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

  assert.match(homepage, /section\.heroImage/);
  assert.match(presentsHub, /entry\.heroImage/);
  assert.match(categoryArchive, /department\.heroImage/);
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

  assert.match(navigation, /label:\s*"Articles",\s*href:\s*"\/articles\/"/);
  assert.doesNotMatch(navigation, /label:\s*"Blog"/);
});

test("legacy blog URLs redirect to canonical articles URLs", () => {
  const redirects = read("public/_redirects");

  assert.match(redirects, /\/blog\s+\/articles\/\s+301/);
  assert.match(redirects, /\/blog\/posts\/:slug\s+\/articles\/:slug\/\s+301/);
  assert.match(redirects, /\/blog\/category\/:category\s+\/articles\/:category\/\s+301/);
  assert.match(redirects, /\/blog\/tags\/:tag\s+\/articles\/tags\/:tag\/\s+301/);
});

test("article tag routes use one case-insensitive canonical slug", () => {
  const articles = read("src/lib/articles.ts");
  const tagRoute = read("src/pages/articles/tags/[tag].astro");
  const redirects = read("public/_redirects");

  assert.match(articles, /export function normalizeArticleTag/);
  assert.match(articles, /encodeURIComponent\(normalizeArticleTag\(tag\)\)/);
  assert.match(tagRoute, /params: \{ tag: normalizedTag \}/);
  assert.match(tagRoute, /post\.data\.tags\.some/);
  assert.match(redirects, /\/articles\/tags\/StyleFusion\/\s+\/articles\/tags\/stylefusion\/\s+301/);
});

test("legacy category URLs redirect to canonical category destinations", () => {
  const redirects = read("public/_redirects");

  // Satire has no content, so it generates no page and lands on the feed.
  assert.match(redirects, /\/articles\/category\/fake-ads\s+\/articles\/\s+301/);
  assert.match(redirects, /\/articles\/category\/technical\s+\/workshop\/workshop-notes\/\s+301/);
  assert.match(
    redirects,
    /\/articles\/category\/cultural-thread\s+\/articles\/essays-arguments\/\s+301/,
  );
  assert.match(
    redirects,
    /\/blog\/category\/cultural-thread\/\s+\/articles\/essays-arguments\/\s+301/,
  );
  assert.match(
    redirects,
    /\/articles\/category\/before-after\s+\/workshop\/before-and-after\/\s+301/,
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
    "src/pages/presents/funnies/index.astro",
    "src/pages/presents/funnies/[series]/index.astro",
    "src/pages/presents/funnies/[series]/[slug].astro",
    "src/pages/presents/other-alice-adventures/cast/[character].astro",
    "src/data/comic-series.ts",
    "src/lib/comics.ts",
  ];
  for (const file of files) {
    assert.equal(existsSync(join(root, file)), true, `${file} should exist`);
  }
});

test("Larry cartoons series content and uploaded CDN comics are wired", () => {
  const series = read("src/data/comic-series.ts");
  const funnies = read("src/pages/presents/funnies/index.astro");
  const seriesPage = read("src/pages/presents/funnies/[series]/index.astro");
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
    "src/pages/presents/funnies/index.astro",
    "src/pages/presents/funnies/[series]/index.astro",
    "src/pages/presents/funnies/[series]/[slug].astro",
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

  const seriesPage = read("src/pages/presents/funnies/[series]/index.astro");
  assert.match(seriesPage, /fallbackHeroImage/);

  for (const file of routeFiles) {
    const source = read(file);
    assert.match(source, /import FunniesHero from "@\/components\/funnies\/FunniesHero\.astro"/);
    assert.match(source, /<FunniesHero/);
  }
});

test("legacy funny-pages department redirects to funnies", () => {
  const redirects = read("public/_redirects");

  assert.match(redirects, /\/departments\/funny-pages\s+\/presents\/funnies\/\s+301/);
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

test("the Articles cover story prefers each article's hero over a series logo", () => {
  const articlesPage = read("src/pages/articles/index.astro");

  assert.match(articlesPage, /getArticleHero\(coverStory\.data\)/);
  assert.match(articlesPage, /coverHero === THREE_DM_LOGO/);
  assert.match(articlesPage, /timeZone: "UTC"/);
  assert.doesNotMatch(
    articlesPage,
    /coverPreservesArtwork\s*=\s*coverStory\?\.data\.presentsSeries\s*===\s*"3dm"/,
  );
});

test("article embeds allow trusted media players through CSP", () => {
  const headers = read("public/_headers");

  assert.match(headers, /Content-Security-Policy:/);
  assert.match(headers, /frame-src[^;\n]*https:\/\/open\.spotify\.com/);
  assert.match(headers, /frame-src[^;\n]*https:\/\/www\.youtube\.com/);
  assert.match(headers, /frame-src[^;\n]*https:\/\/www\.youtube-nocookie\.com/);
});
