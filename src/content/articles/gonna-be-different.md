---
title: "It’s Gonna Be Different Every Time"
excerpt: "The overlooked game inside Big, an old internet prediction, and the Other Alice story machine that can finally begin."
dek: "The overlooked game inside Big, a prediction from the old internet, and the Other Alice story machine I can finally begin exploring."
description: "The overlooked game inside Big, an old internet prediction, and the Other Alice story machine that can finally begin."
author: "d00d"
tags:
  - Big
  - Other Alice Adventures
  - interactive fiction
  - AI-native games
  - procedural storytelling
  - game design
  - story engines
  - Grimoire
  - StyleFusion
category: research
department: essays-arguments
format: article
series: "Other Alice Adventures"
entryType: feature
rightsNote: "Frame captures from Big (1988) and a screenshot of the referenced Reddit thread are reproduced for criticism and commentary. The hero illustration is from the HobFarm production archive."
sourceNotes:
  - label: "Reddit: TIL Tom Hanks developed the eBook reader in the 80's"
    url: "https://www.reddit.com/r/pics/comments/izn4o/til_tom_hanks_developed_the_ebook_reader_in_the/"
    note: "Archived 2011 thread used for the electronic-comic discussion and the prediction about powerful AI."
    type: participant-recollection
  - label: "The Status Line, Summer 1988"
    url: "https://ifarchive.org/if-archive/infocom/NZT%2BTSL/TSL72.pdf"
    note: "Infocom's newsletter describing its InfoComics releases as a new approach to storytelling."
    type: documented-fact
  - label: "inkle/ink"
    url: "https://github.com/inkle/ink"
    note: "Official open-source repository for ink, inkle's scripting language for highly branching interactive narrative."
    type: documented-fact
  - label: "inkle: Pendragon"
    url: "https://www.inklestudios.com/pendragon/"
    note: "Official game page describing a story assembled from thousands of pieces that remembers moves, choices, victories, and defeats."
    type: promotional-claim
  - label: "AI Dungeon Guidebook: Getting Started"
    url: "https://help.aidungeon.com/getting-started"
    note: "Official documentation for Memory, Story Cards, context, and open-ended player input."
    type: documented-fact
  - label: "World-State Transformations for Neuro-symbolic Interactive Storytelling"
    url: "https://arxiv.org/abs/2605.24719"
    note: "2026 research paper on using free-text input to trigger rule-based world-state transformations."
    type: documented-fact
  - label: "STORY2GAME: Generating (Almost) Everything in an Interactive Fiction Game"
    url: "https://arxiv.org/abs/2505.03547"
    note: "2025 research paper on generating interactive-fiction actions with explicit preconditions and effects."
    type: documented-fact
  - label: "AI-Native Games: A Survey and Roadmap"
    url: "https://arxiv.org/abs/2607.00527"
    note: "2026 survey of 53 AI-native games and prototypes, including design constraints and inference economics."
    type: documented-fact
  - label: "The 'Burbs cast and crew"
    url: "https://www.rottentomatoes.com/m/the_burbs/cast-and-crew"
    note: "Cast listing used for the Tom Hanks to Joe Dante to Dick Miller connection."
    type: documented-fact
heroImage: "https://cdn.hob.farm/articles/gonna-be-different/gonna-be-different-hero.png"
socialImage: "https://cdn.hob.farm/articles/gonna-be-different/gonna-be-different-hero.png"
heroAlt: "A branching Other Alice story machine connects an old computer adventure, illustrated scenes, game-state diagrams, and a presentation room."
socialCaption: "Big hid a branching story machine in plain sight. Fifteen years ago, a Reddit commenter guessed that AI would make it real. Now I can begin building the Other Alice version."
canonical: "/articles/gonna-be-different/"
publishedAt: 2026-07-17
featured: false
coverStory: false
status: published
draft: false
relatedArticles:
  - other-alice-origin
  - grimoire-knowledge-graph
  - stylefusion-ir-extraction
  - 3dm/enter-the-millerverse
relatedWorkshop:
  - /workshop/stylefusion/
  - /workshop/character-mannequin/
relatedProject: "/presents/other-alice-adventures/"
workshopCTA:
  label: "Explore the HobFarm Workshop"
  href: "/workshop/"
mesh:
  section: technology
  subjects:
    - interactive-fiction
    - procedural-storytelling
    - game-design
    - creative-systems
    - media-history
  series: []
  entities:
    people: []
    organizations: []
    places: []
    events: []
    works:
      - big-1988
      - other-alice-adventures
    publications: []
    technologies:
      - wonder-machine
      - grimoire
      - stylefusion
  sourceArtifacts:
    - id: big-electronic-comic-scene
      type: film
      label: Big (1988), electronic comic scene
      role: origin
  storyModes:
    - media-genealogy
    - process-essay
