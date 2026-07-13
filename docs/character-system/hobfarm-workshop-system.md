# HobFarm Workshop Development System

Purpose: turn aesthetic research, character experiments, production decisions, and failure repair into useful Workshop content, product assets, and Academy lessons.

## Workshop lanes

### Aesthetic Lab

Break an aesthetic into visual grammar that can be used for character design, wardrobe, scenes, and style profiles.

### Character Factory

Turn visual grammar into mannequins, wardrobe bases, outfit adoptables, character adoptables, species variants, and exclusives.

### Pose and Camera Lab

Develop theatrical pose cards, lens pairings, stage orientation, depth plans, and video motion.

### StyleFusion

StyleFusion is a separate reference-image application. It assigns approved images to roles, extracts visual information through specialized agents, compiles an Intermediate Representation, and exports a model-ready image-generation document with routing and confidence diagnostics.

### Alter Ego

Create two complete forms linked by shared identity or symbolism and separated by palette, wardrobe, silhouette, pose language, and world.

### Before & After

Show a baseline result, diagnose the visible default, apply specific replacements, and extract a reusable rule.

### Workflow Notes

Document tools, prompts, model behavior, file structure, production sequencing, quality checks, and marketplace preparation.

### Academy

Convert proven Workshop studies into guided lessons, exercises, and validation systems.

## Workshop loop

1. Discover a visual source, problem, or production need.
2. Verify current or historical facts when the topic depends on trend, platform, brand, model, or software behavior.
3. Extract the visual or technical grammar.
4. Choose one controlled experiment.
5. Build a small test matrix.
6. Produce the relevant assets.
7. Compare results against the brief.
8. Diagnose defaults and replace them with visible decisions.
9. Document the transferable method.
10. Convert strong results into product assets, site content, and Academy material.

## Aesthetic grammar schema

```yaml
aesthetic_study:
  name:
  date_range:
  cultural_context:
  current_or_historical_status:
  visual_claim:
  palette:
  silhouette:
  garments:
  construction_details:
  materials:
  hair:
  makeup:
  accessories:
  motifs:
  emotional_temperature:
  pose_language:
  environment_language:
  adaptable_features:
  context_sensitive_features:
  generic_defaults:
  replacement_choices:
  compatible_character_lanes:
  compatible_stylefusions:
  source_notes:
```

Separate visual evidence from stereotype. Use garments, materials, makeup, shape, staging, and social context as distinct fields.

## Controlled experiment packet

Each Workshop experiment should define:

```yaml
experiment:
  id:
  title:
  question:
  input:
  fixed_variables:
  changed_variables:
  target_model:
  output_mode:
  style_profile:
  character_or_mannequin:
  pose_card:
  success_criteria:
  outputs:
  findings:
  next_test:
```

Change one or two major variables at a time. Keep the remaining canon stable so the result teaches something.

## Content packet

A publishable Workshop study can include:

- Hero or comparison image
- Short claim
- Source aesthetic or production problem
- Visual grammar
- Character or wardrobe test
- Pose and camera choice
- Model-specific prompt notes
- Before and After comparison
- Replacement diagnosis
- Final reusable rule
- Related asset or download
- Academy lesson path

## Before & After method

Use five stages:

1. Baseline
2. Observation
3. Diagnosis
4. Replacement
5. Transferable rule

Example:

```yaml
before_after:
  baseline: generic pink gothic character
  observation: silhouette, face, and garment construction blend into a common anime default
  diagnosis: the prompt names a mood but leaves the design decisions open
  replacements:
    - two-color palette with one hardware accent
    - defined hime-cut silhouette
    - exact collar, sleeve, skirt, stocking, and platform construction
    - asymmetrical garter and liquid makeup placement
    - theatrical pose card with a directed gaze
  rule: replace aesthetic labels with visible garment, face, silhouette, material, and staging decisions
```

## StyleFusion method

Begin with approved references and give each image an explicit role. The application runs specialized agents, records the model and confidence for each extraction, compiles the IR, and produces generation-facing JSON plus natural-language prompt slots.

```yaml
stylefusion:
  references:
    - role: subject
      image:
      weight:
    - role: style
      image:
      weight:
    - role: composition
      image:
      weight:
  extraction_agents:
    - subject
    - style
    - composition
    - color
    - lighting
    - texture
    - exclusion_guidance
  intermediate_representation:
  compiled_slots:
  image_generation_json:
  diagnostic_export:
```

The Complete Export is the StyleFusion artifact. Generated images and later Character / Mannequin work, Sheets, Heroes, Posters, videos, and products remain downstream production assets.

## Alter Ego study

Compile:

```yaml
alter_ego:
  shared_identity:
  shared_face_or_family_logic:
  shared_motif:
  symbolic_relationship:
  form_a:
    palette:
    wardrobe:
    silhouette:
    liquid_signature:
    pose_language:
    environment:
  form_b:
    palette:
    wardrobe:
    silhouette:
    liquid_signature:
    pose_language:
    environment:
  pair_poster_concept:
  transition_concept:
```

Each form should work as a complete character or product. The pair should communicate a relationship at thumbnail size.

## Workshop to Academy conversion

A Workshop study becomes a course module after the method works across more than one subject or model.

Course module schema:

```yaml
academy_module:
  title:
  skill:
  learner_output:
  prerequisites:
  inputs:
  core_concept:
  demonstration:
  guided_exercise:
  independent exercise:
  validation_checklist:
  common_default:
  replacement method:
  downloadable_template:
  next_module:
```

A useful lesson produces a visible artifact: style profile, character DNA, turnaround, pose card, Hero prompt, comparison sheet, model adapter, or product packet.

## Recommended Academy sequence

1. Read an aesthetic
2. Build a visual grammar
3. Define a character DNA
4. Create a reusable mannequin
5. Design wardrobe with construction logic
6. Use theatrical poses
7. Stage with lens and depth
8. Preserve canon across outputs
9. Run an approved StyleFusion reference study
10. Design Alter Ego pairs
11. Repair generic outputs with replacement method
12. Translate one style across models
13. Package the result for site and marketplace use

## Productivity rules

- Use the smallest source set that can answer the task.
- Reuse established canon, IDs, and schemas.
- Return pasteable artifacts rather than repeating theory.
- Keep research, design, generation, and publishing as separate stages.
- Record successful prompts and model adapters after a result proves useful.
- Turn repeated decisions into a source file or template.
- Turn repeated failures into a replacement rule.
- Keep each Workshop post centered on one teachable claim.
