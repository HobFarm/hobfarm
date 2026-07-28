# Put On the Glasses completion report

## Article

- Title: **Put On the Glasses**
- Slug: `put-on-the-glasses`
- File: `src/content/articles/put-on-the-glasses.md`
- Department: Essays & Arguments
- Format: Article / feature
- Body length: 3,556 words
- Status: Scheduled
- Publication time: July 30, 2026 at 5:20 p.m. Pacific
- Machine timestamp: `2026-07-30T17:20:00-07:00`
- Schedule relationship: exactly 24 hours after *Too Big for the Box*

The article follows the requested ten-section film-and-technology arc. It uses
all nine supplied film frames, a 31.82-second optimized excerpt with a poster
frame, the original hero, and a dated then-and-now Atheer comparison. It links
to *Too Big for the Box*, *Brought to You by They, Inc.*, and *The Card Catalog
Started Talking Back*.

## Research and claim handling

The article frontmatter contains 23 source notes. The supporting claim ledger
is in `reports/put-on-the-glasses/claim-ledger.md`.

Material limits retained in the published copy:

- The Roddy Piper retweet is labeled as a personal recollection without a
  recovered screenshot or exact date.
- The Atheer campaign total is rounded to about $214,000 because contemporary
  records differ slightly.
- Atheer's current performance percentages are labeled as provider claims that
  HobFarm did not independently verify.
- The "open-source glasses" language is identified as the author's metaphor,
  not a claim about the film's dialogue or a literal software license.
- No direct Buck Flower and Dick Miller collaboration is claimed.

## Media and R2

The upload used the repository's protected new-key-only manifest workflow.
Every new object was checked for absence before upload and verified afterward
by HTTP status, MIME type, cache policy, byte count, and SHA-256. Existing film
frames were not overwritten.

New verified objects:

| Object | Purpose |
| --- | --- |
| `articles/they-live/they-live-hero.png` | Hero and social image |
| `articles/they-live/they-live-clip-web.mp4` | Web-optimized film excerpt |
| `articles/they-live/they-live-clip-poster.jpg` | Video poster |
| `articles/they-live/atheer-one-2013.jpg` | 2013 Atheer comparison image |
| `articles/they-live/atheer-work-execution-2026.png` | July 27, 2026 Atheer site capture |

The asset manifest is in
`reports/put-on-the-glasses/asset-manifest.json`.

## Original hero generation

- Tool: built-in OpenAI image generation
- Model: provider-managed image generation model; the exact model identifier
  was not returned
- Calls: 2
- Selected generated file:
  `C:\Users\xkxxk\.codex\generated_images\019fa6cb-9b52-7e72-a8c1-c62c4556b44b\call_Bkd2NCVzK8GkgYozGUqoRPe6.png`
- Saved project file: `assets/put-on-the-glasses/they-live-hero.png`

Initial prompt:

> Create a polished wide 16:9 editorial hero illustration for a HobFarm long-form article titled “Put On the Glasses.” The composition is a stylized concept image, not a film still and not a likeness of any actor. On a handmade resistance workbench in a dim workshop, place a cheap pair of thick black sunglasses assembled beside small electronics, lenses, wire, tools, and cardboard boxes. The world outside and around the glasses is covered by an elegant colorful augmented-reality interface: navigation paths, shopping panels, product recommendations, workplace metrics, maps, notifications, and corporate dashboard shapes. Through one lens, the colorful interface is stripped away and replaced by a stark monochrome ownership diagram showing platforms, data stores, contracts, buyers, and control relationships. Make the visual idea immediately readable: the glasses are a user-controlled diagnostic tool that reveals who owns the layer between the person and the world. Cinematic editorial photography fused with precise technical illustration, realistic materials, restrained blue, cyan, magenta, and amber light, deep blacks, strong foreground silhouette, generous safe area for a dark text gradient on the lower left, fine detail, serious but inviting. No words, no letters, no numbers, no logos, no movie title, no OBEY signs, no Matrix code, no branded hardware, no human figure, no recognizable actor, no copyrighted character, no watermark.

Correction prompt:

> Preserve the composition, lighting, workbench, glasses, lenses, tools, boxes, and colorful augmented-reality panels exactly. Remove every accidental pseudo-letter, label, number, glyph, and fragment of writing from the interface and diagrams. Replace them with clean unlabeled geometric blocks, connector lines, charts, maps, and simple icons. The final image must contain no readable text, no pseudo-text, no letters, no numbers, no logos, and no watermark.

## Scheduling

The one-time GitHub Actions workflow is
`.github/workflows/publish-put-on-the-glasses.yml`. It runs at 00:25 UTC on
July 31, 2026, five minutes after the target publication time, and calls
`scripts/publish-scheduled-put-on-the-glasses.mjs`. The script refuses to
publish if the article timestamp changes or the scheduled time has not arrived.
After publication it removes the one-time workflow and commits the status
change.

The workflow is prepared in the local worktree. It will not exist on GitHub
until the user chooses to commit and push these changes.

## Validation

- `npm test`: 196 tests passed
- `npx astro check`: 0 errors, 0 warnings, 0 hints
- `npm run build`: passed
- `git diff --check`: passed
- Desktop browser QA: HTTP 200, 14 content images loaded, video metadata and
  playback verified, no horizontal overflow, no page errors
- Mobile browser QA at 390 by 844: HTTP 200, 14 content images loaded, video
  metadata and playback verified, comparison pairs stacked to one column, no
  horizontal overflow, no page errors

The article was made temporarily visible only in the local dev server for the
browser pass. Its exact scheduled status and publication timestamp were
restored afterward.
