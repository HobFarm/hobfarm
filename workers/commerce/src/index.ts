import { MELTING_RABBIT_HOLE_DAD_HAT } from "./catalog.mjs";
import { checkoutCartFingerprint } from "./checkout.mjs";
import { decryptJson } from "./crypto";
import {
  attachAcademyCheckout,
  correctAcademyAccess,
  createAcademyQuestion,
  getAcademyAccess,
  getAcademyProduct,
  listAcademyProgress,
  listOpenAcademyQuestions,
  putAcademyProgress,
  recordAcademyCheckoutFailure,
  recordAcademyPaid,
  recordAcademyPaymentState,
  reserveAcademyPurchase,
} from "./academy";
import { normalizeReserveOrder, normalizeStripePaidEvent } from "./order-contracts.mjs";
import {
  attachStripeSession,
  getOrderForFulfillment,
  listReconciliationOrderIds,
  listOrdersForUser,
  recordFulfillmentAttempt,
  recordRefund,
  recordStripeFailure,
  recordStripePaid,
  reserveOrder,
  updatePrintfulState,
} from "./orders";
import {
  inspectPrintfulCatalogProduct,
  inspectPrintfulCatalogVariant,
  inspectPrintfulFile,
  inspectPrintfulProduct,
  inspectPrintfulShipping,
} from "./printful.mjs";
import { runPrintfulFulfillment } from "./printful-orders.mjs";

interface SecretsStoreBinding {
  get(): Promise<string>;
}

interface FulfillmentMessage {
  orderId: string;
}

interface Env {
  PRINTFUL_API_TOKEN: SecretsStoreBinding;
  COMMERCE_DB?: D1Database;
  FULFILLMENT_QUEUE?: Queue<FulfillmentMessage>;
  COMMERCE_DATA_KEY?: string;
  FULFILLMENT_EXECUTION_ENABLED?: string;
  PRINTFUL_DRAFT_CREATION_ENABLED?: string;
  PRINTFUL_CONFIRMATION_ENABLED?: string;
  PRINTFUL_MAX_ORDER_COST_AMOUNT?: string;
}

const JSON_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

function json(payload: unknown, status = 200): Response {
  return Response.json(payload, { status, headers: JSON_HEADERS });
}

function codeFromError(error: unknown, fallback: string): string {
  const code =
    error && typeof error === "object"
      ? (error as { code?: unknown }).code
      : undefined;
  return typeof code === "string" ? code : fallback;
}

async function readJson(request: Request, maxBytes = 64 * 1024): Promise<unknown> {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > maxBytes) {
    throw Object.assign(new Error("Request body is too large."), {
      code: "body_too_large",
    });
  }
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    throw Object.assign(new Error("A JSON request is required."), {
      code: "json_required",
    });
  }
  return request.json();
}

function requireLedger(env: Env): D1Database {
  if (!env.COMMERCE_DB) {
    throw Object.assign(new Error("Commerce ledger is not configured."), {
      code: "ledger_not_configured",
    });
  }
  return env.COMMERCE_DB;
}

async function processFulfillment(env: Env, orderId: string): Promise<void> {
  const db = requireLedger(env);
  const order = await getOrderForFulfillment(db, orderId);
  if (!order || order.payment_status !== "paid") return;
  if (!order.recipient_ciphertext || !order.recipient_iv || !env.COMMERCE_DATA_KEY) {
    await updatePrintfulState(db, orderId, {
      fulfillmentStatus: "held",
      errorCode: "recipient_unavailable",
    });
    return;
  }

  const recipient = await decryptJson<Record<string, unknown>>(
    order.recipient_ciphertext,
    order.recipient_iv,
    env.COMMERCE_DATA_KEY,
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
      maxProviderCostAmount,
    });
    const fulfillmentStatus =
      result.outcome === "fulfilled"
        ? "fulfilled"
        : result.outcome === "submitted" || result.outcome === "provider_active"
          ? "submitted"
          : result.outcome === "awaiting_costs"
            ? "cost_review"
            : result.outcome === "awaiting_confirmation"
              ? "awaiting_confirmation"
              : "held";
    await updatePrintfulState(db, orderId, {
      fulfillmentStatus,
      printfulOrderId:
        "printfulOrderId" in result ? result.printfulOrderId : null,
      printfulStatus:
        "printfulStatus" in result ? result.printfulStatus : null,
      printfulCosts:
        "printfulCosts" in result ? result.printfulCosts : undefined,
      errorCode: result.code ?? null,
    });
    await recordFulfillmentAttempt(
      db,
      orderId,
      result.stage,
      result.outcome,
      null,
      result.code ?? null,
    );
  } catch (error) {
    await updatePrintfulState(db, orderId, {
      fulfillmentStatus: "retry",
      errorCode: codeFromError(error, "printful_fulfillment_failed"),
    });
    await recordFulfillmentAttempt(
      db,
      orderId,
      "provider",
      "failed",
      Number((error as { status?: number })?.status ?? 0) || null,
      codeFromError(error, "printful_fulfillment_failed"),
    );
    throw error;
  }
}

