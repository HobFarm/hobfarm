# Character / Mannequin page audit

Date: 2026-07-15  
Route: `/workshop/character-mannequin/`  
Branch: `feat/character-mannequin-page-overhaul`

## Current route

The route is one branch of `src/pages/workshop/[program].astro`. It uses the global `BaseLayout`, navigation, footer, Workshop program data, and a page-specific `CharacterMannequinStudies` component. The current body is still an early program frame. It repeats the old pink Starlet sequence, includes the Generic Female #37 experiment, and ends with an empty-state message.

The current page does not show the supplied mannequin → outfit → character → scene → motion system. It also has no direct path from a look to the Shop, a custom-character inquiry, or a future Academy lesson.

## Existing systems to reuse

| Area | Existing implementation | Decision for this page |
| --- | --- | --- |
| Global shell | `BaseLayout.astro`, global navigation, footer, tokens in `src/styles/global.css` | Preserve without site-wide changes. |
| Workshop | Dynamic program route and Workshop program navigation | Keep the route and program navigation; replace only the Character / Mannequin body. |
| Media | `cdn` helper plus Cloudflare image-transform helpers | Keep remote filenames behind a typed page manifest. Emit capped image derivatives, explicit dimensions, lazy loading, and poster-first videos. |
| Product data | `products` content collection and `src/lib/products.ts` | Reuse the current public-product query and `DropCard`. Do not create new product records or IDs. |
| Purchase guard | `isBuyable()` requires `status: live` and a verified `externalUrl` | Preserve. All new offer slots remain coming soon or inquiry-only. |
| Marketplaces | DeviantArt, Ko-fi, Etsy, eBay, Lemon Squeezy, HobFarm Direct, and Patreon platform registry | Link only verified site routes and existing product data. Do not invent a marketplace listing. |
| Stripe | Authenticated Creative Membership Checkout, portal, webhook, and Academy entitlement checks | Leave unchanged. It already provides the protected-course pattern for a later Character course. |
| Services | `/services/` and `/contact/` | Use the contact form with a new `custom-character` subject value. No new intake service or stored fields. |
| Analytics | No repository event helper or vendor integration | Add stable `data-event` attributes only. Do not introduce a vendor or transmit new data. |
| SEO | `BaseHead` / `Seo` props and JSON-LD support | Add page-specific title, description, canonical URL, social image, ItemList, and VideoObject data. Do not describe the Workshop page as a Product. |

## Paid-content boundary

The repository already separates public previews from paid originals. Product cards render transformed preview images, and the paid-asset policy caps public images at 1600 pixels. This page should follow the same rule even though the supplied Workshop media are production examples rather than current products.

Stripe should remain limited to the existing membership flow. A later Academy course can use the current authenticated entitlement model. New character packs should enter the existing products collection only after the product ID, listing URL, price, license, and fulfillment path are approved.

## Media verification

Public root: `https://cdn.hob.farm/workshop/mannequin-outfit-character/`

- All eleven supplied design PNGs resolve.
- All four supplied MP4 previews resolve.
- Five of the six supplied page graphics resolve.
- The four new original-mannequin files resolve:
  - `designs/mannequin1-character-sheet.png` — 1672×941
  - `designs/mannequin2-character-sheet.png` — 1672×941
  - `designs/mannequin1-portrait.png` — 941×1672
  - `designs/mannequin2-portrait.png` — 1024×1536
- `page-graphics/hobfarm-mannequin-design.png` returns 404 and will not be rendered.

The supplied PNG originals range from about 1.5 MB to 4.1 MB. The page must request transformed derivatives rather than sending those originals to every visitor. The MP4 files range from about 0.9 MB to 1.4 MB and will use `preload="none"` with matching scene posters.

## Current accessibility and performance risks

- The old image elements do not declare width and height, so the browser cannot reserve reliable space.
- The old page has no stage controls for comparing outfit, character, scene, and motion.
- Videos are individually controlled but there is no one-video-at-a-time behavior.
- The placeholder sections make the first screen describe future work instead of the working method.
- The old page emits raw CDN image URLs instead of transformed responsive derivatives.
- No page-specific event hooks exist for stage changes, product clicks, process-note expansion, or video play.

## Implementation plan

1. Add a typed manifest for the verified media, three wardrobe looks, the separate green character, decision records, offer slots, tool links, and related routes.
2. Build one page composition plus reusable look, decision-matrix, and offer components.
3. Add progressively enhanced, keyboard-operable stage tabs. Without JavaScript, all four stages remain visible in document order.
4. Reuse the existing product collection and contact route. Keep unverified offers non-buyable.
5. Add page-specific metadata, structural tests, build checks, and responsive browser validation.

