// The HobFarm cast index. HobFarm has no character content collection (yet), so
// the recurring cast is curated here as plain data. /characters lists them and
// /characters/[slug] renders a detail page; `relatedSeries` links into either
// the Funnies comic series (src/data/comic-series.ts) or the HobFarm Presents
// story series (src/data/story-series.ts), and the page also pulls the latest
// comics featuring the character from the comics collection.

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
      "Meet Other Alice, the eighteen-year-old Alice who grew up in Wonderland. Learn about her history, abilities, flaws, relationship with Chester, and appearances in Other Alice Adventures.",
    role: "Wonderland explorer",
    blurb: "The girl who stayed down.",
    bio: "Alice entered Wonderland at about eight and stayed. Ten Wonderland years later, she is eighteen, fully adapted to its living systems, and following evidence that the known world has an edge.",
    traits: [
      "Eighteen",
      "The Alice who stayed",
      "Boundary-testing problem solver",
    ],
    relatedSeries: ["other-alice-adventures"],
    image:
      "https://cdn.hob.farm/pages/other-alice-adventures/other-alice-wonderland-hero.png",
    imageAlt:
      "Other Alice in the wet purple, green, and cyan growth of Wonderland.",
    heroDeck:
      "She fell into Wonderland at about eight. Ten Wonderland years later, she knows which rules are useful, which ones are local, and which holes should probably remain closed.",
    guideIntro: [
      "Other Alice is the girl who stayed down.",
      "She entered Wonderland as a Victorian child with schoolroom facts, formal manners, and no idea what waited below the rabbit hole. Ten Wonderland years later, she is fully adapted to a wet living world of fungal machinery, talking animals, card-suit castes, casino power, unstable portals, and ecological systems that treat nonsense as infrastructure.",
      "Alice is curious, analytical, self-possessed, and difficult to discourage. She watches how a system behaves, tests its rules, and follows contradictions until they lead somewhere useful or dangerous. Usually both.",
    ],
    dossier: [
      { label: "Age", value: "18" },
      {
        label: "Origin",
        value: "Victorian England, roughly two hundred outside-world years ago",
      },
      { label: "Home", value: "Wonderland" },
      {
        label: "Role",
        value:
          "Forager, scavenger, explorer, tea ritualist, problem solver, boundary-walker",
      },
      { label: "Companion", value: "Chester, the older Cheshire Cat" },
      { label: "Core phrase", value: "The girl who stayed down" },
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
          "Chester is the Cheshire Cat after ten more years of knowing Alice: older, much fatter, lazier, and usually close by. He is not Alice's pet. He is her oldest companion, skeptical witness, occasional guide, and remaining connection to the child who first entered Wonderland.",
          "Alice recognizes systems through observation. Chester senses when the system itself is lying. He also keeps her from turning every frightened person into a source of useful data.",
        ],
      },
      {
        title: "Time and memory",
        paragraphs: [
          "Alice experienced ten years in Wonderland while roughly two hundred years passed along her original route. The outside world is now around the 2060s. Wonderland absorbed people, objects, media, technologies, and cultural fragments through unstable portals, so her worldview did not remain Victorian.",
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
    blurb: "The older Cheshire Cat, mostly done performing for strangers.",
    bio: "Chester is the Cheshire Cat after ten more years of Wonderland: enormous, older, lazier, and usually near Alice. He recognizes when a system is lying and understands deeper Wonderland rules that he rarely explains cleanly.",
    traits: [
      "Older Cheshire Cat",
      "Sarcastic grin",
      "Understands Wonderland's deeper rules",
    ],
    relatedSeries: ["other-alice-adventures"],
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
