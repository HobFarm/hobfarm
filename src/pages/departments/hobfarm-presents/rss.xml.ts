import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { adventurePath, getPublishedAdventures } from "@/lib/adventures";
import { getStorySeriesTitle } from "@/data/story-series";

export async function GET(context: APIContext) {
  const adventures = await getPublishedAdventures();

  return rss({
    title: "HobFarm Presents",
    description:
      "Illustrated serial fiction, short stories, character files, and recurring story worlds from HobFarm Presents.",
    site: context.site!,
    customData: "<language>en-us</language>",
    items: adventures.map((adventure) => ({
      title: `${adventure.data.title} | ${getStorySeriesTitle(adventure.data.series)}`,
      pubDate: adventure.data.date,
      description: adventure.data.summary ?? adventure.data.teaser,
      link: adventurePath(adventure),
      customData: `<media:content xmlns:media="http://search.yahoo.com/mrss/" url="${adventure.data.cover}" medium="image" />`,
    })),
  });
}
