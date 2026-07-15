import { cdn } from "@/lib/cdn";

export type ProductStatus = "available" | "coming-soon" | "inquiry";

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
  displayOrder: number;
  title: string;
  shortTitle: string;
  hook: string;
  accent: string;
  outfitImage: MediaRef;
  characterImage: MediaRef;
  sceneImage: MediaRef;
  video: MediaRef;
  locked: string[];
  changed: string[];
  productionNote: string;
  productId?: string;
  productStatus: ProductStatus;
};

export type DesignDecision = {
  label: string;
  decision: string;
  result: string;
};

export type CharacterOffer = {
  id: string;
  label: string;
  description: string;
  status: ProductStatus;
  href: string;
  action: string;
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

const heroGraphic = image(
  "page-graphics",
  "hobfarm-mannequin-character-outfit-scene-design.png",
  "Overview of the HobFarm mannequin, outfit, dressed character, and finished scene workflow",
  1672,
  941,
  "One mannequin moving from base design to a finished world",
);

const workflowGraphic = image(
  "page-graphics",
  "hobfarm-mannequin-character-outfit-scene-video-design.png",
  "HobFarm workflow showing mannequin, outfit, character, scene, and video stages",
  1448,
  1086,
  "The complete still-to-motion production route",
);

const wardrobeGraphic = image(
  "page-graphics",
  "hobfarm-mannequin-outfit-design.png",
  "A mannequin and outfit design overview showing wardrobe as a separate production layer",
  1448,
  1086,
  "Wardrobe stays inspectable before it is applied to the character",
);

const sceneTriptychGraphic = image(
  "page-graphics",
  "hobfarm-scene-character-outfit-design.png",
  "Three finished character scenes beside their outfit and character design sources",
  1448,
  1086,
  "Three looks, three worlds, one traceable production record",
);

const themedCharacterGraphic = image(
  "page-graphics",
  "hobfarm-mannequin-character-outfit-design-apply-scene.png",
  "A separate green character moving through outfit, character, and finished scene stages",
  1448,
  1086,
  "The same pipeline applied to a different character identity",
);

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
    id: "look-black-marble",
    displayOrder: 1,
    title: "Look 01 / Black leather in the marble garden",
    shortTitle: "Black leather / Marble garden",
    hook: "Hard black surfaces move into open daylight without losing the mannequin underneath.",
    accent: "#87e9ff",
    outfitImage: blackOutfit,
    characterImage: blackCharacter,
    sceneImage: blackScene,
    video: motion(
      "character-scene-outfit3.mp4",
      blackScene,
      "Short motion reveal from the black leather character frame into the marble garden scene",
      "Look 01 / controlled scene reveal",
    ),
    locked: ["face", "platinum pixie hair", "black clip", "body proportions", "eye-makeup identifier"],
    changed: [
      "lace-up leather crop top and shorts",
      "tall lace-up boots",
      "bag, hoops, necklace, sunglasses, and fan",
      "marble courtyard environment",
      "daylight, ground contact, and scene depth",
    ],
    productionNote:
      "The black leather needs separate edges at the waist, boots, and accessories. The courtyard adds pale stone and daylight so the silhouette stays readable instead of collapsing into one dark mass.",
    productStatus: "coming-soon",
  },
  {
    id: "look-ivory-noir",
    displayOrder: 2,
    title: "Look 02 / Ivory cowl after dark",
    shortTitle: "Ivory cowl / Noir street",
    hook: "A soft draped garment becomes the brightest object in a hard monochrome street.",
    accent: "#e9d29a",
    outfitImage: ivoryOutfit,
    characterImage: ivoryCharacter,
    sceneImage: ivoryScene,
    video: motion(
      "character-scene-outfit2.mp4",
      ivoryScene,
      "Short motion reveal from the ivory cowl character frame into the noir street scene",
      "Look 02 / controlled scene reveal",
    ),
    locked: ["face", "platinum pixie hair", "black clip", "body proportions", "eye-makeup identifier"],
    changed: [
      "draped asymmetrical cowl dress",
      "gold jewelry and cream pouch",
      "heeled mules",
      "monochrome street and classic car",
      "hard noir lighting and long shadow",
    ],
    productionNote:
      "The dress depends on one clean diagonal and a readable cowl. The street scene keeps that pale shape intact, then uses the car, curb, and long shadow to give it weight and direction.",
    productStatus: "coming-soon",
  },
  {
    id: "look-yellow-pool",
    displayOrder: 3,
    title: "Look 03 / Butter yellow by the neon pool",
    shortTitle: "Butter yellow / Neon pool",
    hook: "Warm fabric holds its color while magenta and cyan light move across the scene.",
    accent: "#ffe768",
    outfitImage: yellowOutfit,
    characterImage: yellowCharacter,
    sceneImage: yellowScene,
    video: motion(
      "character-scene-outfit1.mp4",
      yellowScene,
      "Short motion reveal from the butter-yellow character frame into the neon pool scene",
      "Look 03 / controlled scene reveal",
    ),
    locked: ["face", "platinum pixie hair", "black clip", "body proportions", "eye-makeup identifier"],
    changed: [
      "butter-yellow midi dress",
      "gold hoops and pendant",
      "pale shoulder bag and slingbacks",
      "neon pool environment",
      "magenta, cyan, and reflected light",
    ],
    productionNote:
      "The scene can add colored reflections without turning the dress into a different garment. The yellow remains the identity of the look; pool light describes the location around it.",
    productStatus: "coming-soon",
  },
];

