export interface ShopOrder {
  id: string;
  publicId: string;
  state: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  currency: string;
  merchandiseSubtotalAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  printfulStatus: string | null;
  hasTracking: boolean;
  createdAt: number;
  updatedAt: number;
}

export async function fetchShopOrders(sessionId?: string): Promise<ShopOrder[]> {
  const query = sessionId
    ? `?session_id=${encodeURIComponent(sessionId)}`
    : "";
  const response = await fetch(`/api/shop/orders${query}`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(
      response.status === 401 ? "login_required" : "orders_unavailable",
    );
  }
  const payload = (await response.json()) as { orders?: ShopOrder[] };
  return payload.orders ?? [];
}

export function formatShopMoney(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount / 100);
}

export function orderStatusText(order: ShopOrder): string {
  if (order.paymentStatus === "failed") return "Payment failed";
  if (order.paymentStatus === "refunded") return "Refunded";
  if (order.fulfillmentStatus === "fulfilled") return "Shipped";
  if (
    order.fulfillmentStatus === "submitted" ||
    order.fulfillmentStatus === "provider_active"
  ) {
    return "In production";
  }
  if (order.fulfillmentStatus === "awaiting_confirmation") {
    return "Awaiting production approval";
  }
  if (order.paymentStatus === "paid") return "Payment confirmed";
  return "Awaiting payment";
}
