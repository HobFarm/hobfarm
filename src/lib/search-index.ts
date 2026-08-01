import { getCollection } from "astro:content";
import {
  articlePath,
  getArticleDate,
  getArticleDescription,
  getPublishedArticles,
} from "@/lib/articles";
import { comicPath, getComicDate, getPublishedComics } from "@/lib/comics";
import {
  adventurePath,
  getAdventureDate,
  getPublishedAdventures,
} from "@/lib/adventures";
import { galleryTypeLabels, type GalleryType } from "@/lib/gallery";
import { resolveDepartment } from "@/data/departments";
import { characters, characterPath } from "@/data/characters";
import { storySeries, storySeriesPath } from "@/data/story-series";
import {
  OTHER_ALICE_CAST_PATH,
  publicOtherAliceCast,
} from "@/data/other-alice-world-guide";
import { PUBLIC_GRIMOIRE_ARCHIVE_ENABLED } from "@/data/public-features";

export type SearchItem = {
  type:
    | "article"
    | "comic"
    | "adventure"
    | "series"
    | "character"
    | "project"
    | "gallery"
    | "grimoire"
    | "help"
    | "changelog";
  title: string;
  description: string;
  href: string;
  tags?: string[];
  category?: string;
  date?: string;
  notes?: string;
};

const stripExt = (id: string) => id.replace(/\.(md|mdx)$/, "");
const toISO = (d: unknown) => (d instanceof Date ? d.toISOString() : undefined);

function buildGalleryNotes(data: any): string {
  const parts: string[] = [];
  if (data.concept?.thesis) parts.push(data.concept.thesis);
  if (data.concept?.method) parts.push(data.concept.method);
  if (data.concept?.reusablePattern) parts.push(data.concept.reusablePattern);
  if (Array.isArray(data.concept?.seedInputs))
    parts.push(...data.concept.seedInputs);
  if (Array.isArray(data.concept?.growthStages))
    parts.push(...data.concept.growthStages);
  if (Array.isArray(data.concept?.usefulFor))
    parts.push(...data.concept.usefulFor);
  if (Array.isArray(data.methods)) parts.push(...data.methods);
  if (Array.isArray(data.visualDNA)) {
    for (const v of data.visualDNA) parts.push(`${v.label}: ${v.value}`);
  }
  if (Array.isArray(data.fieldNotes)) {
    for (const n of data.fieldNotes) parts.push(`${n.label}. ${n.text}`);
  }
  if (Array.isArray(data.lessons)) {
    for (const l of data.lessons) parts.push(`${l.label}. ${l.text}`);
  }
  if (Array.isArray(data.workflowSteps)) {
    for (const s of data.workflowSteps) parts.push(`${s.label}. ${s.text}`);
  }
  if (Array.isArray(data.lockedTraits)) parts.push(...data.lockedTraits);
  if (Array.isArray(data.flexibleTraits)) parts.push(...data.flexibleTraits);
  if (Array.isArray(data.infoModules)) {
    for (const m of data.infoModules) parts.push(`${m.label}: ${m.value}`);
  }
  if (data.processNotes) parts.push(data.processNotes);
  if (data.specimenSheet) {
    const s = data.specimenSheet;
    if (s.specimenId) parts.push(s.specimenId);
    if (s.subjectName) parts.push(s.subjectName);
    if (s.subjectRole) parts.push(s.subjectRole);
    if (s.edition) parts.push(s.edition);
    if (s.status) parts.push(s.status);
    if (s.origin) parts.push(s.origin);
    if (s.creator) parts.push(s.creator);
    if (s.license) parts.push(s.license);
  }
  if (data.colorChemistry) {
    const c = data.colorChemistry;
    if (c.mood) parts.push(c.mood);
    if (c.contrast) parts.push(c.contrast);
    if (c.notes) parts.push(c.notes);
    if (Array.isArray(c.palette)) {
      for (const p of c.palette) {
        const tail = [p.finish, p.role].filter(Boolean).join(" ");
        parts.push(`${p.name} ${p.hex}${tail ? " " + tail : ""}`);
      }
    }
  }
  if (Array.isArray(data.wardrobeGrammar)) {
    for (const w of data.wardrobeGrammar) {
      parts.push(w.item);
      if (Array.isArray(w.materials)) parts.push(...w.materials);
      if (Array.isArray(w.colors)) parts.push(...w.colors);
      if (w.notes) parts.push(w.notes);
    }
  }
  if (Array.isArray(data.materials)) parts.push(...data.materials);
  if (Array.isArray(data.accessories)) parts.push(...data.accessories);
  if (data.styleProfile) {
    const sp = data.styleProfile;
    if (Array.isArray(sp.anchors)) parts.push(...sp.anchors);
    if (sp.arrangement) parts.push(sp.arrangement);
    if (sp.register) parts.push(sp.register);
    if (sp.weight) parts.push(sp.weight);
    if (sp.era) parts.push(sp.era);
    if (sp.hardness) parts.push(sp.hardness);
    if (sp.notes) parts.push(sp.notes);
  }
  return parts.join(" · ");
}

