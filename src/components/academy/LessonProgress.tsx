import { useEffect, useState } from "react";

interface Props {
  courseSlug: string;
  lessonSlug: string;
  lessonId: string;
  courseHref: string;
  isFinalLesson?: boolean;
}

type LessonState = "not_started" | "started" | "complete";

function storageKey(courseSlug: string, lessonId: string): string {
  return `hobfarm:academy:progress:${courseSlug}:${lessonId}`;
}

function sendEvent(name: string, detail: Record<string, string>) {
  window.dispatchEvent(new CustomEvent("hobfarm:analytics", { detail: { name, ...detail } }));
}

export default function LessonProgress({ courseSlug, lessonSlug, lessonId, courseHref, isFinalLesson = false }: Props) {
  const [status, setStatus] = useState<LessonState>("not_started");
  const [accountState, setAccountState] = useState<"checking" | "synced" | "local">("checking");

  async function sync(nextStatus: "started" | "complete", clientUpdatedAt: number) {
    try {
      const response = await fetch("/api/academy/progress", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          course_slug: courseSlug,
          lesson_slug: lessonSlug,
          status: nextStatus,
          client_updated_at: clientUpdatedAt,
        }),
      });
      setAccountState(response.ok ? "synced" : "local");
    } catch {
      setAccountState("local");
    }
  }

  useEffect(() => {
    const key = storageKey(courseSlug, lessonId);
    const raw = localStorage.getItem(key);
    let localStatus: "started" | "complete" = "started";
    let updatedAt = Math.floor(Date.now() / 1000);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { status?: string; updatedAt?: number };
        localStatus = parsed.status === "complete" ? "complete" : "started";
        updatedAt = Number(parsed.updatedAt) || updatedAt;
      } catch {
        localStatus = "started";
      }
    } else {
      localStorage.setItem(key, JSON.stringify({ status: "started", updatedAt }));
    }
    setStatus(localStatus);
    sendEvent("academy_lesson_view", { courseId: courseSlug, lessonId });
    void sync(localStatus, updatedAt);
  }, [courseSlug, lessonId, lessonSlug]);

  const markComplete = () => {
    const updatedAt = Math.floor(Date.now() / 1000);
    localStorage.setItem(storageKey(courseSlug, lessonId), JSON.stringify({ status: "complete", updatedAt }));
    setStatus("complete");
    sendEvent("academy_lesson_complete", { courseId: courseSlug, lessonId });
    if (isFinalLesson) sendEvent("academy_course_complete", { courseId: courseSlug, lessonId });
    void sync("complete", updatedAt);
  };

  return (
    <section className="border border-base-800 bg-base-900/50 p-5" aria-labelledby={`progress-${lessonId}`}>
      <p className="text-xs font-mono uppercase tracking-wider text-accent-cyan-bright">Lesson progress</p>
      <h2 id={`progress-${lessonId}`} className="mt-3 text-xl font-display text-white">
        {status === "complete" ? "Lesson complete" : "Save your place"}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-base-400">
        {accountState === "synced"
          ? "Progress is saved to your HobFarm account."
          : "Progress is saved in this browser. Sign in to resume it from Account on another device."}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {status !== "complete" ? (
          <button
            type="button"
            onClick={markComplete}
            className="rounded-full bg-accent-500 px-4 py-2 text-xs font-medium text-base-950"
            data-event="academy_lesson_complete"
            data-course-id={courseSlug}
            data-lesson-id={lessonId}
          >
            Mark lesson complete
          </button>
        ) : null}
        <a href={courseHref} className="rounded-full border border-base-700 px-4 py-2 text-xs text-base-300 hover:border-white hover:text-white">
          Course map
        </a>
      </div>
    </section>
  );
}