---

When I was a kid, I saw *Big* when it was new. I loved the movie, watched it repeatedly on VHS, and never forgot the computer game with the frozen wizard.

The larger movie is about Josh Baskin wishing himself into an adult body and discovering that adulthood is considerably less fun than it looks from the outside. Hidden inside that story is a smaller loop about games, choices, and the difference between enjoying an imaginary world and becoming the adult responsible for manufacturing it.

I did not spend the following decades consciously developing a toy from a Tom Hanks movie. I followed different interests, jobs, technologies, and projects. The idea stayed filed away somewhere: a story appears on a screen, the player decides what to do, and the machine reveals what happens next.

Now I have Other Alice Adventures, the HobFarm Workshop, StyleFusion, the Grimoire, and the beginnings of a procedural story engine. It may finally be time to return to the cavern.

<figure class="article-wide">
  <img src="https://cdn.hob.farm/articles/gonna-be-different/big-game-josh1.jpg" alt="Young Josh Baskin plays the computer adventure in his bedroom before school." width="1200" height="666" loading="lazy" decoding="async" />
  <figcaption>Young Josh enters the cavern before school. The machine presents a world and waits for a command.</figcaption>
</figure>

## Play, replay, pitch

The opening computer sequence establishes more game mechanics than I remembered.

Josh enters the cavern of the evil wizard. The screen reports that the remains of slain ice dwarfs surround him. The wizard waits on the opposite side of the cavern with an ice scepter.

<figure class="article-wide">
  <img src="https://cdn.hob.farm/articles/gonna-be-different/big-game1.jpg" alt="The computer game shows an evil wizard in an ice cavern and describes the remains of slain ice dwarfs." width="1200" height="846" loading="lazy" decoding="async" />
  <figcaption>The cavern of the evil wizard.</figcaption>
</figure>

Josh types the obvious command:

**MELT WIZARD**

<figure class="article-wide">
  <img src="https://cdn.hob.farm/articles/gonna-be-different/big-game2.jpg" alt="Josh's game character faces the ice wizard after the command Melt Wizard." width="1200" height="846" loading="lazy" decoding="async" />
  <figcaption>Josh enters the command “Melt Wizard.”</figcaption>
</figure>

The machine does not accept a vague intention. It asks for a method:

**WHAT DO YOU WANT TO MELT HIM WITH?**

<figure class="article-wide">
  <img src="https://cdn.hob.farm/articles/gonna-be-different/big-game3.jpg" alt="The game asks what Josh wants to use to melt the wizard." width="1200" height="846" loading="lazy" decoding="async" />
  <figcaption>The game asks Josh to specify how he will melt the wizard.</figcaption>
</figure>

Then his mother calls him for school.

Josh hesitates. He knows there must be an answer, but he cannot retrieve it quickly enough. The wizard senses his apprehension, fires the ice scepter, and freezes him.

<figure class="article-wide">
  <img src="https://cdn.hob.farm/articles/gonna-be-different/big-game4.jpg" alt="The ice wizard fires a bright bolt at Josh's character while he hesitates." width="1200" height="846" loading="lazy" decoding="async" />
  <figcaption>The wizard attacks while Josh hesitates.</figcaption>
</figure>

<figure class="article-wide">
  <img src="https://cdn.hob.farm/articles/gonna-be-different/big-game5.jpg" alt="Josh's character is trapped in ice as the game says he may thaw in several million years." width="1200" height="846" loading="lazy" decoding="async" />
  <figcaption>Josh receives the game's failure message.</figcaption>
</figure>

The game contains a complete interaction loop:

The world presents a situation. The player enters an action. The system requests clarification. Time continues while the player decides. Inaction becomes an action. The world resolves the consequence.

The computer does not wait because Josh has school.

That is a remarkably useful mechanic for a movie prop. Most story choices politely wait forever for the reader to turn the page. This world keeps moving.

Later, after Josh has become an adult, he returns to the same machine.

<figure class="article-wide">
  <img src="https://cdn.hob.farm/articles/gonna-be-different/big-game-josh2.jpg" alt="Adult Josh Baskin sits at a computer and returns to the frozen-wizard game." width="1200" height="666" loading="lazy" decoding="async" />
  <figcaption>Adult Josh returns to the computer game.</figcaption>
