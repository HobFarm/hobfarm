export const OTHER_ALICE_ROOT_PATH =
  "/departments/hobfarm-presents/other-alice-adventures/";
export const OTHER_ALICE_WORLD_GUIDE_PATH = `${OTHER_ALICE_ROOT_PATH}world-guide/`;
export const OTHER_ALICE_HOUSES_PATH = `${OTHER_ALICE_ROOT_PATH}houses/`;
export const OTHER_ALICE_WEB_PATH = `${OTHER_ALICE_ROOT_PATH}web-of-wonderland/`;

/**
 * New World Guide media should be uploaded beneath this R2/CDN prefix.
 * Records may remain text-only until approved media exists. Never substitute
 * a generated placeholder for a canonical character, place, or specimen.
 */
export const OTHER_ALICE_WORLD_GUIDE_MEDIA_ROOT =
  "https://cdn.hob.farm/pages/other-alice-adventures/world-guide";

export const otherAliceCanon = {
  age: 18,
  arrivalAge: 8,
  wonderlandYears: 10,
  outsideElapsed: "200 years",
  outsideEra: "roughly the 2070s",
  formatLine:
    "A graphic novel that escaped the book and began using the whole website.",
  premise:
    "Alice arrived in Wonderland at eight. Ten Wonderland years later, she is eighteen, the outside world has advanced by 200 years, and its future keeps bleeding into Wonderland's dream logic.",
  chester:
    "An older, very fat British Blue domestic cat with a plain grey-blue coat, amber eyes, heavy paws, and a flat, mildly judgmental expression.",
  politicalRule:
    "Hearts possess de jure sovereignty. The other Houses possess de facto regional power.",
  politicalLine:
    "The Hearts own the map. The other Houses own the places on it.",
};

export const otherAliceProjectNav = [
  { label: "Start here", href: OTHER_ALICE_ROOT_PATH },
  { label: "Adventures", href: `${OTHER_ALICE_ROOT_PATH}#adventures` },
  { label: "Atlas", href: `${OTHER_ALICE_WORLD_GUIDE_PATH}#regions` },
  { label: "Houses", href: OTHER_ALICE_HOUSES_PATH },
  { label: "Cast", href: `${OTHER_ALICE_WORLD_GUIDE_PATH}#residents` },
  { label: "Bestiary", href: `${OTHER_ALICE_WORLD_GUIDE_PATH}#bestiary` },
  { label: "Archive", href: `${OTHER_ALICE_WORLD_GUIDE_PATH}#archive` },
  { label: "Workshop", href: `${OTHER_ALICE_ROOT_PATH}#workshop` },
];

export type CourtDossier = {
  id: "hearts" | "diamonds" | "spades" | "clubs";
  name: string;
  sigil: string;
  ink: string;
  powerForm: string;
  formalStatus: string;
  territory: string;
  corePower: string;
  materialControl: string;
  needs: string;
  canWithhold: string;
  failureTest: string;
  evidenceObject: string;
  ruler: string;
  summary: string[];
  accent: string;
};

