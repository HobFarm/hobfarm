# Browser QA: The Censor Eats Its Own Tail

Status: passed on July 22, 2026.

The article was temporarily given a past publication date so the production preview could render it. The final source now uses `status: published` with `publishedAt: 2026-07-22T05:25:57-07:00` for immediate release.

## Rendered viewports

| Viewport | Page overflow | Gate ladder | Comparison table |
| --- | --- | --- | --- |
| 1440 × 1000 | none | nine columns | full width |
| 1024 × 768 | none | nine columns | full width |
| 768 × 900 | none | three columns | local horizontal scroll |
| 390 × 844 | none | one column | local horizontal scroll |

## Checks

- Header, mobile navigation, article shell, footer, and support paths rendered.
- One `h1` was present. Article sections followed a coherent `h2`/`h3` hierarchy.
- All 15 rendered images completed with nonzero natural dimensions after a full-page lazy-load pass.
- Eight media figures exposed eight named lightbox buttons.
- The first archival figure opened in the lightbox and closed with Escape. Body scrolling was restored afterward.
- The comparison table exposed a named, focusable scroll region.
- Thirty numbered source notes rendered as 52 external links. No raw footnote syntax remained.
- Canonical URL, Open Graph title, description, image, URL, large Twitter card, and two JSON-LD blocks were present.
- The browser console contained no errors or warnings.
- The article diagrams are static. The shared navigation removes its transition under `prefers-reduced-motion: reduce`.
- HobFarm currently uses one dark editorial theme on this route; no light-theme control is exposed.

## Screenshots

- `screenshots/article-desktop-top-1440.png`
- `screenshots/article-desktop-gate-ladder.png`
- `screenshots/article-mobile-top-390.png`
- `screenshots/article-mobile-gate-ladder-390.png`

## Earlier scheduled-state check

Before immediate publication was approved, the future-dated build returned 404 for the article route and excluded the slug from the Articles index, RSS, search index, and sitemap. The final release build uses the published state and includes the route.
