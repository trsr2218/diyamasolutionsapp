/**
 * Generates src/data/pricing.ts from the company price list.
 *
 *     node scripts/build-pricing.mjs
 *
 * WHY GENERATED AND NOT TYPED
 * `Growth Plan/CARE-PLANS-OFFER.md` is the company's only price list, by a decision
 * of 9 August 2026. A website carrying its own copy of the numbers disagrees with it
 * within a month, and then a visitor is holding a figure nobody at Diyama recognises.
 * Change a price in the one place the rules say it lives, run this, commit.
 *
 * WHY "FROM" PRICES AND NOT THE FULL LIST
 * The 10 August decision cleared these prices for quoting and explicitly blocked
 * publication, on five grounds. Two of them still bite and this page is built around
 * them rather than ignoring them:
 *
 *   VAT registration is unconfirmed. A published flat price with no VAT line is read
 *   as the price the customer pays, so if VAT were later found to apply the whole
 *   amount is retrospectively inclusive. A "from" price cannot be read that way, and
 *   the page states plainly that the final figure comes in a written quote.
 *
 *   Two existing clients pay below list. Publishing exact figures has that
 *   conversation for Ernest, at a moment he did not choose. A floor does not.
 *
 * That is also what the decision itself recommends: publish a short front sheet and
 * quote the long tail. This is that front sheet.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '../../../Growth Plan/CARE-PLANS-OFFER.md');
const OUT = path.resolve(HERE, '../src/data/pricing.ts');

if (!fs.existsSync(SRC)) {
  console.error('Price list not found at ' + SRC + '\nNothing written.');
  process.exit(1);
}
const raw = fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');

/* Pull the cheapest kwacha figure out of a named section, which becomes the "from". */
function sections() {
  const out = {};
  raw.split(/^## /m).slice(1).forEach(chunk => {
    const heading = chunk.slice(0, chunk.indexOf('\n')).trim();
    out[heading] = chunk;
  });
  return out;
}
const S = sections();

/* The floor comes from the section's FIRST table only, which is the main offer.
   Reading the whole section picked up add-ons and produced floors BELOW the real
   entry price: social came out at K500, the WhatsApp catalogue add-on, when the
   cheapest actual plan is K750. Publishing a floor under the real one anchors every
   prospect low and is worse than publishing nothing. */
function firstTable(sectionName) {
  const body = S[sectionName];
  if (!body) throw new Error('section not found in the price list: ' + sectionName);
  const lines = body.split('\n');
  const rows = [];
  let started = false;
  for (let i = 0; i < lines.length; i++) {
    const isRow = /^\|/.test(lines[i]);
    if (!started && isRow) { started = true; }
    if (started) {
      if (!isRow) break;                              /* the table ended */
      if (!/^\|[\s:|-]+\|$/.test(lines[i].trim())) rows.push(lines[i]);
    }
  }
  if (!rows.length) throw new Error('no table found in section: ' + sectionName);
  return rows.join('\n');
}

/* Some sections lead with prose rather than a table. "Keeping it live" states its
   entry price in a subheading, "Site Care, K150 a month", and reading the section
   whole returned K50, the annual domain renewal expressed monthly. So those are
   matched on the actual sentence instead of scanned. */
function fromPattern(sectionName, re) {
  const body = S[sectionName];
  if (!body) throw new Error('section not found: ' + sectionName);
  const m = body.match(re);
  if (!m) throw new Error('pattern did not match in section "' + sectionName + '": ' + re);
  return Number(m[1].replace(/,/g, ''));
}

function lowest(sectionName, opts = {}) {
  if (opts.pattern) {
    const v = fromPattern(sectionName, opts.pattern);
    if (opts.expect && v !== opts.expect) {
      throw new Error('section "' + sectionName + '" matched K' + v + ' but K' + opts.expect + ' was expected. Check the price list before publishing.');
    }
    return v;
  }
  const scope = opts.wholeSection ? S[sectionName] : firstTable(sectionName);
  const nums = [...scope.matchAll(/K([\d,]+)/g)]
    .map(m => Number(m[1].replace(/,/g, '')))
    .filter(n => n >= (opts.min || 0) && n <= (opts.max || Infinity));
  if (!nums.length) throw new Error('no prices parsed from section: ' + sectionName);
  const low = Math.min(...nums);
  if (opts.expect && low !== opts.expect) {
    throw new Error('section "' + sectionName + '" produced a floor of K' + low +
      ' but K' + opts.expect + ' was expected. The price list changed, or the parser is reading the wrong table. Check before publishing.');
  }
  return low;
}
const fmt = n => 'K' + n.toLocaleString('en-US');

/* Each card names the section it draws from, so a wrong number is traceable. */
/* The pivot of 5 November 2026 puts systems first. Only two systems lines carry a
   listed price, the custom system and the lodge sprint, so those are the only two
   figures shown. Anything else in that range is quoted, never guessed at here. */
const CUSTOM_SYSTEM = lowest('3. Websites and apps, one-off build', { expect: 13200, pattern: /From K([\d,]+), quoted after a scoping session/ });
const LODGE_SPRINT = lowest('9. For lodges and guest houses', { expect: 3850, pattern: /Direct Booking Sprint\*\*[^|]*\| \*\*K([\d,]+)\*\*/ });

