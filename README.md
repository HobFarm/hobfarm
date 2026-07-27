# HobFarm

HobFarm is an independent publisher and creative systems workshop in Las Vegas. It publishes articles, illustrated fiction, visual archives, browser experiments, and tools for structured generation.

[Visit hob.farm](https://hob.farm) · [Explore projects](https://hob.farm/projects/) · [Other Alice Adventures](https://hob.farm/departments/hobfarm-presents/) · [StyleFusion](https://hob.farm/workshop/stylefusion/) · [Grimoire](https://hob.farm/grimoire/)

## Current work

### Wonder Machine

A schema-driven interactive-fiction engine being developed for Other Alice Adventures. The engine is designed around persistent world state, validated storylets, player choice, generated narration, and illustrated scene output. The first release is text-first. Image, voice, and video layers can attach to the same resolved game state later.

Status: architecture and prototype work. A separate public repository is planned once the contribution boundary and licensing are ready.

### StyleFusion

A structured reference-image system that assigns explicit roles to source images, extracts a traceable Intermediate Representation, compiles provider-ready prompts, and exports reusable generation records.

The application is in private development. The public [StyleFusion repository](https://github.com/HobFarm/StyleFusion) contains the project brief and selected technical documentation, not the proprietary application source.

### Grimoire

The private knowledge and context layer beneath HobFarm's generation workflows. Grimoire stores reviewed sources, schema-backed records, correspondences, versioned packs, and validation traces so models and providers can change without taking the durable project knowledge with them.

The private repository is not linked publicly. The public system description lives at [hob.farm/grimoire](https://hob.farm/grimoire/).

### hob.farm

This repository contains the public website: an Astro 6 application deployed through Cloudflare. Articles, project pages, galleries, workshop material, and public story-world pages live here. Large media is served from Cloudflare R2 rather than stored in Git.

## Stack

- Astro 6, TypeScript, React, and Tailwind CSS v4
- Cloudflare Pages, Workers, D1, KV, and R2
- Markdown, JSON, and schema-validated content pipelines
- Local development in VS Code with Codex, Claude Code, and task-specific agents
- OpenAI and other model providers behind project-level adapters

## Working model

```text
local files and source packs
        ↓
VS Code + coding agents
        ↓
validation and local review
        ↓
Git commit to main
        ↓
GitHub
        ↓
Cloudflare build and deployment

large media → project R2 bucket → public CDN URL
```

The website uses a single-branch workflow. Work is validated locally before a commit. A push to `main` is a publication action because Cloudflare deploys from that branch.

## Public and private boundaries

Public repositories contain code, documentation, and examples intentionally exposed for inspection. They must not contain credentials, customer data, private source packs, raw prompt corpora, paid downloads, unreleased story material, high-resolution private assets, or local provider configuration.

Unless a repository includes a license granting reuse, HobFarm code, documentation, story worlds, and media remain all rights reserved.

## Run the website locally

```bash
npm install
npm run dev
npm run build
```

See `AGENTS.md` for repository procedure and `package.json` for the current validation commands.

## Collaboration

HobFarm is open to serious technical feedback, project collaboration, and funding conversations around Wonder Machine, structured generation, interactive fiction, multimodal storytelling, and durable AI context systems.

Use the [HobFarm contact page](https://hob.farm/contact/) for direct inquiries.

---

Built and published by HobFarm. All rights reserved.
