# Direct commerce runbook

## Current launch state

The HobFarm product page and cart are staged. Checkout, Printful draft creation, and Printful confirmation are disabled independently.

The code path now covers:

- Server-priced carts and the $49 free-shipping threshold.
- A D1 order ledger created before Stripe Checkout opens.
- Stripe Checkout Sessions for one-time physical purchases.
- Stripe webhook handling for paid, failed, delayed, and refunded payments.
- Encrypted shipping details in the commerce ledger.
- Printful v2 draft creation from the verified catalog variants and durable artwork.
- A provider cost ceiling before confirmation.
- Queue retries and periodic Printful status reconciliation.
- Account and return-page order status.

No Printful order was created while this system was built. The fulfillment rehearsal uses fixture responses.

## Stripe webhook state

The existing Stripe test-mode destination at `/api/stripe/webhook` was verified
on July 23, 2026. It is enabled for the completed, delayed-payment, failed-payment,
and refund events handled by the commerce code. Confirm the same event set on
the live-mode destination before launch.

## Tax decision

Checkout requires one explicit setting:

```text
DIRECT_SHOP_TAX_MODE=stripe-tax
```

or:

```text
DIRECT_SHOP_TAX_MODE=not-collecting
```

Use `stripe-tax` after the business has identified its registration obligations and added applicable registrations in Stripe. The hat uses Stripe product tax code `txcd_30060006` for hats. Stripe Tax Basic currently charges 0.5% on completed Checkout transactions in locations where the business is registered; abandoned Checkout Sessions do not incur that calculation fee.

Use `not-collecting` only after confirming that choice with a tax professional. The setting exists to make the business decision visible. Checkout refuses to open when the setting is missing.

References:

- [Stripe Tax registration guidance](https://docs.stripe.com/tax/registering)
- [Stripe Tax pricing](https://stripe.com/tax/pricing)
- [Stripe Tax with Checkout](https://docs.stripe.com/tax/checkout)
- [Stripe product tax codes](https://docs.stripe.com/tax/tax-codes?type=physical)

## Required production bindings

The Pages project needs:

```text
COMMERCE                         service binding to hobfarm-commerce
DIRECT_SHOP_CHECKOUT_ENABLED    false until launch
DIRECT_SHOP_TAX_MODE             stripe-tax or not-collecting
```

The commerce Worker needs:

```text
COMMERCE_DB                      D1 database
FULFILLMENT_QUEUE                queue producer and consumer
COMMERCE_DATA_KEY                base64-encoded 32-byte secret
PRINTFUL_API_TOKEN               Secrets Store binding named printful
FULFILLMENT_EXECUTION_ENABLED    false until payment rehearsal passes
PRINTFUL_DRAFT_CREATION_ENABLED  false until sample approval
PRINTFUL_CONFIRMATION_ENABLED    false until final launch
PRINTFUL_MAX_ORDER_COST_AMOUNT   maximum provider charge in cents
```

Apply `workers/commerce/migrations/0001_orders.sql` to the commerce D1 database before binding the Worker.
The Worker configuration schedules reconciliation every 15 minutes. Create the
`FULFILLMENT_QUEUE` producer and consumer bindings before deploying that trigger.

## Safe deployment order

1. Create D1 and the fulfillment queue.
2. Apply the ledger migration.
3. Add `COMMERCE_DATA_KEY`.
4. Deploy the commerce Worker with all mutation flags false.
5. Bind the Pages project to the Worker as `COMMERCE`.
6. Deploy the Pages project with direct checkout false.
7. Confirm the existing Stripe webhook endpoint sends `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `refund.created`, `refund.updated`, and `refund.failed`.
8. Set the tax mode.
9. Run one Stripe test-mode Checkout and verify the order appears in the ledger. Keep Printful execution false.
10. Approve the physical sample.
11. Set a conservative provider cost ceiling, then enable execution and draft creation. Keep confirmation false and inspect the first draft.
12. Enable confirmation only after the draft contents and calculated Printful charge match the order.
13. Change the product status and checkout gates together.

## Repair rules

- A Stripe event is idempotent by event ID.
- An order is idempotent by account and checkout token.
- Stripe totals must match the stored cart before an order becomes paid.
- Printful uses the HobFarm order ID as its external ID, so retries first look for an existing provider order.
- A refund updates the ledger by PaymentIntent ID.
- Failed provider calls record a sanitized error code and retry through the queue.
- Address or cancellation requests go through Customer Help. Never confirm a replacement or cancellation from an unverified public request.

## Rollback

Set these values to false:

```text
DIRECT_SHOP_CHECKOUT_ENABLED=false
FULFILLMENT_EXECUTION_ENABLED=false
PRINTFUL_DRAFT_CREATION_ENABLED=false
PRINTFUL_CONFIRMATION_ENABLED=false
```

Disabling checkout stops new sessions. Disabling execution stops new queue work. Existing Stripe payments and provider orders still need manual review in their dashboards.
