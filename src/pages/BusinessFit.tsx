import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Mail, Gift, PartyPopper } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import DiyamaAvatar from "@/components/DiyamaAvatar";
import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";
import { toast } from "@/hooks/use-toast";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY as SUPABASE_KEY } from "@/lib/supabaseEnv";

const fitJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Diyama Business Fit",
  description: pageSeo["/business-fit"].description,
  url: "https://www.diyama.online/business-fit",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: { "@type": "Organization", name: "Diyama Solutions" },
};

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

const encouragements = [
  "Great start. Every big brand began with a name.",
  "Nice. This helps me understand your world.",
  "Good. Your stage shapes the advice you need.",
  "Knowing your customers is half the battle won.",
  "Honesty here gets you the sharpest advice.",
  "Last question, then your kit gets built.",
];

const analyzingLines = [
  "Reading your answers carefully...",
  "Studying your market and customers...",
  "Spotting your fastest quick wins...",
  "Checking for blind spots and risks...",
  "Packaging your free Business Kit...",
];

/** Small celebratory particle burst used when the kit is ready. */
const SparkleBurst = () => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    {Array.from({ length: 14 }).map((_, i) => {
      const angle = (i / 14) * Math.PI * 2;
      return (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
          style={{ background: i % 2 ? "hsl(var(--accent))" : "hsl(var(--primary))" }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(angle) * (70 + (i % 3) * 26),
            y: Math.sin(angle) * (70 + (i % 3) * 26),
            opacity: 0,
            scale: 0.2,
          }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
        />
      );
    })}
  </div>
);

