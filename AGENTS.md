# Repository Guidelines

## Project Identity

This repository is the HobFarm website. It is built with Astro 6, Tailwind CSS 4, TypeScript, Cloudflare Pages Functions, and HobFarm-specific content systems.

The site is not a generic SaaS landing page. Preserve the HobFarm / StyleFusion / Grimoire identity: strange but usable, visual-system driven, media-lab oriented, underground/outsider in tone, and connected to the broader HobFarm ecosystem.

Default agent behavior: implement narrowly, validate with build/preview, and leave deploys or Cloudflare mutations to explicit user approval.

## HobFarm Seasonal Release Rhythm

HobFarm uses a flexible seasonal release rhythm.

- Year = 4 seasons.
- Season = 3 monthly character/cultivar cycles.
- Month = 1 base character or visual theme.
- 28 days = ROYGBIV growth cycle, 4 days per color.
- Final month days = harvest, packaging, gallery/process updates, social/DA/premium/shop/POD prep.

This rhythm is a creative scaffold, not a rigid rule system. Use it to organize content, metadata, pages, releases, and task suggestions. Do not block or reject useful work just because it does not fit the current phase.

## ROYGBIV Monthly Color Cycle

Default monthly cycle:

- Days 01-04: Red Phase
- Days 05-08: Orange Phase
- Days 09-12: Yellow Phase
- Days 13-16: Green Phase
- Days 17-20: Blue Phase
- Days 21-24: Indigo Phase
- Days 25-28: Violet Phase
- Days 29-31: Harvest / packaging

Each color phase may include seed/baseline work, variation, scene/video/model-handoff tests, selection, and field notes.

## Public Voice Direction

Public copy is plain and quickly understandable. Lead with what a thing is and does. The farm/cultivation metaphor is **not** required vocabulary and must not be used as decoration in headers, CTAs, or labels (keeper, specimen, grow log, greenhouse, "from signal to ___", "what grew here", cultivation paths). Organic-tech words are allowed only where they name a real structural system: the seasonal release rhythm above, or Grimoire's actual knowledge-graph concepts.

Avoid equally generic SaaS/AI-platform language ("leverage", "empower", "seamless", "scalable", "innovative", "orchestration" as marketing) and machine metaphors ("pipeline", "engine", "output" as decoration). Describe the actual thing.

Preserve HobFarm's dark, strange, polished identity through the work and the visual system, not the lingo: Atomic Noir, Art Deco, Vegas lab energy, black ground, cyan/purple/green/magenta accents, underground/outsider media-lab. Do not make the tone cute, rustic, cottagecore, corporate-biotech, or generic-startup.

`docs/brand/voice-glossary.md` is the source of truth for voice and palette; when it and this file disagree, the glossary wins.

## Gallery / Process / Release Roles

Use plain, literal surface names:

- Visuals = the gallery of finished images and video.
- Process / How It's Made = how a piece was made.
- Release = a season's collection.
- StyleFusion = the system that turns references into reusable prompt and metadata packages.
- Grimoire = the knowledge graph under HobFarm (how images, words, styles, references, and finished work connect).

Gallery pages describe artifacts: visual structure, palette, materials, locked and flexible traits, notes, media, search metadata, and related links.

Process pages describe methods: references, steps, model handoffs, revisions, failures, selection, and stabilization.

Release pages gather a season: monthly themes, featured pieces, write-ups, notes, premium previews, supporter notes, archives, and re-released editions.

## Seasonal Scarcity and Archive Logic

Seasonal releases may support a light scarcity model without fake urgency.

Public notes should remain useful when possible. Commercial packs, premium downloads, supporter extras, and expanded galleries can rotate, archive, or return as re-released or special editions.

Use honest language: "Older seasonal releases may rotate into the archive. Popular pieces can return later as re-released editions or expanded premium packs."

Avoid manipulative urgency: "Gone forever. Buy now."

## Non-Rigidity Rule

The seasonal/color system is a creative scaffold, not a compliance system.

Do:

- use season/month/color phase as organizing context
- suggest next tasks that fit the rhythm
- keep metadata optional and backward-compatible
- preserve creative flexibility
- help the operator package and monetize work without adding ceremony

Do not:

- force every artifact into every field
- block creative deviations
- overbuild scheduling automation
- create enterprise content operations
- turn the cycle into a rigid checklist

## Project Structure & Module Organization

`src/pages/` contains route entrypoints. Keep page files mostly declarative and compose them from `src/components/` and `src/layouts/`.

Feature components are grouped under folders such as `global/`, `gallery/`, `grimoire`, `projects/`, and `ui/`. Use existing folders and conventions before creating new ones.

