import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Send as SendIcon, DollarSign, Shield, CheckCircle, Loader2 } from "lucide-react";
import aboutImg from "@/assets/about-team.jpg";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const partnerTypes = [
  { title: "Referral Partner", description: "Know someone who needs help? Refer them and earn commission on every deal.", icon: Users },
  { title: "Sales Partner", description: "Help us find clients proactively. Get higher commissions and priority support.", icon: DollarSign },
  { title: "Strategic Connector", description: "Connect your network with ours. Co-create opportunities and share in the value.", icon: Shield },
];

const faqs = [
  { q: "How much can I earn?", a: "Commissions vary by service and deal size. We'll share the details once you sign up." },
  { q: "How do I submit leads?", a: "Send them to us directly on WhatsApp or email after you sign up. We handle everything from there and keep you updated on each referral." },
  { q: "When do I get paid?", a: "After the referred client completes their first payment. Payouts are monthly." },
  { q: "Is there a cost to join?", a: "No. The referral program is free. Premium partner tiers may have requirements." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

const Affiliate = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("affiliate_signups").insert({
        full_name: form.name,
        email: form.email,
        phone: form.phone || null,
        partner_type: form.type || "Referral Partner",
        how_you_help: form.message || null,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch {
      toast({ title: "Error", description: "Could not submit. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={aboutImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/50" />
        </div>
        <div className="relative z-10 section-padding">
          <div className="container-wide mx-auto text-primary-foreground">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">Partner with Diyama</h1>
              <p className="text-lg opacity-80">Know businesses that need help growing? Earn commission by referring them. Or partner with us to co-create opportunities.</p>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="section-padding bg-gradient-to-b from-surface to-background">
        <div className="container-wide mx-auto">
          <div className="grid sm:grid-cols-3 gap-5 mb-16">
            {partnerTypes.map((p, i) => (
              <motion.div key={p.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className="card-elevated p-6 text-center h-full">
                    <p.icon size={32} className="text-primary mx-auto mb-4" />
                    <h3 className="font-display font-semibold text-lg mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
          <div className="mb-16">
            <h2 className="text-3xl font-display font-bold mb-8 text-center">How it works</h2>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { step: "1", title: "Sign up", desc: "Fill in the form below to join our partner program." },
                { step: "2", title: "Refer leads", desc: "Share opportunities through your simple partner dashboard." },
                { step: "3", title: "Earn commission", desc: "Get paid when referred clients engage with Diyama." },
              ].map((s, i) => (
                <motion.div key={s.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center">
                  <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto mb-3">{s.step}</motion.div>
                  <h3 className="font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section-padding bg-surface">
        <div className="container-narrow mx-auto">
          <h2 className="text-3xl font-display font-bold mb-6 text-center">Join the program</h2>
          {submitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <CheckCircle size={48} className="text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Application received!</h3>
              <p className="text-muted-foreground">We'll review your application and get back to you soon.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Full Name *" className="w-full bg-card border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="Email *" className="w-full bg-card border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="Phone / WhatsApp" className="w-full bg-card border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="w-full bg-card border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Partner type</option>
                <option>Referral Partner</option>
                <option>Sales Partner</option>
                <option>Strategic Connector</option>
              </select>
              <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} placeholder="Tell us about yourself (optional)" rows={3} className="w-full bg-card border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              <button type="submit" disabled={loading} className="btn-primary w-full inline-flex items-center justify-center gap-2">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <SendIcon size={16} />} Apply Now
              </button>
            </form>
          )}
        </div>
      </section>
      <section className="section-padding bg-gradient-to-b from-background to-surface">
        <div className="container-narrow mx-auto">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-xl mx-auto">
            {faqs.map((faq, i) => (
              <motion.div key={faq.q} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div className="card-elevated p-5">
                  <h3 className="font-semibold text-sm mb-1">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Affiliate;
