const CDN_BASE = "https://cdn.hob.farm/";
const TRANSFORM_BASE = "https://hob.farm";

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "cover" | "scale-down" | "contain";
}

interface VideoTransformOptions {
  width?: number;
  mode?: "video" | "frame";
  time?: string;
  fit?: "cover" | "scale-down" | "contain";
}

export function transformImageUrl(
  cdnUrl: string,
  options: ImageTransformOptions = {}
): string {
  if (!cdnUrl.startsWith(CDN_BASE) || cdnUrl.includes("/cdn-cgi/image/")) {
    return cdnUrl;
  }

  const params: string[] = [];
  if (options.width) params.push(`width=${options.width}`);
  if (options.height) params.push(`height=${options.height}`);
  if (options.quality) params.push(`quality=${options.quality}`);
  if (options.fit) params.push(`fit=${options.fit}`);
  params.push("format=auto");
  if (params.length === 1) return cdnUrl; // only format=auto, skip
  const path = cdnUrl.replace(CDN_BASE, "");
  return `${TRANSFORM_BASE}/cdn-cgi/image/${params.join(",")}/https://cdn.hob.farm/${path}`;
}

export function transformVideoUrl(
  cdnUrl: string,
  _options: VideoTransformOptions = {}
): string {
  // Cloudflare Image Transformations does not support video.
  // Cloudflare Stream would be needed for server-side video transforms.
  // Return the raw CDN URL directly.
  return cdnUrl;
}

export function videoPosterUrl(
  _cdnUrl: string,
  _width: number = 640
): string {
  // Video poster extraction via cdn-cgi/image requires Cloudflare Stream.
  // Return empty string so the browser generates its own poster from the video.
  return '';
}

export function imageSrcset(
  cdnUrl: string,
  widths: number[] = [300, 600, 900],
  options: Omit<ImageTransformOptions, "width"> = { quality: 85 }
): string {
  return widths
    .map((w) => `${transformImageUrl(cdnUrl, { ...options, width: w })} ${w}w`)
    .join(", ");
}
