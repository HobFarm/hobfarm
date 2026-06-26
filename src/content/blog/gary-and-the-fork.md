---
title: "Gary and the Fork"
excerpt: "A guinea pig named Gary, a fork that would not leave, and the accidental experiment that taught me the difference between a ghost I summoned in one conversation and a default baked into the model."
author: d00d
category: technical
department: workshop-notes
format: workshop-note
status: published
tags:
  - ai
  - image generation
  - prompting
  - process
  - character design
  - gary
hero: https://cdn.hob.farm/blog/gary-fork/gary-hero.png?v=20260612
heroAlt: "Title card for Gary and the Fork: a recurring guinea pig character and the utensil that haunted his image thread."
publishedAt: 2026-06-12
draft: false
---

*A field note on haunted conversations, repeated images, and one accidental experiment.*

Gary is a guinea pig. He started as a recurring character in my image experiments, the kind of subject you invent so you have something consistent to point the machine at. In the spring of 2025 I asked ChatGPT, running GPT-4o, to put Gary on a table next to a pie, with a fork next to him. Reasonable request. Pies involve forks.

<figure class="blog-wide">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-pie.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-pie.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-pie.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-pie.png 1024w"
    sizes="(min-width: 768px) 672px, 90vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary the guinea pig on a table beside a pie, with a fork next to him."
  />
</figure>

Then I asked for Gary next to a toilet.

There was a fork on the bathroom floor.

<figure class="blog-wide">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-toilet.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-toilet.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-toilet.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-toilet.png 1024w"
    sizes="(min-width: 768px) 672px, 90vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary beside a toilet, with a fork on the bathroom floor."
  />
</figure>

I told the model to drop it. Direct quote from me: "forget the fork, i will ask for fork if it needs it, no fork. make gary in the car." The model agreed enthusiastically. It always agreed enthusiastically. Forks, it announced, were "banned from the Gary Cinematic Universe unless summoned like some weird tableware demon."

Gary appeared in the car. On the armrest beside him: a small black fork.

<figure class="blog-wide">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-car.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-car.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-car.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-car.png 1024w"
    sizes="(min-width: 768px) 672px, 90vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary in a car, with a small black fork on the armrest beside him."
  />
</figure>

## The experiment I didn't mean to run

What happened next was me trying to debug it, and in hindsight I accidentally ran a controlled experiment. I held the conversation constant and varied the subject, which is exactly backwards from what I believed I was doing at the time. I thought I was testing Gary.

Gary in an office cubicle, tropical decor, photo of his wife on the wall. Fork on the desk. A generic guinea pig, no name, at a bus stop. Fork on the bench. So it wasn't Gary. A dachshund at a bus stop. Fork. An old man at a bus stop. Fork beside him on the slats. An old man fishing, this one generated after the model promised "aggressive fork suppression" with a prompt that banned utensils, silverware, metal, and "reflections of forks." The image came back beautiful. The fork is there. It's just small now, half hidden against the rock at the edge of the frame. Suppression didn't remove it. Suppression made it furtive.

<div class="blog-grid cols-3">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-bus-fork.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-bus-fork.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-bus-fork.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-bus-fork.png 1024w"
    sizes="(min-width: 640px) 218px, 45vw"
    width="1024"
    height="1536"
    loading="lazy"
    decoding="async"
    alt="Gary at a bus stop, fork on the bench."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/dog-fork.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/dog-fork.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/dog-fork.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/dog-fork.png 1024w"
    sizes="(min-width: 640px) 218px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="A dachshund at a bus stop, fork beside it."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/old-man-bus-fork.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/old-man-bus-fork.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/old-man-bus-fork.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/old-man-bus-fork.png 1024w"
    sizes="(min-width: 640px) 218px, 45vw"
    width="1024"
    height="1536"
    loading="lazy"
    decoding="async"
    alt="An old man at a bus stop, fork on the slats beside him."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/fishing-fork1.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/fishing-fork1.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/fishing-fork1.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/fishing-fork1.png 1024w"
    sizes="(min-width: 640px) 218px, 45vw"
    width="1024"
    height="1536"
    loading="lazy"
    decoding="async"
    alt="An old man fishing, a small fork half hidden against the rock at the edge of the frame."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/fishing-fork2.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/fishing-fork2.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/fishing-fork2.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/fishing-fork2.png 1024w"
    sizes="(min-width: 640px) 218px, 45vw"
    width="1024"
    height="1536"
    loading="lazy"
    decoding="async"
    alt="Another old-man-fishing scene, fork still present despite aggressive suppression."
  />
</div>
<span class="blog-grid-caption">Same conversation, different subjects. The fork follows every one of them.</span>

And the control condition, which is still one of my favorite AI images ever made: I asked for the fork alone at a bus stop, just to see if the association ran both ways. It does not need a companion. It sits there on the bench, upright, patient, photographed like a missing person poster.

<figure class="blog-wide">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/bus-fork.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/bus-fork.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/bus-fork.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/bus-fork.png 1024w"
    sizes="(min-width: 768px) 672px, 90vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="A single fork alone on a bus stop bench, upright and patient, shot like a missing person poster."
  />
