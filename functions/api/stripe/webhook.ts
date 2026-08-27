import { createStripeClient, stripeWebhookCryptoProvider } from "../../../src/lib/stripe-server";
import type { AuthHttpService } from "../../../src/lib/auth-service.ts";
import type Stripe from "stripe";
import {
  fetchAdminJson,
  extractStripeId,
  type AdminSubscriptionUpsert,
  type AdminSubscriptionRecord,
  type SubscriptionStatus,
} from "./internal";
import {
  fetchCommerceJson,
  type CommerceServiceEnv,
} from "../shop/internal";
import { isBodyTooLargeError, readTextBodyLimited } from "../request-body";

interface Env extends CommerceServiceEnv {
  STRIPE_API_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  AUTH_HTTP: AuthHttpService;
  INTERNAL_ADMIN_HMAC_SECRET: string;
  STRIPE_CREATIVE_MEMBERSHIP_PRICE_ID: string;
  STRIPE_ACADEMY_AVATAR_PRICE_ID?: string;
  ACADEMY_ONE_TIME_CHECKOUT_ENABLED?: string;
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

function isConfiguredMembership(sub: Stripe.Subscription, env: Env): boolean {
  if (!env.STRIPE_CREATIVE_MEMBERSHIP_PRICE_ID) return false;
  return sub.items.data.length === 1 &&
    sub.items.data[0]?.price?.id === env.STRIPE_CREATIVE_MEMBERSHIP_PRICE_ID &&
    sub.items.data[0]?.quantity === 1;
}

function requireConfiguredMembership(sub: Stripe.Subscription, env: Env): void {
  if (!isConfiguredMembership(sub, env)) {
    throw new Error("membership_subscription_verification_failed");
  }
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

function isDirectShopSession(session: Stripe.Checkout.Session): boolean {
  return (
    session.mode === "payment" &&
    session.metadata?.surface === "hobfarm-direct-shop"
  );
}

function isAcademySession(session: Stripe.Checkout.Session): boolean {
  return session.mode === "payment" && session.metadata?.surface === "hobfarm-academy";
}

const academyProducts = {
  academy_avatar_content_system_v1: {
    amount: 700,
    currency: "usd",
    priceEnv: "STRIPE_ACADEMY_AVATAR_PRICE_ID",
  },
} as const;

async function postAcademyPayment(
  env: Env,
  stripe: Stripe,
  event: Stripe.Event,
  session: Stripe.Checkout.Session,
): Promise<{ skipped?: string }> {
  if (!isAcademySession(session)) return { skipped: "other_payment_session" };
  if (session.payment_status !== "paid") return { skipped: "payment_not_paid" };
  if (!env.COMMERCE) throw new Error("commerce_service_not_configured");
  const full = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items.data.price"],
  });
  const productKey = full.metadata?.product_key;
  const product = productKey && Object.hasOwn(academyProducts, productKey)
    ? academyProducts[productKey as keyof typeof academyProducts]
    : null;
  const line = full.line_items?.data[0];
  const price = line?.price;
  const priceId = typeof price === "string" ? price : price?.id;
  const configuredPrice = product ? env[product.priceEnv] : null;
  const userId = full.client_reference_id;
  const paymentIntentId = extractStripeId(full.payment_intent);
  if (
    !product ||
    !configuredPrice ||
    priceId !== configuredPrice ||
    line?.quantity !== 1 ||
    line?.amount_subtotal !== product.amount ||
    full.currency !== product.currency ||
    full.metadata?.expected_amount !== String(product.amount) ||
    full.metadata?.expected_currency !== product.currency.toUpperCase() ||
    full.metadata?.user_id !== userId ||
    !userId ||
    !paymentIntentId
  ) {
    throw new Error("academy_checkout_verification_failed");
  }
  const response = await fetchCommerceJson<{ duplicate?: boolean; error?: string }>(
    env,
    "POST",
    "/internal/academy/stripe/paid",
    {
      eventId: event.id,
      eventType: event.type,
      eventCreated: event.created,
      providerOrderId: full.id,
      providerPaymentId: paymentIntentId,
      providerCustomerId: extractStripeId(full.customer),
      userId,
      productKey,
      amount: product.amount,
      currency: product.currency.toUpperCase(),
    },
  );
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`academy_paid_record_failed status=${response.status} code=${response.data?.error ?? "unknown"}`);
  }
  return {};
}

