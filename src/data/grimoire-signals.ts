// Non-numeric substrate signals for the public /grimoire/ page.
// Numeric corpus counts (atoms, composites, correspondences, etc.) require
// live D1 reads and are deferred to Phase 2. See GrimoireStats.tsx for the
// live-fetch component that will replace this strip once wired up.

export type GrimoireSignal = {
  label: string;
  state: string;
  caption?: string;
  accent?: "violet" | "green" | "cyan";
};

export const grimoireSignals: GrimoireSignal[] = [
  { label: "References",        state: "indexed",       caption: "visual + textual",  accent: "violet" },
  { label: "Atoms",             state: "schema-backed", caption: "structured units",  accent: "green"  },
  { label: "Composites",        state: "tracked",       caption: "arrangements",      accent: "violet" },
  { label: "Correspondences",   state: "linked",        caption: "cross-references",  accent: "cyan"   },
  { label: "Source families",   state: "ingested",      caption: "multiple paths",    accent: "violet" },
  { label: "Worlds",            state: "active",        caption: "universes",         accent: "green"  },
  { label: "Agent runs",        state: "logged",        caption: "context returned",  accent: "cyan"   },
  { label: "Validation traces", state: "replayable",    caption: "audit trail",       accent: "violet" },
];