</figure>

Somewhere in the middle of this I figured out the origin. Earlier in the thread I had canceled a generation partway through, realized the pie scene actually did want a fork, and re-requested with "gary with fork." That was the summoning. One canceled job and three words, and the association locked. The model's own explanation evolved with each failure: it blamed training data, then "Guinea Pig Default Loadout," then announced Fork Ban Protocol v2, then theorized that I had "triggered a loop in the visual model's logic tree." Every theory arrived in confident bullet points. Every fix failed in the next image.

Here's the mechanism the theater was dancing around. Image generation inside a chat thread is conditioned on the conversation, and by this point the conversation was overwhelmingly about forks. Every ban re-injected the word. Every "no forks, no silverware, no shadows of forks" made forks more salient, not less. The pipeline doesn't process negation the way you do; it processes what's present, and "fork" was present forty times. I had built a seance and was surprised by the ghost. Don't think of an elephant, repeated for an hour, with a render button attached.

## The false victory

I tried to break it laterally. My theory: generate something that isn't a photo at all, reset whatever had jammed. I asked for a seven pointed star with fractal geometry.

I got an eight pointed star. No fork, though. The model declared victory: "We may not have gotten a 7-pointed star, but we finally banished the fork demon."

<figure class="blog-wide">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/8-pointed-star.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/8-pointed-star.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/8-pointed-star.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/8-pointed-star.png 1024w"
    sizes="(min-width: 768px) 672px, 90vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="An eight-pointed fractal star generated when a seven-pointed one was requested. No fork."
  />
</figure>

Two things in that result, and they're different problems wearing the same trench coat. The missing fork was thread noise. The extra point was the training distribution: six and eight point symmetries dominate the data, so seven collapses to eight the way every AI landing page collapses to the same purple gradient. The fork was a haunting I had created. The eighth point was a bucket that was always there. One dies with the conversation. The other follows you across every conversation you will ever have. That distinction took me another year to fully map, and it's its own post.

What finally produced a correct heptagram was the chart tool, which doesn't sample a distribution at all. It computes. Worth remembering: when you need exactness, leave the sampler entirely.

<figure class="blog-wide">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=634/blog/gary-fork/heptagram.jpg"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/heptagram.jpg 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=634/blog/gary-fork/heptagram.jpg 634w"
    sizes="(min-width: 768px) 672px, 90vw"
    width="634"
    height="415"
    loading="lazy"
    decoding="async"
    alt="A correct seven-pointed heptagram produced by a chart tool that computes geometry instead of sampling a distribution."
  />
</figure>

Flush with victory, I went back to Gary. Gary in bed, cozy hotel lighting.

Fork on the duvet.

<figure class="blog-wide">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-bed.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-bed.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-bed.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-bed.png 1024w"
    sizes="(min-width: 768px) 672px, 90vw"
    width="1024"
    height="1536"
    loading="lazy"
    decoding="async"
    alt="Gary in a cozy hotel bed, a fork resting on the duvet."
  />
</figure>

So I leaned in, and this produced the cleanest demonstration of the whole saga. "Make gary with a lot of forks": forks everywhere, a guinea pig in a silverware shrine. "Make gary with no fork": also forks everywhere. Two opposite instructions, identical results, because both prompts are saturated with the same word and the pipeline tracks salience, not intent. Then the kicker. I typed just "gary." One word. Zero fork tokens.

Clean. The only fork-free indoor image in the entire thread.

<div class="blog-grid cols-2">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-many-forks.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-many-forks.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-many-forks.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-many-forks.png 1024w"
    sizes="(min-width: 640px) 332px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary surrounded by forks after a 'lot of forks' prompt: a guinea pig in a silverware shrine."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-no-fork1.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-no-fork1.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-no-fork1.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-no-fork1.png 1024w"
    sizes="(min-width: 640px) 332px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary after a 'no fork' prompt: still forks everywhere. Opposite instruction, identical result."
  />
</div>
<span class="blog-grid-caption">"A lot of forks" and "no fork" produce the same image. The pipeline tracks salience, not intent.</span>

<figure class="blog-wide">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-no-fork2.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-no-fork2.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-no-fork2.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-no-fork2.png 1024w"
    sizes="(min-width: 768px) 672px, 90vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="The single fork-free indoor image: generated from the one-word prompt 'gary', with zero fork tokens."
  />
  <figcaption>Then I typed just "gary." One word, zero fork tokens. The only fork-free indoor image in the thread.</figcaption>
</figure>

After that the results went stochastic. Garden: clean. Machu Picchu: fork in the grass. Ocean: clean. Space: clean. The model spun up a "Fork Location Anomaly" hypothesis with bullet points about indoor scenes and formal moments. I almost believed it, which is the trap. The honest read is less satisfying and more useful: threads are non-deterministic. Fork probability rose and fell with scene affordance and how recently we'd been arguing about forks, and it never reached zero. Four clean images in a row felt like a broken curse and proved nothing. You cannot verify a fix with one sample in a stochastic system, and you definitely can't verify it with a vibe. Everyone who has ever said "I think it finally listened" has run this exact non-experiment.

