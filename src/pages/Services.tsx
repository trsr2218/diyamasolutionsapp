import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Check, TrendingUp, Smartphone, Rocket, Target, Gem, Code2, PenLine, Clapperboard,
  Magnet, Lightbulb, Mountain, UtensilsCrossed, MapPin, Mic, Link2, Users, Globe, Sprout,
  Handshake, Hotel, Briefcase, type LucideIcon,
} from "lucide-react";
import { systems } from "@/data/systems";
import SystemArt from "@/components/SystemArt";
import { services, serviceCategories } from "@/data/services";

// Home page quick actions deep-link here with ?intent=... so a visitor lands on
// the services that match what they picked, instead of the full generic list.
const intents: Record<string, { heading: string; blurb: string; serviceIds: string[] }> = {
  "get-customers": {
    heading: "Get more customers",
    blurb: "Services that fill your pipeline and turn attention into paying customers.",
    serviceIds: ["customer-acquisition", "lead-generation", "digital-marketing", "restaurant-growth", "google-maps-reviews"],
  },
  "build-brand": {
    heading: "Build my brand",
    blurb: "Everything that makes your business look sharp and unmistakably yours.",
    serviceIds: ["branding", "content-creation", "short-form-video", "social-media"],
  },
  "grow-visibility": {
    heading: "Grow online visibility",
    blurb: "Get found by the right people across search, maps and social.",
    serviceIds: ["digital-marketing", "social-media", "google-maps-reviews", "web-development", "lodge-hospitality"],
  },
};
import servicesImg from "@/assets/backdrop-c.svg";

