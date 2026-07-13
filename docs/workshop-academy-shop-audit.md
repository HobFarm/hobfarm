# Workshop, Academy, and Shop audit

Audit date: 2026-07-12  
Branch: `feature/workshop-academy-shop-expansion`  
Scope: Phase 1 only

## Executive finding

HobFarm already has the beginning of the requested production loop. Workshop has a stable six-program hierarchy, the Sophia/Stella visual system connects a character study to a product and Academy CTA, Shop has a real product collection with paid-asset safeguards, and Academy has one working course system. The next phase should connect these systems through optional relationship fields and shared presentation components. It does not need a new information architecture.

The strongest pilot already in the repository is Sophia/Stella. The requested `WS-JIRAI-001` material is not present in source, content, data, public assets, reports, or tests. Sophia/Stella is the safer first vertical slice unless approved Jirai assets and canon arrive before implementation.

Two media references currently return `404`, the checked-in media inventory is stale, analytics events are not implemented in repository code, and Academy content lives in TypeScript rather than a content collection. These are the clearest Phase 2 preparation items.

## Runtime capability report

```yaml
runtime_plan:
  repositories:
    - F:/Web-Stuff/hobfarm
  current_branch: feature/workshop-academy-shop-expansion
  build_command: npm run build
  test_commands:
    - npm test
    - npx astro check
    - npm run test:e2e  # available, not run during the documentation-only audit
  deployment_target: Cloudflare Pages; production deploys from main
  r2_upload_method:
    current: No repository upload command or manifest-driven uploader
    available_after_approval: Authenticated Wrangler CLI and direct R2 object commands
  installed_plugins:
    - Adobe
    - Fal
    - Figma
    - GitHub
    - HeyGen
    - Higgsfield
    - Chrome/browser control
    - HyperFrames skills and CLI workflow instructions
    - ChatGPT image generation
  verified_plugin_actions:
    - Browser navigation, responsive inspection, DOM checks, and screenshots
    - Figma authentication lookup
    - GitHub authenticated profile lookup
    - HeyGen account and credit lookup
    - Higgsfield balance and subscription lookup
    - Fal image-to-video catalog search
    - Cloudflare authentication and R2 bucket listing
  account_or_plan_limits:
    figma: Starter team plan with a View seat; draft creation may still be available, team editing is constrained
    heygen: Creator subscription; 898 premium credits remained at audit time, resetting 2026-08-06
    higgsfield: Ultimate plan; 1904 credits remained at audit time
    fal: Catalog and pricing actions are available; no balance endpoint was exposed or paid model run attempted
    adobe: Installed but requires reauthentication before actions can run
    github: Connected app works; local gh CLI is not installed
    hyperframes: Skills are installed; HyperFrames is not a project dependency and no MCP action is exposed
  estimated_paid_operations: 0 for Phase 1
  proposed_cost_ceiling: USD 0 until a paid generation experiment is separately priced and approved; suggested later pilot ceiling is USD 10
  approval_points:
    - Select the visual direction
    - Run any paid image or video generation
    - Lock or change character canon
    - Upload or replace R2 assets
    - Publish prices, licenses, or buyer files
    - Change membership tiers
    - Merge or deploy to production
  fallback_route: Codex, ChatGPT image generation when approved, local Astro/CSS/SVG, repository assets, and a manual R2 manifest
```

No paid actions, remote file writes, R2 uploads, product changes, membership changes, commits, pushes, or deployments were performed.

## Verified stack and repository state

| Layer | Verified state |
| --- | --- |
| Framework | Astro `6.4.8` installed from the `^6.0.3` range |
| Runtime | Node `22.22.0`, npm `10.9.4` |
| Language | TypeScript, Astro, and React `19.2.4` islands |
| Styling | Tailwind CSS `4.2.1`, CSS-first imports and `@theme` tokens in `src/styles/global.css` |
| Adapter | `@astrojs/cloudflare` `13.1.0` |
| CMS | PagesCMS through `.pages.yml` |
| Content | Astro content collections through `src/content.config.ts` |
| Commerce | External storefront product links plus an on-site Stripe membership flow |
| CDN | `https://cdn.hob.farm` backed by Cloudflare R2 |
| Functions | Cloudflare Pages Functions in `functions/api/` |
| Rendering | Static pages plus Cloudflare server entrypoints and selected React islands |
| Visual runtime | CSS/SVG components, one Three.js Grimoire module, and small page scripts |

The worktree was clean on `main` at audit start. The branch requested by the master packet was created before writing these documents.

