// Story series definitions for the HobFarm Presents fiction imprint. Each
// serial gets an entry here; individual installments (src/content/adventures)
// reference a series by slug. This is the source of truth for series titles,
// premises, world lore, and which characters star, so the imprint hub, the
// series page, and character pages all read from one place. Adventure
// membership, latest/previous covers, and counts are derived from the
// adventures collection at build time, not stored here.

import {
  otherAliceCanon,
  otherAliceResidents,
} from "@/data/other-alice-world-guide";

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
    tagline: otherAliceCanon.formatLine,
    heroDeck: otherAliceCanon.premise,
    logline:
      "Alice entered Wonderland at eight and stayed. Ten Wonderland years and two outside centuries later, she follows evidence that the official map ends before the world does, with Chester beside her and several Houses invested in keeping the map intact.",
    heroIntro: [
      "Other Alice Adventures begins after adaptation. Alice is eighteen, with a home, tools, relationships, secrets, and a reputation earned across ten Wonderland years.",
      "Wonderland is a wet, inhabited circular realm whose official Heart map hides a patchwork of markets, water systems, work colonies, roads, courts, and unstable routes.",
      "The early serial builds that world through stories, field records, maps, characters, creatures, and institutional evidence before the full exterior record is opened.",
    ],
    explainer: {
      heading: "What is Other Alice?",
      lead: "Other Alice Adventures is an original illustrated serial drawn from Lewis Carroll's public-domain Wonderland. It follows an Alice who grew up inside Wonderland.",
      paragraphs: [
        "Alice entered Wonderland at eight and has lived there for ten Wonderland years. Outside, 200 years passed and the world advanced to roughly the 2070s. At eighteen, she is curious, analytical, practical, impatient with false explanations, and willing to test a world's rules when official answers stop matching visible evidence.",
        "Wonderland changed while she grew up. It absorbed machines, media, commerce, fashion, vice, and other fragments from worlds connected by unstable holes. The result is a wet techno-surreal civilization built from living systems, card-suit castes, casino power, fungal infrastructure, and future systems translated through dream logic.",
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
        "Workers, sovereigns, outliers, and inherited Wonderland figures reveal who keeps the realm alive, who profits from it, and who can cross its boundaries.",
      entries: otherAliceResidents,
    },
    description: [
      "Alice stayed in Wonderland and it became home. Now eighteen, she follows evidence through its courts, work sites, living infrastructure, and disputed boundary routes with Chester beside her.",
      "Each numbered Adventure stands on its own while opening another piece of the larger world. A story may arrive with a painted cover, interior illustrations, an atmospheric loop, a moving scene, a field note, or an artifact recovered along the route.",
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
              "Hearts own the official map. Diamonds control circulation, Spades maintain continuity, and Clubs control reach across the outer territories.",
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
        heading: "The Houses and the suit system",
        paragraphs: [
          otherAliceCanon.politicalRule,
          "A House is a political, economic, ecological, occupational, and sometimes bodily system. Named suit citizens carry the suit as a surname, such as Ciryl Spade. Hedgehogs are always Spades and bears are always Clubs, while other species can cross House roles according to work and adaptation.",
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
          "No. The story begins ten Wonderland years after Alice arrived. Her childhood visit is history; the series follows the person she became after Wonderland became home.",
      },
      {
        question: "Is Other Alice evil?",
        answer:
          "No. She can be reckless, difficult, and fascinated by things that should frighten her, but she is not a villain. Her defining trait is curiosity.",
      },
      {
        question: "How old is Alice?",
        answer:
          "Alice is eighteen. She entered Wonderland at eight and has lived there for ten Wonderland years. Exactly 200 years passed along her original outside route, placing it roughly in the 2070s.",
      },
      {
        question: "Is Chester the Cheshire Cat?",
        answer:
          "Yes. Chester is an older, very fat British Blue Cheshire cat with a normal grey-blue coat, amber eyes, heavy paws, and a flat expression. He guides through refusal, impossible placement, and rare demonstrations instead of constant grinning.",
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
    characters: ["alice", "chester", "the-hatter"],
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
