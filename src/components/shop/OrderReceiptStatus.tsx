import { useEffect, useState } from "react";
import {
  fetchShopOrders,
  formatShopMoney,
  orderStatusText,
  type ShopOrder,
} from "@/lib/shop-orders";

type State =
  | { kind: "loading" }
  | { kind: "ready"; order: ShopOrder }
  | { kind: "missing" }
  | { kind: "error"; loginRequired: boolean };

export default function OrderReceiptStatus() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) {
      setState({ kind: "missing" });
      return;
    }
    fetchShopOrders(sessionId)
      .then((orders) => {
        setState(
          orders[0]
            ? { kind: "ready", order: orders[0] }
            : { kind: "missing" },
        );
      })
      .catch((error) => {
        setState({
          kind: "error",
          loginRequired:
            error instanceof Error && error.message === "login_required",
        });
      });
  }, []);

  if (state.kind === "loading") {
    return (
      <div className="mt-8 border border-base-800 bg-base-900/40 p-5">
        <p className="font-mono text-xs text-base-400">Checking the order ledger...</p>
      </div>
    );
  }
  if (state.kind === "error") {
    return (
      <div className="mt-8 border border-amber-700/60 bg-amber-950/20 p-5">
        <p className="text-sm text-base-200">
          {state.loginRequired
            ? "Sign in with the account used at checkout to see this order."
            : "The order ledger is temporarily unavailable. Your Stripe receipt is still the payment record."}
        </p>
      </div>
    );
  }
  if (state.kind === "missing") {
    return (
      <div className="mt-8 border border-base-800 bg-base-900/40 p-5">
        <p className="text-sm text-base-300">
          No matching order is available for this account. Check the Stripe receipt before trying the cart again.
        </p>
      </div>
    );
  }

  const order = state.order;
  return (
    <section
      className="mt-8 border border-accent-800/70 bg-base-900/55 p-5"
      aria-labelledby="order-ledger-heading"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent-500">
        Order {order.publicId}
      </p>
      <h2 id="order-ledger-heading" className="mt-2 font-display text-xl text-white">
        {orderStatusText(order)}
      </h2>
      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-base-500">Total</dt>
          <dd className="mt-1 text-white">
            {formatShopMoney(order.totalAmount, order.currency)}
          </dd>
        </div>
        <div>
          <dt className="text-base-500">Payment</dt>
          <dd className="mt-1 capitalize text-white">
            {order.paymentStatus.replaceAll("_", " ")}
          </dd>
        </div>
      </dl>
    </section>
  );
}
