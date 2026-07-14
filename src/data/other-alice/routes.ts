export const routeTypes = [
  { id:"radial",label:"Radial",color:"#ef476f",summary:"Registered routes move between titled centers and outer estates. They are legible to courts, permits, tolls, and patrols.",evidence:"Court road registry" },
  { id:"orbital",label:"Orbital",color:"#f7c948",summary:"Regional routes circulate between markets, ecologies, settlements, and work systems without returning to the center.",evidence:"Market and maintenance schedules" },
  { id:"burrow",label:"Burrow",color:"#9f7aea",summary:"Discontinuous routes join places by appetite, memory, debt, resemblance, refusal, or another rule that is not ordinary distance.",evidence:"Repeated marks and matched residues" },
] as const;

export const portalFamilies = [
  { id:"door",label:"Doors",rule:"Familiar boundaries in the wrong place",cost:"Consent and changed local rules",clock:"civic" },
  { id:"burrow",label:"Burrows",rule:"Meaning and appetite outrank distance",cost:"Bodily or material change",clock:"body" },
  { id:"mirror",label:"Mirrors",rule:"Reflection aligns before geography",cost:"Delay, residue, or mistaken sequence",clock:"outside" },
  { id:"service",label:"Service routes",rule:"Maintenance need creates access",cost:"Work, debt, or institutional claim",clock:"civic" },
] as const;
