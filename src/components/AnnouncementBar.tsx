import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";

/* One quiet line above the navigation, on every page, pointing at the BeOn Tech
   teaser on the homepage. A visitor can close it, and it stays closed for that
   visit. Storage can be unavailable in a private window, so it is wrapped. */

const KEY = "diyama-beon-bar-closed";

const AnnouncementBar = () => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(KEY) === "1") setOpen(false);
    } catch {
      /* keep it open */
    }
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

  return (
    <div className="relative z-50 bg-black text-white text-xs sm:text-sm">
      <div className="container-wide mx-auto flex items-center justify-center gap-3 px-10 py-2">
        <span className="hidden sm:inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[10px] text-cyan-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" /> Coming soon
        </span>
        <Link to="/#beon" className="inline-flex items-center gap-1.5 hover:text-cyan-200 transition-colors">
          <span>
            <strong className="font-semibold">BeOn Tech</strong>, a working brain for your computer
          </span>
          <ArrowRight size={14} className="shrink-0" />
        </Link>
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
