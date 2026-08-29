# HobFarm R2/CDN cleanup audit

Generated: 2026-08-29T00:43:14.078Z

## Result

`cdn.hob.farm` is connected to the `hobfarm-cdn` R2 bucket. The complete read-only inventory found **2,257 objects using 4.755 GB (4,755,369,644 bytes)**.

| Classification | Objects | Size | Percent |
| --- | ---: | ---: | ---: |
| Active | 943 | 3.006 GB | 63.21% |
| Staged | 137 | 233.45 MB | 4.91% |
| Protected | 979 | 869.68 MB | 18.29% |
| Review | 198 | 646.54 MB | 13.60% |
| Orphan high confidence | 0 | 0 B | 0.00% |
| Total | 2257 | 4.755 GB | 100.00% |

The proposed deletion manifest contains **0 high-confidence orphan objects totaling 0 B**. Nothing was deleted, moved, renamed, uploaded, copied, overwritten, or deployed.

## Bucket and pagination evidence

- Bucket: `hobfarm-cdn`
- Custom domain: `cdn.hob.farm` (enabled: true; ownership: active; SSL: active)
- Location: WNAM
- Default storage class: Standard
- Inventory pages: 3 (1000 + 1000 + 257 objects)
- Terminal page marked truncated: false
- Pagination completed: true
- Wrangler bucket metric: 2,254 objects, 4.76 GB
- Inventory/API count matches Wrangler metric: false
- Metric advisory: Wrangler bucket summary metrics may lag behind recent object changes; the completed cursor-paginated object listing remains authoritative for this audit.

## Storage by major prefix

| Prefix | Objects | Size | Percent |
| --- | ---: | ---: | ---: |
| `articles/` | 692 | 1.395 GB | 29.33% |
| `gallery/` | 186 | 786.06 MB | 16.53% |
| `pages/` | 171 | 744.71 MB | 15.66% |
| `blog/` | 153 | 476.82 MB | 10.03% |
| `workshop/` | 123 | 468.68 MB | 9.86% |
| `agents/` | 586 | 405.36 MB | 8.52% |
| `ezize/` | 21 | 158.60 MB | 3.34% |
| `3dm/` | 46 | 61.31 MB | 1.29% |
| `grimoire/` | 177 | 58.51 MB | 1.23% |
| `funnies/` | 21 | 46.20 MB | 0.97% |
| `shop/` | 12 | 45.22 MB | 0.95% |
| `visual-systems/` | 7 | 39.41 MB | 0.83% |
| `hero-images/` | 11 | 28.15 MB | 0.59% |
| `brand/` | 16 | 26.83 MB | 0.56% |
| `vid-files/` | 5 | 9.76 MB | 0.21% |
| `self-defense/` | 26 | 2.56 MB | 0.05% |
| `projects/` | 1 | 1.74 MB | 0.04% |
| `products/` | 3 | 874.73 KB | 0.02% |

## Largest objects

