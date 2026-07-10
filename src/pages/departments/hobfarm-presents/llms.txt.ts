import {
  adventureToAgentLink,
  buildSectionLlms,
  characterToAgentLink,
  getPublicAgentAdventures,
  getPublicAgentCharacters,
  getPublicAgentStorySeries,
  storySeriesToAgentLink,
  textResponse,
} from "@/lib/agent-corpus";

export async function GET() {
  const adventures = await getPublicAgentAdventures();
  return textResponse(
    await buildSectionLlms(
      "HobFarm Presents Agent Index",
      "Published fiction series, Adventures, and principal character guides. Draft stories and source files are excluded.",
      [
        ...getPublicAgentStorySeries().map(storySeriesToAgentLink),
        ...adventures.map(adventureToAgentLink),
        ...getPublicAgentCharacters().map(characterToAgentLink),
      ],
    ),
  );
}
