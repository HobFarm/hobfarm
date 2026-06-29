// Single source of truth for HobFarm's editorial departments: the recurring
// magazine sections content is filed under. Every surface (schema enum, article
// consumers, department routes, nav, redirects) resolves filing through here so
// the taxonomy can never drift across pages again.
//
// `resolveDepartment` maps legacy category/department slugs onto the canonical
// set, so old frontmatter and old URLs keep working without rewrites.

export type DepartmentNavHub =
  | "Articles"
  | "Gallery"
  | "Video"
  | "Characters"
  | "Workshop";

// Visibility status. `active` departments are launched and can appear publicly.
// `planned` ones stay routable and usable internally (the page still generates)
// but are kept off the homepage and Departments hub until launched. `hidden`
// ones are suppressed from all public lists. Nothing is deleted: planned/hidden
// departments keep their definitions, routes, aliases, redirects, and copy.
export type DepartmentStatus = "active" | "planned" | "hidden";

export type Department = {
  slug: string;
  label: string;
  /** Short description used on cards, strips, and compact lists. */
  blurb: string;
  /** Optional landing-page intro paragraphs. Falls back to `blurb`. */
  intro?: string[];
  /** Optional page/social meta description. Falls back to `blurb`. */
  metaDescription?: string;
  /** Hex accent, applied inline so it survives Tailwind's purge. */
  accent: string;
  /** CDN hero artwork used on department cards and landing pages. */
  heroImage?: string;
  /** Which top-nav hub primarily surfaces this department. */
  navHub: DepartmentNavHub;
  /** Defaults to "active" when omitted. */
  status?: DepartmentStatus;
  /** Override: show a homepage strip. Defaults to status === "active". */
  showOnHomepage?: boolean;
  /** Override: show in the Departments hub + homepage grid. Defaults to active. */
  showInDepartmentHub?: boolean;
  /** Override: surface in nav contexts. Defaults to status !== "hidden". */
  showInNav?: boolean;
  /** Render a homepage strip even with zero published entries. Defaults false. */
  showWhenEmpty?: boolean;
};

export const departments: Department[] = [
  {
    slug: "magazine-time-machine",
    label: "Magazine Time Machine",
    blurb:
      "Old magazines, vintage advertisements, dead futures, then-versus-now research, and cultural artifacts that still have something weirdly useful stuck to them.",
    intro: [
      "Magazine Time Machine digs through old magazines, advertisements, articles, photos, predictions, gadgets, trends, and cultural leftovers to see what they turned into.",
      "Some pieces compare then and now. Some follow dead futures that never arrived. Some look at how people used to sell, explain, fear, desire, decorate, or misunderstand the world. Sometimes the old page is the whole story. Sometimes it is just the trapdoor.",
      "Open an artifact, follow the thread, see where it lands.",
    ],
    metaDescription:
      "Magazine Time Machine collects old magazine artifacts, vintage advertisements, dead futures, then-versus-now comparisons, and cultural research from the HobFarm archive.",
    accent: "#e0b13c",
    heroImage: "https://cdn.hob.farm/hero-images/magazine-time-machine-hero.png",
    navHub: "Articles",
  },
  {
    slug: "wtfacts",
    label: "WTFacts?",
    blurb:
      "What The Facts? Reactions to the dumb and weird things online, told as a joke with the receipt attached.",
    accent: "#e23a4e",
    navHub: "Articles",
    status: "planned",
  },
  {
    slug: "satire",
    label: "Commercial Satire",
    blurb:
      "Ad parodies, satirical magazine ads, spoof advertisements, imaginary advertisements, parody images, mock editorials, and magazine-inspired visual humor from HobFarm.",
    accent: "#e0218a",
    navHub: "Articles",
    status: "planned",
  },
  {
    slug: "picture-stories",
    label: "Picture Stories",
    blurb:
      "Staged image sequences, captioned scenes, photo-comic layouts, fictional stills, and visual narrative jokes.",
    accent: "#19e3e3",
    navHub: "Articles",
    status: "planned",
  },
  {
    slug: "funnies",
    label: "Funnies",
    blurb:
      "HobFarm comics, cartoons, single-panel gags, strips, recurring character bits, and bad decisions involving Gary, Fat Cat, Larry, Buffcock, Hobunny, Gothcat, and whoever else wanders into frame.",
    accent: "#2fe089",
    heroImage: "https://cdn.hob.farm/hero-images/funnies-hero.png",
    navHub: "Characters",
  },
  {
    slug: "cute-corrupted",
    label: "Cute & Corrupted",
    blurb:
      "The cute-to-corrupted transformation series across characters, critters, and cakes.",
    accent: "#f24da6",
    heroImage: "https://cdn.hob.farm/hero-images/cute-corrupted-hero.png",
    navHub: "Characters",
  },
  {
    slug: "before-after-eras",
    label: "Before & After Eras",
    blurb:
      "Before and after, juxtapositions, and era comparisons that put two timelines side by side.",
    accent: "#55d7ff",
    heroImage: "https://cdn.hob.farm/hero-images/before-after-hero.png",
    navHub: "Gallery",
  },
  {
    slug: "critter-feed",
    label: "Critter Feed",
    blurb: "The ongoing critter character world and its running cast of small monsters.",
    accent: "#5cf0a6",
    navHub: "Characters",
    status: "planned",
  },
  {
    slug: "hobfarm-presents",
    label: "HobFarm Presents",
    blurb:
      "Trailers, short videos, parody promos, avatar bits, animated posters, and story-world video features.",
    accent: "#7b2ff7",
    heroImage: "https://cdn.hob.farm/hero-images/hobfarm-presents-hero.png",
    navHub: "Video",
  },
  {
    slug: "workshop-notes",
    label: "Workshop Notes",
    blurb:
      "Production notes, tool tests, how-tos, model handoffs, and the process behind the work, plus shop, academy, and services.",
    accent: "#3b6fe0",
    heroImage: "https://cdn.hob.farm/hero-images/workshop-hero.png",
    navHub: "Workshop",
  },
  {
    slug: "essays-arguments",
    label: "Essays & Arguments",
    blurb:
      "Essays, arguments, manifestos, cultural criticism, art-history threads, media analysis, and opinion pieces from the HobFarm side of the fence.",
    accent: "#c8c6d4",
    heroImage: "https://cdn.hob.farm/hero-images/essay-hero.png",
    navHub: "Articles",
  },
];

