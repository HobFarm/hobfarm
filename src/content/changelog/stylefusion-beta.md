---
title: "StyleFusion Beta"
publishedAt: 2026-02-01
---

## StyleFusion enters beta

The reference-extraction pipeline went live behind Cloudflare Access. StyleFusion accepts role-scoped source images, extracts visual data such as palette, geometry, texture, lighting, and composition, then compiles a generation document for downstream provider runs.

### What shipped

- Visual DNA extraction pipeline (palette, geometry, texture, lighting, composition analyzers)
- Prompt compilation engine with Grimoire integration
- Multi-provider routing for downstream image generation (Google Vertex AI and additional image generation models)
- Face geometry extraction and identity lock system
- Identity negatives for drift prevention
- Cloudflare R2 storage for source images and generated outputs
- Generation queue with status tracking
