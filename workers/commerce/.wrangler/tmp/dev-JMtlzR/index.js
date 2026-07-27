var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/catalog.mjs
var MELTING_RABBIT_HOLE_DAD_HAT = Object.freeze({
  productCode: "melting-rabbit-hole-dad-hat",
  targetStoreName: "HobFarm Shop",
  templateTitle: "Melting Rabbit Hole Dad Hat",
  catalogProductName: "Classic Dad Hat | Yupoong 6245CM",
  productType: "pod",
  printful: Object.freeze({
    storeId: 18510634,
    syncProductId: 451053848,
    externalProductId: "6a62b8350f3ed8",
    catalogProductId: 206,
    artworkFileId: 1026860006,
    artworkUrl: "https://cdn.hob.farm/products/melting-rabbit-hole-dad-hat/melting-rabbit-icon-light.png",
    placement: "front_dtf_hat",
    technique: "dtfilm",
    variants: Object.freeze([
      Object.freeze({
        variantCode: "black",
        name: "Black",
        syncVariantId: 5410564851,
        externalVariantId: "6a62b8350f3f39",
        catalogVariantId: 7854,
        sku: "6A62B8350EE53_Black",
        retailAmount: 2499,
        currency: "USD",
        availabilityStatus: "active"
      }),
      Object.freeze({
        variantCode: "dark-grey",
        name: "Dark Grey",
        syncVariantId: 5410564852,
        externalVariantId: "6a62b8350f3f66",
        catalogVariantId: 12736,
        sku: "6A62B8350EE53_Dark-Grey",
        retailAmount: 2499,
        currency: "USD",
        availabilityStatus: "active"
      })
    ])
  }),
  suppliedSpecification: Object.freeze({
    colors: Object.freeze(["Black", "Dark Grey"]),
    size: "One size",
    technique: "DTF printing",
    placement: "Front print",
    suppliedBaseCostAmount: 1375,
    suppliedBaseCostCurrency: "USD"
  }),
  launch: Object.freeze({
    enabled: false,
    reason: "Waiting for sample approval and a payment-to-fulfillment rehearsal."
  }),
  shipping: Object.freeze({
    destinationCountries: Object.freeze(["US"]),
    service: "STANDARD",
    freeShippingThresholdAmount: 4900,
    standardShippingAmount: 449,
    currency: "USD"
  })
});

// src/shipping.mjs
var MAX_QUANTITY_PER_LINE = 10;
var MAX_CART_LINES = 20;
function requireMinorUnitAmount(value, field) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError(`${field} must be a non-negative integer`);
  }
}
__name(requireMinorUnitAmount, "requireMinorUnitAmount");
function calculateThresholdShipping(lines, policy) {
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_CART_LINES) {
    throw new TypeError(`cart must contain between 1 and ${MAX_CART_LINES} lines`);
  }
  requireMinorUnitAmount(
    policy.freeShippingThresholdAmount,
    "freeShippingThresholdAmount"
  );
  requireMinorUnitAmount(policy.standardShippingAmount, "standardShippingAmount");
  const merchandiseSubtotalAmount = lines.reduce((subtotal, line, index) => {
    requireMinorUnitAmount(line.unitAmount, `lines[${index}].unitAmount`);
    if (!Number.isSafeInteger(line.quantity) || line.quantity < 1 || line.quantity > MAX_QUANTITY_PER_LINE) {
      throw new TypeError(
        `lines[${index}].quantity must be an integer between 1 and ${MAX_QUANTITY_PER_LINE}`
      );
    }
    const lineAmount = line.unitAmount * line.quantity;
    if (!Number.isSafeInteger(lineAmount)) {
      throw new RangeError(`lines[${index}] amount exceeds the safe integer range`);
    }
    return subtotal + lineAmount;
  }, 0);
  if (!Number.isSafeInteger(merchandiseSubtotalAmount)) {
    throw new RangeError("cart subtotal exceeds the safe integer range");
  }
  const qualifiesForFreeShipping = merchandiseSubtotalAmount >= policy.freeShippingThresholdAmount;
  return Object.freeze({
    merchandiseSubtotalAmount,
    shippingAmount: qualifiesForFreeShipping ? 0 : policy.standardShippingAmount,
    qualifiesForFreeShipping,
    amountUntilFreeShipping: qualifiesForFreeShipping ? 0 : policy.freeShippingThresholdAmount - merchandiseSubtotalAmount
  });
}
__name(calculateThresholdShipping, "calculateThresholdShipping");

// src/checkout.mjs
var MAX_CART_LINES2 = 8;
var MAX_ITEM_QUANTITY = 5;
var MAX_TOTAL_QUANTITY = 10;
var CART_LINE_FIELDS = /* @__PURE__ */ new Set(["productCode", "variantCode", "quantity"]);
var products = /* @__PURE__ */ new Map([
  [MELTING_RABBIT_HOLE_DAD_HAT.productCode, MELTING_RABBIT_HOLE_DAD_HAT]
]);
function invalidCart(message) {
  const error = new Error(message);
  error.code = "invalid_cart";
  return error;
}
__name(invalidCart, "invalidCart");
function variantKey(productCode, variantCode) {
  return `${productCode}:${variantCode}`;
}
__name(variantKey, "variantKey");
function normalizeCheckoutCart(input, { requireLaunch = true } = {}) {
  if (!Array.isArray(input) || input.length === 0) {
    throw invalidCart("The cart is empty.");
  }
  if (input.length > MAX_CART_LINES2) {
    throw invalidCart("The cart has too many lines.");
  }
  const normalizedByVariant = /* @__PURE__ */ new Map();
  for (const line of input) {
    if (!line || typeof line !== "object" || Array.isArray(line)) {
      throw invalidCart("Every cart line must be an object.");
    }
    if (Object.keys(line).some((key2) => !CART_LINE_FIELDS.has(key2))) {
      throw invalidCart("A cart line contains an unsupported field.");
    }
    const productCode = typeof line.productCode === "string" ? line.productCode.trim() : "";
    const variantCode = typeof line.variantCode === "string" ? line.variantCode.trim() : "";
    const quantity = line.quantity;
    if (!productCode || !variantCode || !Number.isInteger(quantity)) {
      throw invalidCart("A cart line is missing a product, variant, or whole-number quantity.");
    }
    if (quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
      throw invalidCart(`Each variant quantity must be between 1 and ${MAX_ITEM_QUANTITY}.`);
    }
    const product = products.get(productCode);
    if (!product) throw invalidCart("The cart contains an unknown product.");
    if (requireLaunch && !product.launch.enabled) {
      const error = new Error("This product is not open for checkout.");
      error.code = "product_not_launched";
      throw error;
    }
    const variant = product.printful.variants.find(
      (candidate) => candidate.variantCode === variantCode
    );
    if (!variant || variant.availabilityStatus !== "active") {
      throw invalidCart("The cart contains an unavailable variant.");
    }
    const key = variantKey(productCode, variantCode);
    const previous = normalizedByVariant.get(key);
    const combinedQuantity = (previous?.quantity ?? 0) + quantity;
    if (combinedQuantity > MAX_ITEM_QUANTITY) {
      throw invalidCart(`Each variant quantity must be between 1 and ${MAX_ITEM_QUANTITY}.`);
    }
    normalizedByVariant.set(key, {
      productCode,
      productName: product.templateTitle,
      variantCode,
      variantName: variant.name,
      sku: variant.sku,
      unitAmount: variant.retailAmount,
      currency: variant.currency,
      quantity: combinedQuantity
    });
  }
  const lines = [...normalizedByVariant.values()].sort(
    (a, b) => variantKey(a.productCode, a.variantCode).localeCompare(
      variantKey(b.productCode, b.variantCode)
    )
  );
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  if (totalQuantity > MAX_TOTAL_QUANTITY) {
    throw invalidCart(`The cart may contain at most ${MAX_TOTAL_QUANTITY} items.`);
  }
  const currencies = new Set(lines.map((line) => line.currency));
  if (currencies.size !== 1 || !currencies.has("USD")) {
    throw invalidCart("The cart must use one supported currency.");
  }
  const shipping = calculateThresholdShipping(lines, {
    freeShippingThresholdAmount: MELTING_RABBIT_HOLE_DAD_HAT.shipping.freeShippingThresholdAmount,
    standardShippingAmount: MELTING_RABBIT_HOLE_DAD_HAT.shipping.standardShippingAmount
  });
  return {
    lines,
    currency: "USD",
    ...shipping,
    totalAmount: shipping.merchandiseSubtotalAmount + shipping.shippingAmount
  };
}
__name(normalizeCheckoutCart, "normalizeCheckoutCart");
function checkoutCartFingerprint(cart) {
  return cart.lines.map(
    (line) => `${line.productCode}:${line.variantCode}:${line.quantity}:${line.unitAmount}`
  ).join("|");
}
__name(checkoutCartFingerprint, "checkoutCartFingerprint");

