import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";
import { priceCards, priceNote, priceUpdated } from "@/data/pricing";

/* Why this page exists at all.
 *
 * Diyama tells small businesses that hiding their prices takes them off the
 * shortlist before anybody speaks to them. For a long time Diyama did exactly
 * that. This page is the company taking its own advice, which is the only
 * reason the advice is worth listening to.
 *
 * Every figure is a starting price, generated from the company price list by
 * scripts/build-pricing.mjs. Nothing here is typed by hand, so the site cannot
 * quietly disagree with what a client is actually quoted.
 */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const WA = "https://wa.me/260966138238";

const Pricing = () => (
  <PageTransition>
    <Seo {...pageSeo["/pricing"]} path="/pricing" />

    {/* Hero */}
    <section className="section-padding pt-32 pb-12">
      <div className="container-narrow text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <p className="text-accent font-medium tracking-wide uppercase text-sm mb-4">
            What things cost
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Our prices, in the open
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            We tell businesses that a price nobody can see costs them customers they
            never hear about. It would be strange to say that and then hide ours.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Cards */}
    <section className="section-padding pt-4">
      <div className="container-wide">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {priceCards.map((c, i) => (
            <motion.div
              key={c.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.06 }}
              className="card-elevated p-7 flex flex-col"
            >
              <h2 className="font-display text-xl font-bold mb-3">{c.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                {c.blurb}
              </p>

              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  from
                </span>
                <span className="font-display text-3xl font-bold text-accent">{c.from}</span>
                <span className="text-sm text-muted-foreground">{c.unit}</span>
              </div>

              <ul className="space-y-2.5">
                {c.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" aria-hidden />
                    <span className="text-muted-foreground">{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* The honest note, in the open rather than in small print at the bottom */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-10 rounded-xl border border-border bg-muted/40 p-6 md:p-7"
        >
          <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
            {priceNote}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-3">
            Current as at {priceUpdated}. Businesses outside Lusaka, Livingstone and the
            Copperbelt city centres pay 20 percent less on builds and design, because the
            work is delivered remotely. That is a published rate, not a negotiation.
          </p>
        </motion.div>
      </div>
    </section>

    {/* What is not on this page */}
    <section className="section-padding pt-6">
      <div className="container-narrow">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            If it is not here, ask
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The full list runs to about sixty items. Custom systems, property management,
            fleet dispatch, stock and multi user back office. Tender preparation. App store
            publishing. Training. Documents priced per page rather than per document, so a
            two page menu never costs the same as a fourteen page company profile.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Tell us what you need and you get a written quote, with everything itemised,
            before anybody starts. Nothing appears on the invoice that was not on the quote.
          </p>
        </motion.div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding pt-6 pb-24">
      <div className="container-narrow">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="card-elevated p-8 md:p-10 text-center"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Not sure which one you need?
          </h2>
          <p className="text-muted-foreground mb-7 max-w-xl mx-auto leading-relaxed">
            Send us your page, or just tell us what the business does. We will tell you what
            we would actually do first, and roughly what it costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`${WA}?text=${encodeURIComponent("Hi Diyama, I saw your prices. Here is my business:")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Message us on WhatsApp
            </a>
            <Link
              to="/services"
              className="btn-outline-primary inline-flex items-center justify-center gap-2"
            >
              See everything we do
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  </PageTransition>
);

export default Pricing;
