# Other Alice cast foundation completion report

## Outcome

The living-world site now has a fifth public route at `/departments/hobfarm-presents/other-alice-adventures/cast/`. The route presents 14 public records in five story and system groups. It uses dossier folios, evidence metadata, text-first visual fallbacks, and links into the World Guide and Web of Wonderland.

The Queen of Hearts is the central Wonderland sovereign. The undeveloped Wasteland authority is recorded privately as the Green Queen. No Green Queen or Red Queen record, relationship node, search item, sitemap item, asset, or rendered public copy was added.

## Files changed

### Existing files

- `.gitignore`
- `scripts/audit-other-alice-public-bundle.mjs`
- `scripts/qa-other-alice.mjs`
- `src/components/presents/ResidentGallery.astro`
- `src/components/presents/other-alice/OaaRelationshipWeb.astro`
- `src/components/presents/other-alice/OtherAliceStartPage.astro`
- `src/data/other-alice/assets.ts`
- `src/data/other-alice/canon.ts`
- `src/data/other-alice/navigation.ts`
- `src/data/other-alice/relationships.ts`
- `src/data/other-alice/residents.ts`
- `src/data/other-alice/types.ts`
- `src/data/story-series.ts`
- `src/lib/search-index.ts`
- `src/pages/departments/hobfarm-presents/[series]/world-guide.astro`
- `src/pages/sitemap.xml.ts`
- `tests/other-alice-world-guide.test.mjs`
- `tests/other-alice.test.mjs`

### New source, route, and test files

- `src/components/presents/other-alice/cast/CastDossierFolio.astro`
- `src/data/other-alice/private/character-origins.ts`
- `src/pages/departments/hobfarm-presents/other-alice-adventures/cast/index.astro`
- `tests/other-alice-cast.test.mjs`

### New task reports and QA artifacts

- `reports/other-alice-cast-foundation/completion-report.md`
- `reports/other-alice-cast-foundation/design-qa.md`
- `reports/other-alice-cast-foundation/r2-promotion-report.md`
- 20 local, Git-ignored PNG captures under `reports/other-alice-cast-foundation/after/`, covering five routes at four viewport sizes

## Public records added or normalized

The canonical public source remains `src/data/other-alice/residents.ts`. Presentation modules derive from it rather than copying full descriptions.

| Group | Public records |
| --- | --- |
| Present continuity | Other Alice, Chester, Ciryl Spade |
| Center and highlands | Queen of Hearts, Mad Hatter |
| Routes and transformation | White Rabbit, Rabbit guild, Caterpillar, Club road crews |
| Disputed identities and records | Tweedledum, Tweedledee, Humpty Dumpty |
| Old edge witnesses | Mock Turtle, Gryphon |

The model now supports stable IDs and slugs, display groups, entity kinds, public state, public role and current function, system and evidence references, origin disclosure, visual state, optional assets, optional detail readiness, and public visibility.

Tweedledum and Tweedledee retain separate stable IDs and share `tweedle-pair` only as a display group. White Rabbit remains a resident while Rabbit guild remains an institution. The Hatter person is not collapsed into the disputed Hatter office or network. Alice's public chronology is derived from `otherAliceChronology.residentSummary` in `canon.ts`.

## Private origin registry

`src/data/other-alice/private/character-origins.ts` contains 12 typed outline records:

- Other Alice
- Chester
- Queen of Hearts
- Mad Hatter
- White Rabbit
- Caterpillar
- Tweedledum
- Tweedledee
- Humpty Dumpty
- Mock Turtle
- Gryphon
- Green Queen

Every entry has `publicDisclosure: "withheld"`. The private module is excluded from the public data barrel and is never imported by a public source module.

## Public and private boundary checks

- The public-bundle audit scans built output and public sources for private origin field names and the Green Queen or Red Queen names and IDs.
- Structural tests confirm that the private registry is not imported through public modules.
- Public cast records expose only evidence and origin states, not formative visitor interactions.
- The Green Queen is present only in the private registry with withheld disclosure.
- No private image study, generated study, motion-review frame, supplied Alice PNG, rejected atlas, or motion study was promoted or published.
- The two withdrawn Adventure slugs remain redirected to Start Here and remain absent from search and sitemap output.

## Route and navigation integration

- Added the Cast route and its canonical constant.
- Added Cast to the shared Other Alice navigation on all five project routes.
- Added a compact, data-derived cast preview to Start Here.
- Added section-level cast bridges from World Guide routes, ecology, residents, and boundary material.
- Added the Cast route to search and sitemap output.
- Added JSON-LD `CollectionPage` and `ItemList` data to the Cast route.
- Added image-optional resident presentation so design-pending records render as complete text records.

