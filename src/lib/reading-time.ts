/**
 * Calculate reading time from text content.
 * Lightweight replacement for the `reading-time` npm package
 * to avoid Node.js stream imports that break Cloudflare Workers.
 */
export function readingTime(text: string): { text: string; minutes: number; words: number } {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 265));
  return {
    text: `${minutes} min read`,
    minutes,
    words,
  };
}
