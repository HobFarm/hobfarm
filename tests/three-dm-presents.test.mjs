import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("HobFarm Presents exposes all five series from shared hierarchy data", () => {
  const data = read("src/data/site-hierarchy.ts");
  const hub = read("src/pages/presents/index.astro");

  for (const title of ["3 Degrees of Dick Miller", "Magazine Time Machine", "Other Alice Adventures", "Funnies", "HobFarm TV"]) {
    assert.match(data, new RegExp(title));
  }
  assert.match(hub, /presentsSeries/);
  assert.match(hub, /theme-film/);
  assert.match(hub, /theme-broadcast/);
});

test("3DM has one canonical hub and nested introductory article", () => {
  const hub = read("src/pages/presents/3-degrees-of-dick-miller/index.astro");
  const article = read("src/content/articles/3dm/enter-the-millerverse.md");
  const articleRoutes = read("src/pages/articles/[...slug].astro");
  const redirects = read("public/_redirects");

  assert.match(hub, /THREE_DM_PATH/);
  assert.match(article, /canonical: "\/presents\/3-degrees-of-dick-miller\/enter-the-millerverse\/"/);
  assert.match(articleRoutes, /!articleUsesSeries\(entry\.data, "3dm"\)/);
  assert.match(redirects, /\/projects\/hobfarm-tv\/3-degrees-of-dick-miller\s+\/presents\/3-degrees-of-dick-miller\/\s+301/);
  assert.match(redirects, /\/departments\/hobfarm-presents\/3dm\/\s+\/presents\/3-degrees-of-dick-miller\/\s+301/);
});

test("legacy 3DM features preserve their URLs without entering the strict canonical series", () => {
  const articlePaths = [
    "src/content/articles/they-had-names-doll-family.mdx",
    "src/content/articles/topless-party-in-outer-space.md",
    "src/content/articles/the-censor-eats-its-own-tail.mdx",
  ];
  const redirects = read("public/_redirects");
  const layout = read("src/layouts/ThreeDMEntryLayout.astro");
  const presentsHub = read("src/pages/presents/index.astro");

  for (const path of articlePaths) {
    const article = read(path);
    const slug = path.split("/").pop().replace(/\.(md|mdx)$/, "");

    assert.match(article, /^department: hobfarm-presents$/m);
    assert.match(article, /^series: 3dm$/m);
    assert.match(article, /^presentsSeries: 3dm$/m);
    assert.match(article, /^mesh:\r?\n[\s\S]*?^  series: \[\]$/m);
    assert.match(article, new RegExp(`^canonical: "/articles/${slug}/"$`, "m"));
    assert.match(
      redirects,
      new RegExp(
        `/presents/3-degrees-of-dick-miller/${slug}/?\\s+/articles/${slug}/\\s+301`,
      ),
    );
  }

  assert.match(layout, /import Lightbox from "@\/components\/gallery\/Lightbox"/);
  assert.match(layout, /<Lightbox client:only="react" \/>/);
  assert.match(presentsHub, /articleUsesSeries\(article\.data, "3dm"\)/);
});

