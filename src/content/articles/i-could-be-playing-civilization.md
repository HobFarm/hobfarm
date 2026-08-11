---
title: "I Could Be Playing Civilization"
excerpt: "Instead, I spend my remaining hours maintaining Markdown files that tell AI agents which repository owns the data, correcting the tools that help me correct the tools, and building a website almost nobody sees."
dek: "Civilization trained me to enjoy complicated systems, hidden rules, expansion packs, and starting over. AI did not rescue me from that habit. It gave the habit files to leave behind."
description: "A personal essay about replacing games with an AI-assisted publishing project, and the hidden human maintenance behind agent instructions, skill files, source-of-truth rules, and provider changes."
author: "d00d"
tags:
  - ai
  - Civilization
  - agentic systems
  - codex
  - skills
  - AGENTS.md
  - creative systems
  - grimoire
  - solo publishing
  - Other Alice
category: cultural-thread
department: essays-arguments
format: article
entryType: feature
heroImage: "https://cdn.hob.farm/articles/could-be-playing-civ/i-could-be-playing-civilization-hero.png"
socialImage: "https://cdn.hob.farm/articles/could-be-playing-civ/i-could-be-playing-civilization-hero.png"
heroAlt: "A tired creator eats lunch at 2:45 a.m. over a paper strategy map built from folders, files, cables, subscription costs, and a small purple gothic Other Alice figure, while an unused game waits nearby and a plane descends beyond the window."
socialCaption: "The old game consumed years. The new one leaves files behind and keeps changing the rules."
canonical: "/articles/i-could-be-playing-civilization/"
pubDate: 2026-07-28
publishedAt: 2026-07-28T17:20:00-07:00
status: published
featured: false
coverStory: false
draft: false
relatedArticles:
  - gary-and-the-fork
  - a-world-of-geniuses-needs-a-system
  - you-do-not-own-the-ai-you-pay-for
  - everything-is-still-loading
relatedProject: "/presents/other-alice-adventures/"
supportCTA:
  label: "Support HobFarm"
  href: "/support/"
rightsNote: "Original HobFarm editorial illustration and explanatory graphics. Product names appear as factual references; no commercial game interface or artwork is reproduced."
sourceNotes:
  - label: "OpenAI: Custom instructions with AGENTS.md"
    url: "https://learn.chatgpt.com/docs/agent-configuration/agents-md"
    note: "Official documentation for global and project instruction discovery, precedence, and the default 32 KiB combined guidance limit."
    type: documented-fact
  - label: "OpenAI: Build skills"
    url: "https://learn.chatgpt.com/docs/build-skills"
    note: "Official documentation for SKILL.md packages, optional scripts, references, assets, discovery locations, and progressive disclosure."
    type: documented-fact
  - label: "OpenAI: Customization"
    url: "https://learn.chatgpt.com/docs/customization/overview"
    note: "Official guidance to codify repeated mistakes and corrected assumptions in AGENTS.md as a feedback loop."
    type: documented-fact
  - label: "Anthropic: Claude Fable 5 and Claude Mythos 5"
    url: "https://www.anthropic.com/news/claude-fable-5-mythos-5"
    note: "Original launch announcement and the first published plan and usage-credit conditions."
    type: promotional-claim
  - label: "Anthropic: Redeploying Fable 5"
    url: "https://www.anthropic.com/news/redeploying-fable-5"
    note: "Anthropic's account of the June 12 suspension, lifted export controls, July 1 restoration, and temporary usage conditions."
    type: participant-recollection
  - label: "Anthropic: Claude pricing"
    url: "https://platform.claude.com/docs/en/about-claude/pricing"
    note: "Current API pricing reviewed on July 26, 2026."
    type: documented-fact
  - label: "Anthropic: Claude Status"
    url: "https://status.claude.com/"
    note: "Status history reviewed on July 26, 2026, including Fable 5 access and usage-credit incidents."
    type: documented-fact
mesh:
  section: technology
  subjects:
    - creative-systems
    - multi-agent-systems
    - game-design
    - solo-publishing
    - knowledge-systems
  series: []
  entities:
    people: []
    organizations:
      - hobfarm
    places: []
    events: []
    works:
      - civilization-v
    publications: []
    technologies:
      - codex
      - grimoire
  sourceArtifacts: []
  storyModes:
    - personal-history-trail
    - process-essay
