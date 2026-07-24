import { presentsSeries, workshopPrograms } from "@/data/site-hierarchy";

export type NavLink = { label: string; href: string; children?: NavLink[] };

export const topNavLinks: NavLink[] = [
  { label: "Articles", href: "/articles/" },
  {
    label: "Presents",
    href: "/departments/hobfarm-presents/",
    children: [
      ...presentsSeries.map((entry) => ({ label: entry.shortName ?? entry.name, href: entry.href })),
      { label: "View all Presents", href: "/departments/hobfarm-presents/" },
      { label: "Departments directory", href: "/departments/" },
    ],
  },
  {
    label: "Workshop",
    href: "/workshop/",
    children: [
      ...workshopPrograms.map((entry) => ({ label: entry.name, href: entry.href })),
      { label: "View all Workshop", href: "/workshop/" },
      { label: "Departments directory", href: "/departments/" },
    ],
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
      { label: "HobFarm Presents", href: "/departments/hobfarm-presents/" },
      { label: "Magazine Time Machine", href: "/departments/magazine-time-machine/" },
      { label: "3DM", href: "/departments/hobfarm-presents/3-degrees-of-dick-miller/" },
      { label: "Other Alice", href: "/departments/hobfarm-presents/other-alice-adventures/" },
      { label: "Funnies", href: "/departments/funnies/" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Workshop", href: "/workshop/" },
      ...workshopPrograms.slice(0, 5).map((entry) => ({ label: entry.name, href: entry.href })),
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
      { label: "Departments", href: "/departments/" },
      { label: "About", href: "/about/" },
      { label: "Customer Help", href: "/helpcenter/" },
      { label: "Terms", href: "/legal/terms/" },
      { label: "Privacy", href: "/legal/privacy/" },
      { label: "Refunds", href: "/legal/refunds/" },
    ],
  },
];
