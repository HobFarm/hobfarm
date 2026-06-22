---
title: "Characters"
description: "Creating character DNA profiles for consistent identity across generations."
project: "stylefusion"
section: "characters"
order: 1
publishedAt: 2026-03-13
---

## What Characters Do

Characters solve the consistency problem. Without a character profile, every generation is independent: the AI model has no memory of previous outputs. Characters give StyleFusion a persistent identity definition that gets merged into every extraction.

When a character is active, its DNA (anchor traits and flex traits) becomes part of the IR. The compiled prompts include identity-specific instructions that push the generation model toward consistency: same eye color, same face structure, same defining features, regardless of style or arrangement.

## Creating a Character

Navigate to the **Characters** page from the top navbar. Click **+ New Character** (purple button). The editor modal has three fields:

**Name** (required): whatever you want to call this character. This shows up in the IR viewer and on character cards.

**Anchors** (immutable traits): the things that define this character and should never change across generations. Add them one at a time using the input field.

Good anchors are specific and visual:
- "pale skin with freckles"
- "green eyes, almond-shaped"
- "sharp jawline"
- "shoulder-length black hair, straight"
- "tall, athletic build"

Bad anchors are vague or non-visual:
- "pretty" (subjective, not actionable)
- "looks like my friend" (the AI doesn't know your friend)
- "mid-20s" (age is tricky for AI models; describe the visual result instead)

**Flex** (variable traits): things that can change between generations. Clothing, pose, expression, accessories. These get included in the IR but with lower priority, so the generation model treats them as suggestions rather than requirements.

**Tags** (comma-separated): organizational labels like "fantasy, portrait, female." These help you filter and find characters in the library.

## Using Characters in the Workspace

Back on the Workspace page, up to 5 character cards appear in the left panel below your reference images. Click a card to activate that character.

When active, two things change:

1. The Fuse extraction incorporates the character's anchor traits as hard constraints and flex traits as soft guidance
2. The IR viewer gains a **Character DNA** section showing the character name (purple label), anchors, and flex traits as editable chips

You can edit the character DNA chips directly in the IR without going back to the Characters page. Changes made here affect this session only; they don't update the saved character profile.

## Character Consistency Workflow

The recommended loop for building consistent output:

1. **Create the character** with strong, specific anchors
2. **Upload a reference** that matches your intended look
3. **Fuse with the character active** so the extraction captures both the reference's visual DNA and the character's identity constraints
4. **Generate across multiple styles** by changing arrangements and style anchors while keeping the character active
5. **Check History** to compare outputs side by side. The defining features (anchors) should stay consistent; the stylistic treatment should vary

If a feature drifts across generations (say, eye color keeps shifting), strengthen the relevant anchor. Change "green eyes" to "vivid green eyes, emerald, always visible." More specificity gives the model less room to wander.

## Managing Characters

On the Characters page, each saved character card has three actions:

- **Select:** activates the character for the current Workspace session
- **Edit:** opens the editor modal to modify anchors, flex traits, or tags
- **Delete:** permanently removes the character

Characters are stored in your browser. They persist across sessions but don't sync across devices. If you clear browser data, characters are lost. Use the Export functionality in the Workspace to save critical character configurations as text files.
