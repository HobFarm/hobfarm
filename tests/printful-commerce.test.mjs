import assert from "node:assert/strict";
import test from "node:test";

import { MELTING_RABBIT_HOLE_DAD_HAT } from "../workers/commerce/src/catalog.mjs";
import {
  checkoutCartFingerprint,
  normalizeCheckoutCart,
} from "../workers/commerce/src/checkout.mjs";
import { inspectPrintfulProduct } from "../workers/commerce/src/printful.mjs";
import { inspectPrintfulShipping } from "../workers/commerce/src/printful.mjs";
import {
  buildPrintfulDraftOrder,
  runPrintfulFulfillment,
} from "../workers/commerce/src/printful-orders.mjs";
import { calculateThresholdShipping } from "../workers/commerce/src/shipping.mjs";

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

test("hat stays launch-disabled while verified price and shipping policy remain fixed", () => {
  assert.equal(MELTING_RABBIT_HOLE_DAD_HAT.launch.enabled, false);
  assert.equal(MELTING_RABBIT_HOLE_DAD_HAT.printful.variants.length, 2);
  assert.equal(
    MELTING_RABBIT_HOLE_DAD_HAT.printful.variants[0].retailAmount,
    2499,
  );
  assert.equal(
    MELTING_RABBIT_HOLE_DAD_HAT.shipping.freeShippingThresholdAmount,
    4900,
  );
  assert.equal(MELTING_RABBIT_HOLE_DAD_HAT.shipping.standardShippingAmount, 449);
  assert.equal(MELTING_RABBIT_HOLE_DAD_HAT.printful.catalogProductId, 206);
  assert.equal(MELTING_RABBIT_HOLE_DAD_HAT.printful.placement, "front_dtf_hat");
  assert.equal(MELTING_RABBIT_HOLE_DAD_HAT.printful.technique, "dtfilm");
  assert.equal(
    MELTING_RABBIT_HOLE_DAD_HAT.printful.artworkUrl,
    "https://cdn.hob.farm/products/melting-rabbit-hole-dad-hat/melting-rabbit-icon-light.png",
  );
  assert.match(MELTING_RABBIT_HOLE_DAD_HAT.launch.reason, /sample approval/);
});

test("trusted checkout cart makes one hat $29.48 shipped and two hats free to ship", () => {
  const oneHat = normalizeCheckoutCart(
    [{ productCode: "melting-rabbit-hole-dad-hat", variantCode: "black", quantity: 1 }],
    { requireLaunch: false },
  );
  assert.equal(oneHat.merchandiseSubtotalAmount, 2499);
  assert.equal(oneHat.shippingAmount, 449);
  assert.equal(oneHat.totalAmount, 2948);
  assert.equal(oneHat.amountUntilFreeShipping, 2401);

  const twoHats = normalizeCheckoutCart(
    [
      { productCode: "melting-rabbit-hole-dad-hat", variantCode: "black", quantity: 1 },
      { productCode: "melting-rabbit-hole-dad-hat", variantCode: "dark-grey", quantity: 1 },
    ],
    { requireLaunch: false },
  );
  assert.equal(twoHats.merchandiseSubtotalAmount, 4998);
  assert.equal(twoHats.shippingAmount, 0);
  assert.equal(twoHats.totalAmount, 4998);
  assert.equal(twoHats.qualifiesForFreeShipping, true);
  assert.equal(
    checkoutCartFingerprint(twoHats),
    "melting-rabbit-hole-dad-hat:black:1:2499|melting-rabbit-hole-dad-hat:dark-grey:1:2499",
  );
});

test("checkout cart rejects client-supplied amounts and launch remains a server gate", () => {
  assert.throws(
    () =>
      normalizeCheckoutCart(
        [{
          productCode: "melting-rabbit-hole-dad-hat",
          variantCode: "black",
          quantity: 1,
          unitAmount: 1,
        }],
        { requireLaunch: false },
      ),
    /unsupported field/,
  );
  assert.throws(
    () =>
      normalizeCheckoutCart([
        { productCode: "melting-rabbit-hole-dad-hat", variantCode: "black", quantity: 1 },
      ]),
    /not open for checkout/,
  );
});

