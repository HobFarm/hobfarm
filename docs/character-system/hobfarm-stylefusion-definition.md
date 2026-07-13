# HobFarm StyleFusion Definition

Purpose: define StyleFusion accurately across the HobFarm Workshop, website, documentation, and Codex workflows.

## Canonical definition

StyleFusion is a separate HobFarm reference-image application.

It accepts multiple images, assigns each image a role, extracts visual information through specialized agents, compiles the results into an Intermediate Representation, and produces a model-ready image-generation document.

StyleFusion is not the general name for:

- applying an aesthetic to a mannequin
- designing a character sheet
- creating wardrobe variants
- combining fashion trends manually
- making Alter Ego characters
- producing a Sheet, Hero, Poster, or product packet

Those activities may use a StyleFusion output later, but they belong to the Character / Mannequin, Workshop Notes, Before & After, Alter Ego, or production workflows.

## StyleFusion input model

A StyleFusion run begins with approved reference images.

Each reference receives a role such as:

```yaml
references:
  - role: subject
    image:
    weight:
    notes:

  - role: style
    image:
    weight:
    notes:

  - role: composition
    image:
    weight:
    notes:
```

Additional channels may inherit or combine information from those references:

- color
- lighting
- texture
- environment
- camera
- negative or exclusion guidance

The important operation is role-aware extraction. StyleFusion does not simply average images. It decides which reference controls which part of the compiled result.

## Extraction agents

A complete run may use agents for:

- subject
- style
- composition
- color
- lighting
- texture
- exclusion guidance

The export records:

- requested extraction model
- utility model
- actual model used by each agent
- confidence by agent
- execution mode
- total duration
- source reference for each compiled slot
- weight and inheritance behavior

This diagnostic data is part of the application’s value. It makes the fusion inspectable.

## Intermediate Representation

The IR is the internal source of truth for a StyleFusion run.

Typical sections include:

```yaml
intermediate_representation:
  version:
  id:
  style_anchors:
  subjects:
  visual_dna:
  environment:
  composition:
  camera:
  lighting:
  palette:
  rendering:
  style:
  details:
  blend:
  character_dna:
  compiled_slots:
  meta:
  modifiers:
  agent_extraction:
  slot_meta:
```

The IR records what was extracted, where it came from, how strongly it was applied, and how the parts were compiled.

## Image-generation document

StyleFusion also produces a simpler generation-facing JSON document.

Typical sections include:

```yaml
image_generation:
  subject:
  wardrobe:
  props:
  composition:
  scene:
  camera:
  lighting:
  color:
  style:
  texture:
  exclusion_guidance:
  aspect_ratio:
```

This document is meant to be passed into an image-generation workflow or translated through a model adapter.

It is not a character Sheet specification unless the user deliberately creates a later Sheet task from it.

## Complete export

A Complete Export contains:

1. generation timestamp
2. IR version
3. extraction model
4. style anchors
5. image-generation JSON
6. Intermediate Representation
7. blend sources and role assignments
8. compiled prompt slots
9. character or subject DNA when available
10. model-routing and confidence diagnostics

This exported document is a StyleFusion artifact.

A generated image, character Sheet, Hero, Poster, reel, or product packet is a downstream asset.

## Workshop taxonomy

### Character / Mannequin

Use for:

- mannequin bases
- character DNA
- wardrobe systems
- aesthetic application
- aesthetic mutation
- species variants
- Sheets
- Heroes
- Posters
- product-ready character assets

### StyleFusion

Use for:

- the StyleFusion application
- reference-image role assignment
- multi-agent extraction
- IR inspection
- generated JSON and prompt documents
- source weighting
- model routing
- confidence and failure diagnosis
- StyleFusion case studies
- downstream results created from a StyleFusion export

### Workshop Notes

Use for:

- aesthetic research
- design theory
- tool observations
- process notes
- model behavior
- experimental ideas that are not yet formal StyleFusion studies

### Before & After

Use for visible repair and transformation studies.

### Alter Ego

Use for two distinct forms connected by shared identity.

### Cute & Corrupted

Use for the original and corrupted-form system.

## Relationship to aesthetic mutation

Aesthetic mutation is a manual or directed design process:

```text
research
→ cherry-pick visual grammar
→ combine selected traits
→ replace generic defaults
→ create a new HobFarm design
```

StyleFusion is a reference-image compiler:

```text
reference images
→ role assignment
→ agent extraction
→ IR
→ compiled generation document
→ downstream generation
```

They can work together.

Example:

```text
Aesthetic research defines the design question.
StyleFusion compiles approved references.
Character / Mannequin workflow develops the resulting subject.
Production workflow creates the Sheet, Hero, Poster, and video.
Workshop documents the complete experiment.
```

