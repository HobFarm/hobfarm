import { getCollection, type CollectionEntry } from "astro:content";
import {
  articlePath,
  getArticleDate,
  getArticleDepartment,
  getArticleDescription,
  getArticleUpdatedDate,
  getPublishedArticles,
} from "@/lib/articles";
import { galleryTypeLabels, previewImageUrl } from "@/lib/gallery";
import { getPublicProducts, productSlug, type ProductEntry } from "@/lib/products";

export const SITE_ORIGIN = "https://hob.farm";

export const PRIVATE_BOUNDARIES = [
  "Private Grimoire notes, admin workflows, chat logs, raw prompts, export files, drafts, paid downloads, high-resolution source files, account pages, login pages, API endpoints, and source files are not part of the public agent corpus.",
  "Agents may read and cite canonical public pages, public Markdown alternates, public llms indexes, public gallery previews, and visible public article/project/workshop copy.",
  "Do not infer a license to train models from public availability. HobFarm public editorial pages signal ai-train=no, search=yes, ai-input=yes.",
];

export const forbiddenAgentPattern = [
  "/account/",
  "/login/",
  "/api/",
  "/articles/tags/",
  "stylefusion-prompts",
  "stylefusion-export",
  ".zip",
  ".psd",
  ".txt",
  "paidAssetPolicy",
  "irFile",
  "draft: true",
  "admin",
  "raw",
  "full-resolution",
  "high-resolution",
];

type AgentLink = {
  title: string;
  url: string;
  description: string;
  date?: string;
  tags?: string[];
};

type MarkdownDocumentInput = {
  title: string;
  description: string;
  canonicalUrl: string;
  date?: Date | string;
  updated?: Date | string;
  metadata?: Record<string, string | string[] | number | boolean | undefined>;
  body?: string;
};

export const CURATED_AGENT_LINKS: AgentLink[] = [
  {
    title: "About HobFarm",
    url: "https://hob.farm/about/",
    description: "How the magazine, visual studio, workshop, shop, and support paths fit together.",
  },
  {
    title: "StyleFusion",
    url: "https://hob.farm/projects/stylefusion/",
    description: "The public project brief for structured visual extraction and prompt compilation. The unfinished workspace, account flows, and provider-key surfaces are excluded.",
  },
  {
    title: "Grimoire public page",
    url: "https://hob.farm/grimoire/",
    description: "Public explanation of the HobFarm knowledge layer. Private notes and raw material are excluded.",
  },
  {
    title: "Atomic Noir color system",
    url: "https://hob.farm/gallery/asset-lab/atomic-noir-color-system/",
    description: "A public gallery entry documenting the Atomic Noir visual vocabulary and preview-safe media.",
  },
  {
    title: "Visual vocabulary",
    url: "https://hob.farm/visual-systems/",
    description: "Reusable visual systems, style anchors, and gallery-linked vocabulary.",
  },
  {
    title: "Workshop",
    url: "https://hob.farm/workshop/",
    description: "Process notes, methods, production decisions, and build notes.",
  },
  {
    title: "Usage and license",
    url: "https://hob.farm/legal/usage/",
    description: "Public rules for acceptable use, reuse, and boundaries.",
  },
  {
    title: "Products / shop",
    url: "https://hob.farm/shop/",
    description: "Public product previews and storefront routing. Downloadable paid originals are not exposed.",
  },
  {
    title: "Articles",
    url: "https://hob.farm/articles/",
    description: "The main editorial feed.",
  },
  {
    title: "Gallery",
    url: "https://hob.farm/gallery/",
    description: "The public visual archive and preview-safe image sets.",
  },
];

