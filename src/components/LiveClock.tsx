import { useEffect, useState } from "react";

/* One true live thing above the fold: the time in Lusaka, ticking. It is read
 * from the visitor's clock in the Africa/Lusaka zone, so it is always right and
 * costs nothing. Decoration that pretends to be live reads as a template; a
 * real clock reads as a running office. */

const fmt = () =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Africa/Lusaka" }).format(new Date());

const LiveClock = ({ className = "" }: { className?: string }) => {
  /* Blank until the page runs: the prerendered HTML would otherwise carry the build time. */
  const [now, setNow] = useState("--:--:--");
  useEffect(() => {
    setNow(fmt());
    const t = window.setInterval(() => setNow(fmt()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase ${className}`}>
      <span className="relative flex w-2 h-2">
        <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
        <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
      </span>
      Lusaka <span className="tabular-nums text-white">{now}</span> CAT
    </span>
  );
};

export default LiveClock;