export const themedCharacter: CharacterLook = {
  id: "character-green-art-deco",
  displayOrder: 4,
  title: "The same pipeline can build a new character.",
  shortTitle: "Green character / Art Deco room",
  hook:
    "This is a separate identity built through the same production route, not the platinum mannequin under a color filter.",
  accent: "#65e1c2",
  outfitImage: blackOutfit,
  characterImage: greenCharacter,
  sceneImage: greenScene,
  video: motion(
    "character2-scene-outfit3.mp4",
    greenScene,
    "Short motion reveal from the green character frame into a gold and emerald Art Deco room",
    "Character 02 / controlled Art Deco scene reveal",
  ),
  locked: ["green skin", "black and violet bob", "facial stitches", "purple makeup", "character attitude"],
  changed: ["black leather wardrobe", "gold and emerald room", "Art Deco geometry", "warm theatrical light", "motion timing"],
  productionNote:
    "Skin, hair, markings, makeup, and attitude change at the character-DNA level. Outfit, scene, camera, and motion remain separate stages that can still be inspected and replaced.",
  productStatus: "coming-soon",
};

export const designDecisions: DesignDecision[] = [
  { label: "Identity and continuity", decision: "Lock the face, hair silhouette, clip, proportions, and eye identifier first.", result: "The same person remains readable across three garments and three worlds." },
  { label: "Wardrobe construction", decision: "Define the garment as parts, closures, hems, footwear, and layers before staging it.", result: "The dressed character has a traceable outfit instead of improvised clothing." },
  { label: "Material behavior", decision: "Name how leather, draped cloth, metal, and reflective surfaces should hold light.", result: "Black leather, ivory fabric, and yellow cloth stay distinct in the final scenes." },
  { label: "Accessory and prop logic", decision: "Choose jewelry, bags, shoes, and props as one outfit system.", result: "Small objects support the look instead of competing for attention." },
  { label: "Scene direction", decision: "Give each look one environment with a clear spatial job.", result: "Marble opens the black look, noir sharpens the ivory look, and the pool colors the yellow look." },
  { label: "Pose and camera", decision: "Preserve the character read, then choose stance, distance, and camera angle for the scene.", result: "The figure gains context without losing the source silhouette." },
  { label: "Lighting and depth", decision: "Set a dominant light, ground contact, foreground, and background separation.", result: "The character sits inside the world instead of floating in front of it." },
  { label: "Motion plan", decision: "Connect approved character and scene frames with one short, controlled reveal.", result: "The video demonstrates the handoff without hiding continuity errors behind constant movement." },
  { label: "Review and replacement", decision: "Keep every stage visible so a weak garment, face, prop, scene, or clip can be replaced alone.", result: "A revision changes one part of the build instead of restarting the whole character." },
];

const commissionUrl = "/contact/?subject=custom-character";

export const characterOffers: CharacterOffer[] = [
  { id: "mannequin-base", label: "Mannequin base", description: "Reusable face, proportions, silhouette, and sheet for wardrobe or character development.", status: "coming-soon", href: "/shop/", action: "Coming soon" },
  { id: "wardrobe-look", label: "Outfit or wardrobe look", description: "A complete garment system with accessories, footwear, material, and construction logic.", status: "coming-soon", href: "/shop/", action: "Coming soon" },
  { id: "character-pack", label: "Character pack", description: "Character identity, sheet, full-body asset, palette, and design notes.", status: "coming-soon", href: "/shop/", action: "Coming soon" },
  { id: "scene-hero", label: "Character scene", description: "A finished in-world image with directed pose, environment, depth, and lighting.", status: "coming-soon", href: "/shop/", action: "Coming soon" },
  { id: "motion-add-on", label: "Short video", description: "A controlled transition or scene reveal built from approved character frames.", status: "coming-soon", href: "/shop/", action: "Coming soon" },
  { id: "custom-package", label: "Custom character package", description: "A commissioned base, wardrobe, scene, and optional motion package built around a supplied brief.", status: "inquiry", href: commissionUrl, action: "Start a brief" },
];

export const characterMannequinPage = {
  title: "Character Mannequins, Outfit Design, Scenes and Video | HobFarm Workshop",
  description:
    "See one HobFarm mannequin move through complete wardrobe designs, finished character scenes, and short videos, then browse character assets or commission a custom build.",
  basePortrait: portraitOne,
  baseSheet: sheetOne,
  alternatePortrait: portraitTwo,
  alternateSheet: sheetTwo,
  heroGraphic,
  workflowGraphic,
  // The supplied hobfarm-mannequin-design.png URL returned 404 on 2026-07-15.
  mannequinLibraryGraphic: null,
  wardrobeGraphic,
  sceneTriptychGraphic,
  themedCharacterGraphic,
  relatedProducts: ["sophia-stella-sheet-pack"],
  relatedWorkshop: ["/workshop/alter-ego/", "/workshop/stylefusion/"],
  commissionUrl,
  academyUrl: "/academy/",
  shopUrl: "/shop/",
  characterIndexUrl: "/visual-systems/",
  elevenLabsCharacterSheetWorkflowUrl: "https://elevenlabs.io/app/flows/kRlIkuiEdy0X1wC4n56O",
  elevenLabsAssemblyWorkflowUrl: "https://elevenlabs.io/app/flows/eSYyxDGUCh4xbWjUuBKs",
  elevenLabsAffiliateUrl: "https://try.elevenlabs.io/xyeeptwpw4d6",
} as const;
