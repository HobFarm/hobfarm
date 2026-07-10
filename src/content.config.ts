import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: z
    .object({
      title: z.string(),
      excerpt: z.string(),
      dek: z.string().optional(),
      description: z.string().optional(),
      author: z.string().default("d00d"),
      tags: z.array(z.string()).default([]),
      category: z
        .enum([
          "technical",
          "magazine-time-machine",
          "cultural-thread",
          "grimoire",
          "stylefusion",
          "hobbot",
          "business",
          "research",
        ])
        .optional(),
      // Canonical departments. Source of truth: src/data/departments.ts.
      // Legacy values still live in `category` (kept below) and resolve to these
      // via resolveDepartment(); new/migrated content should use these slugs.
      department: z
        .enum([
          "magazine-time-machine",
          "wtfacts",
          "satire",
          "picture-stories",
          "funnies",
          "cute-corrupted",
          "before-after-eras",
          "critter-feed",
          "hobfarm-presents",
          "workshop-notes",
          "essays-arguments",
        ])
        .optional(),
      // Object-type. Source of truth: src/data/formats.ts.
      format: z
        .enum([
          "article",
          "cartoon",
          "wtf-card",
          "satire-piece",
          "picture-story",
          "gallery-set",
          "video",
          "trailer",
          "workshop-note",
          "character-page",
          "cover",
        ])
        .optional(),
      series: z.string().optional(),
      hero: z.string().optional(),
      heroImage: z.string().optional(),
      heroAlt: z.string().optional(),
      socialImage: z.string().optional(),
      thumbnail: z.string().optional(),
      socialCaption: z.string().optional(),
      arrangement: z.string().optional(),
      canonical: z.string().optional(),
      publishedAt: z.coerce.date().optional(),
      pubDate: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      updatedDate: z.coerce.date().optional(),
      featured: z.boolean().default(false),
      coverStory: z.boolean().default(false),
      relatedArticles: z.array(z.string()).optional(),
      relatedGallery: z.string().optional(),
      relatedProject: z.string().optional(),
      relatedVideo: z.string().optional(),
      workshopCTA: z
        .object({
          label: z.string(),
          href: z.string(),
        })
        .optional(),
      academyCTA: z
        .object({
          label: z.string(),
          href: z.string(),
        })
        .optional(),
      supportCTA: z
        .object({
          label: z.string(),
          href: z.string(),
        })
        .optional(),
      // Editorial status, additive to `draft`. `draft` (and draft:true) still
      // hides an article; status of draft/scheduled/archived hides it too.
      status: z
        .enum(["draft", "scheduled", "published", "archived"])
        .default("published"),
      draft: z.boolean().default(false),
    })
    .refine((data) => data.publishedAt || data.pubDate, {
      message: "Articles need publishedAt or pubDate.",
      path: ["publishedAt"],
    }),
});

export const GALLERY_TYPES = [
  "fashion",
  "character-dev",
  "before-and-after",
  "cute-corrupted",
  "compilation",
  "scene",
  "asset-lab",
  "model-lab",
  "video-workflow",
  "premium-showcase",
] as const;

const heroImage = z.object({
  type: z.literal("image"),
  file: z.string(),
  alt: z.string(),
});

const heroVideo = z.object({
  type: z.literal("video"),
  file: z.string(),
  alt: z.string(),
  poster: z.string(),
});

const galleryMediaItem = z.object({
  type: z.enum(["image", "video"]),
  file: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
  role: z
    .enum(["primary", "reference", "variant", "failure", "preview", "process"])
    .optional(),
  provider: z.string().optional(),
  poster: z.string().optional(),
  // Paid-asset safety. `paid` marks this specific file as a paid original
  // (disables full-size lightbox for video; images are always capped).
  // `previewMaxWidth` lowers the public preview cap further (never above the
  // global 1600 cap in src/data/asset-policy.ts).
  paid: z.boolean().optional(),
  previewMaxWidth: z.number().int().positive().optional(),
});

// Paid-asset safety policy. Records that an entry's full-resolution originals
// are sold off-site, so public pages expose only capped/cropped previews.
// Enforcement lives in src/lib/gallery.ts + the gallery components.
// CONVENTION: never reference a full-res paid original as a public media[].file
// or hero.file. Public entries reference web-size crops (suffix -web/-preview);
// the un-suffixed original stays off public pages / on the external storefront.
const paidAssetPolicySchema = z.object({
  hasPaidAsset: z.boolean().default(false),
  publicPreviewOnly: z.boolean().default(true),
  allowedPublicPreviewTypes: z
    .array(z.enum(["thumb", "web-preview", "poster", "video-preview", "crop"]))
    .default(["web-preview", "poster", "video-preview"]),
  fullAssetHostedOnSite: z.boolean().default(false),
  notes: z.string().optional(),
});

