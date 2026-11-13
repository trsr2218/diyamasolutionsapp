import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, MousePointer2, Globe, Link2, LayoutTemplate, Wand2, GripVertical, Check } from "lucide-react";

/* The launch piece for /build on the homepage. It does not describe the builder,
 * it runs it: a brief is typed, Diyama AI "designs", the blocks drop in, a cursor
 * drags one into place, the colour cycles and the address bar cycles through the
 * three ways to go live. Then it loops. Ernest, 12 November 2026: the old static
 * card "sucks ... that's how we hype a new feature?" This is the hype. */

/* No made-up business name (Ernest, 13 Nov 2026): the brief describes a kind of business. */
const brief = "A hardware shop in Kitwe. Tools and building materials, delivery in town.";
const accents = ["#F2B134", "#0F9B8E", "#E0343C", "#2F6FED", "#8B5CF6"];
const addresses = [
  { icon: Globe, text: "www.yourbusiness.com", label: "Your own domain" },
  { icon: Link2, text: "yourbusiness.diyama.online", label: "A Diyama address" },
  { icon: LayoutTemplate, text: "diyama.online/partners/yourbusiness", label: "A page on Diyama" },
];
const blocks = ["What we sell", "Delivery in town", "Find us", "Order on WhatsApp"];

/* phases: 0 typing, 1 thinking, 2 blocks drop in, 3 drag, 4 colours and addresses, then loop */
const BuilderShowcase = () => {
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState(0);
  const [shown, setShown] = useState(0);
  const [order, setOrder] = useState(blocks);
  const [accent, setAccent] = useState(0);
  const [addr, setAddr] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    let t: number;
    if (phase === 0) {
      if (typed < brief.length) t = window.setTimeout(() => setTyped((n) => n + 1), 28);
      else t = window.setTimeout(() => setPhase(1), 500);
    } else if (phase === 1) {
      t = window.setTimeout(() => setPhase(2), 1300);
    } else if (phase === 2) {
      if (shown < blocks.length) t = window.setTimeout(() => setShown((n) => n + 1), 380);
      else t = window.setTimeout(() => setPhase(3), 500);
    } else if (phase === 3) {
      setDragging(true);
      t = window.setTimeout(() => {
        setOrder([blocks[3], blocks[0], blocks[1], blocks[2]]);
        setDragging(false);
        setPhase(4);
      }, 1100);
    } else {
      t = window.setTimeout(() => {
        setTyped(0);
        setShown(0);
        setOrder(blocks);
        setAccent(0);
        setAddr(0);
        setPhase(0);
      }, 6500);
    }
    return () => window.clearTimeout(t);
  }, [phase, typed, shown]);

  useEffect(() => {
    if (phase !== 4) return;
    const a = window.setInterval(() => setAccent((n) => (n + 1) % accents.length), 1100);
    const b = window.setInterval(() => setAddr((n) => (n + 1) % addresses.length), 2100);
    return () => {
      window.clearInterval(a);
      window.clearInterval(b);
    };
  }, [phase]);

  const color = accents[accent];
  const Addr = addresses[addr].icon;

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="aurora animate-aurora-1 -top-40 left-[5%] w-[36rem] h-[36rem] bg-[hsl(173_80%_32%/0.45)]" />
        <motion.div animate={{ background: color }} transition={{ duration: 0.8 }} className="aurora animate-aurora-2 top-[20%] -right-32 w-[30rem] h-[30rem] opacity-25" />
      </div>
      <div className="grain absolute inset-0 pointer-events-none" />

      <div className="relative z-10 section-padding">
        <div className="container-wide mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-14 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3.5 py-1.5 text-xs font-semibold text-accent mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Just launched
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-display font-extrabold leading-[1.0] tracking-[-0.03em] mb-6">
              Describe it. <span className="text-gold-gradient">Drag it.</span> Take it live.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              Tell Diyama AI about your business and watch your website draft itself. Drag the blocks
              where you want them. Then pick how it goes live and send it to us in one tap. No account,
              no card, nothing paid on the page.
            </p>
            <ul className="space-y-3 mb-9">
              {[
                { icon: Wand2, t: "Diyama AI drafts the whole site from one sentence" },
                { icon: MousePointer2, t: "Twelve kinds of block, drag them into any order" },
                { icon: Globe, t: "Your own domain, a Diyama address, or a page on Diyama" },
              ].map((r) => (
                <li key={r.t} className="flex items-center gap-3 text-sm sm:text-base text-white/85">
                  <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-accent"><r.icon size={15} /></span>
                  {r.t}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link to="/build" className="btn-accent group inline-flex items-center gap-2 font-semibold text-base px-6 py-3.5">
                Build mine now <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-white/20 text-white/80 font-medium text-sm hover:bg-white/10 transition-colors">
                Prices, in the open
              </Link>
            </div>
          </motion.div>

          {/* the builder, running */}
          <motion.div initial={{ opacity: 0, y: 30, rotate: 1.5 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
            <div className="relative rounded-2xl border border-white/15 bg-[hsl(220_40%_8%/0.9)] shadow-2xl shadow-black/60 backdrop-blur-xl p-3 sm:p-4">
              {/* address bar */}
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div className="ml-2 flex-1 rounded-md bg-white/8 text-[11px] text-white/70 px-2.5 py-1 flex items-center gap-1.5 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={addr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="inline-flex items-center gap-1.5 truncate">
                      <Addr size={11} className="shrink-0" style={{ color }} /> {addresses[addr].text}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {phase === 4 && (
                    <motion.span key={addr} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="hidden sm:inline-flex text-[10px] font-semibold rounded-full px-2 py-0.5 border whitespace-nowrap" style={{ color, borderColor: `${color}66`, background: `${color}22` }}>
                      {addresses[addr].label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* the brief */}
              <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 mb-3 min-h-[3.25rem]">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/45 mb-1 inline-flex items-center gap-1.5"><Sparkles size={10} className="text-accent" /> Tell Diyama AI about your business</p>
                <p className="text-[13px] text-white/90 leading-snug">
                  {brief.slice(0, typed)}
                  {phase === 0 && <span className="inline-block w-0.5 h-3.5 bg-accent ml-0.5 align-middle animate-pulse" />}
                  {phase === 1 && (
                    <span className="ml-2 inline-flex items-center gap-1 text-accent text-[11px] font-semibold">
                      designing
                      {[0, 1, 2].map((i) => <span key={i} className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />)}
                    </span>
                  )}
                  {phase >= 2 && <span className="ml-2 inline-flex items-center gap-1 text-emerald-300 text-[11px] font-semibold"><Check size={11} /> drafted</span>}
                </p>
              </div>

              {/* the site */}
              <div className="rounded-xl overflow-hidden bg-[#0b1020] text-white">
                <div className="flex items-center justify-between px-4 py-2.5 text-[10px] border-b border-white/10">
                  <span className="font-bold text-xs">Your Business</span>
                  <span className="flex gap-2.5 text-white/50"><span>Home</span><span>Shop</span><span>Contact</span></span>
                  <motion.span animate={{ background: color }} transition={{ duration: 0.6 }} className="rounded px-2 py-0.5 text-[9px] font-semibold text-black">Order</motion.span>
                </div>
                <div className="relative px-4 pt-5 pb-4 overflow-hidden">
                  <motion.div animate={{ background: color }} transition={{ duration: 0.6 }} className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-40" />
                  <AnimatePresence mode="wait">
                    <motion.p key={phase >= 2 ? "a" : "b"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative font-extrabold text-lg sm:text-xl leading-tight tracking-tight">
                      {phase >= 2 ? "Every tool you need, delivered in Kitwe today." : "Your headline goes here."}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="px-4 pb-4 space-y-2 relative min-h-[9.5rem]">
                  <AnimatePresence initial={false}>
                    {order.slice(0, Math.min(shown, order.length)).map((b, i) => (
                      <motion.div
                        key={b}
                        layout
                        initial={{ opacity: 0, y: 14, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: dragging && b === blocks[3] ? 1.03 : 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                        className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-[11px]"
                        style={dragging && b === blocks[3] ? { boxShadow: `0 12px 30px rgba(0,0,0,0.5), 0 0 0 1px ${color}` } : undefined}
                      >
                        <GripVertical size={12} className="text-white/30" />
                        <motion.span animate={{ background: `${color}55` }} className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center"><span className="w-2 h-2 rounded-sm" style={{ background: color }} /></motion.span>
                        <span className="font-medium">{b}</span>
                        <span className="ml-auto h-1.5 w-10 rounded bg-white/10" />
                        {i === 0 && phase >= 2 && <span className="h-1.5 w-6 rounded bg-white/10" />}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {/* the cursor doing the drag */}
                  <AnimatePresence>
                    {dragging && (
                      <motion.span
                        initial={{ opacity: 0, x: 150, y: 118 }}
                        animate={{ opacity: 1, x: 150, y: 6 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-0 top-0 text-white drop-shadow-lg pointer-events-none"
                      >
                        <MousePointer2 size={18} fill="#fff" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* colours */}
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex gap-1.5">
                  {accents.map((c, i) => (
                    <motion.span key={c} animate={{ scale: i === accent && phase === 4 ? 1.25 : 1 }} className="w-4 h-4 rounded-full border border-white/30" style={{ background: c }} />
                  ))}
                </div>
                <span className="text-[10px] text-white/45">Starting price from our price list, no surprises</span>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-white/40">This is the builder running. Yours takes about two minutes.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BuilderShowcase;
