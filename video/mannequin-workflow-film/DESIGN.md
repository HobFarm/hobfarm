# Mannequin Workflow Film design

## Intent

This film explains the stage before a character or avatar exists. It treats the supplied `MANNEQUIN TO CHARACTER WORKFLOW` board as a technical continuity record under inspection. The viewer should understand that proportions, face options, hair, palette, wardrobe categories, camera coverage, scene direction, and motion tests are decided around a neutral base before a character profile is applied.

This is not a second PsyGoth or Zima reveal. It does not end with a named character, avatar performance, or costume transformation. The payoff is the system itself becoming legible.

## Narrative model

`LOCK THE BASE → CHANGE THE LAYERS → PROVE THE OUTPUT`

- The mannequin is the stable production substrate.
- Face, hair, palette, and wardrobe are variable identity layers.
- Camera, scene, and motion are continuity tests.

## Source image

- Canonical source: `public/media/workshop/character-mannequin/mannequin-to-character-workflow.png`
- Preserve the complete board and its existing labels.
- Cropped views may isolate sections for inspection, but no crop may be presented as a separate invented asset.
- Do not add a face, character name, outfit, or profile that is not already present in the supplied graphic.

## Palette

Use only colors already present in the supplied board.

| Role | Value |
| --- | --- |
| Paper background | `#F1F2F1` |
| Cool paper shadow | `#DDE1E2` |
| Graphite | `#17191C` |
| Secondary graphite | `#50565B` |
| Measurement gray | `#8B9298` |
| Cyan signal | `#00AED5` |
| Cyan highlight | `#20C2E2` |
| Magenta registration accent | `#D60075` |
| Output panel | `#17191C` |

## Typography

- Display and explanation: `IBM Plex Sans`, 300 for explanatory text and 650-700 for stage headlines.
- Data, coordinates, and labels: `IBM Plex Mono`, 500-650, uppercase, with visible tracking.
- Wide composition: statements at 40 px or larger, any narrative text at 24 px or larger, and mono labels at 18-24 px.
- Use graphite text on the paper field. Reserve white text for the final output panel.
- Keep display tracking between `-0.04em` and `-0.02em`. Mono labels use `0.12em` to `0.18em`.
- Use one large statement and one mono status label per scene.
- Do not repeat labels that are already legible inside the source board.

## Shape, spacing, and depth

- Light technical drawing board, not a web dashboard.
- Use square inspection windows, 2-3 px cyan rules, crop marks, measurement ticks, and registration crosses.
- Create depth through paper shadow, perspective tilt, clipped camera moves, and a restrained cyan focus wash.
- Keep at least one full or nearly full view of the supplied board available in every scene so the viewer never loses the system context.
- The final frame must restore the complete board and the line `ONE CONTINUITY RECORD. ENDLESS POSSIBILITIES.`

## Motion

- Rhythm: `establish-build-BUILD-direct-resolve`.
- Primary transition: focus pull with a 0.42-0.55 second blur clear, `power2.inOut`.
- Accent transition: mechanical shutter into the camera and motion-output stage, 0.34 seconds, `power3.inOut`.
- Crops move like a document scanner or inspection camera: measured horizontal pans, short vertical drops, and controlled scale pushes.
- Cyan rules draw across the frame. Registration marks settle with a short `expo.out`.
- Use no more than two atmospheric devices at once.
- Ambient motion is one slow scanner drift per scene. No pulsing character aura or fashion-film movement.
- All motion is deterministic and registered on the composition timeline.
- Build and inspect the static hero frame for every scene before adding motion.
- Use `gsap.from()` for wrapper entrances. Reserve `fromTo()` for controlled image pans, masks, scanner effects, and the Scene 2 alignment proof.
- Cap full-board blur at 8 px.
- Define every transition as an exact overlap window.
- Provide a `prefers-reduced-motion` branch using the same static layouts and short opacity crossfades.

## Avoid

- No dark neon PsyGoth treatment.
- No Zima, named character, avatar host, or character-reveal payoff.
- No morphing body, face, hair, or wardrobe.
- No fake app UI, generic SaaS cards, gradient text, or glass panels.
- No narration-dependent meaning. The film must work muted on the Workshop page.
- No text smaller than 18 px in the rendered film.
- No invented workflow claims beyond what the supplied board and HobFarm Workshop page support.
