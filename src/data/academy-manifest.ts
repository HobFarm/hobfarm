export type AcademyCourseStatus = "draft" | "review" | "available" | "archived";
export type AcademyCourseAccess = "public" | "paid" | "mixed";
export type AcademyPriceTier = "free" | "usd_5" | "usd_7";
export type AcademyLab =
  | "character_systems"
  | "avatar_systems"
  | "transformation"
  | "style_systems"
  | "media_literacy";
export type AcademyLessonAccess = "public" | "paid";
export type AcademyEvidenceStatus = "verified" | "needs_operator" | "volatile";

export interface AcademyLessonManifest {
  lessonId: string;
  courseId: string;
  slug: string;
  title: string;
  module: string;
  order: number;
  access: AcademyLessonAccess;
  objective: string;
  builds: string;
  preview: string;
  sourceRefs: string[];
  evidenceStatus: AcademyEvidenceStatus;
  providerDetailDate?: string;
  exercise: string;
  checkpoint: string;
  nextLesson?: string;
  legacyHref?: string;
}

export interface AcademyMediaManifestItem {
  mediaId: string;
  courseId: string;
  lessonId?: string;
  sourceFile: string;
  access: AcademyLessonAccess;
  poster: string;
  width: number;
  height: number;
  duration: string;
  transcript: string;
  captions?: string;
  alt: string;
  rightsNote: string;
  avatarIdentity?: string;
  productionTool?: string;
  toolVersion?: string;
  verifiedAt: string;
  destinations: string[];
}

export interface AcademyCourseManifest {
  courseId: string;
  slug: string;
  title: string;
  subtitle: string;
  status: AcademyCourseStatus;
  publicStatus: "available" | "preview" | "in production" | "planned";
  access: AcademyCourseAccess;
  priceTier: AcademyPriceTier;
  productKey: string | null;
  membershipGrant: "academy_all_access" | null;
  lab: AcademyLab;
  learner: string;
  problem: string;
  outcome: string;
  artifacts: string[];
  prerequisites: string[];
  requiredTools: string[];
  externalCostNote: string;
  estimatedTime: string;
  renderTimeNote?: string;
  workshopSources: string[];
  freePreviewLessons: string[];
  version: number;
  updatedAt: string;
  toolDetailsVerifiedAt: string;
  supportScope: string;
  avatarHost?: string;
  mediaManifest?: AcademyMediaManifestItem[];
  lessons: AcademyLessonManifest[];
  legacyHref?: string;
  checkoutState?: "enabled_when_configured" | "not_for_sale";
  operatorInputRequired?: string[];
}

function linkLessons(
  courseId: string,
  lessons: Omit<AcademyLessonManifest, "courseId" | "nextLesson">[],
): AcademyLessonManifest[] {
  return lessons.map((lesson, index) => ({
    ...lesson,
    courseId,
    nextLesson: lessons[index + 1]?.lessonId,
  }));
}

const publicSource = (path: string) => [path];

const intellectualSelfDefenseLessons = linkLessons("academy-course-self-defense-v1", [
  ["orientation", "the-card-catalog-started-talking-back", "Orientation: The Card Catalog Talks Back"],
  ["research-job", "give-the-chatbot-a-research-job", "Give the Chatbot a Research Job"],
  ["open-receipt", "open-the-receipt", "Open the Receipt"],
  ["ask-audit-rebuild", "ask-audit-rebuild", "Ask, Audit, Rebuild"],
  ["source-files", "source-files-beat-vibes", "Source Files Beat Vibes"],
  ["picture-system", "i-asked-for-a-picture-it-built-a-system", "I Asked for a Picture. It Built a System."],
  ["route-work", "route-the-work", "Route the Work"],
  ["slop", "human-ai-and-hybrid-slop", "Human Slop, AI Slop, Hybrid Slop"],
  ["protocol", "build-your-own-protocol", "Build Your Own Intellectual Self-Defense Protocol"],
].map(([lessonId, slug, title], order) => ({
  lessonId,
  slug,
  title,
  module: order < 4 ? "research" : order < 7 ? "making" : "judgment",
  order,
  access: "public" as const,
  objective: "Practice one part of a source-conscious research and creative method.",
  builds: order === 8 ? "A dated personal protocol." : "A reusable course worksheet or decision record.",
  preview: "A public lesson from HobFarm's practical field guide to working around AI and modern media.",
  sourceRefs: publicSource(`src/content/academy/intellectual-self-defense/${String(order).padStart(2, "0")}-`),
  evidenceStatus: "verified" as const,
  exercise: "Complete the exercise in the public lesson.",
  checkpoint: "Save the lesson artifact before continuing.",
  legacyHref: `/academy/intellectual-self-defense/${slug}/`,
})));

