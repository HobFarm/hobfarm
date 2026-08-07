import {
  fetchAdminJson,
  resolveAuthUser,
  type AdminSubscriptionRecord,
  type UserPayload,
} from "../stripe/internal";
import {
  fetchCommerceJson,
  type CommerceServiceEnv,
} from "../shop/internal";
import { resolveAcademyGrant } from "../../../src/lib/academy-access.mjs";

export interface AcademyEnv extends CommerceServiceEnv {
  AUTH_WORKER_URL?: string;
  INTERNAL_ADMIN_HMAC_SECRET?: string;
}

export interface AcademyEntitlementRecord {
  entitlement_id: string;
  course_id: string;
  grant_type: "purchase" | "manual";
  status: "active" | "suspended" | "revoked";
  granted_at: number;
  updated_at: number;
}

export interface AcademyPurchaseRecord {
  purchase_id: string;
  product_key: string;
  provider: string;
  provider_order_id: string | null;
  amount: number;
  currency: string;
  status: string;
  paid_at: number | null;
  created_at: number;
}

export interface AcademyAccessDecision {
  allowed: boolean;
  source: "public" | "purchase" | "manual" | "membership" | "none";
  user: UserPayload | null;
  subscription: AdminSubscriptionRecord | null;
  entitlements: AcademyEntitlementRecord[];
  purchases: AcademyPurchaseRecord[];
  repairCode: string | null;
}

export const ACADEMY_JSON_HEADERS = {
  "Cache-Control": "private, no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

export function academyJson(payload: unknown, status = 200): Response {
  return Response.json(payload, { status, headers: ACADEMY_JSON_HEADERS });
}

export function academyRepairCode(userId: string, courseId: string): string {
  let hash = 2166136261;
  for (const char of `${userId}:${courseId}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const userPart = (hash >>> 0).toString(36).toUpperCase().padStart(7, "0").slice(-7);
  const coursePart = courseId.split("-").filter(Boolean).slice(-2).join("").slice(0, 8).toUpperCase();
  return `AC-${coursePart}-${userPart}`;
}

export async function resolveAcademyAccess(
  request: Request,
  env: AcademyEnv,
  courseId: string,
  membershipIncluded = true,
): Promise<AcademyAccessDecision> {
  if (!env.AUTH_WORKER_URL) {
    return {
      allowed: false,
      source: "none",
      user: null,
      subscription: null,
      entitlements: [],
      purchases: [],
      repairCode: null,
    };
  }
  const user = await resolveAuthUser(request, { AUTH_WORKER_URL: env.AUTH_WORKER_URL });
  if (!user) {
    return {
      allowed: false,
      source: "none",
      user: null,
      subscription: null,
      entitlements: [],
      purchases: [],
      repairCode: null,
    };
  }

  const [commerce, subscriptionLookup] = await Promise.all([
    fetchCommerceJson<{
      entitlements: AcademyEntitlementRecord[];
      purchases: AcademyPurchaseRecord[];
    }>(
      env,
      "GET",
      `/internal/academy/access?user_id=${encodeURIComponent(user.id)}&course_id=${encodeURIComponent(courseId)}`,
    ),
    env.INTERNAL_ADMIN_HMAC_SECRET
      ? fetchAdminJson<{ subscription: AdminSubscriptionRecord | null }>(
          {
            AUTH_WORKER_URL: env.AUTH_WORKER_URL,
            INTERNAL_ADMIN_HMAC_SECRET: env.INTERNAL_ADMIN_HMAC_SECRET,
          },
          "GET",
          `/api/admin/subscriptions/by-user/${encodeURIComponent(user.id)}`,
        )
      : Promise.resolve({ status: 503, data: null }),
  ]);

  const entitlements = commerce.status === 200 ? commerce.data?.entitlements ?? [] : [];
  const purchases = commerce.status === 200 ? commerce.data?.purchases ?? [] : [];
  const subscription = subscriptionLookup.status === 200
    ? subscriptionLookup.data?.subscription ?? null
    : null;

  const grant = resolveAcademyGrant({
    membershipStatus: subscription?.status ?? null,
    membershipIncluded,
    entitlements,
  }) as { allowed: boolean; source: AcademyAccessDecision["source"] };

  return {
    allowed: grant.allowed,
    source: grant.source,
    user,
    subscription,
    entitlements,
    purchases,
    repairCode: academyRepairCode(user.id, courseId),
  };
}
