import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import beonMark from "@/assets/beon-mark.webp";
import { whatsappLink } from "@/lib/whatsapp";

/* BeOn Tech, coming soon.
 *
 * A teaser and nothing else, on Ernest's instruction of 11 November 2026: the
 * first version said what the product does and that is information a competitor
 * can copy. This shows the mark, the name and a way to ask for early access.
 * Do NOT add what it is, what it runs on, how it works, a feature, a price or a
 * date here. If someone asks, the answer is a conversation with Ernest.
 */

export const BEON_ANCHOR = "beon";

const BeOnTeaser = () => (
  <section id={BEON_ANCHOR} className="relative overflow-hidden bg-black text-white scroll-mt-20">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_100%,rgba(0,170,255,0.22),transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    </div>

    <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto w-56 h-56 sm:w-72 sm:h-72"
      >
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ring" />
        <span className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ring [animation-delay:1.3s]" />
        <span className="absolute inset-0 rounded-full border border-cyan-400/10 animate-ring [animation-delay:2.6s]" />
        <img
          src={beonMark}
          alt="BeOn Tech"
          width={720}
          height={720}
          loading="lazy"
          className="relative w-full h-full object-contain animate-breathe"
          style={{
            WebkitMaskImage: "radial-gradient(closest-side, #000 80%, transparent 100%)",
            maskImage: "radial-gradient(closest-side, #000 80%, transparent 100%)",
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
      >
        <p className="eyebrow text-cyan-300 mt-8 mb-5 justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
          Coming soon from Diyama Solutions
        </p>
        <h2 className="text-5xl sm:text-7xl font-display font-extrabold leading-none mb-5 bg-clip-text text-transparent bg-gradient-to-b from-white to-cyan-200">
          BeOn Tech
        </h2>
        <p className="text-white/60 text-lg sm:text-xl mb-9">Something is switching on.</p>
        <a
          href={whatsappLink("Hi Diyama, please put me on the early access list for BeOn Tech.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-cyan-400 text-black font-semibold px-7 py-3.5 transition-all duration-200 hover:bg-cyan-300 hover:-translate-y-0.5 shadow-[0_8px_40px_rgba(0,190,255,0.45)]"
        >
          Ask for early access <ArrowRight size={16} />
        </a>
      </motion.div>
    </div>
  </section>
);

export default BeOnTeaser;
