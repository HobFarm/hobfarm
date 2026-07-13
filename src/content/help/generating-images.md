---
title: "Generating Images"
description: "Model selection, aspect ratios, prompt modes, and the generation process."
project: "stylefusion"
section: "generating"
order: 1
publishedAt: 2026-03-13
---

## Before You Generate

Three things need to be ready before the Generate button activates:

1. **An IR exists** (you've run Fuse on at least one reference image)
2. **Prompts are compiled** (auto-triggers after extraction, or hit Compile manually)
3. **A valid image model is selected** (one where you have an API key configured)

If the button stays disabled, check those three conditions.

## Choosing an Image Model

The model dropdown on the right panel groups models by provider:

- **Gemini:** Google's models. Good general-purpose generation.
- **OpenAI:** DALL-E variants. Strong with natural language prompts.
- **fal.ai:** proxy access to Flux variants, SeedDream, Recraft, and others. Wide variety of styles and capabilities.
- **Bria:** creative upscaling (not direct generation).
- **Grok:** xAI's image generation. Tends toward photorealistic output.
- **BFL (Black Forest Labs):** Flux models. Strong with artistic and stylized content.
- **Z.AI (Zhipu):** CogView models. Good with certain aesthetic styles.

Models without a configured API key show "(no key)" and are grayed out. Set up keys in Settings.

Different models interpret the same compiled document differently. Part of learning the full workflow is developing a sense for which downstream generation models handle which styles best. The History page helps here: send the same IR-derived prompt to multiple models and compare the resulting images without treating them as part of the Complete Export.

## Aspect Ratio

The selector shows 10 ratios as visual preview rectangles:

9:16, 2:3, 3:4, 4:5 (portrait orientations), 1:1 (square), 5:4, 4:3, 3:2, 16:9, 21:9 (landscape orientations).

Two automatic behaviors:

- **Auto-detection:** StyleFusion reads the aspect ratio from your source image and pre-selects the closest match
- **Model filtering:** only ratios supported by your current image model appear as selectable options

If you've manually selected a ratio and want to go back to the auto-detected one, hit the Reset button.

Aspect ratio affects composition more than you might expect. The same IR compiled for 1:1 versus 16:9 produces noticeably different framing. Wide ratios push toward environmental compositions; tall ratios push toward close-up portraits. The arrangement and prompt compilation account for this, but the effect is still significant.

## Normal vs. Lame Mode

The toggle in the right panel switches between two prompt compilation modes:

**Normal** (purple): full creative prompts with expressive language, detailed descriptors, artistic terminology. This produces the best results with models that accept rich prompts.

**Lame** (amber): sanitized, simplified prompts. Strips out language that might trigger content filters on more conservative APIs. Use this if a model keeps rejecting your prompts or producing filtered/blurred results. The output will be less creatively directed but more likely to succeed.

You can switch modes and recompile without re-extracting. The IR stays the same; only the prompt language changes.

## The Generation Process

Hit Generate. The button shows "Generating..." with a spinner. Wait time varies by model (typically 10 to 60 seconds). The generated image appears in the center panel below the IR viewer.

The image card shows the model name in the top-left corner. Hover to reveal controls:

- **Zoom:** opens a fullscreen lightbox for detailed inspection
- **Download:** saves as PNG or JPG
- **Enhance:** runs Bria Creative Upscale (available for images under 4MP)
- **Regenerate:** runs the same prompt again for a different result

Each generation is saved automatically to your History.

## Upscaling

After generating, upscale controls appear in the right panel:

- **Model:** Topaz CGI (default)
- **Scale factor:** 2x, 3x, or 4x (toggle buttons)
- **Face Enhancement:** checkbox, on by default

Upscaling requires a fal.ai API key (Topaz runs through fal.ai's proxy). Face Enhancement improves facial detail during upscaling, which is especially useful after generating at lower resolutions.

The Bria Creative Upscale (available via the Enhance hover button on the image itself) is a different process: it re-imagines detail rather than just scaling pixels. It's available for images under 4MP and produces an "Enhanced" version that appears below the original.
