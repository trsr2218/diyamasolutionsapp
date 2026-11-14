// Counts the live proof numbers for the homepage from Diyama's own records and writes
// public/proof.json. Runs on every build (prebuild) and every morning (publish-proof.mjs).
//
// Ernest, 14 Nov 2026: "the numbers of posts published change every day, keep the number
// updated ... it must update daily to real numbers".
//
//   posts    workforce/engine/published.jsonl: rows not deleted, not edits, time already passed
//   pages    distinct `client` values among those rows
//   replies  workforce/engine/comment-officer.log.jsonl: rows with a replyId
//
// The other figures on the strip (free apps, apps built, built for clients) come from
// src/data/proof.ts because they change only when someone recounts them by hand.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENGINE = path.resolve(ROOT, "../../workforce/engine");

const readJsonl = (file) => {
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8").split("\n").filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line)]; } catch { return []; }
  });
};

// `at` is Lusaka wall time without a zone; `ts` is UTC.
const whenMs = (r) => {
  if (r.at) return Date.parse(/[zZ]|[+-]\d\d:\d\d$/.test(r.at) ? r.at : `${r.at}+02:00`);
  return Date.parse(r.ts);
};

export function countProof(now = Date.now()) {
  const published = readJsonl(path.join(ENGINE, "published.jsonl"));
  const replies = readJsonl(path.join(ENGINE, "comment-officer.log.jsonl"));
  if (!published || !replies) return null; // records not on this machine: keep what is there

  const live = published.filter((r) => !r.deleted && r.kind !== "edit" && whenMs(r) <= now);
  const asAt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lusaka" }).format(new Date(now));
  return {
    asAt,
    posts: live.length,
    pages: new Set(live.map((r) => r.client)).size,
    replies: replies.filter((r) => r.replyId).length,
  };
}

export function writeProof(dir) {
  const proof = countProof();
  if (!proof) {
    console.log("[proof] engine records not found, public/proof.json left as it is");
    return null;
  }
  fs.writeFileSync(path.join(dir, "proof.json"), JSON.stringify(proof, null, 2) + "\n");
  console.log(`[proof] ${proof.posts} posts, ${proof.pages} pages, ${proof.replies} replies, as at ${proof.asAt}`);
  return proof;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeProof(path.join(ROOT, "public"));
}
