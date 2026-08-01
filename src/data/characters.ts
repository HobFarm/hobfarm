// The HobFarm cast. HobFarm has no character content collection (yet), so the
// recurring cast is curated here as plain data.
//
// There is no /characters/ route. A character renders on the page for the world
// it belongs to: comic characters on their series page under
// /presents/funnies/, Other Alice residents on the Other Alice cast page.
// `relatedSeries` decides which, and `characterPath()` resolves the anchor.
//
// Avatars are not here. They are presenters and live in src/data/avatars.ts.

import {
  getOtherAliceResident,
  getOtherAliceAsset,
  otherAliceCanon,
  otherAliceChronology,
  otherAlicePublicCanon,
} from "@/data/other-alice-world-guide";

export type CharacterMediaAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  fit?: "cover" | "contain";
};

export type CharacterMotionAsset = {
  title: string;
  label: string;
  src: string;
  poster: CharacterMediaAsset;
  alt: string;
  width: number;
  height: number;
  caption: string;
  companionStill?: CharacterMediaAsset;
};

export type CharacterTraitPlate = CharacterMediaAsset & {
  label: string;
  note: string;
};

export type CharacterVisualDevelopment = {
  label: string;
  title: string;
  paragraphs: string[];
  note: string;
  plates: CharacterTraitPlate[];
};

export type CharacterEntry = {
  slug: string;
  name: string;
  displayName?: string;
  seoTitle?: string;
  metaDescription?: string;
  role: string;
  /** One-line index blurb. */
  blurb: string;
  /** Longer bio for the detail page. */
  bio: string;
  /** Visual/character traits shown on the detail page. */
  traits: string[];
  /** Comic series slugs (src/data/comic-series.ts) this character appears in. */
  relatedSeries: string[];
  image?: string;
  imageAlt?: string;
  heroDeck?: string;
  heroMedia?: {
    portrait: CharacterMediaAsset;
    landscape?: CharacterMediaAsset;
  };
  heroMotion?: CharacterMotionAsset;
  featureMedia?: CharacterMediaAsset;
  motionMedia?: CharacterMotionAsset[];
  visualDevelopment?: CharacterVisualDevelopment;
  guideIntro?: string[];
  dossier?: {
    label: string;
    value: string;
  }[];
  guideSections?: {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
    media?: CharacterMediaAsset;
  }[];
  primaryCta?: {
    label: string;
    href: string;
    description?: string;
  };
};

