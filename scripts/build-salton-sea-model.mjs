import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assumptionsPath = resolve(root, "research/salton-sea/model-assumptions.json");
const dataPath = resolve(root, "src/data/salton-sea-model.json");
const csvPath = resolve(root, "research/salton-sea/scenario-output.csv");
const assumptions = JSON.parse(await readFile(assumptionsPath, "utf8"));

const {
  acreFootToCubicMeters,
  imperialGallonToCubicMeters,
  usGallonToCubicMeters,
  daysPerYear,
  metricTonsPerKilogram,
} = assumptions.units;

const round = (value, digits = 6) => Number(value.toFixed(digits));
const afyFromDailyGallons = (millionGallons, gallonToCubicMeters) =>
  millionGallons * 1_000_000 * gallonToCubicMeters * daysPerYear / acreFootToCubicMeters;
const afyFromAnnualGallons = (millionGallons, gallonToCubicMeters) =>
  millionGallons * 1_000_000 * gallonToCubicMeters / acreFootToCubicMeters;
const metricTonsOfSalt = (acreFeet, salinityPpt) =>
  acreFeet * acreFootToCubicMeters * salinityPpt * metricTonsPerKilogram;

function productAfy(scenario) {
  if (scenario.acreFeetPerYear) return scenario.acreFeetPerYear;
  const gallon = scenario.sourceUnit.includes("imperial")
    ? imperialGallonToCubicMeters
    : usGallonToCubicMeters;
  if (scenario.millionGallonsPerDay) return afyFromDailyGallons(scenario.millionGallonsPerDay, gallon);
  return afyFromAnnualGallons(scenario.millionGallonsPerYear, gallon);
}

function interpolateLake(elevationFeet) {
  const points = assumptions.lake.areaCapacitySurvey;
  const exact = points.find((point) => point.elevationFeet === elevationFeet);
  if (exact) return { ...exact };
  const lower = [...points].reverse().find((point) => point.elevationFeet < elevationFeet);
  const upper = points.find((point) => point.elevationFeet > elevationFeet);
  if (!lower || !upper) throw new Error(`Elevation ${elevationFeet} is outside the area-capacity table.`);
  const fraction = (elevationFeet - lower.elevationFeet) / (upper.elevationFeet - lower.elevationFeet);
  return {
    elevationFeet,
    areaAcres: lower.areaAcres + fraction * (upper.areaAcres - lower.areaAcres),
    capacityAcreFeet: lower.capacityAcreFeet + fraction * (upper.capacityAcreFeet - lower.capacityAcreFeet),
  };
}

const shoreline = assumptions.lake.referenceElevations.map((reference) => {
  const lake = interpolateLake(reference.feet);
  const current = interpolateLake(assumptions.lake.currentElevationFeet);
  return {
    ...reference,
    areaAcres: round(lake.areaAcres, 0),
    capacityAcreFeet: round(lake.capacityAcreFeet, 0),
    refillFromCurrentAcreFeet: round(Math.max(0, lake.capacityAcreFeet - current.capacityAcreFeet), 0),
    netEvaporationAcreFeetPerYear: round(lake.areaAcres * assumptions.lake.netEvaporationFeetPerYear, 0),
    northShoreHarborStatus:
      reference.id === "current" ? "isolated in 2026 aerial" :
      reference.id === "north-shore-2010" ? "connected in 2010 author photograph" :
      "requires site-specific topography and hydraulic modeling",
  };
});

const inflowComponents = assumptions.inflows.componentsAcreFeet;
const currentGrossInflowAfy = Object.values(inflowComponents).reduce((sum, value) => sum + value, 0);
const currentNetInflowAfy = currentGrossInflowAfy - assumptions.inflows.habitatAndProjectUseAcreFeet;

