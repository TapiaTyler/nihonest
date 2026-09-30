begin;
select plan(29);

select has_function('public', 'read_notification_worker_time', array[]::text[], 'database clock exists');
select has_function('public', 'finalize_email_notification_delivery_now', array['uuid','uuid','text','text','text'], 'worker finalizer has no caller time');
select has_function('public', 'inspect_email_notification_delivery_backlog', array['integer'], 'aggregate inspection exists');
select ok(not exists (
  select 1 from (values ('anon'), ('authenticated')) as roles(name)
  cross join (values ('public.read_notification_worker_time()'),
    ('public.finalize_email_notification_delivery_now(uuid,uuid,text,text,text)'),
    ('public.inspect_email_notification_delivery_backlog(integer)')) as functions(signature)
  where has_function_privilege(roles.name, functions.signature, 'EXECUTE')
), 'untrusted roles cannot invoke worker authority');
select ok(not exists (
  select 1 from (values ('public.read_notification_worker_time()'),
    ('public.finalize_email_notification_delivery_now(uuid,uuid,text,text,text)'),
    ('public.inspect_email_notification_delivery_backlog(integer)')) as functions(signature)
  where not has_function_privilege('service_role', functions.signature, 'EXECUTE')
), 'service role can invoke all worker authority functions');
select pg_sleep(0.02);
select ok(public.read_notification_worker_time() > transaction_timestamp(), 'worker clock advances inside a transaction');

insert into auth.users (id,email) values
 ('90100000-0000-4000-8000-000000000001','authority-owner@example.test'),
 ('90100000-0000-4000-8000-000000000002','authority-other@example.test');
insert into public.notification_events (id,user_id,event_type,deduplication_key,payload)
select ('91100000-0000-4000-8000-' || lpad(i::text,12,'0'))::uuid,
  ('90100000-0000-4000-8000-' || lpad((case when i=6 then 2 else 1 end)::text,12,'0'))::uuid,
  'reminder-due', 'authority-' || i, '{"title":"Test"}'::jsonb
from generate_series(1,6) as i;
insert into public.notification_deliveries
 (id,event_id,user_id,channel,state,attempt_count,available_at,last_attempted_at,claim_token,claim_expires_at,last_error)
select ('92100000-0000-4000-8000-' || lpad(i::text,12,'0'))::uuid,
  ('91100000-0000-4000-8000-' || lpad(i::text,12,'0'))::uuid,
  ('90100000-0000-4000-8000-' || lpad((case when i=6 then 2 else 1 end)::text,12,'0'))::uuid,
  'email', case when i<=2 then 'failed' else 'processing' end,
  case when i in (1,3,4) then 5 when i in (2,5) then 4 else 1 end,
  clock_timestamp()-interval '1 minute', clock_timestamp()-interval '2 minutes',
  case when i>2 then ('93100000-0000-4000-8000-' || lpad(i::text,12,'0'))::uuid end,
  case when i in (3,5) then clock_timestamp()-interval '1 minute' when i>2 then clock_timestamp()+interval '1 hour' end,
  case when i<=2 then 'Generic failure' end
from generate_series(1,6) as i;

select is(public.inspect_email_notification_delivery_backlog(5),
  '{"exhausted_failed":1,"exhausted_expired_processing":1}'::jsonb,
  'counts exhausted failure/expired fifth claim, excluding unexpired and retryable work');
create temporary table authority_snapshot as select jsonb_agg(to_jsonb(delivery) order by id) as rows from public.notification_deliveries as delivery;
select public.inspect_email_notification_delivery_backlog(5);
select is((select jsonb_agg(to_jsonb(delivery) order by id) from public.notification_deliveries as delivery),
  (select rows from authority_snapshot), 'inspection does not release or reset claims');
select throws_ok($$select public.inspect_email_notification_delivery_backlog(0)$$,'22023','The attempt limit is outside the allowed range.','rejects zero attempts');
select throws_ok($$select public.inspect_email_notification_delivery_backlog(null)$$,'22023','The attempt limit is outside the allowed range.','rejects null attempts');
select throws_ok($$select public.inspect_email_notification_delivery_backlog(21)$$,'22023','The attempt limit is outside the allowed range.','rejects attempt limits above twenty');
select throws_ok($$select public.finalize_email_notification_delivery_now('92100000-0000-4000-8000-000000000006','93100000-0000-4000-8000-000000000001','suppressed')$$,
 'P0002','The email delivery is not currently claimed.','rejects stale token');
