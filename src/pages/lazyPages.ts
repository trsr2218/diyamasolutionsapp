import { lazy, type ComponentType } from "react";

/* Every page except the homepage is its own download.
 *
 * Before this, one 940 KB script carried every page, so someone opening a link to
 * /pricing on mobile data paid for the AI chat, the quiz and every article too.
 * Each page now loads only when it is visited.
 *
 * `preloadForPath` lets main.tsx fetch the current page's code before React first
 * renders. Without it the prerendered HTML would be swapped for an empty loading
 * state for a moment on every direct visit.
 */

type Loader = () => Promise<{ default: ComponentType }>;

const page = (load: Loader) => Object.assign(lazy(load), { preload: load });

export const Services = page(() => import("./Services"));
export const Pricing = page(() => import("./Pricing"));
export const Clients = page(() => import("./Clients"));
export const Apps = page(() => import("./Apps"));
export const Partners = page(() => import("./Partners"));
export const DiyamaAI = page(() => import("./DiyamaAI"));
export const BusinessFit = page(() => import("./BusinessFit"));
export const Consultations = page(() => import("./Consultations"));
export const Learn = page(() => import("./Learn"));
export const Article = page(() => import("./Article"));
export const Affiliate = page(() => import("./Affiliate"));
export const About = page(() => import("./About"));
export const Contact = page(() => import("./Contact"));
export const Privacy = page(() => import("./Privacy"));
export const Terms = page(() => import("./Terms"));

const byPath: Record<string, { preload: Loader }> = {
  "/services": Services,
  "/pricing": Pricing,
  "/clients": Clients,
  "/apps": Apps,
  "/partners": Partners,
  "/ai": DiyamaAI,
  "/business-fit": BusinessFit,
  "/consultations": Consultations,
  "/learn": Learn,
  "/affiliate": Affiliate,
  "/about": About,
  "/contact": Contact,
  "/privacy": Privacy,
  "/terms": Terms,
};

export function preloadForPath(pathname: string): Promise<unknown> {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path.startsWith("/learn/")) return Article.preload();
  return byPath[path]?.preload() ?? Promise.resolve();
}
