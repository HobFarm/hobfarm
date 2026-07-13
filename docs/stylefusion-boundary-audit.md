# StyleFusion boundary audit

Date: 2026-07-12

## Scope

This audit searched the repository for:

```text
StyleFusion
stylefusion
source-role map
fusion map
style fusion
```

The classification unit is the source file. Repeated hits with the same meaning inside one file share one action. Generated output and historical Git data were excluded: `dist/`, `.astro/`, `node_modules/`, `.git/`, `build.log`, and generated media-inventory reports.

## Canonical boundary

StyleFusion is a separate reference-image application. It assigns approved images to roles, runs specialized extraction agents, records model routing and confidence, compiles an Intermediate Representation, and produces image-generation JSON, natural-language slots, and a Complete Export.

Character / Mannequin owns mannequins, character DNA, wardrobe, aesthetic mutation, species variants, Sheets, Heroes, Posters, and product-ready character assets. Workshop Notes owns aesthetic research and process observations that are not formal StyleFusion runs. Generated images and production assets remain downstream from the Complete Export.

The canonical definition is [hobfarm-stylefusion-definition.md](character-system/hobfarm-stylefusion-definition.md).

## Main findings

1. The public Workshop navigation already has the required six programs and did not need a new item.
2. The public `/workshop/stylefusion/` route was a generic program index. Its copy described a general blend method and did not explain extraction agents, the IR, compiled slots, confidence, or the Complete Export.
3. Sophia/Stella appeared in the private visual lab through a component named `StyleFusionMap`. Its data was a manual visual-system relationship map, not a StyleFusion run.
4. Workshop planning documents repeated that mislabeled map and described StyleFusion as choosing silhouette, wardrobe, pose, and environment from manual design sources.
5. The StyleFusion project page included character Sheets and packaging inside the application workflow instead of labeling them as downstream production.
6. Several articles, help pages, and whitepaper passages used “StyleFusion generates” as shorthand. Those passages needed to distinguish document compilation from later image generation.
7. Eight legacy prompt/export text sidecars sit inside Gallery source folders. They are not linked by current gallery Markdown, but their location blurs exported documents with generated media.
8. The supplied Complete Exports contain enough real data for a private prototype. The tuxedo-cat export records IR 5.1, GPT-5.5 extraction, seven agent confidences, role-aware slot lineage, and a 2:3 aspect ratio. The IR 5.0 failure records `subject_extraction_failed: true` and subject confidence 0 while later agents still return data.

## Current public route audit

Route: `/workshop/stylefusion/`

| Check | Current state |
| --- | --- |
| Page source | `src/pages/workshop/[program].astro` with `src/data/site-hierarchy.ts` |
| Purpose | Generic Workshop program landing page and index |
| Entries | One filed article: “How StyleFusion Reads Images” |
| Gallery cards | None currently filed to the StyleFusion Workshop program |
| Hero copy | Now uses the exact application boundary; before this repair it described generic controlled blends |
| Program steps | Now: assign approved roles, run agents, inspect IR/slots, export diagnostics |
| App links | No app URL and no private workspace link |
| Public links | The article card, six-program Workshop navigation, and global site navigation |
| Diagrams | None |
| Media | No StyleFusion route-specific hero or case-study media |
| Metadata | `StyleFusion | HobFarm Workshop`, canonical route, description from hierarchy data, CollectionPage JSON-LD |
| Character-sheet collision | No Sophia/Stella media renders on this route, but the former method copy and Workshop planning documents treated manual character-source selection as StyleFusion |
| Real repository data | Project brief, extraction article, preview help docs, Grimoire notes, legacy prompt/export sidecars, and the new private draft study records |

The live route remains a public index during review. The application-focused page is a private noindex prototype at `/workshop/stylefusion/prototype/`. Replacing the public route is an approval-gated follow-up.

## Corrections completed

