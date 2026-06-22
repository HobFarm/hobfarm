# HobFarm Site Cleanup Ledger

**Companion to:** [hobfarm-site-audit.md](./hobfarm-site-audit.md)
**Started:** 2026-05-20

This ledger lists each cleanup phase as a sequence of file-path-specific commits. Each phase has a status, the files it touches, the validation step before merging, and follow-up notes. Update statuses as commits land.

**Branching convention:** small focused commits straight to `main` (private repo, auto-deploy via Cloudflare Pages). For higher-risk phases, branch + PR is fine; not required.

**Pre-deletion guardrail (applies to every deletion commit):** re-grep each filename across `src/` and `functions/` immediately before staging, and paste the empty grep results into the commit body. If any grep returns a hit, pull that file out of the batch.

---

## Phase 0 — Audit baseline

**Status:** ✅ completed 2026-05-20

**Owner:** Claude Code
**Files touched:**
- `docs/site-audit/hobfarm-site-audit.md` (new)
- `docs/site-audit/hobfarm-site-cleanup-ledger.md` (new — this file)

**Validation:**
- `git status --short --branch` → clean
- `npm run build` → exit 0, 22.03s, 130+ pages, one chunk-size warning (informational)
- `npx astro check` → exit 0, 0 errors, 0 warnings, 21 hints

**Follow-up:** none. Phases 1-6 below.

---

## Phase 1 — Metadata + docs foundation

**Status:** ⏳ pending
**Estimated commits:** 2

### Commit 1a — metadata polish

**Files touched:**
- `public/favicon.ico` (new — 32×32 ICO generated from existing SVG)
- `public/favicon-32.png` (new — 32×32 PNG)
- `public/favicon-180.png` (new — 180×180 for Apple touch icon)
- `src/components/fundations/head/Favicons.astro` (edit — add `<link rel="icon" type="image/png" sizes="32x32">`, `<link rel="apple-touch-icon">`, `<link rel="shortcut icon" href="/favicon.ico">`)
- `src/pages/blog/category/[category].astro` (edit — replace generic `description={\`Blog posts in the ${label} category.\`}` with a per-category lookup table; 7 categories: technical, magazine-time-machine, cultural-thread, grimoire, stylefusion, hobbot, business)
- `src/pages/blog/tags/[tag].astro` (edit — add `description` prop to `<BaseLayout>` line 31; generate per-tag copy or use a fallback like `\`Articles tagged "${tag}" on HobFarm.\``)

**Validation:**
- Manual check: load `/blog/category/technical/` and `/blog/tags/noir/`, view source, confirm `<meta name="description">` is populated and unique per route
- `npm run build` clean
- Spot-check `<link rel="icon">` chain in any page's HTML head

**Notes:** dynamic OG image generator deferred. The existing CDN default works; per-page OG generation is a future enhancement.

### Commit 1b — docs correction

**Files touched:**
- `README.md` (edit — remove `tailwind.config.ts` reference from project-structure tree on line 50; rewrite line 119 design-rule to point at `src/styles/global.css` `@theme` block)
- `CLAUDE.md` (edit — fix lines 12, 33, and 136 to reference `src/styles/global.css` Tailwind 4 CSS-first tokens)

**Out of scope:** `~/.claude/CLAUDE.md` (user-global file, not part of this repo). Mention in commit message that the user-global file may also need updating.

**Validation:**
- Manual diff review
- No build artifacts touched

---

## Phase 2 — Route and content cleanup

**Status:** ⏳ pending
**Estimated commits:** 3

### Commit 2a — surface the whitepaper

**Files touched:**
- `src/components/global/Footer.astro` (edit — add "Whitepaper" link in the "Resources" column, between "Help Center" and "Changelog" or as appropriate)
- `src/pages/whitepaper/index.astro` (edit — verify `<BaseLayout>` props include `title`, `description`, and ideally a dedicated `image` for OG; add or sharpen if absent)

**Decision item:** also add to top nav? Defer to user. The "Read the Whitepaper" CTA on `/about` remains (via [AboutEngine.astro](../../src/components/about/AboutEngine.astro) line 44).

**Validation:**
- Build clean
- Manually load `/whitepaper`, confirm new description in OG preview via curl: `curl -s https://hob.farm/whitepaper/ | rg "og:description"`

### Commit 2b — help hub reconciliation

