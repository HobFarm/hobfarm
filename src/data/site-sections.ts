export type SiteSection = {
  number: string;
  label: string;
  kicker: string;
  description: string;
  href: string;
  action: string;
  accent: string;
  image?: string;
  imageAlt?: string;
  featured?: boolean;
};

export const siteSections: SiteSection[] = [
  {
    number: "01",
    label: "HobFarm Presents",
    kicker: "Original series, films, and story worlds",
    description:
      "Enter Other Alice Adventures, 3 Degrees of Dick Miller, and the illustrated fiction, film-history series, video essays, and moving scenes arriving next.",
    href: "/presents/",
    action: "Enter Presents",
    accent: "#a06bff",
    image: "https://cdn.hob.farm/hero-images/hobfarm-presents-hero.png",
    imageAlt: "A collage representing HobFarm Presents stories and films",
    featured: true,
  },
  {
    number: "02",
    label: "Funnies",
    kicker: "Cartoons, strips, and recurring characters",
    description:
      "Read Buffcock, Larry, Gary, the Farm cartoons, and the rest of the cast as they wander into panels, strips, and animated trouble.",
    href: "/presents/funnies/",
    action: "Read the Funnies",
    accent: "#5cf0a6",
    image: "https://cdn.hob.farm/hero-images/funnies-hero.png",
    imageAlt: "Characters from the HobFarm Funnies",
    featured: true,
  },
  {
    number: "03",
    label: "Workshop",
    kicker: "Process, experiments, and production notes",
    description:
      "See how the images, videos, characters, sites, and story systems get made. The useful tests and failed attempts stay in the record.",
    href: "/workshop/",
    action: "Open the Workshop",
    accent: "#6b93ed",
  },
  {
    number: "04",
    label: "Academy",
    kicker: "Packages you can use to repeat the process",
    description:
      "Learn the working method through courses, templates, prompts, reference files, and production systems built from real HobFarm projects.",
    href: "/academy/",
    action: "Visit the Academy",
    accent: "#19e3e3",
  },
  {
    number: "05",
    label: "Shop",
    kicker: "Finished media, packs, and custom work",
    description:
      "Get the finished thing: images, two-packs, character sheets, hero shots, posters, videos, commissions, and custom pieces.",
    href: "/shop/",
    action: "Browse the Shop",
    accent: "#f24da6",
  },
];

export const formatLinks = [
  { label: "Articles", href: "/articles/", note: "Read" },
  { label: "Gallery", href: "/gallery/", note: "Look" },
  { label: "Characters", href: "/characters/", note: "Meet" },
  { label: "Video", href: "/video/", note: "Watch" },
  { label: "Support", href: "/support/", note: "Join" },
] as const;
