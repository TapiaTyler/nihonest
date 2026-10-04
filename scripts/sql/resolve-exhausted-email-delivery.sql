-- Operator-only psql procedure. Default: rehearse and roll back. Never invoked by the worker.
\set ON_ERROR_STOP on
\if :{?delivery_id}
\else
  \echo exhausted-delivery-resolution: delivery_id is required
  do $$ begin raise exception 'A delivery ID is required.'; end $$;
\endif
\if :{?resolution_reference}
\else
  \echo exhausted-delivery-resolution: resolution_reference is required
  do $$ begin raise exception 'A resolution reference is required.'; end $$;
\endif
\if :{?commit_resolution}
\else
  \set commit_resolution false
\endif

begin;
set local lock_timeout = '5s';
set local statement_timeout = '10s';
select :'commit_resolution' in ('true', 'false') as valid_commit_flag \gset
\if :valid_commit_flag
\else
  rollback;
  do $$ begin raise exception 'commit_resolution must be exactly true or false.'; end $$;
\endif
select length(btrim(:'resolution_reference')) between 1 and 80 as valid_reference \gset
\if :valid_reference
\else
  rollback;
  \echo exhausted-delivery-resolution: reference must contain 1 to 80 characters
  do $$ begin raise exception 'A nonempty resolution reference is required.'; end $$;
\endif

-- Lock first; eligibility below uses database wall time after any lock wait.
select id from public.notification_deliveries
where id = :'delivery_id'::uuid and channel = 'email'
for update;

update public.notification_deliveries
set state = 'suppressed', claim_token = null, claim_expires_at = null,
    last_error = null, sent_at = null, provider_message_id = null
where id = :'delivery_id'::uuid and channel = 'email' and attempt_count >= 5
  and (state = 'failed' or (state = 'processing' and claim_expires_at <= clock_timestamp()));
\if :ROW_COUNT
  \if :commit_resolution
    commit;
    \echo exhausted-delivery-resolution: committed terminal suppression
  \else
    rollback;
    \echo exhausted-delivery-resolution: rehearsal rolled back
  \endif
\else
  rollback;
  \echo exhausted-delivery-resolution: row is absent or ineligible; no changes
  do $$ begin raise exception 'The exhausted delivery is absent or ineligible.'; end $$;
\endif
