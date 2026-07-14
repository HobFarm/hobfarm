# Other Alice Adventures design QA

## Comparison target

- Source visual truth: `C:/Users/xkxxk/.codex/generated_images/019f5d6b-72b0-73a1-8365-5f6ab300110b/exec-6a87c586-0e6d-4be8-8a5c-88499049786e.png`
- Implementation URL: `http://127.0.0.1:4322/departments/hobfarm-presents/other-alice-adventures/`
- Implementation screenshot: `C:/Users/xkxxk/.codex/visualizations/2026/07/13/019f5d6b-72b0-73a1-8365-5f6ab300110b/oaa-redesign-desktop-1440x1024-qa.png`
- Viewport: 1440 × 1024 CSS pixels at device scale factor 1
- State: dark theme, signed-out public route, top of page, Start Here active
- Full-view comparison evidence: `C:/Users/xkxxk/.codex/visualizations/2026/07/13/019f5d6b-72b0-73a1-8365-5f6ab300110b/oaa-source-vs-implementation-final.png`
- Mobile evidence: `C:/Users/xkxxk/.codex/visualizations/2026/07/13/019f5d6b-72b0-73a1-8365-5f6ab300110b/oaa-redesign-mobile-390x844-settled.png`

No separate focused crop was needed. The source is a single first-viewport design, and the normalized 2880 × 1024 side-by-side comparison preserves the hero typography, project mark, navigation, buttons, chronology, Alice, Chester, and map at a readable native scale.

## Findings

No actionable P0, P1, or P2 differences remain.

- Fonts and typography: the implementation preserves the source's large high-contrast serif display face, restrained sans-serif body copy, and small mono navigation and metadata. Line lengths, wraps, weights, and hierarchy remain legible at desktop and mobile widths.
- Spacing and layout rhythm: the two-level navigation, left hero copy column, right visual focus, button row, and chronology strip retain the source's proportions. Mobile collapses the composition into a readable vertical sequence without document overflow.
- Colors and visual tokens: black, violet, cyan, muted magenta, and pale lavender match the target. The darker production hero keeps live copy contrast readable without flattening the map detail.
- Image quality and asset fidelity: the hero uses a production raster asset with the correct eighteen-year-old Alice and a smaller, normal British Blue Chester. The user-supplied rabbit is a transparent raster project mark rather than a code approximation. Character, Hatter, map, poster, and Chester assets render at their natural dimensions without missing-image states.
- Copy and content: the first viewport locks Alice at eighteen, arrival at eight, ten Wonderland years, and two hundred outside years. Lower sections connect the atlas, Hatter, Diamond Highlands, Houses, relationship web, concept art, and archive without adding unresolved Hatter questions to canon.
- Responsiveness and accessibility: desktop and 390 × 844 mobile captures have no document-level horizontal overflow or broken visible images. Navigation remains horizontally available on mobile with its scrollbar hidden, controls use semantic links and buttons, the map tabs expose `aria-pressed`, and supplied images have descriptive alt text.
- Interaction states: the Lived Map control changed the active heading to “Map used by people who keep the realm running” and reported `aria-pressed="true"`.
- Console: zero browser warnings or errors in the final desktop pass.

## Comparison history

### Iteration 1

- Earlier P2 finding: the mobile project navigation exposed a native horizontal scrollbar, adding an unintended grey control between the project nav and hero.
- Fix made: added `scrollbar-width: none` and a hidden WebKit scrollbar rule to `OaaProjectNav.astro` while preserving touch and wheel scrolling.
- Post-fix evidence: `C:/Users/xkxxk/.codex/visualizations/2026/07/13/019f5d6b-72b0-73a1-8365-5f6ab300110b/oaa-redesign-mobile-390x844-settled.png`; computed `scrollbar-width` is `none`, the route strip remains scrollable, and no document overflow is present.

## Lower-page visual evidence

- Hatter dossier: `C:/Users/xkxxk/.codex/visualizations/2026/07/13/019f5d6b-72b0-73a1-8365-5f6ab300110b/oaa-hatter-section-desktop.png`
- House system: `C:/Users/xkxxk/.codex/visualizations/2026/07/13/019f5d6b-72b0-73a1-8365-5f6ab300110b/oaa-houses-section-desktop.png`
- Character-system transition: `C:/Users/xkxxk/.codex/visualizations/2026/07/13/019f5d6b-72b0-73a1-8365-5f6ab300110b/oaa-cast-section-desktop.png`

## Implementation checklist

- [x] Match the selected hero composition and hierarchy.
- [x] Use the melting rabbit as the project identity.
- [x] Correct Alice, Chester, chronology, and future-bleed canon.
- [x] Add the Hatter and Diamond Highlands as a full character/world-system example.
- [x] Keep the living atlas tabs functional.
- [x] Validate desktop and mobile rendering.
- [x] Check browser console and visible image loading.

## Follow-up polish

No blocking polish remains. The production hero intentionally gives Chester less visual weight than the source concept because the user rejected the oversized-cat direction.

final result: passed
