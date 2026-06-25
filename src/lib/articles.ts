import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type Article = CollectionEntry<"blog">;
export type ArticleData = Article["data"];

export const articleDepartmentLabels: Record<string, string> = {
  technical: "Workshop Notes",
  "magazine-time-machine": "Magazine Time Machine",
  "cultural-thread": "Cultural Thread",
  grimoire: "Grimoire",
  stylefusion: "StyleFusion",
  hobbot: "HobBot",
  business: "Studio Notes",
  research: "Research",
  "3-degrees-of-dick-miller": "3 Degrees of Dick Miller",
  "fake-ads": "Fake Ads",
  "before-after": "Before / After",
  "character-department": "Character Department",
  "archive-remix": "Archive Remix",
  "dead-future-report": "Dead Future Report",
  "workshop-notes": "Workshop Notes",
};

export const articleCategories = [
  { value: "all", label: "All" },
  { value: "magazine-time-machine", label: "Magazine Time Machine" },
  { value: "3-degrees-of-dick-miller", label: "3 Degrees of Dick Miller" },
  { value: "fake-ads", label: "Fake Ads" },
  { value: "before-after", label: "Before / After" },
  { value: "character-department", label: "Character Department" },
  { value: "archive-remix", label: "Archive Remix" },
  { value: "dead-future-report", label: "Dead Future Report" },
  { value: "workshop-notes", label: "Workshop Notes" },
  { value: "cultural-thread", label: "Cultural Thread" },
  { value: "research", label: "Research" },
  { value: "technical", label: "Workshop Notes" },
  { value: "grimoire", label: "Grimoire" },
  { value: "stylefusion", label: "StyleFusion" },
  { value: "hobbot", label: "HobBot" },
  { value: "business", label: "Studio Notes" },
];

export function stripArticleExt(id: string): string {
  return id.replace(/\.(md|mdx)$/, "");
}

export function articlePath(articleOrId: Article | string): string {
  const id = typeof articleOrId === "string" ? articleOrId : articleOrId.id;
  return `/articles/${stripArticleExt(id)}`;
}

export function articleTagPath(tag: string): string {
  return `/articles/tags/${encodeURIComponent(tag)}`;
}

export function articleCategoryPath(category: string): string {
  return `/articles/category/${category}`;
}

export function getArticleDate(articleOrData: Article | ArticleData): Date {
  const data = "data" in articleOrData ? articleOrData.data : articleOrData;
  return new Date(data.pubDate ?? data.publishedAt ?? 0);
}

export function getArticleUpdatedDate(articleOrData: Article | ArticleData): Date | undefined {
  const data = "data" in articleOrData ? articleOrData.data : articleOrData;
  const value = data.updatedDate ?? data.updatedAt;
  return value ? new Date(value) : undefined;
}

export function getArticleDescription(data: ArticleData): string {
  return data.description ?? data.dek ?? data.excerpt;
}

export function getArticleDek(data: ArticleData): string {
  return data.dek ?? data.excerpt;
}

export function getArticleImage(data: ArticleData): string | undefined {
  return data.socialImage ?? data.heroImage ?? data.hero;
}

export function getArticleHero(data: ArticleData): string | undefined {
  return data.heroImage ?? data.hero ?? data.socialImage;
}

export function getArticleDepartment(data: ArticleData): string | undefined {
  return data.department ?? data.category;
}

export function getArticleDepartmentLabel(dataOrValue: ArticleData | string | undefined): string {
  const value =
    typeof dataOrValue === "string" ? dataOrValue : dataOrValue ? getArticleDepartment(dataOrValue) : undefined;
  if (!value) return "Feature";
  return articleDepartmentLabels[value] ?? value;
}

export function isPublishedArticle(article: Article, now: Date = new Date()): boolean {
  if (article.data.draft) return false;
  return getArticleDate(article).getTime() <= now.getTime();
}

export function byNewestArticle(a: Article, b: Article): number {
  return getArticleDate(b).getTime() - getArticleDate(a).getTime();
}

export function byOldestArticle(a: Article, b: Article): number {
  return getArticleDate(a).getTime() - getArticleDate(b).getTime();
}

export async function getPublishedArticles(now: Date = new Date()): Promise<Article[]> {
  const articles = await getCollection("blog");
  return articles.filter((article) => isPublishedArticle(article, now)).sort(byNewestArticle);
}

export function getRelatedArticles(current: Article, articles: Article[], limit = 4): Article[] {
  const currentSlug = stripArticleExt(current.id);
  const bySlug = new Map(articles.map((article) => [stripArticleExt(article.id), article]));

  if (current.data.relatedArticles?.length) {
    return current.data.relatedArticles
      .map((slug) => bySlug.get(stripArticleExt(slug)))
      .filter((article): article is Article => Boolean(article) && article.id !== current.id)
      .slice(0, limit);
  }

  const currentDepartment = getArticleDepartment(current.data);
  const currentTags = new Set(current.data.tags);
  const currentSeries = current.data.series;

  return articles
    .filter((article) => stripArticleExt(article.id) !== currentSlug)
    .map((article) => {
      let score = 0;
      if (currentSeries && article.data.series === currentSeries) score += 6;
      if (currentDepartment && getArticleDepartment(article.data) === currentDepartment) score += 4;
      for (const tag of article.data.tags) {
        if (currentTags.has(tag)) score += 1;
      }
      return { article, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return getArticleDate(b.article).getTime() - getArticleDate(a.article).getTime();
    })
    .slice(0, limit)
    .map(({ article }) => article);
}
