import { avatarCourse } from "@/data/avatar-content-system";

export type AcademyCourseSource = "legacy" | "content";

export interface AcademyCourseLane {
  title: string;
  description: string;
  accent: "cyan" | "magenta" | "yellow";
}

export interface AcademyCourseArtifact {
  title: string;
  description: string;
}

export interface AcademyDownload {
  slug: string;
  label: string;
  description: string;
  href: string;
  format: "Markdown";
  printable?: boolean;
}

export interface AcademySourceNote {
  label: string;
  url: string;
  note: string;
}

export interface AcademyCourse {
  slug: string;
  source: AcademyCourseSource;
  title: string;
  shortTitle: string;
  href: string;
  startHref: string;
  ctaLabel: string;
  description: string;
  deck: string;
  statusLabel: string;
  accessLabel: string;
  duration: string;
  cover: string;
  coverImage?: string;
  socialImage?: string;
  coverAlt?: string;
  articleHref?: string;
  articleLabel?: string;
  lanes?: AcademyCourseLane[];
  artifacts?: AcademyCourseArtifact[];
  downloads?: AcademyDownload[];
  sourceNotes?: AcademySourceNote[];
}

const cdn = "https://cdn.hob.farm/self-defense";

export const intellectualSelfDefenseCourse: AcademyCourse = {
  slug: "intellectual-self-defense",
  source: "content",
  title: "Intellectual Self-Defense for Ordinary People",
  shortTitle: "Intellectual Self-Defense",
  href: "/academy/intellectual-self-defense/",
  startHref: "/academy/intellectual-self-defense/the-card-catalog-started-talking-back/",
  ctaLabel: "View course",
  description:
    "A practical field guide to using AI, social media, and modern media without outsourcing your judgment.",
  deck:
    "Learn how to turn chatbots into research tools, guide creative work with source files, inspect mixed human-and-AI media, and build a personal method for deciding what deserves your belief, attention, and action.",
  statusLabel: "Available now",
  accessLabel: "Free and public",
  duration: "About 2 hours, plus exercises",
  cover: `${cdn}/shared/course-cover-v1-16x9.webp`,
  coverImage: `${cdn}/shared/course-cover-v1-16x9.webp`,
  socialImage: `${cdn}/shared/course-cover-v1-16x9.webp`,
  coverAlt:
    "A human operator routes source cards, creative materials, and media frames through a three-station mechanical workbench while holding the final control lever.",
  articleHref: "/articles/the-card-catalog-started-talking-back/",
  articleLabel: "Why this course exists: The Card Catalog Started Talking Back",
  lanes: [
    {
      title: "Use AI to learn",
      description: "Define the research job, open the sources, compare accounts, preserve uncertainty, and rebuild the answer the receipts support.",
      accent: "cyan",
    },
    {
      title: "Use AI to make",
      description: "Turn taste and constraints into reusable source files, control scope, route work between tools, and approve canon deliberately.",
      accent: "magenta",
    },
    {
      title: "Live around AI",
      description: "Trace mixed-origin media through captions, edits, algorithms, reactions, summaries, and the opinion waiting at the end.",
      accent: "yellow",
    },
  ],
  artifacts: [
    {
      title: "Research Assistant Contract",
      description: "Reusable custom instructions for a source-conscious research job.",
    },
    {
      title: "Creative Source File",
      description: "A project file that names canon, constraints, invention permissions, and stop conditions.",
    },
    {
      title: "AI Output Receipt",
      description: "A record of what the tool retrieved, inferred, invented, and decided.",
    },
    {
      title: "Personal Protocol — Version 1",
      description: "Your own rules for evidence, creative delegation, scope drift, sharing, and uncertainty.",
    },
  ],
  downloads: [
    {
      slug: "research-chatbot-custom-instructions",
      label: "Research Chatbot Custom Instructions",
      description: "Define the job, source standard, output, and stop condition before the answer arrives.",
      href: `${cdn}/downloads/research-chatbot-custom-instructions.md`,
      format: "Markdown",
    },
    {
      slug: "creative-source-file-starter",
      label: "Creative Source File Starter",
      description: "Record project purpose, canon, invariants, replacement choices, and invention boundaries.",
      href: `${cdn}/downloads/creative-source-file-starter.md`,
      format: "Markdown",
    },
    {
      slug: "ai-output-receipt",
      label: "AI Output Receipt",
      description: "Audit assignment fidelity, evidence, invention, useful material, and unauthorized decisions.",
      href: `${cdn}/downloads/ai-output-receipt.md`,
      format: "Markdown",
      printable: true,
    },
    {
      slug: "receipt-report",
      label: "Receipt Report",
      description: "Rebuild one factual answer from opened sources and record what remains unresolved.",
      href: `${cdn}/downloads/receipt-report.md`,
      format: "Markdown",
    },
    {
      slug: "my-intellectual-self-defense-protocol-v1",
      label: "My Intellectual Self-Defense Protocol — Version 1",
      description: "Write, date, test, and revise a personal protocol that fits your actual subjects and risks.",
      href: `${cdn}/downloads/my-intellectual-self-defense-protocol-v1.md`,
      format: "Markdown",
      printable: true,
    },
  ],
  sourceNotes: [
    {
      label: "Noam Chomsky, interview with Robert Borofsky (2001)",
      url: "https://chomsky.info/20010527/",
      note: "Primary lineage for the phrase 'a course in intellectual self-defense' and explicit credit to Edward S. Herman as co-author of Manufacturing Consent.",
    },
    {
      label: "Normand Baillargeon, A Short Course in Intellectual Self-Defense",
      url: "https://www.sevenstories.com/books/2843-a-short-course-in-intellectual-self-defense",
      note: "Publisher record for the direct predecessor and its broader focus on logic, language, numbers, science, politics, and media.",
    },
    {
      label: "NIST AI RMF: Generative Artificial Intelligence Profile",
      url: "https://doi.org/10.6028/NIST.AI.600-1",
      note: "Official guidance on confabulation, citation risk, information integrity, human oversight, and verification.",
    },
    {
      label: "C2PA and Content Credentials Explainer",
      url: "https://c2pa.org/specifications/specifications/2.2/explainer/Explainer.html",
      note: "Official explanation of provenance and the limit that provenance alone cannot establish whether content is true, accurate, or factual.",
    },
    {
      label: "Library of Congress Card Catalog Research Guide",
      url: "https://guides.loc.gov/card-catalog/using-the-card-catalog",
      note: "Official account of the card catalog as the Library's primary discovery interface before the online catalog.",
    },
    {
      label: "Wineburg et al., Lateral Reading on the Open Internet",
      url: "https://doi.org/10.1037/edu0000740",
      note: "Primary research on leaving an unfamiliar page to investigate the source through the open web.",
    },
  ],
};

const avatarCourseRecord: AcademyCourse = {
  slug: avatarCourse.slug,
  source: "legacy",
  title: avatarCourse.productName,
  shortTitle: avatarCourse.productName,
  href: `${avatarCourse.basePath}/`,
  startHref: avatarCourse.freePath,
  ctaLabel: "View course",
  description: avatarCourse.summary,
  deck: avatarCourse.thesis,
  statusLabel: "Beta access",
  accessLabel: "Free overview + paid lessons",
  duration: "Self-paced",
  cover: "https://cdn.hob.farm/pages/projects/images/hobfarm-courses-banner.jpg",
  coverAlt: "HobFarm course banner for practical AI production workflows.",
};

export const academyCourses: AcademyCourse[] = [
  intellectualSelfDefenseCourse,
  avatarCourseRecord,
];

export const contentAcademyCourses = academyCourses.filter(
  (course) => course.source === "content",
);

export function getAcademyCourse(slug: string): AcademyCourse | undefined {
  return academyCourses.find((course) => course.slug === slug);
}
