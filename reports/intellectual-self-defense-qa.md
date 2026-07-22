# Intellectual Self-Defense QA

Checked locally from the production build on July 21, 2026. No production deployment was performed.

## Rendered routes

The Chrome pass covered the Academy index, course landing, orientation, Circuit Mint case study, final protocol lesson, article, both printable worksheets, and the existing Avatar Content System course. Desktop captures are 1425 × 990 or 1767 × 923. Mobile captures are 375 × 812.

- Every inspected route returned HTTP 200 and exposed its core heading in server-rendered HTML.
- Course and article layouts had no page-level horizontal overflow at desktop or mobile widths.
- The narrow breadcrumb remains horizontally scrollable inside its own existing container.
- Feature images loaded from the verified R2 URLs and carried alt text. Off-screen diagrams retain native lazy loading.
- Article-to-course and course-to-article links were present.
- Editable downloads and both print worksheet routes were present.
- Course and lesson JSON-LD and the article's direct-CDN Open Graph image were present.
- Keyboard focus advanced through the header controls. The checked tabs produced no console errors.
- The new static pages and figures add no client-side runtime or animation. Core content was also checked directly in the server-rendered HTML.
- The existing Avatar Content System landing, free overview, course modules, and lesson links remained available.

## Screenshots

- [Academy desktop](intellectual-self-defense-qa/academy-desktop.png)
- [Academy mobile](intellectual-self-defense-qa/academy-mobile.png)
- [Course desktop](intellectual-self-defense-qa/course-desktop.png)
- [Course mobile](intellectual-self-defense-qa/course-mobile.png)
- [Orientation desktop](intellectual-self-defense-qa/lesson-00-desktop.png)
- [Circuit Mint desktop](intellectual-self-defense-qa/lesson-05-desktop.png)
- [Circuit Mint mobile](intellectual-self-defense-qa/lesson-05-mobile.png)
- [Final protocol desktop](intellectual-self-defense-qa/lesson-08-desktop.png)
- [Article desktop](intellectual-self-defense-qa/article-desktop.png)
- [Article mobile](intellectual-self-defense-qa/article-mobile.png)
- [AI Output Receipt worksheet](intellectual-self-defense-qa/ai-output-receipt-worksheet-desktop.png)
- [Existing Avatar course desktop](intellectual-self-defense-qa/avatar-course-desktop.png)

## Asset delivery

All 31 manifest objects passed direct R2 SHA-256 verification and public HTTP/content-type verification. Images, SVG files, and Markdown files were byte-identical through the public hostname. Cloudflare adds managed delivery markup to public HTML responses, so the manifest stores the exact R2 hash and the transformed public-response hash for the two HTML worksheet assets.
