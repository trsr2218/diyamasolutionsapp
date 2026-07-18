// Generates public/sitemap.xml from the current routes, articles, and app demos.
// Run automatically before build (see package.json "prebuild").
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const SITE = "https://www.diyama.online";
const today = new Date().toISOString().slice(0, 10);

const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const ids = (file) => [...read(file).matchAll(/^\s{4}id:\s*"([^"]+)"/gm)].map((m) => m[1]);

const staticRoutes = [
  { loc: "/", pri: "1.0", freq: "weekly" },
  { loc: "/services", pri: "0.9", freq: "weekly" },
  { loc: "/apps", pri: "0.9", freq: "weekly" },
  { loc: "/business-fit", pri: "0.8", freq: "monthly" },
  { loc: "/ai", pri: "0.8", freq: "monthly" },
  { loc: "/clients", pri: "0.7", freq: "monthly" },
  { loc: "/partners", pri: "0.7", freq: "monthly" },
  { loc: "/learn", pri: "0.8", freq: "weekly" },
  { loc: "/consultations", pri: "0.8", freq: "monthly" },
  { loc: "/affiliate", pri: "0.6", freq: "monthly" },
  { loc: "/about", pri: "0.6", freq: "monthly" },
  { loc: "/contact", pri: "0.6", freq: "monthly" },
  { loc: "/privacy", pri: "0.3", freq: "yearly" },
  { loc: "/terms", pri: "0.3", freq: "yearly" },
];

const articleRoutes = ids("src/data/articles.ts").map((id) => ({ loc: `/learn/${id}`, pri: "0.7", freq: "monthly" }));

// Same-origin app demos: apps whose url is a "/apps/..." path
const appsSrc = read("src/data/apps.ts");
const appDemoRoutes = [...appsSrc.matchAll(/url:\s*"(\/apps\/[a-z0-9-]+)"/g)].map((m) => ({ loc: m[1], pri: "0.8", freq: "monthly" }));

const all = [...staticRoutes, ...articleRoutes, ...appDemoRoutes];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (r) =>
      `  <url>\n    <loc>${SITE}${r.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.freq}</changefreq>\n    <priority>${r.pri}</priority>\n  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(root, "public", "sitemap.xml"), xml);
console.log(`sitemap.xml written: ${all.length} urls (${articleRoutes.length} articles, ${appDemoRoutes.length} app demos)`);
