import { absoluteUrl, markdownResponse, pageMarkdown } from "@/lib/agent-corpus";
import { avatarCourse } from "@/data/avatar-content-system";

export function GET() {
  return markdownResponse(
    pageMarkdown({
      title: "Academy",
      description: "Practical AI training from HobFarm: avatar workflows, prompts, image systems, building apps, and selling your work.",
      canonicalUrl: absoluteUrl("/academy/"),
      metadata: {
        firstCourse: avatarCourse.productName,
        freeOverview: avatarCourse.freePath,
        coursePath: avatarCourse.coursePath,
      },
      body: "Academy pages collect workflow education and public course entry points. Paid lesson files, account-gated downloads, and private source material are not included in Markdown alternates.",
    }),
  );
}
