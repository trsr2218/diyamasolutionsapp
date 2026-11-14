/* The real time, even when the visitor's phone clock is wrong.
 *
 * Ernest, 14 Nov 2026: "why does the time on our website keep going wrong, that's a red
 * flag for customers to trust". The Lusaka clock and the hero chat read the device clock,
 * so a phone set a few minutes off showed a wrong Lusaka time. One HEAD request to our own
 * host reads the server's Date header and every clock on the site is corrected by the
 * difference. If the request fails the device clock is used, as before. */

let offset = 0;
let syncing: Promise<void> | null = null;

/** Milliseconds since the epoch, corrected to the server clock once synced. */
export const trueNow = () => Date.now() + offset;

/** Starts the sync once per page; later calls return the same promise. */
export function syncTrueTime(): Promise<void> {
  if (syncing) return syncing;
  syncing = (async () => {
    try {
      const sent = Date.now();
      const res = await fetch(`/robots.txt?clock=${sent}`, { method: "HEAD", cache: "no-store" });
      const received = Date.now();
      const date = res.headers.get("date");
      if (!date) return;
      // The Date header is whole seconds; add half a second for the cut-off part.
      const server = Date.parse(date) + 500;
      const diff = server - (sent + received) / 2;
      // Ignore small differences: they are network noise, not a wrong clock.
      if (Number.isFinite(diff) && Math.abs(diff) > 2000) offset = diff;
    } catch {
      // offline or blocked: keep the device clock
    }
  })();
  return syncing;
}

/** The hour in Lusaka (0 to 23) on the corrected clock. */
export const lusakaHour = () =>
  Number(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "Africa/Lusaka" }).format(new Date(trueNow()))) % 24;
