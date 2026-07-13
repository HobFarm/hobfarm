---
title: "Industrial elf into neo-noir cyberpunk"
status: "private-prototype"
summary: "An elf-like subject keeps its identity anchors while the style reference supplies an industrial cyberpunk environment, neo-noir anime rendering, and emissive lighting."
sourceDocument: "ir-primary-subject-elf-like-female-1778851549214.txt"
draft: true
export:
  irVersion: "5.1"
  extractionModel: "gpt-5.5"
  utilityModel: "@cf/meta/llama-4-scout-17b-16e-instruct"
  generatedAt: "5/15/2026, 6:25:49 AM"
  durationMs: 175396
  executionMode: "parallel"
references:
  - id: "industrial-elf-subject"
    role: "subject"
    label: "Grey-skinned elf-like female with neon green eyes and red-grey tattoos"
    weight: 1
    approvedForPublicDisplay: false
  - id: "industrial-neo-noir-style"
    role: "style"
    label: "Industrial cyberpunk, neo-noir anime, and dark fantasy"
    weight: 1
    notes: "Style reference also supplies the industrial environment."
    approvedForPublicDisplay: false
agents:
  - { name: "subject", actualModel: "gpt-5.5", confidence: 0.93 }
  - { name: "style", actualModel: "gpt-5.5", confidence: 0.87 }
  - { name: "composition", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 0.86 }
  - { name: "color", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 0.86 }
  - { name: "lighting", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 0.86 }
  - { name: "texture", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 0.86 }
  - { name: "negative", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 0.9 }
compiled:
  styleAnchors:
    - "neo-noir anime"
    - "industrial cyberpunk"
    - "dark fantasy illustration"
    - "manga-influenced digital painting"
    - "cinematic concept art"
  subject: "Neon green eyes define an elf-like female standing on a grated metal catwalk, looking toward the viewer with a stern expression. She has cool grey skin, long pointed ears, glossy black hair in a high ponytail, and red-grey tattoos across her arms and torso. A black glossy cutout bodysuit fits closely over her frame."
  scene: "A dark industrial landscape with a cloudy sky at dusk, featuring multiple levels of catwalks and smokestacks emitting smoke and flames."
  camera: "Medium shot at eye level, focused on the subject in front of an industrial backdrop with soft focus on the background."
  render: "Digital anime illustration with crisp inked contours, airbrushed shading, atmospheric matte-painting depth, and red glow post-processing."
  style: "neo-noir anime, industrial cyberpunk, dark fantasy, manga-influenced digital painting, cinematic concept art"
  color: "Palette centered on deep indigo (#1A1D23) and warm rust (#FFC080) with neon yellow (#FFFF00) highlights and vibrant red (#FF3737) patterns. High contrast between dark industrial background and luminous neon accents creates a dark, edgy atmosphere."
  texture: "smooth airbrush gradients, soft cel-shaded planes, metal grating texture, glossy dress sheen"
  lighting: "Warm orange-red industrial glow from behind and to the sides illuminates the subject, casting soft shadows. Hazy smoke and steam in the background add to the atmosphere."
  aspectRatio: "2:3"
diagnostics:
  subjectExtractionFailed: false
  notes:
    - "Role-aware extraction: subject, style. Illustration paradigm. Fusion-routed."
    - "Composition weight is zero and inherits from the subject in the export modifiers."
  slotSources: []
findings:
  preserved:
    - "Long pointed elf ears"
    - "Cool grey skin"
    - "Neon green eyes"
    - "Red-grey tattoos"
  inherited:
    - "Industrial environment, render, color, and material treatment from the style reference"
  transformed:
    - "The subject is staged on a metal catwalk inside a smoky neo-noir industrial scene."
---
