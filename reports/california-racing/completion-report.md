# California Used to Race Here completion report

Completed locally on July 25, 2026.

## Branch and publication status

- Branch: `feat/california-racing-article`
- Commit: no commit created.
- Merge: not run.
- Production deployment: not run.
- Article file:
  `src/content/articles/california-used-to-race-here.mdx`
- Local route:
  `http://127.0.0.1:4321/articles/california-used-to-race-here`
- Canonical route:
  `https://hob.farm/articles/california-used-to-race-here/`

## Implementation

- Added the 5,265-word article to the existing Articles collection.
- Adapted the supplied frontmatter to the live content schema and kept the
  article in Magazine Time Machine.
- Preserved the first-person Farmers Market discovery, Plank Road prologue,
  board-track chronology, Third and Fairfax distinction, postwar speed story,
  film contrast, lowrider distinction, survival models, and land-use coda.
- Integrated 24 distinct CDN image URLs into 27 image placements.
- Added seven accessible, static HTML/CSS visuals:
  1. board-track land cycle;
  2. Third and Fairfax layer diagram;
  3. Southern California speed machine;
  4. *The Love Bug* / *Pit Stop* production-history comparison;
  5. replacement-use cards;
  6. Southern California track map;
  7. 1910-2026 timeline.
- Added reusable article figure and image-group components.
- Extended `ArticleLayout.astro` with an uncropped archive viewer, wrapping for
  long source links, and correct stretching for article-wide visual modules.
- Converted the draft source definitions into 27 named links.

## Editorial decisions

- The Grove is described as roughly occupying the former drive-in area.
  Television City is tied to the former Gilmore Stadium parcel.
- The Plank Road is part of the San Diego-Imperial-Yuma automobile corridor,
  not claimed as the exact modern I-8 alignment.
- Current-use labels describe broad former sites or districts and are not
  parcel surveys.
- Track closures retain different causes: leases, economics, noise, surrounding
  development, safety, and changing use.
- Lowriding keeps its own Mexican American and Chicano club, neighborhood,
  artistic, family, and political history.
- Solar production counts and museum lowrider biography details were omitted.

## Source and film audit

`source-audit.md` records the main claim checks and narrowed language. The final
article has 27 linked sources.

No film frames were used. D23 supports the broad *Love Bug* production
locations, and AFI supports *Pit Stop* at Ascot and around Los Angeles. The
article does not assign a specific unverified frame to a track, so timestamped
film-frame records were unnecessary.

The Third and Fairfax visual uses Farmers Market history, the Los Angeles
Conservancy Television City assessment, and Pan-Pacific history. It labels its
parcel arrangement as schematic.

## New R2 objects

| Key and public URL | MIME and dimensions | SHA-256 | Basis and credit |
| --- | --- | --- | --- |
| `articles/california-racing/beverly-hills-1920-bennett-hill.jpg`<br>`https://cdn.hob.farm/articles/california-racing/beverly-hills-1920-bennett-hill.jpg` | image/jpeg, 1200×715 | `7af1cec4612c6e4e90f54bbd060d79ec550a3b982ee43fb7d11e75468868ceb7` | Public domain. Unknown photographer, via Wikimedia Commons. |
| `articles/california-racing/pan-pacific-auditorium-entrance-habs.jpg`<br>`https://cdn.hob.farm/articles/california-racing/pan-pacific-auditorium-entrance-habs.jpg` | image/jpeg, 2048×1598 | `50d3d4d38359ea809bd633b5c2486cd4fbc4065d8e73d3c55faef5ff5d9dbc5a` | Public-domain United States government work. Marvin Rand, HABS, Library of Congress/NPS. |
| `articles/california-racing/playa-del-rey-motordrome-1910-bystander.jpg`<br>`https://cdn.hob.farm/articles/california-racing/playa-del-rey-motordrome-1910-bystander.jpg` | image/jpeg, 750×470 | `f598b9703ed12601f0988fbb0b59e5971deebe37310dba26da1f0c5668948521` | Public domain. *The Bystander*, May 25, 1910, via Wikimedia Commons. |
| `articles/california-racing/playa-del-rey-motordrome-1914-map.jpg`<br>`https://cdn.hob.farm/articles/california-racing/playa-del-rey-motordrome-1914-map.jpg` | image/jpeg, 750×750 | `741d4fbc6a41495ae79908a0dc9ab57bd0db18833fd0e4ab8e1153fb4cc3a8ca` | Public domain. Automobile Club of Southern California, 1914 route map, via Wikimedia Commons. |

All four uploads returned HTTP 200, the expected JPEG MIME type, and matching
public-response checksums. Existing R2 objects were not overwritten.

## Validation

- `npx astro check`: passed, 0 errors, 0 warnings, 0 hints.
- `npm test`: passed, 185 tests.
- `npm run build`: passed.
- Existing repository warning: the `adventures` collection is empty. This task
  did not introduce it.
- Browser QA: passed at 1440, 1024, 768, and 390 pixels.
- Final mobile document width matched the layout viewport with no horizontal
  page scroll.
- Browser media check: 0 broken images.
- Metadata check: canonical, Open Graph image, Twitter large card, Article
  JSON-LD, and BreadcrumbList JSON-LD are present.
- Accessibility spot check: one `h1`, no heading-level skips, 27 alt
  attributes, 27 captions, and static text fallbacks for every diagram.

## Deliberately left out

- An original collage hero was not added. The verified 1941 Gilmore night-race
  photograph already gives the page a strong documentary lead without
  manufacturing another asset.
- The *Xanadu* poster, film frames, unverified football advertisement, archive
  metadata scans, and museum biography panel remain unpublished.
- Riverside and Ascot image leads were not forced into the package after the
  selective second-pass downloads became unstable.
- Screenshot files were not committed; desktop and mobile renders were
  inspected in Chrome.

## Final state

The article is ready for local editorial review. No merge, commit, production
deployment, Cloudflare Pages change, or DNS change was performed.
