# HobFarm StyleFusion Definition

Purpose: keep HobFarm's public description, Workshop taxonomy, and implementation references aligned with the current StyleFusion application.

The StyleFusion application repository is the technical source of truth. This document records the public-facing contract used by the HobFarm website.

## Canonical definition

StyleFusion is a separate working HobFarm reference-image application.

It accepts one to six images, gives each reference a simple Subject, Style, or Composition job, builds a modular `StyleFusionPack`, assembles those modules, and translates the pack into positive prose for image generation.

The pack is the canonical visual record. The selected image model is downstream and replaceable.

StyleFusion is not the general name for:

- applying an aesthetic to a mannequin
- designing a character sheet
- creating wardrobe variants
- manually combining visual influences
- making Alter Ego characters
- producing a Sheet, Hero, Poster, reel, or product packet

Those activities may use a StyleFusion result, but they remain Character / Mannequin, Workshop Notes, Before & After, Alter Ego, or production work.

## Current application flow

```text
references + contribution assignments
→ modular pack builder
→ modules + assembly
→ fusion-model prose translation
→ generation provider
→ asset + pack generation history
```

The public workflow is:

1. Add one to six reference images.
2. Assign Subject, Style, or Composition roles. A reference may combine roles.
3. Build the pack.
4. Inspect or edit the assembled positive prompt.
5. Choose an image model.
6. Generate the picture.
7. Download the project as a `.stylefusion.zip` pack when useful.

## Reference roles

### Subject

The person, character, creature, or object that should survive into the new picture. Subject owns stable identity, face, hair, makeup, construction, geometry, clothing, and completion-relevant outfit detail.

### Style

The rendering language: palette, line, texture, material, lighting treatment, surface behavior, and visual rhythm.

### Composition

The environment and shot: setting, framing, viewpoint, scale, camera position, lens behavior, and spatial arrangement.

These labels describe contribution jobs rather than ownership of every fact in an image. One reference can carry multiple jobs.

The builder resolves those contribution jobs into more precise owners:

- Subject owns stable identity, construction, geometry, and clothing.
- Pose owns bodily support, joints, contacts, body and head orientation, gaze, and visible facial articulation.
- Shot owns target coverage, crop, camera, frame position, negative space, scale, and lighting.
- Environment owns physical scene contents.
- Source metadata records only the coverage actually visible in a reference.

## Pack model

`StyleFusionPack` is the only canonical visual truth. A pack may contain:

- Subject
- Pose or Placement
- Style
- Environment
- Shot
- Assembly
- the exact completed prompt derived from the pack

Only useful modules should be emitted. Assembly owns composition and the bindings between modules.

The application may change how it builds or translates a pack without changing this public contract. Provider-specific settings and syntax do not belong in the canonical pack.

## Current scene-structure update

The current StyleFusion repository has implemented a scene-structure update that is moving through deployment.

- Subject references record whether they show a head, head and shoulders, upper torso, three-quarter figure, or full figure.
- Shot records the coverage requested in the finished image, along with crop boundaries and frame placement.
- When the requested coverage exceeds the source, the gap is derived and completed through Subject geometry and clothing, Pose or Placement structure and contacts, and a compatible Shot.
- Body direction, head return, gaze, expression, crop, and frame position remain independently adjustable.
- Scene warnings identify conflicting crops, missing completion scaffolds, misplaced ownership, and incomplete lower-body pose or outfit information.

These fields remain optional inside `stylefusion-pack/1`, so older packs still load. The public application may briefly lag this document while the update is deployed.

## Positive direction

The current pack does not use negative or exclusion lists as a source of visual truth.

Instead of repeatedly naming an unwanted object, the pack describes the intended replacement: what occupies the hands, what sits on the table, where the camera is, how the body is posed, and what material catches the light.

This is the public method claim:

```text
name the picture to build
not the failure to avoid
```

The HobFarm article `Gary and the Fork` is the companion explanation for this choice.

## Provider boundary

The completed stored prose is sent to the selected image model. In the current workflow, the source reference pixels are used to build the pack and are not passed to the downstream image generator.

This separation makes it possible to:

- compare multiple image models with the same handoff
- change a provider without rewriting the canonical visual record
- preserve the exact prompt sent for a generation
- keep project, pack, prompt, and generation history together

## Export boundary

A `.stylefusion.zip` file is a portable project pack. It can contain the manifest, assembly, useful modules, and exact prompt.

Generated images, character Sheets, Heroes, Posters, videos, and product packets are results or downstream assets. They do not become the canonical schema.

## Workshop taxonomy

### Character / Mannequin

Use for mannequin bases, character identity, wardrobe systems, species variants, Sheets, Heroes, Posters, and character-ready production assets.

### StyleFusion

Use for the current application, role-assigned references, modular packs, assembly, positive prompt translation, same-pack provider comparisons, generation history, and results produced from that workflow.

### Workshop Notes

Use for aesthetic research, design theory, tool observations, model behavior, process notes, and experiments that are not formal StyleFusion projects.

### Before & After

Use for visible repair and transformation studies.

### Alter Ego

Use for two distinct forms connected by shared identity.

### Cute & Corrupted

Use for the original and corrupted-form system.

## Public page contract

Route:

```text
/workshop/stylefusion/
```

The page should:

1. explain the current working application in ordinary language
2. show Subject, Style, and Composition jobs
3. explain the modular pack without publishing its full private recipe
4. demonstrate positive direction instead of negative lists
5. use real current generated results and motion studies, including an edited loop that demonstrates modular change over time
6. show targeted module revision and transfer between subjects
7. show same-pack provider comparisons
8. describe StyleFusion as ongoing content production and research, with findings routed to Workshop Notes
9. link to the authenticated application at `https://sf.hob.farm/`

The page should not:

- describe the retired Visual IR architecture as current
- advertise retired extraction-agent confidence, revision, restoration, or Grimoire runtime systems as current behavior
- publish raw reference images or private pack contents without explicit approval
- turn into a general character-sheet gallery
- make one image provider part of the canonical schema

## Historical material

The private noindex prototype and old StyleFusion study collection preserve an earlier IR and agent-diagnostics direction. They are historical implementation evidence, not the current public application contract.

Do not use that prototype to source current page copy.

## Naming rules

Use `StyleFusion` for the application, its pack workflow, its exports, and studies produced through that workflow.

Use `visual system map`, `character variation map`, `aesthetic influence map`, or `design-source map` for manual diagrams that are not StyleFusion runs.

Use `Character / Mannequin` for character and wardrobe development. Use `aesthetic mutation` for manually selected and combined aesthetic systems.
