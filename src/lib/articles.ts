import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import {
  departmentFilters,
  departmentPath,
  getDepartmentLabel,
  resolveDepartment,
} from "@/data/departments";
import { getPresentsTitle } from "@/data/presents-titles";
import {
  editorialEntityTypes,
  editorialSectionPath,
  type EditorialSeriesId,
  type EditorialSubjectId,
  getEditorialEntity,
  getEditorialSection,
  getEditorialSeries,
  getEditorialSubject,
} from "@/data/editorial-mesh";
import {
  scoreEditorialMeshRelated,
  type RelatedArticleScore,
} from "@/lib/editorial-mesh";
import { isArticlePublicAt } from "@/lib/article-publication";

export type { RelatedArticleScore } from "@/lib/editorial-mesh";
export {
  getArticleDek,
  getArticleDescription,
  getArticleDocumentTitle,
  getArticleSeoTitle,
} from "@/lib/article-metadata";

export type Article = CollectionEntry<"articles">;
export type ArticleData = Article["data"];
export type ArticleTagCount = {
  tag: string;
  count: number;
};
export type ArticleSubjectCount = {
  id: EditorialSubjectId;
  label: string;
  count: number;
};

// The department registry remains the routing taxonomy (src/data/departments.ts),
// even though the old /departments/ route tree is retired. `articleCategories`
// stays as a back-compat re-export so existing imports keep working; prefer
// importing `departmentFilters` directly in new code.
export const articleCategories = departmentFilters;

const preferredArticleTagLabels: Record<string, string> = {
  ai: "AI",
  anthropic: "Anthropic",
  grimoire: "Grimoire",
  "pre-code hollywood": "Pre-Code Hollywood",
  stylefusion: "StyleFusion",
};

export function stripArticleExt(id: string): string {
  return id.replace(/\.(md|mdx)$/, "");
}

export function articlePath(articleOrId: Article | string): string {
  if (
    typeof articleOrId !== "string" &&
    articleOrId.data.mesh?.series.includes("3dm")
  ) {
    const title = getPresentsTitle("3dm");
    const slug = stripArticleExt(articleOrId.id).split("/").pop();
    if (title && slug) return `${title.href}${slug}/`;
  }
  const id = typeof articleOrId === "string" ? articleOrId : articleOrId.id;
  return `/articles/${stripArticleExt(id)}/`;
}

export function articleTagPath(tag: string): string {
  return `/articles/tags/${encodeURIComponent(normalizeArticleTag(tag))}/`;
}

export function articleSubjectPath(subject: string): string {
  return `/articles/topics/${encodeURIComponent(subject)}/`;
}

export function normalizeArticleTag(tag: string): string {
  return tag.trim().toLocaleLowerCase("en-US");
}

/** @deprecated Use departmentPath from @/data/departments. */
export function articleCategoryPath(category: string): string {
  return departmentPath(category);
}

export function getArticleDate(articleOrData: Article | ArticleData): Date {
  const data = "data" in articleOrData ? articleOrData.data : articleOrData;
  // `publishedAt` carries the release clock used by scheduled articles. Prefer
  // it for ordering so two entries on the same calendar date still sort in
  // their actual publication sequence; `pubDate` remains the fallback for
  // older entries that only record a day.
  return new Date(data.publishedAt ?? data.pubDate ?? 0);
}

export function getArticleUpdatedDate(articleOrData: Article | ArticleData): Date | undefined {
  const data = "data" in articleOrData ? articleOrData.data : articleOrData;
  const value = data.updatedDate ?? data.updatedAt;
  return value ? new Date(value) : undefined;
}

export function getArticleImage(data: ArticleData): string | undefined {
  return data.socialImage ?? data.heroImage ?? data.hero;
}

export function getArticleHero(data: ArticleData): string | undefined {
  return data.heroImage ?? data.hero ?? data.socialImage;
}

export function getArticleDepartment(data: ArticleData): string | undefined {
  return resolveDepartment(data.department ?? data.category);
}

export function getArticleDepartmentLabel(dataOrValue: ArticleData | string | undefined): string {
  const value =
    typeof dataOrValue === "string" ? dataOrValue : dataOrValue ? getArticleDepartment(dataOrValue) : undefined;
  return getDepartmentLabel(value);
}

