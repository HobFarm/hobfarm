import { MELTING_RABBIT_HOLE_DAD_HAT } from "./catalog.mjs";
import { centsToDecimal } from "./order-contracts.mjs";

const PRINTFUL_API_ORIGIN = "https://api.printful.com";

function fulfillmentError(code, message, status) {
  return Object.assign(new Error(message), { code, status });
}

function parseMoney(value) {
  if (typeof value !== "string" || !/^\d+(\.\d{1,2})?$/.test(value)) {
    return null;
  }
  return Math.round(Number(value) * 100);
}

function lineVariant(line) {
  const variant = MELTING_RABBIT_HOLE_DAD_HAT.printful.variants.find(
    (candidate) =>
      candidate.variantCode === line.variantCode &&
      line.productCode === MELTING_RABBIT_HOLE_DAD_HAT.productCode,
  );
  if (!variant) {
    throw fulfillmentError(
      "catalog_mismatch",
      "The stored cart no longer matches the fulfillment catalog.",
    );
  }
  return variant;
}

export function buildPrintfulDraftOrder({
  order,
  recipient,
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
      company: recipient.company ?? undefined,
      address1: recipient.address1,
      address2: recipient.address2 ?? undefined,
      city: recipient.city,
      state_code: recipient.stateCode,
      country_code: recipient.countryCode,
      zip: recipient.postalCode,
      email: recipient.email,
      phone: recipient.phone ?? undefined,
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
                url: MELTING_RABBIT_HOLE_DAD_HAT.printful.artworkUrl,
              },
            ],
          },
        ],
      };
    }),
    retail_costs: {
      currency: order.currency,
      discount: "0.00",
      shipping: centsToDecimal(order.shipping_amount),
      tax: centsToDecimal(order.tax_amount),
    },
  };
}

async function printfulRequest({
  token,
  storeId,
  method,
  pathname,
  body,
  fetchImpl = fetch,
}) {
  const response = await fetchImpl(`${PRINTFUL_API_ORIGIN}${pathname}`, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "HobFarm-Commerce/1.0",
      "X-PF-Store-Id": String(storeId),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok) {
    throw fulfillmentError(
      response.status === 404
        ? "printful_not_found"
        : response.status === 409
          ? "printful_conflict"
          : response.status === 429
            ? "printful_rate_limited"
            : "printful_request_failed",
      "Printful request failed.",
      response.status,
    );
  }
  return payload?.data ?? payload;
}

export async function findPrintfulOrderByExternalId(options) {
  return printfulRequest({
    ...options,
    method: "GET",
    pathname: `/v2/orders/@${encodeURIComponent(options.externalId)}`,
  });
}

export async function createPrintfulDraft(options) {
  if (!options.allowDraftCreation) {
    throw fulfillmentError(
      "printful_draft_disabled",
      "Printful draft creation is disabled.",
    );
  }
  return printfulRequest({
    ...options,
    method: "POST",
    pathname: "/v2/orders",
    body: options.body,
  });
}

export async function confirmPrintfulOrder(options) {
  if (!options.allowConfirmation) {
    throw fulfillmentError(
      "printful_confirmation_disabled",
      "Printful order confirmation is disabled.",
    );
  }
  return printfulRequest({
    ...options,
    method: "POST",
    pathname: `/v2/orders/${encodeURIComponent(options.orderId)}/confirmation`,
  });
}

export async function runPrintfulFulfillment({
  order,
  recipient,
  token,
  allowDraftCreation = false,
  allowConfirmation = false,
  maxProviderCostAmount,
  fetchImpl = fetch,
}) {
  const common = {
    token,
    storeId: MELTING_RABBIT_HOLE_DAD_HAT.printful.storeId,
    fetchImpl,
  };
  let providerOrder;
  try {
    providerOrder = await findPrintfulOrderByExternalId({
      ...common,
      externalId: order.printful_external_id,
    });
  } catch (error) {
    if (error?.code !== "printful_not_found") throw error;
    if (!allowDraftCreation) {
      return {
        outcome: "held",
        stage: "draft",
        code: "printful_draft_disabled",
      };
    }
    providerOrder = await createPrintfulDraft({
      ...common,
      allowDraftCreation,
      body: buildPrintfulDraftOrder({ order, recipient }),
    });
  }

  const providerCostAmount = parseMoney(providerOrder?.costs?.total);
  const calculationStatus = providerOrder?.costs?.calculation_status ?? null;
  const base = {
    printfulOrderId: providerOrder?.id ?? null,
    printfulStatus: providerOrder?.status ?? null,
    printfulCosts: providerOrder?.costs ?? null,
  };
  if (providerOrder?.status !== "draft") {
    return {
      outcome:
        providerOrder?.status === "fulfilled" ? "fulfilled" : "provider_active",
      stage: "reconcile",
      ...base,
    };
  }
  if (calculationStatus !== "done" || providerCostAmount === null) {
    return {
      outcome: "awaiting_costs",
      stage: "cost_review",
      ...base,
    };
  }
  if (
    !Number.isInteger(maxProviderCostAmount) ||
    providerCostAmount > maxProviderCostAmount
  ) {
    return {
      outcome: "held",
      stage: "cost_review",
      code: "provider_cost_limit",
      providerCostAmount,
      ...base,
    };
  }
  if (!allowConfirmation) {
    return {
      outcome: "awaiting_confirmation",
      stage: "confirmation",
      providerCostAmount,
      ...base,
    };
  }

  const confirmed = await confirmPrintfulOrder({
    ...common,
    allowConfirmation,
    orderId: providerOrder.id,
  });
  return {
    outcome: "submitted",
    stage: "confirmation",
    providerCostAmount,
    printfulOrderId: confirmed?.id ?? providerOrder.id,
    printfulStatus: confirmed?.status ?? providerOrder.status,
    printfulCosts: confirmed?.costs ?? providerOrder.costs ?? null,
  };
}
