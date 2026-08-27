import { createStripeClient } from "../../../src/lib/stripe-server";
import type { AuthHttpService } from "../../../src/lib/auth-service.ts";
import {
  resolveAuthUser,
  fetchAdminJson,
  absoluteRedirect,
  acceptsJson,
  isSameOriginMutation,
  type AdminSubscriptionRecord,
} from "./internal";
import { isBodyTooLargeError, readTextBodyLimited } from "../request-body";

interface Env {
  STRIPE_API_KEY: string;
  STRIPE_CREATIVE_MEMBERSHIP_PRICE_ID: string;
  STRIPE_CHECKOUT_SUCCESS_URL?: string;
  STRIPE_CHECKOUT_CANCEL_URL?: string;
  AUTH_HTTP: AuthHttpService;
  INTERNAL_ADMIN_HMAC_SECRET: string;
}

type CheckoutMode = "payment" | "subscription";

const MAX_BODY_BYTES = 4 * 1024;
const DEFAULT_PRODUCT = "creative-membership";
const checkoutProducts = {
  "creative-membership": {
    priceEnv: "STRIPE_CREATIVE_MEMBERSHIP_PRICE_ID",
    mode: "subscription",
    metadata: {
      product: "creative-membership",
      surface: "membership-page",
    },
  },
} as const satisfies Record<
  string,
  {
    priceEnv: keyof Env;
    mode: CheckoutMode;
    metadata: Record<string, string>;
  }
>;

type CheckoutProduct = keyof typeof checkoutProducts;

const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

function jsonError(error: string, status: number, extra?: Record<string, unknown>): Response {
  return Response.json({ error, ...(extra ?? {}) }, { status, headers: jsonHeaders });
}

function isCheckoutProduct(value: string): value is CheckoutProduct {
  return Object.hasOwn(checkoutProducts, value);
}

// Subscription statuses that block opening a NEW checkout. Stripe will
// happily create a parallel subscription via Checkout for an existing
// customer, but we want one logical sub per user — send these states to
// the portal instead.
const BLOCKING_SUB_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
  "unpaid",
  "paused",
  "incomplete",
]);

async function parseProduct(request: Request): Promise<CheckoutProduct | null> {
  const contentType = request.headers.get("content-type") ?? "";
  const rawBody = await readTextBodyLimited(request, MAX_BODY_BYTES);

  if (contentType.includes("application/json")) {
    const body = rawBody ? JSON.parse(rawBody) as { product?: unknown } : {};
    const product = typeof body.product === "string" ? body.product : DEFAULT_PRODUCT;
    return isCheckoutProduct(product) ? product : null;
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const formData = new URLSearchParams(rawBody);
    const product = formData.get("product");
    const productKey = typeof product === "string" ? product : DEFAULT_PRODUCT;
    return isCheckoutProduct(productKey) ? productKey : null;
  }

  if (contentType.includes("multipart/form-data")) return null;

  return DEFAULT_PRODUCT;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOriginMutation(request)) {
    return jsonError("Cross-site checkout requests are not allowed", 403);
  }

  if (!env.STRIPE_API_KEY) {
    return jsonError("STRIPE_API_KEY not configured", 500);
  }

  let productKey: CheckoutProduct | null;
  try {
    productKey = await parseProduct(request);
  } catch (error) {
    if (isBodyTooLargeError(error)) return jsonError("Request body is too large", 413);
    return jsonError("Invalid checkout request", 400);
  }

  if (!productKey) {
    return jsonError("Unknown checkout product", 400);
  }

  const product = checkoutProducts[productKey];
  const priceId = env[product.priceEnv];
  if (!priceId) {
    return jsonError(`${product.priceEnv} not configured`, 500);
  }
  if (!env.AUTH_HTTP || !env.INTERNAL_ADMIN_HMAC_SECRET) {
    return jsonError("Auth worker binding or credentials not configured", 503);
  }

  const wantsJson = acceptsJson(request);

  const user = await resolveAuthUser(request, env);
  if (!user) {
    if (wantsJson) {
      return jsonError("login_required", 401, { login_url: "/login?next=/membership" });
    }
    return absoluteRedirect(request, "/login?next=/membership");
  }

  const existing = await fetchAdminJson<{ subscription: AdminSubscriptionRecord | null }>(
    env,
    "GET",
    `/api/admin/subscriptions/by-user/${encodeURIComponent(user.id)}`,
  );

  const existingSub = existing.status === 200 ? existing.data?.subscription ?? null : null;

  if (existingSub && BLOCKING_SUB_STATUSES.has(existingSub.status)) {
    if (wantsJson) {
      return jsonError("already_subscribed", 409, { manage_url: "/membership" });
    }
    return absoluteRedirect(request, "/membership");
  }

  const requestUrl = new URL(request.url);
  const successUrl =
    env.STRIPE_CHECKOUT_SUCCESS_URL ??
    `${requestUrl.origin}/membership/success/?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = env.STRIPE_CHECKOUT_CANCEL_URL ?? `${requestUrl.origin}/membership/?checkout=cancelled`;

  const stripe = createStripeClient(env.STRIPE_API_KEY);
  const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    mode: product.mode,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: user.id,
    metadata: { ...product.metadata, user_id: user.id, tier: "supporter" },
    subscription_data: {
      metadata: { user_id: user.id, product: productKey, tier: "supporter" },
    },
  };

  // customer and customer_email are mutually exclusive in Stripe Checkout.
  // Reuse the existing customer when we know one; otherwise let Stripe make
  // a new one from the verified email.
  if (existingSub?.stripe_customer_id) {
    sessionParams.customer = existingSub.stripe_customer_id;
  } else {
    sessionParams.customer_email = user.email;
  }

  const bucket = Math.floor(Date.now() / (15 * 60 * 1000));
  const session = await stripe.checkout.sessions.create(sessionParams, {
    idempotencyKey: `hobfarm-membership:${user.id}:${productKey}:${bucket}`,
  });

  if (!session.url) {
    return jsonError("Stripe did not return a checkout URL", 502);
  }

  if (wantsJson) {
    return Response.json({ url: session.url }, { status: 200, headers: jsonHeaders });
  }

  return Response.redirect(session.url, 303);
};

export const onRequestGet: PagesFunction = async () => {
  return jsonError("Method not allowed", 405);
};
