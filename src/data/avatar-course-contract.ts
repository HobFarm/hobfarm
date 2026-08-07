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
