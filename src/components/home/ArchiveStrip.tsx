import { useEffect, useState } from "react";

import {
  grimoireSyntheses,
  synthesisForDate,
  synthesisKindMeta,
  type GrimoireSynthesis,
} from "@/data/grimoire-synthesis";
import { CROSS_POLLINATION_FRAMING } from "@/lib/grimoire/display";
import { isValidSynthesis } from "@/lib/grimoire/synthesis";

const SHOW = 3;
const LIVE_GRIMOIRE_ENABLED = import.meta.env.PUBLIC_GRIMOIRE_LIVE === "true";

type ArchiveResponse = { items?: unknown };

function kindAccent(kind: string): string {
  return (
    synthesisKindMeta[kind as keyof typeof synthesisKindMeta]?.accent ??
    "var(--color-accent-500)"
  );
}

function kindLabel(kind: string): string {
  return synthesisKindMeta[kind as keyof typeof synthesisKindMeta]?.label ?? kind;
}

// Live items carry generated_at / a YYYY-MM-DD id; curated items don't. Show a
// short date when we have one, otherwise fall back to the kind label.
function rowMeta(item: GrimoireSynthesis): string {
  const raw = item.generated_at ?? item.id;
  const m = typeof raw === "string" ? raw.match(/^(\d{4})-(\d{2})-(\d{2})/) : null;
  if (m) {
    const d = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00.000Z`);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    }
  }
  return kindLabel(item.kind);
}

// Live syntheses are keyed by the UTC day (see GrimoireSynthesis.id), so the
// "don't echo today's featured item" filter must compare against the UTC day
// too. Using the local day desynced the strip from the window on the
// local-behind-UTC boundary (evening in the Americas), letting the featured
// post slip through and repeat itself.
function todayUtcId(): string {
  const now = new Date();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  return `${now.getUTCFullYear()}-${mm}-${dd}`;
}

// Pre-launch / offline fallback: a few curated entries, excluding the one the
// big synthesis window is currently featuring (so the strip never echoes it).
function curatedFallback(): GrimoireSynthesis[] {
  const featuredId = synthesisForDate(new Date()).item.id;
  return grimoireSyntheses.filter((s) => s.id !== featuredId).slice(0, SHOW);
}

export default function ArchiveStrip() {
  const [items, setItems] = useState<GrimoireSynthesis[]>(curatedFallback);

  useEffect(() => {
    if (!LIVE_GRIMOIRE_ENABLED) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/grimoire/archive?offset=0&limit=6", {
          headers: { accept: "application/json" },
        });
        if (!res.ok) return;
        const data = (await res.json()) as ArchiveResponse;
        const valid = Array.isArray(data.items)
          ? (data.items.filter(isValidSynthesis) as GrimoireSynthesis[])
          : [];
        const today = todayUtcId();
        const recent = valid.filter((v) => v.id !== today).slice(0, SHOW);
        if (!cancelled && recent.length > 0) setItems(recent);
      } catch {
        // keep the curated fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside className="rounded-lg border border-base-800 bg-base-900/70 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-base-400">
            Grimoire / archive
          </p>
          <h2 className="mt-1 font-display text-base text-white">Latest from the archive</h2>
        </div>
        <a
          href="/grimoire/cross-pollination/"
          className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-base-400 transition-colors hover:text-accent-400"
        >
          View all &rarr;
        </a>
      </div>

      <ul className="mt-3 divide-y divide-base-800/70 border-t border-base-800/70">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href="/grimoire/cross-pollination/"
              className="group flex items-center gap-3 py-2.5"
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: kindAccent(item.kind), boxShadow: `0 0 8px ${kindAccent(item.kind)}` }}
              />
              <span className="min-w-0 flex-1 truncate text-sm text-base-300 transition-colors group-hover:text-white">
                {item.title}
              </span>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-base-400">
                {rowMeta(item)}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-3 border-t border-base-800/70 pt-3 font-mono text-[10px] uppercase tracking-wider text-base-400">
        {CROSS_POLLINATION_FRAMING.stripNote}
      </p>
    </aside>
  );
}