const avatarTitles: Array<[string, string, string, AcademyLessonAccess]> = [
  ["avatar-what-building", "what-you-are-building", "What You Are Building", "public"],
  ["avatar-two-paths", "choose-your-workflow", "Choose Your Workflow", "public"],
  ["avatar-folder", "make-your-project-folder", "Make Your Project Folder", "public"],
  ["avatar-first-prompt", "first-chatgpt-prompt", "First ChatGPT Prompt", "public"],
  ["avatar-source-file", "create-the-starter-source-file", "Create the Starter Source File", "paid"],
  ["avatar-personalization", "set-up-chatgpt-personalization", "Set Up ChatGPT Personalization", "paid"],
  ["avatar-project", "create-a-chatgpt-project", "Create a ChatGPT Project", "paid"],
  ["avatar-screenshots", "screenshot-research-method", "Screenshot Research Method", "paid"],
  ["avatar-concept", "build-your-avatar-concept", "Build Your Avatar Concept", "paid"],
  ["avatar-script", "write-or-speak-your-first-script", "Write or Speak Your First Script", "paid"],
  ["avatar-voice", "create-a-voice-test-in-elevenlabs", "Create a Voice Test in ElevenLabs", "paid"],
  ["avatar-heygen", "create-an-avatar-clip-in-heygen", "Create an Avatar Clip in HeyGen", "paid"],
  ["avatar-file-transfer", "move-files-between-phone-and-laptop", "Move Files Between Phone and Laptop", "paid"],
  ["avatar-exports", "save-and-name-your-exports", "Save and Name Your Exports", "paid"],
  ["avatar-publish", "schedule-in-meta-business-suite", "Publish the Intro and Schedule the Social Cut", "paid"],
  ["avatar-review", "review-the-post-and-make-the-next-one", "Reset the Thread and Make the Next One", "paid"],
];

const avatarLessons = linkLessons("academy-course-avatar-v1", avatarTitles.map(([lessonId, slug, title, access], order) => ({
  lessonId,
  slug,
  title,
  module: order < 4 ? "free-setup" : order < 9 ? "build" : order < 13 ? "publish" : "review",
  order: order + 1,
  access,
  objective: "Complete the next bounded decision in a reusable avatar publishing loop.",
  builds: order < 4 ? "A prepared starter workspace." : "One saved part of the avatar content system.",
  preview: access === "public"
    ? "A public setup lesson for the Avatar Content System Starter Kit."
    : "A guided lesson with exact steps, checks, and a saved production artifact.",
  sourceRefs: publicSource("src/data/avatar-content-system.ts"),
  evidenceStatus: "verified" as const,
  exercise: "Apply the lesson to one platform-neutral avatar introduction.",
  checkpoint: "The named artifact is saved in the project folder.",
  legacyHref: `/academy/avatar-content-system/course/${slug}/`,
})));

