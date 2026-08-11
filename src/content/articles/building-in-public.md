---
title: "Building in Public with AI Tools"
excerpt: "What happens when you treat AI models as collaborators instead of code generators. Multi-agent workflows, schema-first design, and the CC task brief pattern."
author: d00d
category: technical
department: workshop-notes
format: workshop-note
status: published
tags:
  - ai
  - workflow
  - hobfarm
hero: https://cdn.hob.farm/pages/blog/building-in-public.png
publishedAt: 2026-03-01
featured: true
draft: false
mesh:
  section: technology
  subjects:
    - artificial-intelligence
    - creative-workflows
    - multi-agent-systems
    - schema-design
    - publishing-workflow
  series: []
  entities:
    people: []
    organizations:
      - hobfarm
    places: []
    events: []
    works: []
    publications: []
    technologies:
      - artificial-intelligence
      - codex
  sourceArtifacts: []
  storyModes:
    - technical-explainer
    - process-essay
---

## The Multi-Agent Workflow

Most developers interact with AI one model at a time: paste a problem, get a response, iterate. HobFarm takes a different approach. We route tasks to specialized agents based on shape, not difficulty. Scaffolding and parallel file changes go to one agent. Precision refactoring and business logic go to another. Structural validation and schema enforcement go to a third.

This is not about having more agents. It is about each agent operating in its strongest mode. A reasoning model excels at untangling complex conditional logic but wastes cycles on boilerplate. A code generation model can scaffold twenty files in seconds but struggles with subtle architectural decisions. Matching the task shape to the right agent eliminates the "close but wrong" iterations that eat hours.

## Schema-First Design

Every feature at HobFarm starts with a schema, not a UI mockup, not a code stub. The TypeScript interface or Zod definition comes first. This forces clarity: what data does this feature need? What are the constraints? What relationships exist? Once the schema is locked, implementation becomes mechanical. The agents can scaffold from the schema with confidence because the contract is explicit.

This pattern extends to our content system. Articles, gallery entries, project showcases, changelog items: each has a Zod schema that serves as both validation and documentation. PagesCMS reads the same schema definitions. The CDN paths follow the same naming conventions. One source of truth propagates everywhere.

## The CC Task Brief

When a task requires precision (refactoring a billing function, writing editorial copy, debugging a race condition), we write a CC task brief. This is a structured prompt that includes: the exact file path, the current behavior, the desired behavior, relevant context from other files, and constraints. No ambiguity, no "figure out what I mean." The brief is the handoff protocol between the architect and the craftsman.

The result: fewer iterations, less backtracking, and a clear audit trail. Every decision has a documented reason. When something breaks six months later, the brief explains why the code was written that way.

## What We Have Learned

The biggest lesson: cost awareness needs to be first-class. Every API call has a price. Routing based on value (not just capability) changes how you architect systems. The second lesson: thin abstractions beat thick ones. Provider APIs change constantly. The routing layer should normalize only the common patterns and let provider-specific features through when they matter.