---

At 2:45 in the morning, eating lunch at my computer, I found an old rule telling Codex to obey a skill I no longer used.

I had been up since eight. The previous night's job released around two in the morning. Las Vegas production work does not care what breakfast, lunch, and dinner are supposed to mean. I have left one job around three and reported to another around seven. When several long days stack up, sleep becomes a series of one-to-three-hour negotiations with whatever gaps remain.

This gap was apparently for auditing Markdown.

I could have been playing *Civilization*. I have somewhere above 7,500 hours across *Civilization IV*, *V*, and *VI*, probably closer to 10,000. A calendar year has 8,760 hours. That is close to a full year of my life spent moving settlers, arranging districts, managing research, and discovering that Gandhi has acquired uranium.

That total does not include four complete hardest-difficulty runs through *The Witcher 3*, side quests and expansions included. It does not include *Dragon Age*, *Mass Effect*, *The Old Republic*, *Skyrim*, *Fallout*, *Cities: Skylines*, the *F1* games, *Cyberpunk 2077*, or *Grand Theft Auto* from the original PlayStation game through *GTA V*. The numbers are rough personal totals, not a moral accounting. The games were fun. I had the time and used it.

Now I use the time to maintain the machine that helps me build HobFarm.

## The old waste of time

Most complicated games follow the same curve for me. At ten hours I understand the controls and the basic economy. Around one hundred hours I can see the system behind the presentation. After that comes fluency: optimization, experiments, ridiculous strategies, restarts, and the pleasure of knowing which rule can be bent without breaking the whole thing.

I never needed those hours redeemed by a later career lesson. Leisure does not need to prove it was secretly vocational. Still, the pattern-seeking machinery did not disappear when I stopped launching the games. It went looking for a larger board.

I bought the HobFarm domain in January 2026 and decided to spend the year building it. Since then, the project has replaced most games, movies, idle entertainment, meals away from the computer, and quite a few meals away from the keyboard. It has cost thousands of dollars in subscriptions, APIs, hosting, hardware, experiments, and directions that failed. It has produced little or no money.

The joke is that the games are already paid for. I can keep playing them at almost no additional cost. HobFarm sends a new invoice every month.

This is not a story about escaping a useless habit by becoming productive. I replaced one supposedly useless game with a more expensive one.

## The same brain, different interface

The new game has rules and mechanics, except they are model behaviors and instruction hierarchies. It has patches and sequels, except the provider can install them without asking. Repositories are save files. Skills, plugins, adapters, and scripts are mods. Every interesting branch becomes a side quest.

<figure class="article-wide">
  <img
    src="https://cdn.hob.farm/articles/could-be-playing-civ/same-brain-different-game.png"
    width="1800"
    height="1125"
    loading="lazy"
    decoding="async"
    alt="A two-column comparison maps computer-game systems to AI-assisted HobFarm work: mechanics to model instructions, patches to provider changes, save files to repositories, mods to skills and scripts, and side quests to creative project branches."
  />
  <figcaption>
    The interface changed. The reward loop did not.
    <a href="https://cdn.hob.farm/articles/could-be-playing-civ/same-brain-different-game.png" target="_blank" rel="noreferrer">Open the full-size diagram.</a>
  </figcaption>
</figure>

The transfer is strong enough to be useful and weak enough to keep me trapped. Experience carries over; mastery does not. A model update changes the terrain. A wrapper changes how instructions reach it. A moderation layer shifts. A tool that followed a boring rule yesterday decides today that it has a better idea.

The project is broad on purpose. If I get sick of article research, I can work on an image system, a video, StyleFusion, Grimoire, a restoration experiment, or the website. The Purple Gothic Doll on my project map is [Other Alice Adventures](/presents/other-alice-adventures/), an entire developed world waiting behind what sounds like one distracting image prompt. Boredom with one branch does not release me from the game. It moves my unit to another tile.

## The fork became a skill file

In [Gary and the Fork](/articles/gary-and-the-fork/), ChatGPT could generate a new explanation every time a fork reappeared in an image. It blamed training data, then a character default, then a loop in the image model. It announced suppression protocols in confident bullet points. The fork remained.

A model can describe its failure. That description is not corrected behavior.

