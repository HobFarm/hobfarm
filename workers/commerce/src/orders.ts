import { encryptJson, sha256Hex } from "./crypto";
import { assertPaidEventMatchesOrder } from "./order-contracts.mjs";

export interface CommerceOrderRow {
  id: string;
  public_id: string;
  checkout_token: string;
  user_id: string;
  email_hash: string;
  state: string;
  payment_status: string;
  fulfillment_status: string;
  currency: string;
  merchandise_subtotal_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  tax_mode: string;
  catalog_revision: string;
  cart_fingerprint: string;
  cart_json: string;
  recipient_ciphertext: string | null;
  recipient_iv: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  printful_external_id: string;
  printful_order_id: number | null;
  printful_status: string | null;
  printful_costs_json: string | null;
  last_error_code: string | null;
  paid_at: number | null;
  created_at: number;
  updated_at: number;
}

interface NormalizedReservation {
  checkoutToken: string;
  userId: string;
  email: string;
  taxMode: string;
  catalogRevision: string;
  cart: {
    lines: unknown[];
    currency: string;
    merchandiseSubtotalAmount: number;
    shippingAmount: number;
    totalAmount: number;
  };
}

function compactUuid(): string {
  return crypto.randomUUID().replaceAll("-", "");
}

function orderView(row: CommerceOrderRow) {
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
    updatedAt: row.updated_at,
  };
}

async function selectOrder(
  db: D1Database,
  sql: string,
  ...values: unknown[]
): Promise<CommerceOrderRow | null> {
  return (
    (await db.prepare(sql).bind(...values).first<CommerceOrderRow>()) ?? null
  );
}

export async function reserveOrder(
  db: D1Database,
  reservation: NormalizedReservation,
) {
  const now = Math.floor(Date.now() / 1000);
  const orderId = `ord_${compactUuid()}`;
  const publicId = `HF-${new Date(now * 1000)
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "")}-${compactUuid().slice(0, 8).toUpperCase()}`;
  const printfulExternalId = `hobfarm_${orderId}`;
  const emailHash = await sha256Hex(reservation.email);
  const cartFingerprint = reservation.cart.lines
    .map((line) => {
      const item = line as {
        productCode: string;
        variantCode: string;
        quantity: number;
        unitAmount: number;
      };
      return `${item.productCode}:${item.variantCode}:${item.quantity}:${item.unitAmount}`;
    })
    .join("|");
  const cartJson = JSON.stringify({
    lines: reservation.cart.lines,
    currency: reservation.cart.currency,
  });

  await db
    .prepare(
      `INSERT INTO commerce_orders (
        id, public_id, checkout_token, user_id, email_hash, currency,
        merchandise_subtotal_amount, shipping_amount, tax_amount, total_amount,
        tax_mode, catalog_revision, cart_fingerprint, cart_json,
        printful_external_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, checkout_token) DO NOTHING`,
    )
    .bind(
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
      now,
    )
    .run();

  const row = await selectOrder(
    db,
    "SELECT * FROM commerce_orders WHERE user_id = ? AND checkout_token = ?",
    reservation.userId,
    reservation.checkoutToken,
  );
  if (!row) throw new Error("order_reservation_failed");
  if (
    row.cart_fingerprint !== cartFingerprint ||
    row.tax_mode !== reservation.taxMode
  ) {
    throw Object.assign(new Error("Checkout token was already used."), {
      code: "checkout_token_conflict",
    });
  }
  return orderView(row);
}

export async function attachStripeSession(
  db: D1Database,
  orderId: string,
  stripeSessionId: string,
) {
  const now = Math.floor(Date.now() / 1000);
  await db
    .prepare(
      `UPDATE commerce_orders
       SET stripe_session_id = COALESCE(stripe_session_id, ?),
           state = CASE WHEN state = 'checkout_pending' THEN 'checkout_open' ELSE state END,
           updated_at = ?
       WHERE id = ? AND (stripe_session_id IS NULL OR stripe_session_id = ?)`,
    )
    .bind(stripeSessionId, now, orderId, stripeSessionId)
    .run();
  const row = await selectOrder(
    db,
    "SELECT * FROM commerce_orders WHERE id = ?",
    orderId,
  );
  if (!row || row.stripe_session_id !== stripeSessionId) {
    throw Object.assign(new Error("Stripe session could not be attached."), {
      code: "stripe_session_conflict",
    });
  }
  return orderView(row);
}

