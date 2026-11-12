import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, Reorder, useDragControls } from "framer-motion";
import {
  ArrowRight, Check, CheckCircle, Loader2, MessageCircle, Monitor, Smartphone, Send, Star, MapPin, Calendar, ShoppingBag, Sparkles,
  GripVertical, X, Plus, Globe, Link2, LayoutTemplate, Clock, Users, Wand2, ImagePlus, Camera, Trash2, Eye,
  Utensils, Scissors, Stethoscope, Car, BedDouble, GraduationCap, HeartHandshake, Briefcase, Mic, type LucideIcon,
} from "lucide-react";
import { MAX_REFS, loadRefs, paletteFrom, saveRefs, shrink, uploadRefs, type Palette, type SiteRef } from "@/lib/siteRefs";
import PageTransition from "@/components/PageTransition";
import Seo from "@/components/Seo";
import WhatsAppFallback from "@/components/WhatsAppFallback";
import { pageSeo } from "@/seo/pageSeo";
import { supabase } from "@/integrations/supabase/client";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/lib/supabaseEnv";
import { formToMessage, whatsappLink } from "@/lib/whatsapp";
import { sitePrices } from "@/data/pricing";

/* Design your own website, watch it take shape, order it.
 *
 * Ernest, 11 November 2026: "a provision where users create their own website
 * template and choose to order it from us". Then, 12 November: build it drag and
 * drop or with Diyama AI assist. When they love it they order it for a
 * subdomain, as a page among the people we advertise, or as a full build on their
 * own domain, with packages.
 *
 * So the page has three parts. The visitor describes the business and Diyama AI
 * drafts the whole design, or they pick everything by hand. The mock-up is made of
 * sections they drag into the order they want, add and remove. Then they choose how
 * it goes live and send the design to Diyama in one tap.
 *
 * RULES. Every figure comes from the generated pricing file (section 3 of the price
 * list), never typed here. The estimate is a starting figure and the page says so;
 * the final price is the written quote. The two hosted packages (a Diyama address,
 * a partner page on Diyama) are section 3c of the price list, approved 12 November
 * 2026; they carry no logins, calendar, payments or shop, those need a full build.
 * The design is saved in the visitor's own browser so it survives a refresh;
 * nothing is sent until they press the button. */

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

/* Ernest, 12 November 2026, on the first version: "has one style, wtf". So: eight
   looks instead of four, five page layouts that change the shape of the site and not
   only its colours, a picture in the hero, and a ninth look, "From your screenshot",
   that takes its colours from pictures the visitor uploads. */
interface Look {
  id: string;
  label: string;
  blurb: string;
  bg: string;
  fg: string;
  card: string;
  muted: string;
  radius: string;
  serif: boolean;
}

const styles: Look[] = [
  { id: "bold", label: "Bold", blurb: "Dark hero, big type, confident", bg: "#0b1020", fg: "#ffffff", card: "#141a2e", muted: "#aab2c8", radius: "14px", serif: false },
  { id: "clean", label: "Clean", blurb: "White space, calm, modern", bg: "#ffffff", fg: "#0f172a", card: "#f6f7fb", muted: "#5b6478", radius: "12px", serif: false },
  { id: "warm", label: "Warm", blurb: "Cream, rounded, friendly", bg: "#fbf6ee", fg: "#2a1f14", card: "#ffffff", muted: "#7a6a58", radius: "22px", serif: true },
  { id: "night", label: "Night", blurb: "Black with a glow", bg: "#000000", fg: "#f5f5f5", card: "#111111", muted: "#9a9a9a", radius: "8px", serif: false },
  { id: "luxury", label: "Luxury", blurb: "Black, gold, serif", bg: "#0a0a0a", fg: "#f7f1e3", card: "#171410", muted: "#b5aa90", radius: "2px", serif: true },
  { id: "fresh", label: "Fresh", blurb: "Mint, light, lively", bg: "#eefaf3", fg: "#0f2e1f", card: "#ffffff", muted: "#4f7a63", radius: "18px", serif: false },
  { id: "corporate", label: "Corporate", blurb: "Navy and white, trusted", bg: "#f3f5f9", fg: "#0b1f3a", card: "#ffffff", muted: "#4e5d75", radius: "6px", serif: false },
  { id: "earth", label: "Earth", blurb: "Olive, sand, grounded", bg: "#e9e2d2", fg: "#2b2a1f", card: "#f6f2e8", muted: "#6f6a52", radius: "10px", serif: true },
];

const MATCH = "match";
const lookFromPalette = (p: Palette): Look => ({
  id: MATCH, label: "From your screenshot", blurb: "The colours of the site you like", bg: p.bg, fg: p.fg, card: p.card, muted: p.muted, radius: "12px", serif: p.serif === true,
});

/* How the page is shaped. The layout decides the nav, the hero and how the blocks sit. */
const layouts = [
  { id: "split", label: "Split", blurb: "Words left, picture right" },
  { id: "cover", label: "Cover", blurb: "Full picture, words on top" },
  { id: "centred", label: "Centred", blurb: "Everything in the middle" },
  { id: "editorial", label: "Editorial", blurb: "Big headline, thin lines" },
  { id: "stack", label: "Simple", blurb: "Headline, button, go" },
];

/* The picture in the hero, one icon per kind of business until their own photo goes in. */
const kindIcons: Record<string, LucideIcon> = {
  restaurant: Utensils, salon: Scissors, shop: ShoppingBag, clinic: Stethoscope, transport: Car, lodge: BedDouble,
  school: GraduationCap, church: HeartHandshake, pro: Briefcase, creator: Mic, other: Sparkles,
};

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

/* The blocks the visitor drags around. The hero is always first and is not a block. */
const sectionOptions: { id: string; label: string; blurb: string; icon: LucideIcon }[] = [
  { id: "offer", label: "What you offer", blurb: "Three cards", icon: LayoutTemplate },
  { id: "about", label: "About you", blurb: "A short story", icon: Users },
  { id: "menu", label: "Menu or price list", blurb: "Items with prices", icon: ShoppingBag },
  { id: "gallery", label: "Photo gallery", blurb: "Your best pictures", icon: Sparkles },
  { id: "reviews", label: "Customer reviews", blurb: "Real words from customers", icon: Star },
  { id: "booking", label: "Booking", blurb: "Customers book you", icon: Calendar },
  { id: "shop", label: "Shop", blurb: "Products with prices", icon: ShoppingBag },
  { id: "team", label: "Your team", blurb: "Faces and names", icon: Users },
  { id: "hours", label: "Opening hours", blurb: "When you are open", icon: Clock },
  { id: "map", label: "Map and directions", blurb: "Find us on Google Maps", icon: MapPin },
  { id: "cta", label: "Call to action", blurb: "A banner that asks", icon: Send },
  { id: "contact", label: "Contact form", blurb: "Messages land on WhatsApp", icon: MessageCircle },
];

const featureOptions = [
  { id: "whatsapp", label: "WhatsApp button", blurb: "One tap to chat with you" },
  { id: "calendar", label: "Online booking calendar", blurb: "Customers pick a date and time" },
  { id: "logins", label: "Customer logins", blurb: "A members area or customer accounts" },
  { id: "payments", label: "Online payments", blurb: "Card or mobile money on the site" },
  { id: "language", label: "Second language", blurb: "The whole site in a second language" },
  { id: "rush", label: "Rush, live in 48 hours", blurb: "Adds 30% to the build price" },
];

