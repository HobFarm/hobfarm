import type { SubscriptionPayload, UserPayload } from "@/lib/auth";

interface Props {
  user: UserPayload;
  subscription: SubscriptionPayload;
}

const PRIMARY_GREEN =
  "inline-flex items-center justify-center gap-2 text-center rounded-full font-medium shadow-dimensional " +
  "text-base-950 bg-linear-to-t from-accent-600 to-accent-500 " +
  "hover:from-accent-500 hover:to-accent-600 focus:outline focus:outline-accent-500 " +
  "h-10 px-5 py-2 text-sm";

const SECONDARY_LINK =
  "inline-flex items-center justify-center text-xs font-mono text-base-400 hover:text-white transition-colors underline decoration-base-700 underline-offset-4";

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  trialing: "Trial",
  past_due: "Past due",
  unpaid: "Unpaid",
  paused: "Paused",
  incomplete: "Incomplete",
};

const STATUS_TONE: Record<string, string> = {
  active: "text-accent-500",
  trialing: "text-accent-500",
  past_due: "text-amber-400",
  unpaid: "text-amber-400",
  paused: "text-base-300",
  incomplete: "text-amber-400",
};

function formatDate(unixSeconds: number | null | undefined): string | null {
  if (!unixSeconds) return null;
  try {
    return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

export default function MemberPortalView({ user, subscription }: Props) {
  const status = subscription.status;
  const statusLabel = STATUS_LABEL[status] ?? status;
  const statusTone = STATUS_TONE[status] ?? "text-base-300";
  const cancels = subscription.cancel_at_period_end ? formatDate(subscription.cancel_at) : null;
  const renews = !subscription.cancel_at_period_end ? formatDate(subscription.current_period_end) : null;
  const hasProblem = status === "past_due" || status === "unpaid" || status === "incomplete";
  const isPaused = status === "paused";

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
      <header className="lg:col-span-3">
        <span className="text-sm text-accent-500 font-mono">Membership</span>
        <h1 className="mt-10 text-4xl sm:text-4xl md:text-5xl lg:text-6xl text-white text-balance font-display">
          Your membership
        </h1>
        <p className="mt-4 max-w-2xl text-base text-base-400 leading-relaxed">
          Thanks for supporting HobFarm. Manage billing, payment method, and cancellation
          through the Stripe customer portal.
        </p>
      </header>

      {hasProblem ? (
        <aside className="lg:col-span-3 border-l-2 border-l-amber-400 bg-base-900/40 px-5 py-4">
          <p className="text-sm text-white">Payment issue: {statusLabel.toLowerCase()}.</p>
          <p className="mt-2 text-xs text-base-400 leading-relaxed">
            Update your card or finish payment from the customer portal to keep your supporter status.
          </p>
        </aside>
      ) : null}

      {isPaused ? (
        <aside className="lg:col-span-3 border-l-2 border-l-base-500 bg-base-900/40 px-5 py-4">
          <p className="text-sm text-white">Subscription paused.</p>
          <p className="mt-2 text-xs text-base-400 leading-relaxed">
            Resume any time from the customer portal.
          </p>
        </aside>
      ) : null}

      <section className="lg:col-span-2 border border-base-800 p-6 space-y-5">
        <p className="text-xs font-mono text-accent-500 uppercase tracking-wider">Status</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-mono text-base-500">Tier</p>
            <p className="mt-1 text-sm text-white">Supporter</p>
          </div>
          <div>
            <p className="text-xs font-mono text-base-500">Status</p>
            <p className={`mt-1 text-sm ${statusTone}`}>{statusLabel}</p>
          </div>
          {renews ? (
            <div>
              <p className="text-xs font-mono text-base-500">Renews</p>
              <p className="mt-1 text-sm text-white">{renews}</p>
            </div>
          ) : null}
          {cancels ? (
            <div>
              <p className="text-xs font-mono text-base-500">Cancels</p>
              <p className="mt-1 text-sm text-white">{cancels}</p>
            </div>
          ) : null}
          <div>
            <p className="text-xs font-mono text-base-500">Account</p>
            <p className="mt-1 text-sm text-white font-mono break-all">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-5 pt-2">
          <form action="/api/stripe/portal" method="post">
            <button type="submit" className={PRIMARY_GREEN}>
              Manage billing
            </button>
          </form>
          <a href="/account" className={SECONDARY_LINK}>
            Account settings
          </a>
        </div>
      </section>

      <section className="lg:col-span-1 border border-base-800 p-6 space-y-4">
        <p className="text-xs font-mono text-accent-500 uppercase tracking-wider">Member content</p>
        <p className="text-sm text-base-300">Coming soon.</p>
        <p className="text-xs text-base-400 leading-relaxed">
          Private updates, research notes, StyleFusion experiments, and downloads will appear here
          as they ship.
        </p>
      </section>
    </div>
  );
}
