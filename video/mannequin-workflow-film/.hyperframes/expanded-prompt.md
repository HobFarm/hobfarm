# Mannequin to Character: the continuity record before the character

## Style block

Create a 16-second, 1920×1080 HyperFrames composition that turns the supplied `MANNEQUIN TO CHARACTER WORKFLOW` board into a moving technical inspection. The design follows `DESIGN.md` exactly: paper `#F1F2F1`, cool paper shadow `#DDE1E2`, graphite `#17191C`, secondary graphite `#50565B`, measurement gray `#8B9298`, cyan signal `#00AED5`, cyan highlight `#20C2E2`, magenta registration accent `#D60075`, and output panel `#17191C`. Use IBM Plex Sans for statements and IBM Plex Mono for data labels.

The film explains the stage before a named character or avatar is built. The neutral mannequin is a continuity system. Proportions, face options, hair, palette, wardrobe categories, camera coverage, scene direction, and motion tests are established first. A character profile can be applied after the base survives those tests.

The supplied PNG is the canonical visual source. Preserve it exactly. Use clipped inspection windows, scale, perspective, and object-position to examine its sections. Do not redraw or replace its figures, labels, arrows, or character output.

## Narrative model

`LOCK THE BASE → CHANGE THE LAYERS → PROVE THE OUTPUT`

- The mannequin is the stable production substrate.
- Face, hair, palette, and wardrobe are variable identity layers.
- Camera, scene, and motion are continuity tests.

## Rhythm declaration

`establish-build-BUILD-direct-resolve`

- Scene 1 / 0.0-2.8s: establish the complete record
- Scene 2 / 2.8-6.0s: build the neutral base
- Scene 3 / 6.0-9.5s: define controlled variables
- Scene 4 / 9.5-12.8s: direct camera, scene, and motion proof
- Scene 5 / 12.8-16.0s: resolve to one continuity record

Energy rises through the first four scenes, then holds on a clean, legible final frame.

### Exact transition overlap windows

- Scene 1 → Scene 2: `2.32-2.80s` / 0.48s focus pull, `power2.inOut`.
- Scene 2 → Scene 3: `5.56-6.00s` / 0.44s focus pull, `power2.inOut`.
- Scene 3 → Scene 4: `9.16-9.50s` / 0.34s mechanical shutter, `power3.inOut`.
- Scene 4 → Scene 5: `12.25-12.80s` / 0.55s focus pull, `sine.inOut`.
- The Scene 4 `CHARACTER OUTPUT` verification hold occupies `11.75-12.25s`, immediately before the final pullback.

## Global rules

- The complete board remains the spatial map. Every crop must feel like a camera moving across one document.
- Each scene has a background paper field, a midground board or board crop, and foreground inspection marks.
- Use no more than two atmospheric devices at once. Choose only from the cyan scanner line, registration crosses, measurement ticks, ghost coordinates, restrained paper grain, or shutter bars.
- One ambient motion per scene. Decorative elements in that scene share the same slow scanner drift or measurement sweep.
- Primary transition: focus pull, 0.42-0.55s, `power2.inOut`.
- Accent transition into Scene 4: mechanical shutter, 0.34s, `power3.inOut`.
- Every scene has a deterministic entrance. Do not animate scene content out; transitions handle the handoff. Only Scene 5 may fade at the end.
- Build and inspect the static hero layout for all five scenes before adding GSAP.
- Use `gsap.from()` for wrapper entrances. Use `fromTo()` only for controlled child-image pans, clipped masks, scanner effects, and the Scene 2 alignment proof.
- Put entrance transforms on wrappers and image drift on child images. Never stack transform tweens on the same element.
- Use one large statement and one mono status label per scene. Do not duplicate the source board's visible labels in foreground copy.
- Statements are at least 40px. Any other narrative text is at least 24px. Mono status labels are at least 18px.
- Cap full-board blur at 8px.
- Register one paused GSAP timeline as `window.__timelines["mannequin-workflow-wide"]`.
- No infinite repeats, wall-clock animation, random values, or autonomous media playback.
- The film must make sense muted.
- Provide a `prefers-reduced-motion` branch that uses the same static hero layouts and short opacity crossfades without scanner travel, perspective settling, duplicate alignment motion, shutter movement, or image pans.

## Scene 1 — The record exists before the character

### Concept

