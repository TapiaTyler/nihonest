begin;

select plan(27);

select has_table('public', 'saved_content', 'saved content table exists');
select has_table('public', 'glossary_study_progress', 'glossary progress table exists');
select has_table('public', 'checklist_progress', 'checklist progress table exists');

select col_is_pk(
  'public',
  'saved_content',
  array['user_id', 'content_kind', 'content_id'],
  'saved content has an owner-and-content primary key'
);
select col_is_pk(
  'public',
  'glossary_study_progress',
  array['user_id', 'term_id'],
  'glossary progress has an owner-and-term primary key'
);
select col_is_pk(
  'public',
  'checklist_progress',
  array['user_id', 'checklist_id'],
  'checklist progress has an owner-and-step primary key'
);

select policies_are(
  'public',
  'saved_content',
  array['Users can manage their own saved content'],
  'saved content has only its owner-scoped policy'
);
select policies_are(
  'public',
  'glossary_study_progress',
  array['Users can manage their own glossary progress'],
  'glossary progress has only its owner-scoped policy'
);
select policies_are(
  'public',
  'checklist_progress',
  array['Users can manage their own checklist progress'],
  'checklist progress has only its owner-scoped policy'
);

insert into auth.users (id, email)
values
  ('30000000-0000-4000-8000-000000000003', 'sync-owner@example.test'),
  ('40000000-0000-4000-8000-000000000004', 'sync-other@example.test');

insert into public.saved_content (user_id, content_kind, content_id, state, updated_at)
values ('40000000-0000-4000-8000-000000000004', 'article', 'other-guide', 'saved', '2026-09-08T09:00:00.000Z');
insert into public.glossary_study_progress (user_id, term_id, state, review_count, updated_at)
values ('40000000-0000-4000-8000-000000000004', 'other-term', 'new', 0, '2026-09-08T09:00:00.000Z');
insert into public.checklist_progress (user_id, checklist_id, state, updated_at)
values ('40000000-0000-4000-8000-000000000004', 'other-step', 'not-started', '2026-09-08T09:00:00.000Z');

set local role authenticated;
select set_config('request.jwt.claim.sub', '30000000-0000-4000-8000-000000000003', true);

select results_eq($$select count(*) from public.saved_content$$, array[0::bigint], 'another user saved content is hidden');
select results_eq($$select count(*) from public.glossary_study_progress$$, array[0::bigint], 'another user glossary progress is hidden');
select results_eq($$select count(*) from public.checklist_progress$$, array[0::bigint], 'another user checklist progress is hidden');

select lives_ok(
  $sql$
    select public.sync_account_content(
      '[{"kind":"article","contentId":"banking","state":"saved","updatedAt":"2026-09-08T12:00:00.000Z"}]'::jsonb,
      '[{"termId":"zairyu-card","state":"reviewed","reviewCount":2,"lastReviewedAt":"2026-09-08T12:00:00.000Z","updatedAt":"2026-09-08T12:00:00.000Z"}]'::jsonb,
      '[{"checklistId":"register-address","state":"complete","completedAt":"2026-09-08T12:00:00.000Z","updatedAt":"2026-09-08T12:00:00.000Z"}]'::jsonb
    )
  $sql$,
  'an authenticated transfer stores all three record families'
);

select results_eq($$select count(*) from public.saved_content$$, array[1::bigint], 'the owner reads the transferred saved record');
select results_eq($$select count(*) from public.glossary_study_progress$$, array[1::bigint], 'the owner reads the transferred glossary record');
select results_eq($$select count(*) from public.checklist_progress$$, array[1::bigint], 'the owner reads the transferred checklist record');

select results_eq($$select state from public.saved_content where content_id = 'banking'$$, array['saved'::text], 'saved state transfers correctly');
select results_eq($$select review_count from public.glossary_study_progress where term_id = 'zairyu-card'$$, array[2], 'review count transfers correctly');
select results_eq($$select state from public.checklist_progress where checklist_id = 'register-address'$$, array['complete'::text], 'checklist state transfers correctly');

select lives_ok(
  $sql$
    select public.sync_account_content(
      '[{"kind":"article","contentId":"banking","state":"removed","updatedAt":"2026-09-08T11:00:00.000Z"}]'::jsonb,
      '[{"termId":"zairyu-card","state":"new","reviewCount":0,"updatedAt":"2026-09-08T11:00:00.000Z"}]'::jsonb,
      '[{"checklistId":"register-address","state":"in-progress","updatedAt":"2026-09-08T11:00:00.000Z"}]'::jsonb
    )
  $sql$,
  'a stale device payload is accepted without replacing newer account records'
);

select results_eq($$select state from public.saved_content where content_id = 'banking'$$, array['saved'::text], 'stale saved content does not overwrite account state');
select results_eq($$select review_count from public.glossary_study_progress where term_id = 'zairyu-card'$$, array[2], 'stale glossary progress does not overwrite account state');
select results_eq($$select state from public.checklist_progress where checklist_id = 'register-address'$$, array['complete'::text], 'stale checklist progress does not overwrite account state');

select lives_ok(
  $sql$
    select public.sync_account_content(
      '[{"kind":"article","contentId":"banking","state":"removed","updatedAt":"2026-09-08T12:00:00.000Z"}]'::jsonb,
      '[]'::jsonb,
      '[]'::jsonb
    )
  $sql$,
  'an equal-time removal transfers successfully'
);
select results_eq($$select state from public.saved_content where content_id = 'banking'$$, array['removed'::text], 'an equal-time removal prevents resurrection');

select results_eq(
  $$select jsonb_array_length(public.sync_account_content('[]'::jsonb, '[]'::jsonb, '[]'::jsonb)->'savedContent')$$,
  array[1],
  'the transfer response contains the canonical owner-scoped records'
);

reset role;
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select throws_ok(
  $$select public.sync_account_content('[]'::jsonb, '[]'::jsonb, '[]'::jsonb)$$,
  '42501',
  'permission denied for function sync_account_content',
  'anonymous transfers are rejected at the database privilege boundary'
);

select * from finish();
rollback;
