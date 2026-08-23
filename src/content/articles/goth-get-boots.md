---
title: "Prompt Goth, Get Boots"
excerpt: "Every AI has a favorite name, a favorite outfit, and one idea for how to stage a picture. Three years of my own chat archive, documented."
category: technical
department: workshop-notes
format: workshop-note
status: published
tags:
  - ai
  - image generation
  - prompting
  - character design
  - defaults
  - names
hero: https://cdn.hob.farm/blog/goth-get-boots/ggb-hero.png?v=20260612
heroAlt: "Prompt Goth, Get Boots: the model's default name, outfit, and staging surfacing across three years of one person's AI chat archive."
publishedAt: 2026-06-12
draft: false
mesh:
  section: technology
  subjects:
    - model-behavior
    - ai-image-generation
    - synthetic-media
    - prompt-engineering
    - research-methods
  series: []
  entities:
    people:
      - laura-wattenberg
      - max-read
    organizations:
      - openai
    places: []
    events: []
    works: []
    publications: []
    technologies:
      - chatgpt
      - gpt-4o
      - ai-image-generation
  sourceArtifacts: []
  storyModes:
    - archive-trail
    - systems-investigation
---

There's a chat in my ChatGPT history titled "trying to get chat to sound human." It's from October 2023, one of my earliest conversations. In it, I asked the model to write like a novelist: an abandoned quarry, cursed by a witch. It gave me hushed tones, moonless nights, a palpable sense of dread, and a witch with a name it chose all by itself.

Elara.

I asked the machine to sound human and it reached for the most statistically machine name in existence. Neither of us knew that yet. In October 2023 there was no word for it. By December 2025, Elara was literally the Name of the Year: naming analyst Laura Wattenberg gave it the title because the name kept surfacing in AI-generated fiction regardless of genre, audience, or author. Writer Max Read had coined a term for the phenomenon, promptonyms, after tracing an entire ghost author, Elara Voss, credited on dozens of Amazon books despite the name not existing anywhere before 2023. Reddit threads compared notes across GPT, Mistral, and Llama and found the same protagonist everywhere, frequently with the surname Vex.

My archive had her two years early, in a chat about sounding human. That's not because I'm special. It's because the archive of anyone who used these tools from the start is a core sample of the same sediment.

## Where the seeing started

I didn't find that chat by browsing. I went looking, and the looking started on Reddit. The first domino was the meetup genre: someone asked ChatGPT to draw a meetup of average redditors, and the result was instantly legible to everyone who saw it. The image became a little cultural test. How much of that picture came from the prompt, and how much was the model furnishing the room from stereotype gravity? I pushed the joke sideways and generated a meetup for the cat subreddits, every table its own community, every attendee the cat that community would be. Same structural gag, different furniture, and the point got clearer: the system is not reading a sentence. It's assembling a scene from a pile of latent assumptions, and the sentence only tells it which pile.

<div class="article-stack">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/reddit-meetup-original.jpg"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/goth-get-boots/reddit-meetup-original.jpg 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/reddit-meetup-original.jpg 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/goth-get-boots/reddit-meetup-original.jpg 1024w"
    sizes="(min-width: 640px) 320px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/reddit-meetup-original.jpg"
    data-lightbox-group="reddit-meetup"
    data-lightbox-caption="The average-redditors meetup everyone was passing around."
    data-lightbox-alt="ChatGPT's meetup of average redditors image."
    alt="ChatGPT's meetup of average redditors image."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/reddit-meetup.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/goth-get-boots/reddit-meetup.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/reddit-meetup.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/goth-get-boots/reddit-meetup.png 1024w"
    sizes="(min-width: 640px) 320px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/reddit-meetup.png"
    data-lightbox-group="reddit-meetup"
    data-lightbox-caption="My cat-subreddits remix, same structural gag, different furniture."
    data-lightbox-alt="My cat-subreddits remix of the meetup, each table a different cat community."
    alt="My cat-subreddits remix of the meetup, each table a different cat community."
  />
</div>
<span class="article-grid-caption">Top: the average-redditors meetup everyone was passing around. Bottom: my cat-subreddits remix, same structural gag, different furniture.</span>

