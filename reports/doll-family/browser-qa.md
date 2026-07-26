# Doll Family browser QA

The article was temporarily exposed in a local production preview, reviewed, and returned to its scheduled state before the final build.

## Responsive checks

| Viewport | Result |
| --- | --- |
| 1440 × 900 | No horizontal overflow; hero, title, tags, share controls, article figures, evidence components, source list, related articles, and footer remain contained |
| 1024 × 900 | No horizontal overflow; article header and cards remain readable |
| 768 × 900 | No horizontal overflow; title, metadata, tags, and share actions wrap cleanly |
| 390 × 844 | No horizontal overflow; title, dek, tags, share actions, and opening copy remain readable |

## Content and media checks

- The corrected Harry Earles / Olga Baclanova image loaded at 1400 × 1750 from the corrected CDN URL.
- The original-release and reissue *Freaks* posters loaded at their recorded dimensions.
- The custom citations render as 27 linked markers pointing to 23 semantic source-list entries.
- Citation navigation reaches the intended source after the site’s smooth-scroll transition.
- The page exposes its canonical URL, Open Graph image, Twitter large-card metadata, and Article JSON-LD.
- Browser inspection found no broken images or document-level horizontal overflow.
- Chrome reported extension message-channel noise during repeated reloads; it was not emitted by the page and did not correspond to a failed article request or interaction.

## Screenshots

- `article-1440x900.png`
- `article-1024x900.png`
- `article-768x900.png`
- `article-390x844.png`
- `article-early-images.png`
- `article-source-notes.png`
