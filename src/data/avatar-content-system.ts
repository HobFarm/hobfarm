import type { ContentRelationships, ToolRoute } from "@/lib/content-relationships";

export type TrackTag = "Voice/Phone" | "Text/Computer" | "Both";
export type LessonAccess = "free" | "paid";

export interface Snippet {
  title: string;
  body: string;
  note?: string;
}

export interface LessonPreview {
  number: number;
  slug: string;
  title: string;
  access: LessonAccess;
  trackTags: TrackTag[];
  moduleTitle: string;
  preview: string;
  relationships?: ContentRelationships;
  toolRoute?: ToolRoute;
}

export interface FreeLesson extends LessonPreview {
  goal: string;
  whatYouNeed: string[];
  steps: string[];
  snippets: Snippet[];
  checklist: string[];
  doneWhen: string[];
  nextLessonSlug?: string;
}

export interface ToolLink {
  name: string;
  role: string;
  href: string | null;
  affiliate: boolean;
}

export const avatarCourse = {
  productName: "Avatar Content System Starter Kit",
  slug: "avatar-content-system",
  basePath: "/academy/avatar-content-system",
  coursePath: "/academy/avatar-content-system/course",
  freePath: "/academy/avatar-content-system/free",
  checkoutPath: "/membership",
  loginPath: "/login?next=/academy/avatar-content-system/course",
  betaCta: "Supporter beta access, $5/mo while this starter kit is in beta.",
  frameLabel: "A beginner course inside Aesthetic Systems Lab",
  summary:
    "A beginner course inside Aesthetic Systems Lab for building a repeatable avatar content system: one short avatar video from rough idea to script, export, caption, scheduled post, and review note.",
  thesis:
    "This is still the starter kit. It teaches the smallest complete loop first, then shows how that loop can grow into broader aesthetic systems work without turning the beginner course into a full lab.",
  affiliateDisclosure:
    "Some tool links may be affiliate links. The course is built around tools I use, test, or teach because they fit the workflow.",
};

export const affiliateTools: ToolLink[] = [
  {
    name: "ChatGPT",
    role: "Idea capture, project memory, scripts, rewrites, checklists, and review notes.",
    href: "https://chatgpt.com/",
    affiliate: false,
  },
  {
    name: "HeyGen",
    role: "Avatar clip creation once the script and voice direction are stable.",
    href: null,
    affiliate: true,
  },
  {
    name: "ElevenLabs",
    role: "Voice tests, sample direction, pacing notes, and reusable voice references.",
    href: null,
    affiliate: true,
  },
  {
    name: "Meta Business Suite",
    role: "Scheduling and reviewing finished posts after the files are exported.",
    href: "https://business.facebook.com/",
    affiliate: false,
  },
];

export const workflowPaths = [
  {
    title: "Voice/Phone",
    body:
      "For people who think out loud, use ChatGPT voice mode, take screenshots, record quick samples, and need a bridge from phone chaos to laptop work.",
    steps: ["Talk", "Screenshot", "Save", "Send to laptop", "Assemble"],
  },
  {
    title: "Text/Computer",
    body:
      "For people who type, organize folders, write scripts, edit files, and want the work to live primarily on a laptop or desktop.",
    steps: ["Type", "Organize", "Draft", "Export files", "Schedule"],
  },
];

export const mergedWorkflow = [
  "Idea",
  "ChatGPT",
  "Script",
  "Voice",
  "Avatar",
  "Export",
  "Edit",
  "Schedule",
  "Review",
];

export const castMethod = [
  {
    term: "Collect",
    body:
      "Capture the rough idea, screenshots, voice notes, references, and constraints before asking for a script.",
  },
  {
    term: "Arrange",
    body:
      "Put the useful pieces into one starter source file so the work has a shape outside the chat thread.",
  },
  {
    term: "Set",
    body:
      "Choose the avatar role, visual lane, voice direction, boundaries, and current output for this one post.",
  },
  {
    term: "Task",
    body:
      "Give ChatGPT or the next tool one clear job: write, test, export, schedule, review, or reset for the next post.",
  },
];

export const whereThisFits = [
  {
    title: "This starter kit",
    body:
      "The first outcome stays beginner-sized: one short avatar video, one saved source file, one script, one export, one caption, one scheduled post, and one review note.",
    href: avatarCourse.basePath,
    cta: "You are here",
  },
  {
    title: "Aesthetic Systems Lab",
    body:
      "Future lab material expands the same habits into visual systems, recurring casts, style lanes, character roles, and larger publishing workflows.",
    href: null,
    cta: "In production",
  },
  {
    title: "Color Becomes a Cast",
    body:
      "The public article shows the broader direction: turning color, aesthetics, and avatar roles into a reusable cast instead of isolated images.",
    href: "/articles/color-becomes-a-cast/",
    cta: "Read the article",
  },
];

