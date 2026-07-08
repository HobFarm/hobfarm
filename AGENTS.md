# AGENTS.md: HobFarm Repository Guide

## Purpose

This repository contains the HobFarm website.

HobFarm is an online magazine and visual studio. The site publishes articles, visual galleries, recurring projects, production notes, workflow education, and support paths.

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

## Current Site Model

Use this model when making site decisions:

| Area     | Role                                                                                       |
| -------- | ------------------------------------------------------------------------------------------ |
| Homepage | Front page, hero intro, featured routes, latest articles                                   |
| Articles | Main editorial feed                                                                         |
| Gallery  | Visual archive for image sets, character sheets, experiments, and finished media           |
| Projects | Recurring characters, series, tools, worlds, and formats                                   |
| Workshop | Process notes, production methods, systems, and behind-the-scenes work                     |
| Academy  | Workflow education, onboarding, courses, and paid learning paths                           |
| Support  | Ko-fi, Patreon, sponsor paths, contact, and collaboration routes                           |
| Grimoire | Knowledge and structure layer for notes, references, content planning, and admin workflows |

The website should support this loop:

```text
publish on hob.farm
share fragments on social media
bring readers back to the article, gallery, project, workshop note, or academy page
connect them to related content
make sharing, following, supporting, or learning the obvious next action
```

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

## Stack

| Layer     | Technology                                     |
| --------- | ---------------------------------------------- |
| Framework | Astro 6                                        |
| Language  | TypeScript                                     |
| Styling   | Tailwind CSS v4, CSS-first setup               |
| CMS       | PagesCMS, configured in `.pages.yml`           |
| Content   | Astro content collections in `src/content/`    |
| Hosting   | Cloudflare Pages                               |
| Functions | Cloudflare Pages Functions in `functions/api/` |
| CDN       | Cloudflare R2 at `https://cdn.hob.farm`        |

Tailwind 4 uses CSS-first configuration. Inspect `src/styles/` before changing styling architecture. Do not create a Tailwind 3-style config unless the repo has clearly migrated to one.

---

## Repo Structure

```text
src/
├── components/
│   ├── global/          # Header, footer, nav
│   ├── gallery/         # Gallery-specific components
│   ├── grimoire/        # Grimoire-specific components
│   ├── projects/        # Project cards and detail views
│   ├── sections/        # Page sections
│   └── ui/              # Buttons, cards, inputs, primitives
├── content/
│   ├── articles/        # Public editorial articles
│   ├── gallery/
│   ├── grimoire/
│   ├── projects/
│   ├── changelog/
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

1. Run or inspect `git status --short`.
2. Identify existing uncommitted changes.
3. Avoid overwriting unrelated user or agent changes.
4. Inspect relevant files before editing.
5. Make focused edits.
6. Run the correct validation command.
7. Fix validation errors caused by the task.
8. Summarize files changed, commands run, and results.

If uncommitted changes exist in files you need to edit, inspect them first. Do not overwrite them blindly.

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

If parallel work is needed, use separate branches or worktrees.

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

The site should read as an online magazine and visual studio.

Use clear public labels:

* Articles
* Gallery
* Projects
* Workshop
* Academy
* Support
* Grimoire, only where it is useful as a knowledge or admin system

The public editorial feed is **Articles**. New editorial entries live in `src/content/articles/`; do not introduce new `blog` collection or helper naming.

Use plain descriptive copy. Say what the thing is, what it contains, and what the reader can do next.

Let the content establish the tone. Do not label the work as strange, weird, unusual, or similar vibe words in core positioning.

---

## Homepage Rules

When working on the homepage, treat it as the front page of the publication.

Preferred order:

1. Hero intro explaining HobFarm as an online magazine and visual studio.
2. Featured article or current lead feature.
3. Latest Articles feed.
4. Project or series cards.
5. Gallery preview.
6. Workshop or Academy CTA.
7. Support, sponsor, contact, or follow CTA.

The homepage should quickly answer:

1. What is HobFarm?
2. What can I read?
3. What can I look at?
4. What recurring work exists here?
5. Where should I go next?

---

## Article Rules

Articles are the main editorial objects.

Article pages should include:

1. Title.
2. Date.
3. Description or dek.
4. Hero image when available.
5. Tags.
6. Share actions.
7. Related articles.
8. Related gallery or project links when relevant.
9. Workshop, Academy, Support, or follow CTA when relevant.
10. Good metadata for social previews.

Recommended article metadata where the schema supports it:

```ts
title: string;
description: string;
pubDate: Date | string;
updatedDate?: Date | string;
heroImage?: string;
tags?: string[];
series?: string;
department?: string;
relatedGallery?: string;
relatedProject?: string;
ctaType?: "share" | "gallery" | "academy" | "support" | "project" | "workshop";
```

Keep optional fields optional unless the user explicitly requests a schema migration.

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

Gallery pages are the visual archive.

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

Project pages should describe recurring work, systems, tools, characters, worlds, or formats.

A project page should explain:

1. What it is.
2. What exists now.
3. Where to see examples.
4. How it connects to articles, galleries, workshop notes, or academy material.
5. What the reader can do next.

Do not call HobFarm tools or recurring creative systems “products” unless the page is specifically about physical goods, store items, or product design work.

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

Academy pages are for workflow education.

Use Academy for:

* free onboarding material
* paid courses
* workflow packs
* structured learning paths
* tool literacy
* production systems
* templates or reusable methods

Academy content should connect naturally from Articles, Gallery, Projects, and Workshop pages.

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

1. Identify the right content type: article, gallery entry, project page, workshop note, academy page, support page, changelog entry, or Grimoire entry.
2. Inspect the matching collection schema.
3. Create valid YAML frontmatter.
4. Use kebab-case filenames.
5. Write clear titles and descriptions.
6. Add useful tags.
7. Use CDN image URLs when supplied.
8. Link related articles, galleries, projects, or workshop notes when relevant.
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

Preview deployments come from non-production branches.

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

## Commit and PR Rules

Use short imperative commit messages.

Examples:

```text
feat(articles): add latest feed to homepage
fix(gallery): correct hero image metadata
docs(site): update agent guide
feat(grimoire): add resolve endpoint
style(home): tighten article card spacing
```

Pull requests should include:

1. User-facing summary.
2. Main files changed.
3. Routes changed.
4. Validation performed.
5. Screenshots for UI changes when practical.
6. Known follow-up work.

---

## Final Response Requirements

At the end of a task, report:

* files changed
* commands run
* build/check result
* visual QA result if applicable
* skipped validation and why
* deploy status, skipped unless explicitly approved

Do not claim deployment unless a deploy command was approved and run.

---

## Operating Principle

Make HobFarm easier to publish, browse, share, and maintain.

Improve the loop:

```text
site content
social fragments
reader returns
related content
share or support
new content
```

Keep the work scoped. Make the site clearer. Validate before handoff.
