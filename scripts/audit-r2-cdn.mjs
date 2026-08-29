#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  publicUrlForKey,
  scanRepositoryReferences,
} from "./lib/media-reference-scan.mjs";
import { compareBucketSummary } from "./lib/r2-audit-metrics.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportsDir = join(root, "reports");
const CDN_DOMAIN = "cdn.hob.farm";
const API_ROOT = "https://api.cloudflare.com/client/v4";
const INVENTORY_PAGE_SIZE = 1000;
const ORPHAN_MINIMUM_AGE_DAYS = 90;
const STANDARD_STORAGE_PRICE_PER_GB_MONTH = 0.015;
const STANDARD_FREE_TIER_GB_MONTH = 10;
const PRICING_AS_OF = "2026-08-07";
const PRICING_URL = "https://developers.cloudflare.com/r2/pricing/";

const reportPaths = {
  inventory: join(reportsDir, "r2-cdn-inventory.json"),
  references: join(reportsDir, "r2-reference-inventory.json"),
  orphanCandidates: join(reportsDir, "r2-orphan-candidates.json"),
  duplicates: join(reportsDir, "r2-duplicate-candidates.json"),
  summary: join(reportsDir, "r2-cleanup-summary.md"),
  deletionManifest: join(reportsDir, "r2-proposed-deletion-manifest.json"),
};

const protectedPrefixRules = [
  {
    prefix: "agents/",
    reason: "Agent/application assets may be consumed outside public page rendering; HobBot is explicitly retained in redevelopment.",
  },
  {
    prefix: "ezize/",
    reason: "EZIZE media has a documented application consumer and a dedicated public story surface.",
  },
  {
    prefix: "grimoire/",
    reason: "Grimoire is a knowledge and application data layer with consumers outside normal article routes.",
  },
  {
    prefix: "shop/",
    reason: "Commerce media requires product, fulfillment, and buyer-file review before removal.",
  },
  {
    prefix: "products/",
    reason: "Product media requires commerce review before removal.",
  },
  {
    prefix: "self-defense/",
    reason: "Academy course media can be gated or account-linked rather than emitted by public article routes.",
  },
  {
    prefix: "visual-systems/",
    reason: "Visual-system media includes deliberately capped previews and possible paid full-resolution counterparts.",
  },
  {
    prefix: "pages/other-alice-adventures/",
    reason: "Other Alice has a public site surface plus a separate developing game/runtime consumer.",
  },
  {
    prefix: "gallery/premium-showcase/",
    reason: "Premium showcase media may represent protected previews for off-site paid assets.",
  },
];