/* Line icons keyed by service id. The emoji in the data file are no longer drawn. */
const serviceIcons: Record<string, LucideIcon> = {
  "digital-marketing": TrendingUp,
  "social-media": Smartphone,
  "growth-strategy": Rocket,
  "customer-acquisition": Target,
  branding: Gem,
  "web-development": Code2,
  "content-creation": PenLine,
  "short-form-video": Clapperboard,
  "lead-generation": Magnet,
  "business-consulting": Lightbulb,
  "tourism-consulting": Mountain,
  "restaurant-growth": UtensilsCrossed,
  "google-maps-reviews": MapPin,
  "creator-support": Mic,
  "web3-support": Link2,
  "community-management": Users,
  "remote-work": Globe,
  "startup-support": Sprout,
  "partnership-strategy": Handshake,
  "lodge-hospitality": Hotel,
};
import PageTransition from "@/components/PageTransition";
import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Services = () => {
  const [searchParams] = useSearchParams();
  const intentKey = searchParams.get("intent") || "";
  const activeIntent = intents[intentKey] || null;

  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [intentDismissed, setIntentDismissed] = useState(false);

  // The intent view holds until the visitor picks a category pill or chooses to
  // browse everything, at which point they see the full services list.
  const useIntent = !!activeIntent && activeCategory === "All" && !intentDismissed;

  const filtered = useIntent
    ? (activeIntent.serviceIds
        .map((id) => services.find((s) => s.id === id))
        .filter(Boolean) as typeof services)
    : activeCategory === "All"
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <PageTransition>
      <Seo {...pageSeo["/services"]} path="/services" />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={servicesImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/50" />
        </div>
        <div className="relative z-10 section-padding">
          <div className="container-wide mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl text-primary-foreground">
              <p className="eyebrow text-accent mb-5">What we do</p>
              <h1 className="text-4xl sm:text-5xl font-display font-extrabold mb-4">Everything your business needs, built and looked after.</h1>
              <p className="text-lg opacity-80">
                Business systems and automation. Social media, websites, design, campaigns and consulting. One team in Zambia, every price in the open.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Systems and automation */}
      <section className="section-padding bg-background border-b">
        <div className="container-wide mx-auto">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow text-primary mb-4">Systems and automation</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold leading-tight">Software that takes the repetitive work off your team.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {systems.map((sys) => (
              <motion.article key={sys.id} id={sys.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card-glow flex flex-col scroll-mt-24">
                <SystemArt id={sys.id} />
                <div className="p-7 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <span className="w-12 h-12 -mt-14 rounded-xl bg-gradient-to-br from-primary to-[hsl(173_70%_32%)] text-primary-foreground flex items-center justify-center shrink-0 ring-4 ring-card shadow-lg relative z-10">
                    <sys.icon size={22} />
                  </span>
                  <span className="text-xs font-semibold text-foreground bg-accent/15 border border-accent/30 rounded-full px-3 py-1 text-right leading-snug">{sys.price}</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-1.5">{sys.name}</h3>
                <p className="text-primary font-medium mb-3">{sys.line}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{sys.description}</p>
                <ul className="space-y-2 mb-6">
                  {sys.includes.map((i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <Check size={16} className="text-accent shrink-0 mt-0.5" /> <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-auto pt-4 border-t">
                  <span className="font-semibold text-foreground">For:</span> {sys.whoFor}
                </p>
                </div>
              </motion.article>
            ))}
          </div>
          <Link to="/consultations" className="btn-primary inline-flex items-center gap-2 mt-8">
            Talk to us about a system <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-surface to-background">
        <div className="container-wide mx-auto">
          <div className="max-w-2xl mb-8">
            <p className="eyebrow text-primary mb-4">Growth, creative and web</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold leading-tight">Marketing, design and web, done properly.</h2>
          </div>
          {/* Intent banner: shown when arriving from a home page quick action */}
          {useIntent && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-2xl border border-primary/15 bg-primary/5 p-6 sm:p-7"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Recommended for you</p>
              <h2 className="font-display text-2xl font-bold">{activeIntent!.heading}</h2>
              <p className="text-muted-foreground text-sm mt-2 max-w-2xl">{activeIntent!.blurb}</p>
              <button
                onClick={() => setIntentDismissed(true)}
                className="mt-4 text-sm text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Or browse all services <ArrowRight size={14} />
              </button>
            </motion.div>
          )}

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {["All", ...serviceCategories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Service Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((service) => (
              <motion.div
                key={service.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div
                    className={`card-elevated p-6 h-full flex flex-col cursor-pointer transition-all ${
                      expandedService === service.id ? "ring-2 ring-primary/30 shadow-lg" : ""
                    }`}
                    onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      {(() => {
                        const Icon = serviceIcons[service.id] ?? Briefcase;
                        return (
                          <span className="w-10 h-10 rounded-lg bg-primary/8 text-primary flex items-center justify-center">
                            <Icon size={20} />
                          </span>
                        );
                      })()}
                      <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                        {service.category}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

                    {expandedService === service.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t pt-4 mt-auto space-y-3"
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Who it's for</p>
                          <p className="text-sm text-muted-foreground">{service.whoFor}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Likely outcomes</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {service.outcomes.map((o) => (
                              <li key={o} className="flex items-start gap-2">
                                <span className="text-accent mt-0.5">•</span> {o}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">First engagement</p>
                          <p className="text-sm text-muted-foreground">{service.firstEngagement}</p>
                        </div>
                        <Link
                          to="/consultations"
                          className="btn-primary text-sm inline-flex items-center gap-2 mt-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Book consultation <ArrowRight size={14} />
                        </Link>
                      </motion.div>
                    )}

                    {expandedService !== service.id && (
                      <p className="text-xs text-primary mt-auto pt-2 font-medium inline-flex items-center gap-1">More detail <ArrowRight size={12} /></p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container-narrow mx-auto relative z-10">
          <h2 className="text-3xl font-display font-bold mb-4">Not sure which service fits?</h2>
          <p className="opacity-80 mb-8 max-w-lg mx-auto">
            Try our Business Fit Generator: it'll recommend the right services for your situation in under a minute.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/business-fit" className="btn-accent inline-flex items-center gap-2">
              Try Business Fit Generator <ArrowRight size={16} />
            </Link>
            <Link to="/consultations" className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-6 py-3 rounded-lg font-medium transition-all inline-flex items-center gap-2">
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Services;
