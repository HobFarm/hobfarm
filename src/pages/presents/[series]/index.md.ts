import {
  getPublicAgentStorySeries,
  markdownResponse,
  storySeriesMarkdown,
} from "@/lib/agent-corpus";

export function getStaticPaths() {
  return getPublicAgentStorySeries().map((series) => ({
    params: { series: series.slug },
    props: { series },
  }));
}

export function GET({
  props,
}: {
  props: { series: ReturnType<typeof getPublicAgentStorySeries>[number] };
}) {
  return markdownResponse(storySeriesMarkdown(props.series));
}
