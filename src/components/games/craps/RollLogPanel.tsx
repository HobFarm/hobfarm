import type { CrapsGameState, RollRecord } from "@/lib/craps/engine";

interface RollLogPanelProps {
  game: CrapsGameState;
}

export default function RollLogPanel({ game }: RollLogPanelProps) {
  const last = game.rollHistory.at(-1);

  return (
    <section className="craps-panel">
      <div className="craps-panel__header">
        <div>
          <p className="craps-kicker">Roll feedback</p>
          <h2>Last decision</h2>
        </div>
        <p>{game.point ? `Point ${game.point}` : "Point off"}</p>
      </div>

      {last ? (
        <div className="craps-last-roll">
          <div>
            <span>{last.roll.die1}</span>
            <small>+</small>
            <span>{last.roll.die2}</span>
          </div>
          <strong>{last.roll.total}</strong>
          <p>{rollTag(last)}</p>
        </div>
      ) : (
        <p className="craps-empty">Rolls will appear here.</p>
      )}

      {game.rollHistory.length > 0 ? (
        <ol className="craps-roll-log">
          {game.rollHistory
            .slice(-8)
            .reverse()
            .map((record) => (
              <li key={record.index}>
                <span className="craps-roll-log__total">{record.roll.total}</span>
                <div>
                  <p>
                    #{record.index} {record.roll.die1}+{record.roll.die2} / {rollTag(record)}
                  </p>
                  <small>
                    {record.events.length > 0 ? record.events.map((event) => event.message).join(" ") : "No decision."}
                  </small>
                </div>
              </li>
            ))}
        </ol>
      ) : null}
    </section>
  );
}

function rollTag(record: RollRecord) {
  if (record.phaseBefore === "comeOut" && (record.roll.total === 7 || record.roll.total === 11)) return "Natural";
  if (record.phaseBefore === "comeOut" && [2, 3, 12].includes(record.roll.total)) return "Craps";
  if (record.events.some((event) => event.message.startsWith("Point is"))) return "Point established";
  if (record.phaseBefore === "point" && record.roll.total === 7) return "Seven out";
  if (record.phaseBefore === "point" && record.roll.total === record.pointBefore) return "Point hit";
  return "No decision";
}
