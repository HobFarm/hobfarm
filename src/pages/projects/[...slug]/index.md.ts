import {
  getPublicAgentProjects,
  markdownResponse,
  projectMarkdown,
} from "@/lib/agent-corpus";

const stripExt = (id: string) => id.replace(/\.(md|mdx)$/, "");
const redirectedSlugs = new Set(["shop", "courses", "grimoire"]);

export async function getStaticPaths() {
  const projects = await getPublicAgentProjects();
  return projects
    .filter((project) => !redirectedSlugs.has(stripExt(project.id)))
    .map((project) => ({
      params: { slug: stripExt(project.id) },
      props: { project },
    }));
}

export function GET({ props }: { props: { project: Awaited<ReturnType<typeof getPublicAgentProjects>>[number] } }) {
  return markdownResponse(projectMarkdown(props.project));
}
