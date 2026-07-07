// Storefront platform registry for product/drop cards.
// Mirrors the src/data/providers.ts badge pattern: inline hex colors survive
// Tailwind's purge and render consistently on card overlays.

export const PRODUCT_PLATFORMS = [
  "deviantart",
  "kofi",
  "etsy",
  "ebay",
  "lemon-squeezy",
  "hobfarm-direct",
  "patreon",
] as const;

export type ProductPlatform = (typeof PRODUCT_PLATFORMS)[number];

export interface PlatformInfo {
  label: string;
  color: string;
  ctaLabel: string;
}

export const platformInfo: Record<ProductPlatform, PlatformInfo> = {
  deviantart: { label: "DeviantArt", color: "#05cc47", ctaLabel: "Buy on DeviantArt" },
  kofi: { label: "Ko-fi", color: "#ff5e5b", ctaLabel: "Get on Ko-fi" },
  etsy: { label: "Etsy", color: "#f1641e", ctaLabel: "Shop on Etsy" },
  ebay: { label: "eBay", color: "#e53238", ctaLabel: "Find on eBay" },
  "lemon-squeezy": { label: "Lemon Squeezy", color: "#ffc233", ctaLabel: "Buy now" },
  "hobfarm-direct": { label: "HobFarm Direct", color: "#f24da6", ctaLabel: "Buy direct" },
  patreon: { label: "Patreon", color: "#ff424d", ctaLabel: "Unlock on Patreon" },
};

export function getPlatformInfo(platform: ProductPlatform): PlatformInfo {
  return platformInfo[platform];
}
