import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import diyamaLogo from "@/assets/logo.jpg";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Apps", path: "/apps" },
  { label: "Clients", path: "/clients" },
  { label: "Partners", path: "/partners" },
  { label: "Diyama AI", path: "/ai" },
  { label: "Business Fit", path: "/business-fit" },
  { label: "Learn", path: "/learn" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300 ${
        scrolled ? "bg-background/90 border-border/70 shadow-sm" : "bg-background/70 border-border/40"
      }`}
    >
      <div className="container-wide mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.img
            src={diyamaLogo}
            alt="Diyama Solutions"
            className="h-10 w-auto rounded-sm"
            whileHover={{ scale: 1.06, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />
          <span className="font-display text-xl font-bold text-primary tracking-tight hidden sm:inline">
            Diyama<span className="text-accent group-hover:animate-pulse">.</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-2.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 bg-primary/8 rounded-md"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
                {active && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute left-2.5 right-2.5 -bottom-[1px] h-0.5 bg-accent rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/consultations" className="btn-primary text-sm relative overflow-hidden group inline-block">
              <span className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              Book Consultation
            </Link>
          </motion.div>
        </div>

        {/* Mobile toggle */}
        <motion.button
          onClick={() => setOpen(!open)}
          whileTap={{ scale: 0.85 }}
          className="lg:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="block"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Reading progress */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary origin-left"
        style={{ scaleX: progress }}
      />

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-b bg-background"
          >
            <motion.div
              className="px-4 py-4 space-y-1"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.path}
                  variants={{
                    hidden: { opacity: 0, x: -14 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
                  }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
                }}
              >
                <Link
                  to="/consultations"
                  onClick={() => setOpen(false)}
                  className="block btn-primary text-sm text-center mt-3"
                >
                  Book Consultation
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