function jsonWrite(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function stripAnsi(value) {
  return value.replace(/\u001b\[[0-9;]*m/g, "");
}

function getWranglerToken() {
  if (process.env.CLOUDFLARE_API_TOKEN) {
    return { token: process.env.CLOUDFLARE_API_TOKEN, source: "CLOUDFLARE_API_TOKEN" };
  }

  const candidates = [
    join(homedir(), ".wrangler", "config", "default.toml"),
    process.env.APPDATA ? join(process.env.APPDATA, ".wrangler", "config", "default.toml") : null,
  ].filter(Boolean);

  for (const path of candidates) {
    try {
      const config = readFileSync(path, "utf8");
      const match = config.match(/^oauth_token\s*=\s*["']([^"']+)["']/m);
      if (match) return { token: match[1], source: "Wrangler OAuth session" };
    } catch {
      // Try the next standard Wrangler credential location.
    }
  }

  throw new Error(
    "No Cloudflare credential was found. Set CLOUDFLARE_API_TOKEN or authenticate Wrangler with `npx wrangler login`.",
  );
}

async function cloudflareGet(token, path, query = {}) {
  const url = new URL(`${API_ROOT}${path}`);
  for (const [name, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(name, String(value));
    }
  }

  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await response.json();
  if (!response.ok || body.success !== true) {
    const messages = [...(body.errors ?? []), ...(body.messages ?? [])]
      .map((item) => item.message ?? String(item))
      .join("; ");
    throw new Error(`Cloudflare GET ${url.pathname} failed (${response.status}): ${messages}`);
  }
  return body;
}

async function discoverCdnBucket(token) {
  const accountsResponse = await cloudflareGet(token, "/accounts", { per_page: 50 });
  const matches = [];

  for (const account of accountsResponse.result ?? []) {
    const bucketResponse = await cloudflareGet(token, `/accounts/${account.id}/r2/buckets`);
    for (const bucket of bucketResponse.result?.buckets ?? []) {
      const domainResponse = await cloudflareGet(
        token,
        `/accounts/${account.id}/r2/buckets/${encodeURIComponent(bucket.name)}/domains/custom`,
      );
      for (const domain of domainResponse.result?.domains ?? []) {
        if (domain.domain === CDN_DOMAIN && domain.enabled !== false) {
          matches.push({ account, bucket, domain });
        }
      }
    }
  }

  if (matches.length !== 1) {
    throw new Error(
      `Expected one enabled R2 custom-domain match for ${CDN_DOMAIN}; found ${matches.length}.`,
    );
  }

  const match = matches[0];
  const bucketResponse = await cloudflareGet(
    token,
    `/accounts/${match.account.id}/r2/buckets/${encodeURIComponent(match.bucket.name)}`,
  );

  return {
    accountId: match.account.id,
    accountName: match.account.name,
    bucket: bucketResponse.result,
    customDomain: {
      domain: match.domain.domain,
      enabled: match.domain.enabled,
      ownershipStatus: match.domain.status?.ownership ?? null,
      sslStatus: match.domain.status?.ssl ?? null,
    },
  };
}

function wranglerBucketInfo(bucketName) {
  const wranglerCli = join(root, "node_modules", "wrangler", "bin", "wrangler.js");
  const result = spawnSync(process.execPath, [wranglerCli, "r2", "bucket", "info", bucketName], {
    cwd: root,
    encoding: "utf8",
    env: process.env,
    windowsHide: true,
  });
  if (result.status !== 0) {
    return { available: false, error: stripAnsi(result.stderr || result.stdout).trim() };
  }
  const output = stripAnsi(result.stdout);
  const value = (label) => output.match(new RegExp(`^${label}:\\s*(.+)$`, "m"))?.[1]?.trim() ?? null;
  const countValue = value("object_count")?.replaceAll(",", "");
  return {
    available: true,
    objectCount: countValue ? Number.parseInt(countValue, 10) : null,
    bucketSizeLabel: value("bucket_size"),
    defaultStorageClass: value("default_storage_class"),
    location: value("location"),
  };
}

function topLevelPrefix(key) {
  const slash = key.indexOf("/");
  return slash === -1 ? "(root)" : key.slice(0, slash);
}

function nestedPrefix(key) {
  const parts = key.split("/").filter(Boolean);
  if (parts.length < 2) return parts[0] ?? "(root)";
  return `${parts[0]}/${parts[1]}`;
}

function parentPrefix(key) {
  const stripped = key.replace(/\/$/, "");
  const slash = stripped.lastIndexOf("/");
  return slash === -1 ? "(root)" : stripped.slice(0, slash);
}

async function listAllObjects(token, accountId, bucketName, generatedAt) {
  const objects = [];
  const pages = [];
  const cursors = new Set();
  let cursor = null;
  let truncated = true;

  while (truncated) {
    const response = await cloudflareGet(
      token,
      `/accounts/${accountId}/r2/buckets/${encodeURIComponent(bucketName)}/objects`,
      { per_page: INVENTORY_PAGE_SIZE, cursor },
    );
    const resultInfo = response.result_info ?? {};
    const pageObjects = response.result ?? [];
    pages.push({
      page: pages.length + 1,
      objectCount: pageObjects.length,
      isTruncated: Boolean(resultInfo.is_truncated),
      cursorReceived: Boolean(resultInfo.cursor),
    });

    for (const object of pageObjects) {
      objects.push({
        key: object.key,
        publicUrl: publicUrlForKey(object.key),
        size: Number(object.size ?? 0),
        lastModified: object.last_modified ?? null,
        etag: object.etag ?? "",
        storageClass: object.storage_class ?? "Standard",
        prefix: topLevelPrefix(object.key),
        extension: extname(object.key).replace(/^\./, "").toLowerCase(),
        contentType: object.http_metadata?.contentType ?? null,
      });
    }

    truncated = Boolean(resultInfo.is_truncated);
    cursor = resultInfo.cursor ?? null;
    if (truncated && !cursor) throw new Error("R2 returned a truncated page without a cursor.");
    if (cursor) {
      if (cursors.has(cursor)) throw new Error("R2 pagination repeated a cursor.");
      cursors.add(cursor);
    }
  }

  objects.sort((a, b) => a.key.localeCompare(b.key));
  return {
    objects,
    pagination: {
      requestedPageSize: INVENTORY_PAGE_SIZE,
      pages,
      pageCount: pages.length,
      terminalPageTruncated: pages.at(-1)?.isTruncated ?? null,
      completed: pages.length > 0 && pages.at(-1)?.isTruncated === false,
      inventoriedAt: generatedAt,
    },
  };
}

function ageDays(object, now) {
  if (!object.lastModified) return Number.POSITIVE_INFINITY;
  return Math.max(0, (now.getTime() - new Date(object.lastModified).getTime()) / 86_400_000);
}

function ageRange(object, now) {
  const days = ageDays(object, now);
  if (days < 30) return "less than 30 days";
  if (days < 90) return "30 to 90 days";
  if (days < 180) return "90 to 180 days";
  if (days < 365) return "180 to 365 days";
  return "over 365 days";
}

function sizeRange(object) {
  if (object.size === 0) return "0 bytes";
  if (object.size < 100_000) return "less than 100 KB";
  if (object.size < 1_000_000) return "100 KB to 1 MB";
  if (object.size < 10_000_000) return "1 MB to 10 MB";
  if (object.size < 100_000_000) return "10 MB to 100 MB";
  return "100 MB or more";
}

function summarizeBy(objects, keyFunction) {
  const groups = new Map();
  for (const object of objects) {
    const key = keyFunction(object);
    const current = groups.get(key) ?? { name: key, objectCount: 0, totalBytes: 0 };
    current.objectCount += 1;
    current.totalBytes += object.size;
    groups.set(key, current);
  }
  return [...groups.values()].sort(
    (a, b) => b.totalBytes - a.totalBytes || b.objectCount - a.objectCount || a.name.localeCompare(b.name),
  );
}

function repositorySupportPrefixRules() {
  const galleryRoot = join(root, "src", "content", "gallery");
  if (!existsSync(galleryRoot)) return [];
  const rules = [];
  for (const entry of readdirSync(galleryRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const directory = join(galleryRoot, entry.name);
    const files = readdirSync(directory, { withFileTypes: true });
    const hasContentEntry = files.some(
      (file) => file.isFile() && /\.(?:md|mdx)$/i.test(file.name),
    );
    const hasSupportFiles = files.some(
      (file) => file.isFile() && !/\.(?:md|mdx)$/i.test(file.name),
    );
    if (!hasContentEntry && hasSupportFiles) {
      rules.push({
        prefix: `gallery/${entry.name}/`,
        reason: `The repository retains non-entry support/source files under src/content/gallery/${entry.name}/. Treat the matching CDN tree as an intentional source archive pending human review.`,
      });
    }
  }
  return rules;
}

function protectedRuleFor(key, rules) {
  return rules.find((rule) => key.startsWith(rule.prefix)) ?? null;
}

function classifyObjects(objects, references, now, effectiveProtectedPrefixRules) {
  const referencesByKey = new Map();
  for (const reference of references) {
    const list = referencesByKey.get(reference.r2Key) ?? [];
    list.push(reference);
    referencesByKey.set(reference.r2Key, list);
  }

  const preliminary = new Map();
  for (const object of objects) {
    const objectReferences = referencesByKey.get(object.key) ?? [];
    const active = objectReferences.filter((reference) => reference.status === "active");
    const staged = objectReferences.filter((reference) => reference.status === "staged");
    const protectedReferences = objectReferences.filter((reference) => reference.status === "protected");
    const prefixRule = protectedRuleFor(object.key, effectiveProtectedPrefixRules);

    if (active.length > 0) {
      preliminary.set(object.key, {
        classification: "active",
        reason: `${active.length} active repository reference${active.length === 1 ? "" : "s"}`,
        evidence: [...new Set(active.map((reference) => reference.sourceFile))].slice(0, 8),
      });
    } else if (staged.length > 0) {
      preliminary.set(object.key, {
        classification: "staged",
        reason: `${staged.length} staged, draft, scheduled, or upload-manifest reference${staged.length === 1 ? "" : "s"}`,
        evidence: [...new Set(staged.map((reference) => reference.sourceFile))].slice(0, 8),
      });
    } else if (protectedReferences.length > 0) {
      preliminary.set(object.key, {
        classification: "protected",
        reason: `${protectedReferences.length} documentation, production-record, or source-archive reference${protectedReferences.length === 1 ? "" : "s"}`,
        evidence: [...new Set(protectedReferences.map((reference) => reference.sourceFile))].slice(0, 8),
      });
    } else if (prefixRule) {
      preliminary.set(object.key, {
        classification: "protected",
        reason: prefixRule.reason,
        evidence: [`protected prefix: ${prefixRule.prefix}`],
      });
    }
  }

  for (const object of objects) {
    if (!object.key.endsWith("/") || preliminary.has(object.key)) continue;
    const retainedDescendant = objects.find(
      (candidate) => candidate.key !== object.key && candidate.key.startsWith(object.key) && preliminary.has(candidate.key),
    );
    if (retainedDescendant) {
      preliminary.set(object.key, {
        classification: "protected",
        reason: "Zero-byte directory marker for a prefix that contains retained objects.",
        evidence: [`retained descendant: ${retainedDescendant.key}`],
      });
    }
  }

  const objectsByParent = new Map();
  for (const object of objects) {
    const parent = parentPrefix(object.key);
    const list = objectsByParent.get(parent) ?? [];
    list.push(object);
    objectsByParent.set(parent, list);
  }

  return objects.map((object) => {
    const objectReferences = referencesByKey.get(object.key) ?? [];
    let result = preliminary.get(object.key);
    if (!result) {
      const parent = parentPrefix(object.key);
      const siblings = objectsByParent.get(parent) ?? [];
      const retainedSibling = siblings.find((sibling) => preliminary.has(sibling.key));
      const recentSibling = siblings.find((sibling) => ageDays(sibling, now) < ORPHAN_MINIMUM_AGE_DAYS);

      if (ageDays(object, now) < ORPHAN_MINIMUM_AGE_DAYS) {
        result = {
          classification: "review",
          reason: `No deterministic repository reference; object is newer than ${ORPHAN_MINIMUM_AGE_DAYS} days.`,
          evidence: [`age: ${ageDays(object, now).toFixed(1)} days`],
        };
      } else if (parent === "(root)") {
        result = {
          classification: "review",
          reason: "No deterministic repository reference; root-level objects lack a safe prefix boundary.",
          evidence: ["root-level object"],
        };
      } else if (retainedSibling) {
        result = {
          classification: "review",
          reason: "No deterministic repository reference, but the same parent prefix contains retained objects.",
          evidence: [`retained sibling: ${retainedSibling.key}`],
        };
      } else if (recentSibling) {
        result = {
          classification: "review",
          reason: "No deterministic repository reference, but the same parent prefix contains recent objects.",
          evidence: [`recent sibling: ${recentSibling.key}`],
        };
      } else {
        result = {
          classification: "orphan-high-confidence",
          reason: `No repository, staging, protected-prefix, or dynamic-path evidence; the entire parent prefix is unreferenced and at least ${ORPHAN_MINIMUM_AGE_DAYS} days old.`,
          evidence: [`unreferenced parent prefix: ${parent}`, `age: ${ageDays(object, now).toFixed(1)} days`],
        };
      }
    }

    return {
      ...object,
      classification: result.classification,
      classificationReason: result.reason,
      evidence: result.evidence,
      repositoryReferenceCount: objectReferences.length,
      ageRange: ageRange(object, now),
      sizeRange: sizeRange(object),
    };
  });
}

function duplicateCandidates(classifiedObjects) {
  const exactGroups = new Map();
  for (const object of classifiedObjects) {
    if (object.size <= 0 || !object.etag) continue;
    const identity = `${object.size}|${object.etag}`;
    const list = exactGroups.get(identity) ?? [];
    list.push(object);
    exactGroups.set(identity, list);
  }

  const strong = [...exactGroups.values()]
    .filter((group) => group.length > 1)
    .map((group, index) => ({
      id: `etag-size-${String(index + 1).padStart(3, "0")}`,
      confidence: "strong-probable",
      evidence: ["identical R2 ETag", "identical byte size"],
      objectSize: group[0].size,
      objectCount: group.length,
      theoreticalRecoverableBytes: group[0].size * (group.length - 1),
      consolidationRequiresRepositoryChanges:
        group.filter((object) => object.classification === "active").length > 1,
      objects: group.map((object) => ({
        key: object.key,
        size: object.size,
        etag: object.etag,
        classification: object.classification,
        repositoryReferenceCount: object.repositoryReferenceCount,
      })),
      note: "This is duplicate evidence only. ETag matches do not authorize deletion.",
    }))
    .sort((a, b) => b.theoreticalRecoverableBytes - a.theoreticalRecoverableBytes);

  const exactKeys = new Set(strong.flatMap((group) => group.objects.map((object) => object.key)));
  const filenameGroups = new Map();
  for (const object of classifiedObjects) {
    if (object.size <= 0 || exactKeys.has(object.key)) continue;
    const filename = object.key.split("/").at(-1)?.toLowerCase() ?? object.key.toLowerCase();
    const identity = `${filename}|${object.size}`;
    const list = filenameGroups.get(identity) ?? [];
    list.push(object);
    filenameGroups.set(identity, list);
  }

  const possible = [...filenameGroups.values()]
    .filter((group) => group.length > 1 && new Set(group.map((object) => object.etag)).size > 1)
    .map((group, index) => ({
      id: `filename-size-${String(index + 1).padStart(3, "0")}`,
      confidence: "possible",
      evidence: ["identical filename", "identical byte size", "different R2 ETags"],
      objectSize: group[0].size,
      objectCount: group.length,
      theoreticalRecoverableBytes: group[0].size * (group.length - 1),
      consolidationRequiresRepositoryChanges:
        group.filter((object) => object.classification === "active").length > 1,
      objects: group.map((object) => ({
        key: object.key,
        size: object.size,
        etag: object.etag,
        classification: object.classification,
        repositoryReferenceCount: object.repositoryReferenceCount,
      })),
      note: "The differing ETags require checksum or visual verification before treating these objects as duplicates.",
    }))
    .sort((a, b) => b.theoreticalRecoverableBytes - a.theoreticalRecoverableBytes);

  return { strong, possible };
}

function bytes(value) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(3)} GB`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)} MB`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)} KB`;
  return `${value} B`;
}

function percent(value, total) {
  return total === 0 ? "0.00%" : `${((value / total) * 100).toFixed(2)}%`;
}

function markdownTable(headers, rows) {
  const header = `| ${headers.join(" | ")} |`;
  const divider = `| ${headers.map((headerName, index) => (index === 0 ? "---" : "---:")).join(" | ")} |`;
  return [header, divider, ...rows.map((row) => `| ${row.join(" | ")} |`)].join("\n");
}

function groupCandidates(objects) {
  return summarizeBy(objects, (object) => parentPrefix(object.key)).map((group) => ({
    prefix: group.name === "(root)" ? "(root)" : `${group.name}/`,
    objectCount: group.objectCount,
    totalBytes: group.totalBytes,
  }));
}

function cleanupSummary({
  generatedAt,
  bucket,
  customDomain,
  dashboard,
  classifiedObjects,
  references,
  classifications,
  orphanGroups,
  reviewGroups,
  duplicates,
  inventorySummary,
  pagination,
  missingReferences,
  deletionManifest,
}) {
  const totalBytes = inventorySummary.totalBytes;
  const orphan = classifications["orphan-high-confidence"];
  const rawMonthlyReduction = (orphan.totalBytes / 1_000_000_000) * STANDARD_STORAGE_PRICE_PER_GB_MONTH;
  const topPrefixes = inventorySummary.byTopLevelPrefix.slice(0, 20);
  const largest = [...classifiedObjects].sort((a, b) => b.size - a.size).slice(0, 25);
  const largestOrphans = [...classifiedObjects]
    .filter((object) => object.classification === "orphan-high-confidence")
    .sort((a, b) => b.size - a.size)
    .slice(0, 25);
  const largestReview = [...classifiedObjects]
    .filter((object) => object.classification === "review")
    .sort((a, b) => b.size - a.size)
    .slice(0, 25);
  const temporaryLike = inventorySummary.byNestedPrefix.filter((entry) =>
    /(?:^|[-_/])(tmp|temp|temporary|scratch|processing|preview|export)(?:[-_/]|$)/i.test(entry.name),
  );

  const classificationRows = [
    ["Active", classifications.active.objectCount, bytes(classifications.active.totalBytes), percent(classifications.active.totalBytes, totalBytes)],
    ["Staged", classifications.staged.objectCount, bytes(classifications.staged.totalBytes), percent(classifications.staged.totalBytes, totalBytes)],
    ["Protected", classifications.protected.objectCount, bytes(classifications.protected.totalBytes), percent(classifications.protected.totalBytes, totalBytes)],
    ["Review", classifications.review.objectCount, bytes(classifications.review.totalBytes), percent(classifications.review.totalBytes, totalBytes)],
    ["Orphan high confidence", orphan.objectCount, bytes(orphan.totalBytes), percent(orphan.totalBytes, totalBytes)],
    ["Total", classifiedObjects.length, bytes(totalBytes), "100.00%"],
  ];

  return `# HobFarm R2/CDN cleanup audit

