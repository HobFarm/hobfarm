# Printful direct-product launch: inspection report and implementation plan

Status: verified store product and local checkout foundation. The `printful` account secret works through its Workers binding. Read-only Printful product and shipping requests were completed. Two provider mockups were copied to HobFarm R2. No Printful order, Stripe charge, database migration, webhook registration, persistent Worker deployment, or live checkout activation was performed.

## Launch boundary

The Melting Rabbit Hole Dad Hat is the first direct physical product. A second product can join the pilot after it has the same sample, pricing, media, and fulfillment approvals. Direct HobFarm Printful goods will share a small cart so additional-item shipping can support a free-shipping threshold. Marketplace inventory and marketplace checkout remain separate.

The public Shop remains a role-based storefront directory and now includes one coming-soon direct product page. The page shows the verified colors, retail price, and planned shipping calculation. It has no live buy action.

## Current hat pilot

The Printful store record confirms:

- title: Melting Rabbit Hole Dad Hat;
- base item: Classic Dad Hat, Yupoong 6245CM;
- colors: Black and Dark Grey;
- size: one size;
- technique: DTF printing;
- placement: front print;
- retail price: $24.99 for each variant.

The product is a HobFarm Shop sync product with two active variants. The token can read the store and sync product but receives a 403 from the account-level product-template endpoint. That is enough for the intended workflow: build the template in Printful, use **Add to store** for HobFarm Shop, then sync the store product into HobFarm's private catalog.

Read-only shipping checks returned the same Standard rates in the tested Nevada, New York, California, and Florida destinations: $4.49 for one hat, $6.49 for two, and $8.49 for three. Release 1 uses $4.49 Standard shipping below $49 and free Standard shipping at $49 or more. Two hats total $49.98 and qualify.

The local `workers/commerce/` inspector, trusted cart normalizer, and fixture tests are ready. The direct Stripe Checkout endpoint uses server-owned prices, limits checkout to the United States, and remains disabled by product and environment launch flags.

## Repository inspection

### Payments

The current payment implementation is a recurring supporter membership:

- `functions/api/stripe/checkout.ts` creates an authenticated Stripe Checkout Session in `subscription` mode from one server-side Price ID.
- `functions/api/stripe/webhook.ts` verifies the raw webhook body with `STRIPE_WEBHOOK_SECRET` and Stripe's current SDK, then handles subscription Checkout, subscription, and invoice events.
- `src/lib/stripe-server.ts` pins Stripe API version `2026-04-22.dahlia`.
- The Checkout code does not set `payment_method_types`, so Stripe can use dynamically eligible payment methods.
- The webhook deliberately skips non-subscription Checkout Sessions. Physical-order events will therefore need a separate, explicit branch.
- The implementation has no one-time product allowlist, shipping collection, order ledger, fulfillment queue, physical-order status, or refund ledger.

The existing membership behavior should stay separate. Extending it must not change the supporter subscription or the Avatar Content System entitlement.

### Accounts and entitlements

The Pages Functions resolve the signed-in user through the separate `hobfarm-auth` Worker. Server-to-server admin requests use a canonical HMAC signature.

The auth Worker stores users, sessions, encrypted user API keys, and one `user_subscriptions` row per user in its `AUTH_DB` D1 database. Subscription upserts reject duplicate Stripe events and stale event ordering. Course access currently means an authenticated user with an `active` or `trialing` supporter subscription.

There is no purchase entitlement table and no physical-order table. A physical purchase should not create a course entitlement or be stored in `user_subscriptions`.

Release 1 should require the existing verified HobFarm account before checkout. This gives each order a stable `user_id`, makes the first status page practical, and avoids inventing a guest-order access token. Guest checkout can be designed later if the added conversion is worth the extra identity and support surface.

### Storage and Cloudflare bindings

This repository is a Cloudflare Pages project with Pages Functions in `functions/api/`. It does not have a checked-in source-of-truth Wrangler configuration. Local Functions development is launched through `scripts/dev-pages.mjs`. The only visible storage binding in this repository is `PROVIDER_HEALTH` KV; it is unrelated to commerce.

