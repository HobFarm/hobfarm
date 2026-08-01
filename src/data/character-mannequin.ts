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

const sheetOne = designImage(
  "mannequin1-character-sheet.png",
  "Character sheet for the blonde mannequin with face detail, front, back, and three-quarter views",
  1672,
  941,
  "Blonde mannequin / reference sheet",
);

const sheetTwo = designImage(
  "mannequin2-character-sheet.png",
  "Character sheet for the green mannequin with face detail, front, back, and three-quarter views",
  1672,
  941,
  "Green mannequin / reference sheet",
);

const cleanBaseSheet = designImage(
  "clean-base-001-sheet.png",
  "Clean Base 001 four-panel reference sheet with portrait, front, back, and three-quarter views",
  1672,
  941,
  "Clean Base 001 / neutral starting point",
);

const yellowOutfit = designImage(
  "outfit1.png",
  "Butter-yellow midi dress, gold jewelry, pale shoulder bag, and slingbacks arranged as an outfit design",
  1122,
  1402,
  "Step 01 / dress and accessories",
);
const yellowCharacter = designImage(
  "mannequin-outfit1.png",
  "Blonde mannequin wearing the butter-yellow dress on a white studio background",
  1152,
  2048,
  "Step 01 / dress applied to the blonde mannequin",
);
const yellowScene = designImage(
  "character-scene-outfit1.png",
  "Blonde mannequin wearing the butter-yellow dress beside a neon magenta and cyan pool",
  1152,
  2048,
  "Step 01 / dress look carried into a scene",
);

const blackOutfit = designImage(
  "outfit3.png",
  "Black leather crop top, shorts, boots, bag, jewelry, sunglasses, and fan arranged as an outfit design",
  1122,
  1402,
  "Step 02 / black leather outfit and accessories",
);
const blackCharacter = designImage(
  "mannequin-outfit3.png",
  "Blonde mannequin wearing the complete black leather outfit on a white studio background",
  1152,
  2048,
  "Step 02 / black leather applied to the blonde mannequin",
);
const blackScene = designImage(
  "character-scene-outfit3.png",
  "Blonde mannequin wearing the black leather outfit in a daylight marble courtyard",
  1152,
  2048,
  "Step 02 / black leather look carried into a scene",
);

const greenCharacter = designImage(
  "mannequin2-outfit3.png",
  "Green mannequin wearing the same black leather outfit on a white studio background",
  1152,
  2048,
  "Step 03 / black leather transferred to the green mannequin",
);
const greenScene = designImage(
  "character2-scene-outfit3.png",
  "Green mannequin wearing the black leather outfit in a gold and emerald Art Deco room",
  1152,
  2048,
  "Step 03 / transferred look carried into a new scene",
);

export const characterLooks: CharacterLook[] = [
  {
    id: "yellow-pool",
    index: "01",
    title: "Dress / Blonde mannequin",
    dek: "The neutral figure takes on a butter-yellow dress, its accessories, and a neon pool setting.",
    axis: "styling",
    outfit: yellowOutfit,
    character: yellowCharacter,
    scene: yellowScene,
    motion: motion(
      "character-scene-outfit1.mp4",
      yellowScene,
      "Short motion study of the blonde mannequin in the butter-yellow dress and neon pool setting",
      "Step 01 / dress look in motion",
    ),
    changed: [
      "butter-yellow midi dress",
      "gold jewelry, pale shoulder bag, and slingbacks",
      "neon pool setting",
      "magenta, cyan, and reflected light",
    ],
    productionNote:
      "The outfit and scene establish one complete look. The blonde face, platinum hair, proportions, and black hair clip keep the mannequin recognizable underneath it.",
  },
  {
    id: "black-marble",
    index: "02",
    title: "Black leather / Blonde mannequin",
    dek: "The same mannequin takes on a second outfit and scene without becoming a different character.",
    axis: "styling",
    outfit: blackOutfit,
    character: blackCharacter,
    scene: blackScene,
    motion: motion(
      "character-scene-outfit3.mp4",
      blackScene,
      "Short motion study of the blonde mannequin in the black leather outfit and marble courtyard",
      "Step 02 / black leather look in motion",
    ),
    changed: [
      "lace-up leather crop top and shorts",
      "tall boots, bag, hoops, necklace, sunglasses, and fan",
      "marble courtyard setting",
      "pale stone and open daylight",
    ],
    productionNote:
      "The wardrobe and setting change completely. The same face, hair, proportions, and identifier details make the dress and black leather read as two styles on one mannequin.",
  },
  {
    id: "green-art-deco",
    index: "03",
    title: "Black leather / Green mannequin",
    dek: "The black leather outfit moves to a different body, face, palette, and rendering style while keeping the same visual identity.",
    axis: "identity",
    outfit: blackOutfit,
    character: greenCharacter,
    scene: greenScene,
    motion: motion(
      "character2-scene-outfit3.mp4",
      greenScene,
      "Short motion study of the green mannequin wearing the transferred black leather look in an Art Deco room",
      "Step 03 / transferred look in motion",
    ),
    changed: [
      "green skin and facial stitches",
      "black and violet hair",
      "different face, proportions, and rendering style",
      "gold and emerald Art Deco setting",
    ],
    productionNote:
      "The mannequin changes, but the lace-up top, shorts, boots, bag, fan, dark palette, and overall attitude remain legible. The look survives the transfer without producing an identical picture.",
  },
];

export const characterMannequinPage = {
  title: "Mannequin, Outfit, and Character Continuity | HobFarm Workshop",
  description:
    "A visual study of one mannequin carrying different outfits and scenes, then one outfit carrying across a different character and rendering style.",
  baseSheet: sheetOne,
  alternateSheet: sheetTwo,
  heroGraphic: cleanBaseSheet,
  cleanBaseSheet,
  academyUrl: "/academy/",
  characterIndexUrl: "/visual-systems/",
} as const;
