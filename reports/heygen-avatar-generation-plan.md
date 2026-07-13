# HeyGen avatar generation plan

Prepared: 2026-07-13.

Status: **proposal only**. None of the calls below has been executed.

## Standard test

Script:

> You’re watching HobFarm. This is where unfinished experiments become characters, stories, posters, videos, and things worth keeping.

Expected spoken length: about 8 to 11 seconds, depending on each default voice.

Shared settings:

- Aspect ratio: 9:16.
- Resolution: 1080p.
- Container: MP4.
- Captions: SRT sidecar only. No burned captions.
- Voice: each group’s current private default voice.
- Motion: restrained presenter motion.
- Expressiveness: medium for every photo avatar.
- Background removal: off.
- Background: simple role-specific solid color.
- Ending: still, centered, and looking into camera.

## Proposed clips

| Clip | Logical ID | Role | Look | HeyGen look ID | Voice ID | Background |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | AV-HIL-001 | Main HobFarm presenter | The Polished Witty Studio Host | `8be3a630487f44c8888c765d7a277752` | `e6ee19a4ad0d4fc0bc2f5611cd2a0085` | Deep studio plum `#17121B` |
| 2 | AV-HIL-001 | Workshop technical editor | The Neon-Lit Goth Editor | `eec3c64d715849a1af8146ebdb8f69f3` | `e6ee19a4ad0d4fc0bc2f5611cd2a0085` | Edit-suite blue `#0B1724` |
| 3 | AV-HIL-001 | HobFarm TV cinema host | The Velvet-Clad Hostess of the Warm-Lit Cinema | `8784e18970494914b74b292ec565dfa8` | `e6ee19a4ad0d4fc0bc2f5611cd2a0085` | Cinema burgundy `#241215` |
| 4 | AV-AMI-001 | Social presenter | Golden Hour Soft Smile | `d4bbf82ffed84720959caa9a7b738fb4` | `8e9397e0a63141d0b49b43249754f6f7` | Warm cream `#E6D6C2` |
| 5 | AV-EM-001 | Coordinated trio, green lane | Em | `1251e171771e4bf3801ebf8387dd642b` | `b120f1ee9b884f4997aba0b2a119f525` | Forest green `#10231B` |
| 6 | AV-NIN-001 | Coordinated trio, red lane | Nina | `d7da33632a8e48d9b7d7b0ba5f67c5c6` | `f70d894a921d49e586ac25378b75d1ac` | Oxblood `#2A1016` |
| 7 | AV-ZIM-001 | Coordinated trio, blue lane | Psygoth Blue | `af81c32a7ab34c65a22735c01ace6c00` | `3563a86a2e5f41d394b1193aa7267e6f` | Ice blue-black `#0B1C2C` |

Estimated generation count: **7 clips** and **7 SRT sidecars**. This estimate excludes retries. A single approved retry for every clip would double the maximum generated-clip count to 14, so retries should be approved individually.

## Exact proposed calls

The connected HeyGen tool accepts these values. `caption.file_format` requests the SRT sidecar. Omitting `caption.style` keeps captions out of the rendered MP4.

```ts
const script =
  "You’re watching HobFarm. This is where unfinished experiments become characters, stories, posters, videos, and things worth keeping.";

const clips = [
  {
    avatarId: "8be3a630487f44c8888c765d7a277752",
    voiceId: "e6ee19a4ad0d4fc0bc2f5611cd2a0085",
    title: "HobFarm host test — Hillary — Main presenter",
    script,
    aspectRatio: "9:16",
    resolution: "1080p",
    outputFormat: "mp4",
    caption: { file_format: "srt" },
    expressiveness: "medium",
    motionPrompt:
      "Restrained presenter motion. Small natural head movement and occasional open-hand emphasis. Maintain a steady medium shot. Finish still, centered, and looking directly into camera.",
    removeBackground: false,
    background: { type: "color", value: "#17121B" },
  },
  {
    avatarId: "eec3c64d715849a1af8146ebdb8f69f3",
    voiceId: "e6ee19a4ad0d4fc0bc2f5611cd2a0085",
    title: "HobFarm host test — Hillary — Workshop editor",
    script,
    aspectRatio: "9:16",
    resolution: "1080p",
    outputFormat: "mp4",
    caption: { file_format: "srt" },
    expressiveness: "medium",
    motionPrompt:
      "Restrained editor delivery. Small natural head movement and one precise hand emphasis. No sweeping gestures. Maintain a steady medium shot. Finish still, centered, and looking directly into camera.",
    removeBackground: false,
    background: { type: "color", value: "#0B1724" },
  },
  {
    avatarId: "8784e18970494914b74b292ec565dfa8",
    voiceId: "e6ee19a4ad0d4fc0bc2f5611cd2a0085",
    title: "HobFarm host test — Hillary — Cinema host",
    script,
    aspectRatio: "9:16",
    resolution: "1080p",
    outputFormat: "mp4",
    caption: { file_format: "srt" },
    expressiveness: "medium",
    motionPrompt:
      "Restrained cinema-host motion. Small natural head movement and one measured hand gesture. Keep the delivery warm and composed. Finish still, centered, and looking directly into camera.",
    removeBackground: false,
    background: { type: "color", value: "#241215" },
  },
  {
    avatarId: "d4bbf82ffed84720959caa9a7b738fb4",
    voiceId: "8e9397e0a63141d0b49b43249754f6f7",
    title: "HobFarm host test — Ami — Social presenter",
    script,
    aspectRatio: "9:16",
    resolution: "1080p",
    outputFormat: "mp4",
    caption: { file_format: "srt" },
    expressiveness: "medium",
    motionPrompt:
      "Restrained social-presenter motion. Small natural head movement, a light smile, and one compact hand emphasis. Maintain a steady medium shot. Finish still, centered, and looking directly into camera.",
    removeBackground: false,
    background: { type: "color", value: "#E6D6C2" },
  },
  {
    avatarId: "1251e171771e4bf3801ebf8387dd642b",
    voiceId: "b120f1ee9b884f4997aba0b2a119f525",
    title: "HobFarm host test — Em — Green trio lane",
    script,
    aspectRatio: "9:16",
    resolution: "1080p",
    outputFormat: "mp4",
    caption: { file_format: "srt" },
    expressiveness: "medium",
    motionPrompt:
      "Restrained presenter motion for a continuity comparison. Small natural head movement and one compact hand emphasis. Maintain a steady medium shot. Finish still, centered, and looking directly into camera.",
    removeBackground: false,
    background: { type: "color", value: "#10231B" },
  },
  {
    avatarId: "d7da33632a8e48d9b7d7b0ba5f67c5c6",
    voiceId: "f70d894a921d49e586ac25378b75d1ac",
    title: "HobFarm host test — Nina — Red trio lane",
    script,
    aspectRatio: "9:16",
    resolution: "1080p",
    outputFormat: "mp4",
    caption: { file_format: "srt" },
    expressiveness: "medium",
    motionPrompt:
      "Restrained presenter motion for a continuity comparison. Small natural head movement and one compact hand emphasis. Maintain a steady medium shot. Finish still, centered, and looking directly into camera.",
    removeBackground: false,
    background: { type: "color", value: "#2A1016" },
  },
  {
    avatarId: "af81c32a7ab34c65a22735c01ace6c00",
    voiceId: "3563a86a2e5f41d394b1193aa7267e6f",
    title: "HobFarm host test — Zima — Blue trio lane",
    script,
    aspectRatio: "9:16",
    resolution: "1080p",
    outputFormat: "mp4",
    caption: { file_format: "srt" },
    expressiveness: "medium",
    motionPrompt:
      "Restrained presenter motion for a continuity comparison. Small natural head movement and one compact hand emphasis. Maintain a steady medium shot. Finish still, centered, and looking directly into camera.",
    removeBackground: false,
    background: { type: "color", value: "#0B1C2C" },
  },
] as const;

// Do not run until the user approves Phase 2 generation.
// for (const clip of clips) {
//   await tools.mcp__codex_apps__heygen_create_video_from_avatar(clip);
// }
```

