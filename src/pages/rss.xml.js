import rss from '@astrojs/rss';
import { articlePath, getArticleDescription, getPublishedArticles } from '@/lib/articles';

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
      categories: post.data.tags,
    })),
    customData: '<language>en-us</language>',
  });
}
