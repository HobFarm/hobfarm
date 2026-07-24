export type StorefrontId =
  | "hobfarm"
  | "etsy"
  | "deviantart"
  | "ebay"
  | "academy"
  | "kofi";

export interface Storefront {
  id: StorefrontId;
  name: string;
  eyebrow: string;
  description: string;
  inventory: string[];
  status: string;
  href?: string;
  cta?: string;
  external: boolean;
  accent: string;
}

export const storefronts: Storefront[] = [
  {
    id: "hobfarm",
    name: "Made by HobFarm",
    eyebrow: "Direct merchandise",
    description:
      "The Melting Rabbit Hole Dad Hat is the first direct Printful product. Its store record, two colors, $24.99 price, and U.S. shipping rule are verified. Checkout stays closed until the sample and fulfillment rehearsal pass.",
    inventory: [
      "Melting Rabbit Hole Dad Hat — Black and Dark Grey",
      "Future approved Printful clothing and accessories",
    ],
    status: "First product staged",
    href: "/shop/melting-rabbit-hole-dad-hat/",
    cta: "Review the hat",
    external: false,
    accent: "#f24da6",
  },
  {
    id: "etsy",
    name: "Etsy",
    eyebrow: "Craft and printable shelf",
    description:
      "Etsy holds craft files, clip art, scrapbook material, printables, seasonal sets, and archive packs.",
    inventory: ["Craft files", "Clip art", "Scrapbook packs", "Printables", "Seasonal and archive packs"],
    status: "External storefront",
    href: "https://www.etsy.com/shop/hobfarm",
    cta: "Visit HobFarm on Etsy",
    external: true,
    accent: "#f1641e",
  },
  {
    id: "deviantart",
    name: "DeviantArt",
    eyebrow: "Character and collector shelf",
    description:
      "DeviantArt holds mannequins, character sheets, outfits, wallpapers, premium packs, adoptables, and exclusives.",
    inventory: ["Mannequins", "Character sheets and outfits", "Wallpapers", "Premium packs", "Adoptables and exclusives"],
    status: "External storefront",
    href: "https://www.deviantart.com/hobfarm",
    cta: "Browse HobFarm on DeviantArt",
    external: true,
    accent: "#05cc47",
  },
  {
    id: "ebay",
    name: "eBay",
    eyebrow: "One-off physical shelf",
    description:
      "eBay is reserved for counted physical inventory: DVDs, books, magazines, antiques, collectibles, and other one-off objects.",
    inventory: ["DVDs and books", "Magazines", "Antiques", "Collectibles", "One-off physical objects"],
    status: "Store link pending real inventory",
    external: true,
    accent: "#e53238",
  },
  {
    id: "academy",
    name: "Academy",
    eyebrow: "Courses",
    description:
      "Academy is the HobFarm catalog for practical free and affordable one-time courses.",
    inventory: ["Free public courses", "$5, $7, and $9 courses", "Course bundles when several lessons belong together"],
    status: "Course catalog",
    href: "/academy/",
    cta: "Browse Academy",
    external: false,
    accent: "#19e3e3",
  },
  {
    id: "kofi",
    name: "Ko-fi",
    eyebrow: "One-time reader support",
    description:
      "Ko-fi has one job: accepting a one-time contribution from readers who want to help fund the next piece of work.",
    inventory: ["One-time support"],
    status: "External support page",
    href: "https://ko-fi.com/hobfarm/",
    cta: "Support once on Ko-fi",
    external: true,
    accent: "#ff5e5b",
  },
];
