import {
  buildSectionLlms,
  getPublicAgentProjects,
  projectToAgentLink,
  textResponse,
} from "@/lib/agent-corpus";

export async function GET() {
  const projects = await getPublicAgentProjects();
  return textResponse(
    await buildSectionLlms(
      "HobFarm Projects Agent Index",
      "Recurring public tools, series, systems, worlds, and formats. Internal project memory and private build notes are excluded.",
      projects.map(projectToAgentLink),
    ),
  );
}
