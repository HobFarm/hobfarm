# Dragon’s Lair article: final production report

## Publication

- **Title:** Dragon’s Lair Was Better Once We Stopped Playing It
- **Canonical route:** `/articles/dragons-lair-was-better-once-we-stopped-playing-it/`
- **Schedule:** August 23, 2026 at 4:20 p.m. PDT (`2026-08-23T16:20:00-07:00`)
- **Predecessor:** The Feed Is the Problem, exactly 24 hours earlier
- **Successor:** I Stopped Writing Prompts and Built a Machine Instead, exactly 24 hours later
- **Length:** 1,763 body words including footnote definitions and the component import
- **Editorial section:** Technology
- **Strict series:** none

Deserts Remember Water moved to August 25 and The Salton Sea Needs an Outlet moved to August 26. Their workflow crons, exact timestamp guards, source dossiers, asset metadata, and schedule tests moved with them. EZIZE remains on August 24.

## Editorial result

The article begins with an RSS-delivered Boing Boing headline and tests its theoretical fifty-cent completion claim against the remembered cost of learning Dragon’s Lair. The personal arcade canon remains specific: Spy Hunter, Rampage, Gauntlet, Ghosts ’n Goblins, Altered Beast, and repeated LED Storm competitions. Don Bluth’s animation is treated as the cabinet’s achievement, while the argument stays centered on price, control constraints, LaserDisc playback, and the move from paid attempts to owned and modifiable home software.

The article does not claim that difficulty itself was the problem. It distinguishes a hard responsive action game from a narrow memorization loop and ends with the later YouTube viewing experience that let the animation operate as a movie.

The Editorial Mesh assigns Technology because the game hardware and transaction own the argument. Five subjects, 17 entities, one origin artifact, four explicit related articles, and two story modes support discovery. There is no Magazine Time Machine or 3DM membership.

## Visual and rights result

The hero and social image are deterministic WebP derivatives of an original source-controlled HobFarm SVG. Four body figures use live HTML and CSS, selectable labels, captions, responsive layouts, and expandable transcripts.

No Dragon’s Lair animation, game screenshot, cabinet art, logo, advertisement, third-party photograph, or YouTube thumbnail is rehosted. Museum, publisher, and archive pages remain linked sources only.

Both CDN objects were checked as absent before upload, written under `articles/dragons-lair-was-better-once-we-stopped-playing-it/`, retrieved publicly, content-type checked, and SHA-256 verified. No existing R2 object was overwritten, moved, renamed, or deleted.

## Publication automation

The six one-time workflows cover August 21 through 26. Each workflow verifies its article’s exact timestamp, refuses to publish early, changes `status: scheduled` to `status: published` only after the release instant, removes itself and its paired script, commits the release, and pushes `main` to trigger the normal production build.

The final scheduled-state build excludes the Dragon’s Lair route from the combined RSS feed, sitemap, search index, and public route output. The release-boundary test changes from private to public at the exact scheduled instant.

## Validation

- `npx astro check`: 669 files, zero errors, warnings, or hints after a successful isolated rerun. The first combined invocation hit a transient Vite cache-cleanup logger error after all focused tests had passed.
- `npm test`: 337 of 337 tests passed.
- `npm run build`: passed in the final scheduled state.
- Editorial Mesh report: regenerated for 73 published or scheduled articles.
- Editorial Mesh audit: zero structural errors and zero review warnings.
- Site-structure audit: 745 routes, 62 released articles, zero structural errors, zero review warnings, and zero orphans.
- Workflow YAML: all six UTC cron expressions parse and match their 4:20 p.m. PDT dates and script guards.
- `git diff --check`: passed.
- Public article copy contains no Unicode em dashes.

Browser QA covered 1440 by 1000 and 390 by 844 pixel viewports. The page had no horizontal overflow, all four figures and transcripts rendered, lazy images loaded after scrolling, canonical and social metadata were present, and no browser console, page, or asset-request errors occurred. The temporary released-state metadata was restored before the final build.
