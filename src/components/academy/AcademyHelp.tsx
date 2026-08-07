import { useMemo, useState } from "react";
import { academyFaq } from "@/data/academy-faq";
import { academyCourseManifests } from "@/data/academy-manifest";

export default function AcademyHelp() {
  const [query, setQuery] = useState("");
  const [courseSlug, setCourseSlug] = useState("");
  const [lessonSlug, setLessonSlug] = useState("");
  const [category, setCategory] = useState("content");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const selectedCourse = academyCourseManifests.find((course) => course.slug === courseSlug);
  const items = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return academyFaq.filter((item) => {
      if (courseSlug && item.courseSlug && item.courseSlug !== courseSlug) return false;
      const haystack = `${item.question} ${item.answer}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [courseSlug, query]);

  const submit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!courseSlug || question.trim().length < 10) return;
    setSending(true);
    setResult(null);
    try {
      const response = await fetch("/api/academy/questions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ course_slug: courseSlug, lesson_slug: lessonSlug || undefined, category, question }),
      });
      const data = await response.json() as { error?: string };
      if (response.ok) {
        setQuestion("");
        setResult("Question saved for course review. This is not a live chat or an automatic support ticket.");
        window.dispatchEvent(new CustomEvent("hobfarm:analytics", { detail: { name: "academy_question_submitted", courseId: courseSlug } }));
        window.dispatchEvent(new CustomEvent("hobfarm:analytics", { detail: { name: "academy_question_unresolved", courseId: courseSlug } }));
      } else if (response.status === 401) {
        setResult("Sign in before sending a course-content question. Billing and access problems belong in Customer Help.");
      } else if (response.status === 429) {
        setResult("Too many questions were sent recently. Wait before trying again.");
      } else {
        setResult(data.error ?? "The question could not be saved.");
      }
    } catch {
      setResult("The question report could not reach HobFarm.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-12">
      <section aria-labelledby="faq-heading" data-event="academy_help_open">
        <div className="grid gap-3 md:grid-cols-[1fr_15rem]">
          <label className="block text-xs font-mono uppercase tracking-wider text-base-500">
            Search Academy help
            <input className="mt-2 w-full border border-base-700 bg-base-950 px-3 py-3 text-sm text-white" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="progress, refund, tools, membership…" />
          </label>
          <label className="block text-xs font-mono uppercase tracking-wider text-base-500">
            Course
            <select className="mt-2 w-full border border-base-700 bg-base-950 px-3 py-3 text-sm text-white" value={courseSlug} onChange={(event) => { setCourseSlug(event.target.value); setLessonSlug(""); }}>
              <option value="">All courses</option>
              {academyCourseManifests.map((course) => <option key={course.courseId} value={course.slug}>{course.title}</option>)}
            </select>
          </label>
        </div>
        <h2 id="faq-heading" className="mt-8 text-3xl font-display text-white">Questions with current answers</h2>
        <div className="mt-5 space-y-3">
          {items.length ? items.map((item) => (
            <details key={item.id} className="border border-base-800 bg-base-900/50 p-4">
              <summary className="cursor-pointer text-sm font-medium text-white">{item.question}</summary>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-base-400">{item.answer}</p>
              {item.route ? <a className="mt-3 inline-block text-sm text-accent-cyan-bright underline" href={item.route}>Open the related page</a> : null}
            </details>
          )) : <p className="text-sm text-base-400">No current FAQ matches. Use the structured report below for a course-content gap.</p>}
        </div>
      </section>

      <section className="border border-base-800 bg-base-900/40 p-6" aria-labelledby="missing-answer-heading">
        <p className="text-xs font-mono uppercase tracking-wider text-accent-violet-bright">Course improvement report</p>
        <h2 id="missing-answer-heading" className="mt-3 text-2xl font-display text-white">This lesson did not answer my question</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-base-400">Use this for a missing explanation, example, or tool note. Use <a className="text-white underline" href="/helpcenter/">Customer Help</a> for billing, sign-in, refunds, or missing access. The form requires a signed-in account and stores the question privately for course review.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4" data-event="academy_question_report_start">
          <label className="text-xs font-mono uppercase tracking-wider text-base-500">Course
            <select required className="mt-2 w-full border border-base-700 bg-base-950 px-3 py-3 text-sm text-white" value={courseSlug} onChange={(event) => { setCourseSlug(event.target.value); setLessonSlug(""); }}>
              <option value="">Choose a course</option>
              {academyCourseManifests.map((course) => <option key={course.courseId} value={course.slug}>{course.title}</option>)}
            </select>
          </label>
          <label className="text-xs font-mono uppercase tracking-wider text-base-500">Lesson (optional)
            <select className="mt-2 w-full border border-base-700 bg-base-950 px-3 py-3 text-sm text-white" value={lessonSlug} onChange={(event) => setLessonSlug(event.target.value)} disabled={!selectedCourse}>
              <option value="">Course-wide</option>
              {selectedCourse?.lessons.map((lesson) => <option key={lesson.lessonId} value={lesson.slug}>{lesson.title}</option>)}
            </select>
          </label>
          <label className="text-xs font-mono uppercase tracking-wider text-base-500">Kind of gap
            <select className="mt-2 w-full border border-base-700 bg-base-950 px-3 py-3 text-sm text-white" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="content">Explanation or example</option><option value="tool">Tool detail</option><option value="access">Access instructions</option><option value="other">Other course gap</option>
            </select>
          </label>
          <label className="text-xs font-mono uppercase tracking-wider text-base-500">Unanswered question
            <textarea required minLength={10} maxLength={2000} rows={6} className="mt-2 w-full border border-base-700 bg-base-950 px-3 py-3 text-sm text-white" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What decision or step was still unclear? Do not include payment details or private source material." />
          </label>
          <button disabled={sending} className="w-fit rounded-full bg-accent-500 px-4 py-2 text-xs font-medium text-base-950 disabled:opacity-50" type="submit">{sending ? "Saving…" : "Send course question"}</button>
          {result ? <p className="text-sm text-base-300" role="status">{result}</p> : null}
        </form>
      </section>
    </div>
  );
}
