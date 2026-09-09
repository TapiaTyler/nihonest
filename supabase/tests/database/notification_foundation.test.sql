begin;

select plan(18);

select has_table('public', 'notification_preferences', 'notification preferences table exists');
select has_table('public', 'reminders', 'reminders table exists');
select has_table('public', 'notification_events', 'notification events table exists');

select policies_are(
  'public',
  'notification_preferences',
  array['Users can manage their own notification preferences'],
  'notification preferences have only their owner-scoped policy'
);
select policies_are(
  'public',
  'reminders',
  array['Users can manage their own reminders'],
  'reminders have only their owner-scoped policy'
);
select policies_are(
  'public',
  'notification_events',
  array['Users can read their own notification events'],
  'notification events have only their owner-read policy'
);

insert into auth.users (id, email)
values
  ('50000000-0000-4000-8000-000000000005', 'notification-owner@example.test'),
  ('60000000-0000-4000-8000-000000000006', 'notification-other@example.test');

insert into public.notification_preferences (user_id, email_enabled)
values ('60000000-0000-4000-8000-000000000006', true);
insert into public.reminders (user_id, title, target_kind, scheduled_for, time_zone)
values ('60000000-0000-4000-8000-000000000006', 'Other reminder', 'custom', '2026-10-01T00:00:00Z', 'Asia/Tokyo');
insert into public.notification_events (user_id, event_type, deduplication_key, payload)
values ('60000000-0000-4000-8000-000000000006', 'reminder-due', 'reminder-due:other', '{"title":"Other reminder"}'::jsonb);

set local role authenticated;
select set_config('request.jwt.claim.sub', '50000000-0000-4000-8000-000000000005', true);

select results_eq($$select count(*) from public.notification_preferences$$, array[0::bigint], 'another user preferences are hidden');
select results_eq($$select count(*) from public.reminders$$, array[0::bigint], 'another user reminders are hidden');
select results_eq($$select count(*) from public.notification_events$$, array[0::bigint], 'another user events are hidden');

select lives_ok(
  $$insert into public.notification_preferences (user_id) values ('50000000-0000-4000-8000-000000000005')$$,
  'an account holder can create notification preferences'
);
select results_eq(
  $$select email_enabled or deadline_reminders_enabled or critical_updates_enabled from public.notification_preferences$$,
  array[false],
  'all optional communication preferences default to off'
);
select lives_ok(
  $$insert into public.reminders (user_id, title, target_kind, target_id, scheduled_for, time_zone) values ('50000000-0000-4000-8000-000000000005', 'Submit renewal documents', 'article', 'renewing-status-of-residence', '2026-10-01T00:00:00Z', 'Asia/Tokyo')$$,
  'an account holder can create a valid reminder'
);
select results_eq($$select count(*) from public.reminders$$, array[1::bigint], 'the owner can read their reminder');

select throws_ok(
  $$insert into public.notification_events (user_id, event_type, deduplication_key, payload) values ('50000000-0000-4000-8000-000000000005', 'reminder-due', 'reminder-due:forbidden', '{}'::jsonb)$$,
  '42501',
  'permission denied for table notification_events',
  'account holders cannot manufacture notification events'
);

reset role;
insert into public.notification_events (user_id, event_type, deduplication_key, payload)
values ('50000000-0000-4000-8000-000000000005', 'reminder-due', 'reminder-due:owner', '{"title":"Submit renewal documents"}'::jsonb);

set local role authenticated;
select set_config('request.jwt.claim.sub', '50000000-0000-4000-8000-000000000005', true);
select results_eq($$select count(*) from public.notification_events$$, array[1::bigint], 'the owner can read their generated event');
select results_eq($$select event_type from public.notification_events$$, array['reminder-due'::text], 'the generated event retains its type');

select lives_ok(
  $$update public.reminders set state = 'cancelled', cancelled_at = '2026-09-20T00:00:00Z' where user_id = '50000000-0000-4000-8000-000000000005'$$,
  'an account holder can cancel their reminder'
);
select results_eq(
  $$select state = 'cancelled' and cancelled_at is not null and fulfilled_at is null from public.reminders$$,
  array[true],
  'cancellation retains a valid terminal lifecycle state'
);

select * from finish();
rollback;
