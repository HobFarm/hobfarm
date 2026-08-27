import { academyCourseManifests } from "../../../src/data/academy-manifest";
import {
  fetchAdminJson,
  resolveAuthUser,
  type AdminSubscriptionRecord,
} from "../stripe/internal";
import { fetchCommerceJson } from "../shop/internal";
import {
  academyJson,
  academyRepairCode,
  type AcademyEntitlementRecord,
  type AcademyEnv,
  type AcademyPurchaseRecord,
} from "./internal";

export const onRequestGet: PagesFunction<AcademyEnv> = async ({ request, env }) => {
  if (!env.AUTH_HTTP) return academyJson({ error: "academy_access_not_configured" }, 503);
  const user = await resolveAuthUser(request, { AUTH_HTTP: env.AUTH_HTTP });
  if (!user) return academyJson({ error: "login_required" }, 401);

  const [access, progress, subscription] = await Promise.all([
    fetchCommerceJson<{ entitlements: AcademyEntitlementRecord[]; purchases: AcademyPurchaseRecord[] }>(
      env,
      "GET",
      `/internal/academy/access?user_id=${encodeURIComponent(user.id)}`,
    ),
    fetchCommerceJson<{ progress: Array<Record<string, unknown>> }>(
      env,
      "GET",
      `/internal/academy/progress?user_id=${encodeURIComponent(user.id)}`,
    ),
    env.INTERNAL_ADMIN_HMAC_SECRET
      ? fetchAdminJson<{ subscription: AdminSubscriptionRecord | null }>(
          {
            AUTH_HTTP: env.AUTH_HTTP,
            INTERNAL_ADMIN_HMAC_SECRET: env.INTERNAL_ADMIN_HMAC_SECRET,
          },
          "GET",
          `/api/admin/subscriptions/by-user/${encodeURIComponent(user.id)}`,
        )
      : Promise.resolve({ status: 503, data: null }),
  ]);

  if (access.status !== 200 || progress.status !== 200) {
    return academyJson({ error: "academy_ledger_unavailable" }, 503);
  }

  const activeMembership = ["active", "trialing"].includes(subscription.data?.subscription?.status ?? "");
  const courses = academyCourseManifests
    .filter((course) => course.status !== "archived")
    .map((course) => {
      const direct = (access.data?.entitlements ?? []).find(
        (item) => item.course_id === course.courseId && item.status === "active",
      );
      const completed = (progress.data?.progress ?? []).filter(
        (item) => item.course_id === course.courseId && item.status === "complete",
      ).length;
      const completedIds = new Set((progress.data?.progress ?? [])
        .filter((item) => item.course_id === course.courseId && item.status === "complete")
        .map((item) => String(item.lesson_id)));
      const nextLesson = course.lessons.find((lesson) => !completedIds.has(lesson.lessonId));
      const availableLessons = course.lessons.length;
      const source = course.access === "public"
        ? "public"
        : direct
          ? direct.grant_type
          : activeMembership && course.status === "available" && course.membershipGrant === "academy_all_access"
            ? "membership"
            : "none";
      return {
        course_id: course.courseId,
        slug: course.slug,
        title: course.title,
        href: `/academy/courses/${course.slug}/`,
        continue_href: nextLesson
          ? `/academy/courses/${course.slug}/${nextLesson.slug}/`
          : `/academy/courses/${course.slug}/`,
        status: course.publicStatus,
        access_source: source,
        completed_lessons: completed,
        total_lessons: availableLessons,
        complete: availableLessons > 0 && completed >= availableLessons,
        repair_code: academyRepairCode(user.id, course.courseId),
      };
    });

  return academyJson({
    subscription: subscription.data?.subscription ?? null,
    active_membership: activeMembership,
    courses,
    purchases: access.data?.purchases ?? [],
    progress: progress.data?.progress ?? [],
  });
};

export const onRequestPost: PagesFunction = async () =>
  academyJson({ error: "method_not_allowed" }, 405);
