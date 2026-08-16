# Source excerpts

Short passages below are retained only to anchor the article's paraphrases. They were checked August 15, 2026.

## Cloudflare Cron Triggers

> Cron Triggers allow users to map a cron expression to a Worker using a scheduled() handler.

Use: cron is a trigger and alarm clock, not the agent's reasoning.

## Cloudflare Agents scheduling

> Scheduled tasks survive agent restarts and are persisted to SQLite.

Use: durable scheduling can carry state and invoke agent methods without describing every scheduled Worker as an agent.

## Anthropic, Building effective agents

> We recommend finding the simplest solution possible, and only increasing complexity when needed.

Use: agentic flexibility has real cost and latency tradeoffs.

## OpenAI Codex skills

> A skill packages instructions, resources, and optional scripts.

Use: skills are one current implementation pattern, not the universal definition of an agent.

## OpenAI AGENTS.md

> Files closer to your current directory override earlier guidance.

Use: durable instructions are scoped and ordered rather than one unlimited behavior file.

## OpenAI Codex customization

> Treat it as a feedback loop.

Use: recurring corrections can become durable guidance, which then also needs maintenance.

## Anthropic, Managed Agents

> Harnesses encode assumptions that go stale as models improve.

Use: an old workaround can become dead weight after a model change.

## Measuring Agents in Production, version 2

> Production agents favor simplicity and control.

Use: the article reports the paper's actual sample boundaries and percentages rather than converting the conclusion into a rule for every system.
