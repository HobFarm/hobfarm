---
courseSlug: intellectual-self-defense
slug: give-the-chatbot-a-research-job
title: "Give the Chatbot a Research Job"
deck: "Turn a generic conversation into a bounded assignment with a source standard, scope boundary, output, and stop condition."
order: 1
moduleTitle: "Module 1 — Using AI to learn"
moduleOrder: 1
duration: "10–12 minutes"
skill: "Write reusable, model-agnostic instructions for a source-conscious research assistant."
learnerOutput: "A personal Research Assistant Contract."
prerequisites:
  - "Orientation: The Card Catalog Talks Back"
inputs:
  - "One small factual question"
  - "The Research Chatbot Custom Instructions download"
figure:
  src: "https://cdn.hob.farm/self-defense/lessons/01-name-the-job/name-the-job-control-panel-v1.svg"
  alt: "Research assistant control panel listing role, question, freshness, scope, source preference, evidence labels, output, and stop condition beside a warning gauge for vague questions."
  caption: "A vague question lets the model choose the job. A contract makes the job inspectable."
downloads:
  - label: "Research Chatbot Custom Instructions"
    href: "https://cdn.hob.farm/self-defense/downloads/research-chatbot-custom-instructions.md"
    format: Markdown
sourceNotes:
  - label: "NIST AI RMF Core"
    url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/"
    note: "NIST's Map function calls for defining the tasks, methods, knowledge limits, expected uses, and human oversight of an AI system."
  - label: "NIST Generative AI Profile"
    url: "https://doi.org/10.6028/NIST.AI.600-1"
    note: "Supports explicit source verification, limitation notes, and human review rather than assuming fluent output is reliable."
fieldRule: "Define the job before judging the answer."
commonDefault: "Ask 'Tell me everything about this' and let the model silently choose the scope, evidence standard, and conclusion."
replacementMethod: "Name the question, freshness window, preferred sources, evidence labels, deliverable, permission boundary, and stop condition."
relatedArticle: "/articles/the-card-catalog-started-talking-back/"
draft: false
---

## A chatbot can wear several hats

A chatbot may act like a cataloger, translator, comparator, organizer, writer, analyst, recommender, or generator. Those jobs can share one text box, which makes them easy to confuse.

Ask for “everything about” a subject and the system has to decide what *everything* means. It chooses a level of detail, date range, source mix, tone, and stopping point. It may also decide that you want a conclusion when you only needed a map.

The problem begins before any wrong fact appears. The assignment is underdefined.

A Research Assistant Contract names the job in advance. It is not a spell and it does not guarantee obedience. It gives you a stable standard for comparing the request with the response.

## What the control panel shows

The figure turns the contract into eight controls:

1. Role and research question.
2. Required freshness.
3. Scope boundary.
4. Primary-source preference.
5. Evidence labels.
6. Output format.
7. Ask-before-expanding rule.
8. Stop condition.

The warning gauge shows what happens when those fields remain blank: the model chooses the job. A polished answer can hide that choice because it makes the selected route sound inevitable.

## Earlier mechanism, current interface

Research briefs existed before chatbots. Editors assigned a question, a length, a deadline, a jurisdiction, and a standard of proof because “look into this” was not enough to coordinate serious work.

The modern difference is speed. A model can begin filling gaps before you notice that the brief is incomplete. The contract slows down the first thirty seconds so you do not spend the next thirty minutes correcting a confident detour.

NIST's AI Risk Management Framework asks organizations to define intended tasks, knowledge limits, uses, and human oversight. You do not need an enterprise risk office to borrow the principle. Define the task and the human check.

## Build the contract

Open the downloadable Markdown file. Replace the generic fields with your own working rules.

Start with the role:

> Help me locate, inspect, compare, translate, and organize evidence. Do not replace my judgment or close the question before the evidence supports closure.

Then add the question. Make it testable. “Is this company bad?” contains a decision, a vague standard, and no time range. “What primary records document the company's layoffs between January 2025 and July 2026, and what explanations did the company and affected workers give?” is still imperfect, but it identifies evidence and scope.

Set the source preference. Primary does not always mean better, and secondary does not mean weak. A court filing may establish what was alleged, not what happened. A scholarly review may compare evidence more usefully than one original study. Your rule should ask what each source can establish and what it cannot.

Set the permission boundary. Tell the assistant to ask before expanding the assignment, changing the deliverable, or writing the final opinion.

Set the stop condition. “Stop when the evidence is insufficient” prevents missing receipts from being repaired with smooth connective prose.

## Demonstration: same question, different job

Generic request:

> Tell me everything about whether card catalogs were better than search engines.

Bounded request:

> Map the differences between a physical card catalog and a modern online library catalog as discovery interfaces. Use Library of Congress material first. Separate documented features from your interpretation. Do not decide which is better. Return a source map, two limits for each interface, and any unresolved questions. Stop after five strong sources.

The second request does not guarantee a correct answer. It makes failure easier to see. If the system returns a culture-war essay, invents a statistic, or expands into web search generally, the mismatch is legible.

## Guided exercise

Choose a small factual question that matters enough to check and is narrow enough to finish today.

Fill these fields:

- Question and freshness window.
- Assumptions embedded in the question.
- Preferred source types.
- Evidence labels.
- Required output.
- Decisions the assistant may not make.
- Stop condition.

Run the request once. Do not correct the answer yet. Compare the output with the contract and mark where it followed, interpreted, or expanded the job.

## Independent exercise

Adapt the contract to one subject you actually follow. A medical question needs a different source standard from a film-history question. A local event needs a different freshness window from an old design technique. Write those differences into the file instead of carrying them in your head.

## Check your work

- [ ] The question can be answered or marked unresolved.
- [ ] Time-sensitive claims have a freshness window.
- [ ] The source hierarchy fits the subject.
- [ ] Evidence, inference, and opinion have separate labels.
- [ ] The assistant must ask before broadening the job.
- [ ] The stop condition permits an incomplete answer.

Save the file outside the chat. A reusable contract becomes part of your research system only when you can inspect and revise it later.
