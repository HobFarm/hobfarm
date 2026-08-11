---
title: "Same Model, Different Surface"
excerpt: "Same prompt, same model, different interface. What happens between your prompt and the AI changes the output more than you think."
author: d00d
category: research
department: workshop-notes
format: workshop-note
status: published
tags:
  - stylefusion
  - research
  - ai-image-generation
  - grok
  - gemini
  - chatgpt
hero: https://cdn.hob.farm/blog/web-vs-api/same-model-different-surface-hero.jpg
heroAlt: "Same Model, Different Surface: API vs Web comparison across Gemini, ChatGPT, and Grok"
publishedAt: 2026-04-03
updatedAt: 2026-04-05
featured: true
draft: false
mesh:
  section: technology
  subjects:
    - model-behavior
    - ai-image-generation
    - platform-design
    - benchmarking
    - creative-tools
  series: []
  entities:
    people: []
    organizations:
      - google
      - openai
      - xai
    places: []
    events: []
    works: []
    publications: []
    technologies:
      - stylefusion
      - gemini
      - gpt-image
      - grok
  sourceArtifacts: []
  storyModes:
    - systems-investigation
    - technical-explainer
---

In [The Invisible Variable](/articles/invisible-variable/), I ran the same reference images through five extraction models and found that each one acts as a creative director. The vocabulary it chooses, the details it emphasizes, the art-historical references it invokes, all cascade into fundamentally different generation results. The extraction model isn't a passive observer. It's the first creative decision in the pipeline.

That study changed one variable at a time: the extraction model. Everything else stayed the same. This study does the same thing, but with a different variable.

When you send the same prompt to the same AI model through two different interfaces, you expect the same category of output. Style might vary. Generation is stochastic. But the fundamental interpretation of your instructions should hold. The model is the model.

Except it isn't. Not always.

## The Test

StyleFusion calls provider APIs directly. But each provider also offers a web interface where users can type prompts and generate images. The underlying model is the same. The prompt is the same. The only thing that changes is the surface: API versus web.

I ran three providers through both surfaces using the same IR: Google's Gemini (Nano Banana 2), OpenAI's GPT Image 1.5, and xAI's Grok Imagine. Six images total, three pairs. Same structured prompt. Same day. Same intent.

The IR (v4.1, extracted by Grok 4.20-beta reasoning model) describes a young woman with magenta hair standing waist-deep in a glowing pool, holding a radiant lotus flower inside an arched sanctuary at sunset. The style directive is explicit: psychedelic art, Art Nouveau illustration, 1960s poster art. The render mode is `illustration`. Not photorealistic. Not CGI. Illustration.

For the API versions, the compiled prompt was sent through StyleFusion's provider routing layer. For the web versions, the same compiled prompt text was entered directly into each provider's web chat interface. No additional system prompts, style presets, or interface-level modifications on either surface. Same words, different pipe.

The results tell three very different stories about what happens between the API and the browser.

## Gemini: The Consistent One

Gemini's Nano Banana 2 produced the most consistent pair. Both outputs are recognizably the same model interpreting the same prompt.

The API version has more dynamic energy: iridescent liquid splashes frame the edges, the color transitions are more fluid, and there's a vaporwave quality to the palette that feels like the model took the "psychedelic" anchor and ran with it. The web version is cleaner and more polished, closer to a vector illustration style. The composition is nearly identical: same arches, same pool, same palm tree, same sunset gradient, same frontal pose with the lotus.

The differences are subtle. The API output is looser, more willing to add visual noise and dynamic elements. The web output is tidier, as if someone turned up a "coherence" dial. But the fundamentals hold. Both are illustrations. Both respect the color palette. Both place the character correctly in the scene. You could put these side by side and immediately recognize them as siblings.

This is what consistency looks like. The surface changed; the model's interpretation didn't.

<figure class="article-wide">
  <img src="https://cdn.hob.farm/blog/web-vs-api/gemini-comparison.png" alt="Gemini comparison: Gemini Create Image Web vs Nano Banana 2 API, showing consistent interpretation across both surfaces with minor stylistic differences" />
  <figcaption>Gemini "Create Image" Web vs Nano Banana 2 API. Both surfaces produce siblings: same composition, same palette, minor stylistic variation.</figcaption>
</figure>

## GPT: Family Resemblance

GPT's pair shows more divergence, but the outputs still share a family resemblance.

The API version commits fully to the Art Nouveau psychedelic directive. Ornate arched frames with flowing organic curves, intense color saturation, swirling water patterns that fill the entire lower frame. It's maximalist in the way 1960s Fillmore posters were maximalist. Every surface gets a pattern. Every gradient gets pushed to saturation.

