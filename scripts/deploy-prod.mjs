// One-command production deploy WITH prerendered SEO/GEO output.
//
//   node scripts/deploy-prod.mjs
//
// Why not just `vercel --prod`? A normal Vercel deploy rebuilds on Vercel's
// servers where no browser exists, so the prerender step is skipped and AI /
// non-JS crawlers lose the per-page content. This script builds locally (using
// the local .env), prerenders every route to static HTML, assembles a Vercel
// Build Output, and deploys it prebuilt so the prerendered pages actually ship.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const run = (cmd) => { console.log(`\n$ ${cmd}`); execSync(cmd, { cwd: root, stdio: "inherit" }); };

// 1. Build with the local environment, then prerender all routes.
run("npm run build");
run("node scripts/prerender.mjs dist");

// 2. Assemble a Vercel Build Output (config + prerendered static).
const outDir = path.join(root, ".vercel", "output");
const staticDir = path.join(outDir, "static");
fs.mkdirSync(outDir, { recursive: true });
fs.rmSync(staticDir, { recursive: true, force: true });
fs.cpSync(path.join(root, "dist"), staticDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { handle: "filesystem" },
        { src: "^(?:/(.*))$", dest: "/index.html", check: true },
      ],
    },
    null,
    2
  )
);
console.log("\nAssembled .vercel/output with prerendered static files.");

// 3. Deploy the prebuilt output to production.
run("npx vercel deploy --prebuilt --prod --yes");
console.log("\nDeployed. Prerendered SEO pages are live.");
