# The Feed Is the Problem: final production report

## Publication

- **Title:** The Feed Is the Problem
- **Canonical route:** `/articles/the-feed-is-the-problem/`
- **Schedule:** August 22, 2026 at 4:20 p.m. PDT (`2026-08-22T16:20:00-07:00`)
- **Predecessor:** Hit the Source Directly, exactly 24 hours earlier
- **Successor:** Dragon's Lair is better on YouTube, exactly 24 hours later
- **Length:** 2,783 narrative words before source-note definitions; 3,089 body words including notes and imports
- **Editorial section:** Culture
- **Strict series:** none

The schedule was amended on August 15 to place Dragon’s Lair on August 23. The resulting sequence is RSS on August 21, this follow-up on August 22, Dragon’s Lair on August 23, EZIZE on August 24, Deserts Remember Water on August 25, and The Salton Sea Needs an Outlet on August 26. Every adjacent timestamp differs by 86,400 seconds.

## Editorial result

The article begins with the author's Thunderbird source folders and the Phys.org doomscrolling story they delivered. It follows the evidence through post-scroll rumination, ambiguous dwell-time signals, negative headline experiments, bidirectional mood and browsing, Reddit differentiation pressure, creator adaptation, YouTube's economic scale, ASU's Content Creation BA, mental-health treatment surveys, relationships, and a return to reader-chosen RSS sources.

The final argument does not claim that social media caused increased therapy or medication. It keeps treatment categories separate, distinguishes association from causation, scopes experimental results to their studied settings, labels the complete feedback loop as cross-study synthesis, and rejects friendship as a cure or treatment substitute.

The Editorial Mesh pass assigns Culture because the article's central object is the ranked public feed as a cultural and economic system. Eight material subjects, nine entities, one origin artifact, and two explicit related articles support discovery. It has no Magazine Time Machine or 3DM membership.

## Visual and media result

The hero and social image are deterministic WebP derivatives of an original source-controlled HobFarm SVG. Five responsive body figures use HTML and CSS, selectable labels, captions, and expandable transcripts. Solid paths identify measured relationships; dotted paths identify the article's synthesis.

Both CDN objects were checked as absent before upload, written under `articles/the-feed-is-the-problem/`, retrieved publicly, content-type checked, and SHA-256 verified. The upload did not overwrite or delete an existing object. No private screenshot, identifiable social post, stock photograph, third-party logo, or paid image-generation service is used.

## Publication automation

The existing one-time GitHub Actions pattern now covers August 21 through 26. Each workflow checks its article's exact timestamp, refuses to publish early, changes `status: scheduled` to `status: published` after the release instant, removes itself and its paired script, commits the release, and pushes `main` to trigger the normal Cloudflare Pages build.

The final pre-release build correctly excludes this article from its route, combined RSS feed, public mesh, and sitemap. The release-time boundary test changes from private to public at the exact scheduled instant.

## Validation

- `npx astro check`: 667 files, zero errors, warnings, or hints.
- `npm test`: 331 of 331 tests passed.
- `npm run build`: passed after restoring the final timestamp.
- Editorial Mesh audit: 72 published or scheduled articles, zero structural errors and zero review warnings.
- Site-structure audit: 738 routes, 61 released articles, zero structural errors, zero review warnings, and zero orphans.
- Workflow YAML: all five UTC cron expressions parsed and matched the corresponding 4:20 p.m. PDT dates.
- `git diff --check`: passed.
- Public copy contains no Unicode em dashes.

Browser QA covered 1440 by 1000 and 390 by 844 pixel viewports. There was no horizontal overflow, all five figures and transcripts rendered, all images loaded, canonical and social metadata were present, and no browser console or page errors occurred. The temporary local release date used for browser review was restored before the final build.
