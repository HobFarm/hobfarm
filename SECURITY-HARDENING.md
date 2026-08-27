# HobFarm security hardening

Last reviewed: August 27, 2026

This document is the operator packet for the HobFarm website security pass. It
records the deployed architecture observable from this repository and the
Cloudflare account, the source changes made in the hardening passes, and the
remaining operator configuration. The August 27 auth transport migration
changed the Pages production binding and secret, the auth Worker public URL
settings, and one account-level Bulk Redirect rule. It did not change DNS,
databases, provider accounts, WAF rules, or rate-limit rules.

## Current architecture

The `hobfarm` Cloudflare Pages project is connected to the HobFarm GitHub
repository and deploys `main`. Its public domains are:

- `hob.farm`, the canonical website;
- `hobfarm.pages.dev`, the production Pages hostname. An account-level Bulk
  Redirect now sends it to the equivalent `hob.farm` path and query.

The live Pages project uses dashboard-managed production configuration. A
read-only `wrangler pages download config hobfarm` inspection returned:

- build output `dist/client`;
- dashboard compatibility date `2026-02-11`;
- `ACADEMY_ONE_TIME_CHECKOUT_ENABLED=false`;
- `ACADEMY_STRIPE_TAX_ENABLED=false`;
- an `AUTH_HTTP` service binding to the default entrypoint of `hobfarm-auth`;
- a `COMMERCE` service binding to `hobfarm-commerce`.

The checked-in `wrangler.jsonc` is local/build configuration, not the Pages
production source of truth: it intentionally lacks `pages_build_output_dir`.
It currently uses compatibility date `2026-08-06` and `nodejs_compat`. Do not
add `pages_build_output_dir` casually. Cloudflare treats that as an opt-in to
make the file authoritative, and the downloaded dashboard bindings must first
be reconciled with it.

The Pages production environment has encrypted secrets named:

- `INTERNAL_ADMIN_HMAC_SECRET`;
- `STRIPE_ACADEMY_AVATAR_PRICE_ID`;
- `STRIPE_API_KEY`;
- `STRIPE_CREATIVE_MEMBERSHIP_PRICE_ID`;
- `STRIPE_WEBHOOK_SECRET`;
- `TURNSTILE_SECRET`.

Secret values were not read. Local `.dev.vars` is ignored by Git, no local env
file has appeared in repository history, no production source map is emitted,
and the built public tree did not contain common secret, database, deployment,
or private-key files.

### Connected Workers and storage

`hobfarm-auth` owns identity, sessions, the encrypted provider-key vault, and
the authoritative membership record. It is routed over `hob.farm/api/auth/*`,
`hob.farm/api/keys*`, and `hob.farm/api/admin/*`. Pages, StyleFusion, and HobBot
reach it privately through service bindings. Its production and preview
`workers.dev` URLs are disabled. It has:

- D1 binding `AUTH_DB`;
- Secrets Store bindings for Resend and the vault key-encryption key;
- a regular HMAC secret for server-only membership routes;
- native rate-limit bindings of one email request per 60 seconds and ten
  requests per IP per 60 seconds;
- a daily token/session cleanup schedule;
- full Worker observability.

`hobfarm-commerce` has no public route and `workers_dev=false`. Pages reaches it
only through the `COMMERCE` service binding. It owns:

- D1 order and Academy ledgers;
- encrypted fulfillment addresses;
- a Printful token in Secrets Store;
- a fulfillment queue and 15-minute reconciliation schedule;
- a Cloudflare Email Service binding for contact delivery;
- disabled-by-default fulfillment mutation flags;
- Worker observability.

The Pages code refers to `PROVIDER_HEALTH`, `GRIMOIRE_WORKER_URL`,
`HOBBOT_WORKER_URL`, and `HOBBOT_ENABLED`, but they were absent from the
downloaded production configuration. Live checks confirmed that provider
status returns an empty list, Grimoire synthesis returns 503 not configured,
and public chat returns 404 disabled. The subscription endpoint also has no
configured upstream. These routes do not currently consume model or media
provider credit.

### Other observed HobFarm hosts

These hosts appear in zone traffic but are not deployed by this repository:

| Host | Observed role | Boundary |
| --- | --- | --- |
| `cdn.hob.farm` | Media/CDN surface | Separate R2/CDN configuration |
| `sf.hob.farm` | StyleFusion Worker application | Separate `stylefusion` repository; D1, R2, auth service bindings, provider-backed generation |
| `stylefusion.hob.farm` | Redirect to `sf.hob.farm` | Separate zone redirect |
| `ezize.hob.farm` | Redirect to `hob.farm/ezize/` | Separate zone redirect |
| `ez.hob.farm` | Owner application | Protected by Cloudflare Access at the time of review |
| Grimoire/HobBot Worker hosts | Legacy/private knowledge and chat services | Separate, quarantined `grimoire` Worker tree; inactive as Pages upstreams in the current production config |

Zone WAF rules for `hob.farm` do not automatically protect `pages.dev` or
`workers.dev` hostnames. Those alternate hosts are closed separately below.

## Auth transport and alternate-host migration

The previous Pages architecture constructed public HTTP requests from
`AUTH_WORKER_URL`, which pointed to
`hobfarm-auth.damp-violet-bf89.workers.dev`. That exposed a second usable auth
hostname outside the `hob.farm` zone controls.

The production Pages project now has this dashboard-managed binding:

| Environment | Binding | Service | Entrypoint |
| --- | --- | --- | --- |
| Production | `AUTH_HTTP` | `hobfarm-auth` | Default |
| Preview | none | none | none |

