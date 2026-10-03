# Notification worker operations

This is the operating contract for J1's one-pass command. It is **not an activation instruction**: the
database-authority, recipient, lease-budget and command checkpoints still need reciprocal review and
integration, and the real isolated Supabase/PostgreSQL concurrency and pgTAP gates remain open. No schedule,
hosted service or real email has been activated by these commits.

[The acceptance preparation record](checkpoints/J1-acceptance-preparation.md) lists the outstanding
database, lock-wait, Auth/PostgREST and fake-sender scenarios. Local fixture results do not replace those gates.

## Command and configuration

`npm run notification:once` runs one bounded pass and exits. It is not a web route or a resident worker.
Use `npm run --silent notification:once` when a scheduler needs only the command's JSON line without npm's
script banner.
`npm run notification:once -- --help` prints usage without reading job settings or making service calls.
The command always validates the **production job** settings in the process environment through H3a's
`requireJobConfig` before constructing a client. A deployment preflight can use
`npm run config:check -- --deployment job --target production`; add `--require emailDelivery` only if the
deployment is supposed to send. The job needs `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or the
legacy service-role key). It does not need a browser publishable key. When `EMAIL_DELIVERY_ENABLED=true`, it
also needs the H3a SES provider, region, sender name/address and HTTPS `NEXT_PUBLIC_SITE_URL` settings,
plus AWS credentials supplied by the SDK's normal credential chain. Keep secrets only in the job's runtime
environment; never pass them as arguments or put them in build-time public settings.

With email disabled, a pass **still generates reminder/critical events and prepares deliveries** in the
database, but makes no claim, recipient lookup or provider call. Running with email disabled is therefore
not a no-op or a dry run. The only no-I/O command option is `--help`.

## Work bounds and concurrency

One pass has defaults of at most 100 due reminder events, 25 targeted critical releases, 100 delivery
preparations and 25 one-at-a-time email claims. Claims have a 300-second lease and five-attempt limit.
Database/provider operations each have a 10-second deadline; the configured SES client makes one SDK
attempt and the runner reserves lease time for finalization. The Supabase adapter limits response bodies to
2 MiB and disables SDK database retries. SQL claims use `FOR UPDATE SKIP LOCKED` and token-bound finalization,
but overlapping invocations and lock waits still need real PostgreSQL acceptance before relying on them.
Start with one scheduler invocation at a time after that gate; choose frequency from measured run duration,
backlog and provider/database costs. The command contains no scheduler and no cost-creating background loop.

The runner uses database time for lease decisions. A timeout or post-send expiry can leave uncertain provider
acceptance. A later reclaim may send a duplicate; the command does not promise exactly-once delivery.
Suppressed deliveries are terminal; a later email confirmation does not revive the old event. Failed deliveries
retry with database-calculated backoff until attempt five. Exhausted failures and expired fifth claims are
reported as aggregate counts for investigation; the worker does not reset, requeue or delete them.

## Output, response and rollback

The worker script prints one JSON line of aggregate counters and exits 0 when the pass completed without a reported
error, or 1 for failed work, infrastructure errors, expired claims or exhausted backlog. Invalid configuration
prints `configuration-error` with setting **names only** and exits 1; unexpected startup failure prints
`startup-failed` without SDK or SQL diagnostics. Reports contain no addresses, account IDs, message bodies,
tokens or secret values. Monitor `status`, `exitCode`, `infrastructureErrors`, `expiredClaims`,
`exhaustedFailures` and `exhaustedExpiredClaims`, as well as sent/suppressed/failed counts. Investigate an
uncertain send with provider records before manually requeuing; automatic resets can cause duplicates.

For a future rollback, stop the scheduler first and set `EMAIL_DELIVERY_ENABLED=false` for later deliberate
job runs. Disabling delivery leaves pending rows untouched. It does not undo previously accepted sends or
change existing delivery state. Database rollback/requeue requires a separate, reviewed recovery procedure.
