import rss from '@astrojs/rss';
import { articlePath, getArticleDescription, getPublishedArticles } from '@/lib/articles';

export async function GET(context) {
  const posts = await getPublishedArticles();

  return rss({
    title: 'HobFarm Articles',
    description: 'HobFarm is an online humor magazine and visual studio for visual culture, media history, cartoons, satirical magazine ads, archive dives, character systems, production notes, and image and video work.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate ?? post.data.publishedAt,
      description: getArticleDescription(post.data),
      link: articlePath(post),
    })),
  });
}
