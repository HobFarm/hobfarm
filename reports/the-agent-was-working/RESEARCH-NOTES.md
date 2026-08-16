# Research notes

Checked August 15, 2026.

## Documentary record

- The complete H0BBOT screenshot is 1524 by 4549 pixels, 425,017 bytes, with SHA-256 `c2e7c82067a563eed1c3d210dcaafeff51e91f773575b291743510094910aaf2`.
- It visibly records a February 2, 2026 join date, 20 posts, and the post titles retained in the article.
- The live Moltbook route still resolves, but the current HTML shell loads profile data client-side. The fixed author-owned screenshot is the readable documentary source.
- The article uses one native-resolution top crop and links the crop to the complete screenshot through the existing article lightbox.

## Agent and workflow definitions

- Cloudflare Cron Triggers map a cron expression to a Worker's `scheduled()` handler and execute on UTC time.
- Cloudflare Agents scheduled tasks persist to SQLite, survive restarts, and can use state, services, and agent methods.
- Anthropic distinguishes workflows, where code defines the path, from agents, where the model directs its own steps and tool use. It recommends the simplest sufficient system because agentic complexity trades latency and cost for flexibility.
- Official OpenAI documentation describes Codex skills as `SKILL.md` packages with optional scripts, references, and assets. It describes progressive disclosure, scoped `AGENTS.md` precedence, and recurring-correction maintenance.
- OpenAI Sandbox Agents document the execution layer hidden by a prompt-only demo: filesystem, commands, packages, ports, snapshots, external-system controls, and resumable state.
- Anthropic's April 2026 managed-agent report explicitly warns that harness assumptions can become stale as models improve.

## Production study

Version 2 of *Measuring Agents in Production* was updated June 4, 2026. The study ran from April through November 2025, used 20 interview case studies, surveyed 306 practitioners across 26 domains, and filtered its main paper to 86 production or pilot systems.

For that 86-system subset:

- 79 percent used manual or manual-plus-model prompt construction.
- 68 percent executed fewer than ten steps before human intervention.
- 47 percent executed fewer than five steps.
- 74 percent primarily used human-in-the-loop evaluation.
- Sixteen of 20 interview case studies used structured workflows.

The article labels the paper as a preprint and does not treat the sample as a universal law.

## Current and historical HobFarm architecture

- The March 13 Workshop Note is a dated record of the earlier ambition for scheduled workers, publishing logistics, monitoring, Grimoire maintenance, article drafting, and social variants.
- The private HobBot repository currently labels the project paused because provider, operating, and maintenance costs exceed the current budget. It is not described as an active hosted service.
- The current Grimoire contract is local-first. Authored Markdown and JSON are canonical; SQLite and small versioned consumer packs are generated views.
- Current Grimoire instructions explicitly quarantine the old workers, queues, atoms, plasticity, and autonomous-agent experiments as legacy inputs rather than the runtime model.
- StyleFusion consumes a bounded Grimoire contract. Wildcard Machine consumes deterministic machine packs for EZIZE. Wonder Machine consumes versioned world packs and owns mutable Other Alice session state.
- The historical gateway marker moving crons, providers, R2, and pipeline work to a narrower service still exists inside the paused legacy HobBot code. The article does not present that marker as the current Grimoire architecture.

## Schedule

- Predecessor: *The Salton Sea Needs an Outlet*, August 26, 2026 at 4:20 p.m. PDT.
- Exact one-day slot: August 27, 2026 at 4:20 p.m. PDT.
- Collision check: no integrated article occupied that timestamp on August 15, 2026.
- Selected timestamp: `2026-08-27T16:20:00-07:00`.
