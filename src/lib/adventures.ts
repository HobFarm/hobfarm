import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type Adventure = CollectionEntry<"adventures">;

export function adventureSlug(adventure: Adventure): string {
  return adventure.id.replace(/\.(md|mdx)$/, "").split("/").pop()!;
}

export function adventurePath(adventure: Adventure): string {
  return `/presents/${adventure.data.series}/${adventureSlug(adventure)}/`;
}

export function getAdventureDate(adventure: Adventure): Date {
  return new Date(adventure.data.date ?? 0);
}

export function isPublishedAdventure(adventure: Adventure, now: Date = new Date()): boolean {
  if (adventure.data.draft) return false;
  const status = adventure.data.status ?? "published";
  if (status === "draft" || status === "archived") return false;
  return getAdventureDate(adventure).getTime() <= now.getTime();
}

export function byNewestAdventure(a: Adventure, b: Adventure): number {
  return getAdventureDate(b).getTime() - getAdventureDate(a).getTime();
}

export function byAdventureNumber(a: Adventure, b: Adventure): number {
  return a.data.number - b.data.number;
}

export async function getPublishedAdventures(now: Date = new Date()): Promise<Adventure[]> {
  const adventures = await getCollection("adventures");
  return adventures.filter((a) => isPublishedAdventure(a, now)).sort(byNewestAdventure);
}

export function adventuresInSeries(adventures: Adventure[], seriesSlug: string): Adventure[] {
  return adventures.filter((a) => a.data.series === seriesSlug).sort(byAdventureNumber);
}

/** `seriesAdventures` must already be sorted by number (see `adventuresInSeries`). */
export function getAdjacentAdventures(
  current: Adventure,
  seriesAdventures: Adventure[]
): { previous?: Adventure; next?: Adventure } {
  const index = seriesAdventures.findIndex((a) => a.id === current.id);
  if (index === -1) return {};
  return {
    previous: seriesAdventures[index - 1],
    next: seriesAdventures[index + 1],
  };
}
