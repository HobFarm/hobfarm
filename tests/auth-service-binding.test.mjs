import assert from "node:assert/strict";
import test from "node:test";

import {
  AUTH_SERVICE_ORIGIN,
  createAuthServiceRequest,
} from "../src/lib/auth-service.ts";
import { proxyAuthWorkerRequest } from "../src/lib/auth-proxy-core.ts";
import {
  fetchAdminJson,
  resolveAuthUser,
} from "../functions/api/stripe/internal.ts";

function mockService(handler) {
  const requests = [];
  return {
    requests,
    async fetch(request) {
      requests.push(request.clone());
      return handler(request);
    },
  };
}

test("auth service requests stay on the synthetic internal origin", () => {
  assert.equal(
    createAuthServiceRequest("/api/auth/me?detail=1").url,
    `${AUTH_SERVICE_ORIGIN}/api/auth/me?detail=1`,
  );
  assert.throws(() => createAuthServiceRequest("https://example.com/api/auth/me"));
  assert.throws(() => createAuthServiceRequest("//example.com/api/auth/me"));
});

test("the auth proxy preserves request and response semantics over AUTH_HTTP", async () => {
  const service = mockService(async (request) => {
    assert.equal(request.url, `${AUTH_SERVICE_ORIGIN}/api/auth/verify?next=%2Faccount%2F`);
    assert.equal(request.method, "POST");
    assert.equal(request.headers.get("cookie"), "hf_session=session-value");
    assert.equal(request.headers.get("origin"), "https://hob.farm");
    assert.equal(request.headers.get("authorization"), null);
    assert.deepEqual(await request.json(), { token: "123456" });
    return Response.json(
      { ok: true },
      { status: 201, headers: { "Set-Cookie": "hf_session=renewed", "X-Auth": "bound" } },
    );
  });

  const request = new Request(
    "https://hob.farm/api/auth/verify?next=%2Faccount%2F",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "analytics=discard; hf_session=session-value; theme=discard",
        Origin: "https://hob.farm",
        Authorization: "Bearer discard",
      },
      body: JSON.stringify({ token: "123456" }),
    },
  );

  const response = await proxyAuthWorkerRequest(request, "/api/auth", "verify", service);
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(response.headers.get("set-cookie"), "hf_session=renewed");
  assert.equal(response.headers.get("x-auth"), "bound");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(service.requests.length, 1);
});

test("the auth proxy fails closed when AUTH_HTTP is unavailable", async () => {
  const ordinary = await proxyAuthWorkerRequest(
    new Request("https://hob.farm/api/keys"),
    "/api/keys",
    undefined,
    undefined,
  );
  assert.equal(ordinary.status, 503);
  assert.deepEqual(await ordinary.json(), { error: "auth_worker_not_configured" });

  const quietMe = await proxyAuthWorkerRequest(
    new Request("https://hob.farm/api/auth/me"),
    "/api/auth",
    "me",
    undefined,
  );
  assert.equal(quietMe.status, 204);
});

test("the auth proxy propagates downstream error status and headers", async () => {
  const service = mockService(async () => Response.json(
    { error: "rate_limited" },
    { status: 429, headers: { "Retry-After": "60" } },
  ));

  const response = await proxyAuthWorkerRequest(
    new Request("https://hob.farm/api/keys"),
    "/api/keys",
    undefined,
    service,
  );

  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "60");
  assert.deepEqual(await response.json(), { error: "rate_limited" });
});

test("authenticated user resolution forwards only hf_session through AUTH_HTTP", async () => {
  const user = {
    id: "user-1",
    email: "reader@example.com",
    email_verified_at: 1,
    newsletter_opt_in: false,
    created_at: 1,
  };
  const service = mockService(async (request) => {
    assert.equal(request.url, `${AUTH_SERVICE_ORIGIN}/api/auth/me`);
    assert.equal(request.headers.get("cookie"), "hf_session=valid-session");
    return Response.json({ user });
  });

  const result = await resolveAuthUser(
    new Request("https://hob.farm/api/academy/access", {
      headers: { Cookie: "theme=dark; hf_session=valid-session; tracking=yes" },
    }),
    { AUTH_HTTP: service },
  );

  assert.deepEqual(result, user);
  assert.equal(service.requests.length, 1);
});

test("admin auth calls keep canonical signatures and bodies over AUTH_HTTP", async () => {
  const service = mockService(async (request) => {
    assert.equal(request.url, `${AUTH_SERVICE_ORIGIN}/api/admin/subscriptions/upsert`);
    assert.equal(request.method, "POST");
    assert.match(request.headers.get("x-internal-timestamp") ?? "", /^\d+$/);
    assert.match(request.headers.get("x-internal-signature") ?? "", /^sha256=[0-9a-f]{64}$/);
    assert.equal(request.headers.get("content-type"), "application/json");
    assert.equal(await request.text(), '{"user_id":"user-1"}');
    return Response.json({ ok: true }, { status: 202 });
  });

  const result = await fetchAdminJson(
    {
      AUTH_HTTP: service,
      INTERNAL_ADMIN_HMAC_SECRET: "a".repeat(32),
    },
    "POST",
    "/api/admin/subscriptions/upsert",
    { user_id: "user-1" },
  );

  assert.equal(result.status, 202);
  assert.deepEqual(result.data, { ok: true });
  assert.equal(service.requests.length, 1);
});
