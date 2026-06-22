import Stripe from "stripe";

export const STRIPE_API_VERSION = "2026-04-22.dahlia" as const;

export function createStripeClient(apiKey: string): Stripe {
  return new Stripe(apiKey, {
    apiVersion: STRIPE_API_VERSION,
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export const stripeWebhookCryptoProvider = Stripe.createSubtleCryptoProvider();
