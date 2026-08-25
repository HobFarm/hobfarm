# New Wave article completion report

## Publication record

- Title: **You're the guy from the hamburger train**
- Slug: `new-wave-future-of-rock-and-roll`
- Canonical route: `/articles/new-wave-future-of-rock-and-roll/`
- Department and section: Essays & Arguments / Music
- Status: scheduled
- Publication: September 9, 2026 at 4:20 p.m. America/Los_Angeles (`2026-09-09T16:20:00-07:00`)
- Queue relationship: exactly 24 hours after *Print Is Dead. I Collect Spores, Molds and Fungus.*
- Dek: A line from *Nice Dreams* became the opening of a Primus song. The same restaurant scene leads into a transatlantic mesh that helped build the sound of the 1980s.
- Reader-visible article text before the source list: 5,163 words in the review build, including captions, comparison notes, and diagram text equivalents. The authored MDX body is approximately 4,405 words before generated component text.

The article opens with Howie's “hamburger train” line and speech, places the matching Primus song beside the scene, moves through the Reubens comedy and screen-music bridge, defines the route's limits, follows Eno and Moroder as distinct routers, maps the transatlantic exchange, explains the XTC-to-Gabriel production transfer, visits early-1980s King Crimson and Japan, places representative adjacent branches, presents the four original-versus-cover comparisons, returns through film and television, uses “Giorgio by Moroder” as a listening coda, and lands on Springsteen remaining inside the future.

## Media and graphics

The article starts with the NOW PLAYING YouTube object `ICzJOmFRoJc` at 9:21. It uses a privacy-enhanced, click-to-load iframe with autoplay disabled and a direct timestamped link. The supplied film still remains only in the preserved handoff.

The four Spotify comparison modules contain only these pairs:

1. XTC, “Making Plans For Nigel” / Primus, “Making Plans For Nigel”
2. XTC, “Scissor Man” / Primus, “Scissor Man”
3. Peter Gabriel, “Intruder” / Primus, “Intruder”
4. Peter Gabriel, “The Family And The Fishing Net” / Primus, “The Family And The Fishing Net”

Primus's “Hamburger Train” from *Pork Soda* is a separate scene-sample receipt, not a fifth cover comparison. Its exact Spotify object is paired with the author-supplied identification of Reubens's line from the same restaurant scene. “Giorgio by Moroder” is the tenth and final Spotify object. Every player is click-to-load, every exact track has a direct link, and no playlist, duplicate, alternate “Intruder,” or unrelated Primus track is bundled into a module.

Six original editorial graphics were created locally: the hero, typed-edge mesh, transatlantic map, XTC/Gabriel production-transfer diagram, Reubens bridge, and timeline. Each diagram has alt text, a caption, a visible text equivalent, and a full-size lightbox path. The hero has wide, social, portrait, and square derivatives. No actor likeness, album art, studio logo, paid generation, copied audio, or copied film frame appears in the public assets.

## Evidence, rights, and assets

- Article source list: 36 entries; every numbered reference resolves.
- Unique outbound source URLs: 35 checked, 35 reachable, 0 unresolved in the final link audit.
- Source ledger: 40 data rows.
- Typed network ledger: 41 data rows.
- Timeline: 14 events.
- Track ledger: 10 exact Spotify objects.
- Rights ledger: 11 decisions.
- Public asset manifest: 10 files; every byte count and SHA-256 checksum matches.
- R2: 10 isolated future keys recorded under `articles/new-wave-future-of-rock-and-roll/`; no key collision and no upload or overwrite performed.
- Preserved handoff: 13 packet files copied unchanged under `handoff/`.

The final integrity audit passes. It confirms the exact track set, source-reference bounds, zero Unicode em dashes in the article, unique R2 keys, isolated prefix, and matching local asset checksums.

## Browser QA

The scheduled source was rendered through `npx astro build --mode review` and served at the canonical route through the normal preview server.

- 1440, 1024, 768, and 390 pixel widths: HTTP 200, correct title and H1, no horizontal overflow, four comparison modules, ten Spotify controls, five diagram text equivalents, and one video control.
- Initial page state: zero iframes.
- Keyboard tests: the “Hamburger Train” control loaded only `0tdWYwH8xIOoSeNoEz7QqV`; the first comparison control loaded only `1XT5kxg6Tk0ukCO2vBQN4v` with encrypted-media permission.
- Video test: loaded `youtube-nocookie.com/embed/ICzJOmFRoJc` with `start=561` and `autoplay=0`.
- Failure path: exact Spotify and YouTube links remained after iframe creation.
- JavaScript disabled at 390 pixels: full article, transcript, conclusion, ten exact Spotify links, and timestamped video link remained readable; iframe count stayed zero.
- Heading order: no level jumps in the article.
- Dark theme: visually inspected at desktop and mobile sizes. The article uses its intended dark editorial treatment; there is no separate light variant.

Evidence is stored in `browser-qa.json`, `qa-desktop-1440.png`, `qa-mobile-track-pair-390.png`, and `qa-mobile-hamburger-train-390.png`.

The repository's current Cloudflare development runner exits before serving any page with `Missing field moduleType`. The review build mode is the working local path: run `npx astro build --mode review`, then `npm run preview`. A normal `npm run build` was restored afterward and correctly excludes the scheduled route before its publication instant.

## Validation

