**Source visual truth**

- User-provided homepage Future Carriage screenshot and layout brief in the active conversation.
- Orange historical source: `public/media/workshop/ami-legacy/historical/diligence-coach.webp` (1920 × 1235).
- Existing HobFarm Legacy campaign assets in `public/media/workshop/ami-legacy/`.

**Implementation evidence**

- Desktop screenshot: `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-future-carriage-desktop.png`.
- Mobile screenshot: `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-future-carriage-mobile.png`.
- Route and state: homepage, Future Carriage section, default dark theme, static content.
- Desktop capture: 1757 × 909 pixels at the browser's default 1757 × 909 CSS viewport.
- Mobile capture: 390 × 844 pixels at a 390 × 844 CSS viewport.
- Density normalization: browser screenshots were compared at their native CSS viewport size; no resampling was needed.

**Full-view comparison evidence**

- The Future Carriage section now follows the requested four-part image sequence.
- The existing Legacy campaign image leads at full width.
- The supplied orange diligence drawing appears first beside the orange autonomous-coach interpretation.
- The Brewster No. 3917 drawing follows beside its modern Model 3917 interpretation.
- The Ami and Model 3917 presenter frame closes the sequence at full width.
- The two redwood campaign images are no longer present in the homepage section.

**Focused region comparison evidence**

- Desktop comparison cards were inspected at readable scale. Historical sources use `object-fit: contain`; modern images use `object-fit: cover`. Both pairs remain aligned without stretching.
- The Ami presenter image is a single 16:9 full-width frame beneath the comparison row.
- The mobile comparison cards stack each historical drawing immediately above its modern interpretation. Titles, source labels, and image captions remain readable without horizontal overflow.
- Mobile measurements reported a 341-pixel content width for both the comparison and presenter images, with no horizontal overflow.

**Findings**

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: existing HobFarm display and mono treatments preserve the homepage hierarchy at desktop and mobile widths.
- Spacing and layout rhythm: the full-width hero, two comparison cards, and final presenter frame form a clear sequence with consistent gaps and borders.
- Colors and visual tokens: the existing warm brown and gold Future Carriage palette remains intact.
- Image quality and asset fidelity: all supplied and existing raster assets render sharply, with historical drawings contained rather than cropped.
- Copy and content: captions identify the historical and modern sides, preserve source notes, keep the concept-campaign disclaimer, and explain Ami's role as a spokesperson produced through the avatar workflow.

**Primary interactions and console**

- Confirmed the section exposes the existing `/workshop/future-carriage/` case-study link and `/contact/?subject=creative-project` inquiry link.
- No application console errors were found. Chrome reported a message-channel warning from browser-extension plumbing, unrelated to the page.

**Comparison history**

- Initial implementation pass produced no P0, P1, or P2 findings. No visual correction loop was required.

**Implementation checklist**

- [x] Lead with the Legacy campaign hero.
- [x] Pair the orange historical drawing with the orange modern concept.
- [x] Pair the 3917 historical drawing with the green Model 3917 concept.
- [x] Close with Ami and Model 3917 as the avatar-spokesperson application.
- [x] Remove the two redwood campaign images from the homepage section.
- [x] Preserve responsive behavior and existing calls to action.

**Follow-up polish**

- None required for this pass.

final result: passed