export const courtDossiers: CourtDossier[] = [
  {
    id: "hearts",
    name: "Hearts",
    sigil: "Heart",
    ink: "Magenta + yellow / red",
    powerForm: "Recognition",
    formalStatus: "Sovereign House and source of the official map",
    territory: "The Queen's House and Labyrinth City",
    corePower: "Titles, courts, borders, succession, taxation, and legal recognition",
    materialControl: "Deeds, seals, concessions, charters, court access, and central institutions",
    needs: "Commodities, labor, water, food, maintenance, transport, and distant force",
    canWithhold: "Recognition, inheritance, operating rights, court protection, and central access",
    failureTest:
      "The realm keeps moving, but ownership, succession, contracts, and political alliances split into incompatible versions.",
    evidenceObject:
      "A land deed whose legal boundary crosses a road the court has not maintained in decades.",
    ruler: "The Queen of Hearts",
    summary: [
      "Hearts claim the whole circular realm through titles, deeds, courts, tax districts, concessions, charters, and ceremonial recognition.",
      "Their direct control is strongest at the center. Farther out, red court ink survives on paperwork long after regional systems have become the real government.",
    ],
    accent: "#e23a4e",
  },
  {
    id: "diamonds",
    name: "Diamonds",
    sigil: "Diamond",
    ink: "Yellow / gold",
    powerForm: "Circulation",
    formalStatus: "Recognized concession holders under Heart law",
    territory: "The jungle, commercial highlands, markets, and processing centers",
    corePower: "Commodities, finance, cultivation, processing, hospitality, and trade",
    materialControl: "Credit, markets, prices, hotels, theatres, exchanges, and cultivated abundance",
    needs: "Heart recognition, Spade water, Club transport, central buyers, and audiences",
    canWithhold: "Credit, processing, market access, hospitality, spectacle, and price stability",
    failureTest:
      "Crops remain in the ground, wages become promises, city luxuries disappear, and regional surpluses turn into waste.",
    evidenceObject:
      "A Heart concession repriced three times in Diamond yellow, with a Club transport surcharge in cyan.",
    ruler: "Diamond courts, exchanges, and concession houses",
    summary: [
      "Diamonds dominate the jungle and commercial highlands because they decide what reaches a market, how it is processed, and what it is worth.",
      "A Heart may own a mountain on paper. Diamond systems decide whether its tea reaches the city and whether the court receives any value from it.",
    ],
    accent: "#e3c82f",
  },
  {
    id: "spades",
    name: "Spades",
    sigil: "Spade",
    ink: "Cyan + yellow / green",
    powerForm: "Continuity",
    formalStatus: "Taxed regional systems and maintenance obligations",
    territory: "Forests, marshes, farms, reservoirs, roots, and tunnel networks",
    corePower: "Water, soil, fungi, food, repair, waste, and long ecological memory",
    materialControl: "Canals, reservoirs, mycelium, controlled growth, cultivation, and route repair",
    needs: "Tools, manufactured goods, trade access, court agreements, and protected long routes",
    canWithhold: "Water, repair, cultivation, fungal communication, waste processing, and route maintenance",
    failureTest:
      "Canals clog, root networks fail, crops sicken, roads disappear under growth, and settlements lose contact without a battle.",
    evidenceObject:
      "A maintenance map routing a royal order through a canal marked not serviceable since last bloom.",
    ruler: "Regional maintenance councils and the old Rabbit crown",
    summary: [
      "Spades hold the forests through work that becomes invisible when it succeeds. A distant order means little when nobody maintains the water, road, or living network it assumes.",
      "They rarely need to declare independence. Delayed maintenance can make a legal command physically impossible.",
    ],
    accent: "#2fe089",
  },
  {
    id: "clubs",
    name: "Clubs",
    sigil: "Club",
    ink: "Cyan / blue",
    powerForm: "Reach",
    formalStatus: "Frontier charters, military claims, and sworn local command",
    territory: "Outer cold regions, roads, passes, depots, mines, and frontier settlements",
    corePower: "Transport, security, route knowledge, force, and survival capacity",
    materialControl: "Roads, freight, guards, winter stores, escorts, tolls, and outer infrastructure",
    needs: "Supply, payment, trade, inner repair systems, and Heart legitimacy",
    canWithhold: "Transport, protection, border access, route knowledge, and physical connection",
    failureTest:
      "Outer routes close, freight stalls, orders become rumors, and frontier towns govern themselves by necessity.",
    evidenceObject:
      "A Heart frontier charter covered in Club toll marks for a route that exists only three months each year.",
    ruler: "The Polar Bear King and regional commanders",
    summary: [
      "Clubs control the outer territories because they can cross them. They turn distant orders into physical events through transport, force, endurance, and route knowledge.",
      "A Club commander may swear loyalty to the Queen while governing like a local ruler because the center cannot reach the settlement without Club help.",
    ],
    accent: "#43aee8",
  },
];

export type RegionPowerRecord = {
  id: string;
  region: string;
  heartClaim: string;
  actualPower: string;
  powerBasis: string[];
  dependencies: string[];
  leverage: string[];
  activeDispute: string;
  insideSystem: string;
};

