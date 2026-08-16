import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("Ko-fi tip card uses native links and no provider assets or scripts", () => {
  const component = read("src/components/support/KofiTipCard.astro");

  assert.match(component, /type KofiTipCardVariant = "band" \| "footer"/);
  assert.match(component, /href = "https:\/\/ko-fi\.com\/hobfarm"/);
  assert.match(component, /target="_blank"/);
  assert.match(component, /rel="noopener noreferrer"/);
  assert.match(component, /aria-label="Tip HobFarm on Ko-fi \(opens in a new tab\)"/);
  assert.match(component, /data-support-provider="kofi"/);
  assert.match(component, /data-support-placement=\{placement\}/);
  assert.match(component, /min-h-11/);
  assert.match(component, /focus-visible:outline/);
  assert.doesNotMatch(component, /<script|<iframe|kofi_symbol|kofi_logo|support_me_on_kofi/);
});

test("the homepage and footer keep native Ko-fi support links", () => {
  const homepage = read("src/pages/index.astro");
  const frontPage = read("src/components/home/MagazineFrontPage.astro");
  const support = read("src/components/home/ExploreSupportFollow.astro");
  const footer = read("src/components/global/Footer.astro");

  assert.match(homepage, /<ExploreSupportFollow \/>/);
  assert.ok(homepage.indexOf("<SiteSections />") < homepage.indexOf("<ExploreSupportFollow />"));
  assert.match(support, /<KofiTipCard variant="band" placement="homepage-next-steps"/);
  assert.doesNotMatch(support, /KofiCta|kofi_logo|support_me_on_kofi/);
  assert.doesNotMatch(frontPage, /KofiTipCard|hobfarm-rabbit-hole-logo|hobfarm-drip-logo/);
  assert.match(footer, /<KofiTipCard variant="footer" placement="site-footer"/);
  assert.doesNotMatch(footer, /KofiCta|variant="symbol"|text="Ko-fi"/);
});
