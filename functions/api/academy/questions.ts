import { getAcademyLesson, getAcademyManifest } from "../../../src/data/academy-manifest";
import { isSameOriginMutation, resolveAuthUser } from "../stripe/internal";
import { fetchCommerceJson } from "../shop/internal";
import { academyJson, type AcademyEnv } from "./internal";
import { isBodyTooLargeError, readJsonBodyLimited } from "../request-body";

export const onRequestPost: PagesFunction<AcademyEnv> = async ({ request, env }) => {
  if (!isSameOriginMutation(request)) return academyJson({ error: "cross_site_request" }, 403);
  if (!env.AUTH_WORKER_URL) return academyJson({ error: "academy_help_not_configured" }, 503);
  const user = await resolveAuthUser(request, { AUTH_WORKER_URL: env.AUTH_WORKER_URL });
  if (!user) return academyJson({ error: "login_required", login_url: "/login?next=/academy/help/" }, 401);
  let body: { course_slug?: unknown; lesson_slug?: unknown; category?: unknown; question?: unknown };
  try {
    body = await readJsonBodyLimited(request, 4 * 1024);
  } catch (error) {
    if (isBodyTooLargeError(error)) return academyJson({ error: "body_too_large" }, 413);
    return academyJson({ error: "invalid_json" }, 400);
  }
  const courseSlug = typeof body.course_slug === "string" ? body.course_slug : "";
  const course = getAcademyManifest(courseSlug);
  const lessonSlug = typeof body.lesson_slug === "string" && body.lesson_slug ? body.lesson_slug : undefined;
  const lesson = course && lessonSlug ? getAcademyLesson(courseSlug, lessonSlug) : undefined;
  if (!course || (lessonSlug && !lesson)) return academyJson({ error: "invalid_course_or_lesson" }, 400);
  const result = await fetchCommerceJson<{ reportId?: string; error?: string }>(
    env,
    "POST",
    "/internal/academy/questions",
    {
      userId: user.id,
      courseId: course.courseId,
      lessonId: lesson?.lessonId,
      category: body.category,
      question: body.question,
    },
  );
  const status = result.data?.error === "question_rate_limited" ? 429 : result.status;
  return result.status === 200
    ? academyJson({ saved: true, report_id: result.data?.reportId })
    : academyJson({ error: result.data?.error ?? "question_not_saved" }, status || 503);
};

export const onRequestGet: PagesFunction = async () =>
  academyJson({ error: "method_not_allowed" }, 405);
