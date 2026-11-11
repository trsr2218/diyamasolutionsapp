import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X, Sparkles } from "lucide-react";

/* One line above the navigation, on every page. It takes turns: the BeOn Tech
   teaser and the website builder launch, a few seconds each, so both get the
   top of every page without shouting over each other. Ernest, 12 November 2026:
   "make the website builder feature an advert too like BeOn, the interchange".
   A visitor can close it and it stays closed for that visit. Storage can be
   unavailable in a private window, so it is wrapped. */

const KEY = "diyama-top-bar-closed";

const adverts = [
  {
    id: "build",
    tag: "Just launched",
    tone: "text-accent",
    dot: "bg-accent",
    hover: "hover:text-accent",
    to: "/build",
    icon: Sparkles,
    text: (
      <span>
        <strong className="font-semibold">Design your own website.</strong> Describe it, drag it, take it live
      </span>
    ),
  },
  {
    id: "beon",
    tag: "Coming soon",
    tone: "text-cyan-300",
    dot: "bg-cyan-300",
    hover: "hover:text-cyan-200",
    to: "/#beon",
    icon: null,
    text: (
      <span>
        <strong className="font-semibold">BeOn Tech</strong> is switching on
      </span>
    ),
  },
];

const AnnouncementBar = () => {
  const [open, setOpen] = useState(true);
  const [i, setI] = useState(0);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(KEY) === "1") setOpen(false);
    } catch {
      /* keep it open */
    }
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % adverts.length), 6500);
    return () => window.clearInterval(t);
  }, []);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(KEY, "1");
    } catch {
      /* nothing to do */
    }
  };

  const ad = adverts[i];
  const Icon = ad.icon;

  return (
    <div className="relative z-50 bg-black text-white text-xs sm:text-sm overflow-hidden">
      <div className="container-wide mx-auto px-10 h-9 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-3"
          >
            <span className={`hidden sm:inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[10px] ${ad.tone}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${ad.dot} animate-pulse`} /> {ad.tag}
            </span>
            <Link to={ad.to} className={`inline-flex items-center gap-1.5 transition-colors ${ad.hover}`}>
              {Icon && <Icon size={13} className={`shrink-0 ${ad.tone}`} />}
              {ad.text}
              <ArrowRight size={14} className="shrink-0" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex gap-1.5 pb-1">
        {adverts.map((a, n) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setI(n)}
            aria-label={a.tag}
            className={`h-0.5 rounded-full transition-all ${n === i ? "w-5 bg-white/70" : "w-2 bg-white/25"}`}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={close}
        aria-label="Close announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
