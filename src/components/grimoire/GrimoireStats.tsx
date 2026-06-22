import { useState, useEffect, useRef } from "react";

interface AtomStats {
  total: number;
  by_collection: Record<string, number>;
  by_status: Record<string, number>;
  by_source: Record<string, number>;
}

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

const WORKER_URL = "https://grimoire.damp-violet-bf89.workers.dev";

function AnimatedCounter({
  target,
  duration = 2000,
  suffix = "",
}: {
  target: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || target === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          function animate(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function GrimoireStats() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${WORKER_URL}/atoms/stats`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: AtomStats = await res.json();

        const items: StatItem[] = [
          { label: "Total Atoms", value: data.total },
        ];

        // Add collection counts
        const collections = Object.entries(data.by_collection || {});
        if (collections.length > 0) {
          items.push(
            ...collections
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([key, val]) => ({
                label: key.charAt(0).toUpperCase() + key.slice(1),
                value: val,
              }))
          );
        }

        // Add source counts
        const sources = Object.entries(data.by_source || {});
        if (sources.length > 0) {
          items.push({
            label: "Sources",
            value: sources.length,
          });
        }

        setStats(items);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (error || loading) return null;
  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="text-center p-4 rounded-xl bg-base-900 border border-base-700 hover:border-accent-400/30 transition-colors duration-300"
        >
          <div className="text-2xl sm:text-3xl font-semibold text-base-100 font-mono tabular-nums">
            <AnimatedCounter target={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-[10px] font-mono text-base-500 uppercase tracking-wider mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
