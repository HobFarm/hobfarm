---
title: "History and Providers"
description: "Managing your generation history, configuring API providers, and understanding model options."
project: "stylefusion"
section: "managing"
order: 1
publishedAt: 2026-03-13
---

## History Page

Every generation is automatically saved to your browser's IndexedDB. The History page displays them as a thumbnail grid.

### Browsing History

Thumbnails load in reverse chronological order (newest first), 20 per page. Scroll down and click **Load More** for older entries.

**Provider filter pills** across the top let you narrow the view: "All" plus one pill per unique provider you've used. This is useful when comparing how different models handled the same content.

A generation count displays the total number of stored entries.

### Viewing Details

Click any thumbnail to open a detail modal showing:

- Full-size generated image
- Provider and model used
- Aspect ratio
- Timestamp
- First 500 characters of the prompt that produced it

This is your comparison tool. Open multiple entries to see how changes to the IR, arrangement, or model affected the output.

### Managing History

**Delete individual entries:** hover a thumbnail and click the X button.

**Clear all history:** the red **Clear History** button at the top deletes everything. This is permanent; there's no undo.

History lives in your browser's IndexedDB. It persists across sessions but doesn't sync across devices or browsers. If you clear browser data or switch browsers, history is gone. For important generations, download the images from the hover controls in the Workspace.

## Providers Page

The Providers page is your dashboard for API connections. It shows every supported provider, their available models, and your connection status.

### Dashboard Overview

Header stats show: total providers, total models, and how many use direct API connections versus proxied.

**Filter buttons:** All, Direct API, Proxy.

- **Direct API** providers are ones where your API key connects directly to the provider's service (Gemini, OpenAI, Grok, BFL, Z.AI).
- **Proxy** providers route through an intermediary, typically fal.ai (which provides access to Flux variants, SeedDream, Recraft, Bria upscaling, and others).

### Provider Cards

Each card in the three-column grid shows:

- Provider name
- Badge: DIRECT, PROXY, or PLANNED
- List of available models
- Key status (green dot if configured)

### Setting Up a Provider

1. Click the **Settings gear** in the navbar
2. Find the provider's API key field
3. Paste your key
4. Click **Test Connection** to validate

Keys are stored in browser memory only. They're never transmitted to HobFarm's servers. A green dot appears in the navbar for each configured provider.

You need a minimum of two providers configured: one that handles extraction (Gemini, OpenAI, or Grok) and one that handles image generation (any of the above plus fal.ai, BFL, or Z.AI).

### Selection Mode

When you click "Change" next to the active model in the Workspace's left panel, the Providers page enters selection mode. A banner reads "Selecting: [IR Model or Image Model]." Click any available model to select it and return to the Workspace.

### Provider Details

**Gemini (Google, Direct):** handles both extraction and image generation. Good all-around choice for getting started with a single key.

**OpenAI (Direct):** extraction and image generation through OpenAI image-generation models. Strong natural language interpretation.

**fal.ai (Proxy):** access to a wide range of models: Flux variants (via BFL), SeedDream, Recraft, and Bria upscaling. One API key unlocks multiple models.

**Bria (via fal.ai):** Creative Upscale only. Not a generation model. Requires fal.ai key.

**xAI Grok (Direct):** extraction and image generation. Tends toward photorealistic results.

**BFL / Black Forest Labs (Direct):** Flux models direct. If you want Flux without going through fal.ai's proxy.

**Z.AI / Zhipu (Direct):** CogView models. Worth testing for specific aesthetic styles.

### Default Models

In Settings, below the API key section, you can set a default extraction model. This persists to localStorage and applies every time you open StyleFusion. The image generation model is selected per-session from the Workspace's right panel.
