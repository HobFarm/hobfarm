const USER_ID = /^[A-Za-z0-9_-]{8,160}$/;
const STABLE_ID = /^[a-z0-9][a-z0-9_-]{2,120}$/;

interface AcademyPurchaseRow {
  purchase_id: string;
  user_id: string;
  product_key: string;
  provider: string;
  provider_order_id: string | null;
  provider_payment_id: string | null;
  amount: number;
  currency: string;
  status: string;
  last_provider_event_created: number | null;
}

interface AcademyProductRow {
  product_key: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
}

export interface AcademyPurchaseReservation {
  userId: string;
  productKey: string;
  checkoutToken: string;
  provider: string;
  amount: number;
  currency: "USD";
}

export interface AcademyPaidEvent {
  provider: string;
  eventId: string;
  eventType: string;
  eventCreated: number;
  providerOrderId: string;
  providerPaymentId: string;
  providerCustomerId: string | null;
  userId: string;
  productKey: string;
  amount: number;
  currency: "USD";
}

export interface AcademyPaymentStateEvent {
  provider: string;
  eventId: string;
  eventType: string;
  eventCreated: number;
  providerPaymentId: string;
  status: "refunded" | "disputed" | "paid";
}

export interface AcademyCheckoutFailureEvent {
  provider: string;
  eventId: string;
  eventType: string;
  eventCreated: number;
  providerOrderId: string;
  status: "failed" | "expired";
}

function contractError(code: string): Error {
  return Object.assign(new Error(code), { code });
}

function assertUserId(userId: string): void {
  if (!USER_ID.test(userId)) throw contractError("invalid_user");
}

function assertStableId(value: string, code = "invalid_contract"): void {
  if (!STABLE_ID.test(value)) throw contractError(code);
}

