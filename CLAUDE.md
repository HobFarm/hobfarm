# CLAUDE.md: HobFarm Claude Code Guide

## Read first

[`AGENTS.md`](AGENTS.md) is the canonical repository guide. Read it before making changes.

This file adds Claude Code procedure and a compact statement of the current project direction. If it conflicts with `AGENTS.md`, follow `AGENTS.md` unless the user's current request says otherwise.

Use [`docs/regular-prose-guidelines.md`](docs/regular-prose-guidelines.md) as the final pass for public-facing copy.

---

## Role

You are Claude Code operating inside the HobFarm repository.

Your job is to:

1. Inspect the current repository and working tree.
2. Understand the requested change.
3. Preserve unrelated work.
4. Make the smallest durable change that solves the task.
5. Validate the result.
6. Report the files changed, commands run, results, skipped checks, and deployment status.

Work from repository evidence. Do not invent routes, products, prices, entitlements, listings, media, facts, or architecture.

---

## Current Direction

HobFarm is an independent publisher of articles, media, games, and creative systems.

Magazine describes the Editorial layer. It does not describe the entire business.

| Area | Job |
| --- | --- |
| HobFarm | Parent publisher and creative studio |
| Editorial / Articles | Essays, reporting, research, satire, cartoons, visual features, and departments |
| HobFarm Presents | Recurring stories, characters, film and media series, entertainment formats, and developed worlds |
| Games and applications | Other Alice Adventures and its Wonder Machine runtime, the Grimoire world layer, StyleFusion, browser games, and interactive experiments |
| Workshop | Visible production methods, experiments, tools, systems, revisions, and failures |
| Academy | Free and affordable one-time courses built from working HobFarm methods |
| Shop | Official commercial directory and direct merchandise store |
| Support | One-time Ko-fi funding and the $5 monthly HobFarm Club |
| Gallery | Shared visual archive |
| Projects | Retiring. A leftover from an earlier build. Workshop is the permanent home for tools, systems, and work in progress; Presents owns the editorial properties still parked there |
| Customer Help | Orders, billing, downloads, course access, refunds, accounts, and application problems |

Do not force every release through an article. An article, comic, adventure, game, application, gallery entry, Workshop note, course, product, and project page can each be the primary published object.

---

## How the Site Tells Its Story

Everything on HobFarm is one connected system. The site exists to show that
system working. Use this model when deciding what a page is for and what it
should link to.

```text
Homepage           states the whole thesis: everything is connected, and this
                   process is what makes the content
Articles           are the content itself, mostly long form; each article's
                   department maps it to the section it belongs to
Presents           tells the story of what the recurring properties are;
                   the articles are their actual content
Workshop           shows the process behind all of it, in public
Academy            sells the courses that teach the method Workshop demonstrates
Shop               is where the marketplace output lands; the Workshop process
                   describes how that output gets made
Social media       shows the results; the process stays here on the site
```

An article about a film lands in 3 Degrees of Dick Miller. An article about
something found in an old magazine lands in Magazine Time Machine. The category
taxonomy is the routing layer between the writing and the sections.

**The article is the spine of the visual content.** 3DM and Magazine Time
Machine began as YouTube show concepts and became article sections; the video
follows the writing rather than the other way round. So HobFarm TV shows get
built from articles that already exist. Do not create a show, series, or video
record that has no article underneath it, and do not treat a Presents section as
a HobFarm TV show. Shows will live at `/presents/hobfarm-tv/shows/` when there
are any; there are none today.

### Section structure

`/departments/`, `/projects/`, and `/video/` are retired. They were earlier
builds that split the same content across three prefixes. Three live sections
hold everything:

```text
/presents/<section>/   recurring editorial properties, each an article archive
/workshop/<program>/   production methods
/articles/<category>/  editorial categories with no Presents or Workshop home
```

Presents has five sections, in this order: Other Alice Adventures,
3 Degrees of Dick Miller, Magazine Time Machine, Funnies, HobFarm TV.
`/presents/` is the "all" page; do not add a separate index or directory link.

Other Alice Adventures is the flagship and the outlier. It is a project rather
than an article feed, and it combines avatar work, character writing, the game
concept, app building, StyleFusion, image generation, and video generation.
HobFarm TV is video built from the articles in the other sections.

One rule decides every category URL, with no exceptions:

| Category maps to | URL |
| --- | --- |
| A Presents section | `/presents/<slug>/` |
| A Workshop program | `/workshop/<slug>/` |
| Neither | `/articles/<slug>/` |

`departmentPath()` in `src/data/departments.ts` implements this. Use it. Never
hardcode a category URL. A category with no content generates no route; it stays
in the taxonomy so an article can be filed to it.

**Workshop's specific job:** settle the question of how HobFarm uses AI. The
answer is complicated, and Workshop is where the complication gets shown rather
than argued about. Every Workshop program should leave a reader able to see what
was actually done. When someone asks about a technique in a comment or a reply,
the Workshop page is the thing to point at.

