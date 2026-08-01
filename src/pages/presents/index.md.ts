import {
  buildSectionLlms,
  characterToAgentLink,
  getPublicAgentCharacters,
  getPublicAgentStorySeries,
  markdownResponse,
  storySeriesToAgentLink,
  articleToAgentLink,
  getPublicAgentArticles,
} from "@/lib/agent-corpus";

export async function GET() {
  const seriesArticles = (await getPublicAgentArticles()).filter((entry) => entry.data.presentsSeries === "3dm");
  const links = [
    {
      title: "3 Degrees of Dick Miller",
      url: "https://hob.farm/presents/3-degrees-of-dick-miller/",
      description: "A film-history media series following documented production connections to Dick Miller in three degrees or fewer.",
      tags: ["HobFarm Presents", "film history", "3DM"],
    },
    ...getPublicAgentStorySeries().map(storySeriesToAgentLink),
    ...seriesArticles.map(articleToAgentLink),
    ...getPublicAgentCharacters().map(characterToAgentLink),
  ];

  return markdownResponse(
    await buildSectionLlms(
      "HobFarm Presents",
      "HobFarm's series imprint for recurring worlds, games, film-history projects, video essays, character files, and moving scenes.",
      links,
    ),
  );
}
