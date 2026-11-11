import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, Zap, Wrench, Scale, MapPin } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import CountUp from "@/components/CountUp";
import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";
import { proofStats, proofAsAt } from "@/data/proof";
import { peoplePhotos, peopleCaption } from "@/data/people";

/* About, rebuilt 11 November 2026. Ernest's verdict on the old page was that it
 * looked like an old man made it. This one is built like the homepage: dark,
 * moving and specific.
 *
 * Every dated fact in the timeline is on record: registration in 2023 (PACRA and
 * ZRA), the publishing engine live since 23 August 2026, the pivot of 5 November
 * 2026. Do not add a year or a claim here that the company files cannot back.
 * There is no photograph of a person on this page until a real one is supplied.
 */

const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const inView = { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-70px" } } as const;

const principles = [
  { icon: Eye, title: "Clarity", body: "Prices in the open. A written quote before any work. You always know what is being built and what it costs.", glow: "from-emerald-400/30" },
  { icon: Zap, title: "Speed", body: "Live in days, not months. A business new to us sees its own system working before it pays.", glow: "from-amber-400/30" },
  { icon: Wrench, title: "Ownership", body: "We run what we build. Security, backups and uptime stay our job long after launch day.", glow: "from-sky-400/30" },
  { icon: Scale, title: "Straight talk", body: "We promise what we deliver. We do not promise results nobody can control.", glow: "from-violet-400/30" },
];

const timeline = [
  { when: "2023", title: "Diyama Solutions Ltd is registered", body: "A Zambian private company, registered with PACRA and ZRA." },
  { when: "August 2026", title: "Our own engine goes live", body: "Software we wrote starts planning, drawing and publishing for every page we run. A comment desk follows within days." },
  { when: "November 2026", title: "Systems come first", body: "We sharpen our focus on business systems, automation and software, for clients in Zambia and abroad." },
  { when: "Next", title: "BeOn Tech", body: "Coming soon." },
];

const About = () => (
  <PageTransition>
    <Seo {...pageSeo["/about"]} path="/about" />

    {/* Hero */}
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="aurora animate-aurora-1 -top-48 -left-20 w-[40rem] h-[40rem] bg-[hsl(173_80%_32%/0.6)]" />
        <div className="aurora animate-aurora-2 top-[10%] right-[-10rem] w-[36rem] h-[36rem] bg-[hsl(41_95%_55%/0.24)]" />
        <div className="aurora animate-aurora-1 -bottom-56 left-[35%] w-[36rem] h-[36rem] bg-[hsl(205_95%_55%/0.24)]" />
      </div>
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 sm:pb-20">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="container-wide mx-auto">
          <motion.p variants={fadeUp} className="eyebrow text-accent mb-6">
            <span className="inline-block w-8 h-px bg-accent" /> About Diyama Solutions
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold leading-[1.03] max-w-5xl">
            A small team. <span className="text-gold-gradient">A very large machine.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-white/70 leading-relaxed mt-7 max-w-2xl">
            Diyama Solutions builds the software that lets a business do more with the people it
            already has. We know it works because we run our own company on it every day.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-8 inline-flex items-center gap-2 text-sm text-white/55">
            <MapPin size={15} className="text-accent" /> Lusaka and Livingstone, Zambia
          </motion.p>
        </motion.div>
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 py-9">
          <motion.dl variants={stagger} {...inView} className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-7">
            {proofStats.map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <CountUp value={s.value} className="block font-display text-4xl sm:text-5xl font-extrabold text-gold-gradient" />
                  <span className="block text-sm text-white/55 mt-1.5 leading-snug max-w-[15rem]">{s.label}</span>
                </dd>
              </motion.div>
            ))}
          </motion.dl>
          <p className="text-[11px] text-white/35 mt-6">Counted from our own records, {proofAsAt}.</p>
        </div>
      </div>
    </section>

    {/* What we believe */}
    <section className="section-padding bg-background">
      <div className="container-wide mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
        <motion.div variants={stagger} {...inView} className="lg:sticky lg:top-28">
          <motion.p variants={fadeUp} className="eyebrow text-primary mb-4">Why we exist</motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl font-display font-bold leading-[1.08] mb-6">
            Good businesses stall on admin, not on talent.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg leading-relaxed mb-5">
            The booking written on paper. The quote typed out again for every customer. The message
            nobody answered because everyone was busy. That is where growth goes to die.
          </motion.p>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg leading-relaxed">
            We take that work off people and hand it to software, built here, for how business is
            really done here: on a phone, on WhatsApp and often on a weak signal.
          </motion.p>
        </motion.div>

        <motion.div variants={stagger} {...inView} className="grid sm:grid-cols-2 gap-5">
          {principles.map((p) => (
            <motion.div key={p.title} variants={fadeUp} className="card-glow p-7 overflow-hidden">
              <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${p.glow} to-transparent blur-2xl pointer-events-none`} />
              <span className="relative w-12 h-12 rounded-xl bg-ink text-accent flex items-center justify-center mb-5 shadow-lg">
                <p.icon size={22} />
              </span>
              <h3 className="relative font-display text-xl font-bold mb-2">{p.title}</h3>
              <p className="relative text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* The faces from Diyama's own service graphics, never captioned as staff */}
    <section className="section-padding bg-surface border-y overflow-hidden">
      <div className="container-wide mx-auto">
        <motion.div variants={stagger} {...inView}>
          <motion.div variants={fadeUp} className="max-w-2xl mb-10">
            <p className="eyebrow text-primary mb-4">The look we are known for</p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold leading-[1.08] mb-5">
              The graphics that built our name.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Before the systems there were the posts. These are the faces from Diyama's own
              service graphics, the designs our page is known for across Zambia.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {peoplePhotos.map((ph, i) => (
              <motion.figure
                key={ph.src}
                variants={fadeUp}
                className={`group relative overflow-hidden rounded-2xl bg-ink ring-1 ring-foreground/10 ${i % 5 === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
              >
                <img src={ph.src} alt={ph.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80" />
              </motion.figure>
            ))}
          </div>
          <motion.p variants={fadeUp} className="text-xs text-muted-foreground mt-4">{peopleCaption}</motion.p>
        </motion.div>
      </div>
    </section>

    {/* Timeline */}
    <section className="relative overflow-hidden bg-ink text-white section-padding">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="aurora animate-aurora-2 -top-32 right-[8%] w-[32rem] h-[32rem] bg-[hsl(173_80%_32%/0.45)]" />
      </div>
      <div className="container-narrow mx-auto relative z-10">
        <motion.div variants={stagger} {...inView}>
          <motion.p variants={fadeUp} className="eyebrow text-accent mb-4">The story so far</motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl font-display font-bold leading-tight mb-14">
            Built in Zambia. Built to scale.
          </motion.h2>
          <div className="relative">
            <div className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-accent via-[hsl(173_70%_45%)] to-cyan-400" />
            <div className="space-y-10">
              {timeline.map((t, i) => (
                <motion.div key={t.title} variants={fadeUp} className="relative pl-10 sm:pl-14">
                  <span
                    className={`absolute left-0 top-1.5 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full border-2 ${
                      i === timeline.length - 1 ? "border-cyan-300 bg-cyan-400/30 animate-pulse" : "border-accent bg-ink"
                    }`}
                  />
                  <p className={`text-sm font-semibold uppercase tracking-widest ${i === timeline.length - 1 ? "text-cyan-300" : "text-accent"}`}>
                    {t.when}
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold mt-1.5 mb-2">{t.title}</h3>
                  <p className="text-white/60 leading-relaxed max-w-xl">{t.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding bg-background">
      <motion.div
        variants={fadeUp}
        {...inView}
        className="container-wide mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[hsl(173_70%_16%)] to-ink text-white px-7 py-14 sm:px-14 sm:py-20"
      >
        <div className="aurora animate-aurora-1 -top-24 -right-16 w-[26rem] h-[26rem] bg-[hsl(41_95%_55%/0.3)]" />
        <div className="relative max-w-2xl">
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold leading-tight mb-5">
            Bring us the part of your business that eats your day.
          </h2>
          <p className="text-white/70 text-lg mb-9">
            One conversation. We will tell you plainly what a system could take off your hands and
            what it would cost.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/consultations" className="btn-accent inline-flex items-center gap-2 font-semibold">
              Book a consultation <ArrowRight size={16} />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium border border-white/25 text-white hover:bg-white/10 transition-colors duration-200"
            >
              See what we build
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  </PageTransition>
);

export default About;
