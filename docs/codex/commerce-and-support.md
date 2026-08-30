# HobFarm Commerce and Support

Focused reference extracted from the former root repository guide. Read it when the root `AGENTS.md` routes the current task here.

## Shop and Product Rules

Shop is a map, not an inventory aggregator. It is the official commercial directory and the direct store for HobFarm-controlled merchandise.

Use this channel structure:

| Surface | Job | Main offers |
| --- | --- | --- |
| HobFarm Shop | Commercial directory and direct merchandise store | Approved Printful merchandise, publication products, and clear links to the correct external shelf |
| Academy | Teach repeatable methods | Free lessons, affordable one-time workflow courses, modular courses, and larger bundles |
| Etsy | Craft and search-oriented digital products | Clip art, scrapbook assets, seasonal packs, printable ephemera, decorative scenes, and clearly labeled archive collections |
| DeviantArt | Character and visual-development assets | Mannequins, outfits, sheets, wallpapers, premium packs, adoptables, and exclusives |
| eBay | Actual old or counted physical objects | DVDs, magazines, books, antiques, collectibles, decor, media, and one-off finds |
| Ko-fi | One-time reader support | Tips and project funding |
| HobFarm Club | Ongoing support | $5 monthly supporter membership with one small durable benefit |
| Patreon | Paused | Preserve the account and history, but do not surface Patreon publicly unless a distinct future community is approved |

The Shop should explain what each shelf contains and send people to the correct storefront. Do not copy every Etsy, DeviantArt, or eBay listing into HobFarm. Marketplace listings expire, move, and sell out; aggregating them creates stale inventory and maintenance work.

HobFarm-controlled direct products may have permanent Shop pages and on-site checkout. External shelves should normally use clear category descriptions and storefront links. Add an individual marketplace listing only when its relationship to an article or release is useful enough to maintain manually.

Every Shop product page should state:

1. What the buyer receives.
2. Current status and availability.
3. Price and currency when approved.
4. Product variants or editions.
5. License or usage terms.
6. Fulfillment and checkout provider.
7. Shipping or delivery expectations.
8. Refund and Customer Help paths.
9. Related free work when the relationship is real.

Keep public previews separate from buyer files. Do not expose full-resolution paid originals, private manifests, signed download URLs, order data, or customer details in HTML, feeds, JSON-LD, sitemaps, agent-readable routes, or client code.

Do not invent products, prices, listings, stock, marketplace availability, course access, shipping promises, or licenses. A buy action appears only when the product is live and its checkout destination has been verified.

When Workshop needs commercial links, use one shared relationship component with up to three paths:

1. **Learn the method:** the related Academy course, price, time, and expected result.
2. **Use the finished assets:** the related Etsy or DeviantArt collection.
3. **Support more work:** Ko-fi or HobFarm Club.

Reuse `relatedWorkshop`, `relatedAcademy`, `relatedProducts`, `workshopCTA`, `academyCTA`, and `supportCTA`. Do not write a new custom sales block into every Workshop page or force every page into a funnel.

---

## Support and Customer Help Rules

`/support/` funds the publisher. Use it for one-time Ko-fi support, HobFarm Club membership, buying products or courses as another way to fund the work, and a plain account of what greater revenue could make possible.

`/helpcenter/` serves customers. Use it for billing, orders, downloads, course access, refunds, accounts, and technical help.

Do not mix patronage with customer service. Do not describe support as a purchase, donation, or tax-deductible contribution unless the legal and tax status explicitly permits that language.

Use `/membership/` for HobFarm Club, the account-linked $5 monthly support program. Keep Shop purchases and new Academy courses separate from membership. Promise one small durable supporter benefit, not a broad subscription to products and downloads.

The accurate advertising and funding claim is:

> No third-party display ads, sponsored posts, or paid editorial placement.

House ads, Shop links, course promotion, clearly labeled affiliate links, and support requests may still appear. Do not flatten that claim into “ad-free.”

Patreon is paused. Remove it from public funding copy, Shop, Support, navigation, components, and structured metadata. Preserve the account and historical records; this is a public-site cleanup, not account deletion.

Do not add a Jobs page. The existing Contribute path should state that unsolicited employment applications are not accepted. Publish future paid assignments only when the budget, scope, and role are real.

---

## Affiliate Link Rules

Affiliate links belong near relevant tool demonstrations in Workshop and Academy. Do not turn Editorial articles into disguised product funnels.

Every affiliate recommendation needs a nearby disclosure:

> Affiliate link: HobFarm may earn a commission if you buy through this link. It does not change your price.

A footer or legal-page disclosure alone is not enough. Keep the disclosure close to the endorsement or recommendation.

---