// src/crypto.ts
function bytesToBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
__name(bytesToBase64, "bytesToBase64");
function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}
__name(base64ToBytes, "base64ToBytes");
async function importDataKey(encodedKey) {
  const bytes = base64ToBytes(encodedKey);
  if (bytes.byteLength !== 32) {
    throw new Error("COMMERCE_DATA_KEY must be a base64-encoded 32-byte key");
  }
  return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, [
    "encrypt",
    "decrypt"
  ]);
}
__name(importDataKey, "importDataKey");
async function encryptJson(value, encodedKey) {
  const key = await importDataKey(encodedKey);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(value));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
  return {
    ciphertext: bytesToBase64(new Uint8Array(encrypted)),
    iv: bytesToBase64(iv)
  };
}
__name(encryptJson, "encryptJson");
async function decryptJson(ciphertext, iv, encodedKey) {
  const key = await importDataKey(encodedKey);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(iv) },
    key,
    base64ToBytes(ciphertext)
  );
  return JSON.parse(new TextDecoder().decode(decrypted));
}
__name(decryptJson, "decryptJson");
async function sha256Hex(value) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
__name(sha256Hex, "sha256Hex");

// src/order-contracts.mjs
var SAFE_ID = /^[A-Za-z0-9_-]{8,160}$/;
var TAX_MODES = /* @__PURE__ */ new Set(["stripe-tax", "not-collecting"]);
var CATALOG_REVISION = "hat-v1";
function contractError(code, message) {
  return Object.assign(new Error(message), { code });
}
__name(contractError, "contractError");
function requiredString(value, field, max = 200) {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!normalized || normalized.length > max) {
    throw contractError("invalid_contract", `Invalid ${field}.`);
  }
  return normalized;
}
__name(requiredString, "requiredString");
function normalizeReserveOrder(input) {
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
    cart
  };
}
__name(normalizeReserveOrder, "normalizeReserveOrder");
function normalizeStripePaidEvent(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw contractError("invalid_contract", "Invalid payment event.");
  }
  const eventId = requiredString(input.eventId, "eventId");
  const eventType = requiredString(input.eventType, "eventType");
  const orderId = requiredString(input.orderId, "orderId");
  const stripeSessionId = requiredString(input.stripeSessionId, "stripeSessionId");
  const paymentIntentId = requiredString(input.paymentIntentId, "paymentIntentId");
  const stripeCustomerId = typeof input.stripeCustomerId === "string" && input.stripeCustomerId.trim() ? input.stripeCustomerId.trim() : null;
  const currency = requiredString(input.currency, "currency", 3).toUpperCase();
  const cartFingerprint = requiredString(
    input.cartFingerprint,
    "cartFingerprint",
    2e3
  );
  const catalogRevision = requiredString(input.catalogRevision, "catalogRevision", 64);
  const amounts = {
    merchandiseSubtotalAmount: input.merchandiseSubtotalAmount,
    shippingAmount: input.shippingAmount,
    taxAmount: input.taxAmount,
    totalAmount: input.totalAmount
  };
  if (currency !== "USD" || Object.values(amounts).some(
    (amount) => !Number.isInteger(amount) || amount < 0
  )) {
    throw contractError("invalid_contract", "Invalid payment amounts.");
  }
  return {
    eventId,
    eventType,
    eventCreated: Number.isInteger(input.eventCreated) && input.eventCreated > 0 ? input.eventCreated : Math.floor(Date.now() / 1e3),
    orderId,
    stripeSessionId,
    paymentIntentId,
    stripeCustomerId,
    currency,
    cartFingerprint,
    catalogRevision,
    ...amounts,
    recipient: normalizeRecipient(input.recipient)
  };
}
__name(normalizeStripePaidEvent, "normalizeStripePaidEvent");
function normalizeRecipient(input) {
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
    company: typeof input.company === "string" && input.company.trim() ? input.company.trim().slice(0, 200) : null,
    address1: requiredString(input.address1, "address1"),
    address2: typeof input.address2 === "string" && input.address2.trim() ? input.address2.trim().slice(0, 200) : null,
    city: requiredString(input.city, "city"),
    stateCode,
    countryCode,
    postalCode,
    email: requiredString(input.email, "email", 320).toLowerCase(),
    phone: typeof input.phone === "string" && input.phone.trim() ? input.phone.trim().slice(0, 40) : null
  };
}
__name(normalizeRecipient, "normalizeRecipient");
function assertPaidEventMatchesOrder(event, order) {
  if (order.id !== event.orderId || order.currency !== event.currency || order.catalog_revision !== event.catalogRevision || order.cart_fingerprint !== event.cartFingerprint || order.merchandise_subtotal_amount !== event.merchandiseSubtotalAmount || order.shipping_amount !== event.shippingAmount || event.totalAmount !== event.merchandiseSubtotalAmount + event.shippingAmount + event.taxAmount) {
    throw contractError("payment_mismatch", "Stripe payment did not match the order.");
  }
}
__name(assertPaidEventMatchesOrder, "assertPaidEventMatchesOrder");
function centsToDecimal(amount) {
  if (!Number.isInteger(amount) || amount < 0) {
    throw contractError("invalid_amount", "Invalid currency amount.");
  }
  return (amount / 100).toFixed(2);
}
__name(centsToDecimal, "centsToDecimal");