test("direct checkout is gated and never calls a Printful order endpoint", async () => {
  const source = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../functions/api/shop/checkout.ts", import.meta.url), "utf8"),
  );
  assert.match(source, /DIRECT_SHOP_CHECKOUT_ENABLED/);
  assert.match(source, /shipping_address_collection/);
  assert.match(source, /shipping_options/);
  assert.match(source, /normalizeCheckoutCart/);
  assert.doesNotMatch(source, /printful\.com|\/orders|confirmation/);
});

test("shipping inspection compares multi-item scenarios without creating an order", async () => {
  const requests = [];
  const fetchImpl = async (url, options) => {
    requests.push({ url, options });
    return jsonResponse({
      data: [
        {
          shipping: "STANDARD",
          shipping_method_name: "Flat Rate",
          rate: "4.49",
          currency: "USD",
          shipments: [
            {
              departure_country: "US",
              shipment_items: [],
              customs_fees_possible: false,
            },
          ],
        },
      ],
    });
  };

  const result = await inspectPrintfulShipping({
    token: "printful-test-token",
    storeId: 42,
    destination: {
      country_code: "US",
      state_code: "NV",
      zip: "89101",
    },
    scenarios: [
      {
        code: "one",
        items: [{ catalogVariantId: 7854, quantity: 1 }],
      },
      {
        code: "two",
        items: [{ catalogVariantId: 7854, quantity: 2 }],
      },
    ],
    fetchImpl,
  });

  assert.equal(result.scenarios.length, 2);
  assert.equal(result.scenarios[0].rates[0].rate, "4.49");
  assert.equal(requests.length, 2);
  assert.ok(requests.every((request) => new URL(request.url).pathname === "/v2/shipping-rates"));
  assert.ok(requests.every((request) => request.options.method === "POST"));
  assert.ok(requests.every((request) => !request.url.includes("/orders")));
});

test("Printful draft fixture uses v2 catalog items and the durable approved artwork", () => {
  const cart = normalizeCheckoutCart(
    [
      {
        productCode: "melting-rabbit-hole-dad-hat",
        variantCode: "black",
        quantity: 1,
      },
      {
        productCode: "melting-rabbit-hole-dad-hat",
        variantCode: "dark-grey",
        quantity: 1,
      },
    ],
    { requireLaunch: false },
  );
  const body = buildPrintfulDraftOrder({
    order: {
      id: "ord_fixture",
      printful_external_id: "hobfarm_ord_fixture",
      cart_json: JSON.stringify({ lines: cart.lines, currency: cart.currency }),
      currency: "USD",
      shipping_amount: cart.shippingAmount,
      tax_amount: 0,
    },
    recipient: {
      name: "Test Customer",
      address1: "123 Test Street",
      address2: null,
      city: "Las Vegas",
      stateCode: "NV",
      countryCode: "US",
      postalCode: "89101",
      email: "you@example.com",
      phone: null,
    },
  });

  assert.equal(body.external_id, "hobfarm_ord_fixture");
  assert.equal(body.order_items.length, 2);
  assert.deepEqual(
    body.order_items.map((item) => item.catalog_variant_id),
    [7854, 12736],
  );
  assert.ok(
    body.order_items.every(
      (item) =>
        item.placements[0].placement === "front_dtf_hat" &&
        item.placements[0].technique === "dtfilm" &&
        item.placements[0].layers[0].url ===
          MELTING_RABBIT_HOLE_DAD_HAT.printful.artworkUrl,
    ),
  );
  assert.equal(body.retail_costs.shipping, "0.00");
});