## Readiness and blockers

Hard generation blockers: **none currently reported**.

- All seven selected looks report `completed` training.
- Every selected look has an image preview.
- Every selected look supports a compatible avatar engine.
- All five default private voice records exist.
- Hillary and Ami support Avatar IV and III. Em, Nina, and Zima also support Avatar V.
- HeyGen reports null consent status for every group, with no consent gate attached.

Production-review blockers:

- The private voice records have no audio preview and report unknown language and gender metadata. The default voices should be listened to in the HeyGen dashboard before the batch is approved.
- The user must approve the seven look selections, the shared script, motion direction, and background colors.
- The user must approve the seven credit-consuming generation calls.
- Any retry requires a separate review because it spends another generation.
- Public use still requires a character-rights check if any avatar is based on a real person, even though HeyGen reports no consent requirement.

## Workshop page plan

Route: `/workshop/character-mannequin/avatar-host-system/`

Title: **From Character Design to On-Screen Host**

Sequence:

1. Character identity.
2. Canonical face and voice.
3. Look families.
4. Editorial role assignment.
5. Expression and motion direction.
6. Standardized host tests.
7. Continuity comparison.
8. Final program destinations.
9. HobFarm TV and Academy usage.

The page follows this production chain:

```text
character identity
→ avatar group
→ role-specific look
→ voice
→ motion direction
→ generated presenter clip
→ recurring program use
```

Hillary carries the primary case across three roles. Ami shows the social and commercial-satire branch. Em, Nina, and Zima form the coordinated secondary case.

## Media-registry additions

The registry contains empty `src` values until approved exports exist.

- `avatar-host.hillary.main.video`
- `avatar-host.hillary.main.captions`
- `avatar-host.hillary.workshop.video`
- `avatar-host.hillary.workshop.captions`
- `avatar-host.hillary.cinema.video`
- `avatar-host.hillary.cinema.captions`
- `avatar-host.ami.social.video`
- `avatar-host.ami.social.captions`
- `avatar-host.em.trio.video`
- `avatar-host.em.trio.captions`
- `avatar-host.nina.trio.video`
- `avatar-host.nina.trio.captions`
- `avatar-host.zima.trio.video`
- `avatar-host.zima.trio.captions`

No R2 object is created by registering these logical destinations.

## Missing local exports

- No generated host MP4 exists for any of the seven proposed clips.
- No generated SRT sidecar exists.
- No HeyGen preview image or video is committed to the repository.
- No local Hobgal presenter source or export was found.
- Hobgal survives as the baseline Style Card concept with CDN-backed registry records.
- The Hillary home hero is also a CDN-backed registry record; no local presenter export was found.

## Approval gate

Generation can begin only after the user explicitly approves:

1. The seven exact look IDs.
2. The use of each current default private voice.
3. The standardized script.
4. The motion and background settings.
5. A seven-clip credit spend.
6. The later R2 destination and public use, handled as a separate phase.

## Phase-one safety record

- HeyGen generation calls executed: **0**.
- HeyGen credits spent by this work: **0**.
- R2 uploads or mutations: **0**.
- Publish or deploy actions: **0**.

