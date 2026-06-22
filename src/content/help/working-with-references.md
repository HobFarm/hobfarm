---
title: "Working with References"
description: "Uploading images, assigning reference types, adjusting weights, and blending multiple sources."
project: "stylefusion"
section: "references"
order: 1
publishedAt: 2026-03-13
---

## Single Image Extraction

The simplest workflow: one reference image in, one IR out. Upload by dragging onto the left panel, clicking to browse, or pasting from clipboard. Hit Fuse and the extraction model analyzes everything in the image: subject, colors, lighting, texture, composition, environment.

Single-image extraction works best with clear, well-composed reference images. The more visual information the image contains, the richer the IR.

**Good references:** images with distinct color palettes, clear subjects, intentional lighting, visible textures. Doesn't need to be high-resolution, but it needs to be visually interesting.

**Weak references:** heavily compressed images, screenshots with UI elements, images that are mostly text, extremely dark or blown-out exposures. The extraction will still run but the IR will be sparse.

## Multi-Image Blending

Upload 2 to 5 images and StyleFusion blends their visual DNA according to your settings. This is where reference types and weights become important.

### Reference Types

Each uploaded image gets a Reference Type dropdown:

- **Subject:** the primary content source. Face, body, form, identity.
- **Style:** artistic style, rendering technique, overall aesthetic.
- **Composition:** framing, spatial layout, focal point placement.
- **Color:** palette, color relationships, saturation levels.
- **Lighting:** light direction, quality, contrast, temperature.
- **Texture:** surface quality, material properties, detail level.

When blending, StyleFusion pulls the specified qualities from each source. One image as Subject and another as Style means: "use the person from image 1 but render them in the style of image 2."

You can assign multiple images to the same type. Two Style references blend their aesthetic qualities based on relative weights.

### Weight Sliders

Each image has a weight slider from 0.1 to 1.0. Weights are relative, not absolute. If image A has weight 0.8 and image B has weight 0.4, A has twice the influence.

Practical guidance:

- **Subject at 0.8-1.0:** you almost always want the subject source to dominate, especially for face and form.
- **Style at 0.4-0.7:** too high and the style overwhelms the subject; too low and it barely registers.
- **Color/Lighting at 0.3-0.5:** these are modifier qualities. A little goes a long way.

### Director's Note for Blends

The Director's Note becomes especially useful with multiple references. Use it to resolve ambiguity: "Take the face from image 1, the color palette from image 3, and ignore the background in image 2." Without guidance, the extraction model makes its own judgment calls about how to combine sources.

### Blend Results in the IR

After a blended extraction, the IR's Blend Section shows a per-reference breakdown:

- Which reference type and weight each image had
- Classification results with confidence percentages
- The model's reasoning for how it combined sources
- Aesthetic tags and dominant color swatches (6 per source)
- Blend notes explaining the synthesis

This is useful for understanding why the output looks the way it does, and for deciding which weights or types to adjust on the next pass.

## Tips for Better Extractions

**Match your intent to the extraction model.** Different models have different strengths. Gemini tends to produce detailed, structured extractions. GPT models often produce more natural-language-oriented results. Try the same reference with different extraction models and compare the IRs.

**Use the Director's Note even for single images.** "Focus on the outfit details" or "this is a mood reference, not a literal subject" helps the extraction model prioritize correctly.

**Don't over-blend.** 2-3 references with clear type assignments produce better results than 5 images competing for attention. Start simple, add complexity only when you need it.

**Check confidence scores.** After extraction, the Visual DNA section shows confidence scores for detected features. Low confidence on a feature you care about means the extraction model wasn't sure about it. Try a different reference image or strengthen it with the Director's Note.
