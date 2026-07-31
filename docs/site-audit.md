# Site orphan and duplicate audit

> Snapshot: commit `f7eae07` on `main`, production build run 2026-07-31. This report is the only repository change made by Pass 1.5.

## Executive findings

- **599 generated routes/endpoints:** 496 HTML pages, 85 Markdown endpoints, 9 text endpoints, 3 manifest XML endpoints, 1 JSON endpoint, 1 prerendered extensionless endpoint, 2 sitemap-integration XML outputs, and 2 runtime API patterns.
- **147 content entries** across 13 configured collections. Four article entries, two Gallery entries, both archived product entries, four promoted Project records, and `stack/astro.md` do not render their bodies at public detail routes.
- **21 true HTML orphans:** zero rendered inbound hrefs and no path from global navigation. Seven more Changelog/account pages have inbound links but no current nav path.
- **76 components** have no static import path from a route or MDX entry. The Process directory has six route-owned components and one unused card; the Visual Systems directory has one route-owned component.
- **24 redirect chains already exist** through `/departments/workshop-notes/`. Two Magazine Time Machine aliases target a recommended merge loser and would become chains after consolidation.
- The confirmed StyleFusion decision holds: `/projects/stylefusion/` wins. The Workshop page has substantial study material—153 exact-unique main-text lines—so this is a merge-then-redirect, not a blind redirect.

## Method

- Generated routes come from the fresh Astro/Cloudflare production manifest and `dist/client`. Public assets such as transcripts, `robots.txt`, and the agent-skill files are not counted as routes. The separate `functions/api/` handlers are deployment-time Cloudflare Pages Functions, not outputs of `npm run build`; they are outside this build-route total. The two Astro API patterns in `src/pages/api/` are included.
- **Lines** are physical lines in the owning route or endpoint source file. Imported components and data files are not added to that number; candidate-page content is measured separately below.
- **Inbound internal links** count distinct generated HTML pages containing an internal `href` to the destination. Source-set IDs resolve to controlling source files in the appendix. Global header/footer destinations, including the Login CTA, use **NAV**.
- **Reachable from nav** means direct global header/footer access or transitive access through rendered internal links. Runtime-only state changes, search, sitemap discovery, form submissions, and typed URLs do not count.
- Duplicate-page line comparisons extract visible text from `<main>`, split it at block-level elements, normalize whitespace, and count loser lines with no exact case-insensitive match on the winner. This is reproducible and deliberately does not claim semantic uniqueness.
- The component audit follows static imports transitively from every `src/pages` route and MDX entry. A component loaded only through an unparseable runtime convention could be a false positive and should be checked before deletion.

## Disposition totals

| Inventory | keep | merge | promote | redirect | hide | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Routes/endpoints | 576 | 6 | 6 | 4 | 7 | 599 |
| Content entries | 129 | 5 | 0 | 1 | 12 | 147 |

## Duplicate and overlap decisions

| Subject | Page that wins | Loser or overlap | Unique loser content | Disposition and redirect |
| --- | --- | --- | ---: | --- |
| StyleFusion | `/projects/stylefusion/` — stronger public brief and canonical project home | `/workshop/stylefusion/` | 153 main-text lines | **merge** those lines/studies, then 301 Workshop to Project. Keep the prototype **hide**. |
| Before & After | `/workshop/before-and-after/` — method hub | `/gallery/before-and-after/` | 26 | **redirect** already exists. Keep all four Gallery detail entries as evidence. |
| Cute & Corrupted | `/workshop/cute-and-corrupted/` — method hub | Gallery series hub; Visual Systems detail | 77; 41 | Gallery hub **redirect** already exists. **merge** Visual Systems detail, then add its 301. Keep seven Gallery detail entries. |
| Sophia / Stella | `/workshop/alter-ego/` — Workshop subject | Visual Systems detail; Shop handoff | 42; 6 | **merge** Visual Systems, **redirect** Shop. Keep Visual Lab **hide**; its 93 unique review lines require approval before reuse. |
| Visual Systems taxonomy | `/workshop/` — correct parent | `/visual-systems/` | 9 | **merge** the intro, then 301 to Workshop after child redirects exist. |
| Magazine Time Machine | `/departments/magazine-time-machine/` — active editorial department | `/projects/hobfarm-tv/magazine-time-machine/` | 20 | **merge**, then 301 project route to department. Repoint two existing aliases directly to the department. |
| Seed to World | Future `/workshop/seed-to-world/` method page | `/process/seed-to-world/` overlaps the Gallery series and one evidence entry | 77 of 79 process lines differ from Character / Mannequin | **promote**, not merge. Keep Gallery series/detail; redirect Process only after promotion. |
| Motion | Future `/workshop/motion/` method page | `/process/motion/` overlaps Character / Mannequin motion proof | 100 of 100 process lines differ | **promote**, not merge; then redirect old Process path. |
| Ami / Legacy and Avatar & Host | Neither replaces the other | Ami campaign: 123 lines; host system: 105 lines | 122 Ami lines differ from host page | **promote** Ami to Projects and Avatar & Host to top-level Workshop. No merge between them. |
| HobFarm TV and Video Archive | Both | Channel hub versus cross-site media archive | 104 of 114 Video lines differ | **keep** both; Video explicitly describes itself as an archive whose items retain primary homes elsewhere. |

### Promoted Project records with no rendered body

| Record | Lines | Canonical winner | Disposition |
| --- | ---: | --- | --- |
| `src/content/projects/courses.md` | 36 | `/academy/` | **merge** record metadata into the canonical source; existing route redirects stay one hop. |
| `src/content/projects/grimoire.md` | 40 | `/grimoire/` | **merge** record metadata into the canonical source; existing route redirects stay one hop. |
| `src/content/projects/shop.md` | 58 | `/shop/` | **merge** record metadata into the canonical source; existing route redirects stay one hop. |
| `src/content/projects/hobfarm-tv/3-degrees-of-dick-miller.md` | 106 | `/departments/hobfarm-presents/3-degrees-of-dick-miller/` | **merge** record metadata into the canonical source; existing route redirects stay one hop. |

## Route inventory

### Root (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/` | 33 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/index.astro</code>. |

### `/404/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/404` | 64 | 0 — none | no | **keep** | Intentional error route; no inbound link or nav path is expected. |