async function handleLedgerRequest(
  request: Request,
  env: Env,
  url: URL,
): Promise<Response | null> {
  if (!url.pathname.startsWith("/internal/")) return null;

  try {
    if (request.method === "GET" && url.pathname.startsWith("/internal/academy/products/")) {
      const productKey = decodeURIComponent(url.pathname.split("/").pop() ?? "");
      const product = await getAcademyProduct(requireLedger(env), productKey);
      return product ? json({ product }) : json({ error: "product_not_found" }, 404);
    }

    if (request.method === "POST" && url.pathname === "/internal/academy/checkout/reserve") {
      const body = (await readJson(request)) as Record<string, unknown>;
      const result = await reserveAcademyPurchase(requireLedger(env), {
        userId: String(body.userId ?? ""),
        productKey: String(body.productKey ?? ""),
        checkoutToken: String(body.checkoutToken ?? ""),
        provider: String(body.provider ?? ""),
        amount: Number(body.amount),
        currency: String(body.currency ?? "") as "USD",
      });
      return json(result);
    }

    if (request.method === "POST" && url.pathname === "/internal/academy/checkout/attach") {
      const body = (await readJson(request)) as Record<string, unknown>;
      await attachAcademyCheckout(
        requireLedger(env),
        String(body.purchaseId ?? ""),
        String(body.providerOrderId ?? ""),
      );
      return json({ attached: true });
    }

    if (request.method === "POST" && url.pathname === "/internal/academy/stripe/paid") {
      const body = (await readJson(request)) as Record<string, unknown>;
      const result = await recordAcademyPaid(requireLedger(env), {
        provider: "stripe",
        eventId: String(body.eventId ?? ""),
        eventType: String(body.eventType ?? ""),
        eventCreated: Number(body.eventCreated),
        providerOrderId: String(body.providerOrderId ?? ""),
        providerPaymentId: String(body.providerPaymentId ?? ""),
        providerCustomerId: typeof body.providerCustomerId === "string" ? body.providerCustomerId : null,
        userId: String(body.userId ?? ""),
        productKey: String(body.productKey ?? ""),
        amount: Number(body.amount),
        currency: String(body.currency ?? "") as "USD",
      });
      return json(result);
    }

    if (request.method === "POST" && url.pathname === "/internal/academy/stripe/payment-state") {
      const body = (await readJson(request)) as Record<string, unknown>;
      const status = String(body.status ?? "");
      if (!(["paid", "refunded", "disputed"] as string[]).includes(status)) {
        return json({ error: "invalid_contract" }, 400);
      }
      return json(await recordAcademyPaymentState(requireLedger(env), {
        provider: "stripe",
        eventId: String(body.eventId ?? ""),
        eventType: String(body.eventType ?? ""),
        eventCreated: Number(body.eventCreated),
        providerPaymentId: String(body.providerPaymentId ?? ""),
        status: status as "paid" | "refunded" | "disputed",
      }));
    }

    if (request.method === "POST" && url.pathname === "/internal/academy/stripe/checkout-failed") {
      const body = (await readJson(request)) as Record<string, unknown>;
      const status = String(body.status ?? "");
      if (status !== "failed" && status !== "expired") return json({ error: "invalid_contract" }, 400);
      return json(await recordAcademyCheckoutFailure(requireLedger(env), {
        provider: "stripe",
        eventId: String(body.eventId ?? ""),
        eventType: String(body.eventType ?? ""),
        eventCreated: Number(body.eventCreated),
        providerOrderId: String(body.providerOrderId ?? ""),
        status,
      }));
    }

    if (request.method === "GET" && url.pathname === "/internal/academy/access") {
      const userId = url.searchParams.get("user_id") ?? "";
      const courseId = url.searchParams.get("course_id") ?? undefined;
      return json(await getAcademyAccess(requireLedger(env), userId, courseId));
    }

    if (request.method === "POST" && url.pathname === "/internal/academy/access/manual") {
      const body = (await readJson(request)) as Record<string, unknown>;
      const status = String(body.status ?? "");
      if (status !== "active" && status !== "revoked") return json({ error: "invalid_contract" }, 400);
      return json(await correctAcademyAccess(requireLedger(env), {
        userId: String(body.userId ?? ""),
        courseId: String(body.courseId ?? ""),
        operatorId: String(body.operatorId ?? ""),
        reason: String(body.reason ?? ""),
        status,
      }));
    }

    if (request.method === "GET" && url.pathname === "/internal/academy/progress") {
      const userId = url.searchParams.get("user_id") ?? "";
      return json({ progress: await listAcademyProgress(requireLedger(env), userId) });
    }

    if (request.method === "POST" && url.pathname === "/internal/academy/progress") {
      const body = (await readJson(request)) as Record<string, unknown>;
      const status = String(body.status ?? "");
      if (status !== "started" && status !== "complete") return json({ error: "invalid_contract" }, 400);
      await putAcademyProgress(requireLedger(env), {
        userId: String(body.userId ?? ""),
        courseId: String(body.courseId ?? ""),
        lessonId: String(body.lessonId ?? ""),
        status,
        clientUpdatedAt: Number(body.clientUpdatedAt),
      });
      return json({ saved: true });
    }

    if (request.method === "POST" && url.pathname === "/internal/academy/questions") {
      const body = (await readJson(request)) as Record<string, unknown>;
      return json(await createAcademyQuestion(requireLedger(env), {
        userId: String(body.userId ?? ""),
        courseId: String(body.courseId ?? ""),
        lessonId: typeof body.lessonId === "string" ? body.lessonId : undefined,
        category: String(body.category ?? ""),
        question: String(body.question ?? ""),
      }));
    }

    if (request.method === "GET" && url.pathname === "/internal/academy/questions/open") {
      return json({ reports: await listOpenAcademyQuestions(requireLedger(env)) });
    }

    if (request.method === "POST" && url.pathname === "/internal/checkout/reserve") {
      const reservation = normalizeReserveOrder(await readJson(request));
      const order = await reserveOrder(requireLedger(env), reservation);
      return json({ order });
    }

    if (
      request.method === "POST" &&
      url.pathname === "/internal/checkout/attach-session"
    ) {
      const body = (await readJson(request)) as Record<string, unknown>;
      if (
        typeof body?.orderId !== "string" ||
        typeof body?.stripeSessionId !== "string"
      ) {
        return json({ error: "invalid_contract" }, 400);
      }
      const order = await attachStripeSession(
        requireLedger(env),
        body.orderId,
        body.stripeSessionId,
      );
      return json({ order });
    }

    if (request.method === "POST" && url.pathname === "/internal/stripe/paid") {
      const event = normalizeStripePaidEvent(await readJson(request));
      if (!env.COMMERCE_DATA_KEY) {
        return json({ error: "data_key_not_configured" }, 503);
      }
      const shouldQueue =
        env.FULFILLMENT_EXECUTION_ENABLED === "true" &&
        Boolean(env.FULFILLMENT_QUEUE);
      const result = await recordStripePaid(
        requireLedger(env),
        event,
        env.COMMERCE_DATA_KEY,
        shouldQueue,
      );
      if (shouldQueue && !result.duplicate) {
        await env.FULFILLMENT_QUEUE!.send({ orderId: event.orderId });
      }
      return json(result);
    }

    if (request.method === "POST" && url.pathname === "/internal/stripe/failed") {
      const body = (await readJson(request)) as Record<string, unknown>;
      if (
        typeof body?.eventId !== "string" ||
        typeof body?.eventType !== "string" ||
        typeof body?.orderId !== "string" ||
        typeof body?.stripeSessionId !== "string"
      ) {
        return json({ error: "invalid_contract" }, 400);
      }
      await recordStripeFailure(requireLedger(env), {
        eventId: body.eventId,
        eventType: body.eventType,
        orderId: body.orderId,
        stripeSessionId: body.stripeSessionId,
      });
      return json({ recorded: true });
    }

    if (request.method === "POST" && url.pathname === "/internal/stripe/refund") {
      const body = (await readJson(request)) as Record<string, unknown>;
      if (
        typeof body?.stripeEventId !== "string" ||
        typeof body?.stripeRefundId !== "string" ||
        typeof body?.paymentIntentId !== "string" ||
        !Number.isInteger(body?.amount) ||
        typeof body?.currency !== "string" ||
        typeof body?.status !== "string"
      ) {
        return json({ error: "invalid_contract" }, 400);
      }
      return json(
        await recordRefund(requireLedger(env), {
          stripeEventId: body.stripeEventId,
          stripeRefundId: body.stripeRefundId,
          paymentIntentId: body.paymentIntentId,
          amount: body.amount as number,
          currency: body.currency,
          status: body.status,
          reason: typeof body.reason === "string" ? body.reason : null,
        }),
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
        url.searchParams.get("stripe_session_id"),
      );
      return json({ orders });
    }
  } catch (error) {
    const code = codeFromError(error, "commerce_request_failed");
    const status =
      code === "ledger_not_configured" || code === "data_key_not_configured"
        ? 503
        : code === "order_not_found"
          ? 404
          : code === "checkout_token_conflict" ||
              code === "stripe_session_conflict" ||
              code === "payment_mismatch"
            ? 409
            : 400;
    return json({ error: code }, status);
  }
  return null;
}

