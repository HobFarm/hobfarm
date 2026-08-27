import { resolveAuthUser } from "../stripe/internal";
import type { AuthHttpService } from "../../../src/lib/auth-service.ts";
import {
  fetchCommerceJson,
  type CommerceServiceEnv,
} from "./internal";

interface Env extends CommerceServiceEnv {
  AUTH_HTTP: AuthHttpService;
}

export interface PublicOrder {
  id: string;
  publicId: string;
  state: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  currency: string;
  merchandiseSubtotalAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  printfulStatus: string | null;
  hasTracking: boolean;
  createdAt: number;
  updatedAt: number;
}

const headers = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

function response(payload: unknown, status = 200): Response {
  return Response.json(payload, { status, headers });
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.AUTH_HTTP) return response({ error: "auth_worker_not_configured" }, 503);
  const user = await resolveAuthUser(request, env);
  if (!user) return response({ error: "login_required" }, 401);
  if (!user.email_verified_at) {
    return response({ error: "verified_email_required" }, 403);
  }
  if (!env.COMMERCE) {
    return response({ error: "commerce_not_configured" }, 503);
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (sessionId && !/^cs_(test_|live_)?[A-Za-z0-9_]{12,200}$/.test(sessionId)) {
    return response({ error: "invalid_session" }, 400);
  }
  const path =
    `/internal/orders?user_id=${encodeURIComponent(user.id)}` +
    (sessionId ? `&stripe_session_id=${encodeURIComponent(sessionId)}` : "");
  const result = await fetchCommerceJson<{ orders?: PublicOrder[] }>(
    env,
    "GET",
    path,
  );
  if (result.status !== 200) {
    return response({ error: "order_ledger_unavailable" }, 503);
  }
  return response({ orders: result.data?.orders ?? [] });
};

export const onRequestPost: PagesFunction = async () => {
  return response({ error: "method_not_allowed" }, 405);
};
