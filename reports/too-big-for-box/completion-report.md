# Too Big for the Box completion report

Completed July 26, 2026.

## Repository state

- Branch: `main`
- Commit status: uncommitted. The project instructions require work on `main` and prohibit commits or pushes unless the user explicitly requests them.
- Merge status: no branch was created and no merge was run.
- Production status: the article is locally integrated and scheduled, but the site source and one-time GitHub Actions schedule have not been pushed.

## Article identity

- Title: **Too Big for the Box**
- Slug: `too-big-for-the-box`
- Route: `/articles/too-big-for-the-box/`
- Department: `essays-arguments` (Essays & Arguments)
- Format: `article`
- Word count: 5,410 words by the repository test's body-text counter
- Structure: 15 numbered sections, one original hero, and five supporting figures

## Publication schedule

The schedule was derived from the repository, not from the packet's likely date.

| Item | Local timestamp | UTC timestamp |
| --- | --- | --- |
| *I Could Be Playing Civilization* | `2026-07-28T17:20:00-07:00` | `2026-07-29T00:20:00Z` |
| *Too Big for the Box* | `2026-07-29T17:20:00-07:00` | `2026-07-30T00:20:00Z` |

Computed interval: `86,400,000 ms`, or exactly 24 hours. The new timestamp preserves the `-07:00` offset and the 17:20 local publication time.

The article remains `status: scheduled`. The prepared one-time workflow runs at `2026-07-30T00:25:00Z`, five minutes after the publication instant, verifies the exact timestamp, changes the status to `published`, removes its own workflow file, and pushes that publication commit to `main`.

## File-by-file summary

| File or group | Purpose |
| --- | --- |
| `src/content/articles/too-big-for-the-box.md` | Complete 15-section article, metadata, source notes, relationships, figures, captions, and accessibility text. |
| `.github/workflows/publish-too-big-for-box.yml` | One-time scheduled publication workflow following the repository's existing pattern. |
| `scripts/publish-scheduled-too-big-for-box.mjs` | Due-time guard and scheduled-to-published transition. |
| `tests/too-big-for-box-article.test.mjs` | Schedule, structure, evidence-boundary, link, asset, upload, and checksum tests. |
| `scripts/build-too-big-for-box-assets.mjs` | Reproducible builder for the four SVG diagrams and screenshot montage. |
| `scripts/build-too-big-for-box-manifest.mjs` | Manifest and checksum generator for public media and supplied references. |
| `package.json` | Adds asset-build, manifest, R2 dry-run, and R2 upload commands. |
| `assets/too-big-for-box/too-big-for-the-box-hero.jpg` | Original generated hero, converted from the generated PNG without changing the composition. |
| `assets/too-big-for-box/*.svg` | Four original editorial and technical diagrams. |
| `assets/too-big-for-box/claude-solved-capitalism-montage.png` | Editorial montage made from all seven supplied screenshots. |
| `assets/too-big-for-box/sources/*.jpg` | Seven renamed, hash-preserving copies of the supplied screenshots. These were not uploaded individually. |
| `reports/too-big-for-box/asset-manifest.json` | Public asset metadata, R2 keys, rights, checksums, and upload verification. |
| `reports/too-big-for-box/reference-manifest.json` | Source screenshot names, original names, checksums, editorial-use limits, and evidence notes. |
| `reports/too-big-for-box/claim-ledger.md` | Thirty-six claim decisions separating fact, first-person evidence, inference, opinion, speculation, and unsupported claims. |
| `reports/too-big-for-box/completion-report.md` | This completion record. |

No unrelated files were edited.

## Sources and internal links

The article carries 20 source notes: Computer History Museum on *Adventure*; Tim Anderson's participant history of *Zork*; the Z-machine standard; Valve on *Civilization V* and Steamworks; Sony's PlayStation disc-production announcement; Rockstar's *GTA VI* edition documentation; Cloudflare's network description; the IEA data-center electricity projection; StrongDM's software-factory account; Simon Willison's independent technical report; the Entrepreneur contributor article; Wix's Base44 acquisition release; Meta's display-glasses developer preview and Orion announcement; NVIDIA CloudXR; the OpenAI Services Agreement; Cloudflare's self-serve terms; the U.S. Copyright Office's AI copyrightability report; and Project Gutenberg editions of *Alice's Adventures in Wonderland* and *Dracula*.

Internal links added:

- `/articles/everything-is-still-loading/`
- `/articles/take-me-to-phobos/`
- `/articles/gonna-be-different/`
- `/articles/i-could-be-playing-civilization/`
- `/articles/you-do-not-own-the-ai-you-pay-for/`
- `/articles/a-world-of-geniuses-needs-a-system/`
- `/articles/against-slop/`
- `/articles/how-to-fix-slop/`
- `/articles/how-psychedelia-went-beige/`

