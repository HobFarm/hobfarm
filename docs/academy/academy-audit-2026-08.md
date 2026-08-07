# Academy platform audit

Date: 2026-08-06

This audit records the system that exists before the Academy product work. It is the implementation baseline, not a launch approval.

Classification key: `VERIFIED` means confirmed from repository code, configuration, a local build, or an observed live response. `GROUNDED_ASSUMPTION` is the smallest implementation choice supported by those facts. `OPERATOR_INPUT_REQUIRED` marks a product, policy, production-data, or rights decision the repository cannot make. `VOLATILE_PROVIDER_DETAIL` identifies external behavior that must be rechecked before launch.

## Decision summary

- `GROUNDED_ASSUMPTION` Keep identity, sessions, account deletion, and subscription status in the existing `hobfarm-auth` worker.
- `GROUNDED_ASSUMPTION` Keep Academy products, provider references, permanent purchases, entitlements, progress, and unresolved course questions in the HobFarm commerce worker.
- `GROUNDED_ASSUMPTION` Use the Pages application as the only browser-facing boundary. Pages resolves the signed-in user, asks the auth worker for subscription state, and asks the commerce worker for Academy state.
- `GROUNDED_ASSUMPTION` Use Stripe Checkout Sessions for the first one-time course purchase because Stripe is already implemented and verified in this repository. Do not add a second provider until there is an operational reason to do so.
- `OPERATOR_INPUT_REQUIRED` Keep one-time Academy checkout disabled in production until the Stripe price, tax configuration, refund procedure, and webhook events have been verified by an operator.
- `GROUNDED_ASSUMPTION` Preserve active and trialing HobFarm Club access as the catalog-wide `academy_all_access` grant. A direct course purchase grants permanent access to that course and does not depend on membership remaining active.
- `VERIFIED` Never place paid lesson bodies, buyer files, or private course manifests in static output, search, feeds, sitemaps, client bundles, or public metadata. The implementation and leakage audit enforce this boundary.

## Repository and deployment

- `VERIFIED` The working branch is `main`; the worktree was clean at the start of the audit.
- `VERIFIED` The site uses Astro 6, TypeScript, Tailwind CSS 4, Cloudflare Pages, Cloudflare Pages Functions, and npm.
- `VERIFIED` The Pages project is `hobfarm`, with `hobfarm.pages.dev` and `hob.farm` attached.
- `VERIFIED` Astro is configured with the Cloudflare adapter and prerendered public routes. A server function is therefore required for every paid lesson response.
- `VERIFIED` `public/_headers` gives account and API responses private/no-store treatment. Paid lesson handlers also set `Cache-Control: no-store` themselves.
- `VERIFIED` The repository has no Pages `wrangler.toml`. `OPERATOR_INPUT_REQUIRED` Pages bindings must be verified in the Cloudflare dashboard before launch. The application currently expects an auth service binding and a commerce service binding.
- `VERIFIED` The commerce worker has no public route and has `workers_dev = false`. It is reached through the Pages `COMMERCE` service binding and stores data in `COMMERCE_DB`.

## Courses and public routes

- `VERIFIED` Intellectual Self-Defense is the existing free course. Its nine Markdown lessons are the substance to preserve while migrating it to shared course navigation and progress components.
- `VERIFIED` Avatar Content System currently has four public preview lessons and twelve supporter-gated lessons. Paid bodies are isolated in `src/data/avatar-content-system-paid.ts` and imported only by its server endpoint.
- `VERIFIED` Existing public URLs include both generic Academy routes and dedicated Avatar routes. `GROUNDED_ASSUMPTION` New normalized routes may be added, but old URLs must remain valid through aliases or redirects.
- `VERIFIED` The current Academy catalog describes only the free course and the Avatar beta. `GROUNDED_ASSUMPTION` Its planned-course language is not a reliable product catalog and needs to be replaced with evidence-backed statuses.
- `VERIFIED` The Character / Mannequin Workshop page and the files under `docs/character-system/` provide enough evidence for a course draft and two public preview lessons. `OPERATOR_INPUT_REQUIRED` They do not prove a clean first-time operator walkthrough, so paid availability remains blocked pending that walkthrough.
- `VERIFIED` Workshop and Character pages already contain useful media, including the mannequin workflow film. `GROUNDED_ASSUMPTION` It can be reused as the first course media pilot without creating a new video system.