test("3DM launch uses the supplied editorial voice and honest media state", () => {
  const hub = read("src/pages/presents/3-degrees-of-dick-miller/index.astro");
  const article = read("src/content/articles/3dm/enter-the-millerverse.md");
  const combined = `${hub}\n${article}`;

  for (const phrase of [
    "Every movie leads somewhere. The interesting ones lead to Dick Miller.",
    "Three degrees. Real connections. No vibes. Bring receipts.",
    "The shortest route proves the connection. The Millerverse reveals why it matters.",
    "Dick Miller kept showing up.",
    "Pick a name. Follow the credits. Enter the Millerverse.",
  ]) assert.match(combined, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(hub, /First screenings in production/);
  assert.doesNotMatch(hub, /fake latest episode/i);
});

test("the Millerverse introduction is the sourced central trunk article", () => {
  const article = read("src/content/articles/3dm/enter-the-millerverse.md");
  const layout = read("src/layouts/ThreeDMEntryLayout.astro");

  assert.match(article, /dick-miller-bucket-of-blood\.jpg/);
  assert.match(article, /The Undead<\/em> is where the reader enters/);
  assert.match(article, /A Bucket of Blood[\s\S]*Dick Miller becomes the main character/);
  assert.match(article, /## What 3DM is/);
  assert.match(article, /## How a route works/);
  assert.match(article, /## What the Millerverse contains/);
  assert.match(article, /## The research rule/);
  assert.match(article, /billy-barty-undead-1957\.jpg/);
  assert.equal((article.match(/https:\/\/cdn\.hob\.farm\/3dm\/dick-miller\//g) ?? []).length, 18);
  assert.equal((article.match(/ loading="lazy"/g) ?? []).length, 17);
  assert.equal((article.match(/ alt="/g) ?? []).length, 17);
  assert.match(layout, /article-filmstrip--six/);
  assert.doesNotMatch(article, /—/);
});

test("3DM schema supports optional video, evidence chains, warnings, and sources", () => {
  const schema = read("src/content.config.ts");
  const article = read("src/content/articles/3dm/enter-the-millerverse.md");

  for (const field of ["presentsSeries", "entryType", "video", "connection", "degreeCount", "contentWarnings", "rightsNote", "sourceNotes"]) {
    assert.match(schema, new RegExp(field));
  }
  assert.match(schema, /min\(0\)\.max\(3\)/);
  assert.ok((article.match(/type: (?:documented-fact|historical-interpretation|promotional-claim)/g) ?? []).length >= 6);
});

test("3DM logo is rendered uncropped and entries remain discoverable", () => {
  const hero = read("src/pages/presents/3-degrees-of-dick-miller/index.astro");
  const card = read("src/components/presents/PresentsTitleCard.astro");
  const search = read("src/lib/search-index.ts");
  const rss = read("src/pages/presents/rss.xml.ts");

  assert.match(hero, /object-fit:contain/);
  assert.match(card, /object-fit: contain/);
  assert.match(search, /href: articlePath\(post\)/);
  assert.match(rss, /articleUsesSeries\(entry\.data, "3dm"\)/);
});

test("3DM links its interactive GPT companion from the hub and entry layout", () => {
  const titleData = read("src/data/presents-titles.ts");
  const hub = read("src/pages/presents/3-degrees-of-dick-miller/index.astro");
  const layout = read("src/layouts/ThreeDMEntryLayout.astro");

  assert.match(titleData, /g-682afb75dd04819189c82970670f6f7e-3-degrees-of-miller-3dm/);
  assert.match(hub, /Try the 3DM GPT/);
  assert.match(layout, /Test a connection with the 3DM GPT/);
});

test("the first 3DM connection feature documents the Billy Barty route", () => {
  const feature = read("src/content/articles/3dm/the-mouse-in-the-cat-musical.md");
  const hub = read("src/pages/presents/3-degrees-of-dick-miller/index.astro");

  assert.match(feature, /title: "The Mouse in the Cat Musical"/);
  assert.match(feature, /degreeCount: 3/);
  assert.match(feature, /Footlight Parade[\s\S]*Billy Barty[\s\S]*The Undead[\s\S]*Dick Miller/);
  assert.match(feature, /the-mouse-in-the-cat-musical-hero\.webp/);
  assert.match(feature, /eight years old/);
  assert.match(feature, /## The route reaches Dick Miller/);
  assert.match(feature, /Barty and Miller do not appear together/);
  assert.match(feature, /shared production credit, not an on-screen meeting/);
  assert.match(feature, /They never occupy the same frame/);
  assert.equal((feature.match(/https:\/\/cdn\.hob\.farm\/articles\/3dm-mouse-cat-musical\//g) ?? []).length, 9);
  assert.doesNotMatch(feature, /billy-barty-compilation\.jpg/);
  assert.doesNotMatch(feature, /No Footlight Parade[\s\S]*frames[\s\S]*are reproduced/);
  assert.match(hub, /Start with the cats\. Follow the mouse\./);
});

test("the 1933 Warner feature maps the production world behind the first route", () => {
  const feature = read("src/content/articles/3dm/1933-the-year-warner-bros-built-a-world.md");
  const mouseFeature = read("src/content/articles/3dm/the-mouse-in-the-cat-musical.md");
  const hub = read("src/pages/presents/3-degrees-of-dick-miller/index.astro");

  assert.match(feature, /title: "1933: The Year Warner Bros\. Built a World"/);
  assert.match(feature, /42nd Street[\s\S]*Gold Diggers of 1933[\s\S]*Footlight Parade/);
  assert.match(feature, /Warren William is the suspicious money man/);
  assert.match(feature, /William Powell is the charming fashion pirate/);
  assert.match(feature, /## What pre-Code actually means/);
  assert.match(feature, /written rules and consistent enforcement/);
  assert.match(feature, /mandatory PCA approval/);
  assert.match(feature, /There was no 1933 WAMPAS class/);
  assert.match(feature, /Ruby Keeler, Glenda Farrell, Aline MacMahon, and Bette Davis were not WAMPAS selections/);
  assert.match(feature, /## The crew built the impossible/);
  assert.match(feature, /I work around stages, mostly concerts/);
  assert.match(feature, /article-filmstrip/);
  assert.equal((feature.match(/https:\/\/cdn\.hob\.farm\/articles\/3dm-1933-wb\//g) ?? []).length, 34);
  assert.equal((feature.match(/ loading="lazy"/g) ?? []).length, 34);
  assert.equal((feature.match(/ alt="/g) ?? []).length, 34);
  assert.doesNotMatch(feature, /No Warner Bros\.[\s\S]*imagery is reproduced/);
  assert.doesNotMatch(feature, /—/);
  assert.match(mouseFeature, /1933: The Year Warner Bros\. Built a World/);
  assert.match(hub, /1933 is the hinge year/);
});

test("the McLuhan feature connects experimental television to the feed with R2 media", () => {
  const feature = read("src/content/articles/3dm/you-know-nothing-of-my-algorithm.mdx");
  const hub = read("src/pages/presents/3-degrees-of-dick-miller/index.astro");
  const combined = `${feature}\n${hub}`;

  assert.match(feature, /title: "You Know Nothing of My Algorithm"/);
  assert.match(feature, /Frank McHugh[\s\S]*The Last Hurrah[\s\S]*John Carradine[\s\S]*The Howling[\s\S]*Dick Miller/);
  assert.match(feature, /degreeCount: 2/);
  assert.match(feature, /MediaSystemComparison/);
  assert.match(feature, /FunnelBucketDiagram/);
  assert.match(feature, /https:\/\/cdn\.hob\.farm\/3dm\/you-know-nothing-of-my-algorithm\/hero-16x9\.png/);
  assert.match(feature, /hero-meta-1x1\.png/);
  assert.match(read("src/layouts/ThreeDMEntryLayout.astro"), /data\.socialImage \?\? image/);
  assert.doesNotMatch(feature, /\/images\/3dm\/you-know-nothing/);
  assert.doesNotMatch(feature, /—/);
  assert.match(combined, /The medium ate the schedule/);
});

test("the Broadway Babies feature documents the pre-crash musical and its Miller route", () => {
  const feature = read("src/content/articles/3dm/broadway-babies.md");
  const layout = read("src/layouts/ThreeDMEntryLayout.astro");
  const contentConfig = read("src/content.config.ts");
  const pagesConfig = read(".pages.yml");

  assert.match(feature, /title: "Broadway Babies: The Last Summer Before the Money Vanished"/);
  assert.match(feature, /degreeCount: 3/);
  assert.match(feature, /Sally Eilers[\s\S]*Bela Lugosi[\s\S]*Boris Karloff[\s\S]*Dick Miller/);
  assert.match(feature, /Sixteen hours is not a workday/);
  assert.match(feature, /The Broadway Babies are gone/);
  assert.match(feature, /broadway-babies-hero\.png/);
  assert.match(feature, /arrangement: horizontal-hero/);
  assert.match(feature, /broadway-babies-1929-lobby-card\.jpg/);
  assert.match(feature, /1929-broadway-babies-poster\.jpg/);
  assert.match(feature, /ad-for-broadway-babies-from-theatre-magazine-september-1929\.png/);
  assert.match(feature, /broadway-babies-ad-in-the-film-daily-jan-jun-1929-page-1330-crop-10183f\.jpg/);
  assert.match(feature, /dick-miller-the-terror\.jpg/);
  assert.match(feature, /archive\.org\/download\/musicals_202210/);
  assert.match(feature, /<video[\s\S]*controls[\s\S]*preload="metadata"/);
  assert.match(feature, /1933-the-year-warner-bros-built-a-world/);
  assert.match(feature, /the-mouse-in-the-cat-musical/);
  assert.equal((feature.match(/https:\/\/cdn\.hob\.farm\/3dm\/broadway-babies\//g) ?? []).length, 12);
  assert.equal((feature.match(/ loading="lazy"/g) ?? []).length, 10);
  assert.equal((feature.match(/ alt="/g) ?? []).length, 10);
  assert.match(layout, /article-archive-embed/);
  assert.match(layout, /three-dm-entry__hero--horizontal/);
  assert.match(layout, /three-dm-entry__hero--horizontal \.three-dm-entry__intro \{ order:1; \}/);
  assert.match(layout, /three-dm-entry__hero--horizontal \.three-dm-entry__logo \{ order:2;/);
  assert.doesNotMatch(layout, /three-dm-entry__hero--horizontal\{grid-template-columns:minmax/);
  assert.match(layout, /heroArrangement = data\.arrangement === "horizontal-hero" \? "horizontal" : "vertical"/);
  assert.match(layout, /three-dm-entry__hero--\$\{heroArrangement\}/);
  assert.match(layout, /three-dm-entry__hero--horizontal h1 \{ width:100%; max-width:none;/);
  assert.match(layout, /font-size:clamp\(2\.1rem,5vw,4\.75rem\)/);
  assert.match(layout, /text-wrap:balance/);
  assert.match(layout, /three-dm-entry__hero--vertical\{grid-template-columns:minmax/);
  assert.match(contentConfig, /arrangement: z\.enum\(\["horizontal-hero", "vertical-hero"\]\)\.optional\(\)/);
  assert.match(pagesConfig, /label: Article Hero Layout[\s\S]*options: \[horizontal-hero, vertical-hero\]/);
  assert.match(read("public/_headers"), /media-src[^\n]*https:\/\/archive\.org/);
  assert.match(read("public/_headers"), /media-src[^\n]*https:\/\/\*\.archive\.org/);
  assert.doesNotMatch(feature, /—/);
});
