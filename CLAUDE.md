# CLAUDE.md: HobFarm Repo Operating Guide

## Role

You are Claude Code operating inside the HobFarm website repo.

Your job is to inspect the repo, make changes, validate the result, and leave the site in a better working state. Act as the implementer. Work directly in the filesystem, use shell commands, run builds, fix errors, and summarize what changed.

Use this file as procedural guidance for building the website and creating content that belongs on the website.

---

## Site Identity

**Site:** [hob.farm](https://hob.farm)
**Repo:** HobFarm/hobfarm
**Hosting:** Cloudflare Pages
**Production branch:** `main`

HobFarm is an online magazine and visual studio.

The site publishes articles, visual galleries, recurring projects, production notes, workflow education, and support paths.

Primary public areas:

| Area     | Purpose                                                                          |
| -------- | -------------------------------------------------------------------------------- |
| Homepage | Front page, hero intro, latest articles, featured routes                         |
| Articles | Main editorial feed                                                              |
| Gallery  | Visual archive for image sets, character sheets, experiments, and finished media |
| Projects | Recurring characters, series, tools, worlds, and formats                         |
| Workshop | Process notes, production methods, systems, and behind-the-scenes work           |
| Academy  | Workflow education, onboarding, courses, and paid learning paths                 |
| Support  | Ko-fi, Patreon, sponsor paths, contact, and collaboration routes                 |

The site should make it clear that articles are the editorial source, social media distributes fragments, and readers can return to hob.farm for the full article, gallery, project, workflow, or support path.

---

## Working Model

Use this model when making decisions:

1. **Article is the source.**
   The full idea, research, process, or feature lives on hob.farm.

2. **Social media is distribution.**
   Reels, images, captions, and short posts should point back to the full article, gallery, project, or academy page.

3. **Gallery is the visual archive.**
   Finished images, character sheets, posters, video stills, and experiments should be organized as durable visual records.

4. **Projects connect recurring work.**
   Characters, series, tools, systems, and formats should have project pages when they need a home beyond one article.

5. **Workshop explains how things are made.**
   Process notes, production methods, model tests, tool notes, failures, revisions, and workflows belong here.

6. **Academy teaches the workflow.**
   Free and paid learning material should connect naturally from relevant articles, projects, and process pages.

7. **Support gives readers a next action.**
   Support, sponsor, contact, and collaboration paths should be easy to find without interrupting reading.

---

## Implementation Procedure

When receiving a task brief:

1. Read the task fully.
2. Inspect the relevant files before editing.
3. Identify the smallest clean change that satisfies the task.
4. Prefer existing routes, layouts, components, content collections, and design patterns.
5. Make the change.
6. Run validation commands.
7. Fix build, type, schema, import, and route errors.
8. Summarize what changed, what was validated, and what still needs manual review.

Use repo evidence. Inspect before assuming.

If the task is ambiguous, proceed with the safest useful interpretation when possible. Ask for clarification only when the missing input blocks the work.

One session should handle one coherent task. If a request contains multiple independent projects, complete the first useful slice and list the remaining slices.

---

## Stack

| Layer      | Technology                                                        |
| ---------- | ----------------------------------------------------------------- |
| Framework  | Astro 6, static output, content collections                       |
| Styling    | Tailwind CSS v4, CSS-first configuration                          |
| Base Theme | Buio by Lexington Themes, with other Lexington sections available |
| CMS        | PagesCMS, git-based, `.pages.yml` at repo root                    |
| CDN        | Cloudflare R2 at `https://cdn.hob.farm`                           |
| Hosting    | Cloudflare Pages                                                  |
| Functions  | Cloudflare Pages Functions in `functions/api/`                    |
| Chat       | HobBot worker, proxied in dev where configured                    |

Tailwind 4 uses CSS-first configuration. Design tokens live in `src/styles/global.css` inside the `@theme` block. There is no `tailwind.config.ts`.

---

## Commands

```bash
npm run dev
npm run build
npm run preview
npx astro check
```

Use `npm run build` before committing or pushing meaningful site changes.

Use `npx astro check` when touching schemas, content collections, TypeScript, layouts, or component props.

Use `npm run preview` for local visual review after building.

---

## Project Structure

```text
src/
├── components/
│   ├── global/          # Header, Footer, Nav
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

Pages should stay lean and compositional. Prefer importing sections and components instead of placing large blocks of page HTML directly inside route files.

---

## Content Collections

Schemas are defined in `src/content.config.ts`.

Content files live in `src/content/` and use Markdown with YAML frontmatter.

| Collection   | Public Role | Purpose                                                                              |
| ------------ | ----------- | ------------------------------------------------------------------------------------ |
| `articles/`  | Articles    | Editorial articles, features, research, satire, process posts, and recurring entries |
| `gallery/`   | Gallery     | Visual archive for image sets, character sheets, experiments, and finished media     |
| `projects/`  | Projects    | Recurring characters, tools, systems, series, worlds, and shipped output             |
| `grimoire/`  | Grimoire    | Knowledge base and reference material                                                |
| `changelog/` | Changelog   | Release notes and site updates                                                       |

The internal collection is named `articles` and the public site presents it as **Articles**. Legacy `/blog/*` redirects remain for old URLs, but new code and content should use article naming.

---

## Article Model

Articles are the main editorial objects on the site.

When editing or creating articles, support this structure where the schema allows it:

| Field            | Purpose                                                                    |
| ---------------- | -------------------------------------------------------------------------- |
| `title`          | Article headline                                                           |
| `description`    | Card text and social preview summary                                       |
| `pubDate`        | Publication date                                                           |
| `updatedDate`    | Optional revision date                                                     |
| `heroImage`      | Hero image and social preview image                                        |
| `tags`           | Index terms                                                                |
| `series`         | Recurring article lane                                                     |
| `department`     | Larger editorial category                                                  |
| `relatedGallery` | Optional gallery tie-in                                                    |
| `relatedProject` | Optional project tie-in                                                    |
| `ctaType`        | Optional routing hint: share, gallery, academy, support, project, workshop |

Article pages should include:

1. Title.
2. Publication date.
3. Description or dek.
4. Hero image when available.
5. Tags.
6. Share actions.
7. Related articles.
8. Related gallery or project links when relevant.
9. Workshop, Academy, Support, or follow CTA when relevant.
10. Open Graph, canonical URL, and structured metadata.

---

## Homepage Procedure

When improving the homepage, build it as the front page of the online magazine.

Preferred homepage order:

1. Hero intro explaining HobFarm as an online magazine and visual studio.
2. Featured article or cover story.
3. Latest Articles feed.
4. Department, series, or project cards.
5. Gallery preview.
6. Workshop or Academy CTA.
7. Support, sponsor, contact, or follow CTA.

The homepage should answer these questions quickly:

1. What is HobFarm?
2. What can I read now?
3. What can I look at now?
4. What recurring work exists here?
5. Where do I go if I want more?
6. How do I share or support it?

---

## Navigation Procedure

Primary nav should point to durable site areas:

* Articles
* Gallery
* Projects
* Workshop
* Academy
* Support

Use plain labels. Prefer clarity over cleverness in navigation.

If old routes still exist, preserve working redirects.

When renaming public labels, update all visible references, card labels, empty states, CTAs, metadata, and footer links that use the old label.

---

## Social Sharing Procedure

Every article should be easy to share and should render cleanly when pasted into social platforms.

Required metadata for article pages:

| Field                  | Purpose                     |
| ---------------------- | --------------------------- |
| `og:title`             | Social preview headline     |
| `og:description`       | Social preview summary      |
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

Share CTAs should fit the content type:

| Content Type | CTA Direction                              |
| ------------ | ------------------------------------------ |
| Article      | Share the article or read related articles |
| Gallery      | View the full visual set                   |
| Project      | Follow the recurring project               |
| Workshop     | Read how it was made                       |
| Academy      | Learn the workflow                         |
| Support      | Support the site or sponsor the work       |

---

## Content Creation Procedure

When asked to create content for the website:

1. Identify the right content type: article, gallery entry, project page, workshop note, academy page, support page, or changelog entry.
2. Inspect the matching collection schema.
3. Create frontmatter that validates against the schema.
4. Use kebab-case filenames.
5. Write clear titles and descriptions for cards and metadata.
6. Add tags when useful.
7. Add hero images or CDN references when supplied.
8. Add related links when the content connects to existing pages.
9. Run build validation.

Write public copy in plain, direct language. Describe what the page contains and what the reader can do next.

---

## Visual and Layout Direction

Use strong hierarchy, readable spacing, clear cards, strong image placement, and page sections that make the content easy to browse.

Prioritize:

1. Clear first impression.
2. Strong article cards.
3. Good image presentation.
4. Fast scanning.
5. Mobile readability.
6. Clean CTAs.
7. Durable routes.
8. Shareable pages.

Use existing components and section patterns first. Create new components when the existing ones cannot reasonably serve the content.

When creating components:

* Use PascalCase filenames.
* Keep one responsibility per component.
* Prefer props over hardcoded content.
* Use `@/` imports from `src/`.
* Keep page files as composition manifests.
* Use static rendering by default.
* Use `client:visible` or `client:idle` for hydrated components unless immediate hydration is required.

---

## Styling Procedure

Use Tailwind classes and existing global tokens.

When a design change needs a reusable color, spacing, type, or surface value, update `src/styles/global.css` inside the `@theme` block.

Use component-level styling only when it is truly local to the component.

Keep contrast readable.

Keep typography clear.

Keep layouts responsive.

Use existing design language from the current site. Remove stale brand rules when they conflict with the current site direction.

---

## CDN Procedure

All CDN media uses full URLs from Cloudflare R2.

```text
https://cdn.hob.farm/projects/{project-slug}/
https://cdn.hob.farm/gallery/{gallery-slug}/
https://cdn.hob.farm/grimoire/
https://cdn.hob.farm/site/
```

Use full `https://cdn.hob.farm/` URLs for CDN assets.

Use local `public/` assets only for files intentionally served from the repo.

When adding new media references, confirm the expected path and file extension.

Accepted image formats:

* `.png`
* `.jpg`
* `.webp`

Accepted video formats:

* `.mp4`
* `.gif`

---

## Contact and Security Procedure

Route public contact through `/contact/`.

For security-related contact paths, use `/contact/?subject=security`.

Use `you@example.com` for email input placeholder text.

Use configured contact systems or existing contact routes. Ask before inventing new visible contact addresses.

Keep environment values and secrets out of committed files.

Use `.dev.vars` for local secret values when needed.

---

## Cloudflare and Deployment Procedure

Cloudflare Pages deploys automatically on push to `main`.

Use branches for preview deployments.

Before pushing to `main`:

1. Pull latest `main`.
2. Run `npm install` if dependencies changed.
3. Run `npm run build`.
4. Run `npx astro check` when relevant.
5. Fix validation errors.
6. Commit with a short imperative message.
7. Push to `main`.

After deployment:

1. Check the Cloudflare deployment status.
2. Open the production URL.
3. Manually review touched pages.
4. Confirm routes, images, metadata, and CTAs work.

---

## PagesCMS Procedure

PagesCMS config lives at `.pages.yml`.

When adding, removing, or changing content fields:

1. Update `src/content.config.ts`.
2. Update `.pages.yml` if editors need the field.
3. Update templates/components that consume the field.
4. Preserve backward compatibility where practical.
5. Run build validation.

Avoid making optional content fields mandatory unless the task explicitly requires it.

---

## Functions Procedure

Cloudflare Pages Functions live in `functions/api/`.

When touching API routes:

1. Inspect the current function.
2. Confirm expected request and response shape.
3. Keep secrets in environment variables.
4. Test the route manually in dev or preview.
5. Summarize any manual testing performed.

---

## Code Style

Use the existing project style.

For TypeScript and TSX:

* 2-space indentation.
* Double quotes.
* Semicolons.
* `@/` imports for files under `src/`.

For content:

* Kebab-case filenames.
* Valid YAML frontmatter.
* Clear title and description.
* CDN URLs where required.
* Tags only when useful.

For Astro:

* Keep route files lean.
* Prefer reusable sections and components.
* Keep component responsibility narrow.
* Use semantic HTML.
* Keep metadata accurate.

---

## Validation Checklist

Use this checklist before considering a task complete:

1. Build passes with `npm run build`.
2. Astro check passes when relevant.
3. No broken imports.
4. No schema errors.
5. No missing content references.
6. Touched routes load locally or in preview.
7. Images resolve.
8. Article metadata renders correctly.
9. Share previews have title, description, image, and URL.
10. CTAs point to real routes.
11. Mobile layout remains readable.
12. No secrets or environment values were committed.

### Browser/Chrome QA Tooling

In this local Codex setup, use the **Chrome plugin** for rendered visual QA.

Do not spend time debugging the bundled Browser plugin when the in-app browser instance is unavailable. The Browser plugin can be installed and enabled in config while still exposing no live `iab` instance to the session (`agent.browsers.list()` returns `[]` or `agent.browsers.get("iab")` fails).

For UI-facing work, prefer this order:

1. Chrome plugin for browser QA.
2. Local Playwright when Chrome is unavailable.
3. Briefly report the fallback reason in the handoff.

---

## Commit Procedure

Use short imperative commit messages.

Examples:

```text
feat(articles): add latest feed to homepage
fix(gallery): correct hero image metadata
chore(content): rename article labels
feat(sharing): add article share actions
```

Pull requests should include:

1. User-facing summary.
2. Routes changed.
3. Validation performed.
4. Screenshots for UI changes when practical.
5. Known follow-up work.

---

## Working Principle

Make the site clearer, more useful, and easier to publish into.

When in doubt, improve the loop:

```text
publish on hob.farm
share fragments on social
bring readers back to the site
connect them to related articles, galleries, projects, workshop notes, academy pages, or support
make the next action obvious
```
