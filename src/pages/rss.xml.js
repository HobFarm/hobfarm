import rss from '@astrojs/rss';
import {
  articlePath,
  getArticleDate,
  getArticleDescription,
  getArticleImage,
  getArticleSectionLabel,
  getPublishedArticles,
} from '@/lib/articles';
import { getEditorialSeries } from '@/data/editorial-mesh';

const mediaContent = (image, site) => {
  if (!image) return undefined;
  const url = new URL(image, site).toString().replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  return `<media:content xmlns:media="http://search.yahoo.com/mrss/" url="${url}" medium="image" />`;
};

export async function GET(context) {
  const posts = await getPublishedArticles();

  return rss({
    title: 'HobFarm Articles',
    description: 'Long-form HobFarm articles about film, art, media, history, technology, and the connections between them.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: getArticleDate(post),
      description: getArticleDescription(post.data),
      link: articlePath(post),
      categories: [
        getArticleSectionLabel(post.data),
        ...(post.data.mesh?.subjects ?? []),
        ...(post.data.mesh?.series ?? []).map((id) => getEditorialSeries(id)?.label ?? id),
      ],
      customData: mediaContent(getArticleImage(post.data), context.site),
    })),
    customData: '<language>en-us</language>',
  });
}