Non-production branch previews remain deliberately unbound so they cannot
reach production identity data. A hash URL for a production deployment uses
the production binding. Local Pages development supplies the same binding with
`--service AUTH_HTTP=hobfarm-auth` and Wrangler's local service registry.

`src/lib/auth-service.ts` is the shared transport. It constructs a `Request`
against the synthetic internal origin `https://hobfarm-auth` and calls
`env.AUTH_HTTP.fetch(request)`. The binding, not DNS, selects the Worker. The
auth and key proxies preserve safe path segments, query strings, methods,
bodies, selected request headers, the `hf_session` cookie, response status,
and downstream headers. Signed admin calls retain the existing canonical HMAC
scheme.

The migration covers:

- `/api/auth/*` and `/api/keys*` Pages proxy routes;
- session resolution used by Shop orders and checkout;
- Academy access, checkout status, checkout, progress, questions, and paid
  lesson authorization;
- Stripe checkout, portal, webhook, and membership subscription lookups;
- chat mutation authentication when chat is deliberately enabled.

The Pages production secret `AUTH_WORKER_URL` was deleted after a production
deployment proved the new binding. Repository search finds no active main-site
reference. Cross-project inspection found StyleFusion already using `AUTH` and
`AUTH_HTTP` bindings, HobBot already using `AUTH`, and the Commerce Worker with
no direct auth dependency. No remaining direct consumer of the public auth URL
was found.

### Auth Worker public URL

`C:/Users/xkxxk/hobfarm-auth/wrangler.toml` now persists:

```toml
workers_dev = false
preview_urls = false
```

The matching settings were disabled at **Workers & Pages > hobfarm-auth >
Domains > Worker URL** for both Production and Preview. The zone routes on
`hob.farm` remain enabled. After the change, a direct request to the former
production URL returned Cloudflare 404 error 1042, while `hob.farm/api/auth/me`
continued to reach the Worker and the Pages production binding continued to
return auth responses.

### Production Pages hostname

The account-level Bulk Redirect rule is:

- rule name: `Redirect production pages.dev to hob.farm`;
- associated list: `hobfarm_pages_dev_canonical`;
- source: `https://hobfarm.pages.dev/`;
- target: `https://hob.farm`;
- status: `301 - Permanent Redirect`;
- preserve query string: enabled;
- subpath matching: enabled;
- preserve path suffix: enabled;
- include subdomains: disabled.

It lives at **Delivery & performance > Bulk Redirects**. Disabling Include
subdomains is intentional: a request such as
`https://<deployment>.hobfarm.pages.dev/...` remains on that deployment host,
while the production `hobfarm.pages.dev` hostname redirects to the equivalent
canonical path and query.

The completed deployment order was: add the production `AUTH_HTTP` binding;
deploy the binding-aware Pages code; validate Pages proxy and protected-route
responses; delete the production `AUTH_WORKER_URL` secret; validate again;
disable the auth Worker production and preview URLs; validate zone and binding
traffic; then deploy the production Pages hostname redirect.

Rollback is the reverse dependency order. First disable the Bulk Redirect rule
if alternate-host routing must be investigated. To restore the old auth
transport, re-enable the auth Worker production URL, restore the Pages
`AUTH_WORKER_URL` secret, deploy the last URL-based Pages revision, validate it,
and only then remove `AUTH_HTTP`. Do not remove the service binding while the
current code is deployed. Preview URLs do not need to be enabled for a
production rollback.

## Attack-surface inventory

Static HTML, Markdown projections, images, Astro assets, RSS, robots, sitemaps,
and public JSON indexes contain no state-changing server behavior. The new
`public/_routes.json` keeps HTML routes in Pages middleware for Markdown
content negotiation and response headers, while excluding immutable assets,
media, discovery files, favicons, and the static Grimoire snapshot from Pages
Functions execution.

The table below records every dynamic route in this repository or directly in
the auth Worker it invokes. “Internal rate” means an application/Worker control
already present before the dashboard rule in this packet.

