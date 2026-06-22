# HobFarm Site Audit

**Audit date:** 2026-05-20
**Repo:** [HobFarm/hobfarm](https://github.com/HobFarm/hobfarm)
**Branch:** `main` (clean, in sync with `origin/main` at audit start)
**Prior pass:** [src/content/changelog/march-2026-site-audit.md](../../src/content/changelog/march-2026-site-audit.md) (2026-03-13)
**Cleanup plan:** [hobfarm-site-cleanup-ledger.md](./hobfarm-site-cleanup-ledger.md)

---

## Executive summary

The site is structurally sound. Astro 6.0.3, Tailwind 4.2.1, React 19.2.4, TypeScript 5.9.3 — all current. Build passes (130+ static pages, 22 seconds, sitemap generated). `astro check` returns zero errors and zero warnings (21 hints, all minor unused-variable cleanups).

The March 2026 audit landed real cleanup: Alpine removed from dependencies, status route consolidated, `CaseStudy.astro` split, broken contact redirect fixed, `integrations` schema removed from `src/content.config.ts`. What remains is the second-order debris: dead Alpine attributes in an unimported `BlogSearch.astro`, theme-residue components with zero imports, a `.pages.yml` that drifted heavily from the content schema, a search component that's "global" only in physical placement (it indexes only blog posts and renders results through unescaped `innerHTML`), missing tag-page metadata, and stale references to a non-existent `tailwind.config.ts` in both `README.md` and the in-repo `CLAUDE.md`.

The SEO architecture itself is the bright spot: `BaseLayout → BaseHead → Seo.astro` is centralized, emits full OG + Twitter + JSON-LD (`@graph` with `Organization`, `WebSite`, `WebPage`), normalizes canonical URLs, and the auto-generated sitemap correctly excludes auth pages. Preserve it.

The highest-leverage single cleanup is **search consolidation**: expand the global FAB to index every collection, delete the dead Alpine component, and fix the `innerHTML` XSS exposure plus the broken `<label for="email">` mismatch in one focused commit. That's Phase 3a in the ledger.

---

## Route inventory

28 page files under [src/pages/](../../src/pages/). Most are healthy composition manifests. Items to flag:

| Route | File | Lines | Status |
|---|---|---|---|
| `/` | [index.astro](../../src/pages/index.astro) | 28 | OK, composition manifest |
| `/about` | [about/index.astro](../../src/pages/about/index.astro) | 25 | OK |
| `/account` | [account.astro](../../src/pages/account.astro) | 43 | OK, auth flow only; correctly excluded from sitemap |
| `/contact` | [contact.astro](../../src/pages/contact.astro) | 53 | OK; Turnstile sitekey still placeholder per memory |
| `/login` | [login.astro](../../src/pages/login.astro) | 36 | OK, excluded from sitemap |
| `/membership` + `/membership/success` | membership.astro (19), membership/success.astro (67) | | OK, Stripe flow |
| `/status` | status.astro | 26 | OK; canonical after March audit |
| `/support` | support.astro | 132 | OK |
| `/blog` index | blog/index.astro | 89 | OK |
| `/blog/posts/[…slug]` | blog/posts/[...slug].astro | 34 | OK, per-post metadata |
| `/blog/tags` index | blog/tags/index.astro | 34 | OK |
| `/blog/tags/[tag]` | blog/tags/[tag].astro | 76 | **Missing description** (no `description` prop passed to `BaseLayout`) |
| `/blog/category/[category]` | blog/category/[category].astro | 87 | **Generic description** (`"Blog posts in the ${label} category."`) — emits a description but it's boilerplate |
| `/projects` + `/projects/[…slug]` | projects/index.astro (113), [...slug].astro (252) | | OK; StyleFusion uses a special-case render branch |
| `/gallery` + `/gallery/[…slug]` | gallery/index.astro (159), [...slug].astro (35) | | Inline DOM-filter script on the index |
| `/grimoire` + `/grimoire/[…slug]` | 32, 137 | | OK |
| `/changelog` + `[…slug]` | 41, 22 | | OK |
| `/helpcenter` + `[…slug]` + `/helpcenter/knowledge-base` | 51, 22, 92 | | **Two competing hubs**; unclear canonical |
| `/legal/[…slug]` | 19 | | OK |
| `/process/[slug]` | 97 | | Public-facing, only surfaced from homepage via [ProcessPipelinesSection.astro](../../src/components/home/ProcessPipelinesSection.astro). Not in nav or footer. |
| `/whitepaper` | 678 | | **Underexposed.** Linked from [src/components/about/AboutEngine.astro](../../src/components/about/AboutEngine.astro) (line 44, "Read the Whitepaper" button under the FFE diagram), rendered by `/about`. Not in nav, not in footer. Decision: surface from footer Resources column. |
| `/404` | 63 | | OK |
| `/rss.xml.js` | 20 | | OK; rebuilt during March audit |

API routes under [src/pages/api/](../../src/pages/api/): `auth/[...path].ts`, `keys/[...path].ts`, `grimoire/snapshot.ts` — all thin proxies, ~15 lines each.

Pages Functions under [functions/api/](../../functions/api/): `contact.ts` (Turnstile), `status.ts`, `subscribe.ts`, `chat/`, `stripe/` (checkout, webhook, portal, internal).

---

## Metadata and SEO findings

The architecture is excellent. The gaps are leaf-level.

### Architecture (preserve)

[src/layouts/BaseLayout.astro](../../src/layouts/BaseLayout.astro) → [src/components/fundations/head/BaseHead.astro](../../src/components/fundations/head/BaseHead.astro) → [src/components/fundations/head/Seo.astro](../../src/components/fundations/head/Seo.astro) is the canonical chain. `Seo.astro` emits:

- Title, meta `description`, canonical (with trailing-slash normalization via `normalizePathname`)
- Full OG: `og:type`, `og:url`, `og:title`, `og:description`, `og:image` (with `width`, `height`, `alt`, `type`), `og:site_name`, `og:locale`
- Twitter: `summary_large_image`, `@hobdotfarm` site + creator
- Robots: `index, follow`, plus explicit `googlebot`
- JSON-LD `@graph` with `Organization`, `WebSite`, `WebPage` (publisher refs, image, IDs all wired correctly)

Constants:
- `SITE_ORIGIN`: `https://hob.farm`
- `DEFAULT_TITLE`: `"HobFarm | Unusual Media Machine"`
- `DEFAULT_OG_IMAGE`: `https://cdn.hob.farm/pages/home/og-image.jpg`

### Sitemap and robots

- `@astrojs/sitemap` 3.7.1 installed; runs at build time. Sitemap-index emitted to `dist/client/sitemap-index.xml`.
- [public/robots.txt](../../public/robots.txt) disallows `/login`, `/account`, `/api/`. Includes the sitemap-index reference.
- Sitemap correctly excludes `/login` and `/account` per the integration's `filter` option (verified at build time — auth pages do not appear in the prerendered list).

### Headers and cache

[public/_headers](../../public/_headers) is well-tuned:
- `_astro/*` and image assets: 1-year immutable cache
- HTML: `max-age=0, must-revalidate`
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` globally
- API endpoints have explicit no-cache headers

### Gaps to fix

1. **Blog tag pages emit no description.** [src/pages/blog/tags/[tag].astro](../../src/pages/blog/tags/[tag].astro) line 31 calls `<BaseLayout title={…}>` without a `description` prop — so `Seo.astro` falls back to the site default. Each tag page should describe what that tag covers.
2. **Blog category pages emit a generic description.** [src/pages/blog/category/[category].astro](../../src/pages/blog/category/[category].astro) line 51 passes `description={\`Blog posts in the ${label} category.\`}` — emits something, but it's templated boilerplate. Replace with per-category copy that distinguishes (e.g.) `grimoire` posts from `technical` posts.
3. **Favicon: only `public/favicon.svg`.** No `.ico` or `.png` fallback. Older browsers (Edge legacy, some embedded WebViews) and certain social previewers want a PNG/ICO. Add 32×32 PNG and ICO variants.
4. **No dynamic OG image generator.** All non-blog pages fall back to `DEFAULT_OG_IMAGE`. Blog posts use their `hero` field. This is acceptable but a per-page OG generator (e.g. `src/pages/og/[slug].png.ts` returning a generated card) would lift social previews. Defer unless cheap.

---

## Component and layout findings

Inventory: 114 Astro components + 18 React (TSX) components + 7 layouts.

### Dead code (zero imports, safe to delete)

Verified by `grep` across `src/` and `functions/`. These files are not imported anywhere:

```
src/components/blog/BlogCard.astro
src/components/blog/BlogSearch.astro
src/components/ctas/Cta1.astro
src/components/features/Feature2.astro
src/components/features/Feature5.astro
src/components/gallery/ProviderSlot.astro
src/components/gallery/VideoPlayer.astro
src/components/home/ArchitectureTeaser.astro
src/components/home/CredibilityStrip.astro
src/components/home/HowItWorks.astro
src/components/home/ProjectsGrid.astro
src/components/testimonials/LogoCloud1.astro
src/components/headers/Hero1.astro
src/components/assets/Logo.astro
src/components/ui/Icon.astro
```

Pre-deletion guardrail: re-grep each filename at execution time and paste the empty grep results into the commit body. See [ledger Phase 3b](./hobfarm-site-cleanup-ledger.md#phase-3-component-normalization).

### Conditional deletes (depend on the above batch)

- [src/components/CdnImage.astro](../../src/components/CdnImage.astro) — only imported by `gallery/ProviderSlot.astro` and `gallery/ReferenceRow.astro`. Delete only if both are removed.
- [src/components/gallery/ReferenceRow.astro](../../src/components/gallery/ReferenceRow.astro) — only imported by `gallery/ProviderSlot.astro`. Delete only if `ProviderSlot.astro` is removed.
- [src/components/features/PhaseCard.astro](../../src/components/features/PhaseCard.astro) — only imported by `features/Feature2.astro`. Delete only if `Feature2.astro` is removed.

### Imported, do NOT delete

The first-draft audit flagged these as unused; **verified false** — they ARE imported. Keep:

- [src/components/home/FeaturedSystems.astro](../../src/components/home/FeaturedSystems.astro)
- [src/components/home/GrimoireNotMagic.astro](../../src/components/home/GrimoireNotMagic.astro)
- [src/components/home/PatternEngineStatus.astro](../../src/components/home/PatternEngineStatus.astro)
- [src/components/process/ProcessPipelineCard.astro](../../src/components/process/ProcessPipelineCard.astro)
- [src/components/gallery/RelatedEntries.astro](../../src/components/gallery/RelatedEntries.astro)

### Search architecture

Two components, both blog-only despite naming:

**[src/components/global/Search.astro](../../src/components/global/Search.astro)** (195 lines)
- Rendered by `BaseLayout` on every page — fixed-position FAB (`fixed bottom-10 right-10 z-50`)
- Vanilla JS (`<script is:inline>` with `window.addEventListener("load", …)`)
- Fuse.js index across `getCollection("blog")` only
- **Two bugs to fix while expanding:**
  1. Line 73: `<label for="email">` — the input above it has `id="searchInput"`, so the label is broken (form a11y + screen readers).
  2. Lines 148-169: `renderResults` builds the dropdown via `searchResults.innerHTML = results.map((result) => \`…${result.item.title}…${result.item.excerpt}…\`).join("")` — user-authored title and excerpt interpolated directly into HTML. XSS via content. Migrate to DOM creation (`document.createElement` + `textContent`) or run all interpolated values through an escape function.

**[src/components/blog/BlogSearch.astro](../../src/components/blog/BlogSearch.astro)** (127 lines)
- Uses `x-data="blogSearch"`, `x-show`, `x-transition:*`, `@click`, `@keydown.escape.window`, `x-model`, `x-for`, `x-text`, `x-cloak`, `@click.outside`
- Alpine.data registered on `alpine:init` event
- **Alpine is not installed.** `package.json` has no `alpinejs` dependency (the March audit removed it). The component's DOM renders but every directive is inert.
- **Component is unimported** — zero grep hits across `src/` and `functions/`.
- Net: dead code. Safe to delete.

### Theme residue (delete in the dead-code sweep)

Numbered Lexington/Buio-style names with zero imports — no need for a rename pass:

- `headers/Hero1.astro`
- `ctas/Cta1.astro`
- `features/Feature2.astro`, `features/Feature5.astro`

### Animation / styling notes

- `.pulse-dot` is defined **only** in `features/Feature2.astro`. The first-draft audit incorrectly flagged `about/FFEPipeline.astro` as duplicating it; that file uses `.ffe-pulse`, a different class. Since `Feature2.astro` is being deleted, no separate dedupe task is needed.
- Tailwind 4 `@theme` tokens in [src/styles/global.css](../../src/styles/global.css) are comprehensive and well-organized — accent ramp, spot colors, base scale (noir grays), atomic-noir named tokens, three palette modes (`purple-green`, `magenta-cyan`, `blue-red`) switchable via `[data-palette]`, glow utilities, glass utility. No rogue hex colors found in component classes.

### Folder naming

[src/components/fundations/](../../src/components/fundations/) is intentionally spelled this way per memory ([feedback_verify_import_paths](../../../../.claude/projects/c--Users-xkxxk-hobfarm/memory/feedback_verify_import_paths.md)). Do not rename in this audit pass.

---

## Content collections and Pages CMS drift

### Content schemas ([src/content.config.ts](../../src/content.config.ts))

8 collections declared, all using `glob` loaders with `**/*.{md,mdx}` patterns. None uses `slug` as a Zod field (Astro 5+ reserved name — clean).

| Collection | Entries | Notes |
|---|---|---|
| `blog` | 13 | category enum has 8 options including `research` |
| `gallery` | 7 + subdirs | rich nested schema: thumbnail, images, videos, stylefusion metadata |
| `projects` | 10 | uses `image()` function from Astro; CTA fields for membership-gated projects |
| `changelog` | 5 (visible) | aligned with .pages.yml |
| `help` | 15 | has `publishedAt` and `updatedAt` not declared in .pages.yml |
| `legal` | 7 | has `description` and `updatedAt` not declared in .pages.yml |
| `grimoire` | 6 | **not declared in .pages.yml** |
| `stack` | 1 | **not declared in .pages.yml** |

Build-time confirmation: all collections sync without errors. `astro check` reports zero schema issues.

### Pages CMS drift ([.pages.yml](../../.pages.yml))

The CMS config is significantly out of date relative to `src/content.config.ts`. Concrete drift:

1. **`integrations` collection still declared** (.pages.yml lines 152-180). The March audit removed it from the content schema; the CMS config wasn't updated. The `src/content/integrations/` directory does not exist.
2. **Missing collections:** `grimoire` and `stack` are in the content schema but not in `.pages.yml`. PagesCMS users cannot edit them through the CMS.
3. **`blog` category options drift:** .pages.yml line 38 lists 7 categories. `content.config.ts` lines 13-22 list 8 (adds `research`).
4. **`blog` missing fields:** .pages.yml omits `featured` and `updatedAt`.
5. **`gallery` schema heavy drift:** .pages.yml uses field names `collection`, `hero`, `publishedAt`, `description`. content.config.ts uses `category` (not `collection`), `thumbnail` (object with url/alt/provider/caption — not flat `hero` string), `date` (not `publishedAt`), plus many fields absent from the CMS config (`provider`, `funnel_cta`, `da_url`, `process_notes`, `status`, `featured_variant`, `reference_image`, `images[]`, `videos[]`, `stylefusion` block).
6. **`projects` schema heavy drift:** .pages.yml uses `tagline`, `url`, `repo`, `hero`, `publishedAt`, plus `status` enum `[live, active, shelved, planned]`. content.config.ts uses `subtitle` (not `tagline`), `liveUrl` (not `url`), `repoUrl` (not `repo`), `heroImage` / `heroVideo` (not `hero`), `pubDate` (not `publishedAt`), `status` enum `[live, active, planned, paused]` (`shelved` → `paused`). Many fields absent from the CMS config (`order`, `tier`, `category`, `type`, `oneLiner`, `updatedDate`, `logo`, `image`, `images`, `highlights`, `features`, `primaryCta`, `secondaryCta`).
7. **`help` missing fields:** .pages.yml omits `publishedAt`, `updatedAt`.
8. **`legal` missing fields:** .pages.yml omits `description`, `updatedAt`.

Decision in the ledger: either sync `.pages.yml` to the current schemas (recommended — preserves CMS editing for non-engineers) or formally deprecate Pages CMS for this site.

---

## Content and brand findings

- **Brand voice:** strong. Atomic Noir is consistent across home, about, grimoire, gallery, blog. "Projects, not products" rule is respected (no occurrences of "products" in user-facing copy).
- **Email allowlist:** spot-checked; all visible addresses are sanctioned (`hey@`, `security@`). Form placeholders use `you@example.com` per the CLAUDE.md placeholder rule.
- **`/whitepaper` page is genuine content** (678 lines, 11 sections). It is the most extensive single-page document in the site and is the natural target when an external reader wants the full architecture story. Currently reachable only via the FFE engine section on `/about`. Surface it from the footer's Resources column at minimum.
- **`/helpcenter/knowledge-base` vs `/helpcenter/`:** both are hubs. `/helpcenter/` index (51 lines) maps to a simple card grid; `/helpcenter/knowledge-base` (92 lines) is a more elaborate three-column layout with "Getting Started", "System Status", "Contact Support" sections. Pick one as canonical and redirect the other.

---

## Config and docs drift

### Stack (current)

- Astro 6.0.3, Tailwind 4.2.1, React 19.2.4, TypeScript 5.9.3
- `@astrojs/cloudflare` 13.1.0 (with `imageService: "compile"` — images pre-optimized at build)
- `@astrojs/sitemap` 3.7.1, `@astrojs/mdx` 5.0.0, `@astrojs/rss` 4.0.17, `@astrojs/react` 5.0.0
- Output mode: `static`. Adapter prepares Cloudflare Pages artifacts.
- Wrangler 4.92.0 in devDependencies.

### Tailwind 4 token location

**There is no `tailwind.config.ts`.** Tailwind 4's CSS-first pattern is in use: tokens are declared in the `@theme { ... }` block at the top of [src/styles/global.css](../../src/styles/global.css). This is the correct modern pattern.

Documentation that references the non-existent file:

- [README.md](../../README.md) line 50: in the project-structure tree
- [README.md](../../README.md) line 119: "**All design tokens live in `tailwind.config.ts`.**"
- [CLAUDE.md](../../CLAUDE.md) line 12: "Tailwind CSS v4, Atomic Noir design tokens in `tailwind.config.ts`"
- [CLAUDE.md](../../CLAUDE.md) line 33: "All tokens live in `tailwind.config.ts`."
- [CLAUDE.md](../../CLAUDE.md) line 136: "**All design tokens in `tailwind.config.ts`.**"

These mislead future engineers and AI agents into looking for a file that does not exist. The ledger includes a docs-correction commit pointing at `src/styles/global.css` (the user-global `~/.claude/CLAUDE.md` is out of scope for this repo task).

### Package name

[package.json](../../package.json) line 2 still reads `"name": "@lexington/buio"` — from the theme heritage. Cosmetic only; rename to `@hobfarm/site` is optional and parked in Phase 6.

---

## Technical validation results

**`git status --short --branch`** (at audit start):
```
## main...origin/main
```
Worktree clean.

**`npm run build`** — passed, exit 0, 22.03s total:
- 130+ static pages prerendered
- Content sync clean (6.86s for type generation)
- Server entrypoints built in 1.51s, client in 6.15s + 2.02s
- One warning: Vite reports some chunks > 500 KB after minification. Candidates for code-splitting (likely `three.js` and the Grimoire visualization):
  ```
  (!) Some chunks are larger than 500 kB after minification. Consider:
  - Using dynamic import() to code-split the application
  - Use build.rollupOptions.output.manualChunks to improve chunking
  - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit
  ```
- `@astrojs/sitemap`: `sitemap-index.xml` created in `dist/client`
- All routes prerendered including `/whitepaper`, all `/process/*`, all `/legal/*`, all `/blog/category/*`, all `/blog/tags/*`

**`npx astro check`** — passed, exit 0, after working around a local env conflict on Node debug port 9229:
```
Result (199 files): 
- 0 errors
- 0 warnings
- 21 hints
```
First attempt failed with `EADDRINUSE 127.0.0.1:9229` — an environmental conflict (another Node process holds the debug port), not a code issue. Re-ran with `env -u NODE_OPTIONS npx astro check`, which succeeded.

21 hints, all `ts(6133)` ("declared but never read"). Selected examples:
- `src/components/home/ProjectsGrid.astro:5` — unused `videoPosterUrl` import (this file is being deleted)
- `src/components/projects/ProjectCard.astro:20` — unused `subtitle` destructured prop
- `src/components/projects/ProjectHeroCard.astro:20` — unused `subtitle` destructured prop
- `src/lib/media-transforms.ts:41` — unused `cdnUrl` parameter
- `src/pages/account.astro:3` — unused `Button` import

These resolve naturally once the Phase 3 component sweep runs.

---

## Risk notes

- **Search XSS exposure.** `Search.astro`'s `renderResults` interpolates `result.item.title` and `result.item.excerpt` directly into `searchResults.innerHTML`. The data source is the `blog` content collection (markdown authored by `d00d`), so the risk is low — but the moment search is expanded to other collections (gallery, projects, grimoire), the same code path will render data from those schemas too, some of which include user-displayable strings that may incorporate Markdown or HTML characters. Fix during Phase 3a search consolidation, not after.
- **Pre-deletion grep is mandatory.** Five components flagged "unused" in an earlier audit pass turned out to be imported. Trust no static list — re-grep every filename immediately before each deletion commit and paste the empty grep output into the commit body.
- **CMS users may be blocked from editing some content.** `grimoire` and `stack` aren't in `.pages.yml`. If non-engineers depend on PagesCMS, they cannot reach those collections through the CMS UI until the config is synced. Phase 2c addresses this.
- **`.dev.vars` is loaded at build time.** The build output shows `Using secrets defined in .dev.vars` — confirm `.dev.vars` is in `.gitignore`. Spot-check at execution; do not assume.
- **Chunk-size warning is informational, not a build failure.** Three.js plus the post-processing modules optimize-deps-listed in Vite config are the likely contributors. Track for Phase 5 when visual identity work touches the largest components.

---

## Recommended cleanup plan

See **[hobfarm-site-cleanup-ledger.md](./hobfarm-site-cleanup-ledger.md)** for the phased, file-path-specific ledger with proposed commit groupings. Headline phases:

- **Phase 1:** Metadata polish (favicon variants, category + tag descriptions) and docs correction (README + CLAUDE.md → `src/styles/global.css`).
- **Phase 2:** Route and content cleanup — surface `/whitepaper`, reconcile dual help hubs, sync `.pages.yml`.
- **Phase 3:** Component normalization — search consolidation (the biggest win), 14-file dead-code sweep, second-order conditional deletions.
- **Phase 4:** Homepage and public narrative rewrite (placeholder; user scope).
- **Phase 5:** Visual identity pass (palette consistency, reduce `<style>` block weight on largest components).
- **Phase 6:** QA, deploy readiness, optional `package.json` rename.

**Recommended next narrow task after audit approval:** **Phase 3a (search consolidation)** — single focused commit that kills the dead Alpine component, expands the global FAB across all collections, fixes the `innerHTML` XSS, and corrects the broken `<label for>`.
