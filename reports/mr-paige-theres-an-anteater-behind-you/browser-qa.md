# Browser QA

Checked August 4, 2026, against the local Astro development server. The article was temporarily exposed to local rendering for this review and returned to `status: scheduled` afterward.

| Check | 1440×1000 | 390×844 |
| --- | --- | --- |
| HTTP status | 200 | 200 |
| H1 | correct | correct |
| Document width equals viewport | yes | yes |
| YouTube embeds | 3 | 3 |
| Source entries | 14 | 14 |
| Historical photo loaded | yes, 612px natural width | yes, 612px natural width |
| Zoo embed present | yes | yes |
| Broken images | 0 | 0 |
| Console or page errors | 0 | 0 |

The complete page and focused historical-photo and zoo-video captures are stored beside this report as `qa-desktop.png`, `qa-mobile.png`, `qa-desktop-historical-photo.png`, `qa-mobile-historical-photo.png`, `qa-desktop-zoo-video.png`, and `qa-mobile-zoo-video.png`.

The embedded players appeared as black placeholders in the headless screenshots, as expected before YouTube playback, while their iframe titles, privacy-enhanced embed URLs, and responsive containers were present. The actual video URLs were independently verified public and embeddable.
