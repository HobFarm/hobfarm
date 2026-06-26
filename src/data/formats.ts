// Content formats: the object-type dimension, orthogonal to department. A
// department says where a piece is filed; a format says what kind of object it
// is (drives card badges and homepage strip selection). Single source of truth
// for the `format` enum used in content schemas and UI.

export type Format = {
  slug: string;
  label: string;
};

export const formats: Format[] = [
  { slug: "article", label: "Article" },
  { slug: "cartoon", label: "Cartoon" },
  { slug: "wtf-card", label: "WTF Card" },
  { slug: "satire-piece", label: "Satire Piece" },
  { slug: "picture-story", label: "Picture Story" },
  { slug: "gallery-set", label: "Gallery Set" },
  { slug: "video", label: "Video" },
  { slug: "trailer", label: "Trailer" },
  { slug: "workshop-note", label: "Workshop Note" },
  { slug: "character-page", label: "Character Page" },
  { slug: "cover", label: "Cover" },
];

export const formatSlugs = formats.map((f) => f.slug);

const formatBySlug = new Map(formats.map((f) => [f.slug, f]));

export function getFormatLabel(slug: string | undefined | null): string | undefined {
  if (!slug) return undefined;
  return formatBySlug.get(slug)?.label ?? slug;
}
