import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Check, CheckCircle, Loader2, MessageCircle, Monitor, Smartphone, Send, Star, MapPin, Calendar, ShoppingBag, Sparkles,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Seo from "@/components/Seo";
import WhatsAppFallback from "@/components/WhatsAppFallback";
import { pageSeo } from "@/seo/pageSeo";
import { supabase } from "@/integrations/supabase/client";
import { formToMessage, whatsappLink } from "@/lib/whatsapp";
import { sitePrices } from "@/data/pricing";

/* Design your own website, watch it take shape, order it.
 *
 * Ernest, 11 November 2026: "a provision where users create their own website
 * template and choose to order it from us". The visitor picks a style, colour,
 * pages and features, sees a live mock-up of their site, gets an honest starting
 * price from the price list and sends the design to Diyama in one tap.
 *
 * RULES. Every figure comes from the generated pricing file (section 3 of the price
 * list), never typed here. The estimate is a starting figure and the page says so;
 * the final price is the written quote. The design is saved in the visitor's own
 * browser so it survives a refresh, and nothing is sent until they press the button. */

const kinds = [
  { id: "restaurant", label: "Restaurant or food", cards: ["Our menu", "Today's specials", "Order on WhatsApp"], hero: "Good food, made fresh every day." },
  { id: "salon", label: "Salon or beauty", cards: ["Hair", "Nails and lashes", "Book your slot"], hero: "Walk out feeling brand new." },
  { id: "shop", label: "Shop or retail", cards: ["New arrivals", "Best sellers", "Delivery in town"], hero: "Everything you need, delivered to your door." },
  { id: "clinic", label: "Clinic or health", cards: ["Our services", "Our team", "Book a visit"], hero: "Care you can trust, close to home." },
  { id: "transport", label: "Car hire or transport", cards: ["Our fleet", "Rates", "Book a car"], hero: "Reliable cars, honest rates, ready today." },
  { id: "lodge", label: "Lodge or guest house", cards: ["Rooms", "Rates", "Book direct"], hero: "Your stay, booked directly with us." },
  { id: "school", label: "School or training", cards: ["Courses", "Fees", "Enrol now"], hero: "Learn skills that pay." },
  { id: "church", label: "Church, NGO or community", cards: ["Programmes", "Events", "Get involved"], hero: "Together, we do more." },
  { id: "pro", label: "Professional services", cards: ["What we do", "Our work", "Get a quote"], hero: "Done properly, the first time." },
  { id: "creator", label: "Creator or artist", cards: ["Latest", "Shows", "Bookings"], hero: "New work, every week." },
  { id: "other", label: "Something else", cards: ["What we offer", "Why us", "Get in touch"], hero: "Welcome. Here is what we do." },
];

const styles = [
  { id: "bold", label: "Bold", blurb: "Dark hero, big type, confident", bg: "#0b1020", fg: "#ffffff", card: "#141a2e", muted: "#aab2c8", radius: "14px", serif: false },
  { id: "clean", label: "Clean", blurb: "White space, calm, modern", bg: "#ffffff", fg: "#0f172a", card: "#f6f7fb", muted: "#5b6478", radius: "12px", serif: false },
  { id: "warm", label: "Warm", blurb: "Cream, rounded, friendly", bg: "#fbf6ee", fg: "#2a1f14", card: "#ffffff", muted: "#7a6a58", radius: "22px", serif: true },
  { id: "night", label: "Night", blurb: "Black with a glow", bg: "#000000", fg: "#f5f5f5", card: "#111111", muted: "#9a9a9a", radius: "8px", serif: false },
];

const accents = [
  { id: "gold", hex: "#F2B134" }, { id: "teal", hex: "#0F9B8E" }, { id: "red", hex: "#E0343C" }, { id: "blue", hex: "#2F6FED" },
  { id: "green", hex: "#22A05B" }, { id: "purple", hex: "#8B5CF6" }, { id: "pink", hex: "#E64A8D" }, { id: "orange", hex: "#F0742A" },
];

