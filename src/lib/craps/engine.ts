export type DieFace = 1 | 2 | 3 | 4 | 5 | 6;
export type PointNumber = 4 | 5 | 6 | 8 | 9 | 10;
export type OddsMode = "1x" | "2x" | "3-4-5x" | "5x" | "10x" | "custom";
export type GamePhase = "comeOut" | "point";

export interface DiceRoll {
  die1: DieFace;
  die2: DieFace;
  total: number;
}

export interface TableConfigInput {
  bankroll: number;
  minBet: number;
  maxBet: number;
  oddsMode: OddsMode;
  customOdds?: number;
  fieldTwoPays?: number;
  fieldTwelvePays?: number;
  chipUnit?: number;
}

export interface TableConfig {
  initialBankroll: number;
  minBet: number;
  maxBet: number;
  oddsMode: OddsMode;
  customOdds: number;
  fieldTwoPays: number;
  fieldTwelvePays: number;
  chipUnit: number;
}

export type CrapsBet =
  | {
      id: "pass-line";
      kind: "pass";
      amount: number;
      odds: number;
    }
  | {
      id: "dont-pass";
      kind: "dontPass";
      amount: number;
      odds: number;
    }
  | {
      id: string;
      kind: "come";
      amount: number;
      odds: number;
      number: PointNumber | null;
    }
  | {
      id: string;
      kind: "dontCome";
      amount: number;
      odds: number;
      number: PointNumber | null;
    }
  | {
      id: string;
      kind: "place";
      amount: number;
      odds: 0;
      number: PointNumber;
    }
  | {
      id: string;
      kind: "field";
      amount: number;
      odds: 0;
    };

export type BetPlacement =
  | { kind: "pass"; amount: number }
  | { kind: "dontPass"; amount: number }
  | { kind: "come"; amount: number }
  | { kind: "dontCome"; amount: number }
  | { kind: "place"; number: PointNumber; amount: number }
  | { kind: "field"; amount: number };

export interface GameEvent {
  type: "info" | "win" | "loss" | "push";
  message: string;
  amount?: number;
  betId?: string;
}

export interface RollRecord {
  index: number;
  roll: DiceRoll;
  phaseBefore: GamePhase;
  pointBefore: PointNumber | null;
  bankrollAfter: number;
  events: GameEvent[];
}

export interface CrapsGameState {
  config: TableConfig;
  bankroll: number;
  phase: GamePhase;
  point: PointNumber | null;
  bets: CrapsBet[];
  nextBetId: number;
  lastRoll: DiceRoll | null;
  lastEvents: GameEvent[];
  rollHistory: RollRecord[];
}

export interface ActionResult {
  ok: boolean;
  state: CrapsGameState;
  error?: string;
  betId?: string;
}

export interface RollResult {
  state: CrapsGameState;
  roll: DiceRoll;
  events: GameEvent[];
}

type RandomUint32 = () => number;
type DiceRoller = () => DiceRoll;

const UINT32_RANGE = 0x1_0000_0000;
const POINT_NUMBERS: PointNumber[] = [4, 5, 6, 8, 9, 10];

export function createCrapsGame(input: TableConfigInput): CrapsGameState {
  const config = normalizeConfig(input);

  return {
    config,
    bankroll: config.initialBankroll,
    phase: "comeOut",
    point: null,
    bets: [],
    nextBetId: 1,
    lastRoll: null,
    lastEvents: [],
    rollHistory: [],
  };
}

export function uniformInt(min: number, max: number, randomUint32: RandomUint32 = secureUint32): number {
  if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
    throw new Error("uniformInt requires an integer range.");
  }

  const span = max - min + 1;
  const limit = Math.floor(UINT32_RANGE / span) * span;

  while (true) {
    const draw = randomUint32();
    if (!Number.isInteger(draw) || draw < 0 || draw > 0xffff_ffff) {
      throw new Error("Random source must return a uint32.");
    }
    if (draw < limit) {
      return min + (draw % span);
    }
  }
}

