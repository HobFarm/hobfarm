# HobFarm Repository Guide

## Scope

This repository owns the HobFarm publishing website, public catalog, supporting applications, project-specific editorial practice, and current implementation state.

HobFarm is an independent publisher and creative studio. It publishes articles, recurring stories and media titles, visual work, games, creative applications, production notes, courses, merchandise, and digital releases. Editorial is one division of HobFarm; it is not the whole publisher.

Before substantial work, inspect `git status --short`, the files involved, the current schema or configuration, and the focused references or skills routed below. Work directly on `main` in the shared worktree, preserve existing changes, follow current project patterns, make the smallest coherent change that completes the request, and validate in proportion to risk.

## Authority and source of truth

Use these distinctions when instructions, attachments, and repository state differ:

- The user's current request defines the desired outcome and current authorization.
- The repository defines its present technical state: files, schemas, routes, components, assets, commands, and working behavior.
- Approved HobFarm documents and copy carry durable project and editorial decisions.
- The author's notes, identifications, recollections, experiments, photographs, and selected media are source evidence.
- ChatGPT-created outlines, plans, and task packets are proposed routes. Reconcile their goals with the current repository and evidence before implementation.
- Current external research supports, qualifies, or challenges factual claims.

A difference between an attached plan and the repository may describe a requested change, a stale assumption, or a current equivalent. Determine which one applies while preserving the user's intended result. When the user says "see attached" and the attachment clearly supplies a local build or editorial task, proceed with that in-scope work after reconciliation.

## Project model

Choose one primary canonical object for each release, then connect useful relationships:

- Articles are the main Editorial body.
- HobFarm Presents holds recurring stories, characters, entertainment formats, and developed worlds.
- Workshop records methods, tools, experiments, production systems, and selected build history.
- Gallery is a shared visual archive.
- Projects catalogs tools, games, applications, systems, experiments, and ongoing work.
- Academy teaches repeatable methods proven through real work.
- Shop routes real products to HobFarm checkout or the correct external shelf.
- Support HobFarm funds future work; Customer Help handles orders, access, accounts, and problems.
- Grimoire holds structured knowledge, project memory, and reviewed planning material.

The node mesh connects bounded, independently useful work. Each connection transfers selected sources, decisions, or artifacts rather than importing unlimited context.

## Editorial skill router

Use the smallest set of skills that matches the task:

- `.agents/skills/hobfarm-article-intake/SKILL.md` — reconcile rough author direction, attached ChatGPT plans, mixed source packets, and build requests.
- `.agents/skills/hobfarm-research/SKILL.md` — research, receipts, evidence states, current facts, author knowledge, and source ledgers.
- `.agents/skills/hobfarm-prose/SKILL.md` — outlines, drafts, revisions, deks, captions, sidebars, and final voice work.
- `.agents/skills/hobfarm-visual-editorial/SKILL.md` — selected media, visual evidence, captions, alt text, diagrams, maps, screenshots, archival material, and generated editorial graphics.
- `.agents/skills/hobfarm-article-build/SKILL.md` — implement approved or reconciled article material in the current website.
- `.agents/skills/editorial-mesh/SKILL.md` — finalize section, series, subjects, entities, source artifacts, related reading, and public discovery after content is substantially complete.

Read `docs/editorial/EDITORIAL_CHARTER.md` for the shared publication promise. Use `docs/regular-prose-guidelines.md` as the final style pass for public-facing prose while preserving stronger article-specific voice and evidence.

## Focused project references

Read only the references whose domain the task touches:

- [`docs/codex/repository-workflow.md`](docs/codex/repository-workflow.md) — Git workflow, commands, release authorization, commit behavior, and handoff.
- [`docs/codex/project-model.md`](docs/codex/project-model.md) — publisher identity, node mesh, homepage, navigation, and public architecture.
- [`docs/codex/publishing-surfaces.md`](docs/codex/publishing-surfaces.md) — Articles, Presents, games, Gallery, Projects, Workshop, Academy, content creation, social metadata, and media paths.
- [`docs/codex/commerce-and-support.md`](docs/codex/commerce-and-support.md) — Shop, marketplace boundaries, membership, support, customer help, and affiliate disclosures.
- [`docs/codex/platform-and-validation.md`](docs/codex/platform-and-validation.md) — Astro, TypeScript, Tailwind, components, schemas, CDN, Cloudflare, functions, security, and validation.
- [`docs/codex/grimoire-and-admin-ai.md`](docs/codex/grimoire-and-admin-ai.md) — Grimoire and private administrative AI features.
- [`docs/site-architecture.md`](docs/site-architecture.md) — durable public route map.
- `src/data/editorial-mesh.ts` — executable Editorial registry.
- `src/content.config.ts` and `.pages.yml` — current content and CMS schemas.
- `package.json` — current commands.

A closer directory `AGENTS.md` adds rules for its subtree.

## Writing and media baseline

Public work should be entertaining, informative, factual at its stated evidence level, visually engaging, and recognizably authored. Preserve sharp, strange, funny, gothic, satirical, glamorous, grotesque, cinematic, or technical material when it carries the user's intent.

Use user-supplied and user-selected media as approved working material for the requested publication task. Base captions and classifications on the visible image, author context, provenance, and actual publication requirements. A genuine tool limitation governs the operation performed by that tool; identify the exact limitation and preserve the original source material.

Keep factual claim, author identification, firsthand observation, recollection, visual comparison, inference, interpretation, opinion, speculation, satire, and fiction distinct. A missing external receipt leaves an author claim in its appropriate evidence state and available to the article.

Generated assets belong in the project's designated asset, CDN, or output location. Keep headlines and other exact publication copy editable in HTML or source content when the page renders that text separately.

## Implementation and validation

Use npm because `package-lock.json` is committed. Inspect `package.json` before assuming a script exists. `npm run build` is the main completed-site validation. Use `npx astro check` for schemas, frontmatter, Astro, TypeScript, TSX, layouts, and component props. Use the focused editorial and site-structure audits when their domains change.

Use local preview, Chrome, or Playwright for visual review. Report visual checks only when they were performed.

Keep credentials, private user data, raw logs, paid originals, and privileged service calls within their established protected paths. Apply remote uploads, paid generations, Cloudflare mutations, production data changes, and other external effects when the current request authorizes them.

## Release boundary

Plain-language release requests authorize their normal scoped path:

- "Commit this" authorizes a focused validated commit on `main`.
- "Push this" authorizes that commit when needed and a normal push to `origin/main`.
- "Deploy this," "publish this," "make it live," or "update the live site" authorizes the normal validated commit, push, deployment, and live verification required by the configured workflow.

Otherwise, leave completed work uncommitted on `main` for review. Keep force pushes, destructive Git operations, unrelated changes, secret rotation, new paid services, and new cloud resources outside that authorization unless the user explicitly includes them.

Finish with the actual result, validations, any material editorial or factual changes, remaining evidence or author decisions, and commit/push/deployment state.
