import { useEffect, useState } from "react";
import {
  fetchShopOrders,
  formatShopMoney,
  orderStatusText,
  type ShopOrder,
} from "@/lib/shop-orders";

export default function AccountOrdersCard() {
  const [orders, setOrders] = useState<ShopOrder[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetchShopOrders()
      .then(setOrders)
      .catch(() => setFailed(true));
  }, []);

  return (
    <section className="border border-base-800 p-6" aria-labelledby="account-orders-heading">
      <p className="font-mono text-xs uppercase tracking-wider text-accent-500">
        Direct shop
      </p>
      <h2 id="account-orders-heading" className="mt-2 font-display text-xl text-white">
        Orders
      </h2>
      {failed ? (
        <p className="mt-4 text-sm text-base-400">
          The order ledger is unavailable right now.
        </p>
      ) : orders === null ? (
        <p className="mt-4 font-mono text-xs text-base-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-sm text-base-400">
          Direct HobFarm purchases will appear here.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-base-800">
          {orders.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="font-mono text-xs text-white">{order.publicId}</p>
                <p className="mt-1 text-xs text-base-400">{orderStatusText(order)}</p>
              </div>
              <p className="text-sm text-white">
                {formatShopMoney(order.totalAmount, order.currency)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