export const projectFolderSetup = [
  "avatar-content-system/",
  "avatar-content-system/01-ideas/",
  "avatar-content-system/02-screenshots/",
  "avatar-content-system/03-scripts/",
  "avatar-content-system/04-voice-tests/",
  "avatar-content-system/05-avatar-clips/",
  "avatar-content-system/06-exports/",
  "avatar-content-system/07-scheduled-posts/",
  "avatar-content-system/08-review-notes/",
];

export const starterPrompts: Snippet[] = [
  {
    title: "Turn a messy idea into a video angle",
    body:
      "I want to make a short avatar video about [topic]. I am a beginner and I do not want hype, guru language, or fake urgency. Ask me five practical questions, then turn my answers into three simple video angles.",
  },
  {
    title: "Rewrite for a natural avatar voice",
    body:
      "Rewrite this as a 45 to 60 second avatar script. Keep it direct, conversational, and useful. Remove filler, fake excitement, and anything that sounds like a course ad. Script: [paste draft]",
  },
  {
    title: "Screenshot rescue",
    body:
      "I am going to paste rough notes from screenshots and voice notes. Organize them into: idea, useful details, missing details, possible hook, script outline, and next action. Do not invent facts I did not provide.",
  },
  {
    title: "Next-post review",
    body:
      "Review this finished avatar post plan like a practical editor. Tell me what is clear, what is confusing, what can be cut, and what the next video should test. Keep the notes short enough to use today.",
  },
];

export const landingSections = {
  helpsMake: [
    "Short avatar videos for Instagram, Facebook, TikTok, YouTube Shorts, or LinkedIn.",
    "A small source file that keeps the idea, avatar role, visual lane, voice, boundaries, current output, and next task together.",
    "A repeatable file setup so scripts, voice tests, clips, captions, and scheduled posts do not vanish into random downloads.",
    "A first reusable content process that is realistic for beginners and small solo projects.",
  ],
  freeIncludes: [
    "The system overview and workflow map.",
    "Voice/Phone and Text/Computer path selection.",
    "The starter project-folder setup.",
    "First ChatGPT prompts for messy ideas, scripts, screenshots, and review.",
  ],
  paidIncludes: [
    "Detailed modular lessons with exact steps.",
    "A starter source-file lesson before deeper ChatGPT, voice, or avatar setup.",
    "Screenshot slots for building the course into a real workspace.",
    "Copyable prompts, snippets, checklists, and review notes.",
    "Walkthroughs for ChatGPT, ElevenLabs, HeyGen, file movement, exports, scheduling, and post review.",
  ],
};

export const faqItems = [
  {
    question: "Is this a get-rich-with-AI course?",
    answer:
      "No. It is a workflow course. The point is to get one useful avatar video made, saved, scheduled, and reviewed without pretending the tool stack is magic.",
  },
  {
    question: "Do I need all four tools on day one?",
    answer:
      "No. The free overview starts with ChatGPT and folders. The paid lessons add the voice, avatar, export, and scheduling pieces in order.",
  },
  {
    question: "Why are there two tracks?",
    answer:
      "Some people think with their mouth and phone. Some people think with text and files. Both are valid, but they need different instructions before they merge into the same finished-video workflow.",
  },
  {
    question: "Will the course be a PDF?",
    answer:
      "No. The starter kit is built as a gated course because the useful parts are snippets, walkthroughs, checklists, screenshots, and updates.",
  },
  {
    question: "Can I use other avatar or voice tools?",
    answer:
      "Yes. The examples use HeyGen and ElevenLabs because they fit this workflow, but the file naming, scripting, review, and scheduling habits transfer.",
  },
];

