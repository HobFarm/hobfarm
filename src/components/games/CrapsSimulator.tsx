import { useMemo, useState } from "react";
import ActiveBetsPanel from "@/components/games/craps/ActiveBetsPanel";
import BettingSurface from "@/components/games/craps/BettingSurface";
import Chip from "@/components/games/craps/Chip";
import Die from "@/components/games/craps/Die";
import DistributionPanel from "@/components/games/craps/DistributionPanel";
import RollLogPanel from "@/components/games/craps/RollLogPanel";
import {
  createCrapsGame,
  getMaxOddsStake,
  getTotalAtRisk,
  isPointNumber,
  placeBet,
  placeOdds,
  rollGame,
  type ActionResult,
  type CrapsBet,
  type CrapsGameState,
  type DiceRoll,
  type DieFace,
  type OddsMode,
  type PointNumber,
  type TableConfigInput,
} from "@/lib/craps/engine";

type SetupForm = {
  bankroll: string;
  minBet: string;
  maxBet: string;
  oddsMode: OddsMode;
  customOdds: string;
  chipUnit: string;
  fieldTwelvePays: string;
};

type LineBetKind = "pass" | "dontPass" | "come" | "dontCome" | "field";

const DEFAULT_SETUP: SetupForm = {
  bankroll: "200",
  minBet: "5",
  maxBet: "500",
  oddsMode: "3-4-5x",
  customOdds: "10",
  chipUnit: "1",
  fieldTwelvePays: "2",
};

const ODDS_OPTIONS: { value: OddsMode; label: string }[] = [
  { value: "1x", label: "1x odds" },
  { value: "2x", label: "2x odds" },
  { value: "3-4-5x", label: "3-4-5x odds" },
  { value: "5x", label: "5x odds" },
  { value: "10x", label: "10x odds" },
  { value: "custom", label: "Custom odds" },
];

