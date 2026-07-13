# Workshop media destination map

This audit records where the existing R2 media belongs. The implementation reads the current URLs through `src/data/media-registry.ts`; no object has been moved, copied, renamed, deleted, or uploaded.

## Workshop and site destinations

| Media group | Current R2 prefix | Destination | Public role |
| --- | --- | --- | --- |
| StyleFusion banner | `pages/projects/images/` | `/workshop/stylefusion/`, `/projects/stylefusion/` | Application hero and poster |
| Cathedral Cat | `pages/process/book/` | `/workshop/stylefusion/` | SF-001 generated evidence, then cover, hero, and motion |
| Hellcat of the Iron Wastes | `pages/process/motion/` | `/workshop/stylefusion/` | SF-002 variants and downstream production |
| Fashion character study | `pages/process/fashion/` | `/workshop/character-mannequin/` | Variants, sheet, hero, poster, and motion |
| Generic Female #37 | `pages/home/concept/` | `/workshop/character-mannequin/` | Character decision sequence, not a StyleFusion case |
| Four style-card records | `pages/home/style-card/` | `/workshop/workshop-notes/` | Informal style-translation notes |
| Academy courses banner | `pages/projects/images/` | `/academy/`, Workshop bridge, Courses project data | Workshop-to-Academy module |
| Magazine Time Machine banner | `pages/projects/images/` | Magazine Time Machine detail and Presents indexes | Series hero and motion banner |
| About videos | `pages/about/` | `/about/` | Existing supporting motion and one hero candidate |

The StyleFusion studies keep references, export documents, generated results, and downstream assets visibly separate. The private reference images are not rendered. Their role labels and approved textual descriptions provide the input record; the public stills begin at generated results.

## Home archive classification

### Currently used

- `comp-lighting-1.png`, `comp-lighting-2.jpg`, `comp-lighting-2.mp4`, and `comp-lighting-3.png`: homepage visual showcase.
- `hob-mascot.jpg`: homepage, About, and philosophy surfaces.
- `homepage-hero-poster.png` and `homepage-hero.mp4`: article media for “Color Becomes a Cast.”
- `overview-z-ai-developer-document-logo.svg`: homepage provider strip.
- `style-range-1.png` through `style-range-5.jpeg`: homepage visual showcase.
- `technique-flat.webp`, `technique-lineart.png`, `technique-painterly.jpg`, and `technique-photo.png`: homepage visual showcase.

### Reused for Workshop in this pass

- All eight `pages/home/concept/stylefusion-*` objects: the Generic Female #37 character-decision study on Character / Mannequin.
- All sixteen `pages/home/style-card/` objects: four text, still, and motion records on Workshop Notes.

### Reusable elsewhere

- `grimoire.jpg` and `grimoire.mp4`: strong candidates for a future Grimoire overview or ingest-note explainer.
- `hobfarm-web-banner.png`: reusable site or project overview banner.
- `stylefusion.jpg` and `stylefusion.mp4`: early style-translation material. The filenames are misleading, so any reuse should be filed under Workshop Notes and described as an early experiment.

### Unknown destination

- `drifter.jpg` and `drifter.mp4`: paired media with no current content reference. Review the subject before assigning a project or gallery destination.
- `hillary-hobfarm-hero.png`: named hero with no current route or content reference.
- `hobbot.jpg` and `hobbot.mp4`: paired media with no current route reference. They may support a future Grimoire or tool note, but the archive alone does not establish that use.

### Duplicate candidates

- `og-image.jpg`: no current source reference. Compare its pixels and intended metadata role with the current site-level social image before any cleanup.

### Safe to archive later

- The zero-byte `pages/home/` directory marker is the only object that can be treated as a cleanup candidate from this audit alone. Media objects need a checksum, route, and metadata review before archival. Nothing was deleted in this pass.

## About recommendations

- About hero: `about-hero-vid.mp4` is the clearest candidate, but it should remain unused until a real poster, mobile crop, and reduced-motion fallback are selected. The About hero was not redesigned in this pass.
- Supporting section: keep `Fractal Octopus.mp4` behind the philosophy section and `about-glow-vid.mp4` beside the authorship and production explanation. Both are currently used.
- Homepage or other destination: do not reuse the About videos on the homepage yet. Their meaning is already specific to About, and the homepage has active visual media.
- Unused or redundant media: `about-hero-vid.mp4` is unused. The audit did not find enough evidence to call any of the three videos redundant.

## Missing and unresolved assets

All named Workshop, project-banner, About, concept, and style-card URLs returned successful responses during the July 13, 2026 audit. No required asset is missing.

The unresolved items are editorial, not technical: the Drifter, Hillary HobFarm, and Hobbot sets need a destination decision; `og-image.jpg` needs a duplicate check; and the About hero candidate needs a poster and crop review.

## Future canonical keys

The registry includes `futureCanonicalKey` values where the current R2 location and the public destination disagree. These keys are labels for a possible reviewed migration. They do not change URLs or R2 objects.