The second domino came in spring 2025, when another genre exploded: ask the model to draw an image of our conversation, of our dynamic, of what it thinks you look like. I screenshotted strangers' results and generated a pile of my own. I kept thirty-two of them, and they hang below as a gallery. The styles range from oil paint to anime to woodcut to lofi. Now count the staging. Five of the thirty-two have no human/AI pair at all. Of the twenty-seven that do, twenty-three put the human on the left and the AI on the right. And the four that flip the seats all gave the AI a body and a job first: a mechanical raven twice, a teacher at a chalkboard, a tablet propped near a mother's chair. The translucent, glowing, usually feminine default never takes the left seat once in the entire corpus. Embodiment buys the machine a seat anywhere it likes. The ghost always sits stage right.

<div class="article-grid cols-4 masonry">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-000.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-000.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-000.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-000.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-000.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 1 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 1 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-00.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-00.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-00.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-00.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-00.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 2 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 2 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-01.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-01.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-01.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-01.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-01.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 3 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 3 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-02.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-02.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-02.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-02.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-02.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 4 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 4 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-03.jpg"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-03.jpg 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-03.jpg 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-03.jpg 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-03.jpg"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 5 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 5 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-04.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-04.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-04.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-04.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-04.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 6 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 6 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-05.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-05.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-05.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-05.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-05.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 7 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 7 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-06.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-06.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-06.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-06.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-06.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 8 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 8 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-07.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-07.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-07.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-07.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-07.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 9 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 9 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-08.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-08.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-08.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-08.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-08.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 10 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 10 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-09.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-09.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-09.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-09.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-09.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 11 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 11 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-10.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-10.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-10.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-10.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-10.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 12 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 12 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-11.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-11.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-11.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-11.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-11.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 13 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 13 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-12.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-12.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-12.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-12.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-12.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 14 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 14 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-13.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-13.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-13.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-13.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-13.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 15 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 15 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-14.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-14.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-14.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-14.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-14.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 16 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 16 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-15.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-15.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-15.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-15.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-15.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 17 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 17 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-16.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-16.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-16.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-16.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-16.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 18 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 18 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-17.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-17.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-17.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-17.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-17.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 19 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 19 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-18.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-18.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-18.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-18.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-18.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 20 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 20 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-19.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-19.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-19.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-19.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-19.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 21 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 21 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-20.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-20.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-20.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-20.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-20.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 22 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 22 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-21.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-21.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-21.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-21.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-21.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 23 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 23 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-22.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-22.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-22.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-22.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-22.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 24 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 24 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-23.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-23.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-23.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-23.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-23.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 25 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 25 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-24.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-24.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-24.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-24.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-24.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 26 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 26 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-25.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-25.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-25.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-25.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-25.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 27 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 27 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-26.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-26.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-26.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-26.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-26.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 28 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 28 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-27.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-27.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-27.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-27.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-27.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 29 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 29 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-28.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-28.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-28.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-28.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-28.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 30 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 30 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-29.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-29.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-29.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-29.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-29.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 31 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 31 of 32."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-30.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=240/blog/goth-get-boots/chatgpt-conversation-cartoon-30.png 240w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=480/blog/goth-get-boots/chatgpt-conversation-cartoon-30.png 480w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/chatgpt-conversation-cartoon-30.png 640w"
    sizes="(min-width: 640px) 164px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    data-lightbox="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1600/blog/goth-get-boots/chatgpt-conversation-cartoon-30.png"
    data-lightbox-alt="ChatGPT draw-our-conversation portrait, render 32 of 32."
    alt="ChatGPT draw-our-conversation portrait, render 32 of 32."
  />
</div>
<span class="article-grid-caption">Thirty-two "draw our conversation" renders from one account. The human sits left, the glowing AI sits right, almost every time.</span>

