import rss from '@astrojs/rss';
import { getArticleDescription, getPublishedArticles } from '@/lib/articles';

export async function GET(context) {
  const posts = await getPublishedArticles();

  return rss({
    title: 'HobFarm Articles',
    description: 'HobFarm is an online magazine and visual studio for visual culture, media history, cartoons, fake ads, archive dives, movie trails, character systems, production notes, and AI-assisted image and video work.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate ?? post.data.publishedAt,
      description: getArticleDescription(post.data),
      link: `/articles/${post.id}/`,
    })),
  });
}
