export const riversMediaBase = "https://cdn.hob.farm/articles/trash-river";

const photo = (
  file: string,
  alt: string,
  caption: string,
  width: number,
  height: number,
) => ({
  src: `${riversMediaBase}/${file}`,
  alt,
  caption,
  width,
  height,
});

export const vungTauReceivingShore = [
  photo(
    "beach-trash2.JPG",
    "A broad Vung Tau shoreline covered by a thick wrack line of foam, plastic, wood, and organic debris.",
    "A wide receiving shoreline in Vũng Tàu. Foam, packaging, wood, vegetation, and other material have accumulated in the same band.",
    2048,
    1365,
  ),
  photo(
    "beach-trash5.JPG",
    "Blue and green rope and netting tangled through driftwood at the edge of beach vegetation.",
    "Rope and netting caught in driftwood supply a visible maritime component. The photograph cannot identify the vessel or activity that released it.",
    2048,
    1365,
  ),
  photo(
    "beach-trash11.JPG",
    "One black flip-flop lying upside down on wet sand with the sea on the horizon.",
    "A single flip-flop on the open beach: one recognizable household object after its route and owner have disappeared.",
    2048,
    1365,
  ),
  photo(
    "beach-trash8.JPG",
    "Two dead rats among a plastic bottle, woven sack, foam, and plant debris on wet sand.",
    "Two dead rats arrived among bottles, a woven sack, foam, and organic debris. Their presence on the same receiving shoreline does not establish why they died.",
    2048,
    1365,
  ),
  photo(
    "beach-trash10.jpg",
    "An upside-down plastic doll head partly embedded in damp beach sand.",
    "An upside-down doll head makes the waste recognizable again. It is no longer a category called plastic; it is a former possession.",
    2048,
    1365,
  ),
  photo(
    "beach-trash3.JPG",
    "A green navigation marker lies tipped among shoreline debris with water and distant hills behind it.",
    "A displaced navigation marker sits inside the wrack line, where river, coastal, fishing, and shipping material can become difficult to separate by sight.",
    2048,
    1365,
  ),
];

export const oceanAgedBottles = [
  photo(
    "beach-bottle1.JPG",
    "A weathered bottle on sand with clusters of goose barnacles attached to its surface.",
    "A discarded bottle came ashore carrying goose barnacles and algae, evidence of meaningful time afloat but not a precise clock.",
    2048,
    1536,
  ),
  photo(
    "beach-bottle2.JPG",
    "A clear weathered bottle on wet sand with barnacles growing around its rim and sides.",
    "This bottle had been at sea long enough to become a neighborhood.",
    2048,
    1536,
  ),
];

export const canThoPhotos = [
  photo(
    "can-tho1.JPG",
    "A person works from a small boat beside a riverside shelter patched with blue tarp and woven plastic sacks under a concrete bridge in Can Tho.",
    "Woven rice and feed sacks serve as wall and roofing material beside a Cần Thơ waterway. Weathering can make this kind of plastic brittle, but polymer matching would be needed to connect these sacks to measured particles.",
    2048,
    1365,
  ),
  photo(
    "can-tho2.jpg",
    "Boats and low riverside buildings line an ordinary brown urban waterway in Can Tho.",
    "The Cần Thơ waterfront looks like an ordinary working river. Pesticide residues and most of the microplastics measured in local research did not announce themselves on the surface.",
    2048,
    1365,
  ),
];

export const belfastHarborPhotos = [
  photo(
    "belfast-maine1.JPG",
    "Boats sit in Belfast Harbor beyond a stone seawall under a pale sky.",
    "Belfast Harbor after the poultry plants: seawall, working boats, and open water.",
    2048,
    1365,
  ),
  photo(
    "belfast-maine2.JPG",
    "Sailboats fill a marina in Belfast Harbor with a bridge crossing the water in the distance.",
    "The marina now occupies water that once received poultry-processing waste.",
    2048,
    1365,
  ),
  photo(
    "belfast-maine3.JPG",
    "A sunlit Belfast marina beneath dark storm clouds, with sailboat masts reflected in the harbor.",
    "Belfast Harbor does not look rehabilitated. It just looks like Belfast Harbor. You have to know the history to understand what is missing.",
    2048,
    1365,
  ),
];

