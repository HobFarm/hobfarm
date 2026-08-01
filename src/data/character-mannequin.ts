import { cdn } from "@/lib/cdn";

export type MediaRef = {
  src: string;
  alt: string;
  width: number;
  height: number;
  poster: string | null;
  caption: string;
  credit: string;
};

export const characterSpecFields = [
  "Palette",
  "Skin",
  "Hair",
  "Eyes",
  "Garment",
  "Materials",
  "Hardware",
  "Footwear",
  "Accessories",
  "Motif",
] as const;

export type CharacterSpecField = (typeof characterSpecFields)[number];
export type CharacterSpec = Record<CharacterSpecField, string>;

export type CharacterLook = {
  id: string;
  index: string;
  title: string;
  dek: string;
  axis: "styling" | "identity";
  outfit: MediaRef;
  character: MediaRef;
  scene: MediaRef;
  motion: MediaRef;
  changed: string[];
  productionNote: string;
  files: "coming-soon" | { url: string; label: string };
};

const ROOT = "workshop/mannequin-outfit-character";
const CREDIT = "HobFarm";
const assetUrl = (folder: "designs" | "page-graphics", file: string) =>
  cdn.gallery(`${ROOT}/${folder}`, file);

const image = (
  folder: "designs" | "page-graphics",
  file: string,
  alt: string,
  width: number,
  height: number,
  caption: string,
): MediaRef => ({
  src: assetUrl(folder, file),
  alt,
  width,
  height,
  poster: null,
  caption,
  credit: CREDIT,
});

const portraitOne = image(
  "designs",
  "mannequin1-portrait.png",
  "Portrait of the platinum pixie mannequin with a black hair clip and black eye-makeup identifier",
  941,
  1672,
  "Mannequin 01 / identity portrait",
);

const sheetOne = image(
  "designs",
  "mannequin1-character-sheet.png",
  "Character sheet for mannequin one with face detail, front, back, and three-quarter views",
  1672,
  941,
  "Mannequin 01 / reference sheet",
);

const portraitTwo = image(
  "designs",
  "mannequin2-portrait.png",
  "Portrait of the green-skinned character with black and violet hair, stitches, and purple makeup",
  1024,
  1536,
  "Mannequin 02 / identity portrait",
);

const sheetTwo = image(
  "designs",
  "mannequin2-character-sheet.png",
  "Character sheet for the green character with face detail, front, back, and three-quarter views",
  1672,
  941,
  "Mannequin 02 / reference sheet",
);

const cleanBaseSheet = image(
  "designs",
  "clean-base-001-sheet.png",
  "Clean Base 001 four-panel reference sheet with portrait, front, back, and three-quarter views",
  1672,
  941,
  "Clean Base 001 / neutral sheet",
);

const cyberpopSheet = image(
  "designs",
  "cyberpop-y2kfut-001-sheet.png",
  "Cyberpop and Bauhaus character sheet using the same portrait, front, back, and three-quarter panel format as Clean Base 001",
  1672,
  941,
  "Cyberpop Y2KFUT 001 / resolved character sheet",
);

const cyberpopCharacter = image(
  "designs",
  "cyberpop-bauhaus-character.png",
  "Full-length Cyberpop and Bauhaus character on a white background wearing a modular geometric outfit",
  941,
  1672,
  "Reusable character asset / white background",
);

const cyberpopScene = image(
  "designs",
  "cyberpop-bauhaus-scene.png",
  "Full-length Cyberpop and Bauhaus character staged in a geometric neon environment",
  941,
  1672,
  "Finished character content / directed scene",
);

export const cleanBaseSpec: CharacterSpec = {
  Palette: "Skin, light gray, mid gray, dark brown",
  Skin: "Smooth matte finish, even tone",
  Hair: "Dark ash-brown blunt bob",
  Eyes: "Soft neutral makeup, defined lashes, natural lips",
  Garment: "Sleeveless mock-neck bodysuit and opaque tights",
  Materials: "Stretch knit and nylon-spandex",
  Hardware: "None",
  Footwear: "Simple low-profile flats",
  Accessories: "None",
  Motif: "None",
};

