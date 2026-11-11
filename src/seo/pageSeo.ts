/**
 * Per-route SEO copy for static pages.
 * Titles follow "<Specific Page Title> | Diyama Solutions".
 * Descriptions are ~150 characters, natural and keyword-aware without stuffing.
 */

export interface PageSeoEntry {
  title: string;
  description: string;
}

export const pageSeo: Record<string, PageSeoEntry> = {
  "/": {
    title: "Business Systems, Automation and Software in Zambia | Diyama Solutions",
    description:
      "Diyama Solutions builds and runs business systems, automation and software in Zambia: bookings, quotes, invoices, customer replies and daily posting.",
  },
  "/build": {
    title: "Design Your Own Website and Order It | Diyama Solutions",
    description:
      "Describe your business and Diyama AI drafts the site, or pick every piece yourself. Drag the sections into order, get a starting price from our price list, then take it live on your own domain, at a Diyama address or as a page on Diyama.",
  },
  "/pricing": {
    title: "Prices | Diyama Solutions",
    description: "What our work costs, in the open. Custom systems from K13,200, websites from K1,100, social media from K825 a month. Starting prices in kwacha, full quote in writing before any work starts.",
  },
  "/services": {
    title: "Our Services | Diyama Solutions",
    description:
      "Business systems, automation and software for any business in Zambia: WhatsApp front desk, direct bookings, workflow automation and office systems. Plus marketing, design and web.",
  },
  "/apps": {
    title: "Free Business Apps for African Businesses | Diyama Solutions",
    description:
      "Try free business apps built by Diyama: invoicing, quotations, QR codes, bookings, Zambian payroll, stock, expenses, loyalty and more. No signup to start.",
  },
  "/clients": {
    title: "Our Clients & Work | Diyama Solutions",
    description:
      "See the real businesses we work with across Zambia and Africa, from food brands and tourism operators to music artists, transport and DAOs.",
  },
  "/partners": {
    title: "Partners & Collaborations | Diyama Solutions",
    description:
      "Meet the partners and collaborators Diyama Solutions works with to help African businesses grow through shared tools, expertise and networks.",
  },
  "/ai": {
    title: "Diyama AI, Your Free Business Advisor | Diyama Solutions",
    description:
      "Chat with Diyama AI, a free business advisor for marketing, growth, pricing and operations. Get practical guidance for your business, no signup needed.",
  },
  "/business-fit": {
    title: "Free AI Business Fit Assessment | Diyama Solutions",
    description:
      "Answer a few questions and let Diyama AI build a free business kit with quick wins, blind spots and a suggested service bundle for your business.",
  },
  "/consultations": {
    title: "Book a Business Consultation | Diyama Solutions",
    description:
      "Book a consultation with Diyama Solutions for marketing, growth, branding, or strategy support tailored to your business in Zambia and across Africa.",
  },
  "/learn": {
    title: "Learn: Free Business Growth Guides | Diyama Solutions",
    description:
      "Free guides on marketing, customer growth, Google Maps, tourism, restaurants and the creator economy, written for business owners in Zambia and Africa.",
  },
  "/affiliate": {
    title: "Affiliate & Referral Program | Diyama Solutions",
    description:
      "Refer businesses to Diyama Solutions and earn commission on every client. A simple, transparent affiliate program for partners across Africa.",
  },
  "/about": {
    title: "About Us | Diyama Solutions",
    description:
      "Diyama Solutions Ltd builds and runs business systems, automation and software from Lusaka and Livingstone, Zambia, alongside marketing and design.",
  },
  "/contact": {
    title: "Contact Us | Diyama Solutions",
    description:
      "Get in touch with Diyama Solutions in Lusaka, Zambia. Reach us by WhatsApp, email, or the contact form to talk about growing your business.",
  },
  "/privacy": {
    title: "Privacy Policy | Diyama Solutions",
    description:
      "How Diyama Solutions collects, uses and protects your information across our forms, apps and AI conversations. Read our full privacy policy.",
  },
  "/terms": {
    title: "Terms of Service | Diyama Solutions",
    description:
      "The terms that govern your use of Diyama Solutions services, apps, the Diyama AI assistant, reviews and the affiliate program.",
  },
};