export function rollDice(randomUint32: RandomUint32 = secureUint32): DiceRoll {
  const die1 = uniformInt(1, 6, randomUint32) as DieFace;
  const die2 = uniformInt(1, 6, randomUint32) as DieFace;

  return { die1, die2, total: die1 + die2 };
}

export function getMaxOddsStake(config: TableConfig, flatAmount: number, point: PointNumber): number {
  return toMoney(flatAmount * oddsMultiplier(config, point));
}

export function placeBet(state: CrapsGameState, placement: BetPlacement): ActionResult {
  const validation = validateFlatBet(state, placement.amount);
  if (validation) return { ok: false, error: validation, state };

  if (placement.kind === "pass" && state.phase !== "comeOut") {
    return { ok: false, error: "Pass line can only be placed on the come-out roll.", state };
  }

  if (placement.kind === "dontPass" && state.phase !== "comeOut") {
    return { ok: false, error: "Do not pass can only be placed on the come-out roll.", state };
  }

  if ((placement.kind === "come" || placement.kind === "dontCome") && state.phase !== "point") {
    return { ok: false, error: "Come bets require an established point.", state };
  }

  if (placement.kind === "place" && !isPointNumber(placement.number)) {
    return { ok: false, error: "Place bets must target 4, 5, 6, 8, 9, or 10.", state };
  }

  let next = cloneState(state);
  const amount = toMoney(placement.amount);
  let betId = "";

  if (placement.kind === "pass") {
    betId = "pass-line";
    next = upsertLineBet(next, "pass-line", () => ({ id: "pass-line", kind: "pass", amount: 0, odds: 0 }));
  } else if (placement.kind === "dontPass") {
    betId = "dont-pass";
    next = upsertLineBet(next, "dont-pass", () => ({ id: "dont-pass", kind: "dontPass", amount: 0, odds: 0 }));
  } else if (placement.kind === "come") {
    betId = `come-${next.nextBetId}`;
    next.nextBetId += 1;
    next.bets.push({ id: betId, kind: "come", amount: 0, odds: 0, number: null });
  } else if (placement.kind === "dontCome") {
    betId = `dont-come-${next.nextBetId}`;
    next.nextBetId += 1;
    next.bets.push({ id: betId, kind: "dontCome", amount: 0, odds: 0, number: null });
  } else if (placement.kind === "place") {
    betId = `place-${placement.number}`;
    const existing = next.bets.find((bet) => bet.id === betId);
    if (!existing) {
      next.bets.push({ id: betId, kind: "place", amount: 0, odds: 0, number: placement.number });
    }
  } else {
    betId = `field-${next.nextBetId}`;
    next.nextBetId += 1;
    next.bets.push({ id: betId, kind: "field", amount: 0, odds: 0 });
  }

  next.bets = next.bets.map((bet) =>
    bet.id === betId ? ({ ...bet, amount: toMoney(bet.amount + amount) } as CrapsBet) : bet
  );
  next.bankroll = toMoney(next.bankroll - amount);

  return { ok: true, state: next, betId };
}

export function placeOdds(state: CrapsGameState, betId: string, amount: number): ActionResult {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Odds must be greater than 0.", state };
  }

  const bet = state.bets.find((candidate) => candidate.id === betId);
  if (!bet) return { ok: false, error: "Bet was not found.", state };

  const point = getOddsPoint(state, bet);
  if (!point) return { ok: false, error: "Odds require an established point or come number.", state };

  if (bet.kind === "field" || bet.kind === "place") {
    return { ok: false, error: "Odds can only be placed behind line, come, or do not come bets.", state };
  }

  const wager = toMoney(amount);
  if (wager > state.bankroll) return { ok: false, error: "Bankroll is too small for that odds bet.", state };

  const maxOdds = getMaxOddsStake(state.config, bet.amount, point);
  if (toMoney(bet.odds + wager) > maxOdds) {
    return {
      ok: false,
      error: `Odds cannot exceed ${formatAmount(maxOdds)} behind this bet.`,
      state,
    };
  }

  const next = cloneState(state);
  next.bankroll = toMoney(next.bankroll - wager);
  next.bets = next.bets.map((candidate) =>
    candidate.id === betId ? ({ ...candidate, odds: toMoney(candidate.odds + wager) } as CrapsBet) : candidate
  );

  return { ok: true, state: next, betId };
}

