---
# TODO: replace folder when new R2 media is uploaded at gallery/model-lab/grok-vs-flux-cartoon-test/
title: "Grok vs Flux: Cartoon Field Test"
type: "model-lab"
summary: "Same illustration brief through Grok Imagine 1.5 and Flux 2 Max. Each engine breaks the spec in a different direction. Notes on where each holds and where each fails."
date: 2026-04-20
featured: true
draft: false
methods:
  - "Field Test"
  - "Cross-Engine"
tags:
  - "field test"
  - "illustration"
  - "model field test"
folder: "gallery/goth-anime-line-art"
hero:
  type: "image"
  file: "grok-imagine-1.5.png"
  alt: "Grok Imagine cartoon render"
thumb:
  file: "grok-imagine-1.5.png"
  alt: "Cartoon field test thumbnail"
media:
  - type: "image"
    file: "flux2max.jpg"
    alt: "Flux 2 Max render"
    role: "variant"
    provider: "flux"
  - type: "image"
    file: "qwen-image-2512.png"
    alt: "Qwen Image reference"
    role: "reference"
  - type: "image"
    file: "gpt-image-1.5.png"
    alt: "GPT Image baseline"
    role: "reference"
comparison:
  mode: "image"
  testedModels:
    - "Grok Imagine 1.5"
    - "Flux 2 Max"
    - "Qwen Image 2.5"
    - "GPT Image 1.5"
  promptSummary: "Stylized monochrome character, neon magenta accent glow, manga line-art register."
  findings:
    - "Grok holds the line-art register cleanest"
    - "Flux 2 Max pushes photoreal even with illustration anchor"
    - "Qwen and GPT split between manga and Western cartoon"
  failureModes:
    - "Flux 2 Max loses the line-art register entirely"
    - "GPT softens accent glow into ambient color"
  bestFor:
    - "Grok: line-art and manga briefs"
    - "Flux 2 Max: photoreal hybrids and surfaces"
    - "Qwen: stylized illustration with detail"
lessons:
  - label: "Anchor the register, not the look"
    kind: "win"
    text: "Engines respect 'line-art register' more reliably than 'manga style'. Naming the technical register beats naming the aesthetic."
  - label: "Photoreal models will resist illustration"
    kind: "fail"
    text: "Flux 2 Max kept the composition but defaulted to photoreal rendering even with explicit illustration anchors. Don't fight it; use it where the photoreal pull helps."
  - label: "Accent glow needs explicit color names"
    kind: "lesson"
    text: "Neon magenta survives across engines when named by hex or HSL. 'Accent glow' alone gets washed into ambient warmth by softer engines."
---

Field tests surface useful comparisons, not provider dumps. Each entry picks a specific brief, shows the renders side by side, and writes down what each engine got right and where it broke.
