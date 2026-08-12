# AGENTS.md: HobFarm Repository Guide

## Purpose

This repository contains the HobFarm publishing website, public catalog, and supporting applications.

HobFarm is an independent publisher and creative studio. It publishes articles, recurring stories and media titles, visual work, games, creative applications, production notes, courses, merchandise, and digital releases.

Agents working in this repo should help build, fix, organize, validate, and improve the website. Work should be practical, scoped, and validated before handoff.

---

## Agent Role

You are operating inside the HobFarm website repo.

Your job is to:

1. Inspect the current repo state.
2. Understand the requested task.
3. Make the smallest useful change that solves the task.
4. Preserve working behavior.
5. Run validation.
6. Summarize what changed and what still needs review.

Do not turn a small website fix into a full redesign.

Do not invent new architecture when existing routes, layouts, components, or content collections can be adapted.

Do not focus on outdated brand systems, seasonal scaffolds, or old style language unless an existing file requires compatibility.

---

## Current Project Model

HobFarm is the parent publisher. Magazine describes the Editorial layer, not the entire business.

Use this model when making site decisions:

| Layer | Area | Role |
| --- | --- | --- |
| Parent | HobFarm | Owns the publication, catalog, recurring titles, customer relationships, archive, and operating systems |
| Division | Editorial | Articles, essays, reporting, research, satire, cartoons, visual features, and departments |
| Division | HobFarm Presents | Recurring stories, characters, film and media series, entertainment formats, and developed worlds |
| Division | Workshop | Process, production methods, experiments, tools, systems, and the learning paths built from them |
| Division | Shop | Official commercial directory and direct merchandise store; maps visitors to the correct HobFarm or marketplace shelf |
| Division | Support | One-time reader funding through Ko-fi, the $5 monthly HobFarm Club, and a clear account of what support sustains |
| Published work | Games and applications | Browser games, interactive fiction, creative software, research tools, and prototypes such as Other Alice, StyleFusion, and Grimoire |
| Shared format | Gallery | Visual archive used by Editorial, Presents, Workshop, Projects, and Shop |
| Program | Academy | Free and affordable one-time courses built from practical HobFarm workflows |
| Catalog | Projects | Public index for tools, games, applications, systems, experiments, and ongoing work |
| Knowledge layer | Grimoire | Notes, references, project memory, content planning, structured knowledge, and selected game or application data |
| Utilities | About, Account, Contact, Customer Help, Legal | Publisher information, customer access, assistance, and policies |

Do not force every release through an article. Choose the primary object that fits the work: article, Presents entry, comic, adventure, game, application, gallery entry, Workshop note, course, product, or project page.

Use this publishing and commerce model:

```text
the publication creates interest
Workshop shows the work and establishes credibility
Academy teaches the repeatable method
Commerce sells useful finished outcomes
Support funds the next article, project, game, or release
the site keeps every route and relationship understandable
```

Each published object still needs a durable primary route and useful relationships to other HobFarm work. Social media is a distribution option. It is not the source of truth, the site architecture, or a required step for every piece.

---

## Priority Rules

When instructions conflict, use this order:

1. Explicit user request in the current task.
2. This `AGENTS.md`.
3. `CLAUDE.md`, if the agent is Claude Code or the task references Claude Code.
4. Existing repo conventions.
5. Framework and platform best practices.

Current thread context beats old project lore.

Working code beats theoretical architecture.

Validated fixes beat large speculative rewrites.

---

## Writing and Formatting Rules

Use [`docs/regular-prose-guidelines.md`](docs/regular-prose-guidelines.md) as the final style pass whenever creating or substantially rewriting public-facing copy. This includes articles, captions, World Guide entries, project and gallery descriptions, product copy, social text, comments, replies, summaries, and short explanations.

Lead with the real claim. Use ordinary punctuation, varied sentence rhythm, concrete nouns, active verbs, and functional Markdown. Remove assistant-shaped contrast, generic setup, abstract corporate language, fake enthusiasm, and decorative formatting.

The guide controls prose shape, not canon. Factual constraints, the user's current request, established character voice, and page-specific editorial briefs take priority. Preserve sharp, gothic, psychedelic, satirical, technical, or cinematic language when it carries actual meaning.