Generated: ${generatedAt}

## Result

\`${CDN_DOMAIN}\` is connected to the \`${bucket.name}\` R2 bucket. The complete read-only inventory found **${classifiedObjects.length.toLocaleString("en-US")} objects using ${bytes(totalBytes)} (${totalBytes.toLocaleString("en-US")} bytes)**.

${markdownTable(["Classification", "Objects", "Size", "Percent"], classificationRows)}

The proposed deletion manifest contains **${deletionManifest.objectCount.toLocaleString("en-US")} high-confidence orphan objects totaling ${bytes(deletionManifest.totalBytes)}**. Nothing was deleted, moved, renamed, uploaded, copied, overwritten, or deployed.

## Bucket and pagination evidence

- Bucket: \`${bucket.name}\`
- Custom domain: \`${customDomain.domain}\` (enabled: ${customDomain.enabled}; ownership: ${customDomain.ownershipStatus}; SSL: ${customDomain.sslStatus})
- Location: ${bucket.location ?? dashboard.location ?? "not reported"}
- Default storage class: ${bucket.storage_class ?? dashboard.defaultStorageClass ?? "not reported"}
- Inventory pages: ${pagination.pageCount} (${pagination.pages.map((page) => page.objectCount).join(" + ")} objects)
- Terminal page marked truncated: ${pagination.terminalPageTruncated}
- Pagination completed: ${pagination.completed}
- Wrangler bucket metric: ${dashboard.available ? `${dashboard.objectCount?.toLocaleString("en-US") ?? "unknown"} objects, ${dashboard.bucketSizeLabel ?? "size unavailable"}` : "unavailable"}
- Inventory/API count matches Wrangler metric: ${dashboard.objectCountMatches}
${dashboard.advisory ? `- Metric advisory: ${dashboard.advisory}` : ""}

## Storage by major prefix

${markdownTable(
  ["Prefix", "Objects", "Size", "Percent"],
  topPrefixes.map((entry) => [
    `\`${entry.name}/\``,
    entry.objectCount,
    bytes(entry.totalBytes),
    percent(entry.totalBytes, totalBytes),
  ]),
)}

