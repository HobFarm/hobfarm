# Workshop Process Film production record

Production date: 2026-07-19  
Canonical chain: Zima / PsyGoth Blue  
Manifest: `src/data/workshop-process-film.json`

## Selection record

Zima supplied the only complete, coherent chain from an approved identity portrait to a stable published avatar performance. Her gold eyes, blunt blue fringe, pale skin, compact proportions, black-and-blue wardrobe, and ice-storm world remain legible across every stage.

| Asset | Facts | Decision | Provenance and publication |
| --- | --- | --- | --- |
| `C:\Users\xkxxk\Downloads\heygen_psygoth_blue.png` | Approved Zima portrait; 720 × 1280 | Use as an identity reference. Keep out of the public asset set. | User-supplied working reference. |
| `https://cdn.hob.farm/workshop/images/zima01.WEBP` | Canonical Zima portrait; 1280 × 1920 | Use in Stage 1 and as the face lock. | Existing HobFarm publication asset. |
| `https://cdn.hob.farm/workshop/psygoth/zima-primary.webp` | Zima in the PsyGoth Blue ice-storm frame; 1920 × 1080 | Use for Stage 5 and the avatar poster. | Existing HobFarm publication asset. |
| `https://cdn.hob.farm/workshop/psygoth/zima-primary.mp4` | H.264/AAC; 1920 × 1080; 25 fps; 12.395 seconds; 5,040,221 bytes | Use for Stage 6. Sample ten deterministic frames from the first performance beat for the HyperFrames render. | Existing HobFarm/HeyGen publication asset. |
| `https://cdn.hob.farm/workshop/mannequin-to-avatar/v1/stills/zima-neutral-mannequin-sheet-v1.png` | PNG; 1672 × 941; 1,906,642 bytes | Generated bridge. Use for the neutral base and multi-view identity check. | Generated for this task and published to the versioned R2 prefix. |
| `https://cdn.hob.farm/workshop/mannequin-to-avatar/v1/stills/zima-visual-language-wardrobe-v1.png` | PNG; 1672 × 941; 2,073,383 bytes | Generated bridge. Use for visual-language and wardrobe stages. | Generated for this task and published to the versioned R2 prefix. |
| `em-primary.mp4` | 1920 × 1080; 25 fps; 14.187 seconds; 4,819,611 bytes | Reject for this film. The clip is usable, but Em is a different PsyGoth identity. | Existing HobFarm avatar media. |
| `nina-primary.mp4` | 1920 × 1080; 25 fps; 10.560 seconds; 5,680,235 bytes | Reject for this film. The clip is usable, but Nina is a different PsyGoth identity. | Existing HobFarm avatar media. |
| `heygen_official-2714089330-20260719_112435.mp4` | 720 × 1280; 24 fps; 10.154 seconds; 1,566,608 bytes | Use only as an information-structure reference. Do not copy its branding, palette, or layout. | User-supplied HeyGen reference. Not published. |
| Sophia and Stella assets | Complete shared-mannequin case study | Keep as compact secondary proof. Reject as the Process Film identity because mixing them with Zima would break continuity. | Existing HobFarm assets. |
| `https://cdn.hob.farm/workshop/before-and-after/scene/abandoned-laundry.jpg` and `abandoned-laundry-after.jpg` | Source 1920 × 1440; result 1660 × 1244 | Use for the homepage and Workshop photography modules, not the character film. | Existing HobFarm source photograph and transformed frame. |
| StyleFusion, Cute/Corrupted, and current Workshop Note media | Existing software, comparison, and editorial assets | Use in the broader homepage Workshop overview. | Existing HobFarm publication assets. |

No new HeyGen job was needed. The existing Zima clip has the correct identity, stable face and outfit, useful facial and posture motion, clean presenter framing, and enough duration to close the chain.

## Generated bridge assets

Provider: Codex built-in image generation tool  
Model: not exposed by the tool  
Seed: not exposed by the tool  
Output format: PNG  
Generation date: 2026-07-19

### Neutral mannequin sheet

Output: `zima-neutral-mannequin-sheet-v1.png`, 1672 × 941.

Source assets:

- approved portrait `C:\Users\xkxxk\Downloads\heygen_psygoth_blue.png`
- published Zima poster `public/media/workshop/psygoth/zima-primary.webp`

Prompt:

```text
Use case: identity-preserve character development.

Asset type: HobFarm Workshop process-film bridge plate, landscape character mannequin sheet.

Create a clean 16:9 production sheet for the exact adult woman in the supplied Zima references. Preserve her face, pale skin, gold eyes, blunt electric-blue fringe, long straight blue hair, red lips, short compact proportions, and adult identity. This is the neutral base beneath PsyGoth Blue, not a new character and not a fashion redesign.

Show four inspectable views on one pale gray studio ground: full-body front, full-body three-quarter, full-body back, and a larger face view. Dress her in a plain fitted charcoal-gray unitard with simple dark ankle boots. Use a neutral stance, relaxed hands, flat soft studio light, consistent scale, and the same face and body in every view. Keep the silhouette readable. The sheet should feel like a real character-production plate with generous spacing and no decorative environment.

Do not add text, logos, captions, watermarks, extra people, props, jewelry, corsetry, lace, chains, dramatic makeup, fantasy scenery, camera effects, or alternate hairstyles. Do not make her thin, tall, childlike, generic, or photorealistically unrelated to the reference. No cropped feet or hands.
```

### Visual-language and wardrobe board

Output: `zima-visual-language-wardrobe-v1.png`, 1672 × 941.

Source assets:

- generated neutral mannequin sheet
- approved portrait `C:\Users\xkxxk\Downloads\heygen_psygoth_blue.png`
- published Zima poster `public/media/workshop/psygoth/zima-primary.webp`

Prompt:

```text
Use case: identity-preserve character development.

Asset type: HobFarm Workshop process-film bridge plate, landscape visual-language and wardrobe board.

Create a clean 16:9 production board for the same adult Zima identity shown in the supplied neutral sheet, portrait, and PsyGoth Blue poster. Preserve her exact face, pale skin, gold eyes, blunt electric-blue fringe, long blue hair, red lips, and compact adult proportions.

Arrange one coherent board on a dark blue-black studio ground. Include: a close eye and makeup study; a compact palette and material strip using cold blue, violet, black vinyl, black lace, and silver hardware; one centered full-body dressed character; and an inspectable flat lay of the corset, lace layers, chains, belt or harness hardware, and boots. The dressed figure should read as PsyGoth Blue while remaining visibly the same woman as the neutral mannequin. Use crisp editorial lighting and clear separation between components.

Treat color, line, surface, and material as production rules. Keep the eye study, material samples, character, and garment pieces distinct enough to crop or point to in a process film.

Do not add text, logos, captions, watermarks, unrelated faces, extra characters, new hair shapes, body changes, outfit morphing, a fantasy environment, or decorative UI. Do not make the board soft, pastel, generic, or branded like the HeyGen reference.
```

## HyperFrames production

The two compositions live at:

- `video/workshop-process-film/vertical/`
- `video/workshop-process-film/wide/`

Both are generated from the shared JSON manifest by `scripts/build-workshop-process-film.mjs`. The build also copies the approved Zima source clip locally and extracts a ten-frame avatar performance sequence with FFmpeg. This keeps HyperFrames capture deterministic while preserving real blink, mouth, and posture changes from the approved clip.

| Publication file | Resolution | Duration | Frame rate | Codec | Size |
| --- | ---: | ---: | ---: | --- | ---: |
| `zima-process-film-vertical-v1.mp4` | 1080 × 1920 | 20.400 s | 30 fps | H.264, yuv420p, no audio | 4,515,862 bytes |
| `zima-process-film-wide-v1.mp4` | 1920 × 1080 | 28.200 s | 30 fps | H.264, yuv420p, no audio | 6,138,460 bytes |
| `zima-process-film-vertical-poster-v1.jpg` | 1080 × 1920 | — | — | JPEG | 269,334 bytes |
| `zima-process-film-wide-poster-v1.jpg` | 1920 × 1080 | — | — | JPEG | 253,439 bytes |

The production renders use High quality HyperFrames output, followed by an H.264 CRF 23 slow-preset web encode with `faststart`. Audio is omitted because every stage carries its meaning in visible text and the source performance is used as visual evidence.

