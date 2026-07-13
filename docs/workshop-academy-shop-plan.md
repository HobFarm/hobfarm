# Workshop, Academy, and Shop implementation plan

Status: proposed after Phase 1 audit  
Recommended pilot: the existing Sophia/Stella visual system  
Experimental module: not approved and not implemented

## Decision requested

Approve Direction 2, the medium-depth interactive editorial system, as the next prototype. It extends the current Workshop design with a Sheet-to-Hero comparison, process markers, a lightweight StyleFusion map, a product asset stack, and lazy short video. Core content remains server-rendered.

Direction 3 should remain a separate approval-gated experiment. Do not place it on a production route, add Three.js to Workshop, generate paid motion, or upload assets until the review gate is cleared.

## Preserve

- Current public routes, navigation, redirects, and department hierarchy.
- Workshop's six-program menu.
- Articles as the main editorial collection.
- Gallery as the rich visual-study and media archive.
- Existing Academy course routes and the beginner-facing Avatar Content System.
- External-first Shop products and the Stripe membership flow.
- `paidAssetPolicy` and capped public preview helpers.
- Sophia/Stella and Cute/Corrupted canon, filenames, folder references, and live R2 paths.
- Dark violet grounds, restrained neon accents, IBM Plex typography, mono labels, contained media, and character art as the focus.
- Static rendering, semantic HTML, JSON-LD, Markdown alternates, direct links, and readable no-JavaScript content.

## Refine

1. Replace the two missing CDN references or remove their dead media slots.
2. Broaden and regenerate the media inventory so it scans current `articles` paths plus media literals in pages and components.
3. Give Workshop, Academy, Shop, Gallery, Video, and Characters route-specific social images where approved art already exists.
4. Send a direct public social image to Product Open Graph metadata instead of a `/cdn-cgi/image/` URL.
5. Point the Video archive's 3DM card directly to its canonical Presents route.
6. Fix the `h1` to `h3` heading jump on HobFarm Presents.
7. Replace the Workshop teaser's unconditional autoplay with an `AmbientVideoFrame` behavior: poster first, controls, visibility-aware loading, and reduced-motion pause.
8. Normalize CTA attributes and labels without changing their destinations.

## Add

### Relationship layer

Add optional relationships to existing models. Do not require a migration of every entry.

```ts
type ContentRelationships = {
  relatedWorkshop?: string[];
  relatedAcademy?: string[];
  relatedProducts?: string[];
  relatedArticles?: string[];
};

type ToolRoute = {
  required: string[];
  optional?: string[];
  fallback: string[];
  note?: string;
};

type AssetManifestRef = {
  id: string;
  label: string;
  role: "sheet" | "hero" | "poster" | "video" | "download" | "source";
  preview?: string;
  buyerFile?: boolean;
  format?: string;
  dimensions?: string;
};
```

Reuse current fields before adding aliases:

| Current field | Planned use |
| --- | --- |
| Article `relatedArticles`, `relatedGallery`, `relatedProject` | Keep and resolve into the shared relationship presentation |
| Article `workshopCTA`, `academyCTA`, `supportCTA` | Keep as primary/supporting CTA hints |
| Gallery `related`, `relatedProcess`, `lessons`, `workflowSteps` | Keep as the study record; add typed cross-area IDs only when needed |
| Product `relatedArticle`, `relatedWorkshopNote`, `relatedContent` | Preserve; add typed Academy and product relationships rather than replacing existing content |
| Product `sku`, variants, included items, paid-asset policy | Keep as the commerce and asset-safety source |
| Visual system `relatedArticles`, `relatedProducts`, `relatedWorkshopNotes` | Use as the existing vertical-slice bridge |
| Academy lesson objects | Add optional Workshop, product, learner-output, tool-route, and download fields to the current TypeScript type |

Only consider an Academy content collection after the second course needs CMS authoring. The first relationship pass can extend `src/data/avatar-content-system.ts` without moving working lessons.

### Shared helpers

