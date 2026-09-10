create table public.critical_update_releases (
  id uuid primary key default gen_random_uuid(),
  target_kind text not null check (target_kind in ('article', 'residence-status')),
  target_id text not null check (target_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(btrim(title)) between 1 and 160),
  summary text not null check (char_length(btrim(summary)) between 1 and 500),
  revision text not null check (char_length(btrim(revision)) between 1 and 100),
  verification_note text check (verification_note is null or char_length(btrim(verification_note)) between 1 and 300),
  editorial_state text not null default 'draft' check (editorial_state in ('draft', 'approved', 'published')),
  approved_at timestamptz,
  published_at timestamptz,
  events_generated_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (target_kind, target_id, revision),
  constraint critical_update_editorial_state_matches_timestamps check (
    (editorial_state = 'draft' and approved_at is null and published_at is null and events_generated_at is null)
    or (editorial_state = 'approved' and approved_at is not null and published_at is null and events_generated_at is null)
    or (editorial_state = 'published' and approved_at is not null and published_at is not null)
  ),
  constraint critical_update_editorial_timestamps_are_ordered check (
    (approved_at is null or approved_at >= created_at)
    and (published_at is null or published_at >= approved_at)
    and (events_generated_at is null or events_generated_at >= published_at)
  )
);

create table public.critical_update_journey_targets (
  release_id uuid not null references public.critical_update_releases(id) on delete cascade,
  journey_id text not null check (journey_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  route_id text check (route_id is null or route_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create unique index critical_update_journey_target_unique
on public.critical_update_journey_targets (release_id, journey_id, coalesce(route_id, ''));

create index critical_update_releases_ready_lookup
on public.critical_update_releases (published_at, id)
where editorial_state = 'published' and events_generated_at is null;

alter table public.critical_update_releases enable row level security;
alter table public.critical_update_journey_targets enable row level security;
revoke all on table public.critical_update_releases from anon, authenticated;
revoke all on table public.critical_update_journey_targets from anon, authenticated;
grant select, insert, update, delete on table public.critical_update_releases to service_role;
grant select, insert, update, delete on table public.critical_update_journey_targets to service_role;

create trigger critical_update_releases_set_updated_at
before update on public.critical_update_releases
for each row execute function public.set_updated_at();

create or replace function public.protect_published_critical_update_release()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.editorial_state = 'published' and (
    new.target_kind is distinct from old.target_kind
    or new.target_id is distinct from old.target_id
    or new.title is distinct from old.title
    or new.summary is distinct from old.summary
    or new.revision is distinct from old.revision
    or new.verification_note is distinct from old.verification_note
    or new.editorial_state is distinct from old.editorial_state
    or new.approved_at is distinct from old.approved_at
    or new.published_at is distinct from old.published_at
    or new.created_at is distinct from old.created_at
  ) then
    raise exception 'Published critical-update releases are immutable; create a new revision.' using errcode = '23000';
  end if;
  return new;
end;
$$;

create trigger protect_published_critical_update_release
before update on public.critical_update_releases
for each row execute function public.protect_published_critical_update_release();

/*
 * A published release is processed once. Topic consent limits event generation;
 * channel consent remains a later delivery decision so future channels can reuse events.
 */
create or replace function public.generate_targeted_critical_update_events(
  p_now timestamptz default timezone('utc', now()),
  p_limit integer default 25
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  generated_count integer;
begin
  if p_limit < 1 or p_limit > 100 then
    raise exception 'The critical-update generation limit must be between 1 and 100.' using errcode = '22023';
  end if;

  with selected_releases as materialized (
    select release.*
    from public.critical_update_releases as release
    where release.editorial_state = 'published'
      and release.published_at <= p_now
      and release.events_generated_at is null
    order by release.published_at, release.id
    for update skip locked
    limit p_limit
  ), recipients as (
    select distinct release.id as release_id, preferences.user_id
    from selected_releases as release
    join public.notification_preferences as preferences
      on preferences.critical_updates_enabled
    where exists (
      select 1
      from public.saved_content as saved
      where saved.user_id = preferences.user_id
        and saved.state = 'saved'
        and saved.content_kind = release.target_kind
        and saved.content_id = release.target_id
    ) or exists (
      select 1
      from public.user_preferences as user_preference
      join public.critical_update_journey_targets as target
        on target.release_id = release.id
        and target.journey_id = user_preference.journey_id
        and (target.route_id is null or target.route_id = user_preference.route_id)
      where user_preference.user_id = preferences.user_id
    )
  ), inserted_events as (
    insert into public.notification_events (user_id, event_type, deduplication_key, payload, created_at)
    select
      recipients.user_id,
      case when release.target_kind = 'article' then 'article-critical-update' else 'residence-status-guidance-updated' end,
      'critical-update-release:' || release.id::text,
      jsonb_strip_nulls(jsonb_build_object(
        case when release.target_kind = 'article' then 'articleId' else 'residenceStatusId' end, release.target_id,
        'releaseId', release.id,
        'title', release.title,
        'revision', release.revision,
        'summary', release.summary,
        'verificationNote', release.verification_note,
        'journeyTargets', coalesce((
          select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
            'journeyId', target.journey_id,
            'routeId', target.route_id
          )) order by target.journey_id, target.route_id nulls first)
          from public.critical_update_journey_targets as target
          where target.release_id = release.id
        ), '[]'::jsonb)
      )),
      p_now
    from recipients
    join selected_releases as release on release.id = recipients.release_id
    on conflict (user_id, event_type, deduplication_key) do nothing
    returning id
  ), processed_releases as (
    update public.critical_update_releases as release
    set events_generated_at = p_now
    from selected_releases as selected
    where release.id = selected.id and release.events_generated_at is null
    returning release.id
  )
  select count(*)::integer into generated_count from inserted_events;

  return generated_count;
end;
$$;

revoke all on function public.generate_targeted_critical_update_events(timestamptz, integer) from public, anon, authenticated;
grant execute on function public.generate_targeted_critical_update_events(timestamptz, integer) to service_role;
