# Completion report: The Model Is Free. The Computer Isn't.

## 1. Repository state

- Repository: `F:\Web-Stuff\hobfarm`
- Starting branch: `main`
- Final branch: `main`
- Starting commit: `d102d0e45e0f82949c179dffd6e0733a257aeaaa`
- Final commit: unchanged; no commit was requested
- Worktree status: requested work remains as reviewed, uncommitted changes on `main`
- Push/publication status: not pushed; eight new R2 objects were uploaded and verified, but the article and its scheduler are not registered on GitHub until the worktree is committed and pushed

## 2. Article record

- Article file: `src/content/articles/the-model-is-free.mdx`
- Final slug: `the-model-is-free`
- Local preview URL: `http://127.0.0.1:4322/articles/the-model-is-free/` during the post-release simulation
- Final public URL: `https://hob.farm/articles/the-model-is-free/`
- Department: `essays-arguments`
- Word count: 2,362 words before source notes

## 3. Schedule proof

- Predecessor file: `src/content/articles/same-same-but-different.mdx`
- Predecessor timestamp: `2026-08-12T16:20:00-07:00`
- New article timestamp: `2026-08-13T16:20:00-07:00`
- Timezone: preserved fixed offset `-07:00`, equivalent to PDT on these dates
- Computed difference: 86,400 seconds, exactly 24 hours
- Future-date visibility result: current build omits the route and all discovery entries
- RSS result: omitted before release; present in the post-release simulation
- Sitemap result: omitted before release; present in the post-release simulation
- Previous/next result: the post-release sequence places **Same Same, But Different** immediately before this article; no later article exists in the current schedule
- Index/department order result: post-release simulation places August 13 after August 12 in the expected newest-first order
- Scheduler: `.github/workflows/publish-the-model-is-free.yml` uses `20 23 13 8 *`; the publication script checks the exact frontmatter instant before changing `status` to `published`

## 4. Editorial implementation

The final thesis is: **Open weights democratize permission. Affordable compute democratizes access.** The practical answer is: **Rent the GPU. Own the workflow.**

The final section order moves from the a16z feed receipt into the 2018 workstation, the conditional upgrade cascade, open-weight terminology, DGX Spark as the current specimen, hosted depreciation, the hybrid workflow, durable source packages, a speculative modular backplane, the television analogy, and the job-first closing question.

The production scaffold was tightened to 2,362 words, connected directly to the final repository copy of **Same Same, But Different**, and updated with August 6 product state. Exact RunPod rates and Framework prices were removed because they were unnecessary and volatile. DGX capability figures remain attributed vendor claims. The RTX 5090 reference power figure is framed as an illustration, not a universal upgrade requirement. `Future junk` is defined as capability obsolescence. No tax, benchmark, or break-even claim was invented.

First-person facts used: the workstation was assembled around 2018; it has an RTX 2080 Ti with 11 GB VRAM; it was built for video editing, motion graphics, and games; the machine still does its original work; the workload moved. No unsupplied motherboard, PSU, case, RAM, storage, CPU, or operating-system specification appears.

The final paragraph contains one short bridge to the future microculture article and creates no dead link. Internal links connect to **Same Same, But Different**, **You Do Not Own the AI You Pay For**, **Too Big for the Box**, and **Everything Is Still Loading**. **It Just Runs Programs** remains a related article record without repeating its argument in the body.

## 5. Research and fact audit

| Claim | Final wording or action | Source | Checked at | Result |
|---|---|---|---|---|
| Predecessor schedule | Successor is exactly 86,400 seconds later | Repository article record | 2026-08-06 | Passed |
| DGX Spark price | $4,699 current U.S. price | NVIDIA Marketplace | 2026-08-06 | Passed |
| DGX Spark capability | 128 GB; up to 200B inference and 70B fine-tuning attributed to NVIDIA | NVIDIA | 2026-08-06 | Passed |
| RunPod price | No current rate quoted | RunPod pricing | 2026-08-06 | Passed by omission |
| RunPod billing | Pods and Serverless kept distinct | RunPod docs | 2026-08-06 | Passed |
| RunPod storage | Persistence, continuing charges, region limits, and no automatic sync retained | RunPod docs | 2026-08-06 | Passed |
| ComfyUI serverless | Community ComfyUI-to-API path identified narrowly | RunPod docs | 2026-08-06 | Passed |
| Open terminology | Open weights distinguished from a complete open-source AI system | OSI | 2026-08-06 | Passed |
| Plugable enclosure | $629.99, 850 W, four PCIe lanes, no GPU, supported Windows 11 host | Plugable | 2026-08-06 | Passed |
| Framework prices | Checked but omitted | Framework | 2026-08-06 | Passed by omission |
| Framework memory | Fixed, non-upgradeable high-bandwidth memory | Framework | 2026-08-06 | Passed |
| Framework 192 GB | Still a preview; omitted | Framework | 2026-08-06 | Passed by omission |
| AMD Halo marketing | Product checked; model-size marketing omitted | AMD | 2026-08-06 | Passed by omission |
| AMD cluster | Four 128 GB nodes, 5-gigabit Ethernet, llama.cpp RPC; vendor demonstration label | AMD | 2026-08-06 | Passed |
| Author machine | Only supplied first-person facts used | Packet primary material | 2026-08-06 | Passed |
| Television analogy | No exact personal or current retail price; BLS 94 percent trend retained | BLS | 2026-08-06 | Passed |
| Asset prefix | Eight absent keys confirmed before upload | R2 manifest/tooling | 2026-08-06 | Passed |
| Future article seed | One paragraph; no route or dead link | Repository content map | 2026-08-06 | Passed |

