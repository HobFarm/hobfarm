# Academy productization completion report

Date: 2026-08-06  
Repository state: implemented on `main`, uncommitted, not deployed  
Production state: membership access preserved; one-time checkout, Character sales, Ask the Academy, and Sprint applications disabled

## Executive summary

HobFarm now has one shared Academy model for free, permanent-purchase, and active-membership access. It includes typed course and lesson manifests, normalized course routes, compatible legacy routes, server-authorized paid Avatar lessons, account progress, searchable help, unresolved-question records, a provider-neutral commerce ledger, and a Stripe Checkout adapter behind tax and launch kill switches.

Intellectual Self-Defense remains free and unchanged in substance. Avatar retains four public and twelve paid lessons, with current active or trialing supporter access preserved. A $7 permanent purchase path is implemented, but its public control and server creation gate remain off until the operator supplies and verifies the live Price, tax setup, refund procedure, webhook configuration, D1 backup, and deployed test-mode matrix.

Keep the Character has a source map, two public preview lessons, seven paid editorial drafts, a captioned HyperFrames media pilot, and a `review` catalog state. It is deliberately not for sale because the repository does not contain the clean operator walkthrough or exact failed-output correction needed to publish the paid instruction honestly.

Five further Workshop-derived courses are source-mapped and scaffolded as planned work. The provider-route worksheet is a noindex planning scaffold. Ask the Academy remains disabled. The Production System Sprint has a noindex draft offer and manual acceptance model, with no form submission, scheduling, invoice, or payment path.

## Customer paths

### Free course

1. Open `/academy/` and choose Intellectual Self-Defense.
2. Open the public course and any of its nine public lessons without payment.
3. Lesson progress works locally when signed out and can be saved to the account ledger when signed in.
4. Existing Intellectual Self-Defense URLs remain valid.

### Permanent Avatar purchase

The implemented path, after operator activation, is:

1. Open the Avatar course landing page and choose permanent $7 access.
2. Sign in or create a HobFarm account before checkout.
3. Pages reserves a provider-neutral purchase, then creates a one-time Stripe Checkout Session with automatic tax enabled.
4. The signed Stripe webhook verifies the surface, mode, user, stable product key, configured Price, quantity, base amount, currency, and payment state.
5. The commerce worker records the event and creates an independent permanent entitlement.
6. The return page polls the HobFarm ledger. It does not treat the browser redirect as proof of payment.
7. Account shows the purchase, progress, course route, and support-visible repair code.

This path is code-complete but not public. `academyFeatures.oneTimeCheckoutVisible`, `ACADEMY_ONE_TIME_CHECKOUT_ENABLED`, and `ACADEMY_STRIPE_TAX_ENABLED` remain off.

### Membership

1. The customer joins the existing $5 monthly HobFarm membership through its current Stripe flow.
2. The auth worker remains authoritative for subscription status and paid-through state.
3. `active` and `trialing` membership supplies the provider-neutral `academy_all_access` grant for included, available courses.
4. A scheduled cancellation keeps access while the provider still reports the subscription active.
5. Membership-only access ends when the authoritative status is no longer active or trialing. A separate direct course purchase remains.

### Existing Avatar supporter

Existing supporter links and the four-public/twelve-paid lesson split remain. The paid lesson endpoint now accepts either an active direct/manual entitlement or an active/trialing membership. No permanent entitlement backfill or cutover is required because the membership route was not removed.

## Payment provider

Stripe Checkout Sessions is the selected first provider. It already owns HobFarm membership, webhook verification, customer mapping, billing management, and direct-Shop code. Lemon Squeezy has no verified product, webhook, customer map, refund path, or live transaction in this repository. Adding it now would create a second reconciliation and support system before the first course purchase is proven.

The internal tables do not encode Stripe-specific access rules. A later provider can map its own product or price to the same stable product and course grant. See `docs/academy/payment-provider-decision.md`.

## Change list

### Audit, decisions, course records, and operations

