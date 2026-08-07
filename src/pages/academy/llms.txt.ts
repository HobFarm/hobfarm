import { absoluteUrl, buildSectionLlms, textResponse } from "@/lib/agent-corpus";
import { academyCourseManifests, academyCourseHref } from "@/data/academy-manifest";

export async function GET() {
  return textResponse(
    await buildSectionLlms(
      "HobFarm Academy Agent Index",
      "Free and affordable one-time course entry points. Paid lesson files and account-gated material are excluded.",
      [
        {
          title: "Academy",
          url: absoluteUrl("/academy/"),
          description: "Public catalog of HobFarm courses and one-time pricing bands.",
        },
        ...academyCourseManifests.map((course) => ({
          title: course.title,
          url: absoluteUrl(academyCourseHref(course)),
          description: `${course.publicStatus}. ${course.problem} Result: ${course.outcome}`,
        })),
        {
          title: "Start Intellectual Self-Defense",
          url: absoluteUrl("/academy/intellectual-self-defense/the-card-catalog-started-talking-back/"),
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
