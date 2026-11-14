import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Check, MessageSquare, Sparkles, Send, MessagesSquare,
  LayoutDashboard, PenTool, Megaphone, MapPin, Globe, ShieldCheck, type LucideIcon,
} from "lucide-react";
import { clients } from "@/data/clients";
import { apps } from "@/data/apps";
import { systems } from "@/data/systems";
import { priceCards } from "@/data/pricing";
import { proofStats, proofAsAt } from "@/data/proof";
import PageTransition from "@/components/PageTransition";
import HeroChat from "@/components/HeroChat";
import LiveClock from "@/components/LiveClock";
import RotatingWord from "@/components/RotatingWord";
import CursorGlow from "@/components/CursorGlow";
import ScrollStory from "@/components/ScrollStory";
import SystemArt from "@/components/SystemArt";
import CountUp from "@/components/CountUp";
import BeOnTeaser from "@/components/BeOnTeaser";
import AppOfTheDay from "@/components/AppOfTheDay";
import DiyamaAvatar from "@/components/DiyamaAvatar";
import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";
import { heroPerson } from "@/data/people";
import BoardStrip from "@/components/BoardStrip";
import BuilderShowcase from "@/components/BuilderShowcase";

/* Homepage, rebuilt November 2026 around the pivot to systems and automation.
 *
 * Three rules it is built on:
 *   1. The people on the page are the faces from Diyama's own service graphics
 *      (see `data/people.ts`), Ernest's choice on 11 November 2026, never captioned
 *      as staff or clients. Other visuals are drawn product panels and real
 *      screenshots of real apps.
 *   2. No number typed by hand. Prices come from the generated pricing file and
 *      proof figures from `data/proof.ts`, which records where each came from.
 *   3. Promise delivery, never an outcome. No bookings, revenue or hours saved.
 */

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const inView = { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-70px" } } as const;

/* The marketing, design and web work, shown with the same weight as the systems.
 * Ernest, 11 November 2026: most people met Diyama through this work, so it is
 * never "everything else". Prices are looked up by card id. */
const alsoIcons: Record<string, LucideIcon> = {
  social: Send,
  web: Globe,
  care: ShieldCheck,
  found: MapPin,
  design: PenTool,
  campaign: Megaphone,
};
const alsoDo = priceCards.filter((c) => c.id in alsoIcons);

const ownSystems = [
  {
    icon: Send,
    title: "The publishing engine",
    body: "Plans, draws and publishes every post for twelve pages across Facebook, Instagram and X. Nothing goes out until it has passed its checks twice.",
  },
  {
    icon: MessagesSquare,
    title: "The comment desk",
    body: "Reads new comments every hour and answers from an approved answer book. Anything it does not know goes to a person, never a guess.",
  },
  {
    icon: LayoutDashboard,
    title: "Diyama OS",
    body: "Our own operations app. The day's work, the client commitments and the records, on a phone, so nothing depends on memory.",
  },
];

const Index = () => {
  const topApps = apps.filter((a) => a.featured).slice(0, 4);

  return (
    <PageTransition>
      <Seo {...pageSeo["/"]} path="/" />

      {/* Hero: a real room, a real conversation handled end to end. */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0">
          <img
            src={heroPerson}
            alt=""
            className="w-full h-full object-cover object-[72%_25%] opacity-[0.68] animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/70" />
        </div>
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="aurora animate-aurora-1 -top-40 left-[8%] w-[40rem] h-[40rem] bg-[hsl(173_80%_32%/0.45)]" />
          <div className="aurora animate-aurora-2 top-[30%] -right-32 w-[34rem] h-[34rem] bg-[hsl(41_95%_55%/0.18)]" />
        </div>
        <CursorGlow />
        <div className="grain absolute inset-0 pointer-events-none" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 lg:pt-24 pb-14 sm:pb-16">
          <div className="container-wide mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-10 items-center">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={fadeUp} className="mb-7">
                <LiveClock className="rounded-full border border-white/15 bg-white/5 backdrop-blur px-3 py-1.5 text-white/60" />
              </motion.div>
              <motion.p variants={fadeUp} className="eyebrow text-accent mb-5">
                <span className="inline-block w-8 h-px bg-accent" />
                Business systems, automation and software, Zambia
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-display font-extrabold leading-[0.98] tracking-[-0.03em] mb-7"
              >
                We build the systems that run your{" "}
                <RotatingWord words={["bookings.", "replies.", "invoices.", "posting.", "business."]} />
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg sm:text-xl text-white/70 leading-relaxed mb-9 max-w-xl">
                Software for your bookings, quotes, invoices, customer replies and daily posting.
                Plus the social media, websites and design that get a business noticed. Built in
                Zambia, live in days, kept running by the people who built it.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 sm:gap-4">
                <Link to="/consultations" className="btn-accent group inline-flex items-center gap-2 font-semibold">
                  Book a consultation <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/services"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium border border-white/20 text-white hover:bg-white/10 hover:border-white/35 transition-colors duration-200"
                >
                  See what we do <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.ul variants={fadeUp} className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
                {["Prices in the open", "Written quote before any work", "Local team, answers the phone"].map((t) => (
                  <li key={t} className="inline-flex items-center gap-2">
                    <Check size={14} className="text-accent" /> {t}
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              <HeroChat />
              <div className="hidden sm:flex glass absolute -left-2 lg:-left-8 top-6 items-center gap-2.5 rounded-xl px-3.5 py-2.5 shadow-2xl shadow-black/40 animate-float">
                <span className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                  <Check size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-xs font-semibold text-white">Booked direct</span>
                  <span className="block text-[11px] text-white/55">No one retyped it</span>
                </span>
              </div>
              <div className="hidden sm:flex glass absolute -right-2 lg:-right-6 bottom-10 items-center gap-2.5 rounded-xl px-3.5 py-2.5 shadow-2xl shadow-black/40 animate-float [animation-delay:2.5s]">
                <span className="w-8 h-8 rounded-lg bg-accent/25 text-accent flex items-center justify-center">
                  <ShieldCheck size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-xs font-semibold text-white">Backed up tonight</span>
                  <span className="block text-[11px] text-white/55">Checked and online</span>
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Proof strip, our own systems, our own records */}
        <div className="relative z-10 border-t border-white/10">
          <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.dl variants={stagger} {...inView} className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7">
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

      {/* What we build */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <motion.div variants={stagger} {...inView}>
            <motion.div variants={fadeUp} className="max-w-2xl mb-12">
              <p className="eyebrow text-primary mb-4">What we do</p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-bold leading-tight mb-4">
                Everything a business needs to run and grow.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Business systems and automation. Social media, websites, design and campaigns.
                One team, every price in the open, a written quote before any work starts.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5">
              {systems.map((s) => (
                <motion.article key={s.id} variants={fadeUp} className="card-glow flex flex-col">
                  <SystemArt id={s.id} />
                  <div className="p-7 sm:p-8 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <span className="w-12 h-12 -mt-14 rounded-xl bg-gradient-to-br from-primary to-[hsl(173_70%_32%)] text-primary-foreground flex items-center justify-center shrink-0 ring-4 ring-card shadow-lg relative z-10">
                      <s.icon size={22} />
                    </span>
                    <span className="text-xs font-semibold text-foreground bg-accent/15 border border-accent/30 rounded-full px-3 py-1 text-right leading-snug">
                      {s.price}
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold mb-1.5">{s.name}</h3>
                  <p className="text-primary font-medium mb-3">{s.line}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">{s.description}</p>
                  <ul className="space-y-2 mb-6">
                    {s.includes.map((i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <Check size={16} className="text-accent shrink-0 mt-0.5" />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-auto pt-4 border-t">
                    <span className="font-semibold text-foreground">For:</span> {s.whoFor}
                  </p>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              {alsoDo.map((c) => {
                const Icon = alsoIcons[c.id];
                return (
                  <motion.article key={c.id} variants={fadeUp} className="card-glow p-7 flex flex-col overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-primary/15 to-transparent blur-2xl pointer-events-none" />
                    <div className="relative flex items-start justify-between gap-4 mb-5">
                      <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[hsl(173_70%_32%)] text-primary-foreground flex items-center justify-center shrink-0 shadow-lg">
                        <Icon size={22} />
                      </span>
                      <span className="text-xs font-semibold text-foreground bg-accent/15 border border-accent/30 rounded-full px-3 py-1 text-right leading-snug">
                        from {c.from} {c.unit}
                      </span>
                    </div>
                    <h3 className="relative font-display text-xl font-bold mb-2">{c.title}</h3>
                    <p className="relative text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">{c.blurb}</p>
                    <Link to="/services" className="relative inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline mt-auto">
                      See the service <ArrowRight size={14} />
                    </Link>
                  </motion.article>
                );
              })}
            </div>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link to="/consultations" className="btn-primary inline-flex items-center gap-2">
                Talk to us about your business <ArrowRight size={16} />
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline">
                Full price guide <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Fresh from the Diyama page: this week's boards, drawn by the graphics office. */}
      <BoardStrip />

      {/* How we work, as a scroll story */}
      <ScrollStory />

      {/* We run on our own systems */}
      <section className="relative overflow-hidden bg-ink text-white section-padding">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="aurora animate-aurora-2 -top-32 right-[10%] w-[32rem] h-[32rem] bg-[hsl(173_80%_32%/0.45)]" />
          <div className="aurora animate-aurora-1 -bottom-40 left-[5%] w-[30rem] h-[30rem] bg-[hsl(41_95%_55%/0.16)]" />
        </div>
        <div className="container-wide mx-auto relative z-10">
          <motion.div variants={stagger} {...inView}>
            <motion.div variants={fadeUp} className="max-w-2xl mb-12">
              <p className="eyebrow text-accent mb-4">Proof, not promises</p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-bold leading-tight mb-4">
                We run our own company on the systems we sell.
              </h2>
              <p className="text-white/65 text-lg leading-relaxed">
                Diyama is a small team doing the work of a much larger one, because software
                carries the routine. These three run every day.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-5">
              {ownSystems.map((o) => (
                <motion.div key={o.title} variants={fadeUp} whileHover={{ y: -6 }} className="glass rounded-xl p-7 transition-colors duration-300 hover:border-accent/40">
                  <span className="w-11 h-11 rounded-lg bg-accent/15 text-accent border border-accent/25 flex items-center justify-center mb-5">
                    <o.icon size={20} />
                  </span>
                  <h3 className="font-display text-xl font-bold mb-2.5">{o.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{o.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Apps, real screenshots of real products */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <motion.div variants={stagger} {...inView}>
            <div className="flex items-end justify-between gap-6 mb-10">
              <motion.div variants={fadeUp} className="max-w-2xl">
                <p className="eyebrow text-primary mb-4">Try our software now</p>
                <h2 className="text-3xl sm:text-4xl font-display font-bold leading-tight">
                  Free business apps, built by Diyama.
                </h2>
                <p className="text-muted-foreground mt-3">
                  Invoices, quotes, bookings, payslips and more. Open one and use it, no signup.
                </p>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link to="/apps" className="hidden sm:inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline whitespace-nowrap">
                  All apps <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
            <AppOfTheDay />
            <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {topApps.map((app) => (
                <motion.div key={app.id} variants={fadeUp}>
                  <Link to="/apps" className="card-elevated block h-full overflow-hidden group">
                    <div className="relative h-28 sm:h-36 overflow-hidden bg-muted">
                      <img
                        src={app.image}
                        alt={app.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-sm sm:text-base font-semibold leading-tight">{app.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{app.tagline}</p>
                      <span className="mt-3 text-primary text-xs font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Open it <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <Link to="/apps" className="sm:hidden mt-6 btn-outline-primary inline-flex items-center gap-1 text-sm">
              All apps <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* BeOn Tech, coming soon */}
      <BeOnTeaser />

      {/* The builder, launched: it runs on the page rather than being described */}
      <BuilderShowcase />

      {/* The free tools */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <motion.div variants={stagger} {...inView} className="grid md:grid-cols-2 gap-5">
            <motion.div variants={fadeUp} className="card-elevated p-7 sm:p-9 flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <DiyamaAvatar size={52} mood="idle" />
                <span className="text-xs font-semibold bg-primary/8 text-primary border border-primary/15 rounded-full px-3 py-1">
                  Free, no signup
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-2.5">Ask Diyama AI</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                A practical AI business advisor. Ask about pricing, marketing, operations or what
                to fix first and get a straight answer.
              </p>
              <Link to="/ai" className="btn-primary inline-flex items-center gap-2 self-start">
                <MessageSquare size={17} /> Start a conversation
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-xl bg-primary text-primary-foreground p-7 sm:p-9 flex flex-col relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
              <div className="relative flex items-center gap-4 mb-5">
                <span className="w-[52px] h-[52px] rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                  <Sparkles size={24} className="text-accent" />
                </span>
                <span className="text-xs font-semibold bg-accent/15 text-accent border border-accent/30 rounded-full px-3 py-1">
                  Free, in under a minute
                </span>
              </div>
              <h3 className="relative font-display text-2xl font-bold mb-2.5">Find your Business Fit</h3>
              <p className="relative text-white/75 leading-relaxed mb-6 flex-grow">
                Answer a few questions and get a personal kit: what to prioritise, quick wins for
                this week and the services that fit where you are.
              </p>
              <Link to="/business-fit" className="relative btn-accent inline-flex items-center gap-2 self-start font-semibold">
                Build my free Business Kit <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Who we work with */}
      <section className="py-14 sm:py-16 bg-surface border-y overflow-hidden">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="eyebrow text-primary mb-3">Who we work with</p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold">
                Food brands, radio, artists, designers, transport, offices and DAOs.
              </h2>
            </div>
            <Link to="/clients" className="inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline whitespace-nowrap">
              See our clients <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
          <div className="flex gap-3 w-max animate-marquee">
            {[...clients, ...clients].map((c, i) => (
              <div key={`${c.id}-${i}`} className="bg-card border rounded-lg px-6 py-4 shrink-0">
                <p className="font-display font-semibold text-sm whitespace-nowrap">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">{c.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-ink text-white section-padding">
        <div className="absolute inset-0 bg-grid opacity-70" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[22rem] rounded-full bg-primary/30 blur-[120px]" />
        </div>
        <div className="container-narrow mx-auto text-center relative z-10">
          <motion.div variants={stagger} {...inView}>
            <motion.p variants={fadeUp} className="eyebrow text-accent mb-5 justify-center">Clarity in Action.</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl font-display font-extrabold leading-tight mb-5">
              Tell us what slows your business down.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/65 text-lg mb-9 max-w-xl mx-auto">
              You do not need a brief. Tell us how the work gets done today and we will show you
              what a system would take off your hands.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Link to="/consultations" className="btn-accent inline-flex items-center gap-2 font-semibold">
                Book a consultation <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium border border-white/20 text-white hover:bg-white/10 transition-colors duration-200"
              >
                Contact us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Index;
