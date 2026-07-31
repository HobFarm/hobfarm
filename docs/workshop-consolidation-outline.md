# Workshop consolidation: scope outline

The larger restructuring this sits inside. Pass 2 (`workshop-pass-2-b1-b2-brief.md`)
moves four Process pages and two others onto canonical Workshop routes. This
outline covers what comes after: retiring the legacy Projects layer, folding
what survives into Workshop, and bringing every Workshop program up to one
consistent page contract.

Read `CLAUDE.md` first. Its "How the Site Tells Its Story" and "Application and
project status" sections were updated on 2026-07-31 and are the current
direction. Older assumptions about StyleFusion, Drifter, AnomalyBot, or XKXXKX
that you find in page copy, data files, or the site audit are stale.

**Sequence:** finish Pass 2 B1 and B2 first. This outline depends on the
`ProcessMethodPage.astro` wrapper that B1a extracts.

---

## The decision that shapes everything else

**Projects is retiring. Workshop is the permanent home for this material.**

`/projects/` came from an earlier build. Everything in it either moved, was
absorbed, is dead, or belongs to Presents. It does not get maintained in
parallel with Workshop.

That resolves the StyleFusion question the audit got backwards. The audit says
`/projects/stylefusion/` wins and Workshop merges into it. The **content** call
is right: the Projects page is the better writeup. The **location** call is
wrong. So:

- The better Projects content merges **into** `/workshop/stylefusion/`.
- The page stays **visible and indexed**. Too much already links to it, and
  hiding it would strand two published articles.
- The page states that the application is in development. New material lands
  there when it exists.

Where the audit and `CLAUDE.md` disagree, `CLAUDE.md` is current. The audit is
still accurate on line counts, inbound link counts, route inventories, and
redirect analysis. Use it as evidence, not as direction.

---

## Phase 1: retire the Projects layer

**`/projects/` closes entirely. So does `/video/`.** Both are leftovers from the
earlier build.

`/video/` is a video archive hub, and HobFarm is not a video gallery. A video
belongs wherever its subject lives, or on social media. A Future Carriage clip
with Ami goes to social; the Workshop page shows how it was made. Retiring
`/video/` is not cleanup around the edges, it is the same decision as retiring
`/projects/`.

Retiring `/video/` also removes the main obstacle to deleting the `projects`
collection, because it was the only non-Projects route querying it.

Remaining consumers after `/video/` goes:

| Consumer | Use | Action |
| --- | --- | --- |
| `src/pages/projects/hobfarm-tv/index.astro:16` | Queries the collection for shows | Goes with HobFarm TV |
| `src/lib/search-index.ts:242` | Indexes project entries for site search | Drop the project block when the collection goes |
| `src/lib/agent-corpus.ts:385,716` | Publishes project entries to the agent corpus | Same |

**HobFarm TV is a Presents sub-page.** `site-hierarchy.ts:59` already files it
under `presentsSeries`; only its `href` is wrong. Its two show records both have
canonical Departments homes already, and `video/index.astro:21-24` even
special-cases 3DM to its department path:

| Show record | Canonical home | Redirect status |
| --- | --- | --- |
| `hobfarm-tv/3-degrees-of-dick-miller.md` | `/departments/hobfarm-presents/3-degrees-of-dick-miller/` | Exists, `_redirects:42-43` |
| `hobfarm-tv/magazine-time-machine.md` | `/departments/magazine-time-machine/` | Exists, `_redirects:38-39` |

So HobFarm TV's move is smaller than it looks: a hub page listing two shows that
already live in Departments. Confirm the destination route with d00d before
moving it, then `/projects/` has nothing left.

### Retiring `/video/`

Two inbound links only, verified 2026-07-31.

| File and line | Note |
| --- | --- |
| `src/data/site-sections.ts:77` | `{ label: "Video", href: "/video/" }`. Remove |
| `src/components/home/RecentVideos.astro:23` | **Decide, do not guess.** Homepage component, and homepage files are frozen. Retiring `/video/` leaves its "see all" link pointing at a dead route |

`RecentVideos.astro` is itself a video-gallery strip on the homepage, so the
question is not just where its link points but whether the component belongs at
all. That is d00d's call, not an agent's.

301 `/video/` to `/departments/hobfarm-presents/`. No redirect rules exist for
it today.

