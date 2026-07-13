# HobFarm Visual Style System

Purpose: preserve a recognizable HobFarm visual language across different art styles, models, renderers, and production modes.

This file controls the portable house style. Dedicated profile files control the exact look. `hobfarm-doll-style.md` is the first profile in the system.

## Portable house invariants

Every HobFarm style profile should preserve these traits in its own medium.

### Designed silhouette

The outer contour carries the first read. Hair, headwear, shoulders, sleeves, waist, legs, footwear, species traits, and props form one intentional shape.

### Expressive identity

The face has a defined key: eye shape, gaze, brow angle, mouth, makeup geometry, identifier, and asymmetry. The style may use doll, graphic, painterly, realistic, lowbrow, pulp, editorial, or cartoon proportions, but the identity stays specific.

### Controlled palette

Use a limited palette with a clear dominant, support, neutral, and accent relationship. Separate nearby characters through temperature, value, and accent placement.

### Material hierarchy

Each material behaves according to its surface. Matte cloth absorbs light. Metal gives crisp reflections. Vinyl and latex carry controlled highlights. Fur breaks the contour. Lace and mesh reveal structure. Liquid beads, stretches, hangs, and follows gravity.

### Deliberate irregularity

Use one memorable asymmetry, damage pattern, marking, accessory imbalance, garment mismatch, facial identifier, or liquid placement. The irregularity should support the character hook.

### Motif discipline

Choose one primary motif and one support motif. Place them where they affect silhouette, face, garment construction, hardware, prop design, or scene architecture.

### Theatrical presentation

Hero, Poster, Wallpaper, and Video assets use a readable dramatic objective, shaped body line, purposeful hands, directed gaze, lens-aware perspective, depth planes, and a final held image.

### Product and story clarity

The image should reveal what is being sold or communicated: mannequin, outfit, character, exclusive, transformation, world, story beat, or lesson.

## Style profile schema

Define each reusable style with this structure:

```yaml
style_profile:
  id:
  name:
  purpose:
  visual_lineage:
  shape_language:
  face_logic:
  proportion_logic:
  line_and_edge:
  color_behavior:
  surface_and_render:
  lighting:
  detail_hierarchy:
  signature_features:
  pose_language:
  environment_language:
  text_and_graphic_treatment:
  continuity_locks:
  model_translation_notes:
```

A style profile describes repeatable visual decisions. A character brief supplies the identity, wardrobe, species, palette, motif, and attitude.

## Active profile resolution

Use this order:

1. Explicit style named by the user
2. Style established by reference canon
3. Style profile established earlier in the thread
4. Best-fit HobFarm profile for the stated purpose
5. A new provisional profile compiled from the brief

When a provisional profile produces a strong repeatable result, formalize it as a source file.

## HobFarm Doll profile

When `HF-DOLL` is active, read `hobfarm-doll-style.md` and apply its face, proportion, line, rendering, and liquid signature rules.

The Doll profile works well for:

- Mannequins
- Wardrobe references
- Cute and spooky characters
- J-fashion and subculture designs
- Adoptables
- Alter Ego pairs
- Character sheets
- Fashion-forward Heroes

Other profiles may use different faces, proportions, edges, and rendering while retaining the portable house invariants.

## Model adapter protocol

A model adapter translates the active profile into the target model’s preferred descriptive language.

Compile:

```yaml
model_adapter:
  model:
  model_version:
  task:
  active_style_profile:
  preserved_invariants:
  model_strengths:
  prompt_order:
  composition_language:
  material_language:
  identity_language:
  pose_language:
  continuity_strategy:
  output_settings:
  result_notes:
```

Use the same design canon across adapters. Let phrasing, prompt order, level of literal detail, and rendering vocabulary change by model.

### Prompt stack

Build model prompts in this order when the model benefits from structured prose:

1. Output and aspect ratio
2. Subject identity
3. Active style profile
4. Silhouette and proportions
5. Face key and expression
6. Wardrobe and materials
7. Species traits, motif, prop, and liquid signature
8. Dramatic objective and pose
9. Lens, camera angle, and depth
10. Environment and lighting
11. Continuity and crop requirements

For models that respond better to natural prose, convert the same stack into one coherent visual description.

## Positive constraint language

Describe the intended result directly.

Use:

- Hold the face design and stylization consistently across views.
- Keep the figure fully visible with complete hands and footwear.
- Use a clean image-only layout.
- Limit the palette to black, muted pink, pearl white, and one silver accent.
- Give the scene one dominant light shape and one environmental story cue.
- Render the front, back, and three-quarter views as the same resolved garment.
- Keep decorative detail concentrated at the face, neckline, cuffs, and footwear.
- Use a large quiet area for title placement.

When an output drifts, name the observed default and replace it with a visible design decision.

## Style development workflow

1. Collect references or a written aesthetic brief.
2. Extract shape, face, proportion, color, material, edge, lighting, and staging rules.
3. Separate house invariants from profile-specific traits.
4. Test one character in Single mode.
5. Test the same character in Sheet and Hero modes.
6. Compare identity retention across models.
7. Record successful adapter language.
8. Formalize the profile after it survives multiple subjects and outputs.

## Style QC

A successful style translation preserves:

- The same character identity
- The profile’s shape and proportion logic
- The house silhouette and palette discipline
- Material-native rendering
- Deliberate asymmetry and motif placement
- Pose readability
- Product or story clarity
- A result that feels authored rather than generic
