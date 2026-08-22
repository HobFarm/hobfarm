# Hôtel de Sens site integration

## Canonical objects

- Article draft: `src/content/articles/hotel-de-sens-before-and-after.mdx`
- Article feature component: `src/components/articles/hotel-de-sens/HotelSensFeature.astro`
- Gallery draft: `src/content/gallery/before-and-after/hotel-de-sens.md`
- Research and production package: `content/before-after/hotel-de-sens/`

The article is the canonical public story. The gallery is a supporting visual archive, not a duplicate article.

## Asset locations

- Web images, 1600 px maximum long edge: `public/articles/hotel-de-sens-before-and-after/processed/`
- Thumbnails, 640 px maximum long edge: `public/articles/hotel-de-sens-before-and-after/thumbs/`
- Comparison pair and text-free social image: `public/articles/hotel-de-sens-before-and-after/comparison/`
- Structured captions and rights: `gallery.json`
- Source records: `sources.json`

The original institutional downloads are not committed. The stable original record URLs and rights statements remain in `sources.json`, which avoids keeping large source files in the repository while preserving provenance.

## Article layout

1. 1920 archival hero with full BnF credit.
2. Short opening that identifies what survived and what disappeared.
3. Interactive 1920/2016 comparison with the camera-position limitation next to it.
4. Labeled six-second generated transition between the documented frames.
5. Ten-item chronological visual archive.
6. Historical narrative: origin, later uses, purchase, clearance, restoration, and library conversion.
7. Explicit method note separating documentary images from the generated transition.
8. Related place-history articles and Support HobFarm.

The comparison is a native range control. It works with keyboard arrows and exposes an updating text value to assistive technology. Without JavaScript, the two images remain visible as a static half-and-half comparison.

## Gallery publication gate

The gallery entry remains `draft: true` because its existing template resolves media through `https://cdn.hob.farm/`. Before publication:

1. Upload the ten processed files to `https://cdn.hob.farm/articles/hotel-de-sens-before-and-after/processed/`.
2. Confirm that the gallery hero and thumbnail resolve through the CDN transformation layer.
3. Set the gallery date and `draft: false` only when publication is authorized.
4. Keep the article's local public paths or migrate them to the same CDN folder in one focused pass.

No upload, commit, push, or deployment is part of this draft build.

## Responsive image behavior

- Article derivatives are already capped at 1600 px on the long edge.
- Gallery thumbnails are capped at 640 px.
- The comparison pair is 1200×900 and uses a fixed 4:3 box to prevent layout shift.
- The social composite is 1200×630 and contains no baked headline.
- Archive images use explicit width and height, lazy loading, and `object-fit: contain` so portraits, landscapes, and the stereo pair remain uncropped.

## Accessibility

- Every image has descriptive alt text that identifies medium and visible evidence.
- Captions distinguish photographs from prints, paintings, and drawings.
- Credits and source records are links, not image-only labels.
- The comparison input has a visible focus outline and a changing `aria-valuetext`.
- The page does not rely on color alone to identify dates or media.
- The published transition has no audio stream, narration, or meaningful on-screen text, so it does not need captions or a transcript.

## Generated transition policy

The generated transition is hosted at `https://cdn.hob.farm/workshop/before-and-after/scene/hotel-de-sens-before-and-after.mp4` and appears after the still comparison, not before the historical evidence. Its adjacent caption says "Generated visualization between documented stills. Not archival footage." The 1920 and 2016 source stills remain available outside the video player.

## Editorial filing

- Canonical section: Places & Systems
- Department: Before & After
- Workshop program: Before & After
- Series: none; this piece is not automatically assigned to Built Over
- Core subjects: built environment, place memory, regional history, social history, urban development, urban history
- Source artifact: Agence Meurisse photograph 80722, May 26, 1920
