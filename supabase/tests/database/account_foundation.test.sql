begin;

select plan(10);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'user_preferences', 'user preferences table exists');
select col_is_pk('public', 'profiles', 'user_id', 'profile ownership is the primary key');
select col_is_pk('public', 'user_preferences', 'user_id', 'preference ownership is the primary key');

select policies_are(
  'public',
  'profiles',
  array[
    'Users can read their own profile',
    'Users can create their own profile',
    'Users can update their own profile',
    'Users can delete their own profile'
  ],
  'profiles has only owner-scoped policies'
);

select policies_are(
  'public',
  'user_preferences',
  array[
    'Users can read their own preferences',
    'Users can create their own preferences',
    'Users can update their own preferences',
    'Users can delete their own preferences'
  ],
  'user preferences has only owner-scoped policies'
);

insert into auth.users (id, email)
values
  ('10000000-0000-4000-8000-000000000001', 'owner@example.test'),
  ('20000000-0000-4000-8000-000000000002', 'other@example.test');

insert into public.user_preferences (user_id, journey_stage, onboarding_completed)
values
  ('10000000-0000-4000-8000-000000000001', 'planning', true),
  ('20000000-0000-4000-8000-000000000002', 'preparing', true);

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);

select results_eq(
  $$select count(*) from public.profiles$$,
  array[1::bigint],
  'an authenticated user reads only their profile'
);

select results_eq(
  $$select count(*) from public.user_preferences$$,
  array[1::bigint],
  'an authenticated user reads only their preferences'
);

select lives_ok(
  $$update public.profiles set display_name = 'Owner' where user_id = '10000000-0000-4000-8000-000000000001'$$,
  'an authenticated user can update their profile'
);

select results_eq(
  $$update public.user_preferences set journey_stage = 'living-in-japan' where user_id = '20000000-0000-4000-8000-000000000002' returning user_id$$,
  $$select null::uuid where false$$,
  'an authenticated user cannot update another user preferences'
);

select * from finish();
rollback;
