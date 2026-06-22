// Proxies the grimoire worker's daily synthesis endpoint and caches it for a day
// at the edge. The homepage Grimoire window fetches this; on any failure here the
// client keeps its curated rotation, so the homepage never breaks.
//
// Set GRIMOIRE_WORKER_URL in the Pages project env (and .dev.vars for local) to
// the grimoire worker base, e.g. https://grimoire.damp-violet-bf89.workers.dev
// The worker serves the synthesis at UPSTREAM_PATH below.

interface Env {
  GRIMOIRE_WORKER_URL?: string;
}

const UPSTREAM_PATH = "/synthesis";

const shortCache = { "Cache-Control": "public, max-age=60" } as const;
// Data changes once a day (cron at 05:00 UTC). Keep the edge copy fresh within
// ~1h so the new entry surfaces promptly; serve stale while revalidating.
const dayCache = {
  "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
  "X-Content-Type-Options": "nosniff",
} as const;

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const base = env.GRIMOIRE_WORKER_URL;
  if (!base) {
    return Response.json({ error: "synthesis upstream not configured" }, { status: 503, headers: shortCache });
  }

  let upstream: string;
  try {
    upstream = new URL(UPSTREAM_PATH, base).toString();
  } catch {
    return Response.json({ error: "invalid upstream url" }, { status: 503, headers: shortCache });
  }

  try {
    const res = await fetch(upstream, {
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
