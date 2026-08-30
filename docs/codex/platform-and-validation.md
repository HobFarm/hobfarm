# HobFarm Platform and Validation

Focused reference extracted from the former root repository guide. Read it when the root `AGENTS.md` routes the current task here.

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
publishing workflow. A request to publish, deploy, make live, or update the live
site is explicit approval for the required scoped commit and normal push.
Direct Wrangler deployments and Cloudflare configuration changes still require
an explicit live-release request.

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
