// The HobFarm cast index. HobFarm has no character content collection (yet), so
// the recurring cast is curated here as plain data. /characters lists them and
// /characters/[slug] renders a detail page; `relatedSeries` links into the
// Funnies comic series (src/data/comic-series.ts) and the page also pulls the
// latest comics featuring the character from the comics collection.

export type CharacterEntry = {
  slug: string;
  name: string;
  role: string;
  /** One-line index blurb. */
  blurb: string;
  /** Longer bio for the detail page. */
  bio: string;
  /** Visual/character traits shown on the detail page. */
  traits: string[];
  /** Comic series slugs (src/data/comic-series.ts) this character appears in. */
  relatedSeries: string[];
};

export const characters: CharacterEntry[] = [
  {
    slug: "gary",
    name: "Gary",
    role: "Guinea pig",
    blurb: "The guinea pig who would not let go of the fork.",
    bio: "Gary is a guinea pig with the appetite of something much larger and the impulse control of something much smaller. If there is food, or an object shaped vaguely like food, Gary has already committed.",
    traits: ["Guinea pig", "Perpetually hungry", "Holds a grudge against cutlery"],
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
    blurb: "A Prussian dachshund officer applying antique standards to a world that will not hold still.",
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
    blurb: "Dark glamour, sharp brows, cat ears, and complete control of the room.",
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
    blurb: "The support desk in human form, blamed for everything Buffcock causes.",
    bio: "CS is the support desk in human form: headset on, red mobility scooter parked in the blast radius, and somehow responsible for every public incident Buffcock creates.",
    traits: ["Headset", "Red mobility scooter", "Deadpan support mode"],
    relatedSeries: ["buffcock"],
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

export function getCharacter(slug: string | undefined | null): CharacterEntry | undefined {
  return slug ? characterBySlug.get(slug) : undefined;
}

export function characterPath(slug: string): string {
  return `/characters/${slug}/`;
}

export function getCharacterName(slug: string | undefined | null): string {
  return getCharacter(slug)?.name ?? slug ?? "";
}
