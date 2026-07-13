# HF-DL-026 wardrobe and SKU test

Status: working case study  
Canon status: generic mannequin identity anchor; fashion variants are experimental  
Public asset status: local only

## Source files

- Base mannequin: `F:/Web-Stuff/HobFarm-web Project Files/Characters/ChatGPT Image Jul 7, 2026, 10_57_17 PM.png`
- Wardrobe reference: `C:/Users/xkxxk/Downloads/J10.webp`
- Aesthetic reference: [Dark and Sweet Girly Kei (2019-present)](https://aesthetics.fandom.com/wiki/Jirai_Kei#Dark_and_Sweet_Girly_Kei_(2019-present))
- Coordinated wardrobe sheet A: `C:/Users/xkxxk/Downloads/ChatGPT Image Jul 12, 2026, 04_49_04 PM.png`
- Coordinated wardrobe sheet B: `C:/Users/xkxxk/Downloads/ChatGPT Image Jul 12, 2026, 05_09_05 PM.png`
- Describe-image prompt and structured extraction: Codex attachment `ad8578d0-a32c-40bb-877a-0d89abae0be5/pasted-text.txt`

These files remain outside the repository and R2. `J10.webp` is a private working reference, not an approved public asset. The source page may be linked for context, but its images must not be copied into the site without a separate rights check.

## Source roles

| Source | Role | What it controls |
| --- | --- | --- |
| Base mannequin | Identity anchor | Face, body proportions, black high ponytail, teal bow, neon tear signature |
| `J10.webp` | Wardrobe observation | Four coordinated blouse, suspender, waist, skirt, hosiery, and platform-shoe combinations |
| Dark and Sweet Girly Kei reference | Aesthetic direction | Ultra-feminine trim, mini silhouette, restrained black/blush/ivory palette, sad or eerie makeup, and edgier detail |
| Sheet A | Direct application result | The aesthetic and observed wardrobe applied to the mannequin as a modular four-look collection |
| Sheet B | Controlled darker variant | A denser, more gothic extension of the same fashion system rather than a separate character identity |

The comparison method keeps the mannequin fixed, changes the aesthetic and wardrobe system, then compares the resulting character variants. Later studies can repeat the process with another aesthetic or combine two clearly named source systems.

## Evidence layers

### Observed

- `J10.webp` shows four short black skirt looks built from ivory or blush blouses, dark suspenders or waist pieces, lace or opaque hosiery, and black platform footwear.
- The aesthetic reference identifies intricate trims, mini skirts, sad or eerie makeup, and details borrowed from edgier subcultures.
- The mannequin source establishes the teal bow, black ponytail, neon tears, face, and body proportions.

### Inferred

- Some generated construction details, materials, hardware, and accessory separations are plausible interpretations rather than facts visible in the small wardrobe reference.
- Sheet B intensifies lace, corsetry, chains, crosses, and asymmetric hosiery as a darker extension.

### Directed

- Preserve mannequin identity while changing wardrobe and styling.
- Resolve each look into reusable garment modules.
- Show complete looks, isolated garments, close-ups, hardware, motifs, and recipe identifiers in one production sheet.
- Keep the exercise focused on fashion translation and style fusion; do not import or romanticize sensitive subculture stereotypes.

## What the test proves

The sheet can carry five related jobs in one frame:

1. Lock identity and design DNA.
2. Present four complete outfit recipes.
3. Separate reusable garment modules.
4. Show construction, material, hardware, and motif details.
5. Prepare a character or wardrobe packet for continuity and later packaging.

The teal bow and neon tear signature keep the wardrobe attached to the mannequin identity. Black, blush, ivory, lace, patent leather, and metal hold the four looks inside one collection.

## Proposed inventory grammar

`HF-DL-026` is the design/artwork ID. It is not the catalog SKU. The workbook leaves the catalog SKU open until the serial registry is checked.

```text
HF-DL-026
HF-DL-026-TOP-01 + HF-DL-026-HRN-01 + HF-DL-026-WST-01
HF-DL-026-SKT-01 + HF-DL-026-SOC-01 + HF-DL-026-SHO-01
```

Each outfit should list a recipe. Reusable garments keep their identifier across sheets.

Suggested module families:

| Prefix | Module |
| --- | --- |
| `TOP` | Blouse or top |
| `HRN` | Harness, suspender, or strap set |
| `WST` | Waist piece or corset |
| `SKT` | Skirt or set-up bottom |
| `SOC` | Socks or hosiery |
| `SHO` | Footwear |
| `BOW` | Bow module |
| `JWL` | Jewelry |
| `HDW` | Hardware set |
| `MTF` | Symbol or motif |

## Next-pass corrections

- Remove the unused stiletto heels or label them as alternate footwear.
- Separate blouse, harness, waistband, corset, and skirt when they can be worn independently.
- Hold face, leg length, waist, and ground line to a stricter mannequin anchor.
- Replace one repeated facial close-up with a garment back view or fastening detail.
- Give waist pieces and other reusable modules small identifiers.
- Record front, back, closure, attachment, and material information for each garment.

## Relationship use

This draft supports the new optional relationships:

```yaml
relatedCharacters:
  - hf-dl-026
relatedVisualSystems:
  - hf-doll
```

Those values are examples for schema and visual-lab work. They do not publish a catalog item or lock an experimental fashion variant as site canon.

## Visual-lab use

The sheet hierarchy informs `ProductAssetStack`, `AssetManifest`, and `VisualSystemMap`:

- The four outfit columns become coordinated asset planes.
- Garment rows become manifest groups.
- Module identifiers become compact inventory labels.
- Material and motif panels become style-source roles.
- The complete mannequin sheet remains the identity anchor.

The first noindex vertical slice remains Sophia/Stella and uses existing repository and R2 data. The HF-DL-026 study can inform its information architecture without exposing private local references.
