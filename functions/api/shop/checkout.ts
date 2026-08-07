import { createStripeClient } from "../../../src/lib/stripe-server";
import {
  checkoutCartFingerprint,
  normalizeCheckoutCart,
} from "../../../workers/commerce/src/checkout.mjs";
import {
  acceptsJson,
  isSameOriginMutation,
  resolveAuthUser,
} from "../stripe/internal";
import { fetchCommerceJson, type CommerceServiceEnv } from "./internal";
import { isBodyTooLargeError, readJsonBodyLimited } from "../request-body";

interface Env extends CommerceServiceEnv {
  STRIPE_API_KEY: string;
  DIRECT_SHOP_CHECKOUT_ENABLED?: string;
  DIRECT_SHOP_TAX_MODE?: string;
  AUTH_WORKER_URL: string;
  INTERNAL_ADMIN_HMAC_SECRET: string;
}

interface CheckoutRequest {
  checkoutToken?: unknown;
  items?: unknown;
}

interface ReservedOrder {
  id: string;
  publicId: string;
}

const MAX_BODY_BYTES = 8 * 1024;
const CHECKOUT_TOKEN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

function jsonError(error: string, status: number, extra?: Record<string, unknown>): Response {
  return Response.json({ error, ...(extra ?? {}) }, { status, headers: jsonHeaders });
}

function errorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOriginMutation(request)) {
    return jsonError("Cross-site shop checkout requests are not allowed", 403);
  }

  if (env.DIRECT_SHOP_CHECKOUT_ENABLED !== "true") {
    return jsonError("Direct shop checkout is not open yet", 503);
  }
  if (!env.STRIPE_API_KEY) {
    return jsonError("STRIPE_API_KEY not configured", 500);
  }
  if (!env.AUTH_WORKER_URL || !env.INTERNAL_ADMIN_HMAC_SECRET) {
    return jsonError("Auth worker credentials not configured", 500);
  }
  if (!env.COMMERCE) {
    return jsonError("Commerce ledger is not configured", 503);
  }
  if (
    env.DIRECT_SHOP_TAX_MODE !== "stripe-tax" &&
    env.DIRECT_SHOP_TAX_MODE !== "not-collecting"
  ) {
    return jsonError("Direct shop tax mode is not configured", 503);
  }

  let body: CheckoutRequest;
  try {
    if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
      return jsonError("Shop checkout requires a JSON request", 415);
    }
    body = await readJsonBodyLimited<CheckoutRequest>(request, MAX_BODY_BYTES);
  } catch (error) {
    if (isBodyTooLargeError(error)) return jsonError("Request body is too large", 413);
    return jsonError("Invalid checkout request", 400);
  }
  if (
    !body ||
    typeof body !== "object" ||
    Object.keys(body).some((key) => key !== "checkoutToken" && key !== "items")
  ) {
    return jsonError("Invalid checkout request", 400);
  }

  if (
    typeof body.checkoutToken !== "string" ||
    !CHECKOUT_TOKEN.test(body.checkoutToken)
  ) {
    return jsonError("Invalid checkout token", 400);
  }

  let cart: ReturnType<typeof normalizeCheckoutCart>;
  try {
    cart = normalizeCheckoutCart(body.items);
  } catch (error) {
    const code = errorCode(error);
    return jsonError(
      code === "product_not_launched"
        ? "This product is not open for checkout"
        : "Invalid shop cart",
      code === "product_not_launched" ? 409 : 400,
    );
  }

  const user = await resolveAuthUser(request, env);
  if (!user) {
    return jsonError("login_required", 401, {
      login_url: "/login?next=/shop/melting-rabbit-hole-dad-hat/",
    });
  }
  if (!user.email_verified_at) {
    return jsonError("verified_email_required", 403);
  }

  const requestUrl = new URL(request.url);
  const successUrl =
    `${requestUrl.origin}/shop/order-received/?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl =
    `${requestUrl.origin}/shop/melting-rabbit-hole-dad-hat/?checkout=cancelled`;
  const cartFingerprint = checkoutCartFingerprint(cart);
  const stripe = createStripeClient(env.STRIPE_API_KEY);
  const reservation = await fetchCommerceJson<{
    order?: ReservedOrder;
    error?: string;
  }>(env, "POST", "/internal/checkout/reserve", {
    checkoutToken: body.checkoutToken,
    items: body.items,
    userId: user.id,
    email: user.email,
    taxMode: env.DIRECT_SHOP_TAX_MODE,
  });
  if (reservation.status !== 200 || !reservation.data?.order) {
    return jsonError(
      reservation.status === 409
        ? "This checkout attempt was already used for another cart"
        : "The order ledger could not reserve this checkout",
      reservation.status === 409 ? 409 : 503,
    );
  }
  const order = reservation.data.order;

  const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    mode: "payment",
    line_items: cart.lines.map((line) => ({
      price_data: {
        currency: line.currency.toLowerCase(),
        unit_amount: line.unitAmount,
        product_data: {
          name: `${line.productName} — ${line.variantName}`,
          tax_code: "txcd_30060006",
          metadata: {
            product_code: line.productCode,
            variant_code: line.variantCode,
          },
        },
      },
      quantity: line.quantity,
    })),
    shipping_address_collection: {
      allowed_countries: ["US"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: cart.shippingAmount,
            currency: cart.currency.toLowerCase(),
          },
          display_name:
            cart.shippingAmount === 0
              ? "Free U.S. Standard shipping"
              : "U.S. Standard shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 4 },
            maximum: { unit: "business_day", value: 6 },
          },
        },
      },
    ],
    customer_email: user.email,
    customer_creation: "always",
    client_reference_id: order.id,
    success_url: successUrl,
    cancel_url: cancelUrl,
    automatic_tax: {
      enabled: env.DIRECT_SHOP_TAX_MODE === "stripe-tax",
    },
    metadata: {
      user_id: user.id,
      order_id: order.id,
      public_order_id: order.publicId,
      surface: "hobfarm-direct-shop",
      cart: cartFingerprint,
      merchandise_subtotal: String(cart.merchandiseSubtotalAmount),
      shipping_amount: String(cart.shippingAmount),
      catalog_revision: "hat-v1",
    },
    payment_intent_data: {
      metadata: {
        user_id: user.id,
        order_id: order.id,
        surface: "hobfarm-direct-shop",
        cart: cartFingerprint,
        catalog_revision: "hat-v1",
      },
    },
  };

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.create>>;
  try {
    session = await stripe.checkout.sessions.create(sessionParams, {
      idempotencyKey: `hobfarm-shop:${user.id}:${body.checkoutToken}`,
    });
  } catch (error) {
    console.warn("[shop/checkout] create_failed", {
      user: user.id.slice(0, 8),
      code: errorCode(error),
    });
    return jsonError("Secure checkout could not be opened", 502);
  }

  if (!session.url) {
    return jsonError("Stripe did not return a checkout URL", 502);
  }

  const attachment = await fetchCommerceJson<{ order?: ReservedOrder }>(
    env,
    "POST",
    "/internal/checkout/attach-session",
    {
      orderId: order.id,
      stripeSessionId: session.id,
    },
  );
  if (attachment.status !== 200) {
    try {
      await stripe.checkout.sessions.expire(session.id);
    } catch {
      // Returning no URL prevents the browser from entering an unattached
      // session even if Stripe cannot expire it immediately.
    }
    return jsonError("The secure checkout could not be attached to the order", 503);
  }

  if (acceptsJson(request)) {
    return Response.json({ url: session.url }, { status: 200, headers: jsonHeaders });
  }
  return Response.redirect(session.url, 303);
};

export const onRequestGet: PagesFunction = async () => {
  return jsonError("Method not allowed", 405);
};
