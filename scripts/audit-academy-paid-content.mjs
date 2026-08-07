import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const clientRoot = join(root, "dist", "client");
const canaries = [
  "Use my rough avatar idea to fill this starter source file",
  "Personalization test prompt",
  "guru cosplay",
];

if (!existsSync(clientRoot)) {
  console.error("Academy leakage audit needs dist/client. Run npm run build first.");
  process.exit(2);
}

const files = [];
const visit = (directory) => {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) visit(path);
    else files.push(path);
  }
};
visit(clientRoot);

const hits = [];
for (const path of files) {
  const bytes = readFileSync(path);
  for (const canary of canaries) {
    if (bytes.includes(Buffer.from(canary))) hits.push({ file: relative(root, path), canary });
  }
}

if (hits.length) {
  for (const hit of hits) console.error(`Paid Academy canary found in ${hit.file}: ${hit.canary}`);
  process.exit(1);
}

console.log(`Academy paid-content audit passed: ${files.length} client/static files scanned; ${canaries.length} canaries absent.`);