export function rollGame(state: CrapsGameState, diceRoller: DiceRoller = rollDice): RollResult {
  const roll = normalizeRoll(diceRoller());
  const events: GameEvent[] = [];
  const next = cloneState(state);
  const survivors: CrapsBet[] = [];

  for (const bet of state.bets) {
    settleBet({
      bet: { ...bet },
      roll,
      state,
      events,
      survivors,
      addToBankroll(amount) {
        next.bankroll = toMoney(next.bankroll + amount);
      },
    });
  }

  if (state.phase === "comeOut" && isPointNumber(roll.total)) {
    next.phase = "point";
    next.point = roll.total;
    events.push({ type: "info", message: `Point is ${roll.total}.` });
  } else if (state.phase === "point" && (roll.total === 7 || roll.total === state.point)) {
    next.phase = "comeOut";
    next.point = null;
  }

  next.bets = survivors;
  next.lastRoll = roll;
  next.lastEvents = events;
  next.rollHistory = [
    ...state.rollHistory,
    {
      index: state.rollHistory.length + 1,
      roll,
      phaseBefore: state.phase,
      pointBefore: state.point,
      bankrollAfter: next.bankroll,
      events,
    },
  ];

  return { state: next, roll, events };
}

export function isPointNumber(value: number): value is PointNumber {
  return POINT_NUMBERS.includes(value as PointNumber);
}

export function getBetLabel(bet: CrapsBet): string {
  if (bet.kind === "pass") return "Pass line";
  if (bet.kind === "dontPass") return "Do not pass";
  if (bet.kind === "come") return bet.number ? `Come ${bet.number}` : "Come";
  if (bet.kind === "dontCome") return bet.number ? `Do not come ${bet.number}` : "Do not come";
  if (bet.kind === "place") return `Place ${bet.number}`;
  return "Field";
}

export function getTotalAtRisk(state: CrapsGameState): number {
  return toMoney(state.bets.reduce((total, bet) => total + bet.amount + bet.odds, 0));
}

function normalizeConfig(input: TableConfigInput): TableConfig {
  const initialBankroll = positiveMoney(input.bankroll, "bankroll");
  const minBet = positiveMoney(input.minBet, "table minimum");
  const maxBet = positiveMoney(input.maxBet, "table maximum");

  if (maxBet < minBet) throw new Error("Table maximum must be at least the table minimum.");

  const customOdds = input.oddsMode === "custom" ? positiveMoney(input.customOdds ?? 1, "custom odds") : 1;

  return {
    initialBankroll,
    minBet,
    maxBet,
    oddsMode: input.oddsMode,
    customOdds,
    fieldTwoPays: input.fieldTwoPays ?? 2,
    fieldTwelvePays: input.fieldTwelvePays ?? 2,
    chipUnit: positiveMoney(input.chipUnit ?? 1, "chip unit"),
  };
}

function secureUint32(): number {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.getRandomValues) {
    throw new Error("crypto.getRandomValues is required for fair dice rolls.");
  }

  const values = new Uint32Array(1);
  cryptoApi.getRandomValues(values);
  return values[0];
}

function validateFlatBet(state: CrapsGameState, amount: number): string | null {
  if (!Number.isFinite(amount) || amount <= 0) return "Bet must be greater than 0.";
  if (amount < state.config.minBet) return `Bet must be at least the ${formatAmount(state.config.minBet)} table minimum.`;
  if (amount > state.config.maxBet) return `Bet cannot exceed the ${formatAmount(state.config.maxBet)} table maximum.`;
  if (amount > state.bankroll) return "Bankroll is too small for that bet.";
  return null;
}

function upsertLineBet(
  state: CrapsGameState,
  betId: "pass-line" | "dont-pass",
  createBet: () => CrapsBet
): CrapsGameState {
  if (!state.bets.some((bet) => bet.id === betId)) {
    state.bets.push(createBet());
  }
  return state;
}

