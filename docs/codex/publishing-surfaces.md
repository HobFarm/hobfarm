# HobFarm Publishing Surfaces

Focused reference extracted from the former root repository guide. Read it when the root `AGENTS.md` routes the current task here.

## Writing and Formatting Rules

Use [`../regular-prose-guidelines.md`](../regular-prose-guidelines.md) as the final style pass whenever creating or substantially rewriting public-facing copy. This includes articles, captions, World Guide entries, project and gallery descriptions, product copy, social text, comments, replies, summaries, and short explanations.

Lead with the real claim. Use ordinary punctuation, varied sentence rhythm, concrete nouns, active verbs, and functional Markdown. Remove assistant-shaped contrast, generic setup, abstract corporate language, fake enthusiasm, and decorative formatting.

The guide controls prose shape, not canon. Factual constraints, the user's current request, established character voice, and page-specific editorial briefs take priority. Preserve sharp, gothic, psychedelic, satirical, technical, or cinematic language when it carries actual meaning.

Use this point-of-view system for publisher-level copy:

| Subject | Point of view |
| --- | --- |
| Operator | Use `I` for actions, decisions, observations, history, testing, research, writing, development, and judgment |
| Reader | Use `you` for direct instructions, invitations, and explanations |
| HobFarm | Use third person for the publication, studio, archive, or operating system |
| Workshop, EZIZE, Grimoire, Wildcard Machine, and named systems | Use third person when describing what the system does |
| `d00d` | Public editorial byline and online author identity |
| Kris Reynolds | About, contact, resume, employment, legal, professional, and identification contexts |
| `we` | Use only when multiple real people are involved in the work being described |

Third person may describe a public object or system. Do not use it to imitate an outside biographer describing the operator. Do not replace `d00d` article bylines or spread Kris Reynolds across publisher-level pages that do not need professional identification.

### Media autonomy

User-supplied and user-approved editorial media is approved for publication by default.

- Add optional editorial treatment, including badges, labels, warnings, frames, or comparable presentation, only when the user explicitly requests or approves it for that specific article or asset.
- External conventions, service behavior, historical practice, and tool capabilities may inform the available options, but they do not authorize unsolicited editorial treatment.
- Apply requirements that are technically necessary for rendering, accessibility, safety, schema compliance, or valid output. If a real technical service constraint blocks publication, report the exact constraint and its source without treating it as editorial permission to modify the media.

This rule does not remove warning infrastructure or special treatment explicitly requested for other work.

---

## Article Rules

Articles are the main Editorial objects. They are not wrappers for every game, product, comic, course, or Presents release.

Article pages should include:

1. Title.
2. Date.
3. Description or dek.
4. Hero image when available.
5. Tags.
6. Share actions.
7. Related articles.
8. Related gallery or project links when relevant.
9. Related products, Workshop, Academy, Support, or follow actions when relevant.
10. Good metadata for social previews.

Recommended article metadata where the schema supports it:

```ts
title: string;
excerpt: string;
dek?: string;
description?: string;
publishedAt?: Date | string;
pubDate?: Date | string;
updatedDate?: Date | string;
heroImage?: string;
tags?: string[];
format?: string;
series?: string;
department?: string;
relatedGallery?: string;
relatedProject?: string;
relatedArticles?: string[];
relatedWorkshop?: string[];
relatedAcademy?: string[];
relatedProducts?: string[];
```

Every article needs `publishedAt` or `pubDate`. Inspect `src/content.config.ts` for current enums and relationship fields before creating frontmatter.

New scheduled articles should normally publish at 4:20 p.m. in the `America/Los_Angeles` time zone, spaced 24 hours apart. Preserve publication times that were already scheduled unless the user asks to change them. Use the correct UTC offset for the release date so daylight saving time is handled explicitly.

A publication timestamp records when an article becomes eligible for release. Astro produces static output, so an existing deployment does not change when the clock passes that timestamp. The durable workflow at `.github/workflows/release-scheduled-articles.yml` checks the newest eligible route at 4:20 p.m. Pacific and several fallback times. When that route is missing, it triggers a protected Cloudflare Pages deploy hook, waits for the new build, and verifies that the article came online.

