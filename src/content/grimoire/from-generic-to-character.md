---
title: "From Generic to Character"
description: "A walkthrough showing how StyleFusion transforms a standard AI portrait into a consistent, distinctive character."
category: "examples"
order: 1
tags: ["walkthrough", "case-study", "character", "before-after"]
difficulty: "beginner"
project: "stylefusion"
---

This example walks through a real StyleFusion transformation, step by step. We start with a generic AI-generated portrait and end with a consistent character that holds identity across multiple styles.

## The Problem

Standard AI image generation gives you beautiful images with no memory. Generate a "woman with red hair and green eyes" ten times and you get ten different women. They'll all have red hair and green eyes, but the face structure, skin tone, expression, and proportions shift with every generation.

For creative projects, that's useless. You need a character, not a random face.

## The Starting Point

Our source image is a straightforward portrait: front-facing, clear lighting, neutral expression. It's a good reference because the geometry analyzer can extract high-confidence measurements from every facial feature.

The extraction pipeline identifies:

- **Face geometry:** oval face shape, slightly wide-set eyes, defined cheekbones, soft jaw
- **Color atoms:** warm skin undertone (golden), deep auburn hair, grey-green iris
- **Lighting:** soft diffused front light, minimal shadow, even exposure
- **Texture:** clean skin, fine detail, photorealistic quality
- **Expression:** neutral baseline with slight upward mouth tension (hint of a smile)

This gives us roughly 25 atoms with an overall identity confidence of 91%.

## What the Grimoire Adds

The extracted atoms go to the Grimoire for enrichment. The knowledge graph suggests:

- The color combination (auburn + grey-green + golden skin) has strong associations with "pre-Raphaelite" and "autumnal warmth" style clusters
- The soft lighting profile pairs well with both photorealistic and painterly outputs
- The face geometry (oval, defined cheekbones) tends to hold identity well across styles because it has distinctive proportions without extreme features

The Grimoire also generates identity negatives: "round face, close-set eyes, cool skin undertone, sharp jaw." These prevent the most likely drift directions.

## The Outputs

Using the same identity signature, we compile prompts for different styles:

**Goth Anime Line Art:** the geometry holds through stylization. The wide-set eyes become a distinctive feature in anime proportions rather than getting averaged out. The auburn hair translates to deep burgundy in the gothic palette. Identity negatives keep the jaw shape consistent even as the rendering style changes dramatically.

**Psychedelic Color Burst:** heavy color manipulation, but the face structure stays anchored. The geometry analyzer's measurements act as scaffolding that the psychedelic colors wrap around rather than dissolve. You can still tell it's the same person under the kaleidoscope.

**Art Deco Portrait:** geometric stylization that could easily flatten distinctive features into generic shapes. The identity lock keeps the eye spacing and cheekbone definition even as everything gets reduced to clean lines and gold leaf textures.

## What Made It Work

Three things distinguish this from just running the same prompt through different models:

**Identity negatives did the heavy lifting.** Without them, each style would have drifted toward that style's "default face." Anime has a default face. Art Deco has a default face. The negatives prevented that convergence.

**Confidence-weighted anchoring prioritized the right features.** The system didn't try to preserve everything equally. High-confidence measurements (eye spacing, face shape) were locked hard. Lower-confidence details (exact lip curvature at this angle) were allowed to flex with the style. This keeps the character recognizable without making every output look stiff.

**The Grimoire's gap-filling suggested compatible atoms.** When moving from photorealistic to anime, there's a whole set of rendering conventions that need to be specified. The Grimoire's knowledge of what "anime" means at the atom level (cell shading, simplified nose, larger eye relative scale) filled those gaps without the user having to specify them manually.

## Try It Yourself

The best way to understand the pipeline is to run it. Upload a clear portrait as your source, let the extraction run, review the detected atoms, and then generate across styles. Pay attention to what stays consistent and what changes. That's the identity lock doing its job.

## Further Reading

- [Face Geometry and Identity Lock](/grimoire/face-geometry-identity-lock) for technical details on the measurement system
- [Color Palette Recipes](/grimoire/color-palette-recipes) for curated palette combinations to try