- `docs/academy/academy-audit-2026-08.md` — classified repository, auth, billing, binding, content-protection, and recovery findings.
- `docs/academy/payment-provider-decision.md` — Stripe/Lemon Squeezy comparison and initial-provider decision.
- `docs/avatar-course-supporter-migration-plan.md` — preserved supporter behavior, activation order, and recovery.
- `docs/academy/source-maps/avatar-content-system.md` — source, access, volatile-provider, and maintenance map.
- `docs/academy/source-maps/keep-the-character.md` — source boundary and operator gaps for the Character course.
- `docs/academy/source-maps/one-base-two-modes.md` — Cute & Corrupted course evidence and outline.
- `docs/academy/source-maps/lock-the-frame-change-the-world.md` — Before & After course evidence and outline.
- `docs/academy/source-maps/one-identity-two-jobs.md` — Alter Ego course evidence and outline.
- `docs/academy/source-maps/style-is-a-system.md` — style-system course evidence and outline.
- `docs/academy/source-maps/build-a-recurring-host-cast.md` — advanced host-cast course evidence and outline.
- `docs/academy/source-maps/choose-the-tool-for-the-job.md` — free route-tool source boundary and missing provider facts.
- `docs/academy/courses/keep-the-character-draft.md` — two public and seven paid editorial lesson drafts.
- `docs/academy/validation/avatar-content-system.md` — Avatar launch gates and completed leakage evidence.
- `docs/academy/validation/keep-the-character.md` — Character review gate and remaining walkthrough work.
- `docs/academy/payment-access-test-matrix.md` — all 24 requested payment/access cases and the manual account-state matrix.
- `docs/academy/operator-input-required.md` — one consolidated operator decision list.
- `docs/academy/unresolved-question-report.md` — private report query and handling boundary.
- `docs/academy/ask-academy-decision.md` — documented decision to defer assistant code.
- `docs/academy/sprint-application-draft.md` — private-service scope, intake, acceptance, and handoff draft.
- `docs/academy/launch-runbook.md` — configuration, dashboard, migration, rollback, deployment, smoke, and metrics steps.

### Course model and public data

- `src/data/academy-manifest.ts` — typed course, lesson, media, status, access, price, evidence, and five-course scaffold manifests.
- `src/data/academy-features.ts` — checkout, assistant, and Sprint kill switches, all disabled where required.
- `src/data/academy-faq.ts` — searchable Academy questions and support routing.
- `src/data/academy-tool-route.ts` — source-bounded route-tool questions and output shapes.
- `src/data/avatar-course-contract.ts` — shared server/client Avatar lesson types without paid bodies.
- `src/lib/academy-access.mjs` — provider-neutral public, purchase, manual, and membership grant resolver.
- `src/data/academy-courses.ts` — shared adapter for the free and Avatar courses.
- `src/data/avatar-content-system.ts` — clarified $7 permanent versus $5/month access, costs, result, and progress metadata.
- `src/data/avatar-content-system-paid.ts` — moved types to the body-free contract while preserving lesson substance.
- `src/data/character-mannequin.ts` — connected the Workshop proof to the Character course preview.
- `src/content.config.ts` and `.pages.yml` — optional course access, outcome, source, evidence, and learner fields for the content system and CMS.

### Shared interface and routes

- `src/components/academy/AcademyCourseCard.astro` — status-aware catalog card with problem, artifact, tools, cost, timing, preview, price, membership, date, and Workshop proof.
- `src/components/academy/CourseAccessCard.astro` — permanent/membership comparison and launch-aware checkout control.
- `src/components/academy/PaidLessonView.tsx` — signed-out, denied, authorized, retry, progress, and help states without client-bundled bodies.
- `src/components/academy/LessonProgress.tsx` — local/free progress, signed-in sync, monotonic completion, next step, and completion events.
- `src/components/academy/CheckoutCompletion.tsx` and `CheckoutNotice.tsx` — verified-entitlement polling and canceled/not-active notices.
- `src/components/academy/AcademyHelp.tsx` — FAQ search and signed-in unresolved-question submission.
- `src/components/academy/WorkshopCourseBridge.astro` — compact public-proof-to-course bridge.
- `src/components/auth/AccountAcademyCard.tsx` — purchased, membership-included, free, progress, history, billing, help, and repair-code account view.
- `src/pages/academy/index.astro`, `index.md.ts`, and `llms.txt.ts` — rebuilt public catalog and public-only agent-readable summaries.
- `src/pages/academy/courses/[courseSlug]/index.astro` and `[lessonSlug].astro` — normalized course and lesson routes with review/noindex gates.
- `src/pages/academy/checkout/complete.astro` — dynamic checkout-return page that preserves the Session query.
- `src/pages/academy/help.astro` — Academy-specific help route.
- `src/pages/academy/choose-the-tool-for-the-job.astro` — noindex provider-neutral route worksheet scaffold.
- `src/pages/academy/production-system-sprint.astro` — noindex closed application draft.
- Existing Intellectual Self-Defense, Avatar landing, free, map, and lesson routes — shared progress/access integration and legacy compatibility without substance changes.
- `src/pages/account.astro` — Academy account section.

