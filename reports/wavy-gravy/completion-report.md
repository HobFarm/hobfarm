# Completion report: Before Wavy Gravy Was Ice Cream

## 1. Repository and branch

- Repository path: `F:\Web-Stuff\hobfarm`
- Starting branch: `main`
- Ending branch: `main`
- Starting worktree state: clean
- Ending worktree state: article-specific changes remain uncommitted for review
- Commit created: no
- Push performed: no
- Merge performed: no
- Deployment performed: no
- Remote mutation performed: six new, collision-checked article assets were uploaded to the existing HobFarm R2 bucket across the build and hero-replacement passes; the four original keys remain intact, and the article now references the two user-supplied `v2` hero derivatives

## 2. Article identity

- Final title: **Before Wavy Gravy Was Ice Cream**
- Kicker / series: **Before the Scene Had a Name**
- Slug: `before-wavy-gravy-was-ice-cream`
- Route: `/articles/before-wavy-gravy-was-ice-cream/`
- Department: Magazine Time Machine
- Final deck: “Before the retired Ben & Jerry's flavor, Hugh Romney and Bonnie Beecher moved through poetry, television, improvisation, buses, ballrooms, and an actual hog farm.”
- Body word count by the repository test method: 4,709
- Final publication timestamp: `2026-08-18T16:20:00-07:00`
- Timezone and local clock: America/Los_Angeles, 4:20 p.m. PDT

The user's title replaces the older title fixed inside the pack. The opening now says directly that Ben & Jerry's named the flavor for Hugh Romney's existing Wavy Gravy persona. It includes Ben Cohen's San Francisco approach, the 1993, 2001, and 2005 flavor dates, Cherry Garcia, Phish Food, related pop-culture flavors, and the company's mix of showmanship and public causes.

## 3. Publication relationship

- Predecessor title: **From Wetlands to the Wash**
- Predecessor route: `/articles/from-wetlands-to-the-wash/`
- Predecessor timestamp: `2026-08-17T16:20:00-07:00`
- New article timestamp: `2026-08-18T16:20:00-07:00`
- Verified difference: exactly 86,400,000 milliseconds, or 24 hours
- Slot collision result: no other article uses the August 18 timestamp
- Previous/next behavior: the shared publication-order code sorts by `publishedAt`; at release, Wetlands is the immediately older article
- Future-date visibility: the restored scheduled entry is excluded by `getPublishedArticles()` until its timestamp
- RSS and sitemap: both use the same published-article filter, so the scheduled article stays absent before release and enters after release
- Related content: frontmatter selects Wetlands and **Fear and Loathing After the American Dream**
- Scheduled publication: one-time GitHub Actions workflow at `20 23 18 8 *`, which is 4:20 p.m. PDT on August 18, 2026

The article was later moved to August 18 as part of a user-directed queue change that reserves August 14 for a new Workshop entry and places *Every Sentence Is a Keynote Conclusion* on August 15.

## 4. Editorial implementation

Final sections:

1. 2026 birthday opening and the retired ice cream flavor
2. The street sign comes later
3. Hugh Romney has a weird day
4. Come wander with Bonnie
5. California was already moving
6. Forty people and forty hogs
7. Somebody has to make the thing work
8. Take the farm on the road
9. My name is Hugh Romney
10. Then B.B. King names him
11. The work keeps changing clothes
12. The brochure comes later

Major changes from the supplied draft:

- Replaced the old title and added a sourced Ben & Jerry's opening hinge that explains the honor, the flavor's creation, the related music flavors, and why Wavy fit the company's public identity.
- Kept Wavy and Jahanara alive and present in 2026 while correcting their current Camp status to retired from official leadership but still attending performances.
- Preserved Bonnie as an independent narrative lane through Dylan, television, the song, Camp, and 2026.
- Narrowed Wavy's colorful early-life stories to explicitly attributed recollections.
- Removed the unsupported show-by-show Shrine band list.
- Kept the disputed Dylan song-inspiration claim out of the argument.
- Kept Acid Test origins cautious and did not name a single uncontested first event.
- Treated the recursive volunteer loop as HobFarm's interpretation, not a clinical protocol or a Hog Farm term.
- Recorded the Camp 1975 versus 1979 conflict in public instead of smoothing it over.
- Reduced the modern festival coda to categories rather than an unstable list of current events.
- Replaced uncleared archival-image reproductions with four linked institutional records.
- Preserved the supplied HobFarm-name passage and explicitly denied a naming lineage from Hog Farm.