const otherAliceRecord = getOtherAliceResident("other-alice");
const chesterRecord = getOtherAliceResident("chester");
const characterMedia = (
  id: string,
  width: number,
  height: number,
  caption?: string,
  fit: CharacterMediaAsset["fit"] = "cover",
): CharacterMediaAsset | undefined => {
  const asset = getOtherAliceAsset(id);
  return asset?.publicPath ? { src: asset.publicPath, alt: asset.altText, width, height, caption, fit } : undefined;
};
const characterMotion = (
  videoId: string,
  posterId: string,
  title: string,
  label: string,
  width: number,
  height: number,
  caption: string,
  companionStillId?: string,
  companionWidth?: number,
  companionHeight?: number,
): CharacterMotionAsset | undefined => {
  const video = getOtherAliceAsset(videoId);
  const poster = characterMedia(posterId, width, height);
  const companionStill = companionStillId && companionWidth && companionHeight
    ? characterMedia(companionStillId, companionWidth, companionHeight)
    : undefined;
  return video?.publicPath && poster
    ? { title, label, src: video.publicPath, poster, alt: video.altText, width, height, caption, companionStill }
    : undefined;
};
const characterTrait = (
  id: string,
  label: string,
  note: string,
): CharacterTraitPlate | undefined => {
  const media = characterMedia(id, 1250, 1250);
  return media ? { ...media, label, note } : undefined;
};
const alicePortraitMedia = characterMedia("oaa-hero-other-alice-representative-portrait-v01-3x4", 1500, 2000);
const aliceLandscapeMedia = characterMedia("oaa-hero-other-alice-representative-landscape-v01-16x9", 1920, 1080);
const aliceHeroMotion = characterMotion(
  "oaa-motion-alice-cast-hero-v01-3x4",
  "oaa-poster-alice-cast-hero-v01-3x4",
  "Alice at the workshop threshold",
  "Representative motion record",
  1244,
  1660,
  "Alice checks a measured remedy while the workshop and rain-soaked garden move around her.",
);
const aliceWorkshopMotion = characterMotion(
  "oaa-motion-alice-workshop-intro-v01-16x9",
  "oaa-poster-alice-workshop-intro-a-v01-16x9",
  "A preparation becomes evidence",
  "Workshop record",
  1916,
  1080,
  "Alice checks the remedy at the threshold, then returns to the worktable to measure what changed.",
  "oaa-poster-alice-workshop-intro-b-v01-16x9",
  1672,
  941,
);
const aliceWorldMotion = characterMotion(
  "oaa-motion-alice-world-intro-v01-3x2",
  "oaa-poster-alice-world-intro-a-v01-3x2",
  "The world answers in routes",
  "World record",
  1764,
  1176,
  "Chester blocks one path while a hidden service route turns scale into access.",
  "oaa-poster-alice-world-intro-b-v01-3x2",
  1536,
  1024,
);
const aliceWorkshopMedia = characterMedia(
  "oaa-region-plate-alice-workshop-local-effect-v01-16x9",
  1920,
  1080,
  "A working field station: one measured repair connects specimens, route records, tools, and materials borrowed from the surrounding community.",
);
const aliceSizeChangeMedia = characterMedia(
  "oaa-region-plate-alice-size-change-access-v01-3x2",
  1800,
  1200,
  "Reduced scale turns a hidden service route into navigable ground and exposes a leak larger bodies would miss.",
);
const aliceFirstHomeMedia = characterMedia(
  "oaa-region-plate-alice-chester-first-home-v01-3x2",
  1800,
  1200,
  "Chester blocks a route beside the established cabin and garden. Alice treats the refusal as evidence.",
);
const aliceSheetMedia = characterMedia(
  "oaa-evidence-other-alice-character-sheet-v01-4x3",
  1400,
  1050,
  "Identity and equipment reference. The complete sheet remains visible and uncropped.",
  "contain",
);
const aliceTraitPlates = [
  characterTrait(
    "oaa-trait-alice-world-v01-1x1",
    "Field silhouette",
    "The current full-body design joins a modified dress, working apron, heavy shoes, and carried supplies.",
  ),
  characterTrait(
    "oaa-trait-alice-profile-v01-1x1",
    "Working profile",
    "The bow, bob, pointed ears, lace, apron, and field equipment remain readable as one practical silhouette.",
  ),
  characterTrait(
    "oaa-trait-alice-hearing-v01-1x1",
    "Adapted hearing",
    "Her lengthened ears pick up sounds and route activity that an ordinary human ear would miss.",
  ),
  characterTrait(
    "oaa-trait-alice-vision-v01-1x1",
    "Expanded vision",
    "Her red eyes detect wavelengths of light outside ordinary human vision.",
  ),
  characterTrait(
    "oaa-trait-alice-tool-pouch-v01-1x1",
    "Variable tool pouch",
    "The pouch changes size to carry measured supplies. It is a field kit, not an unlimited portable workshop.",
  ),
  characterTrait(
    "oaa-trait-alice-beauty-v01-1x1",
    "Practical grooming",
    "Alice keeps her nearly black hair short because a field worker has to live with the design between scenes.",
  ),
  characterTrait(
    "oaa-trait-alice-contemplation-v01-1x1",
    "Observer at rest",
    "The present design still leaves room for patience, doubt, and the quiet work of noticing.",
  ),
].filter((plate): plate is CharacterTraitPlate => Boolean(plate));