export function getArticleSection(data: ArticleData): string | undefined {
  return data.mesh?.section;
}

export function getArticleSectionLabel(data: ArticleData): string {
  return getEditorialSection(getArticleSection(data))?.label ?? getArticleDepartmentLabel(data);
}

export function getArticleSectionPath(data: ArticleData): string | undefined {
  const section = getArticleSection(data);
  return section ? editorialSectionPath(section) : undefined;
}

export function articleUsesSeries(data: ArticleData, seriesId: EditorialSeriesId): boolean {
  return data.mesh?.series.includes(seriesId) ?? false;
}

export function getArticleMeshKeywords(data: ArticleData): string[] {
  const mesh = data.mesh;
  if (!mesh) return data.tags;

  const subjectLabels = mesh.subjects.map(
    (id) => getEditorialSubject(id)?.label ?? id,
  );
  const seriesLabels = mesh.series.map(
    (id) => getEditorialSeries(id)?.label ?? id,
  );
  const entityLabels = editorialEntityTypes.flatMap((type) =>
    mesh.entities[type].map((id) => getEditorialEntity(id)?.label ?? id),
  );
  return [...new Set([...subjectLabels, ...seriesLabels, ...entityLabels])];
}

export function getArticleAboutEntities(data: ArticleData) {
  if (!data.mesh) return [];
  return editorialEntityTypes.flatMap((type) =>
    data.mesh!.entities[type].flatMap((id) => {
      const entity = getEditorialEntity(id);
      return entity ? [{ ...entity, type }] : [];
    }),
  );
}

export function isPublishedArticle(article: Article, now: Date = new Date()): boolean {
  return isArticlePublicAt(article.data, now);
}

export function byNewestArticle(a: Article, b: Article): number {
  return getArticleDate(b).getTime() - getArticleDate(a).getTime();
}

export function byOldestArticle(a: Article, b: Article): number {
  return getArticleDate(a).getTime() - getArticleDate(b).getTime();
}

export async function getPublishedArticles(now: Date = new Date()): Promise<Article[]> {
  const articles = await getCollection("articles");
  return articles.filter((article) => isPublishedArticle(article, now)).sort(byNewestArticle);
}

export function getArticleTagCounts(articles: Article[]): ArticleTagCount[] {
  const counts = new Map<string, ArticleTagCount>();

  for (const article of articles) {
    const articleTags = new Set<string>();
    for (const tag of article.data.tags) {
      const normalizedTag = normalizeArticleTag(tag);
      if (!normalizedTag || articleTags.has(normalizedTag)) continue;
      articleTags.add(normalizedTag);

      const existing = counts.get(normalizedTag);
      counts.set(normalizedTag, {
        tag: preferredArticleTagLabels[normalizedTag] ?? existing?.tag ?? tag.trim(),
        count: (existing?.count ?? 0) + 1,
      });
    }
  }

  return [...counts.values()]
    .sort((a, b) => a.tag.localeCompare(b.tag, undefined, { sensitivity: "base" }));
}

export function getArticleSubjectCounts(articles: Article[]): ArticleSubjectCount[] {
  const counts = new Map<EditorialSubjectId, number>();

  for (const article of articles) {
    for (const subject of new Set(article.data.mesh?.subjects ?? [])) {
      counts.set(subject, (counts.get(subject) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([id, count]) => ({
      id,
      label: getEditorialSubject(id)?.label ?? id,
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function scoreRelatedArticle(current: ArticleData, candidate: ArticleData): RelatedArticleScore {
  if (!current.mesh || !candidate.mesh) {
    const result: RelatedArticleScore = { score: 0, reasons: [] };
    const currentDepartment = getArticleDepartment(current);
    if (currentDepartment && getArticleDepartment(candidate) === currentDepartment) {
      result.score += 1;
      result.reasons.push(`legacy department: ${currentDepartment}`);
    }
    return result;
  }
  return scoreEditorialMeshRelated(current.mesh, candidate.mesh);
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

  return articles
    .filter((article) => stripArticleExt(article.id) !== currentSlug)
    .map((article) => {
      const relationship = scoreRelatedArticle(current.data, article.data);
      return { article, ...relationship };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return getArticleDate(b.article).getTime() - getArticleDate(a.article).getTime();
    })
    .slice(0, limit)
    .map(({ article }) => article);
}