const freeLessonData: FreeLesson[] = [
  {
    number: 1,
    slug: "what-you-are-building",
    title: "What You Are Building",
    access: "free",
    trackTags: ["Both"],
    moduleTitle: "Free setup",
    preview:
      "Define the finished thing: one short avatar video, a saved script, reusable files, and a review note for the next post.",
    goal:
      "Understand the starter system before touching every tool at once.",
    whatYouNeed: ["A phone or laptop.", "A place to save files.", "One topic you can explain simply."],
    steps: [
      "Pick one useful topic, not a whole content empire.",
      "Define the finished post as a short avatar video with a script, voice direction, export file, caption, and review note.",
      "Write down where your rough ideas usually start: phone notes, screenshots, voice mode, desktop docs, or chat threads.",
      "Choose one place where the finished files will live before you start generating anything.",
    ],
    snippets: [
      {
        title: "Finished-post definition",
        body:
          "For this course, a finished post means: one short avatar video, one saved script, one exported clip, one caption draft, one scheduled post, and one review note for the next version.",
      },
    ],
    checklist: [
      "I know what the first finished avatar video should be.",
      "I know where rough ideas usually start for me.",
      "I picked one storage location for course files.",
    ],
    doneWhen: [
      "You can describe the first video in one sentence.",
      "You know whether you are starting closer to Voice/Phone or Text/Computer.",
    ],
    nextLessonSlug: "choose-your-workflow",
  },
  {
    number: 2,
    slug: "choose-your-workflow",
    title: "Choose Your Workflow",
    access: "free",
    trackTags: ["Voice/Phone", "Text/Computer"],
    moduleTitle: "Free setup",
    preview:
      "Pick the track that matches how you actually work, then merge into the same shared avatar video process.",
    goal:
      "Choose the track that removes friction instead of copying someone else's desk setup.",
    whatYouNeed: ["Your usual note-taking device.", "One honest answer about how you think best."],
    steps: [
      "Choose Voice/Phone if you explain ideas out loud, take screenshots, or start work away from the desk.",
      "Choose Text/Computer if you prefer typed notes, folders, script files, and desktop editing.",
      "Do not treat the tracks as personality labels. They are starting points.",
      "Write your track at the top of your first course note.",
    ],
    snippets: [
      {
        title: "Track declaration",
        body:
          "My starting track is [Voice/Phone or Text/Computer]. I usually capture ideas by [voice notes, screenshots, typed notes, saved links, chat threads]. My first friction point is [where work gets lost].",
      },
    ],
    checklist: [
      "I picked one starting track.",
      "I named the place where work usually gets messy.",
      "I understand both tracks merge before the final video is made.",
    ],
    doneWhen: [
      "You know which lesson notes to prioritize when the course says Voice/Phone, Text/Computer, or Both.",
    ],
    nextLessonSlug: "make-your-project-folder",
  },
  {
    number: 3,
    slug: "make-your-project-folder",
    title: "Make Your Project Folder",
    access: "free",
    trackTags: ["Text/Computer", "Both"],
    moduleTitle: "Free setup",
    preview:
      "Set up a boring folder structure that saves you from hunting through downloads, camera roll, and chat history later.",
    goal:
      "Create a project folder that can hold ideas, screenshots, scripts, voice tests, avatar clips, exports, scheduled posts, and review notes.",
    whatYouNeed: ["A laptop or desktop if possible.", "A synced drive if you work from phone and computer."],
    steps: [
      "Create a folder named avatar-content-system.",
      "Add the numbered folders from the setup list.",
      "If you use a phone, put the folder somewhere you can reach from both phone and laptop.",
      "Save a blank note called first-video-review.txt in 08-review-notes.",
    ],
    snippets: [
      {
        title: "Folder setup",
        body: projectFolderSetup.join("\n"),
        note: "Use these exact names for the first pass. Rename later after you know what you actually use.",
      },
    ],
    checklist: [
      "The main folder exists.",
      "All numbered subfolders exist.",
      "The folder is reachable from the device where I capture ideas.",
      "A blank review note exists.",
    ],
    doneWhen: [
      "You can save a script, voice test, avatar clip, and final export without thinking about where each file goes.",
    ],
    nextLessonSlug: "first-chatgpt-prompt",
  },
  {
    number: 4,
    slug: "first-chatgpt-prompt",
    title: "First ChatGPT Prompt",
    access: "free",
    trackTags: ["Both"],
    moduleTitle: "Free setup",
    preview:
      "Use ChatGPT to turn a rough idea into questions, angles, and a first script direction without pretending prompts solve everything.",
    goal:
      "Start a ChatGPT thread that organizes your first avatar video idea into a usable next step.",
    whatYouNeed: ["A ChatGPT account.", "One rough idea.", "Your selected workflow track."],
    steps: [
      "Open ChatGPT and start a new chat.",
      "Paste the starter prompt that matches your current mess: idea, script, screenshot, or review.",
      "Answer the follow-up questions in plain language.",
      "Save the best response into your project folder.",
      "Do not chase ten prompts. Get one useful draft into the system.",
    ],
    snippets: starterPrompts,
    checklist: [
      "A ChatGPT thread exists for the first video.",
      "The thread includes the anti-hype instruction.",
      "A useful draft or outline is saved into the project folder.",
    ],
    doneWhen: [
      "You have a first script direction saved outside the chat window.",
      "You know what the paid lessons will expand next.",
    ],
    nextLessonSlug: "create-the-starter-source-file",
  },
];

