/**
 * Per-route SEO copy for static pages.
 * Titles follow "<Specific Page Title> | Diyama Solutions".
 * Descriptions are ~150 characters, natural, and keyword-aware without stuffing.
 */

export interface PageSeoEntry {
  title: string;
  description: string;
}

export const pageSeo: Record<string, PageSeoEntry> = {
  "/": {
    title: "Business Growth, Marketing & Free Apps in Zambia | Diyama Solutions",
    description:
      "Diyama Solutions helps businesses in Zambia and across Africa grow through marketing, strategy, branding, web development, and free business apps.",
  },
  "/services": {
    title: "Our Services | Diyama Solutions",
    description:
      "Marketing, growth strategy, branding, web development, and consulting services built to move African businesses forward, one practical step at a time.",
  },
  "/apps": {
    title: "Free Business Apps for African Businesses | Diyama Solutions",
    description:
      "Try free business apps built by Diyama: invoicing, quotations, QR codes, bookings, Zambian payroll, stock, expenses, loyalty, and more. No signup to start.",
  },
  "/clients": {
    title: "Our Clients & Work | Diyama Solutions",
    description:
      "See the real businesses we work with across Zambia and Africa, from food brands and tourism operators to music artists, transport, and DAOs.",
  },
  "/partners": {
    title: "Partners & Collaborations | Diyama Solutions",
    description:
      "Meet the partners and collaborators Diyama Solutions works with to help African businesses grow through shared tools, expertise, and networks.",
  },
  "/ai": {
    title: "Diyama AI, Your Free Business Advisor | Diyama Solutions",
    description:
      "Chat with Diyama AI, a free business advisor for marketing, growth, pricing, and operations. Get practical guidance for your business, no signup needed.",
  },
  "/business-fit": {
    title: "Free AI Business Fit Assessment | Diyama Solutions",
    description:
      "Answer a few questions and let Diyama AI build a free business kit with quick wins, blind spots, and a suggested service bundle for your business.",
  },
  "/consultations": {
    title: "Book a Business Consultation | Diyama Solutions",
    description:
      "Book a consultation with Diyama Solutions for marketing, growth, branding, or strategy support tailored to your business in Zambia and across Africa.",
  },
  "/learn": {
    title: "Learn: Free Business Growth Guides | Diyama Solutions",
    description:
      "Free guides on marketing, customer growth, Google Maps, tourism, restaurants, and the creator economy, written for business owners in Zambia and Africa.",
  },
  "/affiliate": {
    title: "Affiliate & Referral Program | Diyama Solutions",
    description:
      "Refer businesses to Diyama Solutions and earn commission on every client. A simple, transparent affiliate program for partners across Africa.",
  },
  "/about": {
    title: "About Us | Diyama Solutions",
    description:
      "Diyama Solutions is a business growth partner in Lusaka, Zambia, bringing marketing, strategy, creative, and consulting together under one roof.",
  },
  "/contact": {
    title: "Contact Us | Diyama Solutions",
    description:
      "Get in touch with Diyama Solutions in Lusaka, Zambia. Reach us by WhatsApp, email, or the contact form to talk about growing your business.",
  },
  "/privacy": {
    title: "Privacy Policy | Diyama Solutions",
    description:
      "How Diyama Solutions collects, uses, and protects your information across our forms, apps, and AI conversations. Read our full privacy policy.",
  },
  "/terms": {
    title: "Terms of Service | Diyama Solutions",
    description:
      "The terms that govern your use of Diyama Solutions services, apps, the Diyama AI assistant, reviews, and the affiliate program.",
  },
};
