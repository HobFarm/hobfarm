import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");
const exists = (file) => existsSync(join(root, file));

test("craps lab visual layer is componentized", () => {
  const files = [
    "src/components/games/craps/Die.tsx",
    "src/components/games/craps/Chip.tsx",
    "src/components/games/craps/BettingSurface.tsx",
    "src/components/games/craps/ActiveBetsPanel.tsx",
    "src/components/games/craps/RollLogPanel.tsx",
    "src/components/games/craps/DistributionPanel.tsx",
    "src/styles/craps-lab.css",
  ];

  for (const file of files) {
    assert.equal(exists(file), true, `${file} should exist`);
  }
});

test("craps lab uses SVG/CSS visuals instead of placeholder numeric controls", () => {
  const die = read("src/components/games/craps/Die.tsx");
  const chip = read("src/components/games/craps/Chip.tsx");
  const surface = read("src/components/games/craps/BettingSurface.tsx");
  const styles = read("src/styles/craps-lab.css");
  const simulator = read("src/components/games/CrapsSimulator.tsx");

  assert.match(die, /<svg/);
  assert.match(die, /craps-die--rolling/);
  assert.match(chip, /<svg/);
  assert.match(chip, /aria-pressed/);
  assert.match(surface, /<svg/);
  assert.match(surface, /zoneStake/);
  assert.match(styles, /@keyframes craps-die-shake/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(simulator, /from "@\/components\/games\/craps\/Die"/);
  assert.doesNotMatch(simulator, /function DieFace/);
  assert.doesNotMatch(simulator, /function BetButton/);
});
