import { env } from "cloudflare:workers";

import { proxyAuthWorkerRequest } from "./auth-proxy-core";

type AuthProxyEnv = {
  AUTH_WORKER_URL?: string;
};

export async function proxyAuthWorker(
  request: Request,
  prefix: "/api/auth" | "/api/keys",
  path: string | undefined,
): Promise<Response> {
  return proxyAuthWorkerRequest(
    request,
    prefix,
    path,
    (env as AuthProxyEnv).AUTH_WORKER_URL,
  );
}
