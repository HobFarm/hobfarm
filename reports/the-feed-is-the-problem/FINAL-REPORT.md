# The Feed Is the Problem: final production report

## Publication

- **Title:** The Feed Is the Problem
- **Canonical route:** `/articles/the-feed-is-the-problem/`
- **Schedule:** August 22, 2026 at 4:20 p.m. PDT (`2026-08-22T16:20:00-07:00`)
- **Predecessor:** Hit the Source Directly, exactly 24 hours earlier
- **Successor:** Dragon's Lair is better on YouTube, exactly 24 hours later
- **Length:** 3,437 narrative words; 3,879 body words including source-note definitions and imports
- **Editorial section:** Culture
- **Strict series:** none

The requested six-day sequence remains August 21 through 26: Hit the Source Directly, The Feed Is the Problem, Dragon's Lair is better on YouTube, EZIZE, Deserts Remember Water, and The Salton Sea Needs an Outlet. Every adjacent publication timestamp differs by 86,400 seconds.

## Editorial revision

The medication and treatment-prevalence section was removed completely, along with its three source notes and related metadata language. Therapy remains only as a bounded downstream reference; the article does not present doomscrolling as the sole reason anyone needs care.

`The question moved upstream` now states the narrower mechanism: social feeds can contribute to, amplify, or prolong distress while the platform records and monetizes the session. The article links that system to the earlier HobFarm investigation `The Slop Machine`.

`Ten million views or zero` explains YouTube's February 1, 2027 Shorts rule. It distinguishes the continuing 10 million qualified-view revenue threshold from the 20 million qualified-view entry threshold, states the rolling 90-day window, explains that a below-threshold channel remains in YPP while Shorts advertising and subscription revenue pauses, and keeps long-form revenue separate. Creator response is presented as incentive-driven interpretation, not universal behavior. It links to `How the Money Eats the Medium`.

`While I was writing this, the argument went to court` uses the current August 17 status: jury selection had begun, opening statements were scheduled for August 18, and the first four cases were California, Colorado, Kentucky, and New Jersey. The youth allegations remain attributed and bounded, Meta's denial appears, and the business-model figures come from Meta's own SEC filings. The draft omits the proposed $1.4 trillion figure.

The conclusion now distinguishes lookup from feed use, documents the author's ad blocking and limited social scrolling, describes social platforms as databases with bad front doors, and notes that RSS often reaches a source before its newsletter or social promotion. It keeps HobFarm's own site, feeds, and subscriber list as the practical independence strategy without presenting RSS as pure or asking readers to delete every account.

Metadata descriptions and share-facing copy were revised to remove medication and treatment-prevalence language. The title, canonical, Culture classification, no-series status, and explicit related-article overrides remain unchanged.

## Sources and links

Added source notes cover the official YouTube policy and Help pages, Cartoon Brew's creator example, the federal MDL court page, current AP and NPR trial reporting, PetaPixel as the RSS origin artifact, and Meta's 2025 10-K and second-quarter 2026 10-Q. Medication-only CDC and survey sources were removed. All 24 article URLs were checked; every new URL returned HTTP 200. Three older DOI endpoints returned bot-blocking HTTP 403 responses but had no DNS, transport, or server failure.

Contextual article links now include `The Slop Machine` and `How the Money Eats the Medium`; the existing link to `Hit the Source Directly` remains.

## Visual and media result

The existing HTML and CSS feedback-loop figure was revised in place to show reader cost, platform advertising value, creator production pressure, the Shorts revenue gate, and the attributed Meta legal question. Its caption, source label, text transcript, and accessible label were updated. It requires no R2 object and passed 390-pixel mobile review.

The existing hero and social objects were reused unchanged. No R2 object was created, overwritten, or deleted.

- Hero: `https://cdn.hob.farm/articles/the-feed-is-the-problem/hero.webp`, SHA-256 `6313ac67f9e815152b9c2d3b81e68b92a0bc9bf29b46a1c0f661136e79114378`
- Social: `https://cdn.hob.farm/articles/the-feed-is-the-problem/social.webp`, SHA-256 `a5cf07c5ce464564daa78dd31ad09a0f58d0a60db090cf0a0e3c7c8113c9c574`
- Live loop figure source: SHA-256 `f439622c566ff79b137b35d3d7c2438405ad46761e65b47756a0eb673a769b75`

## Validation

- `npx astro check`: 676 files, zero errors, warnings, or hints.
- `npm test`: 340 of 340 tests passed.
- Scheduled-state `npm run build`: passed.
- Editorial Mesh audit: 76 published or scheduled articles, zero structural errors and zero review warnings.
- Site-structure audit: 762 routes, 63 released articles, zero structural errors, zero review warnings, and zero orphans.
- The scheduled build excludes this article's route from RSS, search, and sitemap output before release.
- Footnote audit: 20 references, 20 definitions, no missing or unused notes.
- Browser QA: HTTP 200 at 1440 by 1000 and 390 by 844 pixels, no horizontal overflow, five figures and five transcripts, no broken images, and no console or page errors.
- `git diff --check`: passed before publication handoff.
- Public article copy contains no Unicode em dashes.

The existing scheduled workflow remains responsible for the release-time status change and normal Cloudflare Pages build. No schedule change, force-push, paid operation, medication advice, R2 upload, or R2 overwrite was performed.
