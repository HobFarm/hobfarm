# Dragon’s Lair article: QA note

Browser review ran August 15, 2026 against a temporary local released-state build. The source was then restored to `2026-08-23T16:20:00-07:00` with `status: scheduled` before final validation.

## Viewports

- Desktop: 1440 by 1000 pixels.
- Mobile: 390 by 844 pixels.

## Results

- The route returned HTTP 200 in the released-state build.
- The title, canonical URL, Open Graph image, hero, article body, footnotes, support block, subscription block, and related articles rendered.
- All four `ArcadeFigure` components and all four expandable transcripts rendered.
- The desktop and mobile documents had zero horizontal overflow.
- The hero loaded through Cloudflare Image Resizing at both viewports.
- Related-article images loaded after their lazy-load regions entered the viewport.
- No browser console errors, page errors, or failed asset requests were observed.
- The desktop and mobile page captures were inspected visually. Figure columns stack correctly on mobile, labels remain readable, and the hardware sequence changes to a vertical path.

The temporary screenshots were kept outside the repository and are not publication assets.
