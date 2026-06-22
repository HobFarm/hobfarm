import type { UserPayload, SubscriptionPayload } from "@/lib/auth";

interface Props {
  user: UserPayload | null;
  subscription: SubscriptionPayload | null;
}

const PRIMARY_GREEN =
  "inline-flex items-center justify-center gap-2 text-center rounded-full font-medium shadow-dimensional " +
  "text-base-950 bg-linear-to-t from-accent-600 to-accent-500 " +
  "hover:from-accent-500 hover:to-accent-600 focus:outline focus:outline-accent-500 " +
  "h-9 px-4 py-2 text-xs";

const MUTED_LINK_BTN =
  "inline-flex items-center justify-center gap-2 text-center rounded-full font-medium " +
  "text-white border border-base-700 hover:border-base-500 " +
  "h-9 px-4 py-2 text-xs";

const offerings = [
  {
    title: "Supporter Membership",
    description:
      "$5/month. Optional. Funds infrastructure, API costs, and tool work. Member-only updates and experiments where applicable. Cancel any time.",
  },
  {
    title: "Digital Asset Packs",
    description:
      "Downloadable gallery packs, process files, prompt packs, character concepts, cover concepts, templates, and other visual assets for creator workflows.",
  },
  {
    title: "Courses and Process Files",
    description:
      "Educational material covering AI-assisted character art, visual systems, prompt compilation, media pipelines, and creative production workflows.",
  },
  {
    title: "Custom Creative Work",
    description:
      "Commissioned concept development, cover exploration, visual direction, workflow consulting, or AI-assisted production support when capacity allows.",
  },
  {
    title: "Marketplace Products",
    description:
      "Physical products, print-on-demand items, and external marketplace listings may be offered through third-party platforms with their own checkout and fulfillment rules.",
  },
];

function SubscribeCta({ user, subscription }: Props) {
  if (!user) {
    return (
      <>
        <a href="/login?next=/membership" className={PRIMARY_GREEN}>
          Sign in to support
        </a>
        <p className="mt-3 text-xs text-base-500 leading-relaxed">
          Sign in first; you'll come back here to finish checkout.
        </p>
      </>
    );
  }

  const isReturning = subscription?.status === "canceled" || subscription?.status === "incomplete_expired";
  return (
    <>
      <form action="/api/stripe/checkout" method="post">
        <input type="hidden" name="product" value="creative-membership" />
        <button type="submit" className={PRIMARY_GREEN}>
          {isReturning ? "Resubscribe ($5/mo)" : "Become a Supporter ($5/mo)"}
        </button>
      </form>
      <p className="mt-3 text-xs text-base-500 leading-relaxed">
        Cancel any time from the Stripe customer portal.
      </p>
    </>
  );
}

export default function OnboardingView({ user, subscription }: Props) {
  const showWelcomeBack = subscription?.status === "canceled";
  const cancelBanner =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("checkout") === "cancelled";

  return (
    <div>
      {showWelcomeBack ? (
        <div className="mb-8 border-l-2 border-l-accent-500 bg-base-900/40 px-5 py-4">
          <p className="text-sm text-white">Welcome back.</p>
          <p className="mt-1 text-xs text-base-400 leading-relaxed">
            Your supporter membership is cancelled. Resubscribe below any time.
          </p>
        </div>
      ) : null}

      {cancelBanner ? (
        <div className="mb-8 border-l-2 border-l-base-500 bg-base-900/40 px-5 py-4">
          <p className="text-xs text-base-300 leading-relaxed">
            Checkout cancelled. You can try again any time.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <span className="text-sm text-accent-500 font-mono">Membership</span>
          <h1 className="mt-10 text-4xl sm:text-4xl md:text-5xl lg:text-6xl text-white text-balance font-display">
            Support HobFarm.
          </h1>
          <p className="mt-4 max-w-3xl text-base text-base-400 leading-relaxed text-balance">
            HobFarm is free to use. Supporter membership is optional, $5 a month, and helps cover
            the infrastructure, API costs, and tool work that keep the projects running.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#subscribe" className={PRIMARY_GREEN}>
              {showWelcomeBack ? "Resubscribe" : "Start Membership Checkout"}
            </a>
            <a href="/legal/terms/" className={MUTED_LINK_BTN}>
              Read Terms
            </a>
          </div>
        </div>

        <aside id="subscribe" className="border-y border-base-800 py-6 lg:mt-12">
          <h2 className="text-sm text-white font-mono uppercase tracking-widest">
            Supporter Membership
          </h2>
          <p className="mt-4 text-sm text-base-400 leading-relaxed">
            $5/month, optional, cancel any time. Supports the project. Stripe handles payment
            collection, receipts, and billing.
          </p>
          <div className="mt-5">
            <SubscribeCta user={user} subscription={subscription} />
          </div>
        </aside>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        {offerings.map((offering) => (
          <section key={offering.title} className="border-t border-base-800 pt-5">
            <h2 className="text-xl md:text-xl lg:text-2xl text-white font-display">
              {offering.title}
            </h2>
            <p className="mt-3 text-sm text-base-400 leading-relaxed">{offering.description}</p>
          </section>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-8 border-t border-base-800 pt-10 md:grid-cols-3">
        <div>
          <h3 className="text-sm text-white font-mono uppercase tracking-widest">Delivery</h3>
          <p className="mt-3 text-sm text-base-400 leading-relaxed">
            Digital products are delivered by account access, download links, email, platform library,
            or the checkout provider used for the order.
          </p>
        </div>
        <div>
          <h3 className="text-sm text-white font-mono uppercase tracking-widest">Licensing</h3>
          <p className="mt-3 text-sm text-base-400 leading-relaxed">
            Product pages define the license. Unless stated otherwise, paid downloads are for your own
            creative production and cannot be resold as standalone packs.
          </p>
        </div>
        <div>
          <h3 className="text-sm text-white font-mono uppercase tracking-widest">Support</h3>
          <p className="mt-3 text-sm text-base-400 leading-relaxed">
            Payment, access, refund, and product questions go through the HobFarm support path.
          </p>
          <a
            href="/support/"
            className="mt-3 inline-block text-sm text-white underline decoration-base-600 underline-offset-4 hover:decoration-white"
          >
            Visit support
          </a>
        </div>
      </div>
    </div>
  );
}
