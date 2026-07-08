import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("homepage hero uses the animated HobFarm logo card instead of the instructional flow card", () => {
  const homepage = read("src/components/home/MagazineFrontPage.astro");

  assert.match(homepage, /ONLINE HUMOR MAGAZINE \+ VISUAL STUDIO/);
  assert.match(homepage, /Stop on the weird thing\. Follow it all the way down\./);
  assert.match(homepage, /HobFarm turns cartoons, satirical ads, archive dives/);

  for (const label of ["Read the latest", "Enter the studio", "Browse galleries", "Support HobFarm"]) {
    assert.match(homepage, new RegExp(label));
  }

  assert.doesNotMatch(homepage, /How the magazine moves/);
  assert.doesNotMatch(homepage, /Reader follows the trail/);

  assert.match(homepage, /<figure[\s\S]*aria-label="HobFarm animated drip logo"/);
  assert.match(homepage, /<video[\s\S]*src="https:\/\/cdn\.hob\.farm\/brand\/hobfarm-drip-logo\.mp4"/);
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
});
