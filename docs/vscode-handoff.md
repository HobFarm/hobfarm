# VS Code handoff: finish the structure pass

Written 2026-07-31 after three of five passes landed. Everything below is either
verified against the repo or flagged as unverified. Read `CLAUDE.md` first.

`docs/hobunny-project-source.md` is the canonical Hobunny spec and replaces the
earlier `hobunny-project-outline.md`, which has been deleted. Do not restore it.

---

## What is done

Committed on `main`, each pass with `npm run build`, `npm test`, and
`npx astro check` green.

| Pass | Commit |
| --- | --- |
| Presents migration, `/departments/` retired | `99a3363` |
| `/projects/` and `/video/` retired, StyleFusion consolidated | `3b508c1` |
| `projects` collection replaced by `workshop` | `6408d36` |
| CLAUDE.md trimmed, deploy chain and CDN rules added | `37c5f6c` |
| Characters and avatars split, `/characters/` retired | `cf0c8c6` |

Current state: 208 tests passing, 475 pages built, 0 type diagnostics.

Retired and confirmed absent from the build output: `/departments/`,
`/projects/`, `/video/`, `/characters/`, `/funnies/`.

---

## Other Alice: verify before repairing

You reported this section as broken. **It builds clean here**, so confirm what
you are seeing before changing anything.

The live site is still serving the pre-migration deploy, so
`hob.farm/departments/hobfarm-presents/other-alice-adventures/` is the old URL
on old code. Nothing in this work has been deployed.

All eight routes generate, with real content:

| Route | Output |
| --- | ---: |
| `/presents/other-alice-adventures/` | 81 KB |
| `/presents/other-alice-adventures/cast/` | 70 KB |
| `/presents/other-alice-adventures/cast/alice/` | generated |
| `/presents/other-alice-adventures/cast/chester/` | generated |
| `/presents/other-alice-adventures/cast/the-hatter/` | generated |
| `/presents/other-alice-adventures/houses/` | 53 KB |
| `/presents/other-alice-adventures/web-of-wonderland/` | 69 KB |
| `/presents/other-alice-adventures/world-guide/` | 76 KB |

**One change worth knowing about.** The Other Alice cast detail pages used to
live at `/characters/<slug>/`. Deleting that route orphaned
`AliceVisualDevelopment` and `AliceMotionRecords`, which render Alice's seven
trait plates and her R2 motion records and were used nowhere else. Rather than
lose them, the page moved to
`/presents/other-alice-adventures/cast/<character>/`, scoped to residents whose
`relatedSeries` includes `other-alice-adventures`. Verified in the output:
"Adapted hearing", "Variable tool pouch", "Field silhouette", and the `<video>`
element all still render.

**Known defect, not fixed:** those three cast detail pages still contain a
`href="/characters/"` back-link to the retired index. It 301s, so it works, but
it should point at `/presents/other-alice-adventures/cast/`.

If something else is genuinely broken, capture the URL and the symptom. Other
Alice keeps its own structure and should not be restructured as a side effect of
anything else.

---

## Remaining pass 1: Workshop program page contract

Not started. This is the pass where structure meets content.

**The problem.** `src/pages/workshop/[program].astro` gives every program the
same hardcoded four-step text grid at lines 50-61. Programs with their own
static page are richer; programs on the dynamic route are not. Cute & Corrupted
renders nothing but the generic shell. Alter Ego has one hardcoded media block.
The four promoted Process programs arrive complete because
`ProcessMethodPage.astro` carries them.

**The target.** Widen `src/components/process/ProcessMethodPage.astro` so a
program can supply the blocks it has and omit the rest, instead of requiring a
full `ProcessPipeline` record. Block set, generalized from the Process pages:

| Block | Required |
| --- | --- |
| Hero media | yes |
| Summary | yes |
| Illustrated progression steps | yes |
| Optional detail (editorial chain, loop reel, paired studies, archive) | no |
| Technical record (visual DNA, palette, materials) | no |
| Evidence: gallery entries and articles from this method | yes |
| Academy handoff where a course exists | no |
| Program-to-program navigation | yes |

**Order of work**, thinnest first: Cute & Corrupted, Alter Ego, Workshop Notes,
Avatar & Host, then Character / Mannequin and Before & After last since they are
the most complete and carry the most regression risk.

**Do not invent method content.** Where a program lacks a block, leave it out and
report the gap. The output of this pass should include a list of what is missing
per program; that list is the content brief.

