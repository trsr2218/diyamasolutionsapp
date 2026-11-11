import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FileText, BellRing, ListChecks } from "lucide-react";

/* The hero visual: one WhatsApp conversation handled start to finish, played as a
 * loop. Every business owner in Zambia reads this in two seconds, which is the
 * whole point. The conversation is illustrative and names nobody. Nothing here
 * promises an outcome: it shows what the Front Desk and the automation do. */

type Line =
  | { who: "customer" | "desk"; text: string; at: string }
  | { who: "typing" };

const script: Line[] = [
  { who: "customer", text: "Hi, do you have space this Saturday for four people?", at: "19:42" },
  { who: "typing" },
  { who: "desk", text: "Yes. We have 1pm and 4pm open on Saturday. Which one works for you?", at: "19:42" },
  { who: "customer", text: "4pm please", at: "19:43" },
  { who: "typing" },
  { who: "desk", text: "Booked: Saturday 4pm, four people. Your confirmation and invoice are on their way.", at: "19:43" },
];

const after = [
  { icon: ListChecks, text: "Logged in your bookings list" },
  { icon: FileText, text: "Invoice sent, no retyping" },
  { icon: BellRing, text: "Reminder set for Friday" },
];

const delays = [900, 1100, 1400, 1300, 1000, 1500];

const HeroChat = () => {
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(0);

  useEffect(() => {
    let t: number;
    if (shown < script.length) {
      t = window.setTimeout(() => setShown((n) => n + 1), delays[shown] ?? 1000);
    } else if (done < after.length) {
      t = window.setTimeout(() => setDone((n) => n + 1), 650);
    } else {
      t = window.setTimeout(() => {
        setShown(0);
        setDone(0);
      }, 4200);
    }
    return () => window.clearTimeout(t);
  }, [shown, done]);

  const visible = script.slice(0, shown).filter((l, i) => !(l.who === "typing" && i < shown - 1));

  return (
    <div className="relative w-full max-w-[22rem] sm:max-w-sm mx-auto lg:ml-auto">
      <div className="relative rounded-[2rem] border border-white/15 bg-[hsl(220_40%_8%/0.9)] shadow-2xl shadow-black/60 backdrop-blur-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-white/10">
          <span className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-[hsl(30_95%_55%)] flex items-center justify-center font-display font-extrabold text-ink text-sm shadow-lg shadow-accent/30">
            FD
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">Your Front Desk</p>
            <p className="text-[11px] text-emerald-300 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> answering on WhatsApp
            </p>
          </div>
        </div>

        <div className="px-4 py-4 min-h-[19rem] sm:min-h-[20.5rem] flex flex-col justify-end gap-2.5">
          <AnimatePresence initial={false}>
            {visible.map((l, i) =>
              l.who === "typing" ? (
                <motion.div
                  key={`typing-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="self-start rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-2.5 flex gap-1"
                >
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: `${d * 120}ms` }} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={`${i}-${l.text}`}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug shadow-md ${
                    l.who === "customer"
                      ? "self-end rounded-br-md bg-[hsl(150_45%_26%)] text-white"
                      : "self-start rounded-bl-md bg-white/10 text-white/90 border border-white/10"
                  }`}
                >
                  {l.text}
                  <span className="block text-[10px] text-white/45 mt-1 text-right">
                    {l.at} {l.who === "customer" ? "" : "· handled by the desk"}
                  </span>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        <div className="px-4 pb-4 space-y-2">
          <AnimatePresence>
            {after.slice(0, done).map((a) => (
              <motion.div
                key={a.text}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex items-center gap-2.5 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-[12px] text-emerald-100"
              >
                <span className="w-6 h-6 rounded-md bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <a.icon size={13} />
                </span>
                <span className="flex-1">{a.text}</span>
                <Check size={13} className="text-emerald-300" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HeroChat;
