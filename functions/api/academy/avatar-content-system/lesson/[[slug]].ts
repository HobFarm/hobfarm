import { getPaidLesson } from "../../../../../src/data/avatar-content-system-paid";
import { academyJson as json, resolveAcademyAccess, type AcademyEnv } from "../../internal";

type Env = AcademyEnv;

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
          "Sign in to check permanent purchase or membership access.",
        login_url: `/login?next=/academy/avatar-content-system/course/${encodeURIComponent(slug)}`,
        membership_url: "/membership",
        purchase_url: "/academy/courses/avatar-content-system/#access",
      },
      401,
    );
  }

  if (!env.AUTH_WORKER_URL || !env.INTERNAL_ADMIN_HMAC_SECRET || !env.COMMERCE) {
    return json({ error: "course_access_not_configured" }, 503);
  }

  const access = await resolveAcademyAccess(request, env, "academy-course-avatar-v1");
  if (!access.user) {
    return json(
      {
        locked: true,
        error: "login_required",
        message:
          "Sign in to check permanent purchase or membership access.",
        login_url: `/login?next=/academy/avatar-content-system/course/${encodeURIComponent(slug)}`,
        membership_url: "/membership",
        purchase_url: "/academy/courses/avatar-content-system/#access",
      },
      401,
    );
  }

  if (!access.allowed) {
    return json(
      {
        locked: true,
        error: "course_access_required",
        message:
          "This lesson is included with permanent course access or an active HobFarm membership.",
        purchase_url: "/academy/courses/avatar-content-system/#access",
        membership_url: "/membership",
        repair_code: access.repairCode,
      },
      403,
    );
  }

  return json({ lesson, access: access.source, repair_code: access.repairCode });
};

export const onRequestPost: PagesFunction = async () => {
  return json({ error: "method_not_allowed" }, 405);
};
