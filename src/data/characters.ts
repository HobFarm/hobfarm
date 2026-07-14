// The HobFarm cast index. HobFarm has no character content collection (yet), so
// the recurring cast is curated here as plain data. /characters lists them and
// /characters/[slug] renders a detail page; `relatedSeries` links into either
// the Funnies comic series (src/data/comic-series.ts) or the HobFarm Presents
// story series (src/data/story-series.ts), and the page also pulls the latest
// comics featuring the character from the comics collection.

import {
  getOtherAliceResident,
  otherAliceCanon,
  otherAliceChronology,
} from "@/data/other-alice-world-guide";

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
  guideIntro?: string[];
  dossier?: {
    label: string;
    value: string;
  }[];
  guideSections?: {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
  }[];
  primaryCta?: {
    label: string;
    href: string;
    description?: string;
  };
};

const otherAliceRecord = getOtherAliceResident("other-alice");
const chesterRecord = getOtherAliceResident("chester");

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
    relatedSeries: ["gary", "gary-fat-cat"],
  },
  {
    slug: "fat-cat",
    name: "Fat Cat",
    role: "Cartoon cat",
    blurb: "Schemes big, follows through never.",
    bio: "Fat Cat is the resident schemer: a cat with grand plans, a low ceiling on effort, and a deep well of contempt for everyone, Gary especially.",
    traits: ["Cat", "Schemer", "Allergic to follow-through"],
    relatedSeries: ["fat-cat", "gary-fat-cat"],
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
    relatedSeries: ["hobunny"],
  },
  {
    slug: "gothcat",
    name: "Gothcat",
    role: "Cabaret performer",
    blurb:
      "Dark glamour, sharp brows, cat ears, and complete control of the room.",
    bio: "Gothcat is a cabaret performer and pre-Code actress type with dark glamour, satin, lace, feathers, crescent jewelry, and a room-commanding stare. Larry claims to disapprove of her act, then somehow keeps returning.",
    traits: ["Cat", "Cabaret glamour", "Room control"],
    relatedSeries: ["gothcat", "larry"],
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
    role: "Wonderland explorer",
    blurb: "Boundary-tester and field observer.",
    bio: otherAliceCanon.premise,
    traits: [
      String(otherAliceCanon.presentAge),
      "The Alice who stayed",
      "Boundary-testing problem solver",
    ],
    relatedSeries: ["other-alice-adventures"],
    image: otherAliceRecord?.image,
    imageAlt: otherAliceRecord?.imageAlt,
    heroDeck: otherAliceChronology.characterDeck,
    guideIntro: [
      `${otherAliceChronology.arrival} She grew up inside Wonderland.`,
      `${otherAliceCanon.wonderlandYears} Wonderland years later, she is fully adapted to a wet living world of fungal machinery, talking animals, House systems, casino power, unstable portals, and ecology that treats nonsense as infrastructure.`,
      "Alice is curious, analytical, self-possessed, and difficult to discourage. She watches how a system behaves, tests its rules, and follows contradictions until they lead somewhere useful or dangerous. Usually both.",
    ],
    dossier: [
      { label: "Age", value: String(otherAliceCanon.presentAge) },
      {
        label: "Origin",
        value: `An outside route now ${otherAliceCanon.outsideYears} removed`,
      },
      { label: "Home", value: "Wonderland" },
      {
        label: "Role",
        value:
          "Forager, scavenger, explorer, tea ritualist, problem solver, boundary-walker",
      },
      { label: "Companion", value: "Chester, an Unsuited Cheshire cat" },
      { label: "Public role", value: "Boundary-tester and field observer" },
    ],
    guideSections: [
      {
        title: "Is Other Alice evil?",
        paragraphs: [
          "No. Other Alice is not a horror inversion, corrupted villain, or generic dark warrior. Wonderland changed her, but it did not reduce her to cruelty.",
          "Her weakness is not evil. It is curiosity without an adequate stopping mechanism.",
        ],
      },
      {
        title: "What Alice wants",
        paragraphs: [
          "Alice wants to know how far the rabbit-hole network extends and why Wonderland denies the places beyond its control. She wants access, evidence, and the freedom to follow a question after someone powerful says the matter is settled.",
        ],
      },
      {
        title: "Strengths",
        bullets: [
          "Reads living environments and notices when an ecosystem behaves incorrectly.",
          "Knows which plants, fungi, animals, and fluids are useful, dangerous, edible, dishonest, or temporarily asleep.",
          "Navigates tunnels, service routes, forests, city layers, and unstable openings.",
          "Thinks in systems and tests claims against visible evidence.",
          "Improvises practical tools from Wonderland organisms and discarded technology.",
          "Uses manners as a tool, a weapon, or an insult depending on the room.",
        ],
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
        title: "Methods",
        paragraphs: [
          "Observe what the system does rather than what people call it. Compare it with something familiar. Test one rule at a time. Keep a sample. Bargain for access. Break the rule only after learning what it protects.",
        ],
      },
      {
        title: "Field equipment",
        bullets: [
          "Dried fragments from opposite sides of the Caterpillar's size-changing mushroom, stored in separate compartments.",
          "A fungal knife for trimming false gills, cutting roots, collecting samples, and physical corrections.",
          "Apron pockets holding vials, wrapped food, keys, samples, thread, tea, and undecided hazards.",
          "Notes and maps recording routes, debts, door behavior, biological reactions, and contradictions.",
        ],
      },
      {
        title: "Chester",
        paragraphs: [
          "Chester is an older, very fat British Blue Cheshire cat with a plain grey-blue coat, amber eyes, heavy paws, and a normal flat cat expression. He is not Alice's pet. He is her oldest companion, skeptical witness, occasional guide, and remaining connection to the child who first entered Wonderland.",
          "Alice recognizes systems through observation. Chester senses when the system itself is lying. He also keeps her from turning every frightened person into a source of useful data.",
        ],
      },
      {
        title: "Time and memory",
        paragraphs: [
          `Alice experienced ${otherAliceCanon.wonderlandYears} years in Wonderland while ${otherAliceCanon.outsideYears} passed along her original outside route. That interval does not establish a fixed conversion ratio or a confirmed outside calendar year.`,
          "Small Victorian traces remain in her phrasing, manners, mental arithmetic, and expectation that rules should be embarrassed when they fail to make sense.",
        ],
      },
    ],
    primaryCta: {
      label: "Explore Other Alice Adventures",
      href: "/departments/hobfarm-presents/other-alice-adventures/",
      description:
        "Meet Alice through the anomalies, routes, and questions that pull her toward Wonderland's edge.",
    },
  },
  {
    slug: "chester",
    name: "Chester",
    role: "Alice's companion",
    blurb: "A very fat old British Blue route authority with no interest in performing for strangers.",
    bio: `${otherAliceCanon.chester} Chester is Alice's companion, skeptical witness, and occasional route authority. He recognizes when a system is lying and exposes rules without explaining them cleanly.`,
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
          "Alice tests systems until they produce evidence. Chester senses when the system itself is dishonest. Their trust is old enough to survive argument and specific enough that a single refusal can stop her at a door.",
        ],
      },
    ],
    primaryCta: {
      label: "Open the Other Alice World Guide",
      href: "/departments/hobfarm-presents/other-alice-adventures/world-guide/",
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
      href: "/departments/hobfarm-presents/other-alice-adventures/houses/#diamonds",
      description:
        "See how land, commodities, labor, and force overlap across the Diamond Highlands.",
    },
  },
  {
    slug: "hillary-hobfarm",
    name: "Hillary HobFarm",
    role: "Host",
    blurb: "HobFarm's host character.",
    bio: "Hillary HobFarm hosts, narrates, and occasionally apologizes for the rest of the cast.",
    traits: ["Host", "Narrator", "Long-suffering"],
    relatedSeries: [],
  },
];

const characterBySlug = new Map(characters.map((c) => [c.slug, c]));

export function getCharacter(
  slug: string | undefined | null,
): CharacterEntry | undefined {
  return slug ? characterBySlug.get(slug) : undefined;
}

export function characterPath(slug: string): string {
  return `/characters/${slug}/`;
}

export function getCharacterName(slug: string | undefined | null): string {
  return getCharacter(slug)?.name ?? slug ?? "";
}
