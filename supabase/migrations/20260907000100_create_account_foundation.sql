create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) <= 80),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  journey_stage text check (journey_stage in ('planning', 'preparing', 'recently-arrived', 'living-in-japan')),
  journey_id text check (journey_id is null or journey_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  route_id text check (route_id is null or route_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  focused_article_id text check (focused_article_id is null or focused_article_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.user_preferences from anon, authenticated;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.user_preferences to authenticated;

create policy "Users can read their own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users can create their own profile"
on public.profiles for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users can update their own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users can delete their own profile"
on public.profiles for delete to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users can read their own preferences"
on public.user_preferences for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users can create their own preferences"
on public.user_preferences for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users can update their own preferences"
on public.user_preferences for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users can delete their own preferences"
on public.user_preferences for delete to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger user_preferences_set_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id) values (new.id);
  return new;
end;
$$;

create trigger create_profile_after_signup
after insert on auth.users
for each row execute function public.create_profile_for_new_user();
