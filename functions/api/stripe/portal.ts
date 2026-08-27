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

interface Env {
  STRIPE_API_KEY: string;
  STRIPE_PORTAL_RETURN_URL?: string;
  AUTH_HTTP: AuthHttpService;
  INTERNAL_ADMIN_HMAC_SECRET: string;
}

const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

function jsonError(error: string, status: number, extra?: Record<string, unknown>): Response {
  return Response.json({ error, ...(extra ?? {}) }, { status, headers: jsonHeaders });
}

const htmlHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "text/html; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

function pageError(title: string, message: string, status: number): Response {
  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title} | HobFarm</title>
  </head>
  <body style="margin:0;background:#050505;color:#f5f5f5;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <main style="min-height:100vh;display:grid;place-items:center;padding:2rem;">
      <section style="max-width:42rem;border:1px solid #333;padding:2rem;">
        <p style="margin:0 0 1rem;color:#86efac;font-family:monospace;font-size:.8rem;text-transform:uppercase;letter-spacing:.12em;">Billing portal</p>
        <h1 style="margin:0 0 1rem;font-size:2rem;line-height:1.1;">${title}</h1>
        <p style="margin:0 0 1.5rem;color:#b5b5b5;line-height:1.6;">${message}</p>
        <p style="margin:0;display:flex;gap:1rem;flex-wrap:wrap;">
          <a href="/membership/" style="color:#86efac;">Return to membership</a>
          <a href="/helpcenter/" style="color:#f5f5f5;">Customer Help</a>
        </p>
      </section>
    </main>
  </body>
</html>`,
    { status, headers: htmlHeaders },
  );
}

function portalUnavailable(
  wantsJson: boolean,
  error: string,
  status: number,
  extra?: Record<string, unknown>,
): Response {
  if (wantsJson) {
    return jsonError(error, status, extra);
  }
  return pageError(
    "Billing portal unavailable",
    "HobFarm could not open Stripe billing management for this account. The membership record may need to be refreshed before billing can be managed.",
    status,
  );
}

function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  return `${local.slice(0, 3)}***@***.${domain.split(".").pop() ?? "***"}`;
}

function maskStripeId(value: string | null | undefined): string {
  if (!value) return "missing";
  if (value.length <= 12) return `${value.slice(0, 4)}...`;
  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

function stripeErrorContext(error: unknown): Record<string, string | number | undefined> {
  const obj = error && typeof error === "object" ? (error as Record<string, unknown>) : {};
  const raw = obj.raw && typeof obj.raw === "object" ? (obj.raw as Record<string, unknown>) : {};
  const stringField = (value: unknown) => (typeof value === "string" ? value : undefined);
  const numberField = (value: unknown) => (typeof value === "number" ? value : undefined);
  return {
    name: stringField(obj.name),
    type: stringField(obj.type) ?? stringField(raw.type),
    code: stringField(obj.code) ?? stringField(raw.code),
    param: stringField(obj.param) ?? stringField(raw.param),
    statusCode: numberField(obj.statusCode) ?? numberField(raw.statusCode),
    requestId: stringField(obj.requestId) ?? stringField(raw.requestId),
  };
}

function isLikelyStaleStripeCustomer(error: unknown): boolean {
  const context = stripeErrorContext(error);
  return (
    context.code === "resource_missing" ||
    context.statusCode === 404 ||
    context.param === "customer"
  );
}

// Portal is meaningful for any sub Stripe can still act on. Excludes
// terminal states (canceled, incomplete_expired) and pre-checkout (none).
const PORTAL_OK_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
  "unpaid",
  "paused",
  "incomplete",
]);

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOriginMutation(request)) {
    return jsonError("Cross-site portal requests are not allowed", 403);
  }
  if (!env.STRIPE_API_KEY) {
    return jsonError("STRIPE_API_KEY not configured", 500);
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

  const lookup = await fetchAdminJson<{ subscription: AdminSubscriptionRecord | null }>(
    env,
    "GET",
    `/api/admin/subscriptions/by-user/${encodeURIComponent(user.id)}`,
  );
  const sub = lookup.status === 200 ? lookup.data?.subscription ?? null : null;

  if (!sub || !PORTAL_OK_STATUSES.has(sub.status)) {
    if (wantsJson) {
      return jsonError("no_subscription", 409);
    }
    return absoluteRedirect(request, "/membership");
  }

  if (!sub.stripe_customer_id || !sub.stripe_customer_id.startsWith("cus_")) {
    console.warn("[stripe/portal] invalid_customer_id", {
      user: user.id.slice(0, 8),
      email: maskEmail(user.email),
      status: sub.status,
      customer: maskStripeId(sub.stripe_customer_id),
      subscription: maskStripeId(sub.stripe_subscription_id),
    });
    return portalUnavailable(wantsJson, "billing_profile_unavailable", 409, {
      code: "billing_profile_unavailable",
    });
  }

  const returnUrl = env.STRIPE_PORTAL_RETURN_URL ?? new URL("/membership/", request.url).toString();
  const stripe = createStripeClient(env.STRIPE_API_KEY);
  let portal: Awaited<ReturnType<typeof stripe.billingPortal.sessions.create>>;
  try {
    portal = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: returnUrl,
    });
  } catch (error) {
    const context = stripeErrorContext(error);
    const staleCustomer = isLikelyStaleStripeCustomer(error);
    console.warn("[stripe/portal] create_failed", {
      user: user.id.slice(0, 8),
      email: maskEmail(user.email),
      status: sub.status,
      customer: maskStripeId(sub.stripe_customer_id),
      subscription: maskStripeId(sub.stripe_subscription_id),
      stripe: context,
      staleCustomer,
    });
    return portalUnavailable(
      wantsJson,
      staleCustomer ? "billing_profile_unavailable" : "stripe_portal_unavailable",
      staleCustomer ? 409 : 502,
      {
        code: staleCustomer ? "billing_profile_unavailable" : "stripe_portal_unavailable",
      },
    );
  }

  if (!portal.url) {
    return jsonError("Stripe did not return a portal URL", 502);
  }

  if (wantsJson) {
    return Response.json({ url: portal.url }, { status: 200, headers: jsonHeaders });
  }
  return Response.redirect(portal.url, 303);
};

export const onRequestGet: PagesFunction = async () => {
  return jsonError("Method not allowed", 405);
};