### `/about/` (2)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/about/` | 124 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/about/index.astro</code>. |
| `/about/index.md` | 17 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/academy/` (34)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/academy/` | 210 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/academy/index.astro</code>. |
| `/academy/avatar-content-system/` | 377 | 6 — S001 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/index.astro</code>. |
| `/academy/avatar-content-system/course/` | 134 | 18 — S002 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/index.astro</code>. |
| `/academy/avatar-content-system/course/build-your-avatar-concept/` | 165 | 3 — S003 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/choose-your-workflow/` | 165 | 3 — S004 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/create-a-chatgpt-project/` | 165 | 3 — S003 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/create-a-voice-test-in-elevenlabs/` | 165 | 2 — S005 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/create-an-avatar-clip-in-heygen/` | 165 | 2 — S005 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/create-the-starter-source-file/` | 165 | 4 — S006 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/first-chatgpt-prompt/` | 165 | 3 — S004 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/make-your-project-folder/` | 165 | 3 — S004 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/move-files-between-phone-and-laptop/` | 165 | 2 — S005 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/review-the-post-and-make-the-next-one/` | 165 | 2 — S005 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/save-and-name-your-exports/` | 165 | 2 — S005 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/schedule-in-meta-business-suite/` | 165 | 2 — S005 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/screenshot-research-method/` | 165 | 3 — S003 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/set-up-chatgpt-personalization/` | 165 | 3 — S003 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/what-you-are-building/` | 165 | 2 — S005 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/course/write-or-speak-your-first-script/` | 165 | 3 — S003 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/course/[lessonSlug].astro</code>. |
| `/academy/avatar-content-system/free/` | 235 | 3 — S007 | via links | **keep** | Canonical page generated by <code>src/pages/academy/avatar-content-system/free.astro</code>. |
| `/academy/index.md` | 22 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/academy/intellectual-self-defense/` | 274 | 13 — S008 | via links | **keep** | Canonical page generated by <code>src/pages/academy/[courseSlug]/index.astro</code>. |
| `/academy/intellectual-self-defense/ask-audit-rebuild/` | 205 | 3 — S009 | via links | **keep** | Canonical page generated by <code>src/pages/academy/[courseSlug]/[lessonSlug].astro</code>. |
| `/academy/intellectual-self-defense/build-your-own-protocol/` | 205 | 2 — S010 | via links | **keep** | Canonical page generated by <code>src/pages/academy/[courseSlug]/[lessonSlug].astro</code>. |
| `/academy/intellectual-self-defense/give-the-chatbot-a-research-job/` | 205 | 3 — S011 | via links | **keep** | Canonical page generated by <code>src/pages/academy/[courseSlug]/[lessonSlug].astro</code>. |
| `/academy/intellectual-self-defense/human-ai-and-hybrid-slop/` | 205 | 3 — S012 | via links | **keep** | Canonical page generated by <code>src/pages/academy/[courseSlug]/[lessonSlug].astro</code>. |
| `/academy/intellectual-self-defense/i-asked-for-a-picture-it-built-a-system/` | 205 | 3 — S013 | via links | **keep** | Canonical page generated by <code>src/pages/academy/[courseSlug]/[lessonSlug].astro</code>. |
| `/academy/intellectual-self-defense/open-the-receipt/` | 205 | 3 — S014 | via links | **keep** | Canonical page generated by <code>src/pages/academy/[courseSlug]/[lessonSlug].astro</code>. |
| `/academy/intellectual-self-defense/route-the-work/` | 205 | 3 — S015 | via links | **keep** | Canonical page generated by <code>src/pages/academy/[courseSlug]/[lessonSlug].astro</code>. |
| `/academy/intellectual-self-defense/source-files-beat-vibes/` | 205 | 3 — S016 | via links | **keep** | Canonical page generated by <code>src/pages/academy/[courseSlug]/[lessonSlug].astro</code>. |
| `/academy/intellectual-self-defense/the-card-catalog-started-talking-back/` | 205 | 3 — S017 | via links | **keep** | Canonical page generated by <code>src/pages/academy/[courseSlug]/[lessonSlug].astro</code>. |
| `/academy/intellectual-self-defense/worksheets/ai-output-receipt/` | 116 | 2 — S018 | via links | **keep** | Canonical page generated by <code>src/pages/academy/[courseSlug]/worksheets/[worksheetSlug].astro</code>. |
| `/academy/intellectual-self-defense/worksheets/my-intellectual-self-defense-protocol-v1/` | 116 | 2 — S019 | via links | **keep** | Canonical page generated by <code>src/pages/academy/[courseSlug]/worksheets/[worksheetSlug].astro</code>. |
| `/academy/llms.txt` | 34 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/account/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/account/` | 45 | 1 — S020 | no | **keep** | Auth-only destination; the client changes the Login CTA after authentication. |

### `/api/` (3)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/api/auth/[...path]` | 16 | 0 — none | no | **keep** | Runtime API pattern; intentionally outside navigation. |
| `/api/grimoire/snapshot` | 18 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/api/keys/[...path]` | 16 | 0 — none | no | **keep** | Runtime API pattern; intentionally outside navigation. |

### `/articles/` (310)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/articles/` | 162 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/articles/index.astro</code>. |
| `/articles/1956-automation/` | 34 | 17 — S021 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/1956-automation/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/1973-when-airbrush-was-ai/` | 34 | 12 — S022 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/1973-when-airbrush-was-ai/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/1985-future-tech/` | 34 | 16 — S023 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/1985-future-tech/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/a-false-recipe-a-real-image/` | 34 | 15 — S024 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/a-false-recipe-a-real-image/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/a-world-of-geniuses-needs-a-system/` | 34 | 17 — S025 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/a-world-of-geniuses-needs-a-system/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/against-slop/` | 34 | 13 — S026 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/against-slop/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/brought-to-you-by-they-inc/` | 34 | 13 — S027 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/brought-to-you-by-they-inc/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/building-in-public-solo-developer/` | 34 | 9 — S028 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/building-in-public-solo-developer/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/building-in-public/` | 34 | 9 — S029 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/building-in-public/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/california-used-to-race-here/` | 34 | 14 — S030 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/california-used-to-race-here/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/color-becomes-a-cast/` | 34 | 26 — S031 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/color-becomes-a-cast/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/divisionism-was-painting-before-pixels/` | 34 | 10 — S032 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/divisionism-was-painting-before-pixels/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/everything-is-still-loading/` | 34 | 17 — S033 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/everything-is-still-loading/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/gary-and-the-fork/` | 34 | 24 — S034 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/gary-and-the-fork/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/gonna-be-different/` | 34 | 14 — S035 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/gonna-be-different/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/goth-get-boots/` | 34 | 18 — S036 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/goth-get-boots/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/grimoire-knowledge-graph/` | 34 | 8 — S037 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/grimoire-knowledge-graph/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/hello-world/` | 34 | 8 — S038 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/hello-world/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/how-hobbot-keeps-the-lights-on/` | 34 | 8 — S039 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/how-hobbot-keeps-the-lights-on/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/how-psychedelia-went-beige/` | 34 | 11 — S040 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/how-psychedelia-went-beige/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/how-the-money-eats-the-medium/` | 34 | 19 — S041 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/how-the-money-eats-the-medium/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/how-to-fix-slop/` | 34 | 14 — S042 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/how-to-fix-slop/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/i-could-be-playing-civilization/` | 34 | 19 — S043 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/i-could-be-playing-civilization/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/index.md` | 18 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/instagram-funnel-buckets/` | 34 | 14 — S044 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/instagram-funnel-buckets/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/invisible-variable/` | 34 | 10 — S045 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/invisible-variable/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/llms.txt` | 18 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/mad-trump-and-the-magazine-time-machine/` | 34 | 16 — S046 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/mad-trump-and-the-magazine-time-machine/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/other-alice-origin/` | 34 | 25 — S047 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/other-alice-origin/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/page/2/` | 125 | 4 — S048 | via links | **keep** | Canonical page generated by <code>src/pages/articles/page/[page].astro</code>. |
| `/articles/page/3/` | 125 | 4 — S048 | via links | **keep** | Canonical page generated by <code>src/pages/articles/page/[page].astro</code>. |
| `/articles/page/4/` | 125 | 4 — S048 | via links | **keep** | Canonical page generated by <code>src/pages/articles/page/[page].astro</code>. |
| `/articles/page/5/` | 125 | 4 — S048 | via links | **keep** | Canonical page generated by <code>src/pages/articles/page/[page].astro</code>. |
| `/articles/psychedelic-goth-defined/` | 34 | 12 — S049 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/psychedelic-goth-defined/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/put-on-the-glasses/` | 34 | 22 — S050 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/put-on-the-glasses/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/same-model-different-surface/` | 34 | 13 — S051 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/same-model-different-surface/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/stylefusion-ir-extraction/` | 34 | 16 — S052 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/stylefusion-ir-extraction/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/tags/` | 24 | 5 — S048 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/index.astro</code>. |
| `/articles/tags/1930s/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/1933/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/1970s/` | 62 | 232 — S054 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/1980s%20film/` | 62 | 232 — S055 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/3dm/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/academy/` | 62 | 232 — S056 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Adobe%20Premiere/` | 62 | 232 — S057 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/aesthetics/` | 62 | 233 — S058 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/agency/` | 62 | 232 — S059 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/agentic%20systems/` | 62 | 232 — S060 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/AGENTS.md/` | 62 | 232 — S060 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/ai%20agents/` | 62 | 232 — S061 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/ai%20art/` | 62 | 232 — S062 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/ai%20policy/` | 62 | 232 — S063 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/ai%20slop/` | 62 | 234 — S064 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/ai-image-generation/` | 62 | 234 — S065 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/AI-native%20games/` | 62 | 232 — S066 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/ai-parallels/` | 62 | 232 — S054 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/AI/` | 62 | 232 — S067 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/airbrush/` | 62 | 232 — S054 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/algorithm/` | 62 | 232 — S068 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/algorithms/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Alice%20in%20Wonderland/` | 62 | 232 — S069 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Alice%20White/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/anime/` | 62 | 232 — S070 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/anthropic/` | 62 | 232 — S063 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Apple%20I/` | 62 | 232 — S071 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/architecture/` | 62 | 232 — S072 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/ARPANET/` | 62 | 232 — S071 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/art%20history/` | 62 | 232 — S073 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/art-history/` | 62 | 233 — S074 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/artificial%20intelligence/` | 62 | 234 — S075 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Atheer/` | 62 | 232 — S055 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/attention%20economy/` | 62 | 232 — S076 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/attention/` | 62 | 232 — S077 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/augmented%20reality/` | 62 | 232 — S055 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/auto%20racing/` | 62 | 232 — S078 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/automation/` | 62 | 233 — S079 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/BBS/` | 62 | 233 — S080 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Big/` | 62 | 232 — S066 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Billy%20Barty/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/bob-crewe/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Broadway%20Babies/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/built%20environment/` | 62 | 232 — S078 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Busby%20Berkeley/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/business-model/` | 62 | 232 — S081 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/California%20history/` | 62 | 232 — S078 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/censorship/` | 62 | 232 — S082 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/character%20actors/` | 62 | 232 — S055 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/character%20design/` | 62 | 233 — S083 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/character-design/` | 62 | 232 — S084 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/chatgpt/` | 62 | 232 — S085 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/circus%20history/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Civilization/` | 62 | 233 — S086 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/cloud%20computing/` | 62 | 232 — S067 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/cloudflare/` | 62 | 233 — S087 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/codex/` | 62 | 232 — S060 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Colossal%20Cave%20Adventure/` | 62 | 232 — S071 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/comics/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/computer%20history/` | 62 | 233 — S080 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/concept%20development/` | 62 | 232 — S088 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/consumer%20ai/` | 62 | 232 — S063 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/contrast/` | 62 | 232 — S089 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/creative%20systems/` | 62 | 236 — S090 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/cross-pollination/` | 62 | 232 — S088 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/cult%20cinema/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/cute%20and%20corrupted/` | 62 | 232 — S068 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/dark%20psychedelia/` | 62 | 232 — S091 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/defaults/` | 62 | 232 — S092 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Dick%20Miller/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Dick%20Powell/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/disability/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/divisionism/` | 62 | 232 — S073 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Doom/` | 62 | 233 — S080 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/dwarfism/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Early%20Access/` | 62 | 232 — S057 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/early%20sound/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/enterprise%20software/` | 62 | 232 — S055 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/fantasy/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/festival%20culture/` | 62 | 232 — S093 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/film%20history/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/forced%20obsolescence/` | 62 | 232 — S057 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/frank%20mchugh/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Freaks/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/funnel%20buckets/` | 62 | 232 — S068 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/future-tech/` | 62 | 232 — S094 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/game%20design/` | 62 | 232 — S066 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/game%20history/` | 62 | 232 — S071 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/games/` | 62 | 232 — S067 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/gary/` | 62 | 232 — S095 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/gemini/` | 62 | 232 — S085 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Gilmore%20Stadium/` | 62 | 232 — S078 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/giuliano-sorgini/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/gothic/` | 62 | 232 — S070 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Great%20Depression/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/grimoire/` | 62 | 237 — S096 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/grok/` | 62 | 232 — S085 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/harvey-kurtzman/` | 62 | 232 — S082 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/history/` | 62 | 232 — S054 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/hobbot/` | 62 | 232 — S097 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/hobfarm/` | 62 | 232 — S098 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/hosted%20ai/` | 62 | 232 — S063 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/hot%20rods/` | 62 | 232 — S078 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/ibm/` | 62 | 232 — S099 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/illustration/` | 62 | 232 — S054 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/image%20generation/` | 62 | 234 — S100 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/image-generation/` | 62 | 232 — S101 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/independent%20publishing/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/independent-media/` | 62 | 232 — S102 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/indie/` | 62 | 232 — S081 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Infocom/` | 62 | 232 — S071 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/information%20systems/` | 62 | 232 — S077 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/infrastructure/` | 62 | 232 — S097 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/instagram/` | 62 | 232 — S068 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/interactive%20fiction/` | 62 | 234 — S103 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/italian-soundtracks/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Joan%20Blondell/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Joe%20Dante/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/John%20Carpenter/` | 62 | 232 — S055 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/journalism/` | 62 | 232 — S076 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Keith%20David/` | 62 | 232 — S055 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/knowledge%20systems/` | 62 | 232 — S061 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/knowledge-graph/` | 62 | 232 — S104 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/labor/` | 62 | 232 — S099 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/leonard-nimoy/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/library-music/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/lighting/` | 62 | 232 — S089 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/local%20ai/` | 62 | 232 — S063 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/lowriders/` | 62 | 232 — S078 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/mad-magazine/` | 62 | 232 — S082 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/magazine-time-machine/` | 62 | 235 — S105 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/manifesto/` | 62 | 232 — S062 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Marion%20Byron/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/marshall%20mcluhan/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/media%20criticism/` | 62 | 232 — S055 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/media%20history/` | 62 | 232 — S076 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/media%20literacy/` | 62 | 232 — S056 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/media%20theory/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/media-economics/` | 62 | 232 — S102 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/media-history/` | 62 | 234 — S106 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/media/` | 62 | 232 — S077 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/misinformation/` | 62 | 232 — S076 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/mixed-media%20fiction/` | 62 | 232 — S069 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/muppets/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/music/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/names/` | 62 | 232 — S092 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/noir/` | 62 | 232 — S089 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/observation/` | 62 | 232 — S093 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/open%20source/` | 62 | 232 — S055 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Other%20Alice%20Adventures/` | 62 | 233 — S107 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Other%20Alice/` | 62 | 233 — S108 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/other-alice-adventures/` | 62 | 232 — S102 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/PC%20gaming/` | 62 | 232 — S057 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/perception/` | 62 | 232 — S089 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/personal%20computing/` | 62 | 232 — S055 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/physical%20media/` | 62 | 232 — S067 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/piero-umiliani/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/pipeline/` | 62 | 232 — S097 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/playboy/` | 62 | 232 — S094 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/political%20identity/` | 62 | 232 — S077 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/pre-Code%20Hollywood/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/procedural%20storytelling/` | 62 | 232 — S066 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/process/` | 62 | 236 — S109 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Production%20Code/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/prompting/` | 62 | 233 — S083 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/propaganda/` | 62 | 232 — S077 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/psychedelic%20goth/` | 62 | 233 — S110 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/psychedelic/` | 62 | 232 — S093 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/psygoth/` | 62 | 232 — S084 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/publishing-history/` | 62 | 232 — S102 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/research/` | 62 | 234 — S111 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/retro-futurism/` | 62 | 232 — S094 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/rgb/` | 62 | 232 — S084 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/robotics/` | 62 | 233 — S112 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Roddy%20Piper/` | 62 | 232 — S055 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Roger%20Corman/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Ruby%20Keeler/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Sally%20Eilers/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Salton%20Sea/` | 62 | 232 — S069 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Sarasota/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/satire/` | 62 | 232 — S082 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/scope%20control/` | 62 | 232 — S056 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/self-driving-cars/` | 62 | 232 — S094 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/shadow/` | 62 | 232 — S089 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/short-stories/` | 62 | 232 — S102 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/skills/` | 62 | 232 — S060 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/slop/` | 62 | 233 — S113 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/smart%20glasses/` | 62 | 232 — S055 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/smart-glasses/` | 62 | 232 — S094 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/social%20media/` | 62 | 233 — S114 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/software%20factories/` | 62 | 232 — S067 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/solo%20publishing/` | 62 | 232 — S060 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/solo-dev/` | 62 | 232 — S081 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Southern%20California/` | 62 | 232 — S078 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/speculative%20artifacts/` | 62 | 232 — S088 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Steam/` | 62 | 232 — S057 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/story%20engines/` | 62 | 232 — S066 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/structured%20data/` | 62 | 232 — S061 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/style%20construction/` | 62 | 233 — S115 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/style%20guide/` | 62 | 232 — S091 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/style-transfer/` | 62 | 232 — S070 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/StyleFusion/` | 62 | 233 — S107 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/technodelic/` | 62 | 232 — S084 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/television%20history/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/television/` | 62 | 232 — S102 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/The%20Wizard%20of%20Oz/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/They%20Live/` | 62 | 232 — S055 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/thirty-year%20field%20report/` | 62 | 232 — S077 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/trump-magazine/` | 62 | 232 — S082 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/virtual%20reality/` | 62 | 232 — S057 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/visual%20development/` | 62 | 232 — S069 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/visual%20systems/` | 62 | 232 — S073 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/visual-aesthetics/` | 62 | 232 — S089 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/visual-culture/` | 62 | 234 — S106 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/visual-dna/` | 62 | 232 — S070 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/visual-systems/` | 62 | 232 — S084 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/vonnegut/` | 62 | 232 — S102 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Walter%20Paisley/` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Warner%20Bros./` | 62 | 231 — S053 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/wearable%20computing/` | 62 | 232 — S067 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Windows%2011/` | 62 | 232 — S057 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Wonder%20Machine/` | 62 | 232 — S067 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/workers/` | 62 | 232 — S072 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/workflow/` | 62 | 233 — S116 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/worldbuilding/` | 62 | 232 — S069 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/tags/Zork/` | 62 | 232 — S071 | via links | **keep** | Canonical page generated by <code>src/pages/articles/tags/[tag].astro</code>. |
| `/articles/take-me-to-phobos/` | 34 | 15 — S117 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/take-me-to-phobos/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/the-anime-to-gothic-pipeline/` | 34 | 10 — S118 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/the-anime-to-gothic-pipeline/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/the-card-catalog-started-talking-back/` | 34 | 22 — S119 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/the-card-catalog-started-talking-back/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/the-unlit-corner-chiaroscuro-truth-shadows/` | 34 | 12 — S120 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/the-unlit-corner-chiaroscuro-truth-shadows/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/too-big-for-the-box/` | 34 | 19 — S121 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/too-big-for-the-box/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/vacation-into-nothing/` | 34 | 13 — S122 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/vacation-into-nothing/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/articles/you-do-not-own-the-ai-you-pay-for/` | 34 | 14 — S123 | via links | **keep** | Canonical page generated by <code>src/pages/articles/[...slug].astro</code>. |
| `/articles/you-do-not-own-the-ai-you-pay-for/index.md` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/changelog/` (7)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/changelog/` | 42 | 0 — none | no | **keep** | Orphan hub. Keep it canonical, but add one Information/About link so its six children gain a nav path. |
| `/changelog/gallery-launch/` | 23 | 1 — S124 | no | **keep** | No current nav path; becomes reachable when the Changelog hub receives its recommended link. |
| `/changelog/grimoire-knowledge-base/` | 23 | 1 — S124 | no | **keep** | No current nav path; becomes reachable when the Changelog hub receives its recommended link. |
| `/changelog/march-2026-site-audit/` | 23 | 1 — S124 | no | **keep** | No current nav path; becomes reachable when the Changelog hub receives its recommended link. |
| `/changelog/may-2026-search-consolidation/` | 23 | 1 — S124 | no | **keep** | No current nav path; becomes reachable when the Changelog hub receives its recommended link. |
| `/changelog/site-launch/` | 23 | 1 — S124 | no | **keep** | No current nav path; becomes reachable when the Changelog hub receives its recommended link. |
| `/changelog/stylefusion-beta/` | 23 | 1 — S124 | no | **keep** | No current nav path; becomes reachable when the Changelog hub receives its recommended link. |

### `/characters/` (17)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/characters/` | 79 | 15 — S125 | via links | **keep** | Canonical page generated by <code>src/pages/characters/index.astro</code>. |
| `/characters/alice/` | 340 | 4 — S126 | via links | **keep** | Canonical page generated by <code>src/pages/characters/[character].astro</code>. |
| `/characters/alice/index.md` | 21 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/characters/buffcock/` | 340 | 7 — S127 | via links | **keep** | Canonical page generated by <code>src/pages/characters/[character].astro</code>. |
| `/characters/chester/` | 340 | 2 — S128 | via links | **keep** | Canonical page generated by <code>src/pages/characters/[character].astro</code>. |
| `/characters/chester/index.md` | 21 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/characters/cs/` | 340 | 3 — S129 | via links | **keep** | Canonical page generated by <code>src/pages/characters/[character].astro</code>. |
| `/characters/fat-cat/` | 340 | 6 — S130 | via links | **keep** | Canonical page generated by <code>src/pages/characters/[character].astro</code>. |
| `/characters/gary/` | 340 | 11 — S131 | via links | **keep** | Canonical page generated by <code>src/pages/characters/[character].astro</code>. |
| `/characters/gothcat/` | 340 | 6 — S132 | via links | **keep** | Canonical page generated by <code>src/pages/characters/[character].astro</code>. |
| `/characters/heidi/` | 340 | 4 — S133 | via links | **keep** | Canonical page generated by <code>src/pages/characters/[character].astro</code>. |
| `/characters/helmut/` | 340 | 7 — S134 | via links | **keep** | Canonical page generated by <code>src/pages/characters/[character].astro</code>. |
| `/characters/hillary-hobfarm/` | 340 | 1 — S135 | via links | **keep** | Canonical page generated by <code>src/pages/characters/[character].astro</code>. |
| `/characters/hobunny/` | 340 | 2 — S136 | via links | **keep** | Canonical page generated by <code>src/pages/characters/[character].astro</code>. |
| `/characters/larry/` | 340 | 9 — S137 | via links | **keep** | Canonical page generated by <code>src/pages/characters/[character].astro</code>. |
| `/characters/the-hatter/` | 340 | 2 — S128 | via links | **keep** | Canonical page generated by <code>src/pages/characters/[character].astro</code>. |
| `/characters/the-hatter/index.md` | 21 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/contact/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/contact/` | 75 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/contact.astro</code>. |

### `/departments/` (38)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/departments/` | 25 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/departments/index.astro</code>. |
| `/departments/before-after-eras/` | 259 | 5 — S048 | via links | **keep** | Canonical page generated by <code>src/pages/departments/[slug].astro</code>. |
| `/departments/critter-feed/` | 259 | 0 — none | no | **hide** | Orphan and currently empty/planned; add noindex and keep it out of navigation until it has publishable entries. |
| `/departments/cute-corrupted/` | 259 | 8 — S138 | via links | **keep** | Canonical page generated by <code>src/pages/departments/[slug].astro</code>. |
| `/departments/essays-arguments/` | 259 | 21 — S139 | via links | **keep** | Canonical page generated by <code>src/pages/departments/[slug].astro</code>. |
| `/departments/funnies/` | 191 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/departments/funnies.astro</code>. |
| `/departments/hobfarm-presents/` | 55 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/index.astro</code>. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/` | 217 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/index.astro</code>. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/1933-the-year-warner-bros-built-a-world/` | 23 | 19 — S140 | via links | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/[slug].astro</code>. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/1933-the-year-warner-bros-built-a-world/index.md` | 15 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/broadway-babies/` | 23 | 18 — S141 | via links | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/[slug].astro</code>. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/broadway-babies/index.md` | 15 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/enter-the-millerverse/` | 23 | 15 — S142 | via links | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/[slug].astro</code>. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/enter-the-millerverse/index.md` | 15 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/the-censor-eats-its-own-tail/` | 23 | 20 — S143 | via links | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/[slug].astro</code>. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/the-censor-eats-its-own-tail/index.md` | 15 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/the-mouse-in-the-cat-musical/` | 23 | 13 — S144 | via links | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/[slug].astro</code>. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/the-mouse-in-the-cat-musical/index.md` | 15 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/they-had-names-doll-family/` | 23 | 19 — S145 | via links | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/[slug].astro</code>. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/they-had-names-doll-family/index.md` | 15 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/topless-party-in-outer-space/` | 23 | 11 — S146 | via links | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/[slug].astro</code>. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/topless-party-in-outer-space/index.md` | 15 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/you-know-nothing-of-my-algorithm/` | 23 | 10 — S147 | via links | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/[slug].astro</code>. |
| `/departments/hobfarm-presents/3-degrees-of-dick-miller/you-know-nothing-of-my-algorithm/index.md` | 15 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/departments/hobfarm-presents/index.md` | 38 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/departments/hobfarm-presents/llms.txt` | 36 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/departments/hobfarm-presents/other-alice-adventures/` | 385 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/[series]/index.astro</code>. |
| `/departments/hobfarm-presents/other-alice-adventures/cast/` | 128 | 4 — S148 | via links | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/other-alice-adventures/cast/index.astro</code>. |
| `/departments/hobfarm-presents/other-alice-adventures/houses/` | 23 | 5 — S149 | via links | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/other-alice-adventures/houses/index.astro</code>. |
| `/departments/hobfarm-presents/other-alice-adventures/index.md` | 21 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/departments/hobfarm-presents/other-alice-adventures/web-of-wonderland/` | 16 | 4 — S150 | via links | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/other-alice-adventures/web-of-wonderland/index.astro</code>. |
| `/departments/hobfarm-presents/other-alice-adventures/world-guide/` | 39 | 8 — S151 | via links | **keep** | Canonical page generated by <code>src/pages/departments/hobfarm-presents/[series]/world-guide.astro</code>. |
| `/departments/hobfarm-presents/rss.xml` | 36 | 2 — S152 | via links | **keep** | Machine-readable endpoint generated by <code>src/pages/departments/hobfarm-presents/rss.xml.ts</code>. |
| `/departments/magazine-time-machine/` | 259 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/departments/[slug].astro</code>. |
| `/departments/picture-stories/` | 259 | 0 — none | no | **hide** | Orphan and currently empty/planned; add noindex and keep it out of navigation until it has publishable entries. |
| `/departments/satire/` | 259 | 0 — none | no | **hide** | Orphan and currently empty/planned; add noindex and keep it out of navigation until it has publishable entries. |
| `/departments/workshop-notes/` | 259 | 6 — S153 | via links | **redirect** | Generated page is already intercepted by <code>_redirects</code>; canonical target is <code>/workshop/workshop-notes/</code>. |
| `/departments/wtfacts/` | 259 | 0 — none | no | **hide** | Orphan and currently empty/planned; add noindex and keep it out of navigation until it has publishable entries. |

### `/funnies/` (50)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/funnies/buffcock/` | 140 | 7 — S154 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/index.astro</code>. |
| `/funnies/buffcock/buffcock-accident/` | 141 | 7 — S155 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/buffcock/buffcock-fishing/` | 141 | 9 — S156 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/buffcock/buffcock-gym/` | 141 | 8 — S157 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/buffcock/buffcock-show/` | 141 | 7 — S158 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/fat-cat/` | 140 | 1 — S159 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/index.astro</code>. |
| `/funnies/gary-fat-cat/` | 140 | 3 — S160 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/index.astro</code>. |
| `/funnies/gary-fat-cat/gary-fat-cat-design/` | 141 | 7 — S161 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/gary/` | 140 | 8 — S162 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/index.astro</code>. |
| `/funnies/gary/gary-bar/` | 141 | 6 — S163 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/gary/gary-bowling/` | 141 | 8 — S164 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/gary/gary-buffet/` | 141 | 8 — S165 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/gary/gary-fork-standoff/` | 141 | 5 — S166 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/gary/gary-vegas/` | 141 | 8 — S167 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/gary/gary-web-dev-ai/` | 141 | 9 — S168 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/gothcat/` | 140 | 1 — S159 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/index.astro</code>. |
| `/funnies/hobunny/` | 140 | 1 — S159 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/index.astro</code>. |
| `/funnies/larry/` | 140 | 11 — S169 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/index.astro</code>. |
| `/funnies/larry/larry-gothcat-hulmut-heidi-dinner/` | 141 | 14 — S170 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/larry/larry-helmut-bauhaus/` | 141 | 10 — S171 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/larry/larry-helmut-cabaret/` | 141 | 12 — S172 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/larry/larry-helmut-poodles/` | 141 | 10 — S173 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/larry/larry-leon-berger/` | 141 | 8 — S174 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/larry/larry-poker/` | 141 | 7 — S175 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/[series]/[slug].astro</code>. |
| `/funnies/one-offs/` | 140 | 0 — none | no | **hide** | Orphan and currently empty/planned; add noindex and keep it out of navigation until it has publishable entries. |
| `/funnies/tags/ai/` | 77 | 25 — S176 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/bauhaus/` | 77 | 25 — S177 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/bowling/` | 77 | 25 — S178 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/buffcock/` | 77 | 28 — S179 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/buffet/` | 77 | 25 — S180 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/cabaret/` | 77 | 25 — S181 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/character%20design/` | 77 | 25 — S182 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/dinner/` | 77 | 25 — S183 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/fat%20cat/` | 77 | 25 — S182 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/fishing/` | 77 | 25 — S184 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/gary/` | 77 | 31 — S185 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/gothcat/` | 77 | 26 — S186 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/guinea%20pig/` | 77 | 30 — S187 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/gym/` | 77 | 25 — S188 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/heidi/` | 77 | 25 — S183 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/helmut/` | 77 | 28 — S189 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/larry/` | 77 | 30 — S190 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/leonberger/` | 77 | 25 — S191 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/performance/` | 77 | 25 — S192 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/poker/` | 77 | 25 — S193 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/poodles/` | 77 | 25 — S194 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/rooster/` | 77 | 28 — S179 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/single%20panel/` | 77 | 41 — S195 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/vegas/` | 77 | 25 — S196 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |
| `/funnies/tags/web%20dev/` | 77 | 25 — S176 | via links | **keep** | Canonical page generated by <code>src/pages/funnies/tags/[tag].astro</code>. |

### `/gallery/` (42)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/gallery/` | 308 | 13 — S197 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/index.astro</code>. |
| `/gallery/asset-lab/atomic-noir-color-system/` | 45 | 1 — S198 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/asset-lab/atomic-noir-color-system/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/before-and-after/` | 162 | 0 — none | no | **redirect** | Superseded series hub; existing 301 points to <code>/workshop/before-and-after/</code>. Individual gallery evidence stays canonical. |
| `/gallery/before-and-after/1926-now/` | 45 | 5 — S199 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/before-and-after/1926-now/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/before-and-after/north-shore-1960s-2010s/` | 45 | 3 — S200 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/before-and-after/north-shore-1960s-2010s/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/before-and-after/salton-city-1965-alternate-2065/` | 45 | 4 — S201 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/before-and-after/salton-city-1965-alternate-2065/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/before-and-after/shit-to-shine-01/` | 45 | 5 — S199 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/before-and-after/shit-to-shine-01/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/character-dev/seed-to-world-v1-neon-glitch-streetwear/` | 45 | 6 — S202 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/character-dev/seed-to-world-v1-neon-glitch-streetwear/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/compilation/liquid-gothic/` | 45 | 2 — S203 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/compilation/liquid-gothic/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/cute-corrupted/` | 186 | 2 — S204 | via links | **redirect** | Superseded series hub; existing 301 points to <code>/workshop/cute-and-corrupted/</code>. Individual gallery evidence stays canonical. |
| `/gallery/cute-corrupted/cakes/` | 45 | 6 — S205 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/cute-corrupted/cakes/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/cute-corrupted/cat/` | 45 | 8 — S206 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/cute-corrupted/cat/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/cute-corrupted/corgi/` | 45 | 8 — S207 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/cute-corrupted/corgi/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/cute-corrupted/kareena/` | 45 | 11 — S208 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/cute-corrupted/kareena/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/cute-corrupted/koala/` | 45 | 8 — S209 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/cute-corrupted/koala/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/cute-corrupted/raccoon/` | 45 | 10 — S210 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/cute-corrupted/raccoon/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/cute-corrupted/sienna/` | 45 | 6 — S211 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/cute-corrupted/sienna/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/fashion/glamour-pin-up/` | 45 | 3 — S212 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/fashion/glamour-pin-up/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/index.md` | 18 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/llms.txt` | 18 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/model-lab/grok-vs-flux-cartoon-test/` | 45 | 1 — S198 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/model-lab/grok-vs-flux-cartoon-test/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/scene/storm-cathedral/` | 45 | 2 — S203 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/scene/storm-cathedral/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/gallery/seed-to-world/` | 187 | 0 — none | no | **keep** | Orphan series index. Keep it canonical and link it from the Gallery hub; it currently contains one set. |
| `/gallery/video-workflow/higgsfield-transition-test/` | 45 | 3 — S212 | via links | **keep** | Canonical page generated by <code>src/pages/gallery/[...slug].astro</code>. |
| `/gallery/video-workflow/higgsfield-transition-test/index.md` | 20 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/games/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/games/craps/` | 39 | 0 — none | no | **keep** | Orphan released game. Keep the direct route and add it to the Projects catalog. |