export const regionPowerRecords: RegionPowerRecord[] = [
  {
    id: "central-city-power",
    region: "Queen's House and Labyrinth City",
    heartClaim: "Direct sovereignty",
    actualPower: "Hearts",
    powerBasis: ["courts", "taxation", "central institutions", "ceremonial recognition"],
    dependencies: ["regional food and materials", "Spade maintenance", "Diamond circulation", "Club security"],
    leverage: ["withhold court access", "freeze succession", "deny operating rights"],
    activeDispute: "A Heart succession claim covers land no claimant can safely visit.",
    insideSystem: "The center still depends on food, labor, materials, and protection arriving from elsewhere.",
  },
  {
    id: "jungle-power",
    region: "Inner jungle and commercial highlands",
    heartClaim: "Land ownership, courts, and concessions",
    actualPower: "Diamonds",
    powerBasis: ["commodities", "finance", "processing", "hospitality", "trade"],
    dependencies: ["Heart recognition", "city buyers", "Spade water", "Club transport"],
    leverage: ["restrict credit", "delay processing", "close market access"],
    activeDispute: "A Diamond concession has become wealthier than its Heart landlord.",
    insideSystem: "Recognized property, shared water, guarded freight, and central buyers keep the region connected.",
  },
  {
    id: "forest-power",
    region: "Forest belt",
    heartClaim: "Nominal ownership and taxation",
    actualPower: "Spades",
    powerBasis: ["ecology", "water", "labor", "food", "infrastructure"],
    dependencies: ["manufactured tools", "trade access", "court agreements", "Club route protection"],
    leverage: ["suspend canal service", "delay repair", "withhold fungal distribution"],
    activeDispute: "A Spade water district refuses a new levy until a broken reservoir is repaired.",
    insideSystem: "Tools, agreements, trade, and protected long routes still come from beyond the forest.",
  },
  {
    id: "outer-power",
    region: "Outer cold regions",
    heartClaim: "Old titles, military claims, and frontier charters",
    actualPower: "Clubs",
    powerBasis: ["force", "roads", "transport", "security", "survival"],
    dependencies: ["supply", "payment", "trade", "court legitimacy", "inner repair networks"],
    leverage: ["close a pass", "stop freight", "withdraw escorts"],
    activeDispute: "A Club commander renews loyalty while adding private tolls to a royal road.",
    insideSystem: "Supplies, pay, trade, repair, and recognition still move outward from the inner realm.",
  },
  {
    id: "boundary-power",
    region: "Boundary and beyond",
    heartClaim: "Mythic or untested claim",
    actualPower: "Whoever can survive there and keep a route open",
    powerBasis: ["evidence", "temporary routes", "local survival"],
    dependencies: ["routes change", "recognition follows evidence after the fact"],
    leverage: ["close the only known route", "withhold proof of settlement"],
    activeDispute: "A boundary settlement requests recognition from a court that doubts it exists.",
    insideSystem: "Its place in Wonderland remains an open political question.",
  },
];

export const politicalMapViews = [
  {
    id: "court",
    label: "Court map",
    title: "Map recognized by the Court of Hearts",
    description:
      "The official image of one realm, one sovereign, and uninterrupted red authority from the Queen's House to the mountains.",
    shows: ["titles and deeds", "tax districts", "concessions", "frontier charters", "official borders"],
  },
  {
    id: "lived",
    label: "Lived map",
    title: "Map used by people who keep the realm running",
    description:
      "Commodity paths, water systems, maintenance corridors, roads, depots, courts, and settlements reveal who governs daily reality.",
    shows: ["Diamond circulation", "Spade continuity", "Club reach", "Heart recognition", "overlapping control"],
  },
  {
    id: "dependency",
    label: "Dependency map",
    title: "Nothing works alone",
    description:
      "Goods, water, labor, repair, transport, contracts, taxes, tolls, and recognition cross every supposed House border.",
    shows: ["food and water", "credit and markets", "roads and freight", "maintenance", "tax and recognition"],
  },
];

export const failureCascades = courtDossiers.map((house) => ({
  id: house.id,
  label: `${house.name} stop ${house.id === "hearts" ? "recognizing" : house.id === "diamonds" ? "circulating" : house.id === "spades" ? "maintaining" : "carrying"}`,
  result: house.failureTest,
  accent: house.accent,
}));

