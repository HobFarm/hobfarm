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

  assert.match(checkout, /idempotencyKey: `hobfarm-membership:/);
  assert.match(webhook, /STRIPE_CREATIVE_MEMBERSHIP_PRICE_ID/);
  assert.match(webhook, /membership_subscription_verification_failed/);
  assert.match(webhook, /price\?\.id === env\.STRIPE_CREATIVE_MEMBERSHIP_PRICE_ID/);
});

test("the public assistant is disabled by default", () => {
  const chat = read("functions/api/chat/[[path]].ts");
  assert.match(chat, /env\.HOBBOT_ENABLED !== "true"/);
  assert.match(chat, /Chat is not available/);
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

test("patched framework and platform dependencies are pinned above affected lines", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.match(pkg.dependencies.astro, /^\^7\./);
  assert.equal(pkg.overrides.undici, "^7.29.0");
  assert.equal(pkg.overrides.esbuild, "^0.28.1");
});
