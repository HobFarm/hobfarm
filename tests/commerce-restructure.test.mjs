import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

function publicSourceFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return publicSourceFiles(path);
    return /\.(astro|md|mdx|ts|tsx|yml)$/.test(path) ? [path] : [];
  });
}

test("Shop is a three-lane marketplace directory with secondary learning and support", () => {
  const shop = read("src/pages/shop/index.astro");
  const storefronts = read("src/data/storefronts.ts");
  const homepage = read("src/pages/index.astro");
  const product = read("src/content/products/melting-rabbit-hole-dad-hat.md");

  for (const name of ["Etsy", "DeviantArt", "eBay"]) {
    assert.match(storefronts, new RegExp(name.replace(/[+]/g, "\\+")));
  }
  for (const status of ['"active"', '"rebuilding"', '"pending"', '"hidden"']) {
    assert.match(storefronts, new RegExp(status));
  }
  assert.doesNotMatch(storefronts, /Made by HobFarm|Ko-fi|Academy/);
  assert.match(storefronts, /status: "rebuilding"[\s\S]*https:\/\/www\.etsy\.com\/shop\/hobfarm/);
  assert.match(storefronts, /status: "active"[\s\S]*https:\/\/www\.deviantart\.com\/hobfarm/);
  const ebayStorefront = storefronts.match(/id: "ebay"[\s\S]*?(?=\n  },|\n];)/)?.[0] ?? "";
  assert.match(ebayStorefront, /status: "active"/);
  assert.match(ebayStorefront, /href: "https:\/\/www\.ebay\.com\/usr\/hobfarm"/);
  assert.match(ebayStorefront, /cta: "Browse HobFarm on eBay"/);

  assert.match(shop, /One clear shelf for each kind of work/);
  assert.match(shop, /Looking for something else/);
  assert.match(shop, /Learn the methods behind the work/);
  assert.match(shop, /Fund the next article, experiment, or release/);
  assert.match(shop, /href="\/helpcenter\/"/);
  assert.doesNotMatch(shop, /getPublicProducts|DropCard|Direct merchandise|Printful|POD/);
  assert.doesNotMatch(shop, /"@type": "Product"/);

  assert.doesNotMatch(homepage, /LatestDrops|Different work, different shelves/);

  assert.match(product, /status: archived/);
  assert.match(product, /featured: false/);
  assert.match(product, /fulfillment: printful/);
  assert.match(product, /unitAmount: 2499/g);
  assert.match(product, /code: black/);
  assert.match(product, /code: dark-grey/);
});

