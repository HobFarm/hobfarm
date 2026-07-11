import { storySeries, storySeriesPath } from "@/data/story-series";

export type PresentsTitle = {
  id: string;
  slug: string;
  shortTitle: string;
  title: string;
  typeLabel: string;
  description: string;
  image: string;
  imageAlt: string;
  theme: "wonderland" | "3dm";
  status: "active" | "planned" | "complete";
  featured: boolean;
  href: string;
};

export const THREE_DM_SLUG = "3-degrees-of-dick-miller";
export const THREE_DM_PATH = `/departments/hobfarm-presents/${THREE_DM_SLUG}/`;
export const THREE_DM_GPT_URL = "https://chatgpt.com/g/g-682afb75dd04819189c82970670f6f7e-3-degrees-of-miller-3dm";
export const THREE_DM_CDN_LOGO = "https://cdn.hob.farm/3dm/3dm-logo.png";
export const THREE_DM_LOGO = THREE_DM_CDN_LOGO;

const otherAlice = storySeries.find((series) => series.slug === "other-alice-adventures");

export const presentsTitles: PresentsTitle[] = [
  ...(otherAlice
    ? [
        {
          id: "other-alice",
          slug: otherAlice.slug,
          shortTitle: "Other Alice",
          title: otherAlice.title,
          typeLabel: "Illustrated Fiction",
          description: otherAlice.logline,
          image: otherAlice.cover,
          imageAlt: otherAlice.coverAlt ?? otherAlice.title,
          theme: "wonderland" as const,
          status: otherAlice.status,
          featured: true,
          href: storySeriesPath(otherAlice.slug),
        },
      ]
    : []),
  {
    id: "3dm",
    slug: THREE_DM_SLUG,
    shortTitle: "3DM",
    title: "3 Degrees of Dick Miller",
    typeLabel: "Film History",
    description:
      "A movie-connection game, cult-cinema research project, and guided tour through the hidden wiring of Hollywood.",
    image: THREE_DM_LOGO,
    imageAlt: "3 Degrees of Dick Miller vintage badge logo",
    theme: "3dm",
    status: "active",
    featured: true,
    href: THREE_DM_PATH,
  },
];

export function getPresentsTitle(idOrSlug: string): PresentsTitle | undefined {
  return presentsTitles.find((title) => title.id === idOrSlug || title.slug === idOrSlug);
}

export function getActivePresentsTitles(): PresentsTitle[] {
  return presentsTitles.filter((title) => title.status === "active");
}

export function presentsTitlePath(idOrSlug: string): string {
  return getPresentsTitle(idOrSlug)?.href ?? `/departments/hobfarm-presents/${idOrSlug}/`;
}
