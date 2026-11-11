import { MessageCircle, BedDouble, Workflow, Building2, type LucideIcon } from "lucide-react";
import { systemPrices } from "@/data/pricing";

/**
 * The four systems Diyama leads with since the pivot of 5 November 2026:
 * tech solutions, automations and business systems.
 *
 * PRICES. All four are in `Growth Plan/CARE-PLANS-OFFER.md` (sections 3, 3b and 9;
 * Ernest set Front Desk and the Automation Sprint on 11 November 2026). Every figure
 * comes from the generated `pricing.ts`, never typed here.
 *
 * WORDING. Say "assistant", and "AI" only where a model actually answers. Never
 * promise bookings, revenue or hours saved. Promise what is delivered.
 */

export interface SystemOffer {
  id: string;
  icon: LucideIcon;
  name: string;
  line: string;
  description: string;
  whoFor: string;
  includes: string[];
  price: string;
}

export const systems: SystemOffer[] = [
  {
    id: "front-desk",
    icon: MessageCircle,
    name: "Front Desk on WhatsApp",
    line: "Your WhatsApp answered properly, even when you are busy.",
    description:
      "An assistant that answers your customers from an answer book you approve, keeps every enquiry in one list, and hands anything it does not know to a person.",
    whoFor: "Service businesses that take their bookings and orders on WhatsApp.",
    includes: ["Your prices, hours and common questions answered", "Every enquiry logged in one place", "Unknown questions passed to you, never guessed", "WhatsApp message fees passed on at cost"],
    price: `${systemPrices.frontDeskSetup} set up, then ${systemPrices.frontDeskMonthly} a month`,
  },
  {
    id: "lodge-desk",
    icon: BedDouble,
    name: "Lodge Desk",
    line: "Direct bookings, on your own page.",
    description:
      "A booking site, your Google Business Profile set up properly, and a review engine, built as one sprint so guests can find you and book with you directly.",
    whoFor: "Lodges and guest houses that rely on online travel agents.",
    includes: ["Booking site with WhatsApp booking", "Google Business Profile, done properly", "Review engine with QR cards"],
    price: `Direct Booking Sprint, ${systemPrices.lodgeSprint}`,
  },
  {
    id: "automation-sprint",
    icon: Workflow,
    name: "Automation Sprint",
    line: "The repetitive work, handed to software.",
    description:
      "We connect the tools you already use so an enquiry becomes a quote, a quote becomes an invoice, and a reminder goes out, without anybody retyping it.",
    whoFor: "Teams with admin work that repeats every day, in Zambia or abroad.",
    includes: ["Your process mapped first", "Workflows built and tested with you", "Handover notes your staff can follow"],
    price: `${systemPrices.automationSprint}, up to three workflows`,
  },
  {
    id: "office-system",
    icon: Building2,
    name: "Office System",
    line: "One system for the whole office.",
    description:
      "Custom software for records, approvals, stock and reports, with a login for each role. Built to keep working when the connection drops.",
    whoFor: "Offices, organisations, schools and clinics that have outgrown spreadsheets.",
    includes: ["A login and a view for each role", "Approvals and reports built in", "Works with weak or no signal"],
    price: `From ${systemPrices.customSystem}, quoted after a scoping session`,
  },
];
