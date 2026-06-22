---
title: "Exporting Your Work"
description: "Saving prompts, downloading images, and exporting your IR for external use."
project: "stylefusion"
section: "exporting"
order: 1
publishedAt: 2026-03-13
---

## Exporting Prompts

The Export panel appears on the right side of the Workspace whenever an IR exists. Two primary actions:

**Copy All:** copies the complete export to your clipboard. Paste it into any text editor, chat, or external tool.

**Download .txt:** saves a text file containing everything. Use the preview toggle to inspect the full export text before downloading.

### What's in the Export

The export bundles your complete working state:

- **Generative description:** a natural language summary of the IR
- **Image JSON:** structured JSON prompt for programmatic use
- **Description prompt:** prose format
- **Creative Slots prompt:** broken down by visual category
- **Compact prompt:** concise format
- **Structured metadata:** arrangement, model info, character DNA if active
- **Full IR JSON:** the raw IR data

This is everything you'd need to reproduce the generation outside of StyleFusion, or to share your creative direction with someone else.

### Individual Prompt Export

Each of the four prompt cards in the right panel has its own copy and download buttons. If you only need one format (say, the Compact prompt for pasting into another tool), grab just that one.

**Download All Prompts** bundles all four formats into a single .txt file without the extra metadata that the full export includes.

## Downloading Images

### From the Workspace

Hover over any generated image to reveal the Download button. Images save as PNG or JPG.

The enhanced version (after Bria upscale) has its own download button, separate from the original.

### From History

Click a thumbnail in History to open the detail modal. The full-size image is displayed there. Right-click to save, or use your browser's image save functionality.

## Saving Your IR State

The IR is ephemeral: it lives in your current session. If you close the tab or run a new extraction, the previous IR is gone (unless you've pinned or exported it).

**Pin:** the Pin button in the IR header locks the current IR state. Subsequent extractions won't overwrite it. Unpin to allow new extractions.

**Copy JSON:** copies the raw IR data as JSON. Useful for archiving or for programmatic workflows where you want to feed the IR into external tools.

**Download .txt:** exports the IR as a formatted text file.

The recommended habit: whenever you reach an IR state worth keeping, either Pin it (if you're still working) or Export it (if you're done for now). Building good IRs takes time; losing them to an accidental extraction is frustrating.

## Using Exports Outside StyleFusion

The exported prompts are standard text. You can use them with any image generation tool that accepts text prompts:

- Paste the Compact prompt into Midjourney, ComfyUI, or another generation interface
- Feed the Image JSON into API calls to any supported model
- Share the Description prompt with collaborators as a creative brief
- Use the Creative Slots breakdown to understand which elements are driving the output and adjust them in your external tool

The IR JSON export is the most complete format. If you're building your own workflows or tools, this contains every extracted data point, confidence score, and classification result.