## Identity and account behavior

- `VERIFIED` Login uses an email one-time code. Tokens expire after 15 minutes.
- `VERIFIED` Sessions use the `hf_session` cookie, expire after 30 days, and are `HttpOnly`, `Secure` in production, `SameSite=Lax`, and scoped to `.hob.farm` in production.
- `VERIFIED` Account deletion soft-deletes the auth user and removes auth sessions and keys. `GROUNDED_ASSUMPTION` Academy records therefore use the stable user ID, contain no email address, and must be included in a future coordinated deletion/anonymization procedure.
- `VERIFIED` The account page is noindexed. It currently shows membership and direct Shop orders but has no Academy purchase or progress summary.
- `VERIFIED` The auth worker contains uncommitted membership work. `GROUNDED_ASSUMPTION` This repository will consume its existing subscription contract and will not modify or copy that worker.

## Membership and entitlement behavior

- `VERIFIED` Stripe membership checkout and customer-portal flows already exist.
- `VERIFIED` Membership webhooks update the auth worker with subscription status. The site considers `active` and `trialing` valid supporter access.
- `VERIFIED` Scheduled cancellation remains accessible while Stripe still reports an active status. Access ends when the authoritative status is no longer active or trialing.
- `GROUNDED_ASSUMPTION` Existing supporter access to Avatar remains valid because the same membership check becomes the catalog-wide `academy_all_access` rule.
- `GROUNDED_ASSUMPTION` Direct purchases are a separate, permanent course grant. A membership cancellation must not revoke them.
- `VERIFIED` Preview lessons are public. Their public metadata and preview text may be indexed; locked lesson bodies may not.

## Billing providers

### Stripe

- `VERIFIED` Stripe is implemented for recurring membership and direct physical-product Checkout Sessions.
- `VOLATILE_PROVIDER_DETAIL` The server SDK uses API version `2026-04-22.dahlia`, verified 2026-08-06.
- `VERIFIED` Webhook verification uses the raw body and the signing secret.
- `VERIFIED` Existing checkout does not force payment method types, allowing dashboard-managed methods.
- `GROUNDED_ASSUMPTION` The first Academy one-time purchase should reuse this tested boundary with a separate stable Academy product key and price environment variable.

### Lemon Squeezy

- `OPERATOR_INPUT_REQUIRED` An operator Lemon Squeezy account reportedly exists, but its production status cannot be established without operator access. `VERIFIED` No API client, webhook handler, product mapping, environment contract, or verified live transaction exists in this repository.
- `GROUNDED_ASSUMPTION` Adding it now would create a second tax, refund, identity, and reconciliation path before the first course purchase is proven.
- `GROUNDED_ASSUMPTION` Decision: do not implement Lemon Squeezy in this build. The data model remains provider-neutral so a future provider can be added without changing course access semantics.

### Activation blockers

One-time checkout must remain disabled until all of the following are recorded by an operator:

1. A live Stripe Price for permanent Avatar Content System access at USD $7.
2. The production environment variable mapping that price to the stable Academy product key.
3. A documented tax decision and matching Stripe dashboard configuration.
4. Delivery of `checkout.session.completed`, refund, and dispute events to the existing webhook.
5. A successful test purchase, duplicate-webhook replay, refund, membership cancellation, and customer-support walkthrough.

## Locked-content leakage audit

- `VERIFIED` An unauthenticated request to the current Avatar paid lesson API returns `401` JSON with `Cache-Control: no-store` and no paid body.
- `VERIFIED` The static paid-lesson route contains a preview and access prompt, not the body.
- `VERIFIED` Baseline production output did not contain selected paid-body canaries from the Avatar source file.
- `VERIFIED` Academy content is absent from RSS and the site search index. Public Academy routes may appear in sitemaps, but paid bodies must remain excluded.
- `VERIFIED` The current public Academy agent indexes expose public course metadata and previews only.
- `GROUNDED_ASSUMPTION` The build needs an automated distribution scan so this property is tested rather than assumed.