The packet named nine project source documents. Equivalent repository copies were not found for eight of them. `docs/regular-prose-guidelines.md` is present and was used for the final prose pass. Existing components, content schemas, data files, tests, `AGENTS.md`, and `CLAUDE.md` were treated as the current source of truth.

## Current routes

### Workshop

| Route | Source | State |
| --- | --- | --- |
| `/workshop/` | `src/pages/workshop/index.astro` | Full landing page with hero, programs, Sophia/Stella case study, method, benches, production circuit, research, articles, and CTAs |
| `/workshop/before-and-after/` | `src/pages/workshop/[program].astro` | Active and populated from the `before-and-after` gallery type |
| `/workshop/alter-ego/` | Dynamic program route | Active frame, no matching entries yet |
| `/workshop/cute-and-corrupted/` | Dynamic program route | Active and populated from the `cute-corrupted` gallery type |
| `/workshop/character-mannequin/` | Dynamic program route | Active frame, no matching entries yet |
| `/workshop/stylefusion/` | Dynamic program route | Active with one explicitly filed article |
| `/workshop/workshop-notes/` | Dynamic program route | Active and populated from the Workshop Notes department |

The public menu is already the six-program structure requested by the packet. Aesthetic Lab, Pose and Camera Lab, Workflow Lab, and Tool and Model Tests should be lanes or filters inside these programs, not new top-level navigation items.

### Academy

| Route | State |
| --- | --- |
| `/academy/` | Landing page with one beta course and six planned track descriptions |
| `/academy/avatar-content-system/` | Course sales and overview page |
| `/academy/avatar-content-system/free/` | Free overview |
| `/academy/avatar-content-system/course/` | Lesson index |
| `/academy/avatar-content-system/course/[lessonSlug]/` | Sixteen prerendered lessons |
| `/api/academy/avatar-content-system/lesson/[slug]` | Paid lesson function route |

Academy content is stored in `src/data/avatar-content-system.ts` and `src/data/avatar-content-system-paid.ts`. There is no Academy content collection or PagesCMS model. This is workable for one course but creates friction for Workshop-to-lesson relationships, authoring, and reusable lesson metadata.

### Shop, membership, and support

| Route | State |
| --- | --- |
| `/shop/` | Shop landing page with external Etsy and Ko-fi actions, support paths, product families, and one current drop |
| `/shop/[slug]/` | Product detail route backed by the `products` collection |
| `/shop/sophia-stella-sheet-pack/` | Coming-soon product with preview, included files, paid-asset policy, and related content support |
| `/membership/` | On-site Stripe subscription surface |
| `/account/` | Account and membership management |
| `/support/` | Support hub for billing, access, refunds, downloads, courses, and tools |
| `/contact/` | Public support and collaboration route |

Shop products are external-first. A product becomes buyable only when its status is `live` and it has a real `externalUrl`. The only on-site Stripe Checkout product is the authenticated Creative Membership subscription.

### Gallery, video, characters, and departments

| Area | Routes and current structure |
| --- | --- |
| Gallery | `/gallery/`, `/gallery/[...slug]/`, `/gallery/before-and-after/`, `/gallery/cute-corrupted/`, `/gallery/seed-to-world/` |
| Video | `/video/`, related HobFarm TV project pages, gallery entries with video heroes or the `video-workflow` type, and article `video` or `trailer` formats |
| Characters | `/characters/` and `/characters/[character]/` backed by `src/data/characters.ts` |
| Departments | `/departments/`, `/departments/[slug]/`, `/departments/funnies/`, and the nested HobFarm Presents routes |
| HobFarm Presents | `/departments/hobfarm-presents/`, nested series routes, 3DM entries, Other Alice entries, World Guide, RSS, Markdown, and agent-readable routes |

## Content and implementation inventory

### Collections

| Collection | Entries | Relevant use |
| --- | ---: | --- |
| `articles` | 34 | Editorial feed, Workshop Notes, StyleFusion article, CTA fields, related article/gallery/project/video fields |
| `gallery` | 72 | Visual studies, character development, comparisons, video workflows, premium previews, rich media metadata |
| `projects` | 24 | Recurring systems, tools, worlds, courses, Shop legacy redirects, HobFarm TV shows |
| `products` | 1 | Shop drops, SKU, platform, fulfillment, preview, included items, variants, paid-asset policy, related content |
| `comics` | 17 | Funnies routes and character work |
| `adventures` | 2 | Other Alice serial |
| `grimoire` | 6 | Knowledge and planning layer |
| `changelog` | 6 | Release notes |
| `help` | 15 | Help Center |
| `legal` | 7 | Terms, privacy, cookies, refunds, and related policies |
| `stack` | 1 | Stack reference |

