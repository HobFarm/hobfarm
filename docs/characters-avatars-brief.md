# Characters and avatars: split the model, retire `/characters/`

Runs with the Presents migration (`presents-migration-brief.md`), which is where
`/characters/` and `/funnies/` actually move. This brief defines *what the
things are* so that migration has something correct to move.

Read `CLAUDE.md` first. Do Pass 2 B1/B2 before this.

---

## The problem

`src/data/characters.ts` is one 605-line list holding three unrelated kinds of
thing: comic characters, presenter avatars, and Other Alice residents. They have
different fields, different homes, and different lifecycles. Treating them as
one type is what produced a site-wide `/characters/` index that belongs nowhere.

**Split them by what they are.**

| Class | What it is | Home |
| --- | --- | --- |
| Comic characters | Cast of a Funnies strip | Their series page under `/presents/funnies/<series>/` |
| Avatars | Presenters and hosts HobFarm produces | `/workshop/avatar-host/` |
| Characters | A named character developed into a reusable identity, with its own satire, anchors, modes, and editions | `/workshop/character-mannequin/characters/<slug>/` |
| Other Alice residents | Cast of the Other Alice world | Other Alice, managed separately |

There is no site-wide cast index. `/characters/` retires.

---

## Class 1: comic characters

### Series consolidate from eight to three

`src/data/comic-series.ts` currently defines eight series. Only four have any
comics, and the new structure is three.

| Series | Comics | Disposition |
| --- | ---: | --- |
| `larry` | 6 | **Keep** |
| `gary` | 6 | **Keep** |
| `buffcock` | 4 | **Keep** |
| `gary-fat-cat` | 1 | **Fold into `gary`.** Move `gary-fat-cat-design.md` and 301 its permalink |
| `fat-cat` | 0 | **Retire.** Empty definition |
| `gothcat` | 0 | **Retire.** Gothcat is a Larry character, not a series |
| `hobunny` | 0 | **Retire the series.** Hobunny is a character property, not a strip. See Class 3 |
| `one-offs` | 0 | **Ask d00d.** Empty, and not in the new taxonomy |

Retiring the four empty series costs nothing: no comics, no permalinks. Only
`gary-fat-cat` needs a redirect.

### Cast per series

| Series | Characters |
| --- | --- |
| `larry` | larry, helmut, leon-berger, gothcat, heidi, plus minor recurring cast: the poodle trio, and Helmut's poker buddies (other German dog breeds) |
| `gary` | gary, fat-cat |
| `buffcock` | buffcock, cs, gf |

### Characters to add

These appear in published comics but have no record in `characters.ts`:

| Character | Evidence |
| --- | --- |
| `leon-berger` | `src/content/comics/larry-leon-berger.md` |
| `gf` | Buffcock's cast, per d00d |
| The poodle trio | `src/content/comics/larry-helmut-poodles.md` |
| Helmut's poker buddies | `src/content/comics/larry-poker.md` |

Give the minor cast a lighter shape than the leads. A name and a one-line note
is enough; they do not need the full bio, traits, and relatedSeries treatment.
**Do not invent personalities or backstory.** Record what the comics show. If a
character needs a bio, flag it for d00d.

### Bios move onto the series page

This is the part that is easy to get wrong. `src/pages/funnies/[series]/index.astro:45-54`
currently renders only character *names*, linked out to `/characters/<slug>/`.
The bios themselves live in `characters.ts` and render in
`src/pages/characters/[character].astro`, which is 339 lines.

**Move the bio content onto the series page before deleting the character
routes.** Otherwise 605 lines of writing become unreachable.

A character in more than one series appears on each. Pick the first entry in its
`relatedSeries` as the 301 target for its old `/characters/<slug>/` URL.

---

## Class 2: avatars

Avatars are not comic characters. They are presenters HobFarm builds, and they
are the output of the Avatar & Host method, so they are documented in Workshop.

**The avatars are already defined.** Workshop already covers who they are, why
they exist, and what d00d does with them. Do not rewrite that, and do not invent
new avatar material. The work here is filing: one avatar is in the wrong data
file, and the PsyGoth roster is hardcoded in a page instead of a data file.

