import {
  articleToAgentLink,
  buildSectionLlms,
  getPublicAgentArticles,
  textResponse,
} from "@/lib/agent-corpus";
import { getArticleDepartment } from "@/lib/articles";

export async function GET() {
  const notes = (await getPublicAgentArticles()).filter(
    (article) => getArticleDepartment(article.data) === "workshop-notes",
  );
  return textResponse(
    await buildSectionLlms(
      "HobFarm Workshop Agent Index",
      "Process notes, production methods, tool notes, and public build/workflow writing.",
      notes.map(articleToAgentLink),
    ),
  );
}