function settleBet({
  bet,
  roll,
  state,
  events,
  survivors,
  addToBankroll,
}: {
  bet: CrapsBet;
  roll: DiceRoll;
  state: CrapsGameState;
  events: GameEvent[];
  survivors: CrapsBet[];
  addToBankroll: (amount: number) => void;
}) {
  if (bet.kind === "field") {
    settleFieldBet(bet, roll, state, events, addToBankroll);
    return;
  }

  if (bet.kind === "place") {
    settlePlaceBet(bet, roll, events, survivors, addToBankroll);
    return;
  }

  if (bet.kind === "pass") {
    settlePassBet(bet, roll, state, events, survivors, addToBankroll);
    return;
  }

  if (bet.kind === "dontPass") {
    settleDontPassBet(bet, roll, state, events, survivors, addToBankroll);
    return;
  }

  if (bet.kind === "come") {
    settleComeBet(bet, roll, events, survivors, addToBankroll);
    return;
  }

  settleDontComeBet(bet, roll, events, survivors, addToBankroll);
}

function settleFieldBet(
  bet: Extract<CrapsBet, { kind: "field" }>,
  roll: DiceRoll,
  state: CrapsGameState,
  events: GameEvent[],
  addToBankroll: (amount: number) => void
) {
  const total = roll.total;
  if ([2, 3, 4, 9, 10, 11, 12].includes(total)) {
    const multiplier = total === 2 ? state.config.fieldTwoPays : total === 12 ? state.config.fieldTwelvePays : 1;
    const payout = toMoney(bet.amount * multiplier);
    addToBankroll(toMoney(bet.amount + payout));
    events.push({ type: "win", betId: bet.id, amount: payout, message: `Field wins ${formatAmount(payout)} on ${total}.` });
  } else {
    events.push({ type: "loss", betId: bet.id, amount: bet.amount, message: `Field loses ${formatAmount(bet.amount)} on ${total}.` });
  }
}

function settlePlaceBet(
  bet: Extract<CrapsBet, { kind: "place" }>,
  roll: DiceRoll,
  events: GameEvent[],
  survivors: CrapsBet[],
  addToBankroll: (amount: number) => void
) {
  if (roll.total === 7) {
    events.push({
      type: "loss",
      betId: bet.id,
      amount: bet.amount,
      message: `Place ${bet.number} loses ${formatAmount(bet.amount)} on seven-out.`,
    });
    return;
  }

  if (roll.total === bet.number) {
    const payout = placePayout(bet.amount, bet.number);
    addToBankroll(payout);
    events.push({
      type: "win",
      betId: bet.id,
      amount: payout,
      message: `Place ${bet.number} wins ${formatAmount(payout)}.`,
    });
  }

  survivors.push(bet);
}

function settlePassBet(
  bet: Extract<CrapsBet, { kind: "pass" }>,
  roll: DiceRoll,
  state: CrapsGameState,
  events: GameEvent[],
  survivors: CrapsBet[],
  addToBankroll: (amount: number) => void
) {
  if (state.phase === "comeOut") {
    if (roll.total === 7 || roll.total === 11) {
      winFlatBet(bet, "Pass line", events, addToBankroll);
      return;
    }
    if ([2, 3, 12].includes(roll.total)) {
      loseFlatBet(bet, "Pass line", events);
      return;
    }
    survivors.push(bet);
    return;
  }

  if (roll.total === state.point) {
    winFlatBet(bet, "Pass line", events, addToBankroll);
    winOddsBet(bet, state.point, "Pass odds", false, events, addToBankroll);
    return;
  }

  if (roll.total === 7) {
    loseFlatBet(bet, "Pass line", events);
    loseOddsBet(bet, "Pass odds", events);
    return;
  }

  survivors.push(bet);
}

