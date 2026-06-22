---
title: "StyleFusion Prompt Compilation"
description: "How StyleFusion queries the Grimoire, assembles visual atoms, and compiles the final prompt sent to AI providers."
category: "guides"
order: 1
tags: ["stylefusion", "prompts", "pipeline", "compilation"]
difficulty: "intermediate"
project: "stylefusion"
---

Prompt compilation is where the Grimoire's knowledge turns into actual instructions for AI image models. It's the bridge between "here's what I see in this reference" and "here's what I want the output to look like." This guide walks through the full pipeline.

## The Pipeline at a Glance

StyleFusion's prompt compilation runs through five stages:

1. **Ingest:** source image uploaded, basic validation
2. **Extract:** visual DNA pulled from the image (atoms identified)
3. **Query:** Grimoire consulted for atom relationships and creative directions
4. **Compile:** atoms assembled into a structured prompt
5. **Dispatch:** compiled prompt sent to one or more AI providers

Each stage feeds the next. The output of Extract becomes the input to Query, and so on.

## Stage 1: Ingest

The source image arrives at the pipeline entry point. Basic checks happen here: file format validation, resolution limits, content safety screening. If the image passes, it moves to extraction.

## Stage 2: Extract

This is where the visual DNA analysis happens. The extraction system runs multiple parallel analyzers:

- **Palette extractor:** identifies dominant and accent colors, maps them to the Grimoire's color atom vocabulary
- **Face geometry analyzer:** if faces are present, extracts proportional measurements, expression markers, and identity anchors
- **Texture profiler:** characterizes surface quality, noise patterns, and edge characteristics
- **Lighting mapper:** determines light direction, quality, contrast ratio, and color temperature
- **Composition scanner:** identifies focal points, spatial weight distribution, and framing patterns

Each analyzer outputs a list of candidate atoms with confidence scores. A source image might yield 15-30 atoms across all families.

## Stage 3: Query

The extracted atoms get sent to the Grimoire as a query. This is where the knowledge graph earns its keep.

The Grimoire does three things with the atom set:

**Reinforcement:** finds atoms in the graph that have strong positive connections to the extracted set. If the image has "desaturated teal" and "geometric composition," the graph might suggest "Art Deco" as a reinforcing style atom that wasn't explicitly detected but fits the pattern.

**Conflict resolution:** identifies atoms that pull against each other and decides which wins based on confidence scores and the user's intent signal. If the image has both "painterly texture" (confidence: 0.8) and "vector clean" (confidence: 0.3), painterly wins.

**Gap filling:** looks for missing atom families. If the extraction found strong color and texture atoms but weak lighting atoms, the Grimoire suggests lighting atoms that historically pair well with the detected set.

## Stage 4: Compile

Now the curated atom set gets turned into an actual prompt string. Compilation is model-aware: different AI providers expect different prompt structures.

The compiler:

- Orders atoms by weight (primary drivers first, modifiers after)
- Applies model-specific syntax (some models use weighted tokens, others prefer natural language)
- Injects negative prompts (what to avoid, derived from conflict resolution)
- Adds identity lock parameters if face geometry was detected
- Formats the final prompt according to the target model's expected input

A single source image can produce multiple compiled prompts if you're targeting multiple models simultaneously.

## Stage 5: Dispatch

The compiled prompt(s) go to the selected AI providers. StyleFusion manages the provider routing: which models are available, current queue depth, cost optimization, and retry logic.

Results come back, get post-processed (upscaling, format conversion if needed), and land in your generation queue.

## What You Control

At each stage, you have intervention points:

- **After Extract:** review detected atoms, add or remove before compilation
- **After Query:** adjust which Grimoire suggestions to accept
- **After Compile:** edit the compiled prompt directly before dispatch
- **Model selection:** choose which providers to target

The default flow is fully automatic, but power users can intervene at any stage. The Grimoire chatbot can help you understand what was detected and suggest adjustments.

## Further Reading

- [Understanding Visual Atoms](/grimoire/understanding-visual-atoms) for the fundamentals
- [Face Geometry and Identity Lock](/grimoire/face-geometry-identity-lock) for the face analysis system
- [Color Palette Recipes](/grimoire/color-palette-recipes) for practical palette combinations
