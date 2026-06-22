import { cdn } from "./cdn";
import {
  imageSrcset,
  transformImageUrl,
  type ImageTransformOptions,
} from "./media-transforms";

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
