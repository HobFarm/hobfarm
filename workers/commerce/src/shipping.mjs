const MAX_QUANTITY_PER_LINE = 10;
const MAX_CART_LINES = 20;

function requireMinorUnitAmount(value, field) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError(`${field} must be a non-negative integer`);
  }
}

/**
 * Calculate shipping from server-owned prices. Callers must resolve product
 * and variant codes through the private catalog before building these lines.
 */
export function calculateThresholdShipping(lines, policy) {
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_CART_LINES) {
    throw new TypeError(`cart must contain between 1 and ${MAX_CART_LINES} lines`);
  }

  requireMinorUnitAmount(
    policy.freeShippingThresholdAmount,
    "freeShippingThresholdAmount",
  );
  requireMinorUnitAmount(policy.standardShippingAmount, "standardShippingAmount");

  const merchandiseSubtotalAmount = lines.reduce((subtotal, line, index) => {
    requireMinorUnitAmount(line.unitAmount, `lines[${index}].unitAmount`);
    if (
      !Number.isSafeInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > MAX_QUANTITY_PER_LINE
    ) {
      throw new TypeError(
        `lines[${index}].quantity must be an integer between 1 and ${MAX_QUANTITY_PER_LINE}`,
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

  const qualifiesForFreeShipping =
    merchandiseSubtotalAmount >= policy.freeShippingThresholdAmount;

  return Object.freeze({
    merchandiseSubtotalAmount,
    shippingAmount: qualifiesForFreeShipping ? 0 : policy.standardShippingAmount,
    qualifiesForFreeShipping,
    amountUntilFreeShipping: qualifiesForFreeShipping
      ? 0
      : policy.freeShippingThresholdAmount - merchandiseSubtotalAmount,
  });
}