const gallery = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/gallery" }),
  schema: z.object({
    title: z.string(),
    type: z.enum(GALLERY_TYPES),
    // Optional editorial filing. When absent, department pages fall back to a
    // type -> department map (src/data/departments.ts). Not required this pass.
    department: z
      .enum([
        "magazine-time-machine",
        "wtfacts",
        "satire",
        "picture-stories",
        "funnies",
        "cute-corrupted",
        "before-after-eras",
        "critter-feed",
        "hobfarm-presents",
        "workshop-notes",
        "essays-arguments",
      ])
      .optional(),
    format: z
      .enum([
        "article",
        "cartoon",
        "wtf-card",
        "satire-piece",
        "picture-story",
        "gallery-set",
        "video",
        "trailer",
        "workshop-note",
        "character-page",
        "cover",
      ])
      .optional(),
    summary: z.string(),
    folder: z.string(),
    hero: z.discriminatedUnion("type", [heroImage, heroVideo]),
    heroAspect: z.string().optional(),

    // Paid-asset safety. Present when this entry has a paid full-res counterpart
    // sold off-site; drives the lightbox/OG/JSON-LD capping in the components.
    paidAssetPolicy: paidAssetPolicySchema.optional(),

    date: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),

    thumb: z
      .object({
        file: z.string(),
        alt: z.string(),
      })
      .optional(),

    media: z.array(galleryMediaItem).default([]),

    mediaSections: z
      .array(
        z.object({
          title: z.string(),
          text: z.string().optional(),
          media: z.array(galleryMediaItem),
        }),
      )
      .optional(),

    irFile: z.string().optional(),

    infoModules: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      )
      .default([]),

    comparison: z
      .object({
        mode: z.enum(["image", "text", "multimodal", "video"]).optional(),
        testedModels: z.array(z.string()).optional(),
        promptSummary: z.string().optional(),
        findings: z.array(z.string()).optional(),
        failureModes: z.array(z.string()).optional(),
        bestFor: z.array(z.string()).optional(),
      })
      .optional(),

    processNotes: z.string().optional(),

    externalLinks: z
      .object({
        deviantArt: z.url().optional(),
        deviantArtPremium: z.url().optional(),
        kofi: z.url().optional(),
        patreon: z.url().optional(),
        course: z.url().optional(),
      })
      .optional(),

    related: z.array(z.string()).optional(),

    methods: z.array(z.string()).optional(),
    relatedProcess: z.string().optional(),

    concept: z
      .object({
        thesis: z.string().optional(),
        method: z.string().optional(),
        seedInputs: z.array(z.string()).optional(),
        growthStages: z.array(z.string()).optional(),
        reusablePattern: z.string().optional(),
        usefulFor: z.array(z.string()).optional(),
      })
      .optional(),

    fieldNotes: z
      .array(
        z.object({
          label: z.string(),
          text: z.string(),
        }),
      )
      .optional(),

    visualDNA: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      )
      .optional(),

    workflowSteps: z
      .array(
        z.object({
          label: z.string(),
          text: z.string(),
        }),
      )
      .optional(),

    lessons: z
      .array(
        z.object({
          label: z.string(),
          text: z.string(),
          kind: z.enum(["win", "lesson", "fail"]).optional(),
        }),
      )
      .optional(),

    lockedTraits: z.array(z.string()).optional(),
    flexibleTraits: z.array(z.string()).optional(),

    specimenSheet: z
      .object({
        specimenId: z.string().optional(),
        subjectName: z.string().optional(),
        subjectRole: z.string().optional(),
        edition: z.string().optional(),
        status: z.string().optional(),
        origin: z.string().optional(),
        creator: z.string().optional(),
        license: z.string().optional(),
        dropDate: z.coerce.date().optional(),
        dimensions: z.string().optional(),
      })
      .optional(),

    colorChemistry: z
      .object({
        palette: z
          .array(
            z.object({
              name: z.string(),
              hex: z.string(),
              finish: z.string().optional(),
              role: z.string().optional(),
            }),
          )
          .optional(),
        mood: z.string().optional(),
        contrast: z.string().optional(),
        notes: z.string().optional(),
      })
      .optional(),

    wardrobeGrammar: z
      .array(
        z.object({
          item: z.string(),
          materials: z.array(z.string()).optional(),
          colors: z.array(z.string()).optional(),
          notes: z.string().optional(),
        }),
      )
      .optional(),

    materials: z.array(z.string()).optional(),
    accessories: z.array(z.string()).optional(),

    styleProfile: z
      .object({
        anchors: z.array(z.string()).optional(),
        arrangement: z.string().optional(),
        register: z.string().optional(),
        weight: z.string().optional(),
        era: z.string().optional(),
        hardness: z.string().optional(),
        notes: z.string().optional(),
      })
      .optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      tier: z.enum(["1", "2", "3"]),
      status: z.enum(["live", "active", "planned", "paused"]),
      category: z.enum([
        "tool",
        "content",
        "service",
        "collaboration",
        "game",
        "research",
        "education",
      ]),
      type: z
        .enum(["tool", "game", "content", "service", "research", "education"])
        .optional(),
      title: z.string(),
      subtitle: z.string(),
      description: z.string(),
      oneLiner: z.string().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      liveUrl: z.string().optional(),
      repoUrl: z.string().optional(),
      heroVideo: z.string().optional(),
      heroImage: z.string().optional(),
      logo: z
        .object({
          url: image(),
          alt: z.string(),
        })
        .optional(),
      image: z
        .object({
          url: image(),
          alt: z.string(),
        })
        .optional(),
      images: z
        .array(
          z.object({
            url: image(),
            alt: z.string(),
          }),
        )
        .optional(),
      stack: z.array(z.string()).optional(),
      highlights: z.array(z.string()).optional(),
      features: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
          }),
        )
        .optional(),
      // Optional CTAs. When `ctas` is non-empty, or `primaryCta` is set,
      // the detail layout suppresses the auto-generated "Visit Project"
      // button (sourced from liveUrl) in favor of these. The repoUrl-driven
      // "Source Code" button is unaffected.
      //
      // `ctas` is the multi-button form (used e.g. by the shop page for
      // Etsy / Ko-fi / Visuals / Contact): an ordered list rendered as
      // buttons (first default-styled, the rest muted). `external: true`
      // opens in a new tab; internal paths like /gallery stay same-tab.
      // `primaryCta`/`secondaryCta` remain for the membership-gated funnel.
      ctas: z
        .array(
          z.object({
            label: z.string(),
            href: z.string(),
            external: z.boolean().optional(),
          }),
        )
        .optional(),
      // Optional heading override for the features grid (defaults to
      // "System Features"). Lets the shop label its grid "Product Families".
      featuresTitle: z.string().optional(),
      primaryCta: z
        .object({
          label: z.string(),
          href: z.string(),
        })
        .optional(),
      secondaryCta: z
        .object({
          label: z.string(),
          href: z.string(),
        })
        .optional(),
    }),
});

