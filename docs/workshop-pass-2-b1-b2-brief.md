# Pass 2, Batches B1 and B2: implementation brief

Follow-up to `workshop-pass-2-cc-brief.md`. B0 is closed. This brief carries the
verified repository facts, ten corrections the original brief did not account
for, and the work items for B1 and B2.

> **Amended 2026-07-31.** Two direction changes landed after the first draft.
> StyleFusion becomes **visible**, not hidden, and Ami goes to
> **`/workshop/future-carriage/`**, not `/projects/`, because the Projects
> section is being retired. Correction 10, B1d, B2, and the checklist below
> already reflect this. See `workshop-consolidation-outline.md` for the wider
> retirement plan.

Rules from the original brief still apply:

- Move content verbatim. Page copy is being rewritten separately. If a move
  seems to call for a copy change, report it instead of making it.
- Do not touch `HomeWorkshop.astro` or any homepage file.
- Do not delete any component.
- One branch. Work directly on `main`.

---

## Verification of B0 and Batch A

Checked against the working tree on 2026-07-31. All B0 claims hold.

| Claim | Status |
| --- | --- |
| `[program].astro` is the only dynamic route under `/workshop/` | Confirmed. `src/pages/workshop/[program].astro` |
| `/process/[slug].astro` is 162 lines of orchestration over six components | Confirmed, exactly 162 |
| `getProcessPipelineBySlug()` exists | Confirmed, `src/data/processPipelines.ts:681` |
| `processPipelines.ts` is a 683-line payload | Confirmed. Keeping it out of `site-hierarchy.ts` (76 lines) is correct: that file is imported by `navigation.ts`, `workshop/index.astro`, `departments/index.astro`, `CharacterMannequinPage.astro`, `WorkshopProjectGrid.astro`, and `content-relationships.ts` |
| Exactly four pipelines | Confirmed: `fashion`, `motion`, `book`, `seed-to-world` |
| All four target Workshop slugs are free | Confirmed. `seed-to-world`, `motion`, `fashion-grammar`, `book-package` appear in neither `workshopPrograms` nor `src/pages/workshop/` |
| Layouts are genuinely different | Confirmed. The block comparison in the B0 report is accurate |
| B0 made no file changes | Confirmed |

Batch A is applied in the working tree and is uncommitted. It is correct:

- `npm run build` passes (server built in 1m 10s, no errors).
- `npm test` passes, 206/206.
- Live check confirms Cloudflare Pages evaluates `_redirects` ahead of a
  generated page. `https://hob.farm/departments/workshop-notes/` returns 301 to
  `/workshop/workshop-notes/` even though the build emits an `index.html` at
  that path. So the 24 rewritten rules land in one hop.
- Both Batch A targets are live 200s: `/workshop/workshop-notes/` and
  `/departments/magazine-time-machine/`.

Batch A is ready to commit.

---

## Corrections to the original brief

Ten things the original brief did not account for. Each one is a place an
implementing agent would otherwise get it wrong.

### 1. The route exclusion list is load-bearing

`src/pages/workshop/[program].astro:18`:

```ts
.filter((program) => program.id !== "before-after" && program.id !== "character-mannequin")
```

Programs that have their own static page under `src/pages/workshop/` are
excluded here so the dynamic route does not also claim their path.

- **Avatar & Host** becomes a static page, so its id **must be added** to this
  filter.
- The **four Process programs** must **not** be added. They depend on the
  dynamic route to render at all.

### 2. The hub filter lives in more than one place

The brief says "one change to the hub card filter." There are six sites using
`inNav !== false`. Only one of them is the hub card grid.

| File and line | What it feeds | Action |
| --- | --- | --- |
| `src/pages/workshop/index.astro:28` | Hub card grid, rendered at line 279 | **Change** to `noindex !== true` |
| `src/pages/workshop/index.astro:69` | `heroProjects`, a fixed four-id hero list | **Leave.** Its ids are hardcoded and none of them change |
| `src/data/navigation.ts:5` | Top nav dropdown | **Leave** |
| `src/pages/workshop/[program].astro:111` | Program strip at page foot | **Leave** |
| `src/components/workshop/CharacterMannequinPage.astro:431` | Program strip | **Leave** |
| `src/components/workshop/WorkshopProjectGrid.astro:13` | Workshop project grid | **Leave.** It filters `selectedWorkshopProjects`, a different dataset, and none of the new programs have entries there |

### 3. `/departments/index.astro` has no filter at all

`src/pages/departments/index.astro:18` renders `workshopPrograms.map(...)` with
no `inNav` or `noindex` filter. Today that means the site directory already
lists StyleFusion, which the brief's own checklist says must stay "absent from
nav and hub." After B1 it would also list all four new hub-only programs.