| Key | Classification | Size | Last modified |
| --- | ---: | ---: | ---: |
| `articles/color-becomes-cast/zima-nina-em-intros.mp4` | active | 85.93 MB | 2026-07-04T07:58:51.638Z |
| `gallery/motion/Dancer.mp4` | active | 79.77 MB | 2026-05-22T04:53:16.193Z |
| `blog/invisible-variable/butterfly-dancer.mp4` | active | 73.83 MB | 2026-03-20T19:13:51.305Z |
| `articles/bblv/linq-garage-flood_1.mp4` | active | 64.10 MB | 2026-08-10T01:31:31.468Z |
| `articles/bblv/20260730_jrad.mp4` | active | 58.39 MB | 2026-08-10T02:57:56.571Z |
| `pages/home/homepage-hero.mp4` | active | 58.28 MB | 2026-06-05T07:00:17.271Z |
| `pages/process/motion/motion-video.mp4` | active | 51.18 MB | 2026-05-15T13:43:16.199Z |
| `articles/they-live/they-live-clip.mp4` | review | 50.47 MB | 2026-07-28T02:02:08.235Z |
| `pages/process/book/book-video.mp4` | active | 46.35 MB | 2026-05-15T15:01:38.226Z |
| `workshop/ami-legacy/Ami_Intro_with_captions.mp4` | active | 43.34 MB | 2026-07-22T06:33:05.624Z |
| `blog/web-vs-api/vampire-pinup.mp4` | active | 42.89 MB | 2026-04-05T02:36:10.466Z |
| `pages/about/about-hero-vid.mp4` | active | 41.44 MB | 2026-03-14T20:27:47.031Z |
| `workshop/before-and-after/scene/salton-city-1965-2065.mp4` | active | 39.46 MB | 2026-07-15T10:27:06.827Z |
| `workshop/before-and-after/scene/california-north-shore-yacht-club-time-lapse.mp4` | active | 35.32 MB | 2026-07-15T10:26:13.894Z |
| `pages/about/about-glow-vid.mp4` | active | 30.25 MB | 2026-03-19T01:08:44.887Z |
| `articles/salton-sea/aerial-club-harbor-motel-1962.jpg` | active | 27.30 MB | 2026-08-14T14:50:00.102Z |
| `visual-systems/sophia-stella-video.mp4` | active | 27.23 MB | 2026-07-07T01:05:15.637Z |
| `gallery/seed-to-world/s2w-v1-05.mp4` | active | 24.65 MB | 2026-05-21T21:59:00.488Z |
| `pages/about/Fractal Octopus.mp4` | active | 24.58 MB | 2026-03-14T22:05:27.195Z |
| `blog/1956-automation/moya.mp4` | active | 22.83 MB | 2026-06-25T08:06:42.151Z |
| `gallery/compilation/compilation-hero.mp4` | active | 22.15 MB | 2026-05-22T05:22:15.429Z |
| `pages/other-alice-adventures/cast/alice/other-alice-adventures-intro2.mp4` | active | 21.86 MB | 2026-07-15T02:40:29.416Z |
| `pages/other-alice-adventures/cast/alice/other-alice-adventures-intro1.mp4` | active | 21.75 MB | 2026-07-15T02:40:28.067Z |
| `shop/videos-posters/hc-video-001.mp4` | protected | 21.62 MB | 2026-07-08T09:41:08.783Z |
| `workshop/alter-ego/hc-video-001.mp4` | active | 21.62 MB | 2026-07-11T23:01:27.766Z |

## High-confidence orphan prefixes

The audit only marks an object high-confidence when its parent prefix has no active, staged, protected, or recent sibling, the key is outside every protected namespace, and every candidate is at least 90 days old. Age alone never creates an orphan classification.

No high-confidence orphan prefix was found.

### Largest orphan objects

No high-confidence orphan object was found.

## Review queue

These objects remain outside the deletion manifest. The main reasons are recent uploads, mixed retained/unreferenced files inside one prefix, and root-level keys without a safe group boundary.