test("fulfillment rehearsal creates and confirms only inside the mocked v2 client", async () => {
  const requests = [];
  const cart = normalizeCheckoutCart(
    [
      {
        productCode: "melting-rabbit-hole-dad-hat",
        variantCode: "black",
        quantity: 2,
      },
    ],
    { requireLaunch: false },
  );
  const order = {
    id: "ord_rehearsal",
    printful_external_id: "hobfarm_ord_rehearsal",
    cart_json: JSON.stringify({ lines: cart.lines, currency: cart.currency }),
    currency: "USD",
    shipping_amount: cart.shippingAmount,
    tax_amount: 0,
  };
  const recipient = {
    name: "Test Customer",
    address1: "123 Test Street",
    address2: null,
    city: "Las Vegas",
    stateCode: "NV",
    countryCode: "US",
    postalCode: "89101",
    email: "you@example.com",
    phone: null,
  };
  const fetchImpl = async (url, options) => {
    requests.push({ url, options });
    const path = new URL(url).pathname;
    if (options.method === "GET") return jsonResponse({ error: "not found" }, 404);
    if (path === "/v2/orders") {
      return jsonResponse({
        data: {
          id: 7001,
          external_id: order.printful_external_id,
          status: "draft",
          costs: {
            calculation_status: "done",
            currency: "USD",
            total: "33.99",
          },
        },
      });
    }
    if (path === "/v2/orders/7001/confirmation") {
      return jsonResponse({
        data: {
          id: 7001,
          status: "pending",
          costs: {
            calculation_status: "done",
            currency: "USD",
            total: "33.99",
          },
        },
      });
    }
    throw new Error(`Unexpected request: ${options.method} ${path}`);
  };

  const held = await runPrintfulFulfillment({
    order,
    recipient,
    token: "printful-test-token",
    allowDraftCreation: false,
    allowConfirmation: false,
    maxProviderCostAmount: 4000,
    fetchImpl,
  });
  assert.equal(held.outcome, "held");
  assert.equal(held.code, "printful_draft_disabled");
  assert.equal(requests.length, 1);

  requests.length = 0;
  const rehearsed = await runPrintfulFulfillment({
    order,
    recipient,
    token: "printful-test-token",
    allowDraftCreation: true,
    allowConfirmation: true,
    maxProviderCostAmount: 4000,
    fetchImpl,
  });
  assert.equal(rehearsed.outcome, "submitted");
  assert.equal(rehearsed.printfulOrderId, 7001);
  assert.deepEqual(
    requests.map((request) => [
      request.options.method,
      new URL(request.url).pathname,
    ]),
    [
      ["GET", "/v2/orders/@hobfarm_ord_rehearsal"],
      ["POST", "/v2/orders"],
      ["POST", "/v2/orders/7001/confirmation"],
    ],
  );
});

test("production fulfillment switches default to a complete hard stop", async () => {
  const config = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../workers/commerce/wrangler.toml", import.meta.url), "utf8"),
  );
  assert.match(config, /FULFILLMENT_EXECUTION_ENABLED = "false"/);
  assert.match(config, /PRINTFUL_DRAFT_CREATION_ENABLED = "false"/);
  assert.match(config, /PRINTFUL_CONFIRMATION_ENABLED = "false"/);
  assert.match(config, /PRINTFUL_MAX_ORDER_COST_AMOUNT = "0"/);
});

test("threshold shipping uses trusted multi-item subtotal", () => {
  const result = calculateThresholdShipping(
    [
      { unitAmount: 3200, quantity: 1 },
      { unitAmount: 1800, quantity: 1 },
    ],
    {
      freeShippingThresholdAmount: 5000,
      standardShippingAmount: 695,
    },
  );

  assert.deepEqual(result, {
    merchandiseSubtotalAmount: 5000,
    shippingAmount: 0,
    qualifiesForFreeShipping: true,
    amountUntilFreeShipping: 0,
  });
});

test("threshold shipping reports the remaining amount below the threshold", () => {
  const result = calculateThresholdShipping(
    [{ unitAmount: 3200, quantity: 1 }],
    {
      freeShippingThresholdAmount: 5000,
      standardShippingAmount: 695,
    },
  );

  assert.equal(result.shippingAmount, 695);
  assert.equal(result.amountUntilFreeShipping, 1800);
});

test("Printful inspection distinguishes a template from a store product", async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    const parsed = new URL(url);

    if (parsed.pathname === "/v2/stores") {
      return jsonResponse({
        data: [{ id: 42, name: "HobFarm Shop", type: "native" }],
      });
    }
    if (parsed.pathname === "/product-templates") {
      return jsonResponse({
        result: {
          items: [
            {
              id: 900,
              product_id: 328,
              title: "Melting Rabbit Hole Dad Hat",
              available_variant_ids: [1234],
              colors: [{ color_name: "Black" }],
              sizes: ["One size"],
              placements: [{ placement: "front" }],
              mockup_file_url: "https://files.example.test/hat.png",
            },
          ],
        },
        paging: { total: 1 },
      });
    }
    if (parsed.pathname === "/store/products") {
      return jsonResponse({
        result: [],
        paging: { total: 0 },
      });
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const result = await inspectPrintfulProduct({
    token: "printful-test-token",
    targetTitle: "Melting Rabbit Hole Dad Hat",
    targetStoreName: "HobFarm Shop",
    fetchImpl,
  });

  assert.equal(result.state, "template_only");
  assert.equal(result.templateMatches[0].catalogProductId, 328);
  assert.equal(result.syncProductMatches.length, 0);
  assert.equal(
    calls.find((call) => new URL(call.url).pathname === "/store/products")
      .options.headers["X-PF-Store-Id"],
    "42",
  );
  assert.ok(calls.every((call) => call.options.headers.Authorization.startsWith("Bearer ")));
});