export const otherAliceResidents = [
  {
    id: "other-alice",
    name: "Other Alice",
    role: "Boundary-tester and field observer",
    category: "character" as const,
    image: "/media/other-alice/other-alice-character-sheet.webp",
    imageAlt:
      "Character sheet for eighteen-year-old Other Alice in her purple-and-black field dress, shown from several angles with signature details.",
    summary: [
      otherAliceCanon.premise,
      "She is a boundary-tester, scavenger, tea ritualist, and practical natural philosopher. Curiosity moves her through systems that authority would rather leave unexplained.",
    ],
    href: "/characters/alice/",
  },
  {
    id: "chester",
    name: "Chester",
    role: "Companion and route authority",
    category: "character" as const,
    image: "/media/other-alice/chester-character-portrait.webp",
    imageAlt:
      "Chester, a very fat older British Blue cat with a grey-blue coat, amber eyes, heavy paws, and a normal flat cat expression.",
    summary: [
      `${otherAliceCanon.chester} He is Alice's companion, not her pet.`,
      "He exposes rules through appearance, refusal, and impossible placement. When Chester refuses a route, Alice treats the refusal as evidence.",
    ],
    href: "/characters/chester/",
  },
  {
    id: "the-hatter",
    name: "The Hatter",
    role: "Diamond tea magnate and damaged syndicate operator",
    category: "character" as const,
    image: "/media/other-alice/mad-hatter-diamond-highlands-concept.webp",
    imageAlt:
      "Working concept portrait of the Hatter in a dark 1930s suit and structured hat, holding tea above the misty Diamond Highlands.",
    summary: [
      "The Hatter is a Diamond tea magnate, commodity broker, chemist, hotel owner, and underworld negotiator shaped by the cultivation economy of the Diamond Highlands.",
      "A punitive substance fractured his relationship to time, memory, etiquette, and social space. Wonderland made the damage physically interactive, creating a Mad Tea Party zone that other people can enter.",
    ],
    href: "/characters/the-hatter/",
  },
  {
    id: "queen-of-hearts",
    name: "The Queen of Hearts",
    role: "Sovereign of the official realm",
    category: "character" as const,
    image: "https://cdn.hob.farm/pages/other-alice-adventures/oaa-queen-of-hearts-portrait-.png",
    imageAlt:
      "The Queen of Hearts seated in red glass and gold regalia before the casino-city and institutions she rules.",
    summary: [
      "The Queen is sovereign, casino owner, court, brand, and institution. Her power lives in staff, debt, architecture, service systems, ritual, and legal recognition.",
      "Her skill is keeping the Houses dependent enough that none can leave cleanly. Her danger is confusing a system everyone uses with a system she controls alone.",
    ],
  },
  {
    id: "ciryl-spade",
    name: "Ciryl Spade",
    role: "Mycelium maintenance worker",
    category: "character" as const,
    image: "https://cdn.hob.farm/pages/other-alice-adventures/oaa-ciryl-portrait-.png",
    imageAlt:
      "Ciryl Spade, a hedgehog maintenance worker with Spade field gear and a smoking pipe in the mycelium forest.",
    summary: [
      "Ciryl is a hedgehog Spade who slips away from a maintenance shift and returns carrying frost that should not exist anywhere in Wonderland.",
      "He is not a chosen hero. He notices the boundary because he avoids work at exactly the wrong moment.",
    ],
  },
  {
    id: "club-bears",
    name: "The giant Club bears",
    role: "Appetite-driven outer faction",
    category: "faction" as const,
    image: "https://cdn.hob.farm/pages/other-alice-adventures/oaa-club-bears-portrait-.png",
    imageAlt:
      "Giant Club bears feeding in a small Spade mycelium work site while hedgehog workers scatter below them.",
    summary: [
      "The giant Clubs follow the smell of mushrooms, larvae, fermentation sacs, and stored lunches into Ciryl's work site.",
      "They are hungry, not invading. Their scale turns ordinary feeding into a natural disaster for the Spades beneath them.",
    ],
  },
];

export function getOtherAliceResident(id: string) {
  return otherAliceResidents.find((entry) => entry.id === id);
}

export type BestiaryRecord = {
  id: string;
  name: string;
  kind: string;
  suitRelationship: string;
  habitat: string;
  function: string;
  behavior: string;
  threat: string;
  evidence: string;
  question: string;
  image?: string;
  imageAlt?: string;
};

