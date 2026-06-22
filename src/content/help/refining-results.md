---
title: "Refining Results"
description: "Editing the IR, iterating on generations, and the refinement loop."
project: "stylefusion"
section: "refining"
order: 1
publishedAt: 2026-03-13
---

## The Refinement Loop

Rarely does the first generation nail exactly what you want. StyleFusion is designed for iteration: generate, assess, adjust, regenerate. The IR sits in the middle as an editable blueprint that you refine until the output matches your vision.

The basic loop:

1. Generate an image
2. Assess what's right and what's off
3. Edit the IR to address what's off
4. Recompile prompts
5. Regenerate
6. Compare the new result against the previous one in History

This is faster than re-extracting from scratch because the IR preserves all the work from the initial extraction. You're making surgical adjustments, not starting over.

## Editing the IR Directly

Every field in the IR viewer is editable. Click into any section and modify the content.

**Common adjustments:**

**Colors are wrong.** Open the Visual DNA section and edit the primary, secondary, or accent color hex values. Or adjust the Palette section's mood and contrast settings. Recompile and the new color direction flows into the prompts.

**Lighting is flat.** Open the Lighting section. Change the key light direction, increase contrast ratio, add a practical light source. Even small lighting edits can dramatically shift the output's mood.

**Subject details need correction.** The extraction might misidentify clothing, pose, or features. Edit the Visual DNA section to correct these. Be specific: "leather jacket, zipped, matte black" beats "dark jacket."

**Environment is distracting.** Edit the Environment section to simplify or redirect the background. Or add environment terms to the Negative Prompt to suppress unwanted elements.

**Style is close but not right.** Adjust the style anchors. Add more specific terms or remove ones that are pulling in the wrong direction. Try a different arrangement to restructure how the IR compiles.

## Using the Negative Prompt

The Negative Prompt section (red label) is your exclusion list. Add tag chips for anything you want the generation model to actively avoid.

Effective negatives are specific:
- "blurry background" (if you want sharp throughout)
- "text, watermark, signature" (common AI artifacts)
- "extra fingers, malformed hands" (anatomical corrections)
- "low contrast, washed out" (if outputs keep looking flat)

Ineffective negatives are vague:
- "ugly" (too subjective)
- "bad" (meaningless to the model)

Negatives work differently across models. Some models respond strongly to negative prompts; others mostly ignore them. If negatives aren't having the effect you want, try switching models.

## Comparing Results

The History page stores every generation. After multiple iterations:

1. Open History
2. Filter by the provider you've been using
3. Click through thumbnails to compare
4. Each detail modal shows the full prompt used, so you can trace which IR changes produced which results

This is the most reliable way to understand cause and effect. Single-variable changes (edit one IR field, regenerate, compare) teach you what each control actually does to the output.

## When to Re-Extract vs. Edit

**Edit the IR when:** you want to adjust specific aspects of an otherwise good extraction. Colors, lighting, environment, subject details. The structural analysis is sound; you're fine-tuning.

**Re-extract when:** the initial extraction fundamentally missed the mark. The model misidentified the subject, the composition analysis is wrong, or the visual DNA just doesn't represent what you see in the reference. Upload a different reference or try a different extraction model.

**Change arrangements when:** the IR content is good but the prompt structure isn't working. Same information, different emphasis.

**Swap image models when:** the prompts read well but the generated output doesn't match. Different models have different strengths and biases. A prompt that produces muddy results on one model might look stunning on another.

## Pinning and Exporting

If you reach an IR state you're happy with, use the **Pin** button in the IR header to preserve it. This prevents accidental overwrites from subsequent extractions.

The **Export panel** (right side, visible when IR exists) lets you save the complete state: all four prompt types, the generative description, structured metadata, and full JSON. This is your checkpoint. If you want to return to a known-good state later, export it.
