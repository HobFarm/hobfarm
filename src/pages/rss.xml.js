import rss from '@astrojs/rss';
import { getPublishedPosts } from '@/lib/blog';

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    title: 'HobFarm',
    description: 'HobFarm is a creative studio in Las Vegas building AI visual tools, character work, galleries, and the systems behind them.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.data.excerpt,
      link: `/blog/posts/${post.id}/`,
    })),
  });
}
