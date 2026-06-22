# HobFarm Voice and Palette Glossary

The single source of truth for how hob.farm public surfaces read and look. When this file and a `CLAUDE.md` or `AGENTS.md` disagree, this file wins for voice and palette; update the other doc to match. When a page is genuinely technical (the whitepaper, a process write-up, Grimoire internals), accuracy wins over flavor.

The direction in one line: **plain and clear, strange and polished.** Say what the thing is and does in language anyone can read on the first pass. The HobFarm edge (Atomic Noir, psychedelic goth, outsider media-lab) lives in the work and the visual system, not in a vocabulary the reader has to translate.

---

## 1. Palette (psychedelic goth)

Tokens live in the Tailwind 4 `@theme` block in `src/styles/global.css`. There is no `tailwind.config.ts`. Never hardcode hex in components; consume the token (`bg-base-900`, `text-accent-violet`, `border-accent-500`, `text-white`).

### Grounds and text

| Token | Hex | Role |
|---|---|---|
| `--color-base-950` / `--color-noir-bg` | `#07060b` | page void (near-black, faint purple) |
| `--color-base-900` / `--color-noir-surface` | `#0e0b16` | cards, panels |
| `--color-base-800` / `--color-noir-elevated` | `#15101f` | raised surface |
| `--color-base-700` / `--color-noir-border` | `#221a33` | borders (purple-tinted) |
| `--color-base-600` | `#2c2440` | border-light |
| `--color-white` / `--color-base-100` | `#ece9f5` | primary text |
| `--color-base-400` / `--color-noir-muted` | `#9b96ad` | secondary / dim text |
| `--color-base-300` | `#c8c6d4` | grey-light |

### Saturated accents

| Token | Hex | Notes |
|---|---|---|
| `--color-accent-violet` (and `accent-500`) | `#7b2ff7` | primary accent (purple) |
| `--color-accent-magenta` | `#e0218a` | |
| `--color-accent-cyan` | `#19e3e3` | |
| `--color-accent-green` | `#2fe089` | acid green, accent/glow |
| `--color-accent-blue` | `#3b6fe0` | |
| `--color-accent-red` | `#e23a4e` | |
| `--color-accent-gold` | `#e0b13c` | highlight only, never primary |

Each accent has `-dim` and `-bright` variants. `--color-accent-500-rgb: 123, 47, 247` exists for `rgba(var(...))` glow shadows (project cards).

### Rules

- **Goth structure first:** dark grounds, strong type, hard contrast. **Psychedelic color second:** purple / magenta / cyan / green interplay on focal points (titles, active nav, gallery hovers). This supersedes the old "one palette per page, never mix" rule.
- **Glow is selective,** not global. Focal elements only.
- **Avoid:** corporate blue gradients, sterile dashboard look, flat SaaS illustration, default-AI glow as a crutch, cute farm clip-art, cozy farmhouse-Pinterest.
- **Contrast:** `#9b96ad` dim text passes on the dark grounds and is safe for secondary text. `#7b2ff7` purple is only ~3.33:1 on `#0e0b16`, so use it for borders, large accents, and active states, **not small body text**. For small text on a dark ground, use a lighter accent variant (`--color-accent-violet-bright` `#a06bff`) or `#ece9f5`.

---

## 2. Voice

Plain, direct, quickly understandable. Lead with what the thing is and what it does for the reader. Anti-hype. No em dashes (use commas, colons, parentheses, or separate sentences).

Two traps to avoid, equally:

- **Farm/cultivation metaphor as decoration.** "From signal to keeper," "feed the greenhouse," "what grew here," "cultivation paths," "grow logs," "specimens" as headers, CTAs, or labels. The farm metaphor is no longer a required vocabulary. Do not reach for it to sound on-brand. (Section 3 covers the narrow places organic-tech words still earn their place.)
- **SaaS / AI-platform / machine jargon.** "Leverage," "empower," "seamless," "scalable," "innovative," "orchestration" as marketing, "pipeline / engine / output" as decoration. Describe the actual thing instead.