### Protected APIs, payment, and commerce

- `functions/api/academy/internal.ts` — auth/commerce/membership composition, private response headers, and non-secret repair codes.
- `functions/api/academy/courses/[[path]].ts` — server authorization before importing and returning an available paid lesson body.
- `functions/api/academy/avatar-content-system/lesson/[[slug]].ts` — legacy endpoint compatibility through the same purchase-or-membership rule.
- `functions/api/academy/access.ts` — account courses, progress, purchase history, membership, and continuation state.
- `functions/api/academy/progress.ts` — validated public/paid progress reads and writes.
- `functions/api/academy/questions.ts` — signed-in structured question submission.
- `functions/api/academy/checkout.ts` — account-first Stripe Session creation, stable reservation, tax and launch gates, and provider-neutral metadata.
- `functions/api/academy/checkout-status.ts` — user-owned ledger polling after return.
- `functions/api/stripe/webhook.ts` — verified Academy payment, async failure, expiry, refund, and dispute handling while preserving existing Shop and membership paths.
- `workers/commerce/migrations/0002_academy.sql` — additive course, lesson, product, provider price, grant, purchase, entitlement, event, progress, question, aggregate view, and correction schema.
- `workers/commerce/src/academy.ts` — active-product reservations, idempotent/out-of-order events, payment-state changes, access, progress, question limits, and audited manual corrections.
- `workers/commerce/src/index.ts` — private service-binding routes for the Academy ledger.
- `workers/commerce/wrangler.academy-test.toml` — zero-ID local D1 validation configuration, not a deployment file.
- `workers/commerce/README.md` — Academy route and migration notes.

### Workshop, membership, policy, media, and validation

- Character / Mannequin, Avatar & Host, Before & After, StyleFusion, Cute & Corrupted, and Alter Ego Workshop routes — matching compact Academy bridges.
- `src/components/membership/OnboardingView.tsx` — catalog-wide access explanation without turning permanent purchases into subscriptions.
- `src/content/legal/privacy.md` — Academy entitlement, progress, and question data disclosure.
- `src/content/legal/refunds.md` — separate permanent-course and membership treatment without inventing a refund window.
- `public/media/workshop/character-mannequin/mannequin-workflow-film-captions.vtt` — captions for the reused 16-second HyperFrames workflow film.
- `scripts/audit-academy-paid-content.mjs` and the `audit:academy-paid` package script — static/client paid-body canary scan.
- `tests/academy-platform.test.mjs` and `tests/commerce-restructure.test.mjs` — access, checkout, event, leakage, feature-gate, and legacy contract assertions.
- `e2e/academy.spec.ts` — catalog, Character preview, locked Avatar, checkout return, account access, and mobile browser states.
- `reports/academy-qa/*.png` — requested browser screenshots with synthetic account/payment identifiers only.

## Database migration and rollback

`workers/commerce/migrations/0002_academy.sql` is additive. A fresh local D1 application produced three course rows, two draft product rows, and no foreign-key errors. Both products remain `draft`, so applying the schema alone cannot start checkout.

Before a remote migration, verify the production `COMMERCE_DB` ID, make a dated backup, and prove the backup is readable. Apply the migration once, inspect the seeds, and leave Avatar draft until test-mode checkout passes. Keep Character draft.

The first rollback is to disable `ACADEMY_ONE_TIME_CHECKOUT_ENABLED` and hide the public control. Leave the additive tables and event history intact. Restore the previous worker only if its private route contract is incompatible. Do not drop tables as a routine rollback and do not delete purchase, entitlement, progress, or audit history.

No remote migration, database mutation, Cloudflare configuration change, deployment, commit, or push was performed.

## Environment and dashboard work

New configuration names, without values:

- `STRIPE_ACADEMY_AVATAR_PRICE_ID`
- `ACADEMY_STRIPE_TAX_ENABLED`
- `ACADEMY_ONE_TIME_CHECKOUT_ENABLED`

The existing `AUTH`/auth URL contract, `INTERNAL_ADMIN_HMAC_SECRET`, `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`, `COMMERCE`, and worker-side `COMMERCE_DB` remain required.

