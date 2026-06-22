---
title: "The Workspace"
description: "Understanding StyleFusion's three-column layout: references, IR viewer, and generation controls."
project: "stylefusion"
section: "getting-started"
order: 2
publishedAt: 2026-03-13
---

## Layout Overview

The Workspace is StyleFusion's main screen. Three columns, each with a specific job:

- **Left panel:** your inputs (reference images, director's note, saved characters)
- **Center panel:** the Intermediate Representation and generated images
- **Right panel:** compiled prompts, generation controls, and export

The top navbar shows your four page tabs (Workspace, Characters, History, Providers), six provider status dots, and the Settings gear.

## Left Panel: References and Characters

### Reference Images

You can upload up to 5 reference images. Each image card shows a thumbnail, a number badge, a weight percentage, and a close button.

Two controls per image:

**Reference Type** tells StyleFusion what role this image plays. Options: Subject, Style, Composition, Color, Lighting, Texture. A single image defaults to general extraction, but when blending multiple images, assigning types tells the system which visual qualities to pull from which source.

**Weight slider** (0.1 to 1.0) controls how much influence this image has in the blend. Higher weight means more of that image's visual DNA carries through.

With one image, StyleFusion runs a straight extraction. With two or more, it runs a blend extraction that combines visual qualities according to your type assignments and weights.

### Director's Note

A free text field (500 character limit) where you can guide the extraction. Think of it as talking to the AI: "Focus on the neon lighting and ignore the background" or "I care about the color palette, not the composition." The note shapes what the extraction emphasizes.

### Active Models

Shows which extraction model and image generation model are currently selected, with "Change" links that take you to the Providers page.

### Character Cards

Up to 5 saved characters appear here as quick-select cards. Click one to activate it; its DNA merges into the IR during extraction. More on this in the [Characters](/helpcenter/characters) doc.

## Center Panel: IR Viewer and Output

### Before Extraction

A placeholder prompting you to drop reference images to begin.

### After Extraction: The IR Viewer

The IR (Intermediate Representation) is the structured analysis of your reference images. It's the core of StyleFusion's pipeline: everything between your inputs and the final prompt.

The header shows "Intermediate Representation" with a version badge and three action buttons: **Pin** (keeps this IR version), **Copy JSON** (copies the raw data), and **Download** (exports as .txt).

Below the header: which model performed the extraction and the currently selected arrangement.

**Arrangement Dropdown:** defaults to "Auto (Conductor)," which lets the AI pick the best arrangement for your content. You can override this with any available arrangement. Changing the arrangement triggers a recompilation of prompts.

**Style Anchors:** tag chips that define the core aesthetic direction. Add, remove, or reorder them to steer the output.

### The Six IR Sections

Each section is collapsible and tagged with a priority level (P0 through P5):

1. **Visual DNA:** the big one. Subject form, face details, hair, pose, attire, expression, colors (primary/secondary/accent with hex values), textures, structure, features, and confidence scores.
2. **Environment:** setting, surfaces, props, atmosphere.
3. **Camera:** shot type, lens characteristics, focus behavior.
4. **Lighting:** key light, fill light, practical lights.
5. **Palette:** color list, contrast level, mood associations.
6. **Rendering:** medium, detail level.

All of these fields are editable. You can adjust anything before recompiling.

**Negative Prompt:** a separate section with red labeling. Tag chips for exclusions (things you want the AI to avoid). Add, remove, reorder.

**Blend Section** (only visible with multi-source extractions): shows per-reference breakdown including type, weight, notes, classification results with confidence percentages, reasoning, aesthetic tags, and dominant color swatches.

**Character DNA Section** (only visible when a character is active): shows the character name, anchor traits (immutable), and flex traits (variable), all as editable chips.

### Generated Image

After generation, the image appears with hover controls: Zoom (opens a fullscreen lightbox), Download (PNG or JPG), Enhance (Bria Creative Upscale, available for images under 4MP), and Regenerate.

The model name displays in the top-left corner of the image card.

### Enhanced Image

If you run Bria upscale, the enhanced version appears below the original with a purple "Enhanced" label and the same hover controls.

## Right Panel: Prompts and Controls

### Compile Button

The purple full-width button that generates prompts from your IR. Four prompt formats are created:

- **Image JSON:** structured JSON for programmatic use
- **Description:** natural language prose
- **Creative Slots:** ordered paragraphs breaking down each visual slot
- **Compact:** concise format

Each prompt card is collapsible with copy and download buttons. **Download All Prompts** bundles everything into a single .txt file.

### Aspect Ratio Selector

A grid of 10 ratio buttons: 9:16, 2:3, 3:4, 4:5, 1:1, 5:4, 4:3, 3:2, 16:9, 21:9. Visual preview rectangles show the proportions.

The selector auto-detects the aspect ratio from your source image and filters options to show only ratios your current image model supports. A reset button restores the auto-detected ratio if you've overridden it.

### Normal / Lame Mode

**Normal** (purple when active): full creative prompts with all the expressive language and detail.

**Lame** (amber when active): sanitized, simplified prompts for models or APIs with stricter content policies.

### Image Model Dropdown

Grouped by provider. Models without a configured API key show "(no key)" and can't be selected.

### Generate Image Button

Disabled until you have an IR, compiled prompts, and a valid model selected. Shows "Generating..." with a spinner during processing.

### Upscale Controls

Visible after generating an image. Default model is Topaz CGI. Scale factor buttons: 2x, 3x, 4x (toggle). Face Enhancement checkbox (on by default). Requires a fal.ai API key.

### Export Panel

Visible when an IR exists. Copy All or Download .txt. A preview toggle shows the full export text before downloading. The export includes the generative description, all four prompt types, structured metadata, and full JSON.
