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

const otherAliceMedia: MediaRecord = {
  src: "https://cdn.hob.farm/pages/other-alice-adventures/other-alice-wonderland-wasteland-poster.webp",
  mediaType: "image",
  width: 900,
  height: 1350,
  destination: "/presents/other-alice-adventures/",
  role: "series-poster",
  alt: "Other Alice stands at the boundary between wet Wonderland and the dry geometric Wasteland",
  status: "active",
};

export const homepageFeatures: readonly HomepageFeature[] = [
  {
    id: "other-alice",
    format: "HobFarm Presents / Interactive world",
    title: "Other Alice Adventures",
    description:
      "An illustrated serial, public world archive, and developing interactive story system built around authored choices and persistent history.",
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