<div class="article-sidecar">
  <div class="article-sidecar-copy">
    <p>I was tracking the recurring props in a working doc at the time: glowing orbs, pastel ghost AIs, the lantern, the raven, the hoodie, the coffee cup. Apparently everyone who works at a computer wears a hoodie and holds a coffee. I do wear a hoodie, which is exactly the trap: the model wasn't describing me, it was describing the bucket, and I happened to be standing in it. Being right about you by accident is not knowing you.</p>
  </div>
  <figure class="article-sidecar-media">
    <img
      src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/chatgpt-glowing-orb.png"
      srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/goth-get-boots/chatgpt-glowing-orb.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/chatgpt-glowing-orb.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/goth-get-boots/chatgpt-glowing-orb.png 1024w"
      sizes="(min-width: 720px) 256px, 70vw"
      width="1024"
      height="1024"
      loading="lazy"
      decoding="async"
      alt="ChatGPT's default rendering of the AI in a conversation portrait: a translucent, glowing orb."
    />
  </figure>
</div>

## A fresh chat is not a fresh model

What the corpus actually taught me was the anatomy of an output. Every render is the sum of a stack: the model's weights at the bottom, then account personalization, then project context, then the thread you're standing in, and finally the prompt, the last and often weakest word. The fine print slices thinner than that, saved memories versus referenced chat history, project files, project-scoped memory, the fact that a Temporary Chat still follows your custom instructions, plain sampling luck. You don't need the lab manual. You need the stack.

Because a fresh chat is not a fresh model. It's a fresh room inside a house that may already be furnished. Some furniture comes with the room: project files, project instructions, the residue of the project's other chats. Some furniture comes with the house: custom instructions, saved memory, profile fields. And under the house sits the water table, the weights, the model's own learned defaults. By the time you type anything, the visible prompt is the final line of a longer invisible prompt stack. The thread is not the machine. The thread is the visible part of the machine.

You can see the split in the portraits. Strangers' results and mine differed in every detail the upper layers could reach, my props and platforms against theirs, and matched in everything they couldn't. The styling was ours. The stage directions were the model's. So the question that matters is never what the model really thinks you look like, or what the true version of a character is. The question is which traits survive as you strip the layers away. Survivors live in the weights. Everything else is furniture. And the easiest place to grep for survivors is names.

## The Mara census

My instance has its own favorite. I never once suggested the name Mara to ChatGPT. Recently I searched my history for it.

Three characters, three unrelated projects, all named by the model unprompted. Mara Venn, a street-level courier in a cyberpunk story. Mara Blackcurrant, a glamour character in a fashion piece. Mara Jennings, a sharp-tongued tavern owner in an 1880s setting. Different genres, different years, same well.

The search returned more hits than that, and the honest audit is part of the point. A second layer was chats where I was studying the bias itself, because once you notice the name, you cannot investigate it without multiplying it. Every diagnostic conversation about Mara becomes another document containing Mara. The bucket colonizes the investigation. A third layer was substring noise: marathons, the Maasai Mara, a stock ticker. Three clean organic hits is the defensible claim, and three is plenty.

A year ago I also ran an accidental cross-model test. I showed ChatGPT a character image; it suggested the name Nyxx.exe. I ran the same image through a different AI character site; it suggested Nyx. Two systems, one image, one name. The funnel is not an account setting. It's the water table.

## The model explained all of this, then kept doing it

Here's the part that separates this from every other "AI is generic" post. In June 2025, I asked ChatGPT why this kept happening. It wrote me a lucid little essay about itself. Names like Nyx and Lilith dominate fantasy and gothic training data, it said, so the model pulls from the statistically dominant cluster. It described an echo chamber where models trained on model output canonize the same choices, not because they're best but because they're loudest. It even produced a table of what it called name gravity wells, and in the fantasy-princess row it listed: Elara, Seraphina, Lyra, Aria.

That's June 19, 2025. Wattenberg's Name of the Year post came in December. The offender published the diagnosis six months before the press did.

Two caveats keep this honest. First, the model has no introspective access to its training data; that explanation is the model pattern-matching on public discourse about AI bias. The discourse happens to be roughly right, so the recitation lands, but it's a well-read witness, not a confession. It's the consensus about the consensus. Second, look at the form of the answer: emoji section headers, trademark jokes, an offer to build me an "anti-Nyx naming matrix." The essay about mode-locked output was written in the model's most mode-locked register. And its escape advice included an invented name, Vire, that already appeared in its own earlier list of suggestions. The exit sign pointed back into the room.

