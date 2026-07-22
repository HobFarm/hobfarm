---
courseSlug: intellectual-self-defense
slug: route-the-work
title: "Route the Work"
deck: "The best tool does not need to perform every step. Authorship lives in the handoffs, approvals, and stopping rules."
order: 6
moduleTitle: "Module 2 — Using AI to make"
moduleOrder: 2
duration: "10–12 minutes"
skill: "Choose tools by job, define handoff contracts, and measure correction debt."
learnerOutput: "Tool Route Map"
prerequisites:
  - "One completed AI Output Receipt"
inputs:
  - "A real multi-stage research or creative task"
figure:
  src: "https://cdn.hob.farm/self-defense/lessons/06-route-the-work/route-the-work-v1.svg"
  alt: "Parallel research and creative workflow routes with human decisions placed between specialized stages."
  caption: "Each stage gets a named job, an output contract, and a human check before the next handoff."
downloads: []
sourceNotes:
  - label: "NIST AI RMF Core"
    url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/"
    note: "Calls for defining AI tasks, expected benefits and costs, knowledge limits, and human oversight."
  - label: "Circuit Mint companion article"
    url: "https://hob.farm/articles/the-card-catalog-started-talking-back/"
    note: "Documents the HobFarm source case used for the creative handoff example."
fieldRule: "Output is not a workflow."
commonDefault: "Ask one assistant to discover, decide, create, verify, package, and approve everything in one conversation."
replacementMethod: "Give each stage one job and put a human approval point between stages that can change the assignment or canon."
relatedArticle: "/articles/the-card-catalog-started-talking-back/"
draft: false
---

A long conversation with one chatbot can feel like a workflow. It has continuity, memory, and a pleasant sense that somebody is keeping the paperwork together.

Continuity is not the same as control.

A workflow is a sequence of jobs with defined inputs, outputs, checks, and stopping rules. One tool may perform several stages. Several tools may perform one stage. The human decides whether the handoff is valid.

## Historical ancestor: the composing room

A newspaper did not ask one machine to report, edit, set type, make plates, print, distribute, and approve the edition. Work moved through specialized people and equipment. Each stage transformed the material and introduced its own risks.

Modern creative and research systems are less physically visible, but the same question applies: what changed at this station, and who approved the next one?

## Select tools by job

Brand loyalty is a poor routing rule. Name the job first.

- Source discovery needs broad search and good retrieval.
- Document reading needs reliable access to the full document.
- Translation needs the original preserved beside the result.
- Note organization needs stable structure.
- Drafting needs a bounded evidence packet.
- Verification needs opened sources, not the drafting model's confidence.
- Image generation needs a visual source file and reference roles.
- Character-sheet extension needs identity preservation and permission to invent missing views.
- Publication needs human approval, rights checks, metadata, and a known destination.

The same tool can be good at several jobs. The route should still name them separately so a discovery result does not quietly become a final decision.

## Write a handoff contract

Every handoff needs five fields:

1. **Input:** What material enters this stage?
2. **Output:** What exact artifact should leave it?
3. **Human check:** What must be approved or verified?
4. **Next job:** Where does the approved artifact go?
5. **Stop condition:** What ends the stage?

For a research handoff, the input might be a question and source standard. The output is a source map, not an essay. The human opens the important sources. Only then does a drafting stage receive an evidence packet.

For a creative handoff, the input might be a source file and approved portrait. The output is a multiview sheet. The human checks identity, wardrobe inventions, and canon before any motion tool receives the asset.

## Worked example: the portrait route

The Circuit Mint sequence can be rewritten as an intentional route:

```text
Markdown source files
→ Meta interpretation
→ portrait + unsolicited system
→ human scope check
→ approved portrait only
→ second tool with a character-sheet job
→ multiview sheet
→ human canon review
```

The first tool did not have to be declared a total failure. The human cut the useful portrait away from the procedural drift. The second tool received a cleaner input and a job in which controlled invention was appropriate.

The authorial act sits in that cut.

## Required, optional, fallback

For each stage, record three routes:

- **required:** the capability the task must have;
- **optional:** a faster or richer tool when available;
- **fallback:** a simpler route that still produces a usable artifact.

A research project may prefer a connected browsing assistant but fall back to manual search and a Markdown table. A diagram may use polished SVG but fall back to semantic HTML. A video may be optional while the article remains complete with still images and captions.

Fallbacks keep the method from becoming a tour of subscriptions.

## Measure actual value

Time saved is not the whole ledger.

```text
time saved
− source checking
− correction
− scope cleanup
− accidental canon repair
− rework
= actual value
```

The checking cost is not automatically waste. Important work should be checked. Correction debt is different: time spent repairing choices the tool was never authorized to make.

If the debt keeps increasing, restart the stage. A fresh handoff can be cheaper than persuading a bad trajectory to become a good one.

## Exercise: draw one route

Choose a task you expect to finish this month.

1. Break it into named jobs.
2. Assign a required capability to each job.
3. List the preferred, optional, and fallback tool.
4. Write the input and output contracts.
5. Place human checks before factual conclusions, canon changes, purchases, uploads, publication, and sharing.
6. Add a stop condition to every stage.
7. Run the route once and record where a handoff saved time or introduced debt.

## Learner output: Tool Route Map

Keep the map small enough to use. A workflow diagram that requires its own project manager has recreated the bureaucracy it was meant to remove.

Revise the route after a real run. Promote repeated decisions into a source file. Turn repeated failure into a replacement rule. Delete stages that do not change the result.