| Prefix | Objects | Size |
| --- | ---: | ---: |
| `articles/commune-festival/` | 31 | 139.45 MB |
| `articles/vaporwave/` | 17 | 74.97 MB |
| `articles/they-live/` | 1 | 50.47 MB |
| `articles/color-becomes-cast/` | 7 | 47.40 MB |
| `workshop/psygoth/design/` | 8 | 36.58 MB |
| `workshop/before-and-after/character/` | 3 | 34.27 MB |
| `brand/` | 10 | 23.59 MB |
| `workshop/scene/` | 4 | 20.51 MB |
| `gallery/cute-corrupted/hobunny/` | 4 | 20.07 MB |
| `articles/trash-mountain/` | 6 | 17.51 MB |
| `blog/1956-automation/` | 1 | 17.25 MB |
| `3dm/broadway-babies/` | 9 | 17.10 MB |
| `workshop/mannequin-outfit-character/designs/` | 9 | 16.53 MB |
| `articles/it-just-runs-programs/` | 11 | 13.80 MB |
| `gallery/cute-corrupted/sienna-red/` | 1 | 12.45 MB |
| `workshop/mannequin-outfit-character/page-graphics/` | 6 | 11.48 MB |
| `gallery/character-sheets/` | 1 | 10.90 MB |
| `workshop/mannequin-to-avatar/v1/renders/` | 2 | 10.65 MB |
| `articles/rock-art/` | 2 | 9.76 MB |
| `vid-files/` | 4 | 9.76 MB |
| `blog/goth-get-boots/` | 5 | 9.41 MB |
| `articles/trash-river/` | 7 | 6.59 MB |
| `articles/3dm-1933-wb/` | 5 | 5.39 MB |
| `blog/gary-fork/` | 2 | 4.26 MB |
| `articles/desert-water/` | 5 | 3.85 MB |
| `articles/cursed-chevy/` | 7 | 3.68 MB |
| `workshop/before-and-after/scene/` | 1 | 3.39 MB |
| `3dm/you-know-nothing-of-my-algorithm/` | 1 | 2.57 MB |
| `workshop/future-carriage/` | 1 | 2.39 MB |
| `workshop/alter-ego/` | 1 | 2.18 MB |
| `articles/doll-family/` | 1 | 1.68 MB |
| `pages/projects/3dm/` | 1 | 1.65 MB |
| `articles/other-alice-origin/` | 1 | 1.29 MB |
| `articles/wavy-gravy/` | 2 | 927.97 KB |
| `articles/3dm-mouse-cat-musical/` | 1 | 869.20 KB |
| `articles/california-racing/` | 2 | 661.18 KB |
| `articles/sharksploitation/` | 1 | 616.35 KB |
| `workshop/mannequin-to-avatar/v1/posters/` | 2 | 522.77 KB |
| `gallery/seed-to-world/` | 2 | 80.00 KB |
| `articles/trash-river/graphics/` | 5 | 24.65 KB |

### Largest review objects

| Key | Size | Reason |
| --- | ---: | ---: |
| `articles/they-live/they-live-clip.mp4` | 50.47 MB | No deterministic repository reference; object is newer than 90 days. |
| `blog/1956-automation/1956-automation-hero.mp4` | 17.25 MB | No deterministic repository reference; object is newer than 90 days. |
| `workshop/before-and-after/character/before-and-after-1926-2026.mp4` | 16.67 MB | No deterministic repository reference; object is newer than 90 days. |
| `brand/hobfarm-rabbit-hole-logo.mp4` | 15.26 MB | No deterministic repository reference; object is newer than 90 days. |
| `workshop/before-and-after/character/before-and-after-1926-2026-web.mp4` | 15.01 MB | No deterministic repository reference; object is newer than 90 days. |
| `articles/color-becomes-cast/em-intro-video.mp4` | 14.39 MB | No deterministic repository reference; object is newer than 90 days. |
| `articles/color-becomes-cast/zima-intro-video.mp4` | 13.99 MB | No deterministic repository reference; object is newer than 90 days. |
| `articles/color-becomes-cast/nina-intro-vdeo.mp4` | 13.34 MB | No deterministic repository reference; object is newer than 90 days. |
| `gallery/cute-corrupted/sienna-red/cute-and-corrupted-sienna.mp4` | 12.45 MB | No deterministic repository reference; object is newer than 90 days. |
| `workshop/psygoth/design/hobfarm-color-design-example-02.mp4` | 12.40 MB | No deterministic repository reference; object is newer than 90 days. |
| `gallery/cute-corrupted/hobunny/hobunny76.mp4` | 12.30 MB | No deterministic repository reference; object is newer than 90 days. |
| `workshop/psygoth/design/hobfarm-color-design-example-01.mp4` | 11.10 MB | No deterministic repository reference; object is newer than 90 days. |
| `gallery/character-sheets/character-sheet-008.jpg` | 10.90 MB | No deterministic repository reference, but the same parent prefix contains retained objects. |
| `workshop/scene/scene-v1-001.mp4` | 9.11 MB | No deterministic repository reference; object is newer than 90 days. |
| `articles/commune-festival/serenity-gathering1.JPG` | 8.58 MB | No deterministic repository reference; object is newer than 90 days. |
| `articles/commune-festival/lib4.jpg` | 8.45 MB | No deterministic repository reference; object is newer than 90 days. |
| `articles/commune-festival/serenity-gathering9.JPG` | 8.38 MB | No deterministic repository reference; object is newer than 90 days. |
| `articles/commune-festival/serenity-gathering13.JPG` | 8.29 MB | No deterministic repository reference; object is newer than 90 days. |
| `articles/vaporwave/sphere.jpg` | 8.25 MB | No deterministic repository reference; object is newer than 90 days. |
| `articles/commune-festival/serenity-gathering5.JPG` | 7.05 MB | No deterministic repository reference; object is newer than 90 days. |
| `articles/commune-festival/serenity-gathering7.JPG` | 7.05 MB | No deterministic repository reference; object is newer than 90 days. |
| `articles/commune-festival/serenity-gathering4.JPG` | 6.98 MB | No deterministic repository reference; object is newer than 90 days. |
| `articles/commune-festival/serenity-gathering2.JPG` | 6.76 MB | No deterministic repository reference; object is newer than 90 days. |
| `articles/commune-festival/serenity-gathering6.JPG` | 6.61 MB | No deterministic repository reference; object is newer than 90 days. |
| `articles/commune-festival/serenity-gathering3.JPG` | 6.43 MB | No deterministic repository reference; object is newer than 90 days. |

