# HobFarm site architecture

This document records the public architecture implemented in the repository. It does not replace the content schemas or route code. Those remain the executable source of truth.

## Publisher structure

HobFarm is the parent publisher and studio. The main navigation keeps six publisher-level destinations:

- `/articles/` — Editorial articles and discovery.
- `/presents/` — recurring stories, characters, media titles, and developed worlds.
- `/workshop/` — process, methods, tools, production evidence, and experiments.
- `/academy/` — structured courses and lessons.
- `/shop/` — the official commercial directory and direct HobFarm merchandise.
- `/about/` — publisher and creator information.

Support, Customer Help, contact, legal, Gallery, Projects, and Grimoire remain supporting routes. They are not promoted into a second competing primary navigation.

## Editorial mesh v1

`src/data/editorial-mesh.ts` is the registry for Editorial mesh version `1.0.0`. The public sections are:

| Section | Route |
| --- | --- |
| Technology | `/articles/technology/` |
| Art & Design | `/articles/art-design/` |
| Culture | `/articles/culture/` |
| Film & TV | `/articles/film-tv/` |
| Music | `/articles/music/` |
| Places & Systems | `/articles/places-systems/` |

These sections are the human navigation layer. Each article has exactly one section so readers always have a stable place to return to.

Series, subjects, people, organizations, places, events, works, publications, technologies, source artifacts, story modes, and relationships form the semantic mesh. They may cross sections and must not be converted into more primary desks.

The strict public series are:

| Series | Route | Membership rule |
| --- | --- | --- |
| Magazine Time Machine | `/presents/magazine-time-machine/` | A specific old magazine artifact originates or materially drives the investigation. |
| 3 Degrees of Dick Miller | `/presents/3-degrees-of-dick-miller/` | A sourced Dick Miller connection is part of the article's construction. |
| Built Over | `/articles/series/built-over/` | A place-history investigation reconstructs a site and the systems built over it. |

The registry is intentionally conservative. Broad entity aliases such as `algorithms`, `streaming`, `Universal`, and `generative image models` are not canonical aliases because they create false matches. `media-genealogy` is a story mode rather than a duplicate subject.

## Editorial discovery routes

`/articles/` is the Editorial hub. It contains the section rail, the current cover story, the chronological archive, strict specials, recurring subjects, subscription, and pagination.

`/articles/page/{page}/` continues the chronological archive. Every released article appears on one archive page and one section page.

`/articles/topics/` lists canonical subjects with at least two released articles. A subject route at `/articles/topics/{subject}/` is generated only while it meets that threshold. Raw tags remain backward-compatible metadata and are not the primary public information architecture.

`/articles/{section}/rss.xml` is the RSS feed for a section. `/rss.xml` is the combined Editorial feed.

`/articles/mesh.json` is the public article graph. It exposes released article identifiers, canonical URLs, dates, sections, strict series, subjects, public entities, and semantic related-article links. It does not expose source artifacts, draft records, or scheduled records before their release time.

## Route ownership and redirects

An article normally owns `/articles/{slug}/`. A strict 3DM member owns `/presents/3-degrees-of-dick-miller/{slug}/`. Article path selection reads `mesh.series`; the legacy `presentsSeries` field does not establish canonical membership.

Three historical records used 3DM-shaped URLs without meeting the strict rule:

- `the-censor-eats-its-own-tail`
- `they-had-names-doll-family`
- `topless-party-in-outer-space`

Their canonical homes are now normal article routes. The former Presents URLs are permanent redirects in `public/_redirects`, so old links survive without presenting those records as canonical 3DM entries.

The former `/articles/magazine-time-machine/` and `/articles/essays-arguments/` department archives are also redirects. Magazine Time Machine points to its strict special; Essays & Arguments returns to the Editorial hub. The six section pages are the only canonical department-like Editorial archives.

## Indexing rules

Released public routes are indexable and carry self-referencing canonicals. Article pages emit `Article` structured data and breadcrumbs. Section and subject pages emit `CollectionPage` with `ItemList` entries. Navigation and archive relationships use ordinary crawlable links.

Drafts, archived articles, and future scheduled articles are excluded from page generation, RSS, sitemaps, search, and the public graph until their release time. Private account, login, paid lesson body, private Grimoire, and prototype routes remain excluded by their existing route and sitemap rules.

`public/robots.txt` declares both the Astro sitemap index and the curated sitemap. The curated sitemap is generated by `src/pages/sitemap.xml.ts`; the Astro integration is filtered in `astro.config.mjs`.

## Relationship policy

Relationships are rendered only after their target resolves to an existing public object. Labels state what the route does: read the article, see behind the work, learn the method, or use the finished work. A relationship is omitted when the target does not exist or is not public.

Chronological previous and next links are separate from semantic related articles. Neither is a substitute for the other.

## Validation

Use these commands after changing the architecture or article metadata:

```bash
npm run audit:editorial-mesh
npm run build
npm run audit:site-structure
npm test
npx astro check
```

The site-structure audit reads the production build and writes its route inventory and findings to `reports/site-structure/`.