### The roster

Defined in `src/data/media-registry.ts:93-98`, with per-role media at 154-167.

| Avatar | Role | Content ships to | Media keys |
| --- | --- | --- | --- |
| **Hillary** | HobFarm TV host. Also carries Magazine Time Machine, essays, and 3DM. Three role variants: main presenter, Workshop technical editor, TV cinema host | YouTube | `avatar.identity.hillary`, `avatar-host.hillary.{main,workshop,cinema}.*` |
| **Ami** | Social media influencer and product spokesperson | Instagram | `avatar.identity.ami`, `avatar-host.ami.social.*` |
| **Em** | PsyGoth trio, green growth lane | Mixed | `avatar.identity.em`, `avatar-host.em.trio.*` |
| **Nina** | PsyGoth trio, red pressure lane | Mixed | `avatar.identity.nina`, `avatar-host.nina.trio.*` |
| **Zima** | PsyGoth trio, blue structure lane | Mixed | `avatar.identity.zima`, `avatar-host.zima.trio.*` |
| **Hobgal** | Retired early presenter prototype. Marked `safe-to-archive-later` | None | `avatar.identity.hobgal` |

PsyGoth is a defined aesthetic with specific traits, used for style, colour, and
art concepts. Em, Nina, and Zima carry it. It is a style system, not a strip.

**The content each avatar produces is for social media, not the site.** Hillary
goes to YouTube, Ami to Instagram, the PsyGoth trio across a mix. The website
documents the avatar and the method behind it. The finished presenter videos
ship to the platform. Do not build an avatar video gallery, a reel page, or an
embeds hub. Record the platform in `avatars.ts` as a field so the relationship
is data rather than prose.

### Create `src/data/avatars.ts`

Avatars need fields comic characters do not: role variants, lane, accent colour,
logical ID, and media keys. Those already exist, hardcoded inline in
`src/pages/workshop/workshop-notes/psygoth/index.astro` as a `chapters` array
with `logicalId`, `lane`, `accent`, `profile`, `video`, `transcript`, `thesis`,
`stills`, and `continuity`.

Extract that shape into `src/data/avatars.ts` and populate it for all six, plus
a `platform` field carrying the social destination from the roster table. The
PsyGoth page then reads from the data file instead of holding its own copy.

This is a refactor of existing material, not new authorship. Every value already
exists in the media registry or the PsyGoth page.

**Move `hillary-hobfarm` out of `characters.ts`.** It is an avatar and was never
a comic character. That also resolves the open question from the Presents brief
about where Hillary goes: `/workshop/avatar-host/`.

### Where avatars render

`/workshop/avatar-host/` is the avatar home, created in Pass 2 B1c. It should
carry the roster and link to each avatar's material.

The PsyGoth material currently sits at `/workshop/workshop-notes/psygoth/`.
**Ask d00d** whether that page moves under `/workshop/avatar-host/psygoth/` or
stays a Workshop Note. It reads as an avatar system, not a note, but it is a
real published page with inbound links and the call is d00d's.

Avatars are *documented* in Workshop; their content ships to social. That split
is the same one that governs everything else: the site shows the process, social
gets the output.

---

## Class 3: character properties

A character property is a named character developed far enough to be reusable:
identity, personality, visual anchors, satire, and world. It is not a comic strip
cast member and not a presenter avatar.

**A character property is the result of the Character / Mannequin process, not a
second methodology.** The Workshop describes the process once. Character property
pages show what it produces. The same process produces the next character.

**Hobunny is the first.** Her specification is
`docs/hobunny-project-source.md`, authored by d00d and canonical as of 2026-07-31.

### What the page is for

One job, and it governs every design decision:

> Someone sees Hobunny content on social and wonders whether it is a one-off AI
> picture. This page shows it is not. She is a character from a developed system,
> and the system is visible.

That means the page has to work for a cold arrival, show the character, and make
the process behind her legible **by pointing at it**, not by restating it.

