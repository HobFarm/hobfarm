window.WORKSHOP_PROCESS_FILM = Object.freeze({
  "id": "zima-mannequin-to-avatar-v2",
  "version": 2,
  "title": "From mannequin to moving character",
  "summary": "One Zima identity moves from a written brief through a neutral mannequin, visual-language rules, wardrobe, scene direction, and an existing avatar performance.",
  "endMessage": "One stable character. Sheets, outfits, scenes, avatars, stories, and products.",
  "variants": {
    "vertical": {
      "width": 1080,
      "height": 1920,
      "duration": 20.4,
      "videoSrc": "https://cdn.hob.farm/workshop/mannequin-to-avatar/v2/renders/zima-process-film-vertical-v2.mp4",
      "posterSrc": "https://cdn.hob.farm/workshop/mannequin-to-avatar/v2/posters/zima-process-film-vertical-poster-v2.jpg",
      "label": "Homepage process film"
    },
    "wide": {
      "width": 1920,
      "height": 1080,
      "duration": 28.2,
      "videoSrc": "https://cdn.hob.farm/workshop/mannequin-to-avatar/v2/renders/zima-process-film-wide-v2.mp4",
      "posterSrc": "https://cdn.hob.farm/workshop/mannequin-to-avatar/v2/posters/zima-process-film-wide-poster-v2.jpg",
      "label": "Full Workshop process film"
    }
  },
  "stages": [
    {
      "id": "write-the-brief",
      "order": 1,
      "timing": {
        "vertical": {
          "start": 0,
          "duration": 3.2
        },
        "wide": {
          "start": 0,
          "duration": 4.2
        }
      },
      "label": "Write the brief",
      "headline": "Lock the identity before the styling.",
      "explanation": "Zima keeps pale skin, gold eyes, blunt electric-blue hair, red lips, and a compact silhouette.",
      "shotDirection": "Start from a close portrait. Name the traits every later frame must preserve.",
      "media": [
        {
          "role": "reference",
          "src": "https://cdn.hob.farm/workshop/images/zima01.WEBP",
          "alt": "Canonical close portrait of Zima with electric-blue hair, gold eyes, and red lips",
          "crop": "portrait"
        },
        {
          "role": "main",
          "src": "https://cdn.hob.farm/workshop/mannequin-to-avatar/v1/stills/zima-neutral-mannequin-sheet-v1.png",
          "alt": "Neutral Zima mannequin sheet with front, three-quarter, back, and face views",
          "crop": "contain"
        }
      ],
      "locked": [
        "face",
        "gold eyes",
        "blue blunt fringe",
        "pale skin",
        "compact proportions"
      ],
      "variable": [
        "wardrobe",
        "materials",
        "makeup intensity",
        "environment",
        "camera"
      ]
    },
    {
      "id": "build-the-mannequin",
      "order": 2,
      "timing": {
        "vertical": {
          "start": 3.2,
          "duration": 3.3
        },
        "wide": {
          "start": 4.2,
          "duration": 4.5
        }
      },
      "label": "Build the mannequin",
      "headline": "Resolve the base from every useful angle.",
      "explanation": "Front, three-quarter, back, and face views make proportion and continuity errors visible before a costume can hide them.",
      "shotDirection": "Keep the studio flat. Compare the same face, hair, silhouette, hands, and stance across views.",
      "media": [
        {
          "role": "main",
          "src": "https://cdn.hob.farm/workshop/mannequin-to-avatar/v1/stills/zima-neutral-mannequin-sheet-v1.png",
          "alt": "Neutral Zima mannequin sheet with consistent identity across four views",
          "crop": "contain"
        },
        {
          "role": "reference",
          "src": "https://cdn.hob.farm/workshop/images/zima01.WEBP",
          "alt": "Zima identity reference portrait",
          "crop": "face"
        }
      ],
      "locked": [
        "face",
        "hair length",
        "fringe",
        "body proportions",
        "neutral stance"
      ],
      "variable": [
        "costume",
        "pose",
        "lighting",
        "world"
      ]
    },
    {
      "id": "define-the-visual-language",
      "order": 3,
      "timing": {
        "vertical": {
          "start": 6.5,
          "duration": 3.3
        },
        "wide": {
          "start": 8.7,
          "duration": 4.5
        }
      },
      "label": "Define the visual language",
      "headline": "Assign a job to every symbol and surface.",
      "explanation": "Cold blue controls structure and distance. The star field, geometric diagrams, black lace, polished vinyl, and silver ornament make the PsyGoth lane specific enough to repeat.",
      "shotDirection": "Compare the finished portrait with the neutral identity. Read the border, symbols, materials, and atmosphere as a system rather than decoration.",
      "media": [
        {
          "role": "main",
          "src": "https://cdn.hob.farm/workshop/mannequin-to-avatar/v2/stills/psygoth-zima-blue-v2.png",
          "alt": "Zima in an ornate blue PsyGoth portrait with astral diagrams, ice crystals, smoke, lace, and polished vinyl",
          "crop": "portrait"
        },
        {
          "role": "reference",
          "src": "https://cdn.hob.farm/workshop/mannequin-to-avatar/v1/stills/zima-neutral-mannequin-sheet-v1.png",
          "alt": "Neutral Zima mannequin used as the identity baseline",
          "crop": "face"
        }
      ],
      "locked": [
        "identity",
        "gold eyes",
        "blue hair",
        "black gothic wardrobe"
      ],
      "variable": [
        "symbol field",
        "ornament density",
        "crystal placement",
        "smoke",
        "astral depth"
      ]
    },
    {
      "id": "dress-the-character",
      "order": 4,
      "timing": {
        "vertical": {
          "start": 9.8,
          "duration": 3.3
        },
        "wide": {
          "start": 13.2,
          "duration": 4.5
        }
      },
      "label": "Dress the character",
      "headline": "Build the costume into the world.",
      "explanation": "Black lace, a blue vinyl corset, silver chains, and a jeweled choker carry the same cold structure as the symbols and ice around Zima.",
      "shotDirection": "Check the face and hair first, then follow each wardrobe material into a matching element in the frame.",
      "media": [
        {
          "role": "main",
          "src": "https://cdn.hob.farm/workshop/mannequin-to-avatar/v2/stills/psygoth-zima-blue-v2.png",
          "alt": "Finished Zima PsyGoth Blue portrait with coordinated lace, vinyl, silver jewelry, crystal, smoke, and astral ornament",
          "crop": "portrait"
        },
        {
          "role": "reference",
          "src": "https://cdn.hob.farm/workshop/mannequin-to-avatar/v1/stills/zima-visual-language-wardrobe-v1.png",
          "alt": "Earlier Zima wardrobe board used to inspect the separate design decisions",
          "crop": "character"
        }
      ],
      "locked": [
        "face",
        "hair",
        "gold eyes",
        "adult identity",
        "blue lane"
      ],
      "variable": [
        "corset finish",
        "lace pattern",
        "hardware",
        "jewelry",
        "ornament density"
      ]
    },
    {
      "id": "direct-the-frame",
      "order": 5,
      "timing": {
        "vertical": {
          "start": 13.1,
          "duration": 2.9
        },
        "wide": {
          "start": 17.7,
          "duration": 4.4
        }
      },
      "label": "Direct the frame",
      "headline": "Give the stable design a camera and a world.",
      "explanation": "A centered presenter frame, cold depth, aurora light, and one storm figure turn the character sheet into a scene built for motion.",
      "shotDirection": "Hold the identity at center. Use the background to add distance and pressure without competing with the face.",
      "media": [
        {
          "role": "main",
          "src": "https://cdn.hob.farm/workshop/psygoth/zima-primary.webp",
          "alt": "Zima directed as a PsyGoth Blue presenter in an ice-storm world",
          "crop": "cover"
        },
        {
          "role": "reference",
          "src": "https://cdn.hob.farm/workshop/mannequin-to-avatar/v2/stills/psygoth-zima-blue-v2.png",
          "alt": "Ornate Zima PsyGoth Blue portrait used as the stronger visual-language reference",
          "crop": "face"
        }
      ],
      "locked": [
        "character",
        "wardrobe",
        "face light",
        "centered read"
      ],
      "variable": [
        "lens",
        "depth",
        "aurora",
        "storm figure",
        "negative space"
      ]
    },
    {
      "id": "turn-into-an-avatar",
      "order": 6,
      "timing": {
        "vertical": {
          "start": 16,
          "duration": 4.4
        },
        "wide": {
          "start": 22.1,
          "duration": 6.1
        }
      },
      "label": "Turn the character into an avatar",
      "headline": "The same character can now perform.",
      "explanation": "The published HeyGen clip keeps Zima's face, outfit, and ice-world framing stable while adding speech, blinking, posture shifts, and a small hand gesture.",
      "shotDirection": "Use one readable action. Let captions and stage text carry the meaning when the film is muted.",
      "media": [
        {
          "role": "video",
          "src": "https://cdn.hob.farm/workshop/psygoth/zima-primary.mp4",
          "alt": "Zima speaking and gesturing in the PsyGoth Blue ice-world avatar clip",
          "crop": "cover"
        },
        {
          "role": "reference",
          "src": "https://cdn.hob.farm/workshop/mannequin-to-avatar/v2/stills/psygoth-zima-blue-v2.png",
          "alt": "Ornate Zima PsyGoth Blue design compared with the published avatar performance",
          "crop": "face"
        }
      ],
      "locked": [
        "face",
        "hair",
        "outfit",
        "world",
        "presenter framing"
      ],
      "variable": [
        "speech",
        "blink",
        "head turn",
        "hand gesture",
        "caption timing"
      ]
    }
  ]
});
