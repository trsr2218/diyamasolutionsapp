import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircle, FileText, CalendarCheck, Receipt, Send, ShieldCheck, type LucideIcon } from "lucide-react";

/* The hero visual: a drawn product panel, not a photograph.
 *
 * The site used to lead with generated pictures of suited strangers, which is
 * the look every agency has and nobody believes. This shows the thing we sell
 * instead: one enquiry moving through a system without anyone retyping it.
 *
 * It is an illustration of a workflow. It carries no client name, no customer
 * name and no performance figure, so nothing in it can be read as a claim.
 */

type Step = { icon: LucideIcon; channel: string; title: string; detail: string };

const steps: Step[] = [
  { icon: MessageCircle, channel: "WhatsApp", title: "New enquiry received", detail: "Answered from your approved answer book" },
  { icon: FileText, channel: "Quotes", title: "Quote prepared and sent", detail: "Built from your live price list" },
  { icon: CalendarCheck, channel: "Bookings", title: "Booking confirmed", detail: "Added to the shared calendar" },
  { icon: Receipt, channel: "Invoices", title: "Invoice issued", detail: "Numbered, branded, logged" },
  { icon: Send, channel: "Social", title: "Today's post published", detail: "Checked twice before it went out" },
  { icon: ShieldCheck, channel: "Site Care", title: "Backup completed", detail: "Uptime and security checked" },
];

const VISIBLE = 4;

const SystemConsole = () => {
  const reduce = useReducedMotion();
  const [head, setHead] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setHead((h) => (h + 1) % steps.length), 2600);
    return () => window.clearInterval(t);
  }, [reduce]);

  const rows = Array.from({ length: VISIBLE }, (_, i) => {
    const index = (head + VISIBLE - 1 - i) % steps.length;
    return { ...steps[index], key: `${index}-${Math.floor((head + VISIBLE - 1 - i) / steps.length)}` };
  });

  return (
    <div className="relative" aria-hidden="true">
      {/* Glow behind the panel */}
      <div className="absolute -inset-8 rounded-[2rem] bg-[radial-gradient(ellipse_at_60%_30%,hsl(var(--accent)/0.16),transparent_65%)] blur-2xl" />

      <div className="relative panel-dark shadow-2xl shadow-black/50 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-line">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          </div>
          <p className="text-[11px] font-medium text-white/50 tracking-wide">Operations console</p>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300/90">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Running
          </span>
        </div>

        {/* Channel tabs */}
        <div className="flex gap-1.5 px-4 pt-3 overflow-hidden">
          {["All activity", "Enquiries", "Bookings", "Invoices"].map((t, i) => (
            <span
              key={t}
              className={`text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap ${
                i === 0 ? "bg-white/10 text-white" : "text-white/45"
              }`}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Activity feed */}
        <div className="p-4 space-y-2.5 h-[304px] overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            {rows.map((row, i) => (
              <motion.div
                key={row.key}
                layout
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: i === 0 ? 1 : 0.9 - i * 0.18, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="flex items-center gap-3 rounded-lg border border-ink-line bg-white/[0.03] px-3.5 py-3"
              >
                <span
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    i === 0 ? "bg-accent text-accent-foreground" : "bg-white/8 text-white/70"
                  }`}
                >
                  <row.icon size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-white truncate">{row.title}</span>
                  <span className="block text-xs text-white/50 truncate">{row.detail}</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40 shrink-0">
                  {row.channel}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer strip */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-ink-line text-[11px] text-white/45">
          <span>One enquiry, no retyping</span>
          <span>Illustration of a typical workflow</span>
        </div>
      </div>
    </div>
  );
};

export default SystemConsole;
