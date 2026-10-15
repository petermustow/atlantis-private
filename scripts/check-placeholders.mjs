// Lists the [bracketed placeholders] still in the site content. A pull request into the
// production branch fails while any remain (see .github/workflows/ci.yml).
// Run locally with: pnpm check:placeholders
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["content", "app", "components", "lib/gated"];
const marker = /\[(?![A-Z]\.)[A-Z][^\]\[]{2,}\]/g;
const hits = new Map();

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(json|tsx|ts)$/.test(name)) {
      const found = [...readFileSync(p, "utf8").matchAll(marker)].map((m) => m[0]);
      if (found.length) hits.set(p, found);
    }
  }
}
roots.forEach(walk);

let total = 0;
for (const [file, found] of hits) {
  console.log(`${file} (${found.length})`);
  for (const f of new Set(found)) console.log(`  ${f.length > 110 ? f.slice(0, 107) + "...]" : f}`);
  total += found.length;
}
console.log(`\n${total} placeholder${total === 1 ? "" : "s"} in ${hits.size} files.`);
process.exit(total > 0 && process.argv.includes("--strict") ? 1 : 0);
