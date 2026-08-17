import {
  absoluteUrl,
  characterToAgentLink,
  formatDate,
  getPublicAgentArticles,
  getPublicAgentCharacters,
  getPublicAgentGalleryEntries,
  getPublicAgentGrimoireEntries,
  getPublicAgentProjects,
  getPublicAgentStorySeries,
  projectPublicPath,
  storySeriesToAgentLink,
} from "@/lib/agent-corpus";
import {
  articlePath,
  getArticleDate,
  getArticleSubjectCounts,
  getArticleUpdatedDate,
} from "@/lib/articles";
import { otherAliceProjectNav } from "@/data/other-alice-world-guide";
import {
  editorialSections,
  editorialSectionPath,
  editorialSeries,
} from "@/data/editorial-mesh";
import { historicalWorkshopProjects, selectedWorkshopProjects } from "@/data/workshop-projects";

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
};

const staticEntries: SitemapEntry[] = [
  { loc: absoluteUrl("/"), changefreq: "weekly", priority: "1.0" },
  { loc: absoluteUrl("/about/"), changefreq: "monthly", priority: "0.7" },
  { loc: absoluteUrl("/articles/"), changefreq: "daily", priority: "0.9" },
  { loc: absoluteUrl("/articles/topics/"), changefreq: "weekly", priority: "0.6" },
  ...editorialSections.map((section) => ({
    loc: absoluteUrl(editorialSectionPath(section.slug)),
    changefreq: "weekly" as const,
    priority: "0.8",
  })),
  ...editorialSeries.map((series) => ({
    loc: absoluteUrl(series.href),
    changefreq: "weekly" as const,
    priority: "0.8",
  })),
  { loc: absoluteUrl("/gallery/"), changefreq: "weekly", priority: "0.9" },
  {
    loc: absoluteUrl("/presents/"),
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    loc: absoluteUrl("/presents/3-degrees-of-dick-miller/"),
    changefreq: "weekly",
    priority: "0.9",
  },
  ...otherAliceProjectNav.map((item) => ({
    loc: absoluteUrl(item.href),
    changefreq: "weekly" as const,
    priority: "0.8",
  })),
  { loc: absoluteUrl("/workshop/"), changefreq: "weekly", priority: "0.8" },
  { loc: absoluteUrl("/workshop/projects/"), changefreq: "weekly", priority: "0.8" },
  { loc: absoluteUrl("/workshop/workshop-notes/"), changefreq: "weekly", priority: "0.8" },
  ...selectedWorkshopProjects.map((project) => ({
    loc: absoluteUrl(project.destination),
    changefreq: "monthly" as const,
    priority: "0.7",
  })),
  ...historicalWorkshopProjects.map((project) => ({
    loc: absoluteUrl(project.destination),
    changefreq: "yearly" as const,
    priority: "0.4",
  })),
  { loc: absoluteUrl("/academy/"), changefreq: "monthly", priority: "0.7" },
  { loc: absoluteUrl("/shop/"), changefreq: "weekly", priority: "0.7" },
  { loc: absoluteUrl("/support/"), changefreq: "monthly", priority: "0.5" },
  { loc: absoluteUrl("/contact/"), changefreq: "yearly", priority: "0.4" },
  { loc: absoluteUrl("/grimoire/"), changefreq: "monthly", priority: "0.7" },
  {
    loc: absoluteUrl("/visual-systems/"),
    changefreq: "monthly",
    priority: "0.7",
  },
  { loc: absoluteUrl("/services/"), changefreq: "monthly", priority: "0.5" },
  { loc: absoluteUrl("/legal/usage/"), changefreq: "yearly", priority: "0.3" },
  {
    loc: absoluteUrl("/legal/privacy/"),
    changefreq: "yearly",
    priority: "0.3",
  },
  { loc: absoluteUrl("/legal/terms/"), changefreq: "yearly", priority: "0.3" },
  {
    loc: absoluteUrl("/legal/refunds/"),
    changefreq: "yearly",
    priority: "0.3",
  },
  {
    loc: absoluteUrl("/legal/cookies/"),
    changefreq: "yearly",
    priority: "0.3",
  },
  { loc: absoluteUrl("/legal/dpa/"), changefreq: "yearly", priority: "0.3" },
  {
    loc: absoluteUrl("/legal/bug-bounty/"),
    changefreq: "yearly",
    priority: "0.3",
  },
];

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function urlEntry(entry: SitemapEntry): string {
  return [
    "  <url>",
    `    <loc>${escapeXml(entry.loc)}</loc>`,
    entry.lastmod ? `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "",
    entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : "",
    entry.priority ? `    <priority>${entry.priority}</priority>` : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function GET() {
  const [articles, galleryEntries, projects, grimoireEntries] =
    await Promise.all([
      getPublicAgentArticles(),
      getPublicAgentGalleryEntries(),
      getPublicAgentProjects(),
      getPublicAgentGrimoireEntries(),
    ]);

  const dynamicEntries: SitemapEntry[] = [
    ...getArticleSubjectCounts(articles)
      .filter((subject) => subject.count >= 2)
      .map((subject) => ({
        loc: absoluteUrl(`/articles/topics/${subject.id}/`),
        changefreq: "weekly" as const,
        priority: "0.6",
      })),
    ...articles.map((article) => ({
      loc: absoluteUrl(`${articlePath(article)}/`),
      lastmod: formatDate(
        getArticleUpdatedDate(article) ?? getArticleDate(article),
      ),
      changefreq: "monthly" as const,
      priority: "0.8",
    })),
    ...getPublicAgentStorySeries().map((series) => ({
      loc: storySeriesToAgentLink(series).url,
      changefreq: "weekly" as const,
      priority: "0.9",
    })),
    ...getPublicAgentCharacters().map((character) => ({
      loc: characterToAgentLink(character).url,
      changefreq: "monthly" as const,
      priority: "0.7",
    })),
    ...galleryEntries.map((entry) => ({
      loc: absoluteUrl(`/gallery/${entry.id.replace(/\.(md|mdx)$/, "")}/`),
      lastmod: formatDate(entry.data.date),
      changefreq: "monthly" as const,
      priority: "0.7",
    })),
    // Project records are data sources for pages elsewhere; only the ones with
    // a real public route belong in the sitemap.
    ...projects.flatMap((project) => {
      const path = projectPublicPath(project);
      if (!path) return [];
      return [
        {
          loc: absoluteUrl(path),
          lastmod: formatDate(project.data.updatedDate ?? project.data.pubDate),
          changefreq: "monthly" as const,
          priority: "0.7",
        },
      ];
    }),
    ...grimoireEntries.map((entry) => ({
      loc: absoluteUrl(`/grimoire/${entry.id.replace(/\.(md|mdx)$/, "")}/`),
      lastmod: formatDate(entry.data.updated ?? entry.data.date),
      changefreq: "monthly" as const,
      priority: "0.5",
    })),
  ];

  const unique = new Map<string, SitemapEntry>();
  for (const entry of [...staticEntries, ...dynamicEntries]) {
    unique.set(entry.loc, entry);
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[...unique.values()].map(urlEntry),
    "</urlset>",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
