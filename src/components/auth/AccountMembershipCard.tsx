import { useEffect, useState } from "react";
import { fetchSubscription, type SubscriptionPayload } from "@/lib/auth";

const primaryLinkClass =
  "inline-flex items-center justify-center gap-2 text-center rounded-full font-medium shadow-dimensional " +
  "text-base-950 bg-linear-to-t from-accent-600 to-accent-500 " +
  "hover:from-accent-500 hover:to-accent-600 focus:outline focus:outline-accent-500 " +
  "h-9 px-4 py-2 text-xs";

const secondaryLinkClass =
  "inline-flex items-center justify-center text-xs font-mono text-base-400 hover:text-white transition-colors underline decoration-base-700 underline-offset-4";

const ACTIVE = new Set(["active", "trialing"]);
const PROBLEM = new Set(["past_due", "unpaid", "paused", "incomplete"]);

function formatDate(unixSeconds: number | null | undefined): string | null {
  if (!unixSeconds) return null;
  try {
    return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

export default function AccountMembershipCard() {
  const [sub, setSub] = useState<SubscriptionPayload | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchSubscription().then((s) => {
      setSub(s ?? { status: "none" });
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return (
      <div className="border border-base-800 p-6 min-h-[120px]">
        <p className="text-xs font-mono text-base-500">Loading...</p>
      </div>
    );
  }

  const status = sub?.status ?? "none";
  const isActive = ACTIVE.has(status);
  const hasProblem = PROBLEM.has(status);
  const cancels = sub?.cancel_at_period_end ? formatDate(sub.cancel_at) : null;
  const renews = isActive && !sub?.cancel_at_period_end ? formatDate(sub?.current_period_end) : null;

  return (
    <div className="border border-base-800 p-6 space-y-4">
      <p className="text-xs font-mono text-accent-500 uppercase tracking-wider">Membership</p>

      {isActive ? (
        <div className="space-y-3">
          <p className="text-sm text-white">
            Supporter membership <span className="text-accent-500">active</span>.
          </p>
          {cancels ? (
            <p className="text-xs text-base-400">Cancels on {cancels}.</p>
          ) : renews ? (
            <p className="text-xs text-base-400">Renews on {renews}.</p>
          ) : null}
          <div className="flex items-center gap-4 pt-2">
            <a href="/membership" className={secondaryLinkClass}>
              Manage subscription
            </a>
          </div>
        </div>
      ) : hasProblem ? (
        <div className="space-y-3">
          <p className="text-sm text-white">
            Membership status: <span className="text-amber-400">{status.replace("_", " ")}</span>.
          </p>
          <p className="text-xs text-base-400">
            Visit the membership page to manage your subscription.
          </p>
          <div className="pt-2">
            <a href="/membership" className={primaryLinkClass}>
              Manage subscription
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-base-300">
            Support the project for $5/month. Optional, cancel any time.
          </p>
          <div className="pt-2">
            <a href="/membership" className={primaryLinkClass}>
              Become a supporter ($5/mo)
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
