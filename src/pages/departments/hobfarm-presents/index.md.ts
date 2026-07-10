import {
  buildSectionLlms,
  characterToAgentLink,
  getPublicAgentAdventures,
  getPublicAgentCharacters,
  getPublicAgentStorySeries,
  adventureToAgentLink,
  markdownResponse,
  storySeriesToAgentLink,
} from "@/lib/agent-corpus";

export async function GET() {
  const adventures = await getPublicAgentAdventures();
  const links = [
    ...getPublicAgentStorySeries().map(storySeriesToAgentLink),
    ...adventures.map(adventureToAgentLink),
    ...getPublicAgentCharacters().map(characterToAgentLink),
  ];

  return markdownResponse(
    await buildSectionLlms(
      "HobFarm Presents",
      "HobFarm's fiction imprint for illustrated serials, short stories, character files, moving scenes, and recurring story worlds.",
      links,
    ),
  );
}
