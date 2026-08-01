import {
  adventureMarkdown,
  getPublicAgentAdventures,
  markdownResponse,
} from "@/lib/agent-corpus";
import { adventureSlug } from "@/lib/adventures";

export async function getStaticPaths() {
  const adventures = await getPublicAgentAdventures();
  return adventures.map((adventure) => ({
    params: { series: adventure.data.series, slug: adventureSlug(adventure) },
    props: { adventure },
  }));
}

export function GET({
  props,
}: {
  props: {
    adventure: Awaited<ReturnType<typeof getPublicAgentAdventures>>[number];
  };
}) {
  return markdownResponse(adventureMarkdown(props.adventure));
}
