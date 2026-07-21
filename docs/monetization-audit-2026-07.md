# HobFarm monetization audit

Date: 2026-07-21

Scope: audit and architecture only

Production changes: none

## 1. Executive diagnosis

HobFarm has most of the pieces of a credible one-person publishing business, but they do not yet form one legible buying path. The free publication is strong: articles, galleries, Workshop studies, Academy material, project pages, sharing, metadata, and agent-readable versions are already live. The recent *Vacation Into Nothing* response is useful evidence that the editorial work can create trust and demand without turning every article into a pitch.

The commercial layer is earlier. Stripe membership has a serious implementation: authenticated Checkout, a customer portal, verified webhooks, and subscription synchronization are present. Its production secrets are configured, but this audit did not make a real charge, so end-to-end payment remains unverified. The public benefit is also vague and mostly planned. The Shop says Etsy is the main storefront, but the repository has only one product record, Sophia/Stella, marked `coming-soon` with no checkout URL. Ko-fi, Patreon, Etsy, DeviantArt, Lemon Squeezy, eBay, Printful, and direct fulfillment appear in different parts of the site or schema without one declared division of labor. `/support/` is customer service even though “Support HobFarm” links lead there, while `/helpcenter/` already exists for customer help.

The main decision should be:

- `hob.farm` is the canonical catalog and context layer. Every offer gets a durable HobFarm page that explains what it is, what the buyer receives, its license, and the free work behind it.
- `hobfarm-live` becomes the internal product, asset, rights, listing, and inventory control plane.
- Lemon Squeezy handles HobFarm-owned digital downloads and one-time courses.
- Stripe keeps the account-linked monthly membership and handles service or licensing invoices.
- Ko-fi is the lowest-friction one-time support path and does not need an account.
- DeviantArt carries collector/personal-use art editions, Etsy carries designed physical or print-ready craft editions, and eBay carries one-off physical, vintage, prototype, or collectible inventory.

This gives each processor one job. It lets HobFarm sell finished value first, keeps most editorial work free, and makes patronage an honest second path rather than a substitute for products. The first release should be the already-modeled Sophia/Stella sheet pack. The first site change should split financial support from customer help and put one permanent, compact funding notice beneath the homepage hero.

## 2. Current monetization map

### Active application verification

| Check | Finding | Risk or action |
| --- | --- | --- |
| Active repository | `HobFarm/hobfarm`, local `main` at `172912d` | This is the working source of truth. |
| Cloudflare Pages | Project `hobfarm`; custom domain `hob.farm`; Git integration enabled | Current production deployment is from `main` at `172912d`, matching the audited checkout. |
| Live homepage | Matches `src/pages/index.astro` and the requested home components | Confirms the current application, not a same-name legacy project. |
| Older repository | `HobFarm/hobfarm-web` is private, unarchived, default branch `main`, last pushed 2026-06-22 | It is not connected to the verified Pages project. Mark it clearly as legacy and archive it after checking for any unique deployment or history dependency. |
| Documentation | The current README says Pages deploys automatically from `main`; no active deployment instruction points at `hobfarm-web` | Historical media paths containing `HobFarm-web Project Files` are asset-library references, not deployment instructions. |

### Homepage commercial link inventory

| Homepage source | Visible action | Destination | Finding |
| --- | --- | --- | --- |
| `MagazineFrontPage.astro` hero | Browse galleries | `/gallery/` | Clear free-exploration path. |
| `MagazineFrontPage.astro` hero | Support HobFarm | `/support/` | Misroutes patronage intent to customer service. |
| `SiteSections.astro` / site hierarchy | Browse the Shop | `/shop/` | Clear label, but the destination has no verified buyable catalog record. |
| `SiteSections.astro` / site hierarchy | About HobFarm | `/about/` | Card name is “About & Support,” but it does not lead to the support route. |
| `homepage-systems.ts` operating map | See the visuals | `/gallery/` | Clear discovery path. |
| `homepage-systems.ts` operating map | Work with HobFarm | `/services/` | Only homepage commission/service path; should be labeled Commissions & Licensing when the offer is narrowed. |
| `homepage-systems.ts` Before & After | View the Before & After Gallery | `/gallery/before-and-after/` | Contextual gallery path, not a sales path. |
| `homepage-systems.ts` Cute & Corrupted | Series/gallery path | `/gallery/cute-corrupted/` | Strong future product funnel, but no related product is surfaced here. |
| `LatestDrops.astro` | Browse the shop | `/shop/` | Clear catalog path. |
| `LatestDrops.astro` / `DropCard.astro` | Sophia/Stella details | `/shop/sophia-stella-sheet-pack/` | Honest coming-soon page; no buy action. |
| `ExploreSupportFollow.astro` | Galleries | `/gallery/` | Duplicates earlier gallery paths but is not harmful. |
| `ExploreSupportFollow.astro` | Join the Lab | `/membership` | Same recurring payment as Membership, under a different name. |
| `ExploreSupportFollow.astro` | Premium galleries | `/gallery/` | Implies a paid gallery tier that does not exist. |
| `ExploreSupportFollow.astro` | Support HobFarm | `/support/` | Again lands on customer service. |
| `ExploreSupportFollow.astro` | Ko-fi logo button | `https://ko-fi.com/hobfarm/` | The only direct one-time support action, visually subordinate and unexplained. |
| `HomeWorkshop.astro` | Workshop, visual-system, and Sophia/Stella case-study links | Workshop/visual-system routes | Good proof paths, but none connects the demonstrated value to the existing product record or a scoped commission. |

### Offers, providers, routes, and components

