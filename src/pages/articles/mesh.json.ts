import type { APIRoute } from "astro";
import { editorialEntityTypes } from "@/data/editorial-mesh";
import {
  articlePath,
  getArticleDate,
  getArticleUpdatedDate,
  getPublishedArticles,
  getRelatedArticles,
  stripArticleExt,
} from "@/lib/articles";

export const prerender = true;

export const GET: APIRoute = async () => {
  const articles = await getPublishedArticles();
  const payload = {
    generatedAt: new Date().toISOString(),
    articleCount: articles.length,
    articles: articles.map((article) => {
      const mesh = article.data.mesh!;
      return {
        id: stripArticleExt(article.id),
        title: article.data.title,
        url: articlePath(article),
        publishedAt: getArticleDate(article).toISOString(),
        updatedAt: getArticleUpdatedDate(article)?.toISOString(),
        section: mesh.section,
        series: mesh.series,
        subjects: mesh.subjects,
        entities: Object.fromEntries(
          editorialEntityTypes.map((type) => [type, mesh.entities[type]]),
        ),
        related: getRelatedArticles(article, articles, 6).map((related) => ({
          id: stripArticleExt(related.id),
          url: articlePath(related),
        })),
      };
    }),
  };

  return new Response(JSON.stringify(payload), {
    headers: {
      "Cache-Control":
        "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
};