/* The three ways the design can go live. Only the full build has a price on the price
   list. The other two are quoted until Ernest sets their figures. */
const liveOptions = [
  {
    id: "own",
    label: "Your own domain",
    icon: Globe,
    blurb: "The full build, live on your own address. Hosting, domain and SSL are free for the first twelve months.",
    address: (slug: string) => `www.${slug || "yourbusiness"}.com`,
  },
  {
    id: "sub",
    label: "A Diyama address",
    icon: Link2,
    blurb: "Your design built as it looks, live at a Diyama address, hosted and cared for by us. A small set-up fee and a monthly fee instead of a build price.",
    address: (slug: string) => `${slug || "yourbusiness"}.diyama.online`,
  },
  {
    id: "page",
    label: "A partner page on Diyama",
    icon: LayoutTemplate,
    blurb: "One page for your business on diyama.online, listed with the brands we advertise and included in our monthly partners post.",
    address: (slug: string) => `diyama.online/partners/${slug || "yourbusiness"}`,
  },
];

interface Design {
  name: string;
  tagline: string;
  about: string;
  cards: string[];
  kind: string;
  style: string;
  accent: string;
  pages: string[];
  sections: string[];
  features: string[];
  live: string;
  byAi: boolean;
  layout: string;
  /** Colours read from the visitor's screenshots, when they uploaded any. */
  palette: Palette | null;
  /** A website they like, typed as an address. */
  refUrl: string;
  /** What Diyama AI saw in the screenshots, in one line, for the person building the demo. */
  lookNotes: string;
}

const defaultDesign: Design = {
  name: "",
  tagline: "",
  about: "",
  cards: [],
  kind: "restaurant",
  style: "bold",
  accent: "gold",
  pages: ["about", "services", "contact"],
  sections: ["offer", "about", "map"],
  features: ["whatsapp"],
  live: "own",
  byAi: false,
  layout: "split",
  palette: null,
  refUrl: "",
  lookNotes: "",
};

const STORAGE = "diyama-site-design";

const ids = (list: { id: string }[]) => list.map((x) => x.id);
const only = (arr: unknown, allowed: string[]) =>
  Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string" && allowed.includes(x)).filter((x, i, a) => a.indexOf(x) === i) : [];

/* Designs saved before sections existed carried gallery, reviews, booking, shop and
   map as pages or features. Carry them over so nobody's saved design breaks. */
const migrate = (raw: Partial<Design> & { features?: string[]; pages?: string[] }): Design => {
  const d: Design = { ...defaultDesign, ...raw };
  if (!Array.isArray(raw.sections)) {
    const s = ["offer"];
    if ((raw.pages ?? []).includes("about")) s.push("about");
    if ((raw.pages ?? []).includes("gallery")) s.push("gallery");
    if ((raw.features ?? []).includes("reviews")) s.push("reviews");
    if ((raw.pages ?? []).includes("booking") || (raw.features ?? []).includes("calendar")) s.push("booking");
    if ((raw.pages ?? []).includes("shop")) s.push("shop");
    if ((raw.features ?? []).includes("map")) s.push("map");
    d.sections = s;
  }
  d.sections = only(d.sections, ids(sectionOptions));
  d.features = only(d.features, ids(featureOptions));
  d.pages = only(d.pages, ids(pageOptions));
  if (!ids(liveOptions).includes(d.live)) d.live = "own";
  if (!ids(layouts).includes(d.layout)) d.layout = "split";
  const p = d.palette as Partial<Palette> | null;
  if (!p || typeof p.bg !== "string" || typeof p.fg !== "string" || typeof p.card !== "string" || typeof p.muted !== "string" || typeof p.accent !== "string") d.palette = null;
  if (!d.palette && (d.style === MATCH || d.accent === MATCH)) {
    if (d.style === MATCH) d.style = "bold";
    if (d.accent === MATCH) d.accent = "gold";
  }
  if (typeof d.refUrl !== "string") d.refUrl = "";
  if (typeof d.lookNotes !== "string") d.lookNotes = "";
  return d;
};

const load = (): Design => {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (raw) return migrate(JSON.parse(raw));
  } catch {
    /* private window or blocked storage: start fresh */
  }
  return defaultDesign;
};

const fmtK = (n: number) => "K" + n.toLocaleString("en-US");

/* The estimate for a full build, following section 3 of the price list tier by tier. */
const estimate = (d: Design) => {
  const has = (f: string) => d.features.includes(f);
  const sec = (s: string) => d.sections.includes(s);
  const pages = d.pages.filter((p) => p !== "shop");
  let tier: { name: string; price: number };
  if (has("payments")) tier = { name: "Booking and payments site", price: sitePrices.bookingPayments };
  else if (has("calendar") || has("logins")) tier = { name: "Advanced web app", price: sitePrices.advancedApp };
  else if (pages.length > 3 || pages.includes("booking") || pages.includes("blog") || sec("gallery") || sec("reviews") || sec("booking") || sec("menu") || sec("team"))
    tier = { name: "Business web app", price: sitePrices.businessApp };
  else if (pages.length > 0) tier = { name: "Starter site", price: sitePrices.starter };
  else tier = { name: "Landing page", price: sitePrices.landing };

  const extras: { name: string; price: number }[] = [];
  if (d.pages.includes("shop") || sec("shop")) extras.push({ name: "Online shop, up to 30 products", price: sitePrices.shopExtra });
  if (has("language")) extras.push({ name: "Second language version", price: sitePrices.secondLanguage });
  const subtotal = tier.price + extras.reduce((a, e) => a + e.price, 0);
  const rush = has("rush") ? Math.ceil((subtotal * 0.3) / 5) * 5 : 0;
  const total = subtotal + rush;
  const care = has("payments") ? sitePrices.siteCarePaymentsMonthly : sitePrices.siteCareMonthly;
  return { tier, extras, rush, total, care };
};

/* Diyama AI drafts the design from a sentence or two. It answers through the same
   chat function the /ai page uses; the reply is streamed, gathered and read as JSON.
   Anything it gets wrong is dropped, never guessed. */
const aiPrompt = (text: string) =>
  [
    "A visitor on diyama.online/build wants a website designed from this description of their business.",
    "Reply with ONLY a JSON object, no prose, no markdown fences, with exactly these keys:",
    `name: the business name, under 40 characters.`,
    `tagline: one line for the top of the site, under 70 characters, no dashes.`,
    `kind: one of ${ids(kinds).join(", ")}.`,
    `style: one of ${ids(styles).join(", ")}.`,
    `layout: one of ${layouts.map((l) => `${l.id} (${l.blurb.toLowerCase()})`).join(", ")}.`,
    `accent: one of ${ids(accents).join(", ")}.`,
    `pages: an array from ${ids(pageOptions).join(", ")}.`,
    `sections: an array in display order from ${ids(sectionOptions).join(", ")}, starting with offer, four to seven items.`,
    `features: an array from whatsapp, calendar, logins, payments, language.`,
    `cards: three short labels under 22 characters each for what they offer.`,
    `about: two sentences about the business, under 180 characters, no dashes.`,
    "",
    "Description:",
    text,
  ].join("\n");

/* One question to the chat function, the streamed answer gathered into a JSON object.
   Pictures ride along as data URLs; the function passes them to the model inline. */
