import type { Snippet, TrackTag } from "./avatar-content-system";

export interface ScreenshotSlot {
  target: string;
  caption: string;
}

export interface PaidLesson {
  slug: string;
  title: string;
  trackTags: TrackTag[];
  goal: string;
  whatYouNeed: string[];
  steps: string[];
  screenshotSlots: ScreenshotSlot[];
  snippets: Snippet[];
  checklist: string[];
  doneWhen: string[];
  nextLessonSlug?: string;
}

const lessons: PaidLesson[] = [
  {
    slug: "set-up-chatgpt-personalization",
    title: "Set Up ChatGPT Personalization",
    trackTags: ["Both"],
    goal:
      "Give ChatGPT a standing preference for practical avatar content help, not hype, fake urgency, or guru cosplay.",
    whatYouNeed: ["A ChatGPT account.", "Five minutes to write preferences in normal language."],
    steps: [
      "Open ChatGPT settings and find the personalization or custom instructions area available in your account.",
      "Add a short note about what you make: beginner-friendly avatar videos for practical posts.",
      "Tell ChatGPT to avoid fake urgency, exaggerated income claims, guru language, and generic AI hype.",
      "Tell ChatGPT to ask clarifying questions before writing long scripts.",
      "Save the preference and start a new chat to test whether the voice changed.",
    ],
    screenshotSlots: [
      {
        target: "ChatGPT personalization settings before saving",
        caption: "Show the preference field where the anti-hype instruction is added.",
      },
      {
        target: "A new ChatGPT chat after personalization",
        caption: "Show a short test response that asks practical questions instead of pitching a sales script.",
      },
    ],
    snippets: [
      {
        title: "Personalization text",
        body:
          "I make practical short avatar videos. Help me turn rough ideas, screenshots, and voice notes into useful scripts and posting checklists. Avoid fake urgency, income claims, guru language, and vague AI hype. Ask clarifying questions when the idea is thin. Keep advice direct and usable.",
      },
      {
        title: "Personalization test prompt",
        body:
          "Test my saved preferences. Help me turn a rough idea about [topic] into a short avatar video plan. If the idea is missing details, ask questions first.",
      },
    ],
    checklist: [
      "Personalization includes what I make.",
      "Personalization includes anti-hype boundaries.",
      "A new chat follows the preference without extra reminders.",
    ],
    doneWhen: [
      "ChatGPT responds like a practical editor, not a fake launch coach.",
      "You have a reusable preference block saved outside the chat.",
    ],
    nextLessonSlug: "create-a-chatgpt-project",
  },
  {
    slug: "create-a-chatgpt-project",
    title: "Create a ChatGPT Project",
    trackTags: ["Text/Computer", "Both"],
    goal:
      "Create one dedicated ChatGPT project for the starter kit so ideas, scripts, screenshots, and rules stay together.",
    whatYouNeed: ["A ChatGPT account with Projects available.", "Your project folder from the free lessons."],
    steps: [
      "Create a new ChatGPT project named Avatar Content System.",
      "Add a short project description that names the workflow and tools.",
      "Paste the project rules snippet into the project instructions.",
      "Start one thread for your first video and one thread for review notes.",
      "Save useful outputs into your local project folder instead of trusting the chat history alone.",
    ],
    screenshotSlots: [
      {
        target: "ChatGPT project home",
        caption: "Show the project name and where the instructions live.",
      },
      {
        target: "First-video thread inside the project",
        caption: "Show the starter thread separated from general chat noise.",
      },
    ],
    snippets: [
      {
        title: "Project instructions",
        body:
          "This project helps me make short avatar videos. Use the workflow: Idea -> ChatGPT -> Script -> Voice -> Avatar -> Export -> Edit -> Schedule -> Review. Support both Voice/Phone and Text/Computer workflows. Keep scripts direct, conversational, and anti-hype. When I paste screenshots or rough notes, organize them before drafting.",
      },
      {
        title: "First thread starter",
        body:
          "This is the first video for the Avatar Content System project. My topic is [topic]. My starting track is [Voice/Phone or Text/Computer]. Help me define the point, audience, hook, script shape, and missing details before drafting.",
      },
    ],
    checklist: [
      "The project is named clearly.",
      "Project instructions include the shared workflow.",
      "First-video and review threads are separated.",
      "Important outputs are saved into local files.",
    ],
    doneWhen: [
      "You can return to one ChatGPT project instead of searching your whole account.",
    ],
    nextLessonSlug: "screenshot-research-method",
  },
  {
    slug: "screenshot-research-method",
    title: "Screenshot Research Method",
    trackTags: ["Voice/Phone"],
    goal:
      "Turn phone screenshots into usable source notes before asking ChatGPT to write anything.",
    whatYouNeed: ["A phone.", "A few screenshots related to the first video.", "A way to move screenshots to your project folder."],
    steps: [
      "Collect only screenshots that support the first video. Do not dump your whole camera roll into the project.",
      "Move the screenshots into 02-screenshots.",
      "Rename each screenshot with a short label, such as 2026-06-idea-proof-01.png.",
      "Paste or upload screenshots to ChatGPT in a new research thread.",
      "Ask ChatGPT to extract facts, claims, questions, and script angles without inventing missing details.",
      "Save the extracted notes into 01-ideas or 03-scripts, depending on how polished they are.",
    ],
    screenshotSlots: [
      {
        target: "Phone screenshot selection",
        caption: "Show a small selected set, not every possible screenshot.",
      },
      {
        target: "Renamed screenshot files in the project folder",
        caption: "Show readable file names that explain why each screenshot exists.",
      },
      {
        target: "ChatGPT extraction response",
        caption: "Show extracted notes organized before script drafting starts.",
      },
    ],
    snippets: [
      {
        title: "Screenshot extraction prompt",
        body:
          "I am using these screenshots as rough research for one short avatar video. Extract only what is visible or reasonably implied. Organize the notes into: facts, claims to verify, useful phrases, possible hook, missing context, and next action. Do not write the final script yet.",
      },
      {
        title: "Screenshot rescue loop",
        body:
          "If the screenshots are too messy, ask me what each one is supposed to prove. Then build a short research note from my answers.",
      },
    ],
    checklist: [
      "Screenshots are selected for one video.",
      "Screenshots are saved in 02-screenshots.",
      "ChatGPT extracted notes before writing the script.",
      "A cleaned note exists outside the chat.",
    ],
    doneWhen: [
      "You have research notes that a script can use without guessing.",
    ],
    nextLessonSlug: "build-your-avatar-concept",
  },
  {
    slug: "build-your-avatar-concept",
    title: "Build Your Avatar Concept",
    trackTags: ["Both"],
    goal:
      "Define the avatar's job, boundaries, visual notes, and speaking style before opening the avatar tool.",
    whatYouNeed: ["Your first topic.", "A rough idea of who should deliver it.", "Any reference notes you trust."],
    steps: [
      "Write the avatar's role in one sentence.",
      "Define what the avatar should never claim, promise, or pretend to know.",
      "Choose three voice traits, such as calm, direct, dry, skeptical, warm, or precise.",
      "Choose three visual traits that support the content without becoming the whole point.",
      "Ask ChatGPT to turn those notes into an avatar concept sheet.",
      "Save the concept sheet into 01-ideas.",
    ],
    screenshotSlots: [
      {
        target: "Avatar concept notes in ChatGPT",
        caption: "Show role, tone, boundaries, and visual notes in one place.",
      },
      {
        target: "Saved avatar concept file",
        caption: "Show the concept saved outside ChatGPT for reuse.",
      },
    ],
    snippets: [
      {
        title: "Avatar concept prompt",
        body:
          "Help me create an avatar concept sheet for short practical videos. Include: role, audience, tone, speaking style, visual notes, what the avatar should never claim, and where this avatar fits in the workflow. Keep it grounded and beginner-friendly.",
      },
      {
        title: "Avatar boundary note",
        body:
          "This avatar should not claim guaranteed results, insider secrets, financial outcomes, or personal experience it does not have. It can explain a process and show practical next steps.",
      },
    ],
    checklist: [
      "The avatar has a clear job.",
      "The avatar has boundaries.",
      "Voice and visual traits are written down.",
      "The concept sheet is saved.",
    ],
    doneWhen: [
      "You can explain why this avatar exists before making a clip.",
    ],
    nextLessonSlug: "write-or-speak-your-first-script",
  },
  {
    slug: "write-or-speak-your-first-script",
    title: "Write or Speak Your First Script",
    trackTags: ["Voice/Phone", "Text/Computer"],
    goal:
      "Create a 45 to 60 second script through either spoken rough drafting or typed drafting.",
    whatYouNeed: ["Your avatar concept.", "Your first video idea.", "ChatGPT voice mode or a text editor."],
    steps: [
      "If you use Voice/Phone, talk through the point in plain language and ask ChatGPT to summarize it.",
      "If you use Text/Computer, write a messy bullet list first.",
      "Ask ChatGPT for a 45 to 60 second script with one point, one example, and one clean ending.",
      "Read it out loud once. Cut anything that sounds like an ad for being alive.",
      "Save the script as 03-scripts/001-first-avatar-script.txt.",
    ],
    screenshotSlots: [
      {
        target: "Voice-mode or typed rough draft",
        caption: "Show the messy starting material before cleanup.",
      },
      {
        target: "Saved script file",
        caption: "Show the first script saved with the lesson naming pattern.",
      },
    ],
    snippets: [
      {
        title: "Voice/Phone script prompt",
        body:
          "I am going to explain this out loud. After I stop, summarize the point, ask any missing questions, then turn it into a 45 to 60 second avatar script. Keep it conversational and remove rambling.",
      },
      {
        title: "Text/Computer script prompt",
        body:
          "Turn these rough bullets into a 45 to 60 second avatar script. Use one clear point, one concrete example, and one clean ending. Remove hype, vague motivation, and filler. Bullets: [paste bullets]",
      },
    ],
    checklist: [
      "The script is 45 to 60 seconds when read aloud.",
      "The script has one clear point.",
      "The script is saved in 03-scripts.",
      "The script does not promise fake outcomes.",
    ],
    doneWhen: [
      "You can read the script out loud without apologizing to yourself.",
    ],
    nextLessonSlug: "create-a-voice-test-in-elevenlabs",
  },
  {
    slug: "create-a-voice-test-in-elevenlabs",
    title: "Create a Voice Test in ElevenLabs",
    trackTags: ["Both"],
    goal:
      "Create a small voice test and decide whether the pacing, tone, and clarity fit the avatar.",
    whatYouNeed: ["An ElevenLabs account.", "Your saved script.", "Headphones if possible."],
    steps: [
      "Open ElevenLabs and create or choose a voice for testing.",
      "Paste only a short script section for the first test.",
      "Generate one voice sample and listen all the way through.",
      "Write down what feels wrong: too fast, too polished, too dramatic, too flat, or unclear.",
      "Adjust the text before changing every voice setting.",
      "Save the best sample in 04-voice-tests with a clear file name.",
    ],
    screenshotSlots: [
      {
        target: "ElevenLabs generation screen before export",
        caption: "Show the short test text and selected voice.",
      },
      {
        target: "Saved voice test file",
        caption: "Show the sample stored in 04-voice-tests.",
      },
    ],
    snippets: [
      {
        title: "Voice direction note",
        body:
          "Voice direction: practical, calm, lightly skeptical, no fake excitement. Pace should leave room for the viewer to understand the steps.",
      },
      {
        title: "Voice review prompt",
        body:
          "Review this voice test from my notes. What should I change in the script text before changing the voice settings? Notes: [paste what sounded wrong]",
      },
    ],
    checklist: [
      "A short voice test was generated.",
      "The test was reviewed before making more versions.",
      "The best sample was saved in 04-voice-tests.",
      "The script was edited if the voice exposed awkward phrasing.",
    ],
    doneWhen: [
      "You have one voice sample good enough to test with an avatar clip.",
    ],
    nextLessonSlug: "create-an-avatar-clip-in-heygen",
  },
  {
    slug: "create-an-avatar-clip-in-heygen",
    title: "Create an Avatar Clip in HeyGen",
    trackTags: ["Both"],
    goal:
      "Generate the first avatar clip from a known script and voice direction.",
    whatYouNeed: ["A HeyGen account.", "Your saved script.", "Your voice test or voice direction note."],
    steps: [
      "Open HeyGen and start a new avatar video.",
      "Choose an avatar that supports the concept without distracting from the message.",
      "Paste the approved script or connect the voice option available in your setup.",
      "Preview the clip before export.",
      "Watch for mouth timing, weird pauses, incorrect words, and visual mismatch.",
      "Export the clip only after one practical review pass.",
      "Save the result in 05-avatar-clips.",
    ],
    screenshotSlots: [
      {
        target: "HeyGen editor before export",
        caption: "Show avatar, script, and clip setup before generating the final file.",
      },
      {
        target: "Exported avatar clip in project folder",
        caption: "Show the clip saved in 05-avatar-clips.",
      },
    ],
    snippets: [
      {
        title: "Avatar clip review checklist",
        body:
          "Before export, check: words match script, mouth timing is acceptable, pauses are not strange, avatar fits the topic, and the clip does not feel like a fake guru ad.",
      },
    ],
    checklist: [
      "The clip uses the approved script.",
      "The avatar matches the concept well enough for a first test.",
      "The preview was watched before export.",
      "The exported file is saved in 05-avatar-clips.",
    ],
    doneWhen: [
      "You have one avatar clip ready for edit/export handling.",
    ],
    nextLessonSlug: "move-files-between-phone-and-laptop",
  },
  {
    slug: "move-files-between-phone-and-laptop",
    title: "Move Files Between Phone and Laptop",
    trackTags: ["Voice/Phone", "Both"],
    goal:
      "Move screenshots, voice notes, clips, and exported files between devices without losing the current version.",
    whatYouNeed: ["A cloud folder, AirDrop, USB cable, or another transfer method.", "Your project folder."],
    steps: [
      "Pick one transfer method for this course. Do not switch methods every lesson.",
      "Move phone screenshots into 02-screenshots.",
      "Move voice files into 04-voice-tests.",
      "Move avatar exports into 05-avatar-clips or 06-exports depending on whether they are final.",
      "After moving, open the file once from the destination folder to confirm it works.",
      "Delete duplicates only after the destination file is confirmed.",
    ],
    screenshotSlots: [
      {
        target: "Phone share sheet or transfer method",
        caption: "Show the selected method used to move files.",
      },
      {
        target: "Destination folder after transfer",
        caption: "Show files landed in the correct project folder.",
      },
    ],
    snippets: [
      {
        title: "Transfer rule",
        body:
          "For this project, phone files are not done until they are saved in the project folder and opened once from the laptop or desktop.",
      },
    ],
    checklist: [
      "One transfer method is chosen.",
      "Files land in the correct numbered folders.",
      "Destination files open correctly.",
      "Duplicates are not deleted before confirmation.",
    ],
    doneWhen: [
      "You can move a phone capture into the course folder without wondering which copy is real.",
    ],
    nextLessonSlug: "save-and-name-your-exports",
  },
  {
    slug: "save-and-name-your-exports",
    title: "Save and Name Your Exports",
    trackTags: ["Text/Computer", "Both"],
    goal:
      "Use a basic naming pattern so scripts, voice tests, avatar clips, and scheduled posts remain traceable.",
    whatYouNeed: ["Your project folder.", "At least one script or clip file."],
    steps: [
      "Choose a short project code for the first video, such as av001.",
      "Use the pattern code-stage-version.ext for every main file.",
      "Save scripts, voice tests, avatar clips, edits, captions, and final exports with the same code.",
      "Use v01, v02, and v03 for versions instead of final, final2, and realfinal.",
      "Put the final scheduled version in 06-exports.",
    ],
    screenshotSlots: [
      {
        target: "Project folder with named files",
        caption: "Show related files sharing the same project code.",
      },
      {
        target: "Final export folder",
        caption: "Show the version selected for scheduling.",
      },
    ],
    snippets: [
      {
        title: "Naming examples",
        body:
          "av001-script-v01.txt\nav001-voice-test-v01.mp3\nav001-avatar-clip-v01.mp4\nav001-caption-v01.txt\nav001-final-export-v01.mp4",
      },
      {
        title: "Filename rule",
        body:
          "Use code-stage-version.ext. Never use final-final-for-real unless you want the folder to start lying to you.",
      },
    ],
    checklist: [
      "The first video has a code.",
      "Related files share the code.",
      "Versions use v01, v02, v03.",
      "The scheduled file is clearly named.",
    ],
    doneWhen: [
      "A stranger could open the folder and identify the current final export.",
    ],
    nextLessonSlug: "schedule-in-meta-business-suite",
  },
  {
    slug: "schedule-in-meta-business-suite",
    title: "Schedule in Meta Business Suite",
    trackTags: ["Both"],
    goal:
      "Schedule the first avatar video with a checked caption, correct account, and saved posting note.",
    whatYouNeed: ["A Meta Business Suite account.", "A final export.", "A caption draft."],
    steps: [
      "Open Meta Business Suite and confirm you are in the correct account.",
      "Create a new post or reel using the final export from 06-exports.",
      "Paste the caption draft and remove anything that sounds like fake urgency.",
      "Check the preview, thumbnail, account, date, and time.",
      "Schedule the post.",
      "Save the scheduled date, platform, and caption into 07-scheduled-posts.",
    ],
    screenshotSlots: [
      {
        target: "Meta Business Suite composer before scheduling",
        caption: "Show account, media preview, caption, and scheduled time before confirming.",
      },
      {
        target: "Scheduled post confirmation",
        caption: "Show the post exists in scheduled content.",
      },
    ],
    snippets: [
      {
        title: "Caption cleanup prompt",
        body:
          "Clean up this caption for a short avatar video. Keep it clear and useful. Remove fake urgency, income claims, hype, and empty motivational language. Caption: [paste caption]",
      },
      {
        title: "Scheduled post note",
        body:
          "Video code: [av001]\nScheduled platform: [platform]\nScheduled date/time: [date/time]\nCaption file: [filename]\nFinal export: [filename]",
      },
    ],
    checklist: [
      "Correct Meta account is selected.",
      "Final export is attached.",
      "Caption is checked.",
      "Date and time are checked.",
      "Scheduled note is saved.",
    ],
    doneWhen: [
      "The post is scheduled and the project folder records what was scheduled.",
    ],
    nextLessonSlug: "review-the-post-and-make-the-next-one",
  },
  {
    slug: "review-the-post-and-make-the-next-one",
    title: "Review the Post and Make the Next One",
    trackTags: ["Both"],
    goal:
      "Write a short practical review so the second avatar video improves instead of restarting from zero.",
    whatYouNeed: ["The scheduled or published post.", "Your first-video-review note.", "Any basic performance or quality observations."],
    steps: [
      "Open the post after publishing or after the scheduled preview is ready.",
      "Review clarity first: can a viewer understand the point without knowing your whole backstory?",
      "Review production second: voice, pacing, avatar fit, captions, crop, and file quality.",
      "Review workflow third: where did work slow down or get lost?",
      "Write one keep, one cut, one fix, and one next test.",
      "Use ChatGPT to turn the review into the next video plan.",
    ],
    screenshotSlots: [
      {
        target: "Published or scheduled post view",
        caption: "Show the final post as a viewer would see it.",
      },
      {
        target: "Review note in 08-review-notes",
        caption: "Show keep, cut, fix, and next test saved for the next video.",
      },
    ],
    snippets: [
      {
        title: "Post review note",
        body:
          "Keep: [what worked]\nCut: [what was unnecessary]\nFix: [what confused or slowed the video]\nNext test: [one thing to try in the next avatar post]",
      },
      {
        title: "Next video prompt",
        body:
          "Use this review note to plan the next short avatar video. Keep what worked, remove what dragged, and suggest one small test for the next post. Review note: [paste note]",
      },
    ],
    checklist: [
      "The post was reviewed as a viewer would see it.",
      "Quality and workflow notes are separate.",
      "The review note is saved.",
      "The next test is specific.",
    ],
    doneWhen: [
      "You know what to repeat, what to remove, and what to test in the next avatar video.",
    ],
  },
];

export function getPaidLesson(slug: string): PaidLesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function listPaidLessonSlugs(): string[] {
  return lessons.map((lesson) => lesson.slug);
}
