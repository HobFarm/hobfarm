# Hit the Source Directly: final production report

## Publication

- **Title:** Hit the Source Directly
- **Deck:** I learned RSS while putting video online twenty years ago. It still powers podcasts, alerts, research, automation, and personal reading systems that bypass the engagement factory.
- **Canonical route:** `/articles/hit-the-source-directly/`
- **Schedule:** August 21, 2026 at 4:20 p.m. PDT
- **Predecessor:** The Future Was Already There, exactly 24 hours earlier
- **Length:** 2,795 words in the MDX body, including notes and component imports
- **Editorial section:** Technology
- **Strict series:** none

## Editorial result

The article begins with the author's bounded recollection of using an email-style reader while publishing video around 2006 and links the immediately preceding YouTube article. It then explains RSS, Atom, OPML, podcast enclosures, the loss of prominent feed interfaces, the engagement-ranking distinction, the 92-feed OPML provenance, current institutional uses, downstream personal AI, and direct HobFarm subscription steps.

The central claim is explicit and qualified: RSS can carry bad work. It does not certify quality. Its advantage is that a reader chooses the source before a recommendation or summary system operates.

The research pass corrected one error in the supplied task packet. The linked gist and GitHub profile identify **Evan Schwartz**, not Eric Schwartz, as the person who converted Michael Lynch's 2025 Hacker News Popularity Contest results into the 92-feed OPML file. Andrej Karpathy shared the file as a cold start; he did not create or curate the underlying list.

The Editorial Mesh pass assigns one primary Technology section, seven supported subjects, six technology entities, three people, three organizations, one work, and two organizing source artifacts. It assigns no Magazine Time Machine or 3DM membership. Four explicit related-article overrides preserve the intended editorial trail.

## Product and feed result

- Added a reusable compact or expanded RSS subscription component.
- Added a practical `/subscribe/` route with all seven Editorial feeds and four reader setup paths.
- Added compact direct-subscription access to every article layout.
- Replaced the Articles index's mixed email/RSS block with the focused direct-feed module.
- Preserved existing RSS generation, autodiscovery, canonical links, GUID behavior, image metadata, and scheduled-item filtering.

## Visual and media result

Eight immutable CDN objects are recorded under `articles/hit-the-source-directly/`: the original vector hero and social crop, four body diagrams, the supplied engagement-factory illustration, and its new social crop. The two added files used versioned destinations and passed the required destination-absent dry run, upload, public retrieval, content-type check, and SHA-256 verification. The original six objects were adopted by matching checksums and were not overwritten. The manifest records source files, dimensions, captions, alt text, rights, checksums, and verified URLs.

The supplied 1491 by 1055 ChatGPT illustration appears as a wide lead figure immediately after the central claim. It stays out of the shallow site hero frame so its row of desktop, phone, podcast, and local AI or search destinations remains visible. The original vector hero stays in place, while a north-aligned 1200 by 630 derivative becomes the article's social preview. A visible generation credit, full-size link, descriptive alt text, and expandable transcript accompany the body figure.

Browser QA covered a 1440-pixel desktop viewport and a 390-pixel mobile viewport. Results: no horizontal overflow, all four vector body graphics loaded at their 900-pixel source width, the new illustration loaded at its 1491 by 1055 source dimensions, full transcripts were available, raw feed addresses wrapped within the cards, and clipboard denial produced a manual-copy instruction.

The screenshots were made from a temporary local released-state build because scheduled routes are correctly absent before release. `QA-NOTE.md` records that preview boundary and the restored final metadata.

## Validation

- `npx astro check`: clean, 656 files, zero errors, warnings, or hints.
- `npm run build`: passed.
- Focused article tests: passed, 5 of 5.
- Editorial mesh audit: 68 published or scheduled articles, zero structural errors and zero review warnings.
- Full `npm test`: passed, 319 of 319.
- Site-structure audit: 718 routes, 58 released articles, zero structural errors, zero review warnings, and zero orphans.

No article, code, or report changes were committed, pushed, or deployed. The authorized new media assets were uploaded to the HobFarm CDN.
