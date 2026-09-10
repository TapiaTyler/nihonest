begin;

select plan(10);

select has_function('public', 'claim_email_notification_deliveries', array['timestamp with time zone', 'integer', 'integer', 'integer'], 'email delivery claim function exists');
select has_function('public', 'finalize_email_notification_delivery', array['uuid', 'uuid', 'text', 'timestamp with time zone', 'text', 'text', 'timestamp with time zone'], 'email delivery finalizer exists');

insert into auth.users (id, email)
values ('90000000-0000-4000-8000-000000000009', 'dispatch-owner@example.test');
insert into public.notification_events (id, user_id, event_type, deduplication_key, payload)
values ('91000000-0000-4000-8000-000000000009', '90000000-0000-4000-8000-000000000009', 'reminder-due', 'dispatch-test', '{"title":"Test"}'::jsonb);
insert into public.notification_deliveries (id, event_id, user_id, channel, state, available_at)
values ('92000000-0000-4000-8000-000000000009', '91000000-0000-4000-8000-000000000009', '90000000-0000-4000-8000-000000000009', 'email', 'pending', '2026-10-01T00:00:00Z');

select results_eq(
  $$select count(*) from public.claim_email_notification_deliveries('2026-10-01T00:00:00Z', 25, 5)$$,
  array[1::bigint],
  'a ready delivery is claimed once'
);
select results_eq(
  $$select state = 'processing' and attempt_count = 1 from public.notification_deliveries$$,
  array[true],
  'claiming records the processing attempt'
);
select results_eq(
  $$select count(*) from public.claim_email_notification_deliveries('2026-10-01T00:00:00Z', 25, 5)$$,
  array[0::bigint],
  'processing work cannot be claimed twice'
);
select lives_ok(
  $$select public.finalize_email_notification_delivery('92000000-0000-4000-8000-000000000009', (select claim_token from public.notification_deliveries where id = '92000000-0000-4000-8000-000000000009'), 'failed', '2026-10-01T00:00:01Z', null, 'Temporary rejection', '2026-10-01T00:01:01Z')$$,
  'a provider failure schedules a retry'
);
select results_eq(
  $$select count(*) from public.claim_email_notification_deliveries('2026-10-01T00:01:00Z', 25, 5)$$,
  array[0::bigint],
  'failed work is unavailable before its retry time'
);
select results_eq(
  $$select count(*) from public.claim_email_notification_deliveries('2026-10-01T00:01:01Z', 25, 5)$$,
  array[1::bigint],
  'failed work becomes claimable at its retry time'
);
select lives_ok(
  $$select public.finalize_email_notification_delivery('92000000-0000-4000-8000-000000000009', (select claim_token from public.notification_deliveries where id = '92000000-0000-4000-8000-000000000009'), 'sent', '2026-10-01T00:01:02Z', 'ses-message-1')$$,
  'a successful provider result finalizes the delivery'
);
select results_eq(
  $$select state = 'sent' and attempt_count = 2 and provider_message_id = 'ses-message-1' from public.notification_deliveries$$,
  array[true],
  'the terminal record retains attempt and provider tracking'
);

select * from finish();
rollback;
