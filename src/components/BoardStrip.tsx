import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import backToWork from "@/assets/boards/board-back-to-work.webp";
import answerBook from "@/assets/boards/board-answer-book.webp";
import frontDesk from "@/assets/boards/board-front-desk.webp";

/* This week's boards from the Diyama page, drawn by the graphics office in the new
 * poster layout (12 November 2026, built to Ernest's own design language: one hero
 * per subject, a colour world per post). Shown on the homepage and on About in
 * place of the cropped poster people. Replace the three files in `assets/boards`
 * when the week moves on; nothing else changes. */

const boards = [
  { src: backToWork, alt: "Diyama board: We went quiet. We were building. A laptop and a phone on a dark desk.", world: "Gold" },
  { src: answerBook, alt: "Diyama board: Write down the ten questions you get every week. An open notebook and a pen.", world: "Sky" },
  { src: frontDesk, alt: "Diyama board: Your WhatsApp answered, even when you are busy. A phone beside a brass desk bell.", world: "Green" },
];

const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const inView = { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-70px" } } as const;

interface Props {
  eyebrow?: string;
  title?: string;
  blurb?: string;
  tone?: "background" | "surface";
}

const BoardStrip = ({
  eyebrow = "Fresh from our page",
  title = "What we drew this week.",
  blurb = "Every board on the Diyama page is drawn by the same hand that designs your posts, your site and your brand. One picture per subject, a colour world per post.",
  tone = "background",
}: Props) => (
  <section className={`section-padding overflow-hidden ${tone === "surface" ? "bg-surface border-y" : "bg-background"}`}>
    <div className="container-wide mx-auto">
      <motion.div variants={stagger} {...inView}>
        <motion.div variants={fadeUp} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="eyebrow text-primary mb-4">{eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-bold leading-tight mb-4">{title}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{blurb}</p>
          </div>
          <Link to="/services" className="inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline whitespace-nowrap">
            Get this for your page <ArrowRight size={14} />
          </Link>
        </motion.div>
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {boards.map((b, i) => (
            <motion.figure
              key={b.src}
              variants={fadeUp}
              whileHover={{ y: -6, rotate: i === 1 ? 0 : i === 0 ? -0.6 : 0.6 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="group relative overflow-hidden rounded-2xl bg-ink ring-1 ring-foreground/10 shadow-xl shadow-black/10 aspect-[4/5]"
            >
              <img src={b.src} alt={b.alt} loading="lazy" className="w-full h-full object-cover" />
              <figcaption className="absolute top-3 left-3 rounded-full bg-black/55 backdrop-blur text-white text-[10px] font-semibold uppercase tracking-[0.16em] px-2.5 py-1">
                {b.world} world
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default BoardStrip;
