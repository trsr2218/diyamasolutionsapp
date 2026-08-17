import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import diyamaLogo from "@/assets/logo.jpg";

const footerLinks = [
  {
    title: "Services",
    links: [
      { label: "Digital Marketing", path: "/services" },
      { label: "Growth Strategy", path: "/services" },
      { label: "Branding", path: "/services" },
      { label: "Web Development", path: "/services" },
      { label: "Consulting", path: "/services" },
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
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-wide mx-auto section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src={diyamaLogo} alt="Diyama Solutions" className="h-12 w-auto" />
            </Link>
            <p className="mt-3 text-sm opacity-70 leading-relaxed max-w-xs">
              Helping businesses move from confusion to clarity, from stalling to growing.
            </p>
            <p className="mt-2 text-xs opacity-50 italic">Clarity in Action.</p>
            <div className="mt-5 space-y-2 text-sm opacity-70">
              <a href="tel:0966138238" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                <Phone size={14} /> 0966138238
              </a>
              <a href="mailto:getitdonerapid@gmail.com" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                <Mail size={14} /> getitdonerapid@gmail.com
              </a>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-body font-semibold text-sm mb-4 opacity-90">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-50">
            © {new Date().getFullYear()} Diyama Solutions. TPIN: 2001340367. All rights reserved.
          </p>
          <p className="text-xs opacity-50">
            www.diyama.online
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
