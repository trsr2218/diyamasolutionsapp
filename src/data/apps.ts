/**
 * Apps shown publicly on the site.
 *
 * Emptied on 10 August 2026 on Ernest's instruction. The fourteen entries that used to be
 * here advertised tools that were either superseded, unfinished, or wrong: the payroll one
 * in particular calculated Zambian PAYE and NAPSA on out of date figures, so anything it
 * produced was incorrect.
 *
 * The shape below is kept, and so is the page, so this can be repopulated with one entry the
 * day there is a finished product worth putting a client's name against. Do not list an app
 * here that is not finished, correct and supported.
 *
 * The screenshots those entries used are still in src/assets/apps/ and are unreferenced.
 */

export interface DiyamaApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  /** Live URL visitors can open to try the app. Null while not publicly available. */
  url: string | null;
  status: "live" | "demo-on-request" | "coming-soon";
  /** Real screenshot of the platform, shown in the card preview. */
  image: string;
  /** Domain shown in the preview's browser bar. */
  domain: string;
  /** What visitors get without paying. */
  freeOffer: string;
  /** What a subscription unlocks. */
  fullOffer: string;
  tags: string[];
  featured: boolean;
}

export const apps: DiyamaApp[] = [];
