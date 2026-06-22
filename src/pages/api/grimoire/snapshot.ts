import type { APIRoute } from "astro";

import { DEFAULT_GRIMOIRE_SNAPSHOT } from "@/lib/grimoire/snapshot";

export const prerender = true;

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(DEFAULT_GRIMOIRE_SNAPSHOT), {
    status: 200,
    headers: {
      "Cache-Control":
        "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
