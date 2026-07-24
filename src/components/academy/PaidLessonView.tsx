import { useEffect, useState } from "react";
import SnippetCards from "./SnippetCards";
import type { LessonPreview } from "@/data/avatar-content-system";
import type { PaidLesson } from "@/data/avatar-content-system-paid";

interface Props {
  slug: string;
  preview: LessonPreview;
}

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; lesson: PaidLesson }
  | { kind: "locked"; message: string; loginUrl: string; membershipUrl: string }
  | { kind: "error"; message: string };

const primaryLinkClass =
  "inline-flex h-9 items-center justify-center rounded-full bg-linear-to-t from-accent-600 to-accent-500 px-4 py-2 text-xs font-medium text-base-950 shadow-dimensional transition-colors hover:from-accent-500 hover:to-accent-600";

const secondaryLinkClass =
  "inline-flex h-9 items-center justify-center rounded-full border border-base-700 px-4 py-2 text-xs font-medium text-base-300 transition-colors hover:border-white hover:text-white";

export default function PaidLessonView({ slug, preview }: Props) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function loadLesson() {
      try {
        const res = await fetch(`/api/academy/avatar-content-system/lesson/${slug}`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        const data = (await res.json().catch(() => null)) as
          | {
              lesson?: PaidLesson;
              message?: string;
              login_url?: string;
              membership_url?: string;
              error?: string;
            }
          | null;

        if (cancelled) return;

        if (res.ok && data?.lesson) {
          setState({ kind: "ready", lesson: data.lesson });
          return;
        }

        if (res.status === 401 || res.status === 403) {
          setState({
            kind: "locked",
            message:
              data?.message ??
              "This lesson is part of the paid starter kit. Supporter beta access unlocks the full lesson body.",
            loginUrl: data?.login_url ?? `/login?next=/academy/avatar-content-system/course/${slug}`,
            membershipUrl: data?.membership_url ?? "/membership",
          });
          return;
        }

        setState({
          kind: "error",
          message: data?.error ?? "Could not load this lesson.",
        });
      } catch {
        if (!cancelled) {
          setState({ kind: "error", message: "Could not reach the course access check." });
        }
      }
    }

    loadLesson();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.kind === "loading") {
    return (
      <div className="border border-base-800 bg-base-900/40 p-6" aria-live="polite">
        <p className="text-xs font-mono uppercase tracking-wider text-base-500">Checking access</p>
        <div className="mt-5 space-y-3" aria-hidden="true">
          <div className="h-4 w-2/3 animate-pulse bg-base-800" />
          <div className="h-4 w-1/2 animate-pulse bg-base-800" />
          <div className="h-4 w-3/4 animate-pulse bg-base-800" />
        </div>
      </div>
    );
  }

  if (state.kind === "locked") {
    return (
      <section className="border border-base-800 bg-base-900/50 p-6">
        <p className="text-xs font-mono uppercase tracking-wider text-accent-violet-bright">
          Locked lesson
        </p>
        <h2 className="mt-5 text-2xl font-display text-white">Supporter beta access unlocks this lesson.</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-base-400">{state.message}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={state.loginUrl} className={primaryLinkClass}>
            Sign in
          </a>
          <a href={state.membershipUrl} className={secondaryLinkClass}>
            Get supporter access
          </a>
        </div>
        <div className="mt-8 border-t border-base-800 pt-5">
          <p className="text-xs font-mono uppercase tracking-wider text-base-500">Preview</p>
          <p className="mt-3 text-sm leading-relaxed text-base-400">{preview.preview}</p>
        </div>
      </section>
    );
  }

  if (state.kind === "error") {
    return (
      <section className="border border-base-800 bg-base-900/50 p-6">
        <p className="text-sm text-white">{state.message}</p>
        <a href="/helpcenter/" className="mt-4 inline-block text-sm text-base-300 underline decoration-base-700 underline-offset-4 hover:text-white">
          Customer Help
        </a>
      </section>
    );
  }

  const { lesson } = state;

  return (
    <article className="space-y-10">
      <section className="border border-base-800 bg-base-900/40 p-6">
        <p className="text-xs font-mono uppercase tracking-wider text-accent-green-bright">Goal</p>
        <p className="mt-4 text-base leading-relaxed text-base-300">{lesson.goal}</p>
      </section>

      <section>
        <h2 className="text-2xl font-display text-white">What you need</h2>
        <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {lesson.whatYouNeed.map((item) => (
            <li key={item} className="border border-base-800 bg-base-900/40 p-4 text-sm text-base-300">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-display text-white">Steps</h2>
        <ol className="mt-5 space-y-3">
          {lesson.steps.map((step, index) => (
            <li key={step} className="grid grid-cols-[auto_1fr] gap-4 border border-base-800 bg-base-900/40 p-4">
              <span className="font-mono text-xs text-base-500">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-sm leading-relaxed text-base-300">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-display text-white">Screenshot slots</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {lesson.screenshotSlots.map((slot) => (
            <div key={slot.target} className="border border-dashed border-base-700 bg-base-950/50 p-5">
              <p className="text-xs font-mono uppercase tracking-wider text-accent-cyan-bright">
                {slot.target}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-base-400">{slot.caption}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-display text-white">Copyable snippets</h2>
        <div className="mt-5">
          <SnippetCards snippets={lesson.snippets} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-base-800 bg-base-900/40 p-6">
          <h2 className="text-2xl font-display text-white">Checklist</h2>
          <ul className="mt-5 space-y-3">
            {lesson.checklist.map((item) => (
              <li key={item} className="border-l border-l-accent-green px-4 text-sm leading-relaxed text-base-300">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-base-800 bg-base-900/40 p-6">
          <h2 className="text-2xl font-display text-white">Done when</h2>
          <ul className="mt-5 space-y-3">
            {lesson.doneWhen.map((item) => (
              <li key={item} className="border-l border-l-accent-violet px-4 text-sm leading-relaxed text-base-300">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {lesson.nextLessonSlug ? (
        <div className="border-t border-base-800 pt-6">
          <a href={`/academy/avatar-content-system/course/${lesson.nextLessonSlug}`} className={primaryLinkClass}>
            Next lesson
          </a>
        </div>
      ) : null}
    </article>
  );
}
