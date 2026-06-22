// Proxies the grimoire worker's synthesis archive (the full, append-only history)
// and caches each page for a day at the edge. The cross-pollination archive page
// fetches this; on any failure the page falls back to the curated set, so it is
// never empty.
//
// Upstream: GET ${GRIMOIRE_WORKER_URL}/synthesis/archive?offset=&limit=
//   -> { items, total, offset, limit, next_offset }

interface Env {
  GRIMOIRE_WORKER_URL?: string;
}

const UPSTREAM_PATH = "/synthesis/archive";
const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 50;

const shortCache = { "Cache-Control": "public, max-age=60" } as const;
// New entry appended once a day (cron at 05:00 UTC). Keep the edge copy fresh
// within ~1h so the archive + homepage strip pick up new items promptly.
const dayCache = {
  "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
  "X-Content-Type-Options": "nosniff",
} as const;

function clampInt(value: string | null, fallback: number, min: number, max: number): number {
  const n = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const base = env.GRIMOIRE_WORKER_URL;
  if (!base) {
    return Response.json({ error: "archive upstream not configured" }, { status: 503, headers: shortCache });
  }

  const reqUrl = new URL(request.url);
  const offset = clampInt(reqUrl.searchParams.get("offset"), 0, 0, 1_000_000);
  const limit = clampInt(reqUrl.searchParams.get("limit"), DEFAULT_LIMIT, 1, MAX_LIMIT);

  let upstream: URL;
  try {
    upstream = new URL(UPSTREAM_PATH, base);
  } catch {
    return Response.json({ error: "invalid upstream url" }, { status: 503, headers: shortCache });
  }
  upstream.searchParams.set("offset", String(offset));
  upstream.searchParams.set("limit", String(limit));

  try {
    const res = await fetch(upstream.toString(), {
      headers: { accept: "application/json" },
      cf: { cacheTtl: 86_400, cacheEverything: true },
    });
    if (!res.ok) {
      return Response.json({ error: "upstream error" }, { status: 502, headers: shortCache });
    }
    const data = await res.json();
    return Response.json(data, { headers: dayCache });
  } catch {
    return Response.json({ error: "upstream unreachable" }, { status: 502, headers: shortCache });
  }
};
