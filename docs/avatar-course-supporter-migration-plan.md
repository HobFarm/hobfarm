# Avatar Content System access migration

Updated: 2026-08-06

## Preserved behavior

The Avatar Content System keeps four public lessons and twelve paid lessons. Active and trialing HobFarm supporters retain access throughout the migration. Membership now represents the provider-neutral `academy_all_access` catalog grant, so there is no cutover date when current supporter access is removed.

Scheduled cancellation keeps access while the authoritative subscription status remains active. Lapsed, unpaid, canceled, or otherwise inactive membership does not supply the catalog grant.

## Added behavior

Avatar gains a separate $7 one-time product, `academy_avatar_content_system_v1`. A verified direct payment creates a permanent entitlement to `academy-course-avatar-v1`. That grant survives membership cancellation and is suspended only when the matching purchase is refunded, disputed, revoked, or corrected through the audited support path.

A current supporter may buy the course permanently. The purchase is optional while membership already supplies access, but it remains after membership ends.

## Safe activation order

1. Apply the reviewed Academy D1 migration.
2. Verify the Pages `COMMERCE` service binding and existing auth worker contract.
3. Create and inspect the live Stripe $7 Price without committing its ID.
4. Approve the Stripe Tax and digital-goods tax decision.
5. Configure the Price and required webhook events.
6. Test purchase, duplicate/replayed event, delayed event, refund, dispute, membership lapse, direct-purchase survival, and clean-account access.
7. Run the client/static paid-body leakage audit.
8. Turn on the server checkout switch and then the public purchase control.

## No supporter backfill

No permanent entitlement backfill is required because membership access is not being withdrawn. A future decision to remove Avatar from `academy_all_access` would be a different migration and would require a separately approved grandfathering rule, count, notice, and idempotent backfill.

## Recovery

The commerce ledger stores stable user, purchase, event, and entitlement IDs. Verified webhook replay can repair a successful payment that returned before the grant appeared. Manual corrections require an operator ID, reason, timestamp, and audit record. Customer Help should use the support-visible Academy repair code and provider order ID, never card details.
