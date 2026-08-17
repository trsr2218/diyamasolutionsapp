import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import diyamaLogo from "@/assets/logo.jpg";

/* Five items and one call to action, not ten.
 *
 * Visitor feedback, August 2026: the old ten link bar read as "complicated,
 * full, distracting, overwhelming" and was likely reducing the actions we
 * actually want people to take. A quiet bar lets the Book Consultation
 * button win. Nothing was removed from the site: Partners, Clients, About
 * and Contact moved into a menu, and the footer still lists every page.
 *
 * Home is gone on purpose. The logo is the home link, as it is everywhere.
 */

type NavChild = { label: string; path: string; blurb: string };
type NavLinkEntry = { label: string; path: string };
type NavMenuEntry = { label: string; children: NavChild[] };
type NavEntry = NavLinkEntry | NavMenuEntry;

const isMenu = (entry: NavEntry): entry is NavMenuEntry => "children" in entry;

const navEntries: NavEntry[] = [
  { label: "Services", path: "/services" },
  { label: "Apps", path: "/apps" },
  {
    label: "Free Tools",
    children: [
      { label: "Diyama AI", path: "/ai", blurb: "Ask a business question, get an answer now" },
      { label: "Business Fit", path: "/business-fit", blurb: "A 2 minute quiz, then your free Business Kit" },
    ],
  },
  { label: "Learn", path: "/learn" },
  {
    label: "Company",
    children: [
      { label: "About", path: "/about", blurb: "Who we are and how we work" },
      { label: "Clients", path: "/clients", blurb: "Businesses we have helped move" },
      { label: "Partners", path: "/partners", blurb: "Brands we advertise for" },
      { label: "Contact", path: "/contact", blurb: "Call, email or send us a message" },
    ],
  },
];

const linkBase =
  "relative px-3 py-2 rounded-md text-sm font-medium transition-colors";

/* The sliding pill and underline are shared across every top level item via
   layoutId. Only one item can be active at a time, so a link and a menu
   trigger never claim the same layoutId in the same render. */
const ActiveMarks = () => (
  <>
    <motion.span
      layoutId="nav-active-pill"
      className="absolute inset-0 bg-primary/8 rounded-md"
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    />
    <motion.span
      layoutId="nav-active-underline"
      className="absolute left-3 right-3 -bottom-[1px] h-0.5 bg-accent rounded-full"
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    />
  </>
);

/* Opens on hover and on keyboard focus, closes on Escape, on blur out and on
   a short delay so the pointer can cross the gap to the panel. */
const NavMenu = ({ entry, active }: { entry: NavMenuEntry; active: boolean }) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`${linkBase} inline-flex items-center gap-1 ${
          active ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {active && <ActiveMarks />}
        <span className="relative z-10">{entry.label}</span>
        <ChevronDown
          size={14}
          className={`relative z-10 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            role="menu"
            className="absolute left-0 top-full pt-2 w-[19rem] origin-top"
          >
            <div className="rounded-xl border border-border/70 bg-background/95 backdrop-blur-lg shadow-lg p-1.5">
              {entry.children.map((child) => (
                <Link
                  key={child.path}
                  to={child.path}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-primary/5 focus:bg-primary/5 focus:outline-none"
                >
                  <span className="block text-sm font-medium text-foreground">{child.label}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5 leading-snug">
                    {child.blurb}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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

  const isActive = (entry: NavEntry) =>
    isMenu(entry)
      ? entry.children.some((c) => c.path === location.pathname)
      : entry.path === location.pathname;

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
        <Link to="/" className="flex items-center gap-2 group" aria-label="Diyama Solutions, home">
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
        <div className="hidden lg:flex items-center gap-1">
          {navEntries.map((entry) =>
            isMenu(entry) ? (
              <NavMenu key={entry.label} entry={entry} active={isActive(entry)} />
            ) : (
              <Link
                key={entry.path}
                to={entry.path}
                className={`${linkBase} ${
                  isActive(entry) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive(entry) && <ActiveMarks />}
                <span className="relative z-10">{entry.label}</span>
              </Link>
            )
          )}
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
          aria-expanded={open}
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

      {/* Mobile menu. Same five entries, the two menus become labelled groups. */}
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
              {navEntries.map((entry) => (
                <motion.div
                  key={entry.label}
                  variants={{
                    hidden: { opacity: 0, x: -14 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
                  }}
                >
                  {isMenu(entry) ? (
                    <div className="pt-3 first:pt-0">
                      <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                        {entry.label}
                      </p>
                      {entry.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => setOpen(false)}
                          className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            location.pathname === child.path
                              ? "text-primary bg-primary/5"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      to={entry.path}
                      onClick={() => setOpen(false)}
                      className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === entry.path
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {entry.label}
                    </Link>
                  )}
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
                  className="block btn-primary text-sm text-center mt-4"
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
