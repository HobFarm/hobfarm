import { allLessons, avatarCourse } from "@/data/avatar-content-system";
import { getAcademyCourse } from "@/data/academy-courses";
import { characterPath, characters } from "@/data/characters";
import { workshopPrograms } from "@/data/site-hierarchy";
import { visualSystems, visualSystemPath } from "@/data/visual-systems";
import { articlePath, getPublishedArticles, stripArticleExt } from "@/lib/articles";
import { getPublicProducts, productPath, productSlug } from "@/lib/products";

export type RelatedContentKind =
  | "workshop"
  | "academy"
  | "product"
  | "article"
  | "character"
  | "visual-system";

export type ContentRelationships = {
  relatedWorkshop?: string[];
  relatedAcademy?: string[];
  relatedProducts?: string[];
  relatedArticles?: string[];
  relatedCharacters?: string[];
  relatedVisualSystems?: string[];
};

export type ResolvedRelatedContent = {
  id: string;
  kind: RelatedContentKind;
  label: string;
  href: string;
  description?: string;
};

export type ToolRoute = {
  required: string[];
  optional?: string[];
  fallback: string[];
  note?: string;
};

export type AssetManifestRef = {
  id: string;
  label: string;
  role: "sheet" | "hero" | "poster" | "video" | "download" | "source";
  preview?: string;
  buyerFile?: boolean;
  format?: string;
  dimensions?: string;
};

export const relatedContentKindLabels: Record<RelatedContentKind, string> = {
  workshop: "Behind this work",
  academy: "Learn the method",
  product: "Use the finished work",
  article: "Read the article",
  character: "Character",
  "visual-system": "Visual system",
};

const normalizeRef = (value: string) =>
  value.trim().replace(/^\/+|\/+$/g, "").replace(/\.(md|mdx)$/i, "");

/**
 * Resolves optional relationship ids to verified, public routes. Unknown ids
 * are omitted so an unfinished relationship never creates a public link.
 */
export async function resolveRelatedContent(
  relationships: ContentRelationships,
): Promise<ResolvedRelatedContent[]> {
  const needsArticles = Boolean(relationships.relatedArticles?.length);
  const needsProducts = Boolean(relationships.relatedProducts?.length);
  const [articles, products] = await Promise.all([
    needsArticles ? getPublishedArticles() : Promise.resolve([]),
    needsProducts ? getPublicProducts() : Promise.resolve([]),
  ]);

  const articleById = new Map(
    articles.map((entry) => [stripArticleExt(entry.id), entry]),
  );
  const productById = new Map(products.map((entry) => [productSlug(entry), entry]));
  const resolved: ResolvedRelatedContent[] = [];
  const seen = new Set<string>();

  const add = (item: ResolvedRelatedContent | undefined) => {
    if (!item || seen.has(item.href)) return;
    seen.add(item.href);
    resolved.push(item);
  };

  for (const reference of relationships.relatedWorkshop ?? []) {
    const id = normalizeRef(reference).replace(/^workshop\//, "");
    const entry = workshopPrograms.find((program) => program.id === id || program.slug === id);
    if (entry) add({ id, kind: "workshop", label: entry.name, href: entry.href, description: entry.description });
  }

  for (const reference of relationships.relatedAcademy ?? []) {
    const id = normalizeRef(reference).replace(/^academy\//, "");
    const courseSlug = id.split("/")[0];
    const course = getAcademyCourse(courseSlug);
    if (course && !id.includes("/")) {
      add({
        id: course.slug,
        kind: "academy",
        label: course.title,
        href: course.href,
        description: course.description,
      });
      continue;
    }

    const lessonSlug = id.split("/").pop() ?? id;
    const lesson = allLessons.find((entry) => entry.slug === lessonSlug);
    if (lesson) {
      add({
        id: lesson.slug,
        kind: "academy",
        label: lesson.title,
        href: `${avatarCourse.coursePath}/${lesson.slug}/`,
        description: lesson.preview,
      });
    }
  }

  for (const reference of relationships.relatedProducts ?? []) {
    const id = normalizeRef(reference).replace(/^shop\//, "");
    const entry = productById.get(id);
    if (entry) add({ id, kind: "product", label: entry.data.title, href: productPath(entry), description: entry.data.shortDescription });
  }

  for (const reference of relationships.relatedArticles ?? []) {
    const id = normalizeRef(reference).replace(/^articles\//, "");
    const entry = articleById.get(id);
    if (entry) add({ id, kind: "article", label: entry.data.title, href: articlePath(entry), description: entry.data.excerpt });
  }

  for (const reference of relationships.relatedCharacters ?? []) {
    const id = normalizeRef(reference).replace(/^characters\//, "");
    const entry = characters.find((character) => character.slug === id);
    if (entry) add({ id, kind: "character", label: entry.displayName ?? entry.name, href: characterPath(entry.slug), description: entry.blurb });
  }

  for (const reference of relationships.relatedVisualSystems ?? []) {
    const id = normalizeRef(reference).replace(/^visual-systems\//, "");
    const entry = visualSystems.find((system) => system.id === id || system.slug === id);
    if (entry && entry.status !== "hidden") {
      add({ id, kind: "visual-system", label: entry.title, href: visualSystemPath(entry.slug), description: entry.shortDescription });
    }
  }

  return resolved;
}