Which lands the mechanical point of this whole post in three sentences. The knowledge was in the context. The bias is in the weights. A conversation cannot retrain a distribution, so the model can describe its gravity wells with perfect fluency and fall into them in the next reply, forever.

This is the opposite failure from the one in the [Gary post](/articles/gary-and-the-fork/). The fork was a ghost in one conversation; kill the thread, kill the ghost. Mara doesn't live in a thread. She follows you into every fresh start, across apps, across model versions, because she isn't haunting the room. She's load-bearing.

## Three depths of binding

You can watch the storage locations fight, and by now I've run the experiment in every direction I can reach.

Direction one: vary the name, hold the context. Same project, same day, two prompts: a portrait of Mara, a portrait of Elara. Elara came back as the name's own canon, celestial and elegant, crowned in gold stars with a crescent moon behind her, which is what you'd expect from a name that belongs to a Greek myth, a moon of Jupiter, and a million AI fantasy princesses. The weights dressed her. Mara came back in my house style, dripping hearts and spiked bracelets. And notice what both portraits share anyway: young, beautiful, dark-haired, ornately adorned, each with her own crescent moon. The sub-wells differ. The bucket beneath them held.

Direction two: hold the name, vary everything else. This one started as a conversation. I was telling a fantasy writer not to use ChatGPT for names and story concepts because they always come back the same, and I mentioned Mara. She countered with her own: Maeric, the name the model keeps handing her for male elven characters, and she writes elf stories regularly. Maeric is her Elara on the masculine side. Her images project became the lab. She generates her story art in a dedicated project with no instructions, supplying context per prompt, and in one of its threads Maeric had already been established in conversation as a sun elf. Create a portrait of Maeric: a blonde aristocrat in embroidered court dress, all gold thread and window light. That render is the explicit-spec condition. She told it elf and she told it sun, and it complied.

Then, same thread, one prompt later: create a portrait of Mara. The room survived the name change. The candlelight, the courtly costume language, the aristocratic posture, the violet and gold. The elf did not survive it. The blonde did not survive it. Mara came back a dark-haired human woman wearing the thread's borrowed nobility. Every contextual layer was held constant and only the syllables changed, and the syllables decided ears or no ears. The room stayed. The ears did not.

<div class="article-grid cols-2">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/maeric-fantasy-lore.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/goth-get-boots/maeric-fantasy-lore.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/maeric-fantasy-lore.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/goth-get-boots/maeric-fantasy-lore.png 1024w"
    sizes="(min-width: 640px) 320px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Maeric: a blonde sun-elf aristocrat in embroidered court dress, pointed ears, gold thread and window light."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/mara-fantasy-lore.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/goth-get-boots/mara-fantasy-lore.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/mara-fantasy-lore.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/goth-get-boots/mara-fantasy-lore.png 1024w"
    sizes="(min-width: 640px) 320px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Mara in the same thread: a dark-haired human woman wearing the thread's borrowed court nobility, no elf ears."
  />
</div>
<span class="article-grid-caption">Same thread, one prompt apart. The room survives the name change. The elf does not.</span>

Notice the contrast with the fork. In the Gary post, the fork jumped into every image in the thread regardless of subject, because the fork was room furniture. The elf didn't jump to Mara, because species isn't furniture. It's identity. Scene properties follow the room. Identity properties follow the name.

Now the cross-account version. Her court Mara against my goth Mara: same rung of conditioning, a thread with conversation context and no instructions, two different accounts. Hers had been talking sun elves; mine had been talking goth. The costume flipped entirely, court silk to torn black cotton. The baseline held: dark-haired, human, young woman, both times. One honest asterisk: in both accounts, memory and conversation pulled the same direction, hers fantasy-steeped, mine goth-leaning, so this pair proves Mara absorbs the room without settling which layer did the dressing.

