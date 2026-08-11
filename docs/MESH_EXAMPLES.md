# Mesh Classification Examples

These examples are conceptual tests for the migration. Final section slugs must come from the corpus audit.

## Wavy Gravy

```yaml
mesh:
  section: culture
  subjects:
    - counterculture
    - communal-living
    - festival-culture
    - music-culture
    - social-history
  series: []
  entities:
    people:
      - wavy-gravy
      - ken-kesey
    organizations:
      - hog-farm
      - merry-pranksters
    places:
      - san-francisco
    events:
      - woodstock-1969
      - veneta-1972
    works: []
    publications: []
    technologies: []
  sourceArtifacts: []
```

Music is a meaningful relationship. It does not need to own the shelf.

## Magazine Time Machine

```yaml
mesh:
  section: culture
  subjects:
    - media-history
    - satire
    - publishing
  series:
    - magazine-time-machine
  entities:
    people:
      - harvey-kurtzman
    organizations: []
    places: []
    events: []
    works: []
    publications:
      - mad
      - trump-1957
    technologies: []
  sourceArtifacts:
    - type: magazine
      publication: mad
      role: origin
```

The magazine source is part of the article engine, not just a citation.

## 3DM movie article

```yaml
mesh:
  section: film-tv
  subjects:
    - cult-film
    - film-production
  series:
    - 3dm
  entities:
    people:
      - dick-miller
    organizations: []
    places: []
    events: []
    works:
      - a-bucket-of-blood
    publications: []
    technologies: []
  sourceArtifacts: []
```

The real Dick Miller connection is required.

## Ordinary movie article

```yaml
mesh:
  section: film-tv
  subjects:
    - film-history
  series: []
```

No Dick Miller, no 3DM.

## Salton Sea stress test

```yaml
mesh:
  section: places-systems
  subjects:
    - regional-history
    - conceptual-engineering
    - infrastructure
    - environmental-systems
    - transportation-history
    - folklore
    - indigenous-history
    - plausible-futures
  series: []
  entities:
    people:
      - frank-sinatra
      - wyatt-earp
    organizations: []
    places:
      - salton-sea
      - bradshaw-trail
    events: []
    works: []
    publications: []
    technologies: []
  sourceArtifacts: []
  storyModes:
    - place-study
    - plausible-future
```

`places-systems` is only a provisional example until the audit defines the real section registry.

The article body must distinguish documented history, legends, open questions, and conceptual engineering.

## Trash Mountain

```yaml
mesh:
  section: places-systems
  subjects:
    - waste-systems
    - landfill
    - settlement-patterns
    - infrastructure
    - public-safety
  series: []
```

Do not add a political or environmental-advocacy classification merely because the observed facts are disturbing.

## Every Sentence Is a Keynote Conclusion

Likely candidates after the section audit:

```yaml
mesh:
  section: technology
  subjects:
    - artificial-intelligence
    - writing-systems
    - synthetic-media
    - model-behavior
    - synthetic-data
    - publishing-workflow
  series: []
  storyModes:
    - systems-investigation
    - process-essay
```

This article is genuinely about AI and writing systems, so AI belongs in the mesh. That is different from using AI quietly as infrastructure while writing an unrelated article.