**Files touched:**
- `src/pages/helpcenter/index.astro` OR `src/pages/helpcenter/knowledge-base.astro` (delete the loser)
- `public/_redirects` (edit — add `/helpcenter/knowledge-base /helpcenter 301` or inverse, depending on canonical choice)
- Any component imported only by the deleted page (grep first; delete if zero remaining imports)

**Decision criteria:** prefer the one with richer structure (the knowledge-base hub has three columns — Getting Started, Status, Contact — and is the more usable entry point). Recommendation: keep `/helpcenter/` index (canonical URL is shorter), but adopt the three-column structure from `knowledge-base.astro` into it. Delete `knowledge-base.astro` and redirect.

**Validation:**
- Build clean
- `curl -I https://hob.farm/helpcenter/knowledge-base` should return 301 to `/helpcenter/`
- Help articles `/helpcenter/[…slug]` still render

### Commit 2c — Pages CMS schema sync

**Files touched:**
- `.pages.yml` (edit)

**Concrete changes (drawn from the audit's drift analysis):**

1. Remove the `integrations` collection block (.pages.yml lines 152-180).
2. Add a `grimoire` collection block matching the Zod schema in `src/content.config.ts:203-219`: `title`, `description`, `category`, `subcategory`, `order`, `date`, `updated`, `tags`, `related`, `difficulty` (enum), `project`, `draft`, `body`.
3. Add a `stack` collection block matching `src/content.config.ts:221-230`: `title`, `description`, `category`, `url`, `icon`, `body`.
4. Update `blog` category options: add `research` to the existing 7.
5. Add `featured` and `updatedAt` to `blog`.
6. Rewrite `gallery` block to match the current schema: `category` (not `collection`), `thumbnail` object, `date` (not `publishedAt`), `provider`, `funnel_cta` enum, `da_url`, `process_notes`, `status`, `featured_variant`, `reference_image` object, `images` array, `videos` array, `stylefusion` nested object. This is a substantial rewrite — preserve the existing one in the commit's `-` lines and replace.
7. Rewrite `projects` block: `subtitle` (not `tagline`), `liveUrl` (not `url`), `repoUrl` (not `repo`), `heroImage` and `heroVideo` (not `hero`), `pubDate` (not `publishedAt`), status enum `[live, active, planned, paused]` (replace `shelved`), plus `order`, `tier`, `category`, `type`, `oneLiner`, `updatedDate`, `logo`, `image`, `images`, `highlights`, `features`, `primaryCta`, `secondaryCta`.
8. Add `publishedAt` and `updatedAt` to `help`.
9. Add `description` and `updatedAt` to `legal`.

**Validation:**
- Open https://app.pagescms.org with the repo and confirm each collection loads without schema errors
- Edit one record in each collection through the CMS, save, verify the markdown frontmatter matches the new schema
- `npm run build` after a test edit to confirm content still validates

**Alternative if CMS is not actively used:** delete `.pages.yml` entirely, add a one-line note in [README.md](../../README.md) stating that content is edited directly in the repo. Make this a single-commit decision; do not leave both options half-done.

### Commit 2d (optional) — `/process/[slug]` surfacing

**Files touched (if surfacing):**
- `src/components/global/Footer.astro` (edit — add "Process Pipelines" link under "Resources")
- Possibly `src/components/global/Navigation.astro` (edit — but the current nav is already five items wide; surface decision needed)

**Decision item:** user call. Reasonable to leave as homepage-anchored only.

---

## Phase 3 — Component normalization

**Status:** ⏳ pending
**Estimated commits:** 3 (3a, 3b, 3c)

### Commit 3a — search consolidation (the headline change)

**Goal:** one search component that indexes every public collection, with no XSS exposure and no broken label.

**Files touched:**
- `src/components/global/Search.astro` (rewrite)
- `src/components/blog/BlogSearch.astro` (delete — re-grep first)
- `src/content/changelog/march-2026-site-audit.md` (edit — append a one-line note: "Follow-up 2026-05: BlogSearch.astro removed, completing the Alpine cleanup loop. Global search expanded to index all public collections.") OR write a new changelog entry `src/content/changelog/may-2026-search-consolidation.md`

**Specific changes to `Search.astro`:**

1. **Replace the data source.** Currently:
   ```ts
   const posts = await Promise.all(
     (await getCollection("blog")).filter((p) => !p.data.draft).map(async (post) => ({…}))
   );
   ```
   Expand to fetch from `blog`, `projects`, `gallery`, `grimoire`, `help`, `changelog`. Each collection has different field names — normalize each to:
   ```ts
   {
     type: "blog" | "project" | "gallery" | "grimoire" | "help" | "changelog",
     title: string,
     description: string,
     href: string,
     tags?: string[],
     category?: string,
     date?: string,
   }
   ```

2. **Per-collection filtering** (each schema is different):
   - `blog`: `!data.draft` (matches current behavior)
   - `gallery`: `data.status !== "draft"` (gallery uses a `status` enum, not `draft` boolean)
   - `grimoire`: `!data.draft`
   - `projects`: keep all; there is no draft flag, but consider filtering `status === "planned"` if planned projects shouldn't be searchable (decision item — recommend keep all, planned is fine)
   - `help`: keep all (no draft flag)
   - `changelog`: keep all

3. **Per-collection href builder:**
   - `blog` → `/blog/posts/${post.id.replace(/\.md$/, "")}`
   - `projects` → `/projects/${project.id.replace(/\.md$/, "")}`
   - `gallery` → `/gallery/${entry.id.replace(/\.md$/, "")}`
   - `grimoire` → `/grimoire/${entry.id.replace(/\.md$/, "")}`
   - `help` → `/helpcenter/${entry.id.replace(/\.md$/, "")}`
   - `changelog` → `/changelog/${entry.id.replace(/\.md$/, "")}`

4. **Fuse index keys:**
   ```ts
   keys: ["title", "description", "tags", "category"]
   ```
   Drop `publishedAt` from keys (not useful for fuzzy text matching).

5. **Fix label `for` attribute.** Line 73 currently reads `<label for="email">`. Change to `<label for="searchInput">`.

6. **Rewrite `renderResults` to eliminate `innerHTML`.** Replace lines 148-169:
   ```js
   searchResults.innerHTML = results.map(result => `<a href="...">${result.item.title}...${result.item.excerpt}</a>`).join("");
   ```
   with safe DOM construction:
   ```js
   searchResults.replaceChildren();
   for (const result of results) {
     const a = document.createElement("a");
     a.href = result.item.href;
     a.className = "block py-4 duration-300";
     const h3 = document.createElement("h3");
     h3.className = "font-medium text-base text-white block relative px-4";
     h3.textContent = result.item.title;
     const p = document.createElement("p");
     p.className = "text-base-500 text-sm block mt-4";
     p.textContent = result.item.description;
     const typeLabel = document.createElement("p");
     typeLabel.className = "text-xs text-base-500 mt-2 uppercase tracking-wider";
     typeLabel.textContent = result.item.type;
     a.append(h3, p, typeLabel);
     searchResults.appendChild(a);
   }
   ```

7. **Update placeholder copy.** Line 70: change `placeholder="Search posts..."` to `placeholder="Search HobFarm..."`. Line 77: change `Search..` label text similarly.

8. **Consider adding a type filter** above the results (small chip strip for `All / Blog / Projects / Gallery / Grimoire / Help / Changelog`). Optional — adds UX value, adds complexity. Recommend deferring to a 3a-follow-up commit if it grows the diff materially.

**Validation:**
- `npm run build` clean
- `npx astro check` clean
- Open the site locally (`npm run dev`), click the search FAB, type queries that exist in each collection, verify each type returns results:
  - "noir" → blog post on chiaroscuro
  - "grimoire" → both blog posts and grimoire articles
  - "stylefusion" → project page + gallery entries
  - "help" → help center articles
- Try a malicious payload as a search query and confirm no script execution (this isn't the XSS vector — content is the vector — but smoke-test): type `<script>alert(1)</script>` → expect nothing executed, just nothing matches
- Test the broader fix: temporarily add a blog post with `title: 'Test <img src=x onerror=alert(1)>'` (draft: false), rebuild, search "Test", confirm the result renders the literal string, not the alert

**Commit message body:** include zero-import grep output for `BlogSearch.astro`:
```
$ rg -l "BlogSearch" src/ functions/
(no output)
```

### Commit 3b — dead-code sweep (single commit, 14 files)

**Pre-flight (paste output into commit body):**
```bash
for f in BlogCard Cta1 Feature2 Feature5 ProviderSlot VideoPlayer ArchitectureTeaser CredibilityStrip HowItWorks ProjectsGrid LogoCloud1 Hero1 Logo Icon; do
  echo "=== $f ==="
  rg -l "$f" src/ functions/ --type-add 'web:*.{astro,ts,tsx,js,mjs}' -t web
done
```
The grep should return only each file's own path (or nothing for files imported solely by their own folder index, which doesn't exist here). Any external hit pulls that file out of the batch.

**Files deleted:**
```
src/components/blog/BlogCard.astro
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

**Files possibly deleted as a side-effect** (if `src/components/testimonials/` becomes empty, remove the directory).

**Validation:**
- `npm run build` clean (this is the critical check — Astro will fail the build if any import resolves to a deleted file)
- `npx astro check` clean
- Spot-check homepage in `npm run dev` for any "missing component" rendering bug

### Commit 3c — second-order deletions

**Pre-flight (after 3b lands):**
```bash
rg -l "ReferenceRow" src/ functions/
rg -l "CdnImage" src/ functions/
rg -l "PhaseCard" src/ functions/
```
Each should return nothing.

**Files deleted (if grep is clean):**
```
src/components/gallery/ReferenceRow.astro
src/components/CdnImage.astro
src/components/features/PhaseCard.astro
```

**Validation:**
- `npm run build` clean
- `npx astro check` clean

---

## Phase 4 — Homepage and public narrative rewrite

**Status:** ⏸ deferred — placeholder
**Owner:** user (scope to be defined)

The homepage is currently a composition manifest pulling 9 sections. The narrative is sound but the **proof density** could increase — visible outputs, in-progress work, public dashboards. Wait until Phases 1-3 land before reopening; the dead-code sweep changes the available section inventory.

**Likely commits when scoped:**
- New section component(s) for "what shipped this week" pulled from `getCollection("changelog")`
- Process Pipelines surfacing (relates to 2d)
- StyleFusion live-output strip (relates to existing gallery)

---

## Phase 5 — Visual identity pass

**Status:** ⏸ deferred — placeholder

The `@theme` tokens in [src/styles/global.css](../../src/styles/global.css) are comprehensive. This phase is about **consistent palette application**, not new tokens.

**Likely tasks:**
- Audit which pages explicitly set `palette={…}` on `BaseLayout` and which inherit the default (`purple-green`). Map palette to page personality intentionally.
- Reduce `<style>` block weight on the largest components:
  - `src/components/grimoire/sections/GrimoireEngineRoom.astro` (716 lines, complex 3D viz)
  - `src/components/gallery/GalleryDetail.astro` (448 lines, lightbox + modal)
  - `src/components/about/FFEPipeline.astro` (460 lines)
- Investigate Vite chunk-size warning: identify which chunk > 500 KB, evaluate dynamic-import or `manualChunks` for `three.js` modules

---

## Phase 6 — QA and deploy readiness

**Status:** ⏸ pending (runs after Phases 1-3 land)

**Tasks:**
- Re-run `npx astro check` and `npm run build`
- Manually exercise: home, blog, projects, gallery, grimoire, contact form (Turnstile sitekey still placeholder per memory — separate task), expanded search, login flow, member portal
- Verify `dist/client/sitemap-index.xml` includes all expected URLs; verify auth pages and any redirected pages are excluded
- Verify OG previews via Twitter/Facebook card debugger on a representative sample: `/`, `/about`, `/whitepaper`, one blog post, one project, one gallery entry, one grimoire article
- Optional rename: `package.json` `name` field from `@lexington/buio` to `@hobfarm/site` (purely cosmetic; only the package name string is affected, no installed-package references)

---

## Ledger summary

| Phase | Status | Commits | Risk |
|---|---|---|---|
| 0 Audit baseline | ✅ done | 1 (this PR) | none |
| 1 Metadata + docs | ⏳ pending | 2 | low |
| 2 Routes + CMS | ⏳ pending | 3 (+ optional 2d) | medium (CMS sync touches author workflow) |
| 3 Components | ⏳ pending | 3 (3a, 3b, 3c) | medium (3a expands a security-relevant surface; 3b/3c are mechanical) |
| 4 Narrative | ⏸ deferred | tbd | scope-dependent |
| 5 Visual identity | ⏸ deferred | tbd | low |
| 6 QA / deploy | ⏸ pending after 1-3 | 1 | none (verification only) |

**Recommended execution order:** 1a → 1b → 3a → 3b → 3c → 2a → 2b → 2c. Phase 1 first to lift metadata before more search expansions get crawled. Phase 3a immediately after, because it kills the dead code most likely to confuse future contributors. Phase 2 last among the structural changes because the CMS sync is the most fiddly and the help-hub reconciliation is a UX call best made with a fresh look.