This is a pre-existing leak that Pass 2 makes five times worse. Apply the same
`noindex !== true` filter here as on the hub. That satisfies the StyleFusion
checklist item and keeps the directory in agreement with the hub.

### 4. An existing test asserts program source order

`tests/ia-refactor.test.mjs:33-42` asserts that these five ids appear in
`site-hierarchy.ts` in this source order:

```
character-mannequin, alter-ego, cute-corrupted, before-after, workshop-notes
```

Inserting `avatar-host` between `cute-corrupted` and `before-after`, as B2
requires, preserves that relative order and keeps the test green. Inserting it
anywhere else breaks the test.

The test does not know about `avatar-host` or the four hub-only programs.
Extend it to assert the full six-item nav order so B2's ordering requirement is
actually covered.

`tests/ia-refactor.test.mjs:46-47` also asserts on `[program].astro`:

```
/return workshopPrograms[\s\S]*\.map\(\(program\)/
/noindex=\{program\.noindex === true\}/
```

The conditional Process branch must keep both patterns intact.

### 5. Nav order comes from array position, not the `order` field

`navigation.ts:5` filters and maps `workshopPrograms` in array order. Nothing
sorts on `order`. So B2's nav sequence is achieved purely by where each entry
sits in the array in `site-hierarchy.ts`.

### 6. But `order` is visible on the hub cards

`src/pages/workshop/index.astro:282` renders `Program {order}` on every card,
zero-padded. Current values run 1 through 6. After B1 there are eleven entries,
so renumber all of them or the cards show duplicate and skipped numbers.

Suggested numbering, matching B2's nav order then hub order:

```
1 character-mannequin      7 seed-to-world
2 alter-ego                8 fashion-grammar
3 cute-corrupted           9 book-package
4 avatar-host             10 motion
5 before-after            11 stylefusion
6 workshop-notes
```

### 7. Ami no longer goes to Projects at all

The original brief sent Ami to `/projects/future-carriage/` and told you to add
a `projects` collection record. Both parts are now wrong.

The Projects section is being retired. Sending content there would mean moving
it twice.

Ami's destination is **`/workshop/future-carriage/`**, as a static page, not a
`workshopPrograms` entry. Three reasons this is the right shape:

- `src/data/workshop-projects.ts:105-121` already defines a `future-carriage`
  project whose `destination` is a Workshop path. The data layer never treated
  this as a Projects subject.
- `/workshop/ami-legacy/` and `/workshop/visual-lab/` are already static
  Workshop pages that are not `workshopPrograms` entries, so the pattern exists.
- The audit measured 122 of 123 Ami lines as distinct from Avatar & Host. It is
  standalone content, but it is evidence for a method rather than a method of
  its own, so it does not belong in the hub grid.

In practice this is close to a directory rename. No collection record, and no
change to `workshopPrograms`.

### 8. An inbound Ami link is on a homepage file

`src/components/home/MagazineFrontPage.astro:50` has
`href: "/workshop/ami-legacy/"`.

The brief says do not touch homepage files, and also says update inbound
internal links. Those two instructions collide on exactly this line.

**Do not guess.** Leave it pointing at the old path, which will 301 correctly,
and report it. It is one hop and it is safe. Flag it for the copy pass.

### 9. StyleFusion becomes visible, and that breaks a test

`site-hierarchy.ts:68` currently carries `inNav: false, noindex: true`. The
direction changed: StyleFusion stays public because too much already links to
it. Set `noindex: false` and leave `inNav: false`, which puts it in the hub and
the Departments directory but keeps the dropdown at six.

`tests/ia-refactor.test.mjs:44` asserts the old values:

```js
assert.match(hierarchy, /id: "stylefusion"[^\n]*inNav: false, noindex: true/);
```

**This test fails the moment you flip the flag.** Update it to assert
`inNav: false, noindex: false`.

Also simplify `src/pages/workshop/index.astro:29-32`. The `styleFusionVisible`
check and the `workshopBenches` filter that depends on it are now always true,
because visibility no longer keys off `inNav`.

### 10. An internal link already points at a redirected path

`src/pages/workshop/index.astro:529` links to `/departments/workshop-notes/`,
which 301s to `/workshop/workshop-notes/`. Repoint it. One line, same
neighborhood as the B2 hub work, and it removes an internal hop.

---

## B1a: extract the shared Process wrapper

**Current state.** `src/pages/process/[slug].astro` holds 162 lines of
orchestration: BaseLayout with per-pipeline metadata, a back link, six Process
components with conditional rendering, a related Gallery grid, a Ko-fi block,
and a Lightbox.

**Target state.** A single `src/components/process/ProcessMethodPage.astro`
takes a `ProcessPipeline` and renders everything currently between the
BaseLayout tags. Both `/process/[slug].astro` and the new Workshop branch call
it. The six existing Process components are untouched.

**Notes.**

