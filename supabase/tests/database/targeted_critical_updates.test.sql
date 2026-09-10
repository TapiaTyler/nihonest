begin;

select plan(18);

select has_table('public', 'critical_update_releases', 'critical update releases table exists');
select has_table('public', 'critical_update_journey_targets', 'critical update journey targets table exists');
select has_function('public', 'generate_targeted_critical_update_events', array['timestamp with time zone', 'integer'], 'targeted event generator exists');
select policies_are('public', 'critical_update_releases', array[]::text[], 'critical update releases have no client policies');

insert into auth.users (id, email)
values
  ('a0000000-0000-4000-8000-000000000001', 'saved-target@example.test'),
  ('a0000000-0000-4000-8000-000000000002', 'journey-target@example.test'),
  ('a0000000-0000-4000-8000-000000000003', 'wrong-route@example.test'),
  ('a0000000-0000-4000-8000-000000000004', 'topic-disabled@example.test');

insert into public.notification_preferences (user_id, critical_updates_enabled)
values
  ('a0000000-0000-4000-8000-000000000001', true),
  ('a0000000-0000-4000-8000-000000000002', true),
  ('a0000000-0000-4000-8000-000000000003', true),
  ('a0000000-0000-4000-8000-000000000004', false);
insert into public.saved_content (user_id, content_kind, content_id, state, updated_at)
values
  ('a0000000-0000-4000-8000-000000000001', 'article', 'renewing-status-of-residence', 'saved', '2026-09-30T00:00:00Z'),
  ('a0000000-0000-4000-8000-000000000004', 'article', 'renewing-status-of-residence', 'saved', '2026-09-30T00:00:00Z');
insert into public.user_preferences (user_id, journey_id, route_id, onboarding_completed)
values
  ('a0000000-0000-4000-8000-000000000002', 'professional-worker', 'engineer', true),
  ('a0000000-0000-4000-8000-000000000003', 'professional-worker', 'legal-accounting', true);

insert into public.critical_update_releases (
  id, target_kind, target_id, title, summary, revision, verification_note,
  editorial_state, approved_at, published_at, created_at
) values (
  'b0000000-0000-4000-8000-000000000001', 'article', 'renewing-status-of-residence',
  'Renewal guidance changed', 'The reviewed evidence list changed.', '2026-10-01',
  'Confirm the current list with Immigration Services.', 'published',
  '2026-09-30T00:00:00Z', '2026-10-01T00:00:00Z', '2026-09-29T00:00:00Z'
);
insert into public.critical_update_journey_targets (release_id, journey_id, route_id)
values ('b0000000-0000-4000-8000-000000000001', 'professional-worker', 'engineer');

select results_eq(
  $$select public.generate_targeted_critical_update_events('2026-10-01T01:00:00Z', 25)$$,
  array[2],
  'only relevant topic subscribers receive generated events'
);
select results_eq($$select count(*) from public.notification_events$$, array[2::bigint], 'exactly two events are generated');
select results_eq(
  $$select count(*) from public.notification_events where user_id = 'a0000000-0000-4000-8000-000000000001'$$,
  array[1::bigint],
  'a saved target is relevant'
);
select results_eq(
  $$select count(*) from public.notification_events where user_id = 'a0000000-0000-4000-8000-000000000002'$$,
  array[1::bigint],
  'the matching selected route is relevant'
);
select results_eq(
  $$select count(*) from public.notification_events where user_id in ('a0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000004')$$,
  array[0::bigint],
  'wrong-route and topic-disabled accounts are excluded'
);
select results_eq(
  $$select count(*) from public.notification_events where payload->>'summary' = 'The reviewed evidence list changed.'$$,
  array[2::bigint],
  'events retain the reviewed change summary'
);
select results_eq(
  $$select count(*) from public.notification_events where payload->>'releaseId' = 'b0000000-0000-4000-8000-000000000001'$$,
  array[2::bigint],
  'events retain the immutable release identity for delivery checks'
);
select results_eq(
  $$select count(*) from public.notification_events where payload->'journeyTargets' @> '[{"journeyId":"professional-worker","routeId":"engineer"}]'::jsonb$$,
  array[2::bigint],
  'events retain the published journey target snapshot'
);
select results_eq(
  $$select public.generate_targeted_critical_update_events('2026-10-01T01:00:00Z', 25)$$,
  array[0],
  'a processed release cannot generate duplicates'
);
select results_eq(
  $$select events_generated_at is not null from public.critical_update_releases where id = 'b0000000-0000-4000-8000-000000000001'$$,
  array[true],
  'the release records completed event generation'
);
select throws_ok(
  $$update public.critical_update_releases set summary = 'Rewritten after publication.' where id = 'b0000000-0000-4000-8000-000000000001'$$,
  '23000', 'Published critical-update releases are immutable; create a new revision.',
  'published release content cannot be rewritten'
);

insert into public.critical_update_releases (id, target_kind, target_id, title, summary, revision)
values ('b0000000-0000-4000-8000-000000000002', 'article', 'tax-guide', 'Draft tax change', 'Not reviewed.', 'draft-1');
select results_eq(
  $$select public.generate_targeted_critical_update_events('2026-10-01T01:00:00Z', 25)$$,
  array[0],
  'draft releases cannot generate events'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', 'a0000000-0000-4000-8000-000000000001', true);
select throws_ok(
  $$select count(*) from public.critical_update_releases$$,
  '42501', 'permission denied for table critical_update_releases',
  'account holders cannot read the editorial release queue'
);
select throws_ok(
  $$select public.generate_targeted_critical_update_events(now(), 25)$$,
  '42501', 'permission denied for function generate_targeted_critical_update_events',
  'account holders cannot generate critical-update events'
);

select * from finish();
rollback;
