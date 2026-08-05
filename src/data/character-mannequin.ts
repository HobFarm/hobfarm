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

const localImage = (
  file: string,
  alt: string,
  width: number,
  height: number,
  caption: string,
): MediaRef => ({
  src: `/media/workshop/character-mannequin/${file}`,
  alt,
  width,
  height,
  poster: null,
  caption,
  credit: CREDIT,
});

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

const blondePortrait = designImage(
  "mannequin1-portrait.png",
  "Portrait of the blonde doll mannequin with platinum pixie hair, a black clip, gray-blue eyes, and black makeup drips",
  941,
  1672,
  "Blonde portrait / identity source",
);

const greenPortrait = designImage(
  "mannequin2-portrait.png",
  "Portrait of the green zombie doll mannequin with a black and violet bob, violet eyes, cheek stitches, and black makeup drips",
  941,
  1672,
  "Green zombie portrait / identity source",
);

const blondeInferredSheet = designImage(
  "mannequin1-character-sheet.png",
  "Later character sheet for the blonde mannequin with a model-inferred black dress",
  1672,
  941,
  "Blonde / later sheet with inferred dress",
);

const greenInferredSheet = designImage(
  "mannequin2-character-sheet.png",
  "Later character sheet for the green zombie mannequin with a model-inferred goth outfit",
  1672,
  941,
  "Green zombie / later sheet with inferred goth outfit",
);

const blondeIdentityBase = localImage(
  "blonde-identity-base-v2.png",
  "Clean identity-base sheet for the blonde mannequin with portrait, front, back, and three-quarter views in a neutral gray studio unitard",
  1672,
  941,
  "Blonde mannequin / clean identity base",
);

const greenIdentityBase = localImage(
  "green-zombie-identity-base-v2.png",
  "Clean identity-base sheet for the green zombie mannequin with portrait, front, back, and three-quarter views in a neutral gray studio unitard",
  1672,
  941,
  "Green zombie mannequin / clean identity base",
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
    title: "Yellow dress / Blonde base",
    dek: "A directed wardrobe set moves onto the blonde identity, then into a neon pool scene.",
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
      "The dress belongs to this styling test, not to the mannequin's character definition. The blonde face, platinum hair, proportions, black hair clip, and makeup drips keep the identity recognizable underneath it.",
  },
  {
    id: "black-marble",
    index: "02",
    title: "Black leather / Blonde base",
    dek: "The same blonde base takes on a second directed outfit and scene without becoming a different character.",
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
      "The wardrobe and setting change completely. The same face, hair, proportions, clip, and drip placement make the yellow dress and black leather read as two styles on one mannequin.",
  },
  {
    id: "green-art-deco",
    index: "03",
    title: "Black leather / Green zombie base",
    dek: "The directed black leather set moves to the green zombie identity while its garment shapes and accessories stay legible.",
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
      "different face, palette, and identity markers",
      "gold and emerald Art Deco setting",
    ],
    productionNote:
      "The green character's earlier goth sheet was model inference. This comparison instead transfers a separately defined leather set: lace-up top, shorts, boots, bag, fan, dark palette, and overall attitude.",
  },
];

export const characterMannequinPage = {
  title: "Mannequin, Outfit, and Character Continuity | HobFarm Workshop",
  description:
    "Two portrait-led mannequin identities rebuilt as clean bases, separating model-inferred sheet clothing from directed outfit and scene experiments.",
  heroGraphic: blondeIdentityBase,
  identities: [
    {
      id: "blonde",
      name: "Blonde mannequin",
      sourceNote: "Built from the HobFarm doll-style files as one of several mannequin designs.",
      portrait: blondePortrait,
      cleanBase: blondeIdentityBase,
      inferredSheet: blondeInferredSheet,
      kept: ["platinum asymmetrical crop", "black hair clip", "gray-blue eyes", "black eye-makeup drips"],
      excluded: "The black dress from the later character sheet",
    },
    {
      id: "green-zombie",
      name: "Green zombie mannequin",
      sourceNote: "Built in the same structure from a zombie brief and a visual example.",
      portrait: greenPortrait,
      cleanBase: greenIdentityBase,
      inferredSheet: greenInferredSheet,
      kept: ["mint-green skin", "black and violet bob", "violet eyes", "cheek stitches and black drips"],
      excluded: "The goth outfit from the later character sheet",
    },
  ],
  academyUrl: "/academy/",
  characterIndexUrl: "/visual-systems/",
} as const;
