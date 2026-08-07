import { getAcademyLesson, getAcademyManifest } from "../../../src/data/academy-manifest";
import { isSameOriginMutation, resolveAuthUser } from "../stripe/internal";
import { fetchCommerceJson } from "../shop/internal";
import { academyJson, resolveAcademyAccess, type AcademyEnv } from "./internal";
import { isBodyTooLargeError, readJsonBodyLimited } from "../request-body";

const MAX_BODY_BYTES = 8 * 1024;

export const onRequestGet: PagesFunction<AcademyEnv> = async ({ request, env }) => {
  if (!env.AUTH_WORKER_URL) return academyJson({ error: "academy_progress_not_configured" }, 503);
  const user = await resolveAuthUser(request, { AUTH_WORKER_URL: env.AUTH_WORKER_URL });
  if (!user) return academyJson({ error: "login_required" }, 401);
  const result = await fetchCommerceJson<{ progress: unknown[] }>(
    env,
    "GET",
    `/internal/academy/progress?user_id=${encodeURIComponent(user.id)}`,
  );
  return result.status === 200
    ? academyJson(result.data ?? { progress: [] })
    : academyJson({ error: "academy_ledger_unavailable" }, 503);
};

export const onRequestPost: PagesFunction<AcademyEnv> = async ({ request, env }) => {
  if (!isSameOriginMutation(request)) return academyJson({ error: "cross_site_request" }, 403);
  if (!env.AUTH_WORKER_URL) return academyJson({ error: "academy_progress_not_configured" }, 503);
  const user = await resolveAuthUser(request, { AUTH_WORKER_URL: env.AUTH_WORKER_URL });
  if (!user) return academyJson({ error: "login_required" }, 401);
  let body: { course_slug?: unknown; lesson_slug?: unknown; status?: unknown; client_updated_at?: unknown };
  try {
    body = await readJsonBodyLimited(request, MAX_BODY_BYTES);
  } catch (error) {
    if (isBodyTooLargeError(error)) return academyJson({ error: "body_too_large" }, 413);
    return academyJson({ error: "invalid_json" }, 400);
  }
  const courseSlug = typeof body.course_slug === "string" ? body.course_slug : "";
  const lessonSlug = typeof body.lesson_slug === "string" ? body.lesson_slug : "";
  const course = getAcademyManifest(courseSlug);
  const lesson = course ? getAcademyLesson(courseSlug, lessonSlug) : undefined;
  const status = body.status === "complete" ? "complete" : body.status === "started" ? "started" : null;
  if (!course || !lesson || !status) return academyJson({ error: "invalid_progress" }, 400);
  if (lesson.access === "paid") {
    const access = await resolveAcademyAccess(
      request,
      env,
      course.courseId,
      course.membershipGrant === "academy_all_access",
    );
    if (!access.allowed) return academyJson({ error: access.user ? "course_access_required" : "login_required" }, access.user ? 403 : 401);
  }
  const clientUpdatedAt = Number(body.client_updated_at ?? Math.floor(Date.now() / 1000));
  const saved = await fetchCommerceJson(
    env,
    "POST",
    "/internal/academy/progress",
    {
      userId: user.id,
      courseId: course.courseId,
      lessonId: lesson.lessonId,
      status,
      clientUpdatedAt,
    },
  );
  return saved.status === 200
    ? academyJson({ saved: true })
    : academyJson({ error: saved.data && typeof saved.data === "object" && "error" in saved.data ? saved.data.error : "progress_not_saved" }, saved.status || 503);
};
