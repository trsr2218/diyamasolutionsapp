// Prerender the SPA routes to static HTML so search engines and AI crawlers
// (which often do not run JavaScript) receive full content + per-page meta.
// Usage: node scripts/prerender.mjs [targetDir]   (targetDir defaults to "dist")
//
// It serves the built output with an SPA fallback, visits each route with a
// real browser, and writes the fully rendered HTML to <targetDir>/<route>/index.html.
// If no Chrome is found (e.g. a Vercel server build), it no-ops so builds never break.
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const targetDir = path.resolve(root, process.argv[2] || "dist");

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];
const chrome = CHROME_CANDIDATES.find((p) => { try { return fs.existsSync(p); } catch { return false; } });
if (!chrome) { console.log("[prerender] no Chrome found, skipping prerender (SPA will still work)."); process.exit(0); }

let puppeteer;
try { puppeteer = (await import("puppeteer-core")).default; }
catch { console.log("[prerender] puppeteer-core not installed, skipping."); process.exit(0); }

const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const articleIds = [...read("src/data/articles.ts").matchAll(/^\s{4}id:\s*"([^"]+)"/gm)].map((m) => m[1]);
const routes = [
  "/", "/services", "/apps", "/clients", "/partners", "/ai", "/business-fit",
  "/consultations", "/learn", "/affiliate", "/about", "/contact", "/privacy", "/terms",
  ...articleIds.map((id) => `/learn/${id}`),
];

const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".svg":"image/svg+xml", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".png":"image/png", ".ico":"image/x-icon", ".webp":"image/webp", ".woff2":"font/woff2", ".woff":"font/woff", ".txt":"text/plain", ".xml":"application/xml", ".webmanifest":"application/manifest+json" };

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  let filePath = path.join(targetDir, urlPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.setHeader("Content-Type", MIME[path.extname(filePath)] || "application/octet-stream");
    fs.createReadStream(filePath).pipe(res);
    return;
  }
  // SPA fallback for extensionless routes
  if (!path.extname(urlPath)) {
    res.setHeader("Content-Type", "text/html");
    fs.createReadStream(path.join(targetDir, "index.html")).pipe(res);
    return;
  }
  res.statusCode = 404; res.end("not found");
});

const PORT = 5177;
await new Promise((r) => server.listen(PORT, r));

const browser = await puppeteer.launch({ executablePath: chrome, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
const rendered = [];
for (const route of routes) {
  const page = await browser.newPage();
  try {
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle2", timeout: 45000 });
    // give React + helmet a moment to settle
    await new Promise((r) => setTimeout(r, 600));
    const html = await page.evaluate(() => "<!doctype html>\n" + document.documentElement.outerHTML);
    rendered.push({ route, html });
    process.stdout.write(`  rendered ${route}\n`);
  } catch (e) {
    process.stdout.write(`  SKIP ${route} (${String(e).slice(0, 50)})\n`);
  }
  await page.close();
}
await browser.close();
server.close();

// Write after all renders so the fallback is never shadowed mid-run
let written = 0;
for (const { route, html } of rendered) {
  const outDir = route === "/" ? targetDir : path.join(targetDir, route);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
  written++;
}
console.log(`[prerender] wrote ${written} prerendered pages into ${path.relative(root, targetDir) || "."}`);
