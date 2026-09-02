---
order: 1
tier: "1"
status: "active"
category: "tool"
type: "tool"
title: "StyleFusion"
subtitle: "Give every reference one job, build a reusable visual pack, and send the same clear positive direction to the image model that fits the work."
description: "StyleFusion turns one to six reference images into a modular visual pack and an inspectable positive prompt for image generation."
pubDate: 2026-02-15
updatedDate: 2026-09-02
primaryCta:
  label: "Open StyleFusion"
  href: "https://sf.hob.farm/"
secondaryCta:
  label: "Why positive direction matters"
  href: "/articles/gary-and-the-fork/"
heroVideo: "https://cdn.hob.farm/workshop/stylefusion/psychedelic-goth-motion-grok-a.mp4"
heroImage: "https://cdn.hob.farm/workshop/stylefusion/psychedelic-goth-reference-role-study-chatgpt.webp"
logo:
  url: "../../images/projects/placeholder.svg"
  alt: "StyleFusion logo"
image:
  url: "../../images/projects/placeholder.svg"
  alt: "StyleFusion interface"
stack:
  - Cloudflare Workers
  - Cloudflare D1
  - Cloudflare R2
  - Workers AI
  - AI Gateway
  - React
  - Vite
  - Hono
highlights:
  - Simple Subject, Style, and Composition reference roles
  - Modular packs containing only the visual decisions a project needs
  - Model-authored positive prose derived from the canonical pack
  - Targeted module revisions without rebuilding the whole visual system
  - Pose and scene structure that can transfer between different subjects
  - Same-pack generation across multiple image models
features:
  - title: "Assign Reference Jobs"
    description: "Tell StyleFusion which images supply the Subject, Style, or Composition. A reference may combine roles."
  - title: "Build a Modular Pack"
    description: "Emit Subject, Pose or Placement, Style, Environment, and Shot modules only when the project needs them."
  - title: "Assemble Positive Direction"
    description: "Translate the pack into complete model-authored prose that describes the intended picture instead of repeating unwanted elements."
  - title: "Inspect the Handoff"
    description: "Keep the exact prompt with the pack so the direction can be reviewed, edited, downloaded, and reused."
  - title: "Revise One Part"
    description: "Change the participating pose, shot, or environment direction while the rest of the visual system stays intact."
  - title: "Transfer a Module"
    description: "Reuse a structured pose with another subject, or keep the subject while changing the scene, camera, and framing."
  - title: "Choose the Generator"
    description: "Send one completed handoff to different image models without making a provider part of the canonical visual record."
  - title: "Keep the Work Together"
    description: "Store projects, references, packs, prompts, and generation history in one working application."
---

StyleFusion is HobFarm's working reference-image application. Add a small set of images, give each one a clear job, build a reusable pack, inspect the exact positive prompt derived from it, and choose an image model for the final generation.