The article source must be committed and pushed to `main` before its release time. Once it is there, the release monitor performs the post-timestamp build automatically; the author does not need to make another commit or manually redeploy. The timestamp remains release eligibility rather than an executing scheduler by itself.

Keep optional fields optional unless the user explicitly requests a schema migration.

### Publication automation boundary

Use existing publication infrastructure. Content is data inside the publishing system, not a reason to create another publishing system.

- An ordinary article task may change content, media, metadata, relationships, and scheduled publication data. Do not create an article-specific workflow, cron job, deployment path, build pipeline, permanent CI test, or other infrastructure unless the user explicitly requests it or the existing architecture demonstrably requires it.
- The durable scheduled-release monitor is the only standing automatic deployment path for articles. It may rebuild committed `main` after a release timestamp, but it does not edit article files, create commits, or push source changes. Do not add another automatic article deployment path without an explicit infrastructure request.
- Remove temporary task scaffolding before completion unless it has become intentional durable infrastructure.
- Test durable publishing behavior and content invariants. Do not require temporary task artifacts to remain in the repository.
- Investigate full-suite failures caused by likely stale task residue. Do not dismiss them as unrelated without tracing the current intent.
- Do not add CI/CD automation merely because automation is possible.

## Editorial Mesh Rules

After creating or substantially editing an Editorial article, use `.agents/skills/editorial-mesh/SKILL.md` before final validation. Use it directly for classification, scheduling relationships, public discovery, navigation, series, subjects, entities, and related-reading work.

The visible publication may use a small set of broad sections, but article relationships are a mesh. Do not force series, subjects, people, places, events, works, source artifacts, and related articles into a single category tree.

The current corpus is the source of truth for editorial classification. Market research may improve professional proof, distribution, automation, and business offers, but it must not drive article taxonomy.

Hard series rules:

- Magazine Time Machine requires a specific old magazine artifact to directly originate or materially drive the article.
- 3DM requires an actual Dick Miller connection and the article must use that connection as part of the series logic.
- Do not infer either series from thematic similarity.

After substantial article work, run the editorial mesh pass defined by the skill and preserve existing URLs and explicit related-article overrides.

## HobFarm Presents Rules

HobFarm Presents holds recurring entertainment titles: stories, illustrated fiction, cartoons, film and media series, characters, and developed worlds.

A Presents title should explain:

1. What the title is.
2. Which entries or releases exist now.
3. Where a new reader should start.
4. Which characters, articles, videos, games, galleries, or products belong to it.
5. Whether the work is released, serialized, in production, or still a prototype.

Use the dedicated `comics` or `adventures` collection when the schema and route already support that object. Do not force a comic, episode, or interactive entry into Articles only to make it publishable.

---

## Games and Applications Rules

Games and applications are published HobFarm work.

Current examples include Other Alice as interactive story/game work, StyleFusion as a creative application, Grimoire as a knowledge system and developing game engine, and smaller browser experiments such as the craps simulator.

Use these rules:

1. Give a released game or public application a durable direct route.
2. Use Projects for its catalog record, status, related work, and development context.
3. Associate entertainment games and interactive stories with HobFarm Presents when they belong to a recurring title or world.
4. Associate production tools and research applications with Workshop when the method is part of their public value.
5. Keep prototypes labeled honestly. Do not imply a complete game, supported service, multiplayer system, or maintained application when only an experiment exists.
6. Document controls, accessibility, persistence, data use, browser support, and failure states when they affect play or use.
7. Keep secrets, privileged model calls, customer data, and paid assets out of client-only code.

Games do not need an article to justify their existence. Add an article only when there is a real editorial story, investigation, release note, or design analysis to publish.

---

## Social Sharing Rules

Every article should be easy to share.

Required metadata for article pages:

