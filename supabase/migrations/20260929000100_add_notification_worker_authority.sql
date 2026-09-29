/* Worker-only authority. Existing deterministic RPCs remain available for legacy callers/tests. */
create or replace function public.read_notification_worker_time()
returns timestamptz
language sql
volatile
security definer
set search_path = ''
as $$ select pg_catalog.clock_timestamp(); $$;

create or replace function public.finalize_email_notification_delivery_now(
  p_delivery_id uuid,
  p_claim_token uuid,
  p_state text,
  p_provider_message_id text default null,
  p_error text default null
)
returns public.notification_deliveries
language plpgsql
security definer
set search_path = ''
as $$
declare
  claimed public.notification_deliveries;
  completed_at timestamptz;
  retry_at timestamptz;
begin
  if p_state is null or p_state not in ('sent', 'failed', 'suppressed') then
    raise exception 'A claimed delivery may only be sent, failed, or suppressed.' using errcode = '22023';
  end if;

  -- Read time AFTER obtaining the lock: a blocked statement must not finalize an expired lease
  -- using its transaction-start time. Token/state are rechecked while holding the row lock.
  select delivery.* into claimed
  from public.notification_deliveries as delivery
  where delivery.id = p_delivery_id and delivery.channel = 'email'
    and delivery.state = 'processing' and delivery.claim_token = p_claim_token
  for update;
  completed_at := pg_catalog.clock_timestamp();
  if claimed.id is null or claimed.claim_expires_at <= completed_at then
    raise exception 'The email delivery is not currently claimed.' using errcode = 'P0002';
  end if;

  if p_state = 'failed' then
    -- Same one-minute exponential backoff/six-hour cap as nextEmailRetryAt; no caller timestamp.
    retry_at := completed_at + pg_catalog.make_interval(secs =>
      least(21600.0, 60.0 * pg_catalog.power(2.0, least(claimed.attempt_count - 1, 9))));
  end if;
  return public.finalize_email_notification_delivery(
    p_delivery_id, p_claim_token, p_state, completed_at, p_provider_message_id, p_error, retry_at
  );
end;
$$;

create or replace function public.inspect_email_notification_delivery_backlog(p_max_attempts integer default 5)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  inspected_at timestamptz := pg_catalog.clock_timestamp();
  result jsonb;
begin
  if p_max_attempts is null or p_max_attempts < 1 or p_max_attempts > 20 then
    raise exception 'The attempt limit is outside the allowed range.' using errcode = '22023';
  end if;
  -- Aggregate inspection only; do not release a lease, reset attempts, or expose recipients/errors.
  select pg_catalog.jsonb_build_object(
    'exhausted_failed', count(*) filter (where delivery.state = 'failed'),
    'exhausted_expired_processing', count(*) filter (
      where delivery.state = 'processing' and delivery.claim_expires_at <= inspected_at
    )
  ) into result
  from public.notification_deliveries as delivery
  where delivery.channel = 'email' and delivery.attempt_count >= p_max_attempts
    and delivery.state in ('failed', 'processing');
  return result;
end;
$$;

revoke all on function public.read_notification_worker_time() from public, anon, authenticated;
revoke all on function public.finalize_email_notification_delivery_now(uuid, uuid, text, text, text) from public, anon, authenticated;
revoke all on function public.inspect_email_notification_delivery_backlog(integer) from public, anon, authenticated;
grant execute on function public.read_notification_worker_time() to service_role;
grant execute on function public.finalize_email_notification_delivery_now(uuid, uuid, text, text, text) to service_role;
grant execute on function public.inspect_email_notification_delivery_backlog(integer) to service_role;