| Host and route | Methods | Auth and input | Providers/storage/state | Cost or abuse | Current validation and controls |
| --- | --- | --- | --- | --- | --- |
| `hob.farm/api/auth/request` | POST | Public email | Resend, auth D1; creates login token and sends email | Email sends and enumeration/brute-force traffic | 8 KiB streamed body, email normalization, generic success, one/email/minute and ten/IP/minute native limits, same-origin browser mutation check |
| `hob.farm/api/auth/verify` | POST | Public email and six-digit code | Auth D1; creates session | Code guessing and D1 writes | Ten/IP/minute native limit, five-attempt token lock, hashed codes and sessions, 15-minute token expiry |
| `hob.farm/api/auth/logout` | POST | Session cookie | Auth D1; deletes session | Low-cost state churn | Same-origin browser mutation check; secure HttpOnly `SameSite=Lax` cookie scoped to `/api/` |
| `hob.farm/api/auth/account/delete` | POST | Recent session and typed email | Auth D1 and key vault; anonymizes account | Destructive account action | Server session auth, ten-minute recent-session requirement, exact email confirmation, blocks deletion during actionable membership states |
| `hob.farm/api/auth/me` and `/me/subscription` | GET | Session cookie | Auth D1 read | Session-check amplification | Server session validation, browser-safe membership projection, no-store |
| `hob.farm/api/auth/email-change/request` | POST | Session and new email | Resend and auth D1; sends two emails | Email cost and account takeover attempts | Email validation/collision check, one/user/minute, same-origin browser mutation check |
| `hob.farm/api/auth/email-change/verify` | POST | Session and code | Auth D1; changes login identity and sessions | Code guessing/account takeover | Ten/IP/minute native limit, five-attempt lock, hashed code, pending-request expiry |
| `hob.farm/api/keys` | GET | Session | Auth D1; returns masked vault inventory | Private metadata read | Server auth, provider allowlist, no plaintext keys returned |
| `hob.farm/api/keys/:provider` | PUT, DELETE | Session; provider and key up to 1,024 characters | D1 plus AES-encrypted provider-key vault; changes private keys | Credential replacement/deletion and storage writes | Server auth, provider allowlist, 8 KiB streamed body, Secrets Store KEK, same-origin browser mutation check |
| `hob.farm/api/contact` | POST | Public name, email, subject, message, Turnstile token | Turnstile and private commerce email service; sends email | Anonymous email sends | Same-origin check, JSON-only, 16 KiB stream limit, field allowlist/limits, HTML escaping, subject allowlist, Turnstile server verification, destination allowlist; GET is 405 |
| `hob.farm/api/subscribe` | POST | Public email and honeypot | Intended HobBot subscription upstream; state-changing when configured | Newsletter/provider calls | Same-origin check, JSON-only, 4 KiB stream limit, email validation, honeypot; upstream currently absent; GET is 405 |
| `hob.farm/api/status` | GET | Public, no input | Optional KV reads by `provider:` prefix | KV list/read amplification | Read-only, short intended cache, returns empty on failure |
| `hob.farm/api/grimoire/synthesis` | GET | Public | Intended Grimoire Worker read | Worker subrequest | Fixed upstream path and cache; upstream currently absent |
| `hob.farm/api/grimoire/archive` | GET | Public `offset` and `limit` | Intended Grimoire Worker read | Worker subrequest and archive pagination | Integer clamp, `offset` 0–1,000,000, `limit` 1–50, fixed upstream path, cached subrequest; upstream currently absent |
| `hob.farm/api/grimoire/snapshot` | GET | Public | Build-time static JSON | Static bandwidth only | Prerendered, public cache, now excluded from Pages Functions |
| `hob.farm/api/chat/conversations` | GET, POST | Session required for POST; optional title | Intended HobBot provider and conversation storage | Model/provider and storage cost when enabled | Entire surface fails closed unless `HOBBOT_ENABLED=true`; route allowlist, same-origin mutation check, auth on mutation, 12 KiB body and title limits |
| `hob.farm/api/chat/conversations/:id` | GET, DELETE | Session required for DELETE | Intended HobBot storage | Read/delete amplification | Safe ID grammar, method allowlist, same-origin mutation check, auth on delete; currently disabled |
| `hob.farm/api/chat/conversations/:id/messages` | POST | Session; message up to 4,000 characters | Intended model call and storage write | Highest potential model cost in Pages surface | Safe ID, JSON-only, 12 KiB body, exact content projection, same-origin and server auth; currently disabled |
| `hob.farm/api/chat/messages/:id/feedback` | POST | Session; `up` or `down` | Intended storage write | Low-cost state churn | Safe ID, exact enum, same-origin and server auth; currently disabled |
| `hob.farm/api/stripe/checkout` | POST | Session; fixed membership product | Stripe Checkout and signed auth lookup; creates subscription session | Stripe API/session creation and duplicate subscriptions | Same-origin, 4 KiB streamed body, product/price allowlist, server auth, existing-subscription check, 15-minute idempotency bucket; GET is 405 |
| `hob.farm/api/stripe/portal` | POST | Session | Stripe portal and signed auth lookup; creates portal session | Stripe API calls and private billing access | Same-origin, server auth, stored-customer/status checks, masked logs; GET is 405 |
| `hob.farm/api/stripe/webhook` | POST | Stripe signature, not browser auth | Stripe API, auth HMAC calls, private commerce service, D1 and optional fulfillment queue; changes payment/access/order state | Financial and fulfillment state | 256 KiB streamed body, Stripe signature verification, configured membership Price verification, event/idempotency contracts, HMAC-signed auth mutations, private service binding; GET is 405 |
| `hob.farm/api/shop/checkout` | POST | Verified user; UUID token and trusted cart items | Stripe and private commerce D1; creates order/session | Stripe calls, order writes, potential future fulfillment | Feature flag off, same-origin, JSON-only, 8 KiB stream limit, exact body keys, server catalog normalization, verified email, reservation and Stripe idempotency; GET is 405 |
| `hob.farm/api/shop/orders` | GET | Verified user; optional Stripe session ID | Private commerce D1 read | Account-bound order reads | Server auth, verified email, strict session ID grammar, user ID supplied only by server; POST is 405 |
| `hob.farm/api/academy/access` | GET | Session | Auth and private commerce D1 reads | Entitlement/progress read amplification | Server auth and server-selected user ID; POST is 405 |
| `hob.farm/api/academy/checkout-status` | GET | Session; Stripe session ID | Private commerce D1 read | Polling amplification | Server auth, strict session ID grammar, user-bound purchase lookup; POST is 405 |
| `hob.farm/api/academy/checkout` | POST | Session; fixed product key | Stripe, auth, and private commerce D1; creates purchase/session | Stripe calls and purchase writes | Checkout and tax flags off, same-origin, 4 KiB streamed body, product/price/amount allowlist, existing-access check, 15-minute idempotent reservation; GET is 405 |
| `hob.farm/api/academy/progress` | GET, POST | Session; known course/lesson and status | Private commerce D1 read/write | Persistent state churn | Server auth, 8 KiB streamed JSON, manifest lookup, status enum, paid-lesson entitlement check |
| `hob.farm/api/academy/questions` | POST | Session; course/lesson/category/question | Private commerce D1 write | Spam/storage and owner support load | Server auth, same-origin, 4 KiB streamed JSON, manifest lookup, field limits in commerce Worker, five questions/user/hour; GET is 405 |
| `hob.farm/api/academy/courses/:course/:lesson` | GET | Public for public lessons; session and entitlement for paid lessons | Auth and private commerce D1 reads; returns paid lesson body | Paid-content scraping and entitlement amplification | Strict slug grammar, manifest lookup, server authorization, private no-store response; POST is 405 |
| `hob.farm/api/academy/avatar-content-system/lesson/:slug` | GET | Session and entitlement | Same as the canonical course lesson route | Legacy duplicate paid-content surface | Safe slug, server auth and entitlement; POST is 405 |

