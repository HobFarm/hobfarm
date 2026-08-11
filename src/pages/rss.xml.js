import rss from '@astrojs/rss';
import {
  articlePath,
  getArticleDescription,
  getArticleSectionLabel,
  getPublishedArticles,
} from '@/lib/articles';
import { getEditorialSeries } from '@/data/editorial-mesh';

export async function GET(context) {
  const posts = await getPublishedArticles();

  return rss({
    title: 'HobFarm Articles',
    description: 'Long-form HobFarm articles about film, art, media, history, technology, and the connections between them.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate ?? post.data.publishedAt,
      description: getArticleDescription(post.data),
      link: articlePath(post),
      categories: [
        getArticleSectionLabel(post.data),
        ...(post.data.mesh?.subjects ?? []),
        ...(post.data.mesh?.series ?? []).map((id) => getEditorialSeries(id)?.label ?? id),
      ],
    })),
    customData: '<language>en-us</language>',
  });
}
