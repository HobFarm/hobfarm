import { getMedia } from "@/data/media-registry";

export type AvatarHostMediaStatus = "planned" | "active" | "historical" | "retired" | "blocked";

/**
 * Public production metadata for recurring host media.
 * Provider voice and avatar-group identifiers are intentionally excluded.
 */
export type AvatarHostMediaRecord = {
  id: string;
  title: string;
  status: AvatarHostMediaStatus;
  poster?: string;
  videoUrl?: string;
  transcriptUrl?: string;
  durationSeconds?: number;
  destinationUrls: readonly string[];
};

const amiIntro = getMedia("workshop.ami-legacy.intro.video");
const hobgalVideo = getMedia("avatar-host.hobgal.prototype.video");
const hobgalTranscript = getMedia("avatar-host.hobgal.prototype.transcript");
const futureCarriagePoster = getMedia("workshop.ami-legacy.hero");

export const avatarHostMedia: readonly AvatarHostMediaRecord[] = [
  {
    id: "ami-introduction",
    title: "Ami introduction",
    status: "active",
    poster: amiIntro.poster,
    videoUrl: amiIntro.src,
    durationSeconds: 36,
    destinationUrls: ["/workshop/avatar-host/", "/workshop/future-carriage/", "/academy/avatar-content-system/"],
  },
  {
    id: "ami-future-carriage-campaign",
    title: "Ami / Future Carriage campaign clips",
    status: "planned",
    poster: futureCarriagePoster.src,
    destinationUrls: ["/workshop/avatar-host/", "/workshop/future-carriage/"],
  },
  {
    id: "hobgal-prototype",
    title: "Hobgal prototype",
    status: "historical",
    poster: hobgalVideo.poster,
    videoUrl: hobgalVideo.src,
    transcriptUrl: hobgalTranscript.src,
    destinationUrls: ["/workshop/avatar-host/"],
  },
];