The commerce Worker’s `/internal/*` routes, D1 data, Printful inspection calls,
email send, queue consumer, and cron handler are provider-backed but are not
publicly routable. They trust the Cloudflare service-binding boundary. If that
Worker ever receives a public route or `workers_dev=true`, it requires a new
authentication layer before deployment.

## Findings

### Critical

No critical finding was demonstrated.

### High

No high-severity repository finding was demonstrated. Sensitive operations
perform server-side authentication or signature verification, and the only
commerce Worker is private.

### Medium

#### M1. All static requests invoked Pages Functions

- Evidence: a root `functions/_middleware.ts` existed without `_routes.json`.
  Cloudflare Pages invokes Functions for all routes by default in that state.
  Live HTML and scanner 404 responses reported `CF-Cache-Status: DYNAMIC`.
- Consequence: ordinary assets and scanner noise consume the Workers Free daily
  request allowance and add middleware execution.
- Control: `public/_routes.json` now excludes hashed assets, images, media,
  discovery files, favicons, and the static Grimoire snapshot. HTML and APIs
  remain in middleware.
- Validation: build and confirm `dist/client/_routes.json`; after deployment,
  compare Pages Functions requests with total HTTP requests and confirm excluded
  assets still return their long cache headers.

#### M2. High-confidence scanner paths were only partly stopped before routing

- Evidence: traffic contained `/fetch`, `/docker-compose.yaml`, and
  `/config/config.yaml`. `/fetch` has no route. Live checks returned a full
  application 404 for all three, while `.php`, WordPress, and `.env` probes were
  already receiving an edge 403. The source fallback contained literal
  `"/settings/*"`-style strings in a `Set`, which do not act as wildcards.
- Consequence: uncovered probes still invoke Pages middleware and build a full
  404; direct `pages.dev` traffic can bypass zone WAF.
- Control: exact observed paths and narrow nonexistent prefixes now receive an
  empty 404 before the application router. The dashboard WAF rule below stops
  them before Pages on the `hob.farm` zone.
- Validation: representative probe table below and Security Events by rule ID.

#### M3. Sensitive public routes need one zone-level burst control

- Evidence: the Pages project has authenticated Stripe, account, key-vault,
  Academy, and future chat routes plus anonymous contact/subscription routes.
  Auth and Academy questions have internal limits; the other routes rely on
  authentication, idempotency, feature flags, or Turnstile rather than a common
  burst ceiling. The account is on the Free Website plan. Existing WAF rulesets
  could not be listed with the current Wrangler OAuth scope, so an existing
  rate rule could not be confirmed.
- Consequence: repeated requests can consume Function invocations, D1 work,
  provider API quota, or owner support capacity even when authorization holds.
- Control: apply the one Free-plan aggregate rate rule below. Stripe webhook and
  read-only public endpoints are intentionally excluded.
- Validation: issue no more than 20 test requests in 10 seconds normally, then
  use a controlled test client to cross the threshold and inspect the rate-limit
  event. Do not test against email-send or paid provider paths.

#### M4. Closed: the auth Worker had a public `workers.dev` bypass around zone WAF

- Previous evidence: Pages used the public Worker URL because a fetch to the
  zone route would loop back through Pages.
- Control completed: Pages now uses the private `AUTH_HTTP` service binding;
  `workers_dev=false` and `preview_urls=false` are persisted in the auth Worker
  configuration and applied in Cloudflare.
- Validation: repository and cross-project consumer searches, unit tests,
  local connected-binding requests, production protected-route requests, and
  post-disable hostname checks found no remaining dependency. The former URL
  returns Cloudflare error 1042.

### Low

#### L1. Auth helpers forwarded unrelated cookies

- Evidence: the Pages auth proxy and server-side auth resolver forwarded the
  complete inbound `Cookie` header to the auth Worker.
- Consequence: unrelated `/api/` cookies could cross an unnecessary service
  boundary.
- Control completed: both helpers now forward only `hf_session`.
- Validation: focused structural test plus deployed login/account/key checks.

#### L2. Global headers erased intentional public cache policy

- Evidence: middleware set `Cache-Control: no-store` on every `/api/*`
  response, including read-only status, synthesis, archive, and the static
  snapshot. The global `_headers` blocks also appended `max-age=0` to immutable
  assets and `no-store` to the static snapshot. Live snapshot and status
  responses showed `no-store`.
- Consequence: avoidable repeat reads and subrequests; no confidentiality gain
  because these payloads are intentionally public.
- Control completed: only the four named public read endpoints retain their
  handler/asset cache policy. The overlapping global cache declarations were
  removed. All private and state-changing APIs remain `no-store` and
  `noindex` through middleware.