**Also in this pass:** `src/data/workshop-page.ts` benches still point at
`/visual-systems/` (line 61) and other pre-migration targets. Check every href in
that file. `src/data/academy-courses.ts` already has a `relatedWorkshop` field
that nothing renders, so the Workshop-to-Academy handoff exists in data and not
in the UI. Only add a handoff where a course actually exists.

---

## Remaining pass 2: Hobunny

Not started. Source: `docs/hobunny-project-source.md`.

### Route shape

| Route | Job |
| --- | --- |
| `/workshop/character-mannequin/characters/` | Character index |
| `/workshop/character-mannequin/characters/hobunny/` | Hobunny dossier |
| `/hobunny` | Short vanity alias, 301 to the dossier |

The parent slug is `character-mannequin`, defined at
`src/data/site-hierarchy.ts:65`. Earlier planning documents said
`mannequin-character`; that route does not exist and creating it would duplicate
or rename a route that Pass 2 validated.

Characters nest under the method that produced them. Do not promote Hobunny to
her own Workshop program or nav item. The vanity alias exists because the
canonical path is four levels deep and the page's job is catching cold traffic
from social; `_redirects` already uses this pattern for `/stylefusion` and `/sf`.

### Build the container, not the content

The source document is authored creative material: the central contradiction,
the facial key, the edition system, the boundaries. Do not invent, paraphrase,
extend, or summarize any of it.

Section 7 lists canon that is **deliberately unlocked**: face key, eye color,
hair, ear asymmetry, tail construction, palette, logo, drip placement, launch
outfit, silhouette family. Section 4 says not to treat temporary image details
as permanent canon. So the dossier needs those as empty, clearly-marked slots,
not filled in from whatever reference art is lying around.

Do not fabricate artwork, social links, article quotations, publication history,
or audience statistics.

### Data model

The dossier should read from data, not hardcode Hobunny, so a second character
costs content rather than route work. The source gives the shapes:

- Character record: identity, contradiction, permanent anchors (§7), modes (§8).
- Edition record: the sixteen fields in §9.
- Concept record: the YAML schema in §15, for tracking individual pieces.

Modes are Doll, Mascot, and Corrupted (§8). An edition is a version of the same
character, never a separate character (§16).

### Existing state to clean up

`src/data/characters.ts` still holds a Hobunny record that predates this spec:
role "HobFarm rabbit", traits "Rabbit, Mascot duties optional, Suspiciously
calm". That is a different character. **Replace it, do not merge it.** Its
`relatedSeries` was already emptied when the `hobunny` comic series retired, so
nothing links to it.

### Discrepancy to resolve before building

The source names **Hobunny '66** as the first authored edition (§10), with a
mid-1960s boutique and beauty-marketing thesis. The concept images supplied
alongside it are labelled **"HOBUNNY '26 · APRIL 1 · 1926"** and show 1920s
flapper styling: drop-waist beaded dress, feather headband, long pearls, fur
stole, cloche and wide-brim hats.

Those are two different editions. Either a '26 edition exists and the source is
out of date, or the images are exploratory and '66 is still first. **Ask d00d.**
Do not assume the images define '66, and do not derive canon from them: §4 and
§17 both forbid it.

---

## Deployment

Nothing in this work is deployed. `main` is ahead of the live site by seven
commits. Cloudflare Pages builds from `main`, so the migration goes live on the
next push.

Before pushing, spot-check the redirects. `public/_redirects` now carries the
full migration set, and the classes that matter most are `/departments/*`,
`/projects/*`, `/video/`, `/characters/*`, `/funnies/*`, and the folded comic
series. Every retired path should resolve in one hop.

---

## Things deliberately left alone or resolved separately

- **Homepage outside Other Alice.** The Other Alice feature was later aligned
  with the persistent-game direction and moved off the repeated atlas image.
  The rest of the homepage structure remains outside the Presents migration.
- **Article body copy.** Retired route links were repointed during the final
  stabilization pass so canonical pages no longer rely on internal 301s.
- **CDN paths.** Asset locations, not routes. Existing paths are inconsistent
  from earlier builds and are not being migrated.
- **HobBot.** Record kept at `src/content/workshop/hobbot.md`, no public page.
- **Static `adventures` collection.** Retired after Other Alice was confirmed as
  a persistent game whose long-form stories emerge from Wonder Machine
  campaigns. Withdrawn story URLs still redirect to the canonical Presents
  page.