Cloudflare Pages can bind D1 and can call a Worker through a service binding. Cloudflare's account Secrets Store currently integrates with Workers rather than directly with Pages. The Printful token the owner stored under the name `printful` should therefore be bound only to a dedicated commerce Worker as `PRINTFUL_API_TOKEN`. That binding is asynchronous and must be read with `await env.PRINTFUL_API_TOKEN.get()`.

Before binding anything, download and review the existing Pages configuration in a clean implementation branch. A checked-in Pages Wrangler file becomes the configuration source of truth and can overwrite dashboard bindings if it is incomplete.

Recommended new resources:

- `hobfarm-commerce` Worker: fulfillment orchestration, Printful client, Printful webhook, reconciliation, and redacted order reads.
- `COMMERCE_DB` D1 database: physical-order, event, shipment, refund, and repair state.
- `COMMERCE` service binding from Pages to the commerce Worker.
- `PRINTFUL_API_TOKEN` Secrets Store binding whose secret name is `printful`.
- `PRINTFUL_WEBHOOK_SECRET` Secrets Store binding created from Printful's one-time webhook setup response.
- `COMMERCE_DATA_KEK` Secrets Store binding for AES-GCM encryption of the temporary recipient snapshot.
- A private R2 binding for production print files, or another reviewed private origin. Full-resolution print files must not enter public HTML, feeds, JSON-LD, sitemaps, agent-readable files, or public content frontmatter.

The actual store ID, resource IDs, routes, token scopes, and secret-store metadata remain owner-controlled configuration. They do not belong in this document or application logs.

### Product content

The `products` content collection already supports:

- logical SKU and product type;
- `hobfarm-direct` platform;
- `printful` fulfillment;
- optional Printful product and variant IDs;
- public status, price label, preview, and relationship fields.

The collection is presentation data, not a fulfillment authority. A browser can modify submitted slugs and variants, and content files can drift. The commerce Worker needs a separate server-only launch manifest that maps an approved logical product and variant code to:

- Stripe Price ID binding;
- Printful catalog variant ID;
- quantity limits;
- currency and expected retail amount;
- maximum acceptable Printful fulfillment cost;
- shipping policy;
- placement, technique, and private print-file identifier;
- launch-enabled flag and approval revision.

The browser may submit only `product_code`, `variant_code`, and an idempotency token. It must never submit price, Stripe Price ID, Printful variant ID, print-file URL, or cost limit. Automated contract tests should compare the public labels and logical variant codes with the server manifest without making the content collection authoritative.

### Customer email, status, refunds, and help

The account system already has verified email and uses Resend for authentication mail. The main site has Customer Help, a contact form, and a refund policy, but it has no transactional order-email sender or order-status view.

Release 1 should:

- use the verified account email as the Checkout customer email;
- let Stripe send the payment receipt when enabled;
- send HobFarm order, hold/failure, shipment, and refund messages through a separately bound transactional email provider;
- add authenticated `/account/orders/` and `/account/orders/{public_id}/` views;
- keep cancellation, address correction, damage, replacement, and refund requests in Customer Help rather than adding risky self-service actions;
- revise the refund and privacy copy before launch so direct HobFarm Printful orders are described separately from marketplace orders.

No email should contain a full address, Printful dashboard URL, internal database ID, or provider error body.

## Printful v2 contract reviewed