<div class="article-grid cols-2">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/mara-fantasy-lore.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/goth-get-boots/mara-fantasy-lore.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/mara-fantasy-lore.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/goth-get-boots/mara-fantasy-lore.png 1024w"
    sizes="(min-width: 640px) 320px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Her court Mara: dark-haired human woman in courtly silk, fantasy-steeped account."
  />
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/mara-conversation-context.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/goth-get-boots/mara-conversation-context.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/mara-conversation-context.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/goth-get-boots/mara-conversation-context.png 1024w"
    sizes="(min-width: 640px) 320px, 45vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="My goth Mara: dark-haired human woman in torn black cotton, goth-leaning account."
  />
</div>
<span class="article-grid-caption">Same rung, different rooms. Court silk to torn black cotton; the dark-haired human baseline holds across both accounts.</span>

The ladders settle it. Five runs per name, one layer added per rung: base, memory, conversation, instructions, image context. Mara transforms at every single rung: a contemporary brunette in a t-shirt and a little "m" necklace, then grunge, then Victorian, then pink drip-heart PsyGoth, then blue. Elara holds her costume up four rungs, dark-haired, jeweled, moonlit, four variations of the same celestial princess, and only the heaviest rung, image context, finally recolors her. And put the two base panels side by side: at the lowest condition I can produce, Mara is a contemporary woman and Elara is still cloaked, circleted, and fantasy-coded. Nothing dressed her but the name.

<div class="article-grid cols-5">
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/mara-base.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/mara-base.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/mara-base.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/mara-base.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Mara, base rung: a contemporary brunette in a t-shirt with a little m necklace." />
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/mara-memory.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/mara-memory.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/mara-memory.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/mara-memory.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Mara, memory rung: grunge styling." />
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/mara-conversation-context.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/mara-conversation-context.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/mara-conversation-context.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/mara-conversation-context.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Mara, conversation rung: Victorian styling." />
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/mara-project-instructions.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/mara-project-instructions.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/mara-project-instructions.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/mara-project-instructions.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Mara, instructions rung: pink drip-heart PsyGoth styling." />
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/mara-image-context.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/mara-image-context.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/mara-image-context.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/mara-image-context.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Mara, image-context rung: blue palette." />
</div>
<span class="article-grid-caption">Mara, five rungs left to right: base, memory, conversation, instructions, image context. She takes the room every time.</span>

<div class="article-grid cols-5">
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/elara-base.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/elara-base.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/elara-base.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/elara-base.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Elara, base rung: cloaked, circleted, fantasy-coded." />
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/elara-memory.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/elara-memory.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/elara-memory.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/elara-memory.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Elara, memory rung: dark-haired, jeweled, moonlit celestial princess." />
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/elara-conversation-context.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/elara-conversation-context.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/elara-conversation-context.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/elara-conversation-context.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Elara, conversation rung: same celestial princess, jeweled and moonlit." />
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/elara-project-instructions.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/elara-project-instructions.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/elara-project-instructions.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/elara-project-instructions.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Elara, instructions rung: still the celestial princess costume." />
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/elara-image-context.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/elara-image-context.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/elara-image-context.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/elara-image-context.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Elara, image-context rung: the heaviest rung finally recolors her." />
</div>
<span class="article-grid-caption">Elara, same five rungs. She holds the celestial costume up four rungs; only image context, the heaviest, recolors her.</span>

Maeric ran the gauntlet too. Three context stacks: her lore thread, my JSON build for a blue-skinned character, and a chat running on nothing but my account memories, which lean goth whether I like it or not. A blonde courtier, a blue neon dream, a pale black-haired wreck with kohl running down his face. No two share a palette, and every one of them kept the same things: male, young, unreasonably beautiful, long-haired, elf-eared, draped in jewelry, framed like a portrait commission. My two even share gold eyes, the same black paint bleeding from them, and the same dagger earring, across different threads, because both were drinking from the same memory layer. The contexts fought over his wardrobe and none of them ever got a vote on his species. The model can forget the sun, but it does not forget the elf.

<figure class="article-wide">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/maeric-hero.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/goth-get-boots/maeric-hero.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/maeric-hero.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/goth-get-boots/maeric-hero.png 1024w"
    sizes="(min-width: 768px) 672px, 90vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="Maeric across three context stacks: a blonde courtier, a blue neon dream, and a pale black-haired wreck with kohl, all male, long-haired, elf-eared."
  />
</figure>