The final sentence remains: “First somebody had to book the room, drive the bus, rig the lights, calm the panic, cook the rice, and feed the crowd.”

## 5. Claim and source audit

| Claim | Final handling | Source basis | Status |
| --- | --- | --- | --- |
| Wavy birth date and age | Publishes age 90 in May 2026, not an exact birth date | Seva 2026 material and Presidio event record | verified |
| Jahanara birth date and age | Publishes age 85; exact date remains out of the article | Supplied research, corroborated by public biographical records; no institutional birth record found | accepted with source limitation |
| 2026 birthday chronology | Separates Seva's celebration and Wavy Gravy Day from the Presidio film benefit | Seva and Presidio Theatre | verified |
| Wavy Gravy Day | San Francisco proclamation dated May 16 | Seva 2026 post | verified |
| Ben & Jerry's Wavy Gravy flavor and title | Says directly that the flavor honored Hugh Romney's existing persona; recounts Ben Cohen approaching him in San Francisco; dates launch to 1993, retirement to 2001, and the brief 2005 return | Ben & Jerry's official archive and company timeline | verified |
| Ben & Jerry's flavor lineage | Places Wavy Gravy after 1987's Cherry Garcia and beside Phish Food, Bohemian Raspberry, Imagine Whirled Peace, and Bonnaroo Buzz | Ben & Jerry's company history and official pop-culture flavor retrospective | verified |
| Gaslight role | Presented as Wavy's official first-person biography, not independent institutional fact | WavyGravy.net | attributed recollection |
| Bonnie and Dylan recording | Recording dated May 1, 1961 at Bonnie Beecher's home | Bob Dylan official set archive | verified |
| Bonnie television credits | Uses a limited set including *The Twilight Zone* and *Star Trek* | Paramount and StarTrek.com | verified |
| “Come Wander with Me” track | Spotify card credits Jeff Alexander and explicitly does not identify the stream as Beecher's television master | Spotify, Paramount, soundtrack records | verified with master distinction |
| Bill Graham 1965 benefit | Dates the Calliope Mime Troupe benefit to November 6, 1965 and keeps the hospitality details | Bill Graham Memorial Foundation | verified |
| Chet Helms and Family Dog | Described as a separate ballroom branch, with no sole-origin claim | Bill Graham Foundation history | narrowed |
| Acid Test chronology | Keeps only the experimental-event role; no disputed first-performance claim | Smithsonian handbill record and institutional histories | narrowed |
| Hog Farm origin | Forty people and forty hogs remain inside Wavy's account and are identified as a polished recollection | WavyGravy.net | attributed recollection |
| Shrine and Energy Games | Keeps the Shrine and Energy Games, removes the unverified band-by-band calendar | WavyGravy.net | narrowed |
| Bus-caravan dates | No exact start/end dates are asserted | WavyGravy.net and Smithsonian records | narrowed |
| Woodstock invitation and duties | Security request, Please Force, announcements, food, distress support, and volunteer work | PBS, Wavy biography, Smithsonian | verified and attributed |
| Food claims | Names granola, brown rice, and vegetables and credits Law and Romney with organizing volunteers | Smithsonian food history | verified |
| B.B. King naming story | Secure festival frame plus explicit first-person-recollection label | Seva anniversary book, Texas State Historical Association, Lewisville history | verified frame, attributed exchange |
| Camp founding conflict | Uses Camp's 1975 date and records Wavy biography's 1979 date | Camp official history, Camp July 2026 dispatch, Wavy biography | conflict preserved |
| Seva founding and role | Uses 1978 and limits the description to sight-saving and eye-care work | Seva institutional history and anniversary book | verified |
| Current Wavy and Jahanara participation | Says they are retired from official Camp leadership, still attend performances, and appeared together at the 2026 benefit | Camp July 2026 and Presidio Theatre | verified |
| Hob folklore definition | Defines a hob as a helpful household or farm spirit | Ryedale Folk Museum | verified interpretation |
| HobFarm name | Kept as the author's account; denies direct Hog Farm lineage | Author account | first party |
| Modern festival wording | Uses general format categories without active-status claims or direct-lineage claims | Editorial synthesis | bounded interpretation |

