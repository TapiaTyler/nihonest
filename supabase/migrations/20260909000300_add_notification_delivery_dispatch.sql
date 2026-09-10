/*
 * Claims are short database leases represented by processing state. The provider worker
 * must finalize each claim; attempts at or above the limit remain failed for inspection.
 */
create or replace function public.claim_email_notification_deliveries(
  p_now timestamptz default timezone('utc', now()),
  p_limit integer default 25,
  p_max_attempts integer default 5,
  p_lease_seconds integer default 300
)
returns setof public.notification_deliveries
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_limit < 1 or p_limit > 100 or p_max_attempts < 1 or p_max_attempts > 20
    or p_lease_seconds < 30 or p_lease_seconds > 3600 then
    raise exception 'Claim limits are outside the allowed range.' using errcode = '22023';
  end if;

  return query
  with candidates as materialized (
    select delivery.id
    from public.notification_deliveries as delivery
    where delivery.channel = 'email'
      and (
        (delivery.state in ('pending', 'failed') and delivery.available_at <= p_now)
        or (delivery.state = 'processing' and delivery.claim_expires_at <= p_now)
      )
      and delivery.attempt_count < p_max_attempts
    order by delivery.available_at, delivery.id
    for update skip locked
    limit p_limit
  )
  update public.notification_deliveries as delivery
  set
    state = 'processing',
    attempt_count = delivery.attempt_count + 1,
    last_attempted_at = p_now,
    claim_token = gen_random_uuid(),
    claim_expires_at = p_now + make_interval(secs => p_lease_seconds),
    last_error = null,
    updated_at = p_now
  from candidates
  where delivery.id = candidates.id
  returning delivery.*;
end;
$$;

create or replace function public.finalize_email_notification_delivery(
  p_delivery_id uuid,
  p_claim_token uuid,
  p_state text,
  p_now timestamptz,
  p_provider_message_id text default null,
  p_error text default null,
  p_retry_at timestamptz default null
)
returns public.notification_deliveries
language plpgsql
security definer
set search_path = ''
as $$
declare
  finalized public.notification_deliveries;
begin
  if p_state not in ('sent', 'failed', 'suppressed') then
    raise exception 'A claimed delivery may only be sent, failed, or suppressed.' using errcode = '22023';
  end if;
  if p_state = 'sent' and (nullif(btrim(p_provider_message_id), '') is null or p_error is not null or p_retry_at is not null) then
    raise exception 'Sent delivery metadata is invalid.' using errcode = '22023';
  end if;
  if p_state = 'failed' and (nullif(btrim(p_error), '') is null or p_retry_at is null or p_provider_message_id is not null) then
    raise exception 'Failed delivery metadata is invalid.' using errcode = '22023';
  end if;
  if p_state = 'suppressed' and (p_provider_message_id is not null or p_error is not null or p_retry_at is not null) then
    raise exception 'Suppressed delivery metadata is invalid.' using errcode = '22023';
  end if;

  update public.notification_deliveries as delivery
  set
    state = p_state,
    available_at = case when p_state = 'failed' then p_retry_at else delivery.available_at end,
    claim_token = null,
    claim_expires_at = null,
    sent_at = case when p_state = 'sent' then p_now else null end,
    provider_message_id = case when p_state = 'sent' then left(btrim(p_provider_message_id), 200) else null end,
    last_error = case when p_state = 'failed' then left(btrim(p_error), 500) else null end,
    updated_at = p_now
  where delivery.id = p_delivery_id
    and delivery.channel = 'email'
    and delivery.state = 'processing'
    and delivery.claim_token = p_claim_token
    and delivery.claim_expires_at > p_now
  returning delivery.* into finalized;

  if finalized.id is null then
    raise exception 'The email delivery is not currently claimed.' using errcode = 'P0002';
  end if;
  return finalized;
end;
$$;

revoke all on function public.claim_email_notification_deliveries(timestamptz, integer, integer, integer) from public, anon, authenticated;
revoke all on function public.finalize_email_notification_delivery(uuid, uuid, text, timestamptz, text, text, timestamptz) from public, anon, authenticated;
grant execute on function public.claim_email_notification_deliveries(timestamptz, integer, integer, integer) to service_role;
grant execute on function public.finalize_email_notification_delivery(uuid, uuid, text, timestamptz, text, text, timestamptz) to service_role;
