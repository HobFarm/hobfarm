---
title: "How StyleFusion Reads Images"
excerpt: "Inside the Intermediate Representation: turning reference images into structured vocabulary that drives prompt compilation."
author: d00d
category: stylefusion
department: workshop-notes
workshopProgram: stylefusion
format: workshop-note
status: published
tags:
  - stylefusion
  - ai
  - image-generation
hero: https://cdn.hob.farm/pages/blog/ir_extraction.png
publishedAt: 2026-02-15
featured: true
draft: false
---

## The Problem with Vibes

Most image generation workflows start with a vague prompt: "cyberpunk city at night, moody lighting." The model interprets "moody" however it wants. You regenerate until something looks right. This is slot machine design: pull the lever, hope for a match.

StyleFusion replaces vibes with vocabulary. When you upload a reference image, the system does not try to replicate it. Instead, it extracts an Intermediate Representation (IR): a structured breakdown of what the image contains, how it is composed, and what stylistic decisions define its character. Color palette, lighting direction, material textures, compositional geometry, facial expressions, clothing details. Each element becomes a named slot with a specific value.

## Creative Slots

The IR is organized into Creative Slots: named positions in a structured schema that map to specific aspects of an image. A portrait has slots for face shape, expression, hair style, clothing, background treatment, lighting setup, and color grading. A landscape has slots for terrain, sky, atmospheric effects, focal point, and depth layers.

Each slot carries a vocabulary term drawn from the Grimoire knowledge base. Not arbitrary text, but specific atoms that the system has learned to associate with visual outcomes. "Rembrandt lighting" is not a vague suggestion; it is a precise vocabulary term with known relationships to shadow placement, key-to-fill ratio, and color temperature.

## Prompt Compilation

Once the IR is extracted, StyleFusion compiles it into a provider-specific prompt. This is where the structured vocabulary pays off. Different image generation models have different strengths and syntax preferences. DALL-E responds well to natural language descriptions. Midjourney favors parameter flags and weighted terms. Stable Diffusion uses positive and negative prompt regions with weighted tokens.

The compiler translates the same IR into the optimal format for each provider. The structured slots ensure nothing is lost in translation. The vocabulary terms have provider-specific mappings that have been tested and refined across thousands of generations.

## Why Structure Beats Freeform

The counterargument is that structure kills creativity. In practice, the opposite is true. Structure gives you control. When you know exactly which slot controls color temperature and which controls lighting direction, you can make precise adjustments without rerolling everything. Creativity operates within constraints; removing the randomness does not remove the creative agency, it amplifies it.
