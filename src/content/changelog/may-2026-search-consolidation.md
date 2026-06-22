---
title: "Search consolidation and Alpine cleanup"
project: hobfarm
publishedAt: 2026-05-20
tags: [search, refactor, security]
---

## One search, every collection

Consolidated the site search into a single component that indexes every public collection: blog, projects, gallery, grimoire, help, and changelog. Previously the global search FAB only found blog posts, even though it rendered on every page; a separate blog-page-only modal duplicated the work and depended on Alpine.js, which was removed from the dependency list during the March 2026 site audit.

### What changed

- `src/components/global/Search.astro` now collects entries from all six public collections at build time, normalizes them into a single shape (`type`, `title`, `description`, `href`, optional `tags`, `category`, `date`), and runs a Fuse.js index across them. Draft entries are filtered per each collection's draft convention (`draft: true` for blog and grimoire, `status: "draft"` for gallery; projects, help, and changelog have no draft flag and always include all entries).
- `src/components/blog/BlogSearch.astro` deleted. It had been unimported and its Alpine directives were inert since Alpine was removed from the dependency list.

### Security and accessibility fixes

While the file was open, two issues from the site audit were closed:

- The result list previously rendered via `searchResults.innerHTML = …` with interpolated authored content. That created an XSS surface as soon as the index expanded beyond `d00d`-authored markdown. Rendering now uses `document.createElement` + `textContent` for every visible string — authored content cannot become markup.
- The search-input label had `for="email"`, which never matched the input's `id="searchInput"`. The association is now correct and screen readers will announce the input when the label is focused.

### What this closes

This completes the Alpine.js cleanup loop opened by the March 2026 site audit (Alpine package removed, but `BlogSearch.astro` was missed) and resolves the highest-leverage item in the May 2026 site audit's Phase 3a.
