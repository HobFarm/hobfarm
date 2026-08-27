import { getAcademyManifest } from "../../../src/data/academy-manifest";
import { createStripeClient } from "../../../src/lib/stripe-server";
import {
  acceptsJson,
  absoluteRedirect,
  fetchAdminJson,
  isSameOriginMutation,
  resolveAuthUser,
  type AdminSubscriptionRecord,
} from "../stripe/internal";
import { fetchCommerceJson } from "../shop/internal";
import { academyJson, resolveAcademyAccess, type AcademyEnv } from "./internal";
import { isBodyTooLargeError, readTextBodyLimited } from "../request-body";

interface Env extends AcademyEnv {
  STRIPE_API_KEY?: string;
  STRIPE_ACADEMY_AVATAR_PRICE_ID?: string;
  ACADEMY_ONE_TIME_CHECKOUT_ENABLED?: string;
  ACADEMY_STRIPE_TAX_ENABLED?: string;
}

const productConfig = {
  academy_avatar_content_system_v1: {
    courseSlug: "avatar-content-system",
    priceEnv: "STRIPE_ACADEMY_AVATAR_PRICE_ID",
    amount: 700,
    currency: "USD",
  },
} as const;

type ProductKey = keyof typeof productConfig;

function checkoutError(request: Request, error: string, status: number, extra: Record<string, unknown> = {}): Response {
  return acceptsJson(request)
    ? academyJson({ error, ...extra }, status)
    : absoluteRedirect(request, String(extra.redirect_url ?? `/academy/?checkout=${encodeURIComponent(error)}`));
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOriginMutation(request)) return academyJson({ error: "cross_site_request" }, 403);
  let productKey = "";
  try {
    const type = request.headers.get("content-type") ?? "";
    const rawBody = await readTextBodyLimited(request, 4 * 1024);
    if (type.includes("application/json")) {
      const body = JSON.parse(rawBody) as { product_key?: unknown };
      productKey = typeof body.product_key === "string" ? body.product_key : "";
    } else if (type.includes("application/x-www-form-urlencoded")) {
      const form = new URLSearchParams(rawBody);
      productKey = String(form.get("product_key") ?? "");
    } else {
      return academyJson({ error: "unsupported_content_type" }, 415);
    }
  } catch (error) {
    if (isBodyTooLargeError(error)) return academyJson({ error: "body_too_large" }, 413);
    return academyJson({ error: "invalid_checkout_request" }, 400);
  }
  if (!Object.hasOwn(productConfig, productKey)) return academyJson({ error: "unknown_product" }, 400);
  const config = productConfig[productKey as ProductKey];
  const course = getAcademyManifest(config.courseSlug)!;
  if (course.status !== "available") return academyJson({ error: "course_not_available" }, 409);
  if (env.ACADEMY_ONE_TIME_CHECKOUT_ENABLED !== "true" || env.ACADEMY_STRIPE_TAX_ENABLED !== "true") {
    return checkoutError(request, "checkout_not_active", 503, {
      message: "Permanent purchase setup is still being verified. Membership access remains available.",
      redirect_url: `/academy/courses/${course.slug}/?checkout=not-active`,
    });
  }
  if (!env.STRIPE_API_KEY || !env.AUTH_HTTP || !env.INTERNAL_ADMIN_HMAC_SECRET || !env.COMMERCE) {
    return academyJson({ error: "checkout_not_configured" }, 503);
  }
  const priceId = env[config.priceEnv];
  if (!priceId) return academyJson({ error: "academy_price_not_configured" }, 503);
  const user = await resolveAuthUser(request, { AUTH_HTTP: env.AUTH_HTTP });
  if (!user) return checkoutError(request, "login_required", 401, {
    login_url: `/login?next=/academy/courses/${course.slug}/`,
    redirect_url: `/login?next=/academy/courses/${course.slug}/`,
  });
  const access = await resolveAcademyAccess(
    request,
    env,
    course.courseId,
    course.membershipGrant === "academy_all_access",
  );
  if (access.entitlements.some((item) => item.status === "active")) {
    return checkoutError(request, "already_owned", 409, {
      redirect_url: `/academy/courses/${course.slug}/?access=owned`,
    });
  }

  // One reservation per user/product/15-minute window makes double clicks and
  // immediate retries converge on Stripe's same idempotent Checkout Session.
  const checkoutToken = `${productKey}_${Math.floor(Date.now() / (15 * 60 * 1000))}`;
  const reserved = await fetchCommerceJson<{ purchaseId?: string; error?: string }>(
    env,
    "POST",
    "/internal/academy/checkout/reserve",
    {
      userId: user.id,
      productKey,
      checkoutToken,
      provider: "stripe",
      amount: config.amount,
      currency: config.currency,
    },
  );
  if (reserved.status !== 200 || !reserved.data?.purchaseId) {
    return academyJson({ error: reserved.data?.error ?? "purchase_reservation_failed" }, 503);
  }

  const subscriptionLookup = await fetchAdminJson<{ subscription: AdminSubscriptionRecord | null }>(
    {
      AUTH_HTTP: env.AUTH_HTTP,
      INTERNAL_ADMIN_HMAC_SECRET: env.INTERNAL_ADMIN_HMAC_SECRET,
    },
    "GET",
    `/api/admin/subscriptions/by-user/${encodeURIComponent(user.id)}`,
  );
  const existingCustomer = subscriptionLookup.status === 200
    ? subscriptionLookup.data?.subscription?.stripe_customer_id
    : null;
  const origin = new URL(request.url).origin;
  const stripe = createStripeClient(env.STRIPE_API_KEY);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: user.id,
    success_url: `${origin}/academy/checkout/complete/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/academy/courses/${course.slug}/?checkout=cancelled`,
    automatic_tax: { enabled: true },
    metadata: {
      surface: "hobfarm-academy",
      user_id: user.id,
      product_key: productKey,
      course_id: course.courseId,
      purchase_id: reserved.data.purchaseId,
      expected_amount: String(config.amount),
      expected_currency: config.currency,
    },
    ...(existingCustomer
      ? { customer: existingCustomer }
      : { customer_email: user.email, customer_creation: "always" as const }),
  }, { idempotencyKey: `academy-${reserved.data.purchaseId}` });
  if (!session.url) return academyJson({ error: "checkout_url_missing" }, 502);

  const attached = await fetchCommerceJson<{ error?: string }>(
    env,
    "POST",
    "/internal/academy/checkout/attach",
    { purchaseId: reserved.data.purchaseId, providerOrderId: session.id },
  );
  if (attached.status !== 200) return academyJson({ error: attached.data?.error ?? "checkout_attach_failed" }, 503);
  return acceptsJson(request)
    ? academyJson({ url: session.url })
    : Response.redirect(session.url, 303);
};

export const onRequestGet: PagesFunction = async () =>
  academyJson({ error: "method_not_allowed" }, 405);