export async function buildSearchIndex(): Promise<SearchItem[]> {
  const articleItems: SearchItem[] = (await getPublishedArticles()).map(
    (post) => ({
      type: "article",
      title: post.data.title,
      description: getArticleDescription(post.data),
      href: articlePath(post),
      tags: post.data.tags,
      category: resolveDepartment(post.data.department ?? post.data.category),
      date: getArticleDate(post).toISOString(),
    }),
  );

  const comicItems: SearchItem[] = (await getPublishedComics()).map(
    (comic) => ({
      type: "comic",
      title: comic.data.title,
      description:
        comic.data.caption ??
        comic.data.socialCaption ??
        "A published comic from HobFarm Funnies.",
      href: comicPath(comic),
      tags: comic.data.tags,
      category: resolveDepartment(comic.data.department),
      date: getComicDate(comic).toISOString(),
    }),
  );

  const adventureItems: SearchItem[] = (await getPublishedAdventures()).map(
    (adventure) => ({
      type: "adventure",
      title: adventure.data.title,
      description: adventure.data.summary ?? adventure.data.teaser,
      href: adventurePath(adventure),
      tags: adventure.data.tags,
      category: "HobFarm Presents",
      date: getAdventureDate(adventure).toISOString(),
      notes: [
        `Adventure No. ${String(adventure.data.number).padStart(2, "0")}`,
        adventure.data.series,
        adventure.data.region,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  );

  const seriesItems: SearchItem[] = storySeries
    .filter((series) => series.status === "active")
    .map((series) => ({
      type: "series",
      title: series.title,
      description: series.metaDescription ?? series.logline,
      href: storySeriesPath(series.slug),
      tags: [
        "illustrated serial",
        "Alice in Wonderland",
        "Wonderland",
        "Wasteland",
      ],
      category: "HobFarm Presents",
      notes: [
        series.tagline,
        ...(series.heroIntro ?? []),
        ...(series.explainer?.paragraphs ?? []),
        ...(series.worldAtlas?.intro ?? []),
        ...(series.worldAtlas?.concepts ?? []).flatMap((concept) => [
          concept.title,
          concept.realm,
          concept.description,
        ]),
        ...(series.residents?.entries ?? []).flatMap((resident) => [
          resident.name,
          resident.role,
          ...resident.summary,
        ]),
        ...(series.faq ?? []).flatMap((item) => [item.question, item.answer]),
      ].join(" · "),
    }));

  const characterItems: SearchItem[] = characters.map((character) => ({
    type: "character",
    title: character.displayName ?? character.name,
    description: character.metaDescription ?? character.bio,
    href: characterPath(character.slug),
    tags: character.traits,
    category: character.role,
    notes: [
      character.name,
      character.blurb,
      ...(character.guideIntro ?? []),
      ...(character.guideSections ?? []).flatMap((section) => [
        section.title,
        ...(section.paragraphs ?? []),
        ...(section.bullets ?? []),
      ]),
    ].join(" · "),
  }));

  const otherAliceCastItem: SearchItem = {
    type: "series",
    title: "Cast of Wonderland",
    description:
      "Public dossier records for the residents, workers, officeholders, institutions, disputed identities, and old witnesses shaping Other Alice Adventures.",
    href: OTHER_ALICE_CAST_PATH,
    tags: ["Other Alice Adventures", "Wonderland", "cast", "characters"],
    category: "HobFarm Presents",
    notes: publicOtherAliceCast
      .flatMap((record) => [record.name, record.role, record.currentFunction])
      .join(" · "),
  };

  const projectHrefOverrides: Record<string, string> = {
    stylefusion: "/workshop/stylefusion/",
    "hobfarm-tv/3-degrees-of-dick-miller": "/presents/3-degrees-of-dick-miller/",
    "hobfarm-tv/magazine-time-machine": "/presents/magazine-time-machine/",
  };
  // `/projects/` is retired. Only records whose content renders at a real route
  // are indexed; anything without one is omitted rather than linked to a 404.
  const projectItems: SearchItem[] = (await getCollection("projects")).flatMap(
    (project) => {
      const slug = stripExt(project.id);
      const href = projectHrefOverrides[slug];
      if (!href) return [];
      return [
        {
          type: "project",
          title: project.data.title,
          description: project.data.description,
          href,
          category: project.data.category,
          date: toISO(project.data.pubDate),
        },
      ];
    },
  );

  const servicesItem: SearchItem = {
    type: "project",
    title: "Services",
    description:
      "Hire HobFarm for video production, image and design, web development, AI workflow design, and marketing.",
    href: "/services/",
  };

  const galleryItems: SearchItem[] = (await getCollection("gallery"))
    .filter((entry) => !entry.data.draft)
    .map((entry) => ({
      type: "gallery",
      title: entry.data.title,
      description: entry.data.summary,
      href: `/gallery/${stripExt(entry.id)}`,
      tags: entry.data.tags,
      category: galleryTypeLabels[entry.data.type as GalleryType],
      date: toISO(entry.data.date),
      notes: buildGalleryNotes(entry.data),
    }));

  const grimoireItems: SearchItem[] = PUBLIC_GRIMOIRE_ARCHIVE_ENABLED
    ? (await getCollection("grimoire"))
        .filter((entry) => !entry.data.draft)
        .map((entry) => ({
          type: "grimoire",
          title: entry.data.title,
          description: entry.data.description,
          href: `/grimoire/${stripExt(entry.id)}`,
          tags: entry.data.tags,
          category: entry.data.category,
          date: toISO(entry.data.date),
        }))
    : [];

  const helpItems: SearchItem[] = (await getCollection("help")).map(
    (entry) => ({
      type: "help",
      title: entry.data.title,
      description: entry.data.description,
      href: `/helpcenter/${stripExt(entry.id)}`,
      category: entry.data.section,
      date: toISO(entry.data.publishedAt),
    }),
  );

  const changelogItems: SearchItem[] = (await getCollection("changelog")).map(
    (entry) => {
      const parts: string[] = [];
      if (entry.data.project) parts.push(entry.data.project);
      if (entry.data.version) parts.push(`v${entry.data.version}`);
      return {
        type: "changelog",
        title: entry.data.title,
        description: parts.length ? parts.join(" · ") : "",
        href: `/changelog/${stripExt(entry.id)}`,
        tags: entry.data.tags,
        category: entry.data.project,
        date: toISO(entry.data.publishedAt),
      };
    },
  );

  return [
    ...articleItems,
    ...comicItems,
    ...adventureItems,
    ...seriesItems,
    otherAliceCastItem,
    ...characterItems,
    ...projectItems,
    servicesItem,
    ...galleryItems,
    ...grimoireItems,
    ...helpItems,
    ...changelogItems,
  ];
}
