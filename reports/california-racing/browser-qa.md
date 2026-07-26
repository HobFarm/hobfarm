# California racing browser QA

Local route tested:

`http://127.0.0.1:4321/articles/california-used-to-race-here`

Chrome was used against the Astro development server on July 25, 2026.

## Responsive matrix

| Viewport | Result |
| --- | --- |
| 1440×1000 | Article header, hero, tags, share actions, long-form body, and all seven visual modules rendered. No broken images or page-level horizontal overflow. |
| 1024×900 | 27 figures and images loaded. Seven visual modules rendered. No horizontal overflow. |
| 768×900 | 27 figures and images loaded. Seven visual modules rendered. No horizontal overflow. |
| 390×844 | Final document width matched the 375-pixel layout viewport. The map, timeline, comparison table, cards, diagrams, and source links stayed inside the page. No broken images. |

## Checks

- One `h1`; no skipped heading levels.
- 27 images with alt attributes and 27 figure captions.
- 27 source links rendered under “Sources and further reading.”
- Four archive viewers use `object-fit: contain`; none reported a cropped
  presentation.
- Seven original visual modules render as static HTML and CSS.
- No module depends on a button, hover state, client-side map, or JavaScript for
  its core information.
- Canonical URL:
  `https://hob.farm/articles/california-used-to-race-here/`
- Open Graph image:
  `https://cdn.hob.farm/articles/california-racing/gilmore-1941-night-midget-race.jpg`
- Twitter card: `summary_large_image`.
- JSON-LD includes `Article` and `BreadcrumbList`.
- The rendered page contained 59 external links and no broken media elements.

## Fixes made during QA

- Long source URLs received article-body wrapping rules.
- Article-wide figures now stretch their internal visual modules. This fixed a
  collapsed mobile map and kept the film-comparison table’s horizontal scroll
  inside its own frame.
- The draft footnote-definition block became a numbered list of named links.

The desktop and mobile renders were visually inspected in Chrome. Screenshot
files were not committed. Full external-link crawling, JavaScript-disabled
browser emulation, and reduced-motion emulation were not run; the seven new
modules are static and contain no motion.
