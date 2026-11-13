import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FileText, BellRing, ListChecks, CalendarDays, ClipboardList, Receipt, type LucideIcon } from "lucide-react";

/* The hero visual: one WhatsApp conversation handled start to finish, played as a
 * loop. Every business owner in Zambia reads this in two seconds, which is the
 * whole point. Each pass of the loop plays a different industry, so a lodge, a car
 * hire, a clinic, a salon, a takeaway and a tour operator all see themselves in it.
 * The conversations are illustrative and name nobody. Nothing here promises an
 * outcome: it shows what the Front Desk and the automation do. No prices appear,
 * because every price on this site comes from the price list, never from a sample. */

type Line =
  | { who: "customer" | "desk"; text: string; at: string }
  | { who: "typing" };

interface Scene {
  industry: string;
  script: Line[];
  after: { icon: LucideIcon; text: string }[];
}

const scenes: Scene[] = [
  {
    industry: "Lodge",
    script: [
      { who: "customer", text: "Hi, do you have a room for two this Saturday night?", at: "19:42" },
      { who: "typing" },
      { who: "desk", text: "Yes. A garden room and a family room are open on Saturday. Which one would you like?", at: "19:42" },
      { who: "customer", text: "Garden room please", at: "19:43" },
      { who: "typing" },
      { who: "desk", text: "Booked: Saturday night, garden room, two guests. Your confirmation and invoice are on their way.", at: "19:43" },
    ],
    after: [
      { icon: ListChecks, text: "Logged in your bookings list" },
      { icon: FileText, text: "Invoice sent, no retyping" },
      { icon: BellRing, text: "Reminder set for Friday" },
    ],
  },
  {
    industry: "Car hire",
    script: [
      { who: "customer", text: "Do you have a car from Friday to Monday? Something for gravel roads.", at: "08:15" },
      { who: "typing" },
      { who: "desk", text: "Yes. A pickup and a small SUV are free from Friday to Monday. Which one would you like?", at: "08:15" },
      { who: "customer", text: "The SUV", at: "08:16" },
      { who: "typing" },
      { who: "desk", text: "Reserved: SUV, Friday pickup to Monday return. Your quote and the hire form are on their way.", at: "08:16" },
    ],
    after: [
      { icon: CalendarDays, text: "Vehicle marked out on the calendar" },
      { icon: FileText, text: "Quote sent, no retyping" },
      { icon: BellRing, text: "Return reminder set for Monday" },
    ],
  },
  {
    industry: "Clinic",
    script: [
      { who: "customer", text: "Can I see the dentist tomorrow? My tooth has hurt since last night.", at: "21:05" },
      { who: "typing" },
      { who: "desk", text: "Sorry to hear that. The dentist has 9am and 2pm open tomorrow. Which one works for you?", at: "21:05" },
      { who: "customer", text: "9am", at: "21:06" },
      { who: "typing" },
      { who: "desk", text: "Booked: tomorrow 9am. Please bring your ID. A reminder will reach you tonight.", at: "21:06" },
    ],
    after: [
      { icon: ListChecks, text: "Added to the appointment list" },
      { icon: ClipboardList, text: "Patient file opened" },
      { icon: BellRing, text: "Reminder set for tonight" },
    ],
  },
  {
    industry: "Salon",
    script: [
      { who: "customer", text: "Do you do braids on Sunday? How long does it take?", at: "17:30" },
      { who: "typing" },
      { who: "desk", text: "Yes. Braids take about three hours. We have 10am and 1pm open on Sunday. Which one?", at: "17:30" },
      { who: "customer", text: "10am", at: "17:31" },
      { who: "typing" },
      { who: "desk", text: "Booked: Sunday 10am, braids. Your confirmation is on its way.", at: "17:31" },
    ],
    after: [
      { icon: ListChecks, text: "Logged in your bookings list" },
      { icon: Receipt, text: "Deposit request sent" },
      { icon: BellRing, text: "Reminder set for Saturday evening" },
    ],
  },
  {
    industry: "Takeaway",
    script: [
      { who: "customer", text: "Hi, can I order two family packs for collection at 6?", at: "16:48" },
      { who: "typing" },
      { who: "desk", text: "Yes. Two family packs for collection at 6pm today. Shall I confirm it?", at: "16:48" },
      { who: "customer", text: "Yes please", at: "16:49" },
      { who: "typing" },
      { who: "desk", text: "Order confirmed: two family packs, collection 6pm. Your invoice is on its way.", at: "16:49" },
    ],
    after: [
      { icon: ClipboardList, text: "Order added to the kitchen list" },
      { icon: FileText, text: "Invoice sent, no retyping" },
      { icon: BellRing, text: "Ready message set for 5:50pm" },
    ],
  },
  {
    industry: "Tours",
    script: [
      { who: "customer", text: "Is the sunset cruise running on Thursday? Two adults.", at: "11:20" },
      { who: "typing" },
      { who: "desk", text: "Yes. The Thursday cruise leaves at 4:30pm. Shall I book two seats for you?", at: "11:20" },
      { who: "customer", text: "Yes", at: "11:21" },
      { who: "typing" },
      { who: "desk", text: "Booked: Thursday sunset cruise, two adults. Your confirmation and payment details are on their way.", at: "11:21" },
    ],
    after: [
      { icon: ListChecks, text: "Seats logged on the Thursday list" },
      { icon: FileText, text: "Confirmation sent, no retyping" },
      { icon: BellRing, text: "Pickup reminder set for Thursday" },
    ],
  },
];

