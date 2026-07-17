import {
  absoluteUrl,
  markdownResponse,
  pageMarkdown,
} from "@/lib/agent-corpus";

export async function GET() {
  return markdownResponse(
    pageMarkdown({
      title: "The Grimoire is being rebuilt",
      description:
        "The Grimoire is becoming the game engine behind Other Alice Adventures and a durable knowledge graph for HobFarm.",
      canonicalUrl: absoluteUrl("/grimoire/"),
      metadata: {
        status: "Under redevelopment",
        direction: ["Other Alice Adventures game engine", "HobFarm knowledge graph"],
      },
      body:
        "The former public documentation and cross-pollination archive are offline while their useful parts are reviewed. The replacement connects characters, places, routes, rules, evidence, choices, and consequences in one structured world record. Workshop pages remain public, and the Other Alice world guides show the records the new engine will use.",
    }),
  );
}
