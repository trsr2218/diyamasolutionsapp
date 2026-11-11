import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import beonMark from "@/assets/beon-mark.webp";
import { whatsappLink } from "@/lib/whatsapp";

/* BeOn Tech, coming soon.
 *
 * BeOn Tech is a Diyama Solutions product that is still in private trial, so
 * this is a teaser and nothing more: the real mark, three true statements, and
 * a way to ask for early access. No price, no date, no feature list, because
 * none of those are decided. Add them here only when Ernest has set them.
 */

export const BEON_ANCHOR = "beon";

const points = [
  "Learns how you work, and keeps to it",
  "Keeps every project moving, and picks up where you stopped",
  "Lives on your own computer, under your name",
];

const BeOnTeaser = () => (
  <section id={BEON_ANCHOR} className="relative overflow-hidden bg-black text-white scroll-mt-20">
    {/* Cyan floor glow, the product's own colour, kept off the Diyama gold */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_75%_50%,rgba(0,170,255,0.16),transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" />
    </div>

    <div className="relative z-10 section-padding">
      <div className="container-wide mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="eyebrow text-cyan-300 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
            Coming soon from Diyama Solutions
          </p>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold leading-[1.05] mb-5">
            BeOn Tech.
            <span className="block text-white/60 font-semibold text-2xl sm:text-3xl mt-3">
              A working brain for your computer.
            </span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-xl mb-7">
            Switch it on and your computer stops waiting for instructions. BeOn knows your
            projects, remembers where each one stands, and gets on with the next step.
          </p>
          <ul className="space-y-3 mb-9">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm sm:text-base text-white/80">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-cyan-300 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={whatsappLink("Hi Diyama, please put me on the early access list for BeOn Tech.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 text-black font-semibold px-6 py-3 transition-all duration-200 hover:bg-cyan-300 hover:-translate-y-0.5 shadow-[0_8px_30px_rgba(0,190,255,0.35)]"
            >
              Ask for early access <ArrowRight size={16} />
            </a>
            <span className="text-sm text-white/45">In private trial now. Limited places.</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-sm lg:max-w-md aspect-square mix-blend-screen"
        >
          <div className="absolute inset-[12%] rounded-full bg-cyan-400/20 blur-3xl animate-breathe" />
          <img
            src={beonMark}
            alt="BeOn Tech"
            width={720}
            height={720}
            loading="lazy"
            className="relative w-full h-full object-contain"
            style={{
              WebkitMaskImage: "radial-gradient(closest-side, #000 80%, transparent 100%)",
              maskImage: "radial-gradient(closest-side, #000 80%, transparent 100%)",
            }}
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default BeOnTeaser;
