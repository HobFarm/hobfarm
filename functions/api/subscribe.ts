interface Env {
  HOBBOT_WORKER_URL: string;
}

interface SubscribeBody {
  email?: unknown;
  website?: unknown;
}

const MAX_BODY_BYTES = 4 * 1024;
const MAX_EMAIL_CHARS = 254;

const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

function jsonError(error: string, status: number): Response {
  return Response.json({ error }, { status, headers: jsonHeaders });
}

function isSameOriginMutation(request: Request): boolean {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  const secFetchSite = request.headers.get("sec-fetch-site");

  if (origin && origin !== requestUrl.origin) return false;
  if (secFetchSite === "cross-site") return false;

  return true;
}

function isValidEmail(value: string): boolean {
  return value.length <= MAX_EMAIL_CHARS && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function readLimitedText(request: Request): Promise<string | Response> {
  const reader = request.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      return jsonError("Request body is too large", 413);
    }
    chunks.push(value);
  }

  const body = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(body);
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!isSameOriginMutation(request)) {
    return jsonError("Cross-origin subscribe requests are not allowed", 403);
  }

  const workerBase = env.HOBBOT_WORKER_URL;
  if (!workerBase) {
    return jsonError("HOBBOT_WORKER_URL not configured", 500);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonError("Content-Type must be application/json", 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return jsonError("Request body is too large", 413);
  }

  const rawBody = await readLimitedText(request);
  if (rawBody instanceof Response) return rawBody;

  let body: SubscribeBody;
  try {
    body = JSON.parse(rawBody) as SubscribeBody;
  } catch {
    return jsonError("Invalid JSON", 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";

  if (website) {
    return Response.json({ success: true, message: "Subscribed." }, { headers: jsonHeaders });
  }

  if (!email || !isValidEmail(email)) {
    return jsonError("Enter a valid email address", 400);
  }

  const upstreamUrl = new URL("/api/subscribe", workerBase);

  const upstreamRequest = new Request(upstreamUrl.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, website: "" }),
  });

  try {
    const upstreamResponse = await fetch(upstreamRequest);

    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeaders.delete("access-control-allow-origin");
    responseHeaders.delete("access-control-allow-credentials");
    responseHeaders.set("Cache-Control", "no-store");
    responseHeaders.set("X-Content-Type-Options", "nosniff");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch {
    return jsonError("Upstream service unavailable", 502);
  }
};

export const onRequestGet: PagesFunction = async () => {
  return jsonError("Method not allowed", 405);
};
