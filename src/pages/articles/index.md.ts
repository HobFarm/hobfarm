import {
  articleToAgentLink,
  buildSectionLlms,
  getPublicAgentArticles,
  markdownResponse,
} from "@/lib/agent-corpus";

export async function GET() {
  const articles = await getPublicAgentArticles();
  return markdownResponse(
    await buildSectionLlms(
      "HobFarm Articles",
      "The main public editorial feed. Use article detail pages and their `/index.md` alternates for source-backed reading.",
      articles.map(articleToAgentLink),
    ),
  );
}
