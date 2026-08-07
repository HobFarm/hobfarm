# Academy launch runbook

Updated: 2026-08-06  
State: repository-ready, production one-time checkout disabled

## Configuration

Pages already needs the `AUTH`/auth URL contract, `INTERNAL_ADMIN_HMAC_SECRET`, Stripe API key, Stripe webhook secret, and `COMMERCE` service binding used by the current account, membership, and direct-commerce paths.

Academy adds these non-secret or secret configuration names:

| Name | Surface | Purpose |
| --- | --- | --- |
| `STRIPE_ACADEMY_AVATAR_PRICE_ID` | Pages | Maps the provider Price to `academy_avatar_content_system_v1`; do not put the live ID in source. |
| `ACADEMY_STRIPE_TAX_ENABLED` | Pages | Operator confirmation that the reviewed Stripe Tax path is enabled. Must equal `true` before checkout creation. |
| `ACADEMY_ONE_TIME_CHECKOUT_ENABLED` | Pages | Server kill switch for new one-time Academy sessions. Must equal `true` before checkout creation. |
| `COMMERCE_DB` | commerce Worker | Existing D1 binding; migration `0002_academy.sql` adds Academy state. |
| `COMMERCE` | Pages | Existing service binding to the private commerce Worker. |

The public purchase control has a separate repository switch, `academyFeatures.oneTimeCheckoutVisible`. Leave it false until the server configuration and test-mode smoke test pass. `askAcademyEnabled` and `sprintApplicationsOpen` also remain false.

## Stripe dashboard checklist

1. Confirm the live HobFarm account and business record approved for the current membership is also approved for one-time digital-course sales.
2. Review the tax registrations and selling regions. This repository cannot decide tax obligations.
3. Create one $7 USD recurring-disabled Price for the Avatar Content System and map its ID through configuration.
4. Keep customer-created payment methods managed by Stripe; do not add a second Academy provider for launch.
5. Add `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, refund, dispute, subscription, and invoice events to the existing signed webhook endpoint.
6. Confirm the customer portal still manages membership billing. A permanent course is not a subscription and does not appear as a cancellable Academy plan.
7. Run test-mode checkout, refund, dispute, delayed-event, duplicate-event, and wrong-price fixtures before using live mode.

## Database migration

`workers/commerce/migrations/0002_academy.sql` is additive. It creates Academy tables, indexes, an aggregate question view, and disabled product records. It does not change the auth worker or existing order tables.

Before any remote migration:

1. Verify the production `COMMERCE_DB` binding and record its database ID outside the repository.
2. Export a dated D1 backup through the established Cloudflare procedure and verify that the export can be read.
3. Test the migration against a local D1 copy.
4. Apply the migration once. Confirm the three seeded course rows, two draft product rows, and empty purchase/entitlement/progress tables.
5. Keep the $7 Price mapping and product state disabled until Stripe fixtures pass. Change only the Avatar product record to `active` for that rehearsal; Keep the Character remains `draft`.

No remote migration or Cloudflare mutation was performed by this build.

## Rollback

The safe first rollback is operational, not destructive:

1. Set `ACADEMY_ONE_TIME_CHECKOUT_ENABLED=false`.
2. Set `academyFeatures.oneTimeCheckoutVisible=false` and redeploy the last validated site commit if needed.
3. Leave the additive Academy tables and ledger events in place so purchases and audit evidence are not lost.
4. Restore the previous commerce Worker only if its route contract changed incompatibly; keep the D1 data untouched.
5. Repair an individual access state through the audited manual correction route with operator ID and reason.

Dropping Academy tables is not the routine rollback. Do it only from a verified backup after confirming that no live purchase, entitlement, progress, or question record must be preserved.

## Deployment sequence

1. Review course copy, policy changes, and the operator-input report.
2. Back up `COMMERCE_DB`; apply and inspect the additive migration.
3. Deploy the private commerce Worker with Academy routes while checkout stays disabled.
4. Deploy Pages with the course system, account view, and feature switches still off.
5. Verify existing active supporters can open the twelve paid Avatar lessons through their membership.
6. Configure the test Price and Stripe Tax confirmation switches; keep the public button hidden.
7. Rehearse purchase, duplicate, expiry, delayed webhook, refund, dispute, membership, and repair states.
8. Map the reviewed live Price, run one controlled live purchase/refund rehearsal, then expose the public button.
9. Do not publish Keep the Character, Ask the Academy, or the Sprint application until their separate gates pass.

## Post-deployment smoke test

- Signed out: Academy catalog, free course, four Avatar previews, Character preview, Academy Help, and Workshop bridges open.
- Signed out: a paid Avatar lesson returns a locked response with `private, no-store`; no lesson body appears.
- Existing supporter: all twelve paid Avatar lessons open and progress reaches Account.
- New purchaser: the return page waits for a verified webhook, the permanent grant appears in Account, and the lesson opens in a second browser after sign-in.
- Member plus purchaser: the Account explanation shows both paths; membership cancellation does not remove the direct grant.
- Refunded or disputed purchaser: direct access stops and Account routes the customer to Help.
- Build artifacts, search, feeds, sitemaps, hydration data, and source maps pass the paid-body canary scan.

## First 30-day review

Review catalog-to-course opens, Workshop-to-Academy opens, preview starts, checkout starts and completions, membership starts, first paid-lesson opens, lesson and course completion, access denials, Academy questions by lesson/category, billing versus course-content support, permanent purchase versus membership choice, refunds, disputes, and membership cancellations. Do not send lesson answers, question text, emails, payment data, or repair codes to analytics.