const characterLessonSpecs: Array<[
  string,
  string,
  string,
  AcademyLessonAccess,
  string,
  string,
  AcademyEvidenceStatus,
]> = [
  ["character-boundaries", "what-belongs-to-the-character", "What Belongs to the Character?", "public", "Separate identity from wardrobe, style, scene, and motion.", "An identity and wardrobe boundary list.", "verified"],
  ["character-read-failure", "read-the-failure-before-fixing-it", "Read the Failure Before Fixing It", "public", "Find inferred clothing and keep it outside the identity lock.", "A failure annotation.", "verified"],
  ["character-source-job", "define-the-source-and-the-job", "Define the Source and the Job", "paid", "Bound the subject, output, evidence, invention permission, and stop condition.", "A character source record.", "needs_operator"],
  ["character-identity-lock", "write-the-identity-lock", "Write the Identity Lock", "paid", "Record stable traits without turning wardrobe into identity.", "An identity-lock file.", "needs_operator"],
  ["character-clean-base", "remove-wardrobe-and-scene-noise", "Remove Wardrobe and Scene Noise", "paid", "Direct a neutral base while preserving supported identity traits.", "A clean base or mannequin.", "needs_operator"],
  ["character-views", "build-usable-views", "Build Usable Views", "paid", "Make the smallest view set the evidence can support.", "A production sheet with uncertainty marked.", "needs_operator"],
  ["character-two-looks", "same-character-two-looks", "Same Character, Two Looks", "paid", "Change outfit and scene without changing the base.", "Two same-base styling tests.", "needs_operator"],
  ["character-cross-base", "same-look-different-character", "Same Look, Different Character", "paid", "Move one outfit between bases and inspect separation.", "A cross-base transfer test.", "needs_operator"],
  ["character-package", "audit-repair-and-package", "Audit, Repair, and Package", "paid", "Classify drift and package a reusable result.", "A continuity report and final board.", "needs_operator"],
];

const characterLessons = linkLessons("academy-course-character-v1", characterLessonSpecs.map(([
  lessonId,
  slug,
  title,
  access,
  objective,
  builds,
  evidenceStatus,
], order) => ({
  lessonId,
  slug,
  title,
  module: order < 2 ? "read-the-system" : order < 6 ? "build-the-base" : "test-and-package",
  order: order + 1,
  access,
  objective,
  builds,
  preview: `${objective} Finish with ${builds.charAt(0).toLowerCase()}${builds.slice(1)}`,
  sourceRefs: ["/workshop/character-mannequin/", "docs/character-system/hobfarm-workshop-system.md"],
  evidenceStatus,
  exercise: "Apply the boundary or continuity test to the supplied HobFarm example, then to one learner-owned source.",
  checkpoint: `Save ${builds.charAt(0).toLowerCase()}${builds.slice(1)}`,
})));

export const academyMediaManifest: AcademyMediaManifestItem[] = [
  {
    mediaId: "character-mannequin-workflow-film-v1",
    courseId: "academy-course-character-v1",
    sourceFile: "public/media/workshop/character-mannequin/mannequin-workflow-film.mp4",
    access: "public",
    poster: "/media/workshop/character-mannequin/mannequin-workflow-film-poster.png",
    width: 1920,
    height: 1080,
    duration: "16 seconds",
    transcript: "Build the system before the identity. Proportions, silhouette, and movement stay consistent. Face, hair, palette, and wardrobe create identity. Test the design through camera, scene, and motion. One approved base can carry many identities.",
    captions: "/media/workshop/character-mannequin/mannequin-workflow-film-captions.vtt",
    alt: "A short workflow film showing a stable mannequin moving through controlled character transformations.",
    rightsNote: "HobFarm production asset documented in the Workshop media registry.",
    productionTool: "HyperFrames",
    toolVersion: "0.7.80",
    verifiedAt: "2026-08-06",
    destinations: ["/workshop/character-mannequin/", "/academy/courses/keep-the-character/"],
  },
];

