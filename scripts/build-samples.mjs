// Sample websites for diyama.online/build. Writes public/samples/<id>/index.html.
//
//   node scripts/build-samples.mjs
//
// Ernest, 13 Nov 2026: the first samples were thumbnails that "won't attract any buyer".
// These are full pages a visitor can open and scroll. Built to Ernest's design language
// (workforce/engine/art/ERNEST-DESIGN-LANGUAGE.md): one colour world per business matched
// to the subject, the hero IS the subject, one headline with an accent word, one sub line,
// three to five points with a device, one button, the contact line, the logo in the corner.
// No two samples share a colour world; no layout is used more than twice.
//
// Brand names are the trade itself ("The Lodge"), never a made up business. Prices are
// sample figures for the sample business, never Diyama's prices. Photos: Unsplash licence.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "samples");
const img = (id, w = 1600, h) => `https://images.unsplash.com/photo-${id}?w=${w}${h ? `&h=${h}` : ""}&q=70&auto=format&fit=crop`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export const SAMPLES = [
  {
    id: "lodge", kind: "lodge", title: "Safari lodge", brand: "The Lodge", mark: "TL", layout: "cover",
    fonts: { head: "Cormorant Garamond", headW: "600", body: "Jost", url: "Cormorant+Garamond:wght@500;600;700&family=Jost:wght@400;500;600" },
    c: { bg: "#F6F1E7", ink: "#1E2A1F", soft: "#5E6B5A", card: "#FFFFFF", line: "#E4DCCB", accent: "#B5793A", accent2: "#2F4A33", onAccent: "#FFFFFF", heroInk: "#FFFFFF" },
    radius: "4px",
    hero: "1667987566780-3b31fa5485c8",
    kicker: "On the river, in the bush",
    h1: ["Wake up to the", "wild", ". Book direct."], sub: "Six thatched chalets above the water, game drives at dawn, dinner under the stars.",
    points: ["Best rate when you book direct", "Breakfast and dinner included", "Airport transfers on request"], device: "check",
    cta: "Check your dates",
    offerTitle: "Rooms and rates", offerKicker: "Stay",
    offer: [
      { name: "River chalet", desc: "King bed, private deck over the water", price: "K2,400", per: "per night", img: "1607712617949-8c993d290809" },
      { name: "Family suite", desc: "Two rooms, sleeps four, plunge pool", price: "K3,900", per: "per night", img: "1781039869379-5561fe260d26" },
      { name: "Game drive", desc: "Three hours at dawn with a guide", price: "K650", per: "per guest", img: "1789643121078-0d00f7a4cdd1" },
    ],
    whyTitle: "Why guests come back", why: ["Every chalet faces the river", "Guides who grew up here", "Meals from the lodge garden", "WhatsApp us, a person answers"],
    gallery: ["1777872721419-f738c532df1f", "1779216175784-a67b6da108bb", "1779218449605-792bf0bef5e0"],
    band: "Your dates, confirmed on WhatsApp in minutes.",
  },
  {
    id: "salon", kind: "salon", title: "Hair and beauty studio", brand: "The Studio", mark: "S", layout: "split",
    fonts: { head: "Playfair Display", headW: "700", body: "Manrope", url: "Playfair+Display:ital,wght@0,600;0,700;1,600&family=Manrope:wght@400;500;700" },
    c: { bg: "#FBF4FA", ink: "#2B1631", soft: "#6D5A72", card: "#FFFFFF", line: "#EEDCEB", accent: "#C2408A", accent2: "#7B4BB7", onAccent: "#FFFFFF", heroInk: "#2B1631" },
    radius: "22px",
    hero: "1761839256791-6a93f89fb8b0",
    kicker: "Hair, nails, lashes",
    h1: ["Leave feeling", "brand new", "."], sub: "Braids, silk press, gel nails and lashes by stylists who listen first.",
    points: ["Book your slot online", "Walk-ins welcome before noon", "Products for every hair type"], device: "pill",
    cta: "Book your slot",
    offerTitle: "Price list", offerKicker: "Services",
    offer: [
      { name: "Knotless braids", desc: "Medium length, about four hours", price: "K450", per: "from", img: "1634449571010-02389ed0f9b0" },
      { name: "Silk press", desc: "Wash, treatment and press", price: "K300", per: "from", img: "1605497788044-5a32c7078486" },
      { name: "Gel nails", desc: "Hands, any colour, two weeks shine", price: "K180", per: "from", img: "1595475884562-073c30d45670" },
    ],
    whyTitle: "How a visit goes", why: ["Pick a time on your phone", "We confirm on WhatsApp", "Tea while you wait, if you wait at all", "Photos before you leave"],
    gallery: ["1560869713-7d0a29430803", "1554519934-e32b1629d9ee", "1580618672591-eb180b1a973f"],
    band: "Your next appointment is two taps away.",
  },
  {
    id: "clinic", kind: "clinic", title: "Dental or family clinic", brand: "The Clinic", mark: "+", layout: "centred",
    fonts: { head: "Plus Jakarta Sans", headW: "800", body: "Plus Jakarta Sans", url: "Plus+Jakarta+Sans:wght@400;500;700;800" },
    c: { bg: "#F2F8FC", ink: "#0C2A43", soft: "#4F6B82", card: "#FFFFFF", line: "#DCEAF4", accent: "#1A83C9", accent2: "#14B8A6", onAccent: "#FFFFFF", heroInk: "#0C2A43" },
    radius: "16px",
    hero: "1598256989800-fe5f95da9787",
    kicker: "Open six days a week",
    h1: ["Care you can", "trust", ", close to home."], sub: "Check-ups, cleaning, fillings and family visits, booked online and seen on time.",
    points: ["Same day appointments", "Medical aid accepted", "Reminders on WhatsApp"], device: "number",
    cta: "Book a visit",
    offerTitle: "What we do", offerKicker: "Services",
    offer: [
      { name: "Check-up and clean", desc: "Exam, scale and polish, advice", price: "K350", per: "per visit", img: "1606811841689-23dfddce3e95" },
      { name: "Fillings", desc: "Tooth coloured, done in one visit", price: "K500", per: "from", img: "1629909613654-28e377c37b09" },
      { name: "Whitening", desc: "In-chair, one hour", price: "K1,800", per: "per session", img: "1677026010083-78ec7f1b84ed" },
    ],
    whyTitle: "Your visit, step by step", why: ["Book online or on WhatsApp", "A reminder the day before", "Seen at your time, not later", "A written plan to take home"],
    gallery: ["1629909613654-28e377c37b09", "1606811971618-4486d14f3f99", "1489278353717-f64c6ee8a4d2"],
    band: "Your appointment, booked before the kettle boils.",
  },
  {
    id: "carhire", kind: "transport", title: "Car hire", brand: "Drive Hire", mark: "DH", layout: "split",
    fonts: { head: "Archivo", headW: "800", body: "Archivo", url: "Archivo:wght@400;500;700;800;900" },
    c: { bg: "#0B1A2E", ink: "#FFFFFF", soft: "#A9B8CC", card: "#12243D", line: "#1E3452", accent: "#FFC233", accent2: "#3D8BFF", onAccent: "#0B1A2E", heroInk: "#FFFFFF" },
    radius: "10px", dark: true,
    hero: "1506015391300-4802dc74de2e",
    kicker: "Self drive or with a driver",
    h1: ["Clean cars,", "honest", " rates, ready today."], sub: "Sedans, SUVs and 4x4s by the day or the week. Delivered to your door or the airport.",
    points: ["Unlimited kilometres in town", "Full insurance included", "Airport pick up and drop off"], device: "check",
    cta: "Get a quote",
    offerTitle: "The fleet", offerKicker: "Rates",
    offer: [
      { name: "Sedan", desc: "Four seats, automatic, air con", price: "K850", per: "per day", img: "1519641471654-76ce0107ad1b" },
      { name: "SUV", desc: "Seven seats, room for luggage", price: "K1,400", per: "per day", img: "1533473359331-0135ef1b58bf" },
      { name: "4x4", desc: "For gravel roads and parks", price: "K1,900", per: "per day", img: "1618353482480-61ca5a9a7879" },
    ],
    whyTitle: "Booking takes three steps", why: ["Pick a car and your dates", "Send your licence on WhatsApp", "We deliver the car to you"],
    gallery: ["1757922589576-129377dadac9", "1650959818516-03d68079f9a0", "1615063029891-497bebd4f03c"],
    band: "Tell us your dates. We reply with a price in minutes.",
  },
  {
    id: "training", kind: "school", title: "Training centre", brand: "The Academy", mark: "A", layout: "centred",
    fonts: { head: "Space Grotesk", headW: "700", body: "Inter", url: "Space+Grotesk:wght@500;700&family=Inter:wght@400;500;700" },
    c: { bg: "#FFFBEA", ink: "#111111", soft: "#4A4A4A", card: "#FFFFFF", line: "#F0E3A6", accent: "#F5C400", accent2: "#111111", onAccent: "#111111", heroInk: "#111111" },
    radius: "0px", highlight: true,
    hero: "1524178232363-1fb2b075b655",
    kicker: "New intake every month",
    h1: ["Learn a skill that", "pays", "."], sub: "Short practical courses with a certificate, taught by people who do the work every day.",
    points: ["Evening and weekend classes", "Pay in instalments", "Certificate on completion"], device: "number",
    cta: "Enrol now",
    offerTitle: "Courses and fees", offerKicker: "Courses",
    offer: [
      { name: "Bookkeeping basics", desc: "Six weeks, Saturdays", price: "K1,200", per: "full course", img: "1558008258-3256797b43f3" },
      { name: "Digital marketing", desc: "Four weeks, evenings", price: "K1,500", per: "full course", img: "1542626991-cbc4e32524cc" },
      { name: "Computer skills", desc: "Eight weeks, beginner friendly", price: "K900", per: "full course", img: "1503428593586-e225b39bddfe" },
    ],
    whyTitle: "How enrolment works", why: ["Choose a course", "Pay the deposit", "Start with the next intake", "Graduate with a certificate", "Join the alumni group"],
    gallery: ["1559223607-a43c990c692c", "1758691736493-aa6d22c0f8a6", "1664382953481-141e97ad9825"],
    band: "Seats are limited. Reserve yours today.",
  },
  {
    id: "boutique", kind: "shop", title: "Fashion boutique", brand: "The Boutique", mark: "B", layout: "editorial",
    fonts: { head: "Bodoni Moda", headW: "600", body: "Karla", url: "Bodoni+Moda:ital,wght@0,500;0,600;1,500&family=Karla:wght@400;500;700" },
    c: { bg: "#0D0C0A", ink: "#F5EFE3", soft: "#ABA393", card: "#171511", line: "#2A261F", accent: "#D4AF37", accent2: "#F5EFE3", onAccent: "#0D0C0A", heroInk: "#F5EFE3" },
    radius: "0px", dark: true,
    hero: "1441986300917-64674bd600d8",
    kicker: "New in this week",
    h1: ["Dressed for the", "moment", "."], sub: "Dresses, suits, shoes and bags picked for this season. Order online, delivered in town.",
    points: ["New pieces every Friday", "Delivery in town, same day", "Easy exchanges in seven days"], device: "pill",
    cta: "Shop new arrivals",
    offerTitle: "This week's edit", offerKicker: "Shop",
    offer: [
      { name: "Linen two piece", desc: "Sand, sizes 8 to 18", price: "K1,150", per: "", img: "1441984904996-e0b6ba687e04" },
      { name: "Evening dress", desc: "Emerald, floor length", price: "K1,600", per: "", img: "1603400521630-9f2de124b33b" },
      { name: "Leather tote", desc: "Black or tan, gold hardware", price: "K950", per: "", img: "1567401893414-76b7b1e5a7a5" },
    ],
    whyTitle: "Shopping with us", why: ["Order on the site or on WhatsApp", "Pay by mobile money or card", "Delivered to your door"],
    gallery: ["1570857502809-08184874388e", "1445205170230-053b83016050", "1555529771-835f59fc5efe"],
    band: "Be first to see the Friday drop.",
  },
  {
    id: "builder", kind: "pro", title: "Building contractor", brand: "Build Co.", mark: "BC", layout: "diagonal",
    fonts: { head: "Oswald", headW: "600", body: "Source Sans 3", url: "Oswald:wght@500;600;700&family=Source+Sans+3:wght@400;600;700" },
    c: { bg: "#EDEDEB", ink: "#1C1C1C", soft: "#5A5A57", card: "#FFFFFF", line: "#D6D6D2", accent: "#F26B1D", accent2: "#1C1C1C", onAccent: "#FFFFFF", heroInk: "#FFFFFF" },
    radius: "2px",
    hero: "1580587771525-78b9dba3b914",
    kicker: "Houses, extensions, renovations",
    h1: ["Built right,", "handed over", " on time."], sub: "From foundation to roof, one team, one price agreed up front, weekly photo updates.",
    points: ["Fixed written quotes", "Weekly progress photos", "Twelve month workmanship guarantee"], device: "number",
    cta: "Get a quote",
    offerTitle: "What we build", offerKicker: "Services",
    offer: [
      { name: "New houses", desc: "Plans, approvals and the build", price: "Quote", per: "per project", img: "1512917774080-9991f1c4c750" },
      { name: "Extensions", desc: "Extra rooms, a second storey", price: "Quote", per: "per project", img: "1587582423116-ec07293f0395" },
      { name: "Renovations", desc: "Kitchens, bathrooms, roofs", price: "Quote", per: "per project", img: "1503387762-592deb58ef4e" },
    ],
    whyTitle: "How a project runs", why: ["Site visit and measurements", "A fixed written quote", "Build with weekly photos", "Handover and guarantee"],
    gallery: ["1504307651254-35680f356dfd", "1508450859948-4e04fabaa4ea", "1773430272653-375174373c4f"],
    band: "Send us your plan. We reply with a site visit date.",
  },
  {
    id: "restaurant", kind: "restaurant", title: "Restaurant", brand: "The Kitchen", mark: "K", layout: "cover",
    fonts: { head: "Fraunces", headW: "600", body: "Outfit", url: "Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Outfit:wght@400;500;600" },
    c: { bg: "#FFF8F2", ink: "#2A0F0F", soft: "#6E5452", card: "#FFFFFF", line: "#F1E1D6", accent: "#E4572E", accent2: "#7A1C1C", onAccent: "#FFFFFF", heroInk: "#FFFFFF" },
    radius: "14px",
    hero: "1504674900247-0877df9cc836",
    kicker: "Lunch and dinner, seven days",
    h1: ["Food worth the", "trip", "."], sub: "Fresh from the grill and the garden, plated with care. Book a table or order ahead.",
    points: ["Book a table in one tap", "Order ahead for pickup", "Private dining for groups"], device: "pill",
    cta: "Book a table",
    offerTitle: "From the menu", offerKicker: "Menu",
    offer: [
      { name: "Grilled bream", desc: "Lemon butter, garden greens", price: "K185", per: "", img: "1467003909585-2f8a72700288" },
      { name: "Steak and chips", desc: "300g rump, pepper sauce", price: "K240", per: "", img: "1466978913421-dad2ebd01d17" },
      { name: "Breakfast plate", desc: "Eggs, toast, avocado, served till 11", price: "K120", per: "", img: "1482049016688-2d3e1b311543" },
    ],
    whyTitle: "Why people book us", why: ["Everything cooked to order", "Seating inside and in the garden", "Space for birthdays and teams"],
    gallery: ["1414235077428-338989a2e8c0", "1484723091739-30a097e8f929", "1783447036642-90a65ff85a0f"],
    band: "Your table is waiting. Tell us when.",
  },
];

