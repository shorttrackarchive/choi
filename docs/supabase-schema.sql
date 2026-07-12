-- Supabase schema for the Choi Minjeong retirement tribute webapp.
-- Apply in the Supabase SQL editor after reviewing project-specific admin rules.

create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

create table if not exists public.fan_messages (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(nickname) between 1 and 30),
  message text not null check (char_length(message) between 1 and 150),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  rejected_at timestamptz,
  moderation_note text
);

create table if not exists public.polls (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text not null check (type in ('singleChoice', 'imageChoice', 'highlightChoice', 'keywordChoice')),
  is_active boolean not null default false,
  show_results boolean not null default false,
  result_display_type text not null default 'bars' check (result_display_type in ('bars', 'imageGrid', 'largeType')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  label text not null,
  image text,
  meta text,
  sort_order integer not null default 0,
  unique (poll_id, id)
);

create table if not exists public.poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null,
  option_id uuid not null,
  voter_hash text not null,
  created_at timestamptz not null default now(),
  foreign key (poll_id) references public.polls(id) on delete cascade,
  foreign key (poll_id, option_id) references public.poll_options(poll_id, id) on delete cascade,
  unique (poll_id, voter_hash)
);

create index if not exists fan_messages_status_created_idx
  on public.fan_messages (status, created_at desc);

create index if not exists poll_options_poll_sort_idx
  on public.poll_options (poll_id, sort_order);

create index if not exists poll_votes_poll_option_idx
  on public.poll_votes (poll_id, option_id);

alter table public.admin_profiles enable row level security;
alter table public.fan_messages enable row level security;
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;

create or replace function public.is_tribute_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

drop policy if exists "Admins can read admin profiles" on public.admin_profiles;
create policy "Admins can read admin profiles"
on public.admin_profiles
for select
to authenticated
using (public.is_tribute_admin());

drop policy if exists "Anyone can submit fan messages" on public.fan_messages;
create policy "Anyone can submit fan messages"
on public.fan_messages
for insert
to anon, authenticated
with check (status = 'pending');

drop policy if exists "Anyone can read approved fan messages" on public.fan_messages;
create policy "Anyone can read approved fan messages"
on public.fan_messages
for select
to anon, authenticated
using (status = 'approved');

drop policy if exists "Admins can read all fan messages" on public.fan_messages;
create policy "Admins can read all fan messages"
on public.fan_messages
for select
to authenticated
using (public.is_tribute_admin());

drop policy if exists "Admins can moderate fan messages" on public.fan_messages;
create policy "Admins can moderate fan messages"
on public.fan_messages
for update
to authenticated
using (public.is_tribute_admin())
with check (public.is_tribute_admin());

drop policy if exists "Anyone can read active polls" on public.polls;
create policy "Anyone can read active polls"
on public.polls
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can manage polls" on public.polls;
create policy "Admins can manage polls"
on public.polls
for all
to authenticated
using (public.is_tribute_admin())
with check (public.is_tribute_admin());

drop policy if exists "Anyone can read options for active polls" on public.poll_options;
create policy "Anyone can read options for active polls"
on public.poll_options
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.polls
    where polls.id = poll_options.poll_id
      and polls.is_active = true
  )
);

drop policy if exists "Admins can manage poll options" on public.poll_options;
create policy "Admins can manage poll options"
on public.poll_options
for all
to authenticated
using (public.is_tribute_admin())
with check (public.is_tribute_admin());

-- Poll votes are inserted only by a trusted server endpoint.
-- The endpoint derives voter_hash from the request IP plus a private salt.
-- Do not allow anonymous clients to insert voter_hash directly.
drop policy if exists "Anyone can cast a poll vote" on public.poll_votes;

drop policy if exists "Admins can read poll votes" on public.poll_votes;
create policy "Admins can read poll votes"
on public.poll_votes
for select
to authenticated
using (public.is_tribute_admin());

-- Add an admin after creating that user in Supabase Auth:
-- insert into public.admin_profiles (user_id, email)
-- values ('AUTH_USER_UUID_HERE', 'admin@example.com');
