// Story series definitions for the HobFarm Presents fiction imprint. Each
// serial gets an entry here; individual installments (src/content/adventures)
// reference a series by slug. This is the source of truth for series titles,
// premises, world lore, and which characters star, so the imprint hub, the
// series page, and character pages all read from one place. Adventure
// membership, latest/previous covers, and counts are derived from the
// adventures collection at build time, not stored here.

export type WorldConcept = {
  id: string;
  title: string;
  realm: string;
  image: string;
  imageAlt: string;
  description: string;
  width: number;
  height: number;
};

export type SeriesResident = {
  id: string;
  name: string;
  role: string;
  category: "character" | "faction";
  image: string;
  imageAlt: string;
  summary: string[];
  href?: string;
};

export type StorySeries = {
  slug: string;
  title: string;
  status: "active" | "planned" | "complete";
  seoTitle?: string;
  metaDescription?: string;
  eyebrow?: string;
  /** Short hook line shown on hero cards. */
  tagline: string;
  /** Reader-facing hero deck; falls back to `tagline`. */
  heroDeck?: string;
  /** One-sentence premise. */
  logline: string;
  /** Supporting paragraphs shown directly below the hero. */
  heroIntro?: string[];
  /** Plain-language explanation for readers, search, and retrieval agents. */
  explainer?: {
    heading: string;
    lead: string;
    paragraphs: string[];
  };
  /** Direct answer to a common misconception about the series. */
  differentiation?: {
    heading: string;
    paragraphs: string[];
  };
  /** Compact character/series operating principles. */
  profile?: {
    title: string;
    text: string;
  }[];
  worldAtlas?: {
    heading: string;
    intro: string[];
    concepts: WorldConcept[];
  };
  residents?: {
    heading: string;
    intro?: string;
    entries: SeriesResident[];
  };
  /** Longer intro paragraphs for the series page. */
  description: string[];
  /** CDN cover image for the series. */
  cover: string;
  coverAlt?: string;
  heroMedia?: {
    type: "image" | "video";
    file: string;
    alt: string;
    poster?: string;
  };
  characterMedia?: {
    type: "video";
    file: string;
    alt: string;
    poster?: string;
  };
  /** data-palette attribute hook for CSS, e.g. "wonderland". */
  paletteHook?: string;
  /** Recurring world/zone blocks (e.g. Wonderland, the Wasteland, the holes between). */
  worldStrip?: {
    title: string;
    paragraphs: string[];
    details?: {
      label: string;
      value: string;
    }[];
    image?: string;
    imageAlt?: string;
  }[];
  loreSections?: {
    heading: string;
    paragraphs?: string[];
    items?: {
      title: string;
      text: string;
    }[];
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
  endLine?: string[];
  /** Character slugs (into src/data/characters.ts) that star in this series. */
  characters?: string[];
  contributors?: {
    name: string;
    role: string;
  }[];
  /** Companion reading: articles, gallery, or workshop notes related to the series. */
  relatedContent?: {
    label: string;
    href: string;
  }[];
  displayOrder?: number;
};

export const storySeries: StorySeries[] = [
  {
    slug: "other-alice-adventures",
    title: "Other Alice Adventures",
    status: "active",
    seoTitle: "Other Alice Adventures: The Alice Who Stayed in Wonderland",
    metaDescription:
      "An original illustrated serial built from public-domain Alice mythology, following eighteen-year-old Alice through living Wonderland, the Wasteland, and new characters and factions.",
    eyebrow: "An illustrated Alice in Wonderland serial",
    tagline: "The girl who stayed down.",
    heroDeck:
      "Alice stayed in Wonderland. Ten Wonderland years later, she finds the first hole leading out.",
    logline:
      "Alice entered Wonderland at about eight and stayed. Ten Wonderland years later, she follows the holes leading beyond its living labyrinth with Chester, the older Cheshire Cat.",
    heroIntro: [
      "Other Alice Adventures begins long after the fall. Alice is eighteen now and has lived below for ten Wonderland years, long enough for Wonderland to alter her body, her habits, and her idea of home.",
      "She moves through a branching network of burrows, mirrors, doors, tunnels, and wormholes connecting wet organic Wonderland to the dry geometric Wasteland.",
      "The series starts with familiar public-domain mythology, then follows it into new territory: original characters, working communities, casino empires, living infrastructure, remote clans, failed districts, and paths that were never meant to be opened.",
    ],
    explainer: {
      heading: "What is Other Alice?",
      lead: "Other Alice Adventures is an original illustrated serial drawn from Lewis Carroll's public-domain Wonderland. It follows the Alice who stayed down.",
      paragraphs: [
        "Alice entered Wonderland at about eight and has lived there for ten Wonderland years. At eighteen, she is neither innocent nor evil. She is curious, analytical, practical, impatient with false explanations, and willing to test a world's rules when the official answers stop making sense.",
        "Wonderland changed while she grew up. It absorbed machines, media, commerce, fashion, vice, and other fragments from worlds connected by unstable holes. The result is a wet techno-surreal civilization built from living systems, card-suit castes, casino power, fungal infrastructure, and old nonsense that has learned modern habits.",
        "With Chester beside her, Alice begins following openings that lead beyond the known world. The first evidence points toward boundary mountains where Wonderland has an edge and something dry, hard, and geometric lies beyond it.",
      ],
    },
    differentiation: {
      heading: "Is Other Alice evil?",
      paragraphs: [
        "No. She is not a villain, horror inversion, or generic evil Alice.",
        "Other Alice is a boundary-testing problem solver. She notices systems, learns their rules, and keeps asking questions after authority tells her to stop. Her curiosity can make her reckless, and her certainty can make her emotionally expensive. Chester usually notices the human consequence first.",
      ],
    },
    profile: [
      {
        title: "What she wants",
        text: "Alice wants to understand how far the rabbit-hole network extends and why Wonderland denies the places beyond it. Curiosity is her central appetite.",
      },
      {
        title: "What she is good at",
        text: "She reads living systems, forages, navigates unstable terrain, uses size-changing mushroom fragments, recognizes bad explanations, improvises tools, and tests local rules without assuming they are universal.",
      },
      {
        title: "What gets her into trouble",
        text: "She follows evidence farther than caution recommends. Once a mystery proves real, leaving it alone becomes almost impossible.",
      },
      {
        title: "How she solves problems",
        text: "Observe. Test. Compare. Bargain if useful. Break the rule only after learning what it protects.",
      },
    ],
    worldAtlas: {
      heading: "The World Below",
      intro: [
        "Wonderland is a vast living realm surrounded by Wasteland. At its center stands the Queen of Hearts' labyrinth city. Beyond it, the city dissolves into jungle, forest, cold outer country, and a ring of mountains that separates the wet interior from the desert beyond.",
        "This Wonderland reached the future through roots, mirrors, fungi, insects, ritual chemistry, living architecture, and rabbit-hole transit. Wasteland developed in the opposite direction: dry geometry, mineral structures, hard horizons, abandoned roads, and machines that seem to have been waiting for someone to return.",
      ],
      concepts: [
        {
          id: "aerial-overview",
          title: "Wonderland and Wasteland",
          realm: "World overview",
          image:
            "https://cdn.hob.farm/pages/other-alice-adventures/oaa-wonderland-wasteland-aerial.png",
          imageAlt:
            "Aerial concept view of circular Wonderland, its central city and ecological rings, surrounded by boundary mountains and an immense desert Wasteland.",
          description:
            "Wonderland forms a massive circle of water, vegetation, settlement, and strange biological machinery inside an apparently endless desert. The Queen's city occupies the center. The landscape grows colder and less hospitable toward the outer mountain ring, then breaks into Wasteland beyond it.",
          width: 1254,
          height: 1254,
        },
        {
          id: "heart-city",
          title: "The Heart City",
          realm: "Central Wonderland",
          image:
            "https://cdn.hob.farm/pages/other-alice-adventures/oaa-concept-landscape-city-center.png",
          imageAlt:
            "The central Heart city of Wonderland with a towering crimson palace, circular districts, canals, gardens, and organic futuristic architecture.",
          description:
            "The Queen of Hearts rules from a labyrinth metropolis built around her castle, casino, court, and cabaret. Canals, gardens, ceremonial roads, living towers, and crowded districts spread outward in rings. The architecture is part palace, part hive, and part biological machine.",
          width: 1086,
          height: 1448,
        },
        {
          id: "inner-jungle",
          title: "The Inner Jungle",
          realm: "Wonderland",
          image:
            "https://cdn.hob.farm/pages/other-alice-adventures/oaa-concept-landscape-jungle.png",
          imageAlt:
            "Dense psychedelic Wonderland jungle filled with waterways, bioluminescent plants, hanging transit pods, glass structures, and organic towers.",
          description:
            "Outside the city, the maze continues beneath a dense tropical canopy. Towers grow through trees. Glass chambers hang over canals. Fungal relays, suspended routes, luminous reservoirs, and living bridges connect settlements hidden inside the vegetation.",
          width: 1086,
          height: 1448,
        },
        {
          id: "root-forest",
          title: "The Root Forest",
          realm: "Wonderland",
          image:
            "https://cdn.hob.farm/pages/other-alice-adventures/oaa-concept-landscape-forest.png",
          imageAlt:
            "Dark wet Wonderland forest with immense roots, glowing fungi, flooded paths, tunnel entrances, and Spade-shaped organic structures.",
          description:
            "Farther from the center, the jungle darkens into an older forest. Roads become roots, buildings disappear into trunks, and the Spade tunnel network runs beneath flooded ground. Burrows here can open into another district, another season, or somewhere outside Wonderland entirely.",
          width: 1086,
          height: 1448,
        },
        {
          id: "outer-boundary",
          title: "The Outer Boundary",
          realm: "Threshold",
          image:
            "https://cdn.hob.farm/pages/other-alice-adventures/oaa-concept-landscape-boundary.png",
          imageAlt:
            "Mountain boundary between lush wet Wonderland and dry geometric Wasteland, divided by cliffs, waterfalls, ruins, and portal doors.",
          description:
            "The outer mountains form a broken wall between the living interior and the dry world beyond. Wonderland's waterfalls, vines, and wet stone survive on the inner slopes. Across the ridge, the same forms sharpen into cliffs, dust, mineral geometry, and abandoned Wasteland routes.",
          width: 1086,
          height: 1448,
        },
        {
          id: "club-tundra",
          title: "The Club Tundra",
          realm: "Outer Wonderland",
          image:
            "https://cdn.hob.farm/pages/other-alice-adventures/oaa-concept-landscape-tundra.png",
          imageAlt:
            "Frozen Club territory with an ice citadel, glacial rivers, timber docks, mountain fortifications, and aurora-lit tundra.",
          description:
            "The cold outer country belongs largely to the Clubs. Ice fortresses, migration roads, enormous docks, timber structures, and settlements scaled for bears spread across frozen rivers and glacial plains. The Polar Bear King rules from this region, though much of the territory remains wild.",
          width: 1086,
          height: 1448,
        },
        {
          id: "wasteland",
          title: "Wasteland",
          realm: "Beyond Wonderland",
          image:
            "https://cdn.hob.farm/pages/other-alice-adventures/oaa-concept-landscape-wasteland.png",
          imageAlt:
            "Vast geometric Wasteland desert with mirrored obelisks, circular ruins, dry canyons, crystalline structures, and a portal in the sky.",
          description:
            "Beyond the mountains, moisture falls away and the horizon opens. Salt, dust, ruins, mirrored pylons, geometric cities, roadside structures, and impossible machines occupy the desert. Rabbit holes still reach this place, but they behave differently here: as apertures, tunnels, prisms, doors, and fractures in the sky.",
          width: 1086,
          height: 1448,
        },
      ],
    },
    residents: {
      heading: "Residents of the rabbit-hole world",
      intro:
        "Some are inherited from Wonderland's shared mythology. Others belong entirely to this branch of the holes. Together they reveal who maintains the world, who profits from it, and who is allowed to cross its boundaries.",
      entries: [
        {
          id: "other-alice",
          name: "Other Alice",
          role: "The girl who stayed down",
          category: "character",
          image:
            "https://cdn.hob.farm/pages/other-alice-adventures/oaa-alice-portrait-01.png",
          imageAlt:
            "Other Alice in worn purple field clothes carrying softened symbols of all four suits at a mirror between Wonderland and Wasteland.",
          summary: [
            "Other Alice is eighteen and has spent most of her life inside Wonderland. She is a scavenger, tea ritualist, explorer, and boundary-walker. Her purple clothes carry the softened symbols of all four suits, marking an identity shaped by Wonderland but owned by no single faction.",
            "She is not a generic warrior. Curiosity moves her through the world: she observes systems, tests explanations, and follows evidence farther than caution recommends.",
          ],
          href: "/characters/alice/",
        },
        {
          id: "chester",
          name: "Chester",
          role: "Companion and route authority",
          category: "character",
          image:
            "https://cdn.hob.farm/pages/other-alice-adventures/oaa-chester-portrait-.png",
          imageAlt:
            "Chester, an enormous gray British Blue cat with amber eyes and heavy paws, seated among wet fungal growth and card relics.",
          summary: [
            "Chester is an enormous British Blue cat with amber eyes, heavy paws, and very little interest in explaining himself.",
            "He acts as companion, witness, judge, and occasional route authority. Chester rarely gives Alice a complete answer. When he refuses to cross a threshold, she pays attention.",
          ],
          href: "/characters/chester/",
        },
        {
          id: "queen-of-hearts",
          name: "The Queen of Hearts",
          role: "Sovereign of the center",
          category: "character",
          image:
            "https://cdn.hob.farm/pages/other-alice-adventures/oaa-queen-of-hearts-portrait-.png",
          imageAlt:
            "The Queen of Hearts seated in red glass and gold regalia before the casino-city she rules.",
          summary: [
            "The Queen rules from the House, a dark red glass and gold casino-castle at the center of Wonderland City.",
            "She is sovereign, host, landholder, institutional power, and keeper of the central order: elegant, theatrical, politically powerful, and morally gray. Alice and the Queen are not simple enemies. The Queen controls the center. Alice moves through the boundaries.",
          ],
        },
        {
          id: "ciryl-spade",
          name: "Ciryl Spade",
          role: "Outer-forest topsoil worker",
          category: "character",
          image:
            "https://cdn.hob.farm/pages/other-alice-adventures/oaa-ciryl-portrait-.png",
          imageAlt:
            "Ciryl Spade, a hedgehog topsoil worker with Spade field gear and a smoking pipe in the mycelium forest.",
          summary: [
            "Ciryl Spade is a hedgehog topsoil worker assigned to a living mycelium colony in the outer forest. Important suit-bearing characters use the suit as a surname.",
            "He is practical, mildly stoned, and accidentally important. A wrong maintenance tunnel sends him through a portal to the boundary mountains during rare building weather, exposing a route Alice was never supposed to find.",
          ],
        },
        {
          id: "club-bears",
          name: "The Club bears",
          role: "Recurring faction",
          category: "faction",
          image:
            "https://cdn.hob.farm/pages/other-alice-adventures/oaa-club-bears-portrait-.png",
          imageAlt:
            "A group of giant Club bears feeding in a tiny Spade mycelium work site while hedgehog workers scatter below them.",
          summary: [
            "These remote Club bears are giant mutant humanoids tuned for strength, durability, appetite, and seasonal fat storage.",
            "They enter Ciryl's work site because they smell mushrooms, larvae, fermentation sacs, and stored lunches. They are not invading the colony. They are hungry, distracted, and so large that ordinary feeding becomes a natural disaster for the tiny Spade workers beneath them.",
          ],
        },
      ],
    },
    description: [
      "Alice stayed in Wonderland long past when she should have left, and it changed her before it let her go. Now eighteen, she crosses the boundary with Chester and follows the holes that lead farther out, into the Wasteland and whatever sits between the two.",
      "Each numbered Adventure stands on its own while opening another piece of the larger world. A story may arrive with a painted cover, interior illustrations, an atmospheric loop, a moving scene, a field note, or an artifact recovered during the journey.",
    ],
    cover:
      "https://cdn.hob.farm/pages/other-alice-adventures/other-alice-adventures-series-cover.png",
    coverAlt:
      "Other Alice Adventures series cover: Alice at the boundary between Wonderland and the Wasteland.",
    heroMedia: {
      type: "image",
      file: "https://cdn.hob.farm/pages/other-alice-adventures/other-alice-adventures-hero.png?v=20260709",
      alt: "Alice stands inside a portal between the saturated growth of Wonderland and the geometric ruins of the Wasteland.",
    },
    characterMedia: {
      type: "video",
      file: "https://cdn.hob.farm/pages/other-alice-adventures/other-alice-adventures-character-vid.mp4",
      alt: "Alice and Chester moving through the world of Other Alice Adventures.",
      poster:
        "https://cdn.hob.farm/pages/other-alice-adventures/other-alice-wonderland-hero.png",
    },
    paletteHook: "wonderland",
    worldStrip: [
      {
        title: "Wonderland",
        paragraphs: [
          "A vast wet living labyrinth centered on the Queen of Hearts' casino-castle. The labyrinth is the city, and the city is so large that most residents never consider what might exist beyond it.",
        ],
        details: [
          {
            label: "What is possible",
            value:
              "Living infrastructure, biological machines, altered size, talking animals, fungal communication, and portals disguised as ordinary openings.",
          },
          {
            label: "What it costs",
            value:
              "Every useful system feeds something. Hospitality creates debt, routes require favors, and biological tools can remember or refuse their users.",
          },
          {
            label: "Who controls it",
            value:
              "The Queen rules the center through the Hearts. Diamonds organize money and entertainment, Clubs organize force, and Spades maintain the living environment.",
          },
          {
            label: "What remains unexplained",
            value:
              "How large Wonderland is, why official maps avoid the boundary, and what the Queen knows about the worlds outside.",
          },
        ],
        image:
          "https://cdn.hob.farm/pages/other-alice-adventures/other-alice-wonderland-hero.png",
        imageAlt:
          "Other Alice's overgrown Wonderland in wet purple, green, and cyan light.",
      },
      {
        title: "The Wasteland",
        paragraphs: [
          "A dry geometric realm of desert, salt, rust, stars, hard shadows, abandoned structures, mineral ecologies, and impossible alignments.",
        ],
        details: [
          {
            label: "What is possible",
            value:
              "Life expressed through crystal growth, pressure, electricity, heat, resonance, reflection, dust, and repeating geometry. A storm may build a mountain.",
          },
          {
            label: "What it costs",
            value:
              "Wonderland knowledge does not transfer cleanly. Distance lies, familiar tools change, and water can become currency, bait, or contamination.",
          },
          {
            label: "Who controls it",
            value:
              "Unknown. Alice cannot yet tell the difference between government, ecology, machinery, and ritual.",
          },
          {
            label: "What remains unexplained",
            value:
              "Whether the Wasteland is one world, many worlds, or the exposed structure between them.",
          },
        ],
        image:
          "https://cdn.hob.farm/pages/other-alice-adventures/other-alice-wasteland-hero.png",
        imageAlt:
          "The Wasteland under cobalt and turquoise skies with rust-and-gold desert geometry.",
      },
      {
        title: "The holes between",
        paragraphs: [
          "Unstable openings connect places by rules that are not always geographic. Some are burrows, doors, service routes, or cracks that object to being called wrong.",
        ],
        details: [
          {
            label: "What is possible",
            value:
              "A small maintenance tunnel can open onto a mountain. Routes may follow meaning, debt, memory, or appetite instead of distance.",
          },
          {
            label: "What it costs",
            value:
              "A route may move, transform its traveler, or bring part of another environment back with them.",
          },
          {
            label: "Who controls it",
            value:
              "Nobody reliably. Spades maintain some routes, Diamonds sell access, and older systems appear to make their own decisions.",
          },
          {
            label: "What remains unexplained",
            value:
              "Who made the oldest openings, why the network keeps expanding, and whether any hole leads where intention points it.",
          },
        ],
        image:
          "https://cdn.hob.farm/pages/other-alice-adventures/other-alice-adventures-series-cover.png",
        imageAlt:
          "Alice and Chester stand in a portal between overgrown Wonderland and the geometric Wasteland.",
      },
    ],
    loreSections: [
      {
        heading: "The card suits",
        paragraphs: [
          "Wonderland's four suits are social names and functional castes. Named suit characters carry the suit as a surname, such as Ciryl Spade.",
          "A suit is a social and functional identity, not a single species. Some animals can belong to different suits depending on their role and adaptation. Others are suit-bound. Hedgehogs are always Spades. Bears are always Clubs. Members of a suit do not all look alike or share one morality.",
        ],
        items: [
          {
            title: "Hearts",
            text: "Central law, money, spectacle, information, diplomacy, engineered court bodies, clone houses, and the procedural power of the Queen's House.",
          },
          {
            title: "Diamonds",
            text: "Jungle waterways, medicine, biological cultivation, luxury trade, hydraulic infrastructure, and the living mountain palace of the tiger crowns.",
          },
          {
            title: "Clubs",
            text: "Frontier defense, salvage, fuel, construction, heavy machinery, transport, mountain citadels, and technology recovered from the outer ice.",
          },
          {
            title: "Spades",
            text: "Food, tunnels, cultivation, maps, archives, clocks, transit, ecological repair, and the older rabbit-hole routes beneath every other court.",
          },
        ],
      },
      {
        heading: "A new branch of an old story",
        paragraphs: [
          "Other Alice Adventures uses the public-domain Alice stories as shared mythology, then builds outward.",
          "Familiar figures such as Alice, the Queen of Hearts, rabbits, cardfolk, the Hatter, and the Caterpillar can appear in altered forms. Around them is a larger original world: Ciryl and the hedgehog Spades, giant bear Clubs, Wonderland's suit economy, the Queen's casino-city, the Wasteland, crystal storms, living portal networks, and communities that maintain the impossible machinery beneath the story.",
          "Each installment may take the form of a short story, field note, character record, relic entry, mirror vision, image sequence, or video fragment.",
        ],
      },
      {
        heading: "How releases work",
        paragraphs: [
          "Other Alice Adventures is a mixed-media web serial. Releases may include short fiction, illustrations, animated loops, character files, maps, field notes, court records, relic entries, and fragments from the rabbit-hole network.",
          "Each Adventure stands on its own while adding another route, debt, discovery, or contradiction to the larger world.",
        ],
      },
    ],
    faq: [
      {
        question: "What is Other Alice Adventures?",
        answer:
          "It is an original illustrated fantasy and science-fiction serial built from the public-domain characters and ideas in Lewis Carroll's Alice books. It follows an adult Alice who grew up inside Wonderland and begins exploring the worlds connected to it.",
      },
      {
        question: "Is this a retelling of Alice's original trip?",
        answer:
          "No. The story begins ten Wonderland years after Alice first arrived. Her childhood visit is history; the series follows the person she became after Wonderland stopped being new.",
      },
      {
        question: "Is Other Alice evil?",
        answer:
          "No. She can be reckless, difficult, and fascinated by things that should frighten her, but she is not a villain. Her defining trait is curiosity.",
      },
      {
        question: "How old is Alice?",
        answer:
          "Alice is eighteen. She entered Wonderland at about eight and has lived there for ten Wonderland years, while roughly two hundred years passed along her original rabbit-hole route. The outside world is now around the 2060s.",
      },
      {
        question: "Is Chester the Cheshire Cat?",
        answer:
          "Yes. Chester is the older, fatter, lazier Cheshire Cat. He has mostly dropped the performance, but he still disappears, gives cryptic advice, provokes authority, and smiles when everyone else should be concerned.",
      },
      {
        question: "What kind of story is it?",
        answer:
          "Adult surreal fantasy with science-fiction ecology, pulp adventure, dark comedy, psychedelic worldbuilding, and mixed-media presentation. It is written for adults and older readers, not as a children's adaptation.",
      },
      {
        question: "Who creates Other Alice Adventures?",
        answer:
          "Other Alice Adventures is written, illustrated, and published by HobFarm as the first recurring serial from HobFarm Presents.",
      },
    ],
    endLine: [
      "Wonderland insists there is nothing beyond Wonderland.",
      "Alice has found a hole in that explanation.",
    ],
    characters: ["alice", "chester"],
    contributors: [{ name: "d00d", role: "Creator / Writer" }],
    relatedContent: [
      {
        label:
          "Why build a digital pulp serial? Read “How the Money Eats the Medium.”",
        href: "/articles/how-the-money-eats-the-medium/",
      },
    ],
    displayOrder: 1,
  },
];

const seriesBySlug = new Map(storySeries.map((s) => [s.slug, s]));

export function getStorySeries(
  slug: string | undefined | null,
): StorySeries | undefined {
  return slug ? seriesBySlug.get(slug) : undefined;
}

export function storySeriesPath(slug: string): string {
  return `/departments/hobfarm-presents/${slug}/`;
}

export function getStorySeriesTitle(slug: string | undefined | null): string {
  return getStorySeries(slug)?.title ?? slug ?? "HobFarm Presents";
}
