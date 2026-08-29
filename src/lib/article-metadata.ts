export type ArticleMetadataSource = {
  title: string;
  seoTitle?: string;
  excerpt: string;
  dek?: string;
  description?: string;
};

export function getArticleSeoTitle(data: ArticleMetadataSource): string {
  return data.seoTitle ?? data.title;
}

export function getArticleDocumentTitle(
  data: ArticleMetadataSource,
  siteName = "HobFarm",
): string {
  const searchTitle = getArticleSeoTitle(data);
  const suffix = ` | ${siteName}`;
  return searchTitle.endsWith(suffix) ? searchTitle : `${searchTitle}${suffix}`;
}

export function getArticleDescription(data: ArticleMetadataSource): string {
  return data.description ?? data.dek ?? data.excerpt;
}

export function getArticleDek(data: ArticleMetadataSource): string {
  return data.dek ?? data.excerpt;
}