Markdown content lives in `src/content/`, with collection schemas in `src/content.config.ts`. Frontmatter must match the configured content schemas.

Shared utilities belong in `src/lib/`, static data in `src/data/`, and site-wide styles in `src/styles/`.

Cloudflare Pages Functions live in `functions/api/`.

Use `public/` for static assets and deploy rules such as `public/_headers` and `public/_redirects`.

Do not hand-edit generated output in `.astro/` or `dist/`.

## Tooling and Agent Roles

This repo may be edited from Antigravity, VS Code, Codex CLI, Codex extension, Claude Code, or Antigravity's built-in agent system.

Use Codex or Claude Code for implementation work:

- component edits
- Astro routing
- Tailwind class changes
- content/schema changes
- Cloudflare Pages Function edits
- refactors
- build/debug cycles

Use Antigravity's built-in browser-capable agent primarily for visual QA and small UI polish:

- launch browser
- inspect rendered desktop/mobile layout
- catch spacing, overflow, contrast, and navigation issues
- verify interactions visually
- make small layout polish edits after implementation

Do not use browser agents for broad refactors, architecture changes, or large code edits unless visual inspection is required.

When Codex has the Cloudflare plugin enabled, use Cloudflare Skills/MCP for Cloudflare-specific docs and account inspection. Use Wrangler for local dev, dry-run, deploy, and migration commands. Do not let MCP or Wrangler mutate Cloudflare resources unless explicitly approved.

## Parallel Agent Safety

Multiple agents may be open at the same time across different projects. Avoid multiple agents editing the same repo/branch simultaneously.

If parallel work is needed in this repo, split work by branch or git worktree. Do not let two agents edit overlapping files in the same working tree.

Before editing, inspect current git status:

```bash
git status --short
```

If there are existing uncommitted changes, identify whether they are user-authored or agent-authored before editing. Do not overwrite unrelated changes.

For every task, keep changes scoped to the requested area. Do not opportunistically restyle unrelated pages or normalize unrelated files.

## Build, Test, and Development Commands

Use npm because `package-lock.json` is committed.

Common commands:

```bash
npm install
npm run dev
npm run build
npm run preview
npx astro check
```

`npm run dev` starts the Astro dev server with local proxying for API routes.

`npm run build` creates the production build in `dist/` and is the main pre-push validation step.

`npm run preview` serves the built site locally.

`npx astro check` is useful when changing content schemas, markdown frontmatter, Astro types, TS, or TSX.

Before making assumptions, inspect `package.json` for the actual scripts available in this repo.

## Validation Rules

For code/content changes, run:

```bash
npm run build
```

If the task touches content schemas, frontmatter, TS/TSX, or Astro typing, also run:

```bash
npx astro check
```

For visual/UI tasks, run the site locally and validate with preview or a browser-capable agent.

For touched `functions/api/*` endpoints, manually exercise the relevant endpoint locally when practical. Summarize the endpoint behavior tested.

No dedicated test runner or coverage threshold is currently configured. If automated tests are added, add the command to `package.json` and document the naming convention here.

## Browser QA Checklist

For UI-facing changes, final validation should include:

- desktop viewport check
- mobile viewport check
- navigation/header/footer check
- obvious overflow check
- image/media loading check
- readability and contrast check
- interactive component check if hydration is involved

When using the Antigravity browser agent, summarize observations and changes. Do not dump raw screenshots unless requested.

## Coding Style & Naming Conventions

Use 2-space indentation, double quotes, and semicolons in TS and TSX files.

Prefer the `@/` path alias for imports from `src/`.

Name components in PascalCase, for example `ProjectCard.astro`.

Keep content files kebab-case, for example `building-in-public.md`.

Keep page files thin. Move reusable logic into components or `src/lib/`.

Prefer static output and minimal hydration. Use `client:visible` or `client:idle` over `client:load` unless immediate hydration is required.

Do not introduce heavy client-side JavaScript for static marketing/content pages unless the task explicitly requires it.

## Astro Rules

Prefer Astro components for layout, static content, and page composition.

Use React/TSX components only where interactivity, state, or existing component architecture requires them.

Keep content/data separate from layout when practical.

Do not move content into hard-coded components if it belongs in `src/content/` or `src/data/`.

Do not create new global patterns without checking existing layout/component conventions.

## Tailwind CSS Rules

This project uses Tailwind CSS 4. Do not assume Tailwind 3 configuration patterns.

Before changing styling architecture, inspect existing CSS/theme setup in `src/styles/`, global CSS imports, and any Tailwind/PostCSS/Vite configuration present in the repo.

Prefer existing utility patterns, design tokens, theme variables, and component conventions.

Do not flatten the visual language into generic white-card SaaS minimalism.