async function payloadHash(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function getAcademyProduct(
  db: D1Database,
  productKey: string,
): Promise<AcademyProductRow | null> {
  assertStableId(productKey, "invalid_product");
  return db.prepare(
    `SELECT product_key, title, amount, currency, status
       FROM academy_products WHERE product_key = ?1`,
  ).bind(productKey).first<AcademyProductRow>();
}

export async function reserveAcademyPurchase(
  db: D1Database,
  input: AcademyPurchaseReservation,
): Promise<{ purchaseId: string; duplicate: boolean }> {
  assertUserId(input.userId);
  assertStableId(input.productKey, "invalid_product");
  assertStableId(input.checkoutToken, "invalid_checkout_token");
  if (input.provider !== "stripe" || input.currency !== "USD" || !Number.isInteger(input.amount)) {
    throw contractError("invalid_contract");
  }
  const product = await getAcademyProduct(db, input.productKey);
  if (!product || product.status !== "active" || product.amount !== input.amount || product.currency !== input.currency) {
    throw contractError("product_mismatch");
  }
  const purchaseId = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  await db.prepare(
    `INSERT OR IGNORE INTO academy_purchases
       (purchase_id, user_id, product_key, provider, checkout_token, amount, currency, status, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'checkout_pending', ?8, ?8)`,
  ).bind(
    purchaseId,
    input.userId,
    input.productKey,
    input.provider,
    input.checkoutToken,
    input.amount,
    input.currency,
    now,
  ).run();
  const reserved = await db.prepare(
    `SELECT purchase_id, product_key, amount, currency, provider
       FROM academy_purchases WHERE user_id = ?1 AND checkout_token = ?2`,
  ).bind(input.userId, input.checkoutToken).first<{
    purchase_id: string;
    product_key: string;
    amount: number;
    currency: string;
    provider: string;
  }>();
  if (!reserved) throw contractError("purchase_reservation_failed");
  if (
    reserved.product_key !== input.productKey ||
    reserved.amount !== input.amount ||
    reserved.currency !== input.currency ||
    reserved.provider !== input.provider
  ) throw contractError("checkout_token_conflict");
  return { purchaseId: reserved.purchase_id, duplicate: reserved.purchase_id !== purchaseId };
}

export async function attachAcademyCheckout(
  db: D1Database,
  purchaseId: string,
  providerOrderId: string,
): Promise<void> {
  if (!purchaseId || !providerOrderId) throw contractError("invalid_contract");
  const now = Math.floor(Date.now() / 1000);
  const result = await db.prepare(
    `UPDATE academy_purchases
       SET provider_order_id = COALESCE(provider_order_id, ?2), updated_at = ?3
     WHERE purchase_id = ?1
       AND (provider_order_id IS NULL OR provider_order_id = ?2)`,
  ).bind(purchaseId, providerOrderId, now).run();
  if (!result.meta.changes) throw contractError("purchase_not_found_or_conflict");
}

export async function recordAcademyPaid(
  db: D1Database,
  input: AcademyPaidEvent,
): Promise<{ duplicate: boolean; purchaseId: string }> {
  assertUserId(input.userId);
  assertStableId(input.productKey, "invalid_product");
  if (
    input.provider !== "stripe" ||
    input.currency !== "USD" ||
    !Number.isInteger(input.amount) ||
    !Number.isInteger(input.eventCreated)
  ) throw contractError("invalid_contract");

  const eventExists = await db.prepare(
    `SELECT event_id FROM academy_events WHERE provider = ?1 AND event_id = ?2`,
  ).bind(input.provider, input.eventId).first();
  if (eventExists) {
    const existing = await db.prepare(
      `SELECT purchase_id FROM academy_purchases
       WHERE provider = ?1 AND provider_order_id = ?2`,
    ).bind(input.provider, input.providerOrderId).first<{ purchase_id: string }>();
    return { duplicate: true, purchaseId: existing?.purchase_id ?? "unknown" };
  }

  const purchase = await db.prepare(
    `SELECT purchase_id, user_id, product_key, provider, provider_order_id,
            provider_payment_id, amount, currency, status, last_provider_event_created
       FROM academy_purchases
      WHERE provider = ?1 AND provider_order_id = ?2`,
  ).bind(input.provider, input.providerOrderId).first<AcademyPurchaseRow>();
  if (!purchase) throw contractError("purchase_not_found");
  if (
    purchase.user_id !== input.userId ||
    purchase.product_key !== input.productKey ||
    purchase.amount !== input.amount ||
    purchase.currency !== input.currency ||
    (purchase.provider_payment_id && purchase.provider_payment_id !== input.providerPaymentId)
  ) throw contractError("payment_mismatch");

  const now = Math.floor(Date.now() / 1000);
  const hash = await payloadHash(input);
  const terminalPurchase = ["refunded", "disputed", "revoked"].includes(purchase.status);
  const stale = purchase.last_provider_event_created !== null && (
    input.eventCreated < purchase.last_provider_event_created ||
    (input.eventCreated === purchase.last_provider_event_created && terminalPurchase)
  );
  if (stale) {
    await db.prepare(
      `INSERT INTO academy_events
       (provider, event_id, event_type, purchase_id, event_created, payload_hash, outcome, recorded_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'ignored_stale', ?7)`,
    ).bind(input.provider, input.eventId, input.eventType, purchase.purchase_id, input.eventCreated, hash, now).run();
    return { duplicate: false, purchaseId: purchase.purchase_id };
  }

  const grants = await db.prepare(
    `SELECT course_id FROM academy_product_grants WHERE product_key = ?1`,
  ).bind(input.productKey).all<{ course_id: string }>();
  if (!grants.results.length) throw contractError("product_has_no_grants");

  const statements = [
    db.prepare(
      `UPDATE academy_purchases
       SET provider_payment_id = ?2, provider_customer_id = ?3, status = 'paid',
           last_provider_event_created = ?4, paid_at = COALESCE(paid_at, ?5), updated_at = ?5
       WHERE purchase_id = ?1`,
    ).bind(purchase.purchase_id, input.providerPaymentId, input.providerCustomerId, input.eventCreated, now),
    db.prepare(
      `INSERT INTO academy_events
       (provider, event_id, event_type, purchase_id, event_created, payload_hash, outcome, recorded_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'applied', ?7)`,
    ).bind(input.provider, input.eventId, input.eventType, purchase.purchase_id, input.eventCreated, hash, now),
    ...grants.results.map(({ course_id }) => db.prepare(
      `INSERT INTO academy_entitlements
       (entitlement_id, user_id, course_id, grant_type, grant_identity, status,
        source_purchase_id, granted_at, updated_at)
       VALUES (?1, ?2, ?3, 'purchase', ?4, 'active', ?5, ?6, ?6)
       ON CONFLICT(user_id, course_id, grant_type, grant_identity) DO UPDATE SET
         status = 'active', updated_at = excluded.updated_at`,
    ).bind(crypto.randomUUID(), input.userId, course_id, purchase.purchase_id, purchase.purchase_id, now)),
  ];
  await db.batch(statements);
  return { duplicate: false, purchaseId: purchase.purchase_id };
}

export async function recordAcademyCheckoutFailure(
  db: D1Database,
  input: AcademyCheckoutFailureEvent,
): Promise<{ matched: boolean; duplicate?: boolean; stale?: boolean }> {
  if (
    input.provider !== "stripe" ||
    !input.eventId ||
    !input.providerOrderId ||
    !Number.isInteger(input.eventCreated)
  ) throw contractError("invalid_contract");
  const purchase = await db.prepare(
    `SELECT purchase_id, user_id, product_key, provider, provider_order_id,
            provider_payment_id, amount, currency, status, last_provider_event_created
       FROM academy_purchases WHERE provider = ?1 AND provider_order_id = ?2`,
  ).bind(input.provider, input.providerOrderId).first<AcademyPurchaseRow>();
  if (!purchase) return { matched: false };
  const duplicate = await db.prepare(
    `SELECT event_id FROM academy_events WHERE provider = ?1 AND event_id = ?2`,
  ).bind(input.provider, input.eventId).first();
  if (duplicate) return { matched: true, duplicate: true };
  const now = Math.floor(Date.now() / 1000);
  const stale = purchase.last_provider_event_created !== null && input.eventCreated < purchase.last_provider_event_created;
  const hash = await payloadHash(input);
  const statements = [
    db.prepare(
      `INSERT INTO academy_events
       (provider, event_id, event_type, purchase_id, event_created, payload_hash, outcome, recorded_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
    ).bind(input.provider, input.eventId, input.eventType, purchase.purchase_id, input.eventCreated, hash, stale ? "ignored_stale" : "applied", now),
  ];
  if (!stale && purchase.status === "checkout_pending") {
    statements.push(db.prepare(
      `UPDATE academy_purchases
          SET status = ?2, last_provider_event_created = ?3, updated_at = ?4
        WHERE purchase_id = ?1 AND status = 'checkout_pending'`,
    ).bind(purchase.purchase_id, input.status, input.eventCreated, now));
  }
  await db.batch(statements);
  return { matched: true, stale };
}

export async function recordAcademyPaymentState(
  db: D1Database,
  input: AcademyPaymentStateEvent,
): Promise<{ matched: boolean; duplicate?: boolean; stale?: boolean }> {
  const purchase = await db.prepare(
    `SELECT purchase_id, user_id, product_key, provider, provider_order_id,
            provider_payment_id, amount, currency, status, last_provider_event_created
       FROM academy_purchases WHERE provider = ?1 AND provider_payment_id = ?2`,
  ).bind(input.provider, input.providerPaymentId).first<AcademyPurchaseRow>();
  if (!purchase) return { matched: false };
  const eventExists = await db.prepare(
    `SELECT event_id FROM academy_events WHERE provider = ?1 AND event_id = ?2`,
  ).bind(input.provider, input.eventId).first();
  if (eventExists) return { matched: true, duplicate: true };
  const now = Math.floor(Date.now() / 1000);
  const hash = await payloadHash(input);
  const stale = purchase.last_provider_event_created !== null && input.eventCreated < purchase.last_provider_event_created;
  const outcome = stale ? "ignored_stale" : "applied";
  const entitlementStatus = input.status === "paid" ? "active" : "suspended";
  const statements = [
    db.prepare(
      `INSERT INTO academy_events
       (provider, event_id, event_type, purchase_id, event_created, payload_hash, outcome, recorded_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
    ).bind(input.provider, input.eventId, input.eventType, purchase.purchase_id, input.eventCreated, hash, outcome, now),
  ];
  if (!stale) {
    statements.push(
      db.prepare(
        `UPDATE academy_purchases SET status = ?2, last_provider_event_created = ?3, updated_at = ?4
         WHERE purchase_id = ?1`,
      ).bind(purchase.purchase_id, input.status, input.eventCreated, now),
      db.prepare(
        `UPDATE academy_entitlements SET status = ?2, updated_at = ?3
         WHERE source_purchase_id = ?1 AND grant_type = 'purchase'`,
      ).bind(purchase.purchase_id, entitlementStatus, now),
    );
  }
  await db.batch(statements);
  return { matched: true, stale };
}

export async function getAcademyAccess(
  db: D1Database,
  userId: string,
  courseId?: string,
): Promise<{ entitlements: Array<Record<string, unknown>>; purchases: Array<Record<string, unknown>> }> {
  assertUserId(userId);
  if (courseId) assertStableId(courseId, "invalid_course");
  const entitlementQuery = courseId
    ? `SELECT entitlement_id, course_id, grant_type, status, granted_at, updated_at
         FROM academy_entitlements WHERE user_id = ?1 AND course_id = ?2 ORDER BY updated_at DESC`
    : `SELECT entitlement_id, course_id, grant_type, status, granted_at, updated_at
         FROM academy_entitlements WHERE user_id = ?1 ORDER BY updated_at DESC`;
  const entitlementArgs = courseId ? [userId, courseId] : [userId];
  const [entitlements, purchases] = await Promise.all([
    db.prepare(entitlementQuery).bind(...entitlementArgs).all<Record<string, unknown>>(),
    db.prepare(
      `SELECT purchase_id, product_key, provider, provider_order_id, amount, currency, status, paid_at, created_at
         FROM academy_purchases WHERE user_id = ?1 ORDER BY created_at DESC`,
    ).bind(userId).all<Record<string, unknown>>(),
  ]);
  return { entitlements: entitlements.results, purchases: purchases.results };
}

export async function putAcademyProgress(
  db: D1Database,
  input: { userId: string; courseId: string; lessonId: string; status: "started" | "complete"; clientUpdatedAt: number },
): Promise<void> {
  assertUserId(input.userId);
  assertStableId(input.courseId, "invalid_course");
  assertStableId(input.lessonId, "invalid_lesson");
  const now = Math.floor(Date.now() / 1000);
  if (
    !Number.isInteger(input.clientUpdatedAt) ||
    input.clientUpdatedAt <= 0 ||
    input.clientUpdatedAt > now + 300
  ) throw contractError("invalid_timestamp");
  await db.prepare(
    `INSERT INTO academy_progress
       (user_id, course_id, lesson_id, status, client_updated_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6)
     ON CONFLICT(user_id, course_id, lesson_id) DO UPDATE SET
       status = CASE
         WHEN academy_progress.status = 'complete' OR excluded.status = 'complete' THEN 'complete'
         WHEN excluded.client_updated_at >= academy_progress.client_updated_at THEN excluded.status
         ELSE academy_progress.status
       END,
       client_updated_at = MAX(academy_progress.client_updated_at, excluded.client_updated_at),
       updated_at = CASE
         WHEN excluded.status = 'complete' OR excluded.client_updated_at >= academy_progress.client_updated_at THEN excluded.updated_at
         ELSE academy_progress.updated_at
       END`,
  ).bind(input.userId, input.courseId, input.lessonId, input.status, input.clientUpdatedAt, now).run();
}

export async function listAcademyProgress(
  db: D1Database,
  userId: string,
): Promise<Array<Record<string, unknown>>> {
  assertUserId(userId);
  const rows = await db.prepare(
    `SELECT course_id, lesson_id, status, client_updated_at, updated_at
       FROM academy_progress WHERE user_id = ?1 ORDER BY updated_at DESC`,
  ).bind(userId).all<Record<string, unknown>>();
  return rows.results;
}

export async function createAcademyQuestion(
  db: D1Database,
  input: { userId: string; courseId: string; lessonId?: string; category: string; question: string },
): Promise<{ reportId: string }> {
  assertUserId(input.userId);
  assertStableId(input.courseId, "invalid_course");
  if (input.lessonId) assertStableId(input.lessonId, "invalid_lesson");
  if (!["content", "tool", "access", "other"].includes(input.category)) throw contractError("invalid_category");
  const question = input.question.trim();
  if (question.length < 10 || question.length > 2000) throw contractError("invalid_question");
  const recent = await db.prepare(
    `SELECT COUNT(*) AS count FROM academy_question_reports
     WHERE user_id = ?1 AND created_at > ?2`,
  ).bind(input.userId, Math.floor(Date.now() / 1000) - 3600).first<{ count: number }>();
  if ((recent?.count ?? 0) >= 5) throw contractError("question_rate_limited");
  const reportId = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  await db.prepare(
    `INSERT INTO academy_question_reports
       (report_id, user_id, course_id, lesson_id, category, question, status, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'open', ?7, ?7)`,
  ).bind(reportId, input.userId, input.courseId, input.lessonId ?? null, input.category, question, now).run();
  return { reportId };
}

export async function listOpenAcademyQuestions(
  db: D1Database,
): Promise<Array<Record<string, unknown>>> {
  const rows = await db.prepare(
    `SELECT report_id, course_id, lesson_id, category, question, created_at
       FROM academy_question_reports WHERE status = 'open'
      ORDER BY course_id, lesson_id, created_at ASC LIMIT 500`,
  ).all<Record<string, unknown>>();
  return rows.results;
}

export async function correctAcademyAccess(
  db: D1Database,
  input: {
    userId: string;
    courseId: string;
    operatorId: string;
    reason: string;
    status: "active" | "revoked";
  },
): Promise<{ entitlementId: string }> {
  assertUserId(input.userId);
  assertStableId(input.courseId, "invalid_course");
  if (!/^[A-Za-z0-9@._-]{3,160}$/.test(input.operatorId)) throw contractError("invalid_operator");
  const reason = input.reason.trim();
  if (reason.length < 10 || reason.length > 500) throw contractError("invalid_reason");
  const grantIdentity = `manual:${input.courseId}:${input.userId}`;
  const existing = await db.prepare(
    `SELECT entitlement_id, status FROM academy_entitlements
     WHERE user_id = ?1 AND course_id = ?2 AND grant_type = 'manual' AND grant_identity = ?3`,
  ).bind(input.userId, input.courseId, grantIdentity).first<{ entitlement_id: string; status: string }>();
  const entitlementId = existing?.entitlement_id ?? crypto.randomUUID();
  const previousStatus = existing?.status ?? "none";
  const now = Math.floor(Date.now() / 1000);
  await db.batch([
    db.prepare(
      `INSERT INTO academy_entitlements
       (entitlement_id, user_id, course_id, grant_type, grant_identity, status,
        reason, operator_id, granted_at, updated_at)
       VALUES (?1, ?2, ?3, 'manual', ?4, ?5, ?6, ?7, ?8, ?8)
       ON CONFLICT(user_id, course_id, grant_type, grant_identity) DO UPDATE SET
         status = excluded.status, reason = excluded.reason,
         operator_id = excluded.operator_id, updated_at = excluded.updated_at`,
    ).bind(entitlementId, input.userId, input.courseId, grantIdentity, input.status, reason, input.operatorId, now),
    db.prepare(
      `INSERT INTO academy_access_corrections
       (correction_id, entitlement_id, operator_id, previous_status, next_status, reason, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`,
    ).bind(crypto.randomUUID(), entitlementId, input.operatorId, previousStatus, input.status, reason, now),
  ]);
  return { entitlementId };
}