| Path | Previous meaning | Correct category | Action |
| --- | --- | --- | --- |
| `src/components/workshop/StyleFusionMap.astro` | Manual Sophia/Stella source relationship map | Character / Mannequin visual-system comparison | Removed after replacement |
| `src/components/workshop/VisualSystemMap.astro` | Replacement for the mislabeled map | Character / Mannequin visual-system comparison | Added |
| `src/pages/workshop/visual-lab/index.astro` | Sophia/Stella visual lab imported `StyleFusionMap` | Character / Mannequin visual lab | Renamed import, heading, section anchor, and component instance |
| `tests/visual-lab.test.mjs` | Expected the StyleFusion-named map | Boundary regression test | Rewritten |
| `docs/character-system/hf-dl-026-wardrobe-test.md` | Wardrobe test named `StyleFusionMap` | Character / Mannequin visual-system map | Renamed |
| `docs/workshop-academy-shop-plan.md` | Sophia/Stella prototype described a StyleFusion map | Character / Mannequin visual-system map | Rewritten |
| `docs/workshop-academy-shop-audit.md` | StyleFusion reduced to silhouette/palette/wardrobe source selection | StyleFusion application | Rewritten |
| `docs/character-system/hobfarm-workshop-system.md` | Generic “assign each source a design job” method | StyleFusion application | Rewritten with roles, agents, IR, compiled slots, JSON, and diagnostic export |
| `src/data/site-hierarchy.ts` | Generic controlled-blend program description | StyleFusion application | Rewritten; six-program navigation preserved |
| `src/pages/workshop/[program].astro` | Generic blend stages | StyleFusion application | Rewritten |
| `src/data/workshop-page.ts` | Broad style compilation method | StyleFusion application | Rewritten |
| `src/content/projects/stylefusion.md` | Character Sheets listed as compiled output | StyleFusion application plus downstream boundary | Rewritten |
| `src/components/projects/StyleFusionProjectPage.astro` | Generation and packaging inside the app workflow | StyleFusion application plus downstream boundary | Rewritten |
| `src/pages/whitepaper/index.astro` | StyleFusion called an image-generation lab | Reference-image compiler and diagnostic export system | Rewritten |
| `src/components/features/CaseStudyHero.astro` | Character concept presented as direct StyleFusion output | Downstream character-development result | Rewritten |
| `src/components/features/Philosophy.astro` | Character consistency described as the app artifact | Reference discipline and compiled document | Rewritten |
| `src/components/home/TheHob.astro` | Character consistency described as StyleFusion’s produced result | Reference discipline recorded by StyleFusion | Rewritten |
| `src/pages/academy/index.astro` | StyleFusion turned one masked image into an image family | Application export followed by downstream generation | Rewritten |
| `src/content/changelog/stylefusion-beta.md` | App described as directly generating character variants | Reference extraction and compiled document with downstream routing | Rewritten |
| `src/content/help/refining-results.md` | Iteration collapsed app and generation into one step | IR adjustment plus downstream generation loop | Rewritten |
| `src/content/help/generating-images.md` | Generated images treated as part of StyleFusion | Downstream model comparison | Rewritten |
| `src/content/grimoire/understanding-visual-atoms.md` | Every image described as generated by StyleFusion | Atoms used in compiled documents; image remains downstream | Rewritten |
| `src/content/articles/the-anime-to-gothic-pipeline.md` | “StyleFusion’s gallery” and direct image generation | Gallery studies downstream from exports | Rewritten |
| `src/content/gallery/asset-lab/atomic-noir-color-system.md` | Generic StyleFusion growth run | Approved reference study | Rewritten |
| `src/content/gallery/character-dev/neon-ghoul.md` | Character Sheet casually returned to StyleFusion | Sheet used only as an approved subject reference | Rewritten |

## Occurrence classification

### Keep: application, route, taxonomy, or public brief

These paths already use StyleFusion as the named application, its route, its taxonomy value, or its public documentation.

