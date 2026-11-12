-- Reference screenshots from the site builder (/build). A visitor uploads up to four
-- pictures of websites they like; the demo is built to match them. Public read so the
-- links in the order open from WhatsApp or the dashboard; anyone may add, nobody may
-- list, change or delete from the browser. 3 MB per file, images only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-references', 'site-references', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Anyone can add a site reference"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'site-references');

create policy "Site references are public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-references');