Repository references that did not resolve to an R2 object: **0**. They remain in `reports/r2-reference-inventory.json` because missing live references may indicate a broken URL, while missing staged references may indicate a pending upload.

## Duplicate candidates

- Strong probable groups (same size and R2 ETag): 35
- Possible groups (same filename and size, different ETags): 0
- Theoretical strong-group consolidation: 138.48 MB

| Group | Copies | Object size | Theoretical recovery | URL changes |
| --- | ---: | ---: | ---: | ---: |
| etag-size-034 | 2 | 21.62 MB | 21.62 MB | not established |
| etag-size-010 | 2 | 16.67 MB | 16.67 MB | not established |
| etag-size-016 | 2 | 12.40 MB | 12.40 MB | not established |
| etag-size-014 | 2 | 11.10 MB | 11.10 MB | not established |
| etag-size-028 | 2 | 11.07 MB | 11.07 MB | required |
| etag-size-024 | 2 | 9.11 MB | 9.11 MB | not established |
| etag-size-026 | 2 | 6.33 MB | 6.33 MB | not established |
| etag-size-025 | 2 | 4.72 MB | 4.72 MB | not established |
| etag-size-017 | 2 | 3.85 MB | 3.85 MB | not established |
| etag-size-027 | 2 | 3.45 MB | 3.45 MB | required |
| etag-size-035 | 2 | 3.39 MB | 3.39 MB | not established |
| etag-size-020 | 2 | 3.31 MB | 3.31 MB | not established |
| etag-size-012 | 2 | 3.15 MB | 3.15 MB | not established |
| etag-size-021 | 2 | 2.73 MB | 2.73 MB | required |
| etag-size-019 | 2 | 2.66 MB | 2.66 MB | not established |
| etag-size-018 | 2 | 2.64 MB | 2.64 MB | not established |
| etag-size-011 | 2 | 2.59 MB | 2.59 MB | not established |
| etag-size-022 | 2 | 2.44 MB | 2.44 MB | not established |
| etag-size-033 | 2 | 2.18 MB | 2.18 MB | not established |
| etag-size-030 | 2 | 1.80 MB | 1.80 MB | not established |
| etag-size-031 | 2 | 1.71 MB | 1.71 MB | not established |
| etag-size-001 | 2 | 1.65 MB | 1.65 MB | not established |
| etag-size-029 | 2 | 1.50 MB | 1.50 MB | not established |
| etag-size-032 | 2 | 1.43 MB | 1.43 MB | not established |
| etag-size-003 | 2 | 1.21 MB | 1.21 MB | not established |
| etag-size-005 | 2 | 1.16 MB | 1.16 MB | not established |
| etag-size-009 | 2 | 1.14 MB | 1.14 MB | not established |
| etag-size-004 | 2 | 430.21 KB | 430.21 KB | not established |
| etag-size-015 | 2 | 358.53 KB | 358.53 KB | not established |
| etag-size-023 | 2 | 357.32 KB | 357.32 KB | not established |

