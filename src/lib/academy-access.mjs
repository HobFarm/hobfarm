export const ACTIVE_ACADEMY_MEMBERSHIP_STATUSES = new Set(["active", "trialing"]);

export function resolveAcademyGrant({
  publicAccess = false,
  membershipStatus = null,
  membershipIncluded = true,
  entitlements = [],
}) {
  if (publicAccess) return { allowed: true, source: "public" };
  const direct = entitlements.find((item) => item.status === "active");
  if (direct) {
    return {
      allowed: true,
      source: direct.grant_type === "manual" ? "manual" : "purchase",
    };
  }
  if (membershipIncluded && membershipStatus && ACTIVE_ACADEMY_MEMBERSHIP_STATUSES.has(membershipStatus)) {
    return { allowed: true, source: "membership" };
  }
  return { allowed: false, source: "none" };
}