Source inspected: the supplied `openapi.json`, version `2.0.0-beta`, plus the current official [Printful v2 beta API documentation](https://developers.printful.com/docs/v2-beta/).

The API base is `https://api.printful.com`; v2 routes use `/v2`. The private token is sent as a Bearer token. An account-level token may also require `X-PF-Store-Id`; the store ID can be resolved later through `GET /v2/stores` during an approved setup session.

The launch uses these operations:

| Job | Operation |
| --- | --- |
| Verify an approved variant | `GET /v2/catalog-variants/{id}` plus its price and availability links |
| Estimate standard fulfillment cost | `POST /v2/order-estimation-tasks`, then `GET /v2/order-estimation-tasks?id={task_id}` |
| Inspect available shipping methods when expansion is approved | `POST /v2/shipping-rates` |
| Find an existing order by stable external ID | `GET /v2/orders/@{external_id}` |
| Create an unsubmitted draft | `POST /v2/orders` |
| Re-read calculated costs and status | `GET /v2/orders/{order_id}` |
| Submit the approved draft to fulfillment | `POST /v2/orders/{order_id}/confirmation` |
| Cancel a still-cancellable Printful order | `DELETE /v2/orders/{order_id}` |
| Recover shipment and tracking data | `GET /v2/orders/{order_id}/shipments` |
| Configure and inspect signed events | `GET`, `POST`, and `DELETE /v2/webhooks` |

Important contract behavior:

- A created order starts as `draft`. It is not charged by Printful or sent to production until the separate confirmation request.
- Order costs can be `calculating`, `done`, or `failed`. Confirmation must not run until calculation is `done`.
- The reviewed confirmation operation has no request body. Cost protection must be enforced locally by re-reading the draft, comparing currency and total to the approved limit, and refusing confirmation on a mismatch.
- Order statuses include `draft`, `failed`, `inreview`, `pending`, `canceled`, `onhold`, `inprocess`, `partial`, and `fulfilled`.
- A draft or failed order can be edited. In-process orders are no longer cancellable. The cancellation endpoint can return `409`.
- Estimation tasks are asynchronous (`pending`, `failed`, or `completed`) and completed results expire after one hour.
- A single order may have several shipments. Shipment data includes shipment and delivery status, tracking number and URL, delivery estimate, shipment items, reshipment state, and tracking events.
- V2 uses leaky-bucket rate limits and returns `X-Ratelimit-*` headers. The client must honor `429` and `X-Ratelimit-Reset`, add bounded jitter, and stop retrying permanent validation failures.
- Orders, Catalog, and Webhook operations are among the beta endpoints that may still return the older error shape rather than RFC 9457 Problem Details. Error parsing must accept both and store only a sanitized code and summary.
- V2 remains beta. The final implementation must pin request and response fixtures from this supplied specification and fail closed when an expected shape changes.

### Printful webhook verification

Printful retries a non-2xx webhook after increasing delays. The receiver must:

1. Read the request as raw bytes before JSON parsing.
2. Require `x-pf-webhook-public-key` and `x-pf-webhook-signature`.
3. Select the configured secret by an exact, constant-time comparison of the public key.
4. Hex-decode the webhook `secret_key` returned once during configuration.
5. Calculate HMAC-SHA256 over the unformatted raw request body.
6. Hex-decode the supplied signature and compare byte arrays in constant time.
7. Reject missing, malformed, unknown-key, or invalid signatures before parsing or writing an event.
8. Enforce a body-size limit and validate `store_id` and event type.
9. Insert the event dedupe key before applying state. Return 2xx for an already processed valid event and 5xx only for a genuinely retryable internal failure.

The initial subscription should include order created/updated/failed/canceled/hold/remove-hold/refunded and shipment sent/returned/out-of-stock/canceled events. The supplied schema lists `order_refunded` as an event payload but omits it from one event-configuration discriminator. Treat that as a beta-spec inconsistency: verify the registration in a separate test store and retain authenticated reconciliation as the authority.

Webhook data is a prompt to reconcile, not the final source of truth. After a valid event, fetch the referenced order or shipment with the authenticated API before changing customer-visible state.

## Proposed data model

Keep payments and fulfillment as independent state machines.

### `commerce_orders`

- internal UUID primary key and random `public_id`;
- `user_id` from the auth Worker;
- currency and immutable merchandise subtotal, shipping, tax, discount, and total amounts in minor units;
- unique Stripe Checkout Session and PaymentIntent IDs;
- payment state and timestamps;
- unique stable Printful external ID and nullable Printful order ID;
- fulfillment state, latest Printful status, shipping method, cost-calculation status, returned cost/currency, and approved maximum cost;
- current repair lease owner/expiry, attempt count, sanitized last error, and timestamps.

### `commerce_order_items`

- order ID and stable line position;
- logical product code, variant code, quantity, and immutable catalog revision;
- unit and line amounts in minor units;
- approved Printful catalog variant, placement, technique, and private print-file reference;
- per-line maximum fulfillment cost and launch revision.

### `commerce_order_recipients`

- one row per order;
- versioned AES-GCM ciphertext, nonce, and key version for the recipient data needed by Printful;
- optional redacted display fields such as destination country and postal prefix;
- deletion timestamp and retention reason.

Do not store a plaintext address, Stripe webhook body, or Printful request body. Delete the encrypted recipient payload after the return/support window and accounting requirements permit, while retaining non-PII financial and fulfillment records.

### `commerce_provider_events`

- provider, event type, provider entity ID, occurred time, payload hash, received time, processing status, and sanitized failure;
- unique Stripe event ID;
- Printful dedupe key composed from event type, store ID, entity ID, and `occurred_at` because Printful does not supply an event ID and its `retries` field changes.

### `commerce_shipments`

- unique Printful shipment ID and order ID;
- shipment/delivery state, carrier, service, redacted tracking number, tracking URL, estimates, shipped/delivered times, and reshipment flag;
- last reconciled timestamp.

### `commerce_refunds`

- unique Stripe refund ID;
- order ID, requested/approved/refunded amount, reason category, Stripe state, Printful cancellation/refund state, idempotency key, and timestamps.

### `commerce_fulfillment_attempts`

- order ID, stage, lease token and expiry, attempt number, outcome, provider request identifier when available, and sanitized error.

An atomic insert or compare-and-set grants one short fulfillment lease. A worker recovering an expired lease must query Printful by the stable external ID before attempting creation.

## State model

Payment state:

`checkout_pending -> paid`

`checkout_pending -> payment_failed`

`paid -> refund_pending -> partially_refunded | refunded | refund_failed`

Fulfillment state:

`not_started -> queued -> creating_draft -> draft -> awaiting_costs -> confirming -> submitted`

Provider updates then map to `in_review`, `pending`, `on_hold`, `in_process`, `partially_shipped`, `fulfilled`, `cancel_pending`, `canceled`, `failed`, or `manual_review`.

`cost_mismatch` and repeated contract, address, artwork, or provider failures always enter `manual_review`. They never auto-confirm.

Customer-facing labels should be calmer and coarser: Payment received, Preparing order, In production, Partially shipped, Shipped, Delivered, Needs attention, Canceled, or Refunded. Provider internals and failure bodies remain private.

## End-to-end flow

### 1. Checkout

1. Require a same-origin POST and an authenticated, verified account.
2. Validate every logical product, variant, and quantity against the server manifest. Reject unknown fields, duplicate variants after normalization, carts over the line/quantity limits, mixed currencies, and anything whose launch flag is off.
3. Calculate the merchandise subtotal from server-owned unit amounts. The browser may submit only product code, variant code, and quantity.
4. Apply the server-owned Standard shipping amount below the threshold or zero shipping at and above the threshold. The boundary is inclusive.
5. Create or reuse a pending local order using a browser-generated idempotency token scoped to the user and normalized cart.
6. Create a Stripe Checkout Session with `mode: "payment"`, server-selected line items, the local order ID in `client_reference_id`, minimal metadata, and the verified email.
7. Omit `payment_method_types`.
8. Do not allow a buy action unless every line has a launch flag, sample approval, catalog revision, Price ID, variant, print file, shipping rule, and cost ceiling.

Release 1 stays United States only with Standard shipping. Use an owner-approved fixed shipping amount below an owner-approved merchandise threshold, then free Standard shipping at or above it. The threshold is based on merchandise before tax and after product discounts. Shipping does not count toward its own threshold.

Choose the two amounts from a cart matrix, not from the first-item rate alone. Record Printful cost for one hat, two hats, three hats, the hat mixed with each future pilot item, and any split-shipment case. The free-shipping threshold must leave the approved contribution margin under the most expensive allowed cart at each boundary.

Hosted Checkout collects the address after session creation, so a real-time Printful quote could disagree with the final address. International shipping, live rates, multiple service levels, and carts that can split across countries or fulfillment regions should be separate reviewed releases.

### 2. Verified payment

1. Extend the Stripe webhook without changing subscription branches.
2. Handle one-time `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.async_payment_failed`.
3. Verify the Stripe signature first and insert the Stripe event ID once.
4. Retrieve the Checkout Session and line items from Stripe. Do not trust webhook metadata alone.
5. Require `mode=payment`, `payment_status=paid`, expected currency and amount, the exact allowlisted cart, approved shipping country, and matching local order.
6. Persist the immutable financial snapshot and encrypted recipient snapshot.
7. Mark the order paid once, enqueue fulfillment once, and return 2xx. Never call Printful while holding the Stripe webhook response open.

### 3. Draft creation and confirmation

1. The commerce queue consumer obtains the fulfillment lease.
2. Query `GET /v2/orders/@{external_id}`. If found, attach it locally instead of creating a duplicate.
3. If absent, create the draft with the recipient, Standard shipping, catalog variant, quantity, approved placement/technique/layer data, and stable external IDs.
4. Poll the draft with bounded retries until cost calculation is `done`, or pause on `failed`/timeout.
5. Compare the Printful currency and total against the immutable catalog revision and approved maximum. A mismatch pauses for owner review.
6. Confirm with the separate empty `POST /v2/orders/{order_id}/confirmation`.
7. Re-read the order and record the provider state.

The Printful token is resolved only inside the commerce Worker immediately before an API call. It is never sent to Pages, the browser, D1, logs, error responses, or analytics.

### 4. Status, tracking, and email

Valid Printful webhooks enqueue a reconciliation job. A scheduled job also re-reads every nonterminal order and recently shipped order so missed webhooks do not strand state.

The account order endpoint requires the current session and returns only orders whose `user_id` matches. It exposes the public order ID, purchased item label, amount, customer-facing status, shipment estimates, safe tracking link, and Customer Help link. It excludes provider IDs, recipient ciphertext, Printful dashboard links, raw events, and internal errors.

Transactional email is deduplicated by order plus milestone. Send only when a customer-visible milestone changes.

## Idempotency and recovery rules

- Stripe Checkout creation: reuse a stable server idempotency key derived from the local order and attempt.
- Stripe webhook: unique Stripe event ID and immutable payment transition.
- Fulfillment enqueue: one unique job per paid order and catalog revision.
- Printful creation: stable `external_id`, preflight lookup, and an expiring local lease.
- Printful webhook: deterministic event dedupe key followed by authenticated reconciliation.
- Stripe refund: stable idempotency key per approved refund attempt.
- Email: unique order/milestone record.

An operator-only repair command should support `inspect`, `retry-draft`, `retry-confirmation`, `reconcile`, `cancel`, and `refund`. Every mutating action needs a reason, actor, precondition, idempotency key, and audit row. There is no public admin console in the first release.

The reconciliation schedule should:

- recover expired fulfillment leases;
- locate paid orders with no Printful ID;
- re-read nonterminal Printful orders and shipments;
- flag paid orders that remain unsubmitted beyond the alert threshold;
- retry transient `429` and `5xx` failures with bounded exponential backoff and jitter;
- stop on validation, cost, artwork, address, authentication, or contract failures;
- emit counts and opaque order references, never email, address, token, or raw payload.

## Cancellation and refunds

Customer cancellation remains a Customer Help request.

1. Lock the order for review.
2. Re-read Printful.
3. If still cancellable, request Printful deletion/cancellation and verify the resulting state.
4. Only then create the Stripe refund, unless the owner explicitly accepts the fulfillment loss.
5. If Printful returns `409` or is already in process, do not promise cancellation or automatically refund. Route to manual review under the published policy and applicable law.
6. For damaged, incorrect, lost, returned, or out-of-stock shipments, record the provider case and decide between reshipment and refund before changing Stripe.
7. Reconcile Printful `order_refunded` events with the Stripe refund ledger; one provider's refund does not silently imply the other completed.

Disputes and chargebacks should freeze automated refund actions and preserve the redacted order timeline for review.

## Implementation sequence and gates

### Gate A: owner inputs

- approve the physical hat sample;
- approve the final print file reference and private production packet;
- approve the tax behavior, maximum Printful cost, direct-goods refund wording, and launch quantity limit;
- add order and webhook scopes only when fulfillment rehearsal begins;
- approve the separate commerce Worker, D1, private R2, queue, scheduled reconciliation, and transactional email bindings.

### Gate B: local implementation

1. Completed: inspect HobFarm Shop and its sync product.
2. Completed: fill the private hat manifest with verified IDs while keeping its launch flag off.
3. Add D1 migrations, encryption, event ledger, queue consumer, and provider clients.
4. Add the Pages-to-Worker service binding and authenticated proxy helpers.
5. In progress: the direct-only cart and gated one-time Checkout creation are complete; isolated one-time Stripe webhook handling remains.
6. Add signed Printful webhook handling and reconciliation.
7. Add account order views and transactional email.
8. Completed: add the non-live hat product entry and durable R2 mockups.
9. Update refund/privacy/terms copy for direct fulfilled goods.

### Gate C: automated verification

- unit tests for allowlist rejection, amount/currency checks, account ownership, state transitions, encryption, redaction, leases, and dual-format Printful errors;
- cart tests for one item, repeated quantity, mixed items, the exact free-shipping boundary, one cent below the boundary, quantity limits, stale catalog revisions, and split-shipment margin protection;
- Stripe fixture tests for duplicate, out-of-order, unpaid, asynchronous success/failure, refund, and dispute events;
- Printful fixture tests for draft, calculation timeout/failure, cost mismatch, duplicate external ID, confirmation, hold, partial shipment, return, out-of-stock, cancellation conflict, and refund;
- byte-exact HMAC tests for valid, invalid, missing, malformed, wrong-key, and formatted-body Printful signatures;
- integration tests proving repeated Stripe and Printful events create one order, one Printful draft, one confirmation, one refund, and one email per milestone;
- production build, Astro check, repository tests, Worker typecheck/tests, and mobile/tablet/desktop browser QA.

### Gate D: test-store rehearsal

After explicit approval, bind test secrets and resources, register a test webhook, and use Stripe test mode plus a separate Printful test store. Run paid-to-draft, cost mismatch, confirmation, cancellation, shipment, webhook retry, reconciliation, and refund rehearsals. No live Price ID or live product is enabled here.

### Gate E: live release

Owner signs off on the final sample, current catalog availability, price and cart-margin table, shipping threshold, tax configuration, legal copy, email templates, support runbook, and test evidence. Activate the hat behind a server launch flag, place and inspect a real owner order, then add another product only after the first order reconciles correctly. Keep the kill switch capable of blocking new Checkout Sessions without taking order status offline.

## Open decisions and exact owner actions

1. Approve the physical sample and final print file after the owner order.
2. Decide tax behavior, maximum provider cost, quantity limit, and direct-goods refund rules.
3. Confirm account-required checkout. The current foundation requires a verified HobFarm account.
4. Create the commerce D1, queue, private production storage, encryption key, service binding, reconciliation schedule, and transactional email binding when fulfillment work starts.
5. Register Printful product and order webhooks only after the persistent commerce Worker endpoint and reconciliation checks exist.
6. Add one-time Stripe webhook handling, fulfillment state, account order status, cancellation, and refund repair before enabling either launch flag.
7. Approve live activation only after the rehearsal. The owner places any real sample or launch order.

Until those actions are complete, the hat remains coming soon and the two checkout launch flags remain off.