function sourceBalance(productAcreFeet, requiredInletAcreFeet, requiredInletSalinityPpt) {
  const reducedReturnFlow = productAcreFeet * assumptions.inflows.returnFlowResponseFraction;
  const adjustedDrainageRaw = Math.max(0, currentGrossInflowAfy - reducedReturnFlow);
  const treatedDrainage = Math.min(
    requiredInletAcreFeet,
    adjustedDrainageRaw * assumptions.inflows.treatmentRecovery,
  );
  const admittedGulf = Math.max(0, requiredInletAcreFeet - treatedDrainage);
  const rawGulf = admittedGulf / assumptions.gulf.treatmentRecovery;
  const treatedGulfSalinity = admittedGulf > 0
    ? Math.max(0, (
      requiredInletAcreFeet * requiredInletSalinityPpt -
      treatedDrainage * assumptions.inflows.salinityPpt
    ) / admittedGulf)
    : 0;
  const rawSaltMetricTons =
    metricTonsOfSalt(adjustedDrainageRaw, assumptions.inflows.salinityPpt) +
    metricTonsOfSalt(rawGulf, assumptions.gulf.rawSalinityPpt);
  const admittedSaltMetricTons = metricTonsOfSalt(requiredInletAcreFeet, requiredInletSalinityPpt);

  return {
    currentGrossInflowAfy: round(currentGrossInflowAfy, 0),
    currentNetInflowAfy: round(currentNetInflowAfy, 0),
    reducedReturnFlowAfy: round(reducedReturnFlow, 0),
    adjustedDrainageRawAfy: round(adjustedDrainageRaw, 0),
    treatedDrainageAdmittedAfy: round(treatedDrainage, 0),
    gulfRawAfy: round(rawGulf, 0),
    gulfAdmittedAfy: round(admittedGulf, 0),
    requiredGulfOutletSalinityPpt: round(treatedGulfSalinity, 2),
    upstreamWaterLossAfy: round(adjustedDrainageRaw + rawGulf - treatedDrainage - admittedGulf, 0),
    rawSaltMetricTons: round(rawSaltMetricTons, 0),
    admittedSaltMetricTons: round(admittedSaltMetricTons, 0),
    upstreamSaltRejectedOrRetainedMetricTons: round(Math.max(0, rawSaltMetricTons - admittedSaltMetricTons), 0),
  };
}

function steadyState(product, lake, recovery, lakeSalinityPpt, mode) {
  const productAcreFeet = productAfy(product);
  const lakeWithdrawal = productAcreFeet / recovery;
  const inlet = lake.netEvaporationAcreFeetPerYear + lakeWithdrawal;
  const inletSalinity = lakeSalinityPpt * lakeWithdrawal / inlet;
  const brine = lakeWithdrawal - productAcreFeet;
  const idealBrineSalinity = lakeSalinityPpt / (1 - recovery);
  const outputCubicMeters = productAcreFeet * acreFootToCubicMeters;
  const annualSalt = metricTonsOfSalt(lakeWithdrawal, lakeSalinityPpt);
  return {
    id: `${product.id}-${lake.id}-${mode}-${String(lakeSalinityPpt).replace(".", "-")}`,
    productId: product.id,
    productLabel: product.label,
    lakeId: lake.id,
    mode,
    elevationFeetNgvd29: lake.feet,
    lakeAreaAcres: lake.areaAcres,
    lakeSalinityPpt,
    recovery,
    deliveredProductAfy: round(productAcreFeet, 0),
    installedNameplateAfy: round(productAcreFeet / (
      assumptions.operations.plantAvailability * assumptions.operations.productConveyanceEfficiency
    ), 0),
    lakeWithdrawalAfy: round(lakeWithdrawal, 0),
    netEvaporationAfy: lake.netEvaporationAcreFeetPerYear,
    treatedInletAfy: round(inlet, 0),
    requiredInletSalinityPpt: round(inletSalinity, 2),
    outletBrineAfy: round(brine, 0),
    idealOutletBrineSalinityPpt: round(idealBrineSalinity, 1),
    saltThroughOutletMetricTons: round(annualSalt, 0),
    hydraulicPondMinimumAcres: round(brine / assumptions.lake.netEvaporationFeetPerYear, 0),
    twentyFiveTonTruckloadsEquivalent: round(annualSalt / 25, 0),
    energy: assumptions.operations.roEnergyKwhPerCubicMeter.map((intensity) => {
      const annualKwh = outputCubicMeters * intensity;
      return {
        kwhPerCubicMeter: intensity,
        annualTwh: round(annualKwh / 1_000_000_000, 3),
        averageMegawatts: round(annualKwh / (daysPerYear * 24 * 1000), 0),
      };
    }),
    sourceBalance: sourceBalance(productAcreFeet, inlet, inletSalinity),
  };
}