async function askJson(prompt: string, images: string[] = []): Promise<Record<string, unknown>> {
  const resp = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}` },
    body: JSON.stringify({ messages: [{ role: "user", content: prompt, ...(images.length ? { images } : {}) }] }),
  });
  if (!resp.ok || !resp.body) throw new Error("no answer");
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let out = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, nl).replace(/\r$/, "");
      buf = buf.slice(nl + 1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") break;
      try {
        out += JSON.parse(json).choices?.[0]?.delta?.content ?? "";
      } catch {
        /* a partial line, wait for the rest */
      }
    }
  }
  const start = out.indexOf("{");
  const end = out.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("no json");
  return JSON.parse(out.slice(start, end + 1)) as Record<string, unknown>;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[—–]/g, ",").trim().slice(0, max) : "");
const pick = (v: unknown, list: { id: string }[]) => (typeof v === "string" && ids(list).includes(v) ? v : undefined);

async function askDiyamaAi(text: string): Promise<Partial<Design>> {
  const j = await askJson(aiPrompt(text));
  const sections = only(j.sections, ids(sectionOptions)).slice(0, 8);
  if (sections[0] !== "offer") sections.unshift("offer");
  const cards = Array.isArray(j.cards) ? j.cards.filter((c): c is string => typeof c === "string").map((c) => c.trim().slice(0, 22)).filter(Boolean).slice(0, 3) : [];
  return {
    name: str(j.name, 40),
    tagline: str(j.tagline, 80),
    about: str(j.about, 200),
    cards: cards.length === 3 ? cards : [],
    kind: pick(j.kind, kinds),
    style: pick(j.style, styles),
    layout: pick(j.layout, layouts),
    accent: pick(j.accent, accents),
    pages: only(j.pages, ids(pageOptions)),
    sections: sections.filter((s, i, a) => a.indexOf(s) === i),
    features: only(j.features, ["whatsapp", "calendar", "logins", "payments", "language"]),
    byAi: true,
  };
}

/* Diyama AI looks at the screenshots and says which layout and look are closest, and
   writes one line about the look for whoever builds the demo. The colours themselves
   are read in the browser, so this only adds shape and words. */
const lookPrompt = [
  "These are screenshots of websites a visitor on diyama.online/build likes. They want their own site to look similar.",
  "If no picture is attached to this message, reply with exactly {\"none\": true} and nothing else.",
  "Otherwise reply with ONLY a JSON object, no prose, no markdown fences, with exactly these keys:",
  `layout: the closest of ${layouts.map((l) => `${l.id} (${l.blurb.toLowerCase()})`).join(", ")}.`,
  `style: the closest of ${styles.map((s) => `${s.id} (${s.blurb.toLowerCase()})`).join(", ")}.`,
  "serif: true if the headings use a serif typeface, else false.",
  "look: one sentence under 160 characters describing the look to copy (type, spacing, imagery, mood), no dashes.",
].join("\n");

async function askLook(images: string[]): Promise<{ layout?: string; style?: string; serif: boolean; look: string }> {
  const j = await askJson(lookPrompt, images);
  if (j.none === true || !j.look) throw new Error("did not see the pictures");
  return { layout: pick(j.layout, layouts), style: pick(j.style, styles), serif: j.serif === true, look: str(j.look, 180) };
}

const SiteBuilder = () => {
  const [d, setD] = useState<Design>(load);
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [order, setOrder] = useState({ fullName: "", whatsapp: "", email: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState(false);
  const [brief, setBrief] = useState("");
  const [ai, setAi] = useState<"idle" | "thinking" | "done" | "failed">("idle");
  const [refs, setRefs] = useState<SiteRef[]>(loadRefs);
  const [refState, setRefState] = useState<"idle" | "reading" | "looking" | "matched" | "colours" | "failed">(() => (loadRefs().length ? "matched" : "idle"));
  const [sending, setSending] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(d));
    } catch {
      /* fine */
    }
  }, [d]);
  useEffect(() => saveRefs(refs), [refs]);

  const kind = kinds.find((k) => k.id === d.kind) ?? kinds[0];
  const matchLook = d.palette ? lookFromPalette(d.palette) : null;
  const style: Look = (d.style === MATCH && matchLook) || styles.find((s) => s.id === d.style) || styles[0];
  const accent = d.accent === MATCH && d.palette ? d.palette.accent : (accents.find((a) => a.id === d.accent)?.hex ?? accents[0].hex);
  const layout = layouts.find((l) => l.id === d.layout) ?? layouts[0];

  /* Screenshots of sites they like: shrink, read the colours, then ask Diyama AI for the shape. */
  const addRefs = async (files: FileList | File[]) => {
    const room = MAX_REFS - refs.length;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, Math.max(0, room));
    if (!list.length) return;
    setRefState("reading");
    const added: SiteRef[] = [];
    for (const f of list) {
      try {
        added.push({ data: await shrink(f) });
      } catch {
        /* skip a file that will not read */
      }
    }
    if (!added.length) {
      setRefState("failed");
      return;
    }
    const all = [...refs, ...added];
    setRefs(all);
    let palette: Palette | null = d.palette;
    try {
      palette = await paletteFrom(all[0].data, accent);
      setD((x) => ({ ...x, palette, style: MATCH, accent: MATCH }));
    } catch {
      /* a picture the canvas will not read: keep the chosen look */
    }
    setRefState("looking");
    try {
      const seen = await askLook(all.map((r) => r.data));
      setD((x) => ({
        ...x,
        layout: seen.layout ?? x.layout,
        lookNotes: seen.look || x.lookNotes,
        palette: x.palette ? { ...x.palette, serif: seen.serif } : null,
        style: x.palette ? MATCH : (seen.style ?? x.style),
      }));
      setRefState("matched");
    } catch {
      setRefState(palette ? "colours" : "failed");
    }
  };
  const removeRef = (i: number) => {
    const left = refs.filter((_, k) => k !== i);
    setRefs(left);
    if (!left.length) {
      setRefState("idle");
      setD((x) => ({ ...x, palette: null, lookNotes: "", style: x.style === MATCH ? "bold" : x.style, accent: x.accent === MATCH ? "gold" : x.accent }));
    }
  };
  const live = liveOptions.find((l) => l.id === d.live) ?? liveOptions[0];
  const est = useMemo(() => estimate(d), [d]);
  /* The hosted packages carry none of these; they make it a full build on the customer's own domain. */
  const hostedBlocked = d.live === "own" ? [] : [
    d.features.includes("calendar") ? "Online booking calendar" : "",
    d.features.includes("logins") ? "Customer logins" : "",
    d.features.includes("payments") ? "Online payments" : "",
    d.sections.includes("shop") || d.pages.includes("shop") ? "Online shop" : "",
  ].filter(Boolean);
  const name = d.name.trim() || "Your Business";
  const tagline = d.tagline.trim() || kind.hero;
  const cards = d.cards.length === 3 ? d.cards : kind.cards;
  const about = d.about.trim() || `${name} is a ${kind.label.toLowerCase().replace(" or ", " and ")} business in Zambia. Honest prices, quick replies and work we stand behind.`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "");

  const toggle = (key: "pages" | "features", id: string) =>
    setD((x) => ({ ...x, [key]: x[key].includes(id) ? x[key].filter((v) => v !== id) : [...x[key], id] }));
  const addSection = (id: string) => setD((x) => (x.sections.includes(id) ? x : { ...x, sections: [...x.sections, id] }));
  const removeSection = (id: string) => setD((x) => ({ ...x, sections: x.sections.filter((s) => s !== id) }));

  const runAi = async () => {
    if (brief.trim().length < 8) return;
    setAi("thinking");
    try {
      const draft = await askDiyamaAi(brief.trim());
      setD((x) => ({
        ...x,
        ...Object.fromEntries(Object.entries(draft).filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))),
      }));
      setAi("done");
    } catch {
      setAi("failed");
    }
  };

  const summary = (refUrls: string[] = refs.map((r) => r.url ?? "").filter(Boolean)) =>
    formToMessage("Website design from diyama.online/build", {
      Business: name,
      Tagline: d.tagline,
      "Type of business": kind.label,
      Layout: layout.label,
      Style: d.style === MATCH ? `From their screenshots (ground ${style.bg}, text ${style.fg})` : style.label,
      Colour: d.accent === MATCH ? `From their screenshots (${accent})` : d.accent,
      "Website they like": d.refUrl,
      "Reference screenshots": refUrls.length ? refUrls.join("  ") : refs.length ? `${refs.length} attached but not uploaded, ask for them on WhatsApp` : undefined,
      "The look, as Diyama AI saw it": d.lookNotes,
      Pages: ["Home", ...d.pages.map((p) => pageOptions.find((o) => o.id === p)?.label ?? p)].join(", "),
      "Sections, in order": ["Hero", ...d.sections.map((s) => sectionOptions.find((o) => o.id === s)?.label ?? s)].join(", "),
      "What you offer": cards.join(", "),
      About: d.about,
      Features: d.features.map((f) => featureOptions.find((o) => o.id === f)?.label ?? f).join(", ") || "none",
      "Go live as": `${live.label} (${live.address(slug)})`,
      "Starting estimate": d.live === "own" ? `${fmtK(est.total)} (${est.tier.name}) plus Site Care ${fmtK(est.care)} a month` : d.live === "sub" ? `${fmtK(sitePrices.diyamaAddressSetup)} set up, then ${fmtK(sitePrices.diyamaAddressMonthly)} a month` : `${fmtK(sitePrices.partnerPageSetup)} set up, then ${fmtK(sitePrices.partnerPageMonthly)} a month`,
      "Needs a full build": hostedBlocked.length ? hostedBlocked.join(", ") : undefined,
      "Designed with": d.byAi ? "Diyama AI, then edited by the visitor" : "By hand",
      Name: order.fullName,
      WhatsApp: order.whatsapp,
      Email: order.email,
      Notes: order.notes,
    });

  /* The screenshots go up with the order. If the upload fails the order still goes,
     saying the pictures are to be asked for on WhatsApp. */
  const sendRefs = async (): Promise<string[]> => {
    if (!refs.length) return [];
    try {
      const urls = await uploadRefs(refs);
      setRefs(refs.map((r, i) => ({ ...r, url: urls[i] })));
      return urls;
    } catch {
      return [];
    }
  };

  const openWhatsApp = async () => {
    setSending(true);
    const urls = await sendRefs();
    setSending(false);
    window.open(whatsappLink(summary(urls)), "_blank", "noopener");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFailed(false);
    try {
      const urls = await sendRefs();
      const { error } = await supabase.from("consultation_requests").insert({
        full_name: order.fullName,
        company: name,
        email: order.email,
        whatsapp: order.whatsapp || null,
        topic: `Website designed in the site builder, ${live.label.toLowerCase()}${refs.length ? ", with reference screenshots" : ""}`,
        challenge: summary(urls),
        goal: kind.label,
        format: "WhatsApp Chat",
        budget: d.live === "own" ? `${fmtK(est.total)} starting estimate, ${est.tier.name}` : d.live === "sub" ? `${fmtK(sitePrices.diyamaAddressSetup)} set up, ${fmtK(sitePrices.diyamaAddressMonthly)} a month` : `${fmtK(sitePrices.partnerPageSetup)} set up, ${fmtK(sitePrices.partnerPageMonthly)} a month`,
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
  const serif = style.serif || layout.id === "editorial";
  const font = serif ? "Georgia, 'Times New Roman', serif" : "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";
  const phone = device === "phone";
  /* Editorial draws blocks as ruled panels on the page colour, the other layouts as cards. */
  const cardStyle = layout.id === "editorial"
    ? { background: style.bg, borderRadius: "0px", boxShadow: `inset 0 0 0 1px ${style.muted}44` }
    : { background: style.card, borderRadius: style.radius };
  const onDark = (() => {
    const h = style.bg.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
  })();
  const heroArt = <HeroArt icon={kindIcons[kind.id] ?? Sparkles} accent={accent} dark={onDark} radius={layout.id === "editorial" ? "0px" : style.radius} />;
  const primaryBtn = { background: accent, color: "#0b0b0b", borderRadius: layout.id === "editorial" ? "0px" : style.radius };
  const ghostBtn = { border: `1px solid ${style.muted}66`, borderRadius: layout.id === "editorial" ? "0px" : style.radius };
  const navLinks = (
    <div className={`gap-3 ${phone ? "hidden" : "hidden sm:flex"}`} style={{ color: style.muted }}>
      {navPages.slice(0, 5).map((p) => (
        <span key={p} className={layout.id === "editorial" ? "uppercase tracking-[0.14em] text-[10px]" : ""}>{p}</span>
      ))}
    </div>
  );
  const navBtn = (
    <span className="px-2.5 py-1 text-[11px] font-semibold" style={primaryBtn}>
      {d.pages.includes("booking") || d.sections.includes("booking") ? "Book now" : "Contact us"}
    </span>
  );
  const heroSub = `${name} in Zambia. Open today. Reach us in one tap.`;
  const heroBtns = (
    <div className={`flex gap-2 mt-4 ${layout.id === "centred" ? "justify-center" : ""}`}>
      <span className="px-3 py-1.5 text-[11px] font-semibold" style={primaryBtn}>{has("whatsapp") ? "WhatsApp us" : "Get in touch"}</span>
      <span className="px-3 py-1.5 text-[11px] font-medium" style={ghostBtn}>{cards[0]}</span>
    </div>
  );
  const heroTitle = (big = false) => (
    <AnimatePresence mode="wait">
      <motion.h2 key={tagline + layout.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`font-extrabold leading-[1.05] tracking-tight ${big ? (phone ? "text-3xl" : "text-4xl") : phone ? "text-2xl" : "text-3xl"}`}>
        {tagline}
      </motion.h2>
    </AnimatePresence>
  );
  const notYet = sectionOptions.filter((s) => !d.sections.includes(s.id));

  /* One block of the mock-up, keyed by section id. */
  const renderSection = (id: string) => {
    switch (id) {
      case "offer":
        return (
          <div className={`grid gap-2.5 ${phone ? "grid-cols-1" : "grid-cols-3"}`}>
            {cards.map((c, i) => (
              <div key={c + i} className="p-3.5" style={{ ...cardStyle }}>
                <span className="block w-7 h-7 mb-2.5 rounded-md" style={{ background: `${accent}33` }}>
                  <span className="block w-3 h-3 m-2 rounded-sm" style={{ background: accent }} />
                </span>
                <p className="text-xs font-semibold">{c}</p>
                <p className="text-[10px] mt-1" style={{ color: style.muted }}>{["Clear prices, no surprises.", "Updated every week.", "Reply within the hour."][i]}</p>
              </div>
            ))}
          </div>
        );
      case "about":
        return (
          <div className={`grid gap-3 items-center ${phone ? "grid-cols-1" : "grid-cols-[1fr_1.4fr]"}`}>
            <div className="aspect-[4/3]" style={{ borderRadius: style.radius, background: `linear-gradient(135deg, ${accent}99, ${style.card})` }} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] mb-1.5" style={{ color: accent }}>About {name}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: style.muted }}>{about}</p>
            </div>
          </div>
        );
      case "menu":
        return (
          <div className="p-3.5 space-y-2" style={{ ...cardStyle }}>
            <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: style.muted }}>{d.kind === "restaurant" ? "Menu" : "Price list"}</p>
            {[["Most popular", "K85"], ["The classic", "K120"], ["The full works", "K240"]].map(([n, p]) => (
              <div key={n} className="flex items-center justify-between text-[11px] border-b last:border-0 pb-1.5 last:pb-0" style={{ borderColor: `${style.muted}33` }}>
                <span className="font-medium">{n}</span>
                <span className="font-semibold" style={{ color: accent }}>{p}</span>
              </div>
            ))}
          </div>
        );
      case "gallery":
        return (
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] mb-2" style={{ color: style.muted }}>Gallery</p>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-square" style={{ borderRadius: style.radius, background: `linear-gradient(${135 + i * 40}deg, ${accent}${["cc", "99", "77", "55"][i]}, ${style.card})` }} />
              ))}
            </div>
          </div>
        );
      case "reviews":
        return (
          <div className="p-3.5 flex items-start gap-3" style={{ ...cardStyle }}>
            <span className="flex gap-0.5 shrink-0" style={{ color: accent }}>{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={11} fill="currentColor" />)}</span>
            <p className="text-[11px]" style={{ color: style.muted }}>"Quick, friendly and exactly as promised." A happy customer, Lusaka</p>
          </div>
        );
      case "booking":
        return (
          <div className="p-3.5 flex items-center justify-between gap-3" style={{ ...cardStyle }}>
            <span className="flex items-center gap-2 text-xs font-semibold"><Calendar size={14} style={{ color: accent }} /> {has("calendar") ? "Pick a date and time" : "Book on WhatsApp"}</span>
            <span className="rounded-md px-2.5 py-1 text-[10px] font-semibold" style={{ background: accent, color: "#0b0b0b" }}>{has("payments") ? "Book and pay" : "Book"}</span>
          </div>
        );
      case "shop":
        return (
          <div>
            <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-[0.16em]" style={{ color: style.muted }}><ShoppingBag size={11} /> Shop</div>
            <div className="grid grid-cols-3 gap-2">
              {["K120", "K85", "K240"].map((p, i) => (
                <div key={p} className="p-2.5" style={{ ...cardStyle }}>
                  <div className="aspect-[4/3] mb-2" style={{ borderRadius: style.radius, background: `${accent}${["44", "66", "33"][i]}` }} />
                  <p className="text-[10px] font-semibold">Item {i + 1}</p>
                  <p className="text-[10px]" style={{ color: accent }}>{p}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "team":
        return (
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] mb-2" style={{ color: style.muted }}>The team</p>
            <div className="grid grid-cols-3 gap-2">
              {["Owner", "Manager", "Front desk"].map((r, i) => (
                <div key={r} className="p-3 text-center" style={{ ...cardStyle }}>
                  <span className="block w-9 h-9 mx-auto mb-2 rounded-full" style={{ background: `linear-gradient(${120 + i * 60}deg, ${accent}, ${style.muted})` }} />
                  <p className="text-[10px] font-semibold">{r}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "hours":
        return (
          <div className="p-3.5 flex items-start gap-3" style={{ ...cardStyle }}>
            <Clock size={14} className="shrink-0 mt-0.5" style={{ color: accent }} />
            <div className="text-[11px] space-y-0.5" style={{ color: style.muted }}>
              <p><span className="font-medium" style={{ color: style.fg }}>Monday to Friday</span> 08:00 to 17:00</p>
              <p><span className="font-medium" style={{ color: style.fg }}>Saturday</span> 09:00 to 13:00</p>
            </div>
          </div>
        );
      case "map":
        return (
          <div className="h-16 relative overflow-hidden flex items-center justify-center" style={{ borderRadius: style.radius, background: `repeating-linear-gradient(0deg, ${style.card} 0 10px, ${style.muted}22 10px 11px), repeating-linear-gradient(90deg, ${style.card} 0 10px, ${style.muted}22 10px 11px)` }}>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md" style={{ background: style.bg }}><MapPin size={12} style={{ color: accent }} /> Find us on Google Maps</span>
          </div>
        );
      case "cta":
        return (
          <div className="p-4 flex items-center justify-between gap-3" style={{ background: accent, color: "#0b0b0b", borderRadius: style.radius }}>
            <p className="text-xs font-bold">Ready when you are.</p>
            <span className="rounded-md px-3 py-1.5 text-[10px] font-semibold" style={{ background: "#0b0b0b", color: "#fff" }}>{has("whatsapp") ? "WhatsApp us" : "Get in touch"}</span>
          </div>
        );
      case "contact":
        return (
          <div className="p-3.5 space-y-1.5" style={{ ...cardStyle }}>
            <p className="text-[10px] uppercase tracking-[0.16em] mb-1" style={{ color: style.muted }}>Send us a message</p>
            {["Your name", "Your phone", "How can we help?"].map((f) => (
              <div key={f} className="text-[10px] px-2.5 py-1.5" style={{ border: `1px solid ${style.muted}44`, borderRadius: style.radius, color: style.muted }}>{f}</div>
            ))}
            <span className="inline-block rounded-md px-3 py-1.5 text-[10px] font-semibold" style={{ background: accent, color: "#0b0b0b" }}>Send</span>
          </div>
        );
      default:
        return null;
    }
  };

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
                <span className="inline-block w-8 h-px bg-accent" /> Design it yourself, or let Diyama AI start
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-[1.02] tracking-[-0.03em] mb-5">
                Design your website. Drag it into shape. <span className="text-gold-gradient whitespace-nowrap">Take it live.</span>
              </h1>
              <p className="text-lg text-white/70 leading-relaxed max-w-2xl">
                Describe your business and Diyama AI drafts the site, or pick every piece yourself. Drag the
                sections into the order you want. When you love it, choose how it goes live: on your own domain,
                at a Diyama address, or as a page among the brands we advertise.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide mx-auto grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 lg:gap-12 items-start">
          {/* Controls */}
          <div className="space-y-8">
            {/* Diyama AI assist */}
            <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-[hsl(173_70%_32%)] text-primary-foreground flex items-center justify-center shadow-md"><Wand2 size={15} /></span>
                <h2 className="font-display text-xl font-bold">Let Diyama AI design it</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Tell it about your business in a sentence or two. It picks the name, the look, the pages and the sections. You can change anything after.</p>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                rows={3}
                maxLength={600}
                placeholder="e.g. Kalulu Hardware in Kitwe. We sell building materials and tools, deliver in town and want people to order on WhatsApp."
                className="w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <button type="button" onClick={runAi} disabled={ai === "thinking" || brief.trim().length < 8} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60">
                  {ai === "thinking" ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} {ai === "thinking" ? "Designing" : "Design it for me"}
                </button>
                <AnimatePresence mode="wait">
                  {ai === "done" && (
                    <motion.span key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1.5 text-sm text-primary font-medium">
                      <CheckCircle size={15} /> Drafted. Look right, then adjust anything below.
                    </motion.span>
                  )}
                  {ai === "failed" && (
                    <motion.span key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-muted-foreground">
                      Diyama AI is not answering right now. Pick the pieces yourself below, it takes two minutes.
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

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
                    onChange={(e) => setD({ ...d, kind: e.target.value, cards: [] })}
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
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium">Your story, two sentences <span className="text-muted-foreground font-normal">(optional)</span></span>
                  <textarea
                    value={d.about}
                    onChange={(e) => setD({ ...d, about: e.target.value })}
                    placeholder={about}
                    maxLength={200}
                    rows={2}
                    className="mt-1.5 w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
              </div>
            </Step>

            <Step n="2" title="Look and feel">
              {/* Show us a site you like */}
              <div
                className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 sm:p-5 mb-5"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  void addRefs(e.dataTransfer.files);
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-md"><Camera size={16} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">Seen a website you like? Show us.</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                      Upload up to four screenshots. The mock-up takes on their colours straight away and Diyama AI reads the shape. Your demo is built to match them.
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) void addRefs(e.target.files);
                    e.target.value = "";
                  }}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {refs.map((r, i) => (
                    <div key={i} className="relative w-24 h-16 rounded-lg overflow-hidden border bg-muted group">
                      <img src={r.data} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover object-top" />
                      <button
                        type="button"
                        onClick={() => removeRef(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center"
                        aria-label={`Remove screenshot ${i + 1}`}
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                  {refs.length < MAX_REFS && (
                    <button
                      type="button"
                      onClick={() => fileInput.current?.click()}
                      disabled={refState === "reading"}
                      className="w-24 h-16 rounded-lg border-2 border-dashed border-primary/50 text-primary flex flex-col items-center justify-center gap-1 text-[11px] font-semibold hover:bg-primary/10 transition-colors disabled:opacity-60"
                    >
                      {refState === "reading" ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                      {refs.length ? "Add more" : "Add screenshots"}
                    </button>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <AnimatePresence mode="wait">
                    {refState === "looking" && (
                      <motion.span key="looking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1.5 text-primary font-medium">
                        <Loader2 size={13} className="animate-spin" /> Colours matched. Diyama AI is reading the shape of it.
                      </motion.span>
                    )}
                    {refState === "matched" && refs.length > 0 && (
                      <motion.span key="matched" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1.5 text-primary font-medium">
                        <Eye size={13} /> Matched. {d.lookNotes || "Your colours and layout are on the mock-up."}
                      </motion.span>
                    )}
                    {refState === "colours" && (
                      <motion.span key="colours" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-muted-foreground">
                        Colours matched. Diyama AI could not look right now, so pick the layout yourself below. Your screenshots still go with the order.
                      </motion.span>
                    )}
                    {refState === "failed" && (
                      <motion.span key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-muted-foreground">
                        That picture would not open. Try a JPG or PNG screenshot.
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <label className="block mt-3">
                  <span className="text-xs font-medium text-muted-foreground">Or the address of a site you like <span className="font-normal">(optional)</span></span>
                  <input
                    value={d.refUrl}
                    onChange={(e) => setD({ ...d, refUrl: e.target.value })}
                    placeholder="www.example.com"
                    maxLength={120}
                    inputMode="url"
                    className="mt-1 w-full rounded-lg border bg-card px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
              </div>

              {/* Layout */}
              <p className="text-sm font-medium mb-2">The shape of the page</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-5">
                {layouts.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setD({ ...d, layout: l.id })}
                    className={`text-left rounded-xl border p-2 transition-all hover:-translate-y-0.5 ${d.layout === l.id ? "border-primary ring-2 ring-primary/25 shadow-md" : "hover:border-primary/40"}`}
                  >
                    <LayoutSketch id={l.id} accent={accent} />
                    <span className="block text-xs font-semibold mt-2">{l.label}</span>
                    <span className="block text-[10px] text-muted-foreground leading-snug">{l.blurb}</span>
                  </button>
                ))}
              </div>

              {/* Style */}
              <p className="text-sm font-medium mb-2">The look</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {[...(matchLook ? [matchLook] : []), ...styles].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setD({ ...d, style: s.id })}
                    className={`text-left rounded-xl border p-3 transition-all hover:-translate-y-0.5 ${d.style === s.id ? "border-primary ring-2 ring-primary/25 shadow-md" : "hover:border-primary/40"}`}
                  >
                    <span className="block h-10 rounded-lg mb-2.5 overflow-hidden" style={{ background: s.bg }}>
                      <span className="block h-2 w-1/2 mt-3 ml-2 rounded-sm" style={{ background: s.id === MATCH && d.palette ? d.palette.accent : accent, fontFamily: s.serif ? "Georgia, serif" : undefined }} />
                      <span className="block h-1.5 w-2/3 mt-1.5 ml-2 rounded-sm" style={{ background: s.muted, opacity: 0.6 }} />
                    </span>
                    <span className="block text-sm font-semibold" style={{ fontFamily: s.serif ? "Georgia, 'Times New Roman', serif" : undefined }}>{s.label}</span>
                    <span className="block text-[11px] text-muted-foreground leading-snug">{s.blurb}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-medium mr-1">Your colour</span>
                {d.palette && (
                  <button
                    type="button"
                    aria-label="The colour from your screenshot"
                    title="From your screenshot"
                    onClick={() => setD({ ...d, accent: MATCH })}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ring-1 ring-foreground/20 ${d.accent === MATCH ? "ring-2 ring-offset-2 ring-foreground scale-110" : ""}`}
                    style={{ background: d.palette.accent }}
                  />
                )}
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

            <Step n="3" title="Pages and sections">
              <p className="text-sm text-muted-foreground mb-3">Home is always included. Tick the pages you need.</p>
              <div className="flex flex-wrap gap-2 mb-5">
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
              <p className="text-sm text-muted-foreground mb-3">
                Sections of the home page. Add what you want here, then <span className="font-medium text-foreground">drag them into order on the mock-up</span>.
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {sectionOptions.map((s) => {
                  const on = d.sections.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => (on ? removeSection(s.id) : addSection(s.id))}
                      className={`text-left rounded-xl border px-3.5 py-2.5 transition-all flex items-center gap-3 ${on ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "bg-card hover:border-primary/40"}`}
                    >
                      <span className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <s.icon size={14} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">{s.label}</span>
                        <span className="block text-[11px] text-muted-foreground">{s.blurb}</span>
                      </span>
                      <span className="ml-auto text-muted-foreground">{on ? <X size={14} /> : <Plus size={14} />}</span>
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

            <Step n="5" title="How it goes live">
              <div className="grid gap-3">
                {liveOptions.map((l) => {
                  const on = d.live === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setD({ ...d, live: l.id })}
                      className={`text-left rounded-2xl border p-4 sm:p-5 transition-all flex gap-4 ${on ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md" : "bg-card hover:border-primary/40"}`}
                    >
                      <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${on ? "bg-gradient-to-br from-primary to-[hsl(173_70%_32%)] text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`}>
                        <l.icon size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-display font-bold">{l.label}</span>
                          <span className={`text-xs font-semibold rounded-full px-2.5 py-1 shrink-0 ${on ? "bg-accent/20 text-foreground" : "bg-muted text-muted-foreground"}`}>
                            {l.id === "own" ? `From ${fmtK(est.total)}` : l.id === "sub" ? `${fmtK(sitePrices.diyamaAddressSetup)} + ${fmtK(sitePrices.diyamaAddressMonthly)}/mo` : `${fmtK(sitePrices.partnerPageSetup)} + ${fmtK(sitePrices.partnerPageMonthly)}/mo`}
                          </span>
                        </span>
                        <span className="block text-sm text-muted-foreground mt-1 leading-relaxed">{l.blurb}</span>
                        <span className="block text-xs mt-2 font-mono text-primary">{l.address(slug)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Step>

            {/* Estimate */}
            <div className="rounded-2xl bg-ink text-white p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
              {d.live === "own" ? (
                <>
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
                </>
              ) : (
                <>
                  <p className="eyebrow text-accent mb-3">{live.label}, from our price list</p>
                  <div className="flex items-end gap-3 mb-1">
                    <motion.span key={d.live} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl font-extrabold text-gold-gradient leading-none">
                      {fmtK(d.live === "sub" ? sitePrices.diyamaAddressSetup : sitePrices.partnerPageSetup)}
                    </motion.span>
                    <span className="text-white/60 text-sm pb-1">to set up</span>
                  </div>
                  <p className="font-display text-2xl font-bold leading-tight mb-4">
                    then {fmtK(d.live === "sub" ? sitePrices.diyamaAddressMonthly : sitePrices.partnerPageMonthly)} a month
                  </p>
                  <ul className="text-sm text-white/70 space-y-1.5 mb-5">
                    {(d.live === "sub"
                      ? ["Your design, built as it looks here", `Live at ${live.address(slug)}`, "Site Care and hosting in the monthly fee, from month one", "One round of changes, your content in one batch", "Move to your own domain later, your design and your set-up fee come with you"]
                      : ["Your design, built as one page", `Live at ${live.address(slug)}`, "Listed with the brands Diyama advertises", "In our monthly partners post, one small change a month", "Upgrade to a full site whenever you are ready, set-up fee credited"]
                    ).map((t) => (
                      <li key={t} className="flex items-start gap-2.5"><Check size={15} className="text-accent shrink-0 mt-0.5" /><span>{t}</span></li>
                    ))}
                  </ul>
                  {hostedBlocked.length > 0 && (
                    <p className="text-xs text-accent leading-relaxed mb-3">
                      {hostedBlocked.join(", ")} {hostedBlocked.length > 1 ? "need" : "needs"} a full build on your own domain. Pick that above, or drop {hostedBlocked.length > 1 ? "them" : "it"} and this package stands.
                    </p>
                  )}
                  <p className="text-xs text-white/50 leading-relaxed">
                    Set-up before it goes live, the monthly fee in advance. The written quote comes on WhatsApp before any work begins. Nothing is paid here.
                  </p>
                </>
              )}
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
                    <p className="eyebrow text-primary mb-2">Step 6</p>
                    <h3 className="font-display text-2xl font-bold">Order this design</h3>
                    <p className="text-sm text-muted-foreground mt-1">Going live as <span className="font-medium text-foreground">{live.label.toLowerCase()}</span>. Nothing is paid here. We send the written quote and build your demo first.</p>
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
                    <button type="button" onClick={openWhatsApp} disabled={sending} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border font-medium text-sm hover:bg-muted transition-colors disabled:opacity-60">
                      {sending ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />} Send on WhatsApp instead
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Live preview */}
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-3">
              <p className="eyebrow text-primary">Your site, live. Drag the blocks.</p>
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
                  {live.address(slug)}
                </span>
                {d.byAi && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5"><Sparkles size={10} /> Diyama AI</span>
                )}
              </div>
              <motion.div layout transition={{ type: "spring", stiffness: 220, damping: 28 }} className={`mx-auto overflow-hidden rounded-xl shadow-inner ${phone ? "max-w-[22rem]" : "w-full"}`}>
                <div style={{ background: style.bg, color: style.fg, fontFamily: font }} className="text-left">
                  {/* nav and hero, shaped by the layout */}
                  {layout.id === "cover" && (
                    <div className="relative overflow-hidden" style={{ minHeight: phone ? 300 : 320 }}>
                      <div className="absolute inset-0"><HeroArt icon={kindIcons[kind.id] ?? Sparkles} accent={accent} dark={onDark} radius="0px" aside /></div>
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.72) 100%)" }} />
                      <div className="relative flex items-center justify-between px-5 py-3.5 text-xs text-white">
                        <span className="font-bold text-sm truncate max-w-[45%]">{name}</span>
                        <div className={`gap-3 ${phone ? "hidden" : "hidden sm:flex"} text-white/80`}>{navPages.slice(0, 5).map((p) => <span key={p}>{p}</span>)}</div>
                        {navBtn}
                      </div>
                      <div className="relative px-5 pt-10 pb-7 text-white">
                        <p className="text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: accent }}>{kind.label}</p>
                        {heroTitle(true)}
                        <p className="text-xs mt-2 max-w-sm text-white/80">{heroSub}</p>
                        {heroBtns}
                      </div>
                    </div>
                  )}
                  {layout.id === "split" && (
                    <>
                      <div className="flex items-center justify-between px-5 py-3.5 text-xs" style={{ borderBottom: `1px solid ${style.muted}33` }}>
                        <span className="font-bold text-sm truncate max-w-[45%]">{name}</span>
                        {navLinks}
                        {navBtn}
                      </div>
                      <div className={`px-5 pt-7 pb-6 grid gap-5 items-center ${phone ? "grid-cols-1" : "grid-cols-[1.1fr_0.9fr]"}`}>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: accent }}>{kind.label}</p>
                          {heroTitle()}
                          <p className="text-xs mt-2 max-w-sm" style={{ color: style.muted }}>{heroSub}</p>
                          {heroBtns}
                        </div>
                        <div className={phone ? "h-36" : "h-44"}>{heroArt}</div>
                      </div>
                    </>
                  )}
                  {layout.id === "centred" && (
                    <>
                      <div className="px-5 pt-4 pb-3 text-center text-xs" style={{ borderBottom: `1px solid ${style.muted}33` }}>
                        <span className="block font-bold text-sm">{name}</span>
                        <div className={`justify-center gap-3 mt-1.5 ${phone ? "hidden" : "hidden sm:flex"}`} style={{ color: style.muted }}>{navPages.slice(0, 5).map((p) => <span key={p}>{p}</span>)}</div>
                      </div>
                      <div className="px-5 pt-8 pb-3 text-center">
                        <p className="text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: accent }}>{kind.label}</p>
                        <div className="max-w-md mx-auto">{heroTitle(true)}</div>
                        <p className="text-xs mt-2 max-w-sm mx-auto" style={{ color: style.muted }}>{heroSub}</p>
                        {heroBtns}
                      </div>
                      <div className="px-5 pb-6"><div className={phone ? "h-32" : "h-40"}>{heroArt}</div></div>
                    </>
                  )}
                  {layout.id === "editorial" && (
                    <>
                      <div className="px-5 pt-4 pb-3 text-center" style={{ borderBottom: `1px solid ${style.muted}55` }}>
                        <span className="block font-bold text-base tracking-wide">{name}</span>
                        <div className={`justify-center gap-4 mt-2 ${phone ? "hidden" : "hidden sm:flex"} text-[10px] uppercase tracking-[0.16em]`} style={{ color: style.muted }}>{navPages.slice(0, 5).map((p) => <span key={p}>{p}</span>)}</div>
                      </div>
                      <div className="px-5 pt-7 pb-6">
                        <p className="text-[10px] uppercase tracking-[0.22em] mb-3" style={{ color: style.muted }}>{kind.label} · Zambia</p>
                        <AnimatePresence mode="wait">
                          <motion.h2 key={tagline + "ed"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`font-bold leading-[1.05] tracking-tight ${phone ? "text-3xl" : "text-[2.6rem]"}`}>
                            {tagline}
                          </motion.h2>
                        </AnimatePresence>
                        <div className="my-4 h-px" style={{ background: `${style.muted}66` }} />
                        <div className={`grid gap-5 items-start ${phone ? "grid-cols-1" : "grid-cols-[1fr_0.8fr]"}`}>
                          <div>
                            <p className="text-xs leading-relaxed max-w-sm" style={{ color: style.muted }}>{heroSub} {about}</p>
                            {heroBtns}
                          </div>
                          <div className={phone ? "h-28" : "h-36"}>{heroArt}</div>
                        </div>
                      </div>
                    </>
                  )}
                  {layout.id === "stack" && (
                    <>
                      <div className="flex items-center justify-between px-5 py-3.5 text-xs" style={{ borderBottom: `1px solid ${style.muted}33` }}>
                        <span className="font-bold text-sm truncate max-w-[45%]">{name}</span>
                        {navLinks}
                        {navBtn}
                      </div>
                      <div className="relative px-5 pt-8 pb-7 overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl opacity-40" style={{ background: accent }} />
                        <p className="text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: accent }}>{kind.label}</p>
                        {heroTitle()}
                        <p className="text-xs mt-2 max-w-sm" style={{ color: style.muted }}>{heroSub}</p>
                        {heroBtns}
                      </div>
                    </>
                  )}

                  {/* the draggable blocks */}
                  <Reorder.Group axis="y" values={d.sections} onReorder={(sections) => setD({ ...d, sections })} className="px-5 pb-2 space-y-3 list-none m-0">
                    <AnimatePresence initial={false}>
                      {d.sections.map((id) => (
                        <Block key={id} id={id} label={sectionOptions.find((s) => s.id === id)?.label ?? id} muted={style.muted} onRemove={() => removeSection(id)}>
                          {renderSection(id)}
                        </Block>
                      ))}
                    </AnimatePresence>
                  </Reorder.Group>
                  {d.sections.length === 0 && (
                    <p className="px-5 pb-5 text-[11px]" style={{ color: style.muted }}>Add sections below and they appear here.</p>
                  )}

                  {/* footer */}
                  <div className="px-5 py-3.5 mt-2 flex items-center justify-between text-[10px]" style={{ borderTop: `1px solid ${style.muted}33`, color: style.muted }}>
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

              {/* add a section */}
              {notYet.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground mr-1 inline-flex items-center gap-1"><Plus size={12} /> Add a block</span>
                  {notYet.map((s) => (
                    <button key={s.id} type="button" onClick={() => addSection(s.id)} className="inline-flex items-center gap-1 rounded-full border bg-card px-2.5 py-1 text-[11px] font-medium hover:border-primary/50 hover:text-primary transition-colors">
                      <s.icon size={11} /> {s.label}
                    </button>
                  ))}
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

/* The hero picture: a tinted panel with the business kind drawn on it, where the
   customer's own photo goes on the real site. */
const HeroArt = ({ icon: Icon, accent, dark, radius, aside = false }: { icon: LucideIcon; accent: string; dark: boolean; radius: string; aside?: boolean }) => (
  <div
    className="relative w-full h-full overflow-hidden"
    style={{
      borderRadius: radius,
      background: `radial-gradient(circle at 30% 30%, ${accent} 0%, ${accent}bb 35%, ${dark ? "#1a1a1a" : "#2a2a2a"} 100%)`,
    }}
  >
    <div className="absolute inset-0 opacity-25" style={{ backgroundImage: `repeating-linear-gradient(135deg, transparent 0 14px, rgba(255,255,255,0.18) 14px 15px)` }} />
    <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full opacity-40" style={{ background: "rgba(255,255,255,0.25)" }} />
    <div className={`absolute inset-0 flex text-white/90 ${aside ? "items-end justify-end pb-6 pr-6 opacity-50" : "items-center justify-center"}`}>
      <Icon size={aside ? 56 : 40} strokeWidth={1.2} />
    </div>
    <span className="absolute bottom-2 left-3 text-[9px] uppercase tracking-[0.16em] text-white/70">Your photo here</span>
  </div>
);

/* A thumbnail of each page shape for the layout picker. */
const LayoutSketch = ({ id, accent }: { id: string; accent: string }) => {
  const line = (w: string, extra = "") => <span className={`block h-1 rounded-sm bg-foreground/50 ${extra}`} style={{ width: w }} />;
  const pic = (cls: string) => <span className={`block rounded-sm ${cls}`} style={{ background: `${accent}99` }} />;
  return (
    <span className="block h-14 rounded-md bg-muted border p-1.5 overflow-hidden">
      {id === "split" && (
        <span className="grid grid-cols-2 gap-1 h-full">
          <span className="space-y-1 pt-1">{line("90%")}{line("70%")}<span className="block h-1.5 w-5 rounded-sm" style={{ background: accent }} /></span>
          {pic("h-full")}
        </span>
      )}
      {id === "cover" && (
        <span className="relative block h-full rounded-sm overflow-hidden" style={{ background: `${accent}99` }}>
          <span className="absolute left-1 bottom-1 space-y-0.5"><span className="block h-1 w-8 rounded-sm bg-white/90" /><span className="block h-0.5 w-5 rounded-sm bg-white/70" /></span>
        </span>
      )}
      {id === "centred" && (
        <span className="flex flex-col items-center gap-1 h-full pt-0.5">
          {line("60%")}{line("40%")}
          {pic("w-full flex-1")}
        </span>
      )}
      {id === "editorial" && (
        <span className="block h-full space-y-1">
          <span className="block h-2 w-full rounded-sm bg-foreground/60" />
          <span className="block h-px w-full bg-foreground/30" />
          <span className="grid grid-cols-[1fr_0.7fr] gap-1"><span className="space-y-0.5 pt-0.5">{line("100%")}{line("80%")}</span>{pic("h-5")}</span>
        </span>
      )}
      {id === "stack" && (
        <span className="block h-full space-y-1 pt-1">{line("85%")}{line("55%")}<span className="block h-1.5 w-5 rounded-sm" style={{ background: accent }} /></span>
      )}
    </span>
  );
};

/* One draggable block of the mock-up. The grip handle starts the drag so text in
   the block can still be selected; the cross removes it. */
const Block = ({ id, label, muted, onRemove, children }: { id: string; label: string; muted: string; onRemove: () => void; children: React.ReactNode }) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={id}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileDrag={{ scale: 1.02, boxShadow: "0 18px 40px rgba(0,0,0,0.35)", zIndex: 5 }}
      className="relative group rounded-lg"
    >
      <div className="absolute -left-1 top-1 bottom-1 w-6 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
        <span
          onPointerDown={(e) => controls.start(e)}
          className="cursor-grab active:cursor-grabbing touch-none rounded-md p-0.5"
          style={{ color: muted, background: `${muted}22` }}
          title={`Drag ${label}`}
          aria-label={`Drag ${label}`}
        >
          <GripVertical size={13} />
        </span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10 shadow"
        title={`Remove ${label}`}
        aria-label={`Remove ${label}`}
      >
        <X size={11} />
      </button>
      {children}
    </Reorder.Item>
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
