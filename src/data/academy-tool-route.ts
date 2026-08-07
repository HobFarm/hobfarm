export interface AcademyToolRouteQuestion {
  id: string;
  prompt: string;
  choices?: string[];
}

export const academyToolRoute = {
  slug: "choose-the-tool-for-the-job",
  title: "Choose the Tool for the Job",
  status: "planned",
  access: "public",
  updatedAt: "2026-08-06",
  providerFactsVerifiedAt: null,
  purpose:
    "Start with the intended output, available inputs, and operating constraints before naming a provider.",
  questions: [
    { id: "output", prompt: "What are you making?" },
    { id: "inputs", prompt: "What inputs do you already have?" },
    {
      id: "interface",
      prompt: "Which working surface fits the job?",
      choices: ["Chat interface", "Direct provider interface", "API", "Hosted workflow", "Local node system"],
    },
    { id: "continuity", prompt: "How much identity, style, scene, or motion continuity is required?" },
    { id: "control", prompt: "Which controls must remain explicit and repeatable?" },
    { id: "budget", prompt: "What is the total budget, including generation, storage, and delivery?" },
    { id: "privacy", prompt: "What privacy, rights, consent, or data-location limits apply?" },
    { id: "region", prompt: "Which countries or regions must the workflow support?" },
    { id: "speed", prompt: "What response, render, or delivery time is acceptable?" },
    { id: "chain", prompt: "Can one tool complete the job, or does the output need a chain of tools?" },
  ] satisfies AcademyToolRouteQuestion[],
} as const;
