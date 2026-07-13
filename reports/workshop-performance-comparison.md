# Workshop Performance Comparison

## Method

- Before: current deployed `/workshop/` page, Chrome performance navigation trace.
- After: local production build at `/workshop/`, Chrome performance navigation trace.
- The environments have different server latency, so LCP is reported as context rather than a controlled speed comparison.

## Results

| Metric | Before | After |
| --- | ---: | ---: |
| Largest Contentful Paint | 245 ms | 209 ms |
| Cumulative Layout Shift | 0 | 0 |
| Initial resources | 18 | 20 |
| Initial CDN resources | 9 | 13 |
| Initial MP4 requests | 1 | 0 |

The enriched visual index adds two initial resources and four CDN media requests. Both videos are poster-first with `preload="none"`; neither MP4 transfers during the initial local page load. The deployed page requested `sophia-stella-video.mp4` during its initial load.
