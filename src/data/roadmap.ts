export interface RoadmapItem {
  name: string;
  description: string;
  href?: string;
}

export const live: RoadmapItem[] = [
  {
    name: "StyleFusion",
    description:
      "Multi-provider image generation, free with a HobFarm account",
  },
  {
    name: "Grimoire",
    description: "The knowledge layer underneath the tools",
  },
  {
    name: "Visuals",
    description: "Finished pieces and build notes",
    href: "/gallery",
  },
  {
    name: "Shop",
    description: "Desk mats, digital sticker packs, drinkware, handmade clay, and vintage finds",
    href: "/shop/",
  },
  {
    name: "Membership",
    description:
      "Optional supporter tier that helps cover infrastructure and tool work",
    href: "/membership/",
  },
];

export const inDevelopment: RoadmapItem[] = [
  {
    name: "HobFarm TV",
    description:
      "Original programs in production: Magazine Time Machine and 3 Degrees of Dick Miller",
    href: "/projects/hobfarm-tv/",
  },
  {
    name: "HobFarm Academy",
    description: "Courses that teach the method: free intro, paid depth, then hire",
  },
  {
    name: "Drifter",
    description: "Frame-iterative video generation with audio sync",
  },
  {
    name: "XKXXKX",
    description: "Procedural interactive fiction engine",
  },
  {
    name: "AnomalyBot",
    description: "Pattern detection for noisy data streams",
  },
];

export const planned: RoadmapItem[] = [
  {
    name: "The BASS Show",
    description: "Buying And Selling Shit Show: the resale, flipping, and auction-finds side of HobFarm as a HobFarm TV format",
  },
  {
    name: "Public Grimoire Browser",
    description: "Graph explorer for the knowledge layer, separate from the tools",
  },
  {
    name: "StyleFusion Video and Image Suites",
    description: "Multi-provider generation and post-generation editing",
  },
  {
    name: "Open-Source Fusion Engine SDK",
    description: "Public SDK for the Fusion Engine architecture",
  },
  {
    name: "Training and licensing",
    description: "Licensing the method behind the work",
  },
];
