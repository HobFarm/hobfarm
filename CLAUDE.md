# CLAUDE.md : HobFarm Project Context

## Identity

**Site:** [hob.farm](https://hob.farm)
**Repo:** HobFarm/hobfarm (private)
**Purpose:** Project landing site. Every page sells a project or establishes authority. This is not a portfolio.

## Stack

- **Framework:** Astro 6 (static output, content collections)
- **Styling:** Tailwind CSS v4 (CSS-first config). Atomic Noir design tokens live in `src/styles/global.css` inside the `@theme` block. No `tailwind.config.ts` file exists.
- **Base Theme:** Buio by Lexington Themes (Full Access to 45+ themes for section composition)
- **CMS:** PagesCMS (git-based, `.pages.yml` at repo root)
- **CDN:** Cloudflare R2 at `https://cdn.hob.farm`
- **Hosting:** Cloudflare Pages (auto-deploy on push to `main`)
- **Chat:** HobBot worker (proxied via Vite dev server at `/api/chat`, `/api/subscribe`)
- **Image Generation:** Recraft (outputs `.webp`)

## Workflow: Receiving Task Briefs

You are Claude Code (CC) operating in this repo. Task briefs originate from claude.ai (strategy and architecture surface) and arrive here as markdown files, usually in `/briefs/` or pasted into chat. When a brief lands:

1. Execute it yourself. You have filesystem, shell, git, and `wrangler` access. You are the implementer, not a router.
2. Do not suggest "handing the brief to CC" or "routing this to Claude Code." You are CC.
3. Do not delegate back to claude.ai unless the brief explicitly asks for clarification, you hit a true blocker (missing credential, ambiguous requirement), or scope expands beyond what the brief covers.
4. Investigation briefs produce a markdown report at the path the brief specifies. No code changes.
5. Implementation briefs produce code, deploys, and a short summary of what was done. No long reports.
6. One coherent task per session. If the brief tries to do too much, flag the scope problem and execute the first independent slice.

## Design Language: Atomic Noir (Psychedelic Goth)

Art Deco meets Vegas-lab goth. The current expression is **psychedelic goth**: dark purple-black grounds with saturated purple/magenta/cyan/green interplay on focal points, selective glow. All tokens live in `src/styles/global.css` inside the Tailwind 4 `@theme` block. There is no `tailwind.config.ts` (CSS-first config); do not create one or search for one. Never hardcode hex values in components. Full palette, contrast rules, and voice live in `docs/brand/voice-glossary.md` (the source of truth).

| Token | Value | Use |
|-------|-------|-----|
| Void (bg) | `#07060b` | Page backgrounds |
| Surface | `#0e0b16` | Cards, panels, elevated surfaces |
| Border | `#221a33` | Dividers, card borders |
| Text | `#ece9f5` | Primary text |
| Secondary | `#9b96ad` | Captions, metadata, muted text |

**Fonts:** IBM Plex Sans (body), IBM Plex Mono (code/mono).

**Color use:** goth structure first (dark grounds, strong type, hard contrast), psychedelic color second (purple/magenta/cyan/green interplay on focal points). Glow is selective, not global. This replaces the old "one palette per page, never mix" rule. The three pairings survive as `data-palette` modes (purple-green, magenta-cyan, blue-red) and may now be mixed on focal elements.

Gold/silver: sparse highlights only, never primary. Purple `#7b2ff7` is ~3.33:1 on the dark ground, so use it for borders, large accents, and active states, not small body text.

**Writing style:** plain and clear, strange and polished. Say what the thing is and does; no farm metaphor or SaaS jargon as decoration. No em dashes. Use colons, parentheses, or separate sentences.

## Seasonal Color-Cycle Operating Model

HobFarm uses a flexible seasonal release rhythm:

- Year = 4 seasons.
- Season = 3 monthly character/cultivar cycles.
- Month = 1 base character or visual theme.
- 28 days = ROYGBIV growth cycle, 4 days per color.
- Final month days = harvest, packaging, gallery/process updates, social/DA/premium/shop/POD prep.

Default monthly color cycle: days 01-04 red, 05-08 orange, 09-12 yellow, 13-16 green, 17-20 blue, 21-24 indigo, 25-28 violet, and days 29-31 harvest / packaging.

This is a creative scaffold, not a compliance system. Use season/month/color phase as organizing context, suggest fitting next tasks, keep metadata optional and backward-compatible, and preserve creative flexibility. Do not force every artifact into every field, block deviations, overbuild scheduling automation, or turn HobFarm into an enterprise content calendar.

## Public Voice and Surface Roles

Public copy is plain and quickly understandable. Lead with what a thing is and does. The farm/cultivation metaphor is **not** required vocabulary; do not use it as decoration in headers, CTAs, or labels (keeper, specimen, grow log, greenhouse, "from signal to ___", "what grew here", cultivation paths). Organic-tech words are allowed only where they name a real structural system: the seasonal release rhythm above, or Grimoire's actual knowledge-graph concepts.

Avoid equally generic SaaS/AI-platform language (leverage, empower, seamless, scalable, innovative, orchestration as marketing) and machine metaphors (pipeline, engine, output as decoration). Describe the actual thing. `specimen` is retired from public copy (see `docs/brand/voice-glossary.md`); internal schema names like `specimenSheet`/`specimenId` stay until a future migration. Product/project names (StyleFusion, Grimoire, HobBot, HobFarm TV, AnomalyBot, Drifter, XKXXKX) and provider names (e.g. Seedream) are names, not metaphors, and stay.

Preserve the dark, strange, polished HobFarm identity through the work and the visual system: Atomic Noir, Art Deco, Vegas lab energy, black ground, cyan/purple/green/magenta accents, and underground/outsider media-lab. Avoid cute rustic farm language, cottagecore, wellness/nature branding, sterile corporate-biotech, and generic-startup tone.

Surface names (plain, literal):

- Projects = the tools and systems HobFarm builds.
- Visuals = the gallery of finished images and video.
- Process / How It's Made = how a piece was made.
- Academy = courses. Shop = goods for sale. Services = hire HobFarm.
- Blog = essays and notes. About = story and contact.

Gallery pages describe artifacts: visual structure, palette, materials, locked and flexible traits, notes, media, search metadata, and related links.

Process pages describe methods: references, steps, model handoffs, revisions, failures, selection, and stabilization.

Seasonal releases may support light scarcity without fake urgency. Honest language is allowed: "Older seasonal releases may rotate into the archive. Popular pieces can return later as re-released editions or expanded premium packs." Avoid manipulative urgency such as "Gone forever. Buy now."

The constraint above is on copy, not ornament. Visual motifs may still draw on organic-tech and Art Deco geometry (root-line connectors, spore-dot clusters, palette strips, botanical-plate layouts, microscope-slide frames, contour-map dividers) where they serve the Atomic Noir look.

## Project Structure

```
src/
├── components/          # PascalCase.astro, under 200 lines, one responsibility
│   ├── global/          # Header, Footer, Nav
│   ├── gallery/         # Gallery-specific components
│   ├── grimoire/        # Grimoire-specific components
│   ├── projects/        # Project card tiers and detail views
│   ├── sections/        # Composable page sections (from Lexington themes)
│   └── ui/              # Primitives (buttons, cards, inputs)
├── content/             # Markdown + YAML frontmatter, schemas in content.config.ts
│   ├── blog/
│   ├── gallery/
│   ├── grimoire/
│   ├── projects/
│   ├── changelog/
│   └── ...
├── layouts/             # BaseLayout and page layouts
├── lib/                 # Utility functions and helpers
├── pages/               # Route entrypoints, 60-100 lines max, declarative composition
├── styles/              # Global CSS
└── data/                # Static data files
functions/api/           # Cloudflare Pages Functions (edge)
public/                  # Static assets, _headers, _redirects
```

## Commands

```bash
npm run dev       # Dev server with API proxy
npm run build     # Production build (always run before pushing)
npm run preview   # Preview the built site locally
npx astro check   # Type/schema validation
```

## Content Collections

Schemas defined in `src/content.config.ts`. Always validate frontmatter against the schema before committing.

Release/color metadata must remain optional and backward-compatible. Do not add mandatory season, monthly cultivar, color phase, or availability fields without explicit approval. If optional release metadata is requested, prefer `releaseSeason`, `monthlyCultivar`, `colorPhase`, and `availability` objects with string/date fields that can be omitted by older entries.

| Collection | Purpose |
|------------|---------|
| `projects/` | Shipped output and tools (the core of the site) |
| `gallery/` | StyleFusion visual galleries |
| `blog/` | Long-form posts |
| `grimoire/` | Grimoire knowledge base entries |
| `changelog/` | Release notes and updates |

## CDN Paths

```
https://cdn.hob.farm/projects/{project-slug}/   # Project assets
https://cdn.hob.farm/gallery/{gallery-slug}/     # Gallery images
https://cdn.hob.farm/grimoire/                   # Grimoire content
https://cdn.hob.farm/site/                       # General site assets
```

Always use the full `https://cdn.hob.farm/` URL. Never relative paths for CDN assets.

## Rules

1. **Projects vs products (distinct, both valid).** The apps, tools, and systems HobFarm builds are **projects** (StyleFusion, Grimoire, HobBot, HobFarm TV, etc.); never call those "products." Physical goods that are sourced, restored, and sold are **products** (the eBay/Etsy resale work, run as the BASS Show — Buying And Selling Shit Show — a project under HobFarm TV: auctions, estate/yard sales, thrift finds, some repaired, some flipped). So "products" may appear when referring to physical items for sale or to design deliverables (product designs, product pages), but the apps/tools/systems are always "projects."
2. **Sanctioned contact routes.** Do not render literal `hob.farm` email addresses in public page text, links, or generated HTML. Use `/contact/`, `/contact/?subject=security`, or a deliberately obfuscated contact control.

   **General routing:**
   - support contact — primary contact, website-scoped (subscribe confirms, magic codes, account notifications, contact form).
   - security contact — vulnerability disclosure. Prefer `/contact/?subject=security` on public pages.
   
   **Project/concern-scoped (use only when the project context is the email's purpose):**
   - developer contact — developer-facing routing (engineering docs, API support if/when published).
   - HobBot contact — HobBot-related contact.
   - StyleFusion contact — StyleFusion-related contact.
   - shop contact — commerce.
   - books contact — books project.
   - personal/identity contact — identity routing.
   
   **Placeholder text only (never a real recipient):**
   - `you@example.com` — form input placeholder text.
   
   The catch-all `*@hob.farm` exists in DNS but is not used as a literal address in the codebase. Don't write `*@hob.farm` anywhere.
   
   **Never substitute** `hello@`, `contact@`, `info@`, `support@`, `hi@`, `team@`, `admin@`, `noreply@`, or any other plausible-sounding pattern. If you need an address for a context not covered above, ask the user. Do not invent.
3. **All design tokens in `src/styles/global.css` `@theme` block.** No per-component color overrides. Change a token once, every page updates. (Tailwind 4 CSS-first config: no `tailwind.config.ts`.)
4. **Compose from Lexington sections.** Never build a section from scratch when the theme library has one. Buio first, then other Lexington themes.
5. **Pages are composition manifests.** Target 60-100 lines per page file. Import sections, don't inline HTML.
6. **Prefer `@/` path alias** for all imports from `src/`.
7. **Static hydration.** Use `client:visible` or `client:idle` over `client:load` unless immediate hydration is required.
8. **Secrets in `.dev.vars`.** Never commit environment values.
9. **Content files are kebab-case.** Components are PascalCase.
10. **2-space indentation, double quotes, semicolons** in TS and TSX files.
11. **Form placeholders:** use `you@example.com` for any email input placeholder. The canonical identity allowlist designates this as the only acceptable placeholder address. Real `hob.farm` addresses (`hey@`, `kris@`, etc.) belong in copy and config, never in placeholder attributes.

## Testing

No dedicated test runner. Validation workflow:
1. `npm run build` (catches schema mismatches, broken imports, type errors)
2. `npm run preview` (visual validation)
3. Manually exercise touched `functions/api/*` endpoints

## Commits

Prefer short, imperative subjects with optional scope: `feat(gallery): add gothic-psychedelic entry`. Pull requests should describe user-facing impact and include screenshots for UI changes.
