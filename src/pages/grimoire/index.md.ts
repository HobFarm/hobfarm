import {
  absoluteUrl,
  markdownResponse,
  pageMarkdown,
} from "@/lib/agent-corpus";
import { otherAliceDevelopment } from "@/data/other-alice-development";

export async function GET() {
  return markdownResponse(
    pageMarkdown({
      title: "The Grimoire authors the world. Wonder Machine runs the session.",
      description:
        "The Grimoire is HobFarm's private source of authored knowledge. It compiles reviewed characters, places, styles, rules, relationships, and evidence into bounded packs for Wonder Machine and StyleFusion.",
      canonicalUrl: absoluteUrl("/grimoire/"),
      metadata: {
        status: "Under redevelopment",
        form: "Private authored source and consumer-pack compiler",
        consumers: ["Wonder Machine", "StyleFusion"],
      },
      body:
        `The Grimoire gives characters, places, styles, rules, relationships, and evidence stable authored forms. Markdown and JSON own the meaning. Schemas and graph checks validate the source before a compiler produces a small, named, versioned, immutable pack for a specific consumer.\n\nWonder Machine consumes an Other Alice world pack and owns mutable session state: player setup, location, time, inventory, conditions, actions, consequences, saves, and replay. StyleFusion consumes reviewed visual vocabulary and uses it in a production workflow with explicit reference roles, weighting, provenance, and decisions. Neither consumer rewrites the authored source.\n\nThe first persistent Wonderland is running locally. The private prototype supports ${otherAliceDevelopment.currentCapabilities.join(", ")}. ${otherAliceDevelopment.publicAvailability}. Human review controls what becomes source truth.`,
    }),
  );
}
