import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("homepage hero leads with the publisher, section rail, current Editorial, and support", () => {
  const homepage = read("src/components/home/MagazineFrontPage.astro");

  assert.match(homepage, /Independent publisher \+ creative studio/);
  assert.match(homepage, /Articles, media, games, and creative systems\./);
  assert.match(homepage, /EditorialSectionRail/);
  assert.match(homepage, /Latest at HobFarm/);
  assert.match(homepage, /getArticleSectionLabel/);

  for (const label of ["Read the latest", "Explore Presents", "Open the Workshop"]) {
    assert.match(homepage, new RegExp(label));
  }
  assert.match(homepage, /href="\/workshop\/"/);
  assert.match(homepage, /href="\/presents\/"/);
  assert.doesNotMatch(homepage, /range-sampler/);
  assert.match(homepage, /KofiTipCard/);
  assert.match(homepage, /hobfarm-rabbit-hole-logo\.mp4/);
  assert.match(homepage, /poster="https:\/\/cdn\.hob\.farm\/brand\/hobfarm-drip-logo\.png"/);
  assert.match(homepage, /autoplay/);
  assert.match(homepage, /muted/);
  assert.match(homepage, /loop/);
  assert.match(homepage, /playsinline/);
  assert.match(homepage, /object-fit: cover/);
  assert.doesNotMatch(homepage, /hobfarm-logo-white\.svg/);
  assert.match(homepage, /recentArticles = coverStory \? articles\.slice\(1, 6\)/);
});

test("homepage article cards use each article's own hero image", () => {
  const card = read("src/components/articles/ArticleCard.astro");

  assert.match(card, /const hero = getArticleHero\(post\.data\)/);
  assert.doesNotMatch(card, /THREE_DM_LOGO/);
  assert.doesNotMatch(card, /presentsSeries === "3dm"/);
});
