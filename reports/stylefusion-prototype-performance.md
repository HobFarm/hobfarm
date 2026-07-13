# StyleFusion prototype performance check

Measured from the production build on 2026-07-12. The comparison uses each route's generated HTML plus locally linked CSS and JavaScript. It excludes fonts, images, third-party requests, compression, and browser caching, so the totals are a stable build comparison rather than a network benchmark.

| Route | HTML | Linked CSS | Linked JavaScript | Approximate total |
| --- | ---: | ---: | ---: | ---: |
| Current public `/workshop/stylefusion/` | 45,174 B | 171,094 B | 3,368 B | 219,636 B |
| Private `/workshop/stylefusion/prototype/` | 72,262 B | 189,232 B | 3,368 B | 264,862 B |
| Corrected `/workshop/visual-lab/` | 60,984 B | 183,027 B | 3,368 B | 247,379 B |

The prototype is 45,226 bytes, or 20.6%, larger than the current public route before compression. The increase is static HTML and component CSS for the four structured studies, the pipeline, confidence panels, IR inspectors, and compiled-document views. Linked JavaScript is unchanged at 3,368 bytes. The expandable inspectors use native `details` elements and do not add client-side application code.

## Media and privacy checks

- The prototype contains no reference or result image elements. Its three image elements belong to the shared site header and footer.
- No Windows user path or legacy project-files path appears in the built prototype HTML.
- The prototype has `noindex` metadata and is absent from the generated sitemap.
- No private StyleFusion application URL is present.
- No generation request, upload, or paid model action is available from the prototype.

## Interpretation

The prototype is deliberately information-dense, but it remains a static Astro page. Before any public-route replacement, the main performance decision is whether all four studies should render on first load or whether secondary studies should move to separate pages. No change is required for this private review build.
