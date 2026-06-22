---
title: "Getting Started with StyleFusion"
description: "First-time setup and your first generation in under five minutes."
project: "stylefusion"
section: "getting-started"
order: 1
publishedAt: 2026-03-13
---

## What You Need

StyleFusion runs in your browser. To start generating, you need API keys from at least two providers:

1. **One extraction provider** (for analyzing your reference images): Gemini, OpenAI, or Grok
2. **One image generation provider** (for creating output): Gemini, OpenAI, fal.ai, Grok, BFL, or Z.AI

If you're not sure which to pick, Gemini handles both extraction and generation, so a single Gemini key gets you started.

## Setting Up API Keys

Click the **Settings gear** in the top navbar. You'll see input fields for each provider. Paste your API key into the relevant field.

A few things to know about keys:

- Keys are stored in your browser's memory only. They're never sent to HobFarm's servers.
- A green dot appears next to each provider in the navbar when a key is set.
- Click **Test Connection** to validate all your configured keys at once.

While you're in Settings, choose your **default extraction model** from the dropdown. This is the AI model that will analyze your reference images. You can always change it later.

## Your First Generation

Once your keys are set, the Workspace page is where everything happens. It's a three-column layout: references on the left, the extracted representation in the center, and prompts plus controls on the right.

**Step 1: Upload a reference image.** Drag and drop an image onto the left panel, click to browse your files, or paste from your clipboard. StyleFusion accepts PNG, JPEG, and WebP files. One image is enough to start.

**Step 2: Hit Fuse.** The purple Fuse button triggers extraction. You'll see a spinner with stage names as the AI analyzes your image: classifying, extracting, analyzing. This typically takes 10 to 30 seconds depending on the model.

**Step 3: Review the IR.** The center panel now shows your Intermediate Representation: a structured breakdown of everything the AI detected in your image. Colors, textures, lighting, composition, subject details. You don't need to edit anything right now; just look it over.

**Step 4: Compile prompts.** Click the purple **Compile** button on the right panel. StyleFusion generates four different prompt formats from your IR. This happens automatically when the IR changes, but you can trigger it manually too.

**Step 5: Choose your settings.** Pick an aspect ratio (10 options from 9:16 portrait to 21:9 ultrawide) and select an image generation model from the dropdown.

**Step 6: Generate.** Hit the purple **Generate Image** button. Wait for the result to appear in the center panel below the IR viewer.

That's it. You've gone from a reference image to a generated output. From here, you can refine the IR, try different styles, swap models, or start exploring multi-image blending.

## What's Next

- [The Workspace](/helpcenter/the-workspace) breaks down every panel and control
- [Working with References](/helpcenter/working-with-references) covers multi-image blending and reference types
- [Characters](/helpcenter/characters) explains how to maintain consistent identity across generations
