# The Feed Is the Problem: browser QA

Browser review used a temporary local released-state production build on August 17, 2026. The source was restored to `2026-08-22T16:20:00-07:00` and `status: scheduled` immediately after review.

## Results

- Desktop viewport: 1440 by 1000 pixels.
- Mobile viewport: 390 by 844 pixels.
- The article returned HTTP 200 with the expected title, H1, canonical URL, and Open Graph title.
- No horizontal overflow appeared at either width.
- All five body figures rendered with five expandable transcripts.
- The revised reader, platform, and creator cards displayed in three columns on desktop and stacked vertically on mobile.
- The Shorts threshold and Meta allegation callouts remained legible at 390 pixels.
- No missing images, browser console errors, or page errors appeared.
- Canonical URL: `https://hob.farm/articles/the-feed-is-the-problem/`.
- Open Graph image: `https://cdn.hob.farm/articles/the-feed-is-the-problem/social.webp`.

Temporary screenshots were stored outside the repository in the system temporary directory: `hobfarm-feed-desktop.png`, `hobfarm-feed-loop-desktop.png`, and `hobfarm-feed-loop-mobile.png`.
