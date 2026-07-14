# Other Alice cast foundation design QA

## Result

The five-route Other Alice experience passed rendered QA at all four required viewport sizes. The Cast page stays readable without JavaScript and without a full portrait set. Approved art appears where a valid public record exists; every missing image uses a deliberate typographic evidence panel.

## Browser method

The Chrome plugin runtime could not initialize in this session. Per the repository browser checklist, QA continued with local Playwright against a fresh production build served by `npm run preview` at `127.0.0.1`.

No browser extension, native host, or Chrome profile setting was changed.

## Routes and viewports

Routes checked:

- Start Here
- World Guide
- Houses
- Cast
- Web of Wonderland

Viewport sizes:

| Width | Height | Use |
| ---: | ---: | --- |
| 1440 | 1000 | Desktop |
| 1024 | 900 | Compact desktop |
| 768 | 1024 | Tablet |
| 390 | 844 | Mobile |

This produced 20 full-page route and viewport captures under `reports/other-alice-cast-foundation/after/`. The final capture set was refreshed against the production `hob.farm` deployment.

## Automated rendered checks

Every route and viewport passed these checks:

- HTTP 200 response
- one `h1`
- one `main` landmark
- project and site navigation present
- one document footer landmark
- no horizontal overflow beyond one rounding pixel
- no broken images
- alt text present on every image
- accessible names on links and form controls
- no duplicate IDs
- reduced-motion media query active
- keyboard focus enters the document
- no unexpected console errors
- no unexpected failed network requests
- shared project navigation labels and order unchanged across routes

The first rendered runs found and fixed two issues:

1. Ciryl's proposed CDN portrait path returned 404. The cast now reuses the existing approved Ciryl image URL.
2. The Cast record-status note used a second `footer` element. It is now an appropriately labelled aside, leaving one document footer landmark.

## Interaction and deep-link checks

- World Guide route query restored Orbital; Arrow Right selected Burrow and updated the URL.
- Houses query restored Diamonds; Arrow Right selected Spades and updated the URL.
- Web of Wonderland query restored Ecology; Arrow Left selected Authority and updated the URL.
- The White Rabbit dossier fragment resolved directly.
- Tweedledum and Tweedledee remained separate records with the shared `tweedle-pair` display group.
- Image-free records rendered the intentional folio fallback.
- All 32 links inside the Cast page returned HTTP 200 where applicable, and every fragment target existed in the destination document.
- Search output included Cast of Wonderland.
- Sitemap output included the Cast route.
- Both retired Adventure routes redirected to Start Here and remained absent from search and sitemap output.

## Visual inspection

The desktop and mobile Cast captures and the desktop Web of Wonderland capture received a manual image review.

- The Cast page opens with Alice, Chester, and Ciryl before the wider Carroll-derived cast.
- Group headings remain distinct and readable at desktop and mobile widths.
- Dossier rails, evidence rows, and relationship actions keep a consistent hierarchy.
- Alice, Chester, Ciryl, and the provisional Hatter concept fit their folios without broken media or empty frames.
- Design-pending residents use typographic evidence panels rather than initials, silhouettes, or generated placeholders.
- The Queen of Hearts is labelled as Wonderland's central sovereign.
- The public page contains no Green Queen or Red Queen material.
- The relationship diagram remains contained at desktop width, with the node index and ledger readable below it.
- The global header, project navigation, and footer remain intact.

No responsive overflow, clipped essential copy, unreadable contrast, or missing media was found in the reviewed captures.

## Local performance notes

Playwright's local headless observers recorded these maxima across the 20 combinations:

- LCP: 1320 ms
- CLS: 0.0000
- longest observed long task: 99 ms

These values are local regression signals, not a production Lighthouse result.

## Production verification

After deployment, the same Playwright suite ran against `https://hob.farm` and passed all 20 route and viewport combinations, 32 Cast links, deep links, filter systems, redirects, search, sitemap, media, accessibility, reduced-motion, and overflow checks.

The production-domain run recorded:

- LCP: 2836 ms
- CLS: 0.0001
- longest observed long task: 102 ms

These are headless browser observations, not a Lighthouse score.

## Skipped checks

- Chrome-plugin visual QA was skipped because its runtime connection could not initialize.
- No separate manual Chrome session was run after deployment; the production verification used Playwright.