The gallery schema is already the richest visual-study model. It supports image and video heroes, media arrays, comparison data, concept notes, field notes, visual DNA, workflow steps, lessons, trait locks, specimen data, color chemistry, wardrobe grammar, style profiles, external links, paid-asset policy, and related content. Workshop studies should reuse or lightly extend this model instead of creating a parallel `workshopStudies` collection immediately.

### Existing reusable components

- `BeforeAfterCompare.astro` already covers much of `BeforeAfterStage` and the interaction core of `SheetToHero`. It supports pointer drag, keyboard arrows, Home/End, reduced motion, optional lazy video, and a static image state.
- Gallery components already cover media grids, comparison blocks, visual DNA, style profiles, workflow strips, specimen cards, field notes, wardrobe grammar, and lesson blocks.
- `MediaPlayer.astro` supplies captions, poster support, controls, warnings, and fallback text.
- `SectionHero.astro`, `SectionHeader.astro`, `ArticleCard.astro`, `GalleryCard.astro`, `ProjectCard.astro`, `DropCard.astro`, `SupportWays.astro`, and `Breadcrumbs.astro` provide the shared page vocabulary.
- `src/data/visual-systems.ts` already models a base mannequin, variants, media packets, related products, related articles, related Workshop notes, departments, and an asset-store link.
- `src/data/site-hierarchy.ts` and `src/data/departments.ts` are stable sources for public information architecture.

### Layout, CSS, and client behavior

- `BaseLayout.astro` owns global metadata, navigation, search, footer, and three palette modes.
- `ArticleLayout.astro`, `ThreeDMEntryLayout.astro`, and gallery detail components contain strong editorial patterns worth preserving.
- Tailwind v4 tokens define the dark violet ground, cyan, magenta, green, blue, red, gold, readable text scales, glow utilities, noise, and contained media frames.
- Most pages remain server-rendered. React is used for account, membership, Grimoire, search/archive behavior, and the game lab.
- Three.js is isolated to the Grimoire engine room. It should not become a global dependency for Workshop or Shop.
- Existing progressive enhancement includes the before/after slider, lightbox, search, media warnings, mobile navigation, and reduced-motion rules in several components.

## R2 and media audit

### Naming and delivery

The repository uses several R2 conventions at once:

- Direct public URLs such as `https://cdn.hob.farm/gallery/<entry>/...`, `https://cdn.hob.farm/projects/<slug>/...`, `https://cdn.hob.farm/hero-images/...`, and `https://cdn.hob.farm/visual-systems/...`.
- Folder/file references resolved by `src/lib/gallery.ts` and `src/lib/cdn.ts`.
- Project helpers that build `projects/<slug>/images/<filename>`.
- Page helpers that build `pages/<page>/<filename>`.
- Cloudflare image transformations through `https://hob.farm/cdn-cgi/image/.../https://cdn.hob.farm/...`.

Video transformation is not available. Video helpers return raw CDN URLs, and poster extraction is explicitly unavailable without Cloudflare Stream.

### Upload workflow

Wrangler is authenticated, and read-only listing found six accessible R2 buckets. The repository has no upload script, no checked-in R2 manifest schema, and no `wrangler r2 object put`, S3, or equivalent command in project scripts or documentation. The current practical upload route is manual Wrangler or dashboard work.

Phase 2 should add a dry-run manifest generator before any uploader. The manifest should record source file, public preview or buyer-file classification, destination bucket/key, content type, dimensions, checksum, related content ID, and replacement policy. Upload remains an approval-gated command.

### Reference health

The current repository scan found 339 unique media URLs using the same literal and folder/file patterns as the existing inventory script. HEAD checks returned:

- 337 successful assets
- 2 missing assets

Missing references:

1. `https://cdn.hob.farm/pages/home/hero-bg-video.mp4`
   - Referenced by `src/content/projects/hobbot.md`, `src/content/projects/grimoire.md`, `src/pages/projects/[...slug].astro`, and `src/pages/projects/hobfarm-tv/index.astro`.
2. `https://cdn.hob.farm/site/stack/astro.svg`
   - Referenced by `src/content/stack/astro.md`.