The web version lands in a different neighborhood. The architecture simplifies. Giant translucent lotus petals bloom behind the figure, adding a compositional element that isn't in the IR at all. There's a vertical light beam and sparkle effects that push the image toward contemporary anime-influenced digital art rather than vintage poster art. The facial rendering has that characteristic GPT smoothness that both versions share, and the overall warm magenta-to-orange palette holds.

You can see these came from the same model. The character reads as the same person. The mood is consistent. But the style interpretation shifted. The API went Art Nouveau maximalism. The web went contemporary fantasy illustration. The IR asked for psychedelic poster art; the API delivered it more literally, the web translated it into a more modern idiom. Neither is wrong, but they're making different creative decisions from the same input.

<figure class="article-wide">
  <img src="https://cdn.hob.farm/blog/web-vs-api/chatgpt-comparison.png" alt="ChatGPT comparison: ChatGPT Image Web vs GPT Image 1.5 API, showing family resemblance but divergent style interpretation" />
  <figcaption>ChatGPT Image Web vs GPT Image 1.5 API. Same model, same mood, different creative neighborhoods. The API went Art Nouveau maximalism; the web went contemporary fantasy.</figcaption>
</figure>

## Grok: Two Different Models

Then there's Grok.

<figure class="article-wide">
  <img src="https://cdn.hob.farm/blog/web-vs-api/grok-comparison.png" alt="Grok comparison: Grok Imagine Web vs Grok Imagine 1.5 API, showing dramatically different outputs that look like entirely different models" />
  <figcaption>Grok Imagine Web vs Grok Imagine 1.5 API. You would not guess these came from the same model, the same prompt, or the same session.</figcaption>
</figure>

The API output is a photorealistic render of the full scene. The arched pool hall is rendered with ornate Moroccan tilework, the water has convincing surface tension and reflection patterns, the sunset through the arches has atmospheric perspective. The character's face is realistic, the magenta hair is glossy but physically plausible, the lotus glows with subsurface scattering. It's a beautiful image. It's also completely wrong for what the prompt asked.

The IR specifies illustration as the render mode. Style anchors: "psychedelic art, art nouveau illustration, 1960s poster art." The negative constraints explicitly avoid "photorealistic skin pores." The API version ignores all of this and produces a photorealistic CGI render. But at least it gets the geography right: wide shot, arched sanctuary, pool, lotus, frontal pose.

The web version doesn't even do that. It collapses to a tight portrait crop, face and shoulders only, bathed in monochromatic purple light with glowing eyes. The arched sanctuary is gone. The pool is gone. The sunset horizon, the wide symmetrical composition, all gone. The subject holds the lotus, which is correct, but everything else about the scene description is discarded. It's a photorealistic close-up portrait that happens to share a color palette with the prompt.

<figure class="article-wide">
  <video controls playsinline autoplay loop muted width="100%" poster="https://cdn.hob.farm/blog/web-vs-api/grok-web.jpg">
    <source src="https://cdn.hob.farm/blog/web-vs-api/grok-video.mp4" type="video/mp4">
  </video>
  <figcaption>Grok Imagine generating on the web surface. The prompt asked for an illustration inside an arched sanctuary; the web collapsed it to a tight portrait crop.</figcaption>
</figure>

Put the Grok API and Grok web outputs side by side. You would not guess these came from the same model, the same prompt, or the same session. The API version at least reads the full scene description and places elements correctly. The web version seems to extract the subject and a mood, then generates its own interpretation of what the image should be.

Something is intervening between the model and the user on the web surface. Whether it's prompt rewriting, safety filtering that strips detail, a different default model configuration, or an intermediate system that summarizes the prompt before passing it to the generation model, the result is a fundamentally different creative interpretation. Not a different sample from the same distribution. A different distribution entirely.

## The Consistency Spectrum

Mapping these results:

**Gemini** sits at the high-consistency end. Both surfaces produce the same category of output with minor stylistic variation. The model's interpretation of the prompt is stable across surfaces.

**GPT** sits in the middle. Both surfaces produce recognizable outputs from the same model, but the creative interpretation diverges. The API is more literal with style directives; the web takes more creative liberty. Still the same world, different neighborhoods.

**Grok** sits at the low-consistency end. The two surfaces produce outputs that share almost nothing beyond the subject's hair color and the presence of a lotus flower. The API surface partially ignores style directives (photorealism override) but respects scene composition. The web surface ignores both style and composition, producing an entirely different image from the same prompt.

## Why This Matters

For casual users generating images through a chat interface, this inconsistency is invisible. You type a prompt, get an image, and evaluate it on its own merits. You never see what the API would have produced from the same input.

For anyone building structured generation pipelines, this is a critical variable. The model is not the only factor in output quality. The surface matters. The path between your prompt and the model's inference is not a transparent pipe. It's a processing layer that can rewrite, summarize, filter, or reconfigure your input before the model ever sees it.

