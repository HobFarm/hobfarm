import { absoluteUrl, markdownResponse, pageMarkdown } from "@/lib/agent-corpus";
import { academyCourseManifests, academyCourseScaffolds, academyCourseHref, academyPriceLabel } from "@/data/academy-manifest";

export function GET() {
  return markdownResponse(
    pageMarkdown({
      title: "Academy",
      description: "A catalog of practical free and affordable one-time HobFarm courses.",
      canonicalUrl: absoluteUrl("/academy/"),
      metadata: {
        availableCourses: academyCourseManifests.filter((course) => course.publicStatus === "available").map((course) => course.title).join("; "),
        priceLabels: "Free; $5 or $7 one-time when the course is available; $5/month catalog membership while active",
        freeCourse: "/academy/intellectual-self-defense/",
        freeCourseStart: "/academy/intellectual-self-defense/the-card-catalog-started-talking-back/",
      },
      body: [...academyCourseManifests, ...academyCourseScaffolds]
        .map((course) => `- [${course.title}](${absoluteUrl(course.status === "draft" ? "/academy/" : academyCourseHref(course))}): ${course.publicStatus}; ${academyPriceLabel(course.priceTier)}. ${course.problem} Result: ${course.outcome}`)
        .join("\n"),
    }),
  );
}
