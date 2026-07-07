// Single source of truth for site navigation.
// `topNavLinks` is consumed by Navigation.astro, which passes it straight to
// MobileNav (a dumb { label, href }[] consumer). `footerLinkGroups` is consumed
// by Footer.astro. Social links stay in Footer (separate concern).

export type NavLink = { label: string; href: string };

// Magazine front-of-book nav. Home is the logo. Search + Account are appended in
// Navigation.astro (not links). Gallery/Video/Characters are demoted to archive
// views reachable from the footer; the top bar routes to the durable buckets:
// Articles, Departments, Workshop (the studio umbrella), Shop, Support.
export const topNavLinks: NavLink[] = [
  { label: "Articles", href: "/articles" },
  { label: "Departments", href: "/departments" },
  { label: "Workshop", href: "/workshop" },
  { label: "Shop", href: "/shop" },
  { label: "Support", href: "/support" },
];

export type FooterGroup = { title: string; links: NavLink[] };

export const footerLinkGroups: FooterGroup[] = [
  {
    title: "Explore",
    links: [
      { label: "Articles", href: "/articles" },
      { label: "Departments", href: "/departments" },
      { label: "Visual Systems", href: "/visual-systems" },
      // Archive/index views: the work's real home is a department, visual
      // system, project, or workshop note — these are filtered browse surfaces.
      { label: "Gallery Archive", href: "/gallery" },
      { label: "Video Archive", href: "/video" },
      { label: "Character Index", href: "/characters" },
    ],
  },
  {
    title: "Workshop",
    links: [
      { label: "Workshop Notes", href: "/workshop" },
      { label: "Shop", href: "/shop/" },
      { label: "Academy", href: "/academy/" },
      { label: "Services", href: "/services/" },
      { label: "Grimoire", href: "/grimoire" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Support", href: "/support/" },
      { label: "Help Center", href: "/helpcenter" },
      { label: "Changelog", href: "/changelog" },
      { label: "Whitepaper", href: "/whitepaper" },
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