The practical consequence: if you're evaluating a model's capabilities based on its web interface, you might be evaluating the interface, not the model. And if you're evaluating based on the API, you might be seeing capabilities that web users never access.

In [The Invisible Variable](/articles/invisible-variable/), the finding was that each extraction model is a creative director making aesthetic decisions that cascade through the pipeline. This study adds another finding: the delivery surface is also a creative variable, and for some providers, it's a bigger one than the model itself.

All three providers are producing genuinely good images. The question is whether the web surface accurately represents what the model can do. For Gemini, the answer is yes. For GPT, mostly. For Grok, the API and the web are telling very different stories about the same model, and the model itself is more capable than the web experience suggests.

## Update: Grok's Quality Mode Changes Everything (April 5, 2026)

The original test in this article was run on the morning of April 3. That same day, xAI shipped a Quality/Speed toggle for Grok Imagine on the web. Speed mode is the old behavior: fast generation, the tight crops and photorealistic overrides documented above. Quality mode uses what xAI describes as their "most advanced image generation model," producing four high-quality images instead of the infinite scroll.

I ran the same structured prompts through Grok's web interface in Quality mode with new subjects. The results are completely reversed.

<figure class="article-wide">
  <img src="https://cdn.hob.farm/blog/web-vs-api/grok-comparison2.png" alt="Grok comparison: Vampire pinup with bat wings. Web Quality mode produces full illustration with psychedelic forest, floating cubes, and complete style adherence. API produces photorealistic figure pasted into illustrated background." />
  <figcaption>Web Quality mode produces fully committed illustrated vampire pinups with psychedelic forests and floating geometric elements. The API puts photorealistic women against painted backgrounds with a visible seam between the figure and environment.</figcaption>
</figure>

<figure class="article-wide">
  <img src="https://cdn.hob.farm/blog/web-vs-api/grok-comparison3.png" alt="Grok comparison: Dark-haired vampire pinup. Same reversal. Web Quality mode commits to illustrated style with galaxy spirals and floating geometric elements. API renders photorealistic figure against painted background." />
  <figcaption>Same reversal with a different subject. Web Quality mode commits to the illustrated style with galaxy spirals and geometric elements. The API renders a photorealistic figure against a painted background.</figcaption>
</figure>

The web Quality mode now produces fully committed illustration-style outputs. Psychedelic forests with floating geometric elements, stylized character rendering, Art Nouveau curves in the environment, complete scene composition. The API, using the same prompt, still produces photorealistic figures composited against illustrated backgrounds. The style bleed between the photorealistic figure and the painted environment is visible in every API output.

The surface variable didn't just close the gap. It inverted the hierarchy. The web surface went from the least prompt-faithful to the most prompt-faithful Grok output in a single update.

<figure class="article-wide">
  <video controls playsinline autoplay loop muted width="100%" poster="https://cdn.hob.farm/blog/web-vs-api/grok-web-2.jpg">
    <source src="https://cdn.hob.farm/blog/web-vs-api/vampire-pinup.mp4" type="video/mp4">
  </video>
  <figcaption>Grok web Quality mode generating vampire pinup illustrations. The model fully commits to the illustrated style directive.</figcaption>
</figure>

This confirms something about the original finding: the "invisible variable" on Grok's web surface wasn't prompt rewriting or safety filtering. It was the model itself. The web interface was routing to a speed-optimized model that sacrificed prompt faithfulness for generation speed. The API routes to a different model. Quality mode gives web users access to what appears to be a third, even more capable model.

It also confirms something about the entire premise of this article: the surface matters, and the surface changes. xAI shipped a major update to their web generation pipeline on the same day I published a comparison showing the web surface was weaker. Two days later, the web is stronger. The API endpoint hasn't changed.

Any comparison of AI image generators is a snapshot, not a verdict. The models improve, the interfaces update, the routing changes. The value of structured testing isn't in producing permanent rankings. It's in building a methodology that can re-run the test whenever something changes and tell you exactly what shifted.

A Professional mode is expected later this month. When it ships, I'll run the same test again.

## Methodology

All six images were generated on April 3, 2026 using the same StyleFusion IR (v4.1, extracted by Grok 4.20-beta reasoning model). The IR compiles into a structured prompt with explicit slots for subject, scene, camera, lighting, color, texture, style, render mode, and negative constraints. For the web versions, the compiled prompt text was entered directly into each provider's web interface. For the API versions, the same compiled prompt was sent through StyleFusion's provider routing layer. No additional system prompts, style presets, or interface-level modifications were applied to either surface.

The IR, all six images, and the raw extraction data are available as a complete bundle for anyone who wants to reproduce the comparison or run it against additional providers.