```text
.pages.yml
astro.config.mjs
docs/character-system/hobfarm-project-instructions-v2.md
docs/character-system/hobfarm-stylefusion-definition.md
functions/api/contact.ts
public/_redirects
src/components/ContactForm.tsx
src/components/grimoire/sections/GrimoireArticles.astro
src/components/grimoire/sections/GrimoireCTA.astro
src/components/grimoire/sections/GrimoireSystem.astro
src/components/helpcenter/Status.astro
src/components/membership/MemberPortalView.tsx
src/components/workshop/stylefusion/StyleFusionCaseStudy.astro
src/content.config.ts
src/content/articles/1973-when-airbrush-was-ai.md
src/content/articles/building-in-public-solo-developer.md
src/content/articles/color-becomes-a-cast.md
src/content/articles/grimoire-knowledge-graph.md
src/content/articles/hello-world.md
src/content/articles/how-hobbot-keeps-the-lights-on.md
src/content/articles/invisible-variable.md
src/content/articles/same-model-different-surface.md
src/content/articles/stylefusion-ir-extraction.md
src/content/changelog/gallery-launch.md
src/content/changelog/site-launch.md
src/content/grimoire/color-palette-recipes.md
src/content/grimoire/face-geometry-identity-lock.md
src/content/grimoire/from-generic-to-character.md
src/content/grimoire/stylefusion-prompt-compilation.md
src/content/grimoire/welcome-to-the-grimoire.md
src/content/help/characters.md
src/content/help/exporting-your-work.md
src/content/help/getting-started.md
src/content/help/history-and-providers.md
src/content/help/styles-and-arrangements.md
src/content/help/the-workspace.md
src/content/help/working-with-references.md
src/content/legal/cookies.md
src/content/legal/dpa.md
src/content/legal/privacy.md
src/content/legal/terms.md
src/content/legal/usage.md
src/content/projects/anomalybot.md
src/content/projects/courses.md
src/content/projects/drifter.md
src/content/projects/grimoire.md
src/content/projects/hobfarm-tv/3-degrees-of-dick-miller.md
src/content/projects/hobfarm-tv/magazine-time-machine.md
src/data/about-projects.ts
src/data/departments.ts
src/data/grimoire-synthesis.ts
src/data/homepage-systems.ts
src/data/processPipelines.ts
src/data/providers.ts
src/data/roadmap.ts
src/data/site-hierarchy.ts
src/data/style-cards.js
src/layouts/HelpCenterLayout.astro
src/lib/agent-corpus.ts
src/lib/gallery.ts
src/pages/gallery/index.astro
src/pages/helpcenter/index.astro
src/pages/projects/[...slug].astro
src/pages/projects/index.astro
src/pages/support.astro
src/pages/workshop/[program].astro
src/pages/workshop/stylefusion/prototype.astro
tests/agent-readability.test.mjs
tests/stylefusion-boundary.test.mjs
e2e/stylefusion-prototype.spec.ts
```

### Keep: downstream work linked back to a real StyleFusion run

These occurrences describe generated media, character work, or gallery material as later results or possible approved inputs. Their copy either already respected the boundary or was corrected in this pass.

```text
src/components/features/CaseStudyHero.astro
src/components/features/CaseStudyMetadata.astro
src/components/features/Philosophy.astro
src/components/home/TheHob.astro
src/components/StyleShowcase.tsx
src/components/ui/BeforeAfterCompare.astro
src/content/articles/the-anime-to-gothic-pipeline.md
src/content/gallery/asset-lab/atomic-noir-color-system.md
src/content/gallery/character-dev/neon-ghoul.md
src/content/gallery/character-dev/seed-to-world-v1-neon-glitch-streetwear.md
src/content/gallery/compilation/liquid-gothic.md
src/content/gallery/cute-corrupted/kareena.md
src/pages/academy/index.astro
```

### Keep for boundary; verify feature claims separately

These files describe application features such as provider routing, history, face geometry, Grimoire enrichment, or generation queues. They now fit the application boundary, but the supplied exports do not prove every product claim. A separate product-fact audit should compare them with the current private application before public launch.

```text
src/content/articles/grimoire-knowledge-graph.md
src/content/articles/hello-world.md
src/content/articles/how-hobbot-keeps-the-lights-on.md
src/content/articles/stylefusion-ir-extraction.md
src/content/changelog/stylefusion-beta.md
src/content/grimoire/color-palette-recipes.md
src/content/grimoire/face-geometry-identity-lock.md
src/content/grimoire/from-generic-to-character.md
src/content/grimoire/stylefusion-prompt-compilation.md
src/content/grimoire/understanding-visual-atoms.md
src/content/grimoire/welcome-to-the-grimoire.md
src/content/help/characters.md
src/content/help/exporting-your-work.md
src/content/help/generating-images.md
src/content/help/getting-started.md
src/content/help/history-and-providers.md
src/content/help/refining-results.md
src/content/help/styles-and-arrangements.md
src/content/help/the-workspace.md
src/content/help/working-with-references.md
src/pages/whitepaper/index.astro
```

### Relocate later: legacy export and prompt sidecars

