import {
  buildSectionLlms,
  characterToAgentLink,
  getPublicAgentCharacters,
  getPublicAgentStorySeries,
  storySeriesToAgentLink,
  articleToAgentLink,
  getPublicAgentArticles,
  textResponse,
} from "@/lib/agent-corpus";

export async function GET() {
  const seriesArticles = (await getPublicAgentArticles()).filter((entry) => entry.data.presentsSeries === "3dm");
  return textResponse(
    await buildSectionLlms(
      "HobFarm Presents Agent Index",
      "Published recurring worlds, games, film-history features, and principal character guides. Draft entries and source files are excluded.",
      [
        {
          title: "3 Degrees of Dick Miller",
          url: "https://hob.farm/presents/3-degrees-of-dick-miller/",
          description: "A film-history media series following documented production connections to Dick Miller in three degrees or fewer.",
          tags: ["HobFarm Presents", "film history", "3DM"],
        },
        ...getPublicAgentStorySeries().map(storySeriesToAgentLink),
        ...seriesArticles.map(articleToAgentLink),
        ...getPublicAgentCharacters().map(characterToAgentLink),
      ],
    ),
  );
}
