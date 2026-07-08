---
title: "Building HobFarm: Architecture for Multi-Provider AI"
excerpt: "How we built a platform that routes creative work through multiple AI providers without locking into any single one. Cloudflare Workers, AI Gateway, and lessons learned."
author: d00d
category: technical
department: workshop-notes
format: workshop-note
status: published
tags:
  - cloudflare
  - architecture
  - workers
hero: https://cdn.hob.farm/pages/blog/hello_world_hero.png
publishedAt: 2026-03-01
draft: false
---

## Why Multi-Provider?

Every AI provider has strengths. Midjourney handles aesthetics differently than DALL-E. Claude reasons differently than GPT-4. Building on a single provider means inheriting their blind spots.

HobFarm routes through multiple providers using Cloudflare's AI Gateway. One request, multiple responses, structured comparison. The architecture is simple: a Workers-based routing layer that normalizes inputs and outputs across providers.

## The Stack

- **Cloudflare Workers** for compute at the edge
- **AI Gateway** for provider routing, logging, and fallback chains
- **R2** for media storage with CDN delivery
- **D1** for structured data (Grimoire knowledge base, analytics)
- **KV** for ephemeral state (session data, rate limiting, provider health)

## Lessons Learned

Provider APIs change constantly. Abstractions that work today break tomorrow. The key insight: keep the routing layer thin. Don't try to normalize everything. Let provider-specific features through when they matter, abstract only the common patterns.

The second insight: cost awareness needs to be a first-class concern, not an afterthought. Every request has a price. Route based on value, not just capability.

## What's Next

StyleFusion already uses this architecture for image generation. Grimoire and HobBot are next. The goal: every HobFarm tool shares the same provider routing, the same cost tracking, the same fallback chains.
