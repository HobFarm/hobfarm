# Hit the Source Directly: browser QA note

The article route is intentionally absent from a production build before its release instant. To inspect the complete page, the article was rendered once with a temporary local released-state date of August 11, 2026. That date is visible in `qa-desktop.png` and `qa-mobile-hero.png`; it is a preview artifact, not publication metadata.

After the captures, the source was restored to `2026-08-21T16:20:00-07:00`, rebuilt, and audited. The final build excludes the article from the route map, combined feed, Technology feed, sitemap, mesh output, and search surfaces until release.

The mobile diagram and subscribe captures test the rendered body at 390 pixels wide. Automated checks also loaded each of the four body diagrams at its full 900-pixel source width, measured zero horizontal overflow, and exercised the clipboard-failure fallback.