export const SECTION_INDEX_LINKS: AgentLink[] = [
  {
    title: "Articles llms index",
    url: "https://hob.farm/articles/llms.txt",
    description: "Curated public article index.",
  },
  {
    title: "Gallery llms index",
    url: "https://hob.farm/gallery/llms.txt",
    description: "Curated public gallery index with preview-safe entries.",
  },
  {
    title: "Workshop llms index",
    url: "https://hob.farm/workshop/llms.txt",
    description: "Workshop and process-note index.",
  },
  {
    title: "Projects llms index",
    url: "https://hob.farm/projects/llms.txt",
    description: "Public project and recurring-system index.",
  },
  {
    title: "Products llms index",
    url: "https://hob.farm/products/llms.txt",
    description: "Public product previews without paid download files.",
  },
  {
    title: "Academy llms index",
    url: "https://hob.farm/academy/llms.txt",
    description: "Public learning-path index.",
  },
];

const stripExt = (id: string) => id.replace(/\.(md|mdx)$/, "");

export function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, SITE_ORIGIN).toString();
}

export function canonicalPath(path: string): string {
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

export function formatDate(value?: Date | string): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

function hasForbiddenAgentPattern(value: string): boolean {
  const lower = value.toLowerCase();
  return forbiddenAgentPattern.some((pattern) => lower.includes(pattern.toLowerCase()));
}

function normalizeWhitespace(value: string): string {
  return value.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}

export function sanitizeInline(value?: string): string {
  if (!value) return "";
  return normalizeWhitespace(value.replace(/\s+/g, " "));
}

export function sanitizeMarkdownBody(body = ""): string {
  const withoutFrontmatter = body.replace(/^---[\s\S]*?---\s*/, "");
  const withoutMediaTags = withoutFrontmatter
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, (_match, alt) => (alt ? `[Image omitted: ${alt}]` : "[Image omitted]"))
    .replace(/<(img|video|source|iframe|script)\b[^>]*>/gi, "[Media omitted]");

  const safeLines = withoutMediaTags
    .split(/\r?\n/)
    .filter((line) => !hasForbiddenAgentPattern(line))
    .map((line) =>
      line.replace(/https?:\/\/[^\s)>"']+/g, (url) =>
        hasForbiddenAgentPattern(url) ? "[removed-private-or-raw-url]" : url,
      ),
    );

  return normalizeWhitespace(safeLines.join("\n"));
}

export function markdownResponse(body: string): Response {
  return new Response(`${normalizeWhitespace(body)}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Signal": "ai-train=no, search=yes, ai-input=yes",
      Vary: "Accept",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function textResponse(body: string): Response {
  return new Response(`${normalizeWhitespace(body)}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Signal": "ai-train=no, search=yes, ai-input=yes",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function metadataLines(metadata: MarkdownDocumentInput["metadata"] = {}): string[] {
  return Object.entries(metadata)
    .filter(([, value]) => value !== undefined && value !== "" && (!Array.isArray(value) || value.length > 0))
    .map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (char) => char.toUpperCase())
        .trim();
      const display = Array.isArray(value) ? value.join(", ") : String(value);
      return `- ${label}: ${display}`;
    });
}

export function pageMarkdown(input: MarkdownDocumentInput): string {
  const lines = [
    `# ${input.title}`,
    "",
    input.description,
    "",
    `Canonical URL: ${input.canonicalUrl}`,
  ];

  const date = formatDate(input.date);
  const updated = formatDate(input.updated);
  if (date) lines.push(`Published: ${date}`);
  if (updated) lines.push(`Updated: ${updated}`);

  const meta = metadataLines(input.metadata);
  if (meta.length > 0) {
    lines.push("", "## Selected Metadata", ...meta);
  }

  const body = sanitizeMarkdownBody(input.body);
  if (body) {
    lines.push("", "## Content", body);
  }

  return lines.join("\n");
}

function linkList(links: AgentLink[]): string {
  return links
    .map((link) => {
      const date = link.date ? ` (${link.date})` : "";
      const tags = link.tags?.length ? ` Tags: ${link.tags.join(", ")}.` : "";
      return `- [${link.title}](${link.url})${date} - ${link.description}${tags}`;
    })
    .join("\n");
}