**Step A, this pass:** empty `/projects/` of everything except HobFarm TV, and
retire `/video/`.

| Record | Disposition |
| --- | --- |
| `drifter.md` | **Retire.** Delete the record, remove the card at `projects/index.astro:87-93`, 301 `/projects/drifter/` to `/workshop/` |
| `anomalybot.md` | **Retire.** Delete the record, remove the card at `projects/index.astro:105-111`, 301 `/projects/anomalybot/` to `/workshop/` |
| `xkxxkx.md` | **Rehome as Wonder Machine.** This is the Other Alice runtime, not a standalone project. Fold the engine description into the Other Alice material, 301 `/projects/xkxxkx/` there, remove the card at `projects/index.astro:96-102` |
| `hobbot.md` | **Move hidden to Workshop.** `/workshop/hobbot/` with `noindex: true`, out of nav and hub. 301 the old path. Keeps it preserved and invisible while it is redeveloped |
| `stylefusion.md` | **Merge into Workshop, visible.** See Phase 2 |
| `grimoire.md` | **Retire the record.** No rendered body. `/grimoire/` is canonical and the redirect already exists at `_redirects:31-32` |
| `courses.md` | **Retire the record.** No rendered body. `/academy/` is canonical, redirect exists at `_redirects:29-30` |
| `shop.md` | **Retire the record.** No rendered body. `/shop/` is canonical, redirect exists at `_redirects:27-28` |
| `hobfarm-tv/*.md` | **Leave for the Presents pass** |

**Step B, during the Presents pass:** move HobFarm TV to a Presents route,
update `site-hierarchy.ts:59`, then close `/projects/` entirely, delete the
`projects` collection, and drop the project blocks from `search-index.ts` and
`agent-corpus.ts`.

### Inbound links to `/projects/` itself

Handle these in Step A so the index can go quiet even while HobFarm TV remains.

| File and line | Note |
| --- | --- |
| `src/pages/404.astro:41` | "Projects to see what we're building" |
| `src/pages/about/index.astro:26,35` | Two CTAs |
| `src/pages/gallery/index.astro:239` | Button |
| `src/components/about/AboutProjects.astro:43` | Link, no trailing slash |
| `src/pages/sitemap.xml.ts:50` | Manual sitemap entry |
| `src/data/homepage-systems.ts:333` | **Decide, do not guess.** Data file, but it feeds homepage rendering and homepage files are frozen |

Also repoint the two shortlinks at `_redirects:7-8`. `/stylefusion` and `/sf`
currently target `/projects/stylefusion/` and would become chains.

Wonder Machine already exists at `src/components/home/HomeOtherAlice.astro:42-51`,
described as the runtime that remembers choices over a Grimoire-defined world.
That copy is current. The `xkxxkx.md` record is what is stale.

`tests/expansion-baseline.test.mjs:9` reads `hobbot.md` from disk and
`:11` reads `projects/hobfarm-tv/index.astro`. Moving HobBot's route is safe;
deleting either file breaks that test.

---

## Phase 2: StyleFusion consolidation

Two StyleFusion pages holding overlapping, partly stale content become one
visible page under Workshop.

**Target:** `/workshop/stylefusion/`, `noindex: false`, `inNav: false`. Present
in the Workshop hub and the Departments directory, absent from the nav dropdown.

That entry currently carries `inNav: false, noindex: true` at
`site-hierarchy.ts:68`. **Flip `noindex` to `false`.** This breaks
`tests/ia-refactor.test.mjs:44`, which asserts the old pair. Update the test.
See correction 9 in the Pass 2 brief.

**The Projects page is the better writeup.** It wins on content, loses on
location. Merge it into the Workshop route rather than the other way around.

**Steps.**

1. Merge `src/components/projects/StyleFusionProjectPage.astro` into the
   Workshop StyleFusion page, with the Projects body as the primary content. The
   audit measured 153 exact-unique lines on the Workshop side, so keep those
   too. Preserve both bodies. Do not rewrite either.
2. Repoint the canonical at `StyleFusionProjectPage.astro:112,149` to the
   Workshop path.
3. 301 `/projects/stylefusion/` to `/workshop/stylefusion/`, and repoint the
   `/stylefusion` and `/sf` shortlinks at `_redirects:7-8` so they stay one hop.
