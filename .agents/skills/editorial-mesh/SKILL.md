---
name: editorial-mesh
description: Use for any HobFarm article creation, edit, publication, taxonomy, navigation, related-reading, archive, or content-graph task. Classify each article into one primary human-facing section while building a many-to-many editorial mesh of subjects, series, entities, places, events, works, source artifacts, and article relationships. Enforce strict series rules for Magazine Time Machine and 3DM, normalize aliases, preserve factual versus speculative boundaries, and improve relationships without forcing the corpus into a tree or optimizing topics for job listings.
---

# HobFarm Editorial Mesh

## Purpose

HobFarm should read like a magazine to a human and behave like a knowledge graph underneath.

Use this skill whenever an article is created, substantially edited, scheduled, published, reclassified, linked to other articles, or used to change article navigation.

The goal is not to make every article fit one tree. The goal is to give every article one understandable shelf while preserving the real network of relationships that makes HobFarm useful.

## Core model

Use two layers.

### Surface layer: simple magazine navigation

Every article gets one primary section. The section answers:

> If a reader encountered this article in a magazine, which broad desk would most naturally own it?

The final controlled section list comes from the current corpus and lives in the section registry. Do not invent a new top-level section during routine article production.

Possible section families to test during the corpus audit include Music, Film & TV, Art & Design, Technology, Culture, and a place/system/history section. These are candidates, not a required final list.

### Mesh layer: many-to-many editorial relationships

The article may connect to any number of:

- subjects
- named series or specials
- people
- organizations
- places
- events
- creative works
- publications
- technologies or systems
- source artifacts
- editorially selected related articles
- recurring story modes when the corpus proves they are useful

A music connection does not make every article a Music article. A film connection does not make every article a 3DM entry. Placement and connection are different jobs.

## Article nodes and the living book

Each released Article is an independently readable node with its own question, evidence, argument, media, metadata, and canonical route. Relationships add another route through the work; they do not make an incomplete Article whole.

A recurring subject may become a connective node when it has durable meaning and meets the current public-route threshold. It can connect Articles published at different times, filed in different sections, or entered through different questions. A later Article may reveal a relationship that was not visible when an earlier Article was published, so chronology is one useful route through the archive rather than its required outline.

Keep Article and subject contexts bounded. Referencing a subject does not import every note, source, entity, or Article attached to it. Preserve the current Editorial Mesh registry, public subject threshold, explicit related-Article overrides, and evidence boundaries instead of building a second graph format.

## Metadata dimensions

Treat these dimensions separately.

### Primary section

One value. Human-facing. Broad and stable.

Choose it from the central object, reader promise, and article engine, not from the largest number of incidental references.

### Subjects

Many values. These are broad conceptual lenses such as:

- hip-hop
- jazz
- sampling
- infrastructure
- waste systems
- counterculture
- publishing
- web production
- artificial intelligence
- environmental history
- conceptual engineering
- folklore

Subjects are not named entities.

### Series and specials

Many values are allowed, but membership must be rule-based.

A series is a recurring HobFarm editorial property with an explicit membership test. Never infer series membership because an article feels similar to another article.

### Entities

Normalize named things by type:

- people
- organizations
- places
- events
- works
- publications
- technologies

Use canonical IDs and aliases so spelling variants do not create duplicate nodes.

Examples of failure to avoid:

- `grateful-dead` and `the-grateful-dead` as separate entities
- `dead-and-company`, `dead-company`, and `dead-co` as separate entities
- inconsistent capitalization creating parallel tag routes

### Source artifacts

This field records objects that structurally originate an article, not every citation.

Examples:

- a Playboy issue
- a LIFE photo spread
- a National Geographic feature
- a Vogue page
- a newspaper clipping
- a catalog
- a map
- a photograph
- a technical manual

Ordinary research citations remain in the article source system.

### Story modes

Optional. Do not turn these into top-level sections automatically.

The corpus audit may find recurring engines such as:

- place study
- systems investigation
- archive excavation
- media genealogy
- plausible future
- object history
- process essay
- personal-history trail

A story mode becomes controlled metadata only when several articles use the same mechanism and the label helps navigation, automation, or related-content logic.

## Hard series rules

### Magazine Time Machine

Magazine Time Machine is not a general media-history label.

An article qualifies only when a specific old magazine artifact directly starts or materially drives the investigation. Typical source publications include Playboy, LIFE, National Geographic, Vogue, MAD, and comparable magazines.

Required logic:

```text
specific magazine artifact
-> discovery or question
-> research trail
-> HobFarm article
```

An article does not qualify merely because it:

- discusses an old magazine
- covers media history
- uses a magazine as one supporting source
- takes place in an era when magazines mattered
- includes vintage imagery

When MTM applies, record the originating magazine artifact in `sourceArtifacts` with role `origin`.

### 3 Degrees of Dick Miller / 3DM

3DM is not a general film or television category.

An article qualifies only when the article has an actual Dick Miller connection and the 3DM connection logic is part of the article's editorial construction.

A movie article with no Dick Miller connection is simply a movie article.

A pre-Code Hollywood article with no Dick Miller connection is not 3DM.

Use the existing connection-chain model when applicable and preserve the evidence for the connection.

### Future series

Every named series must have a written membership rule in the series registry.

Do not create a series around a single article unless the publisher explicitly establishes it as a future recurring property.

A useful default threshold for an inferred series proposal is at least three real or firmly planned entries with the same repeatable engine.

## Claim and evidence boundaries

The mesh must not erase the article's evidence boundaries.