---

## Stack

| Layer     | Technology                                     |
| --------- | ---------------------------------------------- |
| Framework | Astro 7                                        |
| Language  | TypeScript                                     |
| Styling   | Tailwind CSS v4, CSS-first setup               |
| CMS       | PagesCMS, configured in `.pages.yml`           |
| Content   | Astro content collections in `src/content/`    |
| Hosting   | Cloudflare Pages                               |
| Functions | Cloudflare Pages Functions in `functions/api/` |
| CDN       | Cloudflare R2 at `https://cdn.hob.farm`        |
| Commerce  | Stripe for account-linked membership and approved direct checkout; external storefronts where documented |

Tailwind 4 uses CSS-first configuration. Inspect `src/styles/` before changing styling architecture. Do not create a Tailwind 3-style config unless the repo has clearly migrated to one.

---

## Repo Structure

```text
src/
├── components/
│   ├── auth/            # Account and customer state
│   ├── games/           # Interactive games and simulations
│   ├── global/          # Header, footer, nav
│   ├── gallery/         # Gallery-specific components
│   ├── grimoire/        # Grimoire-specific components
│   ├── projects/        # Project cards and detail views
│   ├── sections/        # Page sections
│   ├── shop/            # Product, cart, and order components
│   ├── support/         # Funding and membership presentation
│   └── ui/              # Buttons, cards, inputs, primitives
├── content/
│   ├── academy/         # Courses and lessons
│   ├── adventures/      # Interactive or serialized adventure entries
│   ├── articles/        # Public Editorial articles
│   ├── comics/          # Comic entries outside the article feed
│   ├── gallery/         # Visual archive records
│   ├── grimoire/        # Knowledge and reference records
│   ├── products/        # Canonical Shop records
│   ├── projects/        # Tools, games, systems, and ongoing work
│   ├── help/            # Customer Help content
│   ├── legal/           # Public policies
│   ├── changelog/       # Site and project changes
│   └── ...
├── layouts/
├── lib/
├── pages/
├── styles/
└── data/

functions/api/           # Cloudflare Pages Functions
public/                  # Static assets, _headers, _redirects
astro.config.mjs
.pages.yml
```

Do not hand-edit generated output in `.astro/` or `dist/`.

---

## Standard Work Procedure

For every task:

1. Confirm the repository is on `main`, then run or inspect `git status --short`.
2. Identify existing uncommitted changes.
3. Avoid overwriting unrelated user or agent changes.
4. Inspect relevant files before editing.
5. Make focused edits.
6. Run the correct validation command.
7. Fix validation errors caused by the task.
8. Leave validated work in the shared `main` worktree for user review.
9. Commit or push only when the user explicitly asks for that Git action in the
   current task.
10. Summarize files changed, commands run, and results.

If uncommitted changes exist in files you need to edit, inspect them first. Do not overwrite them blindly.

---

## Single-Branch Workflow

HobFarm is maintained by one person using AI tools. `main` is the only working,
publishing, and deployment branch.

Use these rules for every task:

1. Work directly on `main`.
2. Do not create feature branches, preview branches, alternate branches, or Git
   worktrees.
3. Do not leave work in a detached HEAD or another branch. Finished files may
   remain as uncommitted changes in the shared `main` worktree.
4. Use `npm run dev`, `npm run preview`, Chrome, or local Playwright for review.
   Do not create a branch to obtain a preview deployment.
5. Keep both complete and incomplete work on `main` as uncommitted files when
   the user has not requested a commit. Clearly label actual draft content; do
   not treat every uncommitted file as a draft or use a branch as a holding area.
6. When several agents are active, coordinate file ownership in the same
   worktree and preserve each other's changes.
7. Do not create a commit or push merely because the work is complete. Commit
   to `main` only when the user explicitly asks for a commit, and push
   `origin/main` only when the user explicitly asks for a push or publication.
8. Before handoff, verify that `main` is checked out. Require a clean working
   tree only when the user requested a commit, and require `main` to match
   `origin/main` only when the user requested a push.

If the repository is not on `main`, safely move the existing work onto `main`
before continuing. Preserve all uncommitted work and unmerged commits. Do not
solve the problem by creating another branch.

---

## Commands

