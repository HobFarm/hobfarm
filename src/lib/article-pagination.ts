export const ARTICLE_CARDS_PER_PAGE = 9;

export function getArticleArchivePageCount(articleCount: number): number {
  const cardsAfterCover = Math.max(0, articleCount - 1);
  return Math.max(1, Math.ceil(cardsAfterCover / ARTICLE_CARDS_PER_PAGE));
}

export function getArticleArchivePage<T>(articles: T[], page: number): T[] {
  const safePage = Math.max(1, Math.floor(page));
  const start = 1 + (safePage - 1) * ARTICLE_CARDS_PER_PAGE;
  return articles.slice(start, start + ARTICLE_CARDS_PER_PAGE);
}

export function articleArchivePagePath(page: number): string {
  return page <= 1 ? "/articles/" : `/articles/page/${page}/`;
}