## Claim ledger summary

The 36-row ledger records repository facts, computed facts, first-person technical evidence, historical facts, participant recollections, provider and corporate claims, projections, opinions, speculation, and unsupported claims.

Material qualifications and removals:

- Restricted early network-game history to universities, laboratories, and ARPANET-connected hosts; removed the claim that every player used ARPANET directly.
- Kept the documented *GTA VI* code-without-disc fact; removed claims that the game is cloud-rendered or that package size caused the decision.
- Treated distributed cloud infrastructure as an analogy to the old host-and-terminal experience, not as one global mainframe.
- Labeled the IEA number as a central projection and provider descriptions as provider claims.
- Presented StrongDM's dark factory as a documented method used by an experienced team, not proof that unreviewed generated code is generally safe.
- Used the Instagram posts only as evidence that the public claims were made. The article does not decide whether the results are true, false, organic, typical, repeatable, or fraudulent.
- Kept the Base44 transaction receipt; removed the inference that an ordinary reader can copy the outcome through prompts.
- Distinguished contractual output assignment from copyrightability and preserved the Copyright Office's human-authorship limits.
- Preserved the real Wonder Machine boundary: blank input does nothing; waiting is explicit; packs are immutable; sessions are mutable; code owns state, time, routes, seeded outcomes, saves, and replay; language adapters cannot invent game effects.
- Explicitly states that Wonder Machine is not a deployed public cloud game.
- Treated wearable Wonder Machine use as a possible direction, not a product integration or solved deployment.

## Public visual assets

All public objects use new keys under the authorized `hobfarm-cdn/articles/too-big-for-box/` prefix. Public responses returned HTTP 200 with the recorded MIME types and `public, max-age=31536000, immutable`. Local, remote, and public-response SHA-256 values match.

