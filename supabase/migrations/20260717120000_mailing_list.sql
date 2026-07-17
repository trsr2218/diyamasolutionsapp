-- Mailing list signups (Business Fit kit gate + general subscriptions)
create table public.mailing_list (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  name text,
  source text not null default 'website'
);

create unique index mailing_list_email_unique on public.mailing_list (lower(email));

alter table public.mailing_list enable row level security;

create policy "Anyone can join the mailing list"
  on public.mailing_list for insert
  to anon, authenticated
  with check (true);