These are StyleFusion artifacts, not Gallery images. They are currently unreferenced by Gallery Markdown and were not exposed by the prototype. Move them only after confirming whether any external workflow depends on their current paths.

```text
src/content/gallery/goth-anime-line-art/stylefusion-export-2026-03-12(4).txt
src/content/gallery/goth-anime-line-art/stylefusion-prompts-2026-03-12(4).txt
src/content/gallery/gothic-fantasy/stylefusion-export-2026-03-12(10).txt
src/content/gallery/gothic-fantasy/stylefusion-prompts-2026-03-12(10).txt
src/content/gallery/gothic-psychedelic/stylefusion-export-2026-03-13(2).txt
src/content/gallery/gothic-psychedelic/stylefusion-prompts-2026-03-13(2).txt
src/content/gallery/psychedelic-elephant/stylefusion-export-2026-03-13(1).txt
src/content/gallery/psychedelic-elephant/stylefusion-prompts-2026-03-13(1).txt
```

### Remove or rename: completed

```text
remove: src/components/workshop/StyleFusionMap.astro
rename replacement: src/components/workshop/VisualSystemMap.astro
rewrite: src/pages/workshop/visual-lab/index.astro
rewrite: tests/visual-lab.test.mjs
rewrite: docs/character-system/hf-dl-026-wardrobe-test.md
rewrite: docs/workshop-academy-shop-plan.md
rewrite: docs/workshop-academy-shop-audit.md
rewrite: docs/character-system/hobfarm-workshop-system.md
```

## Source export inventory used for the prototype

| Study | Source document | Facts used |
| --- | --- | --- |
| Tuxedo cat | `ir-black-and-white-domestic-tuxedo-cat-1779262452017.txt` | IR 5.1, GPT-5.5, subject/style/composition roles, seven agent models and confidences, slot lineage, 147035 ms, parallel execution, 2:3 |
| Stitched teal character | `ir-female-figure-pale-teal-1778886800982.txt` | IR 5.1, Gemini 3.1 Pro Preview, subject/style/composition roles, seven confidences, 74006 ms, 9:16 |
| Industrial elf | `ir-primary-subject-elf-like-female-1778851549214.txt` | IR 5.1, GPT-5.5, subject/style roles, seven confidences, 175396 ms, 2:3 |
| Failed subject extraction | `ir-visual-subject-1778885946326.txt` | IR 5.0, Gemini 3.1 Pro Preview, subject confidence 0, later agent data, slot weights and sources, 102335 ms, 2:3 |

The other supplied exports were inspected for version, extraction model, reference-role combinations, confidence ranges, duration, execution mode, and aspect ratio. They were not turned into page records because the brief asks for a focused first case, two additional studies, and one failure diagnostic.

## Schema decision

The Gallery collection cannot represent a private StyleFusion study cleanly because every Gallery entry requires a public folder and hero asset. Adding private reference records there would create the wrong content boundary and pressure the prototype to invent or expose media.

A dedicated `stylefusionStudies` collection now holds optional export, reference, agent, compiled-slot, diagnostic, result, and finding fields. All four records are `draft: true` and `private-prototype`. Reference images are optional and every current reference has `approvedForPublicDisplay: false`. Results and downstream asset arrays are empty.

PagesCMS was not extended. These records remain developer-managed until their references, copy, and publication status are approved.

## Prototype boundary

The noindex prototype uses:

```text
ReferenceRoleDeck
FusionPipeline
AgentConfidencePanel
IRInspector
CompiledDocumentViewer
StyleFusionCaseStudy
DownstreamAssetRail
```

It renders meaningful content without JavaScript. Native `details` controls expose curated compiled slots and the raw-export status with keyboard support. The full exports stay local and are not downloaded, serialized into the page, or linked.

The route contains no private application URL, approved reference image, generated result, character asset, buyer file, product asset, R2 upload, or generation action.

## Remaining approval gates

- Review desktop and mobile screenshots.
- Approve or revise the private page structure and copy.
- Decide whether to replace the public `/workshop/stylefusion/` index with the prototype.
- Verify current app feature claims in Help, Grimoire, changelog, and whitepaper copy.
- Approve reference images individually before adding any media.
- Decide whether legacy Gallery prompt/export sidecars should move into the StyleFusion study archive.
- Keep deployment, R2 uploads, private app linking, paid generation, and public navigation changes blocked until explicit approval.