## 6. Quote verification

The public article uses 21 verbatim words from the film across three short quotations. Everything else is paraphrased.

| Quote or paraphrase | Source and cut | Timecode | Exact wording verified | Public use |
| --- | --- | --- | --- | --- |
| “I'm with the Hog Farm.” | *Woodstock*, theatrical subtitle track | around `00:36:27.743` | yes, excerpted from the full introduction | exact short quote |
| Breakfast for the crowd | *Woodstock*, director's cut subtitle track | around `03:10:40.231` | yes | paraphrase only |
| “We're all feeding each other.” | *Woodstock*, director's cut subtitle track | around `03:11:08.263` | yes | exact short quote |
| “There's always a little bit of heaven in a disaster area.” | *Woodstock*, director's cut subtitle track | around `03:11:18.483` | yes | exact short quote |
| Distressed trips become peer care | *Woodstock*, theatrical subtitle track | `00:36:38.753` onward | key terms checked | paraphrase only |
| Acid announcement | *Woodstock*, theatrical subtitle track | `00:36:53.380` onward | checked | paraphrase only, with uncertainty criticized |
| Hamburger aside | *Woodstock*, director's cut subtitle track | roughly `03:11:32.480–03:11:50.957` | checked against two subtitle/clip records | paraphrase only |

The theatrical and director's cuts place the same material at different elapsed times. The report therefore names the cut beside each timecode. The article does not imply that the 1-minute-13-second PBS excerpt contains every later breakfast quotation.

## 7. Author photographs

| Source file | Public filename | Use | Crop | Dimensions | Bytes | SHA-256 | R2 key | Credit |
| --- | --- | --- | --- | ---: | ---: | --- | --- | --- |
| `haight-ashbury-intersection-wide-author.jpg` | `haight-ashbury-intersection-wide-early-2010s-1600-v1.webp` | location after-image | full frame, scaled only | 1600 × 1200 | 349,954 | `fc4ecc0723aaa758ad7f51ba19147c72e951b3228d920dd5f411448992907252` | `articles/wavy-gravy/haight-ashbury-intersection-wide-early-2010s-1600-v1.webp` | Photograph by HobFarm |
| `haight-ashbury-sign-close-author.jpg` | `haight-ashbury-sign-close-early-2010s-1600-v1.webp` | street-sign detail | full frame, scaled only | 1600 × 1200 | 126,850 | `b594f4b55e39bef23440ee92717b6ebaf4974cca8aec835a93475375b29b70b9` | `articles/wavy-gravy/haight-ashbury-sign-close-early-2010s-1600-v1.webp` | Photograph by HobFarm |

The untouched 2048 × 1536 JPEGs remain in the supplied pack and were copied losslessly into the local working stage. Their original checksums remain:

- wide: `f1a9c49328e8f151eb2c2401c5afef8baf14dbd2bcdf500f2d6ac69048c040f1`
- close: `de7d21c23375f3d672261ee458ad8816a369a2c534a5a342d088b5c48f5d9b34`

All public captions say “early 2010s.” Neither image is represented as 1960s evidence, a settled 2012/2013 capture, or a current 2026 view.

## 8. Archival record package

No restricted archive image binary was downloaded, hotlinked, rehosted, or uploaded. The public page provides a compact record shelf instead.

| Record | Creator / date | Collection / object ID | Source | Rights result | Public treatment |
| --- | --- | --- | --- | --- | --- |
| Hugh Romney putting Pigasus into a truck | Lisa Law, 1968 | NMAH `1998.0139.126`, record `nmah_892551` | Smithsonian | Usage Conditions Apply | linked record, no image |
| Hog Farmers arriving at Kennedy Airport | Lisa Law, 1969 | NMAH `1998.0139.150`, record `nmah_892577` | Smithsonian | Usage Conditions Apply | linked record, no image |
| Woodstock food operation | Smithsonian food-history exhibition | Countercultures | Smithsonian | text is citable; individual image reuse not cleared | linked record, no image |
| Mime Troupe benefit history | Bill Graham Memorial Foundation | November 6, 1965 Calliope benefit | Bill Graham Foundation | text record used; artifact image rights not assumed | linked record, no image |

Rejected or omitted image leads:

