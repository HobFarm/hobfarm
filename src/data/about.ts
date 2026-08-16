export const aboutLinkedInUrl = "https://www.linkedin.com/in/krisreynoldslv/";

export const aboutHeroActions = [
  { label: "Explore the work", href: "/workshop/projects/", event: "about_hero_workshop_open", primary: true, external: false },
  { label: "Read the articles", href: "/articles/", event: "about_hero_articles_open", primary: false, external: false },
  { label: "Contact", href: "/contact/?subject=employment", event: "about_hero_contact_open", primary: false, external: false },
  { label: "LinkedIn", href: aboutLinkedInUrl, event: "about_hero_linkedin_open", primary: false, external: true },
] as const;

export const aboutJumpLinks = [
  { label: "Why", href: "#why" },
  { label: "What I do", href: "#what-i-do" },
  { label: "Method", href: "#method" },
  { label: "Selected work", href: "#selected-work" },
  { label: "HobFarm", href: "#hobfarm" },
  { label: "Contact", href: "#contact" },
] as const;

export const aboutCapabilities = [
  {
    title: "Publishing and web operations",
    responsibility:
      "Build and operate the system around the work: content architecture, CMS workflows, assets, quality control, release, analytics, revision, and archive.",
    result:
      "The result is a publication that can keep shipping instead of a pile of disconnected pages.",
  },
  {
    title: "Visual media and post-production",
    responsibility:
      "Take image and video work from source or brief through planning, capture or generation, editing, versioning, technical delivery, and final quality control.",
    result:
      "The result is finished media built for the place where it will actually be seen.",
  },
  {
    title: "Production management and technical execution",
    responsibility:
      "Keep people, schedules, equipment, files, vendors, and changing requirements aligned until the work is delivered.",
    result:
      "The result is a production that survives contact with the room, the deadline, and the tools.",
  },
  {
    title: "Research, editorial, and creative systems",
    responsibility:
      "Follow a real object, place, image, archive, or production question through research, source synthesis, visual evidence, and a finished argument or working system.",
    result:
      "The result can be an article, a production record, an application, or the next project.",
  },
] as const;

export const aboutMethodStages = [
  {
    title: "Research the source",
    description:
      "Begin with a question, photograph, drawing, archive, object, place, story, or production problem.",
  },
  {
    title: "Define what must remain true",
    description:
      "Identify the evidence, identity, geometry, rules, requirements, or other constraints that cannot drift.",
  },
  {
    title: "Build the system or transformation",
    description:
      "Organize the tools, assets, people, references, code, media, and production steps required by the job.",
  },
  {
    title: "Direct the result",
    description:
      "Choose the camera, composition, environment, voice, motion, interface, typography, format, and review criteria.",
  },
  {
    title: "Publish, document, and extend",
    description:
      "Finish the article, image set, video, application, campaign, tool, or production asset. Preserve the record so the work can be revised, reused, or extended.",
  },
] as const;

export const aboutSelectedWork = [
  {
    id: "articles",
    routeLabel: "Editorial",
    title: "Articles",
    premise:
      "Research, reporting, criticism, media history, source synthesis, visual evidence, and multimedia publishing.",
    proof:
      "The archive shows how a source becomes a clear argument, a visual record, and a durable publication.",
    href: "/articles/",
    linkLabel: "Read the articles",
    mediaId: "workshop.route-card.publication",
  },
  {
    id: "workshop",
    routeLabel: "Web and publishing project",
    title: "HobFarm",
    premise:
      "Sources, constraints, tests, failures, revisions, production decisions, and reusable findings stay attached to finished work.",
    proof:
      "The route makes the operating judgment inspectable instead of presenting only a polished result.",
    href: "/workshop/projects/hobfarm/",
    linkLabel: "Inspect the HobFarm project",
    mediaId: "home.site-banner",
  },
  {
    id: "stylefusion",
    routeLabel: "Application study",
    title: "StyleFusion",
    premise:
      "A structured reference-analysis system gives every approved source an explicit job and preserves the production record.",
    proof:
      "It demonstrates source roles, reusable visual rules, diagnostics, and repeatable direction across several outputs.",
    href: "/workshop/stylefusion/",
    linkLabel: "Open StyleFusion",
    mediaId: "workshop.route-card.stylefusion",
  },
  {
    id: "before-after",
    routeLabel: "Visual evidence",
    title: "Before & After",
    premise:
      "Photography, historical sources, continuity, and visual comparison stay organized around one recognizable subject.",
    proof:
      "The work clearly separates documentary evidence, restoration, and invented alternate results.",
    href: "/workshop/before-and-after/",
    linkLabel: "Compare the work",
    mediaId: "workshop.program-index.before-after",
  },
] as const;

export const aboutHobFarmRoutes = [
  {
    title: "Publication",
    description:
      "Articles are the editorial center: reporting, arguments, satire, archive dives, visual essays, and recurring departments. The complete work and its sources stay on HobFarm.",
    links: [
      { label: "Articles", href: "/articles/" },
      { label: "Presents", href: "/presents/" },
    ],
  },
  {
    title: "Workshop",
    description:
      "Workshop keeps the sources, questions, decisions, tests, failures, revisions, and reusable findings attached to the finished release.",
    links: [{ label: "Workshop", href: "/workshop/" }, { label: "How HobFarm works", href: "/workshop/projects/hobfarm/" }],
  },
  {
    title: "Presents",
    description:
      "Presents packages recurring properties for the audience when they have their own identity, archive, characters, world, visual language, or release pattern. Workshop explains how selected parts were developed.",
    links: [
      { label: "Presents", href: "/presents/" },
      { label: "Workshop Projects", href: "/workshop/projects/" },
    ],
  },
  {
    title: "Applications and interactive work",
    description:
      "Applications own direct routes and honest status notes. They do not need an article wrapper before they can exist as HobFarm work.",
    links: [{ label: "EZIZE", href: "/ezize/" }, { label: "Current projects", href: "/workshop/projects/" }],
  },
  {
    title: "Academy, Shop, and support",
    description:
      "Academy follows a method after real Workshop evidence makes it repeatable enough to teach. Shop routes credible finished products to the correct direct or external shelf. Reader support funds the next release.",
    links: [
      { label: "Academy", href: "/academy/" },
      { label: "Shop", href: "/shop/" },
      { label: "Support", href: "/support/" },
    ],
  },
] as const;

export const aboutContactLinks = [
  {
    label: "Contact HobFarm",
    href: "/contact/?subject=employment",
    event: "about_final_contact_open",
    primary: true,
    external: false,
  },
  {
    label: "LinkedIn",
    href: aboutLinkedInUrl,
    event: "about_final_linkedin_open",
    primary: false,
    external: true,
  },
  {
    label: "Explore the Workshop",
    href: "/workshop/",
    event: "about_final_workshop_open",
    primary: false,
    external: false,
  },
] as const;
