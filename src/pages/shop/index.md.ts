import { buildSectionLlms, markdownResponse, productMarkdown, productToAgentLink } from "@/lib/agent-corpus";
import { getPublicProducts } from "@/lib/products";

export async function GET() {
  const products = await getPublicProducts();
  return markdownResponse(
    [
      await buildSectionLlms(
        "HobFarm Products / Shop",
        "Public product previews and storefront routes. Paid downloads and source files are excluded.",
        products.map(productToAgentLink),
      ),
      products.map(productMarkdown).join("\n\n---\n\n"),
    ].join("\n\n"),
  );
}
