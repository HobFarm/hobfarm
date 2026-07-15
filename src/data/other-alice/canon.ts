export const OTHER_ALICE_ROOT_PATH =
  "/departments/hobfarm-presents/other-alice-adventures/";
export const OTHER_ALICE_WORLD_GUIDE_PATH = `${OTHER_ALICE_ROOT_PATH}world-guide/`;
export const OTHER_ALICE_HOUSES_PATH = `${OTHER_ALICE_ROOT_PATH}houses/`;
export const OTHER_ALICE_CAST_PATH = `${OTHER_ALICE_ROOT_PATH}cast/`;
export const OTHER_ALICE_WEB_PATH = `${OTHER_ALICE_ROOT_PATH}web-of-wonderland/`;
export const OTHER_ALICE_WORLD_GUIDE_MEDIA_ROOT =
  "https://cdn.hob.farm/pages/other-alice-adventures/";

const chronologyValues = {
  arrivedAge: 8,
  presentAge: 18,
  wonderlandYears: 10,
  outsideYears: "about 200 years",
} as const;
const numberWords: Record<number, string> = { 8: "eight", 10: "ten", 18: "eighteen" };
const word = (value: number) => numberWords[value] ?? String(value);
const sentenceCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const otherAliceEntityRefs = {
  alice: "other-alice",
  chester: "chester",
  whiteRabbit: "white-rabbit",
  caterpillarMushroom: "size-change-mushroom",
  cabinWorkshop: "workshop-archive",
  burrowNetwork: "burrow",
} as const;

export const otherAliceCanon = {
  ...chronologyValues,
  formatLine:
    `Alice arrived at ${word(chronologyValues.arrivedAge)}. She is ${word(chronologyValues.presentAge)} now. ${sentenceCase(word(chronologyValues.wonderlandYears))} years passed for her. About two hundred passed outside.`,
  premise:
    `At ${word(chronologyValues.arrivedAge)}, Alice chose to follow the White Rabbit into Wonderland. Later, when a viable route home opened, she chose to stay. Now ${word(chronologyValues.presentAge)}, she reads Wonderland's routes, institutions, organisms, and contradictions as the structure of home.`,
  politicalRule:
    "Hearts own the ground. Diamonds own the business. Spades keep it alive. Clubs make sure it stays owned.",
  mapRule: "The Hearts own the map. The other Houses own the places on it.",
  chester:
    "The Cheshire Cat became Alice's companion after she chose to stay. She began calling him Chester as their relationship changed from a chance encounter into a life built in the same place.",
} as const;

export const otherAlicePublicCanon = {
  choices: [
    {
      id: "follow-white-rabbit",
      label: "Choice 01",
      summary: `Followed the White Rabbit into Wonderland at age ${otherAliceCanon.arrivedAge}.`,
    },
    {
      id: "remain-in-wonderland",
      label: "Choice 02",
      summary: "Chose to stay when a viable route home opened.",
    },
  ],
  agency:
    "Alice understood that returning and remaining would lead to different lives. She chose Wonderland without knowing the full time cost or everything adaptation would change.",
  appearance: {
    adaptation:
      `Alice entered Wonderland much as she appeared in the old story. ${sentenceCase(word(otherAliceCanon.wonderlandYears))} years of living there changed her: she keeps her hair short for field work, it has darkened to almost black, her skin has turned green, her lengthened ears hear more sharply, and her red eyes detect wavelengths ordinary human eyes cannot see.`,
    clothing:
      "Her clothes changed by choice. Alice dyed her old dress purple, altered the lace, and rebuilt it around the person she became: part field naturalist, part potion-maker, part gothic Lolita witch.",
    toolPouch:
      "Her apron still has a small pocket, but the tool pouch inside it can change size. It carries ingredients, instruments, containers, and field supplies without turning into an unlimited inventory or a portable full workshop.",
    developmentNote:
      "These plates record the current public design for an evolving mixed-media graphic novel series. The rendering may continue to develop while the practical reasons behind Alice's appearance remain part of her history.",
  },
  method: {
    summary:
      "Alice works as a natural philosopher, field observer, potion and remedy maker, route investigator, and size-changing access specialist. She solves local problems through preparation, evidence, negotiation, and reciprocal help.",
    materials:
      "She gathers fungi, plants, teas, flowers, spores, resins, mineral fragments, venoms, fluids, and other local materials for specific preparations.",
    limits:
      "Every preparation needs a known material, a method, a dose, a local source, a limitation, and a consequence. Alice does not have an unlimited list of spells.",
    sizeChange:
      "Prepared fragments from the Caterpillar's mushroom let her grow or shrink. She uses the change to reach burrows, service routes, hidden rooms, lost objects, and spaces made for other bodies.",
    sequence: [
      "Observe what the system actually does.",
      "Identify the organism, institution, route, substance, appetite, or rule causing pressure.",
      "Gather evidence and prepare for local conditions.",
      "Bargain, persuade, recruit help, or enter a space others cannot.",
      "Change the relationship or system with the least necessary force.",
      "Leave with evidence, debt, damage, leverage, or a revised map.",
    ],
  },
  firstHome:
    "After Alice chose to stay, she began calling the Cheshire Cat Chester. He remained an independent companion, not a pet or parent. Chester and a changing group of local helpers helped her establish the cabin, early garden, food systems, and nearby relationships. Alice repaid that help with route access, retrieval, messages, remedies, experiments, and work that required a different scale.",
  localImprint:
    "Alice's cabin and workshop return practical knowledge to the surrounding community through remedies, route records, scale tests, field notes, repairs, favors, hospitality, and reciprocal alliances.",
} as const;

export const otherAliceChronology = {
  arrival: `Alice chose to follow the White Rabbit into Wonderland at ${word(otherAliceCanon.arrivedAge)}.`,
  residentSummary: `Alice entered Wonderland by choice at ${word(otherAliceCanon.arrivedAge)}. Later, when a viable route home opened, she chose to stay. She is ${word(otherAliceCanon.presentAge)} now.`,
  startDeck: `Alice chose to follow the White Rabbit into Wonderland at ${word(otherAliceCanon.arrivedAge)}. She later chose to stay. ${sentenceCase(word(otherAliceCanon.wonderlandYears))} Wonderland years later, she knows it as a country, an ecology, and a political machine. About two centuries have passed along the route she came.`,
  rail: `Alice: ${otherAliceCanon.presentAge} · Wonderland time: ${otherAliceCanon.wonderlandYears} years · Outside route: ${otherAliceCanon.outsideYears}`,
  outsideGap: "About two centuries",
  outsideCaveat:
    "The interval does not establish a fixed conversion ratio or a confirmed outside calendar year.",
  characterDeck: `She followed the White Rabbit into Wonderland at ${word(otherAliceCanon.arrivedAge)}, then chose to stay when a viable route home opened. ${sentenceCase(word(otherAliceCanon.wonderlandYears))} Wonderland years and about two outside centuries later, she knows which rules are useful, which ones are local, and which official maps are lying.`,
  timeline: [
    `Followed the White Rabbit at ${word(otherAliceCanon.arrivedAge)}`,
    "Chose to stay when a route home opened",
    `${sentenceCase(word(otherAliceCanon.wonderlandYears))} Wonderland years`,
    `${sentenceCase(word(otherAliceCanon.presentAge))} now`,
    `About two hundred outside years`,
  ],
} as const;
