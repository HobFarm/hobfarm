// Visual systems: the studio "engine" records that power the showroom.
//
// A visual system is a repeatable production pipeline: a base mannequin gets an
// aesthetic rule set, then turns into character variants, media packets
// (poster / hero / teaser video / sheet previews), showroom pages, asset-store
// drops, and workshop/course material. This file is the source of truth,
// mirroring the flat-data pattern of src/data/departments.ts and characters.ts.
//
// PAID-ASSET SAFETY: media are stored as {folder,file} references only. The
// components render them exclusively through the capped helpers in
// src/lib/gallery.ts (mediaImageUrl / previewImageUrl), so a full-resolution
// `-hd` sheet is physically never emitted at full size, and sheet previews are
// not lightbox-accessible. See src/data/asset-policy.ts.

export type VisualSystemStatus = "active" | "planned" | "hidden";

export interface AssetRef {
  folder: string;
  file: string;
  alt: string;
}

export interface VideoAssetRef {
  folder: string;
  file: string;
  poster: string;
  alt: string;
}

export interface SystemVariant {
  key: string;
  label: string;
  description: string;
  /** The base mannequin/subject kept constant across variants. */
  baseSubject?: string;
  hero?: AssetRef;
  /** Web-size sheet crops only — never full-resolution originals. */
  sheetPreviews: AssetRef[];
  lockedTraits?: string[];
  changedTraits?: string[];
}

export interface VisualSystem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  /** base mannequin → aesthetic rules → variant → media packet → showroom → asset store → workshop */
  baseWorkflow: string[];
  /** The style formula, rendered as a label/value grid. */
  aestheticRules: { label: string; value: string }[];
  variants: SystemVariant[];
  /** Department slugs (src/data/departments.ts). */
  departments: string[];
  featuredAssets: {
    poster?: AssetRef;
    hero?: AssetRef;
    teaserVideo?: VideoAssetRef;
    sheetPreviews: AssetRef[];
  };
  /** Article ids (src/content/articles). Empty until a verified article exists. */
  relatedArticles: string[];
  /** Product slugs (src/content/products). Empty until a verified drop exists. */
  relatedProducts: string[];
  /** Workshop-note article ids. Empty until verified. */
  relatedWorkshopNotes: string[];
  /** Off-site asset-store buy link (e.g. DeviantArt). Undefined => "coming soon". */
  assetStoreUrl?: string;
  /** Gallery entry id to hydrate live media from, when the system mirrors one. */
  sourceGalleryEntry?: string;
  status: VisualSystemStatus;
  featured?: boolean;
}