## Relationship changes

The public relationship graph now uses the canonical `other-alice` ID and includes the safe cast nodes and evidence-backed edges required for:

- Other Alice and Chester
- Other Alice and Queen of Hearts
- Other Alice and Mad Hatter
- White Rabbit and Rabbit guild
- Mad Hatter and the highland tea system
- Caterpillar and size-change mushroom knowledge
- Tweedledum and Tweedledee
- Mock Turtle and Gryphon

Ciryl Spade, Club road crews, and their existing living-world systems remain visible. No Green Queen or Red Queen node or edge exists in public relationship data.

## R2 actions

Authenticated remote access, the `hobfarm-cdn` bucket, and the `cdn.hob.farm` mapping were available.

- Uploaded the atlas AVIF.
- Verified the existing atlas WebP had the exact local bytes, then re-uploaded those same bytes to set the requested immutable one-year cache metadata.
- Uploaded the two-worlds poster AVIF.
- Verified all three objects by direct R2 download and SHA-256 comparison.
- Verified all three CDN URLs return HTTP 200 with the expected MIME type, length, and immutable cache policy.
- Kept all local source assets.
- Performed no R2 deletion.

See `r2-promotion-report.md` for exact keys, sizes, hashes, URLs, and verification results.

## Tests and QA

| Command | Result |
| --- | --- |
| `npm test` | Passed: 124 tests, 0 failures |
| `npx astro check` | Passed: 405 files, 0 errors, 0 warnings, 0 hints |
| `npm run build` | Passed |
| `npm run audit:oaa-public` | Passed across 556 built files |
| `npm run qa:oaa-browser` | Passed: 20 route/viewport combinations, three filter systems, 32 Cast links and fragment targets, deep links, search, sitemap, and retired-route checks |
| `OAA_PREVIEW_URL=https://hob.farm npm run qa:oaa-browser` | Passed against the production domain with the same 20 route/viewport combinations and 32 Cast links |
| `git diff --check` | Passed |

The build retains two known repository warnings: the empty `src/content/adventures` collection and a Vite chunk-size warning. Neither warning was introduced by this task.

Chrome plugin initialization was unavailable in this session. The repository-prescribed local Playwright fallback completed the browser QA. See `design-qa.md` for the rendered checks and capture inventory.

## Canon and implementation conflicts

- The task packet described the delayed Wasteland authority as the Red Queen. The current user direction supersedes that label: the private record is `green-queen`, with the Looking-Glass Red Queen retained only as a development reference in the user's brief. Public output contains neither queen name.
- Ciryl's newly proposed `projects/other-alice/ciryl-spade.webp` path returned 404. The implementation reuses the existing approved public record at `pages/other-alice-adventures/oaa-ciryl-portrait-.png`, which returns 200 and passed media QA.
- No incompatible stable character IDs were found.
- No public summary required locking a speculative private origin.

## `git diff --stat`

The standard Git stat covers the 18 modified tracked files. New source and report files are listed separately above; generated QA captures remain local and ignored.

```text
 .gitignore                                           |   1 +
 scripts/audit-other-alice-public-bundle.mjs        |   3 +-
 scripts/qa-other-alice.mjs                         |  36 +-
 src/components/presents/ResidentGallery.astro      |  41 +-
 .../presents/other-alice/OaaRelationshipWeb.astro  |   4 +-
 .../presents/other-alice/OtherAliceStartPage.astro |  16 +-
 src/data/other-alice/assets.ts                     |  26 +-
 src/data/other-alice/canon.ts                      |   1 +
 src/data/other-alice/navigation.ts                 |   2 +
 src/data/other-alice/relationships.ts              | 130 ++++--
 src/data/other-alice/residents.ts                  | 466 ++++++++++++++++++++--
 src/data/other-alice/types.ts                      |  60 +++
 src/data/story-series.ts                           |   2 +-
 src/lib/search-index.ts                            |  18 +
 .../hobfarm-presents/[series]/world-guide.astro    |  12 +-
 src/pages/sitemap.xml.ts                           |   6 +
 tests/other-alice-world-guide.test.mjs             |   6 +-
 tests/other-alice.test.mjs                         |   6 +-
 18 files changed, 751 insertions(+), 85 deletions(-)
```

## Release status

Cloudflare Pages production deployment `762debad-e9a9-433d-a1b6-cf8d6ee2ef94` completed on the `hobfarm` project and `main` production environment. The deployment URL and `hob.farm` Cast route both returned HTTP 200, and live browser QA passed.

No Cloudflare Worker deployment, staging, push, or pull request occurred. The Pages deployment was made directly from the validated working tree, then the completed update was preserved in a local Git commit.
