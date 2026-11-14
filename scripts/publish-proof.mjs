// Every morning: recount the proof numbers and put only proof.json live on diyama.online.
// No build, no copy of the site: one small file on the gh-pages branch.
//
//   node scripts/publish-proof.mjs        (run daily by the Windows task "Diyama proof numbers")
//
// Works in its own detached worktree (.proof-pages, gitignored), so it never clashes with a
// gh-pages worktree a deploy is using. If a deploy pushed in the meantime it fetches and
// tries again. Pushes as trsr2218 through Git Credential Manager like every deploy.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { writeProof } from "./count-proof.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const WT = path.join(ROOT, ".proof-pages");
const git = (args, cwd = ROOT) => execFileSync("git", args, { cwd, stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
const log = (m) => console.log(`${new Date().toISOString()} ${m}`);

if (!fs.existsSync(path.join(WT, ".git"))) {
  git(["fetch", "-q", "origin", "gh-pages"]);
  git(["worktree", "add", "-q", "--detach", WT, "origin/gh-pages"]);
}

for (let attempt = 1; attempt <= 3; attempt++) {
  git(["fetch", "-q", "origin", "gh-pages"], WT);
  git(["checkout", "-q", "--detach", "-f", "origin/gh-pages"], WT);
  const proof = writeProof(WT);
  if (!proof) process.exit(0);
  if (!git(["status", "--porcelain", "--", "proof.json"], WT)) {
    log("proof.json unchanged, nothing to publish");
    process.exit(0);
  }
  git(["add", "proof.json"], WT);
  git(["-c", "user.name=trsr2218", "-c", "user.email=trsr2218@users.noreply.github.com",
    "commit", "-q", "-m", `Proof numbers ${proof.asAt}: ${proof.posts} posts, ${proof.replies} replies`], WT);
  try {
    git(["-c", "credential.username=trsr2218", "-c", "http.postBuffer=8388608", "push", "-q", "origin", "HEAD:gh-pages"], WT);
    log(`published: ${proof.posts} posts, ${proof.pages} pages, ${proof.replies} replies`);
    process.exit(0);
  } catch (e) {
    log(`push refused (attempt ${attempt}), fetching and trying again: ${String(e.stderr || e.message).trim().split("\n")[0]}`);
  }
}
log("gave up after 3 attempts");
process.exit(1);