</figure>

This time he has the answer and enough time to enter it:

**THROW THERMAL POD**

<figure class="article-wide">
  <img src="https://cdn.hob.farm/articles/gonna-be-different/big-game6.jpg" alt="Adult Josh enters the command Throw Thermal Pod in the computer game." width="1200" height="846" loading="lazy" decoding="async" />
  <figcaption>Adult Josh enters “Throw Thermal Pod.”</figcaption>
</figure>

The encounter has barely changed. The player has.

A few scenes later, Josh stands in front of the MacMillan executives and presents his idea for an electronic comic book.

<figure class="article-wide">
  <img src="https://cdn.hob.farm/articles/gonna-be-different/big-comic-pitch1.jpg" alt="Josh presents a mockup of an electronic comic book to the MacMillan executives." width="1200" height="666" loading="lazy" decoding="async" />
  <figcaption>Josh presents the electronic comic book.</figcaption>
</figure>

The reader reaches the bottom of a page, decides what the character should do, and presses a button. A different story appears. Additional adventures can be sold on disks.

<figure class="article-wide">
  <img src="https://cdn.hob.farm/articles/gonna-be-different/big-comic-pitch2.jpg" alt="MacMillan executives listen to Josh's electronic comic book presentation." width="1200" height="666" loading="lazy" decoding="async" />
  <figcaption>The MacMillan executives receive Josh's pitch.</figcaption>
</figure>

The movie quietly moves through three versions of the same idea:

**The child plays the story.**

**The adult returns to the unfinished choice.**

**Then he tries to build the machine.**

That sequence also fits the movie’s larger point. Josh becomes an adult before his time and discovers that he is good at selling childhood to adults. He understands toys because he still responds to them as a kid. The electronic comic is his best idea because it comes from a genuine desire to play.

But becoming the adult who builds and sells the game is not the same experience as being the kid who gets to disappear into it.

By the end, Josh chooses the life where he can still play.

The movie never stops to underline this as a separate subplot. It is simply there, running from the cavern to the boardroom.

## The electronic comic was never an e-reader

Years later, someone posted an image of Josh’s presentation to Reddit under the title:

> “TIL Tom Hanks developed the eBook reader in the 80’s, but it was rejected because he wasn’t big enough.”

<figure class="article-wide article-compact">
  <img src="https://cdn.hob.farm/articles/gonna-be-different/big-reddit.jpg" alt="Screenshot of a Reddit post calling Josh Baskin's electronic comic book an eBook reader." width="751" height="741" loading="lazy" decoding="async" />
  <figcaption>The old Reddit post about the electronic comic.</figcaption>
</figure>

The title misses the point in exactly the way modern technology discussions often miss the point. The interesting object was not the flat screen. It was not the ability to load books onto a portable device.

It was the choice.

A commenter arrived nine hours and 43 comments later with dialogue from the screenplay. Josh explains that readers will no longer follow the same story from beginning to end. They will press buttons and cause a different story to appear. Susan explains that the computer chip stores choices, allowing the reader to decide where the story goes. New disks provide entirely new adventures.

Another commenter remembers wishing the product had been real.

Then the first commenter makes a prediction:

> “If we ever create powerful AI, this would certainly come into existence as a side-product.”

