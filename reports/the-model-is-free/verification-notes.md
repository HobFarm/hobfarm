# Verification notes

Facts and product state were checked August 6, 2026. The final article treats prices as a dated snapshot, attributes vendor capability limits, avoids a RunPod rate, avoids a Framework price table, and does not turn the hardware examples into buying recommendations.

## Schedule simulation

The repository source records **Same Same, But Different** at `2026-08-12T16:20:00-07:00`. The new article is scheduled for `2026-08-13T16:20:00-07:00`, preserving 4:20 p.m. and the `-07:00` offset. The parsed difference is 86,400 seconds.

The normal build at the current date omitted the new route from the article index, RSS, and sitemap. For a local post-release simulation only, the article's `publishedAt` value was temporarily moved into the past while `pubDate` remained August 13. The production build then included the route, article index entry, RSS entry, sitemap entry, related predecessor, and chronological position. The exact final timestamp was restored and revalidated afterward.

The one-time GitHub Actions schedule uses `20 23 13 8 *`, which corresponds to August 13 at 23:20 UTC and 16:20 at the preserved `-07:00` offset. The script independently refuses to publish if the frontmatter timestamp changes or the due instant has not arrived.

## Visual and browser QA

The post-release build was inspected in Chromium at 1440 by 1000, 1024 by 768, and 390 by 844. All eight article assets loaded; all five diagrams decoded at 1600 by 1000; the page had no horizontal overflow. Diagram transcripts are hidden as redundant detail on wider screens and present as expandable text at 390 pixels. The documentary screenshot retains its full context and opens through the article lightbox. Hero composition, title contrast, mobile crop, diagram labels, captions, and Open Graph crop were reviewed.

QA captures live in `reports/the-model-is-free/qa/`.

## Evidence boundaries

- DGX Spark model-size limits are labeled as NVIDIA claims.
- The RTX 5090 power figure is explicitly a reference configuration example.
- The upgrade cascade uses conditional language and does not claim every new GPU needs a new motherboard.
- `future junk` is defined as capability obsolescence rather than physical failure.
- RunPod's storage, region, transfer, and shutdown friction remains in the copy.
- LoRA durability is limited to compatible model families and runtimes.
- The modular backplane is presented as a desired system and a what-if diagram, not a current product.
- The television analogy uses a BLS trend and does not invent a personal 1986 receipt.
- The future microculture article gets one paragraph and no dead public link.
