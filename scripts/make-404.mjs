// Copies the built app shell to dist/404.html. Runs after every build (package.json "postbuild").
//
// Vercel serves 404.html, with a real 404 status, for any address that is not a file or a
// known page. Before this, every mistyped link returned the homepage with a 200, which Google
// reads as the same page published under endless addresses. The shell boots the app, and the
// router shows the NotFound page, marked noindex.
//
// It must run before prerender.mjs, which replaces dist/index.html with the rendered homepage.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
fs.copyFileSync(path.join(dist, "index.html"), path.join(dist, "404.html"));
console.log("[make-404] wrote dist/404.html");
