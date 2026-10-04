begin;
select plan(13);

select ok(to_regprocedure('public.sync_account_content(jsonb,jsonb,jsonb)') is null,
  'the legacy unbound RPC no longer exists');
select throws_ok($$select public.sync_account_content('[]'::jsonb, '[]'::jsonb, '[]'::jsonb)$$,
  '42883', null, 'omitting the required expected identity cannot invoke synchronization');
select is((select prosecdef from pg_proc where oid =
  'public.sync_account_content(uuid,jsonb,jsonb,jsonb)'::regprocedure), false,
  'bound synchronization remains security invoker');
select ok(has_function_privilege('authenticated', 'public.sync_account_content(uuid,jsonb,jsonb,jsonb)', 'execute'),
  'authenticated callers can execute the bound RPC');
select ok(not has_function_privilege('anon', 'public.sync_account_content(uuid,jsonb,jsonb,jsonb)', 'execute'),
  'anonymous callers cannot execute the bound RPC');

insert into auth.users (id, email) values
  ('60000000-0000-4000-8000-000000000006', 'binding-a@example.test'),
  ('70000000-0000-4000-8000-000000000007', 'binding-b@example.test');
insert into public.saved_content (user_id, content_kind, content_id, state, updated_at)
select id, 'article', 'binding-guide', 'saved', '2026-10-03T00:00:00Z' from auth.users
where id in ('60000000-0000-4000-8000-000000000006', '70000000-0000-4000-8000-000000000007');
insert into public.glossary_study_progress (user_id, term_id, state, review_count, updated_at)
select id, 'binding-term', 'new', 0, '2026-10-03T00:00:00Z' from auth.users
where id in ('60000000-0000-4000-8000-000000000006', '70000000-0000-4000-8000-000000000007');
insert into public.checklist_progress (user_id, checklist_id, state, updated_at)
select id, 'binding-step', 'not-started', '2026-10-03T00:00:00Z' from auth.users
where id in ('60000000-0000-4000-8000-000000000006', '70000000-0000-4000-8000-000000000007');

create temporary table binding_before as select
  (select jsonb_agg(to_jsonb(t) order by user_id, content_kind, content_id) from public.saved_content t) as saved,
  (select jsonb_agg(to_jsonb(t) order by user_id, term_id) from public.glossary_study_progress t) as glossary,
  (select jsonb_agg(to_jsonb(t) order by user_id, checklist_id) from public.checklist_progress t) as checklist;

set local role authenticated;
select set_config('request.jwt.claim.sub', '60000000-0000-4000-8000-000000000006', true);
select throws_ok($sql$
  select public.sync_account_content('70000000-0000-4000-8000-000000000007'::uuid,
    '[{"kind":"article","contentId":"binding-guide","state":"removed","updatedAt":"2026-10-03T01:00:00Z"}]'::jsonb,
    '[{"termId":"binding-term","state":"learning","reviewCount":1,"updatedAt":"2026-10-03T01:00:00Z"}]'::jsonb,
    '[{"checklistId":"binding-step","state":"in-progress","updatedAt":"2026-10-03T01:00:00Z"}]'::jsonb)
$sql$, '42501', 'Account identity does not match the synchronization request.',
  'identity A cannot upload a snapshot intended for B');
select throws_ok($$select public.sync_account_content(null::uuid)$$,
  '42501', 'Account identity does not match the synchronization request.', 'null expected identity is rejected');
select set_config('request.jwt.claim.sub', '', true);
select throws_ok($$select public.sync_account_content('60000000-0000-4000-8000-000000000006'::uuid)$$,
  '42501', 'Account identity does not match the synchronization request.', 'missing JWT identity is rejected');
select set_config('request.jwt.claim.sub', '70000000-0000-4000-8000-000000000007', true);
select throws_ok($$select public.sync_account_content('60000000-0000-4000-8000-000000000006'::uuid, '{}'::jsonb)$$,
  '42501', 'Account identity does not match the synchronization request.',
  'switched identity B rejects A before payload processing');
reset role;

select is((select jsonb_agg(to_jsonb(t) order by user_id, content_kind, content_id) from public.saved_content t),
  (select saved from binding_before), 'rejections leave every saved row unchanged');
select is((select jsonb_agg(to_jsonb(t) order by user_id, term_id) from public.glossary_study_progress t),
  (select glossary from binding_before), 'rejections leave every glossary row unchanged');
select is((select jsonb_agg(to_jsonb(t) order by user_id, checklist_id) from public.checklist_progress t),
  (select checklist from binding_before), 'rejections leave every checklist row unchanged');

set local role authenticated;
select set_config('request.jwt.claim.sub', '70000000-0000-4000-8000-000000000007', true);
select results_eq(
  $$select public.sync_account_content('70000000-0000-4000-8000-000000000007'::uuid)->'savedContent'->0->>'contentId'$$,
  array['binding-guide'::text], 'matching B identity can read its canonical account state');
select * from finish();
rollback;
