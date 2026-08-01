---
order: 9
tier: '3'
status: 'live'
category: 'tool'
type: 'tool'
title: 'HobBot'
subtitle: 'Multi-agent content orchestration connecting knowledge extraction, social publishing, and conversational AI.'
description: 'HobBot is the automation layer behind HobFarm public presence. It manages content generation and scheduling for X/Twitter, ingests and scores RSS feeds for relevance, extracts knowledge from external sources into the Grimoire, and serves as the backend for the Grimoire chat interface.'
oneLiner: 'Multi-agent orchestration connecting knowledge extraction from external sources, social publishing to @h0bbot, and conversational AI through the Grimoire chat interface.'
pubDate: 2024-04-10
repoUrl: 'https://github.com/hobfarm/hobbot'
logo:
  url: '../../images/projects/placeholder.svg'
  alt: 'HobBot logo'
image:
  url: '../../images/projects/placeholder.svg'
  alt: 'HobBot architecture'
stack:
  - Cloudflare Workers
  - D1
  - R2
  - KV
  - Grok
  - TypeScript
highlights:
  - Automated content pipeline from idea to published post
  - RSS feed ingestion with relevance scoring
  - Knowledge extraction pipeline feeding the Grimoire
  - Backend for the Grimoire chat interface
features:
  - title: 'Content Pipeline'
    description: 'Generates, schedules, and publishes content to X/Twitter with the Atomic Noir visual identity.'
  - title: 'Knowledge Extraction'
    description: 'Pulls structured information from RSS feeds and external sources, scores it for relevance, and routes findings into the Grimoire.'
  - title: 'Chat Backend'
    description: 'Powers the conversational interface at hob.farm/grimoire.'
  - title: 'Agent Architecture'
    description: 'Two-worker system with dedicated roles. The agent handles decision-making and routing. The worker handles execution, storage, and delivery.'
---

HobBot operates invisibly, managing the repetitive extraction and storage jobs that power the visible layers of the ecosystem.
