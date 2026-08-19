interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
}

const PRIVATE_PREFIXES = ["/api/", "/account", "/login"];

// These are deployment and source-file probes observed in the August 19,
// 2026 traffic spike. Reject them before Pages asks the static/application
// router to build a full 404 response. Keep this list narrow: broad extension
// or directory blocks could interfere with real HobFarm assets and routes.
const SCANNER_PROBE_PATHS = new Set([
  "/.irb_history",
  "/.pry_history",
  "/api/node/config.js",
  "/api/node/constants.js",
  "/api/v1/executions",
  "/app/amplify.yml",
  "/app/config.yaml",
  "/app/config.yml",
  "/app/serverless.yaml",
  "/appsettings.json",
  "/appsettings.staging.json",
  "/aws_credentials.ini",
  "/dev/env.js",
  "/docker-compose.production.yml",
  "/integrations/*",
  "/manage/env",
  "/settings/*",
  "/src/config.yaml",
  "/stripe.json",
  "/template.yaml",
  "/webhook-test/*",
]);

const SCANNER_PROBE_FRAGMENTS = [
  "/.streamlit/",
  "/config/common.js",
  "/config/constants.js",
  "/config/stripe.",
  "/stripe.config.",
  "/team-provider-info.json",
];

function isKnownScannerProbe(pathname: string): boolean {
  const normalized = pathname.toLowerCase();

  return (
    SCANNER_PROBE_PATHS.has(normalized) ||
    SCANNER_PROBE_FRAGMENTS.some((fragment) => normalized.includes(fragment)) ||
    normalized.endsWith(".php") ||
    normalized.endsWith(".sql")
  );
}

const MARKDOWN_PREFIXES = [
  "/",
  "/about/",
  "/articles/",
  "/gallery/",
  "/workshop/",
  "/projects/",
  "/shop/",
  "/academy/",
  "/grimoire/",
  "/legal/usage/",
  "/departments/hobfarm-presents/",
  "/characters/",
];

const DISCOVERY_LINKS = [
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</llms.txt>; rel="alternate"; type="text/plain"; title="HobFarm agent index"',
  '</.well-known/agent-skills/index.json>; rel="service-desc"; type="application/json"; title="HobFarm Agent Skills"',
].join(", ");

function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix),
  );
}

function hasFileExtension(pathname: string): boolean {
  const lastSegment = pathname.split("/").filter(Boolean).at(-1) ?? "";
  return lastSegment.includes(".");
}

function acceptsMarkdown(request: Request): boolean {
  const accept = request.headers.get("Accept")?.toLowerCase() ?? "";
  return accept.includes("text/markdown");
}

function markdownAssetPath(pathname: string): string | null {
  if (hasFileExtension(pathname) || isPrivatePath(pathname)) return null;

  const normalized =
    pathname === "/" ? "/" : pathname.endsWith("/") ? pathname : `${pathname}/`;
  const allowed = MARKDOWN_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(prefix),
  );
  if (!allowed) return null;

  return normalized === "/" ? "/index.md" : `${normalized}index.md`;
}

function withSecurityHeaders(response: Response, pathname: string): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  if (pathname.startsWith("/api/")) {
    headers.set("Cache-Control", "no-store");
    headers.set("Pragma", "no-cache");
    headers.set("Content-Signal", "ai-train=no, search=no, ai-input=no");
    headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);

  if (isKnownScannerProbe(url.pathname)) {
    return withSecurityHeaders(new Response(null, {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    }), url.pathname);
  }

  if (!acceptsMarkdown(context.request)) {
    return withSecurityHeaders(await context.next(), url.pathname);
  }

  const markdownPath = markdownAssetPath(url.pathname);
  if (!markdownPath) {
    return withSecurityHeaders(await context.next(), url.pathname);
  }

  const markdownUrl = new URL(markdownPath, url.origin);
  const markdownRequest = new Request(markdownUrl, context.request);
  const assetResponse = await context.env.ASSETS.fetch(markdownRequest);

  if (!assetResponse.ok) {
    return withSecurityHeaders(await context.next(), url.pathname);
  }

  return withSecurityHeaders(new Response(assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control":
        "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Signal": "ai-train=no, search=yes, ai-input=yes",
      Link: DISCOVERY_LINKS,
      "Vary": "Accept",
      "X-Content-Type-Options": "nosniff",
    },
  }), url.pathname);
};
