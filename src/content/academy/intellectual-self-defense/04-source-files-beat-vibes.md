---
courseSlug: intellectual-self-defense
slug: source-files-beat-vibes
title: "Source Files Beat Vibes"
deck: "A vague aesthetic prompt delegates the visible decisions to common defaults. A source file records what the model may invent and what it must preserve."
order: 4
moduleTitle: "Module 2 — Using AI to make"
moduleOrder: 2
duration: "12–14 minutes"
skill: "Write a reusable creative source file with visible constraints, permissions, and approval gates."
learnerOutput: "Creative Source Pack"
prerequisites:
  - "One real creative task"
inputs:
  - "Approved references"
  - "Known canon or fixed decisions"
figure:
  src: "https://cdn.hob.farm/self-defense/lessons/04-source-files/source-files-beat-vibes-v1.svg"
  alt: "Workflow from Markdown source and constraints through model output to human review and an approved asset."
  caption: "A source file makes the decisions visible. It does not guarantee that the model will follow them."
downloads:
  - label: "Creative Source File Starter"
    href: "https://cdn.hob.farm/self-defense/downloads/creative-source-file-starter.md"
    format: Markdown
sourceNotes:
  - label: "HobFarm Workshop Development System"
    url: "https://hob.farm/workshop/workshop-notes/"
    note: "The live Workshop route documents HobFarm's production methods, controlled experiments, and replacement rules."
  - label: "NIST AI RMF Core"
    url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/"
    note: "Supports the broader practice of defining AI tasks, knowledge limits, intended use, and human oversight."
fieldRule: "Give the machine a style source, not a vibe cloud."
commonDefault: "Add more adjectives when the result feels generic."
replacementMethod: "Replace mood labels with visible construction, palette, silhouette, material, staging, permissions, and approval decisions."
relatedArticle: "/articles/the-card-catalog-started-talking-back/"
draft: false
---

“Make a gothic anime character” leaves almost every design decision open.

The model chooses the face, silhouette, palette, garment construction, materials, accessories, pose, camera, and degree of polish. If the result feels generic, the usual response is to add more mood words. Darker. Creepier. More cinematic. More original.

Those words rarely replace a missing decision. They decorate the gap.

A source file turns the gap into fields you can inspect. Markdown is useful because it is plain, portable, easy to version, and readable by people and machines. Markdown is not magic. The value comes from the decisions written inside it.

## Historical ancestor: the production brief

Creative work has always used containers: scripts, shot lists, style guides, pattern books, art-direction decks, model sheets, cue sheets, and printer specifications. These documents keep choices stable while work moves between people and tools.

An AI source file belongs to that family. It tells the tool what this run is for, which material has authority, and where invention is welcome.

## Start with the exact job

Write one deliverable. “Develop the world” is not one deliverable. “Produce a front-facing portrait at 1600 by 1600 pixels using the supplied face and palette rules” is.

Record the quantity, format, destination, and stop condition. If the job ends after one portrait, say so. This prevents a useful image request from quietly becoming a naming exercise, franchise bible, production plan, and motion campaign.

## Separate four decision zones

### Locked

These choices must remain stable: subject identity, approved canon, exact text, logo geometry, garment construction, or a required fact.

### Flexible

The model may vary these choices within limits: background texture, crop, secondary props, or small lighting changes.

### Free to invent

These are genuine creative gaps. You may want the system to invent a pose, accessory, transition, rhythm, or fictional environment.

### Requires approval

The tool may offer options but may not choose: names, canon changes, final arguments, publication claims, or any decision with consequences outside the draft.

The distinction saves correction time. A model cannot reliably protect a boundary you never stated, and a stated boundary still needs review.

## Replace generic defaults

Name the visible default and its replacement.

| Generic default | Deliberate replacement |
| --- | --- |
| “goth” becomes black lace and random crosses | Exact collar, sleeve, hardware, fabric, and accessory rules |
| “psychedelic” becomes mushrooms and rainbow swirls | Defined optical pattern, palette intervals, edge behavior, and material |
| “cinematic” becomes teal-orange lighting | Named lens, camera height, depth plan, and light source |
| “futuristic” becomes blue holograms | Specific interface material, input method, wear, and mechanical purpose |

The replacement does not need to be long. It needs to be visible.

## Reference assets need roles

Do not throw ten images into a prompt and hope the model understands the hierarchy. Give each reference one role: subject identity, style, composition, palette, material, or exclusion guidance.

Also state what the model must not infer. A wardrobe reference may supply construction without authorizing a new face. A portrait may lock identity without defining the body. A color sample may control palette without becoming a scene.

## Worked example

Vague prompt:

> Make a gothic character. Keep it stylish and original.

Short source packet:

```text
Job: one square head-and-neck portrait
Identity: preserve the supplied face and eye geometry
Palette: mint-cyan skin, amber and teal eyes, black hair, violet hardware
Invariants: direct gaze, blunt bangs, two lacquer makeup trails
Flexible: background texture and small earring details
May invent: subtle lighting treatment
Must ask: name, canon, outfit, story, numbering system
Stop: deliver the portrait and a one-sentence production note
```

The second version does not guarantee originality. It makes failure easier to diagnose. If the tool names the character anyway, you can point to a decision boundary instead of negotiating with a fog of vibes.

## Exercise: build your source pack

Download the Creative Source File Starter and fill it for one real task.

1. Name one exact deliverable.
2. Assign every reference a role.
3. List current canon or approved facts.
4. Write the invariants.
5. Define the variable space.
6. Replace three generic defaults.
7. State free invention, options only, ask first, and never invent.
8. Write the stop condition.

Run the source file once. Review the output against the assignment before reviewing beauty.

## Learner output: Creative Source Pack

Save the file outside the model. Record the tool and date after a successful run. Reuse the source only after it proves useful. A swollen prompt full of untested rules is another kind of vibe cloud.