That sentence sat there for fifteen years with two upvotes. ([Reddit](https://www.reddit.com/r/pics/comments/izn4o/til_tom_hanks_developed_the_ebook_reader_in_the/))

The rest of the thread is a small fossil from another version of Reddit. People quote the movie, make terrible puns, argue about whether a kid would pay nineteen dollars for a comic, remember the wizard scene, and discuss the games it inspired them to play. Someone says the thread is a perfect example of why they visit Reddit.

It was never an enlightened public square. Human slop existed long before generative slop acquired a name. But this particular conversation comes from before every harmless subject was required to become an identity test, a political performance, or an invitation to join one of two same-think camps.

Nobody treats the imaginary AI comic as an attack on writers. Nobody announces that using it would invalidate the reader’s imagination. Nobody starts an ideological war over whether the wizard possesses a human soul.

Someone predicts the machine, gets two upvotes, and the room returns to quoting *Big*.

They predicted the technology.

They did not predict the identity crisis that would eventually surround it.

## The long road to a different story every time

Josh’s idea did not appear from nowhere. Branching books, parser adventures, role-playing games, and MUDs had already established that a reader could also be a participant.

The same year *Big* appeared, Infocom and Tom Snyder Productions were releasing InfoComics on disk. Infocom’s own newsletter described *Lane Mastodon*, *Gamma Force*, and *ZorkQuest* as a new approach to storytelling. ([The Status Line](https://ifarchive.org/if-archive/infocom/NZT%2BTSL/TSL72.pdf))

Later narrative tools became much more sophisticated. Inkle’s open-source [Ink language](https://github.com/inkle/ink) allows authors to write highly branching stories while tracking state and responding to accumulated player choices. Games such as [*Pendragon*](https://www.inklestudios.com/pendragon/) assemble stories from thousands of authored pieces and remember moves, victories, defeats, and decisions.

Those systems solve branching through writing, variables, rules, and carefully designed combinations. They can become enormous, but they remain bounded by what their creators authored.

Large language models introduced a different possibility. A player could enter an action the designer never anticipated, and the system could improvise a response.

AI Dungeon became the obvious example. It can continue an open-ended story, but its own documentation emphasizes Memory, Story Cards, summaries, and selected context because the model needs important information repeatedly placed in front of it. When the system forgets choices, characters, objects, or relationships, the experience breaks. ([AI Dungeon Guidebook](https://help.aidungeon.com/getting-started))

Generation solves the finite-menu problem and creates a continuity problem.

A model can write a convincing paragraph in which a dead character walks into the room, an expended item returns to inventory, a relationship changes without cause, or the laws of the setting quietly rewrite themselves. The prose may sound fine while the game underneath it has ceased to exist.

Recent research describes the same problem. [*World-State Transformations for Neuro-symbolic Interactive Storytelling*](https://arxiv.org/abs/2605.24719) reports coherence failures in systems that rely entirely on language models, then explores using free-text input to trigger rule-based world-state transformations. Another project, [STORY2GAME](https://arxiv.org/abs/2505.03547), generates actions with explicit preconditions and effects so that open-ended interaction still changes tracked game state.

A 2026 preprint survey of 53 AI-native games and prototypes reaches a similarly practical conclusion: generation alone does not guarantee playability. Open-ended output still needs goals, rules, state, feedback, pacing, and meaningful agency. ([*AI-Native Games: A Survey and Roadmap*](https://arxiv.org/abs/2607.00527))

The electronic comic is possible now.

Making it good remains the hard part.

## The Other Alice version

Other Alice Adventures gives the idea a world that already behaves like a system.

Routes depend on recognition, permission, labor, memory, and obligation. Institutions overlap. Repairs affect trade. Trade affects contracts. Contracts affect authority. Characters continue acting while Alice is somewhere else. Visitors introduce objects, habits, methods, and ideas that Wonderland may copy, distort, prohibit, commercialize, or absorb into its ecology.

A choice should change the world in a way the player understands now and encounters again later.

That is the core test.

I am exploring a hybrid architecture rather than asking one enormous model to impersonate the entire universe.

Canon establishes what exists.

Rules determine what actions cause.

Structured world state records what has happened.

Story systems determine which consequence matters now.

Language and image models render the result as prose, dialogue, descriptions, and selected visual scenes.

The central rule is simple:

> **The language model describes what happened. It does not decide what happened.**

That division allows the presentation to remain flexible while the world underneath it stays coherent.

If the player repairs a road without authorization, the rules can improve the road’s condition, alter trade, create an obligation, and increase institutional scrutiny. The model may describe the wet repair compound, the worker’s hesitation, and the checkpoint runner who notices the work. It cannot decide that an unrelated dragon arrives carrying a magical permit unless the world actually contains a reason for that to happen.

The LLM becomes a performer inside the system rather than the system itself.

## The Grimoire and the Workshop

This is where the rest of HobFarm begins connecting to the idea.

The Grimoire is an evolving, structured knowledge and vocabulary system. In the Workshop, it helps tools describe known styles, materials, compositions, character details, and visual relationships accurately. When information is missing, the useful behavior is to identify the gap so I can research it, define it, and add it deliberately.

A game-safe version of that idea could help manage approved Other Alice material without dumping the entire world into every request.

The system retrieves what a particular scene needs. It follows versioned rules. New information enters through a human review process. Changes are recorded in a ledger so earlier states can be inspected rather than silently overwritten.

That matters creatively and technically.

A changelog can show when a character fact changed, which scenes used the older version, what prompt or rule produced a result, and whether the revision improved anything. A generated possibility can remain part of one player’s private history without automatically becoming official Other Alice canon.

StyleFusion applies a related pattern to images. It studies references, identifies what contributes to a visual blend, records the important design information, and produces reusable prompts and assets. It can also compare how different models interpret the same instructions.

The game engine would apply that thinking to events.

StyleFusion asks: **What makes this image remain this image when another model renders it?**

The game asks: **What makes this world remain this world when the player does something unexpected?**

HobFarm provides the container for both. Other Alice holds the public story world. The Workshop develops the machinery and assets. Articles document the history, theory, successes, and failures. Galleries and video preserve the results. The Academy can eventually turn tested methods into lessons and usable systems.

The game connects those parts by allowing someone to enter the world and leave behind a history.

## Keeping the machine inside the machine

A hybrid design also makes the project more practical.

Calling a large model for every background action, inventory check, movement, and routine NPC decision would be slow and expensive. The system can reserve generative inference for moments that actually require interpretation or new expression.

Rules handle routine consequences. Structured retrieval supplies relevant facts. Authored material covers known situations. Smaller specialized processes can classify intent, select memories, or validate actions. Larger models enter when semantic uncertainty or a major scene makes their flexibility worthwhile.

Recent AI-game research points toward the same approach: inference has a marginal cost tied to model size, token volume, request frequency, and latency, so routine behavior should use traditional systems, cached content, or smaller models while expensive generation is reserved for high-value moments. ([*AI-Native Games: A Survey and Roadmap*](https://arxiv.org/html/2607.00527v2))

The framework constrains the model, reduces unnecessary calls, and creates something that can be inspected when it fails.

Human involvement remains part of the loop. I can add missing information, approve new material, correct mistakes, compare generations, revise the rules, and track what changed. The system assists the project’s development without quietly declaring its own improvisations to be true.

This does not eliminate hallucination. It gives hallucination fewer places to hide.

## Pressing the next button

The first playable version does not need to be an infinite 3D Wonderland.

It needs one visitor, one district, one problem, several characters, a world clock, and a set of choices whose effects return later. It needs to remember what the player did. It needs to recognize that waiting too long can also be a decision.

The player might finish with a Visitor Record showing what changed, who remembers them, what remains unresolved, and which parts of Wonderland have begun responding to their presence.

That is enough to prove the idea.

I want to develop it through HobFarm by publishing the concepts, interfaces, character assets, experiments, failures, and playable fragments as they emerge. People could follow the process, test early versions, contribute useful information, and watch a fictional electronic comic slowly become an actual story system.

The Reddit commenter was right. Powerful AI made Josh Baskin’s product possible as a side effect.

The real work is building a world worth putting inside it.

## Three degrees later

Because all of this began with Tom Hanks, it also produces a clean Three Degrees of Dick Miller connection.

*Big* gives us Hanks. Hanks leads to Joe Dante’s *The ’Burbs*. Dick Miller appears in *The ’Burbs* as one of the garbagemen passing through the neighborhood’s escalating paranoia. ([Rotten Tomatoes](https://www.rottentomatoes.com/m/the_burbs/cast-and-crew))

A computer wizard, an electronic comic, artificial intelligence, Other Alice, and Dick Miller.

That is more or less how HobFarm works.

I have been waiting since I was a kid to press the next button.

<div class="article-source-list">
  <h2>Sources and further reading</h2>
  <ul>
    <li><a href="https://www.reddit.com/r/pics/comments/izn4o/til_tom_hanks_developed_the_ebook_reader_in_the/">Reddit: “TIL Tom Hanks developed the eBook reader in the 80’s”</a></li>
    <li><a href="https://ifarchive.org/if-archive/infocom/NZT%2BTSL/TSL72.pdf"><em>The Status Line</em>, Summer 1988: “InfoComics: New approach to entertainment”</a></li>
    <li><a href="https://github.com/inkle/ink">inkle: Ink narrative scripting language</a></li>
    <li><a href="https://www.inklestudios.com/pendragon/">inkle: <em>Pendragon</em></a></li>
    <li><a href="https://help.aidungeon.com/getting-started">AI Dungeon Guidebook: Getting Started</a></li>
    <li><a href="https://arxiv.org/abs/2605.24719">“World-State Transformations for Neuro-symbolic Interactive Storytelling”</a></li>
    <li><a href="https://arxiv.org/abs/2505.03547">“STORY2GAME: Generating (Almost) Everything in an Interactive Fiction Game”</a></li>
    <li><a href="https://arxiv.org/abs/2607.00527">“AI-Native Games: A Survey and Roadmap”</a></li>
    <li><a href="https://www.rottentomatoes.com/m/the_burbs/cast-and-crew"><em>The ’Burbs</em> cast and crew</a></li>
  </ul>
</div>