export const bestiaryRecords: BestiaryRecord[] = [
  {
    id: "hedgehog-spades",
    name: "Hedgehog Spades",
    kind: "Suit-bound social species",
    suitRelationship: "Hedgehogs are always Spades",
    habitat: "Forest maintenance colonies, reservoirs, farms, and tunnel systems",
    function: "Repair, topsoil work, fungal cultivation, drainage, and route maintenance",
    behavior: "Curl under immediate danger, then resume work as soon as the system needs them",
    threat: "Low threat; high infrastructural importance",
    evidence: "Ciryl's frost-filled quills and the damaged mycelium shift record",
    question: "How much of the old rabbit-hole network do the crews know but omit from court maps?",
    image: "https://cdn.hob.farm/pages/other-alice-adventures/oaa-ciryl-portrait-.png",
    imageAlt: "Ciryl Spade in damp forest maintenance gear beside a living mycelium system.",
  },
  {
    id: "giant-club-bears",
    name: "Giant Club bears",
    kind: "Suit-bound outer social type",
    suitRelationship: "Bears are always Clubs",
    habitat: "Outer roads, cold settlements, salvage fields, forest work sites, and winter stores",
    function: "Heavy transport, force, endurance labor, salvage, and frontier survival",
    behavior: "Follow dense food scents and treat small built systems as forage unless boundaries are made obvious",
    threat: "Severe accidental threat at close range",
    evidence: "A torn mycelium bed, missing lunches, and a supervisor's shelter carried away as packaging",
    question: "Who is responsible when appetite crosses a regional labor boundary?",
    image: "https://cdn.hob.farm/pages/other-alice-adventures/oaa-club-bears-portrait-.png",
    imageAlt: "Giant Club bears feeding inside a much smaller Spade maintenance colony.",
  },
  {
    id: "mycelium-maintenance-colony",
    name: "Mycelium maintenance colony",
    kind: "Living infrastructure",
    suitRelationship: "Maintained by Spades; used by every House downstream",
    habitat: "Wet forest beds, root corridors, reservoirs, and settlement margins",
    function: "Moves water, nutrients, signals, heat, and waste through living networks",
    behavior: "Closes filters under threat, reroutes around damage, and spoils quickly when feeding threads are cut",
    threat: "Low when maintained; systemic when damaged",
    evidence: "Opened cooling beds, ruptured water threads, nutrient bulbs, and repair patches",
    question: "Can the network detect the outer cold before court instruments do?",
  },
];

export type ArchiveRecord = {
  id: string;
  title: string;
  recordClass: string;
  certainty: "confirmed" | "disputed" | "working";
  collector: string;
  condition: string;
  summary: string;
  linkedMystery: string;
  image?: string;
  imageAlt?: string;
};

export const archiveRecords: ArchiveRecord[] = [
  {
    id: "frost-quill-specimen",
    title: "Frost-filled quill specimen",
    recordClass: "Specimen",
    certainty: "working",
    collector: "Alice, from Ciryl Spade",
    condition: "Geometric growth removed before complete melt could be observed",
    summary: "A transparent branch organized moisture across several hedgehog quills and rang when cut.",
    linkedMystery: "Boundary weather appears inside a realm that should not produce it.",
  },
  {
    id: "revised-boundary-map",
    title: "Map revised over the official map",
    recordClass: "Map",
    certainty: "confirmed",
    collector: "Multiple route workers; corrections assembled by Alice",
    condition: "Wet storage, repeated overprint, several unauthorized annotations",
    summary: "The Heart boundary stays fixed while roads, water, work, and local authority keep moving across it.",
    linkedMystery: "The court map may be legally correct and physically useless at the same time.",
    image: "https://cdn.hob.farm/pages/other-alice-adventures/oaa-wonderland-wasteland-aerial.png",
    imageAlt: "Circular Wonderland shown as an aerial atlas plate surrounded by the exterior Wasteland.",
  },
  {
    id: "chester-route-observation",
    title: "Chester route observation",
    recordClass: "Witness note",
    certainty: "disputed",
    collector: "Alice",
    condition: "Recorded after Chester declined to answer a direct question",
    summary: "He sat beside the opening. He did not sleep. He did not enter.",
    linkedMystery: "Whether the route is stable, dangerous, or simply outside Chester's authority.",
  },
];

