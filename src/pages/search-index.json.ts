import type { APIRoute } from "astro";
import { buildSearchIndex } from "@/lib/search-index";

export const prerender = true;

export const GET: APIRoute = async () => {
  const index = await buildSearchIndex();

  return new Response(JSON.stringify(index), {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
