// Comic series definitions for the Funnies section. Three series: Larry, Gary,
// and Buffcock. Individual comics (src/content/comics) reference a series by
// slug. This is the source of truth for series titles, premises, and which
// characters star, so /presents/funnies/ and its series pages all read from one
// place. Comic membership and counts are derived from the comics collection at
// build time, not stored here.

export type ComicSeries = {
  slug: string;
  title: string;
  /** Character slugs (into src/data/characters.ts) that star in this series. */
  characters: string[];
  premise: string;
  /** Short label shown on series cards. */
  formatBadge?: string;
  /** Shorter card blurb when the detail-page premise is longer. */
  shortBlurb?: string;
  /** SEO override for the series detail route. */
  seoDescription?: string;
  /** Hero deck for the series detail route. */
  deck?: string;
  /** Optional CDN hero image for the series detail route. */
  heroImage?: string;
  heroImageAlt?: string;
  /** Public explanatory copy for richer series pages. */
  intro?: string[];
  engine?: string[];
  world?: {
    title: string;
    paragraphs: string[];
  };
  supportingCast?: {
    name: string;
    slug?: string;
    description: string;
  }[];
  /** Optional CDN thumbnail for the series card. */
  thumbnail?: string;
};

export const comicSeries: ComicSeries[] = [
  {
    slug: "larry",
    title: "Larry Cartoons",
    characters: ["larry", "gothcat", "helmut", "heidi"],
    premise:
      "Black-and-white single-panel cartoons about Larry, a retired Prussian dachshund officer reacting with antique disgust to cabaret culture, early show business, modern machines, and everyday nonsense.",
    shortBlurb:
      "Larry is what happens when a retired dachshund officer applies parade-ground standards to show business, modern life, and machines with buttons.",
    formatBadge: "1:1 ink cartoon",
    seoDescription:
      "Black-and-white single-panel cartoons about Larry, a retired Prussian dachshund officer reacting with antique disgust to cabaret culture, early show business, modern machines, and everyday nonsense.",
    deck: "A dachshund officer, a permanent glare, and a world that keeps failing inspection.",
    heroImage: "https://cdn.hob.farm/funnies/larry/larry-hero.png",
    heroImageAlt: "Larry, a Prussian dachshund officer, in an antique black-and-white cartoon portrait.",
    thumbnail: "https://cdn.hob.farm/funnies/larry/larry-hero.png",
    intro: [
      "Larry Cartoons are black-and-white single-panel cartoons drawn like antique newspaper engravings. The panels use aged paper, dense crosshatching, dry composition, and the stiff visual authority of an old printed gag that has been sitting in a drawer since 1930.",
      "Larry is a retired Prussian officer in dachshund form. He appears from the waist up, usually blocked by a counter, table, podium, paperwork, machine, or other foreground object that hides his long body. He wears the full uniform, the helmet, the medals, the mustache, and the expression of a man who has just discovered another civilization-ending inconvenience.",
    ],
    engine: [
      "Larry encounters something loose, commercial, sentimental, automated, informal, over-designed, under-disciplined, or insufficiently Prussian.",
      "He disapproves.",
      "That is usually the whole joke.",
      "The setting changes, but Larry does not. He brings antique standards to cabaret acts, theater lobbies, early sound cinema, hotel counters, modern drive-thrus, QR-code menus, streaming platforms, AI tools, self-checkout kiosks, Vegas signage, and any machine that expects him to press continue.",
    ],
    world: {
      title: "The period world",
      paragraphs: [
        "Larry's period cartoons live inside a 1929 to 1931 entertainment-culture window: cabarets, early talkies, late silent-era show business, cafes, dressing rooms, publicity photos, hotel lobbies, record counters, and old magazine cartoon spaces.",
        "The world is theatrical, stylish, and slightly improper. Larry is rigid, formal, and privately appalled. That tension is the point.",
      ],
    },
    supportingCast: [
      {
        name: "Gothcat",
        slug: "gothcat",
        description:
          "Gothcat is a cabaret performer and pre-Code actress type with sharp brows, dark glamour, cat ears, gloves, satin, lace, feathers, crescent jewelry, and complete control of the room. Larry claims to disapprove of her act. He also keeps returning.",
      },
      {
        name: "Helmut",
        slug: "helmut",
        description:
          "Helmut is Larry's German Shepherd companion. He is loyal, expressive, enthusiastic, and usually responsible for pulling Larry into situations Larry would have preferred to judge from a distance.",
      },
      {
        name: "Heidi",
        slug: "heidi",
        description:
          "Heidi is Helmut's white Pomeranian girlfriend. She is tiny, fluffy, dramatic, socially powerful, and much more charming than Larry would like.",
      },
    ],
  },
  {
    slug: "buffcock",
    title: "Buffcock",
    characters: ["buffcock", "cs"],
    premise:
      "A recurring single-panel cartoon series about Buffcock, a smug rooster-man with a martini, CS on a red mobility scooter, and public chaos that somehow becomes a customer support problem.",
    shortBlurb:
      "Buffcock turns ordinary places into public incidents, then lets customer support absorb the blast radius.",
    formatBadge: "3:2 color gag panel",
  },
  {
    slug: "gary",
    title: "Gary Cartoons",
    characters: ["gary", "fat-cat"],
    premise:
      "Retro single-panel newspaper comics about Gary, a deadpan guinea pig person living a normal human life with errands, work, phones, meetings, minor defeat, and Fat Cat's dramatic overreactions.",
    shortBlurb:
      "Gary is a guinea pig person trying to survive normal human life. Fat Cat is there to make it worse with confidence.",
    formatBadge: "1:1 retro comic",
  },
];

const seriesBySlug = new Map(comicSeries.map((s) => [s.slug, s]));

export function getComicSeries(slug: string | undefined | null): ComicSeries | undefined {
  return slug ? seriesBySlug.get(slug) : undefined;
}

export function seriesPath(slug: string): string {
  return `/presents/funnies/${slug}/`;
}

export function getSeriesTitle(slug: string | undefined | null): string {
  return getComicSeries(slug)?.title ?? slug ?? "Funnies";
}