The page and metadata should keep these stages visibly separate.

## Website page purpose

Route:

```text
/workshop/stylefusion/
```

This route should explain and demonstrate the StyleFusion application.

It should not become a general gallery of character-sheet work.

Recommended page flow:

1. Hero: what StyleFusion is
2. Input reference roles
3. Extraction-agent pipeline
4. IR and compiled document
5. One complete case study
6. Model-ready output
7. Generated result and downstream assets
8. Failure diagnosis
9. Additional StyleFusion studies
10. App, documentation, or Workshop CTA

## Page components

### ReferenceRoleDeck

Displays approved reference images with:

- role
- weight
- notes
- extracted contribution

### FusionPipeline

Shows:

```text
references
→ agents
→ IR
→ compiled slots
→ generation JSON
→ downstream result
```

### IRInspector

Shows a curated, readable view of:

- style anchors
- visual DNA
- source roles
- modifiers
- confidence
- compiled slots

Keep the full export available as a download or expandable raw document.

### AgentConfidencePanel

Displays:

- agent
- actual model
- confidence
- source role
- duration or execution note

### CompiledDocumentViewer

Separates:

- image-generation JSON
- Intermediate Representation
- compiled natural-language slots

### StyleFusionCaseStudy

Shows:

- reference roles
- extraction summary
- final style anchors
- compiled scene
- output image
- downstream use
- findings
- failure or replacement note

### DownstreamAssetRail

May link to a character, Sheet, Hero, Poster, video, or product created later from the export.

Label it clearly as downstream production.

## Suitable initial case studies

The supplied exports provide several real examples.

### Tuxedo cat fusion

Roles:

- subject: blue-eyed black-and-white tuxedo cat in engraved dark-fantasy imagery
- style: Art Nouveau stained-glass gothic fantasy
- composition: floating-island watercolor landscape

The compiled result preserves the cat identity while assigning scene and camera to the composition reference and rendering, color, and texture to the style reference.

### Stitched teal character fusion

Roles:

- subject: pale teal stitched female character
- style: vintage horror comic and pulp illustration
- composition: Gothic urban street

The generated document translates the character into a high-contrast pen-and-ink comic system.

### Industrial elf fusion

Roles:

- subject: grey-skinned elf-like female
- style and environment: industrial cyberpunk, neo-noir anime, dark fantasy

The export compiles subject identity, industrial scene, emissive lighting, palette, material treatment, and manga-influenced rendering.

### Failed subject extraction

One IR 5.0 export records `subject_extraction_failed: true` and a subject confidence of zero.

Use this later as a failure-diagnosis case study. It demonstrates why the application exposes agent confidence, source routing, and slot metadata.

Do not use it as the primary hero example.

## Content schema

```yaml
stylefusion_study:
  id:
  title:
  slug:
  status:
  summary:

  export:
    ir_version:
    extraction_model:
    utility_model:
    generated_at:
    duration_ms:
    execution_mode:

  references:
    - id:
      role:
      image:
      weight:
      notes:
      approved_for_public_display:

  extraction:
    agents:
      - name:
        actual_model:
        confidence:
    style_anchors:
    visual_atoms:
    character_dna:
    subject_extraction_failed:

  compiled:
    subject:
    scene:
    camera:
    render:
    style:
    color:
    texture:
    lighting:
    aspect_ratio:
    complete_export_download:

  results:
    generated_images:
    related_characters:
    related_sheets:
    related_heroes:
    related_posters:
    related_videos:
    related_products:

  findings:
    preserved:
    inherited:
    transformed:
    failure:
    replacement:
    reusable_rule:
```

## Naming rules

Use `StyleFusion` only for:

- the application
- its reference-image workflow
- its exports
- studies produced through that workflow

Use `Visual system map`, `character variation map`, `aesthetic influence map`, or `design-source map` for manual diagrams that are not StyleFusion runs.

Use `Character / Mannequin` for character and wardrobe development.

Use `Aesthetic mutation` for cherry-picked or manually combined aesthetic systems.

## Positive replacement rules

- Replace a generic StyleFusion label with the exact application stage being shown.
- Replace a character comparison labeled as StyleFusion with `visual system comparison`.
- Replace a character Sheet presentation labeled as StyleFusion with `Character / Mannequin study`.
- Present the Complete Export as a document generated by the application.
- Present Sheets, Heroes, Posters, and videos as downstream assets.
- Keep approved reference images, extracted data, and generated results visibly distinguished.
- Keep source roles and inheritance readable.
- Show failures through confidence, routing, and replacement data.
