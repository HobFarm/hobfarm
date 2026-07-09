import {
  buildSectionLlms,
  galleryToAgentLink,
  getPublicAgentGalleryEntries,
  markdownResponse,
} from "@/lib/agent-corpus";

export async function GET() {
  const entries = await getPublicAgentGalleryEntries();
  return markdownResponse(
    await buildSectionLlms(
      "HobFarm Gallery",
      "The visual archive for image sets, character sheets, experiments, finished media, and process-linked visual systems. Public Markdown omits raw prompt/export files and paid originals.",
      entries.map(galleryToAgentLink),
    ),
  );
}
