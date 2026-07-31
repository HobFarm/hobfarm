# Presents migration: retire `/departments/`, establish `/presents/`

The IA correction. `/departments/`, `/projects/`, and `/video/` are all
leftovers from earlier builds that fragmented the same content across three
prefixes. This pass collapses them.

Read `CLAUDE.md` first, specifically "How the Site Tells Its Story." The site
audit (`docs/site-audit.md`) predates every decision here; use it for line
counts and inbound-link evidence, never for direction.

---

## Before anything: fix the branch

Local `main` and `origin/main` have diverged. Local is 1 ahead, 1 behind.

- **Local only:** `f7eae07 feat: add workshop visibility controls`. This is the
  entire `inNav` / `noindex` layer. Pass 2 B2 depends on it. It has never been
  pushed.
- **Remote only:** `1ad2f18 Publish Put On the Glasses article`, a GitHub
  Actions bot commit touching one article and deleting its own workflow file.

Production is serving `origin/main`, which is why the live nav still shows
"Departments directory" while the local repo does not generate it.

The merge is clean, verified 0 conflicts, and does not touch the uncommitted
Batch A work:

```bash
git merge origin/main
```

Do this first. If the divergence gets resolved by discarding local, the
visibility layer is lost and Pass 2 B2 has no foundation.

---

## The routing rule

One rule decides every category URL. No exceptions.

```text
category maps to a Presents section  ->  /presents/<slug>/
category maps to a Workshop program  ->  /workshop/<slug>/
everything else                      ->  /articles/<slug>/
```

A category with no content generates no route at all. It stays in the taxonomy
so an article can be filed to it, and its page appears when it has something to
show.

`departmentPath()` at `src/data/departments.ts:244` is currently one line:

```ts
export function departmentPath(slug: string): string {
  return `/departments/${resolveDepartment(slug) ?? slug}/`;
}
```

**Make that function implement the rule.** It is the single chokepoint for
category URLs, called from eight places. Fixing it fixes link generation in
`DepartmentStrip`, `DropCard`, `VisualSystemShowroom`, `ArticleLayout`,
`articles/index.astro`, and `articles/page/[page].astro` without touching any of
them.

Two slug mismatches need an explicit map, because the department slug and the
Workshop program slug differ:

| Department slug | Workshop program slug |
| --- | --- |
| `cute-corrupted` | `cute-and-corrupted` |
| `before-after-eras` | `before-and-after` |

And one special case: the `hobfarm-presents` department resolves to `/presents/`,
not `/presents/hobfarm-presents/`.

---

## Presents structure

Five sections, in this order. The order is a change: Other Alice moves to first.

| # | Section | Route |
| ---: | --- | --- |
| 1 | Other Alice Adventures | `/presents/other-alice-adventures/` |
| 2 | 3 Degrees of Dick Miller | `/presents/3-degrees-of-dick-miller/` |
| 3 | Magazine Time Machine | `/presents/magazine-time-machine/` |
| 4 | Funnies | `/presents/funnies/` |
| 5 | HobFarm TV | `/presents/hobfarm-tv/` |

`presentsSeries` in `src/data/site-hierarchy.ts:54-60` currently runs 3DM,
Magazine Time Machine, Other Alice, Funnies, HobFarm TV. Nav order comes from
array position, so reorder the array and renumber the `order` fields to match.

**`/presents/` is the "all" page.** Do not add a separate "View all Presents"
entry. The two extra dropdown links visible in production, "View all Presents"
and "Departments directory", are already gone in `f7eae07`. Confirm they stay
gone after the merge; add nothing back.

**Sections are article archives.** Each Presents section page lists its own
articles. That is what "the articles make up most of these sections" means.
Other Alice is the exception: it is a project rather than an article feed, and
it is the flagship, combining avatar work, character writing, the game concept,
app building, StyleFusion, image generation, and video generation.