- `processMetadata` at `[slug].astro:41-61` is a per-slug title and description
  map with a fallback. Move it into the wrapper so both routes get the same
  metadata resolution.
- Keep `<Lightbox client:only="react" />` in the wrapper. It is required by the
  Gallery machinery.
- The back link at line 73 points to `/services/#process` and reads "Back to
  how it's made." Under `/workshop/` that destination is wrong. **Report this,
  do not rewrite it.** Suggested handling: make the back link a wrapper prop so
  each route passes its own, and have the Workshop branch pass `/workshop/`
  with the label left for the copy pass to settle.

**Files.** `src/components/process/ProcessMethodPage.astro` (new),
`src/pages/process/[slug].astro`.

---

## B1b: the four Process promotions

**Current state.** Four pipelines render only at `/process/<slug>/`.

**Target state.** Each also renders at its Workshop path, through the existing
dynamic route.

| Pipeline slug | Workshop slug | Program id |
| --- | --- | --- |
| `seed-to-world` | `seed-to-world` | `seed-to-world` |
| `motion` | `motion` | `motion` |
| `fashion` | `fashion-grammar` | `fashion-grammar` |
| `book` | `book-package` | `book-package` |

**Steps.**

1. Add four `HierarchyEntry` records to `workshopPrograms` in
   `src/data/site-hierarchy.ts`, placed after `workshop-notes` and before
   `stylefusion`. Each carries `inNav: false`, `noindex: false`,
   `kind: "workshop-program"`, `parent: "workshop"`, and a new
   `processSlug` field naming its pipeline.
2. Add `processSlug?: string` to the `HierarchyEntry` type.
3. In `[program].astro`, resolve `program.processSlug` through
   `getProcessPipelineBySlug()`. When a pipeline comes back, render
   `ProcessMethodPage`. Otherwise render the existing program layout unchanged.
4. Keep the `noindex={program.noindex === true}` binding on whichever
   BaseLayout ends up wrapping each branch.
5. Add 301s in `public/_redirects` from each `/process/<slug>/` path, with and
   without trailing slash.
6. Update inbound links per the inventory below.

**Do not** add these four ids to the exclusion filter at `[program].astro:18`.

---

## B1c: Avatar & Host promotion

**Current state.** `src/pages/workshop/character-mannequin/avatar-host-system/index.astro`,
105 unique lines, at a nested path with no `workshopPrograms` entry.

**Target state.** `src/pages/workshop/avatar-host/index.astro`, content moved
verbatim, with a `workshopPrograms` entry at nav position 4.

**Steps.**

1. Move the file. Do not edit the body.
2. Add the `avatar-host` entry to `workshopPrograms`, inserted between
   `cute-corrupted` and `before-after`, with `inNav: true`.
