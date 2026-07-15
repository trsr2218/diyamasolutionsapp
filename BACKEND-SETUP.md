# Backend Setup (Supabase Revival Guide)

The original Supabase project (`yzbrrxzazvsjaghnttek`) no longer exists, so the app's backend
(contact form, consultation bookings, affiliate signups, Business Fit, Diyama AI chat) is dead
until a new project is stood up. Everything needed to rebuild it is in this repo. Total time: ~15 minutes.

## 0. Rotate the leaked Gemini key (do this first)

The old `.env` (including `GEMINI_API_KEY`) was committed to two public GitHub repos, so that key
is compromised.

1. Go to https://aistudio.google.com/apikey
2. Delete the old key and create a new one.
3. Treat the new key as a Supabase secret only (step 4). It must NOT go in `.env` — the frontend
   never talks to Gemini directly.

## 1. Create the Supabase project

1. https://supabase.com/dashboard → New project (any region close to users, e.g. `eu-central-1`).
2. Once created, note from Project Settings → API:
   - Project URL (`https://<ref>.supabase.co`)
   - `anon` / publishable key

## 2. Point the app at it

Update `.env` (this file is gitignored now; see `.env.example`):

```
VITE_SUPABASE_PROJECT_ID="<ref>"
VITE_SUPABASE_URL="https://<ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<anon key>"
```

## 3. Create the database schema

With the Supabase CLI (no install needed, runs via npx):

```
npx supabase login          # opens browser
npx supabase link --project-ref <ref>
npx supabase db push        # applies supabase/migrations/*.sql
```

Or paste `supabase/migrations/20260714100000_diyama_solutions_schema.sql` into the
dashboard SQL editor and run it.

This creates all 8 tables with row level security already configured:
public forms can INSERT into `contact_submissions`, `consultation_requests`,
`affiliate_signups`, and `reviews`; nothing is publicly readable except approved reviews.

## 4. Deploy the edge functions

```
npx supabase secrets set GEMINI_API_KEY=<your NEW key>
npx supabase functions deploy chat
npx supabase functions deploy business-fit
```

Notes:
- Both functions now call `gemini-2.5-flash` (the old `gemini-1.5-flash` was retired by Google).
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically by Supabase;
  only `GEMINI_API_KEY` needs to be set manually.

## 5. Verify

1. `npm run dev`, then:
2. `/contact` → submit the form → row appears in `contact_submissions` (dashboard → Table Editor).
3. `/consultations` → submit → row in `consultation_requests`.
4. `/affiliate` → sign up → row in `affiliate_signups`.
5. `/ai` → send a message → streamed reply.
6. `/business-fit` → complete the quiz → report renders and a row appears in `business_fit_submissions`.

## Reading submissions

There is no admin UI. Check new leads in the Supabase dashboard → Table Editor
(`consultation_requests`, `contact_submissions`, `affiliate_signups`), or add
email notifications later via a database webhook + Resend.