Use npm because `package-lock.json` is committed.

```bash
npm install
npm run dev
npm run build
npm test
npm run preview
npx astro check
```

Before assuming a script exists, inspect `package.json`.

Use `npm run build` as the main validation command.

Use `npm test` for Node-based structural tests. Test files should live in `tests/` and use the `*.test.mjs` suffix.

Use `npx astro check` when touching:

* content schemas
* Markdown frontmatter
* Astro types
* TypeScript
* TSX
* layout props
* component props

Use `npm run preview` for local visual review after a production build.

---

## Git Safety

Multiple agents may touch this repo across different tools.

Before editing:

```bash
git status --short
```

If there are unrelated changes, preserve them.

Do not create branches or worktrees for parallel work. Coordinate changes in
the shared `main` worktree and avoid editing the same files concurrently.

Keep changes scoped to the requested task.

Do not restyle unrelated pages.

Do not normalize unrelated files.

Do not run destructive git commands unless explicitly instructed.

Avoid:

```bash
git reset --hard
git clean -fd
git checkout -- .
git push --force
```

unless the user explicitly requests that exact kind of cleanup and understands the effect.

---

## Website Direction

The site should read as the home of an independent publisher and creative studio.

Use these terms consistently:

* **HobFarm** for the parent publisher and studio.
* **Editorial** for the publication division; **Articles** for its main public feed and content type.
* **HobFarm Presents** or **Presents** for recurring stories, characters, entertainment series, and developed worlds.
* **Workshop** for production methods, experiments, tools, and systems.
* **Shop** for the commercial directory and HobFarm-controlled direct merchandise.
* **Support HobFarm** for one-time Ko-fi funding and the monthly HobFarm Club.
* **Games and applications** for playable work and public software. Give released work a direct route and associate it with Presents, Projects, or Workshop according to its actual role.
* **Gallery** for the shared visual archive.
* **Academy** for free and affordable one-time workflow courses. Membership is not the default course checkout.
* **Projects** for the catalog of tools, games, applications, systems, and work in progress.
* **Customer Help** for billing, orders, downloads, account access, refunds, and technical assistance.
* **Grimoire** only where it is useful as a knowledge system, project memory, application data layer, or reviewed public reference.

New Editorial entries live in `src/content/articles/`; do not introduce a `blog` collection or new helper naming.

Do not describe all of HobFarm as a magazine, an AI tool company, a gallery, or a store. Those are parts of the publisher, not the parent identity.

Use plain descriptive copy. Say what the thing is, what it contains, and what the reader can do next.

Let the content establish the tone. Do not label the work as strange, weird, unusual, or similar vibe words in core positioning.

---

## Homepage Rules

When working on the homepage, treat it as the front door to the publisher.

Preferred order:

1. Hero intro identifying HobFarm as an independent publisher of articles, media, games, and creative systems.
2. Current lead release. This can be an article, Presents title, game, application, visual feature, course, or Shop release.
3. Latest Articles or Editorial highlights.
4. HobFarm Presents titles, characters, games, or recurring media.
5. Workshop work and useful Gallery evidence.
6. Academy or Projects when there is a real public path.
7. Current Shop releases.
8. Support HobFarm, About, or another clear publisher-level next action.

The homepage should quickly answer:

1. What is HobFarm?
2. What is new or worth opening now?
3. What can I read, watch, play, or explore?
4. Which recurring titles and projects exist?
5. What can I learn or buy?
6. How can I support the next release or contact the publisher?

---

## Article Rules

Articles are the main Editorial objects. They are not wrappers for every game, product, comic, course, or Presents release.

Article pages should include:

1. Title.
2. Date.
3. Description or dek.
4. Hero image when available.
5. Tags.
6. Share actions.
7. Related articles.
8. Related gallery or project links when relevant.
9. Related products, Workshop, Academy, Support, or follow actions when relevant.
10. Good metadata for social previews.

Recommended article metadata where the schema supports it:

```ts
title: string;
excerpt: string;
dek?: string;
description?: string;
publishedAt?: Date | string;
pubDate?: Date | string;
updatedDate?: Date | string;
heroImage?: string;
tags?: string[];
format?: string;
series?: string;
department?: string;
relatedGallery?: string;
relatedProject?: string;
relatedArticles?: string[];
relatedWorkshop?: string[];
relatedAcademy?: string[];
relatedProducts?: string[];
```