The operator still needs to confirm the live Stripe account is approved for direct digital-course sales; approve tax registrations and Stripe Tax regions; create the one-time USD $7 Price; add the required Checkout, refund, dispute, subscription, and invoice events to the signed webhook; verify the customer portal still handles membership only; and run the complete Stripe test-mode matrix. Exact steps and order are in `docs/academy/launch-runbook.md`.

## Validation results

- `npx astro check` — passed; 571 files, 0 errors, 0 warnings, 0 hints.
- `npx tsc -p workers/commerce/tsconfig.json --noEmit` — passed.
- `node --test tests/academy-platform.test.mjs tests/commerce-restructure.test.mjs` — 12/12 passed.
- `npm run build` — passed; production server and static output completed.
- `npm run audit:academy-paid` — passed; 884 client/static files scanned and all three paid Avatar canaries absent.
- Local D1 migration validation — passed on fresh local state; three courses, two products, zero foreign-key errors. A separate expired-purchase fixture also passed without foreign-key errors.
- `npx playwright test e2e/academy.spec.ts --reporter=line` — 2 relevant project tests passed; 2 duplicate project/test combinations intentionally skipped.
- `npm test` — 244/247 passed. All Academy tests pass. The three failures existed in the audit baseline and concern article share controls, PsyGoth media durability, and homepage hero assertions.
- Live signed-out request to `/api/academy/avatar-content-system/lesson/create-the-starter-source-file` — `401`, JSON, `Cache-Control: no-store`, zero paid canaries.

The repository has no separate lint, link-check, or automated axe command. Astro diagnostics, the production build, semantic browser assertions, keyboard-capable native controls, caption-track assertion, responsive screenshots, and route navigation cover the local release check. A deployed accessibility/link crawl remains useful before public activation. The existing `npm run dev` harness currently fails independently with `module is not defined`; final visual QA used the successful production build and `npm run preview`.

## Browser routes and states checked

- `/academy/` — signed-out desktop catalog.
- `/academy/courses/keep-the-character/` — source-backed preview, caption track, and not-for-sale gate.
- `/academy/avatar-content-system/course/create-the-starter-source-file/` — signed-out locked state through a controlled unauthorized API fixture; no progress control appears before access.
- `/academy/checkout/complete/?session_id=...` — controlled verified-ledger return state.
- `/account/` — controlled active-member plus direct-purchaser state with progress, purchase history, billing, help, and repair references.
- `/academy/avatar-content-system/course/what-you-are-building/` — narrow mobile public lesson and progress control.
- Live paid lesson API — signed-out unauthorized response and cache boundary.

Mocked API states prove the page behavior, not a live Stripe transaction. The real free account, existing supporter, direct purchaser, combined purchaser/member, paid-through cancellation, lapse, refund, manual grant, and second-browser states remain explicit deployed test-mode gates in `docs/academy/payment-access-test-matrix.md`.

## Screenshots

- [Academy catalog](../../reports/academy-qa/academy-catalog.png)
- [Character course preview](../../reports/academy-qa/character-course-preview.png)
- [Locked Avatar preview](../../reports/academy-qa/avatar-locked-preview.png)
- [Verified checkout return](../../reports/academy-qa/checkout-return-verified.png)
- [Account Academy access](../../reports/academy-qa/account-academy-access.png)
- [Mobile Avatar lesson](../../reports/academy-qa/mobile-avatar-lesson.png)

## Course status

Available now:

- Intellectual Self-Defense for Ordinary People — free, nine public lessons.
- Avatar Content System Starter Kit — four public lessons and twelve paid lessons available through current membership. Permanent $7 purchase code exists but remains intentionally disabled until launch gates pass.

Preview/review:

- Keep the Character — two public previews, seven paid editorial drafts, media pilot, not for sale, paid bodies unpublished.

Planned:

- One Base, Two Modes — Cute & Corrupted — proposed $5.
- Lock the Frame, Change the World — Before & After — proposed $7.
- One Identity, Two Jobs — Alter Ego — proposed $5.
- Style Is a System, Not a Prompt — proposed $7.
- Build a Recurring Host Cast — proposed $7.
- Choose the Tool for the Job — planned free route worksheet, noindex until facts are approved.

The proposed prices are manifest/catalog planning values, not live provider Prices or offers. The Sprint is a closed noindex draft. Ask the Academy is disabled.

## Operator input required

### Avatar checkout and production data

