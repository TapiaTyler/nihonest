begin;

select plan(15);

select has_table('public', 'notification_deliveries', 'notification deliveries table exists');
select policies_are(
  'public',
  'notification_deliveries',
  array['Users can read their own notification deliveries'],
  'notification deliveries have only their owner-read policy'
);
select has_function('public', 'generate_due_reminder_events', array['timestamp with time zone', 'integer'], 'due reminder generator exists');
select has_function('public', 'prepare_email_notification_deliveries', array['timestamp with time zone', 'integer'], 'email delivery preparer exists');

insert into auth.users (id, email)
values
  ('70000000-0000-4000-8000-000000000007', 'delivery-opted-in@example.test'),
  ('80000000-0000-4000-8000-000000000008', 'delivery-opted-out@example.test');

insert into public.notification_preferences (user_id, email_enabled, deadline_reminders_enabled)
values
  ('70000000-0000-4000-8000-000000000007', true, true),
  ('80000000-0000-4000-8000-000000000008', false, false);

insert into public.reminders (id, user_id, title, target_kind, scheduled_for, time_zone, state, cancelled_at)
values
  ('71000000-0000-4000-8000-000000000007', '70000000-0000-4000-8000-000000000007', 'Opted-in due reminder', 'custom', '2026-10-01T00:00:00Z', 'Asia/Tokyo', 'scheduled', null),
  ('81000000-0000-4000-8000-000000000008', '80000000-0000-4000-8000-000000000008', 'Opted-out due reminder', 'custom', '2026-10-01T00:00:00Z', 'Asia/Tokyo', 'scheduled', null),
  ('72000000-0000-4000-8000-000000000007', '70000000-0000-4000-8000-000000000007', 'Future reminder', 'custom', '2026-11-01T00:00:00Z', 'Asia/Tokyo', 'scheduled', null),
  ('73000000-0000-4000-8000-000000000007', '70000000-0000-4000-8000-000000000007', 'Cancelled reminder', 'custom', '2026-10-01T00:00:00Z', 'Asia/Tokyo', 'cancelled', '2026-09-20T00:00:00Z');

select results_eq(
  $$select public.generate_due_reminder_events('2026-10-02T00:00:00Z', 100)$$,
  array[2],
  'only due scheduled reminders generate events'
);
select results_eq(
  $$select count(*) from public.reminders where state = 'fulfilled'$$,
  array[2::bigint],
  'event generation fulfills the corresponding reminders'
);
select results_eq(
  $$select count(*) from public.reminders where state = 'scheduled'$$,
  array[1::bigint],
  'future reminders remain scheduled'
);
select results_eq(
  $$select public.generate_due_reminder_events('2026-10-02T00:00:00Z', 100)$$,
  array[0],
  'a repeated scheduler pass produces no duplicate work'
);
select results_eq(
  $$select public.prepare_email_notification_deliveries('2026-10-02T00:01:00Z', 100)$$,
  array[2],
  'one email decision is prepared per new event'
);
select results_eq(
  $$select state from public.notification_deliveries where user_id = '70000000-0000-4000-8000-000000000007'$$,
  array['pending'::text],
  'explicit reminder email consent prepares a pending delivery'
);
select results_eq(
  $$select state from public.notification_deliveries where user_id = '80000000-0000-4000-8000-000000000008'$$,
  array['suppressed'::text],
  'disabled consent records a suppressed delivery'
);
select results_eq(
  $$select public.prepare_email_notification_deliveries('2026-10-02T00:01:00Z', 100)$$,
  array[0],
  'a repeated preparation pass produces no duplicate decisions'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '70000000-0000-4000-8000-000000000007', true);

select results_eq($$select count(*) from public.notification_deliveries$$, array[1::bigint], 'an owner sees only their delivery history');
select throws_ok(
  $$insert into public.notification_deliveries (event_id, user_id, channel, state, available_at) select id, user_id, 'email', 'pending', now() from public.notification_events limit 1$$,
  '42501',
  'permission denied for table notification_deliveries',
  'account holders cannot create delivery work'
);
select throws_ok(
  $$select public.generate_due_reminder_events(now(), 100)$$,
  '42501',
  'permission denied for function generate_due_reminder_events',
  'account holders cannot invoke trusted reminder generation'
);

select * from finish();
rollback;