### `/grimoire/` (9)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/grimoire/` | 471 | 12 — S213 | via links | **keep** | Canonical page generated by <code>src/pages/grimoire/index.astro</code>. |
| `/grimoire/color-palette-recipes/` | 144 | 0 — none | no | **keep** | Orphan public note. Keep it and add a public-note index to the Grimoire hub. |
| `/grimoire/cross-pollination/` | 57 | 0 — none | no | **keep** | Orphan Grimoire utility. Keep it and expose it from the Grimoire hub if the public archive remains enabled. |
| `/grimoire/face-geometry-identity-lock/` | 144 | 0 — none | no | **keep** | Orphan public note. Keep it and add a public-note index to the Grimoire hub. |
| `/grimoire/from-generic-to-character/` | 144 | 4 — S214 | via links | **keep** | Canonical page generated by <code>src/pages/grimoire/[...slug].astro</code>. |
| `/grimoire/index.md` | 25 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/grimoire/stylefusion-prompt-compilation/` | 144 | 3 — S214 | via links | **keep** | Canonical page generated by <code>src/pages/grimoire/[...slug].astro</code>. |
| `/grimoire/understanding-visual-atoms/` | 144 | 4 — S214 | via links | **keep** | Canonical page generated by <code>src/pages/grimoire/[...slug].astro</code>. |
| `/grimoire/welcome-to-the-grimoire/` | 144 | 0 — none | no | **keep** | Orphan public note. Keep it and add a public-note index to the Grimoire hub. |

### `/helpcenter/` (16)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/helpcenter/` | 137 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/helpcenter/index.astro</code>. |
| `/helpcenter/1/` | 23 | 1 — S215 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |
| `/helpcenter/2/` | 23 | 1 — S215 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |
| `/helpcenter/3/` | 23 | 1 — S215 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |
| `/helpcenter/4/` | 23 | 1 — S215 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |
| `/helpcenter/5/` | 23 | 1 — S215 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |
| `/helpcenter/6/` | 23 | 1 — S215 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |
| `/helpcenter/characters/` | 23 | 3 — S216 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |
| `/helpcenter/exporting-your-work/` | 23 | 1 — S215 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |
| `/helpcenter/generating-images/` | 23 | 1 — S215 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |
| `/helpcenter/getting-started/` | 23 | 1 — S215 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |
| `/helpcenter/history-and-providers/` | 23 | 2 — S217 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |
| `/helpcenter/refining-results/` | 23 | 1 — S215 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |
| `/helpcenter/styles-and-arrangements/` | 23 | 1 — S215 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |
| `/helpcenter/the-workspace/` | 23 | 2 — S218 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |
| `/helpcenter/working-with-references/` | 23 | 2 — S218 | via links | **keep** | Canonical page generated by <code>src/pages/helpcenter/[...slug].astro</code>. |

### `/index.md/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/index.md` | 17 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/legal/` (8)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/legal/bug-bounty/` | 22 | 0 — none | no | **keep** | Orphan legal policy intentionally outside global nav; keep its sitemap/direct URL access. |
| `/legal/cookies/` | 22 | 1 — S219 | via links | **keep** | Canonical page generated by <code>src/pages/legal/[...slug].astro</code>. |
| `/legal/dpa/` | 22 | 0 — none | no | **keep** | Orphan legal policy intentionally outside global nav; keep its sitemap/direct URL access. |
| `/legal/privacy/` | 22 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/legal/[...slug].astro</code>. |
| `/legal/refunds/` | 22 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/legal/[...slug].astro</code>. |
| `/legal/terms/` | 22 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/legal/[...slug].astro</code>. |
| `/legal/usage/` | 22 | 1 — S220 | via links | **keep** | Canonical page generated by <code>src/pages/legal/[...slug].astro</code>. |
| `/legal/usage/index.md` | 22 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/llms-full.txt/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/llms-full.txt` | 6 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/llms.txt/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/llms.txt` | 6 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/login/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/login/` | 37 | 488 — NAV | direct | **keep** | Global auth CTA; canonical page generated by <code>src/pages/login.astro</code>. |

### `/membership/` (2)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/membership/` | 20 | 18 — S222 | via links | **keep** | Canonical page generated by <code>src/pages/membership.astro</code>. |
| `/membership/success/` | 68 | 0 — none | no | **keep** | Transactional terminal route; intentionally absent from navigation. |

### `/process/` (4)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/process/book/` | 163 | 1 — S223 | via links | **promote** | Move the distinct 78-line book-package method to <code>/workshop/book-package/</code>, then redirect this path. |
| `/process/fashion/` | 163 | 2 — S224 | via links | **promote** | Move the distinct 78-line fashion-grammar method to <code>/workshop/fashion-grammar/</code>, then redirect this path. |
| `/process/motion/` | 163 | 3 — S225 | via links | **promote** | Move the distinct 100-line motion method to <code>/workshop/motion/</code>, then redirect this path. |
| `/process/seed-to-world/` | 163 | 4 — S226 | via links | **promote** | Move the distinct 79-line method to <code>/workshop/seed-to-world/</code>, then redirect this path. |

### `/products/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/products/llms.txt` | 14 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/projects/` (16)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/projects/` | 174 | 3 — S227 | via links | **keep** | Canonical page generated by <code>src/pages/projects/index.astro</code>. |
| `/projects/anomalybot/` | 347 | 1 — S228 | via links | **keep** | Canonical page generated by <code>src/pages/projects/[...slug].astro</code>. |
| `/projects/anomalybot/index.md` | 23 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/projects/drifter/` | 347 | 1 — S228 | via links | **keep** | Canonical page generated by <code>src/pages/projects/[...slug].astro</code>. |
| `/projects/drifter/index.md` | 23 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/projects/hobbot/` | 347 | 1 — S228 | via links | **keep** | Canonical page generated by <code>src/pages/projects/[...slug].astro</code>. |
| `/projects/hobbot/index.md` | 23 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/projects/hobfarm-tv/` | 126 | 488 — NAV | direct | **keep** | Presents dropdown item; canonical page generated by <code>src/pages/projects/hobfarm-tv/index.astro</code>. |
| `/projects/hobfarm-tv/magazine-time-machine/` | 347 | 2 — S230 | via links | **merge** | Merge 20 exact-unique main-text lines into <code>/departments/magazine-time-machine/</code>; the department page wins, then this route redirects. |
| `/projects/hobfarm-tv/magazine-time-machine/index.md` | 23 | 0 — none | no | **merge** | Machine-readable companion of the duplicate project page; consolidate with the Magazine Time Machine department source. |
| `/projects/index.md` | 18 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/projects/llms.txt` | 18 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/projects/stylefusion/` | 347 | 14 — S231 | via links | **keep** | Canonical page generated by <code>src/pages/projects/[...slug].astro</code>. |
| `/projects/stylefusion/index.md` | 23 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/projects/xkxxkx/` | 347 | 1 — S228 | via links | **keep** | Canonical page generated by <code>src/pages/projects/[...slug].astro</code>. |
| `/projects/xkxxkx/index.md` | 23 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/rss.xml/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/rss.xml` | 19 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/search-index.json/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/search-index.json` | 17 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/services/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/services/` | 160 | 5 — S232 | via links | **keep** | Canonical page generated by <code>src/pages/services/index.astro</code>. |

### `/shop/` (4)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/shop/` | 149 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/shop/index.astro</code>. |
| `/shop/index.md` | 22 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/shop/order-received/` | 38 | 0 — none | no | **keep** | Transactional terminal route; intentionally absent from navigation. |
| `/shop/sophia-stella-sheet-pack/` | 46 | 0 — none | no | **redirect** | Thin archived-product handoff; 301 to <code>/workshop/alter-ego/</code> after that page absorbs the useful six text lines. |

### `/sitemap-0.xml/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/sitemap-0.xml` | 78 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/sitemap-index.xml/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/sitemap-index.xml` | 78 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/sitemap.xml/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/sitemap.xml` | 185 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |

### `/status/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/status/` | 27 | 1 — S215 | via links | **keep** | Canonical page generated by <code>src/pages/status.astro</code>. |

### `/support/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/support/` | 104 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/support.astro</code>. |

### `/video/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/video/` | 114 | 1 — S233 | via links | **keep** | Canonical page generated by <code>src/pages/video/index.astro</code>. |

### `/visual-systems/` (3)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/visual-systems/` | 78 | 3 — S234 | via links | **merge** | Merge nine exact-unique main-text lines into <code>/workshop/</code>, then redirect this duplicate taxonomy hub. |
| `/visual-systems/cute-corrupted/` | 32 | 2 — S235 | via links | **merge** | Merge 41 exact-unique main-text lines into <code>/workshop/cute-and-corrupted/</code>, then redirect. |
| `/visual-systems/sophia-stella/` | 32 | 4 — S236 | via links | **merge** | Merge 42 exact-unique main-text lines into <code>/workshop/alter-ego/</code>, then redirect. |

### `/whitepaper/` (1)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/whitepaper/` | 652 | 1 — S228 | via links | **keep** | Canonical page generated by <code>src/pages/whitepaper/index.astro</code>. |

### `/workshop/` (14)

