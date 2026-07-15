import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, Users, BookOpen, MessageSquare, TrendingUp, Lightbulb } from "lucide-react";
import { services } from "@/data/services";
import { clients } from "@/data/clients";
import heroImg from "@/assets/hero-consultant.jpg";
import PageTransition from "@/components/PageTransition";
import AnimatedBg from "@/components/AnimatedBg";

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

const Index = () => {
  const featuredClients = clients.filter((c) => c.featured);
  const previewServices = services.slice(0, 6);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <PageTransition>
      {/* Hero — parallax */}
      <section ref={heroRef} className="relative overflow-hidden min-h-[90vh] flex items-center">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          <img src={heroImg} alt="" className="w-full h-full object-cover scale-110" />
          {/* Strong uniform dark overlay so all text is always readable */}
          <div className="absolute inset-0 bg-foreground/80" />
          {/* Subtle directional fade for visual depth — doesn't compromise contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/15 via-transparent to-foreground/5" />
        </motion.div>

        {/* Subtle floating orbs — kept well below text contrast threshold */}
        <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-[15%] w-64 h-64 rounded-full bg-accent/8 blur-3xl animate-orb-1" />
          <div className="absolute bottom-10 left-[10%] w-80 h-80 rounded-full bg-primary/8 blur-3xl animate-orb-2" />
        </div>

        <motion.div className="relative z-10 section-padding w-full" style={{ opacity: heroOpacity }}>
          <div className="container-wide mx-auto">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="max-w-3xl text-primary-foreground"
            >
              <motion.p
                variants={fadeUp}
                className="text-accent font-semibold text-sm uppercase tracking-widest mb-5 flex items-center gap-2"
              >
                <span className="inline-block w-8 h-px bg-accent" />
                Welcome to Diyama Solutions
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.05] mb-6"
              >
                Bring the challenge.{" "}
                <span className="text-accent italic">We'll help you move.</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-lg sm:text-xl text-white/90 leading-relaxed mb-10 max-w-2xl"
              >
                Whether you're building, fixing, growing, or figuring things out, you're welcome here.
                We help turn business confusion into clarity and traction.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link to="/ai" className="btn-accent inline-flex items-center gap-2">
                  <MessageSquare size={18} /> Talk to Diyama
                </Link>
                <Link
                  to="/consultations"
                  className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center gap-2"
                >
                  Book Consultation <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center pt-2"
          >
            <div className="w-1 h-2 rounded-full bg-primary-foreground/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive prompt */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-b from-surface to-background">
        <AnimatedBg variant="subtle" />
        <div className="container-narrow mx-auto text-center relative z-10">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-display font-bold mb-4">
              What are you trying to move right now?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Pick what resonates, and we'll point you in the right direction.
            </motion.p>
            <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {[
                { label: "Get more customers", icon: TrendingUp, path: "/services" },
                { label: "Build my brand", icon: Sparkles, path: "/services" },
                { label: "Launch something new", icon: Lightbulb, path: "/business-fit" },
                { label: "Grow online visibility", icon: Users, path: "/services" },
                { label: "Talk to an advisor", icon: MessageSquare, path: "/ai" },
                { label: "Learn something useful", icon: BookOpen, path: "/learn" },
              ].map((item) => (
                <motion.div key={item.label} variants={fadeIn}>
                  <Link
                    to={item.path}
                    className="card-elevated p-4 sm:p-5 flex flex-col items-center gap-3 text-center hover:border-primary/30 group block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 6 }}
                      transition={{ type: "spring", stiffness: 350, damping: 15 }}
                      className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors"
                    >
                      <item.icon size={20} className="text-primary group-hover:text-accent transition-colors" />
                    </motion.div>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="relative overflow-hidden bg-surface">
        <AnimatedBg variant="subtle" />
        <div className="relative z-10 section-padding">
          <div className="container-wide mx-auto">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <div className="flex items-end justify-between mb-10">
                <motion.div variants={fadeUp}>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold">What we help with</h2>
                  <p className="text-muted-foreground mt-2">Practical services that move your business forward.</p>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Link to="/services" className="hidden sm:inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline">
                    View all <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </div>
              <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {previewServices.map((s) => (
                  <motion.div key={s.id} variants={fadeIn}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 280, damping: 18 }}
                    >
                      <div className="card-elevated p-6 h-full flex flex-col">
                        <motion.span
                          className="text-2xl mb-3 inline-block"
                          whileHover={{ scale: 1.2, rotate: -5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {s.icon}
                        </motion.span>
                        <h3 className="font-display text-lg font-semibold mb-2">{s.title}</h3>
                        <p className="text-sm text-muted-foreground flex-1">{s.description}</p>
                        <Link to="/services" className="mt-4 text-primary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all hover:underline">
                          Learn more <ArrowRight size={12} />
                        </Link>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <Link to="/services" className="sm:hidden mt-6 btn-outline-primary inline-flex items-center gap-1 text-sm">
              View all services <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Client Trust Strip */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-b from-background to-surface">
        <AnimatedBg variant="accent" />
        <div className="container-wide mx-auto text-center relative z-10">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-display font-bold mb-3">
              Trusted by real businesses
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground mb-10 max-w-lg mx-auto">
              From food brands to DAOs, transport companies to music artists. We've helped businesses across industries.
            </motion.p>
            <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {featuredClients.map((c) => (
                <motion.div key={c.id} variants={fadeIn}>
                  <motion.div whileHover={{ scale: 1.05, y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                    <div className="card-elevated p-4 text-center">
                      <p className="font-semibold text-sm text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{c.category}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link to="/clients" className="mt-8 inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline">
                See all clients <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Business Fit Teaser */}
      <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
        <AnimatedBg variant="dark" />
        {/* Extra shimmer layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,hsl(var(--accent)/0.12),transparent_60%)]" />
        </div>
        <div className="container-narrow mx-auto text-center relative z-10">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <motion.div variants={fadeIn} className="animate-float inline-block mb-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto animate-pulse-glow">
                <Sparkles className="text-accent" size={28} />
              </div>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Discover your business fit
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg opacity-80 mb-8 max-w-xl mx-auto">
              Answer a few questions and our AI will generate personalized recommendations, quick wins, and a suggested service bundle, all in under a minute.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/business-fit" className="btn-accent inline-flex items-center gap-2">
                Try the Business Fit Generator <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Diyama AI Teaser */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-br from-background via-surface to-background">
        <AnimatedBg variant="subtle" />
        <div className="container-narrow mx-auto text-center relative z-10">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <motion.div variants={fadeIn} className="mb-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold bg-primary/8 text-primary border border-primary/15 rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Available 24/7, no signup needed
              </div>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Meet Diyama AI
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground mb-8 max-w-xl mx-auto">
              A warm, practical AI business advisor. Ask anything about marketing, growth, operations, or pricing.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/ai" className="btn-primary inline-flex items-center gap-2">
                <MessageSquare size={18} /> Start a conversation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Learn Preview */}
      <section className="section-padding relative overflow-hidden bg-surface">
        <AnimatedBg variant="subtle" />
        <div className="container-wide mx-auto relative z-10">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="flex items-end justify-between mb-10">
              <motion.div variants={fadeUp}>
                <h2 className="text-3xl sm:text-4xl font-display font-bold">Learn with Diyama</h2>
                <p className="text-muted-foreground mt-2">Free guides and insights to help your business grow.</p>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link to="/learn" className="hidden sm:inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline">
                  Browse all <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
            <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: "How to Get Your First 100 Customers", time: "7 min", cat: "Customer Growth", slug: "first-100-customers" },
                { title: "Google Maps Optimization Guide", time: "8 min", cat: "Local Marketing", slug: "google-maps-guide" },
                { title: "The Restaurant Growth Playbook", time: "6 min", cat: "Restaurant Growth", slug: "restaurant-growth-playbook" },
              ].map((a) => (
                <motion.div key={a.title} variants={fadeIn}>
                  <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 280 }}>
                    <Link to={`/learn/${a.slug}`} className="card-elevated p-6 block hover:border-primary/30">
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">{a.cat}</span>
                      <h3 className="font-display text-lg font-semibold mt-2 mb-2">{a.title}</h3>
                      <p className="text-xs text-muted-foreground">{a.time} read</p>
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Affiliate Teaser */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-b from-background to-surface">
        <AnimatedBg variant="accent" />
        <div className="container-narrow mx-auto relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col md:flex-row items-center gap-10"
          >
            <motion.div variants={fadeUp} className="flex-1">
              <h2 className="text-3xl font-display font-bold mb-4">Partner with Diyama</h2>
              <p className="text-muted-foreground mb-6">
                Know someone who needs help growing their business? Join our affiliate program and earn commission for every client you refer.
              </p>
              <Link to="/affiliate" className="btn-outline-primary inline-flex items-center gap-2 text-sm">
                Learn about the program <ArrowRight size={14} />
              </Link>
            </motion.div>
            <motion.div variants={fadeIn} className="flex-1">
              <motion.div
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="card-elevated p-8 text-center bg-gradient-to-br from-card to-surface">
                  <motion.p
                    className="text-5xl font-display font-bold"
                    animate={{ rotate: [0, 8, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  >
                    🤝
                  </motion.p>
                  <p className="font-semibold mt-4 text-lg">Refer. Earn. Grow together.</p>
                  <p className="text-sm text-muted-foreground mt-2">Simple, transparent, commission-based.</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-background to-surface" />
        <AnimatedBg variant="primary" />
        <div className="container-narrow mx-auto text-center relative z-10">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Ready to move forward?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground mb-8 max-w-lg mx-auto">
              You don't need to have everything figured out. Bring the challenge, we'll help you structure the next move.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Link to="/consultations" className="btn-primary inline-flex items-center gap-2">
                Book a Consultation <ArrowRight size={16} />
              </Link>
              <Link to="/ai" className="btn-outline-primary inline-flex items-center gap-2">
                Talk to Diyama AI
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Index;
