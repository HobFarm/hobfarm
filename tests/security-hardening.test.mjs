import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("API request limits inspect the streamed body instead of trusting Content-Length", () => {
  const helper = read("functions/api/request-body.ts");
  const shop = read("functions/api/shop/checkout.ts");
  const academy = read("functions/api/academy/checkout.ts");
  const webhook = read("functions/api/stripe/webhook.ts");

  assert.match(helper, /request\.body\?\.getReader\(\)/);
  assert.match(helper, /received > maxBytes/);
  assert.match(shop, /readJsonBodyLimited/);
  assert.match(academy, /readTextBodyLimited/);
  assert.match(webhook, /readTextBodyLimited\(request, MAX_WEBHOOK_BYTES\)/);
});

test("membership checkout and entitlement sync reject duplicate or wrong-price work", () => {
  const checkout = read("functions/api/stripe/checkout.ts");
  const webhook = read("functions/api/stripe/webhook.ts");
  const internal = read("functions/api/stripe/internal.ts");

  assert.match(checkout, /idempotencyKey: `hobfarm-membership:/);
  assert.match(webhook, /STRIPE_CREATIVE_MEMBERSHIP_PRICE_ID/);
  assert.match(webhook, /membership_subscription_verification_failed/);
  assert.match(webhook, /price\?\.id === env\.STRIPE_CREATIVE_MEMBERSHIP_PRICE_ID/);
  assert.match(internal, /ADMIN_SECRET_MIN_BYTES = 32/);
  assert.match(internal, /INTERNAL_ADMIN_HMAC_SECRET is not configured securely/);
});

test("the public assistant is disabled by default", () => {
  const chat = read("functions/api/chat/[[path]].ts");
  assert.match(chat, /env\.HOBBOT_ENABLED !== "true"/);
  assert.match(chat, /Chat is not available/);
});

test("public navigation leaves authentication checks to the account route", () => {
  const navigation = read("src/components/global/Navigation.astro");
  const mobileNavigation = read("src/components/global/MobileNav.astro");

  for (const source of [navigation, mobileNavigation]) {
    assert.match(source, /href="\/account\/"/);
    assert.doesNotMatch(source, /data-account-cta/);
    assert.doesNotMatch(source, /\/api\/auth\/me/);
  }
});

test("Pages functions add no-store and browser security headers", () => {
  const middleware = read("functions/_middleware.ts");
  const headers = read("public/_headers");
  const security = read("public/.well-known/security.txt");

  assert.match(middleware, /headers\.set\("Cache-Control", "no-store"\)/);
  assert.match(middleware, /headers\.set\("X-Frame-Options", "DENY"\)/);
  assert.match(headers, /script-src-attr 'none'/);
  assert.match(security, /Contact: https:\/\/hob\.farm\/contact\/\?subject=security/);
});

test("incident scanner paths stop before Pages resolves static or application routes", () => {
  const middleware = read("functions/_middleware.ts");
  const probeGuard = middleware.indexOf("if (isKnownScannerProbe(url.pathname))");
  const firstRouterHandoff = middleware.indexOf("context.next()", probeGuard);

  assert.notEqual(probeGuard, -1);
  assert.notEqual(firstRouterHandoff, -1);
  assert.ok(probeGuard < firstRouterHandoff);
  assert.match(middleware, /normalized\.endsWith\("\.php"\)/);
  assert.match(middleware, /normalized\.endsWith\("\.sql"\)/);
  assert.match(middleware, /"\/api\/node\/config\.js"/);
  assert.match(middleware, /new Response\(null, \{/);
});

test("patched framework and platform dependencies are pinned above affected lines", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.match(pkg.dependencies.astro, /^\^7\./);
  assert.equal(pkg.overrides.undici, "^7.29.0");
  assert.equal(pkg.overrides.esbuild, "^0.28.1");
});
