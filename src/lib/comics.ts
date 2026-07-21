import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type Comic = CollectionEntry<"comics">;
export type ComicTagCount = {
  tag: string;
  count: number;
};

export function comicSlug(comic: Comic): string {
  return comic.id.replace(/\.(md|mdx)$/, "").split("/").pop()!;
}

export function comicPath(comic: Comic): string {
  return `/funnies/${comic.data.series}/${comicSlug(comic)}/`;
}

export function comicTagPath(tag: string): string {
  return `/funnies/tags/${encodeURIComponent(tag)}`;
}

export function getComicDate(comic: Comic): Date {
  return new Date(comic.data.date ?? 0);
}

export function isPublishedComic(comic: Comic, now: Date = new Date()): boolean {
  if (comic.data.draft) return false;
  const status = comic.data.status ?? "published";
  if (status === "draft" || status === "archived") return false;
  return getComicDate(comic).getTime() <= now.getTime();
}

export function byNewestComic(a: Comic, b: Comic): number {
  return getComicDate(b).getTime() - getComicDate(a).getTime();
}

export async function getPublishedComics(now: Date = new Date()): Promise<Comic[]> {
  const comics = await getCollection("comics");
  return comics.filter((c) => isPublishedComic(c, now)).sort(byNewestComic);
}

export function comicsInSeries(comics: Comic[], seriesSlug: string): Comic[] {
  return comics.filter((c) => c.data.series === seriesSlug);
}

export function comicsForCharacter(comics: Comic[], characterSlug: string): Comic[] {
  return comics.filter((c) => c.data.characters.includes(characterSlug));
}

export function comicsWithTag(comics: Comic[], tag: string): Comic[] {
  return comics.filter((comic) => comic.data.tags.includes(tag));
}

export function getComicTagCounts(comics: Comic[]): ComicTagCount[] {
  const counts = new Map<string, number>();

  for (const comic of comics) {
    for (const tag of comic.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag, undefined, { sensitivity: "base" }));
}
