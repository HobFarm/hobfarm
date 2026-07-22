import { absoluteUrl, buildSectionLlms, textResponse } from "@/lib/agent-corpus";
import { academyCourses, intellectualSelfDefenseCourse } from "@/data/academy-courses";

export async function GET() {
  return textResponse(
    await buildSectionLlms(
      "HobFarm Academy Agent Index",
      "Public learning paths and course entry points. Paid lesson files and account-gated material are excluded.",
      [
        {
          title: "Academy",
          url: absoluteUrl("/academy/"),
          description: "Public overview of HobFarm learning paths.",
        },
        ...academyCourses.map((course) => ({
          title: course.title,
          url: absoluteUrl(course.href),
          description: `${course.accessLabel}. ${course.description}`,
        })),
        {
          title: "Start Intellectual Self-Defense",
          url: absoluteUrl(intellectualSelfDefenseCourse.startHref),
          description: "First lesson in the free, public Intellectual Self-Defense course.",
        },
        {
          title: "Free avatar overview",
          url: absoluteUrl("/academy/avatar-content-system/free/"),
          description: "Free public overview for the avatar content workflow.",
        },
      ],
    ),
  );
}
