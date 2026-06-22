# hob.farm

**The workshop floor of HobFarm.** A product landing site built to sell projects, establish authority, and look like it was forged in a reactor core.

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/small.svg)](https://astro.build)

🌐 **Live:** [hob.farm](https://hob.farm)

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | [Astro 6](https://astro.build) (static site generation, content collections) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) with Atomic Noir design tokens |
| Base Theme | Buio by [Lexington Themes](https://lexingtonthemes.com) |
| CMS | [PagesCMS](https://pagescms.org) (git-based, syncs to repo) |
| CDN | Cloudflare R2 at `cdn.hob.farm` |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) |
| Chat | HobBot worker (proxied via Vite in dev) |

**Design Language:** Atomic Noir: Art Deco meets Industrial Optimism. Dark surfaces, precise typography (IBM Plex Sans / IBM Plex Mono), and curated color palettes (black + purple + green, black + magenta + cyan, black + blue + red).

---

## Project Structure

```
hobfarm/
├── src/
│   ├── components/     # Astro & React components
│   │   ├── global/     # Header, Footer, Nav
│   │   ├── sections/   # Composable page sections
│   │   └── ui/         # Primitives (buttons, cards, inputs)
│   ├── content/        # Content collections (Markdown + YAML frontmatter)
│   │   ├── blog/
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

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs the Astro dev server with Vite. API routes (`/api/chat`, `/api/subscribe`) proxy to the HobBot worker automatically.

### Build

```bash
npm run build
```

Always build locally before pushing. Astro catches missing content entries, schema mismatches, broken imports, and type errors at build time.

### Preview

```bash
npm run preview
```

---

## Deployment

Cloudflare Pages deploys automatically on push to `main`. No manual steps required.

---

## Content Collections

Content lives in `src/content/` with schemas defined in `src/content.config.ts`. Each entry is a Markdown file with YAML frontmatter matching its collection schema.

| Collection | Purpose |
|------------|---------|
| `projects/` | Shipped output and tools (the core of the site) |
| `gallery/` | StyleFusion visual galleries |
| `blog/` | Long-form posts |
| `grimoire/` | Grimoire knowledge base entries |
| `changelog/` | Release notes and updates |

---

## Design Rules

1. **Images: `.png`, `.jpg`, or `.webp`**
2. **Video: `.mp4` or `.gif`**
3. **Projects, not products.** The word "products" never appears.
4. **Contact addresses are never visible text.** Route public contact CTAs through `/contact/` or an intentionally obfuscated control.
5. **Tailwind 4 design tokens live in `src/styles/global.css` inside the `@theme` block.** No per-component color overrides. The site uses Tailwind 4 CSS-first config: there is no `tailwind.config.ts` file.
6. **Compose from Lexington sections.** Don't build sections from scratch when the theme library already has one.

---

## CDN

All media assets are served from Cloudflare R2:

```
https://cdn.hob.farm/projects/{project-slug}/   # Project assets
https://cdn.hob.farm/grimoire/                   # Grimoire content
https://cdn.hob.farm/site/                       # General site assets
```

Always use the full URL. Never relative paths for CDN assets.

---

## License

Private repository. All rights reserved.