export type RelationshipNode = {
  id: string;
  label: string;
  group: "hearts" | "diamonds" | "spades" | "clubs" | "unsuited";
  kind: "person" | "house" | "institution" | "species";
  href: string;
  image?: string;
  x: number;
  y: number;
};

export type RelationshipEdge = {
  id: string;
  source: string;
  target: string;
  type: "authority" | "recognition" | "debt" | "labor" | "maintenance" | "water" | "transport" | "route" | "affection" | "rivalry" | "testimony";
  label: string;
  polarity: "supportive" | "hostile" | "mixed" | "neutral";
  status: "confirmed" | "disputed";
  evidenceLabel: string;
  evidenceHref: string;
};

export const relationshipNodes: RelationshipNode[] = [
  { id: "alice", label: "Other Alice", group: "unsuited", kind: "person", href: "/characters/alice/", image: otherAliceResidents[0].image, x: 600, y: 360 },
  { id: "chester", label: "Chester", group: "unsuited", kind: "person", href: "/characters/chester/", image: otherAliceResidents[1].image, x: 600, y: 600 },
  { id: "hatter", label: "The Hatter", group: "diamonds", kind: "person", href: "/characters/the-hatter/", image: otherAliceResidents[2].image, x: 890, y: 270 },
  { id: "queen", label: "Queen of Hearts", group: "hearts", kind: "person", href: `${OTHER_ALICE_WORLD_GUIDE_PATH}#queen-of-hearts`, image: otherAliceResidents[3].image, x: 180, y: 180 },
  { id: "hearts", label: "Heart recognition", group: "hearts", kind: "house", href: `${OTHER_ALICE_HOUSES_PATH}#hearts`, x: 180, y: 380 },
  { id: "diamonds", label: "Diamond circulation", group: "diamonds", kind: "house", href: `${OTHER_ALICE_HOUSES_PATH}#diamonds`, x: 1020, y: 180 },
  { id: "spades", label: "Spade continuity", group: "spades", kind: "house", href: `${OTHER_ALICE_HOUSES_PATH}#spades`, x: 1020, y: 560 },
  { id: "clubs", label: "Club reach", group: "clubs", kind: "house", href: `${OTHER_ALICE_HOUSES_PATH}#clubs`, x: 180, y: 650 },
  { id: "ciryl", label: "Ciryl Spade", group: "spades", kind: "person", href: `${OTHER_ALICE_WORLD_GUIDE_PATH}#ciryl-spade`, image: otherAliceResidents[4].image, x: 860, y: 480 },
];

