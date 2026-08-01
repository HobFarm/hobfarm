import { getMedia, type MediaRecord } from "@/data/media-registry";

// Avatars are the presenters HobFarm builds through the Avatar & Host method.
// They are not comic characters and not Other Alice residents; they are
// documented at /workshop/avatar-host/ and their finished content ships to a
// social platform.

export type AvatarStatus = "active" | "retired";

export type Avatar = {
  slug: string;
  name: string;
  /** Stable identifier used in production records, e.g. AV-EM-001. */
  logicalId?: string;
  role: string;
  /** Where this avatar's finished content is published. */
  platform: string;
  status: AvatarStatus;
  /** PsyGoth trio lane, when the avatar belongs to it. */
  lane?: string;
  accent?: string;
  profile?: MediaRecord;
  /** Group slug, so a set like the PsyGoth trio can be read together. */
  group?: string;
};

// Role strings are the published copy from /workshop/avatar-host/. Platforms
// are where each avatar's finished content ships.
export const avatars: Avatar[] = [
  {
    slug: "hillary",
    name: "Hillary",
    logicalId: "AV-HIL-001",
    role: "Editorial and Workshop guide",
    platform: "YouTube",
    status: "active",
    profile: getMedia("avatar.identity.hillary"),
  },
  {
    slug: "ami",
    name: "Ami",
    logicalId: "AV-AMI-001",
    role: "Social and commercial presenter",
    platform: "Instagram",
    status: "active",
    profile: getMedia("avatar.identity.ami"),
  },
  {
    slug: "em",
    name: "Em",
    logicalId: "AV-EM-001",
    role: "PsyGoth / green / growth",
    platform: "Mixed",
    status: "active",
    lane: "Green",
    accent: "#7ecf8a",
    profile: getMedia("avatar.identity.em"),
    group: "psygoth",
  },
  {
    slug: "nina",
    name: "Nina",
    logicalId: "AV-NIN-001",
    role: "PsyGoth / red / pressure",
    platform: "Mixed",
    status: "active",
    lane: "Red",
    accent: "#f05c6d",
    profile: getMedia("avatar.identity.nina"),
    group: "psygoth",
  },
  {
    slug: "zima",
    name: "Zima",
    logicalId: "AV-ZIM-001",
    role: "PsyGoth / blue / structure",
    platform: "Mixed",
    status: "active",
    lane: "Blue",
    accent: "#66b9ff",
    profile: getMedia("avatar.identity.zima"),
    group: "psygoth",
  },
  {
    slug: "hobgal",
    name: "Hobgal",
    logicalId: "AV-HOB-001",
    role: "Retired presenter prototype",
    platform: "None",
    status: "retired",
    profile: getMedia("avatar.identity.hobgal"),
  },
];

const avatarBySlug = new Map(avatars.map((a) => [a.slug, a]));

export function getAvatar(slug: string | undefined | null): Avatar | undefined {
  return slug ? avatarBySlug.get(slug) : undefined;
}

export const activeAvatars = avatars.filter((a) => a.status === "active");

export function avatarsInGroup(group: string): Avatar[] {
  return avatars.filter((a) => a.group === group);
}

export const AVATAR_HOST_PATH = "/workshop/avatar-host/";
