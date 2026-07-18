import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Target, Lightbulb, Users } from "lucide-react";
import aboutImg from "@/assets/about-team.jpg";
import heroImg from "@/assets/hero-consultant.jpg";
import PageTransition from "@/components/PageTransition";
import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const About = () => {
  return (
    <PageTransition>
      <Seo {...pageSeo["/about"]} path="/about" />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={aboutImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative z-10 section-padding">
          <div className="container-narrow mx-auto text-primary-foreground">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">About Diyama Solutions</h1>
              <p className="text-xl opacity-80 leading-relaxed max-w-2xl">
                Diyama Solutions exists because too many good businesses stall, not from lack of talent or effort, but from a lack of clarity, structure, and the right kind of support at the right time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-surface to-background">
        <div className="container-narrow mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            We're a business growth partner based in Zambia, serving clients across industries: from food brands and music artists to DAOs and tourism operators. We bring marketing, strategy, creative, and consulting under one roof so our clients can focus on what they do best: building.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide mx-auto">
          <h2 className="text-3xl font-display font-bold mb-10 text-center">What drives us</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Warmth", desc: "We treat every client like a partner. Genuine support, every time." },
              { icon: Target, title: "Clarity", desc: "We cut through confusion and help you see the path forward." },
              { icon: Lightbulb, title: "Practicality", desc: "We don't deal in theory. Every recommendation is actionable." },
              { icon: Users, title: "Partnership", desc: "We grow when you grow. Our success is measured by yours." },
            ].map((v, i) => (
              <motion.div key={v.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className="card-elevated p-6 text-center h-full">
                    <v.icon size={28} className="text-primary mx-auto mb-3" />
                    <h3 className="font-display font-semibold text-lg mb-2">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full hidden lg:block">
          <img src={heroImg} alt="" className="w-full h-full object-cover opacity-20 rounded-l-3xl" />
        </div>
        <div className="container-narrow mx-auto relative z-10">
          <h2 className="text-3xl font-display font-bold mb-6">Our story</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              Diyama started with a simple observation: businesses everywhere have potential, but not all of them have access to the kind of strategic support that turns potential into momentum.
            </p>
            <p>
              We built Diyama to be the partner we wished existed, one that combines practical business consulting with hands-on digital marketing, creative execution, and genuine care for outcomes.
            </p>
            <p>
              From our earliest clients to our most recent partnerships, the mission has stayed the same: help businesses move from where they are to where they want to be. No empty hype. No overcomplicated frameworks. Just clarity, action, and results.
            </p>
            <p>
              Today, we serve active clients across food & beverage, music, Web3, energy, development, and more. We're proud of the trust our clients place in us, and we work hard every day to earn it.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding text-center bg-gradient-to-b from-background to-surface">
        <div className="container-narrow mx-auto">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to work with us?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Whether you need a full growth partner or just a clear-headed conversation about your next move, we're here.
          </p>
          <Link to="/consultations" className="btn-primary inline-flex items-center gap-2">
            Book a Consultation
          </Link>
        </div>
      </section>
    </PageTransition>
  );
};

export default About;
