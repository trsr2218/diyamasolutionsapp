import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import consultationImg from "@/assets/consultation-meeting.jpg";
import PageTransition from "@/components/PageTransition";
import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const consultationTypes = [
  "Startup Advice", "Marketing Strategy", "Growth Strategy", "Branding",
  "Restaurant Growth", "Tourism Business Support", "Customer Acquisition",
  "Operational Clarity", "Web3 / Onchain Support", "Creator Support",
  "General Business Consultation", "Visibility Audit", "Partnership Strategy", "Remote Income Strategy",
];

const formats = ["Video Call", "Phone Call", "WhatsApp Chat", "In Person (Lusaka/Livingstone)", "No preference"];

const Consultations = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", company: "", email: "", whatsapp: "", topic: "",
    challenge: "", goal: "", format: "", preferredDate: "", budget: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("consultation_requests").insert({
        full_name: form.fullName,
        company: form.company || null,
        email: form.email,
        whatsapp: form.whatsapp || null,
        topic: form.topic,
        challenge: form.challenge,
        goal: form.goal || null,
        format: form.format || null,
        preferred_date: form.preferredDate || null,
        budget: form.budget || null,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch {
      toast({ title: "Error", description: "Could not submit. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  if (submitted) {
    return (
      <PageTransition>
        <div className="section-padding min-h-[70vh] flex items-center">
          <div className="container-narrow mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle size={48} className="text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-display font-bold mb-3">We've received your request!</h1>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">Thank you, {form.fullName}. We'll review your details and get back to you within 24 hours.</p>
              <a href="https://wa.me/260966138238" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">Message us on WhatsApp</a>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Seo {...pageSeo["/consultations"]} path="/consultations" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={consultationImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/50" />
        </div>
        <div className="relative z-10 section-padding pb-10">
          <div className="container-narrow mx-auto text-primary-foreground">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">Book a Consultation</h1>
              <p className="text-lg opacity-80 max-w-xl">Tell us what you're working on and what you need help with. We'll match you with the right expertise and format.</p>
            </motion.div>
          </div>
        </div>
      </section>
      <div className="section-padding bg-gradient-to-b from-surface to-background">
        <div className="container-narrow mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1.5">Full Name *</label><input required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className="w-full bg-surface border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              <div><label className="block text-sm font-medium mb-1.5">Company / Project</label><input value={form.company} onChange={(e) => update("company", e.target.value)} className="w-full bg-surface border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1.5">Email *</label><input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full bg-surface border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              <div><label className="block text-sm font-medium mb-1.5">WhatsApp</label><input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="e.g. 0966138238" className="w-full bg-surface border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-2">Consultation Topic *</label>
              <div className="flex flex-wrap gap-2">
                {consultationTypes.map((t) => (
                  <button key={t} type="button" onClick={() => update("topic", t)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.topic === t ? "border-primary bg-primary/5 text-primary shadow-sm" : "hover:border-primary/30 text-muted-foreground"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div><label className="block text-sm font-medium mb-1.5">What's your biggest challenge? *</label><textarea required value={form.challenge} onChange={(e) => update("challenge", e.target.value)} rows={3} className="w-full bg-surface border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" /></div>
            <div><label className="block text-sm font-medium mb-1.5">What's your main goal?</label><textarea value={form.goal} onChange={(e) => update("goal", e.target.value)} rows={2} className="w-full bg-surface border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-2">Preferred Format</label>
                <div className="space-y-1.5">
                  {formats.map((f) => (<label key={f} className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="format" value={f} checked={form.format === f} onChange={() => update("format", f)} className="accent-primary" />{f}</label>))}
                </div>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1.5">Preferred Date/Time</label><input type="text" value={form.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} placeholder="e.g. Next week, mornings" className="w-full bg-surface border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Budget Range (optional)</label><input type="text" value={form.budget} onChange={(e) => update("budget", e.target.value)} placeholder="e.g. $200-500" className="w-full bg-surface border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Send size={16} /> Submit Request</>}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default Consultations;
