# Proposed Editorial Mesh

The corpus supports six broad reader-facing sections. Every one of the 67 published or scheduled articles has exactly one.

## Primary sections

| Section | Articles | Definition | Exclusion test |
| --- | ---: | --- | --- |
| Technology | 28 | A technical system, tool, game, model behavior, ownership boundary, or computing history drives the article. | Technology was merely used while producing an article about another subject. |
| Art & Design | 11 | The article's central object is a visual language, artwork, design method, or aesthetic history. | The visual material mainly demonstrates software, model behavior, infrastructure, or another technical system. |
| Culture | 11 | The article follows people, institutions, media, belief, memory, or cultural change across more than one narrower desk. | A single musical, screen, visual, technical, or physical system clearly owns the article instead. |
| Film & TV | 10 | A screen work, performer, production system, or broadcast history owns the article. | A movie or show is only an analogy, example, or doorway into a technology or culture article that quickly leaves the screen work behind. |
| Music | 4 | Music is the article's central object, discovery path, or reader promise. | Music is only a scene, soundtrack, venue detail, or connection inside a broader cultural or place-based story. |
| Places & Systems | 3 | A place or physical system is the organizing object rather than a backdrop. | The place is primarily scenery for a personal, musical, film, or cultural story. |

## Strict series and specials

| Series | Articles | Membership rule |
| --- | ---: | --- |
| Magazine Time Machine | 4 | A specific old magazine artifact directly starts or materially drives the investigation, and mesh.sourceArtifacts records it with type magazine and role origin. |
| 3 Degrees of Dick Miller | 5 | The article contains a real, sourced Dick Miller connection and uses that connection as part of its editorial construction. |
| Built Over | 2 | A recurring place-history investigation reconstructs a physical site and the successive systems built over it. |

Three legacy 3DM records do not pass the Dick Miller test. Their old fields and URLs remain, but the canonical `mesh.series` field omits 3DM so they do not appear in the strict series archive.

## Most-used subjects

| Value | Articles |
| --- | ---: |
| artificial-intelligence | 15 |
| ai-image-generation | 11 |
| media-history | 11 |
| creative-workflows | 10 |
| film-history | 10 |
| visual-systems | 7 |
| art-history | 6 |
| creative-systems | 6 |
| knowledge-systems | 6 |
| model-behavior | 6 |
| platform-economics | 6 |
| schema-design | 6 |
| software-ownership | 6 |
| censorship | 5 |
| cloud-computing | 5 |
| personal-history | 5 |
| publishing | 5 |
| automation | 4 |
| character-actors | 4 |
| computing-history | 4 |
| creative-tools | 4 |
| music-discovery | 4 |
| open-computing | 4 |
| pre-code-hollywood | 4 |
| psychedelic-art | 4 |
| publishing-workflow | 4 |
| regional-history | 4 |
| research-methods | 4 |
| social-media | 4 |
| benchmarking | 3 |

## Canonical dimensions

- `mesh.section`: one stable human-facing shelf.
- `mesh.subjects`: conceptual domains that materially shape the article.
- `mesh.series`: rule-based recurring editorial properties.
- `mesh.entities`: canonical people, organizations, places, events, works, publications, and technologies.
- `mesh.sourceArtifacts`: artifacts that originate or organize the article, not ordinary citations.
- `mesh.storyModes`: recurring editorial engines such as archive trails, media genealogy, and systems investigation.
- `relatedArticles`: the existing explicit editorial override remains authoritative.

The old taxonomy remains an additive compatibility input. Public section navigation, structured article metadata, the related-reading fallback, and the public graph use the new mesh.
