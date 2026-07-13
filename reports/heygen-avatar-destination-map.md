# HeyGen avatar destination map

Snapshot: 2026-07-13.

This map turns the existing private groups into one host-production system. It proposes destinations only. It does not rename, update, archive, or delete anything in HeyGen.

## Canonical host roster

| Logical ID | Character | Lane or role | Canonical look | HeyGen look ID | Default voice ID | Primary destination |
| --- | --- | --- | --- | --- | --- | --- |
| AV-HIL-001 | Hillary | Main HobFarm presenter | The Polished Witty Studio Host | `8be3a630487f44c8888c765d7a277752` | `e6ee19a4ad0d4fc0bc2f5611cd2a0085` | Homepage fragments, announcements, and general HobFarm intros |
| AV-HIL-001 | Hillary | Workshop / technical editor | The Neon-Lit Goth Editor | `eec3c64d715849a1af8146ebdb8f69f3` | `e6ee19a4ad0d4fc0bc2f5611cd2a0085` | Workshop notes, process explainers, and production updates |
| AV-HIL-001 | Hillary | HobFarm TV cinema host | The Velvet-Clad Hostess of the Warm-Lit Cinema | `8784e18970494914b74b292ec565dfa8` | `e6ee19a4ad0d4fc0bc2f5611cd2a0085` | HobFarm TV intros, film essays, and archive programs |
| AV-AMI-001 | Ami | Social presenter | Golden Hour Soft Smile | `d4bbf82ffed84720959caa9a7b738fb4` | `8e9397e0a63141d0b49b43249754f6f7` | Reels, Shorts, announcements, and lighter social fragments |
| AV-EM-001 | Em | Coordinated trio, green lane | Em | `1251e171771e4bf3801ebf8387dd642b` | `b120f1ee9b884f4997aba0b2a119f525` | Trio explainers, green-lane segments, and Academy examples |
| AV-NIN-001 | Nina | Coordinated trio, red lane | Nina | `d7da33632a8e48d9b7d7b0ba5f67c5c6` | `f70d894a921d49e586ac25378b75d1ac` | Trio explainers, red-lane segments, and Academy examples |
| AV-ZIM-001 | Zima | Coordinated trio, blue lane | Psygoth Blue | `af81c32a7ab34c65a22735c01ace6c00` | `3563a86a2e5f41d394b1193aa7267e6f` | Trio explainers, blue-lane segments, and Academy examples |

The current groups establish Em as green, Nina as red, and Zima as blue. Their three canonical looks use portrait head-and-shoulders framing close enough for a continuity test. The backgrounds differ, so the standardized clips use controlled solid-color backgrounds and matching motion direction.

## Hillary role classification

All Hillary looks remain inside one group and use the same private default voice.

| Look | HeyGen look ID | Dimensions | Classification |
| --- | --- | --- | --- |
| The Neon-Lit Goth Editor | `eec3c64d715849a1af8146ebdb8f69f3` | 1536 × 2752 | Workshop / technical editor — canonical |
| The Neon-Lit Goth Editor | `3985124601414205bef5f1b904312595` | 768 × 1376 | Alternate |
| The Neon-Lit Goth Editor | `145092a881ec410e932532bff8a4d7cf` | 1536 × 2752 | Alternate |
| The Polished Witty Studio Host | `7055855379374bbc924a7565fa00b96f` | 1536 × 2752 | Alternate |
| The Polished Witty Studio Host | `8be3a630487f44c8888c765d7a277752` | 1536 × 2752 | Main HobFarm presenter — canonical |
| The Polished Witty Studio Host | `63ae57264b3f42338e6c9c23ab723711` | 768 × 1376 | Alternate |
| The Velvet-Clad Hostess of the Warm-Lit Cinema | `8784e18970494914b74b292ec565dfa8` | 1536 × 2752 | HobFarm TV cinema host — canonical |
| The Velvet-Clad Hostess of the Warm-Lit Cinema | `65c50598cf4f4626b73d4248548e1a98` | 768 × 1376 | Alternate |
| The Velvet-Clad Hostess of the Warm-Lit Cinema | `26a82c5733b441438c7c34fc0cf0c047` | 1536 × 2752 | Alternate |
| Hillary | `41cef46e21054db1af5bb9af5ae170e0` | 1792 × 2368 | Retire from active host roster; keep as identity reference |

The active trio is intentionally direct: polished studio for the main presenter, neon edit suite for Workshop, and warm cinema for HobFarm TV. The other generated frames remain alternates until the three canonical clips can be compared in motion. The base Hillary portrait should leave the active roster but remain in HeyGen as the identity reference.

## Ami recommendation

- Canonical social presenter: **Golden Hour Soft Smile**, look `d4bbf82ffed84720959caa9a7b738fb4`. It has direct eye contact, a clean portrait crop, and the easiest fit for short social delivery.
- Fake-commercial alternate: **Oatmeal Knit Coffee Holder**, look `7dc47570639343728188ec7984c69256`. The centered cup and lifestyle framing support deadpan ads and sponsor-parody segments.
- Secondary social backups: the remaining Golden Hour, Warm Bokeh, casual hoodie, and location looks.
- Review for the active host roster: side-looking street frames, visible-phone selfies, and full-body fashion frames. They still have value as static social or scene references.

## Em, Nina, and Zima alternates

| Logical ID | Character | Alternate look | HeyGen look ID | Use |
| --- | --- | --- | --- | --- |
| AV-EM-001 | Em | The Green-Streaked Jade Psygoth | `ff2139ce68b44a4fa8dadbd7f0527c80` | Green-lane close presenter with stronger costume detail |
| AV-NIN-001 | Nina | Golden-Adorned Psygoth Host | `a6cb3ae0a2124cb0b72ce0c0a6b2376e` | Red-lane close presenter with a clear host composition |
| AV-ZIM-001 | Zima | Iridescent Noir Narrator | `8578aa79b13749b3830da87c841faf39` | Blue-lane close presenter for darker program segments |

The trio canonicals should be tested first. The alternates are the next coordinated set because all three are portrait photo avatars at 1536 × 2752 and read as close presenter frames.

## Hobgal

No HeyGen group matches Hobgal. `AV-HOB-001` should stay classified as a local concept that never entered the HeyGen system.

Repository evidence:

- `src/data/style-cards.js` names HobGal as the baseline Style Card.
- `src/data/media-registry.ts` registers `workshop.style-card.baseline.record`, `.one`, `.two`, and `.video`.
- Those records point to existing CDN objects. No local Hobgal presenter export or HeyGen-ready source image is present.

Promoting Hobgal would require a separate approval because it would create a new avatar identity, which is outside this phase.

## Program destinations

| Host | Recurring use | First destination |
| --- | --- | --- |
| Hillary / main | HobFarm intros, editorial announcements, cross-site promos | Homepage fragments and social return paths |
| Hillary / Workshop | Process notes, tool explanations, build records | `/workshop/` and `/workshop/character-mannequin/avatar-host-system/` |
| Hillary / cinema | Film introductions, archive essays, channel continuity | `/projects/hobfarm-tv/` |
| Ami | Social hooks, lighter announcements, fake commercials | Social platforms with links back to Articles, Gallery, or Projects |
| Em, Nina, Zima | Coordinated explainers, character continuity, host comparisons | Workshop study, then `/academy/avatar-content-system/` |
| Hobgal | Baseline visual concept only | Remain in Style Card and Workshop archive material |

