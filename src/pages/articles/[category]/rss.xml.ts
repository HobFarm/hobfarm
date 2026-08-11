import rss from "@astrojs/rss";
import { editorialSections, getEditorialSection } from "@/data/editorial-mesh";
import {
  articlePath,
  getArticleDescription,
  getPublishedArticles,
} from "@/lib/articles";

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

  return rss({
    title: `${section.label} articles | HobFarm`,
    description: section.blurb,
    site: context.site ?? "https://hob.farm",
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt ?? post.data.pubDate,
      description: getArticleDescription(post.data),
      link: articlePath(post),
      categories: [section.label, ...(post.data.mesh?.subjects ?? [])],
    })),
    customData: "<language>en-us</language>",
  });
}
