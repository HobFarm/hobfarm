export type StorefrontId = "etsy" | "deviantart" | "ebay";

export type StorefrontStatus = "active" | "rebuilding" | "pending" | "hidden";

export interface Storefront {
  id: StorefrontId;
  name: string;
  label: string;
  description: string;
  status: StorefrontStatus;
  statusLabel: string;
  href?: string;
  cta?: string;
  accent: string;
}

const marketplaceStorefronts: Storefront[] = [
  {
    id: "etsy",
    name: "Etsy",
    label: "Digital packs",
    description:
      "Reusable themed files, clip art, backgrounds, textures, printable elements, scrapbook material, seasonal sets, and rebuilt archive packs.",
    status: "rebuilding",
    statusLabel: "Rebuilding the archive",
    href: "https://www.etsy.com/shop/hobfarm",
    cta: "View HobFarm on Etsy",
    accent: "#f1641e",
  },
  {
    id: "deviantart",
    name: "DeviantArt",
    label: "Characters and visual worlds",
    description:
      "Character sheets, outfits, scenes, visual worlds, wallpapers, adoptables, exclusives, collector downloads, and selected EZ releases when those releases actually exist.",
    status: "active",
    statusLabel: "HobFarm profile",
    href: "https://www.deviantart.com/hobfarm",
    cta: "Browse HobFarm on DeviantArt",
    accent: "#05cc47",
  },
  {
    id: "ebay",
    name: "eBay",
    label: "One-off physical inventory",
    description:
      "Books, media, collectibles, equipment, antiques, and other counted objects sold one at a time.",
    status: "active",
    statusLabel: "Storefront live",
    href: "https://www.ebay.com/usr/hobfarm",
    cta: "Browse HobFarm on eBay",
    accent: "#e53238",
  },
];

export const storefronts = marketplaceStorefronts.filter(
  (storefront) => storefront.status !== "hidden",
);

export function storefrontHasCta(
  storefront: Storefront,
): storefront is Storefront & Required<Pick<Storefront, "href" | "cta">> {
  return (
    (storefront.status === "active" || storefront.status === "rebuilding") &&
    Boolean(storefront.href && storefront.cta)
  );
}
