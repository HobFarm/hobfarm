# HobFarm visual QA

Result: **PASSED**

## Source of truth

- Article-sharing screenshot attached to the August 6, 2026 build request.
- Homepage screenshot attached to the same request.
- Existing HobFarm rabbit assets: `https://cdn.hob.farm/brand/hobfarm-rabbit-hole-logo.mp4` with `https://cdn.hob.farm/brand/hobfarm-drip-logo.png` as its poster.

The screenshots were supplied in the conversation rather than as local files. The rebuilt pages were compared directly with those references during browser review.

## Viewports and routes

- Desktop: 1294 × 838
- Mobile: 390 × 844
- `/`
- `/articles/`
- `/articles/hermit-does-not-have-to-pay-for-repairs/`
- `/workshop/avatar-host/`

## Checks

- Homepage hero keeps the current animated rabbit identity and its dripping-rabbit poster. The rabbit appears during the eight-second loop.
- New hero copy fits above the fold without horizontal overflow at either viewport.
- Article sharing matches the supplied control set and visual treatment: Facebook, Instagram, X, Pinterest, Reddit, Copy link, Email, and the expandable share caption.
- Threads and Bluesky do not appear.
- The share caption expands correctly. The Copy link control reports `Copied` after use.
- The Articles page exposes a visible `Subscribe to articles` jump link.
- The RSS panel explains feed-reader use, opens `/rss.xml`, and reports `Feed address copied` after the copy action.
- The RSS panel and article share controls wrap cleanly on mobile with no horizontal overflow.
- The Avatar & Host hero identifies the article as the permanent source and the Codex project as the article-to-video production step. The hero media loads its poster when the video is not ready.

## Intentional differences from the screenshots

- Homepage wording was rewritten to foreground the article-to-production path requested in the task.
- RSS subscription controls were added below the article catalog and linked from the Articles introduction.