- Resolve IDs to canonical public paths in one server-side helper.
- Validate references during tests.
- Keep unresolved optional references out of the rendered page instead of producing placeholder links.
- Produce one primary CTA and at most one supporting CTA per page.
- Add PagesCMS fields only for relationships editors need to change.

### Components

Build the smallest useful set first:

1. `RelatedWorkshop`
2. `RelatedAcademy`
3. `RelatedProducts`
4. `ProcessToProductCTA`
5. `AssetManifest`
6. `ToolRouteNote`
7. `SheetToHero`, implemented as a content wrapper around `BeforeAfterCompare`
8. `ProductAssetStack`
9. `AcademyPath`
10. `SocialReel`, implemented with the poster-first `AmbientVideoFrame`

`CharacterAssetRail`, `WorkshopExperimentRail`, `PoseCardStage`, and a richer `StyleFusionMap` can follow when the pilot has real content for them.

### Analytics attributes

Use stable event names on links and controls:

```text
workshop_product_click
workshop_academy_click
academy_download_click
academy_product_click
product_checkout_click
support_membership_click
reel_play
social_source_visit
```

First verify how Cloudflare Web Analytics is enabled in the Pages project and whether it supports the required custom events. If it does not, use UTM-backed pageview reporting for the pilot or propose a small first-party event endpoint with an explicit storage and privacy review. Do not invent a dashboard or D1 schema during the prototype.

## Prototype

### Direction 1: conservative extension

| Item | Proposal |
| --- | --- |
| Placement | Workshop program pages, Academy landing, Shop landing, product detail |
| Adds | Stronger media crops, static relationship rails, clearer included-file blocks, layered CSS surfaces, consistent CTA placement |
| Reuses | Section heroes, cards, media frames, gallery metadata, product collection |
| Estimated implementation | 2–4 focused component days |
| Performance risk | Low; no new client runtime is required |
| Accessibility risk | Low if existing semantic patterns remain intact |
| Fallback | The enhanced page is already the static fallback |

Use this direction if the priority is publishing speed and low maintenance. It improves connection and clarity but does not fully demonstrate the requested contemporary visual-studio depth.

### Direction 2: medium-depth interactive editorial system

| Item | Proposal |
| --- | --- |
| Placement | Sophia/Stella Workshop case study, one Academy worked example, and the Sophia/Stella product page |
| Adds | Sheet-to-Hero wipe, sticky process marker, CSS depth planes, SVG StyleFusion map, asset-stack preview, lazy poster-to-video transition |
| Reuses | `BeforeAfterCompare`, gallery image helpers, visual-system data, media player patterns, existing poster/video assets |
| Estimated implementation | 6–10 component days plus responsive, keyboard, reduced-motion, and performance QA |
| Performance risk | Moderate; pointer and scroll effects can overwork mobile if not isolated |
| Accessibility risk | Manageable with native controls, captions, focus states, static figures, and reduced-motion rules |
| Fallback | Figures, captions, manifest lists, and links render before JavaScript; video remains poster-first |

This is the recommended direction. It proves the Workshop to Academy to Shop relationship with current assets and avoids adding a second visual runtime.

### Direction 3: high-impact experimental module

Prototype one `ExplodedCharacterPacket` that combines `DepthHero`, `ProductAssetStack`, and a staged Sheet-to-Hero reveal.

| Item | Proposal |
| --- | --- |
| Placement | One noindex visual-lab route first; later, one pilot Workshop hero or product page after approval |
| Adds | Sheet, portrait, full-body, Hero, Poster, and video planes separated in depth around the character; subtle pointer camera and staged reveal |
| Initial implementation | CSS 3D transforms and SVG connectors; test Canvas or Three.js only if CSS cannot explain the packet |
| Estimated implementation | 10–18 component days plus a defined performance budget |
| Performance risk | High: GPU load, motion sensitivity, large lazy chunks, layout shifts, mobile heat, and interaction conflicts |
| Accessibility risk | High unless every plane also exists in the document as an ordinary figure or list |
| Fallback | Server-rendered asset stack, poster frame, captions, manifest, and canonical links |
| Approval gate | Required before implementation, paid generation, public routing, or asset upload |