- `npx astro check`: 719 files, 0 errors, 0 warnings, 0 hints.
- `npm test`: 351 passed, 0 failed.
- `npm run build`: passed in normal production mode after review QA.
- `npx astro build --mode review`: passed and generated the canonical scheduled route for review.
- `npm run audit:editorial-mesh`: 87 published or scheduled articles, 88 files, 0 errors, 0 warnings.
- `npm run audit:site-structure`: 829 routes, 71 released articles, 0 errors, 0 warnings, 0 orphans.
- `node .tmp/new-wave-link-audit.mjs`: 35 of 35 unique source URLs reachable.
- `node .tmp/new-wave-integrity.mjs`: pass.
- `git diff --check`: included in the final repository audit.

## Files changed or created

Article implementation:

- `src/content/articles/new-wave-future-of-rock-and-roll.mdx`
- `src/data/new-wave-article.ts`
- `src/components/articles/new-wave/HearTheMesh.astro`
- `src/components/articles/new-wave/HamburgerTrainReceipt.astro`
- `src/components/articles/new-wave/NewWaveArticleStyles.astro`
- `src/components/articles/new-wave/NewWaveFigure.astro`
- `src/components/articles/new-wave/NewWaveSpotifyCoda.astro`
- `src/components/articles/new-wave/NewWaveVideo.astro`
- `src/components/articles/new-wave/TrackComparison.astro`
- `scripts/build-new-wave-assets.mjs`
- `package.json`

Editorial mesh and review support:

- `src/data/editorial-mesh.ts`
- `src/pages/articles/[...slug].astro`
- `tests/editorial-mesh.test.mjs`
- `reports/site-structure/audit.md`
- `reports/site-structure/orphans.json`
- `reports/site-structure/route-inventory.json`

Public assets:

- `public/articles/new-wave-future-of-rock-and-roll/01-new-wave-future-hero-master.svg`
- `public/articles/new-wave-future-of-rock-and-roll/01-new-wave-future-hero-v1.webp`
- `public/articles/new-wave-future-of-rock-and-roll/01-new-wave-future-social-v1.png`
- `public/articles/new-wave-future-of-rock-and-roll/01-new-wave-future-portrait-v1.webp`
- `public/articles/new-wave-future-of-rock-and-roll/01-new-wave-future-square-v1.webp`
- `public/articles/new-wave-future-of-rock-and-roll/02-new-wave-mesh-v1.svg`
- `public/articles/new-wave-future-of-rock-and-roll/03-transatlantic-new-wave-map-v1.svg`
- `public/articles/new-wave-future-of-rock-and-roll/04-xtc-gabriel-drum-transfer-v1.svg`
- `public/articles/new-wave-future-of-rock-and-roll/05-reubens-new-wave-bridge-v1.svg`
- `public/articles/new-wave-future-of-rock-and-roll/06-new-wave-timeline-v1.svg`

Task records:

- `reports/new-wave-future-of-rock-and-roll/asset-manifest.json`
- `reports/new-wave-future-of-rock-and-roll/browser-qa.json`
- `reports/new-wave-future-of-rock-and-roll/completion-report.md`
- `reports/new-wave-future-of-rock-and-roll/editorial-decisions.md`
- `reports/new-wave-future-of-rock-and-roll/integrity-audit.json`
- `reports/new-wave-future-of-rock-and-roll/link-audit.json`
- `reports/new-wave-future-of-rock-and-roll/network-edges.csv`
- `reports/new-wave-future-of-rock-and-roll/qa-desktop-1440.png`
- `reports/new-wave-future-of-rock-and-roll/qa-mobile-track-pair-390.png`
- `reports/new-wave-future-of-rock-and-roll/qa-mobile-hamburger-train-390.png`
- `reports/new-wave-future-of-rock-and-roll/rights-ledger.csv`
- `reports/new-wave-future-of-rock-and-roll/source-ledger.csv`
- `reports/new-wave-future-of-rock-and-roll/timeline.json`
- `reports/new-wave-future-of-rock-and-roll/track-ledger.json`
- `reports/new-wave-future-of-rock-and-roll/handoff/` containing the 13 unchanged packet files.

## Author review and unresolved receipts

- The Spotify object for XTC's original “Scissor Man” is the requested recording, but Spotify labels the object “Scissor Man - 2001 Digital Remaster.” The article displays the original 1979 song and album; the exact platform label remains in the track ledger.
- The new on-page and metadata title is preserved exactly as supplied. Howie's profane Springsteen line remains unsanitized inside the article.
- A final human ear check of the five transcript lines against the film and the opening sample against “Hamburger Train” is recommended immediately before publication. The article follows the author's supplied observations and preserves the “all up” versus “whole thing up” distinction.
- The external YouTube and all ten Spotify objects were verified on August 25, 2026. Their future availability, territory rules, and platform titles remain outside HobFarm's control; direct links and readable fallbacks are in place.
- The Cloudflare local dev-runner error remains a repository environment issue. It does not affect the production build or the review-build preview route.

No claim or asset was excluded because it was profane, adult, obscure, copyrighted, visually ambiguous, or culturally messy. Exclusions and narrow treatments have specific evidence, rights, or technical reasons in the decision and rights ledgers.

No repository instruction conflict required an override. The handoff's preferred R2 publishing path remained preparatory because the user's current request expressly prohibited R2 writes and deployment without separate approval.

No commit, push, deployment, merge, R2 write, paid call, or public publication occurred.