/* Section 3b, added 11 November 2026 when Ernest set these three figures. */
const FRONT_DESK_SETUP = lowest('3b. Systems and automation', { expect: 2750, pattern: /\*\*K([\d,]+) set up, then K[\d,]+\/month\*\*/ });
const FRONT_DESK_MONTHLY = lowest('3b. Systems and automation', { expect: 1100, pattern: /\*\*K[\d,]+ set up, then K([\d,]+)\/month\*\*/ });
const AUTOMATION_SPRINT = lowest('3b. Systems and automation', { expect: 5500, pattern: /Automation Sprint\*\*[^|]*\|[^|]*\| \*\*K([\d,]+)\*\*/ });

const CARDS = [
  {
    id: 'systems', title: 'Business systems and automation',
    blurb: 'Software built around how your business actually runs: bookings, stock, approvals, reports, and the back office that ties them together.',
    from: FRONT_DESK_SETUP, unit: 'to set up',
    points: ['Scoped with you first, quoted in writing', 'Works on the phones and computers you already have', 'Kept running by the people who built it'],
  },
  {
    id: 'lodges', title: 'Direct bookings for lodges',
    blurb: 'A booking site, your Google profile set up properly, and a review engine, delivered together as one sprint.',
    from: LODGE_SPRINT, unit: 'once',
    points: ['Guests book with you, not through an agent', 'Found on Google Maps in your area', 'Reviews asked for, not hoped for'],
  },
  {
    id: 'social', title: 'Social media, run for you',
    blurb: 'Posts written, graphics designed, and somebody watching the replies. You stop being the one who has to think of something to post.',
    from: lowest('1. Social media management, monthly', { expect: 825 }), unit: 'a month',
    points: ['Facebook, Instagram or both', 'Custom graphics, not stock', 'A monthly report you can actually read'],
  },
  {
    id: 'web', title: 'A website or web app',
    blurb: 'Built so a customer can see what you do, what it costs, and how to reach you, on a phone, in seconds.',
    from: lowest('3. Websites and apps, one-off build', { expect: 1100 }), unit: 'once',
    points: ['Live in days, not months', 'Hosting, domain and SSL free for the first year', 'You see yours working before you pay'],
  },
  {
    id: 'care', title: 'Keeping it alive',
    blurb: 'The part most people skip. Security, backups, uptime, and somebody local to call when it breaks.',
    from: lowest('4. Keeping it live', { expect: 165, pattern: /Site Care, K([\d,]+) a month/ }), unit: 'a month',
    points: ['Security patched and backed up weekly', 'We know it is down before you do', 'Content updates included on the higher plan'],
  },
  {
    id: 'found', title: 'Getting found, and reviews',
    blurb: 'Google Business Profile set up properly, and a system that actually asks your happy customers to say so.',
    /* min 700 skips the K385 monthly review collection and the K660 extra location:
       neither is a one-off entry price, and this card's unit is "once". */
    from: lowest('6. Getting found, and reviews', { expect: 880, min: 700 }), unit: 'once',
    points: ['Show up on the map, in your area', 'A review engine, not a hope', 'Business email on your own domain'],
  },
  {
    id: 'design', title: 'Design and brand',
    blurb: 'Logo, brand kit, menus, profiles, flyers. Priced per piece and per page, so a short job costs less than a long one.',
    from: lowest('7. Design and brand', { expect: 275 }), unit: 'a piece',
    points: ['Per page on documents, never one flat guess', 'Print ready export included', 'One round of changes included'],
  },
  {
    id: 'campaign', title: 'A campaign, for one month',
    blurb: 'A launch, an event, an award. Daily presence, ads managed, and a promotion run properly and legally.',
    from: lowest('8. Campaigns, for an event, a launch or an award', { expect: 4400 }), unit: 'once',
    points: ['Two weeks or a full month', 'Your ad money stays on your own account', 'Every giveaway free to enter, with written rules'],
  },
];

const banner = `/* GENERATED FILE. Do not edit by hand.
   Written by scripts/build-pricing.mjs from Growth Plan/CARE-PLANS-OFFER.md, which is
   the company's only price list. Edit the price there, run the script, commit the diff.
   Generated ${new Date().toISOString().slice(0, 10)}. */\n\n`;

const body = `export type PriceCard = {
  id: string;
  title: string;
  blurb: string;
  from: string;
  unit: string;
  points: string[];
};

export const priceCards: PriceCard[] = ${JSON.stringify(
  CARDS.map(c => ({ ...c, from: fmt(c.from) })), null, 2
)};

/* Stated on the page, not buried. VAT registration is unconfirmed, so a flat
   published figure could later be read as inclusive. A floor plus a written quote
   is both honest and safe. */
export const priceNote =
  "Every figure here is a starting price in Zambian Kwacha. What you pay depends on the size of the job, and you get it in writing before any work begins. A build is paid half to start and half when it goes live, and nothing appears on the invoice that was not on the quote.";

export const priceUpdated = "${new Date().toISOString().slice(0, 10)}";

/* Named figures for pages that mention one offer by name, so no page types a price. */
export const systemPrices = {
  customSystem: "${fmt(CUSTOM_SYSTEM)}",
  lodgeSprint: "${fmt(LODGE_SPRINT)}",
  frontDeskSetup: "${fmt(FRONT_DESK_SETUP)}",
  frontDeskMonthly: "${fmt(FRONT_DESK_MONTHLY)}",
  automationSprint: "${fmt(AUTOMATION_SPRINT)}",
};
`;

fs.writeFileSync(OUT, banner + body);
console.log('wrote ' + path.relative(process.cwd(), OUT));
CARDS.forEach(c => console.log('  ' + c.title.padEnd(30) + 'from ' + fmt(c.from) + ' ' + c.unit));
