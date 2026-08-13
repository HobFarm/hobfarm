# Hit the Source Directly: browser QA note

The article route is intentionally absent from a production build before its release instant. To inspect the complete page, the article was rendered with a temporary local released-state date of August 11, 2026. That date is visible in the full-page preview captures; it is a preview artifact, not publication metadata.

After the captures, the source was restored to `2026-08-21T16:20:00-07:00`, rebuilt, and audited. The final build excludes the article from the route map, combined feed, Technology feed, sitemap, mesh output, and search surfaces until release.

The mobile diagram and subscribe captures test the rendered body at 390 pixels wide. Automated checks also loaded each of the four vector body diagrams at its full 900-pixel source width, measured zero horizontal overflow, and exercised the clipboard-failure fallback.

The author-supplied engagement-factory illustration received a second desktop and mobile pass after it was added. `qa-desktop-engagement-factory.png` records the 672-pixel wide presentation at a 1440-pixel viewport. `qa-mobile-engagement-factory.png` records the 351-pixel wide presentation at a 390-pixel viewport. The browser loaded the complete 1491 by 1055 source in both cases, found no horizontal overflow, exposed the transcript control, and emitted `social-illustrated-v2.webp` as the Open Graph image.