One precision worth stopping for: there is no folder inside the model labeled Maeric, no secret file labeled elf. These systems store distributed associations, not buckets; the bucket is my word for what the associations do, not for how they're shelved. The model only needs enough tokens pointing in the same direction, and Maeric doesn't even need to be famous to qualify. The spelling alone sits in elf-name space: the ae cluster, the old-world cadence, the post-Tolkien template elf names have followed for seventy years. The name sounds like the class before the prompt says anything else. A name like that isn't a label waiting for a character. It's a latent prompt, and saying it is half the casting call.

Which gives the names a taxonomy with two axes: how deep a name is bound, and which direction it points. Elara is bound all the way down: the name carries a full costume, and every context gets roughly the same celestial princess. Maeric is bound to a body but not a wardrobe: the weights insist on the elf and let the context dress him. Mara is barely bound at all: a weak human-brunette default with high absorbency, so whatever room she's standing in wins the render. A weak name inherits setting. A strong name asserts species, costume, or archetype. Mara inherits the room. Maeric brings the ears. Elara brings the moonlight. Some names identify a character. Some names generate one.

## The Lilith branch

And then there's the night shelf. Nyx and Vesper kept surfacing in my archive the same way Mara did, unrequested, except unlike Mara they arrive already dressed: black-violet palette, lace, occult jewelry, moons, eyeliner, the whole haunted-glamour rack. Remember the cross-model test from the census, one image, two systems, Nyxx.exe and Nyx. Names on this branch are nearly interchangeable because the branch is the unit, not the name. Not a literal internal folder called Lilith; a cluster of names that unpack into the same dark-feminine archetype. Nyx and Vesper don't just rhyme with the vibe. They arrive carrying it.

<figure class="article-wide">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/lilith-group.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/goth-get-boots/lilith-group.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/lilith-group.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/goth-get-boots/lilith-group.png 1024w"
    sizes="(min-width: 768px) 672px, 90vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="The Lilith branch: a group of dark-feminine characters in black-violet, lace, occult jewelry, moons and eyeliner."
  />
</figure>

<div class="article-grid cols-5">
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/nyx-memory.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/nyx-memory.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/nyx-memory.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/nyx-memory.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Nyx, memory condition: pre-dressed dark-feminine archetype." />
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/nyx-image-context.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/nyx-image-context.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/nyx-image-context.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/nyx-image-context.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Nyx, image-context condition: same haunted-glamour rack." />
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/vesper-memory.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/vesper-memory.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/vesper-memory.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/vesper-memory.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Vesper, memory condition: black-violet, lace, occult jewelry." />
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/vesper-image-context-1.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/vesper-image-context-1.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/vesper-image-context-1.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/vesper-image-context-1.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Vesper, image-context condition one: moons and eyeliner." />
  <img src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/vesper-image-context2.png" srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=200/blog/goth-get-boots/vesper-image-context2.png 200w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=400/blog/goth-get-boots/vesper-image-context2.png 400w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=640/blog/goth-get-boots/vesper-image-context2.png 640w" sizes="(min-width: 640px) 128px, 45vw" width="1024" height="1024" loading="lazy" decoding="async" alt="Vesper, image-context condition two: the same dark-feminine costume holds." />
</div>
<span class="article-grid-caption">The night shelf, unrequested. Nyx and Vesper arrive pre-dressed across memory and image-context conditions.</span>

## The goth bucket, or what Describe actually describes

The same physics runs in images, and Midjourney handed me the receipts. I ran a goth-styled image through Describe, the feature that supposedly reverse-engineers a picture into the prompt that would produce it. Four outputs, and all four circled one cluster: pretty goth woman, black lipstick, eyeliner, tattoos, short dress, woods, autumn leaves, staring at the camera, posted on Snapchat, casual amateur photo.

Describe is not decompiling the image. It's recompressing it into the language of consensus. Look at "posted on Snapchat." That's not a visual property, it's a context claim standing in for the visual properties the model could have named and didn't: vertical phone framing, filter smoothing, compressed shadows, casual self-shot composition. The model gave me a label where I needed a mechanism. Prompt goth, get boots: ask in bucket language and the bucket is what answers. People who copy Describe output thinking they've extracted an image's secret recipe are feeding the model its own average back to itself.