const paidLessonPreviews: LessonPreview[] = [
  {
    number: 5,
    slug: "create-the-starter-source-file",
    title: "Create the Starter Source File",
    access: "paid",
    trackTags: ["Both"],
    moduleTitle: "Source file setup",
    preview:
      "Turn the rough avatar idea into a small reusable source file before writing scripts or opening avatar tools.",
  },
  {
    number: 6,
    slug: "set-up-chatgpt-personalization",
    title: "Set Up ChatGPT Personalization",
    access: "paid",
    trackTags: ["Both"],
    moduleTitle: "ChatGPT setup",
    preview:
      "Set a practical preference baseline so ChatGPT stops pitching hype and starts helping with useful avatar scripts.",
  },
  {
    number: 7,
    slug: "create-a-chatgpt-project",
    title: "Create a ChatGPT Project",
    access: "paid",
    trackTags: ["Text/Computer", "Both"],
    moduleTitle: "ChatGPT setup",
    preview:
      "Create a dedicated project for ideas, scripts, screenshots, notes, and repeatable instructions.",
  },
  {
    number: 8,
    slug: "screenshot-research-method",
    title: "Screenshot Research Method",
    access: "paid",
    trackTags: ["Voice/Phone"],
    moduleTitle: "Research capture",
    preview:
      "Turn phone screenshots into usable research notes without drowning ChatGPT in context soup.",
  },
  {
    number: 9,
    slug: "build-your-avatar-concept",
    title: "Build Your Avatar Concept",
    access: "paid",
    trackTags: ["Both"],
    moduleTitle: "Avatar setup",
    preview:
      "Define the avatar's job, tone, boundaries, look notes, and recurring content role before generating clips.",
  },
  {
    number: 10,
    slug: "write-or-speak-your-first-script",
    title: "Write or Speak Your First Script",
    access: "paid",
    trackTags: ["Voice/Phone", "Text/Computer"],
    moduleTitle: "Script and voice",
    preview:
      "Use either voice mode or typed drafting to create a short script that sounds like a person, not a webinar funnel.",
  },
  {
    number: 11,
    slug: "create-a-voice-test-in-elevenlabs",
    title: "Create a Voice Test in ElevenLabs",
    access: "paid",
    trackTags: ["Both"],
    moduleTitle: "Script and voice",
    preview:
      "Run a small voice test, listen for pacing and tone, and save the result where it belongs.",
  },
  {
    number: 12,
    slug: "create-an-avatar-clip-in-heygen",
    title: "Create an Avatar Clip in HeyGen",
    access: "paid",
    trackTags: ["Both"],
    moduleTitle: "Avatar setup",
    preview:
      "Make the first avatar clip from a known script and voice direction instead of improvising in the tool.",
  },
  {
    number: 13,
    slug: "move-files-between-phone-and-laptop",
    title: "Move Files Between Phone and Laptop",
    access: "paid",
    trackTags: ["Voice/Phone", "Both"],
    moduleTitle: "Files and exports",
    preview:
      "Bridge camera roll, downloads, cloud folders, and desktop editing without losing the source file.",
  },
  {
    number: 14,
    slug: "save-and-name-your-exports",
    title: "Save and Name Your Exports",
    access: "paid",
    trackTags: ["Text/Computer", "Both"],
    moduleTitle: "Files and exports",
    preview:
      "Use a simple naming pattern for scripts, voice tests, avatar clips, edits, captions, and final exports.",
  },
  {
    number: 15,
    slug: "schedule-in-meta-business-suite",
    title: "Schedule in Meta Business Suite",
    access: "paid",
    trackTags: ["Both"],
    moduleTitle: "Publish and review",
    preview:
      "Schedule the finished video with caption, thumbnail check, and account sanity check before it goes out.",
  },
  {
    number: 16,
    slug: "review-the-post-and-make-the-next-one",
    title: "Reset the Thread and Make the Next One",
    access: "paid",
    trackTags: ["Both"],
    moduleTitle: "Publish and review",
    preview:
      "Review the finished post, save the note, then reset the thread so the next avatar post starts from the system instead of from scratch.",
  },
];

export const freeLessons = freeLessonData;
export const paidLessons = paidLessonPreviews;
export const allLessons = [...freeLessons, ...paidLessons];

export const courseModules = Array.from(
  allLessons.reduce((modules, lesson) => {
    const existing = modules.get(lesson.moduleTitle) ?? [];
    existing.push(lesson);
    modules.set(lesson.moduleTitle, existing);
    return modules;
  }, new Map<string, LessonPreview[]>()),
).map(([title, lessons]) => ({ title, lessons }));

export function getLessonPreview(slug: string): LessonPreview | undefined {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getFreeLesson(slug: string): FreeLesson | undefined {
  return freeLessons.find((lesson) => lesson.slug === slug);
}

export function lessonHref(slug: string): string {
  return `${avatarCourse.coursePath}/${slug}`;
}
