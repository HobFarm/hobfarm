# Trash Mountain completion report

## Result

Built and published a source-backed visual feature from the supplied Codex pack. The article combines original street-waste photographs, an attributed Google Earth investigation of Dar-es-Salam in Conakry, an original waste-slope mechanism diagram, a 22-event casualty ledger, licensed case photographs and a downloadable research CSV. It was released on August 11, 2026 at 4:20 p.m. Pacific.

## Route and status

- Route: `/articles/trash-mountain/`
- Draft/scheduled/published: published
- Publication date: August 11, 2026 at 4:20 p.m. PDT (`2026-08-11T16:20:00-07:00`)
- Historical publisher: the one-time workflow ran successfully and removed itself in publication commit `82968b7`; its orphaned helper script was removed during the later structure audit
- Current public state: published

## Article

- Final title: **We Built a Mountain and It Moved**
- Deck: **An investigation into overflowing bins, closed Maine landfills, a burning garbage mountain in Conakry, and the rare moments when waste becomes moving geology.**
- Narrative word count: approximately 2,075, excluding frontmatter, imports and source-note URLs
- Sections: 10, including sources and method
- Ledger rows published: 22
- Page images rendered: 26, including hero media

## Media

| Asset group | Source class | Derivatives | CDN destination | Credit | Status |
|---|---|---|---|---|---|
| 11 street and shoreline photographs | User-owned | Original files retained; U01 also supplies hero/social crops | `articles/trash-mountain/source/` | HobFarm | All 11 used in article; uploaded and verified |
| 16 Conakry captures | Google Earth editorial evidence | None | `articles/trash-mountain/google-earth/` | Google Earth plus visible providers | 11 used; 5 secondary references retained; attribution remains visible; uploaded and verified |
| Payatas, Hulene and Kiteezi photographs | CC BY-SA 3.0, CC BY-SA 2.0 and CC0 | None | `articles/trash-mountain/licensed/` | Per-source creator credits | Used in case strip; uploaded and verified |
| Ghazipur, Pacific map and two NASA Conakry images | CC/public-domain | None | `articles/trash-mountain/licensed/` | Per-source credits | Omitted from the page but retained as verified supporting assets |
| Hero and social crops | User-owned U01 | 1600×900 WebP and 1200×630 WebP | `articles/trash-mountain/` | Photograph: HobFarm | Used in metadata/layout; uploaded and verified |
| Fatal-event ledger | Original structured research | CSV | `articles/trash-mountain/data/` | HobFarm research audit | Used as download; uploaded and verified |
| Guineematin ground photograph | Reference only | None | None | Not published | Excluded because the pack contains no publication license |

All 37 publishable files remain staged under `_cdn/articles/trash-mountain/` (52,436,372 bytes) and were uploaded through the non-overwriting manifest. R2 checksums and public CDN responses were verified for every object. Upload completed at `2026-08-11T01:25:02.532Z`.

## Components

- `ConakryLocator.astro`: two-frame geographic introduction
- `TrashPhotoGrid.astro`: responsive owned-photo groupings
- `SatelliteTimeline.astro`: six dated frames from 2000 through 2025
- `BeforeAfterProof.astro`: May/December 2019 southern-edge comparison
- `TrashMountainFigure.astro`: credited standalone evidence figures
- `WasteSlopeMechanism.astro`: repository-native HTML/SVG failure diagram
- `CaseImageStrip.astro`: licensed Payatas, Hulene and Kiteezi views
- `CaseLedger.astro`: summary figures, caveat, 22-row table and CSV download

## Research decisions

