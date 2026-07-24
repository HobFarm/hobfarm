import { useMemo, useState } from "react";

interface DirectVariant {
  code: string;
  name: string;
  unitAmount: number;
  imageUrl?: string;
  imageAlt?: string;
}

interface Props {
  productCode: string;
  productName: string;
  productPath: string;
  variants: DirectVariant[];
  currency: string;
  standardShippingAmount: number;
  freeShippingThresholdAmount: number;
  checkoutEnabled: boolean;
}

function money(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

export default function DirectProductCart({
  productCode,
  productName,
  productPath,
  variants,
  currency,
  standardShippingAmount,
  freeShippingThresholdAmount,
  checkoutEnabled,
}: Props) {
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(variants.map((variant, index) => [variant.code, index === 0 ? 1 : 0])),
  );
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const summary = useMemo(() => {
    const merchandiseSubtotal = variants.reduce(
      (sum, variant) => sum + variant.unitAmount * (quantities[variant.code] ?? 0),
      0,
    );
    const itemCount = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);
    const qualifiesForFreeShipping =
      merchandiseSubtotal >= freeShippingThresholdAmount && itemCount > 0;
    const shippingAmount = qualifiesForFreeShipping ? 0 : standardShippingAmount;
    return {
      merchandiseSubtotal,
      itemCount,
      qualifiesForFreeShipping,
      shippingAmount,
      amountUntilFreeShipping: Math.max(
        0,
        freeShippingThresholdAmount - merchandiseSubtotal,
      ),
    };
  }, [freeShippingThresholdAmount, quantities, standardShippingAmount, variants]);

  function setQuantity(code: string, quantity: number) {
    setMessage("");
    setQuantities((current) => ({
      ...current,
      [code]: Math.max(0, Math.min(5, quantity)),
    }));
  }

  async function beginCheckout() {
    if (!checkoutEnabled || summary.itemCount === 0 || submitting) return;

    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/shop/checkout", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkoutToken: crypto.randomUUID(),
          items: variants
            .map((variant) => ({
              productCode,
              variantCode: variant.code,
              quantity: quantities[variant.code] ?? 0,
            }))
            .filter((line) => line.quantity > 0),
        }),
      });
      const body = (await response.json()) as {
        url?: string;
        error?: string;
        login_url?: string;
      };

      if (response.status === 401 && body.login_url) {
        window.location.assign(body.login_url);
        return;
      }
      if (!response.ok || !body.url) {
        throw new Error(body.error ?? "Checkout could not be opened.");
      }
      window.location.assign(body.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout could not be opened.");
      setSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="direct-cart-heading"
      className="mt-7 border border-base-700 bg-base-950/70 p-4 sm:p-5"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-magenta-bright">
        Direct shop cart
      </p>
      <h2 id="direct-cart-heading" className="mt-2 font-display text-xl text-white">
        Choose a color and quantity
      </h2>

      <div className="mt-5 grid gap-3">
        {variants.map((variant) => {
          const quantity = quantities[variant.code] ?? 0;
          return (
            <div
              key={variant.code}
              className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-3 border border-base-800 bg-base-900/60 p-3"
            >
              {variant.imageUrl ? (
                <img
                  src={variant.imageUrl}
                  alt={variant.imageAlt ?? `${productName} in ${variant.name}`}
                  width={56}
                  height={56}
                  loading="lazy"
                  className="h-14 w-14 bg-white object-cover"
                />
              ) : (
                <span className="h-14 w-14 bg-base-800" aria-hidden="true" />
              )}
              <div>
                <p className="text-sm font-medium text-white">{variant.name}</p>
                <p className="mt-1 font-mono text-xs text-base-400">
                  {money(variant.unitAmount, currency)} each
                </p>
              </div>
              <label className="grid gap-1 text-right">
                <span className="font-mono text-[10px] uppercase tracking-wider text-base-500">
                  Qty
                </span>
                <select
                  aria-label={`${variant.name} quantity`}
                  value={quantity}
                  onChange={(event) => setQuantity(variant.code, Number(event.target.value))}
                  className="min-w-16 border-base-700 bg-base-950 py-1 pl-2 pr-7 text-sm text-white"
                >
                  {[0, 1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          );
        })}
      </div>

      <dl className="mt-5 grid gap-2 border-t border-base-800 pt-4 text-sm">
        <div className="flex justify-between gap-4 text-base-300">
          <dt>Merchandise</dt>
          <dd className="font-mono">{money(summary.merchandiseSubtotal, currency)}</dd>
        </div>
        <div className="flex justify-between gap-4 text-base-300">
          <dt>U.S. Standard shipping</dt>
          <dd className="font-mono">
            {summary.qualifiesForFreeShipping
              ? "Free"
              : money(summary.shippingAmount, currency)}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-sm leading-relaxed text-base-400">
        {summary.qualifiesForFreeShipping
          ? `This cart qualifies for free Standard shipping at ${money(
              freeShippingThresholdAmount,
              currency,
            )}.`
          : `Add ${money(
              summary.amountUntilFreeShipping,
              currency,
            )} in merchandise for free Standard shipping.`}
      </p>

      <button
        type="button"
        onClick={beginCheckout}
        disabled={!checkoutEnabled || summary.itemCount === 0 || submitting}
        className="mt-5 inline-flex w-full items-center justify-center border border-accent-magenta-bright px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent-magenta/15 disabled:cursor-not-allowed disabled:border-base-700 disabled:text-base-500"
      >
        {submitting
          ? "Opening secure checkout…"
          : checkoutEnabled
            ? "Continue to secure checkout"
            : "Checkout opens after launch review"}
      </button>

      {!checkoutEnabled && (
        <p className="mt-3 text-xs leading-relaxed text-base-500">
          The variants, shipping math, order ledger, and fulfillment controls are staged.
          Payment stays off until the sample and a real test payment pass.
        </p>
      )}
      <p className="sr-only">Product page: {productPath}</p>
      {message && (
        <p role="alert" className="mt-3 text-sm text-accent-red-bright">
          {message}
        </p>
      )}
    </section>
  );
}
