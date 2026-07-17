import posShot from "@/assets/apps/diyama-pos.jpg";
import eclassShot from "@/assets/apps/eclass.jpg";
import worldClockShot from "@/assets/apps/world-clock.jpg";

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

export const apps: DiyamaApp[] = [
  {
    id: "diyama-pos",
    name: "Diyama POS",
    tagline: "Point of sale built for African businesses",
    description:
      "A modern point of sale and inventory system for shops, restaurants, and small businesses. Track sales, manage stock, and see your numbers clearly from any device.",
    category: "Business Systems",
    url: "https://pos.diyama.online",
    status: "live",
    image: posShot,
    domain: "pos.diyama.online",
    freeOffer: "Try the full system free with sample data, no signup needed to explore.",
    fullOffer: "Your own business account, unlimited products and sales records, reports, and priority support.",
    tags: ["POS", "Inventory", "Retail", "Restaurants"],
    featured: true,
  },
  {
    id: "eclass",
    name: "eClass Learning Platform",
    tagline: "E-learning and school management in one place",
    description:
      "A complete e-learning platform for schools and training providers. Courses, classes, assignments, and student progress, all managed from a clean dashboard.",
    category: "Education",
    url: null,
    status: "demo-on-request",
    image: eclassShot,
    domain: "eclass.diyama.online",
    freeOffer: "Request a free guided demo and explore the platform with a trial school account.",
    fullOffer: "A dedicated platform for your institution with your branding, unlimited students, and ongoing support.",
    tags: ["E-Learning", "Schools", "Training"],
    featured: true,
  },
  {
    id: "world-clock",
    name: "World Clock Display",
    tagline: "A clean on-screen clock for offices and events",
    description:
      "A simple, beautiful world clock you can put on any screen. Great for offices, studios, reception areas, and events that work across time zones.",
    category: "Tools",
    url: "https://worldclock.diyama.online",
    status: "live",
    image: worldClockShot,
    domain: "worldclock.diyama.online",
    freeOffer: "Use it free in your browser right now.",
    fullOffer: "Custom branding, multiple saved timezone sets, and display configurations for your business.",
    tags: ["Utility", "Displays", "Free"],
    featured: false,
  },
];