function settleDontPassBet(
  bet: Extract<CrapsBet, { kind: "dontPass" }>,
  roll: DiceRoll,
  state: CrapsGameState,
  events: GameEvent[],
  survivors: CrapsBet[],
  addToBankroll: (amount: number) => void
) {
  if (state.phase === "comeOut") {
    if (roll.total === 2 || roll.total === 3) {
      winFlatBet(bet, "Do not pass", events, addToBankroll);
      return;
    }
    if (roll.total === 12) {
      pushBet(bet, "Do not pass pushes on 12.", events, addToBankroll);
      return;
    }
    if (roll.total === 7 || roll.total === 11) {
      loseFlatBet(bet, "Do not pass", events);
      return;
    }
    survivors.push(bet);
    return;
  }

  if (roll.total === 7) {
    winFlatBet(bet, "Do not pass", events, addToBankroll);
    winOddsBet(bet, state.point, "Do not pass odds", true, events, addToBankroll);
    return;
  }

  if (roll.total === state.point) {
    loseFlatBet(bet, "Do not pass", events);
    loseOddsBet(bet, "Do not pass odds", events);
    return;
  }

  survivors.push(bet);
}

function settleComeBet(
  bet: Extract<CrapsBet, { kind: "come" }>,
  roll: DiceRoll,
  events: GameEvent[],
  survivors: CrapsBet[],
  addToBankroll: (amount: number) => void
) {
  if (!bet.number) {
    if (roll.total === 7 || roll.total === 11) {
      winFlatBet(bet, "Come", events, addToBankroll);
      return;
    }
    if ([2, 3, 12].includes(roll.total)) {
      loseFlatBet(bet, "Come", events);
      return;
    }
    if (isPointNumber(roll.total)) {
      survivors.push({ ...bet, number: roll.total });
      events.push({ type: "info", betId: bet.id, message: `Come travels to ${roll.total}.` });
      return;
    }
  }

  if (roll.total === bet.number) {
    winFlatBet(bet, `Come ${bet.number}`, events, addToBankroll);
    winOddsBet(bet, bet.number, `Come ${bet.number} odds`, false, events, addToBankroll);
    return;
  }

  if (roll.total === 7) {
    loseFlatBet(bet, `Come ${bet.number}`, events);
    loseOddsBet(bet, `Come ${bet.number} odds`, events);
    return;
  }

  survivors.push(bet);
}

function settleDontComeBet(
  bet: Extract<CrapsBet, { kind: "dontCome" }>,
  roll: DiceRoll,
  events: GameEvent[],
  survivors: CrapsBet[],
  addToBankroll: (amount: number) => void
) {
  if (!bet.number) {
    if (roll.total === 2 || roll.total === 3) {
      winFlatBet(bet, "Do not come", events, addToBankroll);
      return;
    }
    if (roll.total === 12) {
      pushBet(bet, "Do not come pushes on 12.", events, addToBankroll);
      return;
    }
    if (roll.total === 7 || roll.total === 11) {
      loseFlatBet(bet, "Do not come", events);
      return;
    }
    if (isPointNumber(roll.total)) {
      survivors.push({ ...bet, number: roll.total });
      events.push({ type: "info", betId: bet.id, message: `Do not come travels to ${roll.total}.` });
      return;
    }
  }

  if (roll.total === 7) {
    winFlatBet(bet, `Do not come ${bet.number}`, events, addToBankroll);
    winOddsBet(bet, bet.number, `Do not come ${bet.number} odds`, true, events, addToBankroll);
    return;
  }

  if (roll.total === bet.number) {
    loseFlatBet(bet, `Do not come ${bet.number}`, events);
    loseOddsBet(bet, `Do not come ${bet.number} odds`, events);
    return;
  }

  survivors.push(bet);
}

function winFlatBet(
  bet: Extract<CrapsBet, { kind: "pass" | "dontPass" | "come" | "dontCome" }>,
  label: string,
  events: GameEvent[],
  addToBankroll: (amount: number) => void
) {
  addToBankroll(toMoney(bet.amount * 2));
  events.push({ type: "win", betId: bet.id, amount: bet.amount, message: `${label} wins ${formatAmount(bet.amount)}.` });
}

function loseFlatBet(
  bet: Extract<CrapsBet, { kind: "pass" | "dontPass" | "come" | "dontCome" }>,
  label: string,
  events: GameEvent[]
) {
  events.push({ type: "loss", betId: bet.id, amount: bet.amount, message: `${label} loses ${formatAmount(bet.amount)}.` });
}

