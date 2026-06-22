import { useEffect, useState } from "react";
import { fetchMe, fetchSubscription, type SubscriptionPayload, type UserPayload } from "@/lib/auth";
import OnboardingView from "./OnboardingView";
import MemberPortalView from "./MemberPortalView";

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; user: UserPayload | null; subscription: SubscriptionPayload | null };

// Statuses that put the user into the member portal view (something Stripe
// can still act on). Everything else falls back to onboarding, so a user
// with status "canceled" sees the resubscribe pitch.
const PORTAL_STATUSES = new Set(["active", "trialing", "past_due", "unpaid", "paused", "incomplete"]);

export default function MembershipPage() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await fetchMe();
      if (cancelled) return;
      if (!user) {
        setState({ kind: "ready", user: null, subscription: null });
        return;
      }
      const subscription = (await fetchSubscription()) ?? { status: "none" as const };
      if (cancelled) return;
      setState({ kind: "ready", user, subscription });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === "loading") {
    // Skeleton matches the onboarding header so most visitors (anonymous +
    // non-member) don't see layout shift when the real view renders.
    return (
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4" aria-hidden="true">
        <div className="lg:col-span-3 space-y-6">
          <div className="h-4 w-24 bg-base-800 animate-pulse rounded" />
          <div className="h-12 w-3/4 bg-base-800 animate-pulse rounded mt-10" />
          <div className="h-4 w-2/3 bg-base-800 animate-pulse rounded" />
        </div>
        <div className="lg:col-span-1">
          <div className="h-32 bg-base-800 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  const { user, subscription } = state;
  const showPortal = user && subscription && PORTAL_STATUSES.has(subscription.status);

  if (showPortal) {
    return <MemberPortalView user={user} subscription={subscription} />;
  }

  return <OnboardingView user={user} subscription={subscription} />;
}
