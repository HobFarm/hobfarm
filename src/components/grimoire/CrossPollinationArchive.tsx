import { useCallback, useEffect, useRef, useState } from "react";

import {
  grimoireSyntheses,
  synthesisKindMeta,
  type GrimoireSynthesis,
} from "@/data/grimoire-synthesis";
import { isValidSynthesis } from "@/lib/grimoire/synthesis";
import {
  cardFramingNote,
  plausibilityChip,
  publicTagLabel,
} from "@/lib/grimoire/display";

type ArchiveResponse = {
  items?: unknown;
  total?: number;
  offset?: number;
  limit?: number;
  next_offset?: number | null;
};

const PAGE_LIMIT = 24;
const LIVE_GRIMOIRE_ENABLED = import.meta.env.PUBLIC_GRIMOIRE_LIVE === "true";

// Pre-launch / offline fallback so the page is never empty: the curated set.
const FALLBACK: GrimoireSynthesis[] = grimoireSyntheses;

function kindMeta(kind: string) {
  return (
    synthesisKindMeta[kind as keyof typeof synthesisKindMeta] ?? {
      label: kind,
      accent: "var(--color-accent-500)",
    }
  );
}

// Live items carry generated_at (ISO-8601); curated/older items only the id
// (YYYY-MM-DD). Either parses to the day for the card label.
function itemDate(item: GrimoireSynthesis): string | null {
  const raw = item.generated_at ?? item.id;
  if (typeof raw !== "string") return null;
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function SynthesisCard({ item }: { item: GrimoireSynthesis }) {
  const meta = kindMeta(item.kind);
  const date = itemDate(item);
  const plaus = plausibilityChip(item.plausibility);
  const note = cardFramingNote(item);
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-base-800 bg-base-900/70 shadow-dimensional">
      <div className="border-b border-base-800 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
            style={{
              color: meta.accent,
              borderColor: `color-mix(in srgb, ${meta.accent} 35%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${meta.accent} 10%, transparent)`,
            }}
          >
            {meta.label}
          </span>
          {plaus && (
            <span
              className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
              style={{
                color: plaus.accent,
                borderColor: `color-mix(in srgb, ${plaus.accent} 35%, transparent)`,
                backgroundColor: `color-mix(in srgb, ${plaus.accent} 10%, transparent)`,
              }}
            >
              {plaus.label}
            </span>
          )}
          {date && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-base-500">
              {date}
            </span>
          )}
        </div>
        <h2 className="mt-2 font-display text-lg leading-tight text-white sm:text-xl">
          {item.title}
        </h2>
        <p className="mt-1.5 text-[11px] leading-snug text-base-500">{note}</p>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 py-4 sm:px-5">
        {item.image?.url && (
          <figure className="overflow-hidden rounded-md border border-base-800">
            <img
              src={item.image.url}
              alt={item.image.alt ?? ""}
              loading="lazy"
              className="aspect-video w-full object-cover"
            />
          </figure>
        )}

        <p className="text-sm leading-relaxed text-base-200">{item.synthesis}</p>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-base-500">
            Fused from
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.ingredients.map((ing, i) => (
              <span
                key={`${ing.category}-${ing.label}-${i}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-base-700 bg-base-950/70 px-2.5 py-1.5 text-[11px] leading-none text-base-200"
              >
                <span className="font-mono uppercase tracking-wider text-accent-500">
                  {ing.category}
                </span>
                <span className="text-base-300">{publicTagLabel(ing.label)}</span>
              </span>
            ))}
          </div>
        </div>

        {item.connection && (
          <div className="rounded-md border border-base-800 bg-base-950/50 px-3 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-base-500">
              Why it connects
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-base-400">{item.connection}</p>
          </div>
        )}

        {((item.use_as?.length ?? 0) > 0 || (item.not_for?.length ?? 0) > 0) && (
          <div className="flex flex-col gap-1">
            {item.use_as?.length ? (
              <p className="text-[11px] leading-snug text-base-400">
                <span className="font-mono uppercase tracking-wider text-spot-green">
                  Use as
                </span>{" "}
                {item.use_as.join(" · ")}
              </p>
            ) : null}
            {item.not_for?.length ? (
              <p className="text-[11px] leading-snug text-base-500">
                <span className="font-mono uppercase tracking-wider text-base-500">
                  Not for
                </span>{" "}
                {item.not_for.join(" · ")}
              </p>
            ) : null}
          </div>
        )}

        {item.thread?.href && (
          <div className="mt-auto pt-1">
            <a
              href={item.thread.href}
              className="rounded-full border border-accent-500/40 px-3 py-1.5 text-[11px] leading-none text-accent-300 transition-colors hover:border-accent-500 hover:text-white"
            >
              {item.thread.label}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

export default function CrossPollinationArchive() {
  const [items, setItems] = useState<GrimoireSynthesis[]>(FALLBACK);
  const [isLive, setIsLive] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const seen = useRef<Set<string>>(new Set());

  const fetchPage = useCallback(async (offset: number, replace: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/grimoire/archive?offset=${offset}&limit=${PAGE_LIMIT}`, {
        headers: { accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as ArchiveResponse;
      const valid = Array.isArray(data.items)
        ? (data.items.filter(isValidSynthesis) as GrimoireSynthesis[])
        : [];

      if (replace) {
        if (valid.length === 0) {
          // Live endpoint reachable but no entries yet (before the first daily
          // cron run). Keep the curated preview instead of blanking the grid.
          setTotal(typeof data.total === "number" ? data.total : null);
          setNextOffset(null);
          return;
        }
        seen.current = new Set(valid.map((v) => v.id));
        setItems(valid);
        setIsLive(true);
      } else {
        const fresh = valid.filter((v) => !seen.current.has(v.id));
        fresh.forEach((v) => seen.current.add(v.id));
        setItems((prev) => [...prev, ...fresh]);
      }
      setTotal(typeof data.total === "number" ? data.total : null);
      setNextOffset(typeof data.next_offset === "number" ? data.next_offset : null);
    } catch {
      // Keep whatever is already shown (curated fallback on first load).
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!LIVE_GRIMOIRE_ENABLED) return;

    fetchPage(0, true);
  }, [fetchPage]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-widest text-base-500">
          {isLive && total !== null
            ? `${total} cross-pollinations on record`
            : isLive
              ? "live archive"
              : "preview / curated set"}
        </p>
        {!isLive && !loading && (
          <p className="font-mono text-[10px] uppercase tracking-wider text-base-600">
            showing a preview until the first daily synthesis lands
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <SynthesisCard key={`${item.id}-${i}`} item={item} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        {nextOffset !== null && (
          <button
            type="button"
            onClick={() => fetchPage(nextOffset, false)}
            disabled={loading}
            className="rounded-full border border-accent-500/40 px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-accent-300 transition-colors hover:border-accent-500 hover:text-white disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        )}
      </div>
    </div>
  );
}