// src/orders.ts
function compactUuid() {
  return crypto.randomUUID().replaceAll("-", "");
}
__name(compactUuid, "compactUuid");
function orderView(row) {
  return {
    id: row.id,
    publicId: row.public_id,
    state: row.state,
    paymentStatus: row.payment_status,
    fulfillmentStatus: row.fulfillment_status,
    currency: row.currency,
    merchandiseSubtotalAmount: row.merchandise_subtotal_amount,
    shippingAmount: row.shipping_amount,
    taxAmount: row.tax_amount,
    totalAmount: row.total_amount,
    printfulStatus: row.printful_status,
    hasTracking: false,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
__name(orderView, "orderView");
async function selectOrder(db, sql, ...values) {
  return await db.prepare(sql).bind(...values).first() ?? null;
}
__name(selectOrder, "selectOrder");
async function reserveOrder(db, reservation) {
  const now = Math.floor(Date.now() / 1e3);
  const orderId = `ord_${compactUuid()}`;
  const publicId = `HF-${new Date(now * 1e3).toISOString().slice(0, 10).replaceAll("-", "")}-${compactUuid().slice(0, 8).toUpperCase()}`;
  const printfulExternalId = `hobfarm_${orderId}`;
  const emailHash = await sha256Hex(reservation.email);
  const cartFingerprint = reservation.cart.lines.map((line) => {
    const item = line;
    return `${item.productCode}:${item.variantCode}:${item.quantity}:${item.unitAmount}`;
  }).join("|");
  const cartJson = JSON.stringify({
    lines: reservation.cart.lines,
    currency: reservation.cart.currency
  });
  await db.prepare(
    `INSERT INTO commerce_orders (
        id, public_id, checkout_token, user_id, email_hash, currency,
        merchandise_subtotal_amount, shipping_amount, tax_amount, total_amount,
        tax_mode, catalog_revision, cart_fingerprint, cart_json,
        printful_external_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, checkout_token) DO NOTHING`
  ).bind(
    orderId,
    publicId,
    reservation.checkoutToken,
    reservation.userId,
    emailHash,
    reservation.cart.currency,
    reservation.cart.merchandiseSubtotalAmount,
    reservation.cart.shippingAmount,
    reservation.cart.totalAmount,
    reservation.taxMode,
    reservation.catalogRevision,
    cartFingerprint,
    cartJson,
    printfulExternalId,
    now,
    now
  ).run();
  const row = await selectOrder(
    db,
    "SELECT * FROM commerce_orders WHERE user_id = ? AND checkout_token = ?",
    reservation.userId,
    reservation.checkoutToken
  );
  if (!row) throw new Error("order_reservation_failed");
  if (row.cart_fingerprint !== cartFingerprint || row.tax_mode !== reservation.taxMode) {
    throw Object.assign(new Error("Checkout token was already used."), {
      code: "checkout_token_conflict"
    });
  }
  return orderView(row);
}
__name(reserveOrder, "reserveOrder");
async function attachStripeSession(db, orderId, stripeSessionId) {
  const now = Math.floor(Date.now() / 1e3);
  await db.prepare(
    `UPDATE commerce_orders
       SET stripe_session_id = COALESCE(stripe_session_id, ?),
           state = CASE WHEN state = 'checkout_pending' THEN 'checkout_open' ELSE state END,
           updated_at = ?
       WHERE id = ? AND (stripe_session_id IS NULL OR stripe_session_id = ?)`
  ).bind(stripeSessionId, now, orderId, stripeSessionId).run();
  const row = await selectOrder(
    db,
    "SELECT * FROM commerce_orders WHERE id = ?",
    orderId
  );
  if (!row || row.stripe_session_id !== stripeSessionId) {
    throw Object.assign(new Error("Stripe session could not be attached."), {
      code: "stripe_session_conflict"
    });
  }
  return orderView(row);
}
__name(attachStripeSession, "attachStripeSession");
async function recordStripePaid(db, event, dataKey, fulfillmentQueued) {
  const existingEvent = await db.prepare(
    "SELECT outcome FROM commerce_events WHERE provider = 'stripe' AND event_id = ?"
  ).bind(event.eventId).first();
  if (existingEvent) {
    const existingOrder = await selectOrder(
      db,
      "SELECT * FROM commerce_orders WHERE id = ?",
      event.orderId
    );
    if (!existingOrder) throw new Error("order_not_found");
    return { order: orderView(existingOrder), duplicate: true };
  }
  const order = await selectOrder(
    db,
    "SELECT * FROM commerce_orders WHERE id = ?",
    event.orderId
  );
  if (!order) throw Object.assign(new Error("Order not found."), { code: "order_not_found" });
  assertPaidEventMatchesOrder(event, order);
  if (order.stripe_session_id && order.stripe_session_id !== event.stripeSessionId) {
    throw Object.assign(new Error("Stripe session did not match the order."), {
      code: "payment_mismatch"
    });
  }
  const recipient = await encryptJson(event.recipient, dataKey);
  const now = Math.floor(Date.now() / 1e3);
  const payloadHash = await sha256Hex(
    JSON.stringify({
      orderId: event.orderId,
      session: event.stripeSessionId,
      intent: event.paymentIntentId,
      total: event.totalAmount
    })
  );
  const fulfillmentStatus = fulfillmentQueued ? "queued" : "held";
  await db.batch([
    db.prepare(
      `UPDATE commerce_orders
         SET state = 'paid',
             payment_status = 'paid',
             fulfillment_status = ?,
             tax_amount = ?,
             total_amount = ?,
             recipient_ciphertext = ?,
             recipient_iv = ?,
             stripe_session_id = ?,
             stripe_payment_intent_id = ?,
             stripe_customer_id = ?,
             paid_at = ?,
             updated_at = ?
         WHERE id = ?`
    ).bind(
      fulfillmentStatus,
      event.taxAmount,
      event.totalAmount,
      recipient.ciphertext,
      recipient.iv,
      event.stripeSessionId,
      event.paymentIntentId,
      event.stripeCustomerId,
      event.eventCreated,
      now,
      event.orderId
    ),
    db.prepare(
      `INSERT INTO commerce_events
         (provider, event_id, event_type, order_id, payload_hash, outcome, created_at)
         VALUES ('stripe', ?, ?, ?, ?, 'paid_recorded', ?)`
    ).bind(
      event.eventId,
      event.eventType,
      event.orderId,
      payloadHash,
      now
    )
  ]);
  const updated = await selectOrder(
    db,
    "SELECT * FROM commerce_orders WHERE id = ?",
    event.orderId
  );
  if (!updated) throw new Error("order_not_found");
  return { order: orderView(updated), duplicate: false };
}
__name(recordStripePaid, "recordStripePaid");
async function recordStripeFailure(db, input) {
  const now = Math.floor(Date.now() / 1e3);
  const payloadHash = await sha256Hex(
    JSON.stringify({ orderId: input.orderId, session: input.stripeSessionId })
  );
  await db.batch([
    db.prepare(
      `UPDATE commerce_orders
         SET state = 'payment_failed', payment_status = 'failed',
             fulfillment_status = 'not_ready', updated_at = ?
         WHERE id = ? AND payment_status != 'paid'`
    ).bind(now, input.orderId),
    db.prepare(
      `INSERT OR IGNORE INTO commerce_events
         (provider, event_id, event_type, order_id, payload_hash, outcome, created_at)
         VALUES ('stripe', ?, ?, ?, ?, 'payment_failed', ?)`
    ).bind(
      input.eventId,
      input.eventType,
      input.orderId,
      payloadHash,
      now
    )
  ]);
}
__name(recordStripeFailure, "recordStripeFailure");
async function listOrdersForUser(db, userId, stripeSessionId) {
  const query = stripeSessionId ? db.prepare(
    `SELECT * FROM commerce_orders
           WHERE user_id = ? AND stripe_session_id = ?
           ORDER BY created_at DESC LIMIT 1`
  ).bind(userId, stripeSessionId) : db.prepare(
    `SELECT * FROM commerce_orders
           WHERE user_id = ?
           ORDER BY created_at DESC LIMIT 25`
  ).bind(userId);
  const result = await query.all();
  return result.results.map(orderView);
}
__name(listOrdersForUser, "listOrdersForUser");
async function getOrderForFulfillment(db, orderId) {
  return selectOrder(db, "SELECT * FROM commerce_orders WHERE id = ?", orderId);
}
__name(getOrderForFulfillment, "getOrderForFulfillment");
async function listReconciliationOrderIds(db, limit = 25) {
  const result = await db.prepare(
    `SELECT id FROM commerce_orders
       WHERE payment_status = 'paid'
         AND fulfillment_status IN
           ('queued', 'retry', 'cost_review', 'awaiting_confirmation', 'submitted')
       ORDER BY updated_at ASC
       LIMIT ?`
  ).bind(Math.max(1, Math.min(100, limit))).all();
  return result.results.map((row) => row.id);
}
__name(listReconciliationOrderIds, "listReconciliationOrderIds");
async function recordFulfillmentAttempt(db, orderId, stage, outcome, providerStatus, errorCode) {
  await db.prepare(
    `INSERT INTO commerce_fulfillment_attempts
       (order_id, stage, outcome, provider_status, error_code, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(
    orderId,
    stage,
    outcome,
    providerStatus ?? null,
    errorCode ?? null,
    Math.floor(Date.now() / 1e3)
  ).run();
}
__name(recordFulfillmentAttempt, "recordFulfillmentAttempt");
async function updatePrintfulState(db, orderId, input) {
  await db.prepare(
    `UPDATE commerce_orders
       SET fulfillment_status = ?,
           printful_order_id = COALESCE(?, printful_order_id),
           printful_status = COALESCE(?, printful_status),
           printful_costs_json = COALESCE(?, printful_costs_json),
           last_error_code = ?,
           state = CASE
             WHEN ? = 'fulfilled' THEN 'fulfilled'
             WHEN ? = 'canceled' THEN 'canceled'
             ELSE state
           END,
           updated_at = ?
       WHERE id = ?`
  ).bind(
    input.fulfillmentStatus,
    input.printfulOrderId ?? null,
    input.printfulStatus ?? null,
    input.printfulCosts === void 0 ? null : JSON.stringify(input.printfulCosts),
    input.errorCode ?? null,
    input.fulfillmentStatus,
    input.fulfillmentStatus,
    Math.floor(Date.now() / 1e3),
    orderId
  ).run();
}
__name(updatePrintfulState, "updatePrintfulState");
async function recordRefund(db, input) {
  const order = await selectOrder(
    db,
    "SELECT * FROM commerce_orders WHERE stripe_payment_intent_id = ?",
    input.paymentIntentId
  );
  if (!order) return { matched: false };
  const now = Math.floor(Date.now() / 1e3);
  await db.batch([
    db.prepare(
      `INSERT INTO commerce_refunds
         (stripe_refund_id, order_id, stripe_event_id, amount, currency, status, reason, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(stripe_refund_id) DO UPDATE SET
           stripe_event_id = excluded.stripe_event_id,
           amount = excluded.amount,
           status = excluded.status,
           reason = excluded.reason,
           updated_at = excluded.updated_at`
    ).bind(
      input.stripeRefundId,
      order.id,
      input.stripeEventId,
      input.amount,
      input.currency,
      input.status,
      input.reason,
      now,
      now
    ),
    db.prepare(
      `UPDATE commerce_orders
         SET state = CASE
               WHEN ? != 'succeeded' THEN state
               WHEN (
                 SELECT COALESCE(SUM(amount), 0)
                 FROM commerce_refunds
                 WHERE order_id = ? AND status = 'succeeded'
               ) >= total_amount THEN 'refunded'
               ELSE 'partially_refunded'
             END,
             payment_status = CASE
               WHEN ? != 'succeeded' THEN payment_status
               WHEN (
                 SELECT COALESCE(SUM(amount), 0)
                 FROM commerce_refunds
                 WHERE order_id = ? AND status = 'succeeded'
               ) >= total_amount THEN 'refunded'
               ELSE 'partially_refunded'
             END,
             updated_at = ?
         WHERE id = ?`
    ).bind(
      input.status,
      order.id,
      input.status,
      order.id,
      now,
      order.id
    )
  ]);
  return { matched: true, orderId: order.id };
}
__name(recordRefund, "recordRefund");

// src/printful.mjs
var PRINTFUL_API_ORIGIN = "https://api.printful.com";
var MAX_PAGES = 20;
var PAGE_SIZE = 100;
function normalize(value) {
  return String(value ?? "").trim().toLocaleLowerCase("en-US");
}
__name(normalize, "normalize");
function safeProviderError(status) {
  return {
    status,
    code: status === 401 ? "printful_unauthorized" : status === 403 ? "printful_scope_denied" : status === 429 ? "printful_rate_limited" : "printful_request_failed"
  };
}
__name(safeProviderError, "safeProviderError");
async function requestJson(fetchImpl, token, pathname, storeId) {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "HobFarm-Commerce-Inspector/1.0"
  };
  if (storeId !== void 0) {
    headers["X-PF-Store-Id"] = String(storeId);
  }
  const response = await fetchImpl(`${PRINTFUL_API_ORIGIN}${pathname}`, {
    method: "GET",
    headers
  });
  if (!response.ok) {
    throw Object.assign(
      new Error(`Printful request failed with status ${response.status}`),
      safeProviderError(response.status)
    );
  }
  return response.json();
}
__name(requestJson, "requestJson");
async function postJson(fetchImpl, token, pathname, storeId, body) {
  const response = await fetchImpl(`${PRINTFUL_API_ORIGIN}${pathname}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "HobFarm-Commerce-Inspector/1.0",
      "X-PF-Store-Id": String(storeId)
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw Object.assign(
      new Error(`Printful request failed with status ${response.status}`),
      safeProviderError(response.status)
    );
  }
  return response.json();
}
__name(postJson, "postJson");
async function getAllV1Items(fetchImpl, token, pathname, selectItems, storeId) {
  const collected = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const offset = page * PAGE_SIZE;
    const separator = pathname.includes("?") ? "&" : "?";
    const payload = await requestJson(
      fetchImpl,
      token,
      `${pathname}${separator}limit=${PAGE_SIZE}&offset=${offset}`,
      storeId
    );
    const items = selectItems(payload);
    collected.push(...items);
    const total = Number(payload?.paging?.total ?? collected.length);
    if (items.length < PAGE_SIZE || collected.length >= total) {
      return collected;
    }
  }
  throw new Error("Printful pagination exceeded the inspection limit");
}
__name(getAllV1Items, "getAllV1Items");
function sanitizeTemplate(template) {
  return {
    id: template.id,
    title: template.title,
    catalogProductId: template.product_id,
    externalProductId: template.external_product_id ?? null,
    availableVariantIds: Array.isArray(template.available_variant_ids) ? template.available_variant_ids : [],
    colors: Array.isArray(template.colors) ? template.colors.map((color) => color?.color_name).filter(Boolean) : [],
    sizes: Array.isArray(template.sizes) ? template.sizes : [],
    placements: Array.isArray(template.placements) ? template.placements : [],
    mockupFileUrl: template.mockup_file_url ?? null
  };
}
__name(sanitizeTemplate, "sanitizeTemplate");
function sanitizeSyncProduct(product, store) {
  return {
    store: {
      id: store.id,
      name: store.name,
      type: store.type
    },
    id: product.id,
    externalId: product.external_id ?? null,
    name: product.name,
    variantCount: product.variants,
    syncedVariantCount: product.synced,
    thumbnailUrl: product.thumbnail_url ?? null,
    ignored: Boolean(product.is_ignored)
  };
}
__name(sanitizeSyncProduct, "sanitizeSyncProduct");
function sanitizeSyncVariant(variant) {
  return {
    id: variant.id,
    externalId: variant.external_id ?? null,
    catalogVariantId: variant.variant_id,
    name: variant.name,
    synced: Boolean(variant.synced),
    retailPrice: variant.retail_price ?? null,
    currency: variant.currency ?? null,
    sku: variant.sku ?? null,
    availabilityStatus: variant.availability_status ?? null,
    files: Array.isArray(variant.files) ? variant.files.map((file) => ({
      id: file.id,
      type: file.type,
      filename: file.filename ?? null,
      sourceUrl: file.url ?? null,
      previewUrl: file.preview_url ?? null,
      visible: file.visible !== false
    })) : [],
    options: Array.isArray(variant.options) ? variant.options : []
  };
}
__name(sanitizeSyncVariant, "sanitizeSyncVariant");
async function getSyncProductDetail(fetchImpl, token, store, product) {
  const payload = await requestJson(
    fetchImpl,
    token,
    `/store/products/${encodeURIComponent(product.id)}`,
    store.id
  );
  const result = payload?.result ?? {};
  return {
    ...sanitizeSyncProduct(result.sync_product ?? product, store),
    variants: Array.isArray(result.sync_variants) ? result.sync_variants.map(sanitizeSyncVariant) : []
  };
}
__name(getSyncProductDetail, "getSyncProductDetail");
async function inspectPrintfulProduct({
  token,
  targetTitle,
  targetStoreName,
  fetchImpl = fetch
}) {
  if (typeof token !== "string" || token.length < 10) {
    throw new TypeError("A Printful token is required");
  }
  const storePayload = await requestJson(
    fetchImpl,
    token,
    `/v2/stores?limit=${PAGE_SIZE}`
  );
  const stores = Array.isArray(storePayload?.data) ? storePayload.data : [];
  const targetStores = stores.filter(
    (store) => normalize(store.name) === normalize(targetStoreName)
  );
  let templateMatches = [];
  let templateError = null;
  try {
    const templates = await getAllV1Items(
      fetchImpl,
      token,
      "/product-templates",
      (payload) => Array.isArray(payload?.result?.items) ? payload.result.items : []
    );
    templateMatches = templates.filter((template) => normalize(template.title) === normalize(targetTitle)).map(sanitizeTemplate);
  } catch (error) {
    templateError = {
      status: Number(error?.status ?? 0) || null,
      code: error?.code ?? "printful_template_read_failed"
    };
  }
  const syncProductMatches = [];
  const storeErrors = [];
  for (const store of targetStores) {
    try {
      const products2 = await getAllV1Items(
        fetchImpl,
        token,
        "/store/products",
        (payload) => Array.isArray(payload?.result) ? payload.result : [],
        store.id
      );
      const matches = products2.filter(
        (product) => normalize(product.name) === normalize(targetTitle)
      );
      for (const product of matches) {
        syncProductMatches.push(
          await getSyncProductDetail(fetchImpl, token, store, product)
        );
      }
    } catch (error) {
      storeErrors.push({
        storeId: store.id,
        storeName: store.name,
        status: Number(error?.status ?? 0) || null,
        code: error?.code ?? "printful_store_read_failed"
      });
    }
  }
  const state = syncProductMatches.length > 0 ? "store_product" : templateMatches.length > 0 ? "template_only" : templateError || storeErrors.length > 0 ? "inspection_incomplete" : "not_found";
  return {
    target: {
      title: targetTitle,
      storeName: targetStoreName
    },
    state,
    targetStores: targetStores.map((store) => ({
      id: store.id,
      name: store.name,
      type: store.type
    })),
    templateMatches,
    templateError,
    syncProductMatches,
    storeErrors,
    checkedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
__name(inspectPrintfulProduct, "inspectPrintfulProduct");
function sanitizeShippingRate(rate) {
  return {
    shipping: rate.shipping,
    name: rate.shipping_method_name,
    rate: rate.rate,
    currency: rate.currency,
    minDeliveryDays: rate.min_delivery_days ?? null,
    maxDeliveryDays: rate.max_delivery_days ?? null,
    minDeliveryDate: rate.min_delivery_date ?? null,
    maxDeliveryDate: rate.max_delivery_date ?? null,
    shipmentCount: Array.isArray(rate.shipments) ? rate.shipments.length : 0,
    departureCountries: Array.isArray(rate.shipments) ? [...new Set(rate.shipments.map((shipment) => shipment.departure_country).filter(Boolean))] : [],
    customsFeesPossible: Array.isArray(rate.shipments) ? rate.shipments.some((shipment) => shipment.customs_fees_possible) : false
  };
}
__name(sanitizeShippingRate, "sanitizeShippingRate");
async function inspectPrintfulShipping({
  token,
  storeId,
  destination,
  scenarios,
  fetchImpl = fetch
}) {
  const results = [];
  for (const scenario of scenarios) {
    const payload = await postJson(
      fetchImpl,
      token,
      "/v2/shipping-rates",
      storeId,
      {
        recipient: destination,
        order_items: scenario.items.map((item) => ({
          source: "catalog",
          catalog_variant_id: item.catalogVariantId,
          quantity: item.quantity
        })),
        currency: "USD"
      }
    );
    results.push({
      code: scenario.code,
      items: scenario.items,
      rates: Array.isArray(payload?.data) ? payload.data.map(sanitizeShippingRate) : []
    });
  }
  return {
    destination: {
      countryCode: destination.country_code,
      stateCode: destination.state_code ?? null,
      zip: destination.zip ?? null
    },
    scenarios: results,
    checkedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
__name(inspectPrintfulShipping, "inspectPrintfulShipping");
async function inspectPrintfulFile({
  token,
  fileId,
  storeId,
  fetchImpl = fetch
}) {
  const payload = await requestJson(
    fetchImpl,
    token,
    `/files/${encodeURIComponent(fileId)}`,
    storeId
  );
  const file = payload?.result ?? {};
  return {
    id: file.id ?? null,
    type: file.type ?? null,
    filename: file.filename ?? null,
    sourceUrl: file.url ?? null,
    previewUrl: file.preview_url ?? null,
    status: file.status ?? null,
    visible: file.visible !== false,
    width: file.width ?? null,
    height: file.height ?? null,
    dpi: file.dpi ?? null
  };
}
__name(inspectPrintfulFile, "inspectPrintfulFile");
async function inspectPrintfulCatalogVariant({
  token,
  variantId,
  storeId,
  fetchImpl = fetch
}) {
  const payload = await requestJson(
    fetchImpl,
    token,
    `/v2/catalog-variants/${encodeURIComponent(variantId)}`,
    storeId
  );
  return payload?.data ?? null;
}
__name(inspectPrintfulCatalogVariant, "inspectPrintfulCatalogVariant");
async function inspectPrintfulCatalogProduct({
  token,
  productId,
  storeId,
  fetchImpl = fetch
}) {
  const payload = await requestJson(
    fetchImpl,
    token,
    `/v2/catalog-products/${encodeURIComponent(productId)}`,
    storeId
  );
  return payload?.data ?? null;
}
__name(inspectPrintfulCatalogProduct, "inspectPrintfulCatalogProduct");

// src/printful-orders.mjs
var PRINTFUL_API_ORIGIN2 = "https://api.printful.com";
function fulfillmentError(code, message, status) {
  return Object.assign(new Error(message), { code, status });
}
__name(fulfillmentError, "fulfillmentError");
function parseMoney(value) {
  if (typeof value !== "string" || !/^\d+(\.\d{1,2})?$/.test(value)) {
    return null;
  }
  return Math.round(Number(value) * 100);
}
__name(parseMoney, "parseMoney");
function lineVariant(line) {
  const variant = MELTING_RABBIT_HOLE_DAD_HAT.printful.variants.find(
    (candidate) => candidate.variantCode === line.variantCode && line.productCode === MELTING_RABBIT_HOLE_DAD_HAT.productCode
  );
  if (!variant) {
    throw fulfillmentError(
      "catalog_mismatch",
      "The stored cart no longer matches the fulfillment catalog."
    );
  }
  return variant;
}
__name(lineVariant, "lineVariant");
function buildPrintfulDraftOrder({
  order,
  recipient
}) {
  const cart = JSON.parse(order.cart_json);
  if (!Array.isArray(cart?.lines) || cart.currency !== "USD") {
    throw fulfillmentError("invalid_stored_cart", "The stored cart is invalid.");
  }
  return {
    external_id: order.printful_external_id,
    shipping: MELTING_RABBIT_HOLE_DAD_HAT.shipping.service,
    recipient: {
      name: recipient.name,
      company: recipient.company ?? void 0,
      address1: recipient.address1,
      address2: recipient.address2 ?? void 0,
      city: recipient.city,
      state_code: recipient.stateCode,
      country_code: recipient.countryCode,
      zip: recipient.postalCode,
      email: recipient.email,
      phone: recipient.phone ?? void 0
    },
    order_items: cart.lines.map((line) => {
      const variant = lineVariant(line);
      return {
        source: "catalog",
        external_id: `${order.id}_${variant.variantCode}`,
        catalog_variant_id: variant.catalogVariantId,
        quantity: line.quantity,
        retail_price: centsToDecimal(line.unitAmount),
        name: `${MELTING_RABBIT_HOLE_DAD_HAT.templateTitle} / ${variant.name}`,
        placements: [
          {
            placement: MELTING_RABBIT_HOLE_DAD_HAT.printful.placement,
            technique: MELTING_RABBIT_HOLE_DAD_HAT.printful.technique,
            layers: [
              {
                type: "file",
                url: MELTING_RABBIT_HOLE_DAD_HAT.printful.artworkUrl
              }
            ]
          }
        ]
      };
    }),
    retail_costs: {
      currency: order.currency,
      discount: "0.00",
      shipping: centsToDecimal(order.shipping_amount),
      tax: centsToDecimal(order.tax_amount)
    }
  };
}
__name(buildPrintfulDraftOrder, "buildPrintfulDraftOrder");
async function printfulRequest({
  token,
  storeId,
  method,
  pathname,
  body,
  fetchImpl = fetch
}) {
  const response = await fetchImpl(`${PRINTFUL_API_ORIGIN2}${pathname}`, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "HobFarm-Commerce/1.0",
      "X-PF-Store-Id": String(storeId)
    },
    body: body === void 0 ? void 0 : JSON.stringify(body)
  });
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok) {
    throw fulfillmentError(
      response.status === 404 ? "printful_not_found" : response.status === 409 ? "printful_conflict" : response.status === 429 ? "printful_rate_limited" : "printful_request_failed",
      "Printful request failed.",
      response.status
    );
  }
  return payload?.data ?? payload;
}
__name(printfulRequest, "printfulRequest");
async function findPrintfulOrderByExternalId(options) {
  return printfulRequest({
    ...options,
    method: "GET",
    pathname: `/v2/orders/@${encodeURIComponent(options.externalId)}`
  });
}
__name(findPrintfulOrderByExternalId, "findPrintfulOrderByExternalId");
async function createPrintfulDraft(options) {
  if (!options.allowDraftCreation) {
    throw fulfillmentError(
      "printful_draft_disabled",
      "Printful draft creation is disabled."
    );
  }
  return printfulRequest({
    ...options,
    method: "POST",
    pathname: "/v2/orders",
    body: options.body
  });
}
__name(createPrintfulDraft, "createPrintfulDraft");
async function confirmPrintfulOrder(options) {
  if (!options.allowConfirmation) {
    throw fulfillmentError(
      "printful_confirmation_disabled",
      "Printful order confirmation is disabled."
    );
  }
  return printfulRequest({
    ...options,
    method: "POST",
    pathname: `/v2/orders/${encodeURIComponent(options.orderId)}/confirmation`
  });
}
__name(confirmPrintfulOrder, "confirmPrintfulOrder");
async function runPrintfulFulfillment({
  order,
  recipient,
  token,
  allowDraftCreation = false,
  allowConfirmation = false,
  maxProviderCostAmount,
  fetchImpl = fetch
}) {
  const common = {
    token,
    storeId: MELTING_RABBIT_HOLE_DAD_HAT.printful.storeId,
    fetchImpl
  };
  let providerOrder;
  try {
    providerOrder = await findPrintfulOrderByExternalId({
      ...common,
      externalId: order.printful_external_id
    });
  } catch (error) {
    if (error?.code !== "printful_not_found") throw error;
    if (!allowDraftCreation) {
      return {
        outcome: "held",
        stage: "draft",
        code: "printful_draft_disabled"
      };
    }
    providerOrder = await createPrintfulDraft({
      ...common,
      allowDraftCreation,
      body: buildPrintfulDraftOrder({ order, recipient })
    });
  }
  const providerCostAmount = parseMoney(providerOrder?.costs?.total);
  const calculationStatus = providerOrder?.costs?.calculation_status ?? null;
  const base = {
    printfulOrderId: providerOrder?.id ?? null,
    printfulStatus: providerOrder?.status ?? null,
    printfulCosts: providerOrder?.costs ?? null
  };
  if (providerOrder?.status !== "draft") {
    return {
      outcome: providerOrder?.status === "fulfilled" ? "fulfilled" : "provider_active",
      stage: "reconcile",
      ...base
    };
  }
  if (calculationStatus !== "done" || providerCostAmount === null) {
    return {
      outcome: "awaiting_costs",
      stage: "cost_review",
      ...base
    };
  }
  if (!Number.isInteger(maxProviderCostAmount) || providerCostAmount > maxProviderCostAmount) {
    return {
      outcome: "held",
      stage: "cost_review",
      code: "provider_cost_limit",
      providerCostAmount,
      ...base
    };
  }
  if (!allowConfirmation) {
    return {
      outcome: "awaiting_confirmation",
      stage: "confirmation",
      providerCostAmount,
      ...base
    };
  }
  const confirmed = await confirmPrintfulOrder({
    ...common,
    allowConfirmation,
    orderId: providerOrder.id
  });
  return {
    outcome: "submitted",
    stage: "confirmation",
    providerCostAmount,
    printfulOrderId: confirmed?.id ?? providerOrder.id,
    printfulStatus: confirmed?.status ?? providerOrder.status,
    printfulCosts: confirmed?.costs ?? providerOrder.costs ?? null
  };
}
__name(runPrintfulFulfillment, "runPrintfulFulfillment");

// src/index.ts
var JSON_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff"
};
function json(payload, status = 200) {
  return Response.json(payload, { status, headers: JSON_HEADERS });
}
__name(json, "json");
function codeFromError(error, fallback) {
  const code = error && typeof error === "object" ? error.code : void 0;
  return typeof code === "string" ? code : fallback;
}
__name(codeFromError, "codeFromError");
async function readJson(request, maxBytes = 64 * 1024) {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > maxBytes) {
    throw Object.assign(new Error("Request body is too large."), {
      code: "body_too_large"
    });
  }
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    throw Object.assign(new Error("A JSON request is required."), {
      code: "json_required"
    });
  }
  return request.json();
}
__name(readJson, "readJson");
function requireLedger(env) {
  if (!env.COMMERCE_DB) {
    throw Object.assign(new Error("Commerce ledger is not configured."), {
      code: "ledger_not_configured"
    });
  }
  return env.COMMERCE_DB;
}
__name(requireLedger, "requireLedger");
async function processFulfillment(env, orderId) {
  const db = requireLedger(env);
  const order = await getOrderForFulfillment(db, orderId);
  if (!order || order.payment_status !== "paid") return;
  if (!order.recipient_ciphertext || !order.recipient_iv || !env.COMMERCE_DATA_KEY) {
    await updatePrintfulState(db, orderId, {
      fulfillmentStatus: "held",
      errorCode: "recipient_unavailable"
    });
    return;
  }
  const recipient = await decryptJson(
    order.recipient_ciphertext,
    order.recipient_iv,
    env.COMMERCE_DATA_KEY
  );
  const token = await env.PRINTFUL_API_TOKEN.get();
  const maxProviderCostAmount = Number(env.PRINTFUL_MAX_ORDER_COST_AMOUNT ?? "");
  try {
    const result = await runPrintfulFulfillment({
      order,
      recipient,
      token,
      allowDraftCreation: env.PRINTFUL_DRAFT_CREATION_ENABLED === "true",
      allowConfirmation: env.PRINTFUL_CONFIRMATION_ENABLED === "true",
      maxProviderCostAmount
    });
    const fulfillmentStatus = result.outcome === "fulfilled" ? "fulfilled" : result.outcome === "submitted" || result.outcome === "provider_active" ? "submitted" : result.outcome === "awaiting_costs" ? "cost_review" : result.outcome === "awaiting_confirmation" ? "awaiting_confirmation" : "held";
    await updatePrintfulState(db, orderId, {
      fulfillmentStatus,
      printfulOrderId: "printfulOrderId" in result ? result.printfulOrderId : null,
      printfulStatus: "printfulStatus" in result ? result.printfulStatus : null,
      printfulCosts: "printfulCosts" in result ? result.printfulCosts : void 0,
      errorCode: result.code ?? null
    });
    await recordFulfillmentAttempt(
      db,
      orderId,
      result.stage,
      result.outcome,
      null,
      result.code ?? null
    );
  } catch (error) {
    await updatePrintfulState(db, orderId, {
      fulfillmentStatus: "retry",
      errorCode: codeFromError(error, "printful_fulfillment_failed")
    });
    await recordFulfillmentAttempt(
      db,
      orderId,
      "provider",
      "failed",
      Number(error?.status ?? 0) || null,
      codeFromError(error, "printful_fulfillment_failed")
    );
    throw error;
  }
}
__name(processFulfillment, "processFulfillment");
async function handleLedgerRequest(request, env, url) {
  if (!url.pathname.startsWith("/internal/")) return null;
  try {
    if (request.method === "POST" && url.pathname === "/internal/checkout/reserve") {
      const reservation = normalizeReserveOrder(await readJson(request));
      const order = await reserveOrder(requireLedger(env), reservation);
      return json({ order });
    }
    if (request.method === "POST" && url.pathname === "/internal/checkout/attach-session") {
      const body = await readJson(request);
      if (typeof body?.orderId !== "string" || typeof body?.stripeSessionId !== "string") {
        return json({ error: "invalid_contract" }, 400);
      }
      const order = await attachStripeSession(
        requireLedger(env),
        body.orderId,
        body.stripeSessionId
      );
      return json({ order });
    }
    if (request.method === "POST" && url.pathname === "/internal/stripe/paid") {
      const event = normalizeStripePaidEvent(await readJson(request));
      if (!env.COMMERCE_DATA_KEY) {
        return json({ error: "data_key_not_configured" }, 503);
      }
      const shouldQueue = env.FULFILLMENT_EXECUTION_ENABLED === "true" && Boolean(env.FULFILLMENT_QUEUE);
      const result = await recordStripePaid(
        requireLedger(env),
        event,
        env.COMMERCE_DATA_KEY,
        shouldQueue
      );
      if (shouldQueue && !result.duplicate) {
        await env.FULFILLMENT_QUEUE.send({ orderId: event.orderId });
      }
      return json(result);
    }
    if (request.method === "POST" && url.pathname === "/internal/stripe/failed") {
      const body = await readJson(request);
      if (typeof body?.eventId !== "string" || typeof body?.eventType !== "string" || typeof body?.orderId !== "string" || typeof body?.stripeSessionId !== "string") {
        return json({ error: "invalid_contract" }, 400);
      }
      await recordStripeFailure(requireLedger(env), {
        eventId: body.eventId,
        eventType: body.eventType,
        orderId: body.orderId,
        stripeSessionId: body.stripeSessionId
      });
      return json({ recorded: true });
    }
    if (request.method === "POST" && url.pathname === "/internal/stripe/refund") {
      const body = await readJson(request);
      if (typeof body?.stripeEventId !== "string" || typeof body?.stripeRefundId !== "string" || typeof body?.paymentIntentId !== "string" || !Number.isInteger(body?.amount) || typeof body?.currency !== "string" || typeof body?.status !== "string") {
        return json({ error: "invalid_contract" }, 400);
      }
      return json(
        await recordRefund(requireLedger(env), {
          stripeEventId: body.stripeEventId,
          stripeRefundId: body.stripeRefundId,
          paymentIntentId: body.paymentIntentId,
          amount: body.amount,
          currency: body.currency,
          status: body.status,
          reason: typeof body.reason === "string" ? body.reason : null
        })
      );
    }
    if (request.method === "GET" && url.pathname === "/internal/orders") {
      const userId = url.searchParams.get("user_id") ?? "";
      if (!/^[A-Za-z0-9_-]{8,160}$/.test(userId)) {
        return json({ error: "invalid_user" }, 400);
      }
      const orders = await listOrdersForUser(
        requireLedger(env),
        userId,
        url.searchParams.get("stripe_session_id")
      );
      return json({ orders });
    }
  } catch (error) {
    const code = codeFromError(error, "commerce_request_failed");
    const status = code === "ledger_not_configured" || code === "data_key_not_configured" ? 503 : code === "order_not_found" ? 404 : code === "checkout_token_conflict" || code === "stripe_session_conflict" || code === "payment_mismatch" ? 409 : 400;
    return json({ error: code }, status);
  }
  return null;
}
__name(handleLedgerRequest, "handleLedgerRequest");
async function handleInspection(request, env, url) {
  if (request.method === "GET" && url.pathname === "/internal/printful/inspect-hat") {
    const token = await env.PRINTFUL_API_TOKEN.get();
    return json(
      await inspectPrintfulProduct({
        token,
        targetTitle: MELTING_RABBIT_HOLE_DAD_HAT.templateTitle,
        targetStoreName: MELTING_RABBIT_HOLE_DAD_HAT.targetStoreName
      })
    );
  }
  if (request.method === "GET" && url.pathname === "/internal/printful/inspect-hat-shipping") {
    const state = (url.searchParams.get("state") ?? "NV").toUpperCase();
    const zip = url.searchParams.get("zip") ?? "89101";
    if (!/^[A-Z]{2}$/.test(state) || !/^\d{5}$/.test(zip)) {
      return json({ ok: false, code: "invalid_destination" }, 400);
    }
    const token = await env.PRINTFUL_API_TOKEN.get();
    const [black, grey] = MELTING_RABBIT_HOLE_DAD_HAT.printful.variants;
    return json(
      await inspectPrintfulShipping({
        token,
        storeId: MELTING_RABBIT_HOLE_DAD_HAT.printful.storeId,
        destination: { country_code: "US", state_code: state, zip },
        scenarios: [
          {
            code: "one-black",
            items: [{ catalogVariantId: black.catalogVariantId, quantity: 1 }]
          },
          {
            code: "two-black",
            items: [{ catalogVariantId: black.catalogVariantId, quantity: 2 }]
          },
          {
            code: "black-and-grey",
            items: [
              { catalogVariantId: black.catalogVariantId, quantity: 1 },
              { catalogVariantId: grey.catalogVariantId, quantity: 1 }
            ]
          },
          {
            code: "three-black",
            items: [{ catalogVariantId: black.catalogVariantId, quantity: 3 }]
          }
        ]
      })
    );
  }
  if (request.method === "GET" && url.pathname === "/internal/printful/inspect-hat-artwork") {
    const token = await env.PRINTFUL_API_TOKEN.get();
    return json(
      await inspectPrintfulFile({
        token,
        fileId: MELTING_RABBIT_HOLE_DAD_HAT.printful.artworkFileId,
        storeId: MELTING_RABBIT_HOLE_DAD_HAT.printful.storeId
      })
    );
  }
  if (request.method === "GET" && url.pathname === "/internal/printful/inspect-hat-catalog-variant") {
    const variantId = Number(url.searchParams.get("id") ?? 7854);
    if (![7854, 12736].includes(variantId)) {
      return json({ ok: false, code: "invalid_variant" }, 400);
    }
    const token = await env.PRINTFUL_API_TOKEN.get();
    return json(
      await inspectPrintfulCatalogVariant({
        token,
        variantId,
        storeId: MELTING_RABBIT_HOLE_DAD_HAT.printful.storeId
      })
    );
  }
  if (request.method === "GET" && url.pathname === "/internal/printful/inspect-hat-catalog-product") {
    const token = await env.PRINTFUL_API_TOKEN.get();
    return json(
      await inspectPrintfulCatalogProduct({
        token,
        productId: MELTING_RABBIT_HOLE_DAD_HAT.printful.catalogProductId,
        storeId: MELTING_RABBIT_HOLE_DAD_HAT.printful.storeId
      })
    );
  }
  return null;
}
__name(handleInspection, "handleInspection");
var src_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const ledgerResponse = await handleLedgerRequest(request, env, url);
    if (ledgerResponse) return ledgerResponse;
    try {
      const inspectionResponse = await handleInspection(request, env, url);
      if (inspectionResponse) return inspectionResponse;
    } catch (error) {
      const status = Number(error?.status ?? 0);
      return json(
        { ok: false, code: codeFromError(error, "printful_inspection_failed") },
        status === 401 || status === 403 || status === 429 ? status : 502
      );
    }
    return json({ ok: false, code: "not_found" }, 404);
  },
  async queue(batch, env) {
    for (const message of batch.messages) {
      try {
        await processFulfillment(env, message.body.orderId);
        message.ack();
      } catch {
        message.retry({ delaySeconds: 300 });
      }
    }
  },
  async scheduled(_controller, env, _ctx) {
    if (env.FULFILLMENT_EXECUTION_ENABLED !== "true" || !env.COMMERCE_DB || !env.FULFILLMENT_QUEUE) {
      return;
    }
    const orderIds = await listReconciliationOrderIds(env.COMMERCE_DB);
    await Promise.all(
      orderIds.map((orderId) => env.FULFILLMENT_QUEUE.send({ orderId }))
    );
  }
};

// ../../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// .wrangler/tmp/bundle-9sA32E/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default
];
var middleware_insertion_facade_default = src_default;

// ../../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-9sA32E/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  buildPrintfulDraftOrder,
  checkoutCartFingerprint,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