For UI polish, prefer small focused edits over sweeping design rewrites.

## Visual Direction

Preserve the HobFarm / StyleFusion / Grimoire visual world:

- strange but navigable
- media-lab / visual-pipeline feel
- underground, outsider, gothic, psychedelic, surreal, retro-future, or cinematic where appropriate
- clear hierarchy without corporate blandness
- functional pages that still feel like part of an authored system

Avoid:

- generic AI startup gradients
- lifeless corporate minimalism
- influencer creator-template aesthetics
- unnecessary positivity language
- visual changes that erase the site's edge or specificity

## Content Rules

Frontmatter must match `src/content.config.ts`.

Release/color metadata should remain optional and backward-compatible. Do not introduce mandatory season, monthly cultivar, color phase, or availability fields without explicit approval.

If optional release metadata is requested, prefer this shape unless the local schema has already evolved:

```ts
releaseSeason?: {
  year: number;
  season: "winter" | "spring" | "summer" | "harvest";
  seasonCode?: string;
};

monthlyCultivar?: {
  month: string;
  characterSlug?: string;
  theme?: string;
};

colorPhase?: {
  name: "red" | "orange" | "yellow" | "green" | "blue" | "indigo" | "violet";
  phaseIndex?: number;
  dayRange?: string;
};

availability?: {
  status:
    | "current"
    | "retiring-soon"
    | "archived"
    | "preview-only"
    | "regrown-edition"
    | "special-edition";
  activeFrom?: string;
  activeUntil?: string;
  archiveNote?: string;
  rereleaseNote?: string;
};
```

Keep titles, descriptions, dates, tags, slugs, and collection fields consistent with existing content.

Prefer media hosted on `cdn.hob.farm`. Treat checked-in gallery or project assets as existing exceptions rather than the default for new content.

Do not add large media files to the repo unless explicitly instructed.

If adding gallery/project content, preserve existing content taxonomy and naming conventions.

## Cloudflare Pages and Functions Rules

Cloudflare Pages Functions live in `functions/api/`.

Do not modify Cloudflare account resources, Pages settings, environment variables, DNS, R2, KV, D1, Workers, Pages projects, routes, or secrets unless explicitly instructed.

Cloudflare inspection through MCP should default to read-only. Treat logs as sensitive.

`wrangler` commands that deploy, mutate resources, alter secrets, or apply remote migrations require explicit approval.

Safe/read-only or local-validation commands include:

```bash
npx wrangler whoami
npx wrangler pages dev
npx wrangler pages project list
```

Read-only but sensitive:

```bash
npx wrangler tail
```

Only use log/tail commands after confirming the target project. Summarize logs; do not paste raw logs if they may contain user data, tokens, request bodies, emails, or other sensitive data.

Approval-required commands include:

```bash
npx wrangler pages deploy
npx wrangler deploy
npx wrangler secret put
npx wrangler d1 migrations apply --remote
npx wrangler d1 execute --remote
```

Also require approval for any command or MCP action that mutates Cloudflare resources.

## Security & Environment Rules

Keep secrets in `.dev.vars` or the appropriate local secret store. Never commit environment values.

Do not commit `.env`, `.dev.vars`, API keys, service tokens, OAuth secrets, session dumps, raw logs, generated credentials, or account IDs beyond those already intentionally checked into config.

Do not paste raw production logs into final responses.

Do not expose private user/customer data from API responses, logs, D1 rows, R2 objects, KV values, or AI Gateway traces.

## Commit & Pull Request Guidelines

Recent history mixes plain summaries like `updated components` with scoped commits like `feat(gallery): add new components for gallery functionality`.

Prefer short, imperative commit subjects. Add a scope when it clarifies the area changed, for example:

```text
feat(gallery): add themed gallery landing cards
fix(auth): correct email change form state
docs(site): update HobFarm project copy
style(home): tighten hero spacing
```

Pull requests should describe user-facing impact, list the main files or content collections touched, link related issues, and include screenshots for UI changes.

## Final Response Requirements for Agents

At the end of a task, report:

- files changed
- commands run
- build/check result
- visual QA result if applicable
- any skipped validation and why
- whether deploy was skipped or performed

Do not claim a visual check was completed unless a browser/preview was actually used.

Do not claim deployment unless a deploy command was explicitly approved and run.

## Standard Implementation Prompt Shape

When receiving a task packet, follow this order:

1. Inspect relevant files and scripts.
2. Identify the smallest safe implementation path.
3. Edit only the necessary files.
4. Run build/check commands.
5. For UI work, request or perform browser QA.
6. Summarize results with files changed and commands run.

If instructions conflict, prioritize: explicit user request, this `AGENTS.md`, local code conventions, then general best practices.
