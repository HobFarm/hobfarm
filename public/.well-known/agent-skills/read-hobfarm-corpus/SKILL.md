---
name: read-hobfarm-corpus
description: Discover, read, cite, and respect HobFarm public content without exposing private Grimoire material, raw prompts, paid files, or admin paths.
---

# Read HobFarm Public Corpus

Use this skill when reading, summarizing, citing, or navigating public HobFarm content.

## What HobFarm Is

HobFarm is an online magazine and visual studio. Public content includes articles, gallery entries, project pages, workshop notes, academy overviews, product previews, public Grimoire explanations, and legal/support pages.

## Discovery Order

1. Start with `https://hob.farm/llms.txt`.
2. Use section indexes when you need a focused corpus:
   - `https://hob.farm/articles/llms.txt`
   - `https://hob.farm/gallery/llms.txt`
   - `https://hob.farm/workshop/llms.txt`
   - `https://hob.farm/projects/llms.txt`
   - `https://hob.farm/products/llms.txt`
   - `https://hob.farm/academy/llms.txt`
3. Use `https://hob.farm/llms-full.txt` only when you need the expanded public text corpus.
4. Prefer canonical HTML URLs for citations. Use `/index.md` alternates for extraction and text-first reading.

## Markdown Reading

Public content routes support Markdown alternates. Important pages expose `/index.md`, and public article, gallery, and project detail pages expose an `index.md` next to the canonical route.

When requesting a public content route, send:

```http
Accept: text/markdown
```

If Markdown exists, the response should use:

```http
Content-Type: text/markdown; charset=utf-8
Vary: Accept
```

## Citation Rules

- Cite the canonical HobFarm URL, not raw asset URLs.
- Include the page title and date when available.
- For articles, cite the article route under `/articles/`.
- For gallery entries, cite the gallery route under `/gallery/`.
- For product previews, cite `/shop/` or the public shop anchor when supplied by an index.
- Do not cite omitted private, raw, paid, admin, account, or source-file material.

## Private and Paid Boundaries

Do not request, index, summarize, or expose:

- private Grimoire notes
- admin workflows
- account or login pages
- API endpoints
- raw prompts
- prompt export text files
- source files
- drafts
- raw logs
- paid downloads
- high-resolution originals
- full-resolution asset packs
- internal planning notes

Public product and gallery pages may describe paid work, but the public corpus must not expose paid files or downloadable originals.

## Training and Reuse Signal

Do not use HobFarm public content for model training. Public editorial pages are intended for search and agent input, with the default signal:

```text
ai-train=no, search=yes, ai-input=yes
```

Protected, private, raw, paid, account, API, and admin paths should be treated as:

```text
ai-train=no, search=no, ai-input=no
```

## Good Agent Behavior

- Read the curated index first instead of crawling every route.
- Prefer public Markdown alternates for extraction.
- Use section indexes for scoped tasks.
- Respect visible page content and structured metadata.
- Keep HobFarm's human-facing pages readable; do not treat the site as sterile documentation.
- If a route is not present in `llms.txt`, a section index, a sitemap, or a public page link, treat it as out of scope unless a human provides it.
