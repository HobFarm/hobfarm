# Visual Lab performance comparison

Measured from the production build on July 12, 2026. These are deterministic build and transfer-size proxies, not Lighthouse scores. The Phase 1 browser surface did not expose Lighthouse, so the comparison uses the same build-output method as the audit.

## Public Workshop route

| Measure | Phase 1 baseline | After visual-lab work | Change |
| --- | ---: | ---: | ---: |
| Workshop HTML | 98,863 bytes | 98,859 bytes | -4 bytes |
| Shared BaseLayout CSS | 171,026 bytes | 171,094 bytes | +68 bytes |

The private prototype does not add its route CSS or component scripts to the public Workshop HTML. No Three.js or client framework chunk was introduced for the lab.

## Noindex visual-lab route

| Initial first-party asset | Raw | Gzip |
| --- | ---: | ---: |
| HTML, including route scripts | 60,933 bytes | 14,502 bytes |
| Shared BaseLayout CSS | 171,094 bytes | 24,551 bytes |
| Route CSS | 11,870 bytes | 2,478 bytes |
| Existing search script | 3,368 bytes | 1,445 bytes |
| Total | 247,265 bytes | 42,976 bytes |

The route's inline script content is 5,629 characters and is already included in the HTML row. The poster is complete content, preview images use capped Cloudflare transforms, and the MP4 has no `src` until the visitor activates the play control.

## Behavioral checks

- Desktop and mobile have no document-level horizontal overflow.
- All preview images resolved during the captured QA run.
- Two comparison controls respond to keyboard input.
- Reduced-motion mode removes the comparison-handle pulse and skips the scripted reveal hint.
- With JavaScript disabled, the headings, comparison images, asset manifest, related links, poster, and direct video fallback remain available.
- The ambient video request is absent on initial load and appears only after explicit activation.

## Commands

```text
npm run build
npx playwright test e2e/visual-lab.spec.ts
```

Raw and gzip sizes were measured from `dist/client/` with PowerShell and .NET `GZipStream` after the production build.