- Approve Stripe as the direct digital-course seller and the applicable legal/tax path.
- Create and verify the one-time live USD $7 Price and provide its ID through configuration.
- Confirm Stripe Tax registrations, regions, and checkout behavior.
- Approve the permanent-course refund window and Customer Help procedure.
- Configure and verify all required signed webhook events.
- Verify the Pages auth and commerce service bindings in the Cloudflare dashboard.
- Back up `COMMERCE_DB`, prove the backup readable, then approve the additive remote migration.
- Complete test-mode purchase, delay, duplicate/replay, expiry, refund, dispute, membership, repair, and second-browser checks.
- Approve the live Price mapping and one controlled live purchase/refund rehearsal before exposing the button.
- Confirm the dated ChatGPT, ElevenLabs, HeyGen, and Meta interface notes during a clean-account course run.
- Approve any future Avatar module-transition media before it enters the media manifest.

### Keep the Character

- Complete the course with a clean account and empty project folder without undocumented knowledge.
- Record the exact HobFarm failed output and correction; do not substitute an invented prompt or setting.
- Approve the identity-lock example, final production board, provider/date callouts, captions, and rights records.
- Produce every promised artifact and close every pending row in the validation record.
- Verify the eventual Price mapping, access, refund, support, paid-media, and clean-account boundaries before changing `review` to `available`.

### Planned courses and route tool

- Complete a real operator walkthrough for each source map.
- Replace every `OPERATOR_INPUT_REQUIRED` exercise, checkpoint, prompt, setting, and correction with observed evidence.
- Approve the first route-tool output categories, dated provider facts, saved-state decision, and a real HobFarm route test.

### Production System Sprint

- Choose availability and dates, application handling, scope acceptance, cancellation/refund terms, recording consent, delivery window, clarification window, and preparation requirements.
- Keep submission, scheduling, invoicing, and payment disabled until those decisions are recorded.
- `academy_sprint_application_submit` remains intentionally dormant because there is no active submission path.

## Volatile provider details

- Stripe server API version `2026-04-22.dahlia`, observed in repository configuration on 2026-08-06.
- Stripe Price IDs, fees, tax behavior, registrations, dashboard event delivery, and customer portal behavior require dashboard verification at activation; no fee claim is made.
- ChatGPT web Projects, personalization/custom-instruction, chat, and optional voice surfaces — instruction record reviewed 2026-08-06; no build number claimed.
- ElevenLabs web voice-generation surface — instruction record reviewed 2026-08-06; no model or voice version prescribed.
- HeyGen web avatar-video surface — instruction record reviewed 2026-08-06; no avatar model version prescribed.
- Meta Business Suite web scheduling surface — instruction record reviewed 2026-08-06; button labels and account availability may vary.
- HyperFrames media pilot version `0.7.80`, recorded and verified 2026-08-06.

The date records review of the repository instruction, not a promise that every provider account sees the same interface.

## Remaining risks

- Direct digital-sales tax and refund policy are operator decisions, not repository facts.
- A wrong live Price or missing webhook event could accept payment without a timely grant. Server verification, polling, event replay, ledger history, and kill switches reduce but do not replace the live rehearsal.
- A remote D1 migration without a verified backup would weaken recovery.
- Character paid instruction could become misleading if published before the operator supplies the real correction and walkthrough.
- Existing supporter preservation still needs a deployed check against the real auth and service bindings.
- Paid lesson text is protected from ordinary static leakage, but screenshots and manual copying cannot be prevented and heavy DRM was intentionally not added.
- The current repo-wide dev harness failure, three unrelated structural test failures, and lack of a dedicated automated link/accessibility crawler remain outside this Academy change.

## Deployment, smoke test, and first 30 days

Use the sequence in `docs/academy/launch-runbook.md`: approve content and policy, back up and migrate D1, deploy the private commerce worker with checkout off, deploy Pages with the public control off, verify existing supporters, configure test mode, exercise the full state matrix, run one controlled live rehearsal, then expose the Avatar purchase control. Keep Character, Ask the Academy, and Sprint applications closed.

After deployment, smoke-test signed-out public and locked routes, an existing supporter, a new direct purchaser in a second browser, combined membership and purchase, membership cancellation, refund/dispute, Account progress, Customer Help, private/no-store responses, and a fresh artifact leakage scan.

For the first 30 days, review Workshop-to-Academy opens, catalog and preview starts, checkout starts/completions, membership starts, first paid-lesson opens, lesson/course completion, access denials, repeated questions by lesson and category, billing-versus-content support, permanent-purchase-versus-membership choice, refunds, disputes, and membership cancellations. Keep question text, lesson answers, emails, payment details, repair codes, and raw provider data out of analytics.