Duplicate status is evidence for consolidation review, not deletion authority. The duplicate report keeps every key, classification, ETag, and reference count.

## Recoverable storage and cost

- High-confidence orphan objects: 0
- Recoverable bytes: 0
- Recoverable decimal GB: 0.000000 GB
- Recoverable share of this bucket: 0.00%
- List-price Standard storage reduction: **$0.0000 per full GB-month**

Pricing assumption: Cloudflare Standard R2 storage is $0.015 per GB-month as of 2026-08-07. Standard R2 also includes 10 GB-month each month. This bucket is below that free allowance by itself, so the actual bill reduction may be $0 if total account usage remains within the shared free tier. Cloudflare bills GB-month from daily peak averages and rounds billable usage as described in [R2 pricing](https://developers.cloudflare.com/r2/pricing/).

## Path organization

The bucket currently mixes `articles/`, `gallery/`, `pages/`, `blog/`, `workshop/`, legacy title roots such as `3dm/`, and application roots such as `agents/`, `ezize/`, and `grimoire/`.

Use the repository's route-mirroring rule for future uploads:

- `articles/<article-slug>/<file>`
- `presents/<section-or-title>/<file>`
- `workshop/<program>/<file>`
- `gallery/<collection>/<entry>/<file>`
- `projects/<project-slug>/<file>`
- `shop/<product>/<public-file>`

Keep application and private commerce assets in their documented application or private buckets. Do not add new `blog/`, generic `pages/`, or ad hoc root keys. Existing active keys should stay where they are until a separate migration copies the object, updates every repository reference, deploys and verifies the new URL, preserves the old URL when required, and only then proposes removal.

## Temporary data and lifecycle rules

No clearly disposable temporary namespace was established in this bucket.

A future lifecycle rule should apply only to a deliberately isolated namespace such as `temporary/` with an explicit retention contract. Do not apply age-based expiration to article, Presents, gallery, Workshop, project, Academy, Shop, application, or archive media.

## Internal validation

- R2 pagination ended only after `is_truncated` became false.
- Inventory object count matches the advisory Wrangler bucket metric: false.
- The completed cursor-paginated object listing is authoritative when that aggregate metric lags.
- Every object has exactly one primary classification.
- Classification counts and bytes sum to the bucket totals.
- Every deletion-manifest key is classified `orphan-high-confidence`.
- No active, staged, protected, or review object appears in the deletion manifest.
- The audit client issues authenticated GET requests only. Wrangler is used only for `r2 bucket info`.
- Zero R2 writes or deletions occurred.

## Files

- Full inventory and classifications: `reports/r2-cdn-inventory.json`
- Repository references: `reports/r2-reference-inventory.json`
- Orphan and review candidates: `reports/r2-orphan-candidates.json`
- Duplicate candidates: `reports/r2-duplicate-candidates.json`
- Proposed deletion manifest: `reports/r2-proposed-deletion-manifest.json`

The deletion manifest is data only. This repository contains no R2 delete command for this audit, so cleanup requires a separate explicitly approved task and execution path.