const device = (kind, i, c) => {
  if (kind === "number") return `<b class="dv num">${String(i + 1).padStart(2, "0")}</b>`;
  if (kind === "pill") return `<b class="dv pill"></b>`;
  return `<b class="dv chk"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></b>`;
};

function page(s) {
  const c = s.c;
  const h1 = `${esc(s.h1[0])} <em>${esc(s.h1[1])}</em>${esc(s.h1[2])}`;
  const pts = s.points.map((p, i) => `<li>${device(s.device, i, c)}<span>${esc(p)}</span></li>`).join("");
  const offer = s.offer.map((o) => `
      <article class="card reveal">
        <div class="ph"><img loading="lazy" src="${img(o.img, 900, 640)}" alt="${esc(o.name)}"></div>
        <div class="bd"><h3>${esc(o.name)}</h3><p>${esc(o.desc)}</p>
          <div class="row"><span class="price">${esc(o.price)}${o.per ? ` <small>${esc(o.per)}</small>` : ""}</span><a class="mini" href="#book">Book</a></div></div>
      </article>`).join("");
  const why = s.why.map((w, i) => `<li class="reveal"><b>${String(i + 1).padStart(2, "0")}</b><span>${esc(w)}</span></li>`).join("");
  const gal = s.gallery.map((g, i) => `<figure class="g${i} reveal"><img loading="lazy" src="${img(g, 1000, 760)}" alt="${esc(s.title)} photo ${i + 1}"></figure>`).join("");
  const heroImg = `<img class="hero-img" src="${img(s.hero, 1800)}" alt="${esc(s.title)}" fetchpriority="high">`;
  const heroText = `
      <span class="kicker">${esc(s.kicker)}</span>
      <h1>${h1}</h1>
      <p class="sub">${esc(s.sub)}</p>
      <ul class="points">${pts}</ul>
      <div class="ctas"><a class="btn" href="#book">${esc(s.cta)}</a><a class="btn ghost" href="#offer">${esc(s.offerTitle)}</a></div>`;
  let hero;
  if (s.layout === "cover") hero = `<section class="hero cover">${heroImg}<div class="wrap"><div class="ht">${heroText}</div></div></section>`;
  else if (s.layout === "split") hero = `<section class="hero split"><div class="wrap grid2"><div class="ht">${heroText}</div><div class="hp">${heroImg}</div></div></section>`;
  else if (s.layout === "centred") hero = `<section class="hero centred"><div class="wrap"><div class="ht">${heroText}</div><div class="hp">${heroImg}</div></div></section>`;
  else if (s.layout === "editorial") hero = `<section class="hero editorial"><div class="wrap"><div class="ht">${heroText}</div><div class="hp">${heroImg}</div></div></section>`;
  else hero = `<section class="hero diagonal">${heroImg}<div class="slab"></div><div class="wrap"><div class="ht">${heroText}</div></div></section>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(s.title)} sample website | Diyama Solutions</title>
<meta name="description" content="A sample ${esc(s.title.toLowerCase())} website by Diyama Solutions. Start from this design on diyama.online/build.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="${c.bg}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${s.fonts.url}&display=swap">
<link rel="preload" as="image" href="${img(s.hero, 1800)}">
<style>
:root{--bg:${c.bg};--ink:${c.ink};--soft:${c.soft};--card:${c.card};--line:${c.line};--accent:${c.accent};--accent2:${c.accent2};--on:${c.onAccent};--hink:${c.heroInk};--r:${s.radius};
--head:"${s.fonts.head}",Georgia,serif;--body:"${s.fonts.body}",system-ui,sans-serif;color-scheme:${s.dark ? "dark" : "light"}}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--body);font-size:16.5px;line-height:1.6;-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%}a{color:inherit}
.wrap{max-width:1180px;margin:0 auto;padding-inline:20px}
h1,h2,h3{font-family:var(--head);font-weight:${s.fonts.headW};line-height:1.05;margin:0;letter-spacing:-.01em}
em{font-style:normal;color:var(--accent)}${s.highlight === true ? "em{color:var(--ink);background:var(--accent);padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone}.kicker{color:var(--ink)}" : ""}
.kicker{display:inline-block;font-size:12.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:15px 26px;border-radius:${s.radius === "0px" ? "0" : "999px"};background:var(--accent);color:var(--on);font-weight:700;text-decoration:none;border:2px solid var(--accent);transition:transform .15s ease,filter .15s ease}
.btn:hover{filter:brightness(1.07);transform:translateY(-1px)}
.btn.ghost{background:transparent;color:inherit;border-color:currentColor;opacity:.9}
.demo{background:var(--ink);color:var(--bg);font-size:13px;text-align:center;padding:9px 16px;line-height:1.4}
.demo a{color:var(--accent);font-weight:700;text-decoration:none;white-space:nowrap}
nav.top{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
nav.top .wrap{display:flex;align-items:center;justify-content:space-between;height:66px;gap:14px}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;font-family:var(--head);font-weight:${s.fonts.headW};font-size:21px}
.logo i{font-style:normal;width:38px;height:38px;border-radius:${s.radius === "0px" ? "0" : "50%"};display:grid;place-items:center;background:var(--accent);color:var(--on);font-family:var(--body);font-size:13px;font-weight:800;letter-spacing:.02em}
.links{display:none;gap:26px;font-weight:500;font-size:15px}.links a{text-decoration:none;opacity:.8}.links a:hover{opacity:1;color:var(--accent)}
nav.top .btn{padding:10px 18px;font-size:14.5px}
.hero{position:relative}
.hero h1{font-size:clamp(42px,7.4vw,84px);margin-bottom:18px}
.hero .sub{font-size:clamp(17px,2vw,20px);max-width:36ch;margin:0 0 22px;opacity:.88}
.points{list-style:none;padding:0;margin:0 0 28px;display:grid;gap:10px}
.points li{display:flex;align-items:center;gap:12px;font-weight:500}
.dv{flex:none;display:grid;place-items:center;color:var(--on);background:var(--accent)}
.dv.chk{width:26px;height:26px;border-radius:50%}
.dv.num{width:34px;height:34px;border-radius:${s.radius === "0px" ? "0" : "10px"};font-size:13px;font-weight:800;font-family:var(--body)}
.dv.pill{width:28px;height:10px;border-radius:99px}
.ctas{display:flex;flex-wrap:wrap;gap:12px}
.hero-img{width:100%;height:100%;object-fit:cover}
/* cover */
.cover{min-height:min(92vh,820px);display:flex;align-items:flex-end;color:var(--hink);overflow:hidden;isolation:isolate}
.cover .hero-img{position:absolute;inset:0;z-index:-2;animation:drift 20s ease-in-out infinite alternate}
.cover::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.25) 40%,rgba(0,0,0,.72))}
.cover .wrap{width:100%;padding-block:140px 64px}.cover .ht{max-width:720px}.cover .kicker{color:#fff;opacity:.9}.cover em{color:var(--accent)}
.cover .dv{box-shadow:0 0 0 4px rgba(255,255,255,.15)}
@keyframes drift{from{transform:scale(1.03)}to{transform:scale(1.12)}}
/* split */
.split .grid2{display:grid;gap:34px;padding-block:44px 64px;align-items:center}
.split .hp{border-radius:var(--r);overflow:hidden;aspect-ratio:4/5;max-height:640px;box-shadow:0 30px 60px -30px rgba(0,0,0,.45)}
/* centred */
.centred .wrap{padding-block:64px 40px;text-align:center}.centred .ht{max-width:860px;margin:0 auto}
.centred .sub{margin-inline:auto}.centred .points{justify-content:center;grid-template-columns:repeat(auto-fit,minmax(200px,max-content));gap:12px 26px}.centred .ctas{justify-content:center}
.centred .hp{margin-top:46px;border-radius:var(--r);overflow:hidden;aspect-ratio:16/8}
/* editorial */
.editorial .wrap{padding-block:56px 40px}
.editorial h1{font-size:clamp(52px,10vw,132px);font-style:italic;border-bottom:1px solid var(--line);padding-bottom:22px}
.editorial .hp{margin-top:36px;aspect-ratio:16/8;overflow:hidden}
/* diagonal */
.diagonal{min-height:min(90vh,780px);display:flex;align-items:center;overflow:hidden;color:var(--hink);isolation:isolate}
.diagonal .hero-img{position:absolute;inset:0;z-index:-3}
.diagonal .slab{position:absolute;inset:0;z-index:-2;background:var(--ink);clip-path:polygon(0 0,72% 0,46% 100%,0 100%);opacity:.94}
.diagonal .slab::after{content:"";position:absolute;inset:0;background:var(--accent);clip-path:polygon(72% 0,75% 0,49% 100%,46% 100%)}
.diagonal .wrap{width:100%;padding-block:100px}.diagonal .ht{max-width:560px}.diagonal h1{text-transform:uppercase}
/* sections */
section.s{padding-block:clamp(64px,9vw,112px)}
.head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:16px;margin-bottom:30px}
.head h2{font-size:clamp(34px,5vw,58px)}
.cards{display:grid;gap:18px}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;display:flex;flex-direction:column}
.card .ph{aspect-ratio:4/3;overflow:hidden}.card .ph img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease}.card:hover .ph img{transform:scale(1.05)}
.card .bd{padding:20px 20px 22px;display:grid;gap:6px}.card h3{font-size:24px}.card p{margin:0;color:var(--soft)}
.row{display:flex;justify-content:space-between;align-items:center;margin-top:10px}
.price{font-weight:800;font-size:20px;color:var(--accent)}.price small{font-weight:500;font-size:13px;color:var(--soft)}
.mini{font-weight:700;font-size:14px;text-decoration:none;border-bottom:2px solid var(--accent);padding-bottom:2px}
.why{background:var(--accent2);color:${c.accent2 === "#F5EFE3" ? "#0D0C0A" : "#FFFFFF"}}
.why .kicker{color:inherit;opacity:.75}
.why ol{list-style:none;padding:0;margin:0;display:grid;gap:14px}
.why li{display:flex;gap:18px;align-items:center;font-size:clamp(18px,2.2vw,23px);font-weight:600;padding:18px 0;border-top:1px solid rgba(127,127,127,.35)}
.why li b{font-family:var(--head);font-size:clamp(30px,4vw,44px);color:var(--accent);min-width:64px}
.gallery{display:grid;gap:12px;grid-template-columns:1fr 1fr}
.gallery figure{margin:0;overflow:hidden;border-radius:var(--r)}.gallery img{width:100%;height:100%;object-fit:cover;aspect-ratio:4/3}
.gallery .g0{grid-column:1/-1}.gallery .g0 img{aspect-ratio:16/8}
.band{text-align:center}.band h2{font-size:clamp(32px,5vw,56px);max-width:18ch;margin:0 auto 26px}
.band .box{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:clamp(40px,7vw,80px) 22px}
footer{border-top:1px solid var(--line);padding-block:30px 40px;font-size:14px;color:var(--soft)}
footer .wrap{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px}
footer .contact{display:flex;flex-wrap:wrap;gap:8px 22px}
.reveal{opacity:0;transform:translateY(16px);transition:opacity .7s ease,transform .7s ease}.reveal.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none}.cover .hero-img{animation:none}}
@media (min-width:760px){.wrap{padding-inline:32px}.cards{grid-template-columns:repeat(3,1fr)}.split .grid2{grid-template-columns:1.05fr 1fr;gap:56px}.gallery{grid-template-columns:2fr 1fr 1fr}.gallery .g0{grid-column:auto;grid-row:span 1}.gallery .g0 img{aspect-ratio:4/3}.why ol{grid-template-columns:repeat(2,1fr);gap:0 48px}}
@media (min-width:980px){.links{display:flex}}
@media (max-width:759px){.diagonal .slab{clip-path:none;opacity:.78}.diagonal .slab::after{display:none}}
</style>
</head>
<body>
<div class="demo">Sample design by Diyama. Your name, photos and prices go in. <a href="/build?sample=${s.id}">Start from this design &rarr;</a></div>
<nav class="top"><div class="wrap">
  <a class="logo" href="#"><i>${esc(s.mark)}</i>${esc(s.brand)}</a>
  <div class="links"><a href="#offer">${esc(s.offerKicker)}</a><a href="#why">How it works</a><a href="#gallery">Gallery</a><a href="#book">Contact</a></div>
  <a class="btn" href="#book">${esc(s.cta)}</a>
</div></nav>
${hero}
<section class="s" id="offer"><div class="wrap">
  <div class="head reveal"><div><span class="kicker">${esc(s.offerKicker)}</span><h2>${esc(s.offerTitle)}</h2></div></div>
  <div class="cards">${offer}</div>
</div></section>
<section class="s why" id="why"><div class="wrap">
  <div class="head reveal"><div><span class="kicker">How it works</span><h2>${esc(s.whyTitle)}</h2></div></div>
  <ol>${why}</ol>
</div></section>
<section class="s" id="gallery"><div class="wrap">
  <div class="head reveal"><div><span class="kicker">Gallery</span><h2>See it for yourself</h2></div></div>
  <div class="gallery">${gal}</div>
</div></section>
<section class="s band" id="book"><div class="wrap"><div class="box reveal">
  <span class="kicker">${esc(s.cta)}</span><h2>${esc(s.band)}</h2>
  <a class="btn" href="/build?sample=${s.id}">Start your site from this design</a>
</div></div></section>
<footer><div class="wrap">
  <div class="contact"><span><b>${esc(s.brand)}</b></span><span>Your WhatsApp number</span><span>Your address</span><span>Your email</span></div>
  <span>Sample website by <a href="/">Diyama Solutions</a>. Photos from Unsplash.</span>
</div></footer>
<script>
(function(){var els=document.querySelectorAll(".reveal");if(!("IntersectionObserver" in window)){els.forEach(function(e){e.classList.add("in")});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{rootMargin:"0px 0px -8% 0px"});els.forEach(function(e){io.observe(e)})})();
</script>
</body>
</html>
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  for (const s of SAMPLES) {
    const dir = path.join(out, s.id);
    fs.mkdirSync(dir, { recursive: true });
    const html = page(s);
    if (/—/.test(html)) throw new Error(`em dash in sample ${s.id}`);
    fs.writeFileSync(path.join(dir, "index.html"), html);
  }
  fs.writeFileSync(path.join(out, "samples.json"), JSON.stringify(SAMPLES.map(({ id, kind, title, layout, c }) => ({ id, kind, title, layout, bg: c.bg, accent: c.accent })), null, 2));
  console.log(`[samples] wrote ${SAMPLES.length} sample sites into public/samples`);
}
