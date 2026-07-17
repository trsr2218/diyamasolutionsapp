import fenaltShot from "@/assets/apps/fenalt-foods.jpg";

export interface Partner {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Public site or page Diyama promotes for this brand. */
  url: string | null;
  /** Real screenshot of the brand's site, shown in the card preview. */
  image: string | null;
  /** Domain shown in the preview's browser bar. */
  domain: string | null;
  since: string;
  tags: string[];
}

/**
 * Brands and companies Diyama Solutions advertises and markets on behalf of.
 * Add new partners here as they come on board.
 */
export const partners: Partner[] = [
  {
    id: "fenalt-foods",
    name: "Fenalt Foods",
    category: "Food & Beverage",
    description:
      "Quality food products from Zambia. Diyama runs Fenalt Foods' digital marketing and manages their online presence, helping their products reach more customers every day.",
    url: "https://fenaltfoods.diyama.online",
    image: fenaltShot,
    domain: "fenaltfoods.diyama.online",
    since: "2021",
    tags: ["Food", "Digital Marketing", "Social Media"],
  },
];
