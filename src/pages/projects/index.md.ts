import {
  buildSectionLlms,
  getPublicAgentProjects,
  markdownResponse,
  projectToAgentLink,
} from "@/lib/agent-corpus";

export async function GET() {
  const projects = await getPublicAgentProjects();
  return markdownResponse(
    await buildSectionLlms(
      "HobFarm Projects",
      "Public recurring tools, series, systems, worlds, and formats.",
      projects.map(projectToAgentLink),
    ),
  );
}