The checked-in `reports/media-inventory.json` was generated on 2026-07-07 and still points at old `src/content/blog/` paths. It contains 263 rows and 241 unique URLs, while the current scan found 339 unique references. The inventory script only scans `src/content` and `src/data`, so literal media in `src/pages` and components can be missed. Regenerate and broaden the report before relying on it for an R2 migration or upload manifest.

### Paid-asset protection

The paid-asset policy is a real strength. Product and gallery previews use capped Cloudflare derivatives; full buyer files are expected to remain off public pages and on external storefronts. Keep `paidAssetPolicy`, `previewImageUrl`, `lightboxImageUrl`, and `safeMediaUrl` as the enforcement layer.

One metadata inconsistency needs repair: the product page passes a transformed `/cdn-cgi/image/` URL to Open Graph even though `Seo.astro` states social crawlers should receive direct CDN URLs. Product metadata should use a dedicated public social preview file or direct capped CDN derivative.

## Analytics, CTAs, and commerce

### Analytics

The repository contains no analytics event helper, event IDs, `dataLayer`, `gtag`, Plausible, Fathom, Umami, or CTA tracking script. CSP permits Cloudflare Web Analytics endpoints, and the Cookie Policy says Cloudflare Web Analytics is used, so page-level traffic measurement may be enabled at the platform. It is not represented or testable in repository code.

`SupportWays.astro` already emits `data-support-platform`, which is a useful starting attribute. No equivalent IDs exist for Workshop-to-Academy, Workshop-to-product, lesson downloads, checkout clicks, reel plays, or campaign sources.

### Existing CTA paths

- Workshop links to its programs, method, Academy, visual systems, the Sophia/Stella pack, and related articles.
- Academy links to the first course, free overview, modules, Ko-fi, and Articles.
- Shop links to Etsy, Ko-fi, Patreon, HobFarm membership, product details, Gallery, and contact.
- Product details link to related HobFarm work and support paths.
- Articles support Workshop, Academy, and Support CTA objects.

The paths exist, but their relationship labels and event identifiers are inconsistent. Product pages allow an unrestricted `relatedContent` list rather than typed Workshop, Academy, product, and article relationships.

### Commerce and support

- Etsy is the main storefront named on the Shop landing page.
- Ko-fi handles tips, commissions, and small drops.
- Patreon is a separate external community.
- DeviantArt is the planned platform for the Sophia/Stella sheet pack.
- Stripe handles the authenticated on-site Creative Membership subscription.
- Lemon Squeezy, PayPal, eBay, Printful, and direct fulfillment appear in schemas or legal copy but are not active public purchase paths in the audited slice.

Price, license, membership, and buyer-file changes remain approval-gated.

## Visual strengths to preserve

1. The Workshop hero has a clear publication/studio identity, strong character art, and a direct explanation of the method.
2. The dark violet ground, restrained neon accents, IBM Plex typography, mono labels, and full-bleed media produce a recognizable house style.
3. Sophia/Stella already demonstrates the desired Sheet to Hero to Poster to Video relationship without hiding the static content.
4. Gallery detail pages treat media as evidence and pair images with visual DNA, process, materials, and lessons.
5. The current navigation is plain and durable: Articles, Presents, Workshop, Academy, Shop, and About.
6. Paid-asset preview safeguards protect buyer value while keeping pages visual.
7. Server-rendered headings, descriptions, links, JSON-LD, Markdown alternates, feeds, and agent-readable routes keep core content crawlable.

## Reusable gaps and opportunities

| Gap | Smallest useful response |
| --- | --- |
| Workshop, Academy, and Product relationships use different fields | Define one optional relationship object and resolve it through helpers |
| Academy lessons are TypeScript-only | Add optional relationship metadata to the existing lesson type before considering a full collection migration |
| Product detail has one large image and a generic included-files list | Reuse gallery media references in a static `ProductAssetStack` plus manifest summary |
| Workshop programs share one dynamic layout | Add slot-like study modules instead of new program pages |
| `BeforeAfterCompare` is capable but narrowly named | Wrap it with content-specific labels for `SheetToHero` and repair studies |
| Tool routes are described in prose | Add a compact `ToolRouteNote` with required, optional, and fallback tools |
| Cross-links are generic | Add typed `RelatedWorkshop`, `RelatedAcademy`, and `RelatedProducts` presentations backed by one resolver |
| Media inventory omits page/component literals | Broaden the scanner and make dry-run manifest output the default |
| CTA tracking is absent | Add a tiny event helper that uses the existing Cloudflare analytics route when available and degrades to no-op |

