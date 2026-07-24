export interface CommerceServiceEnv {
  COMMERCE?: Fetcher;
}

export async function fetchCommerceJson<T>(
  env: CommerceServiceEnv,
  method: "GET" | "POST",
  pathname: string,
  body?: unknown,
): Promise<{ status: number; data: T | null }> {
  if (!env.COMMERCE) {
    return { status: 503, data: null };
  }
  const response = await env.COMMERCE.fetch(
    new Request(`https://commerce.internal${pathname}`, {
      method,
      headers:
        method === "POST"
          ? { "Content-Type": "application/json; charset=utf-8" }
          : undefined,
      body: method === "POST" ? JSON.stringify(body ?? {}) : undefined,
    }),
  );
  let data: T | null = null;
  try {
    data = (await response.json()) as T;
  } catch {
    data = null;
  }
  return { status: response.status, data };
}
