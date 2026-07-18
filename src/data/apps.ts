import posShot from "@/assets/apps/diyama-pos.jpg";
import eclassShot from "@/assets/apps/eclass.jpg";
import worldClockShot from "@/assets/apps/world-clock.jpg";
import invoicerShot from "@/assets/apps/app-invoicer.jpg";
import qrStudioShot from "@/assets/apps/app-qr-studio.jpg";
import quotationShot from "@/assets/apps/app-quotation.jpg";
import bookmeShot from "@/assets/apps/app-bookme.jpg";
import biolinkShot from "@/assets/apps/app-biolink.jpg";
import payslipShot from "@/assets/apps/app-payslip.jpg";
import stocktrackShot from "@/assets/apps/app-stocktrack.jpg";
import expensaShot from "@/assets/apps/app-expensa.jpg";
import tapcardShot from "@/assets/apps/app-tapcard.jpg";
import loyaltyShot from "@/assets/apps/app-loyalty.jpg";

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
    id: "invoicer",
    name: "Diyama Invoicer",
    tagline: "Professional invoices in minutes",
    description:
      "Create clean, branded invoices, add your items, and download a polished PDF ready to send. Your invoices are saved so you can reopen or duplicate them anytime.",
    category: "Business Systems",
    url: "/apps/invoicer",
    status: "live",
    image: invoicerShot,
    domain: "invoice.diyama.online",
    freeOffer: "Build and download unlimited invoices right now, no signup.",
    fullOffer: "Your logo and branded template set up for you, plus recurring invoices and reminders.",
    tags: ["Invoicing", "PDF", "Finance"],
    featured: true,
  },
  {
    id: "qr-studio",
    name: "Diyama QR Studio",
    tagline: "QR codes for everything your business shares",
    description:
      "Turn a link, a WhatsApp chat, your WiFi, or a full contact card into a clean, downloadable QR code your customers can scan on the spot.",
    category: "Tools",
    url: "/apps/qr-studio",
    status: "live",
    image: qrStudioShot,
    domain: "qr.diyama.online",
    freeOffer: "Generate and download unlimited QR codes, free.",
    fullOffer: "Branded QR codes with your colors and logo, plus scan tracking for campaigns.",
    tags: ["QR Codes", "Marketing", "Free"],
    featured: true,
  },
  {
    id: "quotation",
    name: "Diyama Quote Builder",
    tagline: "Send quotations that win the job",
    description:
      "Build professional quotations with your terms and a clear validity date, then download a branded PDF. Saved quotes are ready to reopen or turn into invoices.",
    category: "Business Systems",
    url: "/apps/quotation",
    status: "live",
    image: quotationShot,
    domain: "quote.diyama.online",
    freeOffer: "Create and download professional quotations for free.",
    fullOffer: "Custom branded templates and a smooth quote to invoice workflow.",
    tags: ["Quotations", "Sales", "PDF"],
    featured: false,
  },
  {
    id: "bookme",
    name: "Diyama BookMe",
    tagline: "Let customers book you, effortlessly",
    description:
      "Set your services and hours, and take bookings with automatic time slots. Every booking comes with a one tap WhatsApp confirmation for your customer.",
    category: "Business Systems",
    url: "/apps/bookme",
    status: "live",
    image: bookmeShot,
    domain: "booking.diyama.online",
    freeOffer: "Take appointments and send WhatsApp confirmations, free.",
    fullOffer: "Your own branded booking page with automated reminders.",
    tags: ["Bookings", "Appointments", "Services"],
    featured: true,
  },
  {
    id: "biolink",
    name: "Diyama BioLink",
    tagline: "One link for your whole business",
    description:
      "Build a beautiful link in bio page with your links and socials, then share it anywhere. Perfect for Instagram, TikTok, and WhatsApp profiles.",
    category: "Marketing",
    url: "/apps/biolink",
    status: "live",
    image: biolinkShot,
    domain: "link.diyama.online",
    freeOffer: "Build and share your link in bio page for free.",
    fullOffer: "A custom domain and visitor analytics for your page.",
    tags: ["Link in Bio", "Social", "Marketing"],
    featured: false,
  },
  {
    id: "payslip",
    name: "Diyama PaySlip",
    tagline: "Zambian payroll, calculated correctly",
    description:
      "Work out PAYE, NAPSA, and NHIMA from a gross salary and download a clean payslip. Built around current Zambian bands, with everything adjustable.",
    category: "Business Systems",
    url: "/apps/payslip",
    status: "live",
    image: payslipShot,
    domain: "payroll.diyama.online",
    freeOffer: "Calculate deductions and download payslips, free.",
    fullOffer: "Full monthly payroll runs for your whole team, handled with you.",
    tags: ["Payroll", "Zambia", "HR"],
    featured: false,
  },
  {
    id: "stocktrack",
    name: "Diyama StockTrack",
    tagline: "Never run out, never overstock",
    description:
      "Track your products, adjust stock as you sell and restock, and get low stock warnings at a glance. See your total stock value in one place.",
    category: "Business Systems",
    url: "/apps/stocktrack",
    status: "live",
    image: stocktrackShot,
    domain: "stock.diyama.online",
    freeOffer: "Track inventory with low stock alerts, free.",
    fullOffer: "Multi branch stock, suppliers, and reports connected together.",
    tags: ["Inventory", "Stock", "Retail"],
    featured: false,
  },
  {
    id: "expensa",
    name: "Diyama Expensa",
    tagline: "See exactly where your money goes",
    description:
      "Log income and expenses, watch your monthly balance, and read simple charts that show where the money is going. Export anytime.",
    category: "Business Systems",
    url: "/apps/expensa",
    status: "live",
    image: expensaShot,
    domain: "expense.diyama.online",
    freeOffer: "Track income and expenses with live charts, free.",
    fullOffer: "Connected bookkeeping and monthly reports prepared for you.",
    tags: ["Expenses", "Cash Flow", "Finance"],
    featured: false,
  },
  {
    id: "tapcard",
    name: "Diyama TapCard",
    tagline: "Your business card, one tap away",
    description:
      "Build a digital business card with a QR code and downloadable contact file, then share a link that lets anyone save your details instantly.",
    category: "Marketing",
    url: "/apps/tapcard",
    status: "live",
    image: tapcardShot,
    domain: "card.diyama.online",
    freeOffer: "Create and share your digital business card, free.",
    fullOffer: "Branded cards for your whole team with your identity.",
    tags: ["Digital Card", "Networking", "QR"],
    featured: false,
  },
  {
    id: "loyalty",
    name: "Diyama Loyalty",
    tagline: "Turn first time buyers into regulars",
    description:
      "Create a digital stamp card for your cafe or shop, stamp customers on every visit, and delight them when they unlock a reward. Track every customer.",
    category: "Marketing",
    url: "/apps/loyalty",
    status: "live",
    image: loyaltyShot,
    domain: "loyalty.diyama.online",
    freeOffer: "Run a digital loyalty stamp card, free.",
    fullOffer: "SMS and WhatsApp loyalty campaigns to bring customers back.",
    tags: ["Loyalty", "Retention", "Retail"],
    featured: false,
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
    featured: false,
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