export const visualSystems: VisualSystem[] = [
  {
    id: "sophia-stella",
    title: "Sophia / Stella",
    slug: "sophia-stella",
    shortDescription:
      "Same base. Different mythology. Sophia is the bright candy-rave black cat; Stella is the corrupted nightclub queen. The character sheet is the paid asset. The poster, hero, and video sell the world.",
    baseWorkflow: [
      "Base mannequin: one shared face, body, and feline base",
      "Aesthetic rules: define the bright candy-rave vs corrupted-noir rule sets",
      "Variant: build Sophia, then rebuild the same base as Stella",
      "Media packet: poster + hero images + teaser video + web-size sheet previews",
      "Showroom: this page and the homepage feature",
      "Asset store: full-resolution character sheets on DeviantArt",
      "Workshop → Academy: the character-design and mannequin-design write-ups",
    ],
    aestheticRules: [
      { label: "Base", value: "One shared mannequin: face, body, proportions, feline read" },
      { label: "Lock", value: "Character identity, silhouette, eyes, ears" },
      { label: "Sophia", value: "Candy-rave brightness, neon pastels, glossy club fashion, playful energy" },
      { label: "Stella", value: "Corrupted nightclub, dark surfaces, smoke, neon-noir, queen authority" },
    ],
    variants: [
      {
        key: "sophia",
        label: "Sophia",
        description: "The bright candy-rave black cat: neon pastels, glossy fashion, playful club energy.",
        baseSubject: "Shared mannequin",
        hero: {
          folder: "visual-systems",
          file: "sophia-hero-hd.jpg",
          alt: "Sophia hero image: the bright candy-rave black cat character.",
        },
        sheetPreviews: [
          {
            folder: "visual-systems",
            file: "sophia-character-sheet-hd.jpg",
            alt: "Sophia character sheet preview (web-size).",
          },
        ],
        lockedTraits: ["face", "feline base", "silhouette", "eyes"],
        changedTraits: ["neon pastel palette", "glossy club fashion", "bright mood"],
      },
      {
        key: "stella",
        label: "Stella",
        description: "The corrupted nightclub queen: same base rebuilt in dark surfaces, smoke, and neon-noir.",
        baseSubject: "Shared mannequin",
        hero: {
          folder: "visual-systems",
          file: "stella-hero-hd.png",
          alt: "Stella hero image: the corrupted nightclub queen character.",
        },
        sheetPreviews: [
          {
            folder: "visual-systems",
            file: "stella-character-sheet-hd.jpg",
            alt: "Stella character sheet preview (web-size).",
          },
        ],
        lockedTraits: ["face", "feline base", "silhouette", "eyes"],
        changedTraits: ["dark surface language", "smoke and neon-noir", "nightclub authority"],
      },
    ],
    departments: ["cute-corrupted"],
    featuredAssets: {
      poster: {
        folder: "visual-systems",
        file: "sophia-stella-poster-hd.jpg",
        alt: "Sophia / Stella poster pairing the bright and corrupted versions of the same base character.",
      },
      teaserVideo: {
        folder: "visual-systems",
        file: "sophia-stella-video.mp4",
        poster: "sophia-stella-poster-hd.jpg",
        alt: "Sophia / Stella teaser video showing the same base as bright candy-rave and corrupted nightclub versions.",
      },
      sheetPreviews: [],
    },
    relatedArticles: [],
    relatedProducts: ["sophia-stella-sheet-pack"],
    relatedWorkshopNotes: [],
    // No DeviantArt URL confirmed yet — the showroom shows a "coming soon" state
    // instead of a fake buy link.
    assetStoreUrl: undefined,
    status: "active",
    featured: true,
  },

  {
    id: "cute-corrupted",
    title: "Cute / Corrupted",
    slug: "cute-corrupted",
    shortDescription:
      "Same subject, two surfaces: a clean charming version and a corrupted counterpart that keeps the same-person read. Kareena is the running example.",
    baseWorkflow: [
      "Base mannequin: lock face, hair, eyes, key accessories",
      "Aesthetic rules: define the cute vs corrupted material language",
      "Variant: build the cute sheet, then the corrupted sheet",
      "Media packet: poster + 6-second video + web-size sheets",
      "Showroom: this page and the cute-corrupted gallery",
      "Asset store: full-resolution sheet packs on DeviantArt",
      "Workshop → Academy: the transformation-logic write-up",
    ],
    aestheticRules: [
      { label: "Lock", value: "Face, hair shape, eyes, heart accessories" },
      { label: "Flex", value: "Surface material, palette temperature, collage texture" },
      { label: "Cute", value: "Pastel fashion, plush accessories, soft magazine layout" },
      { label: "Corrupted", value: "Torn zine texture, black surfaces, club energy" },
    ],
    variants: [
      {
        key: "cute",
        label: "Cute",
        description: "Bright, readable, fashion-magazine layout.",
        baseSubject: "Kareena",
        sheetPreviews: [
          {
            folder: "gallery/cute-corrupted/kareena-pink",
            file: "kareena-cute.jpg",
            alt: "Cute Kareena character sheet preview (web-size).",
          },
        ],
        lockedTraits: ["large eyes", "navy-black bob", "heart accessories"],
        changedTraits: ["soft pastel fashion", "plush accessories"],
      },
      {
        key: "corrupted",
        label: "Corrupted",
        description: "Same figure, punk-collage surface language.",
        baseSubject: "Kareena",
        sheetPreviews: [
          {
            folder: "gallery/cute-corrupted/kareena-pink",
            file: "kareena-corrupted.jpg",
            alt: "Corrupted Kareena character sheet preview (web-size).",
          },
        ],
        lockedTraits: ["large eyes", "navy-black bob", "heart accessories"],
        changedTraits: ["torn fabric", "fishnet", "chains", "zine texture"],
      },
    ],
    departments: ["cute-corrupted"],
    featuredAssets: {
      poster: {
        folder: "gallery/cute-corrupted/kareena-pink",
        file: "kareena-poster.png",
        alt: "Kareena cute/corrupted poster.",
      },
      teaserVideo: {
        folder: "gallery/cute-corrupted/kareena-pink",
        file: "cute-corrupted-kareena.mp4",
        poster: "kareena-poster.png",
        alt: "Six-second Kareena cute/corrupted preview.",
      },
      sheetPreviews: [],
    },
    relatedArticles: [],
    relatedProducts: [],
    relatedWorkshopNotes: [],
    assetStoreUrl: undefined,
    sourceGalleryEntry: "cute-corrupted/kareena",
    status: "active",
    featured: false,
  },

  // ── Planned scaffold (generic) ─────────────────────────────────────────────
  // A future same-base system drops in here with real {folder,file} refs and
  // status:"active". Kept commented so activeVisualSystems stays clean and the
  // showroom/homepage never render an empty placeholder.
  // {
  //   id: "TODO-system-id",
  //   title: "TODO",
  //   slug: "todo-system",
  //   shortDescription: "TODO",
  //   baseWorkflow: [],
  //   aestheticRules: [],
  //   variants: [],
  //   departments: [],
  //   featuredAssets: { sheetPreviews: [] },
  //   relatedArticles: [],
  //   relatedProducts: [],
  //   relatedWorkshopNotes: [],
  //   status: "planned",
  // },
];

const bySlug = new Map(visualSystems.map((s) => [s.slug, s]));
const byId = new Map(visualSystems.map((s) => [s.id, s]));

export function getVisualSystem(idOrSlug?: string | null): VisualSystem | undefined {
  if (!idOrSlug) return undefined;
  return byId.get(idOrSlug) ?? bySlug.get(idOrSlug);
}

export function visualSystemPath(slug: string): string {
  return `/visual-systems/${slug}/`;
}

// Only active systems render publicly. Planned/hidden generate no public entry
// (or a noindex page, decided by the route).
export const activeVisualSystems = visualSystems.filter((s) => s.status === "active");

// The homepage feature: the flagged system, else the first active one.
export const featuredVisualSystem =
  activeVisualSystems.find((s) => s.featured) ?? activeVisualSystems[0];

export function visualSystemsForDepartment(slug: string): VisualSystem[] {
  return activeVisualSystems.filter((s) => s.departments.includes(slug));
}