export const cyberpopSpec: CharacterSpec = {
  Palette: "Pink, red, blue, yellow, neon lime, black, white, clear",
  Skin: "Smooth matte finish, even tone",
  Hair: "Dark brown-black blunt bob",
  Eyes: "Brown eyes and translucent pink visor",
  Garment: "Futuristic bodysuit, mismatched sleeves, modular wide-leg pants",
  Materials: "Glossy PVC, vinyl, transparent TPU, metal",
  Hardware: "O-rings, zipper, rivets, studs, buckles, grommets",
  Footwear: "Glossy platform boots with neon accents",
  Accessories: "Visor, hair loops, neck ring, arm bands, belt, rings",
  Motif: "Circles, stars, geometric panels",
};

const designImage = (
  file: string,
  alt: string,
  width: number,
  height: number,
  caption: string,
) => image("designs", file, alt, width, height, caption);

const motion = (
  file: string,
  poster: MediaRef,
  alt: string,
  caption: string,
): MediaRef => ({
  src: assetUrl("designs", file),
  alt,
  width: poster.width,
  height: poster.height,
  poster: poster.src,
  caption,
  credit: CREDIT,
});

const blackOutfit = designImage(
  "outfit3.png",
  "Black leather crop top, shorts, boots, bag, jewelry, sunglasses, and fan arranged as an outfit design",
  1122,
  1402,
  "Look 01 / wardrobe design",
);
const blackCharacter = designImage(
  "mannequin-outfit3.png",
  "Platinum mannequin wearing the complete black leather look on a white studio background",
  1152,
  2048,
  "Look 01 / dressed character",
);
const blackScene = designImage(
  "character-scene-outfit3.png",
  "Platinum character wearing black leather in a daylight marble courtyard",
  1152,
  2048,
  "Look 01 / finished marble-garden scene",
);

const ivoryOutfit = designImage(
  "outfit2.png",
  "Ivory asymmetrical cowl dress, gold jewelry, cream pouch, and heeled mules arranged as an outfit design",
  1122,
  1402,
  "Look 02 / wardrobe design",
);
const ivoryCharacter = designImage(
  "mannequin-outfit2.png",
  "Platinum mannequin wearing the ivory cowl look on a white studio background",
  1152,
  2048,
  "Look 02 / dressed character",
);
const ivoryScene = designImage(
  "character-scene-outfit2.png",
  "Platinum character wearing an ivory cowl dress on a monochrome street beside a classic car",
  1152,
  2048,
  "Look 02 / finished noir-street scene",
);

const yellowOutfit = designImage(
  "outfit1.png",
  "Butter-yellow midi dress, gold jewelry, pale shoulder bag, and slingbacks arranged as an outfit design",
  1122,
  1402,
  "Look 03 / wardrobe design",
);
const yellowCharacter = designImage(
  "mannequin-outfit1.png",
  "Platinum mannequin wearing the butter-yellow look on a white studio background",
  1152,
  2048,
  "Look 03 / dressed character",
);
const yellowScene = designImage(
  "character-scene-outfit1.png",
  "Platinum character wearing a butter-yellow dress beside a neon magenta and cyan pool",
  1152,
  2048,
  "Look 03 / finished neon-pool scene",
);

const greenCharacter = designImage(
  "mannequin2-outfit3.png",
  "Green character wearing the black leather look on a white studio background",
  1152,
  2048,
  "Character 02 / dressed character",
);
const greenScene = designImage(
  "character2-scene-outfit3.png",
  "Green character wearing black leather in a gold and emerald Art Deco room",
  1152,
  2048,
  "Character 02 / finished Art Deco scene",
);