- Validation: local runtime response headers and post-deployment curl checks.

#### L3. Pages configuration is split between dashboard and local Wrangler data

- Evidence: the dashboard reports compatibility date `2026-02-11`; the local
  build config reports `2026-08-06` and is ignored by `wrangler pages` because
  `pages_build_output_dir` is absent.
- Consequence: runtime behavior and bindings can drift without a visible source
  diff.
- Control: retain dashboard configuration for this pass. If configuration is
  migrated to Git later, start from `wrangler pages download config`, add all
  preview/production bindings and variables, keep secrets in Cloudflare, test a
  deployment, and only then make the file authoritative.
- Validation: compare downloaded config, dashboard bindings, and deployed
  runtime after any migration.

#### L4. CSP still permits inline scripts

- Evidence: `script-src` contains `'unsafe-inline'` because the current Astro
  pages include inline scripts.
- Consequence: an HTML injection elsewhere would have fewer CSP barriers.
- Control: keep the current CSP during this focused pass. Migrate inline scripts
  to nonces or stable hashes route by route, then remove `'unsafe-inline'` only
  after browser coverage passes.
- Validation: CSP violation reporting and a production browser pass across
  articles, media embeds, auth, checkout, Turnstile, and interactive pages.

### Informational

- `/fetch` is unused. No file, redirect, Function, Worker route, proxy, upload,
  SSRF surface, Browser Rendering call, or provider call is attached to it. It
  returned the normal application 404 before this pass and is now a narrow
  fallback probe path plus an edge-rule candidate.
- PHP, WordPress, Docker, YAML configuration, Git metadata, shell, and SQL dump
  technologies are not part of the public website runtime. Requests for them
  are Internet noise unless a future project deliberately introduces one.
- Live tests showed existing edge 403 responses for `/test.php`, `/.env`, and
  `/wp-login.php`. The exact existing rule could not be read with the current
  OAuth scope; use Security Events to identify it before removing or merging
  rules.
- `hobfarm.pages.dev` now redirects to `hob.farm` before Pages Functions run.
  Deployment-specific subdomains remain available for explicit deployment QA
  and are not covered by the production redirect.
- The Academy completion page currently returns 404 in production because it is
  an SSR Astro route while the Pages project deploys `dist/client`. Academy
  one-time checkout is off, so this is not an active payment loss or security
  exposure. Fix and test the return page before enabling that checkout.
- `ez.hob.farm` was protected by Cloudflare Access during the live check. That
  application and its policy are separate from this repository.

## Repository changes completed

- `public/_routes.json` keeps static assets and discovery files out of Pages
  Functions.
- `functions/_middleware.ts` recognizes the exact incident probes, uses real
  prefix matching, returns small early 404s, and preserves cache policy only for
  four public read APIs.
- `public/_headers` no longer combines revalidation or private API policy with
  the explicit immutable/static cache directives. Dynamic API privacy remains
  enforced in middleware.
- `src/lib/auth-service.ts` makes `AUTH_HTTP` the single Pages-to-auth
  transport. The proxy, Stripe, Shop, Academy, and chat callers use it and
  forward only the `hf_session` cookie where a session is required.
- `functions/api/contact.ts` rejects content type, oversized bodies, and invalid
  fields before checking provider bindings or calling Turnstile/email delivery.
- `tests/auth-service-binding.test.mjs` covers transport mechanics, failure
  behavior, session-cookie isolation, and HMAC admin calls.
- `tests/security-hardening.test.mjs` checks the route exclusions, incident
  paths, cookie minimization, private auth transport, and cache allowlist.
- `docs/security-hardening.md` points to this canonical operator packet while
  retaining the earlier pass as history.

## Exact Cloudflare dashboard changes

The current plan is Free Website. Use zone-level controls on `hob.farm`.

### 1. Establish the baseline

Before changing a rule, save a 24-hour Security Analytics view with:

- host;
- path;
- method;
- source country and ASN;
- user agent;
- known bot;
- edge status;
- origin status;
- cache status.

Record the current screenshot baseline: about 9.3k requests, 2.47k edge 4xx,
682 origin 404s, 26 origin 405s, 5 origin 5xx responses, roughly 1.02k empty
user agents, and the listed top scanner paths.

### 2. Confirm the managed ruleset

In **Security > Security rules > Managed rules**, ensure the **Cloudflare Free
Managed Ruleset** is enabled with its defaults. Do not enable every optional
technology tag: HobFarm does not run WordPress, PHP, Apache application code,
or a public SQL service.

