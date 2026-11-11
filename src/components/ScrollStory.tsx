import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { storyPeople } from "@/data/people";

/* How we work, told as a sticky scroll story: the text steps scroll past while one
 * photograph stays pinned and changes with each step. On phones it is a plain
 * stacked list, because a pinned panel on a small screen is a trap. The photographs
 * are the faces from Diyama's own service graphics; the caption says so. */

const steps = [
  {
    n: "01",
    title: "Scope",
    body: "One conversation about how the work really gets done today. You get a written quote with everything itemised before anybody starts.",
    photo: { src: storyPeople[0], alt: "Two men in suits talking, from a Diyama service graphic" },
  },
  {
    n: "02",
    title: "Build",
    body: "We build it around your business, on the phones and computers you already have. New to us? You see yours working before you pay.",
    photo: { src: storyPeople[1], alt: "A man thinking at a desk, from a Diyama service graphic" },
  },
  {
    n: "03",
    title: "Run",
    body: "We keep it secure, backed up and online and somebody local answers when you call. The build gets you started. The care keeps you there.",
    photo: { src: storyPeople[2], alt: "A man in a blue suit inside a golden ring, from a Diyama service graphic" },
  },
];

const ScrollStory = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.9"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)));
    if (next !== active) setActive(next);
  });

  return (
    <section className="section-padding bg-surface border-y overflow-hidden">
      <div className="container-wide mx-auto">
        <div className="max-w-2xl mb-12 lg:mb-16">
          <p className="eyebrow text-primary mb-4">How we work</p>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-bold leading-[1.05] tracking-[-0.02em]">
            We build it, we run it. You stay focused on your customers.
          </h2>
        </div>

        <div ref={ref} className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
          <ol className="space-y-6 lg:space-y-0">
            {steps.map((s, i) => (
              <li key={s.n} className="lg:min-h-[60vh] lg:flex lg:items-center">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={`transition-opacity duration-500 ${i === active ? "lg:opacity-100" : "lg:opacity-35"}`}
                >
                  <div className="lg:hidden photo-frame aspect-[4/3] mb-5">
                    <img src={s.photo.src} alt={s.photo.alt} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <span className="inline-flex w-11 h-11 rounded-full bg-gradient-to-br from-accent to-[hsl(30_95%_55%)] text-accent-foreground items-center justify-center font-display text-sm font-extrabold shadow-lg shadow-accent/30">
                    {s.n}
                  </span>
                  <h3 className="font-display text-3xl sm:text-4xl font-bold mt-4 mb-3 tracking-[-0.02em]">{s.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-md">{s.body}</p>
                </motion.div>
              </li>
            ))}
          </ol>

          <div className="hidden lg:block lg:sticky lg:top-28 self-start">
            <div className="photo-frame aspect-[4/5] max-h-[70vh] w-full">
              <AnimatePresence mode="sync" initial={false}>
                <motion.img
                  key={steps[active].photo.src}
                  src={steps[active].photo.src}
                  alt={steps[active].photo.alt}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-4">
                <p className="text-xs text-white/75">From Diyama's own service graphics</p>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {steps[active].n} {steps[active].title}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 lg:mt-4">
          <Link to="/consultations" className="btn-primary group inline-flex items-center gap-2">
            Start with a conversation <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ScrollStory;
