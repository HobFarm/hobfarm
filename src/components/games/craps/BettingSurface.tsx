import type { CrapsBet, GamePhase, PointNumber } from "@/lib/craps/engine";

type LineBetKind = "pass" | "dontPass" | "come" | "dontCome" | "field";

interface BettingSurfaceProps {
  bets: CrapsBet[];
  phase: GamePhase;
  point: PointNumber | null;
  selectedChip: number;
  onLineBet: (kind: LineBetKind) => void;
  onPlaceBet: (number: PointNumber) => void;
}

const POINTS: PointNumber[] = [4, 5, 6, 8, 9, 10];

export default function BettingSurface({
  bets,
  phase,
  point,
  selectedChip,
  onLineBet,
  onPlaceBet,
}: BettingSurfaceProps) {
  return (
    <section className="craps-table" aria-label="Craps betting surface">
      <svg className="craps-table__svg" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="craps-table-felt" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#082323" />
            <stop offset="50%" stopColor="#071619" />
            <stop offset="100%" stopColor="#0b0a13" />
          </linearGradient>
          <radialGradient id="craps-table-glow" cx="50%" cy="22%" r="72%">
            <stop offset="0%" stopColor="#19e3e3" stopOpacity="0.18" />
            <stop offset="58%" stopColor="#19e3e3" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="8" y="8" width="984" height="504" rx="34" fill="url(#craps-table-felt)" stroke="#164b4f" strokeWidth="2" />
        <rect x="22" y="22" width="956" height="476" rx="26" fill="url(#craps-table-glow)" stroke="#19e3e3" strokeOpacity="0.23" />
        <path d="M70 128h860M70 278h860M70 402h860M500 128v274" stroke="#19e3e3" strokeOpacity="0.18" strokeWidth="2" />
        <path d="M92 72c120 34 255 51 408 51s288-17 408-51" stroke="#e0b13c" strokeOpacity="0.28" strokeWidth="2" fill="none" />
      </svg>

      <div className="craps-table__content">
        <div className="craps-table__header">
          <div>
            <p className="craps-kicker">Betting surface</p>
            <h2>Craps Lab table</h2>
          </div>
          <div className={["craps-point-chip", point ? "craps-point-chip--on" : ""].join(" ")}>
            <span>Point</span>
            <strong>{point ?? "Off"}</strong>
          </div>
        </div>

        <div className="craps-zone-grid craps-zone-grid--line">
          <BetZone
            label="Pass line"
            detail="Come-out"
            amount={zoneStake(bets, "pass")}
            disabled={phase !== "comeOut"}
            selectedChip={selectedChip}
            onClick={() => onLineBet("pass")}
          />
          <BetZone
            label="Don't pass"
            detail="Bar 12"
            amount={zoneStake(bets, "dontPass")}
            disabled={phase !== "comeOut"}
            selectedChip={selectedChip}
            onClick={() => onLineBet("dontPass")}
          />
          <BetZone
            label="Come"
            detail="Point required"
            amount={zoneStake(bets, "come")}
            disabled={phase !== "point"}
            selectedChip={selectedChip}
            onClick={() => onLineBet("come")}
          />
          <BetZone
            label="Don't come"
            detail="Point required"
            amount={zoneStake(bets, "dontCome")}
            disabled={phase !== "point"}
            selectedChip={selectedChip}
            onClick={() => onLineBet("dontCome")}
          />
        </div>

        <button type="button" className="craps-field-zone" onClick={() => onLineBet("field")}>
          <span>
            <strong>Field</strong>
            <small>2, 3, 4, 9, 10, 11, 12</small>
          </span>
          <ZoneAmount amount={zoneStake(bets, "field")} selectedChip={selectedChip} />
        </button>

        <div className="craps-place-row" aria-label="Place number bets">
          {POINTS.map((number) => (
            <button
              key={number}
              type="button"
              className={["craps-place-zone", point === number ? "craps-place-zone--point" : ""].join(" ")}
              onClick={() => onPlaceBet(number)}
            >
              <span className="craps-place-zone__number">{number}</span>
              <span className="craps-place-zone__label">Place</span>
              <ZoneAmount amount={zoneStake(bets, `point-${number}`)} selectedChip={selectedChip} compact />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function BetZone({
  label,
  detail,
  amount,
  disabled,
  selectedChip,
  onClick,
}: {
  label: string;
  detail: string;
  amount: number;
  disabled?: boolean;
  selectedChip: number;
  onClick: () => void;
}) {
  return (
    <button type="button" className="craps-bet-zone" disabled={disabled} onClick={onClick}>
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <ZoneAmount amount={amount} selectedChip={selectedChip} />
    </button>
  );
}

function ZoneAmount({
  amount,
  selectedChip,
  compact = false,
}: {
  amount: number;
  selectedChip: number;
  compact?: boolean;
}) {
  return (
    <span className={["craps-zone-amount", amount > 0 ? "craps-zone-amount--active" : ""].join(" ")}>
      {amount > 0 ? formatMoney(amount) : compact ? "+" : `+${formatMoney(selectedChip)}`}
    </span>
  );
}

export function zoneStake(bets: CrapsBet[], zone: string): number {
  return roundMoney(
    bets.reduce((total, bet) => {
      if (zone === "pass" && bet.kind === "pass") return total + bet.amount + bet.odds;
      if (zone === "dontPass" && bet.kind === "dontPass") return total + bet.amount + bet.odds;
      if (zone === "come" && bet.kind === "come" && bet.number === null) return total + bet.amount + bet.odds;
      if (zone === "dontCome" && bet.kind === "dontCome" && bet.number === null) return total + bet.amount + bet.odds;
      if (zone === "field" && bet.kind === "field") return total + bet.amount;

      if (zone.startsWith("point-")) {
        const number = Number(zone.replace("point-", ""));
        if (bet.kind === "place" && bet.number === number) return total + bet.amount;
        if ((bet.kind === "come" || bet.kind === "dontCome") && bet.number === number) {
          return total + bet.amount + bet.odds;
        }
      }

      return total;
    }, 0)
  );
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}
