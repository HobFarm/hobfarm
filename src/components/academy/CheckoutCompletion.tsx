import { useEffect, useState } from "react";

type State =
  | { kind: "checking"; message: string }
  | { kind: "ready"; courseUrl: string }
  | { kind: "error"; message: string };

export default function CheckoutCompletion({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<State>({
    kind: "checking",
    message: "Stripe has returned you to HobFarm. Waiting for the verified payment event…",
  });

  useEffect(() => {
    let stopped = false;
    let attempt = 0;
    const check = async () => {
      try {
        const response = await fetch(`/api/academy/checkout-status?session_id=${encodeURIComponent(sessionId)}`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        const data = await response.json() as { status?: string; course_url?: string; error?: string };
        if (stopped) return;
        if (response.ok && data.status === "paid" && data.course_url) {
          setState({ kind: "ready", courseUrl: data.course_url });
          window.dispatchEvent(new CustomEvent("hobfarm:analytics", {
            detail: { name: "academy_checkout_complete", courseId: "avatar-content-system" },
          }));
          return;
        }
        if (response.status === 401) {
          setState({ kind: "error", message: "Sign in with the account used at checkout so HobFarm can verify access." });
          return;
        }
        if (attempt++ < 10) {
          setTimeout(check, 1500 + attempt * 250);
          return;
        }
        setState({ kind: "error", message: "Payment is still being verified. Your receipt is not an access grant; check Account again shortly or use Customer Help." });
      } catch {
        if (!stopped) setState({ kind: "error", message: "HobFarm could not reach the entitlement check. No second payment is needed." });
      }
    };
    void check();
    return () => { stopped = true; };
  }, [sessionId]);

  if (state.kind === "ready") {
    return (
      <section className="border border-accent-green/40 bg-base-900/60 p-6" aria-live="polite">
        <p className="text-xs font-mono uppercase tracking-wider text-accent-green-bright">Access ready</p>
        <h2 className="mt-4 text-2xl font-display text-white">The permanent course grant is attached to your account.</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="rounded-full bg-accent-500 px-4 py-2 text-xs font-medium text-base-950" href={state.courseUrl}>Open the course</a>
          <a className="rounded-full border border-base-700 px-4 py-2 text-xs text-base-300" href="/account/">View Account</a>
        </div>
      </section>
    );
  }
  return (
    <section className="border border-base-800 bg-base-900/60 p-6" aria-live="polite">
      <p className="text-xs font-mono uppercase tracking-wider text-base-500">
        {state.kind === "checking" ? "Verifying purchase" : "Verification needs attention"}
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-base-300">{state.message}</p>
      {state.kind === "error" ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="text-sm text-white underline" href="/account/">Check Account</a>
          <a className="text-sm text-white underline" href="/helpcenter/">Customer Help</a>
        </div>
      ) : null}
    </section>
  );
}