The viewer arrives at a clean production table. The complete board is already a substantial object, but it is slightly out of focus and held at a shallow angle. A cyan scanner line crosses it and the document settles square to camera. The first idea is immediate: this is a record to inspect, not a generated picture to admire.

### Mood direction

Industrial design review, model-sheet archive, and a clean photography contact table. Precise and calm. The paper field should feel physical without becoming nostalgic.

### Depth layers

- BG: paper `#F1F2F1`
- BG: faint measurement grid in `#8B9298`
- MG: full supplied workflow board in a paper-shadow wrapper
- MG: cool shadow plate offset behind the board
- FG: cyan scanner rule
- FG: paired cyan registration crosses
- FG: mono status `CONTINUITY RECORD / 00`
- FG: statement `Build the system before the identity.`

### Animation choreography

- The shadow plate SLIDES six pixels down and right, establishing physical depth.
- The board SETTLES from `rotationY:-5`, `scale:0.96`, and soft blur to a nearly square inspection view over 1.05s with `expo.out`.
- The scanner rule DRAWS left to right in 0.55s with `power3.out`.
- Registration crosses SNAP into their corners from scale 1.35 with `back.out(1.2)`.
- The mono status TYPES ON by clipped character groups.
- The statement RISES from the lower paper margin in 0.65s with `power2.out`.
- During the hold, the child board image PUSHES from scale 1.0 to 1.018.

### Transition out

Focus pull into the central mannequin during `2.32-2.80s`: full-board blur reaches no more than 8px as the board scale reaches 1.12, then the incoming crop clears. Duration 0.48s, `power2.inOut`.

## Scene 2 — Build the neutral base

### Concept

The inspection camera is now between the proportions panel and the central base. Three instances of the same canonical mannequin crop briefly occupy the frame, then snap into exact alignment beneath the cyan center line. The body is treated as an approved geometry that later character decisions must respect.

### Mood direction

Garment block, industrial mannequin specification, and animation turnaround review. Functional, human-scale, and deliberately unfinished.

### Depth layers

- BG: paper field with a slow vertical scanner drift
- BG: vertical measurement ticks
- MG: wide crop containing `PROPORTIONS` and `BASE / NEUTRAL MANNEQUIN`
- MG: two faint clipped duplicates of the same canonical central-mannequin crop, offset horizontally around the primary crop
- FG: cyan center line
- FG: mono status `BASE / ALIGNMENT LOCK`
- FG: statement `Proportions, silhouette, and movement stay consistent.`

### Animation choreography

- The crop wrapper DROPS into place from above over 0.72s with `expo.out`.
- The child board image PANS 3% horizontally through the hold.
- Measurement ticks CASCADE downward with a 0.045s stagger.
- The cyan center line DRAWS vertically in 0.45s.
- Two faint duplicates of the canonical mannequin crop ENTER from opposite horizontal offsets. A controlled `fromTo()` alignment proof then snaps both duplicates and the primary crop into exact registration beneath the cyan center line. No anatomy or crop content changes.
- The mono status STAMPS into the upper right with a 0.22s scale hit.
- The statement SETTLES from the left using `sine.out`.

### Transition out

Focus pull toward the right-hand face and palette panels during `5.56-6.00s`. Duration 0.44s, `power2.inOut`.

## Scene 3 — Define what can change

### Concept

The board becomes a controlled variable map. Face, hair, palette, and wardrobe are not random decoration. Each occupies a named slot around the neutral base. Cyan paths show that these decisions are separate, reviewable layers.

### Mood direction

Character department wall, wardrobe breakdown, and a scientific variable-isolation diagram. The energy increases because the system now shows how many outcomes one base can support.

### Depth layers

- BG: paper field
- BG: enlarged ghost word `VARIABLES`
- MG: face panel crop
- MG: hair and palette crop
- MG: wardrobe system crop
- MG: small full-board locator thumbnail
- FG: subtle diagonal cyan route lines
- FG: mono status `VARIABLE LAYERS / 02`
- FG: statement `Face, hair, palette, and wardrobe create identity.`

### Animation choreography

- The three crop wrappers CASCADE into an asymmetric triangular arrangement within 0.46s total.
- Face SLIDES from right with `expo.out`.
- Hair and palette LIFTS from below with `power3.out`.
- Wardrobe OPENS from a clipped horizontal mask with `sine.inOut`.
- Cyan route lines DRAW from the locator thumbnail to each crop.
- The locator thumbnail DRIFTS two degrees toward square during the hold.
- The mono status SNAPS into the upper margin.
- The statement TRACKS from wide letter spacing to normal over 0.7s.

