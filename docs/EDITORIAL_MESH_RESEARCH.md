# Editorial Mesh Research Notes

## What the existing HobFarm repo already has

The current repository is not starting from zero. It already has several pieces of a mesh system, but they are mixed together.

Observed in the current repo:

- The article schema has `category`, `department`, `format`, `series`, `presentsSeries`, `workshopProgram`, `entryType`, `connection`, `sourceNotes`, `tags`, and explicit `relatedArticles`.
- `department` currently includes several different kinds of concepts, including Magazine Time Machine, Funnies, Before & After Eras, HobFarm Presents, Workshop Notes, and Essays & Arguments.
- The department registry explicitly acts as the routing taxonomy and maps legacy labels into canonical department slugs.
- 3DM already has a structured `connection` object with an origin, degree count, connection chain, evidence, and source fields.
- PagesCMS exposes all of these article fields, so any new canonical mesh fields need to be added there too.
- The current related-article fallback scores same series +6, same department +4, and each shared tag +1. This means the tree-like filing system still has a large influence on recommendations.
- Current tag normalization lowercases strings but does not provide a general canonical alias registry.

This is a strong base for an additive migration rather than a rewrite.

## What large editorial sites suggest structurally

### Rolling Stone

Rolling Stone uses broad human-facing editorial desks such as Music, Politics, TV & Movies, and Culture, then exposes narrower content types and tag archives underneath.

Its tag system also demonstrates a failure mode HobFarm should avoid. Current Rolling Stone regional tag archives expose parallel pages for variants such as `Grateful Dead` and `The Grateful Dead`, and for variants of Dead & Company naming. A semantic mesh should normalize those names to canonical IDs instead of turning aliases into separate nodes.

Takeaway:

```text
broad desks for navigation
+ narrower formats/subdesks
+ entity/topic archives
```

but add canonical alias handling.

### Pitchfork

Pitchfork separates multiple dimensions more clearly. Its Features area contains formats such as Lists & Guides, Interview, Longform, Cover Story, and Podcast, while genre pages such as Pop aggregate different object types including reviews, tracks, features, columns, and news.

That supports the HobFarm model:

```text
subject != format != series != entity
```

A single flat category list does not need to carry every job.

## Revenue research

### Rolling Stone

Rolling Stone currently has direct subscription revenue through print plus e-edition subscriptions, a merchandise shop, newsletter and special-offer infrastructure, events promotion, and a paid Culture Council membership product. Display advertising also exists in its broader web model, but an ad blocker can remove much of that experience for individual readers.

The useful lesson is not to copy every revenue stream. The useful lesson is that a mature publisher usually has several independent revenue engines.

### Condé Nast / Pitchfork

Condé Nast reported 2025 growth in subscription revenue, events, commerce, and branded content, and said Pitchfork is profitable and growing audiences and subscriptions inside the GQ operating structure.

Again, this is large-company economics. HobFarm should not pretend it has the audience or scale to copy the model directly.

### 404 Media

404 Media's current paid supporter tier is $10/month or $100/year and removes ads. The publication has publicly said the vast majority of its money comes from paid subscribers and that programmatic ads bring in very little by comparison.

This shows that an editorial business can make advertising secondary, but it still depends on converting a real audience into paying readers.

### Defector

Defector describes itself as sustained by roughly forty thousand subscribers supporting its worker-owned staff. Its entry subscription is ad-free.

This is another reader-revenue model, but it starts from a substantial paying audience.

## Practical HobFarm revenue implication

HobFarm currently should not depend on ad impressions or affiliate links as the first revenue engine.

The more realistic sequence is:

```text
publication and archive
-> proof of editorial / web / systems capability
-> paid employment, commissioned work, client work, or automation work
-> audience grows if the archive compounds
-> reader support becomes more meaningful
-> optional later products such as membership, licensing, commissioned editorial, direct sponsorship, events, or merchandise
```

This keeps the content clean while allowing the publication to support other income lanes before traffic is large enough to support the publication by itself.

## Social automation as a separate offer

The social automation idea should remain separate from the editorial taxonomy.

Possible offer shape:

```text
canonical website object
-> extract approved text / images / video
-> generate channel-specific variants
-> schedule
-> owner approves
-> analytics return to one simple report
```

For HobFarm, the source object is usually an article.

For a local event business, the source object might be an event, package, gallery, or client photo set.

The useful buyer is not "someone who wants AI." The useful buyer is an owner-operated business that has real work to show, has money, dislikes maintaining social feeds, and wants a lightweight approval workflow instead of becoming a content creator.

Treat the first real client as a pilot and record the actual time saved, outputs produced, approval burden, and business result before turning it into a larger offer.

## Boundary between editorial and market research

Keep three systems separate:

```text
EDITORIAL MESH
What the work is and how it connects.

MARKET CALIBRATION
What employers, editors, publishers, and clients currently pay people to do.

BUSINESS / DISTRIBUTION
How HobFarm work reaches buyers or creates revenue.
```

Market evidence can justify better site documentation, stronger publishing operations, improved automation, clearer professional proof, and new paid offers.

It should not rewrite the editorial identity of an article.

## Source list

- HobFarm repository: `src/content.config.ts`
- HobFarm repository: `src/data/departments.ts`
- HobFarm repository: `src/lib/articles.ts`
- HobFarm repository: `.pages.yml`
- Rolling Stone subscription: https://customerservice.rollingstone.com/
- Rolling Stone shop: https://shop.rollingstone.com/
- Rolling Stone newsletters: https://cloud.email.rollingstone.com/signup/
- Rolling Stone Culture Council: https://council.rollingstone.com/
- Pitchfork features: https://pitchfork.com/features/
- Pitchfork genre example: https://pitchfork.com/genre/pop/
- Condé Nast 2025 performance memo: https://www.condenast.com/news/a-memo-from-ceo-roger-lynch-2025-performance-and-looking-ahead
- 404 Media membership: https://www.404media.co/membership/
- 404 Media revenue discussion: https://www.404media.co/why-404-media-needs-your-email-address/
- Defector products: https://defector.com/products