## Largest objects

${markdownTable(
  ["Key", "Classification", "Size", "Last modified"],
  largest.map((object) => [
    `\`${object.key}\``,
    object.classification,
    bytes(object.size),
    object.lastModified ?? "unknown",
  ]),
)}

## High-confidence orphan prefixes

The audit only marks an object high-confidence when its parent prefix has no active, staged, protected, or recent sibling, the key is outside every protected namespace, and every candidate is at least ${ORPHAN_MINIMUM_AGE_DAYS} days old. Age alone never creates an orphan classification.

${orphanGroups.length > 0 ? markdownTable(
    ["Prefix", "Objects", "Recoverable"],
    orphanGroups.map((group) => [`\`${group.prefix}\``, group.objectCount, bytes(group.totalBytes)]),
  ) : "No high-confidence orphan prefix was found."}

### Largest orphan objects

${largestOrphans.length > 0 ? markdownTable(
    ["Key", "Size", "Last modified"],
    largestOrphans.map((object) => [`\`${object.key}\``, bytes(object.size), object.lastModified ?? "unknown"]),
  ) : "No high-confidence orphan object was found."}

## Review queue

These objects remain outside the deletion manifest. The main reasons are recent uploads, mixed retained/unreferenced files inside one prefix, and root-level keys without a safe group boundary.

