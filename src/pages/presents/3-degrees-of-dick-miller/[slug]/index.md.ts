import { articleMarkdown, getPublicAgentArticles, markdownResponse } from "@/lib/agent-corpus";
import { articleUsesSeries, stripArticleExt } from "@/lib/articles";

export async function getStaticPaths() {
  const entries = (await getPublicAgentArticles()).filter((entry) => articleUsesSeries(entry.data, "3dm"));
  return entries.map((entry) => ({
    params: { slug: stripArticleExt(entry.id).split("/").pop()! },
    props: { entry },
  }));
}

export function GET({ props }: { props: { entry: Awaited<ReturnType<typeof getPublicAgentArticles>>[number] } }) {
  return markdownResponse(articleMarkdown(props.entry));
}
