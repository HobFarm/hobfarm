import type { APIRoute } from "astro";

import { proxyAuthWorker } from "@/lib/auth-proxy";

export const prerender = false;

const handle: APIRoute = ({ request, params }) => {
  return proxyAuthWorker(request, "/api/keys", params.path);
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