## Reliability and recovery findings

- `VERIFIED` Stripe event handling is idempotent at the existing commerce boundary. `GROUNDED_ASSUMPTION` Academy purchases need their own unique provider-event and provider-order constraints.
- `VOLATILE_PROVIDER_DETAIL` Stripe webhook events may arrive out of order; rechecked against the implemented event contract on 2026-08-06. `GROUNDED_ASSUMPTION` Purchase records must retain provider event time and ignore older state transitions without deleting an independent entitlement.
- `GROUNDED_ASSUMPTION` Refunds and disputes must suspend the matching direct-purchase grant but must not remove access supplied by active membership or another valid purchase.
- `GROUNDED_ASSUMPTION` A user can buy while already subscribed. Checkout and completion should explain that the permanent purchase is optional and survives membership cancellation.
- `GROUNDED_ASSUMPTION` Progress writes need idempotent upserts. Signing out must not clear server progress, and browser-local free-course progress should merge without overwriting newer server state after login.
- `GROUNDED_ASSUMPTION` Failed checkout creation must not create an entitlement. A successful payment without an entitlement should be recoverable by replaying the verified webhook or reconciling the Checkout Session.

## Existing validation baseline

- `VERIFIED` `npx astro check`: passed with no errors, warnings, or hints.
- `VERIFIED` `npm run build`: passed.
- `VERIFIED` `npm test`: 240 of 243 tests passed. The three failures predate Academy changes and concern article share controls, PsyGoth media durability, and homepage hero assertions.

## Decisions still requiring a person

- `OPERATOR_INPUT_REQUIRED` Production tax collection and registration policy.
- `OPERATOR_INPUT_REQUIRED` The live Stripe Price ID and final product statement shown in Stripe Checkout.
- `OPERATOR_INPUT_REQUIRED` Refund-window policy for permanent Academy purchases.
- `OPERATOR_INPUT_REQUIRED` The clean first-time Character / Mannequin course walkthrough and any corrections it reveals.
- `OPERATOR_INPUT_REQUIRED` The final terms and manual acceptance process for the private production-system sprint.

Until those decisions are complete, the platform may be tested locally and the public catalog may describe upcoming work, but one-time checkout and sprint applications must not be activated.

## Exact implementation order

1. Preserve the auth-worker session and subscription contract; do not edit its dirty worktree.
2. Add typed course, lesson, media, and feature manifests plus shared catalog, access, progress, and Workshop bridge components.
3. Add the commerce-worker Academy schema and provider-neutral purchase, entitlement, event, progress, question, and correction records.
4. Add the Stripe one-time adapter behind tax and checkout kill switches; make verified webhooks the only purchase-grant authority.
5. Add Account Academy state, permanent-versus-membership explanations, progress, receipts where available, Help, and repair codes.
6. Map Intellectual Self-Defense into the shared manifest and progress system while preserving its public substance and URLs.
7. Map Avatar's four public and twelve paid lessons, preserve supporter access, add the $7 permanent product contract, and keep the public buy control off pending operator gates.
8. Rebuild the catalog with available, preview, and planned status; publish only source-backed public previews.
9. Draft Keep the Character from repository evidence, publish two public preview lessons, attach the existing captioned media pilot, and leave paid bodies unpublished until the walkthrough passes.
10. Connect compact Workshop bridges, add five source maps and outlines, scaffold the free route tool, FAQ/reporting, disabled assistant decision, and closed Sprint draft.
11. Run migration, entitlement, compile, build, leakage, route, responsive, accessibility, and signed-out browser checks. Record authenticated/payment states as pending deployed test-mode validation when local production bindings are unavailable.

The migration is additive. Legacy course routes remain aliases or redirects. The highest risks are production tax approval, an incorrect live Price mapping, webhook configuration, applying D1 changes without a verified backup, publishing unsupported course instructions, and exposing a paid body through a static import.
