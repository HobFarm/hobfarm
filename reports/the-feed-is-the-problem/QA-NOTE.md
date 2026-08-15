# The Feed Is the Problem: browser QA

Browser review used a temporary local released-state build on August 14, 2026. The source was then restored to `2026-08-22T16:20:00-07:00` before the final production build.

## Results

- Desktop viewport: 1440 by 1000 pixels.
- Mobile viewport: 390 by 844 pixels.
- No horizontal overflow at either width.
- All five body figures rendered with five expandable transcripts.
- No missing images, browser console errors, or page errors.
- Canonical URL: `https://hob.farm/articles/the-feed-is-the-problem/`.
- Open Graph image: `https://cdn.hob.farm/articles/the-feed-is-the-problem/social.webp`.
- Two JSON-LD blocks were present, including the Article graph and breadcrumbs.
- Hero alt text is present in rendered HTML and the social image has matching Open Graph and Twitter alt metadata.
- The subscription module remains usable at 390 pixels and both feed addresses wrap inside their cards.

Artifacts: `qa-desktop.png`, `qa-mobile-hero.png`, `qa-mobile-loop.png`, and `qa-mobile-subscribe.png`.