const pageOptions = [
  { id: "about", label: "About us" },
  { id: "services", label: "Services or menu" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
  { id: "booking", label: "Booking page" },
  { id: "shop", label: "Online shop" },
  { id: "blog", label: "News or blog" },
];

const featureOptions = [
  { id: "whatsapp", label: "WhatsApp button", blurb: "One tap to chat with you" },
  { id: "map", label: "Google map", blurb: "Directions to your door" },
  { id: "reviews", label: "Customer reviews", blurb: "Real reviews shown on the site" },
  { id: "calendar", label: "Online booking calendar", blurb: "Customers pick a date and time" },
  { id: "logins", label: "Customer logins", blurb: "A members area or customer accounts" },
  { id: "payments", label: "Online payments", blurb: "Card or mobile money on the site" },
  { id: "language", label: "Second language", blurb: "The whole site in a second language" },
  { id: "rush", label: "Rush, live in 48 hours", blurb: "Adds 30% to the build price" },
];

interface Design {
  name: string;
  tagline: string;
  kind: string;
  style: string;
  accent: string;
  pages: string[];
  features: string[];
}

const defaultDesign: Design = {
  name: "",
  tagline: "",
  kind: "restaurant",
  style: "bold",
  accent: "gold",
  pages: ["about", "services", "contact"],
  features: ["whatsapp", "map"],
};

const STORAGE = "diyama-site-design";

const load = (): Design => {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (raw) return { ...defaultDesign, ...JSON.parse(raw) };
  } catch {
    /* private window or blocked storage: start fresh */
  }
  return defaultDesign;
};

const fmtK = (n: number) => "K" + n.toLocaleString("en-US");

/* The estimate, following section 3 of the price list tier by tier. */
const estimate = (d: Design) => {
  const has = (f: string) => d.features.includes(f);
  const pages = d.pages.filter((p) => p !== "shop");
  let tier: { name: string; price: number };
  if (has("payments")) tier = { name: "Booking and payments site", price: sitePrices.bookingPayments };
  else if (has("calendar") || has("logins")) tier = { name: "Advanced web app", price: sitePrices.advancedApp };
  else if (pages.length > 3 || pages.includes("gallery") || pages.includes("booking") || pages.includes("blog") || has("reviews"))
    tier = { name: "Business web app", price: sitePrices.businessApp };
  else if (pages.length > 0) tier = { name: "Starter site", price: sitePrices.starter };
  else tier = { name: "Landing page", price: sitePrices.landing };

  const extras: { name: string; price: number }[] = [];
  if (d.pages.includes("shop")) extras.push({ name: "Online shop, up to 30 products", price: sitePrices.shopExtra });
  if (has("language")) extras.push({ name: "Second language version", price: sitePrices.secondLanguage });
  const subtotal = tier.price + extras.reduce((a, e) => a + e.price, 0);
  const rush = has("rush") ? Math.ceil((subtotal * 0.3) / 5) * 5 : 0;
  const total = subtotal + rush;
  const care = has("payments") ? sitePrices.siteCarePaymentsMonthly : sitePrices.siteCareMonthly;
  return { tier, extras, rush, total, care };
};