| Surface or offer | Provider | Route and implementation | Current status | Main problem |
| --- | --- | --- | --- | --- |
| Free publication | HobFarm | `/`, `/articles/`, `/gallery/`, `/projects/`, `/workshop/`, `/academy/` | Live | Strong audience layer, but contextual commerce is not consistently rendered. |
| Homepage hero support CTA | HobFarm | `MagazineFrontPage.astro` → `/support/` | Live link | “Support HobFarm” lands on customer service. |
| Homepage system support links | HobFarm | `homepage-systems.ts`: Join the Lab, Premium galleries, Support HobFarm | Live links | Three labels imply benefits or destinations that do not match the current membership/support system. |
| Homepage support panel | HobFarm plus external providers | `ExploreSupportFollow.astro` | Live | Repeats membership, Ko-fi, and support choices instead of presenting one clear hierarchy. |
| Latest Drops | HobFarm | `LatestDrops.astro`, products collection | Live component | It can promote records that are not buyable; the only current record is coming soon. |
| Shop landing | Etsy, Ko-fi, Patreon, HobFarm | `/shop/` | Live | Says Etsy is the main storefront, but the site catalog has no verified live Etsy product record. It also mixes products and patronage. |
| Sophia/Stella sheet pack | DeviantArt planned | `/shop/sophia-stella-sheet-pack/` | Coming soon | Good previews and included-file list; missing listing URL, price, final buyer bundle, version, and approved license text. |
| Wallpaper Pack Vol. 01 | DeviantArt planned | Draft gallery record, not a product record | Planned, close to packageable | Claims twelve released pieces but is still draft, uses a temporary media folder, and has no verified checkout. |
| Cute & Corrupted packs | Unassigned | Gallery copy describes future premium packs | Planned | Multiple finished public studies exist, but no edition, manifest, price, license, or product record. |
| Character Mannequin products | Unassigned | Workshop offer shelf | Planned | Five concepts are honestly “Coming soon”; buyer files and licenses are not defined. |
| Custom character package | Manual inquiry | Workshop → `/contact/?subject=custom-character` | Available as inquiry | This is the clearest current commission lane, but scope, starting parameters, and commercial-use terms are absent. |
| General services | Manual inquiry | `/services/` → `/contact/` | Available as inquiry | Too broad for one operator and does not distinguish commission, consulting, and licensing. |
| Monthly supporter membership | Stripe | `/membership/`, `functions/api/stripe/`, auth and customer portal | Technically implemented; payment unverified | $5/month is clear, but benefits are vague, “member content” is coming soon, and unrelated product/course promises appear on the page. |
| One-time support | Ko-fi | External links in Shop and `SupportWays.astro` | Available | It is not presented as the primary low-friction path and is surrounded by overlapping choices. |
| Patreon membership | Patreon | Shop and `SupportWays.astro` | Link is public; operating status not verified | Duplicates Stripe membership and creates another community obligation. |
| Direct digital products | Lemon Squeezy | Present in schema/legal copy only | Inactive | Correct capability, but no product, listing, or webhook/entitlement integration exists yet. |
| Etsy products | Etsy | Generic shop URL | External storefront referenced; individual listings not verified | No listing IDs or URLs are represented in the HobFarm catalog. |
| DeviantArt products | DeviantArt | Planned Sophia/Stella and wallpaper downloads | Planned | No verified live listing URL in the site data. |
| eBay inventory | eBay | Schema/legal/Shop future copy | Inactive | No item records, quantities, or listing IDs. It should not be a digital-download channel. |
| Print-on-demand | Printful | Schema/legal references | Inactive | No connected product, production partner disclosure, sample approval, margin, or fulfillment test. |
| Customer help | HobFarm | `/support/`, `/helpcenter/`, `/contact/`, `/legal/refunds/` | Live but duplicated | `/support/` and `/helpcenter/` overlap while financial-support links use the same word. |
| Funding page | None | No dedicated route | Missing | Readers cannot see one clear explanation of what support funds or choose once/monthly in one place. |

### Current inventory

The table distinguishes repository evidence from external marketplace state. This audit did not log into marketplace seller accounts, so an external listing is not considered live until its listing ID, URL, state, and last verification date are recorded.

| Product or offer | Status | Platform / fulfillment | Price | Public page / checkout | Deliverables and license | Related free work | Missing requirement |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sophia/Stella Character Sheet Pack | Coming soon with finished preview assets | DeviantArt Premium download planned | Unset | HobFarm product page / no checkout | Two full-resolution sheets plus pairing poster; final personal-use terms not yet published | Character/Mannequin Workshop, Cute & Corrupted, visual system | Final files, hashes, version, listing, price, license, refund/support text |
| Wallpaper Pack Vol. 01 | Draft; record says twelve pieces | DeviantArt Premium planned | Unset | Draft gallery page / placeholder external link | 4K vertical and 5K ultrawide set; personal use stated | Premium showcase gallery | Verify all twelve files and rights, replace temporary folder, create product record and listing |
| Cute & Corrupted Critters Vol. 01 | Marketing idea backed by several gallery entries | Unassigned; DA or Lemon Squeezy | Unset | No product page / no checkout | Candidate cute/corrupted pairs, detail crops, contact sheet, readme; license unset | Raccoon, corgi, cat, koala, and cakes galleries | Curate exact set, source/right review, export buyer files, define edition and license |
| Character Mannequin Look 01 Kit | Workshop concept with verified media | Lemon Squeezy recommended | Unset | Workshop only / no checkout | Candidate base, outfit, scene, design notes, and reference guide; license unset | Character Mannequin case study | Define buyer use, package source/export files, write guide, license, product record, listing |
| Avatar Content System paid course or pack | Course system exists; paid offer not packaged | Lemon Squeezy recommended | Unset | Academy pages / no product checkout | Lessons or workflow documents exist in code; buyer bundle and entitlement unset | Academy free overview and Workshop | Finish paid scope, exports, support policy, update plan, product record, delivery test |
| Custom character package | Inquiry available | Manual delivery; Stripe invoice recommended | Quote | Workshop/contact / no instant checkout | Bespoke character, wardrobe, scene, optional motion; terms by proposal | Character Mannequin case study | Intake scope, rights/licensing options, revision limits, deposit and acceptance terms |
| Desk mats | Marketing-only category | Etsy/POD implied | Unset | Shop copy only | No product record | Visual systems | Approved design, sample, production partner, costs, margin, shipping/refund handling |
| Sticker/clip-art downloads | Marketing-only category | Etsy implied | Unset | Shop copy only | No manifest or license | Gallery | Designed set, disclosure, allowed uses, Etsy file-limit packaging |
| Drinkware | Marketing-only category | Etsy/POD implied | Unset | Shop copy only | No product record | Visual systems | Sample, supplier, production partner, shipping, margin |
| Bags and laptop sleeves | Marketing-only category | Etsy/POD implied | Unset | Shop copy only | No product record | Visual systems | Sample, supplier, production partner, shipping, margin |
| Handmade clay pieces | Marketing-only category | Etsy implied | Unset | Shop copy only | No stock record | None linked | Finished object, photos, dimensions, packaging, quantity, shipping |
| Vintage finds | Marketing-only category | eBay recommended | Unset | Shop copy only | Unique physical inventory | None linked | Item-level condition, provenance, quantity, photos, shipping and returns |
| $5 supporter membership | Implemented; production charge unverified | Stripe subscription | $5/month | `/membership/` / authenticated Stripe Checkout | Patronage with account/billing management; durable benefit not yet defined | Site-wide | Approve one honest recurring benefit, confirm live-mode checkout/webhook/portal with a controlled transaction |
| One-time support | Available externally | Ko-fi | Visitor chooses | External Ko-fi page | Support, not a purchase | Site-wide | Make primary on funding page; confirm account settings, receipt language, and fee mode |

