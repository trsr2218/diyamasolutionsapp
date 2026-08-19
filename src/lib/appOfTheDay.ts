import { apps, type DiyamaApp } from "@/data/apps";

/**
 * Picks the one app that gets the homepage spotlight today.
 *
 * The rules, in order:
 *
 * 1. **Same app for everyone, all day.** The choice comes from the date, not from
 *    a random number, so two people looking at the homepage at the same moment see
 *    the same thing and a reload never reshuffles it. That also means a screenshot
 *    or a link shared in the morning still matches the site in the afternoon.
 * 2. **The day turns over in Lusaka**, not in the visitor's own time zone and not
 *    at UTC midnight, so "today's app" follows Diyama's working day.
 * 3. **Working days get the tools that run a business**, weekends get the tools a
 *    business points at its own customers. A shop owner doing books on a Tuesday
 *    and browsing on a Sunday are in different moods, so they are shown different
 *    things. This is the `audience` field on each app.
 * 4. **Only apps a visitor can actually open.** Anything with no public url is
 *    skipped, because the spotlight's whole job is to earn a click.
 *
 * Consecutive days always differ: within a pool the index moves by one per day,
 * and across the Friday/Saturday and Sunday/Monday boundaries the pool itself
 * changes.
 *
 * The homepage is prerendered at build time, so the value baked into the static
 * HTML is whatever the build day produced. `AppOfTheDay` recomputes on mount and
 * again at midnight, and the app mounts with `createRoot` rather than hydrating,
 * so the browser always ends up on the correct day.
 */

const DAY_MS = 86_400_000;

/** Zambia is UTC+2 all year. CAT has never observed daylight saving. */
const LUSAKA_OFFSET_MS = 2 * 60 * 60 * 1000;

/** Whole days elapsed in Lusaka since the epoch. This is the rotation's clock. */
export function lusakaDayNumber(now: Date = new Date()): number {
  return Math.floor((now.getTime() + LUSAKA_OFFSET_MS) / DAY_MS);
}

/** 0 Sunday through 6 Saturday, in Lusaka. 1 January 1970 was a Thursday, hence the 4. */
export function lusakaDayOfWeek(now: Date = new Date()): number {
  return (lusakaDayNumber(now) + 4) % 7;
}

/** Milliseconds until the next Lusaka midnight, for scheduling the swap. */
export function msUntilNextLusakaDay(now: Date = new Date()): number {
  const shifted = now.getTime() + LUSAKA_OFFSET_MS;
  return DAY_MS - (((shifted % DAY_MS) + DAY_MS) % DAY_MS);
}

/**
 * Today's spotlight app, or null if nothing is currently openable.
 * Pass a date to work out any other day, which is what the tests do.
 */
export function appOfTheDay(now: Date = new Date()): DiyamaApp | null {
  const day = lusakaDayNumber(now);
  const dayOfWeek = (day + 4) % 7;
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const openable = apps.filter((app) => app.url);
  if (!openable.length) return null;

  const wanted = isWeekend ? "storefront" : "back-office";
  const pool = openable.filter((app) => app.audience === wanted);

  // If a pool is ever emptied, for instance every storefront app loses its url,
  // fall back to the full list rather than showing nothing.
  const chosen = pool.length ? pool : openable;

  // `day` grows by one each day, so the index walks the pool and wraps.
  return chosen[((day % chosen.length) + chosen.length) % chosen.length];
}
