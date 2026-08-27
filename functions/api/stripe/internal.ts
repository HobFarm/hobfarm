// Shared helpers for the Stripe Pages Functions surface.
// Cross-worker auth: forwards the inbound session cookie to the auth worker
// for user resolution, and signs server-to-server admin calls with the
// canonical scheme described in c:\Users\xkxxk\hobfarm-auth\src\crypto.ts.

import {
  fetchAuthService,
  type AuthHttpService,
  type AuthServiceEnv,
} from "../../../src/lib/auth-service.ts";

export interface UserPayload {
  id: string;
  email: string;
  email_verified_at: number | null;
  newsletter_opt_in: boolean;
  created_at: number;
}

// SHARED CONTRACT — keep in sync with the matching repo:
//   hobfarm-auth/src/types.ts (server, validates and persists)
//   hobfarm/functions/api/stripe/internal.ts (Pages Functions client, sends)
// Field additions: auth worker first (must accept new fields), then Pages.
// Field removals: Pages first (must stop sending), then auth worker.
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | "paused"
  | "inactive";

export interface AdminSubscriptionUpsert {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  tier: "supporter";
  current_period_end: number | null;
  cancel_at_period_end: 0 | 1;
  cancel_at: number | null;
  last_stripe_event_created: number;
  last_stripe_event_id: string;
}

export interface AdminSubscriptionRecord {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  tier: "supporter";
  current_period_end: number | null;
  cancel_at_period_end: 0 | 1;
  cancel_at: number | null;
}

export interface AdminEnv extends AuthServiceEnv {
  AUTH_HTTP: AuthHttpService;
  INTERNAL_ADMIN_HMAC_SECRET: string;
}

const HEX = "0123456789abcdef";
const ADMIN_SECRET_MIN_BYTES = 32;
const AUTH_COOKIE_NAME = "hf_session";

function requireAdminSecret(secret: string): void {
  if (typeof secret !== "string" || new TextEncoder().encode(secret).byteLength < ADMIN_SECRET_MIN_BYTES) {
    throw new Error("INTERNAL_ADMIN_HMAC_SECRET is not configured securely");
  }
}

function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    out += HEX[b >> 4] + HEX[b & 0x0f];
  }
  return out;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(digest));
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  requireAdminSecret(secret);
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return bytesToHex(new Uint8Array(sig));
}

export async function signAdminRequest(
  method: string,
  pathname: string,
  body: string,
  secret: string,
): Promise<{ timestamp: string; signature: string }> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyHash = await sha256Hex(body);
  const signed = `${method.toUpperCase()}\n${pathname}\n${timestamp}\n${bodyHash}`;
  const signature = `sha256=${await hmacSha256Hex(secret, signed)}`;
  return { timestamp, signature };
}

// Send a canonical-signed admin request to the auth worker. GET sends empty
// body. Returns parsed JSON (or null on parse failure) with the HTTP status.
export async function fetchAdminJson<T>(
  env: AdminEnv,
  method: "GET" | "POST",
  pathname: string,
  body?: unknown,
): Promise<{ status: number; data: T | null }> {
  const rawBody = method === "GET" ? "" : JSON.stringify(body ?? {});
  const { timestamp, signature } = await signAdminRequest(
    method,
    pathname,
    rawBody,
    env.INTERNAL_ADMIN_HMAC_SECRET,
  );
  const headers: Record<string, string> = {
    "X-Internal-Timestamp": timestamp,
    "X-Internal-Signature": signature,
  };
  if (method !== "GET") headers["Content-Type"] = "application/json";

  const res = await fetchAuthService(env.AUTH_HTTP, pathname, {
    method,
    headers,
    body: method === "GET" ? undefined : rawBody,
  });

  let data: T | null = null;
  try {
    data = (await res.json()) as T;
  } catch {
    data = null;
  }
  return { status: res.status, data };
}

// Resolve the current logged-in user by forwarding only the session cookie
// through the private auth service binding.
export async function resolveAuthUser(
  request: Request,
  env: AuthServiceEnv,
): Promise<UserPayload | null> {
  if (!env.AUTH_HTTP) return null;
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const prefix = `${AUTH_COOKIE_NAME}=`;
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  if (!cookie || cookie.length <= prefix.length) return null;
  const res = await fetchAuthService(env.AUTH_HTTP, "/api/auth/me", {
    method: "GET",
    headers: { Cookie: cookie },
  });
  if (res.status !== 200) return null;
  try {
    const body = (await res.json()) as { user?: UserPayload };
    return body.user ?? null;
  } catch {
    return null;
  }
}

// Some Stripe SDK fields come back as either a string ID or an expanded
// object with `.id`. Normalize both into the string ID.
export function extractStripeId(
  value: string | { id: string } | null | undefined,
): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.id ?? null;
}

// Workers/Pages reject Response.redirect with a relative URL at runtime.
// Always compose against the inbound request origin.
export function absoluteRedirect(request: Request, path: string, status = 303): Response {
  const absolute = new URL(path, request.url).toString();
  return Response.redirect(absolute, status);
}

export function acceptsJson(request: Request): boolean {
  return request.headers.get("accept")?.includes("application/json") ?? false;
}

export function isSameOriginMutation(request: Request): boolean {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (origin && origin !== requestUrl.origin) return false;
  if (secFetchSite === "cross-site") return false;
  return true;
}
