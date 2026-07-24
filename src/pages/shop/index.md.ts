import { absoluteUrl, buildSectionLlms, markdownResponse } from "@/lib/agent-corpus";
import { storefronts } from "@/data/storefronts";

export async function GET() {
  return markdownResponse(
    [
      await buildSectionLlms(
        "HobFarm Shop",
        "A stable directory for direct merchandise, marketplace shelves, courses, and one-time reader support. It does not mirror marketplace listings or advertise unavailable products.",
        storefronts.map((storefront) => ({
          title: storefront.name,
          url: storefront.href
            ? absoluteUrl(storefront.href)
            : absoluteUrl(`/shop/#${storefront.id}`),
          description: `${storefront.status}. ${storefront.description}`,
        })),
      ),
      "Customer problems belong in [Customer Help](https://hob.farm/helpcenter/). Reader funding belongs on [Support HobFarm](https://hob.farm/support/).",
    ].join("\n\n"),
  );
}
