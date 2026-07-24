import { absoluteUrl, markdownResponse, pageMarkdown } from "@/lib/agent-corpus";
import { academyCourses, intellectualSelfDefenseCourse } from "@/data/academy-courses";

export function GET() {
  return markdownResponse(
    pageMarkdown({
      title: "Academy",
      description: "A catalog of practical free and affordable one-time HobFarm courses.",
      canonicalUrl: absoluteUrl("/academy/"),
      metadata: {
        availableCourses: academyCourses.map((course) => course.title).join("; "),
        priceLabels: "Free; $5; $7; $9; clearly labeled one-time bundles",
        freeCourse: intellectualSelfDefenseCourse.href,
        freeCourseStart: intellectualSelfDefenseCourse.startHref,
      },
      body: academyCourses
        .map((course) => `- [${course.title}](${absoluteUrl(course.href)}): ${course.priceLabel}. ${course.description}`)
        .join("\n"),
    }),
  );
}