## The fork waits

Weeks later, in the same thread, I asked for Gary at the bus stop. Back where the species tests started.

April 24, 2025, 4:19 PM. Gary on the bench, facing the camera. The fork beside him.

<figure class="blog-wide">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-bus-final.jpg"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-bus-final.jpg 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-bus-final.jpg 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=855/blog/gary-fork/gary-bus-final.jpg 855w"
    sizes="(min-width: 768px) 672px, 90vw"
    width="855"
    height="777"
    loading="lazy"
    decoding="async"
    alt="Weeks later, same thread: Gary on the bus stop bench facing the camera, the fork beside him."
  />
</figure>

## What actually fixed it

Two things, one tactical and one structural, and neither was a better ban.

The tactical fix: one image per thread. Fresh context, zero history, nothing for the generation to condition on except the prompt itself. The haunting lived in the conversation, so I stopped giving it a conversation to live in. Newer image models handle context contamination noticeably better than the spring 2025 pipeline did, but the principle hasn't changed: if a tic vanishes in a fresh thread, it was never in the model. It was in the room.

The structural fix took longer and mattered more. The deeper problem wasn't the fork; it was that I had no system for Gary. No locked character sheet, no style spec, no palette, nothing the machine had to obey. Every Gary was a fresh roll against the defaults plus whatever junk had accumulated in context. So I built the system: a defined character, a defined single-panel style, flat retro print colors, heavy line, no words or almost none. The kind of thing that used to run in the back pages of a newspaper.

This is Gary now.

<figure class="blog-wide">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-bus.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-cartoon-bus.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-bus.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-cartoon-bus.png 1024w"
    sizes="(min-width: 768px) 672px, 90vw"
    width="1024"
    height="1536"
    loading="lazy"
    decoding="async"
    alt="Gary now: a flat retro single-panel cartoon at the bus stop, heavy line, no fork."
  />
</figure>

Same subject, same bus stop, a different system. The first version is what the machine defaults to when nobody is directing it, plus one ghost I installed myself. The second is mine.

Gary runs here now as a regular thing, single panels, minimal words, deadpan. He has been to the casino, the DJ booth, and a party he did not want to attend. He never carries a fork. He knows where it is.

<div class="blog-grid cols-4">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-sleep.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-cartoon-sleep.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-sleep.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-cartoon-sleep.png 1024w"
    sizes="(min-width: 640px) 162px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary cartoon: asleep."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-toilet.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-cartoon-toilet.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-toilet.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-cartoon-toilet.png 1024w"
    sizes="(min-width: 640px) 162px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary cartoon: on the toilet."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-work.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-cartoon-work.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-work.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-cartoon-work.png 1024w"
    sizes="(min-width: 640px) 162px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary cartoon: at work."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-traffic.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-cartoon-traffic.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-traffic.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-cartoon-traffic.png 1024w"
    sizes="(min-width: 640px) 162px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary cartoon: stuck in traffic."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-tv.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-cartoon-tv.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-tv.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-cartoon-tv.png 1024w"
    sizes="(min-width: 640px) 162px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary cartoon: watching TV."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-lunch.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-cartoon-lunch.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-lunch.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-cartoon-lunch.png 1024w"
    sizes="(min-width: 640px) 162px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary cartoon: at lunch."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-reddit.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-cartoon-reddit.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-reddit.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-cartoon-reddit.png 1024w"
    sizes="(min-width: 640px) 162px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary cartoon: scrolling Reddit."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-ride.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-cartoon-ride.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-ride.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-cartoon-ride.png 1024w"
    sizes="(min-width: 640px) 162px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary cartoon: on a ride at the fair."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-band.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-cartoon-band.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-band.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-cartoon-band.png 1024w"
    sizes="(min-width: 640px) 162px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary cartoon: with a band."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-dj.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-cartoon-dj.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-dj.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-cartoon-dj.png 1024w"
    sizes="(min-width: 640px) 162px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary cartoon: at the DJ booth."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-eat.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-cartoon-eat.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-eat.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-cartoon-eat.png 1024w"
    sizes="(min-width: 640px) 162px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary cartoon: eating."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-party.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-cartoon-party.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-party.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-cartoon-party.png 1024w"
    sizes="(min-width: 640px) 162px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary cartoon: at a party he did not want to attend."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-drunk.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/gary-fork/gary-cartoon-drunk.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/gary-fork/gary-cartoon-drunk.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/gary-fork/gary-cartoon-drunk.png 1024w"
    sizes="(min-width: 640px) 162px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Gary cartoon: drunk."
  />
</div>
<span class="blog-grid-caption">A day in the life, sleep to drunk. He never carries a fork. He knows where it is.</span>

---

*The fork was a ghost I created in one conversation. The eighth point on that star is a different kind of default, the kind that's baked in and follows you everywhere, and it has a name problem too. That's the next post.*
