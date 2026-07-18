import { motion, type Variants } from "framer-motion";
import {
  ExternalLink,
  Check,
  Sparkles,
  MessageCircle,
  ShoppingCart,
  GraduationCap,
  Clock,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { apps } from "@/data/apps";
import servicesImg from "@/assets/services-strategy.jpg";
import PageTransition from "@/components/PageTransition";
import AnimatedBg from "@/components/AnimatedBg";
import SitePreview from "@/components/SitePreview";
import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";

const ORIGIN = "https://www.diyama.online";

const appsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Diyama Business Apps",
  itemListElement: apps
    .filter((app) => app.url)
    .map((app, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: app.name,
        description: app.description,
        url: app.url!.startsWith("http") ? app.url! : `${ORIGIN}${app.url}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    })),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

const WHATSAPP = "https://wa.me/260966138238";

const statusLabel: Record<string, string> = {
  live: "Live, try it now",
  "demo-on-request": "Demo on request",
  "coming-soon": "Coming soon",
};

const appIcons: Record<string, LucideIcon> = {
  "diyama-pos": ShoppingCart,
  eclass: GraduationCap,
  "world-clock": Clock,
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const Apps = () => {
  return (
    <PageTransition>
      <Seo {...pageSeo["/apps"]} path="/apps" jsonLd={appsJsonLd} />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={servicesImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/50" />
        </div>
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute top-10 right-[12%] w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-orb-1" />
          <div className="absolute -bottom-10 left-[8%] w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-orb-2" />
        </div>
        <div className="relative z-10 section-padding">
          <div className="container-wide mx-auto text-primary-foreground">
            <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-2xl">
              <motion.p
                variants={fadeUp}
                className="text-accent font-semibold text-sm uppercase tracking-widest mb-5 flex items-center gap-2"
              >
                <span className="inline-block w-8 h-px bg-accent" />
                {greeting()}, welcome to our workshop
              </motion.p>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold mb-4">
                Our Apps
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg opacity-85">
                Business apps and systems built by Diyama. Whether you lead a global enterprise or a
                growing startup, try them free, then subscribe to unlock the full experience.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding relative overflow-hidden bg-gradient-to-b from-surface to-background">
        <AnimatedBg variant="subtle" />
        <div className="container-wide mx-auto relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14"
          >
            {apps.map((app) => {
              const Icon = appIcons[app.id] ?? Boxes;
              return (
                <motion.div key={app.id} variants={fadeIn} className="h-full">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                    className="h-full"
                  >
                    <div className="card-elevated p-6 h-full flex flex-col group">
                      <SitePreview image={app.image} domain={app.domain} alt={`${app.name} screenshot`} />
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          whileHover={{ scale: 1.12, rotate: 6 }}
                          transition={{ type: "spring", stiffness: 350, damping: 15 }}
                          className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center"
                        >
                          <Icon size={22} className="text-primary" />
                        </motion.div>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ml-2 inline-flex items-center gap-1.5 ${
                            app.status === "live" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {app.status === "live" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          )}
                          {statusLabel[app.status]}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-lg mb-1">{app.name}</h3>
                      <p className="text-sm text-primary/80 font-medium mb-3">{app.tagline}</p>
                      <p className="text-sm text-muted-foreground mb-4">{app.description}</p>

                      <div className="space-y-2.5 mb-4">
                        <div className="flex items-start gap-2">
                          <Check size={15} className="text-primary mt-0.5 shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">Free: </span>
                            {app.freeOffer}
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Sparkles size={15} className="text-accent mt-0.5 shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">Full version: </span>
                            {app.fullOffer}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {app.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-surface px-2 py-0.5 rounded-full text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto flex flex-wrap gap-2">
                        {app.url ? (
                          <motion.a
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-sm inline-flex items-center gap-1.5"
                          >
                            Try it free <ExternalLink size={13} />
                          </motion.a>
                        ) : (
                          <motion.a
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            href={`${WHATSAPP}?text=${encodeURIComponent(`Hi Diyama, I would like a free demo of ${app.name}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-sm inline-flex items-center gap-1.5"
                          >
                            Request demo <MessageCircle size={13} />
                          </motion.a>
                        )}
                        <motion.a
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          href={`${WHATSAPP}?text=${encodeURIComponent(`Hi Diyama, I am interested in subscribing to ${app.name} for my business.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline-primary text-sm"
                        >
                          Subscribe
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="card-elevated p-8 text-center max-w-2xl mx-auto"
            >
              <motion.div
                className="animate-float inline-block mb-3"
                aria-hidden="true"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center mx-auto">
                  <Boxes className="text-accent" size={22} />
                </div>
              </motion.div>
              <h2 className="font-display font-semibold text-xl mb-2">Need a custom app or system?</h2>
              <p className="text-sm text-muted-foreground mb-5">
                We build POS systems, booking tools, learning platforms, and custom business software.
                Tell us what your business needs and we will build it.
              </p>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href={`${WHATSAPP}?text=${encodeURIComponent("Hi Diyama, I would like to talk about building a custom app for my business.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent text-sm inline-flex items-center gap-1.5"
              >
                Talk to us <MessageCircle size={14} />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Apps;