### Transition out

Mechanical shutter during `9.16-9.50s`. Three graphite blades close over the variable panels, meet for three frames, and reopen on the camera-tests crop. Total duration 0.34s, `power3.inOut`.

## Scene 4 — Direct the proof

### Concept

The workflow stops being a static identity sheet and becomes a test plan. The camera checks wide, mid, close, and detail. Scene direction assigns light, mood, location, and styling. The motion-output strip proves that the base can perform without losing its construction.

### Mood direction

Camera department slate and motion-test bay. This is the highest-energy scene, but it remains technical rather than theatrical.

### Depth layers

- BG: paper field with graphite shutter bars parked at the top and bottom edges
- MG: camera-tests crop
- MG: scene-direction crop
- MG: dark motion-output crop
- FG: cyan scanline moving from camera tests to output
- FG: mono status, beginning as `CONTINUITY TEST / 04` and changing to `OUTPUT VERIFIED` only for the output hold
- FG: statement `Test the design through camera, scene, and motion.`

### Animation choreography

- Shutter blades RETRACT quickly to reveal the scene.
- Camera frames PUNCH in sequentially from left with a 0.065s stagger.
- The scene-direction crop CASCADES from the upper right.
- The dark output panel SLIDES upward and locks against a cyan rule.
- A cyan scanline TRAVELS from the first camera frame through the motion silhouettes to character output.
- The output panel child image PANS slowly right while its wrapper remains fixed.
- The statement LANDS as one complete line.
- At `11.75s`, the scanline reaches the supplied board's existing `CHARACTER OUTPUT` section. Hold that exact crop for 0.5s while the single mono status changes to `OUTPUT VERIFIED`.

### Transition out

At `12.25s`, begin the focus pull and measured zoom back to the complete board. Output black softens to paper through a 0.55s blur clear, ending at `12.80s`, `sine.inOut`.

## Scene 5 — One continuity record

### Concept

The camera returns to the complete source board. Every inspected part is visible in its original position. Cyan paths briefly illuminate the sequence, then become still. The system is ready for a character profile, but the film stops before inventing one.

### Mood direction

Approved technical plate at the end of a design review. Quiet confidence. The final frame should be useful as a Workshop poster.

### Depth layers

- BG: paper `#F1F2F1`
- BG: cool offset shadow plate
- MG: complete supplied workflow board
- FG: cyan corner brackets
- FG: mono status `CONTINUITY RECORD / READY FOR PROFILE`
- FG: statement `One approved base can carry many identities.`

### Animation choreography

- The full board RESOLVES from scale 1.08 and 8px blur to scale 1.0 and zero blur over 0.88s.
- Corner brackets DRAW around the board.
- Cyan workflow paths GLOW once through a deterministic opacity and brightness pass.
- Status label TYPES ON from left.
- The statement SETTLES from 20px above with `expo.out`.
- Hold the final poster for at least 1.35s.
- At 15.72s, the entire composition may fade to paper over 0.28s.

### Transition out

Final color hold to paper. No new motion language.

## Recurring motifs

- Cyan scanner line: reveals relationships instead of decorating empty space.
- Registration crosses: confirm alignment and approval.
- Measurement ticks: connect proportions, camera, and motion tests.
- Ghost stage numbers: keep the sequence legible without adding web-card chrome.
- One full-board locator: every crop remains part of one continuity record.
- Magenta appears only as the supplied board's registration accent and final output bracket.

## Negative prompt

- Do not use a black neon canvas, violet glow, blue hair, PsyGoth imagery, Zima, or any named avatar.
- Do not morph the neutral mannequin into a finished character.
- Do not add a voice, lip sync, talking head, or presenter.
- Do not treat the board as a flat static image; give every board view a wrapper entrance and child-image camera move.
- Do not invent extra anatomy, garments, character traits, applications, or deliverables.
- Do not build a fake design-tool interface around the image.
- Do not use generic SaaS cards, glass panels, gradient text, rounded pill stacks, or dashboard widgets.
- Do not use random motion, infinite repeats, wall-clock animation, or unregistered timelines.
- Do not repeat the same ease, speed, stagger, or entrance direction across a scene.
- Do not use more than two atmospheric devices at once.
- Do not add secondary statements, explanatory sublines, duplicate panel labels, or text smaller than the stated size floors.
- Do not place small text under 18px in the final render.
