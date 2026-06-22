import { createStripeClient, stripeWebhookCryptoProvider } from "../../../src/lib/stripe-server";
import type Stripe from "stripe";
import {
  fetchAdminJson,
  extractStripeId,
  type AdminSubscriptionUpsert,
  type AdminSubscriptionRecord,
  type SubscriptionStatus,
} from "./internal";

interface Env {
  STRIPE_API_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  AUTH_WORKER_URL: string;
  INTERNAL_ADMIN_HMAC_SECRET: string;
}

const MAX_WEBHOOK_BYTES = 256 * 1024;
const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

function jsonError(error: string, status: number): Response {
  return Response.json({ error }, { status, headers: jsonHeaders });
}

function ok(extra?: Record<string, unknown>): Response {
  return Response.json({ received: true, ...(extra ?? {}) }, { status: 200, headers: jsonHeaders });
}

// Stripe's modern SDK exposes period bounds on each item, not the parent.
// Use the latest item's period_end as the subscription's effective renewal.
function maxItemPeriodEnd(sub: Stripe.Subscription): number | null {
  const ends = sub.items.data
    .map((item) => (item as unknown as { current_period_end?: number }).current_period_end)
    .filter((v): v is number => typeof v === "number");
  return ends.length > 0 ? Math.max(...ends) : null;
}

function buildUpsert(
  sub: Stripe.Subscription,
  userId: string,
  event: Stripe.Event,
): AdminSubscriptionUpsert {
  return {
    user_id: userId,
    stripe_customer_id: extractStripeId(sub.customer)!,
    stripe_subscription_id: sub.id,
    status: sub.status as SubscriptionStatus,
    tier: "supporter",
    current_period_end: maxItemPeriodEnd(sub),
    cancel_at_period_end: sub.cancel_at_period_end ? 1 : 0,
    cancel_at: sub.cancel_at ?? null,
    last_stripe_event_created: event.created,
    last_stripe_event_id: event.id,
  };
}

async function lookupUserByCustomer(
  env: Env,
  customerId: string,
): Promise<string | null> {
  const res = await fetchAdminJson<{ subscription: AdminSubscriptionRecord | null }>(
    env,
    "GET",
    `/api/admin/subscriptions/by-customer/${encodeURIComponent(customerId)}`,
  );
  if (res.status !== 200) return null;
  return res.data?.subscription?.user_id ?? null;
}

async function postUpsert(env: Env, payload: AdminSubscriptionUpsert): Promise<void> {
  const res = await fetchAdminJson<{ ok: boolean }>(
    env,
    "POST",
    "/api/admin/subscriptions/upsert",
    payload,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`auth_admin_upsert_failed status=${res.status}`);
  }
}

// Pull invoice → subscription id from current Stripe SDK shape. The 2026
// shape moved subscription off invoice and onto parent.subscription_details.
function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const parent = (invoice as unknown as {
    parent?: { subscription_details?: { subscription?: string | { id: string } } };
  }).parent;
  const direct = parent?.subscription_details?.subscription;
  return extractStripeId(direct);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return jsonError("Missing Stripe signature", 400);
  }

  if (!env.STRIPE_API_KEY) {
    return jsonError("STRIPE_API_KEY not configured", 500);
  }

  if (!env.STRIPE_WEBHOOK_SECRET) {
    return jsonError("STRIPE_WEBHOOK_SECRET not configured", 500);
  }

  if (!env.AUTH_WORKER_URL || !env.INTERNAL_ADMIN_HMAC_SECRET) {
    return jsonError("Auth worker credentials not configured", 500);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_WEBHOOK_BYTES) {
    return jsonError("Webhook body is too large", 413);
  }

  const payload = await request.text();
  const stripe = createStripeClient(env.STRIPE_API_KEY);

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
      undefined,
      stripeWebhookCryptoProvider,
    );
  } catch (error) {
    console.warn("Stripe webhook signature verification failed", {
      message: error instanceof Error ? error.message : "unknown_error",
    });
    return jsonError("Invalid Stripe signature", 400);
  }

  // For every handled event we resolve to one authoritative Subscription
  // object, derive (user_id, customer_id, sub_id), and post a single upsert.
  // Orphans (no resolvable user) log and 200 to avoid Stripe retry storms.
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") {
          console.log(`[stripe/webhook] skip non-subscription session=${session.id}`);
          return ok({ skipped: "non_subscription_mode" });
        }
        const subId = extractStripeId(session.subscription);
        const customerId = extractStripeId(session.customer);
        if (!subId || !customerId) {
          console.warn(`[stripe/webhook] session_missing_ids event=${event.id} session=${session.id}`);
          return ok({ skipped: "missing_ids" });
        }
        const sub = await stripe.subscriptions.retrieve(subId);
        const userId =
          session.client_reference_id ??
          (sub.metadata?.user_id as string | undefined) ??
          (await lookupUserByCustomer(env, customerId));
        if (!userId) {
          console.warn(
            `[stripe/webhook] orphan_no_user event=${event.id} type=${event.type} customer=${customerId}`,
          );
          return ok({ skipped: "orphan_no_user" });
        }
        await postUpsert(env, buildUpsert(sub, userId, event));
        return ok();
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = extractStripeId(sub.customer);
        if (!customerId) {
          console.warn(`[stripe/webhook] sub_missing_customer event=${event.id}`);
          return ok({ skipped: "missing_customer" });
        }
        const userId =
          (sub.metadata?.user_id as string | undefined) ??
          (await lookupUserByCustomer(env, customerId));
        if (!userId) {
          console.warn(
            `[stripe/webhook] orphan_no_user event=${event.id} type=${event.type} customer=${customerId}`,
          );
          return ok({ skipped: "orphan_no_user" });
        }
        await postUpsert(env, buildUpsert(sub, userId, event));
        return ok();
      }

      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoiceSubscriptionId(invoice);
        const customerId = extractStripeId(invoice.customer);
        if (!subId) {
          // One-off invoices (not tied to a subscription) are not our concern.
          console.log(`[stripe/webhook] skip non-sub invoice event=${event.id}`);
          return ok({ skipped: "no_subscription" });
        }
        const sub = await stripe.subscriptions.retrieve(subId);
        const userId =
          (sub.metadata?.user_id as string | undefined) ??
          (customerId ? await lookupUserByCustomer(env, customerId) : null);
        if (!userId) {
          console.warn(
            `[stripe/webhook] orphan_no_user event=${event.id} type=${event.type} sub=${subId}`,
          );
          return ok({ skipped: "orphan_no_user" });
        }
        await postUpsert(env, buildUpsert(sub, userId, event));
        return ok();
      }

      default:
        console.log(`[stripe/webhook] unhandled event=${event.id} type=${event.type}`);
        return ok({ skipped: "unhandled_type" });
    }
  } catch (error) {
    // Transient: let Stripe retry within the 3-day window.
    console.error(`[stripe/webhook] handler_error event=${event.id} type=${event.type}`, {
      message: error instanceof Error ? error.message : "unknown_error",
    });
    return jsonError("Handler error", 500);
  }
};

export const onRequestGet: PagesFunction = async () => {
  return jsonError("Method not allowed", 405);
};