HobFarm TV is video built from the articles in the other sections. It is a
Presents sub-page, not a media archive.

---

## Route moves

| From | To |
| --- | --- |
| `/departments/hobfarm-presents/` | `/presents/` |
| `/departments/hobfarm-presents/other-alice-adventures/` | `/presents/other-alice-adventures/` |
| `/departments/hobfarm-presents/other-alice-adventures/cast/` | `/presents/other-alice-adventures/cast/` |
| `/departments/hobfarm-presents/other-alice-adventures/houses/` | `/presents/other-alice-adventures/houses/` |
| `/departments/hobfarm-presents/other-alice-adventures/web-of-wonderland/` | `/presents/other-alice-adventures/web-of-wonderland/` |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/` | `/presents/3-degrees-of-dick-miller/` |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/[slug]/` | `/presents/3-degrees-of-dick-miller/[slug]/` |
| `/departments/hobfarm-presents/[series]/` and its children | `/presents/[series]/` |
| `/departments/magazine-time-machine/` | `/presents/magazine-time-machine/` |
| `/departments/funnies/` | `/presents/funnies/` |
| `/projects/hobfarm-tv/` | `/presents/hobfarm-tv/` |
| `/departments/essays-arguments/` | `/articles/essays-arguments/` |
| `/departments/cute-corrupted/` | `/workshop/cute-and-corrupted/` |
| `/departments/before-after-eras/` | `/workshop/before-and-after/` |
| `/departments/workshop-notes/` | `/workshop/workshop-notes/`, already done in Batch A |
| `/departments/satire/`, `/wtfacts/`, `/picture-stories/`, `/critter-feed/` | No route. Category only until they have content |
| `/departments/` hub | `/` |

The `/departments/` hub was a full site directory. The homepage now does that
job, so it redirects to the homepage rather than to any one section.

**Confirm before moving:** comics currently live at `/funnies/<series>/<slug>/`,
generated by `src/pages/funnies/`. Consistency argues for
`/presents/funnies/<series>/<slug>/`. That changes every comic permalink, so
get d00d's yes before doing it. The section landing page moves either way.

---

## Article counts, so nothing gets lost

Only four departments hold articles. Verified 2026-07-31.

| Department | Articles | Destination |
| --- | ---: | --- |
| workshop-notes | 18 | `/workshop/workshop-notes/` |
| essays-arguments | 16 | `/articles/essays-arguments/` |
| magazine-time-machine | 8 | `/presents/magazine-time-machine/` |
| hobfarm-presents | 8 | `/presents/` |

The other seven departments have zero articles between them. Funnies has comics
rather than articles.

Articles still carry a legacy `category` field alongside `department`.
`getArticleDepartment()` in `src/lib/articles.ts` already resolves one to the
other. Do not migrate frontmatter in this pass; the resolver handles it.

---

## Redirects

`public/_redirects` currently has 54 lines mentioning `/departments/`. Every one
that targets a moved path needs repointing so it stays a single hop.

Distinct current targets and their new destinations:

| Current target | Count | New target |
| --- | ---: | --- |
| `/departments/hobfarm-presents/` | 26 | `/presents/` or a specific section |
| `/departments/magazine-time-machine/` | 10 | `/presents/magazine-time-machine/` |
| `/departments/funnies/` | 6 | `/presents/funnies/` |
| `/departments/essays-arguments/` | 4 | `/articles/essays-arguments/` |
| `/departments/before-after-eras/` | 4 | `/workshop/before-and-after/` |
| `/departments/satire/` | 4 | `/articles/satire/` once it has content, otherwise `/articles/` |
| `/departments/funny-pages/` | 1 | `/presents/funnies/` |
| `/departments/workshop-notes/` | 1 | `/workshop/workshop-notes/` |

**Batch A already needs amending.** It repointed
`/projects/magazine-time-machine` at `/departments/magazine-time-machine/`,
which becomes a chain the moment that path moves. Retarget it at
`/presents/magazine-time-machine/` in the same pass. Batch A is uncommitted, so
this is an edit rather than a new rule.