The full 18-item receipt is stored in `reports/the-model-is-free/publication-day-verification.csv`. No material claim remains unresolved. Volatile product state must still be rechecked if publication moves beyond the scheduled date.

## 6. Visual package

| Asset | Role | Source/editable file | Public URL | Dimensions | MIME | Bytes | SHA-256 | Rights basis |
|---|---|---|---|---:|---|---:|---|---|
| Hero | Article hero | `_cdn/articles/the-model-is-free/source/the-model-is-free-hero-master.png` | `https://cdn.hob.farm/articles/the-model-is-free/hero.webp` | 1600x900 | image/webp | 458360 | `ce75ce176013611c32ce0f896f450a0461e526b6a613ae6d6618fd3316be7532` | Original HobFarm editorial illustration |
| Social | Open Graph image | Hero master PNG | `https://cdn.hob.farm/articles/the-model-is-free/social.webp` | 1200x630 | image/webp | 267898 | `5366105951a2cb74bf333c06c6bee410b47f5a3ad47a30381597e0eb87128b2b` | Original hero derivative |
| a16z feed | Documentary screenshot | `_cdn/articles/the-model-is-free/source/a16z-open-weights-feed-original.png` | `https://cdn.hob.farm/articles/the-model-is-free/a16z-open-weights-feed.webp` | 596x1002 | image/webp | 91072 | `69170c629c98b5621651884c27dd0ae26721e5f5a8d4b90d8465b9954d90f45c` | Editorial commentary and criticism |
| Three Ways to Pay | Comparison diagram | `assets/the-model-is-free/diagrams/01-three-routes.svg` | `https://cdn.hob.farm/articles/the-model-is-free/diagrams/01-three-routes.svg` | 1600x1000 | image/svg+xml | 8936 | `c821715eac432f17d5091cf656f27dde4a40297c016a935ab9c376856d3caf5e` | Original supplied explanatory graphic |
| Hybrid workflow | System diagram | `assets/the-model-is-free/diagrams/02-rent-gpu-own-workflow.svg` | `https://cdn.hob.farm/articles/the-model-is-free/diagrams/02-rent-gpu-own-workflow.svg` | 1600x1000 | image/svg+xml | 9851 | `d59a5ebff0e15817cf9766e6418676037d42bf8214545bc4629bada88c7d1d2a` | Original supplied explanatory graphic |
| Upgrade Cascade | Conditional dependency diagram | `assets/the-model-is-free/diagrams/03-upgrade-cascade.svg` | `https://cdn.hob.farm/articles/the-model-is-free/diagrams/03-upgrade-cascade.svg` | 1600x1000 | image/svg+xml | 9027 | `863af1a4606112bd7f2bf9d1b35b50c9ac74684e316e2d6288dd3925679928fa` | Original supplied explanatory graphic |
| Modular Backplane | Speculative diagram | `assets/the-model-is-free/diagrams/04-modular-backplane-concept.svg` | `https://cdn.hob.farm/articles/the-model-is-free/diagrams/04-modular-backplane-concept.svg` | 1600x1000 | image/svg+xml | 12151 | `23b855d8bdbf0e08d9d12c6c9df4fe0f7d0d929e37d0b0c77f629332196adc30` | Original supplied explanatory graphic |
| Compute Becomes Boring | Historical analogy diagram | `assets/the-model-is-free/diagrams/05-compute-becomes-boring.svg` | `https://cdn.hob.farm/articles/the-model-is-free/diagrams/05-compute-becomes-boring.svg` | 1600x1000 | image/svg+xml | 10284 | `86cf72e32cb9e77fe76b49f43f69f2ff4cb9b3b8ca52b1196de59cbdb08e3014` | Original supplied explanatory graphic |

The generated hero master SHA-256 is `3cc943a65d607c15e600c85c0b6d69f54fec7589dfc50be1760fc31063c96e69`. The original screenshot SHA-256 is `e0762ff6a86b62f9c61eeb57a85e138d1a6ef7ad6522c9558092bae47f32a860`. The hero prompt is retained in `reports/the-model-is-free/hero-prompt.md`.

