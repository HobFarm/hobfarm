import { useEffect, useMemo, useState } from "react";

interface AccountCourse {
  course_id: string;
  slug: string;
  title: string;
  href: string;
  continue_href: string;
  status: string;
  access_source: "public" | "purchase" | "manual" | "membership" | "none";
  completed_lessons: number;
  total_lessons: number;
  complete: boolean;
  repair_code: string;
}

interface AccessPayload {
  subscription: {
    status: string;
    current_period_end: number | null;
    cancel_at_period_end: number;
  } | null;
  active_membership: boolean;
  courses: AccountCourse[];
  purchases: Array<{
    purchase_id: string;
    product_key: string;
    provider: string;
    provider_order_id: string | null;
    amount: number;
    currency: string;
    status: string;
    paid_at: number | null;
  }>;
}

const linkClass = "text-sm text-white underline decoration-base-700 underline-offset-4 hover:decoration-white";

function formatDate(epoch: number | null | undefined): string | null {
  if (!epoch) return null;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(epoch * 1000));
}

export default function AccountAcademyCard() {
  const [data, setData] = useState<AccessPayload | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/academy/access", { credentials: "include", headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) throw new Error("academy_access_failed");
        return response.json() as Promise<AccessPayload>;
      })
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  const owned = useMemo(() => data?.courses.filter((course) => course.access_source === "purchase" || course.access_source === "manual") ?? [], [data]);
  const included = useMemo(() => data?.courses.filter((course) => course.access_source === "membership") ?? [], [data]);
  const free = useMemo(() => data?.courses.filter((course) => course.access_source === "public") ?? [], [data]);
  const continueCourse = data?.courses.find((course) => course.completed_lessons > 0 && !course.complete && course.access_source !== "none")
    ?? data?.courses.find((course) => course.access_source !== "none" && course.status === "available");

  return (
    <section className="border border-base-800 p-6" aria-labelledby="account-academy-heading">
      <p className="font-mono text-xs uppercase tracking-wider text-accent-500">Academy</p>
      <h2 id="account-academy-heading" className="mt-2 font-display text-xl text-white">Courses and progress</h2>
      {failed ? (
        <p className="mt-4 text-sm text-base-400">The Academy ledger is unavailable. Your recorded access has not been changed.</p>
      ) : !data ? (
        <p className="mt-4 font-mono text-xs text-base-500">Loading…</p>
      ) : (
        <div className="mt-5 space-y-6">
          {continueCourse ? (
            <div className="border border-accent-green/30 bg-base-900/50 p-4">
              <p className="text-xs font-mono uppercase tracking-wider text-accent-green-bright">Continue course</p>
              <a className={`mt-2 inline-block ${linkClass}`} href={continueCourse.continue_href}>{continueCourse.title}</a>
              <p className="mt-2 text-xs text-base-500">{continueCourse.completed_lessons} of {continueCourse.total_lessons} lessons complete</p>
            </div>
          ) : null}

          {data.subscription ? (
            <div>
              <p className="text-sm text-base-300">
                Membership: <span className="text-white">{data.subscription.status}</span>
                {formatDate(data.subscription.current_period_end) ? ` through ${formatDate(data.subscription.current_period_end)}` : ""}.
                {data.subscription.cancel_at_period_end ? " Access remains through the paid-through date." : ""}
              </p>
              <a className={`mt-2 inline-block ${linkClass}`} href="/membership/">Manage membership billing</a>
            </div>
          ) : null}

          {[{ label: "Purchased courses", courses: owned }, { label: "Included with membership", courses: included }, { label: "Free courses", courses: free }].map((group) => group.courses.length ? (
            <div key={group.label}>
              <h3 className="text-xs font-mono uppercase tracking-wider text-base-500">{group.label}</h3>
              <ul className="mt-2 divide-y divide-base-800">
                {group.courses.map((course) => (
                  <li key={course.course_id} className="py-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <a className={linkClass} href={course.href}>{course.title}</a>
                      <span className="text-xs text-base-500">{course.completed_lessons}/{course.total_lessons}</span>
                    </div>
                    <p className="mt-1 text-[11px] font-mono text-base-600">Support reference: {course.repair_code}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null)}

          {data.purchases.length ? (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-base-500">Purchase history</h3>
              <ul className="mt-2 space-y-2 text-xs text-base-400">
                {data.purchases.map((purchase) => (
                  <li key={purchase.purchase_id}>
                    {purchase.product_key} · {purchase.status} · {purchase.provider}
                    {purchase.paid_at ? ` · ${formatDate(purchase.paid_at)}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="text-xs leading-relaxed text-base-500">
            A permanent purchase stays with this account after membership ends. Membership unlocks included courses only while the membership is active.
          </p>
          <a className={linkClass} href="/helpcenter/">Customer Help for billing or access</a>
        </div>
      )}
    </section>
  );
}