### Route shape

Characters nest under the method that produced them. **One page per character.**

| Route | Job |
| --- | --- |
| `/workshop/character-mannequin/` | The method. Already exists. Gains a "Characters created with this method" section |
| `/workshop/character-mannequin/characters/` | Character index |
| `/workshop/character-mannequin/characters/hobunny/` | Hobunny's canonical dossier |
| `/hobunny` | Short vanity alias, 301 to the dossier |

> **Slug correction.** The Character Development System spec written 2026-07-31
> gives the parent as `/workshop/mannequin-character/`. **That route does not
> exist.** The repo slug is `character-mannequin`, defined at
> `src/data/site-hierarchy.ts:65` and live at
> `src/pages/workshop/character-mannequin/`.
>
> Following the spec literally would either create a duplicate route or rename a
> route that Pass 2 just validated, breaking its redirects and nav. The spec
> itself says "unless an established project convention requires another" and
> "do not restructure unrelated Workshop routes," so the repo slug wins. Use
> `character-mannequin` everywhere.

The nesting is deliberate and does not contradict Pass 2. Avatar & Host was
un-nested from under Character / Mannequin because it is a peer *method*.
Characters are *outputs* of that method, so nesting states the real
relationship. Do not promote a character to its own Workshop program or nav item.

The canonical path is four levels deep, which is poor for a page whose job is
catching cold social traffic. Hence the `/hobunny` alias. The repo already uses
this pattern: `_redirects:7-8` carries `/stylefusion` and `/sf`. The deep path
stays canonical; the short one is for putting in a bio or a caption.

### Do not rebuild the Workshop on this page

The outline was narrowed on 2026-07-31 because it had grown into a parallel
methodology. Read the "Narrowed" note at the top of
`docs/hobunny-project-source.md` before building anything.

**Superseded:** outline §13's two-page structure and §14's twelve development
sections. Do not build a `/development/` sub-page.

The process is described once, in the programs that already own it:

| Belongs to | Not to Hobunny's page |
| --- | --- |
| `/workshop/character-mannequin/` | Mannequin to design to character, base figure, proportions, continuity rules, character sheets, prompt structure |
| `/workshop/cute-and-corrupted/` | Corrupted Mode as a technique |
| `/workshop/before-and-after/` | Edition to corrupted-outcome pairs |

Hobunny's page links to those. If a section of the outline reads like a
procedure, it belongs in the Workshop program, not here. If it reads like a fact
about Hobunny, it belongs here.

Hobunny-specific detail that happens to be procedural, such as her own continuity
rules or edition metadata, stays on her page as evidence of the system working.
The general method does not.

### Vocabulary

Use these terms consistently in code, data, and copy:

| Term | Meaning |
| --- | --- |
| **Mannequin** | An appearance-focused base used to test visual construction |
| **Character** | A mannequin with stable identity, personality, purpose, visual anchors, and continuity |
| **Edition** | A contextual version of the same character built around an era, culture, role, or commercial fantasy |
| **Content** | Public images, cartoons, clips, advertisements, sheets, and posts made from a character or edition |
| **Premium layer** | Optional higher-value material, developed only after public recognition exists |

The workflow the system documents:

```text
references -> mannequin -> canonical character -> editions -> recurring content
-> audience recognition -> optional premium products
```

Hobunny starts as an intentionally generic rabbit-girl mannequin: ears, tail,
doll anatomy, a meaning-neutral bodysuit or swimsuit. The character is what gets
added on top. **Do not present that generic mannequin as the finished Hobunny.**

### Page content

The dossier records the finished reusable identity. It answers: who is this
character, what stays consistent, what is the character for, how does it behave,
what visual and thematic territory does it occupy, what editions exist, and where
can someone find public work involving it.

From the outline sections marked "the character": §1, 5, 6, 7, 8, 9, 10, 11, 18,
19, 20. Identity, satire, permanent anchors, the three modes, editions, voice,
boundaries.

Plus the evidence layer: character sheets, mode translations, and Cute →
Corrupted pairs shown as output of the documented process, each linking back to
the program that explains the technique.

