import { absoluteUrl, markdownResponse, pageMarkdown } from "@/lib/agent-corpus";

export function GET() {
  return markdownResponse(
    pageMarkdown({
      title: "About HobFarm",
      description: "HobFarm is an online magazine and visual studio. The site connects articles, visual systems, workshop notes, shop drops, support paths, and contact routes.",
      canonicalUrl: absoluteUrl("/about/"),
      metadata: {
        publicLayers: ["Magazine", "Visual studio", "Workshop", "Shop", "Support"],
      },
      body: "HobFarm publishes full articles, visual archives, recurring projects, process notes, workflow education, and support paths. Public pages show finished and preview-safe material. Private Grimoire notes, raw prompts, admin material, and paid source files are outside the public corpus.",
    }),
  );
}
