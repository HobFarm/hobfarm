# HobFarm Theatrical Pose System

Purpose: create dynamic character images that communicate a dramatic beat while preserving face, wardrobe, silhouette, and product clarity.

Use for expressive Singles, Heroes, Posters, Wallpapers, video keyframes, pose studies, and pose repair. Sheet mode uses neutral construction poses unless an expressive sheet is requested.

## Core rule

A theatrical pose has one dominant action verb.

Useful verbs include:

- Accuse
- Appeal
- Resist
- Recoil
- Collapse
- Conceal
- Invite
- Perform
- Dominate
- Contemplate
- Escape
- Reveal
- Offer
- Brace
- Pursue
- Surrender

Choose the verb first. Build the body, hands, gaze, camera, and scene around it.

## Pose compiler

```yaml
pose:
  id:
  family:
  dramatic_beat:
  action_verb:
  intensity:
  line_of_action:
  weight_support:
  torso_shape:
  shoulder_and_hip_relationship:
  leg_shape:
  arm_logic:
  hand_jobs:
  head_angle:
  gaze_target:
  audience_relationship:
  lens:
  camera_angle:
  foreground_device:
  depth_plan:
  wardrobe_priority:
  face_priority:
  final_hold:
```

## Pose construction

### Line of action

Use one readable curve, diagonal, arc, spiral, or vertical thrust through the body. Hair, fabric, limbs, and props should support the same directional idea.

### Weight support

Show where the body is supported:

- One planted leg
- Both feet in a broad base
- One knee
- Hip against a surface
- Hands braced against a wall
- Suspended or floating center
- Backward fall with a visible loss of support

### Torso shape

Use the spine to carry emotion:

- Tall vertical spine for command
- Forward pitch for accusation or pursuit
- Backward arch for shock or surrender
- Inward curve for grief or concealment
- Spiral twist for conflict or transformation
- Side bend for performance or unstable balance

### Hands

Give every visible hand a job:

- Point
- Grip
- Brace
- Offer
- Shield
- Frame
- Press
- Clutch
- Release
- Reach
- Hold a prop
- Pull fabric
- Touch the face
- Mark a boundary

Shape fingers around the job and keep the silhouette readable.

### Gaze

Aim the eyes at a target:

- Viewer
- Foreground prop
- Off-frame threat
- Spotlight
- Mirror
- Doorway
- Floor
- Another figure
- Raised hand
- Exit path

The gaze should reinforce the dramatic beat.

## Audience relationship

### Full front

Use for confrontation, icon poses, declarations, display, and direct performance.

### Open quarter

Use for interaction while keeping the face and wardrobe readable.

### Profile

Use for introspection, graphic silhouette, pursuit, confrontation with an off-frame subject, and strong head shapes.

### Closed three-quarter

Use for withdrawal, secrecy, rejection, guarded emotion, and impending exit.

### Back with head turn

Use for invitation, escape, disdain, garment-back reveal, and narrative suspense.

### Direct to lens

Use when the viewer becomes the target, witness, partner, obstacle, or threat.

## Intensity scale

1. Indicated: natural posture with one clear gesture.
2. Stylized: shaped silhouette and deliberate weight shift.
3. Theatrical: extended body line, purposeful hands, directed gaze, and camera relationship.
4. Melodramatic: broad gesture, strong foreshortening, deep arc, and poster-scale emotion.
5. Pantomime: maximum graphic clarity and emotion readable from silhouette alone.

Use Level 2 for fashion-forward Singles, Level 3 for most Heroes, Level 4 for Posters, and Level 5 for comedy, cabaret, silent-drama, or deliberately artificial staging.

## Pose families

### TP-ENT: Entrance

Function: arrival, command, reveal.

Body: chest lifted, one foot advancing, arms opening or prop presented.

Camera: low-angle wide lens or stage-front view.

### TP-ACC: Accusation

Function: betrayal, command, confrontation.

Body: planted rear leg, torso pitched forward, one arm thrust toward the target.

Camera: low-angle wide lens with the pointing hand near the lens.

### TP-BAR: Barrier

Function: confinement, resistance, invisible pressure.

Body: palms pressed forward, elbows flexed, torso recoiling or bracing.

Camera: full-front close perspective or fisheye.

### TP-APL: Appeal

Function: pleading, offering, desperation.

Body: lowered base, open chest, both hands extended or one hand reaching upward.

Camera: high angle or viewer-level intimate framing.

### TP-COL: Collapse

Function: shock, surrender, swoon.

Body: backward arc, buckling knee, trailing arm, broken support line.

Camera: Dutch angle, side view, or overhead diagonal.

### TP-WOE: Woe spiral

Function: grief, panic, internal conflict.

Body: twisted torso, one hand at face or chest, the other opening away from the body.

Camera: tight three-quarter or high-angle portrait.

### TP-DSP: Display

Function: fashion clarity, confidence, introduction.

Body: contrapposto, bevel, attitude, or twisted runway stance.

Camera: three-quarter fashion lens or clean full front.

### TP-PER: Performance

