import {
  buildSectionLlms,
  galleryToAgentLink,
  getPublicAgentGalleryEntries,
  textResponse,
} from "@/lib/agent-corpus";

export async function GET() {
  const entries = await getPublicAgentGalleryEntries();
  return textResponse(
    await buildSectionLlms(
      "HobFarm Gallery Agent Index",
      "Public visual archive entries with preview-safe media. Raw prompts, export text files, paid originals, and high-resolution source assets are excluded.",
      entries.map(galleryToAgentLink),
    ),
  );
}
