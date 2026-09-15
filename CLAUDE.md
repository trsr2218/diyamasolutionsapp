# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:8081
npm run build      # Production build (does NOT typecheck; SWC strips types)
npm run build:dev  # Development build
npm run lint       # Run ESLint
npm run preview    # Preview production build
npx tsc --noEmit -p tsconfig.app.json   # Typecheck (run this too; vite build won't catch type errors)
```

There is no test suite configured.

## What the app is

The public website for **Diyama Solutions**, a business growth consultancy based in Zambia
(marketing, strategy, branding, consulting for African businesses). It includes an AI business
advisor (Diyama AI), an AI "Business Fit" quiz, a consultation booking form, a contact form,
an affiliate program signup, and a Learn hub with full article pages.

History note: this repo started life as a Base blockchain "onchain gateway" app (hence the repo
name `diyama-your-onchain-gateway`). All onchain code has been removed.

## Environment Variables

`.env` is gitignored (a Gemini key was once leaked via a committed .env; never commit it again).
See `.env.example`:

```
VITE_SUPABASE_PROJECT_ID=...
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

`GEMINI_API_KEY` is a Supabase edge-function secret, NOT a frontend env var.

## UI copy rule

Never use the em dash character in user-facing UI text (page copy, meta descriptions,
article content in `src/data/articles.ts`). Rephrase with a comma, colon, or separate sentence.

## Architecture

**Stack:** React 18 + TypeScript + Vite, Tailwind CSS (+ typography plugin), shadcn/ui (Radix),
React Router v6, TanStack Query, Framer Motion, react-markdown, Supabase.

### Routing (`src/App.tsx`)

All routes render inside `Layout` (Navbar + Footer + FloatingCTA) with `AnimatePresence` transitions:

- `/` — Index (hero, prompt grid, services/clients/learn previews, teasers)
- `/services` — 21 services from `src/data/services.ts`, category filter
- `/clients` — client portfolio from `src/data/clients.ts`
- `/apps` — Diyama-built apps showcase from `src/data/apps.ts` (try free / subscribe CTAs via WhatsApp)
- `/partners` — brands Diyama advertises for, from `src/data/partners.ts`
- `/ai` — Diyama AI streaming chat (calls the `chat` edge function via fetch + SSE);
  `DiyamaAvatar` component gives Diyama an animated persona (idle/thinking/speaking moods)
- `/business-fit` — multi-step quiz → email gate (inserts `mailing_list`) → `business-fit`
  edge function → animated "Business Kit" report reveal
- `/consultations` — booking form → inserts `consultation_requests`
- `/learn` — article grid; `/learn/:slug` — full article (`src/pages/Article.tsx`, react-markdown)
- `/affiliate` — program info + signup form → inserts `affiliate_signups`
- `/about`, `/contact` (inserts `contact_submissions`), `/privacy`, `/terms`, `*` (NotFound)

### Data layer

- Static content lives in `src/data/` (services, clients, articles). Articles carry full
  markdown `content` rendered by `src/pages/Article.tsx` with prose styling.
- Supabase client: `src/integrations/supabase/client.ts` (generated, do not edit) with
  generated types in `types.ts`. Tables: `contact_submissions`, `consultation_requests`,
  `affiliate_signups`, `affiliate_referrals`, `business_fit_submissions`, `ai_conversations`,
  `ai_messages`, `reviews`, `mailing_list` (insert-only; Business Fit gates the free
  "Business Kit" report behind a mailing-list email signup).
- Schema source of truth: `supabase/migrations/20260714100000_diyama_solutions_schema.sql`
  (RLS: public forms are insert-only; nothing publicly readable except approved reviews).

### Edge functions (`supabase/functions/`)

- `chat` — streams Gemini responses reshaped to OpenAI-style SSE deltas; needs
  `GEMINI_API_KEY` secret.
- `business-fit` — Gemini JSON report + stores submission via service role.
- Both use a model fallback chain (`gemini-3.5-flash` → `gemini-3.1-flash-lite` →
  `gemini-3-flash-preview`) because free-tier models can 503 under load, and
  `gemini-2.5-flash` is retired for new API keys.

Backend provisioning steps: see `BACKEND-SETUP.md`.

### Styling

- Custom utility classes in `src/index.css`: `section-padding`, `container-wide`,
  `container-narrow`, `card-elevated`, `btn-primary`, `btn-accent`, `btn-outline-primary`.
- `font-display` for headings. Framer Motion variant objects must be typed `Variants`
  (from framer-motion) or `ease` strings fail typechecking.

### Adding a page (three places, or it 404s)

1. Add the lazy import in `src/pages/lazyPages.ts` (and its path in `byPath`), then the `<Route>` in `App.tsx`.
2. Add the path to the `rewrites` pattern in `vercel.json`. Anything not listed there and not a
   prerendered file returns `dist/404.html` with a real 404 status (written by `scripts/make-404.mjs`).
3. Add it to `routes` in `scripts/prerender.mjs` and `staticRoutes` in `scripts/gen-sitemap.mjs`.

`vercel.json` also holds the security headers, including a CSP. `scripts/deploy-prod.mjs`
translates both into the prebuilt Build Output config, so edit them only in `vercel.json`.
A new external host (script, font, image, API) must be added to the CSP or it is blocked.

### Images and failure handling

- Photos in `src/assets` are WebP (1600px wide for photos, 800px for app screenshots). Do not add
  raw camera or 1920px JPGs. `src/assets/logo.jpg` stays: `../../generate-report.js` uses it.
- Every form falls back to `WhatsAppFallback` when Supabase fails, carrying what the visitor typed.
  The backend has paused unnoticed before; a failed save must never lose a lead.
- Diyama AI checks the backend is reachable on load and says "Offline right now" if not.

### Path alias

`@/` maps to `src/` — use it for all imports.

## Contact constants

WhatsApp: 260966138238 (FloatingCTA, Consultations, Contact). Email: getitdonerapid@gmail.com.
If these change, grep for them; they are hardcoded in several components.
