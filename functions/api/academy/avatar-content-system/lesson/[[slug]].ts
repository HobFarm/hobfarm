import { getPaidLesson } from "../../../../../src/data/avatar-content-system-paid";
import {
  fetchAdminJson,
  resolveAuthUser,
  type AdminSubscriptionRecord,
} from "../../../stripe/internal";

interface Env {
  AUTH_WORKER_URL?: string;
  INTERNAL_ADMIN_HMAC_SECRET?: string;
}

const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

function json(data: Record<string, unknown>, status = 200): Response {
  return Response.json(data, { status, headers: jsonHeaders });
}

function getSlug(params: Record<string, unknown>): string | null {
  const raw = params.slug;
  const slug = Array.isArray(raw) ? raw[0] : raw;
  if (typeof slug !== "string") return null;
  if (!slug || slug.includes("/") || slug.includes("\\") || slug === "." || slug === "..") {
    return null;
  }
  return slug;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const slug = getSlug(params);
  if (!slug) {
    return json({ error: "lesson_not_found" }, 404);
  }

  const lesson = getPaidLesson(slug);
  if (!lesson) {
    return json({ error: "lesson_not_found" }, 404);
  }

  if (!request.headers.get("cookie")) {
    return json(
      {
        locked: true,
        error: "login_required",
        message:
          "Sign in to check course access. Supporter beta access unlocks the paid starter kit lessons.",
        login_url: `/login?next=/academy/avatar-content-system/course/${encodeURIComponent(slug)}`,
        membership_url: "/membership",
      },
      401,
    );
  }

  if (!env.AUTH_WORKER_URL || !env.INTERNAL_ADMIN_HMAC_SECRET) {
    return json({ error: "course_access_not_configured" }, 503);
  }

  const user = await resolveAuthUser(request, { AUTH_WORKER_URL: env.AUTH_WORKER_URL });
  if (!user) {
    return json(
      {
        locked: true,
        error: "login_required",
        message:
          "Sign in to check course access. Supporter beta access unlocks the paid starter kit lessons.",
        login_url: `/login?next=/academy/avatar-content-system/course/${encodeURIComponent(slug)}`,
        membership_url: "/membership",
      },
      401,
    );
  }

  const lookup = await fetchAdminJson<{ subscription: AdminSubscriptionRecord | null }>(
    {
      AUTH_WORKER_URL: env.AUTH_WORKER_URL,
      INTERNAL_ADMIN_HMAC_SECRET: env.INTERNAL_ADMIN_HMAC_SECRET,
    },
    "GET",
    `/api/admin/subscriptions/by-user/${encodeURIComponent(user.id)}`,
  );

  const subscription = lookup.status === 200 ? lookup.data?.subscription ?? null : null;
  if (!subscription || !ACTIVE_STATUSES.has(subscription.status)) {
    return json(
      {
        locked: true,
        error: "supporter_required",
        message:
          "This lesson is part of the paid starter kit. Supporter beta access unlocks the full lesson body.",
        membership_url: "/membership",
      },
      403,
    );
  }

  return json({ lesson });
};

export const onRequestPost: PagesFunction = async () => {
  return json({ error: "method_not_allowed" }, 405);
};
