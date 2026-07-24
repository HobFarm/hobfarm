import { absoluteUrl, markdownResponse, pageMarkdown } from "@/lib/agent-corpus";

export function GET() {
  return markdownResponse(
    pageMarkdown({
      title: "About HobFarm",
      description: "HobFarm is an independent publisher of articles, media, games, and creative systems.",
      canonicalUrl: absoluteUrl("/about/"),
      metadata: {
        publicLayers: ["Publication", "Media and projects", "Games and applications", "Workshop", "Academy", "Shop and support"],
        operation: "Solo; not currently hiring",
      },
      body: "HobFarm publishes articles, recurring media, games, creative applications, Workshop production notes, and Academy courses. The Shop and reader support fund future releases. HobFarm is currently a solo operation. Greater revenue can eventually fund paid contributors and specialists, but HobFarm is not currently hiring. Public pages show finished and preview-safe material. Private Grimoire notes, raw prompts, admin material, and paid source files are outside the public corpus.",
    }),
  );
}