Function: cabaret, dance, rhythm, controlled theatricality.

Body: shaped shoulders, isolated hips, crisp elbows, expressive fingers, deliberate knee angles.

Camera: full-front stage view or low theatrical angle.

### TP-SOL: Soliloquy

Function: contemplation, doubt, plotting.

Body: pacing stance, hand near chin, throat, chest, or prop, gaze toward a light or mirror.

Camera: profile, open quarter, or spotlight portrait.

### TP-EXT: Exit reveal

Function: withdrawal, secrecy, disdain, escape.

Body: back or closed three-quarter orientation, moving leg, head turned toward viewer.

Camera: over-shoulder or long corridor perspective.

### TP-SUB: Submission

Function: defeat, ritual surrender, vulnerability.

Body: kneeling or bowed base, open hands, lowered head or upward appeal.

Camera: high angle, distant stage framing, or direct overhead.

### TP-ATD: Attitude

Function: balletic poise, suspension, ornament, elegance.

Body: one-leg support, second leg bent, elongated arms, controlled head line.

Camera: profile or sweeping three-quarter view.

## Lens and camera pairings

### Low-angle wide lens

Use for dominance, boots, platforms, entrance, accusation, and looming silhouettes.

### High-angle wide lens

Use for appeal, vulnerability, floor graphics, reaching hands, and kneeling poses.

### Close fisheye

Use for punk energy, barrier poses, comedy, club scenes, and aggressive direct-to-lens action.

### Three-quarter portrait lens

Use for beauty, face key, fashion detail, soliloquy, and restrained theatricality.

### Over-shoulder

Use for pursuit, secret identity, exit reveals, garment backs, and discovery.

### Dutch angle

Use for collapse, occult tension, unstable balance, transformation, and melodrama.

### Long perspective

Use for entrances, exits, liminal corridors, stairwells, runways, and pursuit.

## Depth plan

Hero and Poster scenes use three readable planes.

```yaml
depth_plan:
  foreground: one hand, shoe, prop, curtain edge, railing, mirror edge, or environmental frame
  midground: complete character silhouette and readable face
  background: one story environment and one dominant light shape
```

Use one primary foreshortened element. Let the remaining body support its scale.

## Wardrobe readability

Choose the pose around the design.

- Puff sleeves benefit from arm separation.
- Bell skirts benefit from hip rotation or a lifted step.
- Platforms benefit from low angles.
- Back lacing benefits from an exit reveal.
- Long hair benefits from profile, spiral, or collapse movement.
- Wings benefit from open quarter or back-facing poses.
- Tails benefit from a body twist that reveals the attachment point.
- Hand props benefit from offer, accusation, or direct-to-lens staging.

When the emotional pose covers the outfit, open the body while preserving the action verb.

## Starter pose cards

### TP-ACC-01: Direct accusation

Tall rear-leg support, forward torso twist, one hand pointing close to the lens, chin raised, eyes locked on the viewer, low-angle wide camera.

### TP-BAR-01: Invisible glass

Both palms pressed toward the lens, one hand higher, face framed between them, shoulders recoiling, close full-front perspective.

### TP-COL-01: Broken arc

Body falling backward on a diagonal, one knee folding inward, one arm trailing above the head, hair and fabric continuing the fall, Dutch angle.

### TP-APL-01: Stairwell appeal

Character kneels one level below the camera, one hand grips the rail, the other reaches upward, face tilted toward the viewer.

### TP-DSP-01: Backstage bevel

One knee bent with the toe pointed, hip displaced, one hand frames the face, the other holds a curtain or mirror edge, hard spotlight.

### TP-SOL-01: Ribbon-grip soliloquy

Weight shifted into contrapposto, one hand grips the neckline or ribbon, the other hangs loosely, gaze turned toward an off-frame mirror.

### TP-EXT-01: Three-quarter exit

Back mostly turned, head looking over one shoulder, carried prop swinging outward, moving leg opening the garment silhouette.

### TP-PER-01: Cabaret crouch

Torso pitched forward, shoulders shaped inward, knees angled, hip isolated, elbows crisp, fingers spread, full-front stage camera.

## Prompt assembly

```text
[character canon and wardrobe], performing [action verb] at intensity [level].
[weight support and line of action].
[torso, arms, hand jobs, leg shape, head angle, gaze target].
[audience relationship].
[lens and camera angle], with [foreground device] enlarged by perspective.
Three depth planes: [foreground], [character], [environment and dominant light].
Keep the face, silhouette, wardrobe construction, materials, motif, and liquid behavior readable.
```

## Video conversion

Turn the still pose into one controlled motion sequence:

1. Establish the face and motif.
2. Move through one character action.
3. Add one camera motion and one environmental motion.
4. Settle into the pose card’s final hold.

Preserve the action verb throughout the clip.

## Pose QC

A strong pose has:

- One clear dramatic beat
- One readable line of action
- Visible weight support
- Purposeful hands
- Directed gaze
- Clean negative spaces
- One primary foreshortened element
- Readable face and wardrobe
- A camera choice that strengthens the action
- A final silhouette that works at thumbnail size