| Field                  | Purpose                     |
| ---------------------- | --------------------------- |
| `og:title`             | Social preview headline     |
| `og:description`       | Social preview text         |
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

---

## R2 Media Path Rules

Use these prefixes for new public R2 uploads:

```text
articles/{article-slug}/{filename}
presents/{title}/{filename}
workshop/{program}/{filename}
gallery/{collection}/{entry}/{filename}
projects/{project-slug}/{filename}
shop/{product}/{public-filename}
```

Do not add new objects under `blog/`, a generic `pages/` prefix, or an ad hoc
root prefix when one of the established destinations fits. Treat existing R2
keys as durable URLs. Do not move or rename old objects merely to make the
bucket look consistent; a real migration must update references, preserve the
old URL through verification, and remove it only after a separate review.

---

## Gallery Rules

Gallery is a shared visual archive. Its entries can support Editorial, HobFarm Presents, Workshop, Projects, games, and Shop without becoming a separate business division.

They should prioritize:

1. Strong image presentation.
2. Clear title and description.
3. Related article or project links.
4. Useful metadata.
5. Mobile readability.
6. Fast loading.
7. Durable CDN image paths.

Prefer media hosted on:

```text
https://cdn.hob.farm/gallery/{gallery-slug}/
https://cdn.hob.farm/projects/{project-slug}/
https://cdn.hob.farm/site/
```

Do not add large media files to the repo unless explicitly instructed.

---

## Projects Rules

Projects is the public catalog for games, applications, systems, tools, experiments, and ongoing work. Recurring entertainment titles and worlds should use HobFarm Presents as their primary public home when that structure fits.

A project page should explain:

1. What it is.
2. What exists now and its honest status.
3. Where to see examples.
4. How it connects to Articles, Presents, Gallery, Workshop, Academy, games, or Shop.
5. What the reader can do next.

Do not call a tool, game prototype, recurring title, or creative system a product unless there is a defined Shop offer, buyer, deliverable, price, license, and fulfillment path.

---

## Workshop Rules

Workshop pages explain how work is made.

Use Workshop for:

* process notes
* production methods
* model tests
* tool notes
* prompts and structured workflows
* revisions and failures
* before/after analysis
* build notes
* website systems

Workshop content should help readers understand the method without becoming a generic tutorial unless the task asks for one.

---

## Academy Rules

Academy is the structured learning program connected to Workshop. It is important, but it is not the parent identity or a peer to every publishing division.

Use Academy for:

* free onboarding material
* affordable one-time courses
* workflow packs
* structured learning paths
* tool literacy
* production systems
* templates or reusable methods

Academy content should connect naturally from Workshop, Articles, Presents, Gallery, Projects, and Shop pages when the course grows from that work.

Use the approved course lanes unless the user supplies a different price:

| Course type | Price |
| --- | --- |
| Quick lesson, checklist, or focused fix | $5 |
| Standard short workflow course | $7 |
| Workflow with templates or source files | $9 |
| Multi-part course bundle | $24 to $35 |

Seven dollars is the default for a standard short course. Do not turn HobFarm Club into an all-purpose subscription for courses, products, and downloads.

The Avatar Content System has a legacy membership entitlement. Inspect active access before changing it. Grandfather existing members or provide a clear transition; do not silently remove access.

---

## Content Creation Procedure

When creating website content:

1. Identify the primary published object: article, Presents entry, comic, adventure, game or application route, gallery entry, project page, Workshop note, Academy lesson, product, support page, changelog entry, or Grimoire entry.
2. Inspect the matching collection schema.
3. Create valid YAML frontmatter.
4. Use kebab-case filenames.
5. Write clear titles and descriptions.
6. Add useful tags.
7. Use CDN image URLs when supplied.
8. Link related Articles, Presents titles, galleries, projects, games, Workshop notes, courses, or products when relevant.
9. Run validation.

Do not invent missing facts, routes, image URLs, or product details.

If required inputs are missing, use placeholders only when the task allows it and mark them clearly.

---
