import { getBetLabel, type CrapsBet, type GameEvent } from "@/lib/craps/engine";

interface ActiveBetsPanelProps {
  bets: CrapsBet[];
  oddsLabel: string;
  fieldTwelvePays: number;
  lastEvents: GameEvent[];
  getRemainingOdds: (bet: CrapsBet) => number | null;
  onAddOdds: (bet: CrapsBet) => void;
}

export default function ActiveBetsPanel({
  bets,
  oddsLabel,
  fieldTwelvePays,
  lastEvents,
  getRemainingOdds,
  onAddOdds,
}: ActiveBetsPanelProps) {
  return (
    <section className="craps-panel craps-active-bets">
      <div className="craps-panel__header">
        <div>
          <p className="craps-kicker">Active bets</p>
          <h2>Working layout</h2>
        </div>
        <p>{oddsLabel} / Field 12 {fieldTwelvePays}x</p>
      </div>

      {lastEvents.length > 0 ? (
        <div className="craps-resolution-strip" aria-label="Last roll resolution">
          {lastEvents.map((event, index) => (
            <span key={`${event.message}-${index}`} className={`craps-resolution craps-resolution--${event.type}`}>
              {event.message}
            </span>
          ))}
        </div>
      ) : null}

      {bets.length === 0 ? (
        <p className="craps-empty">No active bets. Pick a chip and select a table zone.</p>
      ) : (
        <div className="craps-bet-card-grid">
          {bets.map((bet) => {
            const remaining = getRemainingOdds(bet);
            return (
              <article key={bet.id} className="craps-bet-card">
                <div>
                  <h3>{getBetLabel(bet)}</h3>
                  <p>{bet.id}</p>
                </div>
                <dl>
                  <div>
                    <dt>Flat</dt>
                    <dd>{formatMoney(bet.amount)}</dd>
                  </div>
                  <div>
                    <dt>Odds</dt>
                    <dd>{bet.odds ? formatMoney(bet.odds) : "-"}</dd>
                  </div>
                  <div>
                    <dt>Left</dt>
                    <dd>{remaining === null ? "-" : formatMoney(remaining)}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() => onAddOdds(bet)}
                  disabled={remaining === null || remaining <= 0}
                  className="craps-mini-action"
                >
                  {remaining === null ? "No odds" : "Add odds"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}
