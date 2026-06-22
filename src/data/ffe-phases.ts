export interface FFEPhase {
  symbol: "Shape1" | "Shape2" | "Shape3" | "Shape4" | "Shape5" | "Shape6";
  label: string;
  name: string;
  oneLiner: string;
  description: string;
  animationDuration: number;
}

export const ffePhases: FFEPhase[] = [
  {
    symbol: "Shape1",
    label: "INGEST",
    name: "Capture the mess",
    oneLiner: "Capture the mess. Normalize, don't interpret.",
    description:
      "Whatever you throw at it: images, documents, recordings, raw ideas. Nothing gets interpreted yet. Everything gets structured into something the system can actually navigate, not a giant text dump crammed into a single prompt.",
    animationDuration: 1500,
  },
  {
    symbol: "Shape2",
    label: "INDEX",
    name: "Map before you move",
    oneLiner: "Map it. Make it searchable before AI touches it.",
    description:
      "The system builds a searchable map of your data before the AI touches any of it. Think of it as organizing a filing cabinet before asking someone to find something. No guessing, no hallucinating connections that don't exist.",
    animationDuration: 2000,
  },
  {
    symbol: "Shape3",
    label: "MEDIATE",
    name: "Pull, don't push",
    oneLiner: "Give AI a query interface. Pull, don't push.",
    description:
      "This is the phase most AI tools skip entirely. Instead of stuffing everything into one prompt and hoping, the AI gets tools to query exactly what it needs. Like looking something up instead of trying to remember a book you read six months ago.",
    animationDuration: 2500,
  },
  {
    symbol: "Shape4",
    label: "EXECUTE",
    name: "Think in steps",
    oneLiner: "Think in steps. Recurse when needed.",
    description:
      "AI gets a fixed amount of computation per word. Ask it to solve something complex in one shot and it will confidently give you the wrong answer. So we don't ask in one shot. Complex work gets broken into pieces small enough for AI to handle reliably. Each piece can spawn its own sub-pipeline, following the exact same six phases. This is the fractal: same structure, any depth.",
    animationDuration: 1500,
  },
  {
    symbol: "Shape5",
    label: "VALIDATE",
    name: "Human checkpoint",
    oneLiner: "Human checkpoint. No fully automated complex output.",
    description:
      "No fully automated output on complex tasks. A person verifies the work before it ships. AI is brilliant at producing answers that are 80% right but wrong in ways you can't easily spot. This phase catches it.",
    animationDuration: 2000,
  },
  {
    symbol: "Shape6",
    label: "DELIVER",
    name: "Invisible labor, visible results",
    oneLiner: "Clean output. The engine disappears.",
    description:
      "Clean output. Structured, typed, ready for whatever comes next. The engine disappears. Only the result matters. This is the philosophy behind everything HobFarm builds: automate the tedious structural work so the human focuses on meaningful decisions.",
    animationDuration: 2500,
  },
];
