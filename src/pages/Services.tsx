import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { services, serviceCategories } from "@/data/services";
import servicesImg from "@/assets/services-strategy.jpg";
import PageTransition from "@/components/PageTransition";
import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const filtered = activeCategory === "All" ? services : services.filter((s) => s.category === activeCategory);

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
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">Our Services</h1>
              <p className="text-lg opacity-80">
                Practical, results-focused services designed to help your business grow. Whether you need marketing, strategy, creative, or tech, we're here to move with you.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-surface to-background">
        <div className="container-wide mx-auto">
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
                      <span className="text-2xl">{service.icon}</span>
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
                      <p className="text-xs text-primary mt-auto pt-2 font-medium">Click to expand →</p>
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
