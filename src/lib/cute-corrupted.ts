import { getCollection, type CollectionEntry } from "astro:content";
import { mediaUrl } from "@/lib/gallery";
import { cuteCorrupted } from "@/data/homepage-systems";

export interface CompareSide {
  src: string;
  alt: string;
  label: string;
}

export interface CompareItem {
  slug: string;
  href: string;
  title: string;
  before: CompareSide;
  after: CompareSide;
  video?: { src: string; poster: string; alt?: string };
  aspect: string;
  locked: string[];
  changed: string[];
}

export interface SwitcherBranch extends CompareItem {
  key: string;
  label: string;
  blurb: string;
}

// Build one comparison from a gallery entry. Returns null when the entry has no
// cute/corrupted stills yet, so an unfinished entry is skipped, not broken.
function buildCompare(entry: CollectionEntry<"gallery">): CompareItem | null {
  const folder = entry.data.folder;
  const sections = entry.data.mediaSections ?? [];
  // Pick the still that mentions only "cute" (not "corrupt") and vice versa, so
  // a combined "Cute / Corrupted" or "Poster" section is skipped.
  const sheetImage = (want: string, exclude: string) => {
    const section = sections.find((s) => {
      const t = s.title.toLowerCase();
      return t.includes(want) && !t.includes(exclude);
    });
    return section?.media.find((m) => m.type === "image");
  };
  const cuteImg = sheetImage("cute", "corrupt");
  const corruptedImg = sheetImage("corrupt", "cute");
  if (!cuteImg || !corruptedImg) return null;

  const hero = entry.data.hero;
  return {
    slug: entry.id.replace(/\.(md|mdx)$/, ""),
    href: `/gallery/${entry.id.replace(/\.(md|mdx)$/, "")}/`,
    title: entry.data.title,
    before: {
      src: mediaUrl(folder, cuteImg.file),
      alt: cuteImg.alt ?? "Cute version",
      label: "Cute",
    },
    after: {
      src: mediaUrl(folder, corruptedImg.file),
      alt: corruptedImg.alt ?? "Corrupted version",
      label: "Corrupted",
    },
    video:
      hero && hero.type === "video"
        ? { src: mediaUrl(folder, hero.file), poster: mediaUrl(folder, hero.poster), alt: hero.alt }
        : undefined,
    aspect: entry.data.heroAspect ?? "aspect-[4/5]",
    locked: entry.data.lockedTraits ?? [],
    changed: entry.data.flexibleTraits ?? [],
  };
}

const matchesSlug = (entry: CollectionEntry<"gallery">, slug: string) =>
  entry.id.replace(/\.(md|mdx)$/, "") === slug;

// Build comparisons for a list of entry slugs (used by the landing page to show
// every piece in a branch). Missing or unfinished entries are dropped.
export async function buildCompareItems(slugs: string[]): Promise<CompareItem[]> {
  const entries = await getCollection("gallery");
  return slugs
    .map((slug) => entries.find((e) => matchesSlug(e, slug)))
    .filter((e): e is CollectionEntry<"gallery"> => Boolean(e))
    .map((e) => buildCompare(e))
    .filter((c): c is CompareItem => c !== null);
}

// One featured comparison per branch, used by the homepage switcher.
export async function getCuteCorruptedBranches(): Promise<SwitcherBranch[]> {
  const entries = await getCollection("gallery");
  return cuteCorrupted.branches
    .map((branch): SwitcherBranch | null => {
      const entry = entries.find((e) => matchesSlug(e, branch.featured));
      const compare = entry ? buildCompare(entry) : null;
      if (!compare) return null;
      return { ...compare, key: branch.key, label: branch.label, blurb: branch.blurb };
    })
    .filter((b): b is SwitcherBranch => b !== null);
}
