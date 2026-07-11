export const OTHER_ALICE_WORLD_GUIDE_PATH =
  "/departments/hobfarm-presents/other-alice-adventures/world-guide/";

/**
 * New World Guide media should be uploaded beneath this R2/CDN prefix.
 * Entries may remain text-only until approved media exists; never substitute
 * a generated placeholder for a canonical character or location.
 */
export const OTHER_ALICE_WORLD_GUIDE_MEDIA_ROOT =
  "https://cdn.hob.farm/pages/other-alice-adventures/world-guide";

export type CourtDossier = {
  id: "hearts" | "diamonds" | "spades" | "clubs";
  name: string;
  territory: string;
  corePower: string;
  dominantBodies: string;
  necessaryService: string;
  politicalFailure: string;
  ruler: string;
  summary: string[];
  accent: string;
};

export const courtDossiers: CourtDossier[] = [
  {
    id: "hearts",
    name: "The Heart Court",
    territory: "The central labyrinth city and the House",
    corePower: "Law, money, spectacle, information, and diplomacy",
    dominantBodies: "Humanoid clone lines and engineered arthropod hybrids",
    necessaryService: "Coordination and central government",
    politicalFailure: "Control, debt, contracts, and surveillance",
    ruler: "The Queen of Hearts",
    summary: [
      "Hearts control the House: the castle, casino, theater, government complex, breeding houses, financial institutions, and the Table where the courts negotiate.",
      "The Queen claims authority over all Wonderland because she controls procedure, central law, and the systems through which the other crowns bargain. The other monarchs treat her as first among the crowns, not necessarily their absolute ruler.",
    ],
    accent: "#e23a4e",
  },
  {
    id: "diamonds",
    name: "The Diamond Court",
    territory: "The jungle, major waterways, reservoirs, and the living mountain palace",
    corePower: "Water, medicine, trade, biological cultivation, and luxury",
    dominantBodies: "Tiger royalty, other great cats, tropical birds, and smaller primates",
    necessaryService: "Water and biological wealth",
    politicalFailure: "Monopoly, luxury, and extraction",
    ruler: "The Diamond King and Queen",
    summary: [
      "Diamonds rule the jungle's largest hydraulic system. Their palace is a mountain converted into a living water machine, using waterfalls and reservoirs to power transport, cooling, agriculture, defenses, and ceremonial life.",
      "Their alliance with Hearts is practical: Diamonds provide water, medicine, biological materials, and wealth; Hearts provide markets, law, entertainment, and political legitimacy.",
    ],
    accent: "#19e3e3",
  },
  {
    id: "spades",
    name: "The Spade Court",
    territory: "Forests, marshes, farms, fungal colonies, roots, and the old tunnel network",
    corePower: "Food, transit, cultivation, maintenance, maps, and ecological repair",
    dominantBodies: "Rabbits, snakes, deer, frogs, turtles, hedgehogs, and natural insects",
    necessaryService: "Ecological maintenance and movement",
    politicalFailure: "Tradition, bureaucracy, and hidden control of routes",
    ruler: "The Rabbit King and Queen",
    summary: [
      "Spades are the least theatrical court and possibly the most essential. They keep Wonderland fed, connected, drained, planted, composted, repaired, and mapped.",
      "Heart law may regulate travel on paper, but Spades know which tunnels actually go where. Their power comes from routes, calendars, population records, and the ability to close a burrow nobody else knew existed.",
    ],
    accent: "#2fe089",
  },
  {
    id: "clubs",
    name: "The Club Court",
    territory: "The high desert, taiga, tundra, glaciers, mines, crash fields, and industrial frontier",
    corePower: "Defense, salvage, machinery, fuel, construction, and heavy transport",
    dominantBodies: "Bears, powerful animals, and cybernetic or genetic hybrids",
    necessaryService: "Protection and physical infrastructure",
    politicalFailure: "Militarism, hierarchy, and resource hoarding",
    ruler: "The Polar Bear King",
    summary: [
      "Clubs protect the outer realm and control the largest deposits of preserved outside technology. Their machines are inherited, repaired, personalized, misunderstood, and fused into living bodies rather than manufactured cleanly.",
      "All bears are Clubs, though their territory and lineage create divided loyalties. A panda house may live under Diamond regional law while still owing suit allegiance to the Polar Bear King.",
    ],
    accent: "#6b93ed",
  },
];

export type UnsuitedDossier = {
  id: string;
  name: string;
  domain: string;
  source: string;
  image?: string;
  imageAlt?: string;
  summary: string[];
  sceneRules: string[];
};

