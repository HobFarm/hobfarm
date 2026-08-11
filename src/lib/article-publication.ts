export type ArticlePublicationData = {
  draft?: boolean;
  status?: string;
  publishedAt?: Date | string;
  pubDate?: Date | string;
};

export function isArticlePublicAt(
  data: ArticlePublicationData,
  now: Date = new Date(),
): boolean {
  if (data.draft) return false;
  const status = data.status ?? "published";
  if (status === "draft" || status === "archived") return false;
  const releaseValue = data.publishedAt ?? data.pubDate;
  if (!releaseValue) return false;
  return new Date(releaseValue).getTime() <= now.getTime();
}
