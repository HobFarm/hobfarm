# HobFarm Production Workflows v2

Purpose: route character designs into clear outputs while preserving the active style profile and character canon.

## Mode routing

- Sheet, turnaround, reference, extraction: Sheet
- Single, new character, full body, portrait, baseline: Single
- Hero, dynamic scene, in-world, sales image: Hero
- Poster, cover, promo, collector image: Poster
- Wallpaper, phone display, collector display: Wallpaper
- Thumbnail, preview card, shop grid: Thumbnail
- Video, motion prompt, transition, keyframe: Video
- Packet, listing, storefront, marketplace prep: Product Packet
- Alter Ego, two forms, transformation pair: Alter Ego Set
- Batch, pack, series: Batch

## Universal compiler

Resolve output mode, purpose, active style profile, target model, canon, palette, face, silhouettes, wardrobe, materials, species traits, liquid signature, motif, prop, pose card, lens, environment, depth, continuity, crop, and delivery format.

## Sheet

Purpose: lock construction.

Canvas: 16:9. Left quarter is a forward-facing portrait. Remaining area shows front, back, and true 45-degree three-quarter full-body views on one ground line.

Use white seamless background, flat studio light, complete hands, feet, footwear, props, species traits, garment backs, closures, and attachment points. Present one completed design across every view.

Keep stable body features, clothing, accessories, carried items, markings, and integrated effects. Convert scene lighting into neutral studio light.

## Single

Purpose: create a clean character asset.

Default canvas: 9:16. Character fills the frame. Face and motif remain center-safe. Background stays minimal or lightly contextual. Pose expresses identity and keeps outfit construction readable.

## Hero

Purpose: sell the character in-world.

Use one theatrical pose card, a lens that strengthens the action verb, one foreground device, a complete character read in the midground, one background story environment, one dominant light shape, palette contrast, motif echo, and center-safe face and silhouette.

## Poster

Purpose: create collector and promotional value.

Default canvas: 9:16. Use one dominant character silhouette, one emotional hook, one simple background story, one foreground device, one dramatic light shape, title-safe space when useful, and social crop safety. Match the active style profile.

## Wallpaper

Purpose: create a repeat-view display asset.

Default canvas: 9:16. Keep face and silhouette center-safe. Use a strong color block, shape, or atmosphere. Background supports the character and leaves breathing room.

## Thumbnail

Purpose: read quickly in grids and shops.

Use square or 4:3 framing, a large face or upper-body crop, clear motif, strong value contrast, simple background, and thumbnail-readable identity.

## Video

Purpose: animate established canon.

Compile duration, source keyframe, camera motion, character motion, environmental motion, lighting motion, transition target, final hold, and crop safety.

Six-second structure:

1. Establish face and motif.
2. Reveal pose, outfit, or environment.
3. Settle into a clean final hold.

Use one primary camera motion, one character motion, and one environmental motion. Hair, fabric, chains, liquids, smoke, signs, and light provide secondary motion.

## Product Packet

```yaml
product:
  title:
  id:
  lane:
  price_test:
  public_preview:
  buyer_files:
  short_description:
  design_note:
  usage_terms:
  tags:
  social_angle:
  next_asset:
```

Baseline files: full-resolution Sheet, portrait crop, full-body crop, palette image, design note, and license or readme.

Premium additions: Hero, Poster or Wallpaper, Video prompt or clip, extra crops, and listing copy.

## Alter Ego Set

Compile shared identity, Form A DNA, Form B DNA, shared canon locks, divergent palette, wardrobe, silhouette, liquid, environment, pose language, and emotional temperature. Create separate Sheet requirements, a Hero for each form, a pair Poster, and a transition concept.

## Batch

```yaml
batch:
  shared_style_profile:
  shared_output_mode:
  shared_product_lane:
  fixed_variables:
  variation_axes:
  item_ids:
  per_item_hook:
  continuity_checks:
  delivery_files:
```

Vary a controlled set of features. Keep each item identifiable at thumbnail size.

## Production replacement rules

- Generic scene becomes a motif-linked environment.
- Generic pose becomes a theatrical pose card.
- Generic wardrobe becomes exact garment construction.
- Generic face becomes a face key.
- Busy composition becomes a three-plane depth plan.
- Poster overload becomes one figure, one hook, one story, and one light shape.
- Uncontrolled motion becomes one camera action, one character action, one environment action, and a final hold.