Every article needs `publishedAt` or `pubDate`. Inspect `src/content.config.ts` for current enums and relationship fields before creating frontmatter.

New scheduled articles should normally publish at 4:20 p.m. in the `America/Los_Angeles` time zone, spaced 24 hours apart. Preserve publication times that were already scheduled unless the user asks to change them. Use the correct UTC offset for the release date so daylight saving time is handled explicitly.

Keep optional fields optional unless the user explicitly requests a schema migration.

### Publication automation boundary

Use existing publication infrastructure. Content is data inside the publishing system, not a reason to create another publishing system.

- An ordinary article task may change content, media, metadata, relationships, and scheduled publication data. Do not create an article-specific workflow, cron job, deployment path, build pipeline, permanent CI test, or other infrastructure unless the user explicitly requests it or the existing architecture demonstrably requires it.
- Never commit, push, or deploy an article automatically. Leave completed changes on `main` for user review unless the current request explicitly authorizes the outward Git or deployment step.
- Remove temporary task scaffolding before completion unless it has become intentional durable infrastructure.
- Test durable publishing behavior and content invariants. Do not require temporary task artifacts to remain in the repository.
- Investigate full-suite failures caused by likely stale task residue. Do not dismiss them as unrelated without tracing the current intent.
- Do not add CI/CD automation merely because automation is possible.

## Editorial Mesh Rules

When creating, substantially editing, classifying, scheduling, publishing, or changing navigation for an Editorial article, read and follow `.agents/skills/editorial-mesh/SKILL.md` before finalizing the work.

The visible publication may use a small set of broad sections, but article relationships are a mesh. Do not force series, subjects, people, places, events, works, source artifacts, and related articles into a single category tree.

The current corpus is the source of truth for editorial classification. Market research may improve professional proof, distribution, automation, and business offers, but it must not drive article taxonomy.

Hard series rules:

- Magazine Time Machine requires a specific old magazine artifact to directly originate or materially drive the article.
- 3DM requires an actual Dick Miller connection and the article must use that connection as part of the series logic.
- Do not infer either series from thematic similarity.

After substantial article work, run the editorial mesh pass defined by the skill and preserve existing URLs and explicit related-article overrides.

## Publication Architecture

Treat `docs/site-architecture.md` as the durable public route map and `src/data/editorial-mesh.ts` as the executable Editorial registry. The primary publisher navigation remains Articles, Presents, Workshop, Academy, Shop, and About.

Editorial has exactly six canonical section archives: Technology, Art & Design, Culture, Film & TV, Music, and Places & Systems. Sections are the human navigation layer. Series and subjects are separate discovery layers; do not present them as additional sections.

Only subjects shared by at least two released articles receive public topic routes. Strict `mesh.series` membership owns Magazine Time Machine, 3DM, and Built Over presentation. Legacy department and series fields may remain for compatibility, but they must not decide canonical URLs or public membership.

After a production build, run `npm run audit:site-structure` when changing navigation, routes, sitemap behavior, RSS, canonicals, structured data, or public article relationships.

---

## HobFarm Presents Rules

HobFarm Presents holds recurring entertainment titles: stories, illustrated fiction, cartoons, film and media series, characters, and developed worlds.

A Presents title should explain:

1. What the title is.
2. Which entries or releases exist now.
3. Where a new reader should start.
4. Which characters, articles, videos, games, galleries, or products belong to it.
5. Whether the work is released, serialized, in production, or still a prototype.

Use the dedicated `comics` or `adventures` collection when the schema and route already support that object. Do not force a comic, episode, or interactive entry into Articles only to make it publishable.

---

## Games and Applications Rules

Games and applications are published HobFarm work.

Current examples include Other Alice as interactive story/game work, StyleFusion as a creative application, Grimoire as a knowledge system and developing game engine, and smaller browser experiments such as the craps simulator.

Use these rules:

1. Give a released game or public application a durable direct route.
2. Use Projects for its catalog record, status, related work, and development context.
3. Associate entertainment games and interactive stories with HobFarm Presents when they belong to a recurring title or world.
4. Associate production tools and research applications with Workshop when the method is part of their public value.
5. Keep prototypes labeled honestly. Do not imply a complete game, supported service, multiplayer system, or maintained application when only an experiment exists.
6. Document controls, accessibility, persistence, data use, browser support, and failure states when they affect play or use.
7. Keep secrets, privileged model calls, customer data, and paid assets out of client-only code.

Games do not need an article to justify their existence. Add an article only when there is a real editorial story, investigation, release note, or design analysis to publish.

---

## Social Sharing Rules

Every article should be easy to share.

Required metadata for article pages:

| Field                  | Purpose                     |
| ---------------------- | --------------------------- |
| `og:title`             | Social preview headline     |
| `og:description`       | Social preview text         |
| `og:image`             | Social preview image        |
| `og:url`               | Canonical URL               |
| `twitter:card`         | Large card preview support  |
| JSON-LD Article schema | Structured article metadata |

Preferred share actions:

* Copy link
* Facebook
* Threads
* Bluesky
* X
* Reddit
* Email

Keep share controls visible, clean, and secondary to the article.

---

## Gallery Rules

Gallery is a shared visual archive. Its entries can support Editorial, HobFarm Presents, Workshop, Projects, games, and Shop without becoming a separate business division.

They should prioritize:

1. Strong image presentation.
2. Clear title and description.
3. Related article or project links.
4. Useful metadata.
5. Mobile readability.
6. Fast loading.
7. Durable CDN image paths.

Prefer media hosted on:

```text
https://cdn.hob.farm/gallery/{gallery-slug}/
https://cdn.hob.farm/projects/{project-slug}/
https://cdn.hob.farm/site/
```

Do not add large media files to the repo unless explicitly instructed.

---

## Projects Rules

Projects is the public catalog for games, applications, systems, tools, experiments, and ongoing work. Recurring entertainment titles and worlds should use HobFarm Presents as their primary public home when that structure fits.

A project page should explain:

1. What it is.
2. What exists now and its honest status.
3. Where to see examples.
4. How it connects to Articles, Presents, Gallery, Workshop, Academy, games, or Shop.
5. What the reader can do next.

Do not call a tool, game prototype, recurring title, or creative system a product unless there is a defined Shop offer, buyer, deliverable, price, license, and fulfillment path.

---

## Workshop Rules

Workshop pages explain how work is made.

Use Workshop for:

* process notes
* production methods
* model tests
* tool notes
* prompts and structured workflows
* revisions and failures
* before/after analysis
* build notes
* website systems

Workshop content should help readers understand the method without becoming a generic tutorial unless the task asks for one.

---

## Academy Rules

Academy is the structured learning program connected to Workshop. It is important, but it is not the parent identity or a peer to every publishing division.

Use Academy for:

* free onboarding material
* affordable one-time courses
* workflow packs
* structured learning paths
* tool literacy
* production systems
* templates or reusable methods

Academy content should connect naturally from Workshop, Articles, Presents, Gallery, Projects, and Shop pages when the course grows from that work.

Use the approved course lanes unless the user supplies a different price:

| Course type | Price |
| --- | --- |
| Quick lesson, checklist, or focused fix | $5 |
| Standard short workflow course | $7 |
| Workflow with templates or source files | $9 |
| Multi-part course bundle | $24 to $35 |

Seven dollars is the default for a standard short course. Do not turn HobFarm Club into an all-purpose subscription for courses, products, and downloads.

The Avatar Content System has a legacy membership entitlement. Inspect active access before changing it. Grandfather existing members or provide a clear transition; do not silently remove access.

---

## Shop and Product Rules

Shop is a map, not an inventory aggregator. It is the official commercial directory and the direct store for HobFarm-controlled merchandise.

Use this channel structure:

| Surface | Job | Main offers |
| --- | --- | --- |
| HobFarm Shop | Commercial directory and direct merchandise store | Approved Printful merchandise, publication products, and clear links to the correct external shelf |
| Academy | Teach repeatable methods | Free lessons, affordable one-time workflow courses, modular courses, and larger bundles |
| Etsy | Craft and search-oriented digital products | Clip art, scrapbook assets, seasonal packs, printable ephemera, decorative scenes, and clearly labeled archive collections |
| DeviantArt | Character and visual-development assets | Mannequins, outfits, sheets, wallpapers, premium packs, adoptables, and exclusives |
| eBay | Actual old or counted physical objects | DVDs, magazines, books, antiques, collectibles, decor, media, and one-off finds |
| Ko-fi | One-time reader support | Tips and project funding |
| HobFarm Club | Ongoing support | $5 monthly supporter membership with one small durable benefit |
| Patreon | Paused | Preserve the account and history, but do not surface Patreon publicly unless a distinct future community is approved |

The Shop should explain what each shelf contains and send people to the correct storefront. Do not copy every Etsy, DeviantArt, or eBay listing into HobFarm. Marketplace listings expire, move, and sell out; aggregating them creates stale inventory and maintenance work.

HobFarm-controlled direct products may have permanent Shop pages and on-site checkout. External shelves should normally use clear category descriptions and storefront links. Add an individual marketplace listing only when its relationship to an article or release is useful enough to maintain manually.

Every Shop product page should state:

1. What the buyer receives.
2. Current status and availability.
3. Price and currency when approved.
4. Product variants or editions.
5. License or usage terms.
6. Fulfillment and checkout provider.
7. Shipping or delivery expectations.
8. Refund and Customer Help paths.
9. Related free work when the relationship is real.

Keep public previews separate from buyer files. Do not expose full-resolution paid originals, private manifests, signed download URLs, order data, or customer details in HTML, feeds, JSON-LD, sitemaps, agent-readable routes, or client code.

Do not invent products, prices, listings, stock, marketplace availability, course access, shipping promises, or licenses. A buy action appears only when the product is live and its checkout destination has been verified.

When Workshop needs commercial links, use one shared relationship component with up to three paths:

1. **Learn the method:** the related Academy course, price, time, and expected result.
2. **Use the finished assets:** the related Etsy or DeviantArt collection.
3. **Support more work:** Ko-fi or HobFarm Club.

Reuse `relatedWorkshop`, `relatedAcademy`, `relatedProducts`, `workshopCTA`, `academyCTA`, and `supportCTA`. Do not write a new custom sales block into every Workshop page or force every page into a funnel.

---

## Support and Customer Help Rules

`/support/` funds the publisher. Use it for one-time Ko-fi support, HobFarm Club membership, buying products or courses as another way to fund the work, and a plain account of what greater revenue could make possible.

`/helpcenter/` serves customers. Use it for billing, orders, downloads, course access, refunds, accounts, and technical help.

Do not mix patronage with customer service. Do not describe support as a purchase, donation, or tax-deductible contribution unless the legal and tax status explicitly permits that language.

Use `/membership/` for HobFarm Club, the account-linked $5 monthly support program. Keep Shop purchases and new Academy courses separate from membership. Promise one small durable supporter benefit, not a broad subscription to products and downloads.

The accurate advertising and funding claim is:

> No third-party display ads, sponsored posts, or paid editorial placement.

House ads, Shop links, course promotion, clearly labeled affiliate links, and support requests may still appear. Do not flatten that claim into “ad-free.”

Patreon is paused. Remove it from public funding copy, Shop, Support, navigation, components, and structured metadata. Preserve the account and historical records; this is a public-site cleanup, not account deletion.

Do not add a Jobs page. The existing Contribute path should state that unsolicited employment applications are not accepted. Publish future paid assignments only when the budget, scope, and role are real.

---

## Affiliate Link Rules

Affiliate links belong near relevant tool demonstrations in Workshop and Academy. Do not turn Editorial articles into disguised product funnels.

Every affiliate recommendation needs a nearby disclosure:

> Affiliate link: HobFarm may earn a commission if you buy through this link. It does not change your price.

A footer or legal-page disclosure alone is not enough. Keep the disclosure close to the endorsement or recommendation.

---

## Grimoire Rules

Grimoire is the knowledge and structure layer.

Use Grimoire for:

* rough notes
* reference organization
* project memory
* article seeds
* gallery seeds
* workshop seeds
* character and series notes
* link maps
* admin planning
* Codex task packets
* model-generated structure that needs review

Grimoire is not the main public publication layer. Articles are the public editorial layer.