test("Sophia and Stella are archived from drops and the old URL has a Workshop handoff", () => {
  const product = read("src/content/products/sophia-stella-sheet-pack.md");
  const handoff = read("src/pages/shop/sophia-stella-sheet-pack.astro");
  const workshop = read("src/pages/workshop/[program].astro");

  assert.match(product, /status: archived/);
  assert.match(product, /featured: false/);
  assert.match(handoff, /not for sale/i);
  assert.match(handoff, /\/workshop\/alter-ego\//);
  assert.match(workshop, /Sophia \/ Stella/);
  assert.match(workshop, /One base, more than one life/);
});

test("funding and Customer Help are separate public destinations", () => {
  const support = read("src/pages/support.astro");
  const help = read("src/pages/helpcenter/index.astro");
  const supportPlatforms = read("src/data/support-platforms.ts");
  const navigation = read("src/data/navigation.ts");
  const success = read("src/pages/membership/success.astro");
  const productPage = read("src/pages/shop/[slug].astro");

  for (const phrase of [
    "Support once on Ko-fi",
    "$5/month supporter",
    "Buy something from the Shop",
    "Take a course",
    "does not run third-party display ads",
    "not currently hiring",
  ]) {
    assert.match(`${support}\n${supportPlatforms}`, new RegExp(phrase.replace(/[/$]/g, "\\$&"), "i"));
  }
  for (const phrase of ["Payments and refunds", "Accounts and access", "Downloads and courses", "Applications and tools"]) {
    assert.match(help, new RegExp(phrase));
  }
  assert.match(navigation, /Customer Help/);
  assert.match(success, /href="\/helpcenter\/"/);
  assert.match(productPage, /Go to Customer Help/);
});

test("no Patreon reference remains in public source surfaces", () => {
  const files = [
    ...publicSourceFiles(join(root, "src")),
    ...publicSourceFiles(join(root, "functions")),
    ...publicSourceFiles(join(root, "public")),
    join(root, ".pages.yml"),
  ];
  const matches = files.filter((file) => /patreon/i.test(readFileSync(file, "utf8")));
  assert.deepEqual(matches, []);
});

test("Academy models one-time pricing while preserving Avatar supporter access", () => {
  const academy = read("src/data/academy-courses.ts");
  const avatar = read("src/data/avatar-content-system.ts");
  const migration = read("docs/avatar-course-supporter-migration-plan.md");

  for (const value of ['"Free"', '"$5"', '"$7"', '"$9"', "`Bundle: ${string}`"]) {
    assert.match(academy, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  for (const field of ["checkoutProvider", "accessType", "courseStatus", "relatedWorkshop", "relatedAssetPack", "affiliateDisclosure"]) {
    assert.match(academy, new RegExp(field));
  }
  assert.match(academy, /checkoutProvider: "membership-legacy"/);
  assert.match(avatar, /accessModel: "membership-beta"/);
  assert.match(migration, /No entitlement behavior changes/);
});

test("contextual offers and nearby affiliate disclosure are reusable", () => {
  const offers = read("src/components/relationships/WorkshopOfferRail.astro");
  const disclosure = read("src/components/legal/AffiliateDisclosure.astro");
  const article = read("src/layouts/ArticleLayout.astro");

  for (const label of ["Learn the method", "Get the assets", "Support the next project"]) {
    assert.match(offers, new RegExp(label));
  }
  assert.match(article, /frontmatter\.academyCTA/);
  assert.match(article, /frontmatter\.workshopCTA/);
  assert.match(article, /frontmatter\.supportCTA/);
  assert.match(article, /relatedAsset/);
  assert.match(
    disclosure,
    /Affiliate link: HobFarm may earn a commission if you buy through this link\. It does not change your price\./,
  );
});

test("the old handoff route and migration document exist", () => {
  assert.equal(existsSync(join(root, "src/pages/shop/sophia-stella-sheet-pack.astro")), true);
  assert.equal(existsSync(join(root, "docs/avatar-course-supporter-migration-plan.md")), true);
});

test("direct commerce has a durable order ledger and provider kill switches", () => {
  const checkout = read("functions/api/shop/checkout.ts");
  const webhook = read("functions/api/stripe/webhook.ts");
  const migration = read("workers/commerce/migrations/0001_orders.sql");
  const worker = read("workers/commerce/src/index.ts");
  const orders = read("workers/commerce/src/orders.ts");
  const workerConfig = read("workers/commerce/wrangler.toml");
  const refunds = read("src/content/legal/refunds.md");

  assert.match(checkout, /\/internal\/checkout\/reserve/);
  assert.match(checkout, /client_reference_id: order\.id/);
  assert.match(checkout, /txcd_30060006/);
  assert.match(checkout, /DIRECT_SHOP_TAX_MODE/);
  assert.match(webhook, /checkout\.session\.async_payment_succeeded/);
  assert.match(webhook, /\/internal\/stripe\/paid/);
  assert.match(webhook, /refund\.updated/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS commerce_orders/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS commerce_events/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS commerce_refunds/);
  assert.match(worker, /PRINTFUL_DRAFT_CREATION_ENABLED/);
  assert.match(worker, /PRINTFUL_CONFIRMATION_ENABLED/);
  assert.match(orders, /partially_refunded/);
  assert.match(orders, /SUM\(amount\)/);
  assert.match(workerConfig, /crons = \["\*\/15 \* \* \* \*"\]/);
  assert.match(refunds, /Direct HobFarm Print-on-Demand Orders/);
});