select throws_ok($$select public.finalize_email_notification_delivery_now('92100000-0000-4000-8000-000000000003','93100000-0000-4000-8000-000000000003','suppressed')$$,
 'P0002','The email delivery is not currently claimed.','rejects expired database lease');
select throws_ok($$select public.finalize_email_notification_delivery_now('92100000-0000-4000-8000-000000000006','93100000-0000-4000-8000-000000000006','sent')$$,
 '22023','Sent delivery metadata is invalid.','preserves metadata validation');
select throws_ok($$select public.finalize_email_notification_delivery_now('92100000-0000-4000-8000-000000000006','93100000-0000-4000-8000-000000000006',null)$$,
 '22023','A claimed delivery may only be sent, failed, or suppressed.','rejects null state');
select throws_ok($$select public.finalize_email_notification_delivery_now('92100000-0000-4000-8000-000000000006','93100000-0000-4000-8000-000000000006','failed')$$,
 '22023','Failed delivery metadata is invalid.','rejects failure without an error summary');
select throws_ok($$select public.finalize_email_notification_delivery_now('92100000-0000-4000-8000-000000000006','93100000-0000-4000-8000-000000000006','suppressed','unexpected-message')$$,
 '22023','Suppressed delivery metadata is invalid.','rejects provider metadata on suppression');
select is((select to_jsonb(delivery) from public.notification_deliveries as delivery where id='92100000-0000-4000-8000-000000000006'),
 (select rows->5 from authority_snapshot), 'rejected finalization leaves the claimed row unchanged');
select lives_ok($$select public.finalize_email_notification_delivery_now('92100000-0000-4000-8000-000000000006','93100000-0000-4000-8000-000000000006','suppressed')$$,'can suppress a valid claim');
select is((select state from public.notification_deliveries where id='92100000-0000-4000-8000-000000000006'),'suppressed','suppression is persisted');
create temporary table authority_before as select clock_timestamp() as instant;
select lives_ok($$select public.finalize_email_notification_delivery_now('92100000-0000-4000-8000-000000000004','93100000-0000-4000-8000-000000000004','failed',null,'Generic provider failure')$$,'can fail a valid fifth claim');
select ok((select available_at between (select instant from authority_before)+interval '16 minutes' and clock_timestamp()+interval '16 minutes'
  from public.notification_deliveries where id='92100000-0000-4000-8000-000000000004'),'backoff is computed from database completion time and locked attempt count');
select results_eq($$select count(*) from public.claim_email_notification_deliveries(p_limit=>25,p_max_attempts=>5)$$,array[2::bigint], 'only retryable failures/expired claims are reclaimed');
create temporary table authority_tokens as select id,claim_token from public.notification_deliveries where state='processing';
select throws_ok($$select public.finalize_email_notification_delivery_now('92100000-0000-4000-8000-000000000005','93100000-0000-4000-8000-000000000005','sent','old-worker-message')$$,
 'P0002','The email delivery is not currently claimed.','reclaim invalidates the original worker token');
select lives_ok($$select public.finalize_email_notification_delivery_now('92100000-0000-4000-8000-000000000002',(select claim_token from authority_tokens where id='92100000-0000-4000-8000-000000000002'),'sent','fixture-message')$$,'can finalize a sent claim');
select ok((select sent_at>= (select instant from authority_before) and sent_at<=clock_timestamp() and claim_token is null
  from public.notification_deliveries where id='92100000-0000-4000-8000-000000000002'),'sent time is database-authoritative and claim is cleared');
select throws_ok($$select public.finalize_email_notification_delivery_now('92100000-0000-4000-8000-000000000002',(select claim_token from authority_tokens where id='92100000-0000-4000-8000-000000000002'),'sent','duplicate')$$,
 'P0002','The email delivery is not currently claimed.','cannot replay a completed token');
select set_config('request.jwt.claim.sub','90100000-0000-4000-8000-000000000001',true);
set local role authenticated;
select throws_ok($$select public.inspect_email_notification_delivery_backlog(5)$$,'42501','permission denied for function inspect_email_notification_delivery_backlog','authenticated users cannot inspect aggregate backlog');
select results_eq($$select count(*) from public.notification_deliveries$$,array[5::bigint],'existing owner RLS still excludes other account');
reset role;
select * from finish();
rollback;
