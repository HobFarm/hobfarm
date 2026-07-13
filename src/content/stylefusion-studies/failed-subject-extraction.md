---
title: "Failed subject extraction diagnostic"
status: "private-prototype"
summary: "An IR 5.0 run recorded a zero-confidence subject extraction while the style, composition, color, lighting, texture, and negative agents still returned data."
sourceDocument: "ir-visual-subject-1778885946326.txt"
draft: true
export:
  irVersion: "5.0"
  extractionModel: "gemini-3.1-pro-preview"
  utilityModel: "@cf/meta/llama-4-scout-17b-16e-instruct"
  generatedAt: "5/15/2026, 3:59:06 PM"
  durationMs: 102335
  executionMode: "parallel"
references:
  - id: "failed-subject-reference"
    role: "subject"
    label: "Subject reference withheld"
    weight: 1
    approvedForPublicDisplay: false
  - id: "failed-composition-reference"
    role: "composition"
    label: "Composition reference withheld"
    weight: 1
    approvedForPublicDisplay: false
  - id: "failed-style-reference"
    role: "style"
    label: "Style reference withheld"
    weight: 1
    approvedForPublicDisplay: false
agents:
  - { name: "subject", actualModel: "gemini-3.1-pro-preview", confidence: 0 }
  - { name: "style", actualModel: "gemini-3.1-pro-preview", confidence: 0.95 }
  - { name: "composition", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 0.85 }
  - { name: "color", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 0.9 }
  - { name: "lighting", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 0.85 }
  - { name: "texture", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 0.9 }
  - { name: "negative", actualModel: "@cf/meta/llama-4-scout-17b-16e-instruct", confidence: 0.8 }
compiled:
  styleAnchors:
    - "Art Nouveau"
    - "stained glass aesthetic"
    - "decorative illustration"
    - "symmetrical ornamentation"
    - "vector art style"
  scene: "A castle sits atop a rocky outcrop, with a mountain range in the distance. The scene is framed by a black border, with a large stylized letter in the top half and a numbered label in the top-left corner."
  camera: "Medium shot with a standard focal length, capturing the castle and the rocky outcrop in sharp focus, with a deep depth of field that keeps the distant mountains and sky softly focused."
  render: "Digital illustration with crisp black contour lines, flat color fields, and soft airbrushed gradients within a highly structured ornamental framework."
  style: "Art Nouveau, decorative illustration, stained glass aesthetic, symmetrical ornamentation, vector art style"
  color: "Palette centered on rich brown (#964B00) and deep indigo (#212121), with soft purple (#7A288A) and golden yellow (#F8E231) highlights. High contrast between dark and light areas creates a dreamy, mystical atmosphere."
  texture: "smooth airbrush gradients, hard vector linework, flat matte fills"
  lighting: "Soft, cool daylight illuminates the scene, casting subtle shadows on the castle and landscape."
  aspectRatio: "2:3"
diagnostics:
  subjectExtractionFailed: true
  notes:
    - "No subject compiled slot was produced."
    - "Character DNA anchors and flex fields are empty."
    - "Scene and camera still exist, but both carry subject source, weight 0, and confidence 0.85 in slot metadata."
  slotSources:
    - { slot: "negative", sourceReference: "subject", weight: 1, confidence: 0.8 }
    - { slot: "scene", sourceReference: "subject", weight: 0, confidence: 0.85 }
    - { slot: "camera", sourceReference: "subject", weight: 0, confidence: 0.85 }
    - { slot: "render", sourceReference: "style", weight: 1, confidence: 0.95 }
    - { slot: "style", sourceReference: "style", weight: 1, confidence: 0.95 }
    - { slot: "color", sourceReference: "style", weight: 1, inheritance: "style", confidence: 0.9 }
    - { slot: "texture", sourceReference: "style", weight: 1, inheritance: "style", confidence: 0.9 }
    - { slot: "lighting", sourceReference: "subject", weight: 0.3, inheritance: "subject", confidence: 0.85 }
findings:
  failure:
    - "The subject agent returned confidence 0 and the export set subject_extraction_failed to true."
    - "Later agents still compiled style, composition, color, lighting, texture, and exclusion data."
  nextTest:
    - "Validate the subject input and rerun subject extraction before sending the document to generation."
    - "If subject confidence remains zero, test a different subject-agent route while holding the approved references and weights constant."
  reusableRule: "A complete-looking document is not a valid subject study when the subject slot is absent. Confidence and slot-source metadata must gate downstream use."
---