async function handleInspection(
  request: Request,
  env: Env,
  url: URL,
): Promise<Response | null> {
  if (
    request.method === "GET" &&
    url.pathname === "/internal/printful/inspect-hat"
  ) {
    const token = await env.PRINTFUL_API_TOKEN.get();
    return json(
      await inspectPrintfulProduct({
        token,
        targetTitle: MELTING_RABBIT_HOLE_DAD_HAT.templateTitle,
        targetStoreName: MELTING_RABBIT_HOLE_DAD_HAT.targetStoreName,
      }),
    );
  }

  if (
    request.method === "GET" &&
    url.pathname === "/internal/printful/inspect-hat-shipping"
  ) {
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
            items: [{ catalogVariantId: black.catalogVariantId, quantity: 1 }],
          },
          {
            code: "two-black",
            items: [{ catalogVariantId: black.catalogVariantId, quantity: 2 }],
          },
          {
            code: "black-and-grey",
            items: [
              { catalogVariantId: black.catalogVariantId, quantity: 1 },
              { catalogVariantId: grey.catalogVariantId, quantity: 1 },
            ],
          },
          {
            code: "three-black",
            items: [{ catalogVariantId: black.catalogVariantId, quantity: 3 }],
          },
        ],
      }),
    );
  }

  if (
    request.method === "GET" &&
    url.pathname === "/internal/printful/inspect-hat-artwork"
  ) {
    const token = await env.PRINTFUL_API_TOKEN.get();
    return json(
      await inspectPrintfulFile({
        token,
        fileId: MELTING_RABBIT_HOLE_DAD_HAT.printful.artworkFileId,
        storeId: MELTING_RABBIT_HOLE_DAD_HAT.printful.storeId,
      }),
    );
  }

  if (
    request.method === "GET" &&
    url.pathname === "/internal/printful/inspect-hat-catalog-variant"
  ) {
    const variantId = Number(url.searchParams.get("id") ?? 7854);
    if (![7854, 12736].includes(variantId)) {
      return json({ ok: false, code: "invalid_variant" }, 400);
    }
    const token = await env.PRINTFUL_API_TOKEN.get();
    return json(
      await inspectPrintfulCatalogVariant({
        token,
        variantId,
        storeId: MELTING_RABBIT_HOLE_DAD_HAT.printful.storeId,
      }),
    );
  }

  if (
    request.method === "GET" &&
    url.pathname === "/internal/printful/inspect-hat-catalog-product"
  ) {
    const token = await env.PRINTFUL_API_TOKEN.get();
    return json(
      await inspectPrintfulCatalogProduct({
        token,
        productId: MELTING_RABBIT_HOLE_DAD_HAT.printful.catalogProductId,
        storeId: MELTING_RABBIT_HOLE_DAD_HAT.printful.storeId,
      }),
    );
  }
  return null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const ledgerResponse = await handleLedgerRequest(request, env, url);
    if (ledgerResponse) return ledgerResponse;
    try {
      const inspectionResponse = await handleInspection(request, env, url);
      if (inspectionResponse) return inspectionResponse;
    } catch (error) {
      const status = Number((error as { status?: number })?.status ?? 0);
      return json(
        { ok: false, code: codeFromError(error, "printful_inspection_failed") },
        status === 401 || status === 403 || status === 429 ? status : 502,
      );
    }
    return json({ ok: false, code: "not_found" }, 404);
  },

  async queue(
    batch: MessageBatch<FulfillmentMessage>,
    env: Env,
  ): Promise<void> {
    for (const message of batch.messages) {
      try {
        await processFulfillment(env, message.body.orderId);
        message.ack();
      } catch {
        message.retry({ delaySeconds: 300 });
      }
    }
  },

  async scheduled(
    _controller: ScheduledController,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<void> {
    if (
      env.FULFILLMENT_EXECUTION_ENABLED !== "true" ||
      !env.COMMERCE_DB ||
      !env.FULFILLMENT_QUEUE
    ) {
      return;
    }
    const orderIds = await listReconciliationOrderIds(env.COMMERCE_DB);
    await Promise.all(
      orderIds.map((orderId) => env.FULFILLMENT_QUEUE!.send({ orderId })),
    );
  },
};

export { buildPrintfulDraftOrder } from "./printful-orders.mjs";
export { checkoutCartFingerprint };
