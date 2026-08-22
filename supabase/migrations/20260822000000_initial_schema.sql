create extension if not exists pgcrypto;

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  long_description text not null default '',
  cover_image text not null default '',
  gallery_images text[] not null default '{}',
  zip_file text,
  zip_file_name text,
  github_url text,
  demo_url text,
  tags text[] not null default '{}',
  category text not null default '',
  technologies text[] not null default '{}',
  version text not null default '1.0.0',
  release_date date not null default current_date,
  featured boolean not null default false,
  published boolean not null default false,
  view_count bigint not null default 0 check (view_count >= 0),
  download_count bigint not null default 0 check (download_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  content text not null default '',
  cover_image text not null default '',
  tags text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  id text primary key,
  developer_name text not null default '',
  developer_title text not null default '',
  developer_bio text not null default '',
  developer_avatar text not null default '',
  github_url text not null default '',
  linkedin_url text not null default '',
  twitter_url text not null default '',
  email text not null default '',
  website_url text not null default '',
  tech_stack jsonb not null default '[]',
  categories jsonb not null default '[]',
  hero_title text not null default '',
  hero_subtitle text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  og_image text not null default '',
  announcement text not null default '',
  lines_of_code text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  project_title text not null default '',
  rating smallint not null check (rating between 1 and 5),
  message text not null,
  ip_hash text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('view', 'download', 'github_click', 'demo_click', 'visit')),
  project_id uuid references public.projects(id) on delete set null,
  project_title text,
  page text,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_type_idx on public.analytics_events(type);
create index if not exists analytics_events_ip_hash_idx on public.analytics_events(ip_hash) where ip_hash is not null;

alter table public.projects enable row level security;
alter table public.blog enable row level security;
alter table public.settings enable row level security;
alter table public.messages enable row level security;
alter table public.feedbacks enable row level security;
alter table public.analytics_events enable row level security;

create policy "published projects are public" on public.projects for select using (published or public.is_admin());
create policy "admins manage projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "published posts are public" on public.blog for select using (published or public.is_admin());
create policy "admins manage posts" on public.blog for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads settings" on public.settings for select using (true);
create policy "admins manage settings" on public.settings for all using (public.is_admin()) with check (public.is_admin());
create policy "anyone can send messages" on public.messages for insert with check (true);
create policy "admins manage messages" on public.messages for all using (public.is_admin()) with check (public.is_admin());
create policy "anyone can send feedback" on public.feedbacks for insert with check (true);
create policy "admins manage feedback" on public.feedbacks for all using (public.is_admin()) with check (public.is_admin());
create policy "visitors can record events" on public.analytics_events for insert with check (
  (type = 'visit' and ip_hash is not null) or type <> 'visit'
);
create policy "admins read analytics" on public.analytics_events for select using (public.is_admin());

create or replace function public.increment_project_counter(project_id uuid, counter text)
returns void language plpgsql security definer set search_path = public
as $$
begin
  if counter = 'views' then
    update public.projects set view_count = view_count + 1, updated_at = now() where id = project_id and published;
  elsif counter = 'downloads' then
    update public.projects set download_count = download_count + 1, updated_at = now() where id = project_id and published;
  else
    raise exception 'Unsupported counter';
  end if;
end;
$$;
grant execute on function public.increment_project_counter(uuid, text) to anon, authenticated;

create or replace function public.analytics_summary()
returns table(total_visits bigint, unique_visitors bigint)
language sql stable security definer set search_path = public
as $$
  select count(*) filter (where type = 'visit'), count(distinct ip_hash) filter (where type = 'visit' and ip_hash is not null)
  from public.analytics_events
$$;
grant execute on function public.analytics_summary() to authenticated;

create or replace function public.recent_visitors(result_limit integer default 50)
returns table(ip_hash text, first_visit timestamptz, last_visit timestamptz, visit_count bigint, user_agent text, pages text[])
language sql stable security definer set search_path = public
as $$
  select ip_hash, min(created_at), max(created_at), count(*), (array_agg(user_agent order by created_at desc))[1], array_agg(distinct page) filter (where page is not null)
  from public.analytics_events
  where type = 'visit' and ip_hash is not null
  group by ip_hash order by max(created_at) desc limit greatest(result_limit, 1)
$$;
grant execute on function public.recent_visitors(integer) to authenticated;

insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('project-covers', 'project-covers', true),
  ('project-images', 'project-images', true),
  ('blog-images', 'blog-images', true)
on conflict (id) do update set public = excluded.public;

create policy "public reads media" on storage.objects for select using (bucket_id in ('avatars', 'project-covers', 'project-images', 'blog-images'));
create policy "admins upload media" on storage.objects for insert with check (bucket_id in ('avatars', 'project-covers', 'project-images', 'blog-images') and public.is_admin());
create policy "admins update media" on storage.objects for update using (bucket_id in ('avatars', 'project-covers', 'project-images', 'blog-images') and public.is_admin()) with check (bucket_id in ('avatars', 'project-covers', 'project-images', 'blog-images') and public.is_admin());
create policy "admins delete media" on storage.objects for delete using (bucket_id in ('avatars', 'project-covers', 'project-images', 'blog-images') and public.is_admin());