| Route | Lines | Inbound internal links | Reachable from nav | Disposition | Note |
| --- | ---: | --- | --- | --- | --- |
| `/workshop/` | 1037 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/workshop/index.astro</code>. |
| `/workshop/alter-ego/` | 117 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/workshop/[program].astro</code>. |
| `/workshop/ami-legacy/` | 958 | 4 — S237 | via links | **promote** | This is a 123-line campaign case study, not a duplicate of Avatar & Host. Promote it to <code>/projects/future-carriage/</code>, then redirect the old path. |
| `/workshop/before-and-after/` | 88 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/workshop/before-and-after/index.astro</code>. |
| `/workshop/character-mannequin/` | 76 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/workshop/character-mannequin/index.astro</code>. |
| `/workshop/character-mannequin/avatar-host-system/` | 430 | 3 — S238 | via links | **promote** | Promote to the already-planned <code>/workshop/avatar-host/</code>; its 105-line host-system argument is distinct from Ami / Legacy. |
| `/workshop/cute-and-corrupted/` | 117 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/workshop/[program].astro</code>. |
| `/workshop/index.md` | 21 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/workshop/llms.txt` | 21 | 0 — none | no | **keep** | Orphan. Canonical route retained at the correct prefix; add a relevant hub link if public discovery is intended. |
| `/workshop/stylefusion/` | 117 | 4 — S239 | via links | **merge** | The project page wins. Merge 153 exact-unique main-text lines and study material into <code>/projects/stylefusion/</code>, then redirect. |
| `/workshop/stylefusion/prototype/` | 257 | 0 — none | no | **hide** | Private noindex review prototype. Keep out of navigation until an explicit publication decision. |
| `/workshop/visual-lab/` | 136 | 0 — none | no | **hide** | Noindex review route with 93 lines not duplicated verbatim in Alter Ego; keep hidden until its component experiments are approved. |
| `/workshop/workshop-notes/` | 117 | 488 — NAV | direct | **keep** | Canonical page generated by <code>src/pages/workshop/[program].astro</code>. |
| `/workshop/workshop-notes/psygoth/` | 305 | 2 — S240 | via links | **keep** | Canonical page generated by <code>src/pages/workshop/workshop-notes/psygoth/index.astro</code>. |

## Content collection usage

The packet expected eight Project records; the current tree contains **10**. Six render detail bodies, while four promoted records are deliberately skipped by `src/pages/projects/[...slug].astro`.

| Collection | Entries | Renderer | Unrendered bodies | Disposition note |
| --- | ---: | --- | ---: | --- |
| `academy` | 9 | `/academy/[courseSlug]/[lessonSlug]` plus course hub | 0 | All rendered entries should remain canonical. |
| `adventures` | 0 | `/departments/hobfarm-presents/[series]/[slug]` (currently emits warning) | 0 | Empty directory: keep dormant or remove the configured collection in a later cleanup; no content row exists. |
| `articles` | 50 | `/articles/[...slug]` or Presents/3DM route | 4 | All rendered entries should remain canonical. |
| `changelog` | 6 | `/changelog/[...slug]` and hub | 0 | All rendered entries should remain canonical. |
| `comics` | 17 | `/funnies/[series]/[slug]` and series/tag indexes | 0 | All rendered entries should remain canonical. |
| `gallery` | 20 | `/gallery/[...slug]` plus Gallery/Workshop indexes | 2 | All rendered entries should remain canonical. |
| `grimoire` | 6 | `/grimoire/[...slug]` plus sidebar/related modules | 0 | All rendered entries should remain canonical. |
| `help` | 15 | `/helpcenter/[...slug]` and hub | 0 | All rendered entries should remain canonical. |
| `legal` | 7 | `/legal/[...slug]`; Usage also has Markdown endpoint | 0 | All rendered entries should remain canonical. |
| `products` | 2 | `/shop/[slug]` for public statuses; both current records are archived | 2 | Both bodies are unrendered archived records; **hide**. |
| `projects` | 10 | `/projects/[...slug]`; four IDs explicitly skipped | 4 | Five records are duplicate subjects and should **merge**; six detail bodies currently render because Magazine Time Machine is among them. |
| `stack` | 1 | No consumer | 1 | `stack/astro.md` is fully unrendered; **hide** until a route is designed. |
| `stylefusionStudies` | 4 | `/workshop/stylefusion/` and noindex prototype | 0 | All render, but only on noindex StyleFusion routes; **hide** until merged/approved. |

### Gallery subdirectories

| Subdirectory | Content entries | Other source files | Render status |
| --- | ---: | ---: | --- |
| `asset-lab` | 1 | 0 | 1 detail route(s) |
| `before-and-after` | 4 | 0 | 4 detail route(s) |
| `character-dev` | 2 | 0 | 1 detail route(s); 1 draft/unrendered |
| `compilation` | 1 | 0 | 1 detail route(s) |
| `cute-corrupted` | 7 | 0 | 7 detail route(s) |
| `fashion` | 1 | 0 | 1 detail route(s) |
| `goth-anime-line-art` | 0 | 14 | No collection entries; prompt/export support files only |
| `gothic-fantasy` | 0 | 3 | No collection entries; prompt/export support files only |
| `gothic-psychedelic` | 0 | 22 | No collection entries; prompt/export support files only |
| `model-lab` | 1 | 0 | 1 detail route(s) |
| `premium-showcase` | 1 | 0 | 0 detail route(s); 1 draft/unrendered |
| `psychedelic-elephant` | 0 | 15 | No collection entries; prompt/export support files only |
| `scene` | 1 | 0 | 1 detail route(s) |
| `video-workflow` | 1 | 0 | 1 detail route(s) |

The 14 directories therefore do not equal 14 rendered records: four directories contain only StyleFusion text exports/prompts, while 10 contain Markdown entries. The Gallery has 20 entries total; 18 render detail routes, `character-dev/neon-ghoul` is a retired redirected draft, and `premium-showcase/wallpaper-pack-vol-01` is a draft with an asset TODO.

### Every content entry

| Collection | Entry | Lines | Rendered by | Disposition | Note |
| --- | --- | ---: | --- | --- | --- |
| `academy` | `src/content/academy/intellectual-self-defense/00-the-card-catalog-started-talking-back.md` | 124 | `/academy/intellectual-self-defense/the-card-catalog-started-talking-back/` | **keep** | Canonical content source. |
| `academy` | `src/content/academy/intellectual-self-defense/01-give-the-chatbot-a-research-job.md` | 130 | `/academy/intellectual-self-defense/give-the-chatbot-a-research-job/` | **keep** | Canonical content source. |
| `academy` | `src/content/academy/intellectual-self-defense/02-open-the-receipt.md` | 133 | `/academy/intellectual-self-defense/open-the-receipt/` | **keep** | Canonical content source. |
| `academy` | `src/content/academy/intellectual-self-defense/03-ask-audit-rebuild.md` | 149 | `/academy/intellectual-self-defense/ask-audit-rebuild/` | **keep** | Canonical content source. |
| `academy` | `src/content/academy/intellectual-self-defense/04-source-files-beat-vibes.md` | 137 | `/academy/intellectual-self-defense/source-files-beat-vibes/` | **keep** | Canonical content source. |
| `academy` | `src/content/academy/intellectual-self-defense/05-i-asked-for-a-picture-it-built-a-system.md` | 138 | `/academy/intellectual-self-defense/i-asked-for-a-picture-it-built-a-system/` | **keep** | Canonical content source. |
| `academy` | `src/content/academy/intellectual-self-defense/06-route-the-work.md` | 143 | `/academy/intellectual-self-defense/route-the-work/` | **keep** | Canonical content source. |
| `academy` | `src/content/academy/intellectual-self-defense/07-human-ai-and-hybrid-slop.md` | 150 | `/academy/intellectual-self-defense/human-ai-and-hybrid-slop/` | **keep** | Canonical content source. |
| `academy` | `src/content/academy/intellectual-self-defense/08-build-your-own-protocol.md` | 166 | `/academy/intellectual-self-defense/build-your-own-protocol/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/1956-automation.md` | 352 | `/articles/1956-automation/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/1973-when-airbrush-was-ai.md` | 54 | `/articles/1973-when-airbrush-was-ai/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/1985-future-tech.md` | 280 | `/articles/1985-future-tech/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/3dm/1933-the-year-warner-bros-built-a-world.md` | 330 | `/departments/hobfarm-presents/3-degrees-of-dick-miller/1933-the-year-warner-bros-built-a-world/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/3dm/broadway-babies.md` | 342 | `/departments/hobfarm-presents/3-degrees-of-dick-miller/broadway-babies/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/3dm/enter-the-millerverse.md` | 350 | `/departments/hobfarm-presents/3-degrees-of-dick-miller/enter-the-millerverse/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/3dm/the-mouse-in-the-cat-musical.md` | 227 | `/departments/hobfarm-presents/3-degrees-of-dick-miller/the-mouse-in-the-cat-musical/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/3dm/you-know-nothing-of-my-algorithm.mdx` | 283 | `/departments/hobfarm-presents/3-degrees-of-dick-miller/you-know-nothing-of-my-algorithm/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/a-false-recipe-a-real-image.md` | 293 | `/articles/a-false-recipe-a-real-image/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/a-world-of-geniuses-needs-a-system.md` | 77 | `/articles/a-world-of-geniuses-needs-a-system/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/against-slop.md` | 78 | `/articles/against-slop/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/brought-to-you-by-they-inc.md` | 804 | `/articles/brought-to-you-by-they-inc/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/building-in-public.md` | 40 | `/articles/building-in-public/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/building-in-public-solo-developer.md` | 50 | `/articles/building-in-public-solo-developer/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/california-used-to-race-here.mdx` | 628 | `/articles/california-used-to-race-here/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/color-becomes-a-cast.md` | 203 | `/articles/color-becomes-a-cast/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/coming-soon.md` | 16 | — | **hide** | Draft or future-scheduled article; no route generated. |
| `articles` | `src/content/articles/divisionism-was-painting-before-pixels.md` | 217 | `/articles/divisionism-was-painting-before-pixels/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/everything-is-still-loading.md` | 610 | `/articles/everything-is-still-loading/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/gary-and-the-fork.md` | 432 | `/articles/gary-and-the-fork/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/gonna-be-different.md` | 375 | `/articles/gonna-be-different/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/goth-get-boots.md` | 672 | `/articles/goth-get-boots/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/grimoire-knowledge-graph.md` | 40 | `/articles/grimoire-knowledge-graph/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/hello-world.md` | 41 | `/articles/hello-world/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/hey-its-that-guy.mdx` | 234 | — | **hide** | Draft or future-scheduled article; no route generated. |
| `articles` | `src/content/articles/how-hobbot-keeps-the-lights-on.md` | 46 | `/articles/how-hobbot-keeps-the-lights-on/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/how-psychedelia-went-beige.md` | 108 | `/articles/how-psychedelia-went-beige/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/how-the-money-eats-the-medium.md` | 278 | `/articles/how-the-money-eats-the-medium/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/how-to-fix-slop.md` | 198 | `/articles/how-to-fix-slop/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/i-could-be-playing-civilization.md` | 246 | `/articles/i-could-be-playing-civilization/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/i-may-have-inspired-it.md` | 251 | — | **hide** | Draft or future-scheduled article; no route generated. |
| `articles` | `src/content/articles/instagram-funnel-buckets.md` | 252 | `/articles/instagram-funnel-buckets/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/invisible-variable.md` | 278 | `/articles/invisible-variable/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/it-just-runs-programs.mdx` | 575 | — | **hide** | Draft or future-scheduled article; no route generated. |
| `articles` | `src/content/articles/mad-trump-and-the-magazine-time-machine.md` | 126 | `/articles/mad-trump-and-the-magazine-time-machine/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/other-alice-origin.md` | 191 | `/articles/other-alice-origin/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/psychedelic-goth-defined.md` | 61 | `/articles/psychedelic-goth-defined/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/put-on-the-glasses.md` | 401 | `/articles/put-on-the-glasses/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/same-model-different-surface.md` | 162 | `/articles/same-model-different-surface/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/stylefusion-ir-extraction.md` | 41 | `/articles/stylefusion-ir-extraction/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/take-me-to-phobos.md` | 545 | `/articles/take-me-to-phobos/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/the-anime-to-gothic-pipeline.md` | 46 | `/articles/the-anime-to-gothic-pipeline/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/the-card-catalog-started-talking-back.mdx` | 215 | `/articles/the-card-catalog-started-talking-back/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/the-censor-eats-its-own-tail.mdx` | 642 | `/departments/hobfarm-presents/3-degrees-of-dick-miller/the-censor-eats-its-own-tail/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/the-unlit-corner-chiaroscuro-truth-shadows.md` | 28 | `/articles/the-unlit-corner-chiaroscuro-truth-shadows/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/they-had-names-doll-family.mdx` | 342 | `/departments/hobfarm-presents/3-degrees-of-dick-miller/they-had-names-doll-family/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/too-big-for-the-box.md` | 432 | `/articles/too-big-for-the-box/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/topless-party-in-outer-space.md` | 257 | `/departments/hobfarm-presents/3-degrees-of-dick-miller/topless-party-in-outer-space/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/vacation-into-nothing.mdx` | 1454 | `/articles/vacation-into-nothing/` | **keep** | Canonical content source. |
| `articles` | `src/content/articles/you-do-not-own-the-ai-you-pay-for.md` | 153 | `/articles/you-do-not-own-the-ai-you-pay-for/` | **keep** | Canonical content source. |
| `changelog` | `src/content/changelog/gallery-launch.md` | 17 | `/changelog/gallery-launch/` | **keep** | Canonical content source. |
| `changelog` | `src/content/changelog/grimoire-knowledge-base.md` | 17 | `/changelog/grimoire-knowledge-base/` | **keep** | Canonical content source. |
| `changelog` | `src/content/changelog/march-2026-site-audit.md` | 31 | `/changelog/march-2026-site-audit/` | **keep** | Canonical content source. |
| `changelog` | `src/content/changelog/may-2026-search-consolidation.md` | 27 | `/changelog/may-2026-search-consolidation/` | **keep** | Canonical content source. |
| `changelog` | `src/content/changelog/site-launch.md` | 21 | `/changelog/site-launch/` | **keep** | Canonical content source. |
| `changelog` | `src/content/changelog/stylefusion-beta.md` | 19 | `/changelog/stylefusion-beta/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/buffcock-accident.md` | 17 | `/funnies/buffcock/buffcock-accident/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/buffcock-fishing.md` | 17 | `/funnies/buffcock/buffcock-fishing/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/buffcock-gym.md` | 17 | `/funnies/buffcock/buffcock-gym/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/buffcock-show.md` | 17 | `/funnies/buffcock/buffcock-show/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/gary-bar.md` | 17 | `/funnies/gary/gary-bar/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/gary-bowling.md` | 17 | `/funnies/gary/gary-bowling/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/gary-buffet.md` | 17 | `/funnies/gary/gary-buffet/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/gary-fat-cat-design.md` | 17 | `/funnies/gary-fat-cat/gary-fat-cat-design/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/gary-fork-standoff.md` | 17 | `/funnies/gary/gary-fork-standoff/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/gary-vegas.md` | 17 | `/funnies/gary/gary-vegas/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/gary-web-dev-ai.md` | 17 | `/funnies/gary/gary-web-dev-ai/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/larry-gothcat-hulmut-heidi-dinner.md` | 17 | `/funnies/larry/larry-gothcat-hulmut-heidi-dinner/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/larry-helmut-bauhaus.md` | 17 | `/funnies/larry/larry-helmut-bauhaus/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/larry-helmut-cabaret.md` | 17 | `/funnies/larry/larry-helmut-cabaret/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/larry-helmut-poodles.md` | 17 | `/funnies/larry/larry-helmut-poodles/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/larry-leon-berger.md` | 17 | `/funnies/larry/larry-leon-berger/` | **keep** | Canonical content source. |
| `comics` | `src/content/comics/larry-poker.md` | 17 | `/funnies/larry/larry-poker/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/asset-lab/atomic-noir-color-system.md` | 195 | `/gallery/asset-lab/atomic-noir-color-system/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/before-and-after/1926-now.md` | 220 | `/gallery/before-and-after/1926-now/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/before-and-after/north-shore-1960s-2010s.md` | 86 | `/gallery/before-and-after/north-shore-1960s-2010s/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/before-and-after/salton-city-1965-alternate-2065.md` | 88 | `/gallery/before-and-after/salton-city-1965-alternate-2065/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/before-and-after/shit-to-shine-01.md` | 83 | `/gallery/before-and-after/shit-to-shine-01/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/character-dev/neon-ghoul.md` | 88 | — | **redirect** | Retired draft; existing redirect sends its old URL to Kareena. |
| `gallery` | `src/content/gallery/character-dev/seed-to-world-v1-neon-glitch-streetwear.md` | 179 | `/gallery/character-dev/seed-to-world-v1-neon-glitch-streetwear/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/compilation/liquid-gothic.md` | 157 | `/gallery/compilation/liquid-gothic/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/cute-corrupted/cakes.md` | 288 | `/gallery/cute-corrupted/cakes/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/cute-corrupted/cat.md` | 132 | `/gallery/cute-corrupted/cat/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/cute-corrupted/corgi.md` | 133 | `/gallery/cute-corrupted/corgi/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/cute-corrupted/kareena.md` | 261 | `/gallery/cute-corrupted/kareena/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/cute-corrupted/koala.md` | 132 | `/gallery/cute-corrupted/koala/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/cute-corrupted/raccoon.md` | 161 | `/gallery/cute-corrupted/raccoon/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/cute-corrupted/sienna.md` | 236 | `/gallery/cute-corrupted/sienna/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/fashion/glamour-pin-up.md` | 92 | `/gallery/fashion/glamour-pin-up/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/model-lab/grok-vs-flux-cartoon-test.md` | 70 | `/gallery/model-lab/grok-vs-flux-cartoon-test/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/premium-showcase/wallpaper-pack-vol-01.md` | 111 | — | **hide** | Draft with a TODO asset folder; no route generated. |
| `gallery` | `src/content/gallery/scene/storm-cathedral.md` | 73 | `/gallery/scene/storm-cathedral/` | **keep** | Canonical content source. |
| `gallery` | `src/content/gallery/video-workflow/higgsfield-transition-test.md` | 82 | `/gallery/video-workflow/higgsfield-transition-test/` | **keep** | Canonical content source. |
| `grimoire` | `src/content/grimoire/color-palette-recipes.md` | 88 | `/grimoire/color-palette-recipes/` | **keep** | Canonical content source. |
| `grimoire` | `src/content/grimoire/face-geometry-identity-lock.md` | 96 | `/grimoire/face-geometry-identity-lock/` | **keep** | Canonical content source. |
| `grimoire` | `src/content/grimoire/from-generic-to-character.md` | 71 | `/grimoire/from-generic-to-character/` | **keep** | Canonical content source. |
| `grimoire` | `src/content/grimoire/stylefusion-prompt-compilation.md` | 89 | `/grimoire/stylefusion-prompt-compilation/` | **keep** | Canonical content source. |
| `grimoire` | `src/content/grimoire/understanding-visual-atoms.md` | 44 | `/grimoire/understanding-visual-atoms/` | **keep** | Canonical content source. |
| `grimoire` | `src/content/grimoire/welcome-to-the-grimoire.md` | 30 | `/grimoire/welcome-to-the-grimoire/` | **keep** | Canonical content source. |
| `help` | `src/content/help/1.md` | 10 | `/helpcenter/1/` | **keep** | Canonical content source. |
| `help` | `src/content/help/2.md` | 10 | `/helpcenter/2/` | **keep** | Canonical content source. |
| `help` | `src/content/help/3.md` | 10 | `/helpcenter/3/` | **keep** | Canonical content source. |
| `help` | `src/content/help/4.md` | 10 | `/helpcenter/4/` | **keep** | Canonical content source. |
| `help` | `src/content/help/5.md` | 10 | `/helpcenter/5/` | **keep** | Canonical content source. |
| `help` | `src/content/help/6.md` | 10 | `/helpcenter/6/` | **keep** | Canonical content source. |
| `help` | `src/content/help/characters.md` | 72 | `/helpcenter/characters/` | **keep** | Canonical content source. |
| `help` | `src/content/help/exporting-your-work.md` | 72 | `/helpcenter/exporting-your-work/` | **keep** | Canonical content source. |
| `help` | `src/content/help/generating-images.md` | 85 | `/helpcenter/generating-images/` | **keep** | Canonical content source. |
| `help` | `src/content/help/getting-started.md` | 54 | `/helpcenter/getting-started/` | **keep** | Canonical content source. |
| `help` | `src/content/help/history-and-providers.md` | 98 | `/helpcenter/history-and-providers/` | **keep** | Canonical content source. |
| `help` | `src/content/help/refining-results.md` | 83 | `/helpcenter/refining-results/` | **keep** | Canonical content source. |
| `help` | `src/content/help/styles-and-arrangements.md` | 67 | `/helpcenter/styles-and-arrangements/` | **keep** | Canonical content source. |
| `help` | `src/content/help/the-workspace.md` | 133 | `/helpcenter/the-workspace/` | **keep** | Canonical content source. |
| `help` | `src/content/help/working-with-references.md` | 74 | `/helpcenter/working-with-references/` | **keep** | Canonical content source. |
| `legal` | `src/content/legal/bug-bounty.md` | 91 | `/legal/bug-bounty/` | **keep** | Canonical content source. |
| `legal` | `src/content/legal/cookies.md` | 50 | `/legal/cookies/` | **keep** | Canonical content source. |
| `legal` | `src/content/legal/dpa.md` | 80 | `/legal/dpa/` | **keep** | Canonical content source. |
| `legal` | `src/content/legal/privacy.md` | 170 | `/legal/privacy/` | **keep** | Canonical content source. |
| `legal` | `src/content/legal/refunds.md` | 100 | `/legal/refunds/` | **keep** | Canonical content source. |
| `legal` | `src/content/legal/terms.md` | 156 | `/legal/terms/` | **keep** | Canonical content source. |
| `legal` | `src/content/legal/usage.md` | 73 | `/legal/usage/` | **keep** | Canonical content source. |
| `products` | `src/content/products/melting-rabbit-hole-dad-hat.md` | 61 | — | **hide** | Archived body is unrendered and excluded by getPublicProducts(). Archived product record; keep unindexed and out of public product lists. |
| `products` | `src/content/products/sophia-stella-sheet-pack.md` | 37 | — | **hide** | Archived body is unrendered; its data is read by the noindex Visual Lab, while a separate static handoff occupies the old Shop URL. Archived product record; keep unindexed and out of public product lists. |
| `projects` | `src/content/projects/anomalybot.md` | 37 | `/projects/anomalybot/` | **keep** | Canonical content source. |
| `projects` | `src/content/projects/courses.md` | 36 | — | **merge** | Body unrendered; metadata is consumed by search/agent output. Duplicate record; merge durable metadata into `/academy/`. |
| `projects` | `src/content/projects/drifter.md` | 90 | `/projects/drifter/` | **keep** | Canonical content source. |
| `projects` | `src/content/projects/grimoire.md` | 40 | — | **merge** | Body unrendered; metadata is consumed by search/agent output. Duplicate record; merge durable metadata into `/grimoire/`. |
| `projects` | `src/content/projects/hobbot.md` | 43 | `/projects/hobbot/` | **keep** | Canonical content source. |
| `projects` | `src/content/projects/hobfarm-tv/3-degrees-of-dick-miller.md` | 106 | — | **merge** | Body unrendered; metadata is consumed by search/agent output and the HobFarm TV hub. Duplicate record; merge durable metadata into `/departments/hobfarm-presents/3-degrees-of-dick-miller/`. |
| `projects` | `src/content/projects/hobfarm-tv/magazine-time-machine.md` | 28 | `/projects/hobfarm-tv/magazine-time-machine/` | **merge** | Duplicate record; merge durable metadata into `/departments/magazine-time-machine/`. |
| `projects` | `src/content/projects/shop.md` | 58 | — | **merge** | Body unrendered; metadata is consumed by search/agent output. Duplicate record; merge durable metadata into `/shop/`. |
| `projects` | `src/content/projects/stylefusion.md` | 56 | `/projects/stylefusion/` | **keep** | Canonical content source. |
| `projects` | `src/content/projects/xkxxkx.md` | 35 | `/projects/xkxxkx/` | **keep** | Canonical content source. |
| `stack` | `src/content/stack/astro.md` | 9 | — | **hide** | No route or component reads the stack collection. Unrendered entry; keep private until a public stack route is deliberately designed. |
| `stylefusionStudies` | `src/content/stylefusion-studies/failed-subject-extraction.md` | 77 | `/workshop/stylefusion/`<br>`/workshop/stylefusion/prototype/` | **hide** | All four records render on two noindex routes; the main Workshop page uses two directly and the prototype uses all four. Private/draft study data rendered only on noindex routes. |
| `stylefusionStudies` | `src/content/stylefusion-studies/industrial-elf-neo-noir.md` | 67 | `/workshop/stylefusion/`<br>`/workshop/stylefusion/prototype/` | **hide** | All four records render on two noindex routes; the main Workshop page uses two directly and the prototype uses all four. Private/draft study data rendered only on noindex routes. |
| `stylefusionStudies` | `src/content/stylefusion-studies/stitched-teal-horror-comic.md` | 70 | `/workshop/stylefusion/`<br>`/workshop/stylefusion/prototype/` | **hide** | All four records render on two noindex routes; the main Workshop page uses two directly and the prototype uses all four. Private/draft study data rendered only on noindex routes. |
| `stylefusionStudies` | `src/content/stylefusion-studies/tuxedo-cat-fusion.md` | 85 | `/workshop/stylefusion/`<br>`/workshop/stylefusion/prototype/` | **hide** | All four records render on two noindex routes; the main Workshop page uses two directly and the prototype uses all four. Private/draft study data rendered only on noindex routes. |

### Empty Adventures collection

`src/content/adventures/` contains zero entries. The fresh build passes but repeats Astro's empty-collection warning. Recommended disposition: **hide** the dormant collection from public assumptions until the first real adventure exists; removing the schema/route is a separate cleanup decision.

## Components with zero route imports

These 76 files have no transitive static import path from a page route or MDX entry. This is an audit result, not authorization to delete them.

| Component | Route imports | Note |
| --- | ---: | --- |
| `src/components/StyleShowcase.tsx` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/about/AboutContact.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/about/AboutHero.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/about/AboutLanes.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/about/AboutMedia.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/about/AboutOrigin.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/about/AboutPhilosophy.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/about/AboutPitch.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/about/AboutProjects.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/about/AboutRoadmap.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/assets/Shape1.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/assets/Shape2.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/assets/Shape3.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/assets/Shape4.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/assets/Shape5.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/assets/Shape6.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/features/CaseStudy.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/features/CaseStudyHero.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/features/CaseStudyMetadata.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/features/Philosophy.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/fundations/icons/ChevronLeft.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/fundations/icons/ChevronRight.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/fundations/icons/Plus.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/fundations/scripts/KeenSlider.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/gallery/TraitLockPills.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/gallery/VisualDnaModule.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/ChatInput.tsx` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/ConversationList.tsx` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/FeedbackButtons.tsx` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/GrimoireChat.tsx` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/GrimoireStats.tsx` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/MessageBubble.tsx` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/sections/GrimoireArticles.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/sections/GrimoireCTA.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/sections/GrimoireChatSection.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/sections/GrimoireEngineRoom.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/sections/GrimoireHero.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/sections/GrimoirePipeline.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/sections/GrimoireSignalsStrip.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/sections/GrimoireSystem.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/grimoire/sections/GrimoireWhyItMatters.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/helpcenter/Status.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/ApplicationsAcrossMedia.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/ArchiveStrip.tsx` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/BeforeAfterFeature.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/CuteCorruptedSection.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/DepartmentStrip.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/FieldNotesAcademy.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/FunniesStrip.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/GrimoireSection.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/GrimoireSynthesis.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/HeroOperatingMap.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/ProviderStrip.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/RecentVideos.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/TheHob.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/VisualShowcase.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/VisualSystemFeature.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/VisualSystems.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/WorkflowSection.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/infographics/MapColumn.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/infographics/MotionLoop.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/infographics/NodeCard.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/infographics/PipelineStrip.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/infographics/StoryImage.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/infographics/StoryPanel.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/home/infographics/tones.ts` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/presents/PresentsTitleCard.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/presents/PulpPressHero.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/process/ProcessPipelineCard.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/projects/ProjectCard.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/projects/ProjectHeroCard.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/projects/ProjectMinimalCard.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/ui/Badge.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/ui/Card.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/ui/Link.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |
| `src/components/workshop/CharacterMannequinStudies.astro` | 0 | Verify runtime intent, then fold useful code into its canonical page or remove in a later cleanup batch. |

### Consolidation-directory callouts

| Component | Route-template imports | Generated pages served | Audit consequence |
| --- | ---: | ---: | --- |
| `src/components/process/ProcessEditorialChain.astro` | 1 | 4 Process pages | Keep with the Process pages during promotion; reassess after the Workshop template exists. |
| `src/components/process/ProcessLoopReel.astro` | 1 | 4 Process pages | Keep with the Process pages during promotion; reassess after the Workshop template exists. |
| `src/components/process/ProcessMediaHero.astro` | 1 | 4 Process pages | Keep with the Process pages during promotion; reassess after the Workshop template exists. |
| `src/components/process/ProcessNotesPanel.astro` | 1 | 4 Process pages | Keep with the Process pages during promotion; reassess after the Workshop template exists. |
| `src/components/process/ProcessPipelineCard.astro` | 0 | 0 | Unused card; candidate for later cleanup. |
| `src/components/process/ProcessStepGrid.astro` | 1 | 4 Process pages | Keep with the Process pages during promotion; reassess after the Workshop template exists. |
| `src/components/process/VisualDnaPanel.astro` | 1 | 4 Process pages | Keep with the Process pages during promotion; reassess after the Workshop template exists. |
| `src/components/visual-systems/VisualSystemShowroom.astro` | 1 | 2 Visual Systems detail pages | Route-owned today; its useful modules should move with the recommended Workshop merges. |

## Redirect audit

`public/_redirects` contains 106 valid rules. Twenty-four already form exact two-hop chains because their target, `/departments/workshop-notes/`, is itself redirected.

| Source rule | Current target | Second hop | Disposition |
| --- | --- | --- | --- |
| `/articles/category/technical` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/articles/category/technical/` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/articles/category/research` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/articles/category/research/` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/articles/category/grimoire` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/articles/category/grimoire/` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/articles/category/stylefusion` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/articles/category/stylefusion/` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/articles/category/hobbot` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/articles/category/hobbot/` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/articles/category/business` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/articles/category/business/` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/blog/category/technical` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/blog/category/technical/` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/blog/category/research` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/blog/category/research/` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/blog/category/grimoire` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/blog/category/grimoire/` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/blog/category/stylefusion` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/blog/category/stylefusion/` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/blog/category/hobbot` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/blog/category/hobbot/` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/blog/category/business` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |
| `/blog/category/business/` | `/departments/workshop-notes/` | `/workshop/workshop-notes/` | **redirect** directly to the second hop. |

### Targets affected by recommended consolidation

| Existing source | Current target | Problem | Required one-hop target |
| --- | --- | --- | --- |
| `/projects/magazine-time-machine` | `/projects/hobfarm-tv/magazine-time-machine/` | Target is a **merge** loser. | `/departments/magazine-time-machine/` |
| `/projects/magazine-time-machine/` | `/projects/hobfarm-tv/magazine-time-machine/` | Target is a **merge** loser. | `/departments/magazine-time-machine/` |

The two dynamic `/blog/posts/:slug` rules can also chain for the four legacy 3DM slugs that already redirect from Articles into Presents. When redirects ship, add explicit one-hop Blog-to-Presents rules above the dynamic catch-all for those slugs.

The StyleFusion aliases `/stylefusion` and `/sf` already target the winning Project page and need no change. The existing Before & After, Cute & Corrupted, and Workshop Notes aliases also target their winning Workshop pages.

## Inbound source sets

- **NAV:** `src/data/navigation.ts`; `src/components/global/Navigation.astro`; `src/components/global/MobileNav.astro`; `src/components/global/Footer.astro`. Counts still report distinct generated referrer pages.

- **S001:** `src/content/articles/the-card-catalog-started-talking-back.mdx`; `src/pages/academy/avatar-content-system/course/index.astro`; `src/pages/academy/index.astro`; `src/pages/workshop/index.astro`; `src/pages/workshop/visual-lab/index.astro`; `src/pages/workshop/workshop-notes/psygoth/index.astro`.
- **S002:** `src/pages/academy/avatar-content-system/course/[lessonSlug].astro`; `src/pages/academy/avatar-content-system/free.astro`; `src/pages/academy/avatar-content-system/index.astro`.
- **S003:** `src/pages/academy/avatar-content-system/course/index.astro`; `src/pages/academy/avatar-content-system/free.astro`; `src/pages/academy/avatar-content-system/index.astro`.
- **S004:** `src/pages/academy/avatar-content-system/course/[lessonSlug].astro`; `src/pages/academy/avatar-content-system/course/index.astro`; `src/pages/academy/avatar-content-system/index.astro`.
- **S005:** `src/pages/academy/avatar-content-system/course/index.astro`; `src/pages/academy/avatar-content-system/index.astro`.
- **S006:** `src/pages/academy/avatar-content-system/course/[lessonSlug].astro`; `src/pages/academy/avatar-content-system/course/index.astro`; `src/pages/academy/avatar-content-system/free.astro`; `src/pages/academy/avatar-content-system/index.astro`.
- **S007:** `src/pages/academy/avatar-content-system/course/index.astro`; `src/pages/academy/avatar-content-system/index.astro`; `src/pages/academy/index.astro`.
- **S008:** `src/content/academy/intellectual-self-defense/00-the-card-catalog-started-talking-back.md`; `src/content/academy/intellectual-self-defense/01-give-the-chatbot-a-research-job.md`; `src/content/academy/intellectual-self-defense/02-open-the-receipt.md`; `src/content/academy/intellectual-self-defense/03-ask-audit-rebuild.md`; `src/content/academy/intellectual-self-defense/04-source-files-beat-vibes.md`; `src/content/academy/intellectual-self-defense/05-i-asked-for-a-picture-it-built-a-system.md`; `src/content/academy/intellectual-self-defense/06-route-the-work.md`; `src/content/academy/intellectual-self-defense/07-human-ai-and-hybrid-slop.md`; `src/content/academy/intellectual-self-defense/08-build-your-own-protocol.md`; `src/content/articles/the-card-catalog-started-talking-back.mdx`; `src/pages/academy/[courseSlug]/worksheets/[worksheetSlug].astro`; `src/pages/academy/index.astro`.
- **S009:** `src/content/academy/intellectual-self-defense/02-open-the-receipt.md`; `src/content/academy/intellectual-self-defense/04-source-files-beat-vibes.md`; `src/pages/academy/[courseSlug]/index.astro`.
- **S010:** `src/content/academy/intellectual-self-defense/07-human-ai-and-hybrid-slop.md`; `src/pages/academy/[courseSlug]/index.astro`.
- **S011:** `src/content/academy/intellectual-self-defense/00-the-card-catalog-started-talking-back.md`; `src/content/academy/intellectual-self-defense/02-open-the-receipt.md`; `src/pages/academy/[courseSlug]/index.astro`.
- **S012:** `src/content/academy/intellectual-self-defense/06-route-the-work.md`; `src/content/academy/intellectual-self-defense/08-build-your-own-protocol.md`; `src/pages/academy/[courseSlug]/index.astro`.
- **S013:** `src/content/academy/intellectual-self-defense/04-source-files-beat-vibes.md`; `src/content/academy/intellectual-self-defense/06-route-the-work.md`; `src/pages/academy/[courseSlug]/index.astro`.
- **S014:** `src/content/academy/intellectual-self-defense/01-give-the-chatbot-a-research-job.md`; `src/content/academy/intellectual-self-defense/03-ask-audit-rebuild.md`; `src/pages/academy/[courseSlug]/index.astro`.
- **S015:** `src/content/academy/intellectual-self-defense/05-i-asked-for-a-picture-it-built-a-system.md`; `src/content/academy/intellectual-self-defense/07-human-ai-and-hybrid-slop.md`; `src/pages/academy/[courseSlug]/index.astro`.
- **S016:** `src/content/academy/intellectual-self-defense/03-ask-audit-rebuild.md`; `src/content/academy/intellectual-self-defense/05-i-asked-for-a-picture-it-built-a-system.md`; `src/pages/academy/[courseSlug]/index.astro`.
- **S017:** `src/content/academy/intellectual-self-defense/01-give-the-chatbot-a-research-job.md`; `src/pages/academy/[courseSlug]/index.astro`; `src/pages/academy/index.astro`.
- **S018:** `src/content/academy/intellectual-self-defense/05-i-asked-for-a-picture-it-built-a-system.md`; `src/pages/academy/[courseSlug]/index.astro`.
- **S019:** `src/content/academy/intellectual-self-defense/08-build-your-own-protocol.md`; `src/pages/academy/[courseSlug]/index.astro`.
- **S020:** `src/pages/membership/success.astro`.
- **S021:** `src/content/articles/1973-when-airbrush-was-ai.md`; `src/content/articles/1985-future-tech.md`; `src/content/articles/california-used-to-race-here.mdx`; `src/content/articles/how-the-money-eats-the-medium.md`; `src/content/articles/mad-trump-and-the-magazine-time-machine.md`; `src/content/articles/take-me-to-phobos.md`; `src/content/articles/you-do-not-own-the-ai-you-pay-for.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S022:** `src/content/articles/1956-automation.md`; `src/content/articles/1985-future-tech.md`; `src/content/articles/hello-world.md`; `src/content/articles/mad-trump-and-the-magazine-time-machine.md`; `src/content/articles/the-anime-to-gothic-pipeline.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S023:** `src/content/articles/1956-automation.md`; `src/content/articles/california-used-to-race-here.mdx`; `src/content/articles/how-the-money-eats-the-medium.md`; `src/content/articles/mad-trump-and-the-magazine-time-machine.md`; `src/content/articles/take-me-to-phobos.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S024:** `src/content/articles/against-slop.md`; `src/content/articles/divisionism-was-painting-before-pixels.md`; `src/content/articles/gary-and-the-fork.md`; `src/content/articles/grimoire-knowledge-graph.md`; `src/content/articles/invisible-variable.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/grimoire/index.astro`; `src/pages/workshop/[program].astro`; `src/pages/workshop/index.astro`.
- **S025:** `src/content/articles/against-slop.md`; `src/content/articles/divisionism-was-painting-before-pixels.md`; `src/content/articles/gary-and-the-fork.md`; `src/content/articles/goth-get-boots.md`; `src/content/articles/how-to-fix-slop.md`; `src/content/articles/i-could-be-playing-civilization.md`; `src/content/articles/the-card-catalog-started-talking-back.mdx`; `src/content/articles/the-censor-eats-its-own-tail.mdx`; `src/content/articles/too-big-for-the-box.md`; `src/content/articles/you-do-not-own-the-ai-you-pay-for.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S026:** `src/content/articles/a-false-recipe-a-real-image.md`; `src/content/articles/how-psychedelia-went-beige.md`; `src/content/articles/instagram-funnel-buckets.md`; `src/content/articles/other-alice-origin.md`; `src/content/articles/psychedelic-goth-defined.md`; `src/content/articles/too-big-for-the-box.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S027:** `src/content/articles/california-used-to-race-here.mdx`; `src/content/articles/put-on-the-glasses.md`; `src/content/articles/the-card-catalog-started-talking-back.mdx`; `src/content/articles/vacation-into-nothing.mdx`; `src/pages/articles/index.astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S028:** `src/content/articles/hello-world.md`; `src/content/articles/the-anime-to-gothic-pipeline.md`; `src/content/articles/the-unlit-corner-chiaroscuro-truth-shadows.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S029:** `src/content/articles/gary-and-the-fork.md`; `src/content/articles/goth-get-boots.md`; `src/content/articles/hello-world.md`; `src/content/articles/stylefusion-ir-extraction.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S030:** `src/content/articles/1973-when-airbrush-was-ai.md`; `src/content/articles/brought-to-you-by-they-inc.md`; `src/content/articles/how-the-money-eats-the-medium.md`; `src/content/articles/i-could-be-playing-civilization.md`; `src/pages/articles/index.astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/departments/hobfarm-presents/index.astro`.
- **S031:** `src/content/articles/building-in-public-solo-developer.md`; `src/content/articles/building-in-public.md`; `src/content/articles/hello-world.md`; `src/content/articles/how-hobbot-keeps-the-lights-on.md`; `src/content/articles/how-the-money-eats-the-medium.md`; `src/content/articles/how-to-fix-slop.md`; `src/content/articles/instagram-funnel-buckets.md`; `src/content/articles/invisible-variable.md`; `src/content/articles/psychedelic-goth-defined.md`; `src/content/articles/same-model-different-surface.md`; `src/content/articles/stylefusion-ir-extraction.md`; `src/content/articles/the-anime-to-gothic-pipeline.md`; `src/content/articles/the-unlit-corner-chiaroscuro-truth-shadows.md`; `src/pages/academy/avatar-content-system/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/workshop/[program].astro`; `src/pages/workshop/index.astro`.
- **S032:** `src/content/articles/a-false-recipe-a-real-image.md`; `src/content/articles/a-world-of-geniuses-needs-a-system.md`; `src/content/articles/how-to-fix-slop.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S033:** `src/content/articles/i-could-be-playing-civilization.md`; `src/content/articles/take-me-to-phobos.md`; `src/content/articles/too-big-for-the-box.md`; `src/content/articles/vacation-into-nothing.mdx`; `src/pages/articles/index.astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S034:** `src/content/articles/a-false-recipe-a-real-image.md`; `src/content/articles/a-world-of-geniuses-needs-a-system.md`; `src/content/articles/building-in-public-solo-developer.md`; `src/content/articles/building-in-public.md`; `src/content/articles/goth-get-boots.md`; `src/content/articles/grimoire-knowledge-graph.md`; `src/content/articles/hello-world.md`; `src/content/articles/how-hobbot-keeps-the-lights-on.md`; `src/content/articles/how-to-fix-slop.md`; `src/content/articles/i-could-be-playing-civilization.md`; `src/content/articles/psychedelic-goth-defined.md`; `src/content/articles/stylefusion-ir-extraction.md`; `src/content/articles/the-anime-to-gothic-pipeline.md`; `src/content/articles/the-unlit-corner-chiaroscuro-truth-shadows.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/workshop/[program].astro`; `src/pages/workshop/index.astro`.
- **S035:** `src/content/articles/everything-is-still-loading.md`; `src/content/articles/other-alice-origin.md`; `src/content/articles/take-me-to-phobos.md`; `src/content/articles/too-big-for-the-box.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S036:** `src/content/articles/building-in-public.md`; `src/content/articles/gary-and-the-fork.md`; `src/content/articles/grimoire-knowledge-graph.md`; `src/content/articles/how-hobbot-keeps-the-lights-on.md`; `src/content/articles/how-to-fix-slop.md`; `src/content/articles/psychedelic-goth-defined.md`; `src/content/articles/stylefusion-ir-extraction.md`; `src/content/articles/you-do-not-own-the-ai-you-pay-for.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/workshop/[program].astro`; `src/pages/workshop/index.astro`.
- **S037:** `src/content/articles/a-false-recipe-a-real-image.md`; `src/content/articles/gonna-be-different.md`; `src/content/articles/goth-get-boots.md`; `src/content/articles/stylefusion-ir-extraction.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S038:** `src/content/articles/1973-when-airbrush-was-ai.md`; `src/content/articles/building-in-public-solo-developer.md`; `src/content/articles/building-in-public.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S039:** `src/content/articles/invisible-variable.md`; `src/content/articles/the-unlit-corner-chiaroscuro-truth-shadows.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S040:** `src/content/articles/color-becomes-a-cast.md`; `src/content/articles/psychedelic-goth-defined.md`; `src/content/articles/same-model-different-surface.md`; `src/content/articles/too-big-for-the-box.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S041:** `src/content/articles/1973-when-airbrush-was-ai.md`; `src/content/articles/3dm/you-know-nothing-of-my-algorithm.mdx`; `src/content/articles/california-used-to-race-here.mdx`; `src/content/articles/color-becomes-a-cast.md`; `src/content/articles/everything-is-still-loading.md`; `src/content/articles/other-alice-origin.md`; `src/content/articles/take-me-to-phobos.md`; `src/content/articles/the-censor-eats-its-own-tail.mdx`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S042:** `src/content/articles/a-world-of-geniuses-needs-a-system.md`; `src/content/articles/against-slop.md`; `src/content/articles/divisionism-was-painting-before-pixels.md`; `src/content/articles/instagram-funnel-buckets.md`; `src/content/articles/too-big-for-the-box.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/workshop/[program].astro`; `src/pages/workshop/index.astro`.
- **S043:** `src/content/articles/a-world-of-geniuses-needs-a-system.md`; `src/content/articles/against-slop.md`; `src/content/articles/california-used-to-race-here.mdx`; `src/content/articles/divisionism-was-painting-before-pixels.md`; `src/content/articles/how-psychedelia-went-beige.md`; `src/content/articles/too-big-for-the-box.md`; `src/content/articles/you-do-not-own-the-ai-you-pay-for.md`; `src/pages/articles/index.astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/index.astro`.
- **S044:** `src/content/articles/3dm/you-know-nothing-of-my-algorithm.mdx`; `src/content/articles/color-becomes-a-cast.md`; `src/content/articles/how-psychedelia-went-beige.md`; `src/content/articles/mad-trump-and-the-magazine-time-machine.md`; `src/content/articles/vacation-into-nothing.mdx`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/workshop/[program].astro`.
- **S045:** `src/content/articles/a-false-recipe-a-real-image.md`; `src/content/articles/grimoire-knowledge-graph.md`; `src/content/articles/how-hobbot-keeps-the-lights-on.md`; `src/content/articles/same-model-different-surface.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/workshop/index.astro`.
- **S046:** `src/content/articles/1973-when-airbrush-was-ai.md`; `src/content/articles/1985-future-tech.md`; `src/content/articles/california-used-to-race-here.mdx`; `src/content/articles/how-the-money-eats-the-medium.md`; `src/content/articles/instagram-funnel-buckets.md`; `src/content/articles/the-censor-eats-its-own-tail.mdx`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S047:** `src/content/articles/a-false-recipe-a-real-image.md`; `src/content/articles/building-in-public-solo-developer.md`; `src/content/articles/gary-and-the-fork.md`; `src/content/articles/gonna-be-different.md`; `src/content/articles/hello-world.md`; `src/content/articles/how-hobbot-keeps-the-lights-on.md`; `src/content/articles/how-the-money-eats-the-medium.md`; `src/content/articles/how-to-fix-slop.md`; `src/content/articles/psychedelic-goth-defined.md`; `src/content/articles/same-model-different-surface.md`; `src/content/articles/the-anime-to-gothic-pipeline.md`; `src/content/articles/the-unlit-corner-chiaroscuro-truth-shadows.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/departments/hobfarm-presents/[series]/index.astro`; `src/pages/workshop/[program].astro`; `src/pages/workshop/index.astro`.
- **S048:** `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`.
- **S049:** `src/content/articles/against-slop.md`; `src/content/articles/color-becomes-a-cast.md`; `src/content/articles/how-psychedelia-went-beige.md`; `src/content/articles/instagram-funnel-buckets.md`; `src/content/articles/other-alice-origin.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/workshop/index.astro`.
- **S050:** `src/content/articles/against-slop.md`; `src/content/articles/divisionism-was-painting-before-pixels.md`; `src/content/articles/how-psychedelia-went-beige.md`; `src/content/articles/too-big-for-the-box.md`; `src/content/articles/vacation-into-nothing.mdx`; `src/content/articles/you-do-not-own-the-ai-you-pay-for.md`; `src/pages/articles/index.astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/index.astro`.
- **S051:** `src/content/articles/color-becomes-a-cast.md`; `src/content/articles/how-psychedelia-went-beige.md`; `src/content/articles/invisible-variable.md`; `src/content/articles/stylefusion-ir-extraction.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/workshop/index.astro`.
- **S052:** `src/content/articles/building-in-public.md`; `src/content/articles/color-becomes-a-cast.md`; `src/content/articles/gonna-be-different.md`; `src/content/articles/goth-get-boots.md`; `src/content/articles/grimoire-knowledge-graph.md`; `src/content/articles/invisible-variable.md`; `src/content/articles/other-alice-origin.md`; `src/content/articles/same-model-different-surface.md`; `src/content/projects/stylefusion.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/workshop/[program].astro`; `src/pages/workshop/stylefusion/prototype.astro`.
- **S053:** `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S054:** `src/content/articles/1973-when-airbrush-was-ai.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S055:** `src/content/articles/put-on-the-glasses.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S056:** `src/content/articles/the-card-catalog-started-talking-back.mdx`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S057:** `src/content/articles/everything-is-still-loading.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S058:** `src/content/articles/how-psychedelia-went-beige.md`; `src/content/articles/psychedelic-goth-defined.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S059:** `src/content/articles/a-world-of-geniuses-needs-a-system.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S060:** `src/content/articles/i-could-be-playing-civilization.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S061:** `src/content/articles/how-to-fix-slop.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S062:** `src/content/articles/against-slop.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S063:** `src/content/articles/you-do-not-own-the-ai-you-pay-for.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S064:** `src/content/articles/how-psychedelia-went-beige.md`; `src/content/articles/how-to-fix-slop.md`; `src/content/articles/instagram-funnel-buckets.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S065:** `src/content/articles/color-becomes-a-cast.md`; `src/content/articles/invisible-variable.md`; `src/content/articles/same-model-different-surface.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S066:** `src/content/articles/gonna-be-different.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S067:** `src/content/articles/too-big-for-the-box.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S068:** `src/content/articles/instagram-funnel-buckets.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S069:** `src/content/articles/other-alice-origin.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S070:** `src/content/articles/the-anime-to-gothic-pipeline.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S071:** `src/content/articles/take-me-to-phobos.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S072:** `src/content/articles/hello-world.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S073:** `src/content/articles/divisionism-was-painting-before-pixels.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S074:** `src/content/articles/the-anime-to-gothic-pipeline.md`; `src/content/articles/the-unlit-corner-chiaroscuro-truth-shadows.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S075:** `src/content/articles/brought-to-you-by-they-inc.md`; `src/content/articles/the-card-catalog-started-talking-back.mdx`; `src/content/articles/vacation-into-nothing.mdx`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S076:** `src/content/articles/vacation-into-nothing.mdx`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S077:** `src/content/articles/brought-to-you-by-they-inc.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S078:** `src/content/articles/california-used-to-race-here.mdx`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S079:** `src/content/articles/1956-automation.md`; `src/content/articles/how-hobbot-keeps-the-lights-on.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S080:** `src/content/articles/everything-is-still-loading.md`; `src/content/articles/take-me-to-phobos.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S081:** `src/content/articles/building-in-public-solo-developer.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S082:** `src/content/articles/mad-trump-and-the-magazine-time-machine.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S083:** `src/content/articles/gary-and-the-fork.md`; `src/content/articles/goth-get-boots.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S084:** `src/content/articles/color-becomes-a-cast.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S085:** `src/content/articles/same-model-different-surface.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S086:** `src/content/articles/everything-is-still-loading.md`; `src/content/articles/i-could-be-playing-civilization.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S087:** `src/content/articles/building-in-public-solo-developer.md`; `src/content/articles/hello-world.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S088:** `src/content/articles/a-false-recipe-a-real-image.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S089:** `src/content/articles/the-unlit-corner-chiaroscuro-truth-shadows.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S090:** `src/content/articles/a-false-recipe-a-real-image.md`; `src/content/articles/a-world-of-geniuses-needs-a-system.md`; `src/content/articles/i-could-be-playing-civilization.md`; `src/content/articles/the-card-catalog-started-talking-back.mdx`; `src/content/articles/too-big-for-the-box.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S091:** `src/content/articles/psychedelic-goth-defined.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S092:** `src/content/articles/goth-get-boots.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S093:** `src/content/articles/how-psychedelia-went-beige.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S094:** `src/content/articles/1985-future-tech.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S095:** `src/content/articles/gary-and-the-fork.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S096:** `src/content/articles/a-false-recipe-a-real-image.md`; `src/content/articles/a-world-of-geniuses-needs-a-system.md`; `src/content/articles/divisionism-was-painting-before-pixels.md`; `src/content/articles/grimoire-knowledge-graph.md`; `src/content/articles/i-could-be-playing-civilization.md`; `src/content/articles/invisible-variable.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S097:** `src/content/articles/how-hobbot-keeps-the-lights-on.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S098:** `src/content/articles/building-in-public.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S099:** `src/content/articles/1956-automation.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S100:** `src/content/articles/divisionism-was-painting-before-pixels.md`; `src/content/articles/gary-and-the-fork.md`; `src/content/articles/goth-get-boots.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S101:** `src/content/articles/stylefusion-ir-extraction.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S102:** `src/content/articles/how-the-money-eats-the-medium.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S103:** `src/content/articles/gonna-be-different.md`; `src/content/articles/take-me-to-phobos.md`; `src/content/articles/too-big-for-the-box.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S104:** `src/content/articles/grimoire-knowledge-graph.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S105:** `src/content/articles/1956-automation.md`; `src/content/articles/1985-future-tech.md`; `src/content/articles/how-the-money-eats-the-medium.md`; `src/content/articles/mad-trump-and-the-magazine-time-machine.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S106:** `src/content/articles/1956-automation.md`; `src/content/articles/1985-future-tech.md`; `src/content/articles/mad-trump-and-the-magazine-time-machine.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S107:** `src/content/articles/gonna-be-different.md`; `src/content/articles/other-alice-origin.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S108:** `src/content/articles/i-could-be-playing-civilization.md`; `src/content/articles/too-big-for-the-box.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S109:** `src/content/articles/a-false-recipe-a-real-image.md`; `src/content/articles/a-world-of-geniuses-needs-a-system.md`; `src/content/articles/divisionism-was-painting-before-pixels.md`; `src/content/articles/gary-and-the-fork.md`; `src/content/articles/other-alice-origin.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S110:** `src/content/articles/against-slop.md`; `src/content/articles/psychedelic-goth-defined.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S111:** `src/content/articles/invisible-variable.md`; `src/content/articles/same-model-different-surface.md`; `src/content/articles/the-card-catalog-started-talking-back.mdx`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S112:** `src/content/articles/1956-automation.md`; `src/content/articles/1985-future-tech.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S113:** `src/content/articles/a-world-of-geniuses-needs-a-system.md`; `src/content/articles/against-slop.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S114:** `src/content/articles/instagram-funnel-buckets.md`; `src/content/articles/vacation-into-nothing.mdx`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S115:** `src/content/articles/against-slop.md`; `src/content/articles/how-to-fix-slop.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S116:** `src/content/articles/building-in-public.md`; `src/content/articles/color-becomes-a-cast.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`.
- **S117:** `src/content/articles/everything-is-still-loading.md`; `src/content/articles/gonna-be-different.md`; `src/content/articles/too-big-for-the-box.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S118:** `src/content/articles/1973-when-airbrush-was-ai.md`; `src/content/articles/building-in-public-solo-developer.md`; `src/content/articles/the-unlit-corner-chiaroscuro-truth-shadows.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S119:** `src/content/academy/intellectual-self-defense/00-the-card-catalog-started-talking-back.md`; `src/content/academy/intellectual-self-defense/01-give-the-chatbot-a-research-job.md`; `src/content/academy/intellectual-self-defense/02-open-the-receipt.md`; `src/content/academy/intellectual-self-defense/03-ask-audit-rebuild.md`; `src/content/academy/intellectual-self-defense/04-source-files-beat-vibes.md`; `src/content/academy/intellectual-self-defense/05-i-asked-for-a-picture-it-built-a-system.md`; `src/content/academy/intellectual-self-defense/06-route-the-work.md`; `src/content/academy/intellectual-self-defense/07-human-ai-and-hybrid-slop.md`; `src/content/academy/intellectual-self-defense/08-build-your-own-protocol.md`; `src/content/articles/a-world-of-geniuses-needs-a-system.md`; `src/content/articles/brought-to-you-by-they-inc.md`; `src/content/articles/put-on-the-glasses.md`; `src/content/articles/vacation-into-nothing.mdx`; `src/pages/academy/[courseSlug]/index.astro`; `src/pages/articles/index.astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S120:** `src/content/articles/building-in-public-solo-developer.md`; `src/content/articles/how-hobbot-keeps-the-lights-on.md`; `src/content/articles/the-anime-to-gothic-pipeline.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S121:** `src/content/articles/a-world-of-geniuses-needs-a-system.md`; `src/content/articles/against-slop.md`; `src/content/articles/divisionism-was-painting-before-pixels.md`; `src/content/articles/how-psychedelia-went-beige.md`; `src/content/articles/i-could-be-playing-civilization.md`; `src/content/articles/put-on-the-glasses.md`; `src/content/articles/you-do-not-own-the-ai-you-pay-for.md`; `src/pages/articles/index.astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`; `src/pages/index.astro`.
- **S122:** `src/content/academy/intellectual-self-defense/07-human-ai-and-hybrid-slop.md`; `src/content/articles/brought-to-you-by-they-inc.md`; `src/content/articles/everything-is-still-loading.md`; `src/content/articles/the-card-catalog-started-talking-back.mdx`; `src/content/articles/the-censor-eats-its-own-tail.mdx`; `src/pages/articles/index.astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S123:** `src/content/articles/1956-automation.md`; `src/content/articles/brought-to-you-by-they-inc.md`; `src/content/articles/goth-get-boots.md`; `src/content/articles/i-could-be-playing-civilization.md`; `src/content/articles/the-censor-eats-its-own-tail.mdx`; `src/content/articles/too-big-for-the-box.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/[slug].astro`.
- **S124:** `src/pages/changelog/index.astro`.
- **S125:** `src/pages/characters/[character].astro`; `src/pages/departments/funnies.astro`; `src/pages/index.astro`.
- **S126:** `src/content/articles/other-alice-origin.md`; `src/pages/characters/index.astro`; `src/pages/departments/hobfarm-presents/[series]/index.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/cast/index.astro`.
- **S127:** `src/content/comics/buffcock-accident.md`; `src/content/comics/buffcock-fishing.md`; `src/content/comics/buffcock-gym.md`; `src/content/comics/buffcock-show.md`; `src/pages/characters/index.astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`.
- **S128:** `src/pages/characters/index.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/cast/index.astro`.
- **S129:** `src/pages/characters/index.astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`.
- **S130:** `src/content/comics/gary-fat-cat-design.md`; `src/pages/characters/index.astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`.
- **S131:** `src/content/comics/gary-bar.md`; `src/content/comics/gary-bowling.md`; `src/content/comics/gary-buffet.md`; `src/content/comics/gary-fat-cat-design.md`; `src/content/comics/gary-fork-standoff.md`; `src/content/comics/gary-vegas.md`; `src/content/comics/gary-web-dev-ai.md`; `src/pages/characters/index.astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`.
- **S132:** `src/content/comics/larry-gothcat-hulmut-heidi-dinner.md`; `src/content/comics/larry-helmut-cabaret.md`; `src/pages/characters/index.astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`.
- **S133:** `src/content/comics/larry-gothcat-hulmut-heidi-dinner.md`; `src/pages/characters/index.astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`.
- **S134:** `src/content/comics/larry-gothcat-hulmut-heidi-dinner.md`; `src/content/comics/larry-helmut-bauhaus.md`; `src/content/comics/larry-helmut-cabaret.md`; `src/content/comics/larry-helmut-poodles.md`; `src/pages/characters/index.astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`.
- **S135:** `src/pages/characters/index.astro`.
- **S136:** `src/pages/characters/index.astro`; `src/pages/funnies/[series]/index.astro`.
- **S137:** `src/content/comics/larry-gothcat-hulmut-heidi-dinner.md`; `src/content/comics/larry-helmut-bauhaus.md`; `src/content/comics/larry-helmut-cabaret.md`; `src/content/comics/larry-helmut-poodles.md`; `src/content/comics/larry-leon-berger.md`; `src/content/comics/larry-poker.md`; `src/pages/characters/index.astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`.
- **S138:** `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/characters/index.astro`; `src/pages/visual-systems/[slug].astro`.
- **S139:** `src/content/articles/a-world-of-geniuses-needs-a-system.md`; `src/content/articles/against-slop.md`; `src/content/articles/brought-to-you-by-they-inc.md`; `src/content/articles/divisionism-was-painting-before-pixels.md`; `src/content/articles/everything-is-still-loading.md`; `src/content/articles/gonna-be-different.md`; `src/content/articles/how-psychedelia-went-beige.md`; `src/content/articles/i-could-be-playing-civilization.md`; `src/content/articles/instagram-funnel-buckets.md`; `src/content/articles/put-on-the-glasses.md`; `src/content/articles/take-me-to-phobos.md`; `src/content/articles/the-card-catalog-started-talking-back.mdx`; `src/content/articles/too-big-for-the-box.md`; `src/content/articles/vacation-into-nothing.mdx`; `src/content/articles/you-do-not-own-the-ai-you-pay-for.md`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/departments/index.astro`.
- **S140:** `src/content/articles/3dm/broadway-babies.md`; `src/content/articles/3dm/enter-the-millerverse.md`; `src/content/articles/3dm/the-mouse-in-the-cat-musical.md`; `src/content/articles/3dm/you-know-nothing-of-my-algorithm.mdx`; `src/content/articles/other-alice-origin.md`; `src/content/articles/the-censor-eats-its-own-tail.mdx`; `src/content/articles/they-had-names-doll-family.mdx`; `src/content/articles/topless-party-in-outer-space.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/index.astro`.
- **S141:** `src/content/articles/3dm/1933-the-year-warner-bros-built-a-world.md`; `src/content/articles/3dm/enter-the-millerverse.md`; `src/content/articles/3dm/the-mouse-in-the-cat-musical.md`; `src/content/articles/3dm/you-know-nothing-of-my-algorithm.mdx`; `src/content/articles/the-censor-eats-its-own-tail.mdx`; `src/content/articles/they-had-names-doll-family.mdx`; `src/content/articles/topless-party-in-outer-space.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/index.astro`.
- **S142:** `src/content/articles/3dm/1933-the-year-warner-bros-built-a-world.md`; `src/content/articles/3dm/broadway-babies.md`; `src/content/articles/gonna-be-different.md`; `src/content/articles/the-censor-eats-its-own-tail.mdx`; `src/content/articles/they-had-names-doll-family.mdx`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/index.astro`.
- **S143:** `src/content/articles/3dm/1933-the-year-warner-bros-built-a-world.md`; `src/content/articles/3dm/broadway-babies.md`; `src/content/articles/3dm/enter-the-millerverse.md`; `src/content/articles/3dm/the-mouse-in-the-cat-musical.md`; `src/content/articles/3dm/you-know-nothing-of-my-algorithm.mdx`; `src/content/articles/brought-to-you-by-they-inc.md`; `src/content/articles/they-had-names-doll-family.mdx`; `src/content/articles/topless-party-in-outer-space.md`; `src/pages/articles/index.astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/index.astro`.
- **S144:** `src/content/articles/3dm/1933-the-year-warner-bros-built-a-world.md`; `src/content/articles/3dm/broadway-babies.md`; `src/content/articles/3dm/enter-the-millerverse.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/index.astro`.
- **S145:** `src/content/articles/3dm/1933-the-year-warner-bros-built-a-world.md`; `src/content/articles/3dm/broadway-babies.md`; `src/content/articles/3dm/enter-the-millerverse.md`; `src/content/articles/3dm/the-mouse-in-the-cat-musical.md`; `src/content/articles/3dm/you-know-nothing-of-my-algorithm.mdx`; `src/content/articles/the-censor-eats-its-own-tail.mdx`; `src/content/articles/topless-party-in-outer-space.md`; `src/pages/articles/index.astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/index.astro`; `src/pages/departments/hobfarm-presents/index.astro`; `src/pages/index.astro`.
- **S146:** `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/index.astro`.
- **S147:** `src/content/articles/3dm/1933-the-year-warner-bros-built-a-world.md`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/index.astro`.
- **S148:** `src/pages/departments/hobfarm-presents/[series]/index.astro`; `src/pages/departments/hobfarm-presents/[series]/world-guide.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/houses/index.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/web-of-wonderland/index.astro`.
- **S149:** `src/pages/characters/[character].astro`; `src/pages/departments/hobfarm-presents/[series]/index.astro`; `src/pages/departments/hobfarm-presents/[series]/world-guide.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/cast/index.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/web-of-wonderland/index.astro`.
- **S150:** `src/pages/departments/hobfarm-presents/[series]/index.astro`; `src/pages/departments/hobfarm-presents/[series]/world-guide.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/cast/index.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/houses/index.astro`.
- **S151:** `src/pages/characters/[character].astro`; `src/pages/departments/hobfarm-presents/[series]/index.astro`; `src/pages/departments/hobfarm-presents/index.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/cast/index.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/houses/index.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/web-of-wonderland/index.astro`; `src/pages/index.astro`; `src/pages/workshop/index.astro`.
- **S152:** `src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/index.astro`; `src/pages/departments/hobfarm-presents/[series]/index.astro`.
- **S153:** `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/workshop/index.astro`.
- **S154:** `src/content/comics/buffcock-accident.md`; `src/content/comics/buffcock-fishing.md`; `src/content/comics/buffcock-gym.md`; `src/content/comics/buffcock-show.md`; `src/pages/characters/[character].astro`; `src/pages/departments/funnies.astro`.
- **S155:** `src/content/comics/buffcock-fishing.md`; `src/pages/characters/[character].astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S156:** `src/content/comics/buffcock-accident.md`; `src/content/comics/buffcock-gym.md`; `src/pages/characters/[character].astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S157:** `src/content/comics/buffcock-fishing.md`; `src/content/comics/buffcock-show.md`; `src/pages/characters/[character].astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S158:** `src/content/comics/buffcock-gym.md`; `src/pages/characters/[character].astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S159:** `src/pages/characters/[character].astro`.
- **S160:** `src/content/comics/gary-fat-cat-design.md`; `src/pages/characters/[character].astro`.
- **S161:** `src/pages/characters/[character].astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S162:** `src/content/comics/gary-bar.md`; `src/content/comics/gary-bowling.md`; `src/content/comics/gary-buffet.md`; `src/content/comics/gary-fork-standoff.md`; `src/content/comics/gary-vegas.md`; `src/content/comics/gary-web-dev-ai.md`; `src/pages/characters/[character].astro`; `src/pages/departments/funnies.astro`.
- **S163:** `src/content/comics/gary-bowling.md`; `src/pages/characters/[character].astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S164:** `src/content/comics/gary-bar.md`; `src/content/comics/gary-buffet.md`; `src/pages/characters/[character].astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S165:** `src/content/comics/gary-bowling.md`; `src/content/comics/gary-vegas.md`; `src/pages/characters/[character].astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S166:** `src/content/comics/gary-web-dev-ai.md`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S167:** `src/content/comics/gary-buffet.md`; `src/content/comics/gary-web-dev-ai.md`; `src/pages/characters/[character].astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S168:** `src/content/comics/gary-fork-standoff.md`; `src/content/comics/gary-vegas.md`; `src/pages/characters/[character].astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S169:** `src/content/comics/larry-gothcat-hulmut-heidi-dinner.md`; `src/content/comics/larry-helmut-bauhaus.md`; `src/content/comics/larry-helmut-cabaret.md`; `src/content/comics/larry-helmut-poodles.md`; `src/content/comics/larry-leon-berger.md`; `src/content/comics/larry-poker.md`; `src/pages/characters/[character].astro`; `src/pages/departments/funnies.astro`.
- **S170:** `src/content/comics/larry-helmut-bauhaus.md`; `src/pages/characters/[character].astro`; `src/pages/departments/funnies.astro`; `src/pages/departments/hobfarm-presents/index.astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S171:** `src/content/comics/larry-gothcat-hulmut-heidi-dinner.md`; `src/content/comics/larry-helmut-cabaret.md`; `src/pages/characters/[character].astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S172:** `src/content/comics/larry-helmut-bauhaus.md`; `src/content/comics/larry-helmut-poodles.md`; `src/pages/characters/[character].astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S173:** `src/content/comics/larry-helmut-cabaret.md`; `src/content/comics/larry-leon-berger.md`; `src/pages/characters/[character].astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S174:** `src/content/comics/larry-helmut-poodles.md`; `src/content/comics/larry-poker.md`; `src/pages/characters/[character].astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S175:** `src/content/comics/larry-leon-berger.md`; `src/pages/characters/[character].astro`; `src/pages/departments/funnies.astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`.
- **S176:** `src/content/comics/gary-web-dev-ai.md`; `src/pages/funnies/tags/[tag].astro`.
- **S177:** `src/content/comics/larry-helmut-bauhaus.md`; `src/pages/funnies/tags/[tag].astro`.
- **S178:** `src/content/comics/gary-bowling.md`; `src/pages/funnies/tags/[tag].astro`.
- **S179:** `src/content/comics/buffcock-accident.md`; `src/content/comics/buffcock-fishing.md`; `src/content/comics/buffcock-gym.md`; `src/content/comics/buffcock-show.md`; `src/pages/funnies/tags/[tag].astro`.
- **S180:** `src/content/comics/gary-buffet.md`; `src/pages/funnies/tags/[tag].astro`.
- **S181:** `src/content/comics/larry-helmut-cabaret.md`; `src/pages/funnies/tags/[tag].astro`.
- **S182:** `src/content/comics/gary-fat-cat-design.md`; `src/pages/funnies/tags/[tag].astro`.
- **S183:** `src/content/comics/larry-gothcat-hulmut-heidi-dinner.md`; `src/pages/funnies/tags/[tag].astro`.
- **S184:** `src/content/comics/buffcock-fishing.md`; `src/pages/funnies/tags/[tag].astro`.
- **S185:** `src/content/comics/gary-bar.md`; `src/content/comics/gary-bowling.md`; `src/content/comics/gary-buffet.md`; `src/content/comics/gary-fat-cat-design.md`; `src/content/comics/gary-fork-standoff.md`; `src/content/comics/gary-vegas.md`; `src/content/comics/gary-web-dev-ai.md`; `src/pages/funnies/tags/[tag].astro`.
- **S186:** `src/content/comics/larry-gothcat-hulmut-heidi-dinner.md`; `src/content/comics/larry-helmut-cabaret.md`; `src/pages/funnies/tags/[tag].astro`.
- **S187:** `src/content/comics/gary-bar.md`; `src/content/comics/gary-bowling.md`; `src/content/comics/gary-buffet.md`; `src/content/comics/gary-fork-standoff.md`; `src/content/comics/gary-vegas.md`; `src/content/comics/gary-web-dev-ai.md`; `src/pages/funnies/tags/[tag].astro`.
- **S188:** `src/content/comics/buffcock-gym.md`; `src/pages/funnies/tags/[tag].astro`.
- **S189:** `src/content/comics/larry-gothcat-hulmut-heidi-dinner.md`; `src/content/comics/larry-helmut-bauhaus.md`; `src/content/comics/larry-helmut-cabaret.md`; `src/content/comics/larry-helmut-poodles.md`; `src/pages/funnies/tags/[tag].astro`.
- **S190:** `src/content/comics/larry-gothcat-hulmut-heidi-dinner.md`; `src/content/comics/larry-helmut-bauhaus.md`; `src/content/comics/larry-helmut-cabaret.md`; `src/content/comics/larry-helmut-poodles.md`; `src/content/comics/larry-leon-berger.md`; `src/content/comics/larry-poker.md`; `src/pages/funnies/tags/[tag].astro`.
- **S191:** `src/content/comics/larry-leon-berger.md`; `src/pages/funnies/tags/[tag].astro`.
- **S192:** `src/content/comics/buffcock-show.md`; `src/pages/funnies/tags/[tag].astro`.
- **S193:** `src/content/comics/larry-poker.md`; `src/pages/funnies/tags/[tag].astro`.
- **S194:** `src/content/comics/larry-helmut-poodles.md`; `src/pages/funnies/tags/[tag].astro`.
- **S195:** `src/content/comics/buffcock-accident.md`; `src/content/comics/buffcock-fishing.md`; `src/content/comics/buffcock-gym.md`; `src/content/comics/buffcock-show.md`; `src/content/comics/gary-bar.md`; `src/content/comics/gary-bowling.md`; `src/content/comics/gary-buffet.md`; `src/content/comics/gary-fat-cat-design.md`; `src/content/comics/gary-fork-standoff.md`; `src/content/comics/gary-vegas.md`; `src/content/comics/gary-web-dev-ai.md`; `src/content/comics/larry-gothcat-hulmut-heidi-dinner.md`; `src/content/comics/larry-helmut-bauhaus.md`; `src/content/comics/larry-helmut-cabaret.md`; `src/content/comics/larry-helmut-poodles.md`; `src/content/comics/larry-leon-berger.md`; `src/content/comics/larry-poker.md`; `src/pages/funnies/tags/[tag].astro`.
- **S196:** `src/content/comics/gary-vegas.md`; `src/pages/funnies/tags/[tag].astro`.
- **S197:** `src/content/articles/against-slop.md`; `src/content/articles/goth-get-boots.md`; `src/pages/404.astro`; `src/pages/about/index.astro`; `src/pages/departments/[slug].astro`; `src/pages/gallery/before-and-after/index.astro`; `src/pages/gallery/cute-corrupted/index.astro`; `src/pages/gallery/seed-to-world.astro`; `src/pages/index.astro`; `src/pages/services/index.astro`; `src/pages/video/index.astro`; `src/pages/workshop/before-and-after/index.astro`.
- **S198:** `src/pages/gallery/index.astro`.
- **S199:** `src/pages/departments/[slug].astro`; `src/pages/gallery/before-and-after/index.astro`; `src/pages/gallery/index.astro`; `src/pages/video/index.astro`; `src/pages/workshop/before-and-after/index.astro`.
- **S200:** `src/pages/departments/[slug].astro`; `src/pages/gallery/before-and-after/index.astro`; `src/pages/gallery/index.astro`.
- **S201:** `src/pages/departments/[slug].astro`; `src/pages/gallery/before-and-after/index.astro`; `src/pages/gallery/index.astro`; `src/pages/video/index.astro`.
- **S202:** `src/content/gallery/cute-corrupted/kareena.md`; `src/pages/characters/index.astro`; `src/pages/gallery/index.astro`; `src/pages/gallery/seed-to-world.astro`; `src/pages/process/[slug].astro`; `src/pages/video/index.astro`.
- **S203:** `src/pages/gallery/index.astro`; `src/pages/video/index.astro`.
- **S204:** `src/pages/visual-systems/[slug].astro`.
- **S205:** `src/pages/characters/index.astro`; `src/pages/departments/[slug].astro`; `src/pages/gallery/cute-corrupted/index.astro`; `src/pages/gallery/index.astro`; `src/pages/video/index.astro`; `src/pages/workshop/[program].astro`.
- **S206:** `src/content/gallery/cute-corrupted/corgi.md`; `src/content/gallery/cute-corrupted/koala.md`; `src/pages/characters/index.astro`; `src/pages/departments/[slug].astro`; `src/pages/gallery/cute-corrupted/index.astro`; `src/pages/gallery/index.astro`; `src/pages/video/index.astro`; `src/pages/workshop/[program].astro`.
- **S207:** `src/content/gallery/cute-corrupted/cat.md`; `src/content/gallery/cute-corrupted/koala.md`; `src/pages/characters/index.astro`; `src/pages/departments/[slug].astro`; `src/pages/gallery/cute-corrupted/index.astro`; `src/pages/gallery/index.astro`; `src/pages/video/index.astro`; `src/pages/workshop/[program].astro`.
- **S208:** `src/content/gallery/before-and-after/1926-now.md`; `src/content/gallery/character-dev/seed-to-world-v1-neon-glitch-streetwear.md`; `src/content/gallery/cute-corrupted/cakes.md`; `src/content/gallery/cute-corrupted/raccoon.md`; `src/content/gallery/cute-corrupted/sienna.md`; `src/pages/characters/index.astro`; `src/pages/departments/[slug].astro`; `src/pages/gallery/cute-corrupted/index.astro`; `src/pages/gallery/index.astro`; `src/pages/video/index.astro`; `src/pages/workshop/[program].astro`.
- **S209:** `src/content/gallery/cute-corrupted/cat.md`; `src/content/gallery/cute-corrupted/corgi.md`; `src/pages/characters/index.astro`; `src/pages/departments/[slug].astro`; `src/pages/gallery/cute-corrupted/index.astro`; `src/pages/gallery/index.astro`; `src/pages/video/index.astro`; `src/pages/workshop/[program].astro`.
- **S210:** `src/content/gallery/cute-corrupted/cakes.md`; `src/content/gallery/cute-corrupted/cat.md`; `src/content/gallery/cute-corrupted/corgi.md`; `src/content/gallery/cute-corrupted/koala.md`; `src/pages/characters/index.astro`; `src/pages/departments/[slug].astro`; `src/pages/gallery/cute-corrupted/index.astro`; `src/pages/gallery/index.astro`; `src/pages/video/index.astro`; `src/pages/workshop/[program].astro`.
- **S211:** `src/content/gallery/before-and-after/1926-now.md`; `src/content/gallery/cute-corrupted/kareena.md`; `src/content/gallery/cute-corrupted/raccoon.md`; `src/pages/characters/index.astro`; `src/pages/gallery/cute-corrupted/index.astro`; `src/pages/gallery/index.astro`.
- **S212:** `src/pages/gallery/index.astro`; `src/pages/process/[slug].astro`; `src/pages/video/index.astro`.
- **S213:** `src/content/grimoire/color-palette-recipes.md`; `src/content/grimoire/face-geometry-identity-lock.md`; `src/content/grimoire/from-generic-to-character.md`; `src/content/grimoire/stylefusion-prompt-compilation.md`; `src/content/grimoire/understanding-visual-atoms.md`; `src/content/grimoire/welcome-to-the-grimoire.md`; `src/content/projects/stylefusion.md`; `src/pages/departments/hobfarm-presents/[series]/index.astro`; `src/pages/grimoire/cross-pollination/index.astro`; `src/pages/index.astro`; `src/pages/projects/index.astro`; `src/pages/workshop/index.astro`.
- **S214:** `src/pages/process/[slug].astro`.
- **S215:** `src/pages/helpcenter/index.astro`.
- **S216:** `src/content/help/getting-started.md`; `src/content/help/the-workspace.md`; `src/pages/helpcenter/index.astro`.
- **S217:** `src/content/projects/stylefusion.md`; `src/pages/helpcenter/index.astro`.
- **S218:** `src/content/help/getting-started.md`; `src/pages/helpcenter/index.astro`.
- **S219:** `src/content/legal/privacy.md`.
- **S220:** `src/content/legal/terms.md`.
- **S221:** `src/content/academy/intellectual-self-defense/00-the-card-catalog-started-talking-back.md`; `src/content/academy/intellectual-self-defense/01-give-the-chatbot-a-research-job.md`; `src/content/academy/intellectual-self-defense/02-open-the-receipt.md`; `src/content/academy/intellectual-self-defense/03-ask-audit-rebuild.md`; `src/content/academy/intellectual-self-defense/04-source-files-beat-vibes.md`; `src/content/academy/intellectual-self-defense/05-i-asked-for-a-picture-it-built-a-system.md`; `src/content/academy/intellectual-self-defense/06-route-the-work.md`; `src/content/academy/intellectual-self-defense/07-human-ai-and-hybrid-slop.md`; `src/content/academy/intellectual-self-defense/08-build-your-own-protocol.md`; `src/content/articles/1956-automation.md`; `src/content/articles/1973-when-airbrush-was-ai.md`; `src/content/articles/1985-future-tech.md`; `src/content/articles/3dm/1933-the-year-warner-bros-built-a-world.md`; `src/content/articles/3dm/broadway-babies.md`; `src/content/articles/3dm/enter-the-millerverse.md`; `src/content/articles/3dm/the-mouse-in-the-cat-musical.md`; `src/content/articles/3dm/you-know-nothing-of-my-algorithm.mdx`; `src/content/articles/a-false-recipe-a-real-image.md`; `src/content/articles/a-world-of-geniuses-needs-a-system.md`; `src/content/articles/against-slop.md`; `src/content/articles/brought-to-you-by-they-inc.md`; `src/content/articles/building-in-public-solo-developer.md`; `src/content/articles/building-in-public.md`; `src/content/articles/california-used-to-race-here.mdx`; `src/content/articles/color-becomes-a-cast.md`; `src/content/articles/divisionism-was-painting-before-pixels.md`; `src/content/articles/everything-is-still-loading.md`; `src/content/articles/gary-and-the-fork.md`; `src/content/articles/gonna-be-different.md`; `src/content/articles/goth-get-boots.md`; `src/content/articles/grimoire-knowledge-graph.md`; `src/content/articles/hello-world.md`; `src/content/articles/how-hobbot-keeps-the-lights-on.md`; `src/content/articles/how-psychedelia-went-beige.md`; `src/content/articles/how-the-money-eats-the-medium.md`; `src/content/articles/how-to-fix-slop.md`; `src/content/articles/i-could-be-playing-civilization.md`; `src/content/articles/instagram-funnel-buckets.md`; `src/content/articles/invisible-variable.md`; `src/content/articles/mad-trump-and-the-magazine-time-machine.md`; `src/content/articles/other-alice-origin.md`; `src/content/articles/psychedelic-goth-defined.md`; `src/content/articles/put-on-the-glasses.md`; `src/content/articles/same-model-different-surface.md`; `src/content/articles/stylefusion-ir-extraction.md`; `src/content/articles/take-me-to-phobos.md`; `src/content/articles/the-anime-to-gothic-pipeline.md`; `src/content/articles/the-card-catalog-started-talking-back.mdx`; `src/content/articles/the-censor-eats-its-own-tail.mdx`; `src/content/articles/the-unlit-corner-chiaroscuro-truth-shadows.md`; `src/content/articles/they-had-names-doll-family.mdx`; `src/content/articles/too-big-for-the-box.md`; `src/content/articles/topless-party-in-outer-space.md`; `src/content/articles/vacation-into-nothing.mdx`; `src/content/articles/you-do-not-own-the-ai-you-pay-for.md`; `src/content/changelog/gallery-launch.md`; `src/content/changelog/grimoire-knowledge-base.md`; `src/content/changelog/march-2026-site-audit.md`; `src/content/changelog/may-2026-search-consolidation.md`; `src/content/changelog/site-launch.md`; `src/content/changelog/stylefusion-beta.md`; `src/content/comics/buffcock-accident.md`; `src/content/comics/buffcock-fishing.md`; `src/content/comics/buffcock-gym.md`; `src/content/comics/buffcock-show.md`; `src/content/comics/gary-bar.md`; `src/content/comics/gary-bowling.md`; `src/content/comics/gary-buffet.md`; `src/content/comics/gary-fat-cat-design.md`; `src/content/comics/gary-fork-standoff.md`; `src/content/comics/gary-vegas.md`; `src/content/comics/gary-web-dev-ai.md`; `src/content/comics/larry-gothcat-hulmut-heidi-dinner.md`; `src/content/comics/larry-helmut-bauhaus.md`; `src/content/comics/larry-helmut-cabaret.md`; `src/content/comics/larry-helmut-poodles.md`; `src/content/comics/larry-leon-berger.md`; `src/content/comics/larry-poker.md`; `src/content/gallery/asset-lab/atomic-noir-color-system.md`; `src/content/gallery/before-and-after/1926-now.md`; `src/content/gallery/before-and-after/north-shore-1960s-2010s.md`; `src/content/gallery/before-and-after/salton-city-1965-alternate-2065.md`; `src/content/gallery/before-and-after/shit-to-shine-01.md`; `src/content/gallery/character-dev/seed-to-world-v1-neon-glitch-streetwear.md`; `src/content/gallery/compilation/liquid-gothic.md`; `src/content/gallery/cute-corrupted/cakes.md`; `src/content/gallery/cute-corrupted/cat.md`; `src/content/gallery/cute-corrupted/corgi.md`; `src/content/gallery/cute-corrupted/kareena.md`; `src/content/gallery/cute-corrupted/koala.md`; `src/content/gallery/cute-corrupted/raccoon.md`; `src/content/gallery/cute-corrupted/sienna.md`; `src/content/gallery/fashion/glamour-pin-up.md`; `src/content/gallery/model-lab/grok-vs-flux-cartoon-test.md`; `src/content/gallery/scene/storm-cathedral.md`; `src/content/gallery/video-workflow/higgsfield-transition-test.md`; `src/content/help/1.md`; `src/content/help/2.md`; `src/content/help/3.md`; `src/content/help/4.md`; `src/content/help/5.md`; `src/content/help/6.md`; `src/content/help/characters.md`; `src/content/help/exporting-your-work.md`; `src/content/help/generating-images.md`; `src/content/help/getting-started.md`; `src/content/help/history-and-providers.md`; `src/content/help/refining-results.md`; `src/content/help/styles-and-arrangements.md`; `src/content/help/the-workspace.md`; `src/content/help/working-with-references.md`; `src/content/legal/bug-bounty.md`; `src/content/legal/cookies.md`; `src/content/legal/dpa.md`; `src/content/legal/privacy.md`; `src/content/legal/refunds.md`; `src/content/legal/terms.md`; `src/content/legal/usage.md`; `src/content/projects/anomalybot.md`; `src/content/projects/drifter.md`; `src/content/projects/hobbot.md`; `src/content/projects/hobfarm-tv/magazine-time-machine.md`; `src/content/projects/stylefusion.md`; `src/content/projects/xkxxkx.md`; `src/pages/404.astro`; `src/pages/about/index.astro`; `src/pages/academy/[courseSlug]/index.astro`; `src/pages/academy/[courseSlug]/worksheets/[worksheetSlug].astro`; `src/pages/academy/avatar-content-system/course/[lessonSlug].astro`; `src/pages/academy/avatar-content-system/course/index.astro`; `src/pages/academy/avatar-content-system/free.astro`; `src/pages/academy/avatar-content-system/index.astro`; `src/pages/academy/index.astro`; `src/pages/account.astro`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`; `src/pages/changelog/index.astro`; `src/pages/characters/[character].astro`; `src/pages/characters/index.astro`; `src/pages/contact.astro`; `src/pages/departments/[slug].astro`; `src/pages/departments/funnies.astro`; `src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/index.astro`; `src/pages/departments/hobfarm-presents/[series]/index.astro`; `src/pages/departments/hobfarm-presents/[series]/world-guide.astro`; `src/pages/departments/hobfarm-presents/index.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/cast/index.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/houses/index.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/web-of-wonderland/index.astro`; `src/pages/departments/index.astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`; `src/pages/gallery/before-and-after/index.astro`; `src/pages/gallery/cute-corrupted/index.astro`; `src/pages/gallery/index.astro`; `src/pages/gallery/seed-to-world.astro`; `src/pages/games/craps/index.astro`; `src/pages/grimoire/index.astro`; `src/pages/helpcenter/index.astro`; `src/pages/index.astro`; `src/pages/membership.astro`; `src/pages/membership/success.astro`; `src/pages/process/[slug].astro`; `src/pages/projects/hobfarm-tv/index.astro`; `src/pages/projects/index.astro`; `src/pages/services/index.astro`; `src/pages/shop/index.astro`; `src/pages/shop/order-received.astro`; `src/pages/shop/sophia-stella-sheet-pack.astro`; `src/pages/status.astro`; `src/pages/support.astro`; `src/pages/video/index.astro`; `src/pages/visual-systems/[slug].astro`; `src/pages/visual-systems/index.astro`; `src/pages/whitepaper/index.astro`; `src/pages/workshop/[program].astro`; `src/pages/workshop/ami-legacy/index.astro`; `src/pages/workshop/before-and-after/index.astro`; `src/pages/workshop/character-mannequin/avatar-host-system/index.astro`; `src/pages/workshop/character-mannequin/index.astro`; `src/pages/workshop/index.astro`; `src/pages/workshop/stylefusion/prototype.astro`; `src/pages/workshop/visual-lab/index.astro`; `src/pages/workshop/workshop-notes/psygoth/index.astro`.
- **S222:** `src/pages/academy/avatar-content-system/course/[lessonSlug].astro`; `src/pages/academy/avatar-content-system/course/index.astro`; `src/pages/academy/avatar-content-system/free.astro`; `src/pages/academy/avatar-content-system/index.astro`; `src/pages/gallery/index.astro`; `src/pages/index.astro`; `src/pages/support.astro`.
- **S223:** `src/pages/services/index.astro`.
- **S224:** `src/content/gallery/fashion/glamour-pin-up.md`; `src/pages/services/index.astro`.
- **S225:** `src/content/gallery/video-workflow/higgsfield-transition-test.md`; `src/pages/services/index.astro`; `src/pages/workshop/index.astro`.
- **S226:** `src/content/gallery/character-dev/seed-to-world-v1-neon-glitch-streetwear.md`; `src/pages/gallery/seed-to-world.astro`; `src/pages/services/index.astro`; `src/pages/workshop/index.astro`.
- **S227:** `src/pages/404.astro`; `src/pages/about/index.astro`; `src/pages/gallery/index.astro`.
- **S228:** `src/pages/projects/index.astro`.
- **S229:** `src/content/academy/intellectual-self-defense/00-the-card-catalog-started-talking-back.md`; `src/content/academy/intellectual-self-defense/01-give-the-chatbot-a-research-job.md`; `src/content/academy/intellectual-self-defense/02-open-the-receipt.md`; `src/content/academy/intellectual-self-defense/03-ask-audit-rebuild.md`; `src/content/academy/intellectual-self-defense/04-source-files-beat-vibes.md`; `src/content/academy/intellectual-self-defense/05-i-asked-for-a-picture-it-built-a-system.md`; `src/content/academy/intellectual-self-defense/06-route-the-work.md`; `src/content/academy/intellectual-self-defense/07-human-ai-and-hybrid-slop.md`; `src/content/academy/intellectual-self-defense/08-build-your-own-protocol.md`; `src/content/articles/1956-automation.md`; `src/content/articles/1973-when-airbrush-was-ai.md`; `src/content/articles/1985-future-tech.md`; `src/content/articles/3dm/1933-the-year-warner-bros-built-a-world.md`; `src/content/articles/3dm/broadway-babies.md`; `src/content/articles/3dm/enter-the-millerverse.md`; `src/content/articles/3dm/the-mouse-in-the-cat-musical.md`; `src/content/articles/3dm/you-know-nothing-of-my-algorithm.mdx`; `src/content/articles/a-false-recipe-a-real-image.md`; `src/content/articles/a-world-of-geniuses-needs-a-system.md`; `src/content/articles/against-slop.md`; `src/content/articles/brought-to-you-by-they-inc.md`; `src/content/articles/building-in-public-solo-developer.md`; `src/content/articles/building-in-public.md`; `src/content/articles/california-used-to-race-here.mdx`; `src/content/articles/color-becomes-a-cast.md`; `src/content/articles/divisionism-was-painting-before-pixels.md`; `src/content/articles/everything-is-still-loading.md`; `src/content/articles/gary-and-the-fork.md`; `src/content/articles/gonna-be-different.md`; `src/content/articles/goth-get-boots.md`; `src/content/articles/grimoire-knowledge-graph.md`; `src/content/articles/hello-world.md`; `src/content/articles/how-hobbot-keeps-the-lights-on.md`; `src/content/articles/how-psychedelia-went-beige.md`; `src/content/articles/how-the-money-eats-the-medium.md`; `src/content/articles/how-to-fix-slop.md`; `src/content/articles/i-could-be-playing-civilization.md`; `src/content/articles/instagram-funnel-buckets.md`; `src/content/articles/invisible-variable.md`; `src/content/articles/mad-trump-and-the-magazine-time-machine.md`; `src/content/articles/other-alice-origin.md`; `src/content/articles/psychedelic-goth-defined.md`; `src/content/articles/put-on-the-glasses.md`; `src/content/articles/same-model-different-surface.md`; `src/content/articles/stylefusion-ir-extraction.md`; `src/content/articles/take-me-to-phobos.md`; `src/content/articles/the-anime-to-gothic-pipeline.md`; `src/content/articles/the-card-catalog-started-talking-back.mdx`; `src/content/articles/the-censor-eats-its-own-tail.mdx`; `src/content/articles/the-unlit-corner-chiaroscuro-truth-shadows.md`; `src/content/articles/they-had-names-doll-family.mdx`; `src/content/articles/too-big-for-the-box.md`; `src/content/articles/topless-party-in-outer-space.md`; `src/content/articles/vacation-into-nothing.mdx`; `src/content/articles/you-do-not-own-the-ai-you-pay-for.md`; `src/content/changelog/gallery-launch.md`; `src/content/changelog/grimoire-knowledge-base.md`; `src/content/changelog/march-2026-site-audit.md`; `src/content/changelog/may-2026-search-consolidation.md`; `src/content/changelog/site-launch.md`; `src/content/changelog/stylefusion-beta.md`; `src/content/comics/buffcock-accident.md`; `src/content/comics/buffcock-fishing.md`; `src/content/comics/buffcock-gym.md`; `src/content/comics/buffcock-show.md`; `src/content/comics/gary-bar.md`; `src/content/comics/gary-bowling.md`; `src/content/comics/gary-buffet.md`; `src/content/comics/gary-fat-cat-design.md`; `src/content/comics/gary-fork-standoff.md`; `src/content/comics/gary-vegas.md`; `src/content/comics/gary-web-dev-ai.md`; `src/content/comics/larry-gothcat-hulmut-heidi-dinner.md`; `src/content/comics/larry-helmut-bauhaus.md`; `src/content/comics/larry-helmut-cabaret.md`; `src/content/comics/larry-helmut-poodles.md`; `src/content/comics/larry-leon-berger.md`; `src/content/comics/larry-poker.md`; `src/content/gallery/asset-lab/atomic-noir-color-system.md`; `src/content/gallery/before-and-after/1926-now.md`; `src/content/gallery/before-and-after/north-shore-1960s-2010s.md`; `src/content/gallery/before-and-after/salton-city-1965-alternate-2065.md`; `src/content/gallery/before-and-after/shit-to-shine-01.md`; `src/content/gallery/character-dev/seed-to-world-v1-neon-glitch-streetwear.md`; `src/content/gallery/compilation/liquid-gothic.md`; `src/content/gallery/cute-corrupted/cakes.md`; `src/content/gallery/cute-corrupted/cat.md`; `src/content/gallery/cute-corrupted/corgi.md`; `src/content/gallery/cute-corrupted/kareena.md`; `src/content/gallery/cute-corrupted/koala.md`; `src/content/gallery/cute-corrupted/raccoon.md`; `src/content/gallery/cute-corrupted/sienna.md`; `src/content/gallery/fashion/glamour-pin-up.md`; `src/content/gallery/model-lab/grok-vs-flux-cartoon-test.md`; `src/content/gallery/scene/storm-cathedral.md`; `src/content/gallery/video-workflow/higgsfield-transition-test.md`; `src/content/help/1.md`; `src/content/help/2.md`; `src/content/help/3.md`; `src/content/help/4.md`; `src/content/help/5.md`; `src/content/help/6.md`; `src/content/help/characters.md`; `src/content/help/exporting-your-work.md`; `src/content/help/generating-images.md`; `src/content/help/getting-started.md`; `src/content/help/history-and-providers.md`; `src/content/help/refining-results.md`; `src/content/help/styles-and-arrangements.md`; `src/content/help/the-workspace.md`; `src/content/help/working-with-references.md`; `src/content/legal/bug-bounty.md`; `src/content/legal/cookies.md`; `src/content/legal/dpa.md`; `src/content/legal/privacy.md`; `src/content/legal/refunds.md`; `src/content/legal/terms.md`; `src/content/legal/usage.md`; `src/content/projects/anomalybot.md`; `src/content/projects/drifter.md`; `src/content/projects/hobbot.md`; `src/content/projects/hobfarm-tv/magazine-time-machine.md`; `src/content/projects/stylefusion.md`; `src/content/projects/xkxxkx.md`; `src/pages/404.astro`; `src/pages/about/index.astro`; `src/pages/academy/[courseSlug]/index.astro`; `src/pages/academy/[courseSlug]/worksheets/[worksheetSlug].astro`; `src/pages/academy/avatar-content-system/course/[lessonSlug].astro`; `src/pages/academy/avatar-content-system/course/index.astro`; `src/pages/academy/avatar-content-system/free.astro`; `src/pages/academy/avatar-content-system/index.astro`; `src/pages/academy/index.astro`; `src/pages/account.astro`; `src/pages/articles/index.astro`; `src/pages/articles/page/[page].astro`; `src/pages/articles/tags/[tag].astro`; `src/pages/articles/tags/index.astro`; `src/pages/changelog/index.astro`; `src/pages/characters/[character].astro`; `src/pages/characters/index.astro`; `src/pages/contact.astro`; `src/pages/departments/[slug].astro`; `src/pages/departments/funnies.astro`; `src/pages/departments/hobfarm-presents/3-degrees-of-dick-miller/index.astro`; `src/pages/departments/hobfarm-presents/[series]/index.astro`; `src/pages/departments/hobfarm-presents/[series]/world-guide.astro`; `src/pages/departments/hobfarm-presents/index.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/cast/index.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/houses/index.astro`; `src/pages/departments/hobfarm-presents/other-alice-adventures/web-of-wonderland/index.astro`; `src/pages/departments/index.astro`; `src/pages/funnies/[series]/index.astro`; `src/pages/funnies/tags/[tag].astro`; `src/pages/gallery/before-and-after/index.astro`; `src/pages/gallery/cute-corrupted/index.astro`; `src/pages/gallery/index.astro`; `src/pages/gallery/seed-to-world.astro`; `src/pages/games/craps/index.astro`; `src/pages/grimoire/index.astro`; `src/pages/helpcenter/index.astro`; `src/pages/index.astro`; `src/pages/login.astro`; `src/pages/membership.astro`; `src/pages/membership/success.astro`; `src/pages/process/[slug].astro`; `src/pages/projects/index.astro`; `src/pages/services/index.astro`; `src/pages/shop/index.astro`; `src/pages/shop/order-received.astro`; `src/pages/shop/sophia-stella-sheet-pack.astro`; `src/pages/status.astro`; `src/pages/support.astro`; `src/pages/video/index.astro`; `src/pages/visual-systems/[slug].astro`; `src/pages/visual-systems/index.astro`; `src/pages/whitepaper/index.astro`; `src/pages/workshop/[program].astro`; `src/pages/workshop/ami-legacy/index.astro`; `src/pages/workshop/before-and-after/index.astro`; `src/pages/workshop/character-mannequin/avatar-host-system/index.astro`; `src/pages/workshop/character-mannequin/index.astro`; `src/pages/workshop/index.astro`; `src/pages/workshop/stylefusion/prototype.astro`; `src/pages/workshop/visual-lab/index.astro`; `src/pages/workshop/workshop-notes/psygoth/index.astro`.
- **S230:** `src/pages/projects/hobfarm-tv/index.astro`; `src/pages/video/index.astro`.
- **S231:** `src/content/articles/color-becomes-a-cast.md`; `src/content/articles/invisible-variable.md`; `src/content/help/characters.md`; `src/content/help/exporting-your-work.md`; `src/content/help/generating-images.md`; `src/content/help/getting-started.md`; `src/content/help/history-and-providers.md`; `src/content/help/refining-results.md`; `src/content/help/styles-and-arrangements.md`; `src/content/help/the-workspace.md`; `src/content/help/working-with-references.md`; `src/pages/grimoire/index.astro`; `src/pages/projects/index.astro`; `src/pages/workshop/stylefusion/prototype.astro`.
- **S232:** `src/pages/gallery/index.astro`; `src/pages/process/[slug].astro`.
- **S233:** `src/pages/index.astro`.
- **S234:** `src/pages/departments/[slug].astro`; `src/pages/workshop/character-mannequin/index.astro`; `src/pages/workshop/index.astro`.
- **S235:** `src/pages/departments/[slug].astro`; `src/pages/visual-systems/index.astro`.
- **S236:** `src/pages/departments/[slug].astro`; `src/pages/visual-systems/index.astro`; `src/pages/workshop/[program].astro`; `src/pages/workshop/visual-lab/index.astro`.
- **S237:** `src/pages/academy/avatar-content-system/index.astro`; `src/pages/index.astro`; `src/pages/workshop/character-mannequin/avatar-host-system/index.astro`; `src/pages/workshop/index.astro`.
- **S238:** `src/pages/workshop/ami-legacy/index.astro`; `src/pages/workshop/index.astro`; `src/pages/workshop/workshop-notes/psygoth/index.astro`.
- **S239:** `src/content/articles/gonna-be-different.md`; `src/content/articles/other-alice-origin.md`; `src/pages/departments/index.astro`; `src/pages/index.astro`.
- **S240:** `src/pages/workshop/character-mannequin/avatar-host-system/index.astro`; `src/pages/workshop/index.astro`.

## Batch order implied by this audit

1. **redirect:** collapse the 24 existing Workshop Notes chains, then repoint the two Magazine Time Machine aliases. No content moves are required.
2. **promote:** Avatar & Host, the four Process methods, and Ami / Legacy each keep their substantive content and receive canonical routes before old paths redirect.
3. **merge:** StyleFusion, Visual Systems, Magazine Time Machine, and the promoted Project records need individual briefs because the losers contain unique material.
4. **hide:** keep review routes, drafts, empty departments, private StyleFusion studies, archived products, and the unrendered Stack entry out of discovery until explicitly published.