const targetLake = shoreline.find((item) => item.id === "screening-minus-240");
const checkpointLake = shoreline.find((item) => item.id === "screening-minus-230");
const currentLake = shoreline.find((item) => item.id === "current");
const steadyScenarios = assumptions.productScenarios.flatMap((product) =>
  assumptions.operations.targetSalinitiesPpt.map((salinity) =>
    steadyState(product, targetLake, assumptions.operations.steadyStateRecovery, salinity, "steady-state"),
  ),
);
const transitionScenarios = assumptions.productScenarios.map((product) =>
  steadyState(
    product,
    currentLake,
    assumptions.operations.transitionRecovery,
    assumptions.operations.transitionSalinityPpt,
    "transition-sensitivity",
  ),
);
const checkpoint = steadyState(
  assumptions.productScenarios.find((item) => item.id === "bahrain-nameplate"),
  checkpointLake,
  assumptions.operations.steadyStateRecovery,
  35.5,
  "brief-checkpoint",
);

const bahrainActual = productAfy(assumptions.productScenarios.find((item) => item.id === "bahrain-actual-2024"));
const bahrainNameplate = productAfy(assumptions.productScenarios.find((item) => item.id === "bahrain-nameplate"));
const coachella = productAfy(assumptions.productScenarios.find((item) => item.id === "cvwd-farm-deliveries"));

const comparisons = {
  bahrainActualAfy: round(bahrainActual, 0),
  bahrainActualAverageMigd: round(61821.243 / daysPerYear, 2),
  bahrainActualShareOfCoachellaPercent: round(bahrainActual / coachella * 100, 1),
  bahrainNameplateAfy: round(bahrainNameplate, 0),
  bahrainNameplateCubicMetersPerDay: round(213 * 1_000_000 * imperialGallonToCubicMeters, 0),
  bahrainNameplateMinusCoachellaAfy: round(bahrainNameplate - coachella, 0),
  bahrainNameplateShareOfCaliforniaApportionmentPercent: round(
    bahrainNameplate / assumptions.comparisonCapacity.californiaMainstreamApportionmentAcreFeet * 100,
    1,
  ),
  productionEquivalentFiveYearsAcreFeet: round(bahrainNameplate * 5, 0),
  productionEquivalentTenYearsAcreFeet: round(bahrainNameplate * 10, 0),
  bahrainHistoricalDesalinationAverageMegawatts: round(
    assumptions.comparisonCapacity.bahrainDesalinationElectricity2017Gwh * 1000 / (daysPerYear * 24),
    0,
  ),
};

assert.ok(Math.abs(comparisons.bahrainNameplateCubicMetersPerDay - 968317) <= 1);
assert.ok(Math.abs(comparisons.bahrainNameplateAfy - 286535) <= 1);
assert.ok(Math.abs(checkpoint.lakeWithdrawalAfy - 636745) <= 2);
assert.ok(Math.abs(checkpoint.treatedInletAfy - 1942745) <= 1000);
assert.ok(Math.abs(checkpoint.requiredInletSalinityPpt - 11.64) <= 0.01);
assert.ok(Math.abs(checkpoint.outletBrineAfy - 350209) <= 2);
assert.ok(Math.abs(checkpoint.idealOutletBrineSalinityPpt - 64.5) <= 0.1);
assert.ok(Math.abs(checkpoint.saltThroughOutletMetricTons - 28_000_000) <= 200_000);

