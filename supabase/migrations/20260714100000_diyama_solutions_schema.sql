-- Diyama Solutions webapp schema
-- Recreates the full database for a fresh Supabase project.
-- Matches src/integrations/supabase/types.ts exactly.

-- ============================================================
-- contact_submissions (Contact page form)
-- ============================================================
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  subject text,
  message text not null
);

alter table public.contact_submissions enable row level security;

create policy "Anyone can submit a contact message"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

-- ============================================================
-- consultation_requests (Consultations page form)
-- ============================================================
create table public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  company text,
  email text not null,
  whatsapp text,
  topic text not null,
  challenge text not null,
  goal text,
  format text,
  preferred_date text,
  budget text,
  status text not null default 'new'
);

alter table public.consultation_requests enable row level security;

create policy "Anyone can request a consultation"
  on public.consultation_requests for insert
  to anon, authenticated
  with check (true);

-- ============================================================
-- affiliate_signups (Affiliate page form)
-- ============================================================
create table public.affiliate_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text,
  partner_type text not null,
  how_you_help text,
  status text not null default 'new'
);

alter table public.affiliate_signups enable row level security;

create policy "Anyone can sign up as an affiliate"
  on public.affiliate_signups for insert
  to anon, authenticated
  with check (true);

-- ============================================================
-- affiliate_referrals (managed internally, no public access)
-- ============================================================
create table public.affiliate_referrals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  affiliate_id uuid not null references public.affiliate_signups (id) on delete cascade,
  referred_name text not null,
  referred_email text,
  referred_phone text,
  referral_status text not null default 'new',
  payout_status text not null default 'unpaid',
  notes text
);

alter table public.affiliate_referrals enable row level security;
-- No public policies: only the service role (dashboard / edge functions) touches this.

-- ============================================================
-- business_fit_submissions (written by the business-fit edge
-- function using the service role key; no public access)
-- ============================================================
create table public.business_fit_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  business_name text not null,
  business_type text not null,
  stage text not null,
  target_customers text not null,
  current_challenge text not null,
  current_goal text not null,
  result jsonb,
  status text not null default 'pending'
);

alter table public.business_fit_submissions enable row level security;
-- No public policies: the edge function uses the service role key, which bypasses RLS.

-- ============================================================
-- ai_conversations / ai_messages (reserved for chat history;
-- the current chat function is stateless, no public access)
-- ============================================================
create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  expires_at timestamptz not null default (now() + interval '30 days')
);

alter table public.ai_conversations enable row level security;

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  conversation_id uuid not null references public.ai_conversations (id) on delete cascade,
  role text not null,
  content text not null
);

alter table public.ai_messages enable row level security;

-- ============================================================
-- reviews (public can submit; only approved + public rows readable)
-- ============================================================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  role text,
  company text,
  email text,
  rating integer not null check (rating between 1 and 5),
  review_text text not null,
  display_publicly boolean not null default false,
  status text not null default 'pending'
);

alter table public.reviews enable row level security;

create policy "Anyone can submit a review"
  on public.reviews for insert
  to anon, authenticated
  with check (true);

create policy "Approved public reviews are readable"
  on public.reviews for select
  to anon, authenticated
  using (status = 'approved' and display_publicly = true);
