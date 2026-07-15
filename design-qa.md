# Character Mannequin landscape hero design QA

## Comparison target

- Source visual truth: `C:/Users/xkxxk/AppData/Local/Temp/hobfarm-character-desktop-final.png` (pre-change 1440 × 900 capture matching the user-supplied current-state screenshot)
- Implementation URL: `http://127.0.0.1:4321/workshop/character-mannequin/`
- Implementation screenshot: `C:/Users/xkxxk/AppData/Local/Temp/hobfarm-character-desktop-stacked.png`
- Mobile screenshot: `C:/Users/xkxxk/AppData/Local/Temp/hobfarm-character-mobile-stacked.png`
- Viewport: 1440 × 900 CSS pixels at device scale factor 1; responsive check at 375 × 812
- State: signed-out public route, top of page, default look tabs
- Full-view comparison evidence: `C:/Users/xkxxk/AppData/Local/Temp/hobfarm-character-layout-comparison.png`

No separate focused crop was needed. The full viewport contains the complete hero at readable native resolution, including the headline, deck, actions, and enough of the landscape artwork to verify its order, width, crop, and spacing.

## Findings

No actionable P0, P1, or P2 differences remain after the layout pass.

- Fonts and typography: the existing display and mono faces, weights, letter spacing, and hierarchy are preserved. The landscape layout gives the headline the full content width, producing a balanced two-line desktop wrap instead of the narrow five-line column.
- Spacing and layout rhythm: the copy now occupies one full-width row and the artwork begins 56 pixels below it at 1440 pixels. The desktop grid resolves to one 1216-pixel column. Mobile retains the existing vertical flow with a 32-pixel gap and no horizontal overflow.
- Colors and visual tokens: the black, violet, white, muted grey, and mint palette is unchanged. Existing borders, button treatments, and background lighting remain intact.
- Image quality and asset fidelity: the same 1672 × 941 landscape source is rendered uncropped at full content width. No placeholder, generated replacement, or code-native approximation was introduced.
- Copy and content: headline, deck, calls to action, caption, and lower-page content are unchanged.
- Responsiveness and accessibility: desktop and 375 × 812 captures have no document overflow. Header and footer remain present. The hero keeps semantic heading and figure markup.
- Interaction states: both hero CTA destinations remain correct. Four look tab groups retain one selected and visible panel each, and ArrowRight advances focus and selection.
- Console and media: zero page console errors and zero failed image responses in the final Character Mannequin passes.

## Comparison history

### Iteration 1

- Earlier P1 finding: the landscape hero image shared a desktop row with the headline, forcing the title into a very tall narrow column and making the artwork compete with it.
- Fix made: derive the hero arrangement from the media dimensions, use a full-width horizontal layout for landscape art, and preserve the two-column option for future portrait art.
- Post-fix evidence: the 1440 × 900 implementation capture shows the complete copy block first and the landscape artwork beneath it; computed layout confirms the artwork begins below the copy and the grid uses one column.

## Implementation checklist

- [x] Detect landscape and portrait hero orientation from media dimensions.
- [x] Stack landscape artwork below the complete headline block.
- [x] Preserve a two-column desktop layout for portrait artwork.
- [x] Keep the existing mobile stack, copy, assets, and interactions.
- [x] Validate desktop and mobile overflow, console, images, CTAs, and tabs.

## Follow-up polish

No blocking polish remains.

final result: passed
