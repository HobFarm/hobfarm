import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("homepage hero uses the animated HobFarm logo card instead of the instructional flow card", () => {
  const homepage = read("src/components/home/MagazineFrontPage.astro");

  assert.match(homepage, /INDEPENDENT PUBLISHER \+ CREATIVE STUDIO/);
  assert.match(homepage, /Original series, cartoons, visual worlds, and the workshop behind them\./);
  assert.match(homepage, /Watch the stories, read the cartoons, explore the art/);

  for (const label of ["Read the latest", "Enter the studio", "Browse galleries"]) {
    assert.match(homepage, new RegExp(label));
  }
  assert.doesNotMatch(homepage, />Support HobFarm<\/Button>/);

  assert.doesNotMatch(homepage, /How the magazine moves/);
  assert.doesNotMatch(homepage, /Reader follows the trail/);

  assert.match(homepage, /<figure[\s\S]*aria-label="HobFarm animated drip logo"/);
  assert.match(homepage, /<video[\s\S]*src="https:\/\/cdn\.hob\.farm\/brand\/hobfarm-rabbit-hole-logo\.mp4"/);
  assert.match(homepage, /<video[\s\S]*poster="https:\/\/cdn\.hob\.farm\/brand\/hobfarm-drip-logo\.png"/);
  assert.match(homepage, /<video[\s\S]*autoplay/);
  assert.match(homepage, /<video[\s\S]*muted/);
  assert.match(homepage, /<video[\s\S]*loop/);
  assert.match(homepage, /<video[\s\S]*playsinline/);
  assert.match(homepage, /<video[\s\S]*preload="metadata"/);
  assert.doesNotMatch(homepage, /<video[\s\S]*controls/);
  assert.match(homepage, /motion-reduce:hidden/);
  assert.match(homepage, /motion-reduce:block/);
  assert.match(homepage, /<noscript>[\s\S]*HobFarm drip logo[\s\S]*<\/noscript>/);
  assert.match(homepage, /<KofiTipCard variant="hero" placement="homepage-hero"/);
});

test("homepage article cards use each article's own hero image", () => {
  const card = read("src/components/articles/ArticleCard.astro");

  assert.match(card, /const hero = getArticleHero\(post\.data\)/);
  assert.doesNotMatch(card, /THREE_DM_LOGO/);
  assert.doesNotMatch(card, /presentsSeries === "3dm"/);
});
