# Avatar Content System supporter migration plan

## Current state

The Avatar Content System currently has four public setup lessons and 12 paid beta lessons. Active HobFarm supporters receive the paid lessons while their $5 monthly membership is active.

The entitlement is enforced in `functions/api/academy/avatar-content-system/lesson/[[slug]].ts`. It checks the signed-in user, retrieves the user's subscription record, and accepts active subscription states. The membership page and course pages describe the same benefit.

No entitlement behavior changes in this commerce restructure.

## Target state

Academy should sell affordable one-time courses. Avatar Content System can move to that model after existing supporters have a clear transition.

The target needs:

1. A one-time course product and approved price.
2. A durable course entitlement that does not depend on an active subscription.
3. A record of which current and former supporters receive a grandfathered entitlement.
4. Checkout, receipt, refund, and Customer Help copy for the standalone course.
5. A cutover date and a direct notice to affected supporters.

## Proposed migration

1. Export a count of active, trialing, past-due, canceled, and incomplete supporter records without placing personal data in the repository.
2. Decide the grandfathering rule. The recommended rule is permanent Avatar access for anyone with an active paid supporter subscription on the announced cutover date.
3. Create a versioned entitlement such as `academy.avatar-content-system.v1`.
4. Backfill the approved supporters into the entitlement store with an idempotent migration.
5. Add one-time Checkout for new buyers and grant the same entitlement only after verified payment.
6. Update the lesson endpoint to accept either the grandfathered/course entitlement or the temporary active-membership rule.
7. Notify supporters before removing the active-membership rule.
8. Keep a repair script for missing grants and a revocation path limited to refunds, disputes, or confirmed fraud.

## Owner approvals required

- Confirm whether all active supporters or only supporters with at least one successful payment are grandfathered.
- Approve the one-time price: $5, $7, $9, or a bundle price.
- Approve the cutover date and supporter notice.
- Confirm whether membership keeps a different benefit after Avatar access becomes standalone.
- Approve the entitlement migration after reviewing a dry-run count.

## Risks

- Removing the membership check before backfill would lock out current supporters.
- Granting by current status alone may include incomplete or unpaid subscriptions.
- Reusing a subscription identifier as a course entitlement would keep the two products coupled.
- A refund policy change without a versioned purchase record could make later support decisions inconsistent.