const SiteBuilder = () => {
  const [d, setD] = useState<Design>(load);
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [order, setOrder] = useState({ fullName: "", whatsapp: "", email: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(d));
    } catch {
      /* fine */
    }
  }, [d]);

  const kind = kinds.find((k) => k.id === d.kind) ?? kinds[0];
  const style = styles.find((s) => s.id === d.style) ?? styles[0];
  const accent = accents.find((a) => a.id === d.accent)?.hex ?? accents[0].hex;
  const est = useMemo(() => estimate(d), [d]);
  const name = d.name.trim() || "Your Business";
  const tagline = d.tagline.trim() || kind.hero;

  const toggle = (key: "pages" | "features", id: string) =>
    setD((x) => ({ ...x, [key]: x[key].includes(id) ? x[key].filter((v) => v !== id) : [...x[key], id] }));

  const summary = () =>
    formToMessage("Website design from diyama.online/build", {
      Business: name,
      Tagline: d.tagline,
      "Type of business": kind.label,
      Style: style.label,
      Colour: d.accent,
      Pages: ["Home", ...d.pages.map((p) => pageOptions.find((o) => o.id === p)?.label ?? p)].join(", "),
      Features: d.features.map((f) => featureOptions.find((o) => o.id === f)?.label ?? f).join(", ") || "none",
      "Starting estimate": `${fmtK(est.total)} (${est.tier.name}) plus Site Care ${fmtK(est.care)} a month`,
      Name: order.fullName,
      WhatsApp: order.whatsapp,
      Email: order.email,
      Notes: order.notes,
    });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFailed(false);
    try {
      const { error } = await supabase.from("consultation_requests").insert({
        full_name: order.fullName,
        company: name,
        email: order.email,
        whatsapp: order.whatsapp || null,
        topic: "Website designed in the site builder",
        challenge: summary(),
        goal: kind.label,
        format: "WhatsApp Chat",
        budget: `${fmtK(est.total)} starting estimate, ${est.tier.name}`,
      });
      if (error) throw error;
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const navPages = ["Home", ...d.pages.map((p) => pageOptions.find((o) => o.id === p)?.label ?? p)];
  const has = (f: string) => d.features.includes(f);
  const font = style.serif ? "Georgia, 'Times New Roman', serif" : "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";

  return (
    <PageTransition>
      <Seo {...pageSeo["/build"]} path="/build" />

      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="aurora animate-aurora-1 -top-32 left-[10%] w-[34rem] h-[34rem] bg-[hsl(173_80%_32%/0.5)]" />
          <div className="aurora animate-aurora-2 top-[10%] -right-24 w-[28rem] h-[28rem] bg-[hsl(41_95%_55%/0.2)]" />
        </div>
        <div className="relative z-10 section-padding pb-10 sm:pb-12">
          <div className="container-wide mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <p className="eyebrow text-accent mb-5">
                <span className="inline-block w-8 h-px bg-accent" /> Design it yourself
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-[1.02] tracking-[-0.03em] mb-5">
                Design your website. Watch it take shape. <span className="text-gold-gradient whitespace-nowrap">Order it.</span>
              </h1>
              <p className="text-lg text-white/70 leading-relaxed max-w-2xl">
                Pick a style, your colour, your pages and what the site must do. The mock-up on the
                right updates as you go, the starting price comes straight from our price list and
                the design reaches us in one tap. We build the real thing.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide mx-auto grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 lg:gap-12 items-start">
          {/* Controls */}
          <div className="space-y-8">
            <Step n="1" title="Your business">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium">Business name</span>
                  <input
                    value={d.name}
                    onChange={(e) => setD({ ...d, name: e.target.value })}
                    placeholder="e.g. Kalulu Hardware"
                    maxLength={40}
                    className="mt-1.5 w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">What kind of business?</span>
                  <select
                    value={d.kind}
                    onChange={(e) => setD({ ...d, kind: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {kinds.map((k) => (
                      <option key={k.id} value={k.id}>{k.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium">One line about you <span className="text-muted-foreground font-normal">(optional)</span></span>
                  <input
                    value={d.tagline}
                    onChange={(e) => setD({ ...d, tagline: e.target.value })}
                    placeholder={kind.hero}
                    maxLength={80}
                    className="mt-1.5 w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
              </div>
            </Step>

            <Step n="2" title="Look and feel">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setD({ ...d, style: s.id })}
                    className={`text-left rounded-xl border p-3 transition-all hover:-translate-y-0.5 ${d.style === s.id ? "border-primary ring-2 ring-primary/25 shadow-md" : "hover:border-primary/40"}`}
                  >
                    <span className="block h-10 rounded-lg mb-2.5 overflow-hidden" style={{ background: s.bg }}>
                      <span className="block h-2 w-1/2 mt-3 ml-2 rounded-sm" style={{ background: accent }} />
                      <span className="block h-1.5 w-2/3 mt-1.5 ml-2 rounded-sm" style={{ background: s.muted, opacity: 0.6 }} />
                    </span>
                    <span className="block text-sm font-semibold">{s.label}</span>
                    <span className="block text-[11px] text-muted-foreground leading-snug">{s.blurb}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-medium mr-1">Your colour</span>
                {accents.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    aria-label={a.id}
                    onClick={() => setD({ ...d, accent: a.id })}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${d.accent === a.id ? "ring-2 ring-offset-2 ring-foreground scale-110" : ""}`}
                    style={{ background: a.hex }}
                  />
                ))}
              </div>
            </Step>

            <Step n="3" title="Pages">
              <p className="text-sm text-muted-foreground mb-3">Home is always included. Tick what else you need.</p>
              <div className="flex flex-wrap gap-2">
                {pageOptions.map((p) => {
                  const on = d.pages.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggle("pages", p.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-all ${on ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card hover:border-primary/40"}`}
                    >
                      {on && <Check size={14} />} {p.label}
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step n="4" title="What it must do">
              <div className="grid sm:grid-cols-2 gap-2.5">
                {featureOptions.map((f) => {
                  const on = d.features.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggle("features", f.id)}
                      className={`text-left rounded-xl border px-4 py-3 transition-all flex items-start gap-3 ${on ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "bg-card hover:border-primary/40"}`}
                    >
                      <span className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${on ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}>
                        {on && <Check size={13} />}
                      </span>
                      <span>
                        <span className="block text-sm font-medium">{f.label}</span>
                        <span className="block text-xs text-muted-foreground">{f.blurb}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Step>

            {/* Estimate */}
            <div className="rounded-2xl bg-ink text-white p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
              <p className="eyebrow text-accent mb-3">Starting price, from our price list</p>
              <div className="flex items-end gap-3 mb-4">
                <motion.span key={est.total} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl font-extrabold text-gold-gradient leading-none">
                  {fmtK(est.total)}
                </motion.span>
                <span className="text-white/60 text-sm pb-1">once, {est.tier.name.toLowerCase()}</span>
              </div>
              <ul className="text-sm text-white/70 space-y-1.5 mb-5">
                <li className="flex justify-between gap-4"><span>{est.tier.name}</span><span className="tabular-nums">{fmtK(est.tier.price)}</span></li>
                {est.extras.map((x) => (
                  <li key={x.name} className="flex justify-between gap-4"><span>{x.name}</span><span className="tabular-nums">{fmtK(x.price)}</span></li>
                ))}
                {est.rush > 0 && <li className="flex justify-between gap-4"><span>Rush delivery, 30%</span><span className="tabular-nums">{fmtK(est.rush)}</span></li>}
                <li className="flex justify-between gap-4 border-t border-white/10 pt-2 mt-2"><span>Site Care, keeps it secure and online</span><span className="tabular-nums">{fmtK(est.care)} a month</span></li>
              </ul>
              <p className="text-xs text-white/50 leading-relaxed">
                Hosting, domain and SSL are included for the first 12 months. Half to start, half when it goes live.
                This is a starting figure. The final price comes in writing before any work begins.
              </p>
            </div>

            {/* Order */}
            <div id="order" className="card-elevated p-6 sm:p-7">
              {sent ? (
                <div className="text-center py-6">
                  <CheckCircle size={44} className="text-primary mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold mb-2">Your design is with us.</h3>
                  <p className="text-muted-foreground mb-5">We will reply on WhatsApp with your written quote and, if you are new to us, a live demo of your site before you pay anything.</p>
                  <a href={whatsappLink(summary())} target="_blank" rel="noopener noreferrer" className="btn-accent inline-flex items-center gap-2">
                    <MessageCircle size={16} /> Also send it on WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <p className="eyebrow text-primary mb-2">Step 5</p>
                    <h3 className="font-display text-2xl font-bold">Order this design</h3>
                    <p className="text-sm text-muted-foreground mt-1">Nothing is paid here. We send the written quote and build your demo first.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm font-medium">Your name</span>
                      <input required value={order.fullName} onChange={(e) => setOrder({ ...order, fullName: e.target.value })} className="mt-1.5 w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium">WhatsApp number</span>
                      <input required value={order.whatsapp} onChange={(e) => setOrder({ ...order, whatsapp: e.target.value })} placeholder="+260 ..." className="mt-1.5 w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-sm font-medium">Email</span>
                      <input required type="email" value={order.email} onChange={(e) => setOrder({ ...order, email: e.target.value })} className="mt-1.5 w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-sm font-medium">Anything else we should know? <span className="text-muted-foreground font-normal">(optional)</span></span>
                      <textarea value={order.notes} onChange={(e) => setOrder({ ...order, notes: e.target.value })} rows={3} className="mt-1.5 w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </label>
                  </div>
                  {failed && <WhatsAppFallback message={summary()} />}
                  <div className="flex flex-wrap gap-3 pt-1">
                    <button type="submit" disabled={loading} className="btn-primary group inline-flex items-center gap-2 disabled:opacity-60">
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Send my design
                    </button>
                    <a href={whatsappLink(summary())} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border font-medium text-sm hover:bg-muted transition-colors">
                      <MessageCircle size={16} /> Send on WhatsApp instead
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Live preview */}
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-3">
              <p className="eyebrow text-primary">Your site, live</p>
              <div className="inline-flex rounded-lg border bg-card p-0.5">
                {(["desktop", "phone"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setDevice(v)}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${device === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {v === "desktop" ? <Monitor size={13} /> : <Smartphone size={13} />} {v === "desktop" ? "Computer" : "Phone"}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/60 p-3 sm:p-4 shadow-xl">
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 flex-1 rounded-md bg-background/80 text-[11px] text-muted-foreground px-2.5 py-1 truncate">
                  www.{name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com
                </span>
              </div>
              <motion.div layout transition={{ type: "spring", stiffness: 220, damping: 28 }} className={`mx-auto overflow-hidden rounded-xl shadow-inner ${device === "phone" ? "max-w-[22rem]" : "w-full"}`}>
                <div style={{ background: style.bg, color: style.fg, fontFamily: font }} className="text-left">
                  {/* nav */}
                  <div className="flex items-center justify-between px-5 py-3.5 text-xs" style={{ borderBottom: `1px solid ${style.muted}33` }}>
                    <span className="font-bold text-sm truncate max-w-[45%]">{name}</span>
                    <div className={`gap-3 ${device === "phone" ? "hidden" : "flex"}`} style={{ color: style.muted }}>
                      {navPages.slice(0, 5).map((p) => (
                        <span key={p}>{p}</span>
                      ))}
                    </div>
                    <span className="rounded-md px-2.5 py-1 text-[11px] font-semibold" style={{ background: accent, color: "#0b0b0b" }}>
                      {d.pages.includes("booking") ? "Book now" : "Contact us"}
                    </span>
                  </div>
                  {/* hero */}
                  <div className="relative px-5 pt-8 pb-7 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl opacity-40" style={{ background: accent }} />
                    <p className="text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: accent }}>{kind.label}</p>
                    <AnimatePresence mode="wait">
                      <motion.h2 key={tagline} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`font-extrabold leading-tight tracking-tight ${device === "phone" ? "text-2xl" : "text-3xl"}`}>
                        {tagline}
                      </motion.h2>
                    </AnimatePresence>
                    <p className="text-xs mt-2 max-w-sm" style={{ color: style.muted }}>
                      {name} in Zambia. Open today. Reach us in one tap.
                    </p>
                    <div className="flex gap-2 mt-4">
                      <span className="rounded-md px-3 py-1.5 text-[11px] font-semibold" style={{ background: accent, color: "#0b0b0b", borderRadius: style.radius }}>
                        {has("whatsapp") ? "WhatsApp us" : "Get in touch"}
                      </span>
                      <span className="rounded-md px-3 py-1.5 text-[11px] font-medium" style={{ border: `1px solid ${style.muted}66`, borderRadius: style.radius }}>
                        {kind.cards[0]}
                      </span>
                    </div>
                  </div>
                  {/* cards */}
                  <div className={`px-5 pb-5 grid gap-2.5 ${device === "phone" ? "grid-cols-1" : "grid-cols-3"}`}>
                    {kind.cards.map((c, i) => (
                      <div key={c} className="p-3.5" style={{ background: style.card, borderRadius: style.radius }}>
                        <span className="block w-7 h-7 mb-2.5 rounded-md" style={{ background: `${accent}33` }}>
                          <span className="block w-3 h-3 m-2 rounded-sm" style={{ background: accent }} />
                        </span>
                        <p className="text-xs font-semibold">{c}</p>
                        <p className="text-[10px] mt-1" style={{ color: style.muted }}>{["Clear prices, no surprises.", "Updated every week.", "Reply within the hour."][i]}</p>
                      </div>
                    ))}
                  </div>
                  <AnimatePresence initial={false}>
                    {d.pages.includes("gallery") && (
                      <motion.div key="gallery" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-5 pb-5 overflow-hidden">
                        <p className="text-[10px] uppercase tracking-[0.16em] mb-2" style={{ color: style.muted }}>Gallery</p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="aspect-square" style={{ borderRadius: style.radius, background: `linear-gradient(${135 + i * 40}deg, ${accent}${["cc", "99", "77", "55"][i]}, ${style.card})` }} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    {has("reviews") && (
                      <motion.div key="reviews" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-5 pb-5 overflow-hidden">
                        <div className="p-3.5 flex items-start gap-3" style={{ background: style.card, borderRadius: style.radius }}>
                          <span className="flex gap-0.5" style={{ color: accent }}>{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={11} fill="currentColor" />)}</span>
                          <p className="text-[11px]" style={{ color: style.muted }}>"Quick, friendly and exactly as promised." A happy customer, Lusaka</p>
                        </div>
                      </motion.div>
                    )}
                    {(d.pages.includes("booking") || has("calendar")) && (
                      <motion.div key="booking" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-5 pb-5 overflow-hidden">
                        <div className="p-3.5 flex items-center justify-between gap-3" style={{ background: style.card, borderRadius: style.radius }}>
                          <span className="flex items-center gap-2 text-xs font-semibold"><Calendar size={14} style={{ color: accent }} /> {has("calendar") ? "Pick a date and time" : "Book on WhatsApp"}</span>
                          <span className="rounded-md px-2.5 py-1 text-[10px] font-semibold" style={{ background: accent, color: "#0b0b0b" }}>{has("payments") ? "Book and pay" : "Book"}</span>
                        </div>
                      </motion.div>
                    )}
                    {d.pages.includes("shop") && (
                      <motion.div key="shop" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-5 pb-5 overflow-hidden">
                        <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-[0.16em]" style={{ color: style.muted }}><ShoppingBag size={11} /> Shop</div>
                        <div className="grid grid-cols-3 gap-2">
                          {["K120", "K85", "K240"].map((p, i) => (
                            <div key={p} className="p-2.5" style={{ background: style.card, borderRadius: style.radius }}>
                              <div className="aspect-[4/3] mb-2" style={{ borderRadius: style.radius, background: `${accent}${["44", "66", "33"][i]}` }} />
                              <p className="text-[10px] font-semibold">Item {i + 1}</p>
                              <p className="text-[10px]" style={{ color: accent }}>{p}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    {has("map") && (
                      <motion.div key="map" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-5 pb-5 overflow-hidden">
                        <div className="h-16 relative overflow-hidden flex items-center justify-center" style={{ borderRadius: style.radius, background: `repeating-linear-gradient(0deg, ${style.card} 0 10px, ${style.muted}22 10px 11px), repeating-linear-gradient(90deg, ${style.card} 0 10px, ${style.muted}22 10px 11px)` }}>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md" style={{ background: style.bg }}><MapPin size={12} style={{ color: accent }} /> Find us on Google Maps</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* footer */}
                  <div className="px-5 py-3.5 flex items-center justify-between text-[10px]" style={{ borderTop: `1px solid ${style.muted}33`, color: style.muted }}>
                    <span>{name} · Zambia</span>
                    <span>{has("language") ? "English · Bemba" : "Built by Diyama"}</span>
                  </div>
                </div>
              </motion.div>
              {has("whatsapp") && (
                <div className="flex justify-end -mt-9 mr-5 relative pointer-events-none">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg" style={{ background: "#25D366", color: "#fff" }}><MessageCircle size={16} /></span>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Sparkles size={14} className="text-accent" /> This is a mock-up. Your real site gets your photos and your words.</span>
              <a href="#order" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">Order this design <ArrowRight size={14} /></a>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Rather talk it through? <Link to="/consultations" className="text-primary font-medium hover:underline">Book a consultation</Link> or see the <Link to="/pricing" className="text-primary font-medium hover:underline">full price guide</Link>.
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

const Step = ({ n, title, children }: { n: string; title: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <span className="inline-flex w-8 h-8 rounded-full bg-gradient-to-br from-accent to-[hsl(30_95%_55%)] text-accent-foreground items-center justify-center font-display text-xs font-extrabold shadow-md shadow-accent/30">{n}</span>
      <h2 className="font-display text-xl font-bold">{title}</h2>
    </div>
    {children}
  </div>
);

export default SiteBuilder;
