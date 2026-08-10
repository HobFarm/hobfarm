import { absoluteUrl, markdownResponse, pageMarkdown } from "@/lib/agent-corpus";

export function GET() {
  return markdownResponse(
    pageMarkdown({
      title: "About Kris Reynolds and HobFarm",
      description:
        "Kris Reynolds builds and operates HobFarm, an independent publication and working studio for research, digital media, web systems, visual production, and inspectable creative workflows.",
      canonicalUrl: absoluteUrl("/about/"),
      metadata: {
        person: "Kris Reynolds",
        role: "Publisher / Digital media / Production systems",
        location: "Las Vegas, Nevada",
        operation: "Solo",
        contact: absoluteUrl("/contact/?subject=employment"),
        publicProfile: "https://www.linkedin.com/in/krisreynoldslv/",
        publicLayers: [
          "Articles",
          "HobFarm Presents",
          "Workshop",
          "Projects",
          "Applications and interactive work",
          "Academy",
          "Shop",
          "Support",
        ],
      },
      body: `Kris Reynolds builds and runs HobFarm, an independent publication and working studio for research, web publishing, visual media, and production systems.

HobFarm turns questions, source material, unfinished ideas, and practical production problems into articles, images, video, applications, and reusable workflows. Research, writing, photography, video, editing, web production, new tools, and production judgment belong to one chain. New tools can reduce production bottlenecks, but they do not decide what is worth making, what must remain true, what failed, or when the work is finished.

Kris also works in live entertainment and technical production in Las Vegas. That practical experience grounds HobFarm's delivery-oriented method: research the source, define what must remain true, build the system or transformation, direct the result, then publish, document, and extend it.

Selected proof routes include Articles, Workshop, StyleFusion, and Before & After. HobFarm is currently run by one person. Employment, production, web, editorial, collaboration, and referral inquiries should use the protected contact page. No direct email address, phone number, street address, private client list, or employment timeline is included in this public record.`,
    }),
  );
}