| Lead | Reason |
| --- | --- |
| Lisa Law Hog Farm, bus, airport, Pigasus, and food photographs | Smithsonian records mark the images with usage conditions; HobFarm did not obtain commercial/publication clearance |
| Acid Test handbill | The record supports chronology, but the image's reuse notice is not a clean publication license |
| Bonnie Beecher television stills | No proportionate, clearly licensed still was found; the official episode and Spotify records carry the section without one |
| Bill Graham handbill images | Documentary value did not outweigh unclear reproduction rights for this article |
| Generic stock or synthetic “1960s” photography | Rejected because it would not be documentary evidence |

This is the safest adaptation of the pack's archival-image request. Missing optional images did not block the article, and the documentary trail remains visible.

## 9. Original graphics

| Graphic | Implementation | Source basis | Text equivalent | Responsive result | Public asset |
| --- | --- | --- | --- | --- | --- |
| Hero | user-supplied 1672 × 941 PNG preserved byte-for-byte and optimized to WebP | direct author selection | full descriptive alt text identifies it as an illustrated collage | 4:3 mobile and wide desktop crops verified | R2 WebP plus social crop |
| Before the Label | semantic ordered list with live HTML/CSS | verified chronology | list is the graphic | single-column dates on narrow screens | component source |
| How the Work Assembled | four semantic articles with no false causal arrows | sourced scene practices | all text is live | 2×2 desktop, stacked mobile | component source |
| Please Force Operating Loop | ordered four-step interpretation | film dialogue and Hog Farm record | full ordered text plus interpretive disclaimer | four, two, then one column | component source |
| The Work Changed Clothes | four-stage institutional continuation | Camp and Seva records | all text is live | four, two, then one column | component source |

The supplied hero is an illustrated editorial collage, not documentary evidence. It was used without generative alteration; processing was limited to an article derivative and a centered social crop. The superseded generated hero remains in R2 under its immutable `v1` key but is no longer referenced by the article.

## 10. External media

| Media | Final URL | Component | Runtime | Click-to-load | Fallback | Status |
| --- | --- | --- | --- | --- | --- | --- |
| “Come Wander with Me” | `https://open.spotify.com/track/5b2Zf1kc0M7KNfCnBV4vWO` | `WavySpotifyCard.astro` | Spotify page controls | no embed; privacy-first link card | official track link | verified |
| Wavy Gravy: Please Chief of Woodstock | `https://player.pbs.org/viralplayer/3031061174/` | `WavyPbsPlayer.astro` | 1:13 | yes | official PBS page | verified, including keyboard activation |
| *Saint Misbehavin'* trailer | not included | none | n/a | n/a | Presidio event source remains in notes | optional media omitted |

No third-party audio or video was downloaded or rehosted. The CSP was extended only for `image.pbs.org` under `img-src` and `player.pbs.org` under `frame-src`.

## 11. R2 and public assets

| R2 key | Public URL | MIME | Dimensions | Bytes | SHA-256 | Rights basis |
| --- | --- | --- | --- | ---: | --- | --- |
| `articles/wavy-gravy/before-wavy-gravy-was-ice-cream-hero-v2.webp` | `https://cdn.hob.farm/articles/wavy-gravy/before-wavy-gravy-was-ice-cream-hero-v2.webp` | `image/webp` | 1600 × 900 | 546,900 | `7d70f3648f5060259aecebac4144268b10152d9a7fe725bed19425af0c5bd85b` | user-supplied editorial image |
| `articles/wavy-gravy/before-wavy-gravy-was-ice-cream-social-v2.webp` | `https://cdn.hob.farm/articles/wavy-gravy/before-wavy-gravy-was-ice-cream-social-v2.webp` | `image/webp` | 1200 × 630 | 315,548 | `31092e5ade089d705997f4e716a1d14b9368f2138a73511b2a5b3c465943b207` | centered crop of user-supplied editorial image |
| `articles/wavy-gravy/haight-ashbury-intersection-wide-early-2010s-1600-v1.webp` | `https://cdn.hob.farm/articles/wavy-gravy/haight-ashbury-intersection-wide-early-2010s-1600-v1.webp` | `image/webp` | 1600 × 1200 | 349,954 | `fc4ecc0723aaa758ad7f51ba19147c72e951b3228d920dd5f411448992907252` | author-owned photograph |
| `articles/wavy-gravy/haight-ashbury-sign-close-early-2010s-1600-v1.webp` | `https://cdn.hob.farm/articles/wavy-gravy/haight-ashbury-sign-close-early-2010s-1600-v1.webp` | `image/webp` | 1600 × 1200 | 126,850 | `b594f4b55e39bef23440ee92717b6ebaf4974cca8aec835a93475375b29b70b9` | author-owned photograph |