3. **Add `avatar-host` to the exclusion filter at `[program].astro:18.**
4. Add a 301 from the old nested path, with and without trailing slash.
5. Cross-link with `/workshop/future-carriage/` rather than merging. Avatar &
   Host is the method, Future Carriage is the campaign that used it.

---

## B1d: Ami promotion

**Current state.** `src/pages/workshop/ami-legacy/index.astro`, 123 unique
lines, under a slug that no longer describes it.

**Target state.** `src/pages/workshop/future-carriage/index.astro`, content
moved verbatim.

**Steps.**

1. Move the file as a static page. See correction 7: no collection record, no
   `workshopPrograms` entry.
2. Remove the `ami-legacy` route. Add a 301 from `/workshop/ami-legacy/`, with
   and without trailing slash.
3. Update `src/data/workshop-projects.ts:121`, whose `destination` still reads
   `/workshop/ami-legacy/`.
4. Update the inbound links listed below, excluding the homepage one.
5. Cross-link with `/workshop/avatar-host/` in both directions. Avatar & Host is
   the method, Future Carriage is the campaign that used it.

`getWorkshopProject("future-carriage")` feeds `HomeFutureCarriage.astro`, a
homepage file. Change the `destination` string only. Leave the component alone.

---

## B2: nav and hub split

**Nav**, in this order, `inNav: true`:

1. Character / Mannequin
2. Alter Ego
3. Cute & Corrupted
4. Avatar & Host
5. Before & After
6. Workshop Notes

**Hub only**, `inNav: false`, `noindex: false`: Seed to World, Motion, Fashion
Grammar, Book Package, **StyleFusion**.

StyleFusion joins this tier rather than staying hidden. See correction 9. That
makes eleven programs in the hub, not ten.

**Filter changes.** Per correction 2, change `src/pages/workshop/index.astro:28`
from `inNav !== false` to `noindex !== true`. Per correction 3, apply the same
filter at `src/pages/departments/index.astro:18`. Leave the other four sites
alone.

**Hub headings.** Group the cards rendered at `workshop/index.astro:279` under
three headings. Headings only, no new components, no restyling.

- **Character**: Character / Mannequin, Alter Ego, Cute & Corrupted, Avatar & Host
- **World**: Seed to World, Fashion Grammar, Book Package, StyleFusion
- **Time and motion**: Before & After, Motion

StyleFusion sits under World because it is the reference-image method behind the
world-building programs. If it reads better elsewhere, say so rather than
guessing.

---

## Inbound link inventory

Every internal reference to a promoted path. Verified by grep on 2026-07-31.

**Process paths.**

| File and line | Current target |
| --- | --- |
| `src/pages/services/index.astro:45` | `/process/fashion/` |
| `src/pages/services/index.astro:50` | `/process/motion/` |
| `src/pages/services/index.astro:55` | `/process/book/` |
| `src/pages/services/index.astro:60` | `/process/seed-to-world/` |
| `src/data/workshop-page.ts:67` | `/process/seed-to-world/` |
| `src/data/workshop-page.ts:73` | `/process/motion/` |
| `src/pages/gallery/seed-to-world.astro:93` | `/process/seed-to-world/` |
| `src/pages/gallery/seed-to-world.astro:168` | `/process/seed-to-world/` |

Three content files carry a `relatedProcess` frontmatter string, consumed by
`GalleryDetail.astro:175` and `agent-corpus.ts:686`:

| File and line | Current value |
| --- | --- |
| `src/content/gallery/character-dev/seed-to-world-v1-neon-glitch-streetwear.md:25` | `/process/seed-to-world/` |
| `src/content/gallery/fashion/glamour-pin-up.md:22` | `/process/fashion/` |
| `src/content/gallery/video-workflow/higgsfield-transition-test.md:28` | `/process/motion/` |

Updating a link field is not a copy change. Do not touch anything else in those
files.

**Ami paths.**

| File and line | Action |
| --- | --- |
| `src/components/workshop/WorkshopMediaIndex.astro:55` | Update |
| `src/data/academy-courses.ts:226` | Update |
| `src/data/avatar-content-system.ts:254` | Update |
| `src/components/home/MagazineFrontPage.astro:50` | **Leave and report.** Homepage file, see correction 8 |

**Leave alone.** `src/data/media-registry.ts:286-306` contains
`pages/process/...` strings. Those are CDN asset paths, not routes. The
`destination` values on those same lines are already correct.

`src/data/media-registry.ts:196` has a descriptive `destination` string reading
`"/workshop/ami-legacy/ and /academy/avatar-content-system/"`. It is metadata,
not a link. Update it as hygiene or leave it. Report either way.

---

## Redirects to add

Twelve rules, each with and without trailing slash:

```
/process/fashion            /workshop/fashion-grammar/   301
/process/motion             /workshop/motion/            301
/process/book               /workshop/book-package/      301
/process/seed-to-world      /workshop/seed-to-world/     301
/workshop/character-mannequin/avatar-host-system  /workshop/avatar-host/  301
/workshop/ami-legacy        /workshop/future-carriage/   301
```

Also repoint `src/pages/workshop/index.astro:529` per correction 10. That is a
link fix, not a redirect.

---

## Open decisions, report rather than guess

1. The `/services/#process` back link label and destination inside the Process
   wrapper.
2. Whether `MagazineFrontPage.astro:50` gets updated, given the homepage
   freeze.
3. Whether `media-registry.ts:196`'s descriptive destination string is worth
   touching.
4. Whether `/services/index.astro` should keep linking to method pages at all
   once they live under Workshop. That is a Pass 3 question, not this one.

---

## Verification

Run in this order. Stop and report on first failure.

- [ ] `npm run build` passes
- [ ] `npm test` passes, including the extended nav-order assertion
- [ ] `npx astro check` clean
- [ ] All six old paths 301 in one hop to the new path
- [ ] All six new routes return 200
- [ ] `/process/<slug>/` still renders identically to `/workshop/<slug>/` for
      all four pipelines while both routes exist
- [ ] Dropdown shows the six nav programs in the B2 order, nothing else
- [ ] Hub shows all eleven under three headings, StyleFusion included
- [ ] `/departments/` directory shows the same eleven
- [ ] `/workshop/stylefusion/` returns 200, indexed, in the hub, out of nav
- [ ] `/workshop/future-carriage/` returns 200 and is absent from the hub grid
- [ ] Hub card `Program NN` numbers run 1 to 11 with no gaps or repeats
- [ ] No inbound link points at a promoted old path, except the one homepage
      link held back by correction 8
- [ ] Mobile hub grid does not overflow at 375px

## Rollback

Each promotion is independent: revert the new route, its redirect rule, and its
data entry. B1a reverts by inlining the wrapper back into
`/process/[slug].astro`. B2 reverts by restoring the two filters and the
`inNav` values.

---

## Not in this pass

Batch C merges, Batch D hides, and component deletion. All 76 components stay.