export const unsuitedDossiers: UnsuitedDossier[] = [
  {
    id: "chester-unsuited",
    name: "Chester",
    domain: "Thresholds, routes, instinct, and refusal",
    source: "The Cheshire Cat, continued through HobFarm's branch",
    image:
      "https://cdn.hob.farm/pages/other-alice-adventures/oaa-chester-portrait-.png",
    imageAlt:
      "Chester, an enormous gray Cheshire cat with amber eyes, seated among wet fungal growth and card relics.",
    summary: [
      "Chester is an Unsuited Cheshire cat and Alice's companion, though companion is more accurate than pet. He understands portals without needing maps and recognizes when a route is dangerous, unstable, or lying.",
      "His strangeness comes from impossible placement rather than constant performance. Alice may crawl through a tunnel for hours and find Chester already waiting at the exit, irritated that she took so long.",
    ],
    sceneRules: [
      "If Chester refuses to enter, the route is dangerous in a way Alice cannot yet perceive.",
      "If he sleeps beside a doorway, the passage is stable.",
      "If he stares at an empty wall, an opening exists there or soon will.",
      "If he leaves Alice without warning, she has crossed somewhere he cannot guide her.",
    ],
  },
  {
    id: "caterpillar-unsuited",
    name: "The Caterpillar",
    domain: "Identity, transformation, probability, and time",
    source: "The Caterpillar, continued through HobFarm's branch",
    summary: [
      "The Caterpillar sees what people are becoming, the choices around that transformation, and the identities they are trying to escape. He tells people what they need to hear in order to become capable of understanding the truth later.",
      "His hookah is a breath engine built into a living fungal chamber. Spores, memory compounds, recovered neural technology, pheromones, smoke, and mycelial communication externalize possible identities and unrealized outcomes.",
      "He may be the first being who understands what Other Alice means, but he will not explain it in one sitting.",
    ],
    sceneRules: [
      "His abilities stay narrow but deep: becoming, not general prophecy.",
      "He values transformation more than comfort or political stability.",
      "He may call Alice by different names according to the version he perceives.",
      "His presence changes the rules of identity and time inside a scene.",
    ],
  },
];

export const affiliationLayers = [
  {
    label: "Species or lineage",
    description: "What kind of body, ancestry, and inherited behavior a resident carries.",
  },
  {
    label: "Suit",
    description: "The political-biological function through which a resident serves Wonderland.",
  },
  {
    label: "Territory",
    description: "Which ruler's laws and local systems govern the place where that resident lives.",
  },
];

export const aliceTimeline = [
  {
    label: "Victorian England",
    value: "Alice enters Wonderland at about eight during the 1860s.",
  },
  {
    label: "Personal time",
    value: "She experiences ten continuous Wonderland years and is now eighteen.",
  },
  {
    label: "Outside time",
    value: "Roughly two centuries pass along Alice's original rabbit-hole route, placing the outside world around the 2060s.",
  },
  {
    label: "Present contradiction",
    value: "Alice is biologically and psychologically eighteen, historically ancient, and legally impossible.",
  },
];

export const worldGuideTerms = [
  {
    term: "The House",
    definition:
      "The Queen of Hearts' castle, casino, theater, government complex, breeding house, and financial institution at the center of Wonderland.",
  },
  {
    term: "The Table",
    definition:
      "The institution through which the four crowns negotiate borders, water, tunnels, salvage, trade, marriages, and portal law.",
  },
  {
    term: "The Deal",
    definition:
      "The working agreement that holds the four courts together despite their incompatible interests.",
  },
  {
    term: "A Shuffle",
    definition:
      "A major change in Wonderland's balance of power. The term is used sparingly because everyone understands its consequences.",
  },
  {
    term: "The Unsuited",
    definition:
      "Individual beings whose identities predate, exceed, or refuse the suit system. They embody Wonderland principles rather than territories.",
  },
  {
    term: "Rabbit-hole network",
    definition:
      "A living transit system of burrows, mirrors, doors, tunnels, wormholes, and apertures that can move time as well as matter.",
  },
  {
    term: "Wasteland",
    definition:
      "The dry geometric world beyond Wonderland's boundary mountains. None of the courts fully control it.",
  },
];

export const currentWorldCrisis = {
  title: "The outer cold is moving inward",
  summary:
    "Club scouts find machines embedded in new ice from decades beyond the accepted surface year. Spade burrows open into frozen chambers, Diamond waterways lose pressure, and Heart clocks disagree about how long the changes have been happening.",
  questions: [
    "Is Wonderland freezing or aging?",
    "Is the realm being invaded by its own future?",
    "Are the courts approaching another Shuffle?",
    "Why can Alice reach routes their officials cannot?",
  ],
};
