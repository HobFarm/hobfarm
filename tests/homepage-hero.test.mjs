import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("homepage masthead unifies the publisher intro, current Editorial, and recent stories", () => {
  const homepage = read("src/components/home/MagazineFrontPage.astro");

  assert.match(homepage, /Independent publisher \+ creative studio/);
  assert.match(homepage, /Articles, media, games, and creative systems\./);
  assert.match(homepage, /publisher-masthead/);
  assert.match(homepage, /EditorialSectionRail/);
  assert.match(homepage, /Current Editorial/);
  assert.match(homepage, /Latest at HobFarm/);
  assert.match(homepage, /Recent stories/);
  assert.match(homepage, /getArticleSectionLabel/);
  assert.match(homepage, /fetchpriority="high"/);
  assert.match(homepage, /imageSrcset/);

  for (const label of ["Read the latest", "Explore Presents", "Open the Workshop"]) {
    assert.match(homepage, new RegExp(label));
  }
  assert.match(homepage, /href="\/workshop\/"/);
  assert.match(homepage, /href="\/presents\/"/);
  assert.doesNotMatch(homepage, /range-sampler/);
  assert.doesNotMatch(homepage, /KofiTipCard|publisher-front__mark/);
  assert.doesNotMatch(homepage, /hobfarm-rabbit-hole-logo\.mp4|hobfarm-drip-logo\.png/);
  assert.doesNotMatch(homepage, /<video|autoplay/);
  assert.match(homepage, /recentArticles = coverStory \? articles\.slice\(1, 6\)/);
  assert.match(homepage, /articlePath\(coverStory\)/);
});

test("homepage article cards use each article's own hero image", () => {
  const card = read("src/components/articles/ArticleCard.astro");

  assert.match(card, /articlePath\(post\)/);
  assert.match(card, /const hero = getArticleHero\(post\.data\)/);
  assert.doesNotMatch(card, /THREE_DM_LOGO/);
  assert.doesNotMatch(card, /presentsSeries === "3dm"/);
});

test("homepage section and Specials cards reuse published Editorial imagery", () => {
  const sections = read("src/components/home/HomeSectionOverview.astro");
  const specials = read("src/components/articles/EditorialSpecials.astro");
  const homeSpecials = read("src/components/home/HomeEditorialSpecials.astro");

  assert.match(sections, /articlePath\(section\.newest\)/);
  for (const component of [sections, specials]) {
    assert.match(component, /getArticleHero/);
    assert.match(component, /imageSrcset/);
    assert.match(component, /loading="lazy"/);
    assert.match(component, /alt=""/);
  }

  assert.match(homeSpecials, /showVisuals/);
  assert.match(specials, /MTM \/ Archive artifact/);
  assert.match(specials, /3DM \/ Cinema connection/);
  assert.match(specials, /Built \/ Place record/);
});
