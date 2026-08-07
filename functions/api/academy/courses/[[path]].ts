import { getPaidLesson } from "../../../../src/data/avatar-content-system-paid";
import {
  getAcademyLesson,
  getAcademyManifest,
} from "../../../../src/data/academy-manifest";
import {
  academyJson,
  resolveAcademyAccess,
  type AcademyEnv,
} from "../internal";

function pathParts(params: Record<string, unknown>): string[] {
  const raw = params.path;
  const parts = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split("/") : [];
  return parts.filter((part): part is string =>
    typeof part === "string" && /^[a-z0-9][a-z0-9-]{1,100}$/.test(part));
}

export const onRequestGet: PagesFunction<AcademyEnv> = async ({ request, env, params }) => {
  const [courseSlug, lessonSlug] = pathParts(params);
  const course = courseSlug ? getAcademyManifest(courseSlug) : undefined;
  const lesson = course && lessonSlug ? getAcademyLesson(course.slug, lessonSlug) : undefined;
  if (!course || !lesson) return academyJson({ error: "lesson_not_found" }, 404);

  if (lesson.access === "public") {
    return academyJson({
      public: true,
      lesson: {
        lessonId: lesson.lessonId,
        title: lesson.title,
        objective: lesson.objective,
        builds: lesson.builds,
        legacy_url: lesson.legacyHref ?? null,
      },
    });
  }

  if (course.status !== "available") {
    return academyJson({
      locked: true,
      error: "course_not_available",
      message: "This course is still in review. Its paid lesson bodies are not published.",
    }, 409);
  }

  const access = await resolveAcademyAccess(
    request,
    env,
    course.courseId,
    course.membershipGrant === "academy_all_access",
  );
  if (!access.user) {
    return academyJson({
      locked: true,
      error: "login_required",
      message: "Sign in to check permanent purchase or membership access.",
      login_url: `/login?next=/academy/courses/${encodeURIComponent(course.slug)}/${encodeURIComponent(lesson.slug)}/`,
      purchase_url: `/academy/courses/${encodeURIComponent(course.slug)}/#access`,
      membership_url: "/membership/",
    }, 401);
  }
  if (!access.allowed) {
    return academyJson({
      locked: true,
      error: "course_access_required",
      message: "Buy permanent course access or use an active HobFarm membership.",
      purchase_url: `/academy/courses/${encodeURIComponent(course.slug)}/#access`,
      membership_url: "/membership/",
      repair_code: access.repairCode,
    }, 403);
  }

  if (course.slug === "avatar-content-system") {
    const body = getPaidLesson(lesson.slug);
    if (!body) return academyJson({ error: "lesson_body_not_found" }, 404);
    return academyJson({ lesson: body, access: access.source, repair_code: access.repairCode });
  }

  return academyJson({ error: "lesson_body_not_published" }, 404);
};

export const onRequestPost: PagesFunction = async () =>
  academyJson({ error: "method_not_allowed" }, 405);
