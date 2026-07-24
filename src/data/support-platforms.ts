export type SupportPlatform = {
  id: "kofi" | "hobfarm" | "shop" | "academy";
  name: string;
  eyebrow: string;
  description: string;
  href: string;
  cta: string;
  external: boolean;
  accent: string;
};

export const supportPlatforms: SupportPlatform[] = [
  {
    id: "kofi",
    name: "Support once on Ko-fi",
    eyebrow: "One-time support",
    description:
      "Make a one-time contribution without starting a recurring membership.",
    href: "https://ko-fi.com/hobfarm/",
    cta: "Support once",
    external: true,
    accent: "#ff5e5b",
  },
  {
    id: "hobfarm",
    name: "Become a HobFarm supporter",
    eyebrow: "$5 monthly membership",
    description:
      "Use the on-site membership to contribute $5 a month. Current Avatar course access remains in place while its migration is reviewed.",
    href: "/membership/",
    cta: "Become a supporter",
    external: false,
    accent: "#2fe089",
  },
  {
    id: "shop",
    name: "Buy something from the Shop",
    eyebrow: "Storefront directory",
    description:
      "Choose the right shelf for merchandise, character assets, craft files, or one-off physical objects.",
    href: "/shop/",
    cta: "Browse the Shop",
    external: false,
    accent: "#f24da6",
  },
  {
    id: "academy",
    name: "Take a course",
    eyebrow: "Free and one-time courses",
    description:
      "Learn a practical workflow through the Academy catalog. Courses are free or priced as affordable one-time purchases.",
    href: "/academy/",
    cta: "Browse Academy",
    external: false,
    accent: "#19e3e3",
  },
];