Add new 301s from every old path in the route-moves table. No path 404s.

---

## Hardcoded links

84 references to `/departments/` outside the departments routes themselves.

| Location | Count | Note |
| --- | ---: | --- |
| `src/data` | 32 | Data files. Repoint |
| `src/content/articles` | 24 | Body prose and frontmatter. **Repoint frontmatter link fields only.** Leave body copy alone, the 301s handle it |
| `src/lib` | 7 | Includes `search-index.ts` and `agent-corpus.ts`. Repoint |
| `src/layouts` | 3 | `ArticleLayout` uses `departmentPath()`, so it fixes itself |
| `src/components/home` | 3 | **Homepage files are frozen.** Report, do not edit |
| Everything else | 15 | Route files. Repoint |

`src/data/navigation.ts` footer group "Read" hardcodes five `/departments/`
paths at lines 29-33, and "Information" links `/departments/` at line 57.
Repoint the first five, remove the last.

---

## What departments.ts becomes

Keep the file. It is still the taxonomy source of truth and the article schema
depends on it. Change what it means, not whether it exists.

- Keep `departments`, `departmentAliases`, `resolveDepartment`,
  `getDepartmentLabel`, `departmentFilters`.
- Rewrite `departmentPath()` per the routing rule.
- The visibility helpers (`departmentStatus`, `departmentShowsInHub`, and
  friends) governed the departments hub. With the hub gone, `hubDepartments`
  now means "categories with a browsable page." Keep the mechanism, rename the
  intent in comments so the next reader is not misled.
- `galleryTypeToDepartment` still maps gallery types to categories. Keep.

Delete `src/pages/departments/` entirely: `[slug].astro`, `funnies.astro`,
`index.astro`, and the `hobfarm-presents/` tree move to `/presents/`.

---

## Sequencing

This pass interacts with two others already written. Run them in this order.

1. **Merge `origin/main`.** Everything else assumes the visibility layer exists.
2. **Pass 2 B1 and B2** (`workshop-pass-2-b1-b2-brief.md`). Mechanical, already
   specced, and it establishes the Workshop routes this pass redirects into.
3. **This brief.** Creating `/presents/` also gives HobFarm TV its home, which
   was the last thing blocking `/projects/` from closing.
4. **Consolidation Phases 1 and 2**
   (`workshop-consolidation-outline.md`). Retire `/projects/` and `/video/`,
   merge StyleFusion. Now unblocked.
5. **Consolidation Phases 3 and 4.** Workshop page contract and hub repoint.

Doing 3 before 2 means writing several redirect rules twice.

---

## Verification

- [ ] `git status` shows no divergence from `origin/main`
- [ ] `npm run build` passes
- [ ] `npm test` passes. Expect to update `tests/ia-refactor.test.mjs` and any
      test asserting a `/departments/` path
- [ ] `npx astro check` clean
- [ ] Every old path 301s in one hop. No chains, no 404s
- [ ] Presents dropdown shows exactly five sections in the specified order
- [ ] No "View all Presents" or "Departments directory" entry anywhere
- [ ] All 50 articles still reachable from a category page
- [ ] `/articles/essays-arguments/` lists all 16 essays
- [ ] Empty categories generate no route
- [ ] Footer has no `/departments/` link
- [ ] Mobile nav matches desktop
- [ ] Search index and agent corpus contain no `/departments/` URLs

## Open questions for d00d

1. Comic permalinks: move to `/presents/funnies/<series>/<slug>/` or leave at
   `/funnies/`?
2. `/characters/` is a cast index tied to Funnies and Other Alice. Does it stay
   top-level or move under Presents?
3. The three homepage components referencing `/departments/` are frozen. Confirm
   whether the freeze lifts for link repointing, or whether they stay on 301s.
