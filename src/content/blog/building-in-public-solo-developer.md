---
title: "Building in Public as a Solo Developer"
excerpt: "What it actually takes to ship a creative AI platform alone: the trade-offs, the tooling, and why Cloudflare's edge stack changes the economics."
publishedAt: 2026-03-10
category: "business"
tags: ["solo-dev", "indie", "cloudflare", "business-model"]
hero: https://cdn.hob.farm/pages/blog/solo_developer_hero.png
---

HobFarm is a one-person operation. That's not a limitation statement; it's an architecture decision. When your team is one, every technical choice is also a business choice. Here's what that looks like in practice.

## The Stack as Business Model

The conventional path for an AI image platform: rent GPU instances, stand up a Kubernetes cluster, hire a DevOps person, burn through runway. That model requires funding before revenue.

HobFarm's approach: serverless everything. Cloudflare Workers for compute, D1 for data, R2 for storage, Pages for hosting. The marginal cost of an additional user is measured in fractions of a cent. There's no idle infrastructure billing. When nobody's using StyleFusion at 3 AM, the cost is zero.

This isn't a philosophical choice. It's a survival mechanism. A solo developer can't babysit servers. Serverless means I sleep through the night and the platform keeps running.

## What I Actually Spend Time On

The common assumption is that solo developers are drowning in operational work. In reality, the time split looks roughly like this:

**60% creative and product work:** building StyleFusion's pipeline, expanding the Grimoire, writing content, generating gallery pieces. The stuff that actually makes the product better.

**25% tooling and automation:** building HobBot, writing deployment scripts, setting up monitoring. Investment that reduces future operational load.

**15% everything else:** support, legal, business admin, the occasional fire drill.

That ratio is only possible because the infrastructure is self-managing. If I were running VMs, the "everything else" category would eat the whole pie.

## Trade-offs Worth Making

Going solo means accepting real constraints:

**No real-time support.** Response times are measured in hours, not minutes. The help center and documentation exist specifically to reduce the need for direct support.

**Slower feature velocity.** One person can't ship features as fast as a team. The counter-argument: one person can ship more *coherent* features, because there's no coordination overhead and no design-by-committee.

**Single point of failure.** If I'm sick, nothing gets updated. The mitigation: automate everything that can be automated (that's HobBot's whole purpose), and design the system to run unattended for days without degrading.

## The Goal

HobFarm isn't trying to be the next Midjourney. The goal is a sustainable creative tools platform that generates enough revenue to justify the time investment, produces work I'm proud of, and demonstrates that the solo developer model works for AI-powered products if you pick the right infrastructure.

The "building in public" part means you get to watch that experiment play out in real time. The blog, the changelog, the gallery, it's all evidence of the process.
