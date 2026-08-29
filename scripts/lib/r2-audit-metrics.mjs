export function compareBucketSummary(dashboard, inventoryObjectCount) {
  const reportedObjectCount = Number.isInteger(dashboard?.objectCount)
    ? dashboard.objectCount
    : null;
  const objectCountMatches = reportedObjectCount === null
    ? null
    : reportedObjectCount === inventoryObjectCount;

  return {
    ...dashboard,
    inventoryObjectCount,
    objectCountMatches,
    objectCountDifference: reportedObjectCount === null
      ? null
      : inventoryObjectCount - reportedObjectCount,
    authoritativeObjectCountSource: "cursor-paginated R2 object API",
    advisory: objectCountMatches === false
      ? "Wrangler bucket summary metrics may lag behind recent object changes; the completed cursor-paginated object listing remains authoritative for this audit."
      : null,
  };
}
