import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("API request limits inspect the streamed body instead of trusting Content-Length", () => {
  const helper = read("functions/api/request-body.ts");
  const contact = read("functions/api/contact.ts");
  const shop = read("functions/api/shop/checkout.ts");
  const academy = read("functions/api/academy/checkout.ts");
  const webhook = read("functions/api/stripe/webhook.ts");

  assert.match(helper, /request\.body\?\.getReader\(\)/);
  assert.match(helper, /received > maxBytes/);
  assert.ok(
    contact.indexOf('request.headers.get("content-length")') <
      contact.indexOf("if (!env.TURNSTILE_SECRET)"),
    "contact size validation should precede provider configuration checks",
  );
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
  assert.match(middleware, /"\/docker-compose\.yaml"/);
  assert.match(middleware, /"\/config\/config\.yaml"/);
  assert.match(middleware, /"\/fetch"/);
  assert.match(middleware, /SCANNER_PROBE_PREFIXES\.some/);
  assert.match(middleware, /new Response\(null, \{/);
});

test("static assets and discovery files bypass Pages Functions", () => {
  const routes = JSON.parse(read("public/_routes.json"));

  assert.deepEqual(routes.include, ["/*"]);
  for (const route of [
    "/_astro/*",
    "/images/*",
    "/media/*",
    "/robots.txt",
    "/rss.xml",
    "/sitemap.xml",
    "/articles/mesh.json",
    "/api/grimoire/snapshot",
  ]) {
    assert.ok(routes.exclude.includes(route), `${route} should bypass Pages Functions`);
  }
  assert.ok(routes.include.includes("/*"), "HTML and API routes still need middleware");
});

test("auth calls forward only the HobFarm session cookie", () => {
  const proxy = read("src/lib/auth-proxy-core.ts");
  const stripe = read("functions/api/stripe/internal.ts");

  for (const source of [proxy, stripe]) {
    assert.match(source, /AUTH_COOKIE_NAME = "hf_session"/);
    assert.match(source, /\.find\(\(part\) => part\.startsWith\(prefix\)\)/);
  }
  assert.doesNotMatch(proxy, /\s+"cookie",\s*\n\s+"origin"/);
});

test("Pages auth calls use a private service binding instead of a public URL", () => {
  const authService = read("src/lib/auth-service.ts");
  const callers = [
    read("src/lib/auth-proxy-core.ts"),
    read("functions/api/stripe/internal.ts"),
    read("functions/api/chat/[[path]].ts"),
  ].join("\n");

  assert.match(authService, /AUTH_HTTP/);
  assert.match(callers, /fetchAuthService/);
  assert.doesNotMatch(callers, /AUTH_WORKER_URL/);
});

test("public read-only APIs keep their intentional cache policy", () => {
  const middleware = read("functions/_middleware.ts");
  const headers = read("public/_headers");

  assert.match(middleware, /PUBLIC_CACHEABLE_API_PATHS/);
  assert.match(middleware, /"\/api\/grimoire\/snapshot"/);
  assert.match(middleware, /"\/api\/status"/);
  assert.match(middleware, /if \(!PUBLIC_CACHEABLE_API_PATHS\.has\(pathname\)\)/);
  assert.doesNotMatch(headers, /\/api\/\*\s+Cache-Control: no-store/);
  assert.doesNotMatch(headers, /\/\*\s+Cache-Control: public, max-age=0/);
});

test("patched framework and platform dependencies are pinned above affected lines", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.match(pkg.dependencies.astro, /^\^7\./);
  assert.equal(pkg.overrides.undici, "^7.29.0");
  assert.equal(pkg.overrides.esbuild, "^0.28.1");
});