const delays = [900, 1100, 1400, 1300, 1000, 1500];

/* Message times follow the real clock. Ernest, 13 Nov 2026: the times beside the live
   Lusaka clock were "sooo wrong" (a 19:42 chat next to a clock reading 20:41). The script
   keeps its minute gaps; the first message is stamped with the time the scene starts. */
const mins = (at: string) => { const [h, m] = at.split(":").map(Number); return h * 60 + m; };
const lusaka = (ms: number) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Lusaka" }).format(new Date(ms));

const HeroChat = () => {
  const [scene, setScene] = useState(0);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(0);
  const { industry, script, after } = scenes[scene];
  useEffect(() => setStartedAt(Date.now()), [scene]);
  const firstAt = (script.find((l) => l.who !== "typing") as { at: string } | undefined)?.at ?? "00:00";
  const stamp = (at: string) => lusaka(startedAt + Math.max(0, mins(at) - mins(firstAt)) * 60000);

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
        setScene((s) => (s + 1) % scenes.length);
      }, 4200);
    }
    return () => window.clearTimeout(t);
  }, [shown, done, script.length, after.length]);

  const visible = script.slice(0, shown).filter((l, i) => !(l.who === "typing" && i < shown - 1));

  const jumpTo = (i: number) => {
    setShown(0);
    setDone(0);
    setScene(i);
  };

  return (
    <div className="relative w-full max-w-[22rem] sm:max-w-sm mx-auto lg:ml-auto">
      <div className="relative rounded-[2rem] border border-white/15 bg-[hsl(220_40%_8%/0.9)] shadow-2xl shadow-black/60 backdrop-blur-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-white/10">
          <span className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-[hsl(30_95%_55%)] flex items-center justify-center font-display font-extrabold text-ink text-sm shadow-lg shadow-accent/30">
            FD
          </span>
          <div className="leading-tight flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">Your Front Desk</p>
            <p className="text-[11px] text-emerald-300 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> answering on WhatsApp
            </p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={industry}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3 }}
              className="shrink-0 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent"
            >
              {industry}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="px-4 py-4 min-h-[19rem] sm:min-h-[20.5rem] flex flex-col justify-end gap-2.5">
          <AnimatePresence initial={false}>
            {visible.map((l, i) =>
              l.who === "typing" ? (
                <motion.div
                  key={`${scene}-typing-${i}`}
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
                  key={`${scene}-${i}-${l.text}`}
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
                    {stamp(l.at)} {l.who === "customer" ? "" : "· handled by the desk"}
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
                key={`${scene}-${a.text}`}
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

      <div className="mt-3 flex flex-wrap justify-center lg:justify-end gap-1.5">
        {scenes.map((s, i) => (
          <button
            key={s.industry}
            type="button"
            onClick={() => jumpTo(i)}
            aria-pressed={i === scene}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
              i === scene ? "bg-accent text-ink" : "bg-white/8 text-white/55 hover:bg-white/15 hover:text-white"
            }`}
          >
            {s.industry}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroChat;
