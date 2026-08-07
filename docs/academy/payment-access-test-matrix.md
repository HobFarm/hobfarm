# Academy payment and access test matrix

Updated: 2026-08-06  
Production checkout: disabled

`AUTOMATED_CONTRACT` means a repository test or enforced code contract covers the state. `BROWSER_FIXTURE` means Playwright exercised the rendered state with a controlled API response. `LIVE_OBSERVED` means a signed-out request was checked against `hob.farm`. `DEPLOYED_TEST_REQUIRED` marks a state that cannot be claimed from local fixtures because it needs the real auth, Stripe test-mode, service binding, and migrated D1 database.

| # | Case | Current evidence | Expected result before launch |
| --- | --- | --- | --- |
| 1 | Successful one-time purchase | `AUTOMATED_CONTRACT`, `BROWSER_FIXTURE`, `DEPLOYED_TEST_REQUIRED` | A verified paid Checkout event creates one paid purchase and an active permanent course grant; the return page waits for that ledger state. |
| 2 | Successful new membership | Existing membership checkout/webhook contract; `DEPLOYED_TEST_REQUIRED` for the Academy catalog grant | Auth reports `active` or `trialing`; included available courses open without a direct grant. |
| 3 | Existing supporter opens Avatar | `AUTOMATED_CONTRACT`; `DEPLOYED_TEST_REQUIRED` with an existing supporter | Existing `active` or `trialing` state grants Avatar access without backfill or a new purchase. |
| 4 | Abandoned checkout | `AUTOMATED_CONTRACT` | Reservation remains `checkout_pending` until a verified failure/expiry event; no entitlement is created. |
| 5 | Duplicate webhook | `AUTOMATED_CONTRACT` | The provider/event primary key makes replay idempotent and does not duplicate a purchase or entitlement. |
| 6 | Delayed webhook after return | `AUTOMATED_CONTRACT`, `BROWSER_FIXTURE` | The return page says the redirect is not a grant and polls until the purchase ledger reports paid. |
| 7 | Out-of-order webhook | `AUTOMATED_CONTRACT` | Older events are recorded as `ignored_stale`; a same-time paid event cannot overwrite a terminal refund, dispute, or revocation. |
| 8 | Invalid webhook signature | Existing raw-body Stripe verification; `DEPLOYED_TEST_REQUIRED` | Request is rejected before any Academy ledger write. |
| 9 | Wrong provider Price | `AUTOMATED_CONTRACT` | Webhook verification fails if the expanded line-item Price differs from configured Academy Price. |
| 10 | Wrong amount or currency | `AUTOMATED_CONTRACT` | Reservation and webhook checks reject anything other than the active product's 700 USD base amount. |
| 11 | Failed membership renewal | Existing authoritative subscription contract; `AUTOMATED_CONTRACT` for inactive access | A status outside `active` or `trialing` supplies no membership grant; an independent direct grant remains. |
| 12 | Cancellation at period end | Existing auth contract; `DEPLOYED_TEST_REQUIRED` | Access remains while the provider still reports the subscription active through its paid-through date. |
| 13 | Immediate cancellation | `AUTOMATED_CONTRACT` for inactive status; provider behavior `DEPLOYED_TEST_REQUIRED` | Membership-only access ends when authoritative status becomes inactive; direct access remains. |
| 14 | Refund | `AUTOMATED_CONTRACT`; `DEPLOYED_TEST_REQUIRED` | Matching purchase becomes refunded and only its purchase entitlement is suspended. |
| 15 | Chargeback or dispute | `AUTOMATED_CONTRACT`; `DEPLOYED_TEST_REQUIRED` | Direct grant is suspended while disputed; a later provider `won` state may reactivate it if it is newest. |
| 16 | Account email mismatch | `AUTOMATED_CONTRACT` | Checkout and webhook use the stable internal user ID in metadata and `client_reference_id`; email alone never grants access. |
| 17 | Purchase while already a member | `AUTOMATED_CONTRACT`, `BROWSER_FIXTURE` for combined account explanation | Direct purchase is optional, becomes its own permanent grant, and is shown separately from membership. |
| 18 | Membership lapse with direct purchase | `AUTOMATED_CONTRACT` | Purchase source wins independently and keeps the course open. |
| 19 | Expired or invalid login session | `AUTOMATED_CONTRACT`, `LIVE_OBSERVED` signed out | Protected lesson and progress endpoints return a locked `401` response with no body. |
| 20 | Manual support grant and revocation | `AUTOMATED_CONTRACT`; `DEPLOYED_TEST_REQUIRED` | Internal-only correction requires operator ID, reason, timestamp, and an audit row. |
| 21 | Replayed provider event | `AUTOMATED_CONTRACT` | The event is reported as duplicate and changes no grant twice. |
| 22 | Course removed from membership, direct purchase retained | `AUTOMATED_CONTRACT` | `membershipIncluded=false` suppresses only membership access; active purchase or manual access remains. |
| 23 | Clean-account access from a second browser | `DEPLOYED_TEST_REQUIRED` | A new signed-in browser resolves the server grant and opens the lesson without relying on local storage. |
| 24 | Unauthorized paid lesson or media request | `AUTOMATED_CONTRACT`, `BROWSER_FIXTURE`, `LIVE_OBSERVED` | The response is private/no-store, contains preview and help routes only, and never emits paid body or paid media. |

## Manual browser matrix

| State | Checked now | Remaining production check |
| --- | --- | --- |
| Signed out | Public catalog, Character preview, Avatar locked lesson, and live API denial | Recheck after deployment. |
| Free account | Account and public lesson behavior covered by component/API contracts | Use a real clean account after deployment. |
| Active member | Combined account/lesson state covered with a browser fixture | Verify one existing supporter against production auth and commerce bindings. |
| Direct purchaser | Account and checkout completion covered with browser fixtures | Complete a Stripe test-mode purchase and open the lesson in a second browser. |
| Purchaser plus active member | Account fixture shows both paths | Cancel the membership in test mode and confirm direct access remains. |
| Canceled member inside paid-through period | Contract documented | Verify the actual auth status and date returned by the production provider. |
| Lapsed member | Access resolver unit case | Verify a real test subscription transition. |
| Refunded purchaser | Ledger/webhook contract | Run a Stripe test refund and confirm the lesson and Account state. |
| Manually granted account | Internal correction contract | Run an audited grant and revocation after the migration. |
| Mobile browser | Public Avatar lesson checked in mobile Chromium | Repeat paid/member checks on a physical or remote mobile browser if needed. |
| Desktop and second private session | Desktop public, locked, checkout-return, and account states checked | Use the real purchased account in an incognito browser after deployment. |

The test-mode rows are launch gates, not optional polish. Do not replace them with mocked screenshots in the production checklist.