- Used **Dar-es-Salam** for the Conakry site and reserved **Dar es Salaam** for Tanzania.
- Kept the author outside the African eyewitness frame; the Conakry account is explicitly based on imagery, reporting and records.
- Described Conakry's collection chain without claiming that organized waste service does not exist.
- Kept Guinea's July 1, 2026 wording as **progressive closure** and did not describe Dar-es-Salam as closed.
- Used Amnesty International's later total of at least 10 deaths for the 2017 Conakry collapse.
- Kept the Human Rights Watch demolition count separate from the supplied imagery pair; the article does not turn 386 documented destroyed buildings into an exact image polygon.
- Preserved the Payatas conflict: 218 in the commonly repeated official total versus 278 recovered bodies in the engineering account.
- Used 35 confirmed deaths for Kiteezi while retaining the unresolved missing-person record.
- Used 36 direct deaths for Binaliw; the later responder death remains separate.
- Marked Rodriguez as disputed: one death and two missing in the strongest official update located, three deaths in later technical reporting. The 691 audit total uses three.
- Kept New Carmen at two confirmed deaths and one missing in the latest strong update located.
- Used the final nine-death total for Moshi.
- Kept weak historical inventory rows visible as provisional instead of presenting them as fully verified.
- Made no clean global increase-rate claim from a record affected by archive and reporting bias.
- Described the Pacific garbage patch as a distributed accumulation zone, not a solid island.

## Rights decisions

- Google Earth appears only as attributed editorial evidence. Visible Google/provider credits and imagery dates remain in the frames. No Google imagery is used for the hero or social card.
- The Guineematin image is omitted because no publication license was supplied.
- Payatas and Hulene retain creator, source and share-alike credits; Kiteezi retains its creator/source record and CC0 label.
- The NASA/USGS pair and other licensed references remain staged and documented even where omitted from the final page.

## Files changed

- Historical one-time publication workflow (removed after publication)
- `package.json`
- `scripts/build-trash-mountain-manifest.mjs`
- Historical one-time publication helper (left behind by the publication commit, then removed as stale residue)
- `scripts/r2-upload-manifest.mjs`
- `src/content/articles/trash-mountain.mdx`
- `src/data/trash-mountain.ts`
- `src/components/articles/trash-mountain/` (8 components)
- `tests/trash-mountain-article.test.mjs`
- `reports/trash-mountain/asset-manifest.json`
- `reports/trash-mountain/qa-desktop-top.png`
- `reports/trash-mountain/qa-desktop-timeline.png`
- `reports/trash-mountain/qa-mobile-top.png`
- `reports/trash-mountain/qa-mobile-timeline.png`
- `_cdn/articles/trash-mountain/` (37 staged, gitignored publish assets)

## Commands and validation

| Command | Result |
|---|---|
| Pack `verify-pack.py` | Passed: 11 owned photos, 16 Google Earth captures, 7 licensed/public files, 1 excluded reference, 22 event rows |
| `node scripts/build-trash-mountain-manifest.mjs --pack <pack>` | Passed; generated a checksummed 37-asset manifest |
| `node scripts/r2-upload-manifest.mjs --manifest reports/trash-mountain/asset-manifest.json --upload --resume` | Passed; all 37 R2 objects uploaded or checksum-adopted and publicly verified |
| Historical one-time publication helper | Passed its pre-publication guard; the orphaned file was removed during the later structure audit |
| `npx astro check` | Passed: 651 files, 0 errors, 0 warnings, 0 hints |
| `npm run build` | Passed; production build completed |
| `node --test tests/trash-mountain-article.test.mjs` | Passed: 2 of 2 |
| Local Playwright visual QA | Passed at 1440×1000 and 390×844: 26 images loaded, 22 ledger rows rendered, no horizontal overflow |
| `npm test` | Passed: 310 of 310 current repository tests |
| `npm run audit:site-structure` | Passed: 0 structural errors, 0 review warnings, 0 orphaned released articles |
| `npm run audit:editorial-mesh` | Passed: 0 structural errors, 0 review warnings |
| `git diff --check` | Passed |

## Unresolved

- Rodriguez's official and later technical totals still disagree.
- New Carmen's final missing-person outcome was not located.
- Kiteezi's missing-person record remains unresolved in the latest strong source located.
- Several older ledger rows retain low or medium-low confidence pending stronger local-language archive receipts.

## Deployment

- Article/workflow commit: `9dc9ae13c037a3c9277bcdd3834e8f5354ee115b`
- Branch: `main`
- CDN upload completed: yes; 37 of 37 objects verified
- Publication commit: `82968b7`
- Scheduled workflow: completed and removed itself; the helper residue was removed later
- Public route: `/articles/trash-mountain/`

The article was published by the historical one-time workflow, which removed itself after completing the release.
