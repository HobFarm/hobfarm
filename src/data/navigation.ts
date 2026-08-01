import { presentsSeries, workshopPrograms } from "@/data/site-hierarchy";

export type NavLink = { label: string; href: string; children?: NavLink[] };

const visibleWorkshopPrograms = workshopPrograms.filter((entry) => entry.inNav !== false);

export const topNavLinks: NavLink[] = [
  { label: "Articles", href: "/articles/" },
  {
    label: "Presents",
    href: "/presents/",
    children: presentsSeries.map((entry) => ({ label: entry.shortName ?? entry.name, href: entry.href })),
  },
  {
    label: "Workshop",
    href: "/workshop/",
    children: visibleWorkshopPrograms.map((entry) => ({ label: entry.name, href: entry.href })),
  },
  { label: "Academy", href: "/academy/" },
  { label: "Shop", href: "/shop/" },
  { label: "About", href: "/about/" },
];

export type FooterGroup = { title: string; links: NavLink[] };

export const footerLinkGroups: FooterGroup[] = [
  {
    title: "Read",
    links: [
      { label: "Articles", href: "/articles/" },
      { label: "HobFarm Presents", href: "/presents/" },
      { label: "Magazine Time Machine", href: "/presents/magazine-time-machine/" },
      { label: "3DM", href: "/presents/3-degrees-of-dick-miller/" },
      { label: "Other Alice", href: "/presents/other-alice-adventures/" },
      { label: "Funnies", href: "/presents/funnies/" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Workshop", href: "/workshop/" },
      ...visibleWorkshopPrograms.map((entry) => ({ label: entry.name, href: entry.href })),
      { label: "Academy", href: "/academy/" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { label: "Shop", href: "/shop/" },
      { label: "Support HobFarm", href: "/support/" },
      { label: "Contribute", href: "/contact/?subject=contribute" },
      { label: "Contact", href: "/contact/" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "About", href: "/about/" },
      { label: "Customer Help", href: "/helpcenter/" },
      { label: "Terms", href: "/legal/terms/" },
      { label: "Privacy", href: "/legal/privacy/" },
      { label: "Refunds", href: "/legal/refunds/" },
    ],
  },
];
