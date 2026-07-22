import { absoluteUrl, markdownResponse, pageMarkdown } from "@/lib/agent-corpus";
import { academyCourses, intellectualSelfDefenseCourse } from "@/data/academy-courses";

export function GET() {
  return markdownResponse(
    pageMarkdown({
      title: "Academy",
      description: "Practical HobFarm courses for research, creative production, media judgment, and repeatable AI workflows.",
      canonicalUrl: absoluteUrl("/academy/"),
      metadata: {
        availableCourses: academyCourses.map((course) => course.title).join("; "),
        freeCourse: intellectualSelfDefenseCourse.href,
        freeCourseStart: intellectualSelfDefenseCourse.startHref,
      },
      body: academyCourses
        .map((course) => `- [${course.title}](${absoluteUrl(course.href)}): ${course.description}`)
        .join("\n"),
    }),
  );
}