HobFarm can mix documented history, first-person observation, unresolved questions, folklore, conceptual engineering, and plausible speculation in one article. The article must make those states legible.

Do not convert:

- folklore into documented history
- conceptual engineering into an existing proposal
- speculation into prediction
- model output into evidence
- a user's personal observation into a general fact

The existing `sourceNotes` evidence types remain useful. Extend them only if the corpus needs another repeated evidence state.

## AI is infrastructure unless AI is the subject

Do not add AI-related taxonomy merely because AI helped research, organize, code, edit, classify, or publish an article.

Tag or classify AI only when artificial intelligence is materially part of the article's subject.

A Grateful Dead article researched with ChatGPT is still a music or culture article.

A piece investigating generative image systems can legitimately carry AI subjects and entities.

## Canonical registry behavior

Before creating any subject, series, entity, or alias:

1. Check the appropriate registry.
2. Reuse an existing canonical ID when it represents the same thing.
3. Add an alias when the text uses another spelling or name.
4. Create a new canonical node only when it is genuinely new.
5. Never create two public archive nodes for spelling variants of one entity.

Keep display labels separate from canonical slugs.

## Existing HobFarm compatibility

The current repository already contains legacy and current editorial fields including:

- `category`
- `department`
- `format`
- `series`
- `presentsSeries`
- `workshopProgram`
- `entryType`
- `connection`
- `sourceNotes`
- `tags`
- `relatedArticles`

Do not delete these during routine article work.

The editorial mesh should become the canonical semantic layer through an additive migration. Legacy fields remain compatibility inputs until the migration explicitly retires them.

Prefer one grouped object for new canonical mesh metadata if the migration adopts it, for example:

```yaml
mesh:
  section: music
  subjects:
    - jazz
    - hip-hop
    - sampling
  series: []
  entities:
    people:
      - bob-james
    organizations: []
    places: []
    events: []
    works: []
    publications: []
    technologies: []
  sourceArtifacts: []
  storyModes:
    - media-genealogy
```

The exact schema is controlled by the repository after migration. Do not invent a second parallel mesh format.

## New article mesh pass

After article content is substantially complete, run this pass before final validation.

### 1. Read the full article

Do not classify from title, dek, or existing tags alone.

### 2. Identify the central object

Write one internal sentence:

> This article is fundamentally about ________.

Use that sentence to choose the primary section.

### 3. Extract subjects

Choose the repeated conceptual domains that materially shape the article.

Avoid keyword dumping. A subject should help connect this article to other real work.

### 4. Apply strict series rules

Check every candidate series against its membership rule.

For MTM, identify the originating magazine artifact.

For 3DM, verify the Dick Miller connection.

### 5. Extract named entities

Record the important people, places, organizations, events, works, publications, and technologies.

Normalize them through the registries.

### 6. Identify source artifacts

Record only artifacts that structurally start or organize the story.

### 7. Find related articles

Use the mesh to produce candidates. Prefer meaningful connection over recency.

### 8. Preserve editorial overrides

Existing explicit `relatedArticles` remain authoritative unless the publisher asks to change them.

### 9. Validate

Run the repository's schema and build checks required by `AGENTS.md`.

## Related-content logic

Related reading should feel like continuing the current rabbit hole.

Recommended scoring order:

1. explicit editorial relationship
2. same strict series
3. shared central person, event, work, or organization
4. shared place or source publication
5. several shared subjects
6. same primary section
7. recency only as a tie-breaker or fallback

Do not use a universal sitewide latest feed as the main related-reading mechanism on article pages.

Keep scoring explainable. When an audit script recommends an article, it should be able to report why.

## Public archive behavior

Do not automatically generate a public landing page for every one-off entity.

A node can exist in the internal mesh without becoming a public route.

Public topic/entity pages should normally require one of:

- two or more meaningful articles
- explicit publisher promotion
- a recurring search/navigation need
- a strong machine-readable reason that does not create thin crawl pages

Avoid archive-page bloat.

## Machine-readable output

Where the site already emits structured metadata, expose the new mesh in standards-compatible ways when useful.

Useful fields can include:

- canonical URL
- `articleSection`
- normalized `keywords`
- `about` / named entities where the schema is appropriate
- BreadcrumbList
- related article links

The migration may also generate a public editorial graph endpoint containing only public metadata.

Do not expose private notes, unpublished research, sensitive source records, credentials, or internal market data.

## Market-feedback boundary

Editorial taxonomy comes from the articles.

Job listings, LinkedIn research, publishing-industry research, and client demand may influence:

- which existing capabilities deserve clearer documentation
- which site tools are worth improving
- which distribution features are worth building
- which proof routes are useful
- which service offers may sell

They must not determine what an article is about or force an article into employer vocabulary.

Use market calibration as a separate overlay.

```text
editorial corpus -> mesh -> capabilities
market research -> recurring paid needs
capabilities + paid needs -> proof, site, distribution, or service decision
```

Do not reverse that into:

```text
job listing -> distort editorial taxonomy
```

## Final checks

Before completing an article-related task, confirm:

- one primary section is assigned when the migrated schema requires it
- subjects describe material themes rather than every keyword
- MTM is used only with a qualifying magazine-origin artifact
- 3DM is used only with a real Dick Miller connection
- named entities use canonical IDs and aliases
- AI is not tagged merely because it was a production tool
- fact, observation, folklore, inference, and speculation remain distinguishable
- related reading follows the current subject rather than a generic latest feed
- no duplicate entity routes were created
- no new top-level section was invented casually
- market language did not replace editorial language
- build and content validation pass
