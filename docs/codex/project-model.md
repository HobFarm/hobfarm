# HobFarm Project Model

Focused reference extracted from the former root repository guide. Read it when the root `AGENTS.md` routes the current task here.

## Current Project Model

HobFarm is the parent publisher. Magazine describes the Editorial layer, not the entire business.

Use this model when making site decisions:

| Layer | Area | Role |
| --- | --- | --- |
| Parent | HobFarm | Owns the publication, catalog, recurring titles, customer relationships, archive, and operating systems |
| Division | Editorial | Articles, essays, reporting, research, satire, cartoons, visual features, and departments |
| Division | HobFarm Presents | Recurring stories, characters, film and media series, entertainment formats, and developed worlds |
| Division | Workshop | Process, production methods, experiments, tools, systems, and the learning paths built from them |
| Division | Shop | Official commercial directory and direct merchandise store; maps visitors to the correct HobFarm or marketplace shelf |
| Division | Support | One-time reader funding through Ko-fi, the $5 monthly HobFarm Club, and a clear account of what support sustains |
| Published work | Games and applications | Browser games, interactive fiction, creative software, research tools, and prototypes such as Other Alice, StyleFusion, and Grimoire |
| Shared format | Gallery | Visual archive used by Editorial, Presents, Workshop, Projects, and Shop |
| Program | Academy | Free and affordable one-time courses built from practical HobFarm workflows |
| Catalog | Projects | Public index for tools, games, applications, systems, experiments, and ongoing work |
| Knowledge layer | Grimoire | Notes, references, project memory, content planning, structured knowledge, and selected game or application data |
| Utilities | About, Account, Contact, Customer Help, Legal | Publisher information, customer access, assistance, and policies |

Do not force every release through an article. Choose the primary object that fits the work: article, Presents entry, comic, adventure, game, application, gallery entry, Workshop note, course, product, or project page.

Use this publishing and commerce model:

```text
the publication creates interest
Workshop shows the work and establishes credibility
Academy teaches the repeatable method
Commerce sells useful finished outcomes
Support funds the next article, project, game, or release
the site keeps every route and relationship understandable
```

Each published object still needs a durable primary route and useful relationships to other HobFarm work. Social media is a distribution option. It is not the source of truth, the site architecture, or a required step for every piece.

### Publisher mesh

HobFarm is the parent publisher and canonical source. Articles are its main editorial body. Workshop keeps the production record and explains how selected work developed. Presents collects recurring properties with their own identity and release pattern. Academy teaches methods proven through real work. Shop routes finished products to a verified direct or external shelf. External platforms handle the distribution, gallery, video, audience, or marketplace job they are suited to do.

Use one primary canonical object for each release, then connect related routes instead of duplicating the work. An application owns its application or project page. A Workshop page explains its development. An article exists when there is a real story, investigation, argument, release note, or reusable finding. A product needs a credible deliverable and fulfillment path. A course needs a repeatable, tested method.

The node mesh is a network, not a required funnel. A source, question, or project may produce any useful combination of articles, Workshop records, applications, Presents entries, media, lessons, products, and external releases. None of those branches is mandatory, and any useful result may start another project.

## Node mesh principles

- A node is a bounded and independently useful body of work. It may originate in any HobFarm division or medium.
- Nodes keep only the sources, identity, decisions, rules, outputs, and records they need. A connection transfers selected artifacts or decisions, not one unlimited shared context.
- Every edge describes a real directional relationship. Do not infer edges from loose keyword similarity or assume a relationship is bidirectional.
- Two or more nodes may contribute to a new composite node. The parent nodes remain intact, independently useful, and available for later composition.
- Articles and recurring subjects form a living Editorial mesh. Workshop projects, workflows, applications, characters, media, visual systems, courses, products, and releases form an overlapping production mesh.
- Articles, Workshop, Presents, applications, Gallery, Academy, Shop, and external platforms are optional public destinations. They are not required stages in a funnel.
- Stable sources, identity, authored rules, constraints, representations, validation, and production records should survive changes in models, providers, APIs, components, and hosting tools.
- Keep public mesh data curated. Do not build a graph database, universal node registry, or new graph infrastructure without a demonstrated publishing need.

