import {
  articleToAgentLink,
  buildSectionLlms,
  getPublicAgentArticles,
  markdownResponse,
} from "@/lib/agent-corpus";
import { getArticleDepartment } from "@/lib/articles";

export async function GET() {
  const notes = (await getPublicAgentArticles()).filter(
    (article) => getArticleDepartment(article.data) === "workshop-notes",
  );
  return markdownResponse(
    await buildSectionLlms(
      "HobFarm Workshop",
      "Character development, visual-language design, production methods, camera and motion studies, systems, tests, failures, and build notes.",
      notes.map(articleToAgentLink),
    ),
  );
}