export const academyCourseManifests: AcademyCourseManifest[] = [
  {
    courseId: "academy-course-self-defense-v1",
    slug: "intellectual-self-defense",
    title: "Intellectual Self-Defense for Ordinary People",
    subtitle: "Use AI and modern media without outsourcing your judgment.",
    status: "available",
    publicStatus: "available",
    access: "public",
    priceTier: "free",
    productKey: null,
    membershipGrant: null,
    lab: "media_literacy",
    learner: "Anyone who researches, makes, or shares work with modern media tools.",
    problem: "Fast answers and generated material can hide weak sources, invented facts, and unexamined decisions.",
    outcome: "A source-conscious research method, creative source file, output receipt, and personal protocol.",
    artifacts: ["Research Assistant Contract", "Creative Source File", "AI Output Receipt", "Personal Protocol"],
    prerequisites: ["A web browser", "A subject you can investigate or make"],
    requiredTools: ["A browser", "Optional chatbot account"],
    externalCostNote: "No paid tool is required.",
    estimatedTime: "About 2 hours, plus exercises",
    workshopSources: ["/workshop/"],
    freePreviewLessons: intellectualSelfDefenseLessons.map((lesson) => lesson.lessonId),
    version: 1,
    updatedAt: "2026-07-31",
    toolDetailsVerifiedAt: "2026-07-31",
    supportScope: "Customer Help covers broken links and site access. It does not evaluate personal research conclusions.",
    lessons: intellectualSelfDefenseLessons,
    legacyHref: "/academy/intellectual-self-defense/",
    checkoutState: "not_for_sale",
  },
  {
    courseId: "academy-course-avatar-v1",
    slug: "avatar-content-system",
    title: "Avatar Content System Starter Kit",
    subtitle: "Build one reusable avatar introduction and the small publishing system around it.",
    status: "available",
    publicStatus: "available",
    access: "mixed",
    priceTier: "usd_7",
    productKey: "academy_avatar_content_system_v1",
    membershipGrant: "academy_all_access",
    lab: "avatar_systems",
    learner: "A beginner making a first honest, reusable avatar post.",
    problem: "Ideas, scripts, voice tests, clips, captions, and review notes disappear into disconnected tools and downloads.",
    outcome: "A platform-neutral avatar introduction, master export, placement captions, and reusable source file.",
    artifacts: ["Starter source file", "Avatar brief", "Script", "Master export", "Placement captions", "Review note"],
    prerequisites: ["A HobFarm account for paid lessons", "A phone or computer", "One topic to explain"],
    requiredTools: ["ChatGPT or an alternative writing tool", "An avatar tool for the worked example", "A file system"],
    externalCostNote: "Avatar, voice, and scheduling providers may charge separately. Those costs are not included in the $7 course price.",
    estimatedTime: "About 3 hours of learner work",
    renderTimeNote: "Avatar generation and provider review time vary and are not included.",
    workshopSources: ["/workshop/avatar-host/", "/workshop/future-carriage/"],
    freePreviewLessons: avatarLessons.filter((lesson) => lesson.access === "public").map((lesson) => lesson.lessonId),
    version: 1,
    updatedAt: "2026-08-06",
    toolDetailsVerifiedAt: "2026-08-06",
    supportScope: "Customer Help covers billing, entitlement repair, and broken course pages. It does not provide custom avatar production.",
    avatarHost: "ami",
    lessons: avatarLessons,
    legacyHref: "/academy/avatar-content-system/course/",
    checkoutState: "enabled_when_configured",
  },
  {
    courseId: "academy-course-character-v1",
    slug: "keep-the-character",
    title: "Keep the Character — Build a Stable Mannequin and Continuity Test",
    subtitle: "Separate identity from wardrobe, style, scene, and motion before you ask for another look.",
    status: "review",
    publicStatus: "preview",
    access: "mixed",
    priceTier: "usd_7",
    productKey: "academy_keep_the_character_v1",
    membershipGrant: "academy_all_access",
    lab: "character_systems",
    learner: "A beginner or intermediate image-maker who can make a portrait but cannot keep identity and styling separate.",
    problem: "A wardrobe change becomes a new character, while a guessed outfit can be absorbed into identity.",
    outcome: "A clean base, identity lock, two wardrobe tests, a cross-base transfer test, and a continuity audit.",
    artifacts: ["Source record", "Identity-lock sheet", "Clean base", "Production sheet", "Two outfit assets", "Continuity report", "Final board"],
    prerequisites: ["Rights to use the source subject", "At least one source portrait or character record", "An image workflow you can repeat"],
    requiredTools: ["An image generation or editing tool", "A text editor", "A folder for production records"],
    externalCostNote: "Image generation and editing costs are not included.",
    estimatedTime: "About 4 hours of learner work",
    renderTimeNote: "Generation and manual correction time vary by tool and source quality.",
    workshopSources: ["/workshop/character-mannequin/", "/workshop/workshop-notes/"],
    freePreviewLessons: ["character-boundaries", "character-read-failure"],
    version: 1,
    updatedAt: "2026-08-06",
    toolDetailsVerifiedAt: "2026-08-06",
    supportScope: "Customer Help covers access and broken material. The course does not guarantee model consistency or include custom image repair.",
    mediaManifest: academyMediaManifest,
    lessons: characterLessons,
    checkoutState: "not_for_sale",
    operatorInputRequired: [
      "Complete the course from a clean account without undocumented steps.",
      "Record the exact HobFarm correction used for at least one failed output.",
      "Approve the final production board and tool-detail callouts.",
      "Verify paid access, media transcript, price mapping, refund route, and leakage scan.",
    ],
  },
];

