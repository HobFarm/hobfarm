---
title: "Stitched teal character into vintage horror comic"
status: "private-prototype"
summary: "A pale teal stitched character is compiled through vintage horror-comic rendering and a Gothic urban-street composition."
sourceDocument: "ir-female-figure-pale-teal-1778886800982.txt"
draft: true
export:
  irVersion: "5.1"
  extractionModel: "gemini-3.1-pro-preview"
  utilityModel: "@cf/meta/llama-4-scout-17b-16e-instruct"
  generatedAt: "5/15/2026, 4:13:20 PM"
  durationMs: 74006
  executionMode: "parallel"
references:
  - id: "stitched-teal-subject"
    role: "subject"
    label: "Pale teal stitched female character"
    weight: 1
    approvedForPublicDisplay: false
  - id: "vintage-horror-style"
    role: "style"
    label: "Vintage horror comic and pulp illustration"
    weight: 1
    approvedForPublicDisplay: false
  - id: "gothic-street-composition"
    role: "composition"
    label: "Gothic urban street"
    weight: 1
    approvedForPublicDisplay: false
agents:
  - { name: "subject", actualModel: "gemini-3.1-pro-preview", confidence: 0.95 }
  - { name: "style", actualModel: "gemini-3.1-pro-preview", confidence: 0.95 }
  - { name: "composition", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 0.9 }
  - { name: "color", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 1 }
  - { name: "lighting", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 0.9 }
  - { name: "texture", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 1 }
  - { name: "negative", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 0.8 }
compiled:
  styleAnchors:
    - "vintage horror comic"
    - "pulp illustration"
    - "mid-century comic art"
    - "macabre illustration"
    - "1950s sequential art"
  subject: "A female figure with pale teal skin and visible black stitched seams stands facing forward. She has dark purple hair styled in a high ponytail and striking green eyes. She wears a black lace corset top with purple ribbon lacing, a matching choker, and a black pleated mini skirt featuring purple bat appliques, a purple skull belt buckle, and layered purple ruffles."
  scene: "A Gothic-style building with pointed towers and arched doorways stands at the end of a cobblestone street. The building's facade is made of dark stone, and its architecture dominates the surrounding structures. People walk on the street, and a car is parked in front of the building."
  camera: "The camera captures a wide view of the scene at eye level, emphasizing the grandeur of the building and its central position in the frame."
  render: "Traditional pen and ink comic illustration with heavy black spotting, stark chiaroscuro, and fine hatching for texture."
  style: "vintage horror comic, pulp illustration, mid-century comic art, macabre"
  color: "The palette centered on black (#000000) and white (#FFFFFF) with gray tones (#F7F7F7). High contrast between the dark shadows and bright highlights creates a stark, monochromatic atmosphere."
  texture: "high-contrast halftone pattern, bold ink hatching, flat matte fills"
  lighting: "Soft cool diffuse light illuminates the subject from the front, with a low ambient fill creating a subtle gradient on the background."
  aspectRatio: "9:16"
diagnostics:
  subjectExtractionFailed: false
  notes:
    - "Role-aware extraction: subject, style, composition. Photorealistic paradigm. Fusion-routed."
  slotSources: []
findings:
  preserved:
    - "Pale teal skin"
    - "Black stitched seams"
    - "Dark purple high ponytail"
  inherited:
    - "Vintage horror-comic rendering from the style reference"
    - "Gothic urban street from the composition reference"
  transformed:
    - "The subject is translated into high-contrast pen-and-ink comic rendering."
---
