import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { articlePath, getArticleDate, getArticleDescription, getArticleImage, getPublishedArticles } from "@/lib/articles";
import { THREE_DM_CDN_LOGO } from "@/data/presents-titles";
import { articleUsesSeries } from "@/data/editorial-mesh";

export async function GET(context: APIContext) {
  const entries = (await getPublishedArticles()).filter((entry) => articleUsesSeries(entry.data, "3dm"));
  const mediaContent = (image: string) => {
    const url = new URL(image, context.site).toString().replaceAll("&", "&amp;").replaceAll('"', "&quot;");
    return `<media:content xmlns:media="http://search.yahoo.com/mrss/" url="${url}" medium="image" />`;
  };

  return rss({
    title: "HobFarm Presents",
    description:
      "Recurring worlds, games, film-history projects, video essays, character files, and moving scenes from HobFarm Presents.",
    site: context.site!,
    customData: "<language>en-us</language>",
    items: [
      ...entries.map((entry) => ({
        title: `${entry.data.title} | 3 Degrees of Dick Miller`,
        pubDate: getArticleDate(entry),
        description: getArticleDescription(entry.data),
        link: `${articlePath(entry)}/`,
        customData: mediaContent(getArticleImage(entry.data) ?? THREE_DM_CDN_LOGO),
      })),
    ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()),
  });
}