4. Delete `stylefusion.md` only after the redirect is in place and the merged
   page renders.

d00d is writing the in-development framing copy for this page. Do not write it.

**Inbound links, verified 2026-07-31.** Nineteen references across eighteen
files. These are not optional cleanup; several are load-bearing.

| File and line | Kind | Action |
| --- | --- | --- |
| `src/components/projects/StyleFusionProjectPage.astro:112,149` | `canonical` and origin URL | Move with the content, repoint canonical |
| `src/pages/projects/index.astro:39` | Hub card CTA | Remove the card |
| `src/data/about-projects.ts:18` | Data | Repoint |
| `src/data/homepage-systems.ts:328` | Data | Repoint |
| `src/data/roadmap.ts:35` | Data | Repoint |
| `src/data/workshop-page.ts:79` | Bench link | Repoint, see Phase 3 |
| `src/pages/gallery/index.astro:215` | Button | Repoint |
| `src/pages/grimoire/index.astro:16` | Path constant | Repoint |
| `src/pages/workshop/index.astro:31` | Bench visibility filter | Update to match the new path |
| `src/pages/workshop/stylefusion/prototype.astro:202` | Link | Repoint |
| `src/components/grimoire/sections/GrimoireCTA.astro:22` | Link, no trailing slash | Repoint |
| `src/layouts/HelpCenterLayout.astro:33` | Prose naming "the StyleFusion project brief" as canonical | Repoint the href. The wording still says "project," which is now the wrong section. Report it for the copy pass, do not rewrite it |
| `src/lib/agent-corpus.ts:87` | Published agent corpus URL | Repoint |
| `tests/agent-readability.test.mjs:53` | Test asserts the `/projects/stylefusion/` URL | Update with the corpus change |
| `src/content/articles/invisible-variable.md:38,266` | Article body prose, one an absolute `hob.farm` URL | **Leave and report.** Body copy, and the 301 handles it in one hop |
| `src/content/articles/color-becomes-a-cast.md:30` | `relatedProject` frontmatter | Repoint. A link field, not body copy |
| `src/data/media-registry.ts:37,47` | Descriptive `destination` strings naming both paths | Update as metadata hygiene |

Keeping the page visible is what makes this list manageable. Every reference
above resolves to a live, indexed page in one hop, including the two published
articles, which need no intervention at all.

---

## Phase 3: the Workshop program page contract

The real inconsistency. `[program].astro:50-56` hands every program the same
hardcoded four-step text grid. Cute & Corrupted renders nothing but that
generic shell. Alter Ego gets one hardcoded media block. Character / Mannequin
and Before & After have their own richer static pages. The four promoted
Process programs will have full illustrated method pages. Six programs, five
different levels of depth.

**Target contract**, generalized from the Process page structure, which is the
richest pattern already in the repo:

| Block | Purpose | Required |
| --- | --- | --- |
| Hero media | The thing itself: video, stills, or artifact viewer | Yes |
| Summary | What this method is for and what it produces | Yes |
| Progression steps | The illustrated, numbered method. Not a generic text grid | Yes |
| Optional detail | Editorial chain, loop reel, paired studies, archive | No |
| Technical record | Visual DNA, palette, materials, Grimoire links | No |
| Evidence | Gallery entries and articles that came out of this method | Yes |
| Academy handoff | The course that teaches this method, when one exists | No |
| Next | Program-to-program navigation | Yes |

`ProcessMethodPage.astro`, extracted in Pass 2 B1a, already implements most of
this. Widen it so a program can supply the blocks it has and omit the rest,
rather than requiring a full `ProcessPipeline` record.

### Worked example: what a Workshop page is actually showing

d00d's description of Future Carriage, which is the model to build against:

> Take old carriage drawings from the 1800s. Apply a new futuristic aesthetic.
> Separately, develop the Ami avatar in the avatar workshop, built to be a
> social media influencer. Then apply that avatar to a concept like Future
> Carriage. The Workshop page demonstrates that process through visuals:
> hyperframes videos, diagrams, and example images.

Three things follow from this, and they govern every program page.

1. **The page shows the process, not the output.** The finished Ami video goes
   to social media. What lives here is how it was made. When you are unsure
   whether something belongs on a program page, ask whether it teaches the
   method or just displays the result.