test("Printful inspection reports a matching store product", async () => {
  const fetchImpl = async (url) => {
    const parsed = new URL(url);
    if (parsed.pathname === "/v2/stores") {
      return jsonResponse({
        data: [{ id: 42, name: "HobFarm Shop", type: "native" }],
      });
    }
    if (parsed.pathname === "/product-templates") {
      return jsonResponse({ result: { items: [] }, paging: { total: 0 } });
    }
    if (parsed.pathname === "/store/products") {
      return jsonResponse({
        result: [
          {
            id: 77,
            external_id: "hat-1",
            name: "Melting Rabbit Hole Dad Hat",
            variants: 1,
            synced: 1,
            thumbnail_url: "https://files.example.test/hat.png",
            is_ignored: false,
          },
        ],
        paging: { total: 1 },
      });
    }
    if (parsed.pathname === "/store/products/77") {
      return jsonResponse({
        result: {
          sync_product: {
            id: 77,
            external_id: "hat-1",
            name: "Melting Rabbit Hole Dad Hat",
            variants: 1,
            synced: 1,
            thumbnail_url: "https://files.example.test/hat.png",
            is_ignored: false,
          },
          sync_variants: [
            {
              id: 701,
              external_id: "hat-black",
              variant_id: 1234,
              name: "Black",
              synced: true,
              retail_price: "24.99",
              currency: "USD",
              sku: "HF-HAT-BLACK",
              availability_status: "active",
              files: [],
              options: [],
            },
          ],
        },
      });
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const result = await inspectPrintfulProduct({
    token: "printful-test-token",
    targetTitle: "Melting Rabbit Hole Dad Hat",
    targetStoreName: "HobFarm Shop",
    fetchImpl,
  });

  assert.equal(result.state, "store_product");
  assert.equal(result.syncProductMatches[0].id, 77);
  assert.equal(result.syncProductMatches[0].syncedVariantCount, 1);
  assert.equal(result.syncProductMatches[0].variants[0].catalogVariantId, 1234);
  assert.equal(result.syncProductMatches[0].variants[0].retailPrice, "24.99");
});

test("Printful inspection continues when product-template scope is unavailable", async () => {
  const fetchImpl = async (url) => {
    const parsed = new URL(url);
    if (parsed.pathname === "/v2/stores") {
      return jsonResponse({
        data: [{ id: 42, name: "HobFarm Shop", type: "native" }],
      });
    }
    if (parsed.pathname === "/product-templates") {
      return jsonResponse({ code: 403 }, 403);
    }
    if (parsed.pathname === "/store/products") {
      return jsonResponse({
        result: [
          {
            id: 77,
            name: "Melting Rabbit Hole Dad Hat",
            variants: 2,
            synced: 2,
            is_ignored: false,
          },
        ],
        paging: { total: 1 },
      });
    }
    if (parsed.pathname === "/store/products/77") {
      return jsonResponse({
        result: {
          sync_product: {
            id: 77,
            name: "Melting Rabbit Hole Dad Hat",
            variants: 2,
            synced: 2,
            is_ignored: false,
          },
          sync_variants: [],
        },
      });
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const result = await inspectPrintfulProduct({
    token: "printful-test-token",
    targetTitle: "Melting Rabbit Hole Dad Hat",
    targetStoreName: "HobFarm Shop",
    fetchImpl,
  });

  assert.equal(result.state, "store_product");
  assert.equal(result.templateError.code, "printful_scope_denied");
  assert.equal(result.syncProductMatches[0].syncedVariantCount, 2);
});
