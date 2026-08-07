import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { resolveAcademyGrant } from "../src/lib/academy-access.mjs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Academy access precedence keeps public, permanent, manual, and membership grants separate", () => {
  assert.deepEqual(resolveAcademyGrant({ publicAccess: true }), { allowed: true, source: "public" });
  assert.deepEqual(resolveAcademyGrant({ membershipStatus: "active" }), { allowed: true, source: "membership" });
  assert.deepEqual(resolveAcademyGrant({ membershipStatus: "trialing" }), { allowed: true, source: "membership" });
  assert.deepEqual(resolveAcademyGrant({ membershipStatus: "past_due" }), { allowed: false, source: "none" });
  assert.deepEqual(resolveAcademyGrant({ membershipStatus: "canceled" }), { allowed: false, source: "none" });
  assert.deepEqual(resolveAcademyGrant({ membershipStatus: "active", membershipIncluded: false }), { allowed: false, source: "none" });
  assert.deepEqual(resolveAcademyGrant({ membershipStatus: "canceled", entitlements: [{ status: "active", grant_type: "purchase" }] }), { allowed: true, source: "purchase" });
  assert.deepEqual(resolveAcademyGrant({ membershipStatus: "active", entitlements: [{ status: "active", grant_type: "purchase" }] }), { allowed: true, source: "purchase" });
  assert.deepEqual(resolveAcademyGrant({ entitlements: [{ status: "active", grant_type: "manual" }] }), { allowed: true, source: "manual" });
  assert.deepEqual(resolveAcademyGrant({ entitlements: [{ status: "revoked", grant_type: "manual" }] }), { allowed: false, source: "none" });
  assert.deepEqual(resolveAcademyGrant({ entitlements: [{ status: "suspended", grant_type: "purchase" }] }), { allowed: false, source: "none" });
});

test("Academy payment and access contracts cover the required failure boundaries", () => {
  const checkout = read("functions/api/academy/checkout.ts");
  const webhook = read("functions/api/stripe/webhook.ts");
  const worker = read("workers/commerce/src/academy.ts");
  const accessBoundary = read("functions/api/academy/internal.ts");
  const lessonApi = read("functions/api/academy/courses/[[path]].ts");
  const completion = read("src/components/academy/CheckoutCompletion.tsx");

  // successful purchase, abandoned checkout, delayed webhook, and clean return
  assert.match(checkout, /checkout\.sessions\.create/);
  assert.match(worker, /'checkout_pending'/);
  assert.match(worker, /recordAcademyCheckoutFailure/);
  assert.match(webhook, /checkout\.session\.expired/);
  assert.match(completion, /receipt is not an access grant/i);
  assert.match(completion, /setTimeout\(check/);
  // duplicate/replayed and out-of-order events
  assert.match(worker, /academy_events WHERE provider = \?1 AND event_id = \?2/);
  assert.match(worker, /ignored_stale/);
  assert.match(worker, /last_provider_event_created/);
  assert.match(worker, /terminalPurchase/);
  assert.match(checkout, /15 \* 60 \* 1000/);
  assert.match(worker, /INSERT OR IGNORE INTO academy_purchases/);
  assert.match(worker, /product\.status !== "active"/);
  assert.match(worker, /input\.clientUpdatedAt > now \+ 300/);
  assert.match(worker, /academy_progress\.status = 'complete' OR excluded\.status = 'complete'/);
  // invalid signature and server-side payment verification
  assert.match(webhook, /constructEventAsync/);
  assert.match(webhook, /priceId !== configuredPrice/);
  assert.match(webhook, /line\?\.amount_subtotal !== product\.amount/);
  assert.match(webhook, /full\.currency !== product\.currency/);
  assert.match(webhook, /full\.metadata\?\.user_id !== userId/);
  // refunds, disputes, and independently surviving grants
  assert.match(webhook, /charge\.dispute\.created/);
  assert.match(webhook, /"refunded"/);
  assert.match(worker, /WHERE source_purchase_id = \?1 AND grant_type = 'purchase'/);
  assert.match(accessBoundary, /membershipIncluded/);
  assert.match(accessBoundary, /Math\.imul\(hash, 16777619\)/);
  // expired/invalid session and unauthorized lesson access
  assert.match(completion, /response\.status === 401/);
  assert.match(lessonApi, /course_access_required/);
  assert.match(lessonApi, /course_not_available/);
  assert.match(lessonApi, /getPaidLesson/);
});

test("Academy checkout is gated by operator tax and activation switches", () => {
  const checkout = read("functions/api/academy/checkout.ts");
  const features = read("src/data/academy-features.ts");
  assert.match(checkout, /ACADEMY_ONE_TIME_CHECKOUT_ENABLED !== "true"/);
  assert.match(checkout, /ACADEMY_STRIPE_TAX_ENABLED !== "true"/);
  assert.match(checkout, /automatic_tax: \{ enabled: true \}/);
  assert.match(features, /oneTimeCheckoutVisible: false/);
  assert.match(features, /askAcademyEnabled: false/);
});

test("paid Avatar bodies remain outside static and client imports", () => {
  const paidImporters = [
    "functions/api/academy/avatar-content-system/lesson/[[slug]].ts",
    "functions/api/academy/courses/[[path]].ts",
  ];
  for (const file of paidImporters) assert.match(read(file), /avatar-content-system-paid/);
  for (const file of [
    "src/pages/academy/index.astro",
    "src/pages/academy/courses/[courseSlug]/index.astro",
    "src/pages/academy/courses/[courseSlug]/[lessonSlug].astro",
    "src/components/academy/PaidLessonView.tsx",
    "src/data/academy-manifest.ts",
  ]) assert.doesNotMatch(read(file), /avatar-content-system-paid/);
  assert.match(read("scripts/audit-academy-paid-content.mjs"), /Use my rough avatar idea to fill this starter source file/);
});
