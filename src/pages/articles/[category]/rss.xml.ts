import rss from "@astrojs/rss";
import { editorialSections, getEditorialSection } from "@/data/editorial-mesh";
import {
  articlePath,
  getArticleDate,
  getArticleDescription,
  getArticleImage,
  getPublishedArticles,
} from "@/lib/articles";

const mediaContent = (image: string | undefined, site: URL | string) => {
  if (!image) return undefined;
  const url = new URL(image, site).toString().replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  return `<media:content xmlns:media="http://search.yahoo.com/mrss/" url="${url}" medium="image" />`;
};

export function getStaticPaths() {
  return editorialSections.map((section) => ({
    params: { category: section.slug },
    props: { section },
  }));
}

export async function GET(context: {
  site?: URL;
  props: { section: (typeof editorialSections)[number] };
}) {
  const section = getEditorialSection(context.props.section.slug)!;
  const posts = (await getPublishedArticles()).filter(
    (post) => post.data.mesh?.section === section.slug,
  );
  const site = context.site ?? "https://hob.farm";

  return rss({
    title: `${section.label} articles | HobFarm`,
    description: section.blurb,
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: getArticleDate(post),
      description: getArticleDescription(post.data),
      link: `${articlePath(post)}/`,
      categories: [section.label, ...(post.data.mesh?.subjects ?? [])],
      customData: mediaContent(getArticleImage(post.data), site),
    })),
    customData: "<language>en-us</language>",
  });
}
