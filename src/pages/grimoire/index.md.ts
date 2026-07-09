import {
  buildSectionLlms,
  getPublicAgentGrimoireEntries,
  grimoireToAgentLink,
  markdownResponse,
} from "@/lib/agent-corpus";

export async function GET() {
  const entries = await getPublicAgentGrimoireEntries();
  return markdownResponse(
    await buildSectionLlms(
      "HobFarm Grimoire",
      "Public Grimoire explanation and selected public entries. Private notes, raw prompts, admin workflows, and internal planning material are excluded.",
      entries.map(grimoireToAgentLink),
    ),
  );
}
