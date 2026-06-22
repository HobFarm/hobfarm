---
title: "March 2026 Site Audit"
publishedAt: 2026-03-13
---

## Site audit and cleanup

Comprehensive audit of the codebase, fixing critical bugs, improving component architecture, and cleaning up code quality issues.

### Critical fixes

- Fixed broken contact page (removed stale redirect that was sending `/contact` to `/`)
- Eliminated Alpine.js dependency (replaced with vanilla JS for prompt export tab switcher and copy button)
- Fixed RSS feed (rewrote from broken glob pattern to proper `getCollection("blog")`)
- Removed `.webp` files violating format rules (3 files converted to `.png`)

### Architecture improvements

- Split `CaseStudy.astro` (278 lines) into `CaseStudyHero.astro` and `CaseStudyMetadata.astro` (10-line composition manifest)
- Extracted `StyleShowcase.jsx` variant data into `style-cards.js` (359 to 274 lines)
- Removed empty `integrations` collection from schema
- Consolidated duplicate status page routes (canonical `/status` with redirect from `/helpcenter/status`)

### Code quality

- Replaced hardcoded hex color values with Tailwind design tokens
- Fixed import paths to use `@/` alias consistently
- Removed invalid configuration properties
- Updated legal documents with service-specific content
- Expanded Grimoire knowledge base with foundational articles