export const relationshipEdges: RelationshipEdge[] = [
  { id: "queen-hearts", source: "queen", target: "hearts", type: "authority", label: "embodies and directs", polarity: "supportive", status: "confirmed", evidenceLabel: "Heart deed", evidenceHref: `${OTHER_ALICE_WORLD_GUIDE_PATH}#revised-boundary-map` },
  { id: "hearts-diamonds", source: "hearts", target: "diamonds", type: "recognition", label: "recognizes concessions; depends on circulation", polarity: "mixed", status: "confirmed", evidenceLabel: "Political ledger", evidenceHref: `${OTHER_ALICE_HOUSES_PATH}#regional-ledger` },
  { id: "hearts-spades", source: "hearts", target: "spades", type: "maintenance", label: "taxes systems it cannot maintain", polarity: "mixed", status: "confirmed", evidenceLabel: "Forest power record", evidenceHref: `${OTHER_ALICE_HOUSES_PATH}#forest-power` },
  { id: "hearts-clubs", source: "hearts", target: "clubs", type: "authority", label: "charters force it cannot project alone", polarity: "mixed", status: "confirmed", evidenceLabel: "Outer power record", evidenceHref: `${OTHER_ALICE_HOUSES_PATH}#outer-power` },
  { id: "diamonds-spades", source: "diamonds", target: "spades", type: "water", label: "markets depend on water and cultivation", polarity: "supportive", status: "confirmed", evidenceLabel: "Dependency map", evidenceHref: `${OTHER_ALICE_HOUSES_PATH}#dependency-loop` },
  { id: "clubs-diamonds", source: "clubs", target: "diamonds", type: "transport", label: "freight turns crops into city value", polarity: "neutral", status: "confirmed", evidenceLabel: "Dependency map", evidenceHref: `${OTHER_ALICE_HOUSES_PATH}#dependency-loop` },
  { id: "ciryl-spades", source: "ciryl", target: "spades", type: "labor", label: "maintains the living forest system", polarity: "neutral", status: "confirmed", evidenceLabel: "Mycelium shift record", evidenceHref: `${OTHER_ALICE_WORLD_GUIDE_PATH}#mycelium-maintenance-colony` },
  { id: "alice-chester", source: "alice", target: "chester", type: "affection", label: "companionship and route trust", polarity: "supportive", status: "confirmed", evidenceLabel: "Character records", evidenceHref: "/characters/chester/" },
  { id: "alice-queen", source: "alice", target: "queen", type: "rivalry", label: "boundary power meets central authority", polarity: "mixed", status: "disputed", evidenceLabel: "Relationship under observation", evidenceHref: `${OTHER_ALICE_WORLD_GUIDE_PATH}#queen-of-hearts` },
  { id: "alice-ciryl", source: "ciryl", target: "alice", type: "testimony", label: "carries evidence of an impossible route", polarity: "supportive", status: "disputed", evidenceLabel: "Frost quill specimen", evidenceHref: `${OTHER_ALICE_WORLD_GUIDE_PATH}#frost-quill-specimen` },
  { id: "hatter-diamonds", source: "hatter", target: "diamonds", type: "recognition", label: "controls brands, formulas, contracts, and hospitality", polarity: "mixed", status: "confirmed", evidenceLabel: "Diamond Highlands outline", evidenceHref: "/characters/the-hatter/" },
  { id: "alice-hatter", source: "alice", target: "hatter", type: "testimony", label: "treats his episodes as evidence", polarity: "mixed", status: "disputed", evidenceLabel: "Tea-party record incomplete", evidenceHref: "/characters/the-hatter/" },
];

