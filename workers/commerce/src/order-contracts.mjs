import { normalizeCheckoutCart } from "./checkout.mjs";

const SAFE_ID = /^[A-Za-z0-9_-]{8,160}$/;
const TAX_MODES = new Set(["stripe-tax", "not-collecting"]);
const CATALOG_REVISION = "hat-v1";

function contractError(code, message) {
  return Object.assign(new Error(message), { code });
}

function requiredString(value, field, max = 200) {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!normalized || normalized.length > max) {
    throw contractError("invalid_contract", `Invalid ${field}.`);
  }
  return normalized;
}

export function normalizeReserveOrder(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw contractError("invalid_contract", "Invalid order reservation.");
  }
  const checkoutToken = requiredString(input.checkoutToken, "checkoutToken", 64);
  const userId = requiredString(input.userId, "userId", 160);
  const email = requiredString(input.email, "email", 320).toLowerCase();
  const taxMode = requiredString(input.taxMode, "taxMode", 32);
  if (!SAFE_ID.test(userId) || !TAX_MODES.has(taxMode)) {
    throw contractError("invalid_contract", "Invalid order reservation.");
  }

  const cart = normalizeCheckoutCart(input.items);
  return {
    checkoutToken,
    userId,
    email,
    taxMode,
    catalogRevision: CATALOG_REVISION,
    cart,
  };
}

export function normalizeStripePaidEvent(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw contractError("invalid_contract", "Invalid payment event.");
  }
  const eventId = requiredString(input.eventId, "eventId");
  const eventType = requiredString(input.eventType, "eventType");
  const orderId = requiredString(input.orderId, "orderId");
  const stripeSessionId = requiredString(input.stripeSessionId, "stripeSessionId");
  const paymentIntentId = requiredString(input.paymentIntentId, "paymentIntentId");
  const stripeCustomerId =
    typeof input.stripeCustomerId === "string" && input.stripeCustomerId.trim()
      ? input.stripeCustomerId.trim()
      : null;
  const currency = requiredString(input.currency, "currency", 3).toUpperCase();
  const cartFingerprint = requiredString(
    input.cartFingerprint,
    "cartFingerprint",
    2000,
  );
  const catalogRevision = requiredString(input.catalogRevision, "catalogRevision", 64);
  const amounts = {
    merchandiseSubtotalAmount: input.merchandiseSubtotalAmount,
    shippingAmount: input.shippingAmount,
    taxAmount: input.taxAmount,
    totalAmount: input.totalAmount,
  };
  if (
    currency !== "USD" ||
    Object.values(amounts).some(
      (amount) => !Number.isInteger(amount) || amount < 0,
    )
  ) {
    throw contractError("invalid_contract", "Invalid payment amounts.");
  }

  return {
    eventId,
    eventType,
    eventCreated:
      Number.isInteger(input.eventCreated) && input.eventCreated > 0
        ? input.eventCreated
        : Math.floor(Date.now() / 1000),
    orderId,
    stripeSessionId,
    paymentIntentId,
    stripeCustomerId,
    currency,
    cartFingerprint,
    catalogRevision,
    ...amounts,
    recipient: normalizeRecipient(input.recipient),
  };
}

export function normalizeRecipient(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw contractError("invalid_recipient", "Shipping details are missing.");
  }
  const countryCode = requiredString(input.countryCode, "countryCode", 2).toUpperCase();
  const stateCode = requiredString(input.stateCode, "stateCode", 3).toUpperCase();
  const postalCode = requiredString(input.postalCode, "postalCode", 16);
  if (countryCode !== "US" || !/^[A-Z]{2}$/.test(stateCode)) {
    throw contractError("invalid_recipient", "Only U.S. shipping is supported.");
  }

  return {
    name: requiredString(input.name, "name"),
    company:
      typeof input.company === "string" && input.company.trim()
        ? input.company.trim().slice(0, 200)
        : null,
    address1: requiredString(input.address1, "address1"),
    address2:
      typeof input.address2 === "string" && input.address2.trim()
        ? input.address2.trim().slice(0, 200)
        : null,
    city: requiredString(input.city, "city"),
    stateCode,
    countryCode,
    postalCode,
    email: requiredString(input.email, "email", 320).toLowerCase(),
    phone:
      typeof input.phone === "string" && input.phone.trim()
        ? input.phone.trim().slice(0, 40)
        : null,
  };
}

export function assertPaidEventMatchesOrder(event, order) {
  if (
    order.id !== event.orderId ||
    order.currency !== event.currency ||
    order.catalog_revision !== event.catalogRevision ||
    order.cart_fingerprint !== event.cartFingerprint ||
    order.merchandise_subtotal_amount !== event.merchandiseSubtotalAmount ||
    order.shipping_amount !== event.shippingAmount ||
    event.totalAmount !==
      event.merchandiseSubtotalAmount + event.shippingAmount + event.taxAmount
  ) {
    throw contractError("payment_mismatch", "Stripe payment did not match the order.");
  }
}

export function centsToDecimal(amount) {
  if (!Number.isInteger(amount) || amount < 0) {
    throw contractError("invalid_amount", "Invalid currency amount.");
  }
  return (amount / 100).toFixed(2);
}

export const ORDER_CATALOG_REVISION = CATALOG_REVISION;