${reviewGroups.length > 0 ? markdownTable(
    ["Prefix", "Objects", "Size"],
    reviewGroups.slice(0, 40).map((group) => [`\`${group.prefix}\``, group.objectCount, bytes(group.totalBytes)]),
  ) : "No object requires manual review."}

### Largest review objects

${largestReview.length > 0 ? markdownTable(
    ["Key", "Size", "Reason"],
    largestReview.map((object) => [`\`${object.key}\``, bytes(object.size), object.classificationReason]),
  ) : "No object requires manual review."}

Repository references that did not resolve to an R2 object: **${missingReferences.length.toLocaleString("en-US")}**. They remain in \`reports/r2-reference-inventory.json\` because missing live references may indicate a broken URL, while missing staged references may indicate a pending upload.

## Duplicate candidates

- Strong probable groups (same size and R2 ETag): ${duplicates.strong.length.toLocaleString("en-US")}
- Possible groups (same filename and size, different ETags): ${duplicates.possible.length.toLocaleString("en-US")}
- Theoretical strong-group consolidation: ${bytes(duplicates.strong.reduce((sum, group) => sum + group.theoreticalRecoverableBytes, 0))}

${duplicates.strong.length > 0 ? markdownTable(
    ["Group", "Copies", "Object size", "Theoretical recovery", "URL changes"],
    duplicates.strong.slice(0, 30).map((group) => [
      group.id,
      group.objectCount,
      bytes(group.objectSize),
      bytes(group.theoreticalRecoverableBytes),
      group.consolidationRequiresRepositoryChanges ? "required" : "not established",
    ]),
  ) : "No exact ETag-and-size duplicate group was found."}

Duplicate status is evidence for consolidation review, not deletion authority. The duplicate report keeps every key, classification, ETag, and reference count.

## Recoverable storage and cost

- High-confidence orphan objects: ${orphan.objectCount.toLocaleString("en-US")}
- Recoverable bytes: ${orphan.totalBytes.toLocaleString("en-US")}
- Recoverable decimal GB: ${(orphan.totalBytes / 1_000_000_000).toFixed(6)} GB
- Recoverable share of this bucket: ${percent(orphan.totalBytes, totalBytes)}
- List-price Standard storage reduction: **$${rawMonthlyReduction.toFixed(4)} per full GB-month**

Pricing assumption: Cloudflare Standard R2 storage is $${STANDARD_STORAGE_PRICE_PER_GB_MONTH.toFixed(3)} per GB-month as of ${PRICING_AS_OF}. Standard R2 also includes ${STANDARD_FREE_TIER_GB_MONTH} GB-month each month. This bucket is below that free allowance by itself, so the actual bill reduction may be $0 if total account usage remains within the shared free tier. Cloudflare bills GB-month from daily peak averages and rounds billable usage as described in [R2 pricing](${PRICING_URL}).

## Path organization

The bucket currently mixes \`articles/\`, \`gallery/\`, \`pages/\`, \`blog/\`, \`workshop/\`, legacy title roots such as \`3dm/\`, and application roots such as \`agents/\`, \`ezize/\`, and \`grimoire/\`.

Use the repository's route-mirroring rule for future uploads:

- \`articles/<article-slug>/<file>\`
- \`presents/<section-or-title>/<file>\`
- \`workshop/<program>/<file>\`
- \`gallery/<collection>/<entry>/<file>\`
- \`projects/<project-slug>/<file>\`
- \`shop/<product>/<public-file>\`

Keep application and private commerce assets in their documented application or private buckets. Do not add new \`blog/\`, generic \`pages/\`, or ad hoc root keys. Existing active keys should stay where they are until a separate migration copies the object, updates every repository reference, deploys and verifies the new URL, preserves the old URL when required, and only then proposes removal.

## Temporary data and lifecycle rules

${temporaryLike.length > 0
    ? `Potentially temporary-looking prefixes were found, but their names do not prove disposable intent:\n\n${markdownTable(["Prefix", "Objects", "Size"], temporaryLike.map((entry) => [`\`${entry.name}/\``, entry.objectCount, bytes(entry.totalBytes)]))}`
    : "No clearly disposable temporary namespace was established in this bucket."}

A future lifecycle rule should apply only to a deliberately isolated namespace such as \`temporary/\` with an explicit retention contract. Do not apply age-based expiration to article, Presents, gallery, Workshop, project, Academy, Shop, application, or archive media.

## Internal validation

- R2 pagination ended only after \`is_truncated\` became false.
- Inventory object count matches the advisory Wrangler bucket metric: ${dashboard.objectCountMatches}.
- The completed cursor-paginated object listing is authoritative when that aggregate metric lags.
- Every object has exactly one primary classification.
- Classification counts and bytes sum to the bucket totals.
- Every deletion-manifest key is classified \`orphan-high-confidence\`.
- No active, staged, protected, or review object appears in the deletion manifest.
- The audit client issues authenticated GET requests only. Wrangler is used only for \`r2 bucket info\`.
- Zero R2 writes or deletions occurred.

## Files

- Full inventory and classifications: \`reports/${relative(reportsDir, reportPaths.inventory).replaceAll("\\", "/")}\`
- Repository references: \`reports/${relative(reportsDir, reportPaths.references).replaceAll("\\", "/")}\`
- Orphan and review candidates: \`reports/${relative(reportsDir, reportPaths.orphanCandidates).replaceAll("\\", "/")}\`
- Duplicate candidates: \`reports/${relative(reportsDir, reportPaths.duplicates).replaceAll("\\", "/")}\`
- Proposed deletion manifest: \`reports/${relative(reportsDir, reportPaths.deletionManifest).replaceAll("\\", "/")}\`

The deletion manifest is data only. This repository contains no R2 delete command for this audit, so cleanup requires a separate explicitly approved task and execution path.
`;
}

