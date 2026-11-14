/**
 * The numbers on the homepage, each with where it came from.
 *
 * Every figure is a floor read from Diyama's own records on the date below and is
 * about Diyama's own systems, not a client's results. No client is named and no
 * commenter is quoted. Recount before changing one and keep the date honest:
 *
 *   posts    `workforce/engine/published.jsonl`, rows not marked deleted: 2,928
 *            (first row 23 August 2026), across 12 distinct pages
 *   replies  `workforce/engine/comment-officer.log.jsonl`: 107 replies
 *   apps     hosted apps under `public/apps/`, the ten listed in `llms.txt`
 *   built    `technology/ESTATE-SURVEY-2026-11-14.md`: 111 distinct apps on this PC =
 *            31 Diyama own + 17 Diyama clients + 45 ZAO DAO + 10 Ernest tools + 8 early
 *            experiments (worktrees counted once, third-party clones excluded): 110+
 *   clients  same survey, 17 Diyama clients + 45 ZAO DAO = 62: 60+
 */

export const proofAsAt = "14 November 2026";

export const proofStats = [
  { value: "2,900+", label: "posts published by our own engine since August 2026" },
  { value: "12", label: "brand pages kept running by one system" },
  { value: "100+", label: "customer comments answered by our comment desk" },
  { value: "10", label: "free business apps live on this site" },
  { value: "110+", label: "apps and systems built in-house since March 2026" },
  { value: "60+", label: "built for clients and partners" },
];