Personality comes from being specific and a little strange about real things, not from a metaphor system. A good header is boring-clear ("Recent Work," "How It's Made," "What Grimoire Does," "Support HobFarm"); the body copy and the visuals carry the voice.

### Replacements (decorative metaphor and jargon → plain)

Keep the meaning, change the frame.

| Avoid (as public copy) | Use instead |
|---|---|
| keeper, specimen, grow log, grow sheet, cultivation path, "what grew here" | piece, entry, record, finished work, writeup, how it's made |
| greenhouse, farm stand, teaching barn, back field | HobFarm / the studio, shop, courses, experiments |
| "from signal to ___", "feed the ___" | plain headers ("How It's Made", "Support HobFarm") |
| leverage, empower, seamless, scalable, innovative, enterprise | drop; describe the actual thing |
| pipeline, engine, orchestration, output (as marketing copy) | the process, the system, how the work moves, finished work |
| sample, dataset, asset (as copy) | example, collection, piece / file |

When a page is genuinely technical (the whitepaper, Grimoire internals, a process write-up), accuracy wins: use the precise term (see section 5).

### Surface names (plain, literal)

- Projects = the tools and systems HobFarm builds (StyleFusion, Grimoire, HobBot, HobFarm TV, and experiments).
- Visuals = the gallery of finished images and video.
- Process / How It's Made = how a piece was made.
- Academy = courses.
- Shop = goods for sale.
- Services = hire HobFarm.
- Blog = essays and notes.
- About = story and contact.

---

## 3. Where organic-tech words still earn their place

Organic-tech vocabulary is allowed only where it names a **real, structural system**, not as decoration:

- **Seasonal release rhythm.** Season, growth cycle, color phase, and harvest window are the actual names of HobFarm's internal release scaffold (see `AGENTS.md` / `CLAUDE.md`). They can appear when describing that system, mostly in internal or organizing context. Keep them out of first-impression marketing headers.
- **Grimoire concepts.** Grimoire is a real knowledge graph: correspondences, relationships, and indexing are accurate descriptions of what it stores. Use them to explain, not to mystify.

Test: if an organic-tech word is doing decorative work (delete it and the sentence reads clearer), delete it.

---

## 4. Grimoire

Grimoire is a name; keep it. It is a working database of how images, words, styles, references, and finished work connect. Explain it plainly. Light flavor (correspondences, recipes, indexing) is fine when it clarifies, never when it hides what the page actually does. Do not pile on mystical vocabulary as a substitute for a clear explanation.

---

## 5. Do-not-replace (accuracy and exceptions)

The plain-language default is for public marketing surfaces, not for internal accuracy or names.

- **Names stay:** StyleFusion, Grimoire, HobBot, HobFarm, HobFarm TV, AnomalyBot, Drifter, XKXXKX, and provider / model names (e.g. Seedream). These are names, not metaphors.
- **`specimen` schema names stay.** `specimenId` / `specimenSheet` (in `src/content.config.ts`, gallery frontmatter, `SpecimenCard.astro`) are internal field names, retired from visible copy but kept as keys until a future content migration renames them across the schema and every entry. Do not rename keys piecemeal.
- **Internal code identifiers stay:** component file names (`OutputWall.astro`, `ProcessPipelinesSection.astro`), CSS ids (`cultivation-flow`), gallery type slugs (`asset-lab`), and the `seed-to-world` route slug and title.
- **Fashion copy is not jargon:** "platform boots", "platform footwear", "platform sandals" are real garments. Leave them.
- **Technical / process pages** (whitepaper, Grimoire engine explanations, process write-ups) may keep `pipeline`, `output`, `dataset`, `orchestration` where the term is the accurate one. HobBot genuinely is multi-agent orchestration; say so on its own technical card.
- **Legal pages** (`terms`, `privacy`, `refunds`) use `payment platform` / `marketplace platform` as accurate legal terms. Leave them.
- **Historical posts** (`src/content/blog`, `src/content/changelog`) keep their original text.
