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
//    A prebuilt deploy ignores vercel.json, so its headers and rewrites are
//    translated here. vercel.json stays the one place they are written.
const outDir = path.join(root, ".vercel", "output");
const staticDir = path.join(outDir, "static");
fs.mkdirSync(outDir, { recursive: true });
fs.rmSync(staticDir, { recursive: true, force: true });
fs.cpSync(path.join(root, "dist"), staticDir, { recursive: true });

const vercelJson = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
// Handles the two source shapes vercel.json uses: "(.*)" and ":name(regex)".
const toRegex = (source) => {
  const re = source.replace(/:\w+\(([^)]+)\)/g, "($1)");
  if (/:\w/.test(re)) throw new Error(`deploy-prod: unsupported vercel.json source "${source}"`);
  return `^${re}/?$`;
};
const headerRoutes = (vercelJson.headers || []).map((h) => ({
  src: toRegex(h.source),
  headers: Object.fromEntries(h.headers.map(({ key, value }) => [key, value])),
  continue: true,
}));
const rewriteRoutes = (vercelJson.rewrites || []).map((r) => ({ src: toRegex(r.source), dest: r.destination }));

fs.writeFileSync(
  path.join(outDir, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        ...headerRoutes,
        { handle: "filesystem" },
        ...rewriteRoutes,
        // Anything that is not a file or a known page is a real 404, not the homepage.
        { handle: "error" },
        { src: "^/(.*)$", dest: "/404.html", status: 404 },
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