// Legacy category/department slugs -> canonical department slug. Keeps old
// frontmatter and old URLs resolving. `cultural-thread` now defaults to Essays
// & Arguments; genuine how-to/process pieces carry an explicit Workshop Notes
// department in frontmatter.
export const departmentAliases: Record<string, string> = {
  technical: "workshop-notes",
  research: "workshop-notes",
  grimoire: "workshop-notes",
  stylefusion: "workshop-notes",
  hobbot: "workshop-notes",
  business: "workshop-notes",
  // cultural-thread now defaults to the Essays & Arguments desk. The genuine
  // how-to/process pieces that were cultural-thread carry an explicit
  // `department: workshop-notes` in frontmatter, so they stay put.
  "cultural-thread": "essays-arguments",
  essay: "essays-arguments",
  essays: "essays-arguments",
  argument: "essays-arguments",
  arguments: "essays-arguments",
  editorial: "essays-arguments",
  opinion: "essays-arguments",
  manifesto: "essays-arguments",
  culture: "essays-arguments",
  "cultural-criticism": "essays-arguments",
  "cultural criticism": "essays-arguments",
  "art-history": "essays-arguments",
  "art history": "essays-arguments",
  "media-criticism": "essays-arguments",
  "media criticism": "essays-arguments",
  criticism: "essays-arguments",
  "fake-ads": "satire",
  "before-after": "before-after-eras",
  // The comics desk was renamed funny-pages -> funnies; legacy slugs resolve.
  "funny-pages": "funnies",
  "the-funny-pages": "funnies",
  "funny pages": "funnies",
  comics: "funnies",
  cartoons: "funnies",
  "character-department": "funnies",
  "archive-remix": "magazine-time-machine",
  "dead-future-report": "magazine-time-machine",
  "3-degrees-of-dick-miller": "hobfarm-presents",
};

const departmentBySlug = new Map(departments.map((d) => [d.slug, d]));

/** Canonical department slug for any legacy or canonical input. */
export function resolveDepartment(slug: string | undefined | null): string | undefined {
  if (!slug) return undefined;
  if (departmentBySlug.has(slug)) return slug;
  return departmentAliases[slug] ?? slug;
}

export function getDepartment(slug: string | undefined | null): Department | undefined {
  const canonical = resolveDepartment(slug);
  return canonical ? departmentBySlug.get(canonical) : undefined;
}

export function getDepartmentLabel(slug: string | undefined | null): string {
  const dep = getDepartment(slug);
  if (dep) return dep.label;
  return slug ?? "Feature";
}

export function departmentPath(slug: string): string {
  return `/departments/${resolveDepartment(slug) ?? slug}/`;
}

// --- Visibility layer -------------------------------------------------------
// All accessors apply sensible defaults so most departments only need a single
// `status` field. Empty-vs-content checks live in the components (they need to
// query collections); these helpers only read the static visibility flags.

export function departmentStatus(d: Department): DepartmentStatus {
  return d.status ?? "active";
}

export function departmentShowsOnHomepage(d: Department): boolean {
  return d.showOnHomepage ?? departmentStatus(d) === "active";
}

export function departmentShowsInHub(d: Department): boolean {
  return d.showInDepartmentHub ?? departmentStatus(d) === "active";
}

export function departmentShowsInNav(d: Department): boolean {
  return d.showInNav ?? departmentStatus(d) !== "hidden";
}

export function departmentShowsWhenEmpty(d: Department): boolean {
  return d.showWhenEmpty ?? false;
}

/** Departments that may appear in the Departments hub + homepage grid. */
export const hubDepartments = departments.filter(departmentShowsInHub);
/** Departments allowed a homepage strip (still gated on content in the UI). */
export const homepageStripDepartments = departments.filter(departmentShowsOnHomepage);

// Filter list for sidebar/chips: "All" plus the publicly visible departments.
// Planned/hidden departments are kept out of public browsing here too.
export type DepartmentFilter = { value: string; label: string };
export const departmentFilters: DepartmentFilter[] = [
  { value: "all", label: "All" },
  ...hubDepartments.map((d) => ({ value: d.slug, label: d.label })),
];

// Canonical slug list, handy for schema enums and getStaticPaths.
export const departmentSlugs = departments.map((d) => d.slug);

// Gallery `type` -> department fallback, used only when a gallery entry has no
// explicit `department` set. Only types with a clear editorial home are mapped.
export const galleryTypeToDepartment: Record<string, string> = {
  "before-and-after": "before-after-eras",
  "cute-corrupted": "cute-corrupted",
  "character-dev": "funnies",
  "video-workflow": "hobfarm-presents",
};
