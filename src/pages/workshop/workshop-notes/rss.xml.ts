import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import {
  articlePath,
  getArticleDate,
  getArticleDepartment,
  getArticleDescription,
  getArticleImage,
  getPublishedArticles,
} from "@/lib/articles";

const mediaContent = (image: string | undefined, site: URL) => {
  if (!image) return undefined;
  const url = new URL(image, site).toString().replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  return `<media:content xmlns:media="http://search.yahoo.com/mrss/" url="${url}" medium="image" />`;
};

export async function GET(context: APIContext) {
  const entries = (await getPublishedArticles()).filter(
    (entry) => getArticleDepartment(entry.data) === "workshop-notes",
  );

  return rss({
    title: "HobFarm Workshop Notes",
    description: "Production notes, tests, revisions, and reusable findings from the HobFarm Workshop.",
    site: context.site!,
    customData: "<language>en-us</language>",
    items: entries.map((entry) => ({
      title: entry.data.title,
      pubDate: getArticleDate(entry),
      description: getArticleDescription(entry.data),
      link: articlePath(entry),
      categories: ["Workshop Notes", ...(entry.data.mesh?.subjects ?? [])],
      customData: mediaContent(getArticleImage(entry.data), context.site!),
    })),
  });
}
