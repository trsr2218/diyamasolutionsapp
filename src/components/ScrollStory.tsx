import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroAnswerBook from "@/assets/boards/hero-answer-book.webp";
import heroBackToWork from "@/assets/boards/hero-back-to-work.webp";
import heroFrontDesk from "@/assets/boards/hero-front-desk.webp";

/* How we work: three cards in a row, the picture on top and the words right under
 * it. Ernest, 12 November 2026, on the pinned-picture version: "leaving empty space
 * like that after the content when the words could have been right underneath it".
 * So nothing is pinned any more; each step is one card and the row reads left to
 * right. On phones the cards stack.
 *
 * The pictures are the text-free heroes the graphics office draws for the Diyama
 * page: the open notebook for the written quote, the laptop and phone being built,
 * the phone and bell for the desk that answers. */

const steps = [
  {
    n: "01",
    title: "Scope",
    body: "One conversation about how the work really gets done today. You get a written quote with everything itemised before anybody starts.",
    img: heroAnswerBook,
    alt: "An open notebook and a pen, from a Diyama board",
    bg: "#dbe6f2",
  },
  {
    n: "02",
    title: "Build",
    body: "We build it around your business, on the phones and computers you already have. New to us? You see yours working before you pay.",
    img: heroBackToWork,
    alt: "A laptop and a phone showing a conversation, from a Diyama board",
    bg: "#0a0a0a",
  },
  {
    n: "03",
    title: "Run",
    body: "We keep it secure, backed up and online and somebody local answers when you call. The build gets you started. The care keeps you there.",
    img: heroFrontDesk,
    alt: "A phone with a conversation beside a brass desk bell, from a Diyama board",
    bg: "#0f2d1e",
  },
];

const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.14 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const ScrollStory = () => (
  <section className="section-padding bg-surface border-y overflow-hidden">
    <div className="container-wide mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 lg:mb-14">
        <div className="max-w-2xl">
          <p className="eyebrow text-primary mb-4">How we work</p>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-bold leading-[1.05] tracking-[-0.02em]">
            We build it, we run it. You stay focused on your customers.
          </h2>
        </div>
        <Link to="/consultations" className="btn-primary group inline-flex items-center gap-2 w-fit">
          Start with a conversation <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <motion.ol
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid md:grid-cols-3 gap-5 lg:gap-7 list-none m-0 p-0"
      >
        {steps.map((s, i) => (
          <motion.li key={s.n} variants={rise} className="group relative">
            {/* a hairline between the cards on wide screens, so the row reads as one path */}
            {i < steps.length - 1 && (
              <span className="hidden md:block absolute top-[28%] -right-4 lg:-right-5 w-8 lg:w-10 h-px bg-gradient-to-r from-accent/70 to-primary/40 z-10" />
            )}
            <div className="card-glow h-full flex flex-col overflow-hidden">
              <div className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] overflow-hidden" style={{ background: s.bg }}>
                <img
                  src={s.img}
                  alt={s.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
                <span className="absolute left-5 bottom-5 inline-flex w-11 h-11 rounded-full bg-gradient-to-br from-accent to-[hsl(30_95%_55%)] text-accent-foreground items-center justify-center font-display text-sm font-extrabold shadow-lg shadow-accent/30 ring-4 ring-black/20">
                  {s.n}
                </span>
                <span className="absolute right-4 bottom-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">{s.title}</span>
              </div>
              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2.5 tracking-[-0.02em]">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  </section>
);

export default ScrollStory;
