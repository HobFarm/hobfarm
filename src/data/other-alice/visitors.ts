import {
  otherAliceCanon,
  otherAliceChronology,
  otherAliceEntityRefs,
  otherAlicePublicCanon,
} from "./canon";

const outsideElapsed = otherAliceCanon.outsideYears.replace(
  /^./,
  (letter) => letter.toUpperCase(),
);

export type VisitorRouteStage = {
  id: string;
  title: string;
  text: string;
};

export const visitorThresholdStages: VisitorRouteStage[] = [
  {
    id: "invitation",
    title: "Invitation",
    text: "Wonderland arranges a signal: a rabbit, wrong door, delayed reflection, voice, dream, substance, animal, route, or impossible object.",
  },
  {
    id: "recognition",
    title: "Recognition",
    text: "The visitor notices that the signal asks for an answer, even when the destination and cost remain unclear.",
  },
  {
    id: "choice",
    title: "Choice",
    text: "The visitor follows, opens, answers, drinks, descends, or steps through. Wonderland cannot take this final step for them.",
  },
  {
    id: "crossing",
    title: "Crossing",
    text: "The chosen action enters a place with different physical and social rules. The passage can change a body, object, route, debt, or relationship.",
  },
];

export const visitorImprintStages: VisitorRouteStage[] = [
  {
    id: "contact",
    title: "Contact",
    text: "The visitor meets local people, organisms, institutions, routes, and material conditions.",
  },
  {
    id: "residue",
    title: "Residue",
    text: "An object, method, organism, appetite, fear, rule, mark, or story remains after contact.",
  },
  {
    id: "uptake",
    title: "Uptake",
    text: "Local people test the residue and decide whether it has a use worth keeping.",
  },
  {
    id: "rejection-or-failure",
    title: "Rejection or failure",
    text: "A method can be refused, misapplied, metabolized, broken, or made harmless by local conditions.",
  },
  {
    id: "adaptation",
    title: "Adaptation",
    text: "Useful residue changes to fit local bodies, materials, needs, routes, and power structures.",
  },
  {
    id: "repetition",
    title: "Repetition",
    text: "Repeated use carries the adaptation beyond one encounter or one person's memory.",
  },
  {
    id: "institution-or-ecology",
    title: "Institution or ecology",
    text: "The repeated practice becomes infrastructure, law, trade, ritual, habitat, medicine, or another durable system.",
  },
  {
    id: "myth-or-countereffect",
    title: "Myth or countereffect",
    text: "Later generations preserve, resist, misremember, reverse, or build new effects around what remains.",
  },
];

export const aliceVisitorRecord = {
  id: "alice-visitor-record",
  entityRef: otherAliceEntityRefs.alice,
  relatedEntityRefs: [
    otherAliceEntityRefs.chester,
    otherAliceEntityRefs.whiteRabbit,
    otherAliceEntityRefs.caterpillarMushroom,
    otherAliceEntityRefs.cabinWorkshop,
    otherAliceEntityRefs.burrowNetwork,
  ],
  label: "Visitor record / Alice",
  choices: otherAlicePublicCanon.choices,
  fields: [
    {
      label: "Lived time",
      value: `${otherAliceCanon.wonderlandYears} Wonderland years.`,
    },
    {
      label: "Present",
      value: `Age ${otherAliceCanon.presentAge}.`,
    },
    {
      label: "Method",
      value: "Preparation, observation, persuasion, size change, and reciprocal help.",
    },
    {
      label: "Local imprint",
      value: "Remedies, route records, workshop knowledge, and practical alliances.",
    },
    {
      label: "Outside",
      value: `${outsideElapsed} along her original route. ${otherAliceChronology.outsideCaveat}`,
    },
  ],
} as const;

export const visitorChannels = [
  {
    title: "Body",
    text: "Diet, work, illness, clothing, gesture, growth, and adaptation carry an arrival into local life.",
  },
  {
    title: "Knowledge",
    text: "A measurement, recipe, map, repair, story, or error becomes useful only after local testing.",
  },
  {
    title: "Material",
    text: "Objects and residues are repaired, copied, traded, metabolized, or built into infrastructure.",
  },
  {
    title: "Authority",
    text: "Courts, contracts, guilds, and myths decide who may use the change and who receives credit.",
  },
] as const;
