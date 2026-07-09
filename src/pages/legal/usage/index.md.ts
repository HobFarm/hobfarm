import { getCollection } from "astro:content";
import { absoluteUrl, markdownResponse, pageMarkdown } from "@/lib/agent-corpus";

export async function GET() {
  const pages = await getCollection("legal");
  const usage = pages.find((page) => page.id === "usage.md");

  return markdownResponse(
    pageMarkdown({
      title: usage?.data.title ?? "Usage and License",
      description: usage?.data.description ?? "Public usage and license boundaries for HobFarm.",
      canonicalUrl: absoluteUrl("/legal/usage/"),
      date: usage?.data.publishedAt,
      updated: usage?.data.updatedAt,
      metadata: {
        section: "Legal",
      },
      body: usage?.body ?? "See the canonical HTML page for the current public usage policy.",
    }),
  );
}
