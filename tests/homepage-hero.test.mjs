import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("homepage hero leads with the publisher, support, an explained work index, and three useful actions", () => {
  const homepage = read("src/components/home/MagazineFrontPage.astro");

  assert.match(homepage, /Independent publisher \+ creative studio/);
  assert.match(homepage, /Articles, cartoons, visual worlds, and the workshop behind them\./);
  assert.match(homepage, /HobFarm is where I write articles, make cartoons, build characters and worlds/);

  for (const label of ["Read the latest", "Explore the Workshop", "Start a project"]) {
    assert.match(homepage, new RegExp(label));
  }
  assert.match(homepage, /href="\/workshop\/"/);
  assert.match(homepage, /href="\/contact\/\?subject=creative-project"/);
  assert.match(homepage, /class="range-sampler"/);
  for (const id of ["editorial", "character", "carriage", "alice", "stylefusion"]) {
    assert.match(homepage, new RegExp(`id: "${id}"`));
  }
  assert.match(homepage, /KofiTipCard/);
  assert.match(homepage, /hobfarm-rabbit-hole-logo\.mp4/);
  assert.match(homepage, /poster="https:\/\/cdn\.hob\.farm\/brand\/hobfarm-drip-logo\.png"/);
  assert.match(homepage, /autoplay/);
  assert.match(homepage, /muted/);
  assert.match(homepage, /loop/);
  assert.match(homepage, /playsinline/);
  assert.match(homepage, /object-fit: cover/);
  assert.match(homepage, /Five outputs\. One habit of keeping the work inspectable\./);
  assert.doesNotMatch(homepage, /hobfarm-logo-white\.svg/);
  assert.match(homepage, /Now at HobFarm/);
  assert.match(homepage, /Three recent articles/);
  assert.match(homepage, /getPublishedHomepageFeatures/);
});

test("homepage article cards use each article's own hero image", () => {
  const card = read("src/components/articles/ArticleCard.astro");

  assert.match(card, /const hero = getArticleHero\(post\.data\)/);
  assert.doesNotMatch(card, /THREE_DM_LOGO/);
  assert.doesNotMatch(card, /presentsSeries === "3dm"/);
});