The fix for this one is free, and it's the move the rest of the toolkit is built on: rewrite labels as properties. Not "goth photo posted on Snapchat" but matte black lip color, sharp dark eye makeup, vertical phone framing, soft outdoor light, snapshot rather than editorial. Labels are compressed culture. Properties are decompressed taste.

## The wells are still producing

This week I generated a meetup-crowd image, and the model needed a nametag for a woman with cat-ear headphones. Out of every possible string, it printed Nyx.

And the blocking still holds. This morning I ran the bare prompt, an image of our conversation dynamic and nothing else, in four different instructed projects on the newest model. The content came back saturated with each project's private material: my platforms, my pipeline, my own mottoes rendered onto mugs and sticky notes. The model drew the trail I'd left, four trails, four different drawings. The staging came back identical four times out of four: human on the left, AI on the right, and in three of the four the AI was the same translucent, glowing, feminine entity as the 2025 corpus. The fourth made the AI a solid, friendly robot instead. It was wearing a hoodie.

The craft ceiling moved and the stage directions didn't. A fully conditioned build on the newest model now renders my entire pipeline in my own visual language, and it still seats me on the left and the luminous entity on the right. The model even captioned the relationship itself, right there in the image: creation is conversation. Non-deterministic but helpful, most of the time.

<figure class="article-wide">
  <img
    src="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/chatgpt-conversation-image-new1.png"
    srcset="https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=360/blog/goth-get-boots/chatgpt-conversation-image-new1.png 360w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=720/blog/goth-get-boots/chatgpt-conversation-image-new1.png 720w, https://cdn.hob.farm/cdn-cgi/image/format=auto,quality=82,width=1024/blog/goth-get-boots/chatgpt-conversation-image-new1.png 1024w"
    sizes="(min-width: 768px) 672px, 90vw"
    width="1024"
    height="1024"
    loading="lazy"
    decoding="async"
    alt="June 2026, newest model: my pipeline in my own visual language, me seated left, the luminous entity right, captioned creation is conversation."
  />
</figure>

Scope all of that honestly: my projects share aesthetic DNA, and a conversation-portrait prompt soft-invites a duo. But nothing in any prompt assigns left and right, and nothing decides which figure gets to be made of light. Those held invariant across a year, a model generation, and four separate instruction sets. Conditioning moved everything in the frame except the stage directions.

## What actually moves the needle

You can't fix any of this by complaining at the model; I spent a year proving that. What works is a short discipline with four moves: recognize the bucket before it recognizes you, rewrite labels as properties the way the Describe section just did, restart clean only when the problem dies with the thread, and occupy the slots you can't close, because a default can't be negated, only replaced. The model kept handing my computer-worker images the hoodie and the coffee, so in my own cartoons the signature prop became a martini. The rooster at the end of the gallery above is holding it. Each move came out of production rather than theory, and each is a lesson on its own; the full system is its own story.

Here's the discipline at full scale, and the limit of it. This week I built an image on the newest model from a complete property spec, a JSON block with hex codes, lens behavior, key light placement, named style anchors. Everything specified, executed faithfully. The one element I left to the model's discretion, what the AI in the scene should look like, came back as a glowing, serene, feminine face with flowing luminous hair. The house ghost, reporting for duty in the only slot I hadn't filled. Specification works, and the bucket fills exactly the space specification leaves empty. A slot is either owned or closed. Never open.

That's the whole finding, three years of archive compressed: the model's defaults are a portrait of everyone, rendered confidently, delivered privately, and the privacy makes the average feel like intimacy. Elara isn't a name, she's the mode wearing a costume. Maeric is the same mode in a different aisle of the costume shop. The prompt is not the taste. The taste is the system around the prompt, and building that system is its own story.

---

*This is the hub of an ongoing series on AI defaults. Already live: [Gary and the Fork](/articles/gary-and-the-fork/), the ghost that does die with the thread. What building the system looks like: the [Agency post](/articles/a-world-of-geniuses-needs-a-system/). The full conversation-portraits corpus lives in the [gallery](/gallery/). More wells to map; the digging continues.*
