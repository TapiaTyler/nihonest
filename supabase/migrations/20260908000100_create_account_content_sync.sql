create table public.saved_content (
  user_id uuid not null references auth.users(id) on delete cascade,
  content_kind text not null check (content_kind in ('article', 'glossary-term', 'residence-status')),
  content_id text not null check (content_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  state text not null check (state in ('saved', 'removed')),
  updated_at timestamptz not null,
  primary key (user_id, content_kind, content_id)
);

create table public.glossary_study_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  term_id text not null check (term_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  state text not null check (state in ('new', 'learning', 'reviewed')),
  review_count integer not null check (review_count >= 0),
  last_reviewed_at timestamptz,
  updated_at timestamptz not null,
  primary key (user_id, term_id)
);

create table public.checklist_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  checklist_id text not null check (checklist_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  state text not null check (state in ('not-started', 'in-progress', 'complete')),
  completed_at timestamptz,
  updated_at timestamptz not null,
  primary key (user_id, checklist_id),
  constraint checklist_completion_matches_state check (
    (state = 'complete' and completed_at is not null)
    or (state <> 'complete' and completed_at is null)
  )
);

alter table public.saved_content enable row level security;
alter table public.glossary_study_progress enable row level security;
alter table public.checklist_progress enable row level security;

revoke all on table public.saved_content from anon, authenticated;
revoke all on table public.glossary_study_progress from anon, authenticated;
revoke all on table public.checklist_progress from anon, authenticated;
grant select, insert, update, delete on table public.saved_content to authenticated;
grant select, insert, update, delete on table public.glossary_study_progress to authenticated;
grant select, insert, update, delete on table public.checklist_progress to authenticated;

create policy "Users can manage their own saved content"
on public.saved_content for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users can manage their own glossary progress"
on public.glossary_study_progress for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users can manage their own checklist progress"
on public.checklist_progress for all to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

/**
 * Transfers device-owned content state in one authenticated round trip. Newer
 * timestamps win, equal-time removals win for saved content, and an equal-time
 * account record otherwise remains authoritative.
 */
create or replace function public.sync_account_content(
  p_saved_content jsonb default '[]'::jsonb,
  p_glossary_progress jsonb default '[]'::jsonb,
  p_checklist_progress jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  requesting_user uuid := auth.uid();
  saved_result jsonb;
  glossary_result jsonb;
  checklist_result jsonb;
begin
  if requesting_user is null then
    raise exception 'Authentication is required to synchronize account state.' using errcode = '42501';
  end if;

  if jsonb_typeof(coalesce(p_saved_content, '[]'::jsonb)) <> 'array'
    or jsonb_typeof(coalesce(p_glossary_progress, '[]'::jsonb)) <> 'array'
    or jsonb_typeof(coalesce(p_checklist_progress, '[]'::jsonb)) <> 'array' then
    raise exception 'Synchronization payloads must be arrays.' using errcode = '22023';
  end if;

  with incoming as (
    select distinct on (item.kind, item."contentId")
      item.kind,
      item."contentId",
      item.state,
      item."updatedAt"
    from jsonb_to_recordset(coalesce(p_saved_content, '[]'::jsonb))
      as item(kind text, "contentId" text, state text, "updatedAt" timestamptz)
    order by item.kind, item."contentId", item."updatedAt" desc, (item.state = 'removed') desc
  )
  insert into public.saved_content (user_id, content_kind, content_id, state, updated_at)
  select requesting_user, kind, "contentId", state, "updatedAt" from incoming
  on conflict (user_id, content_kind, content_id) do update
  set state = excluded.state,
      updated_at = excluded.updated_at
  where excluded.updated_at > public.saved_content.updated_at
    or (
      excluded.updated_at = public.saved_content.updated_at
      and excluded.state = 'removed'
      and public.saved_content.state <> 'removed'
    );

  with incoming as (
    select distinct on (item."termId")
      item."termId",
      item.state,
      item."reviewCount",
      item."lastReviewedAt",
      item."updatedAt"
    from jsonb_to_recordset(coalesce(p_glossary_progress, '[]'::jsonb))
      as item("termId" text, state text, "reviewCount" integer, "lastReviewedAt" timestamptz, "updatedAt" timestamptz)
    order by item."termId", item."updatedAt" desc, item."reviewCount" desc
  )
  insert into public.glossary_study_progress (user_id, term_id, state, review_count, last_reviewed_at, updated_at)
  select requesting_user, "termId", state, "reviewCount", "lastReviewedAt", "updatedAt" from incoming
  on conflict (user_id, term_id) do update
  set state = excluded.state,
      review_count = excluded.review_count,
      last_reviewed_at = excluded.last_reviewed_at,
      updated_at = excluded.updated_at
  where excluded.updated_at > public.glossary_study_progress.updated_at;

  with incoming as (
    select distinct on (item."checklistId")
      item."checklistId",
      item.state,
      item."completedAt",
      item."updatedAt"
    from jsonb_to_recordset(coalesce(p_checklist_progress, '[]'::jsonb))
      as item("checklistId" text, state text, "completedAt" timestamptz, "updatedAt" timestamptz)
    order by item."checklistId", item."updatedAt" desc
  )
  insert into public.checklist_progress (user_id, checklist_id, state, completed_at, updated_at)
  select requesting_user, "checklistId", state, "completedAt", "updatedAt" from incoming
  on conflict (user_id, checklist_id) do update
  set state = excluded.state,
      completed_at = excluded.completed_at,
      updated_at = excluded.updated_at
  where excluded.updated_at > public.checklist_progress.updated_at;

  select coalesce(jsonb_agg(jsonb_build_object(
    'kind', content_kind,
    'contentId', content_id,
    'state', state,
    'updatedAt', to_char(updated_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
  ) order by content_kind, content_id), '[]'::jsonb)
  into saved_result
  from public.saved_content
  where user_id = requesting_user;

  select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
    'termId', term_id,
    'state', state,
    'reviewCount', review_count,
    'lastReviewedAt', case when last_reviewed_at is null then null else to_char(last_reviewed_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') end,
    'updatedAt', to_char(updated_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
  )) order by term_id), '[]'::jsonb)
  into glossary_result
  from public.glossary_study_progress
  where user_id = requesting_user;

  select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
    'checklistId', checklist_id,
    'state', state,
    'completedAt', case when completed_at is null then null else to_char(completed_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') end,
    'updatedAt', to_char(updated_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
  )) order by checklist_id), '[]'::jsonb)
  into checklist_result
  from public.checklist_progress
  where user_id = requesting_user;

  return jsonb_build_object(
    'savedContent', saved_result,
    'glossaryProgress', glossary_result,
    'checklistProgress', checklist_result
  );
end;
$$;

revoke all on function public.sync_account_content(jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.sync_account_content(jsonb, jsonb, jsonb) to authenticated;