async function postAcademyPaymentState(
  env: Env,
  event: Stripe.Event,
  paymentIntentId: string,
  status: "paid" | "refunded" | "disputed",
): Promise<{ matched: boolean }> {
  if (!env.COMMERCE) throw new Error("commerce_service_not_configured");
  const response = await fetchCommerceJson<{ matched?: boolean; error?: string }>(
    env,
    "POST",
    "/internal/academy/stripe/payment-state",
    {
      eventId: event.id,
      eventType: event.type,
      eventCreated: event.created,
      providerPaymentId: paymentIntentId,
      status,
    },
  );
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`academy_payment_state_failed status=${response.status} code=${response.data?.error ?? "unknown"}`);
  }
  return { matched: response.data?.matched === true };
}

async function postAcademyCheckoutFailure(
  env: Env,
  event: Stripe.Event,
  session: Stripe.Checkout.Session,
  status: "failed" | "expired",
): Promise<{ matched: boolean }> {
  if (!env.COMMERCE) throw new Error("commerce_service_not_configured");
  const response = await fetchCommerceJson<{ matched?: boolean; error?: string }>(
    env,
    "POST",
    "/internal/academy/stripe/checkout-failed",
    {
      eventId: event.id,
      eventType: event.type,
      eventCreated: event.created,
      providerOrderId: session.id,
      status,
    },
  );
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`academy_checkout_failure_record_failed status=${response.status} code=${response.data?.error ?? "unknown"}`);
  }
  return { matched: response.data?.matched === true };
}

async function postDirectPayment(
  env: Env,
  stripe: Stripe,
  event: Stripe.Event,
  session: Stripe.Checkout.Session,
): Promise<{ skipped?: string }> {
  if (!isDirectShopSession(session)) return { skipped: "other_payment_session" };
  if (session.payment_status !== "paid") {
    return { skipped: "payment_not_paid" };
  }
  const full = await stripe.checkout.sessions.retrieve(session.id);
  const shipping = full.collected_information?.shipping_details;
  const address = shipping?.address;
  const paymentIntentId = extractStripeId(full.payment_intent);
  const orderId = full.client_reference_id;
  const email = full.customer_details?.email ?? full.customer_email;
  if (
    !env.COMMERCE ||
    !shipping ||
    !address ||
    !paymentIntentId ||
    !orderId ||
    !email ||
    !full.currency ||
    typeof full.amount_subtotal !== "number" ||
    typeof full.amount_total !== "number"
  ) {
    throw new Error("direct_checkout_missing_required_fields");
  }

  const response = await fetchCommerceJson<{ duplicate?: boolean; error?: string }>(
    env,
    "POST",
    "/internal/stripe/paid",
    {
      eventId: event.id,
      eventType: event.type,
      eventCreated: event.created,
      orderId,
      stripeSessionId: full.id,
      paymentIntentId,
      stripeCustomerId: extractStripeId(full.customer),
      currency: full.currency,
      cartFingerprint: full.metadata?.cart,
      catalogRevision: full.metadata?.catalog_revision,
      merchandiseSubtotalAmount: full.amount_subtotal,
      shippingAmount: full.total_details?.amount_shipping ?? 0,
      taxAmount: full.total_details?.amount_tax ?? 0,
      totalAmount: full.amount_total,
      recipient: {
        name: shipping.name,
        company: null,
        address1: address.line1,
        address2: address.line2,
        city: address.city,
        stateCode: address.state,
        countryCode: address.country,
        postalCode: address.postal_code,
        email,
        phone: full.customer_details?.phone ?? null,
      },
    },
  );
  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `commerce_paid_record_failed status=${response.status} code=${response.data?.error ?? "unknown"}`,
    );
  }
  return {};
}

async function postDirectPaymentFailure(
  env: Env,
  event: Stripe.Event,
  session: Stripe.Checkout.Session,
): Promise<{ skipped?: string }> {
  if (!isDirectShopSession(session)) return { skipped: "other_payment_session" };
  const orderId = session.client_reference_id;
  if (!env.COMMERCE || !orderId) {
    throw new Error("direct_checkout_missing_order");
  }
  const response = await fetchCommerceJson(
    env,
    "POST",
    "/internal/stripe/failed",
    {
      eventId: event.id,
      eventType: event.type,
      orderId,
      stripeSessionId: session.id,
    },
  );
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`commerce_failure_record_failed status=${response.status}`);
  }
  return {};
}

