# HobFarm Grimoire and Admin AI

Focused reference extracted from the former root repository guide. Read it when the root `AGENTS.md` routes the current task here.

## Grimoire Rules

Grimoire is the knowledge and structure layer.

Use Grimoire for:

* rough notes
* reference organization
* project memory
* article seeds
* gallery seeds
* workshop seeds
* character and series notes
* link maps
* admin planning
* Codex task packets
* model-generated structure that needs review

Grimoire is not the main public publication layer. Articles are the public editorial layer.

Public Grimoire pages should exist only when they are useful to readers. Otherwise, Grimoire can remain internal, admin-facing, or semi-private.

When adding Kimi or Workers AI features, prefer Grimoire workflows before generic chatbot workflows.

Useful Kimi-powered Grimoire modes:

* ingest note
* extract concepts
* link related entries
* article brief
* gallery brief
* workshop brief
* Codex packet
* Codex plan review
* build error debug
* social fragment generator

Do not auto-publish AI-generated content. Generate, review, then publish.

---

## Admin AI Rules

Admin AI tools are private.

They may help with:

* article drafts
* frontmatter repair
* tag generation
* Grimoire entry resolution
* Codex task packets
* build error diagnosis
* social captions
* gallery briefs
* workshop notes

They must not be public unless explicitly requested.

Use server-side functions. Do not call model APIs directly from browser-only code.

Protect admin endpoints with existing auth. If no auth exists, use a server-side secret until a proper admin gate is connected.

Do not expose secrets in client code.

For Cloudflare Workers AI, use a binding named `AI` when implemented.

---
