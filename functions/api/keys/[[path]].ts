import { proxyAuthWorkerRequest } from "../../../src/lib/auth-proxy-core";

interface Env {
  AUTH_WORKER_URL?: string;
}

function getPath(params: Record<string, unknown>): string | string[] | undefined {
  const path = params.path;
  if (Array.isArray(path)) return path.map(String);
  if (typeof path === "string") return path;
  return undefined;
}

export const onRequest: PagesFunction<Env> = ({ request, env, params }) => {
  return proxyAuthWorkerRequest(request, "/api/keys", getPath(params), env.AUTH_WORKER_URL);
};
