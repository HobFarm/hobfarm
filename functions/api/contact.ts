interface Env {
  TURNSTILE_SECRET: string;
}

interface ContactBody {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  token?: unknown;
}

const MAX_BODY_BYTES = 16 * 1024;
const MAX_NAME_CHARS = 120;
const MAX_EMAIL_CHARS = 254;
const MAX_MESSAGE_CHARS = 4000;
const allowedSubjects = new Set([
  "support",
  "billing",
  "refund",
  "general",
  "stylefusion",
  "grimoire",
  "membership",
  "business",
  "bug",
  "security",
]);

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

function normalizeField(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) return null;
  return normalized;
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
    return jsonError("Cross-origin contact requests are not allowed", 403);
  }

  if (!env.TURNSTILE_SECRET) {
    return jsonError("Contact verification is not configured", 500);
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

  let body: ContactBody;
  try {
    body = JSON.parse(rawBody) as ContactBody;
  } catch {
    return jsonError("Invalid JSON", 400);
  }

  const name = normalizeField(body.name, MAX_NAME_CHARS);
  const email = normalizeField(body.email, MAX_EMAIL_CHARS)?.toLowerCase() ?? null;
  const subject = normalizeField(body.subject, 40);
  const message = normalizeField(body.message, MAX_MESSAGE_CHARS);
  const token = normalizeField(body.token, 4096);

  if (!name || !email || !subject || !message || !token) {
    return jsonError("All fields are required", 400);
  }

  if (!isValidEmail(email)) {
    return jsonError("Enter a valid email address", 400);
  }

  if (!allowedSubjects.has(subject)) {
    return jsonError("Invalid contact subject", 400);
  }

  // Verify Turnstile token
  const verifyBody = new URLSearchParams({
    secret: env.TURNSTILE_SECRET,
    response: token,
  });
  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (remoteIp) verifyBody.set("remoteip", remoteIp);

  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: verifyBody,
    }
  );

  const verify = (await verifyRes.json()) as { success: boolean };
  if (!verify.success) {
    return jsonError("Verification failed", 403);
  }

  // Do not log raw contact contents; Cloudflare logs can be retained outside
  // the app and should not become the storage layer for private messages.
  console.log("Contact submission received", {
    subject,
    nameLength: name.length,
    messageLength: message.length,
  });

  return Response.json({ success: true }, { headers: jsonHeaders });
};
