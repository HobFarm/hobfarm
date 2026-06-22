---
title: "StyleFusion Beta"
publishedAt: 2026-02-01
---

## StyleFusion enters beta

The core image generation pipeline went live behind Cloudflare Access. StyleFusion takes a source image, extracts its visual DNA (color palette, face geometry, texture profile, lighting, composition), and generates consistent character variations across multiple AI providers.

### What shipped

- Visual DNA extraction pipeline (palette, geometry, texture, lighting, composition analyzers)
- Prompt compilation engine with Grimoire integration
- Multi-provider AI routing (Google Vertex AI and additional image generation models)
- Face geometry extraction and identity lock system
- Identity negatives for drift prevention
- Cloudflare R2 storage for source images and generated outputs
- Generation queue with status tracking
