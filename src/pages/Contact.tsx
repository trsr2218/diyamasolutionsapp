import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import contactImg from "@/assets/contact-advisor.jpg";
import PageTransition from "@/components/PageTransition";
import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: form.name,
        email: form.email,
        subject: form.subject || null,
        message: form.message,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch {
      toast({ title: "Error", description: "Could not send message. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Seo {...pageSeo["/contact"]} path="/contact" />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={contactImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative z-10 section-padding pb-10">
          <div className="container-wide mx-auto text-primary-foreground">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">Get in Touch</h1>
              <p className="text-lg opacity-80">
                Have a question, need help, or ready to start? Reach out, we respond within 24 hours.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="section-padding bg-gradient-to-b from-surface to-background">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="card-elevated p-6">
                  <h3 className="font-display font-semibold mb-4">Contact Details</h3>
                  <div className="space-y-4">
                    <a href="tel:0966138238" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Phone size={18} className="text-primary" /> 0966138238
                    </a>
                    <a href="mailto:getitdonerapid@gmail.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Mail size={18} className="text-primary" /> getitdonerapid@gmail.com
                    </a>
                    <p className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin size={18} className="text-primary" /> www.diyama.online
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">TPIN: 2001340367</p>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <div className="card-elevated p-6">
                  <h3 className="font-display font-semibold mb-3">Quick Options</h3>
                  <div className="space-y-2">
                    <a href="https://wa.me/260966138238" target="_blank" rel="noopener noreferrer" className="block text-sm text-primary hover:underline">
                      💬 Chat on WhatsApp
                    </a>
                    <Link to="/consultations" className="block text-sm text-primary hover:underline">
                      📅 Book a consultation
                    </Link>
                    <Link to="/ai" className="block text-sm text-primary hover:underline">
                      🤖 Ask Diyama AI
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-elevated p-10 text-center">
                  <CheckCircle size={48} className="text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-display font-semibold mb-2">Message sent!</h3>
                  <p className="text-muted-foreground">We'll get back to you within 24 hours. For urgent matters, reach us on WhatsApp.</p>
                </motion.div>
              ) : (
                <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={handleSubmit} className="card-elevated p-6 sm:p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Name *</label>
                      <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-surface border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email *</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full bg-surface border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subject</label>
                    <input value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="w-full bg-surface border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Message *</label>
                    <textarea required value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} rows={5} className="w-full bg-surface border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Send Message
                  </button>
                  <p className="text-xs text-muted-foreground">We respect your privacy. Your information is never shared.</p>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