Public Grimoire pages should exist only when they are useful to readers. Otherwise, Grimoire can remain internal, admin-facing, or semi-private.

When adding Kimi or Workers AI features, prefer Grimoire workflows before generic chatbot workflows.

Useful Kimi-powered Grimoire modes:

* ingest note
* extract concepts
* link related entries
* article brief
* gallery brief
* workshop brief
* Codex packet
* Codex plan review
* build error debug
* social fragment generator

Do not auto-publish AI-generated content. Generate, review, then publish.

---

## Admin AI Rules

Admin AI tools are private.

They may help with:

* article drafts
* frontmatter repair
* tag generation
* Grimoire entry resolution
* Codex task packets
* build error diagnosis
* social captions
* gallery briefs
* workshop notes

They must not be public unless explicitly requested.

Use server-side functions. Do not call model APIs directly from browser-only code.

Protect admin endpoints with existing auth. If no auth exists, use a server-side secret until a proper admin gate is connected.

Do not expose secrets in client code.

For Cloudflare Workers AI, use a binding named `AI` when implemented.

---

## Content Creation Procedure

When creating website content:

1. Identify the primary published object: article, Presents entry, comic, adventure, game or application route, gallery entry, project page, Workshop note, Academy lesson, product, support page, changelog entry, or Grimoire entry.
2. Inspect the matching collection schema.
3. Create valid YAML frontmatter.
4. Use kebab-case filenames.
5. Write clear titles and descriptions.
6. Add useful tags.
7. Use CDN image URLs when supplied.
8. Link related Articles, Presents titles, galleries, projects, games, Workshop notes, courses, or products when relevant.
9. Run validation.

Do not invent missing facts, routes, image URLs, or product details.

If required inputs are missing, use placeholders only when the task allows it and mark them clearly.

---

## Styling Rules

Use existing site patterns first.

When making layout or visual changes:

1. Inspect current components and styles.
2. Use Tailwind utilities already common in the repo.
3. Keep contrast readable.
4. Keep mobile layouts clean.
5. Avoid heavy client-side JavaScript for static content pages.
6. Avoid sweeping redesigns unless explicitly requested.

Do not preserve outdated visual branding rules when they conflict with current site direction.

Do not flatten the site into generic SaaS minimalism.

Do not add decorative language or theme concepts just because older docs used them.

---

## Component Rules

Use Astro components for layout, static content, and page composition.

Use React or TSX only when interactivity, state, or existing component architecture requires it.

Component rules:

* PascalCase filenames.
* One responsibility per component.
* Prefer props over hardcoded content.
* Prefer `@/` imports from `src/`.
* Keep route files lean.
* Use semantic HTML.
* Use static rendering by default.
* Use `client:visible` or `client:idle` instead of `client:load` unless immediate hydration is required.

---

## Content Schema Rules

Schemas live in `src/content.config.ts`.

PagesCMS config lives in `.pages.yml`.

When changing fields:

1. Update `src/content.config.ts`.
2. Update `.pages.yml` if the CMS needs the field.
3. Update templates and components consuming the field.
4. Preserve backward compatibility where practical.
5. Run validation.

Do not make optional fields mandatory unless the task explicitly requires it.

---

## CDN Rules

Use full CDN URLs for CDN-hosted assets.

```text
https://cdn.hob.farm/projects/{project-slug}/
https://cdn.hob.farm/gallery/{gallery-slug}/
https://cdn.hob.farm/grimoire/
https://cdn.hob.farm/site/
```

Accepted image formats:

* `.png`
* `.jpg`
* `.webp`

Accepted video formats:

* `.mp4`
* `.gif`

Use local `public/` assets only for files intentionally served from the repo.

---

## Cloudflare Rules

Cloudflare Pages deploys from `main`.

Use local development and preview commands for review. Do not create
non-production branches for Cloudflare preview deployments.

Pushing a validated commit to `origin/main` triggers the normal HobFarm
publishing workflow, but the single-branch policy does not authorize an
automatic push. Push only when the user explicitly requests publication or a
push. Direct Wrangler deployments and Cloudflare configuration changes also
require explicit approval.

Cloudflare Pages Functions live in:

```text
functions/api/
```

Do not mutate Cloudflare resources unless explicitly approved.

