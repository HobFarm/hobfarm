import { MELTING_RABBIT_HOLE_DAD_HAT } from "./catalog.mjs";
import { calculateThresholdShipping } from "./shipping.mjs";

const MAX_CART_LINES = 8;
const MAX_ITEM_QUANTITY = 5;
const MAX_TOTAL_QUANTITY = 10;
const CART_LINE_FIELDS = new Set(["productCode", "variantCode", "quantity"]);

const products = new Map([
  [MELTING_RABBIT_HOLE_DAD_HAT.productCode, MELTING_RABBIT_HOLE_DAD_HAT],
]);

function invalidCart(message) {
  const error = new Error(message);
  error.code = "invalid_cart";
  return error;
}

function variantKey(productCode, variantCode) {
  return `${productCode}:${variantCode}`;
}

export function normalizeCheckoutCart(input, { requireLaunch = true } = {}) {
  if (!Array.isArray(input) || input.length === 0) {
    throw invalidCart("The cart is empty.");
  }
  if (input.length > MAX_CART_LINES) {
    throw invalidCart("The cart has too many lines.");
  }

  const normalizedByVariant = new Map();

  for (const line of input) {
    if (!line || typeof line !== "object" || Array.isArray(line)) {
      throw invalidCart("Every cart line must be an object.");
    }
    if (Object.keys(line).some((key) => !CART_LINE_FIELDS.has(key))) {
      throw invalidCart("A cart line contains an unsupported field.");
    }

    const productCode =
      typeof line.productCode === "string" ? line.productCode.trim() : "";
    const variantCode =
      typeof line.variantCode === "string" ? line.variantCode.trim() : "";
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
      (candidate) => candidate.variantCode === variantCode,
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
      quantity: combinedQuantity,
    });
  }

  const lines = [...normalizedByVariant.values()].sort((a, b) =>
    variantKey(a.productCode, a.variantCode).localeCompare(
      variantKey(b.productCode, b.variantCode),
    ),
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
    freeShippingThresholdAmount:
      MELTING_RABBIT_HOLE_DAD_HAT.shipping.freeShippingThresholdAmount,
    standardShippingAmount:
      MELTING_RABBIT_HOLE_DAD_HAT.shipping.standardShippingAmount,
  });

  return {
    lines,
    currency: "USD",
    ...shipping,
    totalAmount: shipping.merchandiseSubtotalAmount + shipping.shippingAmount,
  };
}

export function checkoutCartFingerprint(cart) {
  return cart.lines
    .map(
      (line) =>
        `${line.productCode}:${line.variantCode}:${line.quantity}:${line.unitAmount}`,
    )
    .join("|");
}
