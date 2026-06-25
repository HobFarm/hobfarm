import type { RollRecord } from "@/lib/craps/engine";

interface DistributionPanelProps {
  history: RollRecord[];
}

const TOTALS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const COMBINATIONS: Record<number, number> = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 5,
  9: 4,
  10: 3,
  11: 2,
  12: 1,
};

export default function DistributionPanel({ history }: DistributionPanelProps) {
  const counts = buildCounts(history);
  const max = Math.max(0, ...Object.values(counts));

  return (
    <section className="craps-panel">
      <div className="craps-panel__header">
        <div>
          <p className="craps-kicker">Distribution</p>
          <h2>Roll shape</h2>
        </div>
        <p>{history.length} rolls</p>
      </div>

      <div className="craps-distribution">
        {TOTALS.map((total) => {
          const count = counts[total] ?? 0;
          const width = max > 0 ? `${Math.max(3, (count / max) * 100)}%` : "3%";

          return (
            <div key={total} className="craps-distribution__row">
              <span>{total}</span>
              <div>
                <i style={{ width }} />
              </div>
              <strong>{count}</strong>
              <small>{COMBINATIONS[total]}/36</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function buildCounts(history: RollRecord[]) {
  const counts = Object.fromEntries(TOTALS.map((total) => [total, 0])) as Record<number, number>;

  for (const record of history) {
    counts[record.roll.total] += 1;
  }

  return counts;
}
