import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const stages = ["Idea stage", "Just started", "Growing", "Established", "Scaling"];
const businessTypes = [
  "Restaurant / Food", "Tourism / Hospitality", "Retail / E-commerce",
  "Professional Services", "Tech / SaaS", "Creative / Content", "Web3 / DAO", "Non-profit / NGO", "Other",
];

interface FitResult {
  summary: string;
  services: string[];
  quickWins: string[];
  blindSpots: string[];
  risks?: string[];
  nextStep: string;
}

const BusinessFit = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    businessName: "", businessType: "", stage: "", targetCustomers: "", challenge: "", goal: "",
  });
  const [result, setResult] = useState<FitResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("business-fit", {
        body: {
          businessName: form.businessName,
          businessType: form.businessType,
          stage: form.stage,
          targetCustomers: form.targetCustomers,
          currentChallenge: form.challenge,
          currentGoal: form.goal,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data.result);
    } catch (e) {
      const message = e instanceof Error && e.message ? e.message : "Could not generate report. Please try again.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "businessName", label: "What's your business called?", placeholder: "e.g. Sunshine Lodge" },
    { key: "businessType", label: "What type of business is it?", type: "select", options: businessTypes },
    { key: "stage", label: "What stage are you at?", type: "select", options: stages },
    { key: "targetCustomers", label: "Who are your target customers?", placeholder: "e.g. Tourists visiting Livingstone" },
    { key: "challenge", label: "What's your biggest challenge right now?", placeholder: "e.g. Not enough bookings" },
    { key: "goal", label: "What's your main goal this quarter?", placeholder: "e.g. Double our monthly revenue" },
  ];

  if (result) {
    return (
      <PageTransition>
        <div className="section-padding bg-gradient-to-b from-surface to-background">
          <div className="container-narrow mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Sparkles size={14} /> Your Business Fit Report
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold mb-6">
                Here's what we see for {form.businessName || "your business"}
              </h1>
              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-elevated p-6">
                  <h3 className="font-display font-semibold text-lg mb-2">Summary</h3>
                  <p className="text-muted-foreground">{result.summary}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-elevated p-6">
                  <h3 className="font-display font-semibold text-lg mb-3">Recommended Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.services.map((s) => (
                      <span key={s} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">{s}</span>
                    ))}
                  </div>
                </motion.div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-elevated p-6">
                    <h3 className="font-display font-semibold text-lg mb-3">Quick Wins</h3>
                    <ul className="space-y-2">
                      {result.quickWins.map((w) => (
                        <li key={w} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="text-accent mt-0.5">✓</span> {w}</li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-elevated p-6">
                    <h3 className="font-display font-semibold text-lg mb-3">Possible Blind Spots</h3>
                    <ul className="space-y-2">
                      {result.blindSpots.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="text-accent mt-0.5">⚠</span> {b}</li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
                {result.risks && result.risks.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card-elevated p-6">
                    <h3 className="font-display font-semibold text-lg mb-3">Risks to Watch</h3>
                    <ul className="space-y-2">
                      {result.risks.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="text-red-500 mt-0.5">⚡</span> {r}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-elevated p-6 bg-primary/5 border-primary/20">
                  <h3 className="font-display font-semibold text-lg mb-2">Recommended Next Step</h3>
                  <p className="text-muted-foreground mb-4">{result.nextStep}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/consultations" className="btn-primary text-sm inline-flex items-center gap-2">Book Consultation <ArrowRight size={14} /></Link>
                    <button onClick={() => { setResult(null); setStep(0); setForm({ businessName: "", businessType: "", stage: "", targetCustomers: "", challenge: "", goal: "" }); }} className="btn-outline-primary text-sm">Start Over</button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="section-padding bg-gradient-to-b from-surface via-background to-surface min-h-[80vh] flex items-center">
        <div className="container-narrow mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Sparkles size={14} /> Business Fit Generator
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">Let's find the right fit for your business</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">Answer a few quick questions and we'll generate personalized recommendations, quick wins, and a suggested service bundle.</p>
          </motion.div>
          <div className="flex gap-1 mb-8 max-w-md mx-auto">
            {fields.map((_, i) => (
              <motion.div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.05 }} />
            ))}
          </div>
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-md mx-auto">
            <label className="block font-display text-xl font-semibold mb-4">{fields[step].label}</label>
            {fields[step].type === "select" ? (
              <div className="grid grid-cols-2 gap-2">
                {fields[step].options!.map((opt) => (
                  <motion.button key={opt} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setForm({ ...form, [fields[step].key]: opt }); if (step < fields.length - 1) setStep(step + 1); }} className={`text-sm text-left p-3 rounded-lg border transition-all ${form[fields[step].key as keyof typeof form] === opt ? "border-primary bg-primary/5 text-primary shadow-sm" : "hover:border-primary/30"}`}>
                    {opt}
                  </motion.button>
                ))}
              </div>
            ) : (
              <input type="text" value={form[fields[step].key as keyof typeof form]} onChange={(e) => setForm({ ...form, [fields[step].key]: e.target.value })} onKeyDown={(e) => e.key === "Enter" && form[fields[step].key as keyof typeof form] && (step < fields.length - 1 ? setStep(step + 1) : handleGenerate())} placeholder={fields[step].placeholder} className="w-full bg-surface border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" autoFocus />
            )}
            <div className="flex justify-between mt-6">
              {step > 0 && <button onClick={() => setStep(step - 1)} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>}
              <div className="ml-auto">
                {step < fields.length - 1 ? (
                  <button onClick={() => setStep(step + 1)} disabled={!form[fields[step].key as keyof typeof form]} className="btn-primary text-sm disabled:opacity-50">Next →</button>
                ) : (
                  <button onClick={handleGenerate} disabled={loading || !form[fields[step].key as keyof typeof form]} className="btn-primary text-sm inline-flex items-center gap-2 disabled:opacity-50">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <>Generate My Fit <Sparkles size={14} /></>}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BusinessFit;
