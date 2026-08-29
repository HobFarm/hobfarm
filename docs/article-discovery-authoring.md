# Article discovery authoring

HobFarm keeps the editorial headline and the search title separate when they need different jobs. The article remains the source of truth. Search metadata summarizes it; the metadata does not create another version of the article.

## Article fields

| Field | Job | Fallback |
| --- | --- | --- |
| `title` | Visible H1 and editorial identity | Required |
| `seoTitle` | Optional search-oriented document title | `title` |
| `dek` | Visible reader-facing subheading | `excerpt` |
| `description` | Page-specific meta, Open Graph, and sharing description | `dek`, then `excerpt` |
| `mesh.subjects` | Recurring concepts used for topic routes and structured data | No public topic route until two released articles use the subject |
| `mesh.entities` | Important people, organizations, places, events, works, publications, and technologies | Kept as article metadata; no automatic thin entity page |

The rendered document title appends `| HobFarm`. Do not put the site name in `seoTitle`.

Use `seoTitle` when the editorial H1 is distinctive but does not quickly identify the person, place, work, technology, or question. Leave it out when the H1 already does that job. Write the most useful identifying phrase first. Do not pad titles with every entity in the article, and do not shorten them to an arbitrary character target.

The first sentence of a dek should identify the central relationship when that can be done naturally. `description` should summarize the page as a sentence, not as a keyword list.

## Example

```yaml
title: "You're the Guy From the Hamburger Train"
seoTitle: >-
  You're the Guy From the Hamburger Train: Paul Reubens,
  Cheech & Chong's Nice Dreams, Primus and New Wave
dek: >-
  Paul Reubens says the line in Cheech & Chong's Nice Dreams.
  Primus uses the scene to open “Hamburger Train” on Pork Soda,
  leading into New Wave, Brian Eno, Devo, Talking Heads, XTC,
  and the records around them.
description: >-
  A multimedia music-history route from Paul Reubens's Hamburger
  Train line through Primus, Eno, Moroder, Bowie, Talking Heads,
  Devo, XTC, Peter Gabriel, King Crimson, Japan, and Daft Punk.
```

The H1 stays editorial. The HTML title becomes the authored search title plus the HobFarm suffix. Article JSON-LD keeps the visible H1 as its `headline` and uses the same description, dates, author, image, section, subjects, and named entities shown by the page.

## Preview before release

Run the search preview for one article:

```bash
npm run preview:article-search -- new-wave-future-of-rock-and-roll
```

Run it without a slug to inspect every future scheduled article. The output shows the H1, rendered search title, meta description, beginning of the dek, canonical URL, concepts, entities, and approximate short and medium title views. Those views only test left-to-right information priority. They are not length rules.

## Relationships and publication state

Keep using the existing relationship fields: `relatedArticles`, `relatedWorkshop`, `relatedAcademy`, `relatedProducts`, `relatedGallery`, and `relatedProject`. Resolved relationships render as ordinary links with the destination title and context. Unresolved or unpublished targets do not render.

Scheduled and draft articles may carry complete mesh metadata in the repository. Public routes, feeds, search, sitemaps, topic counts, related-content lists, and the public mesh do not include them before release.

Workshop Notes continue to use the Articles collection with `format: workshop-note`. Academy and project relationships use their existing public registries. A separate SEO taxonomy, entity-page generator, or Workshop content system is not needed for this contract.

The implementation follows Google's current guidance for [title links](https://developers.google.com/search/docs/appearance/title-link), [snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet), [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), and [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article).