## R2 publication

All publication objects use `public, max-age=31536000, immutable`.

```text
workshop/mannequin-to-avatar/v1/stills/zima-neutral-mannequin-sheet-v1.png
workshop/mannequin-to-avatar/v1/stills/zima-visual-language-wardrobe-v1.png
workshop/mannequin-to-avatar/v1/posters/zima-process-film-vertical-poster-v1.jpg
workshop/mannequin-to-avatar/v1/posters/zima-process-film-wide-poster-v1.jpg
workshop/mannequin-to-avatar/v1/renders/zima-process-film-vertical-v1.mp4
workshop/mannequin-to-avatar/v1/renders/zima-process-film-wide-v1.mp4
workshop/mannequin-to-avatar/v1/manifest.json
```

HEAD checks returned HTTP 200 with the expected image, video, and JSON content types for all seven objects.

## PsyGoth lane revision: version 2

On July 19, 2026, the supplied ornate portraits became the stronger visual-language outcomes. The originals were copied without regeneration, resizing, or retouching.

| Character | Supplied source | Public role | SHA-256 |
| --- | --- | --- | --- |
| Zima | `C:\Users\xkxxk\Downloads\ChatGPT Image Jul 19, 2026, 07_31_38 PM.png` | Blue structure lane; Process Film Stages 3 and 4; reference in Stages 5 and 6 | `B9CB5CC70BD342EB8BC157081A683898AA0E8E40F71CEE5D5905C72BDE8C74C4` |
| Nina | `C:\Users\xkxxk\Downloads\ChatGPT Image Jul 19, 2026, 09_03_01 PM.png` | Red pressure lane on the Workshop comparison | `0BEE522AD49FD861257BC8800F19E0E30D8B8983F7A0B00FCFB357A73A6F5535` |
| Em | `C:\Users\xkxxk\Downloads\ChatGPT Image Jul 19, 2026, 09_03_07 PM.png` | Green survival lane on the Workshop comparison | `F5861DE46F6F4AB3A931484A896DCE1F10E01AFCC20A10D3B91662053530A919` |

All three originals are 1024 × 1536 PNG files. Zima stays inside the film’s single-character chain. Nina and Em appear beside her on the Workshop page to demonstrate how the shared portrait structure carries three distinct elemental lanes.

The older Zima mannequin and wardrobe plates remain valid source evidence under `v1`. The revised render and new portraits use `v2`, which avoids replacing files already published with immutable cache headers.

| Version 2 publication file | Resolution | Duration | Frame rate | Codec | Size |
| --- | ---: | ---: | ---: | --- | ---: |
| `zima-process-film-vertical-v2.mp4` | 1080 × 1920 | 20.400 s | 30 fps | H.264, yuv420p, no audio | 5,593,818 bytes |
| `zima-process-film-wide-v2.mp4` | 1920 × 1080 | 28.200 s | 30 fps | H.264, yuv420p, no audio | 6,603,797 bytes |
| `zima-process-film-vertical-poster-v2.jpg` | 1080 × 1920 | — | — | JPEG | 378,221 bytes |
| `zima-process-film-wide-poster-v2.jpg` | 1920 × 1080 | — | — | JPEG | 333,114 bytes |

The version 2 publication contains eight immutable objects:

```text
workshop/mannequin-to-avatar/v2/stills/psygoth-zima-blue-v2.png
workshop/mannequin-to-avatar/v2/stills/psygoth-nina-red-v2.png
workshop/mannequin-to-avatar/v2/stills/psygoth-em-green-v2.png
workshop/mannequin-to-avatar/v2/posters/zima-process-film-vertical-poster-v2.jpg
workshop/mannequin-to-avatar/v2/posters/zima-process-film-wide-poster-v2.jpg
workshop/mannequin-to-avatar/v2/renders/zima-process-film-vertical-v2.mp4
workshop/mannequin-to-avatar/v2/renders/zima-process-film-wide-v2.mp4
workshop/mannequin-to-avatar/v2/manifest.json
```

HEAD checks returned HTTP 200 with the expected content types, byte lengths, and `public, max-age=31536000, immutable` caching for all eight objects.