async function main() {
  const now = new Date();
  const generatedAt = now.toISOString();
  const includeDist = process.argv.includes("--include-dist");
  mkdirSync(reportsDir, { recursive: true });

  console.log("Discovering the R2 bucket connected to cdn.hob.farm...");
  const credential = getWranglerToken();
  const discovery = await discoverCdnBucket(credential.token);
  const dashboard = wranglerBucketInfo(discovery.bucket.name);

  console.log(`Listing every object in ${discovery.bucket.name} with cursor pagination...`);
  const listed = await listAllObjects(
    credential.token,
    discovery.accountId,
    discovery.bucket.name,
    generatedAt,
  );
  const objectKeys = new Set(listed.objects.map((object) => object.key));

  console.log("Scanning repository sources, content, manifests, documentation, and staging trees...");
  const references = scanRepositoryReferences({ root, objectKeys, now });
  if (includeDist) {
    references.push(...scanRepositoryReferences({ root, objectKeys, now, scanRoots: ["dist/client"] }));
  }
  const referenceIdentities = new Set();
  const uniqueReferences = references.filter((reference) => {
    const identity = `${reference.r2Key}|${reference.sourceFile}|${reference.status}`;
    if (referenceIdentities.has(identity)) return false;
    referenceIdentities.add(identity);
    return true;
  });
  const effectiveProtectedPrefixRules = [
    ...protectedPrefixRules,
    ...repositorySupportPrefixRules(),
  ];
  const classifiedObjects = classifyObjects(
    listed.objects,
    uniqueReferences,
    now,
    effectiveProtectedPrefixRules,
  );
  const existingKeySet = new Set(classifiedObjects.map((object) => object.key));
  const referencesWithExistence = uniqueReferences.map((reference) => ({
    ...reference,
    existsInR2: existingKeySet.has(reference.r2Key),
  }));
  const missingReferences = referencesWithExistence.filter((reference) => !reference.existsInR2);

  const totalBytes = classifiedObjects.reduce((sum, object) => sum + object.size, 0);
  const dashboardComparison = compareBucketSummary(dashboard, classifiedObjects.length);
  const inventorySummary = {
    objectCount: classifiedObjects.length,
    totalBytes,
    byTopLevelPrefix: summarizeBy(classifiedObjects, (object) => object.prefix),
    byNestedPrefix: summarizeBy(classifiedObjects, (object) => nestedPrefix(object.key)),
    byExtension: summarizeBy(classifiedObjects, (object) => object.extension || "(none)"),
    byAge: summarizeBy(classifiedObjects, (object) => object.ageRange),
    byStorageClass: summarizeBy(classifiedObjects, (object) => object.storageClass),
    bySizeRange: summarizeBy(classifiedObjects, (object) => object.sizeRange),
    largestObjects: [...classifiedObjects]
      .sort((a, b) => b.size - a.size)
      .slice(0, 50)
      .map((object) => ({
        key: object.key,
        size: object.size,
        lastModified: object.lastModified,
        classification: object.classification,
      })),
  };

  const classificationEntries = summarizeBy(classifiedObjects, (object) => object.classification);
  const classifications = Object.fromEntries(
    ["active", "staged", "protected", "review", "orphan-high-confidence"].map((name) => {
      const entry = classificationEntries.find((candidate) => candidate.name === name);
      return [name, entry ?? { name, objectCount: 0, totalBytes: 0 }];
    }),
  );

  const orphanObjects = classifiedObjects.filter(
    (object) => object.classification === "orphan-high-confidence",
  );
  const reviewObjects = classifiedObjects.filter((object) => object.classification === "review");
  const orphanGroups = groupCandidates(orphanObjects);
  const reviewGroups = groupCandidates(reviewObjects);
  const duplicates = duplicateCandidates(classifiedObjects);

  const deletionManifest = {
    generatedAt,
    bucket: discovery.bucket.name,
    publicDomain: CDN_DOMAIN,
    objectCount: orphanObjects.length,
    totalBytes: orphanObjects.reduce((sum, object) => sum + object.size, 0),
    policy: {
      classificationRequired: "orphan-high-confidence",
      executesDeletion: false,
      minimumAgeDays: ORPHAN_MINIMUM_AGE_DAYS,
      note: "This file is a proposal. It contains no command or authorization to delete R2 objects.",
    },
    objects: orphanObjects.map((object) => ({
      key: object.key,
      size: object.size,
      lastModified: object.lastModified,
      reason: object.classificationReason,
      evidence: object.evidence,
    })),
  };

  const classificationTotal = Object.values(classifications).reduce(
    (sum, classification) => sum + classification.objectCount,
    0,
  );
  const classificationBytes = Object.values(classifications).reduce(
    (sum, classification) => sum + classification.totalBytes,
    0,
  );
  if (!listed.pagination.completed) throw new Error("R2 pagination did not reach an untruncated terminal page.");
  if (classificationTotal !== classifiedObjects.length || classificationBytes !== totalBytes) {
    throw new Error("Classification totals do not match the bucket inventory.");
  }
  if (deletionManifest.objects.some((candidate) => {
    const object = classifiedObjects.find((entry) => entry.key === candidate.key);
    return object?.classification !== "orphan-high-confidence";
  })) {
    throw new Error("The deletion manifest contains a non-orphan object.");
  }

  jsonWrite(reportPaths.inventory, {
    generatedAt,
    bucket: {
      name: discovery.bucket.name,
      creationDate: discovery.bucket.creation_date,
      location: discovery.bucket.location,
      jurisdiction: discovery.bucket.jurisdiction,
      defaultStorageClass: discovery.bucket.storage_class,
      customDomain: discovery.customDomain,
    },
    remoteOperationPolicy: "Authenticated GET requests only; no R2 object or bucket mutations.",
    dashboardComparison,
    pagination: listed.pagination,
    summary: inventorySummary,
    objects: classifiedObjects,
  });

  jsonWrite(reportPaths.references, {
    generatedAt,
    bucket: discovery.bucket.name,
    publicDomain: CDN_DOMAIN,
    buildOutputIncluded: includeDist,
    scope: `Deterministic references across runtime source, content, data, pages, components, layouts, styles, functions, workers, public files, scripts, manifests, documentation, staging trees, source archives${includeDist ? ", and the browser-visible client output from a current production build" : ""}. Server build bundles are excluded because they can contain unpublished collection data that is not publicly emitted.`,
    referenceCount: referencesWithExistence.length,
    uniqueReferencedKeyCount: new Set(referencesWithExistence.map((reference) => reference.r2Key)).size,
    existingReferenceCount: referencesWithExistence.length - missingReferences.length,
    missingReferenceCount: missingReferences.length,
    references: referencesWithExistence,
  });

  jsonWrite(reportPaths.orphanCandidates, {
    generatedAt,
    bucket: discovery.bucket.name,
    policy: {
      minimumAgeDays: ORPHAN_MINIMUM_AGE_DAYS,
      highConfidenceRule: "No active, staged, protected, protected-prefix, dynamic-path, or recent-sibling evidence exists for the parent prefix.",
      reviewRule: "Recent, root-level, or mixed-prefix objects stay in review.",
      protectedPrefixRules: effectiveProtectedPrefixRules,
    },
    highConfidence: {
      objectCount: orphanObjects.length,
      totalBytes: deletionManifest.totalBytes,
      groups: orphanGroups,
      objects: orphanObjects,
    },
    review: {
      objectCount: reviewObjects.length,
      totalBytes: reviewObjects.reduce((sum, object) => sum + object.size, 0),
      groups: reviewGroups,
      objects: reviewObjects,
    },
  });

  jsonWrite(reportPaths.duplicates, {
    generatedAt,
    bucket: discovery.bucket.name,
    policy: "Duplicate evidence does not authorize deletion. Consolidation must preserve every active consumer and may require URL changes.",
    strongProbableGroupCount: duplicates.strong.length,
    possibleGroupCount: duplicates.possible.length,
    strongProbableTheoreticalRecoverableBytes: duplicates.strong.reduce(
      (sum, group) => sum + group.theoreticalRecoverableBytes,
      0,
    ),
    strongProbable: duplicates.strong,
    possible: duplicates.possible,
  });

  jsonWrite(reportPaths.deletionManifest, deletionManifest);
  writeFileSync(
    reportPaths.summary,
    cleanupSummary({
      generatedAt,
      bucket: discovery.bucket,
      customDomain: discovery.customDomain,
      dashboard: dashboardComparison,
      classifiedObjects,
      references: referencesWithExistence,
      classifications,
      orphanGroups,
      reviewGroups,
      duplicates,
      inventorySummary,
      pagination: listed.pagination,
      missingReferences,
      deletionManifest,
    }),
    "utf8",
  );

  console.log(`Wrote ${classifiedObjects.length.toLocaleString("en-US")} objects and ${referencesWithExistence.length.toLocaleString("en-US")} references.`);
  console.log(`High-confidence orphan proposal: ${deletionManifest.objectCount.toLocaleString("en-US")} objects, ${deletionManifest.totalBytes.toLocaleString("en-US")} bytes.`);
  console.log("Remote operations were read-only. No R2 object was changed or deleted.");
}

await main();