### Editions

An edition applies Hobunny to a specific era, scene, industry, lifestyle fantasy,
or commercial system. Model each as a record with: title, era or cultural
setting, promised fantasy, Hobunny's role, fashion and visual language, palette
and materials, composition language, commercial products or slogans, satirical
contradiction, possible corrupted outcome, public outputs, status.

**Hobunny '66 is the first authored edition.** It uses the project's
interpretation of mid-1960s youth-oriented fashion and editorial culture: youth
as a commercial market, "the new" as a recurring media product, boutique
identity, beauty marketing, and modern femininity packaged through fashion and
consumer goods.

It should read as a specific editorial and cultural edition, not Hobunny in a
random retro costume.

**Do not treat Hobunny '66 as a separate character.** It is an edition of
Hobunny.

**Accuracy guardrail:** do not claim this interpretation is the argument of the
inaccessible Vogue article. That text has not been obtained. If it is obtained
later, that is a separate decision.

### Distribution and monetization

The website is the permanent canonical foundation. Public content may appear on
DeviantArt, social media, HobFarm galleries, video platforms, and product
listings, and individual posts should be able to point back to the dossier.

**Do not build live social feeds or platform-dependent embeds.**

Do not make premium or adult material the primary definition of Hobunny. The
intended sequence is: establish the character publicly, release recognizable
editions, build continuity and recognition, test products, then develop premium
variants when there is evidence of interest.

**Leave room for future product links. Do not build a paywall or premium-content
system.**

### Build the container, not the content

**This is the most important rule in this brief.**

`docs/hobunny-project-source.md` contains authored creative material: voice
lines, edition concepts, satire targets, character anchors, a central
contradiction. An agent must not invent, paraphrase, extend, summarize, or
"improve" any of it.

Build the routes, the data shape, the components, and the cross-links. Place
d00d's text where the outline says it goes. Where the outline calls for content
that does not exist yet, such as a hero image or a first edition, **leave the
slot empty and report it.** Do not generate placeholder Hobunny material.

Specifically, do not fabricate artwork, social links, article quotations,
publication history, or audience statistics. If a slot needs one of those and it
does not exist, the slot stays empty and gets reported.

### The existing record contradicts the spec

`src/data/characters.ts:276-283` currently defines Hobunny as:

> "The HobFarm rabbit and on-again, off-again mascot, present for most of the
> farm's worse ideas." Traits: Rabbit, Mascot duties optional, Suspiciously calm.

That is a different character from the one in the outline. It is an older,
thinner conception, not a summary of the new one.

**Replace it. Do not merge.** Do not attempt to reconcile "suspiciously calm"
with the adult fashion-doll satire character. Delete the old record and build
from the outline.

Also retire the `hobunny` entry in `comic-series.ts`. Hobunny has never been a
comic strip, has zero comics, and is not one of the three Funnies series. This
resolves open question 1 from the earlier version of this brief.

### Cross-links

The character property connects to existing Workshop programs. Link, do not
duplicate:

| Program | Relationship |
| --- | --- |
| `/workshop/character-mannequin/` | The method this case study continues |
| `/workshop/cute-and-corrupted/` | Corrupted Mode is an application of it. Seven gallery entries already exist |
| `/workshop/before-and-after/` | Edition → corrupted outcome pairs |
| `/workshop/avatar-host/` | Outline §5 lists "digital avatar" as a possible Hobunny role. Related, but Hobunny is a property, not an avatar |

DeviantArt is the named commerce channel for character material, which matches
the Shop table in `CLAUDE.md`. Social and DeviantArt distribute; the site holds
the permanent definition.

### Building it for the second character

The whole point is that the process transfers. Build
`/workshop/character-mannequin/characters/` so a second character can be added as
data plus content, without new route work. Do not hardcode Hobunny into the route
or the components.

If a component you are writing for Hobunny would not work for the next character,
it is describing method rather than character, and the method belongs in a
Workshop program.

---

## Class 4: Other Alice

**Out of scope. Do not touch it in this pass.**