Free-plan managed WAF availability is documented in [Cloudflare WAF: Get
started](https://developers.cloudflare.com/waf/get-started/).

### 3. Add one custom scanner rule

Navigate to **Security > Security rules > Create rule > Custom rule**.

- Rule name: `Block nonexistent exploit and secret-file probes`
- Action: `Block`
- Place: after any deliberate allow/skip rule and before broader challenge
  rules
- Expression:

```text
(not cf.client.bot and (
  ends_with(lower(http.request.uri.path), ".php") or
  ends_with(lower(http.request.uri.path), ".sql") or
  starts_with(lower(http.request.uri.path), "/.git/") or
  starts_with(lower(http.request.uri.path), "/phpmyadmin") or
  starts_with(lower(http.request.uri.path), "/wp-admin") or
  starts_with(lower(http.request.uri.path), "/wp-content/") or
  starts_with(lower(http.request.uri.path), "/wp-includes/") or
  lower(http.request.uri.path) in {
    "/.env"
    "/.env.local"
    "/.env.production"
    "/config/config.yaml"
    "/config/config.yml"
    "/docker-compose.yaml"
    "/docker-compose.yml"
    "/docker-compose.production.yaml"
    "/docker-compose.production.yml"
    "/fetch"
  }
))
```

Expected legitimate matches: none. `cf.client.bot` preserves Cloudflare-known
search crawlers even if one requests a bad path. Expected noise matches: PHP,
WordPress, environment, Git, SQL, Docker Compose, configuration, phpMyAdmin,
and the observed nonexistent `/fetch` probes.

Why Block rather than Managed Challenge: every selected target is absent from
the inspected HobFarm website. A challenge would spend more edge work and
would imply there is a legitimate human action behind the path.

Validation:

1. Use the expression preview before saving.
2. Confirm ordinary HTML, RSS, robots, sitemaps, images, and Astro assets do not
   match.
3. Save the rule.
4. Request one representative path from each probe family.
5. In Security Events, filter by this rule name and confirm `Block` at the edge
   with no origin status.
6. Filter Known Bots = true and confirm no matches for the rule.

Rollback: disable the rule. Do not delete it until the false-positive review is
complete. Requests then fall back to the source-side empty 404 for the narrow
known paths or the ordinary site 404.

Custom rules are available on Free, with five rules and no regex support. See
[Cloudflare custom rule availability](https://developers.cloudflare.com/waf/custom-rules/)
and [known bot handling](https://developers.cloudflare.com/waf/custom-rules/use-cases/allow-traffic-from-verified-bots/).

### 4. Add the single Free-plan rate-limit rule

First confirm no existing rate-limit rule consumes the one Free-plan slot. If
one exists, compare its expression and threshold with this rule rather than
overwriting it.

Navigate to **Security > Security rules > Create rule > Rate limiting rule**.

- Rule name: `Limit sensitive HobFarm API bursts`
- Counting characteristic: `IP`
- Requests: `20`
- Period: `10 seconds`
- Mitigation duration: `10 seconds`
- Action: `Block`
- Count cached assets: not applicable to these dynamic paths; leave off if the
  dashboard exposes the choice
- Expression:

```text
(not cf.client.bot and (
  starts_with(http.request.uri.path, "/api/auth/") or
  http.request.uri.path eq "/api/keys" or
  starts_with(http.request.uri.path, "/api/keys/") or
  http.request.uri.path eq "/api/contact" or
  http.request.uri.path eq "/api/subscribe" or
  starts_with(http.request.uri.path, "/api/chat/") or
  http.request.uri.path eq "/api/stripe/checkout" or
  http.request.uri.path eq "/api/stripe/portal" or
  starts_with(http.request.uri.path, "/api/shop/") or
  starts_with(http.request.uri.path, "/api/academy/")
))
```

The rule intentionally excludes `/api/stripe/webhook`; Stripe must be able to
deliver signed retries from provider infrastructure. It also excludes static
and public read-only APIs. The legitimate-use assumption is that one reader or
account behind one IP will not need more than 20 sensitive requests within ten
seconds. The threshold is high enough for page hydration and a few retries but
low enough to stop tight loops. Internal per-email, per-IP, Turnstile,
authorization, idempotency, and five-questions-per-hour controls remain the
primary semantic defenses.

Free plan limits this feature to one rule, path and known-bot expression fields,
IP counting, a ten-second window, and a ten-second mitigation period. It cannot
use hostname, method, headers, cookies, response status, or custom counting
characteristics. See [Cloudflare rate limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/)
and [rate limiting parameters](https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/).

Rollback: disable the rate rule. Internal auth, Turnstile, signature,
authorization, idempotency, and application limits remain active.

If the site later moves to Business or Enterprise, split this aggregate rule
only after Security Analytics supplies real route distributions. Suggested
future groups are anonymous email/auth actions, authenticated provider-backed
actions, and model-generation calls. Do not purchase a plan solely to create
ceremonial rules at the current traffic level.

### 5. Bot controls

Recommended current setting on Free: leave **Bot Fight Mode off** during this
pass. Free Bot Fight Mode cannot be bypassed with a custom Skip action, so it
can interfere with unverified RSS readers, command-line readers, monitoring,
and other intentional automation. The narrow custom rule and rate rule are
more predictable for HobFarm.

Keep **Browser Integrity Check** enabled if it is already enabled. Observe its
events separately from the custom rule. Do not treat empty User-Agent alone as
proof of an exploit; use it as a filter combined with path and behavior.

AI crawler blocking, AI Labyrinth, managed `robots.txt`, and Content Signals
are editorial/distribution policy, not this security decision. Preserve the
current HobFarm policy unless the publisher changes it deliberately.

Cloudflare’s current Free/paid bot-control boundaries and the inability to skip
Free Bot Fight Mode are documented in [Stop malicious bots while allowing
legitimate traffic](https://developers.cloudflare.com/use-cases/solutions/stop-malicious-bots/).

### 6. Observability

Use existing Cloudflare facilities before adding an application analytics
system:

1. **Security Analytics** for all incoming traffic, including allowed traffic.
2. **Security Events** for custom WAF, managed WAF, Browser Integrity Check,
   challenge, and rate-limit actions.
3. **Pages > Functions Metrics** for requests, errors, CPU duration, and
   subrequests.
4. **Workers > hobfarm-commerce > Observability** for queue, cron, provider, and
   service-binding failures. It is already enabled in source.
5. **Workers > hobfarm-auth > Observability** for authentication failures,
   native rate-limit messages, email delivery failures, and D1 errors. It is
   already enabled in its source configuration.
6. Enable Pages Functions invocation logs in the dashboard for the first seven
   days after deployment. At this traffic level, 100% sampling is reasonable;
   reduce to 25% after the baseline is clear. Keep bodies, cookies, email
   addresses, provider keys, Stripe signatures, and secret values out of logs.

On Free, Security Analytics retains up to seven days with a 24-hour maximum
query window; Security Events retains 24 hours and shows sampled logs. See
[Security Analytics](https://developers.cloudflare.com/waf/analytics/security-analytics/)
and [Security Events](https://developers.cloudflare.com/waf/analytics/security-events/).
Workers Logs on Free currently includes 200,000 log events per day with three
days of retention; see [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/).

The Ruleset Engine evaluates WAF custom rules before rate limiting, then managed
WAF, then Super Bot Fight Mode, and then Cloudflare Access. See [Ruleset Engine
phase order](https://developers.cloudflare.com/ruleset-engine/reference/phases-list/).

## Representative request outcomes

| Request | Expected after rollout | Reason |
| --- | --- | --- |
| Ordinary desktop/mobile GET `/` | Allow, 200 | Public HTML |
| Cloudflare-known Googlebot on an article | Allow, 200 | `cf.client.bot` exception; public index target |
| RSS reader GET `/rss.xml` | Allow, 200 without Pages Function invocation | Static discovery exclusion; Bot Fight Mode kept off |
| GET `/robots.txt` or sitemap | Allow, 200 without Pages Function invocation | Static discovery exclusion |
| GET `/_astro/...` | Allow, cached without Pages Function invocation | Immutable asset exclusion |
| GET `/test.php` | Edge Block | Nonexistent PHP probe |
| GET `/.env` | Edge Block | Nonexistent secret-file probe |
| GET `/docker-compose.yaml` | Edge Block | Nonexistent deployment-file probe |
| GET `/config/config.yaml` | Edge Block | Nonexistent configuration probe |
| Random WordPress probe | Edge Block | HobFarm does not run WordPress |
| GET `/fetch` | Edge Block | No such route or legitimate contract |
| Normal `/fetch` request | Not applicable | The repository contains no `/fetch` feature |
| Up to 20 sensitive API requests per IP in 10 seconds | Evaluate normally | Below burst ceiling; application controls decide |
| More than 20 matching API requests per IP in 10 seconds | Rate Block for 10 seconds | Aggregate Free-plan burst control |
| Signed Stripe webhook retry | Evaluate normally | Webhook excluded from rate rule; signature and event contracts decide |
| Cross-origin contact/checkout mutation | Application 403 | Same-origin check before provider work |
| Invalid or oversized JSON body | Application 400/413 | Route-specific parser and streaming limit |
| Unauthorized paid lesson/order/key request | Application 401/403 | Server-side session and account-bound authorization |

## Original hardening rollout order

1. Preserve the current 24-hour baseline.
2. Review and commit only the scoped repository files when publication is
   authorized.
3. Push `main` and let the existing Pages Git integration deploy when
   publication is authorized.
4. Confirm homepage, articles, Workshop, assets, RSS, robots, sitemaps, auth,
   account, contact, and API headers on production.
5. Confirm excluded static paths no longer appear as Pages Function requests.
6. Confirm or enable the Cloudflare Free Managed Ruleset.
7. Add the custom scanner rule and observe Security Events for at least one
   normal traffic cycle.
8. Add the aggregate sensitive-API rate rule.
9. Recheck known crawlers, RSS readers, 4xx/5xx responses, origin 404s, Pages
   invocations, Worker subrequests, auth limits, and provider errors.
10. Record the saved dashboard rule IDs and activation timestamps in a private
    operator note. Rule IDs are deployment state and do not belong in source
    until the dashboard configuration is migrated to infrastructure as code.

The source hardening pass and the auth transport migration were subsequently
deployed. The managed WAF, custom scanner rule, and aggregate rate-limit steps
above remain separate operator decisions unless their saved dashboard state is
recorded here later.

## Rollback

Repository rollback, if the changes have been deployed:

1. Remove or disable the deployed `_routes.json` change if an excluded static
   route unexpectedly needs middleware.
2. Revert the middleware cache allowlist if any public read endpoint exposes
   private data. The inspected four endpoints are public by design.
3. Revert cookie filtering only if deployed auth tests prove the auth Worker
   requires a second cookie; no such requirement was found.
4. Redeploy the last known-good `main` commit through the normal Git path.

Dashboard rollback:

1. Follow the auth transport and alternate-host rollback order above for the
   service binding, Worker URL, or Pages canonical redirect.
2. Disable `Limit sensitive HobFarm API bursts` if it has been added.
3. Disable `Block nonexistent exploit and secret-file probes` if it has been
   added.
4. Do not disable the managed WAF ruleset merely to troubleshoot a custom rule.
5. Re-run one ordinary reader, RSS, crawler, and API check.

All source fallbacks, authentication, authorization, Turnstile, Stripe
signature checks, HMAC checks, private service bindings, body limits, and
idempotency controls remain available if the two dashboard rules are disabled.

## Validation procedure

Automated validation:

```powershell
npm test
npx astro check
npm run build
npm audit --omit=dev
npx wrangler deploy --dry-run --config workers/commerce/wrangler.toml
```

Results for this pass:

- `npm test`: 361 passed, 0 failed;
- `npx astro check`: 720 files, 0 errors, warnings, or hints;
- `npm run build`: production build completed and emitted
  `dist/client/_routes.json`;
- `npm audit --omit=dev`: 0 vulnerabilities;
- commerce Worker dry run: compiled successfully without deploying;
- auth Worker: 4 tests passed, TypeScript check passed, and Wrangler deployment
  dry run compiled with `workers_dev=false` and `preview_urls=false`;
- local auth transport: Wrangler reported `AUTH_HTTP` connected to the local
  `hobfarm-auth` service; an isolated fake D1 user/session returned 200 from
  `/api/auth/me` and `/api/keys`, reached the authenticated Academy, Shop, and
  portal branches, logged out successfully, and then returned 401. The fixture
  was deleted after the check;
- production auth transport: the Pages production deployment continued to
  resolve auth/key and protected-route requests after `AUTH_WORKER_URL` was
  deleted and after the public auth Worker URL was disabled;
- hostname checks: the former auth Worker URL returns Cloudflare error 1042;
  `hobfarm.pages.dev` preserves path and query in a 301 to `hob.farm`; a
  production deployment hash URL remains reachable for explicit QA;
- local Pages runtime: homepage, article, Workshop, RSS, robots, sitemap,
  hashed assets, Markdown negotiation, status, and static snapshot returned
  their expected status and cache policy;
- local failure cases: known probes returned zero-byte 404s, cross-origin
  contact returned 403, oversized contact returned 413, invalid methods
  returned 405, disabled chat returned 404, and an unsigned Stripe webhook
  returned 400;
- headless Chromium desktop, iPhone-sized mobile, and Googlebot-user-agent
  smoke checks returned 200 with rendered main content on the selected public
  routes.

Local runtime checks should use `npm run dev:pages` after a production build.
Exercise:

- `/`, a current article, and `/workshop/`;
- `/_astro/*`, local images, and media;
- `/rss.xml`, `/robots.txt`, `/sitemap.xml`, and `/sitemap-index.xml`;
- `/api/status` and `/api/grimoire/snapshot` cache/privacy headers;
- `/api/contact` GET 405 and a controlled cross-origin POST 403;
- `/api/subscribe` GET 405;
- `/api/chat/conversations` 404 while disabled;
- `/api/stripe/webhook` GET 405 and unsigned POST 400, without using a real
  Stripe event;
- authenticated account, orders, Academy access/progress, checkout, and portal
  flows in a deployed test environment when those providers are available;
- each representative probe path, expecting the source empty 404 locally and
  the edge Block after dashboard rollout.

Do not generate login emails, Stripe sessions, contact mail, model output,
media, or fulfillment work merely to load-test the security rules.

## Post-deployment metrics to watch

Compare the first 24 hours and first seven days with the supplied baseline:

- total HTTP requests versus Pages Function invocations;
- requests and bytes for excluded `_astro`, image, media, RSS, robot, sitemap,
  and static JSON paths;
- custom scanner-rule matches by path, ASN, country, and user agent;
- rate-limit events by path and IP, with known bots excluded;
- known-bot article and sitemap success rates;
- edge 4xx versus origin/application 4xx;
- origin 404 and 405 counts;
- Pages and Worker 5xx responses;
- auth native rate-limit logs and Resend failures;
- Turnstile failures and accepted contact messages;
- Stripe signature failures, webhook handler failures, and checkout spikes;
- D1, KV, queue, and service-binding errors;
- chat/model/media usage, which should remain zero while the features are off.

The desired result is fewer Pages Function invocations and origin-style 404s,
not merely a higher edge 403 count.

## Remaining limitations

- The current Wrangler OAuth token can read the zone and plan but cannot list
  WAF rulesets or security settings. The exact pre-existing rule responsible
  for live PHP/WordPress/`.env` 403s must be identified in Security Events or
  the dashboard before rules are merged.
- The logged-in Cloudflare dashboard was available for the auth transport and
  alternate-host changes. Bot Fight Mode and Browser Integrity Check were not
  changed or reclassified in this migration.
- Zone WAF still does not cover deployment-specific
  `*.hobfarm.pages.dev` URLs. The production Pages hostname now redirects to
  the zone, and the auth Worker's production and preview URLs are disabled.
- StyleFusion, Grimoire, HobBot, CDN, EZIZE, and Access policies belong to
  separate deployments. Their provider budgets and rate controls require
  separate repository/account reviews before being changed.
- Removing `'unsafe-inline'` from CSP requires a focused browser-compatible
  script nonce/hash migration.
- The Academy completion route must be made compatible with the current Pages
  static output before one-time checkout is enabled.
- Free-plan rate limiting cannot express hostname, method, cookie, authenticated
  user, response status, or cost-aware counting.

## Final security state

After the repository changes are deployed, static assets and discovery files
can bypass Pages Functions, known scanner paths receive a small early fallback
404 on direct Pages traffic, public read APIs retain intentional cache policy,
and only the HobFarm session cookie crosses the private Pages-to-auth service
binding. The auth Worker's public and preview URLs are disabled, and the
production Pages hostname redirects into `hob.farm` without capturing preview
deployment hosts. Existing server authorization, Turnstile, Stripe signatures,
HMAC service calls, body/query limits, feature flags, idempotency, encrypted
storage, and private commerce binding remain in place.

After the two dashboard rules are applied, high-confidence exploit and secret
file probes stop at the `hob.farm` edge, and abnormal bursts against sensitive
APIs receive a short per-IP block. Public reading, RSS, sitemaps, static media,
ordinary browsers, and Cloudflare-known crawlers remain outside those controls.
Security Analytics, Security Events, Pages Functions metrics, and Worker logs
then supply the evidence needed for future tuning.