function pushBet(
  bet: Extract<CrapsBet, { kind: "pass" | "dontPass" | "come" | "dontCome" }>,
  message: string,
  events: GameEvent[],
  addToBankroll: (amount: number) => void
) {
  addToBankroll(bet.amount + bet.odds);
  events.push({ type: "push", betId: bet.id, amount: bet.amount + bet.odds, message });
}

function winOddsBet(
  bet: Extract<CrapsBet, { kind: "pass" | "dontPass" | "come" | "dontCome" }>,
  point: PointNumber | null,
  label: string,
  isLayOdds: boolean,
  events: GameEvent[],
  addToBankroll: (amount: number) => void
) {
  if (!bet.odds || !point) return;

  const payout = isLayOdds ? layOddsPayout(bet.odds, point) : takeOddsPayout(bet.odds, point);
  addToBankroll(toMoney(bet.odds + payout));
  events.push({ type: "win", betId: bet.id, amount: payout, message: `${label} win ${formatAmount(payout)}.` });
}

function loseOddsBet(
  bet: Extract<CrapsBet, { kind: "pass" | "dontPass" | "come" | "dontCome" }>,
  label: string,
  events: GameEvent[]
) {
  if (!bet.odds) return;
  events.push({ type: "loss", betId: bet.id, amount: bet.odds, message: `${label} lose ${formatAmount(bet.odds)}.` });
}

function placePayout(amount: number, point: PointNumber): number {
  if (point === 4 || point === 10) return toMoney(amount * (9 / 5));
  if (point === 5 || point === 9) return toMoney(amount * (7 / 5));
  return toMoney(amount * (7 / 6));
}

function takeOddsPayout(amount: number, point: PointNumber): number {
  if (point === 4 || point === 10) return toMoney(amount * 2);
  if (point === 5 || point === 9) return toMoney(amount * (3 / 2));
  return toMoney(amount * (6 / 5));
}

function layOddsPayout(amount: number, point: PointNumber): number {
  if (point === 4 || point === 10) return toMoney(amount / 2);
  if (point === 5 || point === 9) return toMoney(amount * (2 / 3));
  return toMoney(amount * (5 / 6));
}

function getOddsPoint(state: CrapsGameState, bet: CrapsBet): PointNumber | null {
  if (bet.kind === "pass" || bet.kind === "dontPass") return state.phase === "point" ? state.point : null;
  if (bet.kind === "come" || bet.kind === "dontCome") return bet.number;
  return null;
}

function oddsMultiplier(config: TableConfig, point: PointNumber): number {
  if (config.oddsMode === "1x") return 1;
  if (config.oddsMode === "2x") return 2;
  if (config.oddsMode === "5x") return 5;
  if (config.oddsMode === "10x") return 10;
  if (config.oddsMode === "custom") return config.customOdds;
  if (point === 4 || point === 10) return 3;
  if (point === 5 || point === 9) return 4;
  return 5;
}

function cloneState(state: CrapsGameState): CrapsGameState {
  return {
    ...state,
    bets: state.bets.map((bet) => ({ ...bet }) as CrapsBet),
    lastEvents: [...state.lastEvents],
    rollHistory: state.rollHistory.map((record) => ({
      ...record,
      roll: { ...record.roll },
      events: record.events.map((event) => ({ ...event })),
    })),
  };
}

function normalizeRoll(roll: DiceRoll): DiceRoll {
  if (!isDieFace(roll.die1) || !isDieFace(roll.die2)) {
    throw new Error("Dice rolls must contain two faces from 1 through 6.");
  }
  return { die1: roll.die1, die2: roll.die2, total: roll.die1 + roll.die2 };
}

function isDieFace(value: number): value is DieFace {
  return Number.isInteger(value) && value >= 1 && value <= 6;
}

function positiveMoney(value: number, label: string): number {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${label} must be greater than 0.`);
  return toMoney(value);
}

function toMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatAmount(value: number): string {
  const rounded = toMoney(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}
