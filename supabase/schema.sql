-- =====================================================================
-- PORTFOLIO CMS: database, security rules and storage.
-- Supabase dashboard -> SQL Editor -> New query -> paste ALL -> Run.
-- Safe to run more than once.
-- =====================================================================
create extension if not exists pgcrypto;

-- Who may edit. Add yourself AFTER creating your login (see docs/CMS-SETUP.md).
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now());

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

create or replace function public.touch() returns trigger language plpgsql as
$$ begin new.updated_at = now(); return new; end $$;

-- Single-row tables (id is always 1) ---------------------------------
create table if not exists public.profile (
  id int primary key default 1 check (id = 1),
  name text not null default '' check (char_length(name) <= 120),
  logo text not null default '', badge_role text not null default '', signature text not null default '',
  email text not null default '', whatsapp text not null default '', social text not null default '',
  resume_url text not null default '',
  profile_photo text not null default '', intro_photo text not null default '', intro_shot text not null default '', about_photo text not null default '',
  badge_mini text not null default '', badge_avail text not null default '', badge_id text not null default '',
  handle text not null default '', badge_tag text not null default '',
  corners text[] not null default '{}', typed_hero text[] not null default '{}',
  intro_heading text not null default '', intro_text text not null default '',
  work_sub text not null default '', designs_sub text not null default '',
  about_tag text not null default '', about_text text not null default '', about_list text[] not null default '{}',
  cta text not null default '', updated_at timestamptz not null default now());

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  seeded boolean not null default false,          -- false = site shows built-in fallback content
  theme jsonb not null default '{}', sections jsonb not null default '{}',
  labels jsonb not null default '{}', seo jsonb not null default '{}',
  updated_at timestamptz not null default now());

-- List tables ----------------------------------------------------------
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(), sort_order int not null default 0,
  title text not null check (char_length(title) between 1 and 80),
  description text not null default '', color text not null default '#5aa2ff', icon text not null default '',
  published boolean not null default true);
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(), sort_order int not null default 0,
  value text not null check (char_length(value) between 1 and 20), label text not null default '');
create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(), sort_order int not null default 0,
  name text not null check (char_length(name) between 1 and 60));
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(), sort_order int not null default 0,
  label text not null check (char_length(label) between 1 and 40), url text not null default '');
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(), sort_order int not null default 0,
  name text not null check (char_length(name) between 1 and 120), category text not null default '',
  image_url text not null default '', url text not null default '#', tall boolean not null default false,
  published boolean not null default false, updated_at timestamptz not null default now());
create table if not exists public.designs (
  id uuid primary key default gen_random_uuid(), sort_order int not null default 0,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null check (char_length(name) between 1 and 120), kind text not null default '',
  summary text not null default '', image_url text not null default '',
  role text not null default '', year text not null default '', tools text not null default '',
  live_url text not null default '', live_label text not null default 'View live website',
  story jsonb not null default '[]' check (jsonb_typeof(story) = 'array'),
  featured boolean not null default false, published boolean not null default false,
  updated_at timestamptz not null default now());

create index if not exists projects_order on public.projects (published, sort_order);
create index if not exists designs_order  on public.designs  (published, sort_order);
create index if not exists roles_order    on public.roles    (published, sort_order);

do $$ declare t text; begin
  foreach t in array array['profile','site_settings','projects','designs'] loop
    execute format('drop trigger if exists touch on public.%I', t);
    execute format('create trigger touch before update on public.%I for each row execute function public.touch()', t);
  end loop;
  foreach t in array array['profile','site_settings','stats','tools','social_links','roles','projects','designs','admins'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('drop policy if exists "admin all" on public.%I', t);
  end loop;
  -- Visitors: read-only. Drafts (published = false) are invisible to them.
  foreach t in array array['profile','site_settings','stats','tools','social_links'] loop
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
  end loop;
  foreach t in array array['roles','projects','designs'] loop
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (published)', t);
  end loop;
  -- Administrators: full access. Everyone else cannot write anything.
  foreach t in array array['profile','site_settings','stats','tools','social_links','roles','projects','designs'] loop
    execute format('create policy "admin all" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;
drop policy if exists "read own admin row" on public.admins;
create policy "read own admin row" on public.admins for select to authenticated using (user_id = auth.uid());

insert into public.profile (id) values (1) on conflict do nothing;
insert into public.site_settings (id) values (1) on conflict do nothing;

-- Storage bucket for uploads (public files, admin-only changes) ------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media','media',true,10485760, array['image/jpeg','image/png','image/webp','image/gif','application/pdf','video/mp4','video/webm'])
on conflict (id) do update set public = true, file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','application/pdf','video/mp4','video/webm'];
drop policy if exists "media admin read"   on storage.objects;
drop policy if exists "media admin insert" on storage.objects;
drop policy if exists "media admin update" on storage.objects;
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin read"   on storage.objects for select to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "media admin update" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
