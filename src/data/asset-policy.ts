// Shared paid-asset safety policy.
//
// HobFarm sells full-resolution character sheets and asset packs (DeviantArt,
// later Ko-fi/Etsy). Public pages must only ever expose capped, cropped, or
// otherwise reduced previews of those files, never the raw original.
//
// This module is the single source of truth for the policy shape (mirrored as a
// Zod schema in src/content.config.ts) and the global preview cap. Enforcement
// lives in src/lib/gallery.ts (capping helpers) and the gallery components,
// which read this policy to decide what may open full-size in the lightbox.
//
// CONVENTION: never reference a full-resolution paid original as a public
// `media[].file` / `hero.file`. Public entries reference web-size crops
// (suffix `-web` / `-preview`); the un-suffixed original stays off public pages
// and on the external storefront.

export type PublicPreviewType =
  | "thumb"
  | "web-preview"
  | "poster"
  | "video-preview"
  | "crop";

export interface PaidAssetPolicy {
  /** This entry has a paid full-resolution counterpart sold off-site. */
  hasPaidAsset: boolean;
  /** Public pages may only show reduced/cropped previews of the asset. */
  publicPreviewOnly: boolean;
  /** Preview kinds allowed to appear publicly for this entry. */
  allowedPublicPreviewTypes: PublicPreviewType[];
  /** Whether the full asset is hosted on hob.farm (vs external storefront). */
  fullAssetHostedOnSite: boolean;
  notes?: string;
}

// Global hard cap (px) for any public preview image served through the
// lightbox, OpenGraph, or JSON-LD. Per-item `previewMaxWidth` may lower this but
// never raise it.
export const PREVIEW_MAX_WIDTH = 1600;

// Reasonable width for social/structured-data preview images.
export const SOCIAL_PREVIEW_WIDTH = 1200;

// A conservative default used when an entry opts into the policy without
// spelling out every field.
export const DEFAULT_PAID_ASSET_POLICY: PaidAssetPolicy = {
  hasPaidAsset: true,
  publicPreviewOnly: true,
  allowedPublicPreviewTypes: ["web-preview", "poster", "video-preview"],
  fullAssetHostedOnSite: false,
};
