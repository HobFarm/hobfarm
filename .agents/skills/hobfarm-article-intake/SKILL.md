---
name: hobfarm-article-intake
description: Reconcile rough author instructions, attached ChatGPT article plans, outlines, research packets, media notes, and build requests before HobFarm editorial work. Use when the user says "see attached," supplies mixed-authority source material, or asks Codex to continue a plan created outside the repository.
---

# HobFarm Article Intake

Turn mixed source material into a trustworthy route for the current task.

Read the current request first. Read [`../../../docs/editorial/EDITORIAL_CHARTER.md`](../../../docs/editorial/EDITORIAL_CHARTER.md) for the shared editorial promise.

## Reconcile the authority layers

- The current user request defines the desired outcome and current authorization.
- The repository defines its present files, schema, routes, components, assets, and working behavior.
- Explicitly approved copy and decisions retain their approved status.
- Author notes, identifications, recollections, and selected media are source evidence.
- ChatGPT-created outlines, plans, and task packets are proposed routes that may contain useful goals, stale implementation details, and claims that still need evidence.
- External research supports, qualifies, or challenges factual claims.

Separate these layers before acting. Preserve the user's intended result while translating implementation assumptions into the repository's current equivalents.

## Classify source material without flattening it

Distinguish current author direction; recollection; author-confirmed fact or identification; opinion or judgment; uncertainty; question; joke, aside, or phrasing; proposed connection; checkable fact; supplied source or receipt; AI proposal; production instruction; selected media; rejected direction; unresolved research question; and approved copy or structure. These are interpretive classes for preserving authority, evidence, and intent. Do not turn intake into sentence-level tagging bureaucracy.

Newer explicit author direction supersedes older AI or working direction, but preserve enough of the superseded history to explain material decisions and prevent rejected ideas from returning unnoticed. AI suggestions never acquire author authority through repetition, incorporation into another AI packet, or the passage of time.

## Continue at the requested depth

When the user says "see attached" and the attachment clearly requests local research, writing, image work, or site implementation, treat that as the working task after reconciliation. Complete safe in-scope local work and validation. Apply commit, push, deployment, publication, paid services, and other outward actions according to the user's current authorization and repository release rules.

Use [`references/source-packets.md`](references/source-packets.md) when the packet is complex enough to benefit from an explicit reconciliation record. For a simple packet, keep the reconciliation internal and continue.

## Route the work

- Use `hobfarm-research` for receipts, evidence states, and current external facts.
- Use `hobfarm-prose` for outlining, drafting, revision, captions, deks, and voice.
- Use `hobfarm-visual-editorial` for selected media, visual evidence, captions, graphics, and image planning.
- Use `hobfarm-article-build` for repository implementation.
- Use `editorial-mesh` after the article is substantially complete or when classification and relationships are the task.

Return the requested artifact or proceed with the requested build. Create a standalone intake document only when it will remain useful beyond the current task.
