import { useEffect, useState } from "react";
import { proofStats, proofAsAt, type ProofStat } from "@/data/proof";

/* The homepage numbers, live. /proof.json is rewritten every morning from our own records
 * (scripts/publish-proof.mjs) and on every build (scripts/count-proof.mjs), so posts, pages
 * and replies are the real counts for that day. Until it loads, or if it fails, the figures
 * built into data/proof.ts show. */

type LiveProof = { asAt: string; posts: number; pages: number; replies: number };

const n = (v: number) => v.toLocaleString("en-US");

export function useProof(): { stats: ProofStat[]; asAt: string } {
  const [live, setLive] = useState<LiveProof | null>(null);

  useEffect(() => {
    if (navigator.webdriver) return; // prerender: keep the built-in figures in the static HTML
    const day = new Date().toISOString().slice(0, 10);
    fetch(`/proof.json?d=${day}`, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((p: LiveProof | null) => {
        if (p && Number.isFinite(p.posts) && Number.isFinite(p.pages) && Number.isFinite(p.replies) && p.asAt) setLive(p);
      })
      .catch(() => {});
  }, []);

  if (!live) return { stats: proofStats, asAt: proofAsAt };
  const byKey: Record<string, string> = { posts: n(live.posts), pages: n(live.pages), replies: n(live.replies) };
  return {
    stats: proofStats.map((s) => (s.key && byKey[s.key] ? { ...s, value: byKey[s.key] } : s)),
    asAt: live.asAt,
  };
}
