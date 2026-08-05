# Design QA: Workshop page

## Visual truth

- Source reference: `C:\Users\xkxxk\.codex\generated_images\019fcfd5-31a6-7572-b20e-53c78a175703\exec-3c6da6ac-4ed2-4c85-b04b-a59ac6b2935c.png`
- Implementation route: `http://127.0.0.1:4321/workshop/#programs`
- Desktop implementation: `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-workshop-programs-desktop.png`
- Desktop alternating row: `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-workshop-programs-desktop-alternate.png`
- Mobile implementation: `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-workshop-programs-mobile.png`
- Mobile image-to-ledger detail: `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-workshop-programs-mobile-detail.png`
- Side-by-side comparison: `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-workshop-programs-comparison.png`

## Capture state

- Desktop viewport: 1536 x 1024 CSS pixels, DPR 1
- Mobile viewport: 390 x 844 CSS pixels, DPR 1
- State: Workshop program index with the first program in view; second desktop capture verifies the alternating row
- Source and desktop implementation captures are both 1536 x 1024

## Comparison

- The implementation preserves the reference's cyan sequence spine, oversized ghost numerals, borderless index rows, alternating image rhythm, compact method ledger, metadata footer, and restrained dark palette.
- The implementation intentionally retains the live page's Workshop Programs introduction above the index and the existing editable program copy, so its rows are taller than the compact visual reference.
- Purpose-built 4:3 images use one cohesive dark miniature-studio language while giving each program a distinct production metaphor.
- Desktop alternation remains legible and balanced. Mobile collapses to title and explanation, image, method ledger, metadata, then CTA.

## Findings and fixes

- P2 fixed: the initial mobile build placed the method ledger before the image. DOM order was changed so the visual follows the narrative before the supporting ledger.
- No remaining P0, P1, or P2 visual issues found.
- Console check: no warnings or errors.
- Interaction check: the programs anchor and the Character / Mannequin route both navigate correctly.

## Final output and supporting-system cards

- Final export directory: `public/media/workshop/route-cards/`
- Durable asset manifest: `src/data/media-registry.ts` under the `workshop.route-card.*` keys
- Nine generated WebP images: Publication, Motion and social, Marketplace, Academy, Applications and studio work, StyleFusion, Wonder Machine, Voice and avatar production, and Image, motion, and delivery
- Export dimensions: 1360 x 1020 pixels for every image
- Generation method: one built-in ImageGen generation per asset, followed by deterministic WebP conversion; no autonomous regeneration
- Shared direction: cinematic handcrafted miniature workbenches, ink-black and deep-blue rooms, warm practical lamps, restrained cyan and magenta accents, and no baked-in headings, logos, watermarks, or readable labels
- Desktop captures: `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-workshop-output-cards.png` and `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-workshop-tool-cards.png`
- Mobile captures: `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-workshop-output-cards-mobile.png` and `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-workshop-tool-cards-mobile.png`
- Desktop QA: all five output cards form an even row at 1536 x 1024; all four supporting-system cards preserve the two-column layout and readable image crops
- Mobile QA: cards collapse to one column, image crops retain their subjects, and titles, descriptions, and calls to action remain readable
- Interaction check: the Publication card navigates to `/articles/` and browser history returns to the Workshop page correctly
- Console check: no page-origin warnings or errors; Chrome reported one extension message-channel closure unrelated to the site runtime
- No P0, P1, or P2 visual issues found in the final two sections.

final result: passed
