# HobFarm commerce Worker

This is the server-side boundary for direct HobFarm physical goods and Academy account state. It is not deployed by the website build.

The Worker owns the trusted catalog, order ledger, encrypted fulfillment address, Printful v2 draft builder, queue consumer, and provider reconciliation. It also keeps the read-only Printful inspection routes used to verify the Melting Rabbit Hole Dad Hat. The Worker has no public route and `workers_dev` is disabled; Pages Functions reach it through a service binding named `COMMERCE`.

The direct-order D1 schema is in `migrations/0001_orders.sql`. Academy products, purchases, permanent entitlements, progress, and unresolved questions are in `migrations/0002_academy.sql`. Production also needs a D1 binding named `COMMERCE_DB`, a queue binding named `FULFILLMENT_QUEUE`, and a base64-encoded 32-byte secret named `COMMERCE_DATA_KEY`.

The Academy tables do not copy email addresses or subscription records. Pages resolves the stable auth user ID, asks this worker for direct grants and progress, and asks the auth worker for the current membership grant. The internal Academy routes remain reachable only through the Pages `COMMERCE` service binding.

Do not apply `0002_academy.sql` remotely as part of an ordinary site build. After review, apply it through the established D1 migration procedure, then verify the Pages service binding before turning on any public one-time checkout control.

`wrangler.academy-test.toml` contains only a zero-ID local D1 binding for migration validation. It is not a deployment configuration and must never receive a production database ID.

All provider mutations default to off:

- `FULFILLMENT_EXECUTION_ENABLED=false`
- `PRINTFUL_DRAFT_CREATION_ENABLED=false`
- `PRINTFUL_CONFIRMATION_ENABLED=false`
- `PRINTFUL_MAX_ORDER_COST_AMOUNT=0`

Confirmation cannot run unless execution, draft creation, confirmation, and a nonzero provider cost ceiling are configured. The test suite rehearses the full v2 draft and confirmation sequence with a mocked client. It does not call the Printful order API.

The catalog keeps the hat launch disabled until the sample is approved and one real Stripe test payment reconciles through the deployed ledger. Deployment and remote Cloudflare resource creation are separate operations.
