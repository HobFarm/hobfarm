import { buildSectionLlms, productToAgentLink, textResponse } from "@/lib/agent-corpus";
import { getPublicProducts } from "@/lib/products";

export async function GET() {
  const products = await getPublicProducts();
  return textResponse(
    await buildSectionLlms(
      "HobFarm Products Agent Index",
      "Public product previews and shop anchors. Downloadable paid originals are excluded.",
      products.map(productToAgentLink),
    ),
  );
}
