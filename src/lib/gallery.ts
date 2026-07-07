import { cdn } from "./cdn";
import {
  imageSrcset,
  transformImageUrl,
  transformVideoUrl,
  type ImageTransformOptions,
} from "./media-transforms";
import {
  PREVIEW_MAX_WIDTH,
  SOCIAL_PREVIEW_WIDTH,
  type PaidAssetPolicy,
} from "@/data/asset-policy";

export const GALLERY_TYPES = [
  "fashion",
  "character-dev",
  "before-and-after",
  "cute-corrupted",
  "compilation",
  "scene",
  "asset-lab",
  "model-lab",
  "video-workflow",
  "premium-showcase",
] as const;

export type GalleryType = (typeof GALLERY_TYPES)[number];

export const galleryTypeLabels: Record<GalleryType, string> = {
  fashion: "Fashion Grammar",
  "character-dev": "Character Systems",
  "before-and-after": "Before & After",
  "cute-corrupted": "Cute / Corrupted",
  compilation: "Compilation Studies",
  scene: "Scene Studies",
  "asset-lab": "Material Lab",
  "model-lab": "Field Tests",
  "video-workflow": "Motion Studies",
  "premium-showcase": "Premium Previews",
};

export const galleryTypeOrder: GalleryType[] = [
  "fashion",
  "character-dev",
  "before-and-after",
  "cute-corrupted",
  "compilation",
  "scene",
  "asset-lab",
  "model-lab",
  "video-workflow",
  "premium-showcase",
];

// Hex accent values for per-type overlay badges. Applied inline so they
// survive Tailwind's purge and stay readable on top of card images.
export const galleryTypeAccentHex: Record<GalleryType, string> = {
  fashion: "#D9B84F",
  "character-dev": "#B78CFF",
  "before-and-after": "#55D7FF",
  "cute-corrupted": "#FF4FC3",
  compilation: "#F2A93B",
  scene: "#55D7FF",
  "asset-lab": "#42E6A4",
  "model-lab": "#6EB7FF",
  "video-workflow": "#FF7A66",
  "premium-showcase": "#FFD84D",
};

// Universal status accents used by non-category overlay chips.
export const featuredAccentHex = "#FFD84D";
export const neutralAccentHex = "#BDC4D0";

export function mediaUrl(folder: string, file: string): string {
  return cdn.gallery(folder, file);
}

export function mediaImageUrl(
  folder: string,
  file: string,
  options: ImageTransformOptions = {}
): string {
  return transformImageUrl(mediaUrl(folder, file), options);
}

export function mediaImageSrcset(
  folder: string,
  file: string,
  widths: number[],
  options: Omit<ImageTransformOptions, "width"> = { quality: 84 }
): string {
  return imageSrcset(mediaUrl(folder, file), widths, options);
}

// ── Paid-asset safety: public-preview URL helpers ──────────────────────────
// These are the ONLY functions gallery UI should use to build a URL that a
// visitor can open, share, or scrape. They never return the raw full-res
// original. See src/data/asset-policy.ts for the policy shape and cap.

// A capped image URL safe to open in the lightbox. `previewMaxWidth` may lower
// the global cap but never raise it.
export function lightboxImageUrl(
  folder: string,
  file: string,
  previewMaxWidth: number = PREVIEW_MAX_WIDTH
): string {
  const width = Math.min(previewMaxWidth, PREVIEW_MAX_WIDTH);
  return mediaImageUrl(folder, file, { width, quality: 82, fit: "scale-down" });
}

// A capped preview image URL for OpenGraph / JSON-LD / social. Always a
// transformed derivative, never the raw original.
export function previewImageUrl(
  folder: string,
  file: string,
  width: number = SOCIAL_PREVIEW_WIDTH
): string {
  return mediaImageUrl(folder, file, { width, quality: 82, fit: "cover" });
}

export interface SafeMedia {
  src: string;
  type: "image" | "video";
  /** Whether this item may open full-size in the lightbox. */
  canLightbox: boolean;
}

type SafeMediaInput = {
  type: "image" | "video";
  file: string;
  paid?: boolean;
  previewMaxWidth?: number;
};

// Resolve a public-safe media source plus whether it may open in the lightbox.
// Images are always capped (safe to open). Videos cannot be capped server-side
// (no Cloudflare Stream, transformVideoUrl is a no-op), so a paid or
// non-preview video is preview-only: it renders in the grid/hero but does not
// open full-size in the lightbox.
export function safeMediaUrl(
  folder: string,
  item: SafeMediaInput,
  policy?: PaidAssetPolicy
): SafeMedia {
  if (item.type === "video") {
    const videoPreviewAllowed =
      item.paid !== true &&
      (!policy?.publicPreviewOnly ||
        (policy.allowedPublicPreviewTypes ?? []).includes("video-preview"));
    return {
      src: transformVideoUrl(mediaUrl(folder, item.file)),
      type: "video",
      canLightbox: videoPreviewAllowed,
    };
  }
  return {
    src: lightboxImageUrl(folder, item.file, item.previewMaxWidth),
    type: "image",
    canLightbox: true,
  };
}

export const providerLabels: Record<string, string> = {
  stylefusion: "StyleFusion",
  "nano-banana-2": "Nano Banana 2",
  "nano-banana-pro": "Nano Banana Pro",
  "nano-banana": "Nano Banana",
  grok: "Grok",
  gemini: "Gemini",
  chatgpt: "ChatGPT",
  midjourney: "Midjourney",
  flux: "Flux",
  seedream: "Seedream",
};

export const videoLabels: Record<string, string> = {
  veo: "Veo",
  kling: "Kling",
  sora: "Sora",
  grok: "Grok",
  google: "Google",
  runway: "Runway",
};