2. **Methods compose.** Future Carriage is an aesthetic-transformation method
   and an avatar method applied to one concept. Program pages should link to the
   methods they draw on rather than restating them. This is why Avatar & Host
   and Future Carriage cross-link instead of merging.
3. **The visual vocabulary is process media.** Hyperframes videos, diagrams,
   annotated stills, before-and-after pairs, and example images. Not a video
   gallery, not a portfolio reel.

**Per-program work, in this order.** Start with the thinnest.

1. **Cute & Corrupted.** Currently generic-only. It has seven Gallery detail
   entries as evidence and a Visual Systems detail page the audit measured at 41
   unique lines. Build the method page from those.
2. **Alter Ego.** Has a hardcoded media block at `[program].astro:83-98` and a
   Visual Systems detail page with 42 unique lines. Move the hardcoded block
   into the contract's structure and merge the Visual Systems content.
3. **Workshop Notes.** Has `StyleCardArchive`. Confirm it satisfies the
   progression and evidence blocks or supplement it.
4. **Avatar & Host.** Promoted in Pass 2 B1c. Fit the moved content to the
   contract.
5. **Character / Mannequin** and **Before & After.** Both have their own static
   pages. Reconcile them against the contract last, since they are already the
   most complete and carry the most risk of regression.

The four Process-backed programs need no content work. They arrive complete.

**Do not invent method content.** Where a program lacks a block, leave it out
and report the gap. New copy is being written separately.

---

## Phase 4: repoint the Workshop hub at the new structure

`src/data/workshop-page.ts` still points its benches at the old build:

| Line | Current target | Note |
| --- | --- | --- |
| 61 | `/visual-systems/` | Audit recommends merging its intro into `/workshop/` |
| 67 | `/process/seed-to-world/` | Becomes `/workshop/seed-to-world/` in Pass 2 |
| 73 | `/process/motion/` | Becomes `/workshop/motion/` in Pass 2 |
| 79 | `/projects/stylefusion/` | Becomes `/workshop/stylefusion/` in Phase 2 |
| 85 | `/grimoire/` | Correct, leave |
| 91 | `/shop/` | Correct, leave |

Also add the Academy handoff. Workshop demonstrates the method, Academy sells
the course that teaches it, and right now nothing on the program pages says so.
`src/data/academy-courses.ts:226` already carries a `relatedWorkshop` field, so
the relationship exists in the data layer and is simply not rendered.

Only add a handoff where a course actually exists. Do not create placeholder
course links.

---

## Working rules

- One branch. Work directly on `main`.
- Do not touch homepage files, including `HomeWorkshop.astro`,
  `HomeOtherAlice.astro`, and `MagazineFrontPage.astro`.
- Do not delete components. All 76 flagged by the audit stay.
- Move content verbatim. Copy is being rewritten in parallel. If a move seems to
  need a copy change, report it.
- Every removal gets a redirect. Nothing 404s.
- Do not resurface Drifter or AnomalyBot in any surface, including data files,
  hub cards, and the agent corpus.

## Verification for each phase

- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] `npx astro check` clean
- [ ] Every retired path 301s in one hop
- [ ] No inbound link points at a retired or moved path, except items explicitly
      held back and reported
- [ ] `/workshop/stylefusion/` returns 200, indexed, present in the hub and the
      Departments directory, absent from the nav dropdown
- [ ] `/workshop/hobbot/` returns 200 with noindex, absent from nav and hub
- [ ] Hidden pages are hidden on every surface, not just nav
- [ ] `/video/` 301s and no surface still links to it
- [ ] Site search and the agent corpus still build after any collection change
- [ ] Mobile layouts do not overflow at 375px

## Open questions for d00d

1. Wonder Machine: does it get its own route under Other Alice, or does it stay
   a section of the existing adventures pages?
2. Grimoire's larger redevelopment. You mentioned having material on the
   Wonder Machine and storylet architecture. That is its own brief.
3. Where HobFarm TV lands under Presents. That destination is the last thing
   blocking `/projects/` from closing completely, and it is the first decision
   the Presents pass needs.
4. Whether HobBot is worth a hidden Workshop route at all, or whether the record
   should simply sit unrouted until its rebuild.
