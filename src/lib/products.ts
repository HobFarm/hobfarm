import { getCollection, type CollectionEntry } from "astro:content";

export type ProductEntry = CollectionEntry<"products">;

// Statuses that may appear on public pages. `planned` and `archived` stay hidden.
const PUBLIC_STATUSES = new Set(["live", "coming-soon", "sold-out"]);

// A drop is buyable only when it is live AND has a real external storefront URL.
// This is the single guard that prevents fake buy buttons.
export function isBuyable(product: ProductEntry): boolean {
  return product.data.status === "live" && !!product.data.externalUrl;
}

export function productSlug(product: ProductEntry): string {
  return product.id.replace(/\.(md|mdx)$/, "");
}

export function productPath(product: ProductEntry): string {
  return `/shop/#${productSlug(product)}`;
}

function byDropDateDesc(a: ProductEntry, b: ProductEntry): number {
  const da = a.data.dropDate ? a.data.dropDate.getTime() : 0;
  const db = b.data.dropDate ? b.data.dropDate.getTime() : 0;
  if (db !== da) return db - da;
  return a.data.title.localeCompare(b.data.title);
}

export async function getPublicProducts(): Promise<ProductEntry[]> {
  const all = await getCollection("products");
  return all
    .filter((p) => PUBLIC_STATUSES.has(p.data.status))
    .sort(byDropDateDesc);
}

export async function getLiveProducts(): Promise<ProductEntry[]> {
  const all = await getCollection("products");
  return all.filter(isBuyable).sort(byDropDateDesc);
}

export async function getLatestDrops(limit = 4): Promise<ProductEntry[]> {
  return (await getPublicProducts()).slice(0, limit);
}

export async function getFeaturedProducts(): Promise<ProductEntry[]> {
  return (await getPublicProducts()).filter((p) => p.data.featured);
}

export async function getProductsByVisualSystem(id: string): Promise<ProductEntry[]> {
  return (await getPublicProducts()).filter((p) => p.data.visualSystem === id);
}

export async function getProductsByDepartment(slug: string): Promise<ProductEntry[]> {
  return (await getPublicProducts()).filter((p) => p.data.department === slug);
}