export const relationshipLegend = [
  { type: "authority", label: "Authority", color: "#e23a4e" },
  { type: "recognition", label: "Recognition / debt", color: "#e3c82f" },
  { type: "maintenance", label: "Labor / maintenance / water", color: "#2fe089" },
  { type: "transport", label: "Route / transport / security", color: "#43aee8" },
  { type: "affection", label: "Affection / trust", color: "#b66be3" },
  { type: "rivalry", label: "Rivalry / disputed testimony", color: "#f5f0df" },
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
    image: otherAliceResidents[1].image,
    imageAlt: otherAliceResidents[1].imageAlt,
    summary: [
      `${otherAliceCanon.chester} Companion is more accurate than pet.`,
      "His strangeness comes from impossible placement rather than constant performance. Alice may crawl through a tunnel for hours and find him waiting at the exit.",
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
      "The Caterpillar sees what people are becoming, the choices around that transformation, and the identities they are trying to escape.",
      "His hookah is a breath engine built into a living fungal chamber. Spores, memory compounds, recovered neural technology, pheromones, and mycelial communication externalize possible identities.",
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
  { label: "Species or lineage", description: "The body, ancestry, appetite, and inherited behavior a resident carries." },
  { label: "House", description: "The political, economic, ecological, and occupational system through which a resident works or is classified." },
  { label: "Territory", description: "The regional systems, local authorities, routes, and laws that govern daily life." },
  { label: "Heart recognition", description: "The deed, charter, concession, title, or court record that makes the arrangement official." },
];

export const aliceTimeline = [
  { label: "Arrival", value: "Alice enters Wonderland at eight." },
  { label: "Wonderland time", value: "She experiences ten continuous years and is now eighteen." },
  { label: "Outside time", value: `The original route advances by ${otherAliceCanon.outsideElapsed}, to ${otherAliceCanon.outsideEra}.` },
  { label: "Present contradiction", value: "She is biologically eighteen, historically displaced, and legally difficult to classify." },
];

export const otherAliceConceptArt = [
  {
    id: "alice-canon-sheet",
    title: "Other Alice / working canon sheet",
    kind: "Character design",
    image: "/media/other-alice/other-alice-character-sheet.webp",
    imageAlt:
      "Other Alice character sheet showing her purple-and-black field dress, pale apron, black bob, green skin, and signature motifs.",
    note:
      "Age eighteen. Boundary-tester and field observer. The sheet establishes her silhouette, color, field clothes, and the practical details that should remain consistent across future art.",
  },
  {
    id: "alice-two-worlds",
    title: "Wonderland is liquid. Wasteland is geometry.",
    kind: "Series poster",
    image: "/media/other-alice/other-alice-wonderland-wasteland-poster.webp",
    imageAlt:
      "Other Alice stands between liquid, fungal Wonderland and the dry geometric Wasteland in a vertical series poster.",
    note:
      "A tonal thesis rather than a complete map. Wonderland and Wasteland remain equally strange, but they express strangeness through different materials and physical rules.",
  },
  {
    id: "wonderland-world-view",
    title: "Circular Wonderland / alternate world view",
    kind: "World concept",
    image: "/media/other-alice/wonderland-circular-world-concept.webp",
    imageAlt:
      "Alternate aerial concept of circular Wonderland with the Heart city at its center, cultivated ecological rings, boundary mountains, and dry exterior terrain.",
    note:
      "One useful view of the realm, not the final or only map. Future atlas layers can disagree while preserving the same political and ecological relationships.",
  },
];

export const hatterWorldFeature = {
  id: "the-hatter-diamond-highlands",
  character: "The Hatter",
  status: "Working canon",
  publicRole: "Diamond tea magnate, chemist, and syndicate operator",
  region: "The Diamond Highlands",
  image: "/media/other-alice/mad-hatter-diamond-highlands-concept.webp",
  imageAlt:
    "The Hatter in a dark 1930s suit holding a teacup above misty cultivated hills and Diamond architecture.",
  premise:
    "The Hatter rose by controlling the point where highland crops became branded luxury, medicine, vice, and political hospitality. A failed ceremonial consignment made him the contractual target of a punishment that externalized his damaged sense of time and etiquette.",
  regionLogic:
    "The Diamond Highlands are a cool, misty cultivation belt of tea hills, coffee groves, flower glasshouses, steep ravines, wet markets, processing houses, hotels, and exceptional grown architecture.",
  storyEngine:
    "His Mad Tea Party is a physically interactive zone. Sitting can accept a negotiation, drinking can acknowledge a debt, changing seats can change allegiance, and a broken cup can end a truce.",
  powerChain: [
    "Hearts own the ground and legal concessions.",
    "Diamonds own the commodity contracts, businesses, brands, processing, and markets.",
    "Spades make the living cultivation system work.",
    "Clubs secure the roads, warehouses, convoys, and collections.",
  ],
  openQuestions: [
    "His formal name and exact species remain open.",
    "The House or rival behind the failed consignment remains unconfirmed.",
    "The antidote may restore only temporary lucidity.",
    "It is not yet settled whether the tea-party zone is anchored to one building or can infect new locations.",
  ],
};

export const worldGuideTerms = [
  { term: "The House", definition: "The Queen of Hearts' castle, casino, cabaret, court, service complex, and central institution." },
  { term: "Court map", definition: "The official Heart image of one sovereign realm whose legal borders reach the mountains." },
  { term: "Lived map", definition: "The regional patchwork of markets, water, labor, roads, maintenance, transport, and survival that governs daily reality." },
  { term: "Dependency map", definition: "The routes and obligations that show why no House can leave the political system cleanly." },
  { term: "The Unsuited", definition: "Beings whose identities predate, exceed, or refuse House classification." },
  { term: "Rabbit-hole network", definition: "A living transit system of burrows, mirrors, doors, tunnels, wormholes, and apertures that can move time as well as matter." },
  { term: "Wasteland", definition: "The dry geometric exterior beyond Wonderland's boundary mountains. Its public record remains intentionally incomplete." },
];

export const currentWorldCrisis = {
  title: "The outer cold is moving inward",
  summary:
    "Club scouts find machines embedded in new ice, Spade burrows open into frozen chambers, Diamond waterways lose pressure, and Heart clocks disagree about how long the changes have been happening.",
  questions: [
    "Is Wonderland freezing or aging?",
    "Is the realm being invaded by its own future?",
    "Which House can act without breaking a system it needs?",
    "Why can Alice reach routes their officials cannot?",
  ],
};
