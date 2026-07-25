# Hero Generation Notes

## Output

- Original base: `hero-generated-base.png`
- Corrected base: `hero-generated-base-v2.png`
- Final: `../hero-brought-to-you-by-they-inc-v2.png`
- Mode: built-in image generation, stylized concept
- Local finishing: resized to 1600 × 900, title and company seal added with deterministic SVG typography in `scripts/build-they-inc-assets.mjs`

## Final prompt

> Use case: stylized-concept
>
> Asset type: wide landscape editorial hero illustration for a long-form independent magazine article
>
> Primary request: A polished mid-century television sponsor-card illustration crossed with a grotesque corporate information factory. In the foreground, a cheerful 1950s-style corporate presenter displays a circular blank company seal beside a conveyor tray carrying small national flags, newspaper sheets, speech bubbles, smartphones, a head of iceberg lettuce, and neatly wrapped boxes representing public certainty. In the background, reporters, cable pundits, social accounts, office coworkers, and shadowy faceless crowds are connected by pipes, rollers, arrows, loudspeakers, and television screens. Far beyond the factory perimeter, include a tiny calm beach with a coconut palm and clear sky as an escape route.
>
> Style/medium: sophisticated hand-painted editorial illustration, mid-century commercial art and magazine cover design, subtle screen-print texture, dry ink, halftone shadows, crisp shapes, dark satire without horror gore
>
> Composition/framing: cinematic 16:9 landscape; energetic factory fills the right two-thirds and lower area; preserve a broad uncluttered dark-cream-to-smoky-teal header area across the upper left for later title typography; clear visual hierarchy; readable at website hero size
>
> Lighting/mood: brightly advertised cheerfulness on the presenter, ominous industrial depth behind, tiny distant beach warm and sincere
>
> Color palette: aged cream, institutional teal, nicotine yellow, faded vermilion, dark charcoal, small electric cyan accents; avoid direct red-versus-blue party symbolism
>
> Materials/textures: painted paper, newsprint, brushed steel, cardboard packages, glowing CRT glass
>
> Constraints: no text, no lettering, no logos, no watermarks; leave circular company seal blank; no recognizable politicians, celebrities, real news brands; lettuce, phone, flags, headlines, pipes, beach identifiable; polished magazine-cover; no meme collage; no photorealism

## Selection note

The first output supplied the needed hierarchy, sponsor-card presenter, information factory, lettuce, portable media, and distant beach, but the presenter had a third arm. It was retained as an audit source and removed from publication use.

The second pass edited only the presenter anatomy. It removed the central pointing arm, preserved the left palm-up presenting arm, and preserved the right arm holding the placard. The corrected figure has exactly two arms and two hands. Generated lettering remained prohibited; all publication text was added locally for accuracy.

## Correction prompt

> Use case: precise-object-edit
>
> Asset type: corrected source illustration for a wide editorial website hero
>
> Input image: edit target — preserve the entire supplied illustration, composition, crop, palette, texture, lighting, factory, beach, conveyor, flags, newspapers, speech bubbles, phones, lettuce, packages, screens, pipes, round blank placard, and every background figure.
>
> Primary request: Correct only the foreground male presenter’s anatomy. He must have exactly two arms total and exactly two hands total. Remove the extra central pointing arm and hand completely, reconstructing the jacket and torso naturally where it was. Keep his left arm as the single palm-up presenting gesture on the left. Keep his right arm as the single arm holding the right edge/lower-right edge of the blank circular placard. Both arms must connect naturally to the correct shoulders with plausible elbows, wrists, hands, and finger counts. The circular placard remains blank and fully intact.
>
> Style/medium: preserve the existing sophisticated mid-century hand-painted editorial illustration, screen-print texture, dry ink, halftone shadows, and aged commercial-art finish.
>
> Composition/framing: preserve the exact wide composition and negative space in the upper left.
>
> Constraints: anatomy must be unmistakably correct at full resolution; exactly two arms, exactly two hands, five fingers per hand where visible; no extra limbs, no fused hands, no floating fingers. Change only the presenter anatomy and the minimal adjacent jacket/placard edge needed for the correction. Preserve his face, expression, hair, suit, tie, pose, scale, and identity. Preserve every other object and person. No text, letters, logos, or watermark anywhere; keep the placard blank.
