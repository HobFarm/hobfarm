import { absoluteUrl, markdownResponse, pageMarkdown } from "@/lib/agent-corpus";

export function GET() {
  return markdownResponse(
    pageMarkdown({
      title: "HobFarm",
      description: "HobFarm is an online magazine and visual studio for articles, visual galleries, recurring projects, workshop notes, academy paths, products, and support.",
      canonicalUrl: absoluteUrl("/"),
      metadata: {
        sections: ["Articles", "Gallery", "Projects", "Workshop", "Academy", "Support", "Grimoire"],
        agentIndex: "/llms.txt",
      },
      body: "Use the homepage as the front door to the publication. For agent reading, prefer `/llms.txt`, section `llms.txt` files, and canonical content-page Markdown alternates.",
    }),
  );
}
