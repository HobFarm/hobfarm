import {
  getEditorialEntity,
  type EditorialEntityType,
  type EditorialSectionSlug,
  type EditorialSeriesId,
} from "../data/editorial-mesh.ts";

export type EditorialMeshData = {
  section: EditorialSectionSlug | string;
  subjects: readonly string[];
  series: readonly (EditorialSeriesId | string)[];
  entities: Record<EditorialEntityType, readonly string[]>;
};

export type RelatedArticleScore = {
  score: number;
  reasons: string[];
};

function sharedValues(a: readonly string[], b: readonly string[]): string[] {
  const bValues = new Set(b);
  return [...new Set(a.filter((value) => bValues.has(value)))];
}

function addSharedEntityScore(
  score: RelatedArticleScore,
  current: EditorialMeshData,
  candidate: EditorialMeshData,
  type: EditorialEntityType,
  weight: number,
) {
  const shared = sharedValues(current.entities[type], candidate.entities[type]);
  if (!shared.length) return;
  score.score += shared.length * weight;
  score.reasons.push(
    `${type}: ${shared.map((id) => getEditorialEntity(id)?.label ?? id).join(", ")}`,
  );
}

export function scoreEditorialMeshRelated(
  current: EditorialMeshData,
  candidate: EditorialMeshData,
): RelatedArticleScore {
  const result: RelatedArticleScore = { score: 0, reasons: [] };
  const sharedSeries = sharedValues(current.series, candidate.series);
  if (sharedSeries.length) {
    result.score += sharedSeries.length * 100;
    result.reasons.push(`series: ${sharedSeries.join(", ")}`);
  }

  addSharedEntityScore(result, current, candidate, "people", 28);
  addSharedEntityScore(result, current, candidate, "events", 18);
  addSharedEntityScore(result, current, candidate, "works", 18);
  addSharedEntityScore(result, current, candidate, "organizations", 18);
  addSharedEntityScore(result, current, candidate, "places", 14);
  addSharedEntityScore(result, current, candidate, "publications", 14);
  addSharedEntityScore(result, current, candidate, "technologies", 8);

  const sharedSubjects = sharedValues(current.subjects, candidate.subjects);
  if (sharedSubjects.length) {
    result.score += sharedSubjects.length * 4 + (sharedSubjects.length >= 2 ? 6 : 0);
    result.reasons.push(`subjects: ${sharedSubjects.join(", ")}`);
  }

  if (current.section === candidate.section) {
    result.score += 2;
    result.reasons.push(`section: ${current.section}`);
  }

  return result;
}
