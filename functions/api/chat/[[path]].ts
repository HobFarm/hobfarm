interface Env {
  HOBBOT_WORKER_URL: string;
  AUTH_WORKER_URL: string;
}

type RouteKind = "conversations" | "conversation" | "message" | "feedback";

interface ChatRoute {
  allowedMethods: string[];
  kind: RouteKind;
  upstreamPath: string;
}

const CHAT_COOKIE_NAME = "grimoire_session";
const AUTH_COOKIE_NAME = "hf_session";
const MAX_JSON_BODY_BYTES = 12 * 1024;
const MAX_MESSAGE_CHARS = 4000;
const MAX_TITLE_CHARS = 200;
const SAFE_ID_PATTERN = /^[A-Za-z0-9._~-]{1,128}$/;

const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

function jsonError(error: string, status: number): Response {
  return Response.json({ error }, { status, headers: jsonHeaders });
}

function getPathSegments(params: Record<string, unknown>): string[] {
  const path = params.path;
  if (Array.isArray(path)) return path.map(String);
  if (typeof path === "string") return [path];
  return [];
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

function isSafeId(segment: string): boolean {
  return isSafePathSegment(segment) && SAFE_ID_PATTERN.test(segment);
}

function resolveRoute(pathSegments: string[]): ChatRoute | null {
  if (!pathSegments.every(isSafePathSegment)) return null;

  const [first, second, third] = pathSegments;
  const upstreamPath = `/api/chat/${pathSegments.map(encodeURIComponent).join("/")}`;

  if (pathSegments.length === 1 && first === "conversations") {
    return {
      allowedMethods: ["GET", "POST"],
      kind: "conversations",
      upstreamPath,
    };
  }

  if (pathSegments.length === 2 && first === "conversations" && isSafeId(second)) {
    return {
      allowedMethods: ["GET", "DELETE"],
      kind: "conversation",
      upstreamPath,
    };
  }

  if (
    pathSegments.length === 3 &&
    first === "conversations" &&
    isSafeId(second) &&
    third === "messages"
  ) {
    return {
      allowedMethods: ["POST"],
      kind: "message",
      upstreamPath,
    };
  }

  if (
    pathSegments.length === 3 &&
    first === "messages" &&
    isSafeId(second) &&
    third === "feedback"
  ) {
    return {
      allowedMethods: ["POST"],
      kind: "feedback",
      upstreamPath,
    };
  }

  return null;
}

function isSameOriginMutation(request: Request): boolean {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  const secFetchSite = request.headers.get("sec-fetch-site");

  if (origin && origin !== requestUrl.origin) return false;
  if (secFetchSite === "cross-site") return false;

  return true;
}

function getCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const prefix = `${name}=`;
  const part = cookieHeader
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(prefix));
  if (!part) return null;
  const value = part.slice(prefix.length);
  return value || null;
}

function buildUpstreamCookieHeader(cookieHeader: string | null): string | null {
  const hf = getCookieValue(cookieHeader, AUTH_COOKIE_NAME);
  const gr = getCookieValue(cookieHeader, CHAT_COOKIE_NAME);
  const parts: string[] = [];
  if (hf) parts.push(`${AUTH_COOKIE_NAME}=${hf}`);
  if (gr) parts.push(`${CHAT_COOKIE_NAME}=${gr}`);
  return parts.length > 0 ? parts.join("; ") : null;
}

function buildUpstreamHeaders(request: Request, hasJsonBody: boolean): Headers {
  const headers = new Headers();
  const accept = request.headers.get("accept");
  const upstreamCookie = buildUpstreamCookieHeader(request.headers.get("cookie"));

  if (accept) headers.set("Accept", accept);
  if (hasJsonBody) headers.set("Content-Type", "application/json");
  if (upstreamCookie) headers.set("Cookie", upstreamCookie);

  return headers;
}

function hasValidJsonContentType(request: Request): boolean {
  const contentType = request.headers.get("content-type") || "";
  return contentType.toLowerCase().split(";")[0].trim() === "application/json";
}

