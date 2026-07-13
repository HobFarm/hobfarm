# HobFarm Presents Design QA

## Evidence

- Source visual truth:
  - `F:\Web-Stuff\HobFarm-web Project Files\Content and Files\Stock-Photos\dynamic-science-fiction-195401-0ba13c.jpg`
  - `F:\Web-Stuff\HobFarm-web Project Files\Galleries\Characters\blue chick 1 web.jpg`
  - Existing HobFarm Presents and Other Alice CDN artwork referenced by the page data.
- Rendered implementation: `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-first-release-qa\presents-desktop-hero.png`
- Combined comparison: `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-first-release-qa\design-comparison.png`
- Focused captures:
  - `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-first-release-qa\presents-desktop-atlas.png`
  - `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-first-release-qa\presents-mobile-atlas.png`
  - `C:\Users\xkxxk\AppData\Local\Temp\hobfarm-first-release-qa\presents-mobile-support.png`
- Viewports: 1440 × 1000 desktop and 390 × 844 mobile.
- State: public, dark theme, content loaded; reveal sections were scrolled into view.

## Findings

- No actionable P0, P1, or P2 differences remain.
- Typography: the hero adopts the source covers' oversized stacked hierarchy and condensed visual rhythm while retaining HobFarm's existing IBM Plex family for licensed, readable HTML text. Display lettering within supplied cover artwork remains part of the source image.
- Spacing and layout: the desktop split-cover composition, issue index, section rules, and mobile single-column sequence preserve a consistent magazine rhythm. Both tested viewports have equal `scrollWidth` and `innerWidth`, with no horizontal overflow.
- Colors and tokens: parchment, yellow-gold, violet-black, cyan, green, and red platform accents connect the pulp references to the existing psychedelic-goth site palette without reducing body-text contrast.
- Image quality: all visible imagery uses supplied CDN assets or supplied references; no placeholder, CSS-drawn, or approximate illustration replaces source art. No broken images were found.
- Copy: headings and navigation explain the reader journey directly and connect fiction to the atlas, character files, shop, Academy, Club, Ko-fi, and Patreon.
- Interaction and accessibility: anchor navigation, shop/support links, horizontal cover browsing, focus states, reduced-motion fallbacks, lazy loading, and reveal behavior were checked. No browser console errors were recorded.

## Comparison History

- Initial full-page capture showed unrevealed sections and unloaded lazy images because the automated capture did not scroll. This was capture-state evidence, not a product defect.
- The page was retested by scrolling every reveal section at desktop and mobile sizes. Post-scroll evidence showed zero unrevealed sections, zero broken images, zero console errors, and no viewport overflow.

## Follow-up Polish

- P3: when a dedicated licensed HobFarm display face is selected, it can replace IBM Plex only for large issue headlines while retaining the current body and interface typography.
- P3: future short MP4/WebM loops can occupy the existing motion-ready editorial slots once production assets are approved and uploaded to the CDN.

## Implementation Checklist

- [x] Desktop composition and hierarchy checked.
- [x] Mobile layout and overflow checked.
- [x] Required typography, spacing, color, image, and copy surfaces checked.
- [x] Motion reduction and reveal completion checked.
- [x] Support and shop paths checked.
- [x] Console and broken-image checks passed.

final result: passed

---

# Workshop media integration Design QA

Result: passed

## Scope

- `/workshop/`
- `/workshop/stylefusion/`
- `/workshop/character-mannequin/`
- `/workshop/workshop-notes/`
- Desktop viewport: 1440 × 1000
- Mobile viewport: 390 × 844

## Source comparison

The existing Workshop pages and the revised prototype were placed in the same comparison image at `reports/workshop-design-qa-comparison.png`. The revision keeps the current header, navigation, type hierarchy, dark palette, sharp borders, spacing rhythm, and route structure. The new media sections use the same editorial grid language instead of introducing a separate visual system.

## Checks

- Desktop and mobile layouts have no horizontal overflow.
- Workshop navigation, program links, breadcrumbs, footer links, and indexed article links remain functional.
- StyleFusion keeps private references visually distinct from generated results and downstream production assets.
- Videos use real poster images, native controls, `preload="none"`, and do not transfer their MP4 files during the initial page load.
- Expandable lineage and export records remain collapsed by default.
- Media captions remain readable and image crops preserve the important subject matter at both viewports.
- The final mobile Lighthouse audit for StyleFusion scored 100 for accessibility, best practices, SEO, and agentic browsing, with zero failed audits.

## Findings resolved

- Changed the Generic Female decision-record grid so mobile cards show the complete records instead of cropping them.
- Increased the current breadcrumb label contrast to resolve the only initial accessibility finding.
- Replaced prototype-oriented private-reference wording with public-page wording.

## Non-blocking notes

- The production build retains the repository's existing Vite warning for a JavaScript chunk larger than 500 kB.
- The before trace used the deployed site and the after trace used the local production preview, so raw LCP values are directional rather than a controlled benchmark. Request behavior is directly comparable: the revised Workshop page starts no MP4 transfer.

Final result: passed
