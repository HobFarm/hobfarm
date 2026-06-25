import { useMemo, useState, type ReactNode } from "react";
import {
  createCrapsGame,
  getBetLabel,
  getMaxOddsStake,
  getTotalAtRisk,
  isPointNumber,
  placeBet,
  placeOdds,
  rollGame,
  type ActionResult,
  type CrapsBet,
  type CrapsGameState,
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

const POINTS: PointNumber[] = [4, 5, 6, 8, 9, 10];
const TOTALS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function CrapsSimulator() {
  const [setup, setSetup] = useState<SetupForm>(DEFAULT_SETUP);
  const [game, setGame] = useState<CrapsGameState | null>(null);
  const [selectedChip, setSelectedChip] = useState(5);
  const [notice, setNotice] = useState("Configure a free-play table to begin.");
  const [isRolling, setIsRolling] = useState(false);

  const chipValues = useMemo(() => buildChipValues(game, setup), [game, setup]);
  const activeTotal = game ? getTotalAtRisk(game) : 0;
  const rollStats = useMemo(() => buildRollStats(game), [game]);

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

  function addFlatBet(kind: "pass" | "dontPass" | "come" | "dontCome" | "field") {
    if (!game) return;
    applyAction(placeBet(game, { kind, amount: selectedChip }));
  }

  function addPlaceBet(number: PointNumber) {
    if (!game) return;
    applyAction(placeBet(game, { kind: "place", number, amount: selectedChip }));
  }

  function addOdds(bet: CrapsBet) {
    if (!game) return;
    applyAction(placeOdds(game, bet.id, selectedChip));
  }

  function roll() {
    if (!game || isRolling) return;

    setIsRolling(true);
    window.setTimeout(() => {
      setGame((current) => {
        if (!current) return current;
        const result = rollGame(current);
        setNotice(
          result.events.length > 0
            ? result.events.map((event) => event.message).join(" ")
            : `Rolled ${result.roll.total}. No decisions.`
        );
        return result.state;
      });
      setIsRolling(false);
    }, 280);
  }

  if (!game) {
    return (
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)]">
        <section className="border border-base-800 bg-base-950/70 p-5 sm:p-7">
          <div className="flex flex-col gap-3 border-b border-base-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-accent-cyan-bright">
                Free-play craps lab
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Configure the table</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-base-400">
              Set bankroll, minimums, chip unit, and odds before a session. No deposits, no cashout.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <NumberField label="Bankroll" value={setup.bankroll} onChange={(value) => updateSetup("bankroll", value)} />
            <NumberField label="Table minimum" value={setup.minBet} onChange={(value) => updateSetup("minBet", value)} />
            <NumberField label="Table maximum" value={setup.maxBet} onChange={(value) => updateSetup("maxBet", value)} />
            <NumberField label="Table denomination" value={setup.chipUnit} onChange={(value) => updateSetup("chipUnit", value)} />

            <label className="block">
              <span className="font-mono text-xs uppercase tracking-wider text-base-500">Odds</span>
              <select
                value={setup.oddsMode}
                onChange={(event) => updateSetup("oddsMode", event.target.value as OddsMode)}
                className="mt-2 h-11 w-full border border-base-700 bg-base-900 px-3 text-sm text-white focus:border-accent-cyan-bright focus:outline-none"
              >
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

            <label className="block">
              <span className="font-mono text-xs uppercase tracking-wider text-base-500">Field 12 pays</span>
              <select
                value={setup.fieldTwelvePays}
                onChange={(event) => updateSetup("fieldTwelvePays", event.target.value)}
                className="mt-2 h-11 w-full border border-base-700 bg-base-900 px-3 text-sm text-white focus:border-accent-cyan-bright focus:outline-none"
              >
                <option value="2">Double</option>
                <option value="3">Triple</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startSession}
              className="h-11 border border-accent-green bg-accent-green px-5 text-sm font-semibold text-base-950 transition-colors hover:bg-accent-green-bright"
            >
              Start table
            </button>
            <button
              type="button"
              onClick={() => applyPreset({ bankroll: "200", minBet: "5", maxBet: "500", oddsMode: "3-4-5x", chipUnit: "1" })}
              className="h-11 border border-base-700 px-4 text-sm text-base-200 transition-colors hover:border-white hover:text-white"
            >
              $200 / $5 / 3-4-5x
            </button>
            <button
              type="button"
              onClick={() => applyPreset({ bankroll: "1000", minBet: "10", maxBet: "2000", oddsMode: "10x", chipUnit: "5" })}
              className="h-11 border border-base-700 px-4 text-sm text-base-200 transition-colors hover:border-white hover:text-white"
            >
              $1000 / $10 / 10x
            </button>
          </div>
        </section>

        <aside className="border border-base-800 bg-base-900/50 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-accent-gold-bright">RNG audit</p>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-base-300">
            <p>
              Dice use <span className="font-mono text-white">crypto.getRandomValues</span> with rejection sampling, so each
              face maps uniformly to 1 through 6 without modulo bias.
            </p>
            <p>
              The animation is cosmetic. Settlement uses the two generated die faces and the tested craps engine.
            </p>
            <p className="text-base-500">
              This is a strategy simulator for virtual chips only. It is not real-money gambling software.
            </p>
          </div>
          <p className="mt-5 border-t border-base-800 pt-4 text-sm text-accent-cyan-bright">{notice}</p>
        </aside>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.2fr)_380px]">
      <section className="min-w-0 border border-base-800 bg-base-950/75 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-4">
          <StatusTile label="Bankroll" value={formatMoney(game.bankroll)} tone="green" />
          <StatusTile label="On table" value={formatMoney(activeTotal)} />
          <StatusTile label="Point" value={game.point ? String(game.point) : "Off"} tone={game.point ? "gold" : "muted"} />
          <StatusTile label="Rolls" value={String(game.rollHistory.length)} />
        </div>

        <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(260px,0.55fr)]">
          <div className="min-w-0 border border-base-800 bg-base-900/50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-base-500">Bubble dice display</p>
                <div className="mt-3 flex items-center gap-3">
                  <DieFace value={game.lastRoll?.die1 ?? 1} rolling={isRolling} />
                  <DieFace value={game.lastRoll?.die2 ?? 1} rolling={isRolling} />
                  <div className="ml-1">
                    <p className="text-xs text-base-500">Last total</p>
                    <p className="text-3xl font-semibold text-white">{game.lastRoll?.total ?? "--"}</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={roll}
                disabled={isRolling}
                className="h-14 min-w-36 border border-accent-cyan bg-accent-cyan px-6 text-base font-semibold text-base-950 transition-colors hover:bg-accent-cyan-bright disabled:cursor-wait disabled:opacity-70"
              >
                {isRolling ? "Rolling" : "Roll dice"}
              </button>
            </div>
            <p className="mt-4 min-h-10 border-t border-base-800 pt-4 text-sm leading-relaxed text-base-300">{notice}</p>
          </div>

          <div className="min-w-0 border border-base-800 bg-base-900/40 p-4">
            <p className="font-mono text-xs uppercase tracking-wider text-base-500">Chip selector</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {chipValues.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSelectedChip(chip)}
                  className={[
                    "h-11 border px-2 text-sm font-semibold transition-colors",
                    selectedChip === chip
                      ? "border-accent-gold bg-accent-gold text-base-950"
                      : "border-base-700 bg-base-950 text-base-200 hover:border-white hover:text-white",
                  ].join(" ")}
                >
                  {formatMoney(chip)}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-base-500">
              Flat bets must meet the table minimum. Odds use the selected chip amount up to the configured cap.
            </p>
          </div>
        </div>

        <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(260px,0.6fr)]">
          <BetPanel title="Line and come bets">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <BetButton disabled={game.phase !== "comeOut"} label="Pass line" onClick={() => addFlatBet("pass")} />
              <BetButton disabled={game.phase !== "comeOut"} label="Don't pass" onClick={() => addFlatBet("dontPass")} />
              <BetButton disabled={game.phase !== "point"} label="Come" onClick={() => addFlatBet("come")} />
              <BetButton disabled={game.phase !== "point"} label="Don't come" onClick={() => addFlatBet("dontCome")} />
              <BetButton label="Field" onClick={() => addFlatBet("field")} />
            </div>
          </BetPanel>

          <BetPanel title="Place numbers">
            <div className="grid grid-cols-3 gap-2">
              {POINTS.map((number) => (
                <BetButton key={number} label={`Place ${number}`} onClick={() => addPlaceBet(number)} />
              ))}
            </div>
          </BetPanel>
        </div>

        <div className="mt-4 min-w-0 overflow-hidden border border-base-800 bg-base-900/40 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-xs uppercase tracking-wider text-base-500">Active bets</p>
            <p className="text-xs text-base-500">
              Odds: {describeOdds(game.config.oddsMode, game.config.customOdds)} / Field 12: {game.config.fieldTwelvePays}x
            </p>
          </div>

          {game.bets.length === 0 ? (
            <p className="mt-4 text-sm text-base-500">No active bets. Place a line bet or roll for distribution testing.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-base-500">
                  <tr className="border-b border-base-800">
                    <th className="py-2 pr-3 font-medium">Bet</th>
                    <th className="py-2 pr-3 font-medium">Flat</th>
                    <th className="py-2 pr-3 font-medium">Odds</th>
                    <th className="py-2 pr-3 font-medium">Max odds left</th>
                    <th className="py-2 pr-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {game.bets.map((bet) => {
                    const remaining = getRemainingOdds(game, bet);
                    return (
                      <tr key={bet.id} className="border-b border-base-800/70 text-base-200">
                        <td className="py-3 pr-3 text-white">{getBetLabel(bet)}</td>
                        <td className="py-3 pr-3">{formatMoney(bet.amount)}</td>
                        <td className="py-3 pr-3">{bet.odds ? formatMoney(bet.odds) : "-"}</td>
                        <td className="py-3 pr-3">{remaining === null ? "-" : formatMoney(remaining)}</td>
                        <td className="py-3 pr-3">
                          <button
                            type="button"
                            onClick={() => addOdds(bet)}
                            disabled={remaining === null || remaining <= 0}
                            className="h-9 border border-base-700 px-3 text-xs font-semibold text-base-200 transition-colors hover:border-accent-gold hover:text-accent-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {remaining === null ? "No odds" : "Add odds"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <aside className="min-w-0 space-y-5">
        <section className="border border-base-800 bg-base-950/75 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-base-500">Session controls</p>
              <p className="mt-1 text-sm text-base-300">
                {formatMoney(game.config.initialBankroll)} start / {formatMoney(game.config.minBet)} min
              </p>
            </div>
            <button
              type="button"
              onClick={resetToSetup}
              className="h-9 border border-base-700 px-3 text-xs font-semibold text-base-200 transition-colors hover:border-white hover:text-white"
            >
              New setup
            </button>
          </div>
        </section>

        <section className="border border-base-800 bg-base-950/75 p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-base-500">Roll distribution</p>
          <div className="mt-4 space-y-2">
            {TOTALS.map((total) => {
              const count = rollStats.counts[total] ?? 0;
              const width = rollStats.max > 0 ? `${Math.max(4, (count / rollStats.max) * 100)}%` : "4%";
              return (
                <div key={total} className="grid grid-cols-[2rem_1fr_2.5rem] items-center gap-2 text-xs">
                  <span className="font-mono text-base-500">{total}</span>
                  <span className="h-2 bg-base-800">
                    <span className="block h-full bg-accent-cyan" style={{ width }} />
                  </span>
                  <span className="text-right text-base-400">{count}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border border-base-800 bg-base-950/75 p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-base-500">Recent rolls</p>
          {game.rollHistory.length === 0 ? (
            <p className="mt-4 text-sm text-base-500">Rolls will appear here.</p>
          ) : (
            <ol className="mt-4 max-h-72 space-y-3 overflow-auto pr-1">
              {game.rollHistory
                .slice(-10)
                .reverse()
                .map((record) => (
                  <li key={record.index} className="border-l border-accent-cyan pl-3">
                    <p className="text-sm text-white">
                      #{record.index} rolled {record.roll.die1}+{record.roll.die2} = {record.roll.total}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-base-500">
                      {record.events.length > 0 ? record.events.map((event) => event.message).join(" ") : "No decision."}
                    </p>
                  </li>
                ))}
            </ol>
          )}
        </section>
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
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-wider text-base-500">{label}</span>
      <input
        type="number"
        min="0"
        step="1"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full border border-base-700 bg-base-900 px-3 text-sm text-white placeholder:text-base-600 focus:border-accent-cyan-bright focus:outline-none disabled:opacity-40"
      />
    </label>
  );
}

function StatusTile({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "green" | "gold" | "muted" }) {
  const valueClass =
    tone === "green"
      ? "text-accent-green-bright"
      : tone === "gold"
        ? "text-accent-gold-bright"
        : tone === "muted"
          ? "text-base-400"
          : "text-white";

  return (
    <div className="border border-base-800 bg-base-900/50 p-3">
      <p className="font-mono text-[11px] uppercase tracking-wider text-base-500">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

function DieFace({ value, rolling }: { value: number; rolling: boolean }) {
  return (
    <div
      className={[
        "grid h-20 w-20 place-items-center border border-base-700 bg-base-950 text-4xl font-semibold text-white shadow-dimensional",
        rolling ? "animate-pulse text-accent-cyan-bright" : "",
      ].join(" ")}
      aria-label={`Die showing ${value}`}
    >
      {rolling ? "?" : value}
    </div>
  );
}

function BetPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-base-800 bg-base-900/40 p-4">
      <p className="mb-3 font-mono text-xs uppercase tracking-wider text-base-500">{title}</p>
      {children}
    </section>
  );
}

function BetButton({ label, disabled, onClick }: { label: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="min-h-11 border border-base-700 bg-base-950 px-3 py-2 text-sm font-semibold text-base-200 transition-colors hover:border-accent-green hover:text-accent-green-bright disabled:cursor-not-allowed disabled:opacity-35"
    >
      {label}
    </button>
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

function buildRollStats(game: CrapsGameState | null) {
  const counts = Object.fromEntries(TOTALS.map((total) => [total, 0])) as Record<number, number>;
  if (!game) return { counts, max: 0 };

  for (const record of game.rollHistory) {
    counts[record.roll.total] += 1;
  }

  return { counts, max: Math.max(0, ...Object.values(counts)) };
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