export const characterLooks: CharacterLook[] = [
  {
    id: "black-marble",
    index: "01",
    title: "Black leather / Marble garden",
    dek: "Hard black surfaces move into open daylight without losing the mannequin underneath.",
    axis: "styling",
    outfit: blackOutfit,
    character: blackCharacter,
    scene: blackScene,
    motion: motion(
      "character-scene-outfit3.mp4",
      blackScene,
      "Short motion reveal from the black leather character frame into the marble garden scene",
      "Look 01 / controlled scene reveal",
    ),
    changed: [
      "lace-up leather crop top and shorts",
      "tall lace-up boots",
      "bag, hoops, necklace, sunglasses, and fan",
      "marble courtyard environment",
      "daylight, ground contact, and scene depth",
    ],
    productionNote:
      "The black leather needs separate edges at the waist, boots, and accessories. The courtyard adds pale stone and daylight so the silhouette stays readable instead of collapsing into one dark mass.",
    files: "coming-soon",
  },
  {
    id: "ivory-noir",
    index: "02",
    title: "Ivory cowl / Noir street",
    dek: "A soft draped garment becomes the brightest object in a hard monochrome street.",
    axis: "styling",
    outfit: ivoryOutfit,
    character: ivoryCharacter,
    scene: ivoryScene,
    motion: motion(
      "character-scene-outfit2.mp4",
      ivoryScene,
      "Short motion reveal from the ivory cowl character frame into the noir street scene",
      "Look 02 / controlled scene reveal",
    ),
    changed: [
      "draped asymmetrical cowl dress",
      "gold jewelry and cream pouch",
      "heeled mules",
      "monochrome street and classic car",
      "hard noir lighting and long shadow",
    ],
    productionNote:
      "The dress depends on one clean diagonal and a readable cowl. The street scene keeps that pale shape intact, then uses the car, curb, and long shadow to give it weight and direction.",
    files: "coming-soon",
  },
  {
    id: "yellow-pool",
    index: "03",
    title: "Butter yellow / Neon pool",
    dek: "Warm fabric holds its color while magenta and cyan light move across the scene.",
    axis: "styling",
    outfit: yellowOutfit,
    character: yellowCharacter,
    scene: yellowScene,
    motion: motion(
      "character-scene-outfit1.mp4",
      yellowScene,
      "Short motion reveal from the butter-yellow character frame into the neon pool scene",
      "Look 03 / controlled scene reveal",
    ),
    changed: [
      "butter-yellow midi dress",
      "gold hoops and pendant",
      "pale shoulder bag and slingbacks",
      "neon pool environment",
      "magenta, cyan, and reflected light",
    ],
    productionNote:
      "The scene can add colored reflections without turning the dress into a different garment. The yellow remains the identity of the look; pool light describes the location around it.",
    files: "coming-soon",
  },
  {
    id: "green-art-deco",
    index: "04",
    title: "Green character / Art Deco room",
    dek: "The format stays fixed while the identity itself changes.",
    axis: "identity",
    outfit: blackOutfit,
    character: greenCharacter,
    scene: greenScene,
    motion: motion(
      "character2-scene-outfit3.mp4",
      greenScene,
      "Short motion reveal from the green character frame into a gold and emerald Art Deco room",
      "Character 02 / controlled Art Deco scene reveal",
    ),
    changed: [
      "green skin and facial stitches",
      "black and violet bob",
      "purple makeup and a separate character attitude",
      "gold and emerald Art Deco room",
      "warm theatrical light and motion timing",
    ],
    productionNote:
      "This chapter changes identity rather than styling. The sheet format, stage order, and review method remain the same, so a new character does not require a new production system.",
    files: "coming-soon",
  },
];

const commissionUrl = "/contact/?subject=custom-character";

export const characterMannequinPage = {
  title: "Character Sheets, Outfit Systems, and Continuity | HobFarm Workshop",
  description:
    "A four-panel character-sheet method for keeping identity, wardrobe, scenes, and motion inspectable from the first base to the finished output.",
  basePortrait: portraitOne,
  baseSheet: sheetOne,
  alternatePortrait: portraitTwo,
  alternateSheet: sheetTwo,
  heroGraphic: sheetOne,
  cleanBaseSheet,
  cyberpopSheet,
  cyberpopCharacter,
  cyberpopScene,
  relatedWorkshop: ["/workshop/alter-ego/", "/workshop/stylefusion/"],
  commissionUrl,
  academyUrl: "/academy/",
  shopUrl: "/shop/",
  characterIndexUrl: "/visual-systems/",
  elevenLabsCharacterSheetWorkflowUrl: "https://elevenlabs.io/app/flows/kRlIkuiEdy0X1wC4n56O",
  elevenLabsAssemblyWorkflowUrl: "https://elevenlabs.io/app/flows/eSYyxDGUCh4xbWjUuBKs",
  elevenLabsAffiliateUrl: "https://try.elevenlabs.io/xyeeptwpw4d6",
} as const;
