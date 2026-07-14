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

export const otherAliceCanon = {
  ...chronologyValues,
  formatLine:
    `Alice arrived at ${word(chronologyValues.arrivedAge)}. She is ${word(chronologyValues.presentAge)} now. ${sentenceCase(word(chronologyValues.wonderlandYears))} years passed for her. About two hundred passed outside.`,
  premise:
    `Alice arrived in Wonderland at ${word(chronologyValues.arrivedAge)} and grew up inside its living systems. At ${word(chronologyValues.presentAge)}, she reads its routes, institutions, organisms, and contradictions as the structure of home.`,
  politicalRule:
    "Hearts own the ground. Diamonds own the business. Spades keep it alive. Clubs make sure it stays owned.",
  mapRule: "The Hearts own the map. The other Houses own the places on it.",
  chester:
    "Chester is an old British Blue Cheshire cat, Alice's companion, and an unreliable authority on routes.",
} as const;

export const otherAliceChronology = {
  arrival: `Alice arrived in Wonderland at ${word(otherAliceCanon.arrivedAge)}.`,
  residentSummary: `Alice arrived at ${word(otherAliceCanon.arrivedAge)} and is ${word(otherAliceCanon.presentAge)} now.`,
  startDeck: `Alice arrived in Wonderland at ${word(otherAliceCanon.arrivedAge)}. ${sentenceCase(word(otherAliceCanon.wonderlandYears))} years later, she knows it as a country, an ecology, and a political machine. About two centuries have passed along the route she came.`,
  rail: `Alice: ${otherAliceCanon.presentAge} · Wonderland time: ${otherAliceCanon.wonderlandYears} years · Outside route: ${otherAliceCanon.outsideYears}`,
  outsideGap: "About two centuries",
  characterDeck: `She entered Wonderland at ${word(otherAliceCanon.arrivedAge)}. ${sentenceCase(word(otherAliceCanon.wonderlandYears))} Wonderland years and about two outside centuries later, she knows which rules are useful, which ones are local, and which official maps are lying.`,
  timeline: [
    `Arrived at ${word(otherAliceCanon.arrivedAge)}`,
    `${sentenceCase(word(otherAliceCanon.wonderlandYears))} Wonderland years`,
    `${sentenceCase(word(otherAliceCanon.presentAge))} now`,
    `About two hundred outside years`,
  ],
} as const;
