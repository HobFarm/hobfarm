type AuthWorkerPrefix = "/api/auth" | "/api/keys";

const noStoreHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

const jsonHeaders = {
  ...noStoreHeaders,
  "Content-Type": "application/json; charset=utf-8",
};

const METHODS_WITHOUT_BODY = new Set(["GET", "HEAD"]);
const MAX_PROXY_BODY_BYTES = 32 * 1024;
const MAX_QUERY_CHARS = 2048;

function getAuthWorkerBase(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function isSafePathSegment(segment: string): boolean {
  return (
    segment.length > 0 &&
    segment !== "." &&
    segment !== ".." &&
    !segment.includes("/") &&
    !segment.includes("\\")
  );
}

function buildUpstreamPath(prefix: AuthWorkerPrefix, path: string | string[] | undefined): string | null {
  const rawSegments = Array.isArray(path) ? path : (path ?? "").split("/");
  if (!rawSegments.filter(Boolean).every(isSafePathSegment)) return null;

  const suffix = rawSegments
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return suffix ? `${prefix}/${suffix}` : prefix;
}

function quietAnonymousMe(request: Request, upstreamPath: string): boolean {
  return request.method === "GET" && upstreamPath === "/api/auth/me";
}

function proxyHeaders(request: Request): Headers {
  const headers = new Headers();
  const allowed = [
    "accept",
    "accept-language",
    "content-type",
    "cookie",
    "origin",
    "referer",
    "user-agent",
  ];

  for (const name of allowed) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  return headers;
}

function copyResponseHeaders(upstream: Response): Headers {
  const headers = new Headers(upstream.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  return headers;
}

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

async function readLimitedBody(request: Request): Promise<ArrayBuffer | Response> {
  const reader = request.body?.getReader();
  if (!reader) return new ArrayBuffer(0);

  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    received += value.byteLength;
    if (received > MAX_PROXY_BODY_BYTES) {
      return jsonError("request_body_too_large", 413);
    }
    chunks.push(value);
  }

  const body = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return body.buffer;
}

export async function proxyAuthWorkerRequest(
  request: Request,
  prefix: AuthWorkerPrefix,
  path: string | string[] | undefined,
  authWorkerUrl: string | undefined,
): Promise<Response> {
  const upstreamPath = buildUpstreamPath(prefix, path);
  if (!upstreamPath) {
    return jsonError("endpoint_not_found", 404);
  }

  const quietAuthCheck = quietAnonymousMe(request, upstreamPath);
  const base = getAuthWorkerBase(authWorkerUrl);

  if (!base) {
    if (quietAuthCheck) {
      return new Response(null, { status: 204, headers: noStoreHeaders });
    }
    return jsonError("auth_worker_not_configured", 503);
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.search.length > MAX_QUERY_CHARS) {
    return jsonError("query_too_long", 414);
  }

  if (!METHODS_WITHOUT_BODY.has(request.method) && !isSameOriginMutation(request)) {
    return jsonError("cross_origin_request_not_allowed", 403);
  }

  const upstreamUrl = new URL(`${base}${upstreamPath}`);
  upstreamUrl.search = requestUrl.search;

  let body: ArrayBuffer | undefined;
  if (!METHODS_WITHOUT_BODY.has(request.method)) {
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > MAX_PROXY_BODY_BYTES) {
      return jsonError("request_body_too_large", 413);
    }

    const limitedBody = await readLimitedBody(request);
    if (limitedBody instanceof Response) return limitedBody;
    body = limitedBody;
  }

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers: proxyHeaders(request),
      body,
      redirect: "manual",
    });
  } catch {
    if (quietAuthCheck) {
      return new Response(null, { status: 204, headers: noStoreHeaders });
    }
    return jsonError("auth_worker_unavailable", 502);
  }

  if (quietAuthCheck && [401, 403, 404].includes(upstream.status)) {
    return new Response(null, { status: 204, headers: noStoreHeaders });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: copyResponseHeaders(upstream),
  });
}
