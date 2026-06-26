// Comic series definitions for the Funnies department. Each recurring comic gets
// a series here; individual comics (src/content/comics) reference a series by
// slug. This is the source of truth for series titles, premises, and which
// characters star, so /funnies, /funnies/[series], and character pages all read
// from one place. Comic membership and counts are derived from the comics
// collection at build time, not stored here.

export type ComicSeries = {
  slug: string;
  title: string;
  /** Character slugs (into src/data/characters.ts) that star in this series. */
  characters: string[];
  premise: string;
  /** Optional CDN thumbnail for the series card. */
  thumbnail?: string;
};

export const comicSeries: ComicSeries[] = [
  {
    slug: "gary",
    title: "Gary",
    characters: ["gary"],
    premise: "A guinea pig, his appetites, and the objects he refuses to let go of.",
  },
  {
    slug: "gary-fat-cat",
    title: "Gary & Fat Cat",
    characters: ["gary", "fat-cat"],
    premise: "The guinea pig and the cat, locked in a rivalry neither of them fully understands.",
  },
  {
    slug: "fat-cat",
    title: "Fat Cat",
    characters: ["fat-cat"],
    premise: "Schemes, snacks, and contempt, delivered by a cat with no follow-through.",
  },
  {
    slug: "larry",
    title: "Larry",
    characters: ["larry"],
    premise: "Larry means well. It rarely helps.",
  },
  {
    slug: "buffcock",
    title: "Buffcock",
    characters: ["buffcock"],
    premise: "All swagger, no plan. A rooster who thinks the barn revolves around him.",
  },
  {
    slug: "hobunny",
    title: "Hobunny",
    characters: ["hobunny"],
    premise: "The HobFarm rabbit, mascot duties optional.",
  },
  {
    slug: "gothcat",
    title: "Gothcat",
    characters: ["gothcat"],
    premise: "A cat with strong opinions about the void and your lighting choices.",
  },
  {
    slug: "one-offs",
    title: "One-Offs",
    characters: [],
    premise: "Single-panel gags and strays that do not belong to a recurring series.",
  },
];

const seriesBySlug = new Map(comicSeries.map((s) => [s.slug, s]));

export function getComicSeries(slug: string | undefined | null): ComicSeries | undefined {
  return slug ? seriesBySlug.get(slug) : undefined;
}

export function seriesPath(slug: string): string {
  return `/funnies/${slug}/`;
}

export function getSeriesTitle(slug: string | undefined | null): string {
  return getComicSeries(slug)?.title ?? slug ?? "Funnies";
}
