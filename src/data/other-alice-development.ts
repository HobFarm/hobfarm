import { OTHER_ALICE_ROOT_PATH } from "@/data/other-alice/canon";
import { OTHER_ALICE_WORLD_GUIDE_PATH } from "@/data/other-alice-world-guide";

/**
 * Public-safe projection of the current Other Alice interactive-development
 * state. Grimoire remains the authority for authored world knowledge and
 * Wonder Machine owns runtime behavior. This record only keeps the website's
 * status language, routes, and supported public claims aligned.
 */
export const otherAliceDevelopment = {
  localPrototypeStatus: "Working locally",
  publicAvailability: "Public play is still in development",
  statusLine: "Working locally. Public play is still in development.",
  currentCapabilities: [
    "an explorable park with an optional anomaly objective",
    "partial map knowledge and changing manifestations",
    "authored transformations and conditional portals",
    "persistent choices, relationships, and scheduled events",
    "saves, deterministic replay, and world time between sessions",
    "campaigns that remain playable when the apparent objective is refused",
  ],
  routes: {
    otherAlice: OTHER_ALICE_ROOT_PATH,
    worldGuide: OTHER_ALICE_WORLD_GUIDE_PATH,
    grimoire: "/grimoire/",
  },
  systemBoundary: [
    "Grimoire: authored world",
    "compiled opening pack",
    "Wonder Machine: visit and time",
    "campaign history",
  ],
  lastVerified: "2026-07-28",
} as const;