## Pages where interaction adds real value

| Page | Useful enhancement | Why it earns the cost |
| --- | --- | --- |
| Workshop Sophia/Stella case study | `SheetToHero` wipe plus pose/camera labels | Explains how a fixed character becomes a staged scene |
| Workshop Before & After | Existing comparison with diagnosis, replacement, and result steps | Turns the visual change into a reusable repair rule |
| Workshop StyleFusion | Lightweight SVG source-role map | Shows which source controls silhouette, palette, wardrobe, pose, and environment |
| Academy lesson | `AcademyPath` and one interactive worked example | Makes sequence and learner output visible without hiding lesson text |
| Product detail | `ProductAssetStack` and `AssetManifest` | Explains value in one screen and separates previews from buyer files |
| Gallery motion study | `AmbientVideoFrame` with poster, controls, lazy source, and reduced-motion behavior | Gives short motion a durable editorial frame |

Support, contact, archive grids, and general department pages do not need 3D or canvas effects.

## Build, responsive, accessibility, and performance baseline

### Validation

- `npm run build`: passed in 102.1 seconds. Astro reported one bundle-size warning.
- `npm test`: 82 of 82 tests passed.
- `npx astro check`: 0 errors, 0 warnings, 0 hints across 343 files.

### Rendered QA

Twelve routes were checked at 1440×1100 and 390×844 where applicable:

- Workshop landing and one program
- Academy landing and course landing
- Shop landing and product detail
- Support
- Gallery
- Video
- Characters
- Departments
- HobFarm Presents

Findings:

- No horizontal overflow on the checked mobile routes.
- Each checked route rendered one `h1`.
- No missing `alt` attributes or empty interactive labels were found in the checked routes.
- No image failures were found after media finished loading on those routes.
- Canonical URLs, Open Graph images, and `twitter:card` were present.
- HobFarm Presents jumps from `h1` to `h3` in one section.
- The Workshop teaser video autoplays muted without controls and has no verified reduced-motion pause path.
- The relevant-route link audit found no unresolved internal target. The Video archive links 3DM through the legacy `/projects/hobfarm-tv/3-degrees-of-dick-miller/` URL, which adds a production redirect hop to the canonical Presents route.

### Performance proxies

The audit did not add a prototype, so there is no before/after runtime comparison yet. The current build supplies these useful baseline proxies:

| Asset or page | Size |
| --- | ---: |
| Grimoire `engineRoom` JavaScript chunk | 569,296 bytes minified |
| Shared client JavaScript chunk | 182,168 bytes minified |
| Shared BaseLayout CSS | 171,026 bytes |
| Workshop HTML | 98,863 bytes |
| Academy HTML | 44,234 bytes |
| Shop HTML | 49,668 bytes |
| Product detail HTML | 44,498 bytes |
| Gallery HTML | 101,618 bytes |
| Video HTML | 81,655 bytes |
| Characters HTML | 73,206 bytes |

The existing Three.js chunk is the clearest warning against loading 3D on Workshop, Academy, or Shop by default. Any experimental module should be route-local, lazy, optional, and measured against a static page.

A Lighthouse or trace baseline was not captured because the selected local browser surface does not expose that audit interface. Capture desktop and mobile Lighthouse/performance traces immediately before implementing the approved prototype, then repeat on the same routes and viewports.

## Placeholders and metadata inconsistencies

- Alter Ego and Character/Mannequin program routes are honest empty states.
- The Sophia/Stella product is intentionally `coming-soon` and has no fake purchase link.
- Academy labels the first course as beta and describes later tracks in prose rather than publishing fake lessons.
- HobFarm TV is explicitly marked as coming eventually.
- Workshop, Academy, Shop, Gallery, Video, and Characters use the global HobFarm social image instead of route-specific artwork.
- The product Open Graph image uses a transformed URL despite the direct-CDN rule in `Seo.astro`.
- The Video archive builds show URLs from legacy project IDs, causing a redirect for 3DM.
- The two missing CDN references and stale inventory report can obscure real media readiness.

These states are mostly honest and should remain honest. Repair the missing assets and metadata wiring; do not fill empty routes with invented work.

## Phase 1 conclusion

Preserve the current routes and visual language. Connect the existing gallery, visual-system, article, Academy, and product data through optional fields and shared resolvers. Prototype the medium-depth editorial direction with Sophia/Stella using current assets. Keep the high-impact character-packet module behind the approval gate and do not load Three.js into the core path.