export default function CrapsSimulator() {
  const [setup, setSetup] = useState<SetupForm>(DEFAULT_SETUP);
  const [game, setGame] = useState<CrapsGameState | null>(null);
  const [selectedChip, setSelectedChip] = useState(5);
  const [notice, setNotice] = useState("Configure a free-play table to begin.");
  const [isRolling, setIsRolling] = useState(false);
  const [displayRoll, setDisplayRoll] = useState<DiceRoll | null>(null);

  const chipValues = useMemo(() => buildChipValues(game, setup), [game, setup]);
  const activeTotal = game ? getTotalAtRisk(game) : 0;
  const visibleRoll = displayRoll ?? game?.lastRoll ?? null;

  function updateSetup(field: keyof SetupForm, value: string) {
    setSetup((current) => ({ ...current, [field]: value }));
  }

  function applyPreset(nextSetup: Partial<SetupForm>) {
    setSetup((current) => ({ ...current, ...nextSetup }));
  }

  function startSession() {
    try {
      const nextGame = createCrapsGame(parseSetup(setup));
      setGame(nextGame);
      setDisplayRoll(null);
      setSelectedChip(nextGame.config.minBet);
      setNotice(
        `${formatMoney(nextGame.config.initialBankroll)} bankroll, ${formatMoney(
          nextGame.config.minBet
        )} minimum, ${describeOdds(nextGame.config.oddsMode, nextGame.config.customOdds)}.`
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not start the table.");
    }
  }

  function resetToSetup() {
    setGame(null);
    setDisplayRoll(null);
    setIsRolling(false);
    setNotice("Configure a free-play table to begin.");
  }

  function applyAction(result: ActionResult) {
    if (!result.ok) {
      setNotice(result.error ?? "That action is not available.");
      return;
    }
    setGame(result.state);
    setNotice("Bet accepted.");
  }

  function addFlatBet(kind: LineBetKind) {
    if (!game || isRolling) return;
    applyAction(placeBet(game, { kind, amount: selectedChip }));
  }

  function addPlaceBet(number: PointNumber) {
    if (!game || isRolling) return;
    applyAction(placeBet(game, { kind: "place", number, amount: selectedChip }));
  }

  function addOdds(bet: CrapsBet) {
    if (!game || isRolling) return;
    applyAction(placeOdds(game, bet.id, selectedChip));
  }

  function roll() {
    if (!game || isRolling) return;

    const result = rollGame(game);
    let frame = 0;

    setIsRolling(true);
    setNotice("Dice rolling...");

    const intervalId = window.setInterval(() => {
      frame += 1;
      setDisplayRoll(cycleRoll(frame));
    }, 48);

    window.setTimeout(() => {
      window.clearInterval(intervalId);
      setDisplayRoll(result.roll);
      setGame(result.state);
      setNotice(formatRollNotice(result.roll, result.events.map((event) => event.message)));
      setIsRolling(false);
    }, 360);
  }

  if (!game) {
    return (
      <div className="craps-setup-grid">
        <section className="craps-setup-card">
          <div className="craps-panel__header">
            <div>
              <p className="craps-kicker">Free-play craps lab</p>
              <h2>Configure the table</h2>
            </div>
            <p>Bankroll, table rules, chip unit, and odds profile.</p>
          </div>

          <div className="craps-form-grid">
            <NumberField label="Bankroll" value={setup.bankroll} onChange={(value) => updateSetup("bankroll", value)} />
            <NumberField label="Table minimum" value={setup.minBet} onChange={(value) => updateSetup("minBet", value)} />
            <NumberField label="Table maximum" value={setup.maxBet} onChange={(value) => updateSetup("maxBet", value)} />
            <NumberField label="Table denomination" value={setup.chipUnit} onChange={(value) => updateSetup("chipUnit", value)} />

            <label className="craps-input">
              <span>Odds</span>
              <select value={setup.oddsMode} onChange={(event) => updateSetup("oddsMode", event.target.value as OddsMode)}>
                {ODDS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <NumberField
              label="Custom odds multiple"
              value={setup.customOdds}
              disabled={setup.oddsMode !== "custom"}
              onChange={(value) => updateSetup("customOdds", value)}
            />

            <label className="craps-input">
              <span>Field 12 pays</span>
              <select value={setup.fieldTwelvePays} onChange={(event) => updateSetup("fieldTwelvePays", event.target.value)}>
                <option value="2">Double</option>
                <option value="3">Triple</option>
              </select>
            </label>
          </div>

          <div className="craps-action-row">
            <button type="button" onClick={startSession} className="craps-primary-action">
              Start table
            </button>
            <button
              type="button"
              onClick={() => applyPreset({ bankroll: "200", minBet: "5", maxBet: "500", oddsMode: "3-4-5x", chipUnit: "1" })}
              className="craps-secondary-action"
            >
              $200 / $5 / 3-4-5x
            </button>
            <button
              type="button"
              onClick={() => applyPreset({ bankroll: "1000", minBet: "10", maxBet: "2000", oddsMode: "10x", chipUnit: "5" })}
              className="craps-secondary-action"
            >
              $1000 / $10 / 10x
            </button>
          </div>
        </section>

        <aside className="craps-panel">
          <div className="craps-panel__header">
            <div>
              <p className="craps-kicker">RNG audit</p>
              <h2>Fair dice</h2>
            </div>
          </div>
          <div className="craps-audit-copy">
            <p>
              Dice use <span>crypto.getRandomValues</span> with rejection sampling, so each face maps uniformly to 1
              through 6 without modulo bias.
            </p>
            <p>The dice motion is cosmetic. Settlement uses the two generated die faces and the tested craps engine.</p>
            <p>This is a virtual-chip simulator only. It has no deposits, cashout, or real-money wagering.</p>
          </div>
          <p className="craps-notice">{notice}</p>
        </aside>
      </div>
    );
  }

  return (
    <div className="craps-lab-shell">
      <section className="craps-lab-main">
        <div className="craps-status-grid">
          <StatusTile label="Bankroll" value={formatMoney(game.bankroll)} tone="green" />
          <StatusTile label="On table" value={formatMoney(activeTotal)} />
          <StatusTile label="Point" value={game.point ? String(game.point) : "Off"} tone={game.point ? "gold" : "muted"} />
          <StatusTile label="Rolls" value={String(game.rollHistory.length)} />
        </div>

        <section className="craps-throw-deck">
          <div>
            <p className="craps-kicker">Dice station</p>
            <div className="craps-dice-row">
              <Die value={visibleRoll?.die1 ?? 1} rolling={isRolling} label="First die" />
              <Die value={visibleRoll?.die2 ?? 1} rolling={isRolling} label="Second die" />
              <div className="craps-total-readout">
                <span>Total</span>
                <strong>{visibleRoll?.total ?? "--"}</strong>
              </div>
            </div>
          </div>
          <div className="craps-roll-controls">
            <button type="button" onClick={roll} disabled={isRolling} className="craps-roll-button">
              {isRolling ? "Rolling" : "Roll dice"}
            </button>
            <p className="craps-notice">{notice}</p>
          </div>
        </section>

        <section className="craps-chip-rail" aria-label="Chip selector">
          <div>
            <p className="craps-kicker">Chip rail</p>
            <p>Selected chip places flat bets and adds odds where legal.</p>
          </div>
          <div className="craps-chip-list">
            {chipValues.map((chip) => (
              <Chip key={chip} value={chip} selected={selectedChip === chip} disabled={isRolling} onSelect={setSelectedChip} />
            ))}
          </div>
        </section>

        <BettingSurface
          bets={game.bets}
          phase={game.phase}
          point={game.point}
          selectedChip={selectedChip}
          onLineBet={addFlatBet}
          onPlaceBet={addPlaceBet}
        />

        <ActiveBetsPanel
          bets={game.bets}
          oddsLabel={describeOdds(game.config.oddsMode, game.config.customOdds)}
          fieldTwelvePays={game.config.fieldTwelvePays}
          lastEvents={game.lastEvents}
          getRemainingOdds={(bet) => getRemainingOdds(game, bet)}
          onAddOdds={addOdds}
        />
      </section>

      <aside className="craps-lab-side">
        <section className="craps-panel">
          <div className="craps-panel__header">
            <div>
              <p className="craps-kicker">Session</p>
              <h2>Controls</h2>
            </div>
            <button type="button" onClick={resetToSetup} className="craps-secondary-action">
              New setup
            </button>
          </div>
          <dl className="craps-session-list">
            <div>
              <dt>Start</dt>
              <dd>{formatMoney(game.config.initialBankroll)}</dd>
            </div>
            <div>
              <dt>Minimum</dt>
              <dd>{formatMoney(game.config.minBet)}</dd>
            </div>
            <div>
              <dt>Maximum</dt>
              <dd>{formatMoney(game.config.maxBet)}</dd>
            </div>
          </dl>
        </section>

        <RollLogPanel game={game} />
        <DistributionPanel history={game.rollHistory} />
      </aside>
    </div>
  );
}

function NumberField({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="craps-input">
      <span>{label}</span>
      <input type="number" min="0" step="1" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function StatusTile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "green" | "gold" | "muted";
}) {
  return (
    <div className={`craps-status-tile craps-status-tile--${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

function parseSetup(setup: SetupForm): TableConfigInput {
  const bankroll = readPositiveNumber(setup.bankroll, "Bankroll");
  const minBet = readPositiveNumber(setup.minBet, "Table minimum");
  const maxBet = readPositiveNumber(setup.maxBet, "Table maximum");
  const chipUnit = readPositiveNumber(setup.chipUnit, "Table denomination");
  const customOdds = readPositiveNumber(setup.customOdds, "Custom odds multiple");
  const fieldTwelvePays = readPositiveNumber(setup.fieldTwelvePays, "Field 12 payout");

  return {
    bankroll,
    minBet,
    maxBet,
    oddsMode: setup.oddsMode,
    customOdds,
    chipUnit,
    fieldTwelvePays,
  };
}

function readPositiveNumber(value: string, label: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`${label} must be greater than 0.`);
  return parsed;
}

function buildChipValues(game: CrapsGameState | null, setup: SetupForm) {
  const unit = game ? game.config.chipUnit : Math.max(1, Number(setup.chipUnit) || 1);
  const minimum = game ? game.config.minBet : Math.max(unit, Number(setup.minBet) || unit);
  const raw = [unit, minimum, minimum * 2, minimum * 5, minimum * 10, unit * 25, unit * 100];

  return [...new Set(raw.map((value) => Math.round(value * 100) / 100))]
    .filter((value) => Number.isFinite(value) && value > 0)
    .sort((a, b) => a - b)
    .slice(0, 6);
}

function getRemainingOdds(game: CrapsGameState, bet: CrapsBet) {
  const point = getOddsPoint(game, bet);
  if (!point) return null;
  const maximum = getMaxOddsStake(game.config, bet.amount, point);
  return Math.max(0, Math.round((maximum - bet.odds) * 100) / 100);
}

function getOddsPoint(game: CrapsGameState, bet: CrapsBet): PointNumber | null {
  if ((bet.kind === "pass" || bet.kind === "dontPass") && game.point) return game.point;
  if ((bet.kind === "come" || bet.kind === "dontCome") && bet.number && isPointNumber(bet.number)) return bet.number;
  return null;
}

function cycleRoll(frame: number): DiceRoll {
  const die1 = (((frame + 1) % 6) + 1) as DieFace;
  const die2 = (((frame + 4) % 6) + 1) as DieFace;
  return { die1, die2, total: die1 + die2 };
}

function formatRollNotice(roll: DiceRoll, messages: string[]) {
  if (messages.length > 0) return messages.join(" ");
  return `Rolled ${roll.die1}+${roll.die2} = ${roll.total}. No decision.`;
}

function describeOdds(mode: OddsMode, customOdds: number) {
  return mode === "custom" ? `${customOdds}x odds` : `${mode} odds`;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}