async function readTextBody(request: Request): Promise<string | Response> {
  const reader = request.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    received += value.byteLength;
    if (received > MAX_JSON_BODY_BYTES) {
      return jsonError("Request body too large", 413);
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

async function prepareJsonBody(request: Request, route: ChatRoute): Promise<string | undefined | Response> {
  if (route.kind === "conversations") {
    // Lazy-create clients may send {} or { title }. Empty body is also fine.
    if (!hasValidJsonContentType(request)) return undefined;

    const rawBody = await readTextBody(request);
    if (rawBody instanceof Response) return rawBody;
    if (!rawBody) return undefined;

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return jsonError("Invalid JSON body", 400);
    }
    if (!body || typeof body !== "object") {
      return jsonError("Invalid JSON body", 400);
    }

    const rawTitle = (body as { title?: unknown }).title;
    if (typeof rawTitle !== "string") return undefined;
    const title = rawTitle.trim().slice(0, MAX_TITLE_CHARS);
    if (!title) return undefined;
    return JSON.stringify({ title });
  }

  if (!hasValidJsonContentType(request)) {
    return jsonError("Content-Type must be application/json", 415);
  }

  const rawBody = await readTextBody(request);
  if (rawBody instanceof Response) return rawBody;
  if (!rawBody) return jsonError("JSON body required", 400);

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  if (!body || typeof body !== "object") {
    return jsonError("Invalid JSON body", 400);
  }

  if (route.kind === "message") {
    const content = (body as { content?: unknown }).content;
    if (typeof content !== "string") {
      return jsonError("Message content is required", 400);
    }

    const trimmed = content.trim();
    if (!trimmed) return jsonError("Message content is required", 400);
    if (trimmed.length > MAX_MESSAGE_CHARS) {
      return jsonError("Message content is too long", 413);
    }

    return JSON.stringify({ content: trimmed });
  }

  if (route.kind === "feedback") {
    const signal = (body as { signal?: unknown }).signal;
    if (signal !== "up" && signal !== "down") {
      return jsonError("Feedback signal must be up or down", 400);
    }

    return JSON.stringify({ signal });
  }

  return undefined;
}

function sanitizeResponseHeaders(headers: Headers): Headers {
  const responseHeaders = new Headers(headers);

  for (const header of [...responseHeaders.keys()]) {
    if (header.toLowerCase().startsWith("access-control-")) {
      responseHeaders.delete(header);
    }
  }

  responseHeaders.set("Cache-Control", "no-store");
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  return responseHeaders;
}

function isMutation(route: ChatRoute, method: string): boolean {
  if (method === "POST") {
    return route.kind === "conversations" || route.kind === "message" || route.kind === "feedback";
  }
  if (method === "DELETE" && route.kind === "conversation") {
    return true;
  }
  return false;
}

async function requireAuth(request: Request, env: Env): Promise<Response | null> {
  if (!env.AUTH_WORKER_URL) {
    return jsonError("Authentication not configured", 500);
  }

  const authValue = getCookieValue(request.headers.get("cookie"), AUTH_COOKIE_NAME);
  if (!authValue) return jsonError("Authentication required", 401);

  let res: Response;
  try {
    res = await fetch(`${env.AUTH_WORKER_URL}/api/auth/me`, {
      headers: { Cookie: `${AUTH_COOKIE_NAME}=${authValue}` },
    });
  } catch {
    return jsonError("Authentication service unavailable", 502);
  }

  if (res.status !== 200) return jsonError("Authentication required", 401);

  let body: { user?: { id?: unknown } } | null = null;
  try {
    body = (await res.json()) as { user?: { id?: unknown } };
  } catch {
    return jsonError("Authentication required", 401);
  }

  if (!body || typeof body.user?.id !== "string" || !body.user.id) {
    return jsonError("Authentication required", 401);
  }

  return null;
}

function optionsResponse(request: Request, route: ChatRoute): Response {
  if (!isSameOriginMutation(request)) {
    return jsonError("Cross-origin requests are not allowed", 403);
  }

  const origin = new URL(request.url).origin;
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": route.allowedMethods.join(", "),
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Max-Age": "600",
      "Cache-Control": "no-store",
      "Vary": "Origin",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const route = resolveRoute(getPathSegments(params));

  if (!route) {
    return jsonError("Chat endpoint not found", 404);
  }

  if (request.method === "OPTIONS") {
    return optionsResponse(request, route);
  }

  if (!route.allowedMethods.includes(request.method)) {
    return jsonError("Method not allowed", 405);
  }

  if (request.method !== "GET" && request.method !== "HEAD" && !isSameOriginMutation(request)) {
    return jsonError("Cross-origin requests are not allowed", 403);
  }

  if (isMutation(route, request.method)) {
    const authResult = await requireAuth(request, env);
    if (authResult) return authResult;
  }

  const workerBase = env.HOBBOT_WORKER_URL;
  if (!workerBase) {
    return jsonError("HOBBOT_WORKER_URL not configured", 500);
  }

  const upstreamUrl = new URL(route.upstreamPath, workerBase);
  const requestUrl = new URL(request.url);

  if (requestUrl.search.length > 512) {
    return jsonError("Query string too long", 414);
  }

  upstreamUrl.search = requestUrl.search;

  const body = request.method === "POST" ? await prepareJsonBody(request, route) : undefined;
  if (body instanceof Response) return body;

  const upstreamRequest = new Request(upstreamUrl.toString(), {
    method: request.method,
    headers: buildUpstreamHeaders(request, request.method === "POST"),
    body,
  });

  try {
    const upstreamResponse = await fetch(upstreamRequest);

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: sanitizeResponseHeaders(upstreamResponse.headers),
    });
  } catch {
    return jsonError("Upstream service unavailable", 502);
  }
};