I had to run the experiment, vary the subject, try fresh conversations, separate conversation contamination from model defaults, and build a character system outside the thread. The useful diagnosis arrived through the work. Gary's fork eventually became a rule.

Agentic tools make that conversion much easier. A correction no longer has to die when the chat closes. I can direct Codex to turn a recurring failure into an instruction file, a reusable skill, a reference document, a deterministic script, or a test.

This is real progress. It is also how the fork becomes infrastructure.

OpenAI's current documentation describes [`AGENTS.md` as durable guidance](https://learn.chatgpt.com/docs/customization/overview) that Codex loads before work. A global file can set my personal defaults. A repository file can describe the project. The [official discovery rules](https://learn.chatgpt.com/docs/agent-configuration/agents-md) say instructions closer to the working directory take precedence and that combined guidance stops at 32 KiB by default unless I change the configuration.

The same documentation defines a skill as a directory with a required `SKILL.md` file and optional scripts, references, and assets. Codex first sees a skill's name and description, then loads the full instructions when the job matches. OpenAI calls that [progressive disclosure](https://learn.chatgpt.com/docs/build-skills). It keeps every available workflow from occupying the prompt at once.

The part that felt suspiciously convenient is also explicit. OpenAI tells users to correct wrong assumptions in `AGENTS.md`, codify repeated mistakes, and treat the process as a feedback loop.

So no, the model was not inventing the mechanism while helping me use it. The mechanism is in the provider's documentation.

The documentation does not solve the maintenance problem.

## The system needs a system

The stale skill reference made me audit my global Codex folder. I asked the agent to rebuild its instruction layer around the work I actually do: HobFarm, StyleFusion, Grimoire, Other Alice, content production, browser work, images, and video. I told it to stop inventing enterprise process for one person with old hardware, limited money, and no employees.

Codex rebuilt the global guidance, added a prose file, removed stale command rules, removed the retired preflight skill, and preserved the credentials, sessions, logs, caches, and other state that should not be hand-edited. Useful work, done much faster than I could have done it manually.

Then I gave it the harder problem. My projects had begun copying source-like Grimoire files into consumer repositories such as StyleFusion. Versions and hashes were being hardcoded. Extra builders and folders appeared "just to make it work." Each local fix weakened the architecture the projects were supposed to share.

Codex created a `route-project-source-of-truth` skill, a project map, and a boundary-audit script. It changed the Grimoire sync process to generate StyleFusion's release-pin snapshot, then changed StyleFusion to consume that generated artifact instead of pretending it owned the source. Tests and builds passed.

The audit also found the next layer of debt: copied source-like files, consumer-side builders, repeated hashes, transitional canon, and absolute paths.

<figure class="article-wide">
  <img
    src="https://cdn.hob.farm/articles/could-be-playing-civ/source-of-truth-architecture.png"
    width="1800"
    height="1125"
    loading="lazy"
    decoding="async"
    alt="A source-of-truth diagram routes global guidance through a project-routing skill to Grimoire's canonical source, then to a generated release-pin artifact consumed by StyleFusion and verified by tests. A faded side channel rejects copied source folders, hardcoded versions, and temporary builders."
  />
  <figcaption>
    The repair restored direction: the source generates what the consumer needs; the consumer does not quietly become a second source.
    <a href="https://cdn.hob.farm/articles/could-be-playing-civ/source-of-truth-architecture.png" target="_blank" rel="noreferrer">Open the full-size diagram.</a>
  </figcaption>
</figure>

Codex did not wake up one morning, inspect the rules it had accumulated, notice the retired skill, infer the real boundaries among several projects, and repair them. I found the stale reference. I recognized the risk. I explained the architecture, rejected the wrong assumptions, evaluated the result, and supplied the next correction.

The agent converted that direction into files and code at high speed.

That is not self-correction. It is human-directed externalized correction.

<figure class="article-wide">
  <img
    src="https://cdn.hob.farm/articles/could-be-playing-civ/agentic-correction-loop.png"
    width="1800"
    height="1125"
    loading="lazy"
    decoding="async"
    alt="A loop begins when a human notices a failure, continues through model explanation, human verification, an agent-written rule or script, passing tests, and an improved workflow, then returns when changed projects or models make the correction stale or conflicting."
  />
  <figcaption>
    The machine can help write the correction. The human still has to notice when the correction becomes the next bug.
    <a href="https://cdn.hob.farm/articles/could-be-playing-civ/agentic-correction-loop.png" target="_blank" rel="noreferrer">Open the full-size diagram.</a>
  </figcaption>
