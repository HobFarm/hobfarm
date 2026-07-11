export type SupportPlatform = {
  id: "hobfarm" | "kofi" | "patreon";
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
    id: "hobfarm",
    name: "HobFarm Club",
    eyebrow: "On-site membership",
    description:
      "Join through HobFarm for account-based access, member updates, and the paid learning paths that will live here.",
    href: "/membership/",
    cta: "Join on HobFarm",
    external: false,
    accent: "#2fe089",
  },
  {
    id: "kofi",
    name: "Ko-fi",
    eyebrow: "Tips, commissions, and small drops",
    description:
      "Use Ko-fi for one-time support, commission requests, and selected digital or creative drops.",
    href: "https://ko-fi.com/hobfarm/",
    cta: "Support on Ko-fi",
    external: true,
    accent: "#ff5e5b",
  },
  {
    id: "patreon",
    name: "Patreon",
    eyebrow: "External membership community",
    description:
      "Follow or support HobFarm on Patreon as an alternate community path. Patreon access remains separate from HobFarm accounts.",
    href: "https://www.patreon.com/hobfarm",
    cta: "Visit Patreon",
    external: true,
    accent: "#ff424d",
  },
];
