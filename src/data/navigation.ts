// Single source of truth for site navigation.
// `topNavLinks` is consumed by Navigation.astro, which passes it straight to
// MobileNav (a dumb { label, href }[] consumer). `footerLinkGroups` is consumed
// by Footer.astro. Social links stay in Footer (separate concern).

export type NavLink = { label: string; href: string };

export const topNavLinks: NavLink[] = [
  { label: "Projects", href: "/projects" },
  { label: "Visuals", href: "/gallery" },
  { label: "Academy", href: "/academy" },
  { label: "Shop", href: "/shop" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export type FooterGroup = { title: string; links: NavLink[] };

export const footerLinkGroups: FooterGroup[] = [
  {
    title: "Explore",
    links: [
      { label: "Projects", href: "/projects" },
      { label: "Visuals", href: "/gallery" },
      { label: "Grimoire", href: "/grimoire" },
      { label: "Academy", href: "/academy" },
      { label: "Shop", href: "/shop/" },
      { label: "Services", href: "/services/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Whitepaper", href: "/whitepaper" },
      { label: "Support", href: "/support/" },
      { label: "Help Center", href: "/helpcenter" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Membership", href: "/membership/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/legal/terms/" },
      { label: "Privacy", href: "/legal/privacy/" },
      { label: "Refunds", href: "/legal/refunds/" },
    ],
  },
];
