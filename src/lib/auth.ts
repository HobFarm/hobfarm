// Site-side auth types and fetch helpers.
//
// MUST match hobfarm-auth/src/types.ts UserPayload shape.
// TODO: revisit if drift becomes annoying — Brief #3 chose duplication
// over a shared types package since Phase 1 has one user.

export interface UserPayload {
  id: string;
  email: string;
  email_verified_at: number | null;
  newsletter_opt_in: boolean;
  created_at: number;
}

// MUST match hobfarm-auth ALLOWED_PROVIDERS (keep in sync with both
// PUT/DELETE validation on the auth worker AND its WorkerEntrypoint
// exports). When adding here, add there too in the same release.
export const ALLOWED_PROVIDERS = [
  "google",
  "xai",
  "openai",
  "alibaba",
  "bfl",
  "zai",
  "fal",
  "runpod",
] as const;
export type Provider = (typeof ALLOWED_PROVIDERS)[number];

export interface KeyEntry {
  provider: Provider;
  hint: string;
  created_at: number;
  updated_at: number;
}

// Browser-safe subscription wire shape. Mirrors PublicSubscription in
// hobfarm-auth/src/types.ts. Identifiers like stripe_customer_id are
// deliberately excluded; admin/server-side surfaces hold those.
export interface SubscriptionPayload {
  status:
    | "active"
    | "trialing"
    | "past_due"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "unpaid"
    | "paused"
    | "inactive"
    | "none";
  tier?: "supporter";
  current_period_end?: number | null;
  cancel_at_period_end?: boolean;
  cancel_at?: number | null;
}

// Same-origin fetch with cookies. Worker route is on hob.farm so credentials
// flow without CORS preflight.
async function authFetch<T>(path: string, init: RequestInit = {}): Promise<{ status: number; data: T | null }> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });
  let data: T | null = null;
  try {
    data = (await res.json()) as T;
  } catch {
    data = null;
  }
  return { status: res.status, data };
}

export async function fetchMe(): Promise<UserPayload | null> {
  const { status, data } = await authFetch<{ user: UserPayload }>("/api/auth/me");
  if (status !== 200 || !data) return null;
  return data.user;
}

export async function fetchSubscription(): Promise<SubscriptionPayload | null> {
  const { status, data } = await authFetch<{ subscription: SubscriptionPayload }>(
    "/api/auth/me/subscription",
  );
  if (status !== 200 || !data) return null;
  return data.subscription;
}

export async function requestCode(email: string): Promise<boolean> {
  const { status } = await authFetch<{ ok: boolean }>("/api/auth/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  // Per Brief #1, /request always returns 200 unless the input is malformed.
  return status === 200;
}

export async function verifyCode(email: string, code: string): Promise<{ ok: boolean; user?: UserPayload }> {
  const { status, data } = await authFetch<{ ok: boolean; user: UserPayload }>(
    "/api/auth/verify",
    { method: "POST", body: JSON.stringify({ email, code }) },
  );
  if (status === 200 && data?.ok) return { ok: true, user: data.user };
  return { ok: false };
}

export async function logout(): Promise<boolean> {
  const { status } = await authFetch<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
  return status === 200;
}

export async function deleteAccount(): Promise<boolean> {
  const { status } = await authFetch<{ ok: boolean }>("/api/auth/account/delete", { method: "POST" });
  return status === 200;
}

export async function fetchKeys(): Promise<KeyEntry[]> {
  const { status, data } = await authFetch<{ keys: KeyEntry[] }>("/api/keys");
  if (status !== 200 || !data) return [];
  return data.keys;
}

export async function putKey(provider: Provider, key: string): Promise<{ ok: boolean; hint?: string; error?: string }> {
  const { status, data } = await authFetch<{ ok: boolean; provider: string; hint: string; error?: string }>(
    `/api/keys/${provider}`,
    { method: "PUT", body: JSON.stringify({ key }) },
  );
  if (status === 200 && data?.ok) return { ok: true, hint: data.hint };
  return { ok: false, error: data?.error ?? "request_failed" };
}

export async function deleteKey(provider: Provider): Promise<boolean> {
  const { status } = await authFetch<{ ok: boolean }>(`/api/keys/${provider}`, { method: "DELETE" });
  return status === 200;
}

export async function requestEmailChange(newEmail: string): Promise<{ ok: boolean; status: number; error?: string }> {
  const res = await fetch("/api/auth/email-change/request", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newEmail }),
  });
  if (res.status === 204) return { ok: true, status: 204 };
  let data: { error?: string } = {};
  try {
    data = await res.json();
  } catch {
    // no body
  }
  return { ok: false, status: res.status, error: data.error };
}

export async function verifyEmailChange(code: string): Promise<{ ok: boolean; status: number; user?: UserPayload; error?: string }> {
  const { status, data } = await authFetch<{ ok: boolean; user: UserPayload; error?: string }>(
    "/api/auth/email-change/verify",
    { method: "POST", body: JSON.stringify({ code }) },
  );
  if (status === 200 && data?.ok && data.user) return { ok: true, status, user: data.user };
  return { ok: false, status, error: data?.error };
}

// Validate a post-login redirect target handed to /login (canonical param is
// `?next=`; `?return=` is a temporary legacy alias). Accepts either:
//   - A root-relative path like "/membership" (single leading slash only —
//     reject "//evil.com" and "/\\evil.com" which browsers may normalize
//     into open redirects).
//   - A full https URL on hob.farm or a *.hob.farm subdomain. The literal-dot
//     suffix check is deliberate so "https://evilhob.farm/" cannot impersonate.
// Name retained for stability; the function is a URL-shape validator, not
// tied to either parameter name.
export function validateReturnUrl(raw: string | null): string | null {
  if (!raw) return null;
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\")) {
    return raw;
  }
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return null;
    if (u.hostname !== "hob.farm" && !u.hostname.endsWith(".hob.farm")) return null;
    return u.toString();
  } catch {
    return null;
  }
}
