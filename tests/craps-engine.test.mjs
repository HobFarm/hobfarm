import assert from "node:assert/strict";
import test from "node:test";

import {
  createCrapsGame,
  getMaxOddsStake,
  placeBet,
  placeOdds,
  rollDice,
  rollGame,
  uniformInt,
} from "../src/lib/craps/engine.ts";

function forceRoll(die1, die2) {
  return () => ({ die1, die2, total: die1 + die2 });
}

function expectOk(result) {
  assert.equal(result.ok, true, result.error);
  return result;
}

test("uniformInt rejects out-of-range entropy instead of modulo-biasing dice", () => {
  const draws = [4_294_967_295, 7];
  const value = uniformInt(1, 6, () => draws.shift());

  assert.equal(value, 2);
  assert.equal(draws.length, 0);
});

test("rollDice draws two independent fair die faces", () => {
  const draws = [0, 5];

  assert.deepEqual(rollDice(() => draws.shift()), { die1: 1, die2: 6, total: 7 });
});

test("3-4-5x odds limits change by point number", () => {
  const game = createCrapsGame({ bankroll: 200, minBet: 5, maxBet: 500, oddsMode: "3-4-5x" });

  assert.equal(getMaxOddsStake(game.config, 5, 4), 15);
  assert.equal(getMaxOddsStake(game.config, 5, 5), 20);
  assert.equal(getMaxOddsStake(game.config, 5, 6), 25);
  assert.equal(getMaxOddsStake(game.config, 5, 10), 15);
});

test("pass line sets a point, then pays flat and true odds when the point repeats", () => {
  let game = createCrapsGame({ bankroll: 200, minBet: 5, maxBet: 500, oddsMode: "3-4-5x" });

  game = expectOk(placeBet(game, { kind: "pass", amount: 5 })).state;
  assert.equal(game.bankroll, 195);

  game = rollGame(game, forceRoll(3, 3)).state;
  assert.equal(game.phase, "point");
  assert.equal(game.point, 6);
  assert.equal(game.bankroll, 195);

  game = expectOk(placeOdds(game, "pass-line", 25)).state;
  assert.equal(game.bankroll, 170);

  const result = rollGame(game, forceRoll(4, 2));

  assert.equal(result.state.phase, "comeOut");
  assert.equal(result.state.point, null);
  assert.equal(result.state.bankroll, 235);
  assert.deepEqual(
    result.events.map((event) => event.message),
    ["Pass line wins 5.", "Pass odds win 30."]
  );
});

test("do not pass bars 12 on the come-out roll and returns the wager", () => {
  let game = createCrapsGame({ bankroll: 200, minBet: 5, maxBet: 500, oddsMode: "10x" });

  game = expectOk(placeBet(game, { kind: "dontPass", amount: 5 })).state;
  const result = rollGame(game, forceRoll(6, 6));

  assert.equal(result.state.bankroll, 200);
  assert.equal(result.state.bets.length, 0);
  assert.deepEqual(
    result.events.map((event) => event.message),
    ["Do not pass pushes on 12."]
  );
});

test("place bets stay up on wins and lose on seven-out", () => {
  let game = createCrapsGame({ bankroll: 200, minBet: 5, maxBet: 500, oddsMode: "10x" });

  game = expectOk(placeBet(game, { kind: "place", number: 6, amount: 6 })).state;
  game = rollGame(game, forceRoll(3, 3)).state;

  assert.equal(game.bankroll, 201);
  assert.equal(game.bets.length, 1);
  assert.equal(game.bets[0].amount, 6);

  const result = rollGame(game, forceRoll(4, 3));

  assert.equal(result.state.bankroll, 201);
  assert.equal(result.state.bets.length, 0);
  assert.deepEqual(
    result.events.map((event) => event.message),
    ["Place 6 loses 6 on seven-out."]
  );
});

test("field bets resolve on the next roll with configurable double-twelve payout", () => {
  let game = createCrapsGame({
    bankroll: 200,
    minBet: 5,
    maxBet: 500,
    oddsMode: "10x",
    fieldTwelvePays: 3,
  });

  game = expectOk(placeBet(game, { kind: "field", amount: 5 })).state;
  const result = rollGame(game, forceRoll(6, 6));

  assert.equal(result.state.bankroll, 215);
  assert.equal(result.state.bets.length, 0);
  assert.deepEqual(
    result.events.map((event) => event.message),
    ["Field wins 15 on 12."]
  );
});

test("come bets travel to a number and pay true odds when that number repeats", () => {
  let game = createCrapsGame({ bankroll: 200, minBet: 5, maxBet: 500, oddsMode: "3-4-5x" });

  game = expectOk(placeBet(game, { kind: "pass", amount: 5 })).state;
  game = rollGame(game, forceRoll(3, 3)).state;

  const comeResult = expectOk(placeBet(game, { kind: "come", amount: 5 }));
  game = rollGame(comeResult.state, forceRoll(3, 2)).state;

  assert.equal(game.bets.find((bet) => bet.id === comeResult.betId)?.number, 5);

  game = expectOk(placeOdds(game, comeResult.betId, 20)).state;
  const result = rollGame(game, forceRoll(4, 1));

  assert.equal(result.state.bankroll, 230);
  assert.deepEqual(
    result.events.map((event) => event.message),
    ["Come 5 wins 5.", "Come 5 odds win 30."]
  );
});

test("do not come bets travel to a number and lay odds win on seven", () => {
  let game = createCrapsGame({ bankroll: 200, minBet: 5, maxBet: 500, oddsMode: "10x" });

  game = expectOk(placeBet(game, { kind: "pass", amount: 5 })).state;
  game = rollGame(game, forceRoll(3, 3)).state;

  const dontComeResult = expectOk(placeBet(game, { kind: "dontCome", amount: 5 }));
  game = rollGame(dontComeResult.state, forceRoll(2, 2)).state;

  assert.equal(game.bets.find((bet) => bet.id === dontComeResult.betId)?.number, 4);

  game = expectOk(placeOdds(game, dontComeResult.betId, 15)).state;
  const result = rollGame(game, forceRoll(4, 3));

  assert.equal(result.state.bankroll, 207.5);
  assert.deepEqual(
    result.events.map((event) => event.message),
    ["Pass line loses 5.", "Do not come 4 wins 5.", "Do not come 4 odds win 7.5."]
  );
});

test("bet validation enforces table minimums, maximums, bankroll, and odds caps", () => {
  let game = createCrapsGame({ bankroll: 20, minBet: 5, maxBet: 25, oddsMode: "2x" });

  assert.deepEqual(placeBet(game, { kind: "pass", amount: 4 }), {
    ok: false,
    error: "Bet must be at least the 5 table minimum.",
    state: game,
  });

  assert.deepEqual(placeBet(game, { kind: "field", amount: 30 }), {
    ok: false,
    error: "Bet cannot exceed the 25 table maximum.",
    state: game,
  });

  game = expectOk(placeBet(game, { kind: "pass", amount: 5 })).state;
  game = rollGame(game, forceRoll(2, 2)).state;

  assert.deepEqual(placeOdds(game, "pass-line", 11), {
    ok: false,
    error: "Odds cannot exceed 10 behind this bet.",
    state: game,
  });
});
