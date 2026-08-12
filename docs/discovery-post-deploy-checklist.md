# Discovery post-deploy checklist

Use this after a production deployment that changes routes, metadata, feeds, crawler policy, or public graph relationships.

## Search engines

- Confirm `https://hob.farm/sitemap-index.xml` and `https://hob.farm/sitemap.xml` are accepted in Google Search Console and Bing Webmaster Tools.
- Inspect a few current Article, subject, Presents, Workshop, and project URLs. Confirm the selected canonical is the HobFarm trailing-slash URL and the page is eligible for indexing.
- Review indexing and crawl reports for unexpected `noindex`, redirect, soft-404, blocked, duplicate-canonical, and server-error groups.
- Check representative Article rich results or rendered structured data after schema changes.
- Confirm Bing's sitemap and IndexNow activity is current. HobFarm does not need custom IndexNow submission code while Cloudflare Crawler Hints handles supported update signals.

## Crawlers and delivery

- In Cloudflare, confirm Crawler Hints is enabled for `hob.farm`. This is a dashboard setting, not repository configuration.
- Review Security Events and WAF rules for blocked or challenged verified bots. Public pages should return `200` to Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, Claude-User, PerplexityBot, and Perplexity-User.
- Keep private and transactional routes protected by their existing authentication, `noindex`, and crawler exclusions. Do not open private routes to fix a public crawler problem.
- Fetch `robots.txt`, both sitemaps, the main RSS feed, section feeds, Presents RSS, and Workshop Notes RSS from production. Confirm they are fresh, return the correct content type, and contain only canonical public URLs.

## Referrals and analytics

- Review production analytics for ChatGPT referrals carrying `utm_source=chatgpt.com`, plus referrals from Perplexity, Claude, Google, Bing, and other discovery surfaces.
- Confirm existing `data-event` interactions still arrive in the configured analytics destination. The repository supplies event hooks; provider and dashboard status must be checked outside the codebase.
- Record persistent crawler errors or missing referral data only when they point to a concrete site defect. Do not add speculative endpoints, crawler-specific pages, or another analytics vendor without evidence.
