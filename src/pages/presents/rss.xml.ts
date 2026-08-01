import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { articlePath, getArticleDate, getArticleDescription, getPublishedArticles } from "@/lib/articles";
import { THREE_DM_CDN_LOGO } from "@/data/presents-titles";

export async function GET(context: APIContext) {
  const entries = (await getPublishedArticles()).filter((entry) => entry.data.presentsSeries === "3dm");

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
        link: articlePath(entry),
        customData: `<media:content xmlns:media="http://search.yahoo.com/mrss/" url="${entry.data.heroImage ?? THREE_DM_CDN_LOGO}" medium="image" />`,
      })),
    ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()),
  });
}