const scaffoldDefinitions: Array<Pick<AcademyCourseManifest,
  "courseId" | "slug" | "title" | "priceTier" | "lab" | "problem" | "outcome" | "workshopSources"
>> = [
  { courseId: "academy-course-cute-corrupted-v1", slug: "one-base-two-modes", title: "One Base, Two Modes — Cute & Corrupted", priceTier: "usd_5", lab: "character_systems", problem: "A tonal variation changes so much that the pair no longer reads as one base.", outcome: "A cute baseline, corruption rule, paired test, and continuity check.", workshopSources: ["/workshop/cute-and-corrupted/", "/workshop/character-mannequin/"] },
  { courseId: "academy-course-before-after-v1", slug: "lock-the-frame-change-the-world", title: "Lock the Frame, Change the World — Before & After", priceTier: "usd_7", lab: "transformation", problem: "A transformation loses the subject, camera, geometry, or source evidence.", outcome: "A labeled transformation with locked anchors and a failure record.", workshopSources: ["/workshop/before-and-after/"] },
  { courseId: "academy-course-alter-ego-v1", slug: "one-identity-two-jobs", title: "One Identity, Two Jobs — Alter Ego", priceTier: "usd_5", lab: "character_systems", problem: "Two personas collapse into styling or drift into unrelated characters.", outcome: "Shared identity locks, two persona records, a paired hero, and a role map.", workshopSources: ["/workshop/alter-ego/", "/workshop/character-mannequin/"] },
  { courseId: "academy-course-style-system-v1", slug: "style-is-a-system", title: "Style Is a System, Not a Prompt", priceTier: "usd_7", lab: "style_systems", problem: "A named aesthetic produces the model's average costume, palette, pose, and taste.", outcome: "A provider-portable style source file, baseline, two controlled changes, and a default audit.", workshopSources: ["/workshop/workshop-notes/", "/workshop/stylefusion/"] },
  { courseId: "academy-course-host-cast-v1", slug: "build-a-recurring-host-cast", title: "Build a Recurring Host Cast", priceTier: "usd_7", lab: "avatar_systems", problem: "Every host appearance becomes a new person, voice, look, or disconnected clip.", outcome: "A stable identity group, role looks, voice and motion brief, presenter clip, and media record.", workshopSources: ["/workshop/avatar-host/"] },
];

