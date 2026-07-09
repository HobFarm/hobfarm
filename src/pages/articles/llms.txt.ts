import {
  articleToAgentLink,
  buildSectionLlms,
  getPublicAgentArticles,
  textResponse,
} from "@/lib/agent-corpus";

export async function GET() {
  const articles = await getPublicAgentArticles();
  return textResponse(
    await buildSectionLlms(
      "HobFarm Articles Agent Index",
      "Canonical public editorial entries. Drafts, archived entries, tags, and private source material are excluded.",
      articles.map(articleToAgentLink),
    ),
  );
}