const changelog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/changelog" }),
  schema: z.object({
    title: z.string(),
    project: z
      .enum(["stylefusion", "grimoire", "hobbot", "hobfarm", "kalshi"])
      .optional(),
    version: z.string().optional(),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const help = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/help" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    project: z
      .enum(["stylefusion", "grimoire", "hobbot", "general"])
      .default("general"),
    section: z.string().default("general"),
    order: z.number().default(0),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
});

const grimoire = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/grimoire" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    subcategory: z.string().optional(),
    order: z.number().optional(),
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    related: z.array(z.string()).optional(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    project: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const stack = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/stack" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    url: z.string().optional(),
    icon: z.string().optional(),
  }),
});

// Comics are image-first objects (single-panel gags, strips, recurring bits),
// not articles. They live in their own collection so they get clean
// /funnies/[series]/[slug] URLs and stay out of /articles and RSS.
// `series` and `characters` are slugs into src/data/comic-series.ts and
// src/data/characters.ts. department/format default to the comics taxonomy.
const comics = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/comics" }),
  schema: z.object({
    title: z.string(),
    series: z.string(),
    characters: z.array(z.string()).default([]),
    department: z
      .enum([
        "magazine-time-machine",
        "wtfacts",
        "satire",
        "picture-stories",
        "funnies",
        "cute-corrupted",
        "before-after-eras",
        "critter-feed",
        "hobfarm-presents",
        "workshop-notes",
        "essays-arguments",
      ])
      .default("funnies"),
    format: z
      .enum([
        "article",
        "cartoon",
        "wtf-card",
        "satire-piece",
        "picture-story",
        "gallery-set",
        "video",
        "trailer",
        "workshop-note",
        "character-page",
        "cover",
      ])
      .default("cartoon"),
    image: z.string(),
    imageAlt: z.string().optional(),
    caption: z.string().optional(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),
    socialCaption: z.string().optional(),
    status: z
      .enum(["draft", "scheduled", "published", "archived"])
      .default("published"),
    draft: z.boolean().default(false),
  }),
});

