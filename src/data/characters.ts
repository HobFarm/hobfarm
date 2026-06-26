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
    role: "Cartoon regular",
    blurb: "Means well. It rarely helps.",
    bio: "Larry is the well-meaning one. He shows up, he tries, and the situation is almost always worse for it.",
    traits: ["Earnest", "Accident-prone", "Optimist against all evidence"],
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
    role: "Critter",
    blurb: "Strong opinions about the void and your lighting.",
    bio: "Gothcat has strong opinions about the void, your color grading, and whether any of this is worth getting up for. The answer is usually no.",
    traits: ["Cat", "Goth", "Lighting critic"],
    relatedSeries: ["gothcat"],
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
