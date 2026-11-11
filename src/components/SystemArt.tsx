import { motion } from "framer-motion";
import { Check, MessageCircle, FileText, Receipt, BellRing } from "lucide-react";

/* A small drawn scene for the top of each system card, so the four offers are
   shown and not only described. Drawn, never photographed and carrying no
   client name or real figure: these are illustrations of what each system does. */

const shell =
  "relative h-44 sm:h-48 overflow-hidden rounded-t-xl bg-ink text-white flex items-center justify-center";

const Glow = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
);

const FrontDesk = () => (
  <div className={shell}>
    <Glow className="w-56 h-56 -top-16 -left-10 bg-emerald-500/30" />
    <Glow className="w-48 h-48 -bottom-20 right-0 bg-accent/20" />
    <div className="relative w-[78%] max-w-xs space-y-2.5">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-white/12 backdrop-blur px-3.5 py-2 text-[13px]"
      >
        Do you have space this Saturday?
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-500 text-white px-3.5 py-2 text-[13px] shadow-lg shadow-emerald-500/30"
      >
        Yes, we do. Shall I book you in?
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.1 }}
        className="flex items-center gap-1.5 text-[11px] text-white/55 justify-end"
      >
        <MessageCircle size={12} /> Answered in seconds, logged
      </motion.div>
    </div>
  </div>
);

const days = Array.from({ length: 21 }, (_, i) => i + 1);
const booked = new Set([4, 5, 6, 12, 13, 18, 19, 20]);

const LodgeDesk = () => (
  <div className={shell}>
    <Glow className="w-56 h-56 -top-20 right-0 bg-accent/30" />
    <Glow className="w-44 h-44 -bottom-16 -left-8 bg-primary/50" />
    <div className="relative flex items-center gap-4">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <motion.span
            key={d}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.025, duration: 0.25 }}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md text-[10px] flex items-center justify-center font-medium ${
              booked.has(d) ? "bg-accent text-accent-foreground shadow shadow-accent/40" : "bg-white/8 text-white/50"
            }`}
          >
            {d}
          </motion.span>
        ))}
      </div>
      <div className="hidden sm:block rounded-lg border border-white/15 bg-white/8 backdrop-blur px-3 py-2.5">
        <p className="text-[10px] uppercase tracking-wider text-white/50">New booking</p>
        <p className="text-sm font-semibold mt-0.5">Booked direct</p>
        <p className="text-[11px] text-accent mt-1 inline-flex items-center gap-1">
          <Check size={11} /> On your own page
        </p>
      </div>
    </div>
  </div>
);

const flow = [
  { icon: MessageCircle, label: "Enquiry" },
  { icon: FileText, label: "Quote" },
  { icon: Receipt, label: "Invoice" },
  { icon: BellRing, label: "Reminder" },
];

const Automation = () => (
  <div className={shell}>
    <Glow className="w-60 h-60 -top-24 left-1/3 bg-sky-500/25" />
    <Glow className="w-44 h-44 -bottom-16 right-4 bg-accent/20" />
    <div className="relative flex items-center">
      {flow.map((f, i) => (
        <div key={f.label} className="flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.25, duration: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-white/15 bg-white/10 backdrop-blur flex items-center justify-center shadow-lg shadow-sky-500/10">
              <f.icon size={19} className={i === flow.length - 1 ? "text-accent" : "text-sky-300"} />
            </span>
            <span className="text-[10px] font-medium text-white/60">{f.label}</span>
          </motion.div>
          {i < flow.length - 1 && (
            <span className="relative w-7 sm:w-10 h-px bg-white/15 mx-1 sm:mx-1.5 -mt-5 overflow-hidden">
              <span className="absolute inset-y-0 w-4 bg-gradient-to-r from-transparent via-sky-300 to-transparent animate-flow" />
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

const bars = [38, 62, 48, 80, 66, 92];

const OfficeSystem = () => (
  <div className={shell}>
    <Glow className="w-56 h-56 -top-20 -left-6 bg-violet-500/25" />
    <Glow className="w-48 h-48 -bottom-20 right-0 bg-primary/50" />
    <div className="relative flex items-end gap-5">
      <div className="flex items-end gap-1.5 h-24">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
            className={`w-4 sm:w-5 rounded-t ${i === bars.length - 1 ? "bg-accent" : "bg-violet-400/70"}`}
          />
        ))}
      </div>
      <div className="space-y-1.5">
        {["Request approved", "Report ready", "Stock updated"].map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.15 }}
            className="flex items-center gap-2 rounded-md border border-white/12 bg-white/8 backdrop-blur px-2.5 py-1.5 text-[11px]"
          >
            <span className="w-4 h-4 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
              <Check size={10} />
            </span>
            {t}
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const art: Record<string, () => JSX.Element> = {
  "front-desk": FrontDesk,
  "lodge-desk": LodgeDesk,
  "automation-sprint": Automation,
  "office-system": OfficeSystem,
};

const SystemArt = ({ id }: { id: string }) => {
  const Art = art[id];
  return Art ? <Art /> : null;
};

export default SystemArt;