export const characters: CharacterEntry[] = [
  {
    slug: "gary",
    name: "Gary",
    role: "Guinea pig",
    blurb: "The guinea pig who would not let go of the fork.",
    bio: "Gary is a guinea pig with the appetite of something much larger and the impulse control of something much smaller. If there is food, or an object shaped vaguely like food, Gary has already committed.",
    traits: [
      "Guinea pig",
      "Perpetually hungry",
      "Holds a grudge against cutlery",
    ],
    relatedSeries: ["gary"],
  },
  {
    slug: "fat-cat",
    name: "Fat Cat",
    role: "Cartoon cat",
    blurb: "Schemes big, follows through never.",
    bio: "Fat Cat is the resident schemer: a cat with grand plans, a low ceiling on effort, and a deep well of contempt for everyone, Gary especially.",
    traits: ["Cat", "Schemer", "Allergic to follow-through"],
    relatedSeries: ["gary"],
  },
  {
    slug: "larry",
    name: "Larry",
    role: "Retired dachshund officer",
    blurb:
      "A Prussian dachshund officer applying antique standards to a world that will not hold still.",
    bio: "Larry is a retired Prussian officer in dachshund form, wearing the uniform, helmet, medals, mustache, and permanent expression of severe disappointment. He brings parade-ground expectations to show business, counters, machines, and everyday nonsense.",
    traits: ["Dachshund officer", "Severe disappointment", "Antique standards"],
    relatedSeries: ["larry"],
  },
  {
    slug: "buffcock",
    name: "Buffcock",
    role: "Rooster",
    blurb: "All swagger, no plan.",
    bio: "Buffcock is a rooster convinced the barn revolves around him. The swagger is total; the plan does not exist.",
    traits: ["Rooster", "Ego the size of the barn", "No plan"],
    relatedSeries: ["buffcock"],
  },
  {
    slug: "hobunny",
    name: "Hobunny",
    role: "HobFarm rabbit",
    blurb: "The HobFarm rabbit and recurring mascot.",
    bio: "Hobunny is the HobFarm rabbit and on-again, off-again mascot, present for most of the farm's worse ideas.",
    traits: ["Rabbit", "Mascot duties optional", "Suspiciously calm"],
    relatedSeries: [],
  },
  {
    slug: "gothcat",
    name: "Gothcat",
    role: "Cabaret performer",
    blurb:
      "Dark glamour, sharp brows, cat ears, and complete control of the room.",
    bio: "Gothcat is a cabaret performer and pre-Code actress type with dark glamour, satin, lace, feathers, crescent jewelry, and a room-commanding stare. Larry claims to disapprove of her act, then somehow keeps returning.",
    traits: ["Cat", "Cabaret glamour", "Room control"],
    relatedSeries: ["larry"],
  },
  {
    slug: "helmut",
    name: "Helmut",
    role: "German Shepherd companion",
    blurb: "Larry's loyal, expressive, enthusiastic companion.",
    bio: "Helmut is Larry's German Shepherd companion: loyal, expressive, enthusiastic, and usually responsible for pulling Larry into situations Larry would have preferred to judge from a distance.",
    traits: ["German Shepherd", "Loyal", "Too enthusiastic"],
    relatedSeries: ["larry"],
  },
  {
    slug: "heidi",
    name: "Heidi",
    role: "Pomeranian girlfriend",
    blurb: "Tiny, fluffy, dramatic, and socially powerful.",
    bio: "Heidi is Helmut's white Pomeranian girlfriend. She is tiny, fluffy, dramatic, socially powerful, and much more charming than Larry would like.",
    traits: ["Pomeranian", "Dramatic", "Socially powerful"],
    relatedSeries: ["larry"],
  },
  {
    slug: "cs",
    name: "CS",
    role: "Customer support",
    blurb:
      "The support desk in human form, blamed for everything Buffcock causes.",
    bio: "CS is the support desk in human form: headset on, red mobility scooter parked in the blast radius, and somehow responsible for every public incident Buffcock creates.",
    traits: ["Headset", "Red mobility scooter", "Deadpan support mode"],
    relatedSeries: ["buffcock"],
  },
  {
    slug: "alice",
    name: "Alice",
    displayName: "Other Alice: Character Guide",
    seoTitle: "Other Alice Character Guide: The Alice Who Stayed in Wonderland",
    metaDescription:
      "Meet Other Alice, Wonderland's adult field observer. Read her public chronology, methods, equipment, and relationship with Chester.",
    role: "Natural philosopher and field observer",
    blurb: "The Alice who chose Wonderland, then learned how to work with it.",
    bio: otherAliceCanon.premise,
    traits: [
      String(otherAliceCanon.presentAge),
      "The Alice who stayed",
      "Boundary-testing problem solver",
    ],
    relatedSeries: ["other-alice-adventures"],
    image: aliceLandscapeMedia?.src ?? otherAliceRecord?.landscapeImage ?? otherAliceRecord?.image,
    imageAlt: aliceLandscapeMedia?.alt ?? otherAliceRecord?.landscapeImageAlt ?? otherAliceRecord?.imageAlt,
    heroDeck: otherAliceChronology.characterDeck,
    heroMedia: alicePortraitMedia ? { portrait: alicePortraitMedia, landscape: aliceLandscapeMedia } : undefined,
    heroMotion: aliceHeroMotion,
    featureMedia: aliceWorkshopMedia,
    motionMedia: [aliceWorkshopMotion, aliceWorldMotion].filter((asset): asset is CharacterMotionAsset => Boolean(asset)),
    visualDevelopment: {
      label: "Appearance and adaptation",
      title: "Wonderland changed her. Alice changed the rest herself.",
      paragraphs: [
        otherAlicePublicCanon.appearance.adaptation,
        otherAlicePublicCanon.appearance.clothing,
        otherAlicePublicCanon.appearance.toolPouch,
      ],
      note: otherAlicePublicCanon.appearance.developmentNote,
      plates: aliceTraitPlates,
    },
    guideIntro: [
      otherAliceChronology.residentSummary,
      `${otherAliceCanon.wonderlandYears} Wonderland years after arriving, she is fully adapted to a wet living world of fungal machinery, talking animals, House systems, unstable portals, and ecology that treats nonsense as infrastructure.`,
      "Alice is curious, analytical, self-possessed, and difficult to discourage. She watches how a system behaves, tests its rules, and follows contradictions until they lead somewhere useful or dangerous. Usually both.",
    ],
    dossier: [
      { label: "Age", value: String(otherAliceCanon.presentAge) },
      {
        label: "Origin",
        value: `Her original outside route is now ${otherAliceCanon.outsideYears} removed`,
      },
      { label: "Home", value: "A cabin and working garden in Wonderland" },
      {
        label: "Role",
        value:
          "Natural philosopher, field observer, preparation maker, route investigator, problem solver",
      },
      { label: "Companion", value: "Chester, an Unsuited Cheshire cat" },
      { label: "Method", value: "Preparation, evidence, persuasion, size change, and reciprocal help" },
    ],
    guideSections: [
      {
        title: "The two choices",
        paragraphs: [
          `${otherAlicePublicCanon.choices[0].summary} ${otherAlicePublicCanon.choices[1].summary}`,
          otherAlicePublicCanon.agency,
        ],
      },
      {
        title: "What Alice wants",
        paragraphs: [
          "Alice wants to know how far the rabbit-hole network extends and why Wonderland denies the places beyond its control. She wants access, evidence, and the freedom to follow a question after someone powerful says the matter is settled.",
        ],
      },
      {
        title: "How Alice works",
        paragraphs: [
          otherAlicePublicCanon.method.summary,
          `${otherAlicePublicCanon.method.materials} ${otherAlicePublicCanon.method.limits}`,
        ],
        bullets: [...otherAlicePublicCanon.method.sequence],
      },
      {
        title: "Size-changing access",
        paragraphs: [
          otherAlicePublicCanon.method.sizeChange,
          "Scale is a field tool, not a measure of strength. It lets Alice retrieve what was lost, inspect hidden systems, and reach people or places that larger bodies overlook.",
        ],
        media: aliceSizeChangeMedia,
      },
      {
        title: "Chester and the first home",
        paragraphs: [
          otherAlicePublicCanon.firstHome,
        ],
        media: aliceFirstHomeMedia,
      },
      {
        title: "Local effect",
        paragraphs: [
          otherAlicePublicCanon.localImprint,
          "The workshop makes one part of Wonderland better able to understand its own problems. Alice's influence remains local, practical, and tied to the favors and debts that keep it working.",
        ],
      },
      {
        title: "Field equipment",
        bullets: [
          "Dried fragments from opposite sides of the Caterpillar's size-changing mushroom, stored in separate compartments.",
          "A fungal knife for trimming false gills, cutting roots, collecting samples, and necessary physical work.",
          "Apron pockets holding vials, wrapped food, keys, samples, thread, tea, and undecided hazards.",
          "Notes and maps recording routes, debts, door behavior, biological reactions, and contradictions.",
        ],
        media: aliceSheetMedia,
      },
      {
        title: "Flaws",
        bullets: [
          "Treats danger as an interesting mechanism once it produces evidence.",
          "Can overlook emotional consequences while solving the structural problem.",
          "Pushes witnesses after they have already said they are afraid.",
          "Assumes she can learn a system before it closes around her.",
          "Has trouble leaving a contradiction unresolved.",
          "Sometimes mistakes competence for immunity.",
        ],
      },
      {
        title: "Time and memory",
        paragraphs: [
          `Alice experienced ${otherAliceCanon.wonderlandYears} years in Wonderland while ${otherAliceCanon.outsideYears} passed along her original outside route. ${otherAliceChronology.outsideCaveat}`,
          "Small Victorian traces remain in her phrasing, manners, mental arithmetic, and expectation that rules should be embarrassed when they fail to make sense.",
        ],
      },
    ],
    primaryCta: {
      label: "Explore Other Alice Adventures",
      href: "/presents/other-alice-adventures/",
      description:
        "Meet Alice through the anomalies, routes, and questions that pull her toward Wonderland's edge.",
    },
  },
  {
    slug: "chester",
    name: "Chester",
    role: "Alice's independent companion",
    blurb: "A very fat old British Blue route authority with no interest in performing for strangers.",
    bio: `${otherAliceCanon.chester} He is a skeptical witness and occasional route authority who recognizes when a system is lying without explaining it cleanly.`,
    traits: [
      "Very fat older British Blue Cheshire cat",
      "Flat, judgmental expression",
      "Threshold instinct and route refusal",
    ],
    relatedSeries: ["other-alice-adventures"],
    image: chesterRecord?.image,
    imageAlt: chesterRecord?.imageAlt,
    heroDeck:
      "If Chester refuses a route, the refusal matters. Alice has learned to treat his silence as evidence.",
    guideIntro: [
      "Chester is old, round, heavy, plush, lazy, and unimpressed.",
      "His strangeness comes from impossible placement, refusal, and the rare moment when he demonstrates a route rule. He can vanish, appear, cross a threshold, and wait at the far end of a tunnel Alice has spent hours crawling through.",
      "Alice no longer needs constant guidance. Chester's present laziness partly reflects the knowledge, routes, and relationships she has built since childhood.",
    ],
    dossier: [
      { label: "Lineage", value: "Cheshire cat" },
      { label: "House status", value: "Unsuited" },
      { label: "Domain", value: "Thresholds, routes, instinct, and refusal" },
      { label: "Companion", value: "Other Alice" },
      { label: "Eyes", value: "Amber" },
      { label: "Usual expression", value: "Flat, heavy, and judgmental" },
    ],
    guideSections: [
      {
        title: "How Chester guides",
        bullets: [
          "Refuses routes that are dangerous in ways Alice cannot yet perceive.",
          "Sleeps beside stable passages.",
          "Stares at walls where an opening exists or soon will.",
          "Leaves without warning when Alice crosses somewhere he cannot guide her.",
        ],
      },
      {
        title: "Physical consequence",
        paragraphs: [
          "Chester's weight changes furniture, ground, foliage, baskets, and every frame that contains him. He is not a floating mascot. When he lands, water leaves the moss around his paws.",
        ],
      },
      {
        title: "Alice and Chester",
        paragraphs: [
          "After Alice chose to remain in Wonderland, she began calling the Cheshire Cat Chester. He guided without choosing for her, recognized dangerous routes, and drew local helpers toward the first cabin and garden.",
          "Alice tests systems until they produce evidence. Chester senses when the system itself is dishonest. Their trust is old enough to survive argument and specific enough that a single refusal can stop her at a door.",
        ],
      },
    ],
    primaryCta: {
      label: "Open the Other Alice World Guide",
      href: "/presents/other-alice-adventures/world-guide/",
      description: "See Chester's place among the Unsuited, routes, Houses, and current boundary evidence.",
    },
  },
  {
    slug: "the-hatter",
    name: "The Hatter",
    displayName: "The Hatter Highlands: Working Reconstruction",
    seoTitle: "Hatter Highlands Working Reconstruction | Other Alice",
    metaDescription:
      "Review the disputed public evidence connecting a Hatter mark to hospitality and distribution in Wonderland's commercial highlands.",
    role: "Disputed Diamond hospitality record",
    blurb: "A working reconstruction built from route-house marks, tasting rooms, and protected distribution records.",
    bio:
      "Records associate a Hatter mark with highland hospitality and distribution, but they do not settle one person's identity, origin, authority, or present condition.",
    traits: [
      "Working reconstruction",
      "Diamond hospitality mark",
      "Origin and authority unresolved",
    ],
    relatedSeries: ["other-alice-adventures"],
    image: "https://cdn.hob.farm/pages/other-alice-adventures/mad-hatter-diamond-highlands-concept.webp",
    imageAlt:
      "Working concept portrait of the Hatter in a dark 1930s suit and structured hat, holding tea above the misty Diamond Highlands.",
    heroDeck:
      "The highlands record is useful because its claims remain visible. It is not settled canon.",
    guideIntro: [
      "Confirmed highland evidence shows cultivation, processing, hospitality, markets, freight, estate claims, and road protection occupying the same terrain.",
      "The Hatter connection is a disputed working reconstruction. It can organize questions without turning those questions into biography.",
    ],
    dossier: [
      { label: "House", value: "Diamonds" },
      { label: "Region", value: "The Diamond Highlands" },
      { label: "Public record", value: "Hospitality marks, protected distribution, and tasting-house evidence" },
      { label: "Identity", value: "Unresolved" },
      { label: "Origin", value: "Unresolved" },
      { label: "Canon state", value: "Disputed working reconstruction" },
    ],
    guideSections: [
      {
        title: "The Diamond Highlands",
        paragraphs: [
          "The Highlands sit above the hotter inner jungle and below the Spade forest belt. Hearts claim the land, Diamonds control the commodity economy, Spades maintain cultivation and processing, and Clubs secure roads, warehouses, convoys, and collections.",
          "The region produces tea, coffee, honey, wax, flowers, perfume, dyes, preserved fruit, medicinal roots, fungal extracts, psychoactive crops, resins, and fermented drinks.",
        ],
      },
      {
        title: "What the evidence can support",
        bullets: [
          "Diamond businesses turn cultivated material into hospitality, processing, contracts, and distribution.",
          "Heart titles, Spade labor and water, and Club roads remain necessary to that commerce.",
          "A repeated Hatter mark appears useful as a research key, not proof of one founder or family line.",
        ],
      },
      {
        title: "What remains open",
        paragraphs: [
          "The Hatter's formal identity, origin, authority, and relationship to the current highlands remain unresolved.",
          "No public record here confirms a founding narrative, personal biography, present conflict, or story sequence.",
        ],
      },
    ],
    primaryCta: {
      label: "Explore the Diamond power system",
      href: "/presents/other-alice-adventures/houses/#diamonds",
      description:
        "See how land, commodities, labor, and force overlap across the Diamond Highlands.",
    },
  },
];

const characterBySlug = new Map(characters.map((c) => [c.slug, c]));

export function getCharacter(
  slug: string | undefined | null,
): CharacterEntry | undefined {
  return slug ? characterBySlug.get(slug) : undefined;
}

/**
 * Characters live on the page for the world they belong to. `/characters/` is
 * retired, so this resolves to an anchor on that page: Other Alice residents to
 * the cast page, comic characters to their series page.
 */
export function characterPath(slug: string): string {
  const character = getCharacter(slug);
  const series = character?.relatedSeries ?? [];

  if (series.includes("other-alice-adventures")) {
    return `/presents/other-alice-adventures/cast/${slug}/`;
  }
  const comicSeries = series.find((entry) => entry !== "other-alice-adventures");
  if (comicSeries) {
    return `/presents/funnies/${comicSeries}/#character-${slug}`;
  }
  return "/presents/funnies/";
}

export function getCharacterName(slug: string | undefined | null): string {
  return getCharacter(slug)?.name ?? slug ?? "";
}
