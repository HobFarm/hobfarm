interface Env {
  HOBBOT_WORKER_URL: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const workerBase = env.HOBBOT_WORKER_URL;
  if (!workerBase) {
    return Response.json({ error: "HOBBOT_WORKER_URL not configured" }, { status: 500 });
  }

  const upstreamUrl = new URL("/api/subscribe", workerBase);

  const upstreamRequest = new Request(upstreamUrl.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: request.body,
    // @ts-expect-error duplex needed for streaming request body
    duplex: "half",
  });

  try {
    const upstreamResponse = await fetch(upstreamRequest);

    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeaders.delete("access-control-allow-origin");
    responseHeaders.delete("access-control-allow-credentials");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch {
    return Response.json({ error: "Upstream service unavailable" }, { status: 502 });
  }
};