Do not reuse the existing 569 KB Grimoire Three.js chunk on Workshop. A future 3D test must load only on the lab route, after visibility and capability checks, and must be removable without changing page content.

## Pilot choice

Use the existing Sophia/Stella system for the first vertical slice unless approved Jirai files arrive before implementation.

Why Sophia/Stella is ready:

- A shared mannequin and two variants already exist.
- Hero images, sheet previews, a poster, and teaser video are referenced from R2.
- Workshop already presents the method.
- A visual-system page already exists.
- A product entry and Shop detail route already exist.
- Academy CTAs already exist.
- Paid-preview rules are already attached.

What is missing for the slice:

- One Workshop study record with explicit fixed and changed variables.
- One related Academy lesson or worked example.
- Typed product and Academy relationships.
- A clear asset manifest.
- A tool-route note.
- One standard 9:16 reel package or a documented static fallback.
- CTA event IDs.

`WS-JIRAI-001` should remain reserved for the Jirai/Dark and Sweet Girly study described by the packet. No Jirai source, canon, serial, or media is currently present, so creating that page now would require invented assets or placeholders.

## Local visual lab

After Direction 2 approval, add one noindex route at `/workshop/visual-lab/`. It should import production components and current Sophia/Stella references rather than duplicating mock HTML.

The lab should show:

1. Static fallback first.
2. `SheetToHero` with pointer and keyboard control.
3. `StyleFusionMap` as SVG.
4. `ProductAssetStack` with a buyer-file boundary.
5. `AmbientVideoFrame` with poster, controls, captions slot, and reduced-motion behavior.
6. A component-size and route-JavaScript readout in development only.

The route stays noindex and out of primary navigation until the selected modules pass review.

## Tool routing plan

| Artifact | Primary route | Optional gain | Fallback |
| --- | --- | --- | --- |
| Static page modules | Astro, CSS, SVG, repository assets | Figma inspection for a selected layout | Local HTML and screenshots |
| Deterministic crops and cleanup | Adobe after reauthentication | Adobe batch exports and background tools | Existing R2 assets and local code |
| Missing illustration | ChatGPT image generation after approval | Fal specialist model after pricing | Static placeholders are not published; use approved current assets |
| Standard reel | HyperFrames after its CLI is verified for the project | Adobe resize/render | Static storyboard and poster-first site module |
| Cinematic motion | Higgsfield after cost approval | Fal image-to-video | Authored pan, wipe, and type motion in HyperFrames |
| Presenter lesson | HeyGen only when a host improves the lesson | Adobe speech cleanup | Text, screenshots, captions, and ordinary lesson media |
| Production map | Local Mermaid/SVG | Figma FigJam if the Starter/View account permits the needed draft action | Repository Markdown diagram |
| Review and PR | Git branch and connected GitHub app | GitHub review tools | Local diff and manual handoff |
| Browser QA | Browser control with local routes | Chrome DevTools trace when available | Project Playwright tests |

Adobe must be reauthenticated before it can participate. HyperFrames needs a verified local CLI path before it becomes part of the repository workflow. No optional provider should become required for page rendering.

## Implementation sequence after approval

### Step 1: repair the baseline

- Fix or remove the two missing CDN references.
- Update the media inventory scanner and regenerate reports.
- Repair route-specific social previews and the product Open Graph URL.
- Point Video directly to canonical 3DM.
- Fix the Presents heading order.
- Add reduced-motion and controls to the Workshop teaser.
- Add regression tests for each repair.

### Step 2: add optional relationships

- Create shared relationship types and resolvers.
- Extend article, gallery, and product schemas only where current fields cannot express a visible relationship.
- Extend the current Academy lesson type.
- Mirror editor-facing fields in `.pages.yml`.
- Keep every new field optional.
- Add structural tests for invalid or missing references.

### Step 3: build static connection components

