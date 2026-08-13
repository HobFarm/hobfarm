# Hit the Source Directly: feed audit

Checked August 12, 2026.

## Existing public feeds before implementation

All seven public Editorial feeds returned HTTP 200 with an XML content type and parsed successfully:

| Feed | Items |
| --- | ---: |
| Combined `/rss.xml` | 58 |
| Technology | 25 |
| Art & Design | 11 |
| Culture | 10 |
| Film & TV | 9 |
| Music | 1 |
| Places & Systems | 2 |

The feed generator already used the shared publication-time filter, canonical article path helper, release date, descriptions, categories, and optional media. The base layout already advertised the combined feed, while section archives advertised their relevant section feeds. The implementation kept that machinery and improved the human entry points.

## Final build before the release boundary

- Combined feed: 58 items, 58 unique links, 58 present GUIDs, and 58 unique GUIDs.
- Technology feed: 25 items.
- `Hit the Source Directly` was absent from both feeds.
- The scheduled article route was not generated.
- `/subscribe/` was generated.

## Release behavior

The publication helper test establishes that the article changes from private to public at the exact release instant. A temporary local released-state build established the downstream result:

- Combined feed increased from 58 to 59 items.
- Technology increased from 25 to 26 items.
- The article appeared at `https://hob.farm/articles/hit-the-source-directly/`.
- Its GUID matched its permanent canonical link.
- The article route was generated.

The temporary date used only to make the local route render for browser QA was restored. Final source metadata remains `2026-08-21T16:20:00-07:00`.

## Human subscription entry points

- The Articles index now presents the combined feed prominently.
- Every article layout includes a compact direct-subscription module.
- `/subscribe/` lists the combined feed and all six section feeds.
- Visible full feed addresses provide a no-JavaScript and clipboard-failure path.
- The copy controls use a polite live status region.
- The instructions cover Thunderbird, NetNewsWire, Feedly, and FreshRSS.
- The page explains that raw XML is normal and that readers usually poll on a schedule.
- No newsletter dependency or invented podcast enclosure was added.
