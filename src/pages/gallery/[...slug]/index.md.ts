import {
  galleryMarkdown,
  getPublicAgentGalleryEntries,
  markdownResponse,
} from "@/lib/agent-corpus";

const stripExt = (id: string) => id.replace(/\.(md|mdx)$/, "");

export async function getStaticPaths() {
  const entries = await getPublicAgentGalleryEntries();
  return entries.map((entry) => ({
    params: { slug: stripExt(entry.id) },
    props: { entry },
  }));
}

export function GET({ props }: { props: { entry: Awaited<ReturnType<typeof getPublicAgentGalleryEntries>>[number] } }) {
  return markdownResponse(galleryMarkdown(props.entry));
}
