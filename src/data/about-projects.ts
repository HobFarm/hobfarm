// Workshop teaser for the about page. Mirrors /projects (The Workshop), drops
// internal/bench experiments, links to canonical destinations.
export interface WorkshopTeaser {
  title: string;
  status: string;
  statusClass: string; // text-accent-green (live) | text-accent-500 (engine/early)
  hook: string;
  href: string;
  external?: boolean;
}

export const workshopTeasers: WorkshopTeaser[] = [
  {
    title: "StyleFusion",
    status: "Free Lab",
    statusClass: "text-accent-green",
    hook: "Multi-provider image generation. Swap the model, keep the character.",
    href: "/projects/stylefusion/",
  },
  {
    title: "Grimoire",
    status: "Engine Room",
    statusClass: "text-accent-500",
    hook: "The knowledge layer underneath everything. A living database, not a chatbot.",
    href: "/grimoire",
  },
  {
    title: "Visuals",
    status: "Live",
    statusClass: "text-accent-green",
    hook: "Finished pieces and build notes: character sheets, visual DNA, reusable patterns.",
    href: "/gallery",
  },
  {
    title: "Shop",
    status: "Open",
    statusClass: "text-accent-green",
    hook: "Prints, digital goods, stickers, character resources, and resale finds.",
    href: "/shop/",
  },
  {
    title: "HobFarm TV",
    status: "Just Starting",
    statusClass: "text-accent-500",
    hook: "The picture-show channel: 3 Degrees of Dick Miller, Magazine Time Machine, and more in production.",
    href: "/projects/hobfarm-tv/",
  },
  {
    title: "HobFarm Academy",
    status: "In Production",
    statusClass: "text-accent-500",
    hook: "Courses that teach the method: free intro, paid depth, then hire.",
    href: "/academy/",
  },
];
