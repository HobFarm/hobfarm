interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
}

const PRIVATE_PREFIXES = ["/api/", "/account", "/login"];

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
];

const DISCOVERY_LINKS = [
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</llms.txt>; rel="alternate"; type="text/plain"; title="HobFarm agent index"',
  '</.well-known/agent-skills/index.json>; rel="service-desc"; type="application/json"; title="HobFarm Agent Skills"',
].join(", ");

function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix));
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

  const normalized = pathname === "/" ? "/" : pathname.endsWith("/") ? pathname : `${pathname}/`;
  const allowed = MARKDOWN_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(prefix));
  if (!allowed) return null;

  return normalized === "/" ? "/index.md" : `${normalized}index.md`;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);

  if (!acceptsMarkdown(context.request)) {
    return context.next();
  }

  const markdownPath = markdownAssetPath(url.pathname);
  if (!markdownPath) {
    return context.next();
  }

  const markdownUrl = new URL(markdownPath, url.origin);
  const markdownRequest = new Request(markdownUrl, context.request);
  const assetResponse = await context.env.ASSETS.fetch(markdownRequest);

  if (!assetResponse.ok) {
    return context.next();
  }

  return new Response(assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Signal": "ai-train=no, search=yes, ai-input=yes",
      Link: DISCOVERY_LINKS,
      "Vary": "Accept",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
