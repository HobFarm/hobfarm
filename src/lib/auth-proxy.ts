import { env } from "cloudflare:workers";

import { proxyAuthWorkerRequest } from "./auth-proxy-core";
import type { AuthServiceEnv } from "./auth-service.ts";

export async function proxyAuthWorker(
  request: Request,
  prefix: "/api/auth" | "/api/keys",
  path: string | undefined,
): Promise<Response> {
  return proxyAuthWorkerRequest(
    request,
    prefix,
    path,
    (env as AuthServiceEnv).AUTH_HTTP,
  );
}
