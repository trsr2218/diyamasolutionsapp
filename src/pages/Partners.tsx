import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ExternalLink, Megaphone, Handshake } from "lucide-react";
import { partners } from "@/data/partners";
import learnImg from "@/assets/learn-workspace.jpg";
import PageTransition from "@/components/PageTransition";
import AnimatedBg from "@/components/AnimatedBg";
import SitePreview from "@/components/SitePreview";
import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";

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

const Partners = () => {
  return (
    <PageTransition>
      <Seo {...pageSeo["/partners"]} path="/partners" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={learnImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/50" />
        </div>
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute top-16 right-[18%] w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-orb-2" />
          <div className="absolute -bottom-16 left-[12%] w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-orb-1" />
        </div>
        <div className="relative z-10 section-padding">
          <div className="container-wide mx-auto text-primary-foreground">
            <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-2xl">
              <motion.p
                variants={fadeUp}
                className="text-accent font-semibold text-sm uppercase tracking-widest mb-5 flex items-center gap-2"
              >
                <span className="inline-block w-8 h-px bg-accent" />
                Growing together
              </motion.p>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold mb-4">
                Brands We Promote
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg opacity-85">
                Companies that trust Diyama to advertise and market on their behalf. Explore them,
                support them, and see our work in action.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding relative overflow-hidden bg-gradient-to-b from-surface to-background">
        <AnimatedBg variant="accent" />
        <div className="container-wide mx-auto relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14"
          >
            {partners.map((partner) => (
              <motion.div key={partner.id} variants={fadeIn} className="h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  className="h-full"
                >
                  <div className="card-elevated p-6 h-full flex flex-col group">
                    {partner.image && (
                      <SitePreview image={partner.image} domain={partner.domain} alt={`${partner.name} website screenshot`} />
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display font-semibold text-lg">{partner.name}</h3>
                      <span className="text-xs font-medium px-2 py-1 rounded-full shrink-0 ml-2 bg-primary/10 text-primary">
                        Since {partner.since}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/70 uppercase tracking-wide mb-2">{partner.category}</p>
                    <p className="text-sm text-muted-foreground mb-4">{partner.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {partner.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-surface px-2 py-0.5 rounded-full text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto">
                      {partner.url && (
                        <motion.a
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          href={partner.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-sm inline-flex items-center gap-1.5"
                        >
                          Visit {partner.name} <ExternalLink size={13} />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}

            {/* Your brand here */}
            <motion.div variants={fadeIn} className="h-full">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                className="h-full"
              >
                <div className="h-full rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-colors p-6 flex flex-col items-center justify-center text-center min-h-[260px]">
                  <motion.div
                    animate={{ rotate: [0, 8, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  >
                    <Megaphone size={28} className="text-muted-foreground/50 mb-3" />
                  </motion.div>
                  <h3 className="font-display font-semibold text-lg mb-2">Your brand here</h3>
                  <p className="text-sm text-muted-foreground mb-5 max-w-xs">
                    More partner brands are joining soon. Want Diyama to advertise and grow your brand? Let us talk.
                  </p>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link to="/contact" className="btn-outline-primary text-sm">
                      Become a partner
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="card-elevated p-8 text-center max-w-2xl mx-auto"
            >
              <div className="animate-float inline-block mb-3" aria-hidden="true">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center mx-auto">
                  <Handshake className="text-accent" size={22} />
                </div>
              </div>
              <h2 className="font-display font-semibold text-xl mb-2">Want to earn by promoting brands with us?</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Join the Diyama affiliate program and earn commissions by connecting businesses to our
                services and partner brands.
              </p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="inline-block">
                <Link to="/affiliate" className="btn-accent text-sm">
                  Join the Affiliate Program
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Partners;