</figure>

[A World of Geniuses Needs a System](/articles/a-world-of-geniuses-needs-a-system/) argued that the filing cabinet preserves agency. I still believe that. The Grimoire, scoped agents, structured data, and project maps keep me in the chair.

Cabinets also accumulate outdated labels, duplicate folders, broken references, and instructions written for projects that no longer exist in the same form.

Every durable fix is another thing that can outlive its workflow, apply too broadly, load at the wrong scope, conflict with a newer instruction, or anchor the agent on an obsolete project model. A rule meant to keep an audit safe can force read-only behavior when the next job requires editing. A source-of-truth instruction can become a ritual that preserves the wrong source. Guidance consumes context and attention even when it is correct.

The corrective layer needs its own audit.

## You pay for the patch twice

The local system does not change in isolation. The companies keep changing the machines underneath it.

Anthropic's Fable 5 sequence is almost too perfect. The company launched the model, suspended it after U.S. export controls took effect on June 12, and restored global access on July 1 after the controls were lifted. The [restoration announcement](https://www.anthropic.com/news/redeploying-fable-5) said subscription access would be included through July 7, then require usage credits. On July 17, Anthropic's [own status page](https://status.claude.com/) said Fable was again available without usage credits "as expected." On July 20, it reported that some Max users were being prompted for credits incorrectly because Fable was included in their plan. On July 25, Fable was among several models with elevated errors.

That account was checked on July 26, 2026. It is dated because the access rules themselves kept moving.

I used Claude heavily, then trusted it less after the removal, return, access changes, model behavior, and disappointing recent results. Codex and Claude Code trade advantages over time. ChatGPT remains my primary tool mostly because I have spent longer learning its quirks, drift, moderation behavior, and failure patterns. That is less brand loyalty than accumulated save-game knowledge.

[You Do Not Own the AI You Pay For](/articles/you-do-not-own-the-ai-you-pay-for/) described the upstream problem: the subscription buys access to the current shape of someone else's machine. The downstream cost is mine. Every provider patch can force changes to prompts, skills, adapters, model routing, source documents, tests, and expectations.

I pay for the subscription. Then I pay again in adaptation.

## Faster means a larger map

AI has made me faster. That part is true.

Work that might once have taken a year can happen in a month. I can develop several long, sourced, illustrated articles in parallel. None of that created eleven months of leisure. It revealed twelve times more map.

The range is the attraction. HobFarm can hold articles, visual work, avatars, games, applications, research, restoration, Workshop notes, Other Alice, StyleFusion, Grimoire, and whatever connection appears while I am working on those. An avatar system can support the publisher and still become a side campaign requiring weeks of its own development.

If generative AI disappeared, the output would slow considerably. The practice would remain. Research, writing, web development, Photoshop, Illustrator, photography, design, and production work were here before the models. AI became another layer inside them. It did not invent the interests or supply the reason to continue.

The new game leaves files behind: articles, diagrams, source notes, images, tools, tests, games, and a website. They may never earn back what they cost. Almost nobody may read them.

I still like that they exist.

The site serves as an external record: this is what I think about that. Read it or not. I do not have the energy to explain all of this again. Maybe the audience is late. Maybe a future archivist finds one surviving fragment a century from now and recognizes something in it. The internet is fragile enough that this is an image, not a prediction.

## The office over John Wayne Airport

I sometimes think about an older job in Irvine, building World Poker Tour websites in a normal office overlooking John Wayne Airport. Planes landed and took off outside the window. Work ended. Weekends existed. I could go home and spend them playing *Civilization*.

From irregular Las Vegas production work followed by an unpaid creative second job, a stable nine-to-five can look like freedom.

I could find another one. The games are already paid for. They do not need a project map, a source-of-truth skill, or an audit of the files that tell them how to behave.

Then a stale rule turns up. Or an article connects to another article. Or the Purple Gothic Doll opens an entire world on the right side of the map.

I could be playing *Civilization*.

This appears to be what I do instead.

---

*Reporting note: All playtime, work-schedule, project-cost, and career details are personal estimates or recollections supplied by the author. Technical and provider claims were checked against the linked official documentation on July 26, 2026.*
