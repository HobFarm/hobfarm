export const routeTypes = [
  {
    id:"radial",label:"Radial",color:"#ef476f",
    summary:"Registered routes move between titled centers and outer estates. They are legible to courts, permits, tolls, and patrols.",
    meaning:"A radial route makes the center the reference point. Addresses, permissions, tolls, freight schedules, and patrols all become easier to record because every journey can be described as movement toward or away from Heart authority.",
    effect:"A settlement on a spoke gains an official road and access to central institutions, but it also inherits every checkpoint and interruption closer to the center. One blocked segment can isolate everyone beyond it.",
    power:"Hearts define the recognized destinations. Clubs control passage along the line. Diamond freight and Spade maintenance determine whether the registered road remains useful.",
    evidence:"Court road registry",
  },
  {
    id:"orbital",label:"Orbital",color:"#f7c948",
    summary:"Regional routes circulate between markets, ecologies, settlements, and work systems without returning to the center.",
    meaning:"An orbital route treats neighboring regions as destinations in their own right. Goods, workers, water, repairs, and news can move around the center instead of passing through it.",
    effect:"The ring makes regional alliances and supply chains possible. It also spreads a crop failure, shortage, strike, or damaged bridge sideways, because each stop depends on the next one continuing the circuit.",
    power:"Diamond schedules make the circuit profitable. Spade crews keep its living and built sections open. Heart maps recognize only part of the exchange taking place around them.",
    evidence:"Market and maintenance schedules",
  },
  {
    id:"burrow",label:"Burrow",color:"#9f7aea",
    summary:"Discontinuous routes join places by appetite, memory, debt, resemblance, refusal, or another rule that is not ordinary distance.",
    meaning:"A burrow is a condition disguised as a passage. Two places connect because the traveler, object, need, or promise satisfies the route's rule, not because the entrances sit near one another.",
    effect:"A nearby room can remain unreachable while a distant district opens in one step. Access belongs to whoever understands the condition, can pay its cost, or recognizes when the route has changed its mind.",
    power:"Rabbit brokers, maintenance workers, experienced residents, and route-sensitive organisms can outrank official maps and patrols. Their knowledge is valuable because the ground alone cannot explain the journey.",
    evidence:"Repeated marks and matched residues",
  },
] as const;

export const portalFamilies = [
  { id:"door",label:"Doors",rule:"Familiar boundaries in the wrong place",cost:"Consent and changed local rules",clock:"civic" },
  { id:"burrow",label:"Burrows",rule:"Meaning and appetite outrank distance",cost:"Bodily or material change",clock:"body" },
  { id:"mirror",label:"Mirrors",rule:"Reflection aligns before geography",cost:"Delay, residue, or mistaken sequence",clock:"outside" },
  { id:"service",label:"Service routes",rule:"Maintenance need creates access",cost:"Work, debt, or institutional claim",clock:"civic" },
] as const;
