import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowUpRight, ArrowUp } from "lucide-react";
import diyamaLogo from "@/assets/logo-mark.webp";
import CursorGlow from "@/components/CursorGlow";

/* The footer carries the same lockup as the header (the ring mark and the "Diyama."
 * wordmark), sits on the same container with the same gutters. It opens with the
 * same gold-to-teal hairline the header closes with. Ernest, 12 November 2026:
 * "the footer is not as cool as the header, alignment". */

const footerLinks = [
  {
    title: "Services",
    links: [
      { label: "Business Systems", path: "/services" },
      { label: "Automation", path: "/services" },
      { label: "Websites and Apps", path: "/services" },
      { label: "Social Media", path: "/services" },
      { label: "Design and Brand", path: "/services" },
      { label: "Prices", path: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", path: "/about" },
      { label: "Clients", path: "/clients" },
      { label: "Partners", path: "/partners" },
      { label: "Learn", path: "/learn" },
      { label: "Affiliate Program", path: "/affiliate" },
      { label: "Contact", path: "/contact" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Design your website", path: "/build" },
      { label: "Our Apps", path: "/apps" },
      { label: "Diyama AI", path: "/ai" },
      { label: "Business Fit Generator", path: "/business-fit" },
      { label: "Book Consultation", path: "/consultations" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
    ],
  },
];

const Footer = () => {
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-ink text-white overflow-hidden">
      {/* the header's hairline, mirrored */}
      <div className="h-px w-full bg-gradient-to-r from-accent via-primary to-transparent" />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      {/* the hero's lights and the pointer glow, so the footer reads as the same surface */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="aurora animate-aurora-1 -bottom-48 -left-24 w-[36rem] h-[36rem] bg-[hsl(173_80%_32%/0.4)]" />
        <div className="aurora animate-aurora-2 -top-40 right-[8%] w-[30rem] h-[30rem] bg-[hsl(41_95%_55%/0.16)]" />
      </div>
      <CursorGlow />
      <div className="grain absolute inset-0 pointer-events-none" />

      <div className="relative container-wide mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-8">
        {/* top row: the same lockup as the header plus the one thing we want you to do */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-12 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5 group w-fit" aria-label="Diyama Solutions, home">
            <motion.img
              src={diyamaLogo}
              alt="Diyama Solutions"
              width={44}
              height={44}
              loading="lazy"
              className="h-11 w-11 rounded-full ring-2 ring-white/10"
              whileHover={{ scale: 1.06, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            />
            <span className="font-display text-2xl font-bold tracking-tight text-white">
              Diyama<span className="text-accent group-hover:animate-pulse">.</span>
            </span>
            <span className="hidden sm:inline-block ml-3 pl-3 border-l border-white/15 text-sm text-white/55">Clarity in Action.</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/build" className="btn-accent group inline-flex items-center gap-2 font-semibold">
              Design your website <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link to="/consultations" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-white/20 text-white/85 font-medium text-sm hover:bg-white/10 transition-colors">
              Book a consultation
            </Link>
          </div>
        </div>

        {/* columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_0.8fr] gap-8 lg:gap-10 pt-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <p className="text-sm text-white/65 leading-relaxed max-w-xs">
              Business systems, automation and software, built and run in Zambia. Every price in the
              open, a written quote before any work starts.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-white/70">
              <li>
                <a href="tel:0966138238" className="inline-flex items-center gap-2.5 hover:text-white transition-colors">
                  <span className="w-7 h-7 rounded-md bg-white/8 border border-white/10 flex items-center justify-center text-accent"><Phone size={13} /></span> 0966138238
                </a>
              </li>
              <li>
                <a href="mailto:getitdonerapid@gmail.com" className="inline-flex items-center gap-2.5 hover:text-white transition-colors">
                  <span className="w-7 h-7 rounded-md bg-white/8 border border-white/10 flex items-center justify-center text-accent"><Mail size={13} /></span> getitdonerapid@gmail.com
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-white/8 border border-white/10 flex items-center justify-center text-accent"><MapPin size={13} /></span> Lusaka and Livingstone
              </li>
            </ul>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-display font-semibold text-sm mb-4 text-white">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm text-white/60 hover:text-accent transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} Diyama Solutions Ltd. TPIN: 2001340367. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/45">
            <Link to="/#beon" className="hover:text-white transition-colors">BeOn Tech, coming soon</Link>
            <span className="text-white/20">|</span>
            <span>www.diyama.online</span>
            <button
              type="button"
              onClick={toTop}
              aria-label="Back to top"
              className="ml-2 w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/70 hover:text-ink hover:bg-accent hover:border-accent transition-colors"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