---

## Website Direction

The site should read as the home of an independent publisher and creative studio.

Use these terms consistently:

* **HobFarm** for the parent publisher and studio.
* **Editorial** for the publication division; **Articles** for its main public feed and content type.
* **HobFarm Presents** or **Presents** for recurring stories, characters, entertainment series, and developed worlds.
* **Workshop** for production methods, experiments, tools, and systems.
* **Shop** for the commercial directory and HobFarm-controlled direct merchandise.
* **Support HobFarm** for one-time Ko-fi funding and the monthly HobFarm Club.
* **Games and applications** for playable work and public software. Give released work a direct route and associate it with Presents, Projects, or Workshop according to its actual role.
* **Gallery** for the shared visual archive.
* **Academy** for free and affordable one-time workflow courses. Membership is not the default course checkout.
* **Projects** for the catalog of tools, games, applications, systems, and work in progress.
* **Customer Help** for billing, orders, downloads, account access, refunds, and technical assistance.
* **Grimoire** only where it is useful as a knowledge system, project memory, application data layer, or reviewed public reference.

New Editorial entries live in `src/content/articles/`; do not introduce a `blog` collection or new helper naming.

Do not describe all of HobFarm as a magazine, an AI tool company, a gallery, or a store. Those are parts of the publisher, not the parent identity.

Use plain descriptive copy. Say what the thing is, what it contains, and what the reader can do next.

Let the content establish the tone. Do not label the work as strange, weird, unusual, or similar vibe words in core positioning.

---

## Homepage Rules

When working on the homepage, treat it as the front door to the publisher.

Preferred order:

1. Hero intro identifying HobFarm as an independent publisher of articles, media, games, and creative systems.
2. Current lead release. This can be an article, Presents title, game, application, visual feature, course, or Shop release.
3. Latest Articles or Editorial highlights.
4. HobFarm Presents titles, characters, games, or recurring media.
5. Workshop work and useful Gallery evidence.
6. Academy or Projects when there is a real public path.
7. Current Shop releases.
8. Support HobFarm, About, or another clear publisher-level next action.

The homepage should quickly answer:

1. What is HobFarm?
2. What is new or worth opening now?
3. What can I read, watch, play, or explore?
4. Which recurring titles and projects exist?
5. What can I learn or buy?
6. How can I support the next release or contact the publisher?

---

## Publication Architecture

Treat `docs/site-architecture.md` as the durable public route map and `src/data/editorial-mesh.ts` as the executable Editorial registry. The primary publisher navigation remains Articles, Presents, Workshop, Academy, Shop, and About.

Editorial has exactly six canonical section archives: Technology, Art & Design, Culture, Film & TV, Music, and Places & Systems. Sections are the human navigation layer. Series and subjects are separate discovery layers; do not present them as additional sections.

Only subjects shared by at least two released articles receive public topic routes. Strict `mesh.series` membership owns Magazine Time Machine, 3DM, and Built Over presentation. Legacy department and series fields may remain for compatibility, but they must not decide canonical URLs or public membership.

After a production build, run `npm run audit:site-structure` when changing navigation, routes, sitemap behavior, RSS, canonicals, structured data, or public article relationships.

---

## Operating Principle

Make HobFarm easier to publish, read, watch, play, learn from, buy from, support, and maintain.

Keep the business legible:

```text
HobFarm publishes articles, media, games, applications, and recurring titles
Workshop shows how selected work was made
Academy teaches a repeatable method
Shop and external shelves sell useful finished outcomes
Ko-fi and HobFarm Club fund the next round
Customer Help handles orders, access, accounts, and problems
```

Connect these areas only when the relationship is real. Keep the work scoped. Make the site clearer. Validate before handoff.
