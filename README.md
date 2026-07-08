# hob.farm

**The online magazine and visual studio for HobFarm.** A publishing site for articles, visual galleries, recurring projects, production notes, workflow education, and support paths.

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/small.svg)](https://astro.build)

🌐 **Live:** [hob.farm](https://hob.farm)

---

## Site Model

HobFarm is structured as an online magazine with a visual studio attached.

The site publishes articles, archives visual work, documents production systems, connects recurring projects, and routes interested readers toward galleries, workflows, support, and future paid material.

| Area     | Role                                                                             |
| -------- | -------------------------------------------------------------------------------- |
| Homepage | Front page, hero intro, latest articles, featured routes                         |
| Articles | Main editorial feed                                                              |
| Gallery  | Visual archive for image sets, character sheets, experiments, and finished media |
| Projects | Recurring characters, series, tools, worlds, and formats                         |
| Workshop | Process notes, systems, production experiments, and behind-the-scenes work       |
| Academy  | Workflow education, onboarding, courses, and paid learning paths                 |
| Support  | Ko-fi, Patreon, sponsor paths, contact, and collaboration routes                 |

---

## Publishing Loop

HobFarm uses the site as the source of truth and social media as distribution.

1. Publish the article, gallery, project, or workflow on hob.farm.
2. Create social fragments from the source material.
3. Send people back to the full article, gallery, project page, or academy page.
4. Give readers clear share actions and related links.
5. Route deeper interest toward support, academy, or recurring project pages.

Article pages should support this loop with strong metadata, share buttons, related articles, and clear CTAs.

---

## Stack

| Layer      | Technology                                                                   |
| ---------- | ---------------------------------------------------------------------------- |
| Framework  | [Astro 6](https://astro.build) (static site generation, content collections) |
| Styling    | [Tailwind CSS v4](https://tailwindcss.com) with Atomic Noir design tokens    |
| Base Theme | Buio by [Lexington Themes](https://lexingtonthemes.com)                      |
| CMS        | [PagesCMS](https://pagescms.org) (git-based, syncs to repo)                  |
| CDN        | Cloudflare R2 at `cdn.hob.farm`                                              |
| Hosting    | [Cloudflare Pages](https://pages.cloudflare.com)                             |
| Chat       | HobBot worker (proxied via Vite in dev)                                      |

**Design Language:** Atomic Noir: Art Deco meets Industrial Optimism. Dark surfaces, precise typography using IBM Plex Sans and IBM Plex Mono, and curated color palettes built around black, purple, green, magenta, cyan, blue, and red.

---

## Project Structure

```text
hobfarm/
├── src/
│   ├── components/     # Astro & React components
│   │   ├── global/     # Header, Footer, Nav
│   │   ├── sections/   # Composable page sections
│   │   └── ui/         # Primitives (buttons, cards, inputs)
│   ├── content/        # Content collections (Markdown + YAML frontmatter)
│   │   ├── articles/   # Editorial articles
│   │   ├── gallery/
│   │   ├── grimoire/
│   │   ├── projects/
│   │   └── ...
│   ├── layouts/        # BaseLayout and page layouts
│   ├── lib/            # Utility functions and helpers
│   ├── pages/          # Route-mapped Astro pages
│   ├── styles/         # Global CSS
│   └── data/           # Static data files
├── public/             # Static assets served at root
├── functions/          # Cloudflare Pages Functions (edge)
├── astro.config.mjs    # Astro configuration
└── .pages.yml          # PagesCMS schema

# Tailwind 4 uses CSS-first config: design tokens live in
# src/styles/global.css inside the @theme block. No tailwind.config.ts.
```

---

## Getting Started

### Prerequisites

* Node.js 20+
* npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs the Astro dev server with Vite. API routes such as `/api/chat` and `/api/subscribe` proxy to the HobBot worker automatically.

### Build

```bash
npm run build
```

Build locally before pushing. Astro catches missing content entries, schema mismatches, broken imports, and type errors at build time.

### Preview

```bash
npm run preview
```

---

## Deployment

Cloudflare Pages deploys automatically on push to `main`.

Production branch:

```text
main
```

Preview deployments are created from non-production branches.

---

## Content Collections

Content lives in `src/content/` with schemas defined in `src/content.config.ts`. Each entry is a Markdown file with YAML frontmatter matching its collection schema.

| Collection   | Public Role | Purpose                                                                                             |
| ------------ | ----------- | --------------------------------------------------------------------------------------------------- |
| `articles/`  | Articles    | Magazine-style articles, features, research, satire, process posts, and recurring editorial entries |
| `gallery/`   | Gallery     | Visual archive for finished media, character sheets, image sets, and experiments                    |
| `projects/`  | Projects    | Recurring characters, tools, series, worlds, and shipped output                                     |
| `grimoire/`  | Grimoire    | Knowledge base entries and internal reference material                                              |
| `changelog/` | Changelog   | Release notes and site updates                                                                      |

The internal collection is named `articles` and is presented publicly as **Articles**. Keep new editorial content in `src/content/articles/`; legacy `/blog/*` URLs redirect to canonical `/articles/*` routes.

---

## Article Model

Articles are the main editorial objects on the site.

Recommended frontmatter fields:

| Field            | Purpose                                                                    |
| ---------------- | -------------------------------------------------------------------------- |
| `title`          | Article headline                                                           |
| `description`    | Social preview and article card text                                       |
| `pubDate`        | Publication date                                                           |
| `updatedDate`    | Optional revision date                                                     |
| `heroImage`      | Article hero and social preview image                                      |
| `tags`           | Index terms                                                                |
| `series`         | Recurring lane or article series                                           |
| `department`     | Larger editorial category                                                  |
| `relatedGallery` | Optional gallery tie-in                                                    |
| `relatedProject` | Optional project tie-in                                                    |
| `ctaType`        | Optional routing hint: share, gallery, academy, support, project, workshop |

Article pages should include:

1. Title, date, tags, and summary.
2. Strong hero image.
3. Open Graph and social card metadata.
4. Share actions.
5. Related articles.
6. Optional gallery, project, workshop, academy, or support CTA.

---

## Social Sharing

Every article should be easy to share and should render cleanly when pasted into social platforms.

Required metadata:

| Field                  | Purpose                     |
| ---------------------- | --------------------------- |
| `og:title`             | Social preview headline     |
| `og:description`       | Social preview text         |
| `og:image`             | Social preview image        |
| `og:url`               | Canonical article URL       |
| `twitter:card`         | Large preview card support  |
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

## Design Rules

1. **Images:** Use `.png`, `.jpg`, or `.webp`.
2. **Video:** Use `.mp4` or `.gif`.
3. **Use project language.** Refer to shipped work as projects, articles, galleries, tools, workflows, or releases.
4. **Route public contact through `/contact/`.** Keep direct contact addresses out of visible page text.
5. **Tailwind 4 design tokens live in `src/styles/global.css` inside the `@theme` block.** Use the CSS-first Tailwind 4 setup. The repo has no `tailwind.config.ts`.
6. **Compose from Lexington sections.** Use theme library sections when they already fit the layout need.
7. **Make article pages shareable.** Every article needs a strong title, description, hero image, canonical URL, and social preview metadata.
8. **Keep the site connected.** Articles should route readers toward related articles, galleries, projects, workshop notes, academy pages, or support paths when relevant.

---

## CDN

All media assets are served from Cloudflare R2:

```text
https://cdn.hob.farm/projects/{project-slug}/   # Project assets
https://cdn.hob.farm/grimoire/                   # Grimoire content
https://cdn.hob.farm/site/                       # General site assets
```

Use the full CDN URL for CDN assets.

---

## License

Private repository. All rights reserved.
