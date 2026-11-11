/* GENERATED FILE. Do not edit by hand.
   Written by scripts/build-pricing.mjs from Growth Plan/CARE-PLANS-OFFER.md, which is
   the company's only price list. Edit the price there, run the script, commit the diff.
   Generated 2026-11-11. */

export type PriceCard = {
  id: string;
  title: string;
  blurb: string;
  from: string;
  unit: string;
  points: string[];
};

export const priceCards: PriceCard[] = [
  {
    "id": "systems",
    "title": "Business systems and automation",
    "blurb": "Software built around how your business actually runs: bookings, stock, approvals, reports, and the back office that ties them together.",
    "from": "K2,750",
    "unit": "to set up",
    "points": [
      "Scoped with you first, quoted in writing",
      "Works on the phones and computers you already have",
      "Kept running by the people who built it"
    ]
  },
  {
    "id": "lodges",
    "title": "Direct bookings for lodges",
    "blurb": "A booking site, your Google profile set up properly, and a review engine, delivered together as one sprint.",
    "from": "K3,850",
    "unit": "once",
    "points": [
      "Guests book with you, not through an agent",
      "Found on Google Maps in your area",
      "Reviews asked for, not hoped for"
    ]
  },
  {
    "id": "social",
    "title": "Social media, run for you",
    "blurb": "Posts written, graphics designed, and somebody watching the replies. You stop being the one who has to think of something to post.",
    "from": "K825",
    "unit": "a month",
    "points": [
      "Facebook, Instagram or both",
      "Custom graphics, not stock",
      "A monthly report you can actually read"
    ]
  },
  {
    "id": "web",
    "title": "A website or web app",
    "blurb": "Built so a customer can see what you do, what it costs, and how to reach you, on a phone, in seconds.",
    "from": "K1,100",
    "unit": "once",
    "points": [
      "Live in days, not months",
      "Hosting, domain and SSL free for the first year",
      "You see yours working before you pay"
    ]
  },
  {
    "id": "care",
    "title": "Keeping it alive",
    "blurb": "The part most people skip. Security, backups, uptime, and somebody local to call when it breaks.",
    "from": "K165",
    "unit": "a month",
    "points": [
      "Security patched and backed up weekly",
      "We know it is down before you do",
      "Content updates included on the higher plan"
    ]
  },
  {
    "id": "found",
    "title": "Getting found, and reviews",
    "blurb": "Google Business Profile set up properly, and a system that actually asks your happy customers to say so.",
    "from": "K880",
    "unit": "once",
    "points": [
      "Show up on the map, in your area",
      "A review engine, not a hope",
      "Business email on your own domain"
    ]
  },
  {
    "id": "design",
    "title": "Design and brand",
    "blurb": "Logo, brand kit, menus, profiles, flyers. Priced per piece and per page, so a short job costs less than a long one.",
    "from": "K275",
    "unit": "a piece",
    "points": [
      "Per page on documents, never one flat guess",
      "Print ready export included",
      "One round of changes included"
    ]
  },
  {
    "id": "campaign",
    "title": "A campaign, for one month",
    "blurb": "A launch, an event, an award. Daily presence, ads managed, and a promotion run properly and legally.",
    "from": "K4,400",
    "unit": "once",
    "points": [
      "Two weeks or a full month",
      "Your ad money stays on your own account",
      "Every giveaway free to enter, with written rules"
    ]
  }
];

/* Stated on the page, not buried. VAT registration is unconfirmed, so a flat
   published figure could later be read as inclusive. A floor plus a written quote
   is both honest and safe. */
export const priceNote =
  "Every figure here is a starting price in Zambian Kwacha. What you pay depends on the size of the job, and you get it in writing before any work begins. A build is paid half to start and half when it goes live, and nothing appears on the invoice that was not on the quote.";

export const priceUpdated = "2026-11-11";

/* Named figures for pages that mention one offer by name, so no page types a price. */
export const systemPrices = {
  customSystem: "K13,200",
  lodgeSprint: "K3,850",
  frontDeskSetup: "K2,750",
  frontDeskMonthly: "K1,100",
  automationSprint: "K5,500",
};
