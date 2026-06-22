interface Env {
  PROVIDER_HEALTH: KVNamespace;
}

interface ProviderStatus {
  provider: string;
  status: "operational" | "degraded" | "down" | "unknown";
  latency?: number;
  lastCheck?: string;
}

// PROVIDER_HEALTH KV is shared with grimoire/chat/cron workers (vocab caches,
// ingest metadata, cron-state). Filter by `provider:` prefix so this endpoint
// only surfaces provider-health entries. Any worker writing health data must
// use the same prefix; nothing currently writes provider-prefixed entries
// (write path is a follow-up — circuit-breaker integration not yet wired).
const PROVIDER_KEY_PREFIX = "provider:";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    const list = await env.PROVIDER_HEALTH.list({ prefix: PROVIDER_KEY_PREFIX });
    const statuses: ProviderStatus[] = await Promise.all(
      list.keys.map(async (key) => {
        const value = await env.PROVIDER_HEALTH.get(key.name, "json");
        return {
          provider: key.name.slice(PROVIDER_KEY_PREFIX.length),
          ...(value as Omit<ProviderStatus, "provider">),
        };
      })
    );

    return Response.json(statuses, {
      headers: {
        "Cache-Control": "public, max-age=15",
      },
    });
  } catch {
    return Response.json([], {
      status: 200,
      headers: { "Cache-Control": "public, max-age=15" },
    });
  }
};
