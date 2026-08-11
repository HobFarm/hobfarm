import {
  articleMarkdown,
  getPublicAgentArticles,
  markdownResponse,
} from "@/lib/agent-corpus";
import { articleUsesSeries, stripArticleExt } from "@/lib/articles";

export async function getStaticPaths() {
  const articles = (await getPublicAgentArticles()).filter((entry) => !articleUsesSeries(entry.data, "3dm"));
  return articles.map((entry) => ({
    params: { slug: stripArticleExt(entry.id) },
    props: { entry },
  }));
}

export function GET({ props }: { props: { entry: Awaited<ReturnType<typeof getPublicAgentArticles>>[number] } }) {
  return markdownResponse(articleMarkdown(props.entry));
}