### `hobfarm-live` as the inventory control plane

`F:\Web-Stuff\hobfarm-live` is a useful media and rights foundation, not yet a sales inventory system. It indexes 351,144 historical files (714.26 GB), 708 website files (625 MB), and 1,269 R2 objects (2.54 GB), then supports selection, approval, safe R2 plans, and website handoffs. Its current item types are editorial and social; `projects/` has no active product records. It does not model SKU, listing, price, stock, customer deliverable, license edition, or marketplace state.

Add a commerce layer without replacing the existing catalog:

```text
source project/item
  └─ product (the durable creative work)
       ├─ offer/edition (what a buyer receives and may do)
       │    ├─ listing: HobFarm canonical page
       │    ├─ listing: Lemon Squeezy / DeviantArt / Etsy / eBay
       │    └─ fulfillment bundle and version
       └─ inventory (unlimited digital or counted physical units)
```

Minimum fields should be `productId`, stable `sku`, source item IDs, offer ID, edition name, lifecycle, channel, external listing ID and URL, price/currency, quantity or `unlimited`, buyer-file manifest and hashes, public-preview manifest, fulfillment method, license ID/version, rights status, cost of goods, provider fees, version, published/verified dates, and reconciliation notes. The website product record should be generated as a reviewable handoff from this data. Marketplace exports or a weekly CSV reconciliation can update listing state and physical quantity. Do not attempt real-time multi-channel stock sync until more than one channel sells the same counted physical item.

## 3. Broken or confusing paths

### Critical

1. **There is no verified buyable product in the site catalog.** The only product record has no checkout URL. The Shop can send a visitor to generic marketplaces, but it cannot tell them which specific HobFarm item is ready.
2. **“Support HobFarm” routes to customer service.** The strongest support CTA promises patronage and lands on payment troubleshooting. This breaks the simplest way for an inspired reader to contribute.

### High

1. **Processor roles overlap.** Ko-fi, Stripe membership, Patreon, Etsy, DeviantArt, and future Lemon Squeezy/eBay paths are presented without explaining why a visitor would choose one.
2. **Membership value is not yet durable.** Checkout code is substantial, but the public page mixes patronage with digital packs, courses, custom work, and marketplace products that are not member entitlements. Member content is marked coming soon.
3. **Site claims and inventory disagree.** `/shop/` calls Etsy the main storefront while the only product record points toward DeviantArt and remains coming soon.
4. **External inventory is unverifiable from the site.** There are no listing IDs, per-channel states, last-checked dates, or quantities in either repository.
5. **Contextual product relationships stop before rendering.** Article schema supports `relatedProducts`, and `content-relationships.ts` resolves product IDs, but `ArticleLayout.astro` does not render that resolver. Gallery detail has a similar gap.

### Medium

1. **Naming multiplies the same intent.** Join the Lab, HobFarm Club, Membership, Supporter Membership, Premium galleries, Patreon, Support, and Customer Support compete.
2. **The support stack is duplicated.** `/support/` and `/helpcenter/` both handle help. Legal pages still link to `/support/` as if its purpose were unambiguous.
3. **Marketplace categories outrun products.** Six Shop families make the business look broader but emptier than it is.
4. **Patreon duplicates the Stripe relationship.** Unless Patreon has an active, distinct community promise, it adds fees, content obligations, and customer confusion.
5. **Membership is client-rendered.** It hydrates successfully after a short skeleton, but initial HTML does not contain the offer heading. An anonymous user eventually sees “Support HobFarm” and a sign-in requirement; there is no no-JavaScript offer fallback.
6. **Service positioning is too broad.** The services page reads like a small agency while the strongest proof is narrower: character systems, visual/media development, workflow guidance, and licensing.

### Low

1. The Ko-fi image button has a valid `aria-label` and image alt text, but no text node; it is accessible yet visually/provider-branded in a way that does not match the other buttons.
2. The Help Center contains the label “Troubleshoting.”
3. Paid product Open Graph media can use a transformed preview URL even though direct, capped social-preview assets are safer for crawlers.
4. The legacy `hobfarm-web` repository is still unarchived and can mislead future maintainers.

### Validation evidence

| Check | Result |
| --- | --- |
| `npm install` | Passed; 513 packages audited. npm reported 17 existing vulnerabilities (1 low, 6 moderate, 10 high). No dependency changes were made. |
| `npm run build` | Passed. Astro warned that the `adventures` collection has no files. |
| `npm test` | Passed: 150 of 150 tests. |
| `npm run test:e2e` | 32 passed, 4 failed. Existing expectations fail because `/workshop/` titles do not include “HobFarm” and the StyleFusion no-JS prototype no longer contains one exact placeholder sentence, each at desktop and mobile. These are outside this audit and were not changed. |
| Live desktop and mobile QA | `/`, Shop, Sophia/Stella, Support, Membership, *Vacation Into Nothing*, Gallery, Contact, Refunds, and Help Center loaded with canonical URLs, no horizontal overflow, and no broken images. |
| Membership hydration | Initial skeleton resolves to the $5 offer and sign-in CTA. No checkout is available before sign-in. No purchase was attempted. |
| Accessibility spot check | Primary commercial actions are links or buttons with accessible text; Ko-fi has an explicit label. Mobile controls did not overflow. |
| Structured data and paid files | Article and product structured data are present. Coming-soon products emit no offer. Public pages use previews; no buyer bundle or signed paid download was exposed in the audited routes. |

## 4. Proposed monetization architecture

### The customer path

