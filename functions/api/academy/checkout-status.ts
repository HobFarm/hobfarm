import { resolveAuthUser } from "../stripe/internal";
import { fetchCommerceJson } from "../shop/internal";
import {
  academyJson,
  type AcademyEnv,
  type AcademyPurchaseRecord,
} from "./internal";

export const onRequestGet: PagesFunction<AcademyEnv> = async ({ request, env }) => {
  if (!env.AUTH_HTTP) return academyJson({ error: "academy_access_not_configured" }, 503);
  const user = await resolveAuthUser(request, { AUTH_HTTP: env.AUTH_HTTP });
  if (!user) return academyJson({ error: "login_required" }, 401);
  const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
  if (!/^cs_(test_|live_)?[A-Za-z0-9]{10,}$/.test(sessionId)) {
    return academyJson({ error: "invalid_session" }, 400);
  }
  const result = await fetchCommerceJson<{ purchases: AcademyPurchaseRecord[] }>(
    env,
    "GET",
    `/internal/academy/access?user_id=${encodeURIComponent(user.id)}`,
  );
  if (result.status !== 200) return academyJson({ error: "academy_ledger_unavailable" }, 503);
  const purchase = result.data?.purchases.find((item) => item.provider_order_id === sessionId);
  if (!purchase) return academyJson({ status: "pending" }, 202);
  return academyJson({
    status: purchase.status,
    product_key: purchase.product_key,
    course_url: purchase.product_key === "academy_avatar_content_system_v1"
      ? "/academy/courses/avatar-content-system/"
      : "/account/",
  }, purchase.status === "paid" ? 200 : 202);
};

export const onRequestPost: PagesFunction = async () =>
  academyJson({ error: "method_not_allowed" }, 405);
