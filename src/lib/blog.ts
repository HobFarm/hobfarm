import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

/**
 * A blog post is publishable when it is not a draft AND its publishedAt
 * date is now or in the past. Future-dated posts are held back, which lets
 * us schedule a post by setting publishedAt ahead of time.
 *
 * IMPORTANT: this is a build-time gate. The site is statically generated, so
 * "now" is frozen at the moment of the build. A future-dated post only goes
 * live when a build runs on or after its date. A daily scheduled deploy is
 * what makes scheduling actually fire without a manual push: see
 * .github/workflows/scheduled-publish.yml, which pings a Cloudflare Pages
 * deploy hook every morning.
 */
export function isPublished(post: BlogPost, now: Date = new Date()): boolean {
  if (post.data.draft) return false;
  return new Date(post.data.publishedAt).getTime() <= now.getTime();
}

/** Sort newest-first by publishedAt. */
export function byNewest(a: BlogPost, b: BlogPost): number {
  return (
    new Date(b.data.publishedAt).getTime() -
    new Date(a.data.publishedAt).getTime()
  );
}

/** Sort oldest-first by publishedAt (used for prev/next navigation). */
export function byOldest(a: BlogPost, b: BlogPost): number {
  return (
    new Date(a.data.publishedAt).getTime() -
    new Date(b.data.publishedAt).getTime()
  );
}

/**
 * Every published blog post (non-draft, not future-dated), newest-first.
 * This is the single source of truth for "what is live on the blog" and
 * should be used by all blog routes, RSS, sitemap, and search indexing.
 */
export async function getPublishedPosts(now: Date = new Date()): Promise<BlogPost[]> {
  const posts = await getCollection("blog");
  return posts.filter((p) => isPublished(p, now)).sort(byNewest);
}