const BusinessFit = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    businessName: "", businessType: "", stage: "", targetCustomers: "", challenge: "", goal: "",
  });
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<FitResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzeIdx, setAnalyzeIdx] = useState(0);

  useEffect(() => {
    if (!loading) return;
    setAnalyzeIdx(0);
    const t = setInterval(() => {
      setAnalyzeIdx((i) => Math.min(i + 1, analyzingLines.length - 1));
    }, 2100);
    return () => clearInterval(t);
  }, [loading]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  const handleGenerate = async () => {
    setLoading(true);

    // Join the mailing list. A 409 means they already subscribed, which is
    // fine; any other failure must never block the kit itself.
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/mailing_list`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: form.businessName || null,
          source: "business-fit",
        }),
      });
    } catch {
      // Non-blocking: the kit still gets generated.
    }

    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/business-fit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: form.businessName,
          businessType: form.businessType,
          stage: form.stage,
          targetCustomers: form.targetCustomers,
          currentChallenge: form.challenge,
          currentGoal: form.goal,
        }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || data?.error) throw new Error(data?.error || "Could not generate report. Please try again.");

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

  const totalSteps = fields.length + 1; // questions + email gate
  const onEmailStep = step === fields.length;

  // ---------- Analyzing screen ----------
  if (loading) {
    return (
      <PageTransition>
        <div className="section-padding bg-gradient-to-b from-surface via-background to-surface min-h-[80vh] flex items-center">
          <div className="container-narrow mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <DiyamaAvatar size={110} mood="thinking" className="mb-8" />
              <h1 className="text-2xl sm:text-3xl font-display font-bold mb-6">
                Building the kit for <span className="text-gradient-primary">{form.businessName || "your business"}</span>
              </h1>
              <div className="h-8 relative max-w-sm mx-auto">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={analyzeIdx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="text-muted-foreground text-sm absolute inset-x-0"
                  >
                    {analyzingLines[analyzeIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="max-w-xs mx-auto mt-6 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                  initial={{ width: "8%" }}
                  animate={{ width: ["8%", "38%", "62%", "81%", "94%"] }}
                  transition={{ duration: 11, ease: "easeOut", times: [0, 0.2, 0.45, 0.7, 1] }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // ---------- Report ----------
  if (result) {
    return (
      <PageTransition>
        <div className="section-padding bg-gradient-to-b from-surface to-background">
          <div className="container-narrow mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="relative text-center mb-10">
                <SparkleBurst />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/15 border border-accent/30 mb-4"
                >
                  <PartyPopper className="text-accent" size={28} />
                </motion.div>
                <div className="flex items-center justify-center gap-2 text-accent text-sm font-medium mb-2">
                  <Sparkles size={14} /> Your free Business Kit is ready
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold">
                  Here's what we see for <span className="text-gradient-primary">{form.businessName || "your business"}</span>
                </h1>
                <p className="text-xs text-muted-foreground mt-3">
                  A copy of practical growth tips will also land in your inbox from the Diyama mailing list.
                </p>
              </div>
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
                    <button onClick={() => { setResult(null); setStep(0); setEmail(""); setForm({ businessName: "", businessType: "", stage: "", targetCustomers: "", challenge: "", goal: "" }); }} className="btn-outline-primary text-sm">Start Over</button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // ---------- Question + email flow ----------
  return (
    <PageTransition>
      <Seo {...pageSeo["/business-fit"]} path="/business-fit" jsonLd={fitJsonLd} />
      <div className="section-padding bg-gradient-to-b from-surface via-background to-surface min-h-[80vh] flex items-center">
        <div className="container-narrow mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Sparkles size={14} /> Business Fit Generator
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">
              Get your <span className="text-gradient-primary">free Business Kit</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Answer a few quick questions and Diyama builds you a personalized kit: recommendations, quick wins, and your next best move.
            </p>
          </motion.div>

          {/* Progress */}
          <div className="max-w-md mx-auto mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Step {step + 1} of {totalSteps}</span>
            <span>{Math.round(((step) / totalSteps) * 100)}%</span>
          </div>
          <div className="flex gap-1 mb-8 max-w-md mx-auto">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <motion.div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? (i === totalSteps - 1 ? "bg-accent" : "bg-primary") : "bg-muted"}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.04 }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {onEmailStep ? (
              <motion.div
                key="email-gate"
                initial={{ opacity: 0, x: 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="max-w-md mx-auto text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/15 border border-accent/30 mb-5"
                >
                  <Gift className="text-accent" size={28} />
                </motion.div>
                <h2 className="font-display text-2xl font-bold mb-2">
                  {form.businessName ? `${form.businessName}'s` : "Your"} kit is one step away
                </h2>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  Tell us where to reach you and you get the kit instantly, plus practical growth tips from the Diyama mailing list. No spam, unsubscribe anytime.
                </p>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && emailValid && handleGenerate()}
                    placeholder="you@yourbusiness.com"
                    className="w-full bg-surface border rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    autoFocus
                  />
                </div>
                <div className="flex justify-between items-center mt-6">
                  <button onClick={() => setStep(step - 1)} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
                  <motion.button
                    whileHover={emailValid ? { scale: 1.04 } : undefined}
                    whileTap={emailValid ? { scale: 0.96 } : undefined}
                    onClick={handleGenerate}
                    disabled={!emailValid}
                    className="btn-accent text-sm inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    Unlock my free kit <Sparkles size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.28 }}
                className="max-w-md mx-auto"
              >
                <div className="flex items-start gap-3 mb-5">
                  <DiyamaAvatar size={38} mood="idle" className="shrink-0 mt-0.5" />
                  <div>
                    <label className="block font-display text-xl font-semibold">{fields[step].label}</label>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={step}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-muted-foreground mt-1"
                      >
                        {encouragements[step]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
                {fields[step].type === "select" ? (
                  <motion.div
                    className="grid grid-cols-2 gap-2"
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
                  >
                    {fields[step].options!.map((opt) => (
                      <motion.button
                        key={opt}
                        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setForm({ ...form, [fields[step].key]: opt }); setStep(step + 1); }}
                        className={`text-sm text-left p-3 rounded-lg border transition-all ${form[fields[step].key as keyof typeof form] === opt ? "border-primary bg-primary/5 text-primary shadow-sm" : "hover:border-primary/30 hover:shadow-sm"}`}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </motion.div>
                ) : (
                  <input
                    type="text"
                    value={form[fields[step].key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [fields[step].key]: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && form[fields[step].key as keyof typeof form] && setStep(step + 1)}
                    placeholder={fields[step].placeholder}
                    className="w-full bg-surface border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    autoFocus
                  />
                )}
                <div className="flex justify-between mt-6">
                  {step > 0 && <button onClick={() => setStep(step - 1)} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>}
                  <div className="ml-auto">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setStep(step + 1)}
                      disabled={!form[fields[step].key as keyof typeof form]}
                      className="btn-primary text-sm disabled:opacity-50"
                    >
                      Next →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default BusinessFit;
