---
name: hobfarm-article-build
description: Implement or update a HobFarm article in the current website repository from approved copy, an outline, research, media, or a ChatGPT-created build packet. Use for content files, frontmatter, article components, assets, scheduling, source notes, metadata, and validation after editorial direction is established.
---

# HobFarm Article Build

Turn the reconciled editorial material into a review-ready implementation using the repository's current architecture.

Read [`../../../docs/editorial/EDITORIAL_CHARTER.md`](../../../docs/editorial/EDITORIAL_CHARTER.md). Read the focused project references routed by the root `AGENTS.md`, then inspect the current article schema, representative article files, layouts, figure and media components, CDN helpers, editorial registry, scheduling behavior, package scripts, and working tree.

## Reconcile plan and repository

Use the current request and approved article material for the desired outcome. Use the repository for present paths, field names, enums, routes, components, asset handling, and commands. Translate stale packet assumptions into current equivalents. Treat a genuine difference requested by the user as the change to implement.

Keep the approved thesis, evidence boundaries, first-person meaning, selected media, humor, and visual purpose intact while fitting the site. Use `hobfarm-research`, `hobfarm-prose`, or `hobfarm-visual-editorial` when the build exposes unfinished work in those areas.

## Assemble the article

Use `src/content/articles/` for the canonical article source and `research/<article-slug>/` for durable receipts or working evidence that deserves preservation. Follow the current schema for frontmatter, source notes, relationships, dates, and metadata. Reuse existing components and patterns. Add a new structure when the requested result genuinely needs one and the current architecture has no suitable equivalent.

Give images, captions, alt text, source links, related reading, social metadata, and structured data the treatment supported by the current article form. Follow the static scheduling contract in `docs/codex/publishing-surfaces.md`: a publication timestamp sets release eligibility, not an executing scheduler. A future-dated article becomes public only after an authorized production build runs after the release instant and that output is deployed. Keep setting the timestamp separate from arranging or performing those release actions, and do not promise automatic publication unless that infrastructure actually exists.

## Finalize and validate

When content is substantially complete, use `editorial-mesh` for section, series, subjects, entities, source artifacts, and related reading. Run the focused checks required by the changed files, including the production build for a completed article implementation and the repository's editorial or site-structure audits when their domains changed.

Leave the work review-ready in the shared `main` worktree. Commit, push, deployment, publication, remote uploads, paid generations, and other outward actions follow the current user request and repository release rules. Report material factual corrections, editorial changes, generated or uploaded assets, validations, unresolved evidence, and release state.