## 7. R2/CDN actions

- Prefix checked: `articles/the-model-is-free/`
- Collision-check command/result: `npm run r2:the-model-is-free:dry-run`; all eight keys reported `READY`
- Objects added: hero, social image, screenshot derivative, and five SVG diagrams
- Objects intentionally not uploaded: hero master PNG, original supplied screenshot, omitted future-seed screenshot, QA captures, and editorial reports
- Verification: every public URL returned HTTP 200 with the expected MIME type and matching SHA-256
- Objects overwritten: `none`

## 8. Files changed

Modified:

- `package.json`: article-specific asset, manifest, dry-run, and upload scripts

Created:

- `.github/workflows/publish-the-model-is-free.yml`
- `scripts/build-the-model-is-free-assets.mjs`
- `scripts/build-the-model-is-free-manifest.mjs`
- `scripts/publish-scheduled-the-model-is-free.mjs`
- `src/content/articles/the-model-is-free.mdx`
- `src/components/articles/the-model-is-free/ArticleDiagram.astro`
- `src/components/articles/the-model-is-free/FeedScreenshot.astro`
- `tests/the-model-is-free-article.test.mjs`
- `_cdn/articles/the-model-is-free/source/the-model-is-free-hero-master.png`
- `_cdn/articles/the-model-is-free/source/a16z-open-weights-feed-original.png`
- `assets/the-model-is-free/hero.webp`
- `assets/the-model-is-free/social.webp`
- `assets/the-model-is-free/a16z-open-weights-feed.webp`
- `assets/the-model-is-free/diagrams/01-three-routes.svg`
- `assets/the-model-is-free/diagrams/02-rent-gpu-own-workflow.svg`
- `assets/the-model-is-free/diagrams/03-upgrade-cascade.svg`
- `assets/the-model-is-free/diagrams/04-modular-backplane-concept.svg`
- `assets/the-model-is-free/diagrams/05-compute-becomes-boring.svg`
- `reports/the-model-is-free/asset-manifest.json`
- `reports/the-model-is-free/hero-prompt.md`
- `reports/the-model-is-free/publication-day-verification.csv`
- `reports/the-model-is-free/verification-notes.md`
- `reports/the-model-is-free/completion-report.md`
- `reports/the-model-is-free/qa/desktop-1440.png`
- `reports/the-model-is-free/qa/desktop-diagram.png`
- `reports/the-model-is-free/qa/desktop-opening.png`
- `reports/the-model-is-free/qa/laptop-1024.png`
- `reports/the-model-is-free/qa/mobile-390.png`
- `reports/the-model-is-free/qa/mobile-diagram.png`
- `reports/the-model-is-free/qa/mobile-opening.png`

Deleted: none.

## 9. Validation

| Command or check | Result |
|---|---|
| Packet `python 00_START_HERE/verify-pack.py` | Passed: 37 sources, 18 checks, five SVGs and previews, two screenshots, 33 checksums |
| `npm run build:the-model-is-free-assets` | Passed |
| `npm run manifest:the-model-is-free-assets` | Passed: eight records |
| `npm run r2:the-model-is-free:dry-run` | Passed: eight absent destinations, no writes |
| `npm run r2:the-model-is-free:upload` | Passed: eight uploads and eight public checksum verifications |
| `node --test tests/the-model-is-free-article.test.mjs` | Passed: 4 of 4 |
| `npm test` | Passed: 257 of 257 |
| `npx astro check` | Passed: 574 files, zero errors, warnings, or hints |
| `npm run build` | Passed in final scheduled state |
| `git diff --check` | Passed |
| Current-date visibility | Route, article index, RSS, and sitemap all omit the future article |
| Post-release simulation | Route, index, RSS, sitemap, ordering, and related predecessor present |
| Chromium 1440x1000 | Passed; 13 page images loaded; no overflow; five diagrams present |
| Chromium 1024x768 | Passed; 13 page images loaded; no overflow; five diagrams present |
| Chromium 390x844 | Passed; 13 page images loaded; no overflow; five mobile transcripts present |
| Open Graph crop | Passed on the 1200x630 derivative |

Build output contains existing Vite deprecation warnings about `esbuild` and `optimizeDeps.esbuildOptions`; Astro check reports no source diagnostics.

## 10. Publication actions

- Commit created: no
- Push completed: no
- Scheduled deployment registered: no; the workflow exists locally and becomes active after an authorized push to `main`
- Live verification performed: all eight CDN assets only
- Irreversible or credential-bound actions not run: Git commit, Git push, and production article deployment

## 11. Remaining work

Review the finished article and visual package, then explicitly authorize a commit and push to `origin/main`. That push is the one remaining action required to register the one-time August 13 publication workflow and place the article in the normal Cloudflare Pages deployment path.