```text
free article, gallery, project, or Workshop study
  ├─ related finished product → canonical HobFarm product page → one checkout provider
  ├─ support the publication → /support/ → Ko-fi once or Stripe monthly
  ├─ learn the method → Academy → Lemon Squeezy course or workflow pack
  └─ commission/license work → scoped inquiry → proposal → Stripe invoice

purchase or support
  └─ optional account/mailing relationship → related future release
```

The product must stand on its own. A course teaches transferable judgment and skill; it must not exist merely to reproduce the marketing loop. The free material shows the work and thinking. The paid object saves the buyer the production time, tooling, and iteration required to make the finished asset, or gives them structured guidance if they choose to learn the method.

### Provider roles

| Provider | One job | Use now | Do not use for |
| --- | --- | --- | --- |
| HobFarm site | Canonical catalog, editorial context, previews, relationships, support explanation | A durable page for every offer, regardless of checkout host | Public storage of paid originals or signed download URLs |
| `hobfarm-live` | Internal source of truth | Assets, approvals, rights, product/offer/SKU records, listings, buyer manifests, stock, handoffs | Customer checkout or public delivery |
| Lemon Squeezy | Direct digital store | Asset packs, documents, templates, zines, and one-time courses; use variants for license editions when needed | Physical goods, bespoke services, tips, or a second membership |
| Stripe | Account-linked relationship and negotiated work | Existing monthly supporter membership, Customer Portal, service/licensing invoices | The first digital product catalog, which would duplicate Lemon Squeezy tax and delivery work |
| Ko-fi | One-time patronage | “Support once” with no HobFarm account | A parallel shop, commissions system, or monthly membership |
| DeviantArt | Art-audience discovery and collector editions | Full-resolution personal-use sheets, wallpapers, and possibly exclusive/adoptable art | The complete creator toolkit or the canonical product page |
| Etsy | Designed physical, handmade, printable, or craft-ready editions | Print-ready sizes, sticker sheets, POD after sample approval, handmade objects | Identical Lemon Squeezy creator bundles or prompt-only packages |
| eBay | Counted physical inventory | Vintage finds, signed prints, prototypes, one-off collectibles | Ordinary digital downloads |
| Patreon | Legacy/optional community | Keep only if an active community has a distinct promise | A duplicate of Stripe membership |

This division follows the providers' actual strengths: Lemon Squeezy acts as merchant of record and supports digital products, file delivery, variants, subscriptions, and license keys; Stripe Checkout and the Customer Portal fit the existing account-linked subscription; Ko-fi supports low-friction tips; DeviantArt supports Premium Downloads; Etsy accepts seller-designed digital and physical items subject to its creativity/disclosure rules; and eBay sharply restricts electronically delivered goods. Recheck policies and fees before launch:

- [Lemon Squeezy product setup](https://docs.lemonsqueezy.com/guides/getting-started) and [store activation rules](https://docs.lemonsqueezy.com/help/getting-started/activate-your-store)
- [Stripe Checkout](https://docs.stripe.com/payments/checkout) and [Customer Portal](https://docs.stripe.com/customer-management)
- [Ko-fi fees and tip settings](https://help.ko-fi.com/hc/en-us/articles/360002506494-Does-Ko-fi-take-a-fee)
- [DeviantArt Premium Downloads](https://www.deviantartsupport.com/kb/en/article/how-do-i-sell-premium-downloads)
- [Etsy creativity standards](https://help.etsy.com/hc/en-us/articles/360024112614-What-Can-I-Sell-on-Etsy) and [digital listing limits](https://help.etsy.com/hc/en-us/articles/115015628347-How-to-Manage-Your-Digital-Listings)
- [eBay electronically delivered goods policy](https://www.ebay.com/help/policies/prohibited-restricted-items/electronically-delivered-items-policy?id=4289)

### Different editions, not duplicate listings

One source collection can produce several offers when each solves a different buyer need:

| Channel edition | Buyer receives | License direction | What remains exclusive |
| --- | --- | --- | --- |
| DeviantArt collector edition | Full-resolution flattened JPG/PNG sheets, posters, or wallpapers | Personal display/reference use | No layered/source files, production guide, or commercial use |
| Lemon Squeezy creator edition | Organized exports, optional layers/source assets where rights permit, readme, workflow notes, and updateable version | Explicit personal or limited-commercial variant | Complete buyer toolkit and updates |
| Etsy print/craft edition | Flattened print-ready sizes, sticker sheets, or a physical item | Personal/craft use; production partner and AI disclosure where required | Marketplace-specific formats and physical fulfillment |
| eBay artifact edition | A signed print, prototype, vintage object, or unique piece | Physical ownership; copyright retained unless separately licensed | Counted one-off object |
| HobFarm public page | Capped previews, story, specifications, related free work, and links | Viewing only | No paid originals |

### Payments and entitlement design

| Need | Recommended flow | Account | Receipts, tax, refunds, metadata |
| --- | --- | --- | --- |
| One-time support | Ko-fi from `/support/` | No HobFarm account | Provider receipt; public copy says support is not a purchase. Confirm Ko-fi fee mode and processor statement descriptor. If direct one-time support is later required, replace this with one Stripe Payment Link rather than running both. |
| Monthly membership | Existing Stripe Checkout Session and Customer Portal | Yes, because the account owns subscription state and any future entitlement | Keep customer/subscription IDs synchronized by signed webhook. Record user ID and tier metadata. Handle active, trialing, past due, unpaid, paused, canceled, incomplete, and incomplete-expired explicitly. Use Stripe receipts and the existing refund/cancellation terms. |
| Digital product | Lemon Squeezy checkout linked from the canonical product page | Not required initially; email receipt is enough | Lemon Squeezy handles merchant-of-record tax and file delivery. Store product/variant/order IDs in the inventory record. Add webhook-backed HobFarm entitlement only when a product genuinely needs account access. |
| Marketplace product | Provider listing | Provider account rules | Provider handles receipt, tax collection where applicable, delivery, and marketplace return workflow. HobFarm records the listing ID and last-known state. |
| Service or license | Approved scope → agreement → Stripe hosted invoice | No HobFarm site account required | Proposal/contract defines deposit, deliverables, revision count, usage, acceptance, tax, and refund/cancellation terms. Invoice metadata carries project/offer ID, never sensitive creative material. |
| Billing portal | Existing Stripe Customer Portal | Yes | Only Stripe membership billing belongs here. Lemon Squeezy and marketplace purchases use their own receipts/support paths. |

The Stripe code uses server-side secrets, same-origin POSTs, request validation, signed webhooks, and HMAC synchronization to the auth service. Secret names are configured in Pages without exposing values. A controlled live-mode transaction is still required before declaring the complete flow operational.

The checkout type can represent a one-time `payment`, but its product allowlist contains only the membership subscription and the endpoint requires HobFarm authentication. Adding a one-time price there would work against the no-account support goal and would expand webhook, receipt, refund, and success-page behavior. Ko-fi is the smaller immediate system. A hosted Stripe Payment Link is the cleaner fallback if HobFarm later replaces Ko-fi with direct one-time support.

### Contextual commerce module

Use the existing `relatedProducts` IDs and `resolveRelatedContent()` rather than duplicating product title, image, price, or URL in article frontmatter. Extend `ArticleLayout.astro` and `GalleryDetail.astro` to render one shared component near the end:

```text
From this rabbit hole

Related article         one editorial continuation
Related visual project  one gallery/project/workshop continuation
Related product         zero or one verified contextual product
Support HobFarm         consistent publication-support action
```

Rules:

1. Product cards resolve only from the products collection.
2. A product appears only when an editor sets its ID or a department default is explicitly approved.
3. Coming-soon records are labeled honestly; no buy affordance renders without `status: live` and a verified destination.
4. The support action is visually secondary to the content and product.
5. A purchase success or provider receipt may invite future releases, but never silently enroll the buyer in marketing.

### Minimal service and licensing offer

Publish four inquiry lanes, not a general agency catalog:

1. **Character and visual-system direction:** design logic, continuity, wardrobe, scene, and presentation systems.
2. **Custom visual and media development:** a scoped image, short motion, or content package based on an approved brief.
3. **Workflow consulting:** guidance for people building their own repeatable production system.
4. **Licensing existing HobFarm work:** personal, editorial, commercial, exhibition, or other negotiated use where HobFarm controls the necessary rights.

Research/editorial commissions should be accepted only after scope and source costs are clear. Contributor submissions and hiring should remain future-facing until there is a defined editorial budget. Support can eventually fund research access, travel and museum work, production services, specialist contributors, international perspectives, editing and fact checking, software development, and faster completion of existing projects; the funding page should describe these as unlocks, not current promises.

### Analytics and attribution

Start with Cloudflare's privacy-conscious page measurement and a small first-party event contract. Do not add fingerprinting or ad-tech pixels.

Stable events:

```text
funding_notice_click
funding_page_view
support_once_click
membership_checkout_start
shop_view
product_view
marketplace_outbound_click
content_product_click
checkout_complete
```

Every event should include only stable internal identifiers such as `source_path`, `product_id`, `offer_id`, `provider`, and `placement`. Use first-party query parameters—`hf_source`, `hf_medium`, `hf_campaign`, `hf_content`—on internal and outbound links, then copy supported identifiers into provider metadata. Count completed payment only from a verified provider webhook or provider report, never from a success-page view. Confirm whether Cloudflare Web Analytics can record the needed custom events; if not, use pageviews/query attribution first or design a minimal consent-reviewed first-party endpoint.

### Agents, crawlers, and paid assets

- Public articles, galleries, projects, Workshop notes, product descriptions, capped previews, prices, licenses, availability, and support destinations are intended for human and legitimate agent discovery.
- `robots.txt` permits search and AI input/reference but opts out named large-scale training crawlers. That does not prevent ordinary article discovery.
- `llms.txt`, Markdown alternatives, JSON-LD, canonical URLs, sitemaps, and agent-skill documents make the publication unusually machine-readable. Preserve source attribution and canonical HobFarm links in those outputs.
- Product structured data is safe when it contains a public description, a direct capped preview, one canonical URL, and a real offer only for a live product.
- Buyer files, source/layered originals, private manifests, customer/account data, signed download URLs, webhook payloads, and private product endpoints must be excluded from public HTML, feeds, JSON-LD, sitemaps, agent documents, and analytics.
- Add Shop and Support destinations to machine-readable site navigation. Product alternates should carry the canonical product page and checkout provider, not a raw paid-file URL.

## 5. Recommended route map

| Current route or label | Proposed route or label | Redirect or link migration | Reason |
| --- | --- | --- | --- |
| `/support/` = customer service | `/support/` = **Support HobFarm** funding/patronage page | Reuse route; move its current help material and update incoming customer-help links | “Support HobFarm” is the natural public funding phrase and already has prominent links. |
| `/helpcenter/` = help index | `/helpcenter/` = **Customer Help** canonical route | No redirect; merge the useful billing/access/refund material from old `/support/` | A working help center already exists, so a third support route is unnecessary. |
| No `/help/` | `/help/` → `/helpcenter/` | Add a permanent redirect only as a short, memorable alias | Preserves a predictable help URL without splitting content. |
| `/membership/` | `/membership/` = **Membership** | No redirect; normalize CTA text to “Support monthly” or “Membership” | Keeps the account-linked Stripe route stable. |
| `/shop/` | `/shop/` = **Shop** | No redirect; replace generic category promises with verified offers and clear provider badges | The site remains the canonical catalog even when checkout is external. |
| `/shop/[slug]/` | Same | No redirect; make each page the canonical product record | Durable SEO, context, updates, and provider-independent links. |
| `/services/` | Keep route; public label **Commissions & Licensing** | Optional `/commissions/` alias can redirect here; do not create duplicate pages | Plainly describes the action and keeps the existing route. |
| `/contact/` | `/contact/` | Add scoped subjects for commission, license, customer help, and collaboration | One intake route is enough for a one-person studio. |
| “Join the Lab,” “HobFarm Club,” “Supporter Membership” | **Membership** | Update components and copy; no URL change | One name for one recurring payment path. |
| “Premium galleries,” “Drops,” “Marketplace products” | **Shop** or the exact product title | Update generic CTAs | Avoid implying a separate entitlement system that does not exist. |
| Patreon primary CTA | Remove from primary navigation and Shop unless a distinct active community is confirmed | Keep a temporary legacy note/link on Support if active subscribers exist | Prevents duplicate membership promises. |
| No funding anchors | `/support/#support-once`, `/support/#membership`, `/support/#where-money-goes` | New internal anchors | Lets the homepage panel offer three precise destinations without adding routes. |

Before changing `/support/`, inventory external links and search results that use it for customer help. Legal/refund/account links should move to `/helpcenter/`; old query parameters or useful fragments should map to corresponding Help Center sections. Do not redirect `/support/` itself because it remains a valid route with a new, clearer job.

Plain-language vocabulary:

```text
Shop
Support HobFarm
Membership
Commissions & Licensing
Customer Help
Account
```

Provider names belong beside the action when they clarify destination: “Support once on Ko-fi,” “Membership billed by Stripe,” or “Buy on DeviantArt.” They are not navigation categories.

## 6. Store launch plan

Prices below are approval ranges, not live promises. Before publishing a price, calculate provider fees, taxes handled by the provider, production time, support load, refund exposure, and any cost of goods.

### 1. Sophia/Stella — Collector Sheet Pack

| Item | Recommendation |
| --- | --- |
| Source assets | Existing Sophia and Stella full-resolution sheets and pairing poster behind the current capped product preview |
| Buyer | Character-art collector, Cute & Corrupted follower, or visual-reference buyer |
| Deliverables | Two flattened full-resolution character sheets, pairing poster, simple contents/readme file |
| License | Personal display and reference; no resale, model training, redistribution, character ownership transfer, or commercial use |
| Price lane | $8–15 |
| Storefront | DeviantArt Premium Download |
| Work remaining | Verify ownership and final resolution, export clean filenames, checksum bundle, approve terms, create listing, test delivery, add listing ID/URL to inventory and product record |
| Product page | Exact dimensions/file types, edition/version, included files, license summary, support/refund destination, contextual links |
| Related free content | Character/Mannequin Workshop, Sophia/Stella visual system, Cute & Corrupted pages |
| Social funnel | Before/after character reveal, poster detail crops, short cute-to-corrupted transition |

### 2. Wallpaper Pack Vol. 01 — Collector Edition

| Item | Recommendation |
| --- | --- |
| Source assets | Twelve pieces named in the draft premium showcase, planned 4K vertical and 5K ultrawide exports |
| Buyer | Phone/desktop customization buyer and HobFarm visual collector |
| Deliverables | Verified final wallpapers, cover, contact sheet, readme |
| License | Personal device/display use; no redistribution, resale, print merchandise, or commercial use |
| Price lane | $6–12 |
| Storefront | DeviantArt Premium Download |
| Work remaining | Confirm all twelve files exist at promised dimensions, review every source right, remove the temporary folder dependency, create product record and real listing, test download |
| Product page | Contact-sheet preview, aspect/resolution table, compatibility note, exact count, license and version |
| Related free content | Premium showcase gallery and the source visual-system/gallery entries |
| Social funnel | Phone and ultrawide mockups, rotating wallpaper preview, “twelve pieces/two screens” post |

### 3. Character Mannequin Look 01 — Creator Kit

| Item | Recommendation |
| --- | --- |
| Source assets | Verified mannequin, outfit, character scene, portrait, sheet, and page graphics from the Character Mannequin case study |
| Buyer | Independent creator who wants a reusable visual-development example instead of building the whole packet from scratch |
| Deliverables | Approved base/wardrobe/scene exports, organized contact sheet, decision matrix, workflow/readme, file manifest; source files only where rights and usability permit |
| License | Personal creator use by default; optional limited-commercial variant only after defining permitted outputs and prohibited redistribution/training |
| Price lane | $19–35 personal; $39–69 limited-commercial if justified by the final files |
| Storefront | Lemon Squeezy |
| Work remaining | Select one self-contained look, remove public-only/page assets, write the guide, define license variants, package and test on a clean machine, create product/listing records |
| Product page | File-tree preview, “what this saves you” explanation, tool requirements, compatibility, sample outputs, clear boundary between assets and instruction |
| Related free content | `/workshop/character-mannequin/` and visual-system pages |
| Social funnel | Sheet-to-outfit-to-scene sequence, decision-matrix clip, one practical production note |

### 4. Cute & Corrupted Critters Vol. 01

| Item | Recommendation |
| --- | --- |
| Source assets | Existing raccoon, corgi, cat, koala, and selected cakes pairs plus short transitions |
| Buyer | Collector, wallpaper/reference buyer, or creator studying controlled same-character transformations |
| Deliverables | Curated full-resolution pairs, detail/contact sheets, short preview loops, readme; exclude any unverified source material |
| License | Start with personal/reference. Add a separate creator/commercial edition only if deliverables support reuse rather than simple viewing. |
| Price lane | $12–20 personal; higher creator variant only after value and rights are defined |
| Storefront | Lemon Squeezy for a structured multi-file pack; a smaller flattened collector edition may be distinct on DeviantArt |
| Work remaining | Pick the exact volume, audit rights, normalize exports, write series notes, package, license, and test delivery |
| Product page | Pair index, dimensions, before/after preview, contents manifest, edition comparison if two editions exist |
| Related free content | Cute & Corrupted gallery entries and department page |
| Social funnel | One animal per post leading to the collection page; final compilation reveal leads to the product |

### Deferred until the first releases work

- **Avatar Content System course/workflow pack:** promising Lemon Squeezy lane, but only after the paid curriculum, buyer outputs, updates, and support boundary are explicit.
- **Other Alice editions:** preserve the established world and character system, but perform a complete source-rights audit before selling any poster, character, or compilation derived from mixed inputs.
- **Etsy physical/POD items:** launch only after a sample passes, production partner disclosures are ready, and margin/shipping/returns are known.
- **eBay items:** add only real counted objects. Do not use eBay to work around its digital-delivery policy.
- **Article compilation or HobFarm zine:** a good later product once a coherent issue has editorial selection, layout, rights clearance, and final PDF/print proof. Do not bundle arbitrary articles just to create a SKU.

## 7. Funding-page specification

### Route and job

Use `/support/`. Its only job is to explain why HobFarm accepts support, show what the money sustains, and offer two choices: **Support once on Ko-fi** and **Become a monthly member**. Shop purchases and commissions appear as separate value exchanges, not disguised contributions.

### Draft-level opening

> Everyone on social media is selling something. HobFarm has the decency to show you the funnel.
>
> The joke is that this is a funding page. The serious part is that HobFarm already publishes articles, visual archives, character systems, production notes, and free workflow education. Most of that work will remain open. If it helps you see your own work differently, you can support the next round once, join monthly, or buy a finished thing that saves you the work of making it yourself.

The page should sound like a working studio explaining its books, not a launch campaign pretending an emergency.

### Information architecture and copy direction

1. **Satirical opener:** the two lines above, followed immediately by the real proposition.
2. **What already exists:** count only published articles, galleries, Workshop studies, Academy lessons, and maintained tools that can be verified at build time.
3. **Why most work remains free:** public work builds a useful archive, lets readers judge the work before paying, and keeps the publication shareable.
4. **What operating HobFarm involves:** publishing infrastructure, storage/delivery, software and generation tools, research access, equipment, editing, and the operator's production time. No invented totals.
5. **What one-time support funds:** the next concrete research, production, storage, or publishing expense. Button: “Support once on Ko-fi.”
6. **What monthly support funds:** predictable baseline operation and a sustainable publishing cadence. Promise only one durable benefit at launch, such as a monthly production note or supporter update, plus account billing control. Button: “View membership.”
7. **What buying funds:** finished assets and publications pay for the labor that made them and the next iteration. Button: “Shop finished work.”
8. **What more funding unlocks:** research access, travel/museum work, specialist review, editing/fact checking, production services, software development, and eventually paid contributors.
9. **Current limit:** one person rotates between publication, visual production, software, admin, and support. Funding reduces the forced rotation; it does not create instant capacity.
10. **Long-term vision:** a small publication and studio that can pay specialists and international contributors for defined assignments. State clearly that this is not a current hiring program.
11. **Payment choices:** once, monthly, buy, or commission/license. Each button names its destination/provider.
12. **Plain financial/legal note:** contributions are optional; products and services have separate terms; show last-updated date and links to Customer Help, refunds, terms, and privacy.

### Exact owner inputs required before financial copy

For each cost, supply the provider, billing frequency, currency, current amount, trailing three-month average where variable, annual renewal month, business/personal allocation, and whether the figure may be public.

- Hosting and Cloudflare Pages-related paid services
- R2 storage, Class A/B operations, and delivery/egress where charged
- Domains and DNS-related renewals
- Software subscriptions
- AI API and generation-service usage
- Research, archive, database, and publication subscriptions
- Marketplace listing, transaction, advertising, payout, and currency fees
- Payment-processing, merchant-of-record, dispute, refund, and international fees
- Equipment purchases, maintenance, replacement reserve, storage, and connectivity
- Travel, admission, local transport, lodging, and field-production expenses
- Contractor, editor, fact-checker, legal/accounting, and future contributor budgets
- Physical product samples, cost of goods, packaging, postage, loss/damage, and returns
- Taxes, licenses, and insurance where a qualified professional says they apply

Publish a range or category share only after these inputs are complete. Do not expose invoices, account numbers, private vendor terms, or sensitive operational details.

### Payment and legal notes

Use **support**, **contribution**, **patronage**, and **membership**. Avoid **donation** until legal/tax advice confirms it is appropriate.

Visible note:

> HobFarm is not presented as a charitable nonprofit. Contributions are not described as tax-deductible. One-time support does not purchase a product or service. Shop purchases, memberships, commissions, and licenses are governed by their stated provider, fulfillment, cancellation, refund, and usage terms.

Do not promise that a particular contribution buys a specific expense unless the money is actually restricted and accounted for that way. Say it “helps fund” the operation.

## 8. Homepage notice specification

### Placement and behavior

Create a normal, permanent component directly beneath `MagazineFrontPage` and before the featured article. Do not place it inside the video/image stage, cover content, follow scroll, or reappear as a modal. It should render in server HTML, use the existing dark publication panel style, and remain visible on every visit without local-storage dismissal logic.

Desktop: short copy on the left, three compact actions on the right or beneath it.

Mobile: one paragraph followed by three full-width or wrapping text buttons in this order: **Buy something**, **Support HobFarm**, **See where the money goes**.

Destinations:

- Buy something → `/shop/?hf_source=home&hf_medium=funding-notice`
- Support HobFarm → `/support/#support-once`
- See where the money goes → `/support/#where-money-goes`

Use a descriptive heading such as “Fund the next round,” not visually hidden joke text. Links need visible focus states, minimum comfortable touch targets, sensible reading order, and no color-only distinction. The component must remain useful with JavaScript disabled. Track the three links with one event name plus `placement` and `action` values.

### Option 1: sharp and satirical

**Oh, I see you've come to give me money for all this hard work. Good instincts.** Buy a finished thing, support the next round, or inspect the funnel before stepping into it.

### Option 2: satire with a clearer business explanation

**Everyone online is selling something. HobFarm shows you the funnel.** The magazine stays mostly free; products pay for finished production work, and direct support helps fund the next article, gallery, or tool.

### Option 3: mostly straight, with one joke

**Help fund the next HobFarm release.** Buy finished work or support the publication once or monthly. You can also see where the money goes, because the funnel has windows.

Option 2 is the best default. It establishes the joke, explains the business in one sentence, and does not imply that every visitor arrived intending to pay.

## 9. Technical implementation plan

No phase should begin by creating remote products or changing provider settings. Approve names, routes, deliverables, prices, licenses, and account ownership first. All provider secrets stay server-side.

### Phase 0: naming and route decisions

- **Files affected:** `src/data/support-platforms.ts`, `src/data/homepage-systems.ts`, global header/footer data or components, `src/pages/support.astro`, `/helpcenter/` data/pages, legal content links, redirects, and relevant tests.
- **Dependencies:** owner approval of the provider split; confirmation whether Patreon has active members; inventory of incoming `/support/` customer-help links; confirmation that `hobfarm-web` has no unique deployment.
- **Risks:** breaking bookmarked help links, stranding Patreon members, or renaming a benefit before its promise is settled.
- **Tests:** build, structural route/link tests, redirect tests, desktop/mobile navigation, keyboard focus, screen-reader names, no-JS content.
- **Migration concerns:** keep `/support/` live with a new job; move help content to `/helpcenter/`; add `/help/` redirect; update legal/account/footer links; mark or archive the legacy repository separately.
- **Estimated complexity:** small.

### Phase 1: one-time support and funding page

- **Files affected:** `src/pages/support.astro`, a new focused funding component or sections, `MagazineFrontPage`/homepage composition, `ExploreSupportFollow.astro`, support data, SEO/JSON-LD/navigation metadata, event helper, privacy/cookie copy only if measurement changes, and tests.
- **Dependencies:** verified Ko-fi destination and settings; approved funding copy; one honest Stripe membership benefit; exact financial inputs if any numbers are published.
- **Risks:** calling contributions donations, implying tax deductibility, duplicating Ko-fi and Stripe one-time payments, overstating what support unlocks, or making the notice intrusive.
- **Tests:** anonymous support flow without purchase, external-link behavior, Stripe membership sign-in handoff, no-JS rendering, canonical/structured data, focus order, mobile layout, event payload privacy.
- **Migration concerns:** preserve customer-help discovery and route old help links correctly. Do not create a Stripe one-time product during this phase.
- **Estimated complexity:** medium.

### Phase 2: store cleanup and first live products

- **Files affected:** `F:\Web-Stuff\hobfarm-live` commerce schemas/scripts/templates/tests; `src/content/products/`; `src/lib/products.ts`; product/shop components; `.pages.yml` and `src/content.config.ts` only for approved optional fields; product and link tests.
- **Dependencies:** final Sophia/Stella files, rights and license approval, price, DeviantArt listing; then verified wallpaper files. Marketplace seller-account access remains an owner action.
- **Risks:** public full-resolution leakage, inconsistent listing/site facts, selling rights HobFarm does not control, provider policy violations, or exposing empty product families.
- **Tests:** hub schema/manifest validation, buyer-bundle clean-machine test, hashes, listing URL check, live/coming-soon buy-button rules, JSON-LD offer accuracy, preview caps, download/support/refund walkthrough without a real purchase until controlled launch testing.
- **Migration concerns:** keep stable product IDs and URLs; add offer/listing records without moving historical assets; replace generic Etsy-first copy with verified products; version buyer files instead of overwriting them.
- **Estimated complexity:** medium.

### Phase 3: contextual article and gallery commerce

- **Files affected:** `src/layouts/ArticleLayout.astro`, gallery detail layout/component, `src/lib/content-relationships.ts`, `RelatedContentRail.astro` or a new shared wrapper, selected frontmatter, `.pages.yml`, schema only if current IDs are insufficient, and relationship tests.
- **Dependencies:** at least one live product with stable ID and canonical page; editorial rules for contextual placement.
- **Risks:** irrelevant upselling, circular relationships, duplicate data, broken IDs, or showing unavailable products as buyable.
- **Tests:** resolver unit tests, missing/draft/coming-soon behavior, article/gallery snapshots, JSON-LD consistency, keyboard and mobile QA, link attribution.
- **Migration concerns:** preserve optional fields and legacy related-gallery/project behavior; migrate entries gradually; never require a product on every article.
- **Estimated complexity:** medium.

### Phase 4: direct fulfillment, courses, and entitlements

- **Files affected:** Lemon Squeezy product/listing records in the hub, server-side webhook route, entitlement mapping only if required, account purchase view, Academy/product pages, legal/refund/privacy copy, environment documentation, and integration tests.
- **Dependencies:** approved Lemon Squeezy store, real buyer bundle, license variants, webhook signing secret, refund/support policy, product update policy, and decision whether the first course needs HobFarm account access.
- **Risks:** duplicate Stripe/Lemon Squeezy entitlement systems, missed webhook retries, email mismatch, tax/refund contradictions, insecure download handling, or manufacturing course filler.
- **Tests:** provider test mode for purchase/refund/webhook replay, idempotency, signature verification, entitlement grant/revoke if used, receipt/support path, expired-link behavior, and no public buyer-file exposure.
- **Migration concerns:** start with provider-hosted delivery and no HobFarm entitlement. Add account synchronization only for a specific product need. Keep Stripe membership separate.
- **Estimated complexity:** large if entitlements are added; medium for provider-hosted delivery only.

### Phase 5: contributor and publishing expansion

- **Files affected:** funding transparency content, contributor policy and agreement templates, assignment/budget records in the hub, editorial workflow documentation, author/payment metadata kept outside public content, and selected public contributor pages.
- **Dependencies:** recurring revenue target, ring-fenced editorial budget, tax/accounting guidance, contracts, rights policy, editor capacity, and a defined commissioning process.
- **Risks:** unpaid speculative labor, employment classification, international tax/payment issues, editorial inconsistency, safety/privacy, and promises that exceed one-person capacity.
- **Tests:** policy/legal review, assignment-to-publication dry run, rights and credit checks, payment approval controls, public attribution, privacy audit, and budget reconciliation.
- **Migration concerns:** do not open general submissions or announce hiring before the budget and editor exist. Begin with one paid, scoped specialist contribution.
- **Estimated complexity:** large.

## 10. Immediate action list

1. Approve the provider and route split, then turn `/support/` into a page with one working Ko-fi **Support once** action and one Stripe **Support monthly** action; make `/helpcenter/` the unambiguous Customer Help destination.
2. Approve one truthful recurring membership benefit and remove product, course, and marketplace promises that are not membership entitlements.
3. Finalize the Sophia/Stella buyer files, personal-use license, price, and DeviantArt listing; perform a controlled download test.
4. Change the Sophia/Stella product record to `live` only after its exact listing URL is verified, then make it the first real Shop and Latest Drops offer.
5. Add the compact Option 2 funding notice beneath the homepage hero with Buy, Support, and Where the money goes actions.
6. Add product/offer/listing/inventory manifests to `hobfarm-live` and backfill Sophia/Stella, the wallpaper pack, membership, and custom-character inquiry.
7. Reconcile every public Etsy, Ko-fi, Patreon, DeviantArt, Lemon Squeezy, and eBay claim against the seller accounts; record listing IDs, state, and verification date, then remove empty or duplicate public paths.
8. Package and rights-check Wallpaper Pack Vol. 01; launch it only if all twelve promised files and dimensions are real.
9. Render the shared “From this rabbit hole” module on the most relevant article, gallery, and Workshop pages using product IDs and the existing relationship resolver.
10. Add the stable privacy-conscious events, verify Stripe membership with one controlled live transaction, and record the operational refund, webhook, portal, and support results without exposing customer data.
