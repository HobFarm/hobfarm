import { absoluteUrl, buildSectionLlms, markdownResponse } from "@/lib/agent-corpus";
import { storefronts } from "@/data/storefronts";

export async function GET() {
  return markdownResponse(
    [
      await buildSectionLlms(
        "HobFarm Shop",
        "Find the right HobFarm storefront for digital packs, character assets, visual-world releases, and one-off physical finds.",
        storefronts.map((storefront) => ({
          title: storefront.name,
          url: storefront.href
            ? absoluteUrl(storefront.href)
            : absoluteUrl(`/shop/#${storefront.id}`),
          description: `${storefront.statusLabel}. ${storefront.description}`,
        })),
      ),
      "Courses belong in [Academy](https://hob.farm/academy/). Reader funding belongs on [Support HobFarm](https://hob.farm/support/). Customer problems belong in [Customer Help](https://hob.farm/helpcenter/).",
    ].join("\n\n"),
  );
}