export async function recordStripePaid(
  db: D1Database,
  event: {
    eventId: string;
    eventType: string;
    eventCreated: number;
    orderId: string;
    stripeSessionId: string;
    paymentIntentId: string;
    stripeCustomerId: string | null;
    currency: string;
    cartFingerprint: string;
    catalogRevision: string;
    merchandiseSubtotalAmount: number;
    shippingAmount: number;
    taxAmount: number;
    totalAmount: number;
    recipient: unknown;
  },
  dataKey: string,
  fulfillmentQueued: boolean,
) {
  const existingEvent = await db
    .prepare(
      "SELECT outcome FROM commerce_events WHERE provider = 'stripe' AND event_id = ?",
    )
    .bind(event.eventId)
    .first<{ outcome: string }>();
  if (existingEvent) {
    const existingOrder = await selectOrder(
      db,
      "SELECT * FROM commerce_orders WHERE id = ?",
      event.orderId,
    );
    if (!existingOrder) throw new Error("order_not_found");
    return { order: orderView(existingOrder), duplicate: true };
  }

  const order = await selectOrder(
    db,
    "SELECT * FROM commerce_orders WHERE id = ?",
    event.orderId,
  );
  if (!order) throw Object.assign(new Error("Order not found."), { code: "order_not_found" });
  assertPaidEventMatchesOrder(event, order);
  if (
    order.stripe_session_id &&
    order.stripe_session_id !== event.stripeSessionId
  ) {
    throw Object.assign(new Error("Stripe session did not match the order."), {
      code: "payment_mismatch",
    });
  }

  const recipient = await encryptJson(event.recipient, dataKey);
  const now = Math.floor(Date.now() / 1000);
  const payloadHash = await sha256Hex(
    JSON.stringify({
      orderId: event.orderId,
      session: event.stripeSessionId,
      intent: event.paymentIntentId,
      total: event.totalAmount,
    }),
  );
  const fulfillmentStatus = fulfillmentQueued ? "queued" : "held";

  await db.batch([
    db
      .prepare(
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
         WHERE id = ?`,
      )
      .bind(
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
        event.orderId,
      ),
    db
      .prepare(
        `INSERT INTO commerce_events
         (provider, event_id, event_type, order_id, payload_hash, outcome, created_at)
         VALUES ('stripe', ?, ?, ?, ?, 'paid_recorded', ?)`,
      )
      .bind(
        event.eventId,
        event.eventType,
        event.orderId,
        payloadHash,
        now,
      ),
  ]);

  const updated = await selectOrder(
    db,
    "SELECT * FROM commerce_orders WHERE id = ?",
    event.orderId,
  );
  if (!updated) throw new Error("order_not_found");
  return { order: orderView(updated), duplicate: false };
}

export async function recordStripeFailure(
  db: D1Database,
  input: {
    eventId: string;
    eventType: string;
    orderId: string;
    stripeSessionId: string;
  },
) {
  const now = Math.floor(Date.now() / 1000);
  const payloadHash = await sha256Hex(
    JSON.stringify({ orderId: input.orderId, session: input.stripeSessionId }),
  );
  await db.batch([
    db
      .prepare(
        `UPDATE commerce_orders
         SET state = 'payment_failed', payment_status = 'failed',
             fulfillment_status = 'not_ready', updated_at = ?
         WHERE id = ? AND payment_status != 'paid'`,
      )
      .bind(now, input.orderId),
    db
      .prepare(
        `INSERT OR IGNORE INTO commerce_events
         (provider, event_id, event_type, order_id, payload_hash, outcome, created_at)
         VALUES ('stripe', ?, ?, ?, ?, 'payment_failed', ?)`,
      )
      .bind(
        input.eventId,
        input.eventType,
        input.orderId,
        payloadHash,
        now,
      ),
  ]);
}

export async function listOrdersForUser(
  db: D1Database,
  userId: string,
  stripeSessionId?: string | null,
) {
  const query = stripeSessionId
    ? db
        .prepare(
          `SELECT * FROM commerce_orders
           WHERE user_id = ? AND stripe_session_id = ?
           ORDER BY created_at DESC LIMIT 1`,
        )
        .bind(userId, stripeSessionId)
    : db
        .prepare(
          `SELECT * FROM commerce_orders
           WHERE user_id = ?
           ORDER BY created_at DESC LIMIT 25`,
        )
        .bind(userId);
  const result = await query.all<CommerceOrderRow>();
  return result.results.map(orderView);
}

export async function getOrderForFulfillment(
  db: D1Database,
  orderId: string,
): Promise<CommerceOrderRow | null> {
  return selectOrder(db, "SELECT * FROM commerce_orders WHERE id = ?", orderId);
}

export async function listReconciliationOrderIds(
  db: D1Database,
  limit = 25,
): Promise<string[]> {
  const result = await db
    .prepare(
      `SELECT id FROM commerce_orders
       WHERE payment_status = 'paid'
         AND fulfillment_status IN
           ('queued', 'retry', 'cost_review', 'awaiting_confirmation', 'submitted')
       ORDER BY updated_at ASC
       LIMIT ?`,
    )
    .bind(Math.max(1, Math.min(100, limit)))
    .all<{ id: string }>();
  return result.results.map((row) => row.id);
}

export async function recordFulfillmentAttempt(
  db: D1Database,
  orderId: string,
  stage: string,
  outcome: string,
  providerStatus?: number | null,
  errorCode?: string | null,
) {
  await db
    .prepare(
      `INSERT INTO commerce_fulfillment_attempts
       (order_id, stage, outcome, provider_status, error_code, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      orderId,
      stage,
      outcome,
      providerStatus ?? null,
      errorCode ?? null,
      Math.floor(Date.now() / 1000),
    )
    .run();
}

export async function updatePrintfulState(
  db: D1Database,
  orderId: string,
  input: {
    fulfillmentStatus: string;
    printfulOrderId?: number | null;
    printfulStatus?: string | null;
    printfulCosts?: unknown;
    errorCode?: string | null;
  },
) {
  await db
    .prepare(
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
       WHERE id = ?`,
    )
    .bind(
      input.fulfillmentStatus,
      input.printfulOrderId ?? null,
      input.printfulStatus ?? null,
      input.printfulCosts === undefined
        ? null
        : JSON.stringify(input.printfulCosts),
      input.errorCode ?? null,
      input.fulfillmentStatus,
      input.fulfillmentStatus,
      Math.floor(Date.now() / 1000),
      orderId,
    )
    .run();
}

export async function recordRefund(
  db: D1Database,
  input: {
    stripeEventId: string;
    stripeRefundId: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
    status: string;
    reason: string | null;
  },
) {
  const order = await selectOrder(
    db,
    "SELECT * FROM commerce_orders WHERE stripe_payment_intent_id = ?",
    input.paymentIntentId,
  );
  if (!order) return { matched: false };
  const now = Math.floor(Date.now() / 1000);
  await db.batch([
    db
      .prepare(
        `INSERT INTO commerce_refunds
         (stripe_refund_id, order_id, stripe_event_id, amount, currency, status, reason, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(stripe_refund_id) DO UPDATE SET
           stripe_event_id = excluded.stripe_event_id,
           amount = excluded.amount,
           status = excluded.status,
           reason = excluded.reason,
           updated_at = excluded.updated_at`,
      )
      .bind(
        input.stripeRefundId,
        order.id,
        input.stripeEventId,
        input.amount,
        input.currency,
        input.status,
        input.reason,
        now,
        now,
      ),
    db
      .prepare(
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
         WHERE id = ?`,
      )
      .bind(
        input.status,
        order.id,
        input.status,
        order.id,
        now,
        order.id,
      ),
  ]);
  return { matched: true, orderId: order.id };
}
