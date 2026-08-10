# From Wetlands to the Wash completion report

## Publication

- Title: `From Wetlands to the Wash`
- Route: `/articles/from-wetlands-to-the-wash/`
- Source: `src/content/articles/from-wetlands-to-the-wash.mdx`
- Status: `scheduled`
- Publication time: August 15, 2026 at 4:20 p.m. PDT (`2026-08-15T16:20:00-07:00`)
- Predecessor: `I Want My MTV`, scheduled exactly 24 hours earlier
- Feature length: 5,235 words under the article test's MDX count

The one-time publisher checks the exact timestamp, changes the article to `published`, removes its own workflow, and commits that scheduled publication change. No commit, push, deployment, or Cloudflare Pages configuration change was made during preparation.

## Article and graphics

The finished article opens with the supplied one-minute LINQ flood video and closes its historical route at the July 30 JRAD performance. It includes:

- the wash-route schematic
- the annotated 1982 Paluzzi detail
- the property and music dual timeline
- the Brooklyn Bowl family tree
- the March 2014 opening calendar
- a qualitative public-evidence market comparison
- three click-to-load, privacy-enhanced YouTube embeds
- the supplied July 30 JRAD video in an article-native player

The Paluzzi annotation identifies only visible landmarks. It does not draw a parcel boundary or claim that the future LINQ or Brooklyn Bowl footprint can be surveyed from the photograph.

## Media and rights

The R2 upload manifest is `reports/bblv/upload-manifest.json`. Before upload, the `articles/bblv/` prefix was inventoried and its four existing keys were preserved. Seventeen new-key assets were uploaded and verified by remote SHA-256 and public HTTP response:

- 10 selected author-photograph derivatives
- 3 UNLV Special Collections educational-use derivatives with linked records and credits
- 2 author-video poster frames
- 2 480p H.264/AAC fast-start web video derivatives

The existing hero, flood-video original, and supplied JRAD original were not overwritten. The article links the two full originals as fallbacks. The three author photographs not selected for the page remain in the supplied pack and were not uploaded.

## Fact and publication boundaries

The packet's source ledger and fact-check queue were used as the research contract. The article links its public evidence and distinguishes what the records establish from interpretation.

The following claims remain intentionally unpublished:

- any numeric JRAD attendance estimate, because no legitimate public box-office receipt was found
- internal attendance, settlement, ticketing, or workplace records
- private backstage details, coworker gossip, and management speculation
- an exact 1982 parcel boundary or future Brooklyn Bowl footprint
- a numeric Las Vegas market ranking that cannot be compared on consistent public evidence

The disclosure states that this is independent HobFarm work and does not represent Brooklyn Bowl, Live Nation, Caesars, Relix, or any artist.

## Continuity repair

The ending of `I Want My MTV` now treats Woodstock '99 as a future article once the photographs are scanned. Its supporting evidence component uses the same future-seed language.

## Verification

- Focused Node tests: 9 passed
- `npx astro check`: 0 errors, 0 warnings, 0 hints
- `npm run build`: passed
- Desktop visual QA: no horizontal overflow; native video and privacy-enhanced embed behavior verified
- Mobile visual QA at 390 by 844: no horizontal overflow
- R2 manifest: 17 uploaded, 17 verified

The full `npm test` run completed with 272 of 275 tests passing. The three failures are older structural tests that still expect already-removed one-time publishing workflows for `mr-paige-anteater`, `sharksploitation`, and `you-should-write-about-sharks`. They are unrelated to this article and were left unchanged.