// Adventures are HobFarm Presents' fiction installments: long-form serial
// story content (unlike comics, which are image-first). They live in their
// own collection so they get clean /departments/hobfarm-presents/[series]/[slug]
// URLs and stay out of /articles and RSS. `series` is a slug into
// src/data/story-series.ts (a loose string, like comics.series, validated only
// at the CMS layer). `region` is free text naming a world/zone within the
// series (e.g. "Wonderland", "the Wasteland", "the holes between").
const adventures = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/adventures" }),
  schema: z.object({
    series: z.string(),
    number: z.number().int().positive(),
    title: z.string(),
    teaser: z.string(),
    summary: z.string().optional(),
    department: z
      .enum([
        "magazine-time-machine",
        "wtfacts",
        "satire",
        "picture-stories",
        "funnies",
        "cute-corrupted",
        "before-after-eras",
        "critter-feed",
        "hobfarm-presents",
        "workshop-notes",
        "essays-arguments",
      ])
      .default("hobfarm-presents"),
    region: z.string().optional(),
    cover: z.string(),
    coverAlt: z.string().optional(),
    heroMedia: z.discriminatedUnion("type", [heroImage, heroVideo]).optional(),
    mediaBadges: z.array(z.string()).default([]),
    mediaSections: z
      .array(
        z.object({
          title: z.string(),
          text: z.string().optional(),
          media: z.array(galleryMediaItem),
        }),
      )
      .optional(),
    fieldNotes: z
      .array(
        z.object({
          label: z.string(),
          text: z.string(),
        }),
      )
      .optional(),
    credits: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
        }),
      )
      .default([]),
    relatedArticle: z.string().optional(),
    relatedArticleTitle: z.string().optional(),
    relatedGallery: z.string().optional(),
    relatedGalleryTitle: z.string().optional(),
    nextAdventureTeaser: z
      .object({
        number: z.number().int().positive(),
        title: z.string(),
        summary: z.string(),
        status: z.string().default("Coming next"),
      })
      .optional(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),
    status: z
      .enum(["draft", "scheduled", "published", "archived"])
      .default("published"),
    draft: z.boolean().default(false),
  }),
});

// Products / drops. External-first: each product links OUT to a storefront
// (DeviantArt first). previewImage is a {folder,file} pair rendered through the
// capped helpers in src/lib/gallery.ts, so a public preview never exposes a
// paid original. Cross-refs (department/visualSystem/relatedArticle) are slugs.
const products = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    platform: z.enum([
      "deviantart",
      "kofi",
      "etsy",
      "ebay",
      "lemon-squeezy",
      "hobfarm-direct",
      "patreon",
    ]),
    // Storefront/listing URL. Optional so a planned/coming-soon drop can exist
    // before it goes live.
    externalUrl: z.url().optional(),
    productType: z.enum([
      "premium-sheet-pack",
      "digital-download",
      "print",
      "pod",
      "handmade",
      "vintage",
      "bundle",
    ]),
    previewImage: z.object({
      folder: z.string(),
      file: z.string(),
      alt: z.string(),
    }),
    shortDescription: z.string(),
    includedItems: z.array(z.string()).default([]),
    department: z
      .enum([
        "magazine-time-machine",
        "wtfacts",
        "satire",
        "picture-stories",
        "funnies",
        "cute-corrupted",
        "before-after-eras",
        "critter-feed",
        "hobfarm-presents",
        "workshop-notes",
        "essays-arguments",
      ])
      .optional(),
    visualSystem: z.string().optional(),
    relatedArticle: z.string().optional(),
    relatedWorkshopNote: z.string().optional(),
    priceLabel: z.string().optional(),
    paidAssetPolicy: paidAssetPolicySchema.optional(),
    status: z
      .enum(["live", "planned", "coming-soon", "sold-out", "archived"])
      .default("planned"),
    dropDate: z.coerce.date().optional(),
    edition: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  articles,
  gallery,
  projects,
  changelog,
  help,
  legal,
  grimoire,
  stack,
  comics,
  products,
  adventures,
};