const output = {
  modelVersion: assumptions.modelVersion,
  modelDate: assumptions.modelDate,
  purpose: assumptions.purpose,
  assumptions: {
    datum: assumptions.lake.datum,
    currentElevationObservationDate: assumptions.lake.currentObservationDate,
    netEvaporationFeetPerYear: assumptions.lake.netEvaporationFeetPerYear,
    netEvaporationSensitivityFeetPerYear: assumptions.lake.netEvaporationSensitivityFeetPerYear,
    plantAvailability: assumptions.operations.plantAvailability,
    productConveyanceEfficiency: assumptions.operations.productConveyanceEfficiency,
    steadyStateRecovery: assumptions.operations.steadyStateRecovery,
    transitionRecovery: assumptions.operations.transitionRecovery,
    transitionSalinityPpt: assumptions.operations.transitionSalinityPpt,
    transitionSalinityStatus: assumptions.operations.transitionSalinityStatus,
    currentInflowsSnapshotYear: assumptions.inflows.snapshotYear,
    returnFlowResponseFraction: assumptions.inflows.returnFlowResponseFraction,
  },
  comparisons,
  currentInflows: {
    componentsAcreFeet: inflowComponents,
    grossAcreFeet: round(currentGrossInflowAfy, 0),
    habitatAndProjectUseAcreFeet: assumptions.inflows.habitatAndProjectUseAcreFeet,
    netAcreFeet: round(currentNetInflowAfy, 0),
  },
  capacityReferences: assumptions.comparisonCapacity,
  routeReference: assumptions.routeReference,
  shoreline,
  checkpoint,
  steadyScenarios,
  transitionScenarios,
  sources: assumptions.sources,
};

await mkdir(dirname(dataPath), { recursive: true });
await mkdir(dirname(csvPath), { recursive: true });
await writeFile(dataPath, `${JSON.stringify(output, null, 2)}\n`);

const csvRows = [
  [
    "scenario_id", "mode", "elevation_ft_ngvd29", "lake_salinity_ppt", "recovery",
    "product_afy", "installed_nameplate_afy", "lake_withdrawal_afy", "evaporation_afy",
    "treated_inlet_afy", "inlet_salinity_ppt", "brine_afy", "brine_salinity_ppt",
    "salt_metric_tons", "pond_minimum_acres", "gulf_raw_afy", "drainage_admitted_afy",
  ],
  ...[...steadyScenarios, ...transitionScenarios, checkpoint].map((scenario) => [
    scenario.id, scenario.mode, scenario.elevationFeetNgvd29, scenario.lakeSalinityPpt, scenario.recovery,
    scenario.deliveredProductAfy, scenario.installedNameplateAfy, scenario.lakeWithdrawalAfy,
    scenario.netEvaporationAfy, scenario.treatedInletAfy, scenario.requiredInletSalinityPpt,
    scenario.outletBrineAfy, scenario.idealOutletBrineSalinityPpt, scenario.saltThroughOutletMetricTons,
    scenario.hydraulicPondMinimumAcres, scenario.sourceBalance.gulfRawAfy,
    scenario.sourceBalance.treatedDrainageAdmittedAfy,
  ]),
];
await writeFile(csvPath, `${csvRows.map((row) => row.join(",")).join("\n")}\n`);

console.log(`Wrote ${dataPath}`);
console.log(`Wrote ${csvPath}`);
console.log(`Bahrain nameplate: ${comparisons.bahrainNameplateAfy.toLocaleString()} AFY`);
console.log(`Checkpoint inlet: ${checkpoint.treatedInletAfy.toLocaleString()} AFY at ${checkpoint.requiredInletSalinityPpt} ppt`);
