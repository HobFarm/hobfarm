# Character Mannequin Page Validation

Date: July 15, 2026  
Route: `/workshop/character-mannequin/`  
Branch: `feat/character-mannequin-page-overhaul`

## Outcome

The placeholder workshop page was replaced with a dedicated visual case study. It now presents the original mannequin designs, three full look transformations, a second character example, a decision matrix, reusable tool notes, an honest offer ladder, and links into the Shop, Academy, Projects, and contact flow.

The page treats the workflow as tool-agnostic. ElevenLabs is shown as one practical implementation, with separate links for the portrait-to-character-sheet flow and the broader character workflow. The affiliate relationship is disclosed next to the recommendation.

No Stripe configuration, product identifiers, prices, license terms, entitlements, Cloudflare resources, or production deployments were changed.

## Automated validation

| Check | Result |
| --- | --- |
| `npm.cmd test` | Passed: 135 tests |
| `npx.cmd astro check` | Passed: 0 errors, 0 warnings, 0 hints across 414 files |
| `npm.cmd run build` | Passed |
| `git diff --check` | Passed |

The production build retained two pre-existing warnings: the empty `src/content/adventures` collection and a Vite chunk larger than 500 kB. Neither warning was introduced by this page.

## Browser and interaction QA

The page was checked at 375 × 812, 768 × 1024, and 1440 × 900. Chrome was used for interactive QA. Local Playwright was used for the final responsive screenshots because the in-app browser's full-page capture repeated tiles when smooth scrolling was active.

| Check | 375 px | 768 px | 1440 px |
| --- | --- | --- | --- |
| Horizontal overflow | None | None | None |
| Broken images | None | None | None |
| Selected look tabs | 4 | 4 | 4 |
| Visible tab panels | 4 | 4 | 4 |
| Sticky identity rail | Hidden | Hidden | Visible |
| Page console errors | None | None | None |

Additional interaction checks:

- Arrow keys, Home, and End move focus and selection through each look's tabs.
- Each look defaults to its Scene panel.
- All panels remain readable without JavaScript; enhancement hides inactive panels only after initialization.
- Starting a second motion clip pauses the first clip.
- Motion clips use native controls, `muted`, `playsinline`, `preload="none"`, and poster images.
- The custom-character link opens `/contact/?subject=custom-character`, and the hydrated form selects **Custom Character**.
- The workshop page produced no console warnings or errors. The contact page showed Cloudflare Turnstile error 110200 on localhost, which is an existing local-domain restriction rather than a page regression.
- Reduced-motion emulation disables smooth scrolling and section snap behavior.

## Accessibility and media checks

- The look selector uses `tablist`, `tab`, and `tabpanel` semantics with linked labels and panels.
- Focus-visible styling is present on interactive controls.
- Images use descriptive alternative text, explicit dimensions, responsive `srcset` values, and lazy loading below the hero.
- The first hero image is the only eager image.
- Public raster delivery uses Cloudflare image transformations and caps derivatives at the existing 1600 px public-preview ceiling.
- MP4 files remain direct CDN media and range from about 0.90 MB to 1.30 MB.
- A throttled Lighthouse run was not performed, so the LCP, INP, and CLS targets are not claimed as measured. The implementation controls their main risks through reserved media dimensions, deferred video loading, static Astro rendering, and a small progressive-enhancement script.

## Verified CDN assets

The following URLs returned media successfully:

- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/mannequin1-character-sheet.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/mannequin2-character-sheet.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/mannequin1-portrait.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/mannequin2-portrait.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/character-scene-outfit1.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/character-scene-outfit2.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/character-scene-outfit3.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/character2-scene-outfit3.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/mannequin-outfit1.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/mannequin-outfit2.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/mannequin-outfit3.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/mannequin2-outfit3.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/outfit1.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/outfit2.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/outfit3.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/character-scene-outfit1.mp4`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/character-scene-outfit2.mp4`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/character-scene-outfit3.mp4`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/designs/character2-scene-outfit3.mp4`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/page-graphics/hobfarm-mannequin-character-outfit-design-apply-scene.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/page-graphics/hobfarm-mannequin-character-outfit-scene-design.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/page-graphics/hobfarm-mannequin-character-outfit-scene-video-design.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/page-graphics/hobfarm-mannequin-outfit-design.png`
- `https://cdn.hob.farm/workshop/mannequin-outfit-character/page-graphics/hobfarm-scene-character-outfit-design.png`

`https://cdn.hob.farm/workshop/mannequin-outfit-character/page-graphics/hobfarm-mannequin-design.png` returned 404 and is intentionally omitted from the rendered page. The new original portrait and character-sheet images cover that chapter without a broken request.

## Screenshot artifacts

- `C:\Users\xkxxk\.codex\visualizations\2026\07\15\019f64a3-bfa4-7e82-9fc2-0bb829eedba6\character-mannequin-after-375.png`
- `C:\Users\xkxxk\.codex\visualizations\2026\07\15\019f64a3-bfa4-7e82-9fc2-0bb829eedba6\character-mannequin-after-768.png`
- `C:\Users\xkxxk\.codex\visualizations\2026\07\15\019f64a3-bfa4-7e82-9fc2-0bb829eedba6\character-mannequin-after-1440.png`
- `C:\Users\xkxxk\.codex\visualizations\2026\07\15\019f64a3-bfa4-7e82-9fc2-0bb829eedba6\character-mannequin-tablet-identity-viewport.png`

## Commerce boundary and next task

The page exposes no false purchase state. The existing Sophia and Stella sheet pack remains marked **Coming soon**, and the new paid-download concepts are also labeled **Coming soon**. The custom-character offer routes to a scoped inquiry instead of an unconfigured checkout.

The next sellable task should package Look 01 first: decide the listing platform, define the buyer files, approve the license and price, create the real product record, and connect fulfillment or entitlement handling. Once those facts exist, the workshop card can link to a real Shop listing without changing the case study's editorial role.

Deployment was not performed.