export function boundariesMarkdown(): string {
  return [
    "## Boundaries",
    ...PRIVATE_BOUNDARIES.map((line) => `- ${line}`),
    "- Do not request or cite raw prompt exports, source files, paid originals, admin/API/account paths, drafts, or high-resolution assets.",
  ].join("\n");
}

export async function getPublicAgentArticles(): Promise<CollectionEntry<"articles">[]> {
  return getPublishedArticles();
}

export async function getPublicAgentGalleryEntries(): Promise<CollectionEntry<"gallery">[]> {
  const entries = await getCollection("gallery");
  return entries
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => {
      const ad = a.data.date?.getTime() ?? 0;
      const bd = b.data.date?.getTime() ?? 0;
      if (bd !== ad) return bd - ad;
      return a.data.title.localeCompare(b.data.title);
    });
}

export async function getPublicAgentProjects(): Promise<CollectionEntry<"projects">[]> {
  const entries = await getCollection("projects");
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function getPublicAgentGrimoireEntries(): Promise<CollectionEntry<"grimoire">[]> {
  const entries = await getCollection("grimoire");
  return entries
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
}

export function articleToAgentLink(article: CollectionEntry<"articles">): AgentLink {
  const path = canonicalPath(articlePath(article));
  return {
    title: article.data.title,
    url: absoluteUrl(path),
    description: sanitizeInline(getArticleDescription(article.data)),
    date: formatDate(getArticleDate(article)),
    tags: article.data.tags,
  };
}

export function galleryToAgentLink(entry: CollectionEntry<"gallery">): AgentLink {
  const path = canonicalPath(`/gallery/${stripExt(entry.id)}`);
  return {
    title: entry.data.title,
    url: absoluteUrl(path),
    description: sanitizeInline(entry.data.summary),
    date: formatDate(entry.data.date),
    tags: entry.data.tags,
  };
}

export function projectPublicPath(project: CollectionEntry<"projects">): string {
  const slug = stripExt(project.id);
  if (slug === "shop") return "/shop/";
  if (slug === "courses") return "/academy/";
  if (slug === "grimoire") return "/grimoire/";
  return canonicalPath(`/projects/${slug}`);
}

export function projectToAgentLink(project: CollectionEntry<"projects">): AgentLink {
  return {
    title: project.data.title,
    url: absoluteUrl(projectPublicPath(project)),
    description: sanitizeInline(project.data.subtitle || project.data.description),
    date: formatDate(project.data.pubDate),
    tags: [project.data.category, project.data.status],
  };
}

export function productToAgentLink(product: ProductEntry): AgentLink {
  return {
    title: product.data.title,
    url: absoluteUrl(`/shop/#${productSlug(product)}`),
    description: productPublicDescription(product),
    date: formatDate(product.data.dropDate),
    tags: [product.data.productType, product.data.status],
  };
}

export function grimoireToAgentLink(entry: CollectionEntry<"grimoire">): AgentLink {
  return {
    title: entry.data.title,
    url: absoluteUrl(canonicalPath(`/grimoire/${stripExt(entry.id)}`)),
    description: sanitizeInline(entry.data.description),
    date: formatDate(entry.data.date),
    tags: entry.data.tags,
  };
}

export function articleMarkdown(article: CollectionEntry<"articles">): string {
  return pageMarkdown({
    title: article.data.title,
    description: getArticleDescription(article.data),
    canonicalUrl: absoluteUrl(canonicalPath(articlePath(article))),
    date: getArticleDate(article),
    updated: getArticleUpdatedDate(article),
    metadata: {
      section: "Articles",
      department: getArticleDepartment(article.data),
      series: article.data.series,
      tags: article.data.tags,
      heroImage: article.data.heroImage ?? article.data.hero,
      relatedGallery: article.data.relatedGallery,
      relatedProject: article.data.relatedProject,
    },
    body: article.body,
  });
}

export function galleryMarkdown(entry: CollectionEntry<"gallery">): string {
  const heroFile = entry.data.hero.type === "image" ? entry.data.hero.file : entry.data.hero.poster;
  const publicPreview = previewImageUrl(entry.data.folder, heroFile);

  const metadata: Record<string, string | string[] | undefined> = {
    section: "Gallery",
    type: galleryTypeLabels[entry.data.type],
    tags: entry.data.tags,
    publicPreviewImage: publicPreview,
    methods: entry.data.methods,
    relatedArticleOrGallery: entry.data.related,
    relatedProcess: entry.data.relatedProcess,
  };

  const structuredNotes = [
    entry.data.concept?.thesis && `Concept thesis: ${entry.data.concept.thesis}`,
    entry.data.concept?.method && `Method: ${entry.data.concept.method}`,
    entry.data.processNotes && `Process notes: ${entry.data.processNotes}`,
    entry.data.comparison?.findings?.length && `Findings:\n${entry.data.comparison.findings.map((item) => `- ${item}`).join("\n")}`,
    entry.data.visualDNA?.length &&
      `Visual DNA:\n${entry.data.visualDNA.map((item) => `- ${item.label}: ${item.value}`).join("\n")}`,
    entry.data.fieldNotes?.length &&
      `Field notes:\n${entry.data.fieldNotes.map((item) => `- ${item.label}: ${item.text}`).join("\n")}`,
    entry.data.workflowSteps?.length &&
      `Workflow:\n${entry.data.workflowSteps.map((item) => `- ${item.label}: ${item.text}`).join("\n")}`,
  ]
    .filter((item): item is string => Boolean(item))
    .join("\n\n");

  return pageMarkdown({
    title: entry.data.title,
    description: entry.data.summary,
    canonicalUrl: absoluteUrl(canonicalPath(`/gallery/${stripExt(entry.id)}`)),
    date: entry.data.date,
    metadata,
    body: [structuredNotes, entry.body].filter(Boolean).join("\n\n"),
  });
}

export function projectMarkdown(project: CollectionEntry<"projects">): string {
  return pageMarkdown({
    title: project.data.title,
    description: project.data.subtitle || project.data.description,
    canonicalUrl: absoluteUrl(projectPublicPath(project)),
    date: project.data.pubDate,
    updated: project.data.updatedDate,
    metadata: {
      section: "Projects",
      status: project.data.status,
      category: project.data.category,
      stack: project.data.stack,
      highlights: project.data.highlights,
    },
    body: [
      project.data.description,
      project.data.features?.length
        ? `Features:\n${project.data.features.map((feature) => `- ${feature.title}: ${feature.description}`).join("\n")}`
        : "",
      project.body,
    ]
      .filter(Boolean)
      .join("\n\n"),
  });
}

function productPublicDescription(product: ProductEntry): string {
  if (product.data.paidAssetPolicy?.hasPaidAsset || hasForbiddenAgentPattern(product.data.shortDescription)) {
    return "Public preview for a HobFarm product drop. Downloadable originals are excluded from the agent corpus.";
  }

  return sanitizeInline(product.data.shortDescription);
}

export function productMarkdown(product: ProductEntry): string {
  return pageMarkdown({
    title: product.data.title,
    description: productPublicDescription(product),
    canonicalUrl: absoluteUrl(`/shop/#${productSlug(product)}`),
    date: product.data.dropDate,
    metadata: {
      section: "Products",
      productType: product.data.productType,
      platform: product.data.platform,
      status: product.data.status,
      edition: product.data.edition,
      priceLabel: product.data.priceLabel,
      relatedArticle: product.data.relatedArticle,
      relatedWorkshopNote: product.data.relatedWorkshopNote,
      visualSystem: product.data.visualSystem,
    },
    body:
      "This is a public product preview. Paid files, originals, and private downloads are excluded from the agent corpus.",
  });
}

export function grimoireMarkdown(entry: CollectionEntry<"grimoire">): string {
  return pageMarkdown({
    title: entry.data.title,
    description: entry.data.description,
    canonicalUrl: absoluteUrl(canonicalPath(`/grimoire/${stripExt(entry.id)}`)),
    date: entry.data.date,
    updated: entry.data.updated,
    metadata: {
      section: "Grimoire",
      category: entry.data.category,
      subcategory: entry.data.subcategory,
      difficulty: entry.data.difficulty,
      tags: entry.data.tags,
    },
    body: entry.body,
  });
}

export async function buildRootLlms(): Promise<string> {
  return [
    "# HobFarm Public Agent Index",
    "",
    "HobFarm is an online magazine and visual studio. This file is a curated entry point for agents, search systems, and readers that need a compact map of the public corpus.",
    "",
    "## Primary Public Entry Points",
    linkList(CURATED_AGENT_LINKS),
    "",
    "## Section Indexes",
    linkList(SECTION_INDEX_LINKS),
    "",
    "## Markdown Alternates",
    "- Important pages expose `/index.md` alternates, for example `https://hob.farm/index.md`, `https://hob.farm/about/index.md`, and `https://hob.farm/articles/index.md`.",
    "- Public article, gallery, and project detail pages expose `/index.md` alternates next to their canonical HTML routes.",
    "- Requests with `Accept: text/markdown` receive Markdown for public content routes when a Markdown alternate exists.",
    "",
    boundariesMarkdown(),
    "",
    "## Citation Guidance",
    "- Cite the canonical HTML URL unless the Markdown alternate is specifically relevant to the retrieval method.",
    "- Use article titles, publication dates, gallery titles, and project names as visible source labels.",
    "- Do not cite removed or omitted private/raw/paid material.",
  ].join("\n");
}

export async function buildSectionLlms(title: string, description: string, links: AgentLink[]): Promise<string> {
  return [
    `# ${title}`,
    "",
    description,
    "",
    "## Public Entries",
    links.length > 0 ? linkList(links) : "- No public entries are currently available.",
    "",
    boundariesMarkdown(),
  ].join("\n");
}

export async function buildFullLlms(): Promise<string> {
  const [articles, galleryEntries, projects, products, grimoireEntries] = await Promise.all([
    getPublicAgentArticles(),
    getPublicAgentGalleryEntries(),
    getPublicAgentProjects(),
    getPublicProducts(),
    getPublicAgentGrimoireEntries(),
  ]);

  return [
    "# HobFarm Public Corpus",
    "",
    "This expanded public corpus is generated from curated public collections only. It excludes tags, thin listing pages, private routes, admin routes, APIs, raw assets, paid downloads, drafts, high-resolution originals, and source files.",
    "",
    boundariesMarkdown(),
    "",
    "## Curated Entry Points",
    linkList(CURATED_AGENT_LINKS),
    "",
    "## Articles",
    linkList(articles.map(articleToAgentLink)),
    "",
    articles.map(articleMarkdown).join("\n\n---\n\n"),
    "",
    "## Galleries",
    linkList(galleryEntries.map(galleryToAgentLink)),
    "",
    galleryEntries.map(galleryMarkdown).join("\n\n---\n\n"),
    "",
    "## Projects",
    linkList(projects.map(projectToAgentLink)),
    "",
    projects.map(projectMarkdown).join("\n\n---\n\n"),
    "",
    "## Products",
    linkList(products.map(productToAgentLink)),
    "",
    products.map(productMarkdown).join("\n\n---\n\n"),
    "",
    "## Public Grimoire Entries",
    linkList(grimoireEntries.map(grimoireToAgentLink)),
    "",
    grimoireEntries.map(grimoireMarkdown).join("\n\n---\n\n"),
  ].join("\n");
}