- Prefix collision check: both new `v2` keys were absent; both existing author-photo keys checksum-matched and were preserved
- Existing objects preserved: yes
- Overwrites performed: none
- Verification: each public response returned HTTP 200, `image/webp`, immutable cache headers, and the expected SHA-256
- Hero replacement upload completed: `2026-08-10T18:40:49.400Z`
- Superseded immutable objects: the generated `hero-v1` and `social-v1` remain in R2 but are no longer referenced
- Credentials: existing Wrangler configuration; no credential material was printed or changed
- Paid operations: none

## 12. Files created or changed

| File or group | Change |
| --- | --- |
| `src/content/articles/before-wavy-gravy-was-ice-cream.mdx` | final sourced feature, metadata, relationships, schedule, and media composition |
| `src/components/articles/wavy-gravy/BeforeLabelTimeline.astro` | accessible chronology |
| `src/components/articles/wavy-gravy/SceneNetwork.astro` | scene-practice diagram |
| `src/components/articles/wavy-gravy/PleaseForceLoop.astro` | interpretive volunteer loop |
| `src/components/articles/wavy-gravy/WorkContinues.astro` | institutional continuity diagram |
| `src/components/articles/wavy-gravy/WavyImagePair.astro` | author-photo presentation |
| `src/components/articles/wavy-gravy/WavySpotifyCard.astro` | official Spotify fallback card |
| `src/components/articles/wavy-gravy/WavyPbsPlayer.astro` | click-to-load official PBS player |
| `src/components/articles/wavy-gravy/ArchiveRecordShelf.astro` | linked documentary records without restricted images |
| `public/_headers` | allows the official PBS image and player domains in CSP |
| `scripts/build-wavy-gravy-upload-manifest.mjs` | reproducible, new-key-only asset manifest builder |
| `reports/wavy-gravy/asset-manifest.json` | source, rights, checksums, upload, and verification record |
| `scripts/publish-scheduled-before-wavy-gravy-was-ice-cream.mjs` | guarded status switch for the exact publication instant |
| `.github/workflows/publish-before-wavy-gravy-was-ice-cream.yml` | one-time scheduled publication workflow |
| `tests/before-wavy-gravy-was-ice-cream.test.mjs` | title, slot, media, rights, schedule, and uncertainty tests |
| `reports/wavy-gravy/completion-report.md` | this record |

No predecessor metadata or unrelated page was changed.

## 13. Validation results

| Check | Command or method | Result |
| --- | --- | --- |
| Lockfile / package manager | inspected `package.json` and committed `package-lock.json` | npm confirmed; no dependency change |
| Focused tests | `node --test tests/before-wavy-gravy-was-ice-cream.test.mjs` | 4 passed, 0 failed |
| Full tests | `npm test` | 276 passed; 3 unrelated failures from already-removed one-time workflows for Mr. Paige, Sharksploitation, and You Should Write About Sharks |
| Astro schema and types | `npx astro check` | 616 files, 0 errors, 0 warnings, 0 hints |
| Production build | `npm run build` | passed in the final scheduled state and in the temporary visual-QA state |
| Future visibility | direct checks against a brand-new `.tmp/wavy-gravy-final-scheduled-v3/client` output after the final copy edit | route absent; slug absent from RSS, sitemap, and search index |
| R2 manifest | `node scripts/r2-upload-manifest.mjs --manifest reports/wavy-gravy/asset-manifest.json` | dry run found four absent keys |
| R2 upload | same command with `--upload` | four uploaded and checksum-verified; zero overwrites |
| Source links | 21-source automated reachability check plus browser research | 15 returned 200 directly; five official archive/PDF links blocked the automated client with 403 but were verified through indexed institutional pages; the unstable Paramount deep link was replaced with its 200 episode index |
| Media | Playwright and public URL checks | all article images loaded; PBS inserted an iframe from keyboard activation; Spotify and PBS fallbacks present |
| Accessibility | semantic/DOM and keyboard audit | no heading skips, duplicate IDs, broken images, or horizontal overflow; all diagrams have live-text equivalents |
| Em-dash scan | `rg` across article and article components | none |
| Schedule restoration | direct frontmatter check after QA | `2026-08-18T16:20:00-07:00`, `status: scheduled` |

