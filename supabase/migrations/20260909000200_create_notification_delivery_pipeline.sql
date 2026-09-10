alter table public.notification_events
add constraint notification_events_id_user_unique unique (id, user_id);

create table public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  channel text not null check (channel in ('email')),
  state text not null check (state in ('pending', 'processing', 'sent', 'failed', 'suppressed')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  available_at timestamptz not null,
  last_attempted_at timestamptz,
  claim_token uuid,
  claim_expires_at timestamptz,
  sent_at timestamptz,
  provider_message_id text check (provider_message_id is null or char_length(provider_message_id) between 1 and 200),
  last_error text check (last_error is null or char_length(last_error) between 1 and 500),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (event_id, channel),
  foreign key (event_id, user_id) references public.notification_events(id, user_id) on delete cascade,
  constraint notification_delivery_state_matches_metadata check (
    (
      state = 'pending'
      and attempt_count = 0
      and last_attempted_at is null
      and claim_token is null
      and claim_expires_at is null
      and sent_at is null
      and provider_message_id is null
      and last_error is null
    )
    or (
      state = 'processing'
      and attempt_count > 0
      and last_attempted_at is not null
      and claim_token is not null
      and claim_expires_at is not null
      and sent_at is null
      and provider_message_id is null
      and last_error is null
    )
    or (
      state = 'sent'
      and attempt_count > 0
      and last_attempted_at is not null
      and claim_token is null
      and claim_expires_at is null
      and sent_at is not null
      and provider_message_id is not null
      and last_error is null
    )
    or (
      state = 'failed'
      and attempt_count > 0
      and last_attempted_at is not null
      and claim_token is null
      and claim_expires_at is null
      and sent_at is null
      and provider_message_id is null
      and last_error is not null
    )
    or (
      state = 'suppressed'
      and sent_at is null
      and provider_message_id is null
      and last_error is null
      and claim_token is null
      and claim_expires_at is null
      and ((attempt_count = 0 and last_attempted_at is null) or (attempt_count > 0 and last_attempted_at is not null))
    )
  )
);

create index notification_deliveries_ready_lookup
on public.notification_deliveries (available_at, id)
where state in ('pending', 'failed');

create index notification_deliveries_expired_claim_lookup
on public.notification_deliveries (claim_expires_at, id)
where state = 'processing';

alter table public.notification_deliveries enable row level security;
revoke all on table public.notification_deliveries from anon, authenticated;
grant select on table public.notification_deliveries to authenticated;

create policy "Users can read their own notification deliveries"
on public.notification_deliveries for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create trigger notification_deliveries_set_updated_at
before update on public.notification_deliveries
for each row execute function public.set_updated_at();

/*
 * Atomically turns due reminder requests into deduplicated business events.
 * Fulfillment records event generation only; it does not imply delivery.
 */
create or replace function public.generate_due_reminder_events(
  p_now timestamptz default timezone('utc', now()),
  p_limit integer default 100
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  fulfilled_count integer;
begin
  if p_limit < 1 or p_limit > 1000 then
    raise exception 'The reminder generation limit must be between 1 and 1000.' using errcode = '22023';
  end if;

  with due_reminders as materialized (
    select id, user_id, title, scheduled_for
    from public.reminders
    where state = 'scheduled' and scheduled_for <= p_now
    order by scheduled_for, id
    for update skip locked
    limit p_limit
  ), inserted_events as (
    insert into public.notification_events (user_id, event_type, deduplication_key, payload, created_at)
    select
      user_id,
      'reminder-due',
      'reminder-due:' || id::text,
      jsonb_build_object(
        'reminderId', id,
        'title', title,
        'scheduledFor', to_char(scheduled_for at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
      ),
      p_now
    from due_reminders
    on conflict (user_id, event_type, deduplication_key) do nothing
    returning id
  ), fulfilled_reminders as (
    update public.reminders as reminder
    set state = 'fulfilled', fulfilled_at = p_now
    from due_reminders as due
    where reminder.id = due.id and reminder.state = 'scheduled'
    returning reminder.id
  )
  select count(*)::integer into fulfilled_count from fulfilled_reminders;

  return fulfilled_count;
end;
$$;

-- Applies current explicit preferences and records a delivery decision without contacting a provider.
create or replace function public.prepare_email_notification_deliveries(
  p_now timestamptz default timezone('utc', now()),
  p_limit integer default 100
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  prepared_count integer;
begin
  if p_limit < 1 or p_limit > 1000 then
    raise exception 'The delivery preparation limit must be between 1 and 1000.' using errcode = '22023';
  end if;

  with undecided_events as (
    select event.id, event.user_id, event.event_type
    from public.notification_events as event
    where not exists (
      select 1
      from public.notification_deliveries as delivery
      where delivery.event_id = event.id and delivery.channel = 'email'
    )
    order by event.created_at, event.id
    limit p_limit
  ), prepared as (
    insert into public.notification_deliveries (
      event_id,
      user_id,
      channel,
      state,
      attempt_count,
      available_at,
      created_at,
      updated_at
    )
    select
      event.id,
      event.user_id,
      'email',
      case
        when coalesce(preferences.email_enabled, false)
          and (
            (event.event_type = 'reminder-due' and coalesce(preferences.deadline_reminders_enabled, false))
            or (event.event_type <> 'reminder-due' and coalesce(preferences.critical_updates_enabled, false))
          )
        then 'pending'
        else 'suppressed'
      end,
      0,
      p_now,
      p_now,
      p_now
    from undecided_events as event
    left join public.notification_preferences as preferences on preferences.user_id = event.user_id
    on conflict (event_id, channel) do nothing
    returning id
  )
  select count(*)::integer into prepared_count from prepared;

  return prepared_count;
end;
$$;

revoke all on function public.generate_due_reminder_events(timestamptz, integer) from public, anon, authenticated;
revoke all on function public.prepare_email_notification_deliveries(timestamptz, integer) from public, anon, authenticated;
grant execute on function public.generate_due_reminder_events(timestamptz, integer) to service_role;
grant execute on function public.prepare_email_notification_deliveries(timestamptz, integer) to service_role;