const scaffoldLessonTitles: Record<string, string[]> = {
  "one-base-two-modes": ["Define the Shared Base", "Establish the Cute Baseline", "Write the Corruption Rule", "Choose Controlled Changes", "Build the Pair", "Check Continuity", "Package the Series Proof"],
  "lock-the-frame-change-the-world": ["Classify the Transformation", "Inspect Rights and Source Evidence", "Lock the Visible Anchors", "Define the Change", "Build the Transformation", "Inspect Failed Frames", "Label Fact and Invention", "Publish the Sequence"],
  "one-identity-two-jobs": ["Define the Shared Identity", "Give Each Persona a Job", "Separate the Persona Signals", "Build Related Visual Systems", "Test the Pair Together", "Produce the Hero Evidence", "Route Each Persona"],
  "style-is-a-system": ["Audit the Default Answer", "Separate the Visual Roles", "Extract Visible Rules", "Build the Baseline", "Apply One Controlled Change", "Apply a Second Change", "Compare Failure and Drift", "Write the Reusable Style System", "Package for Another Job"],
  "build-a-recurring-host-cast": ["Define the Host Group", "Lock Identity and Role Boundaries", "Build Two Role-Specific Looks", "Write the Voice and Motion Brief", "Map Destinations", "Produce a Presenter Clip", "Save the Media Registry Entry"],
};

export const academyCourseScaffolds: AcademyCourseManifest[] = scaffoldDefinitions.map((course) => ({
  ...course,
  subtitle: course.outcome,
  status: "draft",
  publicStatus: "planned",
  access: "mixed",
  productKey: null,
  membershipGrant: "academy_all_access",
  learner: "A learner with a specific HobFarm-style production problem and source material they are allowed to use.",
  artifacts: [course.outcome],
  prerequisites: ["A source file or source asset", "Rights to use the material"],
  requiredTools: ["A suitable image, motion, or text workflow"],
  externalCostNote: "Provider costs are not included. Exact tools remain under review.",
  estimatedTime: "To be verified during the operator walkthrough",
  freePreviewLessons: [],
  version: 1,
  updatedAt: "2026-08-06",
  toolDetailsVerifiedAt: "2026-08-06",
  supportScope: "Draft course. Support and tool details are not final.",
  lessons: linkLessons(course.courseId, (scaffoldLessonTitles[course.slug] ?? []).map((title, order) => ({
    lessonId: `${course.slug}-lesson-${order + 1}`,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    title,
    module: "draft-outline",
    order: order + 1,
    access: "paid" as const,
    objective: `Complete the source-backed decision named “${title}.”`,
    builds: `A saved step toward ${course.outcome.charAt(0).toLowerCase()}${course.outcome.slice(1)}`,
    preview: "Outline only. Exact instruction waits for the operator walkthrough and source-map review.",
    sourceRefs: course.workshopSources,
    evidenceStatus: "needs_operator" as const,
    exercise: "OPERATOR_INPUT_REQUIRED: record the worked HobFarm example and learner variation.",
    checkpoint: "OPERATOR_INPUT_REQUIRED: define the observable completion test.",
  }))),
  checkoutState: "not_for_sale",
  operatorInputRequired: ["Complete the source map.", "Record a clean operator walkthrough.", "Approve lesson text, media, price mapping, and support boundary."],
}));

export const allAcademyCourseManifests = [...academyCourseManifests, ...academyCourseScaffolds];

export function getAcademyManifest(slug: string): AcademyCourseManifest | undefined {
  return allAcademyCourseManifests.find((course) => course.slug === slug);
}

export function getAcademyLesson(courseSlug: string, lessonSlug: string): AcademyLessonManifest | undefined {
  return getAcademyManifest(courseSlug)?.lessons.find((lesson) => lesson.slug === lessonSlug);
}

export function academyCourseHref(course: AcademyCourseManifest): string {
  return `/academy/courses/${course.slug}/`;
}

export function academyLessonHref(course: AcademyCourseManifest, lesson: AcademyLessonManifest): string {
  return `/academy/courses/${course.slug}/${lesson.slug}/`;
}

export function academyPriceLabel(priceTier: AcademyPriceTier): string {
  return priceTier === "free" ? "Free" : priceTier === "usd_5" ? "$5 one time" : "$7 one time";
}