The full-test failures predate this work in the current tree. Their tests still expect one-time workflow files that have already been removed. This task did not recreate or change those unrelated workflows.

## 14. Browser QA

The future-dated route was built with a temporary past timestamp for local inspection, including a second visual pass after the hero replacement. The source was restored to the scheduled state before final checks and later moved to August 18 in the publication queue. A clean scheduled-state build used a new output directory because the normal local `dist` retained the temporary QA route as a stale generated file and environment policy blocked destructive cleanup. The clean output omitted the route and all feed, sitemap, and search references. No preview was deployed.

| Width / mode | Result | Screenshot path | Notes |
| --- | --- | --- | --- |
| 1440 px | pass | `.playwright-mcp/wavy-gravy/before-wavy-gravy-1440.png` | full page, no overflow or broken media |
| 1024 px | pass | `.playwright-mcp/wavy-gravy/before-wavy-gravy-1024.png` | PBS button focused and activated from keyboard |
| 768 px | pass | `.playwright-mcp/wavy-gravy/before-wavy-gravy-768.png` | diagram and photo grids remain contained |
| 390 px | pass | `.playwright-mcp/wavy-gravy/before-wavy-gravy-390.png` | stacked diagrams, readable hero, no horizontal overflow |
| Replacement hero, 1440 px | pass | `.playwright-mcp/wavy-gravy/hero-v2-1440.png` | wide crop retains the street signs, both central figures, concert, and pigs |
| Replacement hero, 390 px | pass | `.playwright-mcp/wavy-gravy/hero-v2-390.png` | 4:3 crop centers both figures; responsive CDN image loaded; no page overflow |
| Reduced motion | pass | 390 px run | browser preference set to reduce |
| Keyboard only | pass | 1024 px run | PBS control accepted focus and Enter |
| JavaScript disabled | pass | automated DOM audit | 39,942 characters of article text, four diagrams, and both external fallbacks remain readable |
| Light preference | pass | 390 px run | site keeps its intentional dark article surface without contrast failure |
| Dark preference | pass | 1440, 1024, 768 px runs | expected article theme |
| Metadata | pass | all widths | title, canonical, Open Graph image, and Article JSON-LD present |

Spot screenshots for the timeline, author photographs, scene network, archive shelf, PBS card, Please Force loop, and continuity diagram are stored beside the full-page QA files.

## 15. Unresolved items and safe fallbacks

### Jahanara's exact birth record

1. The supplied pack and public biographical references were checked.
2. They consistently support 1941 and age 85 in 2026.
3. No first-party institutional page found in this pass publishes her exact date of birth.
4. The article uses age 85, supplied by the user, and omits the exact date.
5. No author action is required unless a first-party birth receipt is available.

### Archival photographs

1. Smithsonian and other institutional object records were inspected.
2. The best Lisa Law records clearly identify the people, dates, and objects.
3. Their image pages say Usage Conditions Apply, and no clean HobFarm publication license was established.
4. The article links four records and reproduces none of the restricted image binaries.
5. Separate rights clearance would be required before adding those photographs.

### Spotify master identity

1. The supplied track was opened and its public credit checked.
2. Spotify credits the track to Jeff Alexander; television and soundtrack records credit Beecher's performance.
3. The available public metadata does not prove that the Spotify file is the exact television vocal master.
4. The card says this plainly and makes no master claim.
5. No author action is required unless a label or soundtrack master record becomes available.

## 16. Actions explicitly not taken

- No commit or push.
- No merge, deployment, or immediate publication.
- No force push or history rewrite.
- No existing R2 object overwrite.
- No paid archive acquisition, subscription, API, or generation call.
- No third-party film, television, music, or video download and rehost.
- No contact with subjects, institutions, rights holders, employers, or venues.
- No synthetic historical photograph or portrait.
- No expansion of the deferred Kesey, Dead, Altamont, Scher, Shapiro, Woodstock '99, Phish, or Veneta articles.