async function postDirectRefund(
  env: Env,
  event: Stripe.Event,
  refund: Stripe.Refund,
): Promise<{ skipped?: string }> {
  const paymentIntentId = extractStripeId(refund.payment_intent);
  if (!paymentIntentId) return { skipped: "refund_without_payment_intent" };
  if (!env.COMMERCE) throw new Error("commerce_service_not_configured");
  const response = await fetchCommerceJson<{ matched?: boolean }>(
    env,
    "POST",
    "/internal/stripe/refund",
    {
      stripeEventId: event.id,
      stripeRefundId: refund.id,
      paymentIntentId,
      amount: refund.amount,
      currency: refund.currency.toUpperCase(),
      status: refund.status ?? "unknown",
      reason: refund.reason ?? null,
    },
  );
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`commerce_refund_record_failed status=${response.status}`);
  }
  return response.data?.matched ? {} : { skipped: "unmatched_refund" };
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

  if (!env.AUTH_HTTP || !env.INTERNAL_ADMIN_HMAC_SECRET) {
    return jsonError("Auth worker binding or credentials not configured", 503);
  }

  let payload: string;
  try {
    payload = await readTextBodyLimited(request, MAX_WEBHOOK_BYTES);
  } catch (error) {
    return isBodyTooLargeError(error)
      ? jsonError("Webhook body is too large", 413)
      : jsonError("Invalid webhook body", 400);
  }
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
        if (isAcademySession(session)) {
          const result = await postAcademyPayment(env, stripe, event, session);
          return ok(result);
        }
        if (isDirectShopSession(session)) {
          const result = await postDirectPayment(env, stripe, event, session);
          return ok(result);
        }
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
        requireConfiguredMembership(sub, env);
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

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (isAcademySession(session)) {
          const result = await postAcademyPayment(env, stripe, event, session);
          return ok(result);
        }
        const result = await postDirectPayment(env, stripe, event, session);
        return ok(result);
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (isAcademySession(session)) {
          const result = await postAcademyCheckoutFailure(env, event, session, "failed");
          return ok(result.matched ? {} : { skipped: "unmatched_academy_checkout" });
        }
        const result = await postDirectPaymentFailure(env, event, session);
        return ok(result);
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (!isAcademySession(session)) return ok({ skipped: "other_expired_session" });
        const result = await postAcademyCheckoutFailure(env, event, session, "expired");
        return ok(result.matched ? {} : { skipped: "unmatched_academy_checkout" });
      }

      case "refund.created":
      case "refund.updated":
      case "refund.failed": {
        const refund = event.data.object as Stripe.Refund;
        const paymentIntentId = extractStripeId(refund.payment_intent);
        if (
          env.ACADEMY_ONE_TIME_CHECKOUT_ENABLED === "true" &&
          paymentIntentId &&
          event.type !== "refund.failed" &&
          refund.status !== "failed"
        ) {
          const academy = await postAcademyPaymentState(env, event, paymentIntentId, "refunded");
          if (academy.matched) return ok();
        }
        const result = await postDirectRefund(env, event, refund);
        return ok(result);
      }

      case "charge.dispute.created":
      case "charge.dispute.updated":
      case "charge.dispute.closed": {
        const dispute = event.data.object as Stripe.Dispute;
        const paymentIntentId = extractStripeId(dispute.payment_intent);
        if (!paymentIntentId) return ok({ skipped: "dispute_without_payment_intent" });
        const status = event.type === "charge.dispute.closed" && dispute.status === "won"
          ? "paid"
          : "disputed";
        if (env.ACADEMY_ONE_TIME_CHECKOUT_ENABLED !== "true") {
          return ok({ skipped: "academy_checkout_disabled" });
        }
        const academy = await postAcademyPaymentState(env, event, paymentIntentId, status);
        return ok(academy.matched ? {} : { skipped: "unmatched_dispute" });
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        requireConfiguredMembership(sub, env);
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
        requireConfiguredMembership(sub, env);
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
