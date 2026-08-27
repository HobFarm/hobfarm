export const AUTH_SERVICE_ORIGIN = "https://hobfarm-auth";

export interface AuthHttpService {
  fetch(request: Request): Promise<Response>;
}

export interface AuthServiceEnv {
  AUTH_HTTP?: AuthHttpService;
}

export function createAuthServiceRequest(
  pathname: string,
  init?: RequestInit,
): Request {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) {
    throw new TypeError("Auth service paths must be root-relative");
  }

  const url = new URL(pathname, AUTH_SERVICE_ORIGIN);
  if (url.origin !== AUTH_SERVICE_ORIGIN) {
    throw new TypeError("Auth service path escaped the internal origin");
  }

  return new Request(url, init);
}

export function fetchAuthService(
  service: AuthHttpService,
  pathname: string,
  init?: RequestInit,
): Promise<Response> {
  return service.fetch(createAuthServiceRequest(pathname, init));
}