- `RelatedWorkshop`
- `RelatedAcademy`
- `RelatedProducts`
- `ProcessToProductCTA`
- `AssetManifest`
- `ToolRouteNote`

Integrate them into the visual lab and the Sophia/Stella slice before changing other pages.

### Step 4: prototype Direction 2

- Wrap `BeforeAfterCompare` as `SheetToHero`.
- Build the SVG StyleFusion map.
- Build the static-first product asset stack.
- Add poster-first reel behavior.
- Test pointer, keyboard, touch, reduced motion, JS-disabled content, and mobile layout.

### Step 5: complete the vertical slice

- Publish or update one Workshop study.
- Add one Academy worked example.
- Improve the existing product detail with its manifest and relationships.
- Add a reel only if approved assets already exist or paid generation is approved.
- Add CTA attributes and campaign parameters.

### Step 6: measure and review

- Run `npm test`, `npx astro check`, and `npm run build`.
- Run desktop and mobile browser QA.
- Capture Lighthouse or equivalent performance traces before and after on the same routes.
- Check keyboard navigation, focus visibility, reduced motion, heading order, alt text, captions, video controls, and JS-disabled core content.
- Present screenshots and the lab route for approval.

### Step 7: consider Direction 3

Only after the Direction 2 review:

- Define a route-level JavaScript and GPU budget.
- Build the CSS/SVG version first.
- Compare it with an optional canvas build.
- Remove the canvas version if it does not explain the assets more clearly or if it causes a meaningful regression.

## Performance and accessibility gates

- No visual module may own the page title, navigation, canonical links, CTA destinations, or asset manifest.
- Direction 1 adds no client JavaScript.
- Direction 2 uses route-local scripts and targets no more than 20 KB gzip of new initial JavaScript; video sources stay lazy.
- Direction 3 cannot load Three.js or Canvas code before the module is visible and enhanced motion is allowed.
- `prefers-reduced-motion: reduce` disables automatic motion and pointer camera response.
- Mobile receives static depth, not continuous parallax.
- Every slider uses a native or correctly modeled keyboard control with a visible focus state.
- Every video has a poster, accessible label, controls where appropriate, and captions when speech is present.
- Paid originals never appear in HTML, JSON-LD, Open Graph, lightboxes, or public manifests.
- The page remains complete when scripts or optional media fail.

## Approval gates

Stop and request approval before:

1. Building Direction 3.
2. Generating paid image, video, voice, or motion assets.
3. Adding or changing Jirai or other character canon.
4. Uploading, replacing, or deleting R2 objects.
5. Publishing buyer files, licenses, or prices.
6. Changing Stripe, Ko-fi, Patreon, Etsy, DeviantArt, or membership configuration.
7. Moving the visual lab into public navigation.
8. Merging or deploying to production.

## Commit plan

Keep each commit runnable:

1. `docs(workshop): add expansion audit and plan`
2. `fix(media): repair inventory and missing references`
3. `feat(content): add relationship helpers`
4. `feat(workshop): add visual lab components`
5. `feat(academy): connect pilot lesson`
6. `feat(shop): add product asset relationships`
7. `feat(media): add poster-first reel frame`
8. `feat(analytics): add conversion event attributes`
9. `test(site): validate responsive and accessible flows`

No commit should include generated paid assets, R2 changes, prices, licenses, or membership changes without the matching approval.

## Second-wave backlog

1. Add an Academy content collection when a second course needs CMS authoring.
2. Add Pose and Camera Lab and Aesthetic Lab filters inside Workshop programs.
3. Add a reusable 9:16 HyperFrames reel template after the CLI route is verified.
4. Add Jirai as `WS-JIRAI-001` when approved source assets and canon exist.
5. Add marketplace-specific product previews and manifests.
6. Add a first-party event endpoint only if UTM and pageview analytics cannot answer the pilot questions.
7. Consider one CSS-first exploded character packet after Direction 2 passes review.

## Phase 1 stopping point

The audit and plan are complete. The production site has not been changed. The next action is approval of a visual direction, with Direction 2 recommended.