**The site shows process. Social media gets the output.** A finished video, a
reel, a campaign clip belongs on a social platform. What belongs here is how it
was made: hyperframes videos, diagrams, annotated stills, before-and-after
pairs, and example images. Future Carriage is the model. Old carriage drawings
from the 1800s get a futuristic aesthetic; the Ami avatar is developed
separately in the avatar workshop as a social media influencer; the two combine
into one concept. The Workshop page demonstrates that sequence. The finished
Ami video does not live on the site.

This rules out media-archive pages. Do not build a video gallery, a portfolio
reel, or a clips hub. If a video belongs anywhere on the site, it belongs on the
page for the thing it is about.

The same rule governs characters. There is no site-wide cast index. A character
lives on the page for the world it belongs to: Larry's cast on
`/presents/funnies/larry/`, Wonderland's on the Other Alice cast page. Nothing
gets a standalone directory just because it is a recurring type of thing.

### Characters, avatars, and Other Alice are three different things

| Class | What it is | Home |
| --- | --- | --- |
| Comic characters | Cast of a Funnies strip. Larry, Gary, and Buffcock are the three series | Their series page under `/presents/funnies/<series>/` |
| Avatars | Presenters HobFarm builds through the Avatar & Host method | Documented at `/workshop/avatar-host/` |
| Characters | A named character developed into a reusable identity with its own satire, anchors, modes, and editions | `/workshop/character-mannequin/characters/<slug>/` |
| Other Alice residents | Cast of the Other Alice world | Other Alice, managed separately |

A character is the **result** of the Character / Mannequin process, not a second
methodology. The Workshop describes the process once; character pages show what
it produces, and the same process produces the next one. Each character gets one
dossier page recording the finished reusable identity, and it makes the system
behind the character visible by linking to it, never by restating it.

The job of a character page: someone sees the character on social and wonders
whether it is a one-off AI picture. The page shows it is not.

Characters nest under the method that made them and never become their own
Workshop program or nav item. An **edition** is a contextual version of the same
character, built around an era, culture, role, or commercial fantasy; it is not a
separate character.

Hobunny is the first; her specification is `docs/hobunny-project-outline.md`.
When a character page starts describing procedure, that content belongs in a
Workshop program instead.

Avatars are Hillary (HobFarm TV host, also Magazine Time Machine, essays, and
3DM), Ami (social influencer and product spokesperson), and the PsyGoth trio of
Em, Nina, and Zima (style, colour, and art concepts in the PsyGoth aesthetic).
Hobgal is a retired prototype.

**Avatar content is made for social media, not the site.** Hillary's goes to
YouTube, Ami's to Instagram, PsyGoth across a mix. The site documents the avatar
and the method; the platform gets the finished video. No avatar gallery, reel
page, or embeds hub.

Other Alice is a website within the website: a large, dynamic world with its own
structure. Manage it separately and do not restructure it as a side effect of
work elsewhere.

**Academy's specific job:** take a method Workshop demonstrates and teach it as
a repeatable procedure. Every course states a problem, gives a solution, and
walks the steps in order, plainly enough to follow without prior context. The
standard short course is $7.

Connect pages when the relationship is real. Workshop to Academy when a course
teaches that method. Workshop to Shop when the process produced the goods.
Articles to Workshop when the writing references the technique. Do not build
funnels where no relationship exists.

### Application and project status

Inspect this before writing about, linking to, or reviving any application.

| Subject | Current status |
| --- | --- |
| Other Alice Adventures | Active. The illustrated serial and world archive |
| Wonder Machine | Active. The runtime that runs storylets, keeps time, remembers choices, and preserves consequences. Formerly the XKXXKX record |
| Grimoire | Active, in redevelopment. The world and knowledge layer feeding Wonder Machine and StyleFusion. Not a standalone product page |
| StyleFusion | In redesign, but the page stays public at `/workshop/stylefusion/` because too much links to it. The page says it is in development. What is written there does not yet describe the new version |
| HobBot | Hidden, in redevelopment. Will eventually be the automation layer |
| Drifter | Retired. Do not resurface |
| AnomalyBot | Retired. Do not resurface |
| 3DM, Magazine Time Machine | Editorial properties at `/presents/3-degrees-of-dick-miller/` and `/presents/magazine-time-machine/` |
| HobFarm TV | A Presents section at `/presents/hobfarm-tv/`. Video built from the articles in the other sections, not a media archive |

---

## Publishing and Commerce Model

Use this model when deciding where work belongs:

```text
the publication creates interest
Workshop shows the work and establishes credibility
Academy teaches the repeatable method
Commerce sells useful finished outcomes
Support funds the next article, project, game, or release
the site keeps every route and relationship understandable
```

Social media may distribute a release. It is not the site architecture or a mandatory stage.

Connect pages only when the relationship is real and useful. Do not turn every article or Workshop page into a sales funnel.

---

## Commerce Channels

Keep one job per surface:

| Surface | Job |
| --- | --- |
| HobFarm Shop | Direct HobFarm merchandise and a map to the correct commercial shelf |
| Academy | Free lessons and affordable one-time workflow courses that teach the methods Workshop demonstrates |
| Etsy | Clip art, scrapbook assets, seasonal packs, printables, decorative scenes, and archive collections |
| DeviantArt | Mannequins, outfits, character sheets, wallpapers, premium packs, adoptables, and exclusives |
| eBay | DVDs, magazines, books, antiques, collectibles, decor, media, and other counted physical objects |
| Ko-fi | One-time reader support and project funding |
| HobFarm Club | $5 monthly supporter membership with one small durable benefit |
| Patreon | Paused; keep it off the public site unless a distinct future community is approved |

The Shop is a map, not an inventory aggregator. Do not mirror every marketplace listing into HobFarm. Marketplace listings expire, move, and sell out.

HobFarm-controlled direct merchandise may have permanent product pages and on-site checkout. External shelves normally need a clear description and storefront link.

Academy courses use one-time purchases. The default standard short course is $7, with $5 focused lessons, $9 courses that include templates or source files, and $24 to $35 multi-part bundles.

The Avatar Content System has a legacy membership entitlement. Inspect active access before changing it. Grandfather existing members or provide a clear transition.

---

## Funding, Help, and Affiliate Rules

`/support/` funds HobFarm. `/helpcenter/` serves customers. Do not mix those jobs.

Use `/membership/` for HobFarm Club. Keep new courses, Shop products, and downloads separate from the monthly supporter membership unless a specific entitlement has been implemented and verified.

The approved public claim is:

> No third-party display ads, sponsored posts, or paid editorial placement.

House ads, marketplace links, course promotion, support requests, and clearly labeled affiliate links are allowed.

Place this disclosure close to an affiliate recommendation:

> Affiliate link: HobFarm may earn a commission if you buy through this link. It does not change your price.

Do not describe HobFarm support as a donation or tax-deductible contribution unless its legal and tax status changes.

---

## Implementation Procedure

For every task:

1. Confirm the repository is on `main`, then run `git status --short`.
2. Identify unrelated modified and untracked files.
3. Inspect the relevant routes, data, schemas, components, tests, and current diffs.
4. Confirm the page or system's primary job.
5. Reuse existing routes, collections, components, relationship fields, and design patterns.
6. Make focused edits.
7. Run the validation appropriate to the change.
8. Fix errors caused by the task.
9. Commit validated work to `main` and push `origin/main` unless the user asked
   for local-only or draft work.
10. Summarize the completed scope and remaining review.

Do not normalize unrelated files or overwrite another workstream's changes.

HobFarm uses one branch. Work directly on `main`. Do not create feature
branches, preview branches, pull-request branches, alternate worktrees, or
detached working copies. Use local preview tools for review.

---

## Technical Baseline

| Layer | Technology |
| --- | --- |
| Framework | Astro 6 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 with CSS-first configuration |
| Content | Astro content collections in `src/content/` |
| CMS | PagesCMS through `.pages.yml` |
| Hosting | Cloudflare Pages |
| Functions | Cloudflare Pages Functions in `functions/api/` |
| Media | Cloudflare R2 at `https://cdn.hob.farm` |
| Commerce | Stripe for account-linked membership and approved direct checkout; documented external storefronts for their assigned shelves |

Tailwind tokens live in `src/styles/`. Do not create a Tailwind 3-style configuration.

Keep secrets server-side. Never commit `.env`, `.dev.vars`, tokens, credentials, customer data, order payloads, or raw logs.

---

## Commands

Use npm because `package-lock.json` is committed.

```bash
npm run dev
npm run build
npm test
npx astro check
npm run preview
```

Inspect `package.json` before assuming another script exists.

Use:

- `npm run build` for meaningful site changes.
- `npm test` for structural and Node-based tests.
- `npx astro check` for schemas, frontmatter, TypeScript, TSX, layouts, and component props.
- Chrome for UI QA, with local Playwright as the fallback.

Documentation-only changes do not require a full Astro build unless they alter generated site content or a test depends on the files.

---

## Content and Product Guardrails

- Use the correct collection and inspect `src/content.config.ts`.
- Keep Articles as the Editorial feed; do not introduce `blog` naming.
- Use `comics` and `adventures` when those objects fit.
- Give released games and applications durable routes.
- Use existing relationship fields instead of duplicating titles, prices, URLs, or product data.
- Keep public previews separate from buyer files.
- Do not expose full-resolution paid assets, private manifests, signed URLs, account data, or customer details.
- Do not publish a buy action until the product, price, variants, fulfillment, checkout, and support path are verified.
- Keep Patreon off the public site while it is paused.
- Preserve the user's facts, voice, humor, and sharp language. Remove generic assistant prose.

---

## Cloudflare and External Actions

Cloudflare Pages deploys from `main`.

Do not change Cloudflare settings, DNS, secrets, R2, KV, D1, Workers, routes, remote migrations, or production deployments without explicit approval.

Do not call paid media or model providers without approval of the provider, output, quantity, and expected cost.

---

## Handoff

Report:

- files changed
- user-visible or operational result
- commands and checks run
- build, test, type, and browser results
- skipped checks and reasons
- external systems affected
- unresolved work or decisions
- deployment status

Do not claim a visual check, purchase flow, external listing, deployment, or provider action unless it actually happened.