| Asset | R2 key and public URL | MIME | Dimensions | Bytes | SHA-256 |
| --- | --- | --- | --- | ---: | --- |
| Hero | [`articles/too-big-for-box/too-big-for-the-box-hero.jpg`](https://cdn.hob.farm/articles/too-big-for-box/too-big-for-the-box-hero.jpg) | `image/jpeg` | 1672 × 941 | 734,043 | `7e85c4329bd8c99e7f0559b1a949853c3a532dfd71295dbf49eee26d5a4155d3` |
| Where the Game Lives | [`articles/too-big-for-box/where-the-game-lives.svg`](https://cdn.hob.farm/articles/too-big-for-box/where-the-game-lives.svg) | `image/svg+xml` | 1800 × 1050 | 7,555 | `52aacf75fb7722d342e380cae0567b09638076feecf9bb8d949ca093b193e737` |
| The Box Empties | [`articles/too-big-for-box/the-box-empties.svg`](https://cdn.hob.farm/articles/too-big-for-box/the-box-empties.svg) | `image/svg+xml` | 1800 × 1050 | 5,940 | `23e7bf5d0c73a75935be6fdfb8439f94f1e6bee4d6ed5f6da3142451b5328545` |
| Bounded Wonder Machine | [`articles/too-big-for-box/bounded-wonder-machine.svg`](https://cdn.hob.farm/articles/too-big-for-box/bounded-wonder-machine.svg) | `image/svg+xml` | 1800 × 1050 | 6,786 | `74a1127425ec17d5d1c0924986758f8eeb990b3912ec847a54e85bc9925de8d4` |
| Dark Factory / Bullshit Factory | [`articles/too-big-for-box/dark-factory-bullshit-factory.svg`](https://cdn.hob.farm/articles/too-big-for-box/dark-factory-bullshit-factory.svg) | `image/svg+xml` | 1800 × 1050 | 6,875 | `e1df290613f6bbb1273814b7a9bca5280d7b25fd77cd18b3a30177f01f7cc833` |
| Claim montage | [`articles/too-big-for-box/claude-solved-capitalism-montage.png`](https://cdn.hob.farm/articles/too-big-for-box/claude-solved-capitalism-montage.png) | `image/png` | 2000 × 2360 | 2,041,656 | `1d1063f4175b22fdfb4af16dcddad257b97a1149378735a39bb6b583eb25e03c` |

The upload command first checked every destination and found six unused keys. It then uploaded only those keys and verified each public response. No existing object was overwritten, renamed, or deleted.

## Screenshot treatment

All seven supplied Instagram screenshots were renamed descriptively and copied without altering their bytes; their SHA-256 checksums match the packet manifest. They were cropped and arranged into one documentary montage for criticism, commentary, and media analysis. The treatment foregrounds recurring income, audience, reach, and automation claims while the caption and article state that the underlying results were not independently verified.

The seven source screenshots remain local evidence files. They were not uploaded as standalone public objects, are not offered for resale, and are not presented as endorsements or proof of fraud. The exact filenames, source handles, claims visible, hashes, and editorial limits are recorded in `reference-manifest.json`.

## Generation record

- Hero provider: OpenAI image generation
- Hero calls: 1
- Exact model: the provider did not return a model identifier
- Reported call cost: not returned; no cost was guessed
- Prompt direction: a crop-safe 16:9 editorial cutaway moving from a PDP-10 and amber terminal through a logo-free disc-era strategy landscape and distributed servers to display glasses, a rabbit, and the first Wonderland door; no text, logos, or watermarks
- Supporting graphics: built locally from authored SVG and a deterministic Sharp montage script
- Supporting-graphic generative calls: 0
- Supporting-graphic API cost: $0

## Validation

| Check | Result |
| --- | --- |
| `npm test` | Passed: 192 tests, 0 failures |
| `npx astro check` | Passed: 489 files, 0 errors, 0 warnings, 0 hints |
| `npm run build` | Passed; production build completed successfully |
| `git diff --check` | Passed |
| Article schedule test | Passed; exact 24-hour interval, offset, local time, workflow cron, and scheduler timestamp verified |
| Article structure test | Passed; 15 sections, 5,410 words, five figures, full-size links, required internal links, and evidence boundaries verified |
| Media tests | Passed; six uploaded public objects and seven supplied references match local size and SHA-256 records |
| R2 dry run | Passed; six new destination keys, no collisions |
| R2 upload verification | Passed; six HTTP 200 responses with matching MIME, cache policy, and hashes |

The build retains existing project warnings about the empty `adventures` collection and an occupied default inspector port. They predate this task and did not produce Astro diagnostics or a build failure.

## Browser QA matrix

The page was made temporarily visible only in the local development server for QA, then restored to its final scheduled metadata. Every exact-width pass returned HTTP 200, the correct title and H1, all six article assets loaded, all five figures and full-size links were present, there was no horizontal overflow, related articles rendered, and Playwright recorded no console, page, or failed-request errors.

| Viewport | HTTP | Document width | Horizontal overflow | Failed article assets | Figure/full-size links | Result |
| --- | ---: | ---: | --- | ---: | --- | --- |
| 1440 × 900 | 200 | 1440 | No | 0 | 5 / 5 | Pass |
| 1024 × 900 | 200 | 1024 | No | 0 | 5 / 5 | Pass |
| 768 × 900 | 200 | 768 | No | 0 | 5 / 5 | Pass |
| 390 × 844 | 200 | 390 | No | 0 | 5 / 5 | Pass |

The 768-pixel article header and the 390-pixel first diagram were also inspected visually. At 390 pixels the embedded diagram is intentionally dense, so its caption includes the required full-size link. A separate in-app Chrome pass covered the long article flow, representative figures, captions, related cards, footer, and a second desktop/mobile pair. Browser-shell message-channel errors seen during that pass came from the browser extension context; the independent exact-width run produced no application errors.

## Schedule visibility

With the final `scheduled` metadata restored, the production build produced no article route and no slug or title in:

- RSS
- search index
- Articles HTML and Markdown indexes
- Articles LLM index
- site LLM indexes
- sitemap and sitemap index

The repository's `isPublishedArticle` helper uses `publishedAt` for scheduled entries and makes the article eligible only when that exact instant has passed. The local visible-state QA confirmed that the route, article layout, related cards, and media render through the normal article path. The one-time workflow is prepared to create the publication commit and trigger the normal `main` deployment after the due time.

## Unresolved items

- No article-content or media blocker remains.
- The production scheduler cannot exist on GitHub until these uncommitted files are committed and pushed. That outward action was not authorized in the current request.
- The image provider did not return its exact model identifier or per-call cost.
- The Instagram claims remain unverified beyond the documentary fact that the supplied public posts display them. The article says so.

## Actions not taken

- No feature branch or worktree was created.
- No commit, push, merge, pull request, workflow dispatch, or site deployment was run.
- No Cloudflare Pages setting, environment variable, secret, DNS record, Worker, KV, D1 database, or route was changed.
- No Wrangler deployment was run.
- No R2 object was overwritten, renamed, or deleted.
- None of the seven source screenshots was uploaded individually.
- No unsupported claim identified in the task packet was published as fact.
