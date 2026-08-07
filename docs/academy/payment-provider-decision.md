# Academy payment provider decision

Date: 2026-08-06  
Status: implementation chosen; production activation blocked

## Decision

Use Stripe Checkout Sessions for the first one-time Academy product. Keep the internal purchase and entitlement records provider-neutral. Do not add Lemon Squeezy during this launch.

Stripe already owns HobFarm membership checkout, verified webhooks, customer IDs, and billing management. The site also uses Stripe for direct Shop checkout. A one-time Academy Session can therefore reuse the current account, webhook, and service-binding boundaries without asking one operator to reconcile two new systems.

Lemon Squeezy may reduce digital-goods tax work when it acts as merchant of record, but the repository contains no verified Lemon product, webhook, customer mapping, refund flow, portal flow, or production event. An account alone is not a proven integration.

## Comparison

| Question | Stripe | Lemon Squeezy |
| --- | --- | --- |
| Proven production path | Membership and direct Shop code exist | No implementation evidence in the repository |
| Account identity | Internal user ID already passes through Checkout metadata | Mapping is not designed or tested |
| Webhooks | Raw-body signature verification and retries already exist | Not implemented |
| Billing portal | Existing membership portal | Not implemented |
| Refund/dispute work | Existing event boundary; Academy handling added in this build | Not implemented |
| Digital-goods tax | Requires an approved Stripe Tax and registration decision | Merchant-of-record handling may be useful, but production approval is unverified |
| $5/$7 support burden | One provider and one event log | A second reconciliation and customer-support path |
| Migration risk | Low if tax configuration is approved | Higher before the first course purchase is proven |

Provider fees and tax treatment change outside the repository. They must be checked in the provider dashboards before activation; this record does not invent a fee quote.

## Product contract

- Stable internal product: `academy_avatar_content_system_v1`
- Grant: `academy-course-avatar-v1`
- Price: USD 700 cents before applicable tax
- Provider price: `STRIPE_ACADEMY_AVATAR_PRICE_ID`, supplied through production configuration
- Mode: one-time payment
- Access source: verified webhook only
- Membership grant: separate `academy_all_access` rule from the auth worker

The external Price ID is never committed. The webhook checks surface, mode, user ID, product key, configured Price ID, quantity, unit amount, currency, and payment state before granting access.

## Activation gate

Keep `ACADEMY_ONE_TIME_CHECKOUT_ENABLED` false and the public purchase control hidden until an operator has:

1. created and inspected the live $7 Price;
2. approved Stripe Tax and the applicable registration/remittance policy;
3. configured the Price and webhook events in production;
4. completed the purchase, replay, refund, dispute, membership-cancellation, and clean-account tests;
5. approved the refund-window copy and Customer Help procedure.

If the tax decision does not approve direct Stripe digital sales, stop. Review Lemon Squeezy as a merchant-of-record candidate in a separate provider integration rather than silently enabling Stripe.