Other Alice is a website within the website: a large world with many characters
and its own structure, and it is managed separately. Its cast already has a
proper home at `/presents/other-alice-adventures/cast/`, rendering
`publicOtherAliceCast` through `CastDossierFolio` with `#cast-<slug>` anchors.

One thing to record, not act on: `characters.ts` also holds `alice`, `chester`,
and `the-hatter`, duplicating records in the Other Alice cast system. When
`/characters/` retires, redirect those three to their cast anchors and retire
the duplicate records. **Report anything the `characters.ts` version says that
the cast record does not.** Do not merge it silently, and do not restructure
Other Alice while doing it.

---

## Redirects

| From | To |
| --- | --- |
| `/characters/` | `/presents/funnies/` |
| `/characters/<comic-character>/` | Its series page |
| `/characters/alice/`, `/chester/`, `/the-hatter/` | `/presents/other-alice-adventures/cast/#cast-<slug>` |
| `/characters/hillary-hobfarm/` | `/workshop/avatar-host/` |
| `/funnies/gary-fat-cat/gary-fat-cat-design/` | `/presents/funnies/gary/gary-fat-cat-design/` |
| `/funnies/gary-fat-cat/`, `/fat-cat/`, `/gothcat/` | `/presents/funnies/gary/` or `/larry/` as appropriate |

The `/funnies/` to `/presents/funnies/` prefix move is specified in the Presents
brief. Do not duplicate that work here.

---

## Inbound links

| File and line | Action |
| --- | --- |
| `src/data/other-alice/residents.ts:69,100,186` | Three hrefs to alice, chester, the-hatter. Repoint to cast anchors |
| `src/pages/departments/hobfarm-presents/[series]/[slug].astro:311` | "Meet Other Alice" button. Repoint |
| `src/data/site-sections.ts:76` | `{ label: "Characters", href: "/characters/" }`. Remove |
| `src/pages/departments/funnies.astro:170`, `src/pages/departments/[slug].astro:224` | Both files are deleted by the Presents migration |
| `src/content/articles/other-alice-origin.md:125` | Body prose. **Leave it.** The 301 handles it |

---

## Verification

- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] `npx astro check` clean
- [ ] All 17 comics still reachable, `gary-fat-cat-design` included
- [ ] Every character bio is readable on a series page before
      `src/pages/characters/` is deleted
- [ ] Three Funnies series only; no empty series generates a route
- [ ] Avatar roster renders at `/workshop/avatar-host/` for all six
- [ ] PsyGoth page reads from `avatars.ts`, not its own inline array
- [ ] No `/characters/` link anywhere
- [ ] `/workshop/character-mannequin/characters/` renders and would accept a
      second character without route changes
- [ ] No `/workshop/mannequin-character/` route exists anywhere
- [ ] `/hobunny` 301s to the canonical dossier
- [ ] Character / Mannequin has a "Characters created with this method" section
- [ ] No paywall, premium gate, live social feed, or platform embed was built
- [ ] No invented Hobunny content anywhere. Empty slots are reported, not filled
- [ ] The old "suspiciously calm" Hobunny record is gone, not merged
- [ ] No `/development/` sub-page exists
- [ ] Hobunny's page restates no method that a Workshop program already covers.
      It links instead
- [ ] A cold visitor from social can tell within one screen that Hobunny comes
      from a developed system
- [ ] Other Alice cast page and its data are unchanged
- [ ] Every retired path 301s in one hop

---

## Open questions for d00d

1. **One-Offs.** Empty series. Keep as a home for standalone comics, or retire?
2. **PsyGoth page.** Move to `/workshop/avatar-host/psygoth/`, or keep it at
   `/workshop/workshop-notes/psygoth/`?
3. **Minor Funnies cast.** The poodle trio and the poker buddies: individual
   records, or one group record each?
Resolved 2026-07-31: Hobunny is a character, not a comic series; Hillary is an
avatar, not a comic character; characters nest under `character-mannequin` with a
`/hobunny` vanity alias covering the route-depth problem.
