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
| Editorial / Articles | Essays, reporting, research, satire, cartoons, and visual features |
| HobFarm Presents | Recurring stories, characters, film and media series, entertainment formats, and developed worlds |
| Games and applications | Other Alice Adventures and its Wonder Machine runtime, the Grimoire world layer, StyleFusion, browser games, and interactive experiments |
| Workshop | Visible production methods, experiments, tools, systems, revisions, and failures |
| Academy | Free and affordable one-time courses built from working HobFarm methods |
| Shop | Official commercial directory and direct merchandise store |
| Support | One-time Ko-fi funding and the $5 monthly HobFarm Club |
| Gallery | Shared visual archive |
| Customer Help | Orders, billing, downloads, course access, refunds, accounts, and application problems |

Do not force every release through an article. An article, comic, adventure, game, application, gallery entry, Workshop note, course, product, and project page can each be the primary published object.

---

## Site Map

`/departments/`, `/projects/`, and `/video/` are retired. Three sections hold
everything:

```text
/presents/<section>/    recurring editorial properties
/workshop/<program>/    production methods and workshop projects
/articles/<category>/   editorial categories with no Presents or Workshop home
```

### Presents

Five sections, in nav order. `/presents/` is the index; there is no separate
directory page.

| Section | Route |
| --- | --- |
| Other Alice Adventures | `/presents/other-alice-adventures/` |
| 3 Degrees of Dick Miller | `/presents/3-degrees-of-dick-miller/` |
| Magazine Time Machine | `/presents/magazine-time-machine/` |
| Funnies | `/presents/funnies/`, comics at `/presents/funnies/<series>/<slug>/` |
| HobFarm TV | `/presents/hobfarm-tv/`, shows will be at `/presents/hobfarm-tv/shows/` |

Other Alice is the flagship and has its own internal structure. Manage it as its
own project; do not restructure it as a side effect of work elsewhere.

Other Alice is a persistent interactive story and game world, not a feed of
prewritten serial installments. `/presents/other-alice-adventures/` is its
canonical public home. The World Guide, Houses, cast, and relationship pages
describe the shared authored world. Wonder Machine owns each mutable campaign,
including choices, time, consequences, saves, and the long-form account that
emerges during play. Do not recreate that session history as a static website
content collection.

### Category routing

| Category maps to | URL |
| --- | --- |
| A Presents section | `/presents/<slug>/` |
| A Workshop program | `/workshop/<slug>/` |
| Neither | `/articles/<slug>/` |

`departmentPath()` in `src/data/departments.ts` implements this. Use it rather
than hardcoding a category URL. A category with no content generates no route.

### Characters and avatars

| Class | Home |
| --- | --- |
| Comic characters | Their series page under `/presents/funnies/<series>/`. Series are Larry, Gary, Buffcock |
| Avatars | `/workshop/avatar-host/` |
| Characters | `/workshop/character-mannequin/characters/<slug>/` |
| Other Alice residents | The Other Alice cast page |

There is no site-wide cast index. A character is the output of the Character /
Mannequin process; an edition is a version of the same character, not a new one.
Hobunny is the first character: `docs/hobunny-project-source.md`.

Avatars: Hillary (YouTube), Ami (Instagram), and the PsyGoth trio Em, Nina, and
Zima (mixed). Hobgal is retired.

### Application status

| Subject | Status |
| --- | --- |
| Other Alice Adventures | Active. Presents property, public world record, and persistent story game in development |
| Wonder Machine | Private runtime alpha for Other Alice; the player-facing client and production-ready opening are unfinished |
| Grimoire | Active, in redevelopment. World and knowledge layer feeding Wonder Machine and StyleFusion |
| StyleFusion | Public at `/workshop/stylefusion/`, in redesign. Current copy predates the new version |
| HobBot | Record kept at `src/content/workshop/hobbot.md`, no public page, in redevelopment |
| Drifter, AnomalyBot | Retired |

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

### Deploy chain

```text
local -> GitHub (HobFarm/hobfarm, main) -> Cloudflare Pages -> hob.farm
```

Cloudflare Pages builds from `main`. There is one branch.

### Media on the CDN

R2 serves `https://cdn.hob.farm`. **Mirror the site structure in the bucket
path**, so an asset sits where its page sits:

```text
cdn.hob.farm/workshop/<program>/<file>
cdn.hob.farm/presents/<section>/<file>
cdn.hob.farm/gallery/<collection>/<slug>/<file>
```

Existing paths are inconsistent from earlier builds. Do not rename or migrate
them; that resolves itself as old content is replaced. Put new assets in the
matching path. `src/data/media-registry.ts` is the lookup for registered media;
prefer it over hardcoding a CDN URL.

CDN paths are not routes. A path like `cdn.hob.farm/pages/projects/images/...`
is an asset location, so a site restructure does not rename it.

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
- Use `comics` for published image-first comic entries. Other Alice campaign history belongs to Wonder Machine rather than a static story collection.
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
