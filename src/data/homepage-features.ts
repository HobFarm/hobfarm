import { getMedia, type MediaRecord } from "@/data/media-registry";

export type HomepageFeature = {
  id: string;
  format: string;
  title: string;
  description: string;
  href: string;
  media: MediaRecord;
  status: "published" | "draft";
};

const otherAliceMedia = getMedia("other-alice.alice.workshop");

export const homepageFeatures: readonly HomepageFeature[] = [
  {
    id: "other-alice",
    format: "HobFarm Presents / Persistent story game",
    title: "Other Alice Adventures",
    description:
      "Enter an authored Wonderland where choices, relationships, time, and consequences become the long-form story of a particular campaign.",
    href: "/presents/other-alice-adventures/",
    media: otherAliceMedia,
    status: "published",
  },
  {
    id: "character-mannequin",
    format: "Workshop / Character production",
    title: "Character / Mannequin",
    description:
      "A neutral base is tested for proportion, face, wardrobe, camera, scene, and motion before a character profile is applied.",
    href: "/workshop/character-mannequin/",
    media: getMedia("workshop.character-mannequin.workflow"),
    status: "published",
  },
  {
    id: "stylefusion",
    format: "Application / Production system",
    title: "StyleFusion",
    description:
      "A reference-analysis application that gives each source a job and turns visual evidence into an inspectable production document.",
    href: "/workshop/stylefusion/",
    media: getMedia("stylefusion.banner.image"),
    status: "published",
  },
];

export function getPublishedHomepageFeatures() {
  return homepageFeatures.filter(
    (feature) =>
      feature.status === "published"
      && feature.href.startsWith("/")
      && feature.media.src.length > 0,
  );
}