This includes:

* Pages settings
* environment variables
* secrets
* DNS
* R2
* KV
* D1
* Workers
* routes
* production deployments
* remote migrations

Safe local or read-only commands include:

```bash
npx wrangler whoami
npx wrangler pages dev
npx wrangler pages project list
```

Commands requiring explicit approval include:

```bash
npx wrangler pages deploy
npx wrangler deploy
npx wrangler secret put
npx wrangler d1 migrations apply --remote
npx wrangler d1 execute --remote
```

Treat logs as sensitive. Summarize logs instead of pasting raw user data, tokens, request bodies, emails, or secrets.

---

## Functions Rules

When touching `functions/api/*`:

1. Inspect the existing function style.
2. Confirm request method.
3. Validate request body.
4. Keep secrets server-side.
5. Return clean JSON errors.
6. Test locally when practical.
7. Summarize endpoint behavior tested.

Do not expose model APIs, auth tokens, or internal secrets to browser code.

---

## Security Rules

Never commit:

* `.env`
* `.dev.vars`
* API keys
* service tokens
* OAuth secrets
* generated credentials
* raw logs
* session dumps
* private user data

Use `you@example.com` for email input placeholders.

Route public contact through `/contact/`.

Use `/contact/?subject=security` for security-related contact paths.

Do not invent new visible contact addresses.

---

## Validation Checklist

Before finishing a task, check what applies:

1. `npm run build` passes.
2. `npx astro check` passes when relevant.
3. No broken imports.
4. No schema errors.
5. No missing content references.
6. Touched routes load.
7. Images resolve.
8. Mobile layout remains readable.
9. CTAs point to real routes.
10. Article metadata is present when article pages are touched.
11. Share previews have title, description, image, and URL when sharing is touched.
12. No secrets were committed.

Do not claim a visual check was completed unless preview or browser QA was actually performed.

---

## Browser QA Checklist

### Browser/Chrome Tooling Note

In this local Codex setup, the **Chrome plugin** is the usable browser tool for visual QA.

Do not spend time trying to debug the bundled Browser plugin if the in-app browser instance is missing. The Browser plugin may appear installed and enabled on disk, but `agent.browsers.list()` can still return `[]` and `agent.browsers.get("iab")` can fail because no live `iab` instance is exposed to the session.

For rendered UI validation, use this order:

1. Use the Chrome plugin when browser tooling is available or the user asks for browser QA.
2. Use local Playwright as the fallback when Chrome is unavailable.
3. Record the fallback reason briefly in the final response.

For UI-facing changes, validate:

* desktop viewport
* mobile viewport
* header and navigation
* footer
* overflow
* image/media loading
* readability
* contrast
* interactive components when hydration is involved

Summarize what was checked. Do not dump raw screenshots unless requested.

---

## Commit Rules

Use short imperative commit messages.

Examples:

```text
feat(articles): add latest feed to homepage
fix(gallery): correct hero image metadata
docs(site): update agent guide
feat(grimoire): add resolve endpoint
style(home): tighten article card spacing
```

When the user explicitly requests a commit, commit validated website work
directly to `main`. Push `origin/main` only when the user explicitly requests a
push or publication. Otherwise, leave the reviewed changes uncommitted in the
shared `main` worktree. Do not create a pull request, PR branch, review branch,
or separate worktree for the normal HobFarm workflow.

---

## Final Response Requirements

At the end of a task, report:

* files changed
* commands run
* build/check result
* visual QA result if applicable
* skipped validation and why
* `main` push status and observed deployment status when a push was requested

Do not claim that Cloudflare finished deploying unless its status was actually
checked. Distinguish a successful `main` push from a confirmed production
deployment.

---

## Operating Principle

Make HobFarm easier to publish, read, watch, play, learn from, buy from, support, and maintain.

Keep the business legible:

```text
HobFarm publishes articles, media, games, applications, and recurring titles
Workshop shows how selected work was made
Academy teaches a repeatable method
Shop and external shelves sell useful finished outcomes
Ko-fi and HobFarm Club fund the next round
Customer Help handles orders, access, accounts, and problems
```

Connect these areas only when the relationship is real. Keep the work scoped. Make the site clearer. Validate before handoff.
