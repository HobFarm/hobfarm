# Hit the Source Directly: research notes

Research checked August 12, 2026. The article is an argument and technical explainer anchored in the author's recollection of learning about feeds while publishing video around 2006. The factual spine uses original specifications, official product documentation, official institutional feeds, and first-party software repositories.

## Central claim

RSS does not certify quality and cannot prevent publishers from making slop. Its useful property is narrower: a subscription is a direct, reader-chosen connection to a source. It bypasses an engagement-ranking system that chooses which sources and posts deserve distribution. Filters, summaries, and personal software can still operate downstream, but the reader chooses the input list first.

## Historical spine

- Netscape published RSS 0.90 on March 15, 1999. The specification told publishers to place an **Add Channel** button on their sites.
- RSS 0.92, published December 25, 2000, included the optional `enclosure` element. That mechanism later became central to podcast episode delivery.
- Atom is not a later name for RSS. It is a separate syndication format standardized as RFC 4287 in December 2005.
- Google announced that Reader would retire on July 1, 2013.
- Firefox removed its built-in feed preview and Live Bookmarks in Firefox 64 in December 2018. Mozilla provided an OPML export path for saved Live Bookmarks.

These milestones support a measured disappearance argument: the open formats continued working while major interfaces that taught ordinary users about them became less visible.

## 2026 hinge and provenance

On February 1, 2026, Andrej Karpathy argued that RSS offered more long-form material and less material shaped to provoke. He called RSS "open, pervasive, hackable" and linked to a 92-feed OPML file as a cold start.

The attribution chain matters:

1. Michael Lynch produced the Hacker News Popularity Contest and its 2025 personal-blog ranking.
2. Evan Schwartz converted that list into an importable OPML file containing 92 feeds.
3. Karpathy linked to the OPML file as an easy starting point.
4. Later small software projects used that source list or the broader feed pattern for local search, scoring, summaries, or digests.

The attached task packet calls Schwartz **Eric**. The linked gist and GitHub profile identify him as **Evan Schwartz**, so the article and report use Evan. Some downstream repositories call the file "Karpathy-curated". That label is convenient but inaccurate and should not be repeated as fact.

## Current uses that keep the formats practical

- Podcast applications read RSS feeds and retrieve episode audio from enclosure URLs.
- YouTube exposes channel updates as Atom notifications, and eligible audio-first podcast publishers can connect RSS feeds to YouTube Studio.
- GitHub exposes Atom activity and security-advisory feeds.
- arXiv publishes daily RSS and Atom feeds for active subject areas.
- USGS publishes real-time earthquake feeds, while the National Weather Service publishes active-alert indexes as Atom.
- The SEC publishes structured-disclosure feeds, and GovInfo offers collection and search-based feeds.
- Personal feed software can hand a chosen subscription list to local search, scripts, or language-model summarizers.

## Practical HobFarm path

The site already exposes a combined feed at `https://hob.farm/rss.xml` and six section feeds under `/articles/{section}/rss.xml`. Feed autodiscovery exists in the base layout, and scheduled articles are filtered through the shared publication-time helper. The implementation work should make this healthy machine-facing system visible and understandable to readers. It should not replace the feeds or add a newsletter dependency.

## Writing boundaries

- Keep the opening first-person details to what the author supplied.
- Link **The Future Was Already There** near the opening.
- Explain RSS in ordinary language before introducing XML details.
- Explain OPML as a portable subscription list, not a feed.
- Avoid claiming that RSS removes low-quality work.
- Avoid claiming that feed delivery is always instant.
- Avoid market-size or adoption claims for small GitHub projects.
- Use no em dashes in authored public prose.
