import {
  OTHER_ALICE_HOUSES_PATH,
  OTHER_ALICE_ROOT_PATH,
  OTHER_ALICE_WEB_PATH,
  OTHER_ALICE_WORLD_GUIDE_PATH,
} from "./canon";

export const otherAliceProjectNav = [
  { id: "start", label: "Start Here", href: OTHER_ALICE_ROOT_PATH },
  { id: "world-guide", label: "World Guide", href: OTHER_ALICE_WORLD_GUIDE_PATH },
  { id: "houses", label: "Houses", href: OTHER_ALICE_HOUSES_PATH },
  { id: "web", label: "Web of Wonderland", href: OTHER_ALICE_WEB_PATH },
] as const;

export const worldGuideSectionNav = [
  ["regions", "Regions"], ["routes", "Routes"], ["access", "Access"],
  ["time", "Time"], ["visitors", "Visitors"], ["ecology", "Ecology"],
  ["residents", "Residents"], ["boundary", "Boundary"],
] as const;
