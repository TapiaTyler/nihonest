# Notification worker operations

This is the operating contract for J1's one-pass command. It is **not an activation instruction**.
The worker, explicit local target, operator procedure and local acceptance harnesses are code-reviewed and
integrated. Recorded real local evidence includes 72 notification pgTAP assertions, 49 operator-procedure
assertions, 36 concurrency assertions (also rerun on reviewed combined SQL), and 14 Auth/PostgREST scenarios
with a fake sender. Review attribution, tested sources and limits are in
[the current acceptance status](checkpoints/J1-local-acceptance-status-20261004.md).

Host/scheduler/credentials/monitoring decisions, scoped exhausted-backlog operator approval and any real
provider/hosted acceptance remain separate gates. No schedule, hosted service or real email is activated.
[The earlier preparation record](checkpoints/J1-acceptance-preparation.md) is historical planning; the current
status above supersedes its pending local-gate statements without extending the recorded evidence.

## Command and configuration

`npm run notification:once` runs one bounded pass and exits. It is not a web route or a resident worker.
Use `npm run --silent notification:once` when a scheduler needs only the command's JSON line without npm's
script banner.
`npm run notification:once -- --help` prints usage without reading job settings or making service calls.
The command defaults to the **production job** target and validates settings through H3a's
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

For isolated acceptance only, `npm run --silent notification:once -- --target local` selects H3a's
local target, with additional worker restrictions: the Supabase origin must use `localhost`, `127.0.0.1`
or `[::1]`, and email must be disabled. Validation precedes provider/store construction. Explicit
`--target production` retains the default production rules; no settings infer the target automatically.
Local mode still writes events/deliveries and requires an intentionally selected disposable stack and its
service credential. A loopback address does not prove the database is disposable: check its identity and
avoid tunnels to hosted data. Fake-sender acceptance uses a separate injected runner harness; local CLI
mode cannot enable SES. This option starts no stack and installs no scheduler.

Additional targeting fixture `66b0721` **awaits independent review/integration**.
[Its 25-scenario real local run](checkpoints/J1-published-critical-targeting-20261004.md), against reviewed
production `1a4ab65`, adds published-release saved-status/journey/route targeting, mismatch exclusions,
deduplication and post-claim relevance/consent changes. This extends pending harness evidence; it does not
replace hosted/provider acceptance or authorize operation on real rows.

## Work bounds and concurrency

One pass has defaults of at most 100 due reminder events, 25 targeted critical releases, 100 delivery
preparations and 25 one-at-a-time email claims. Claims have a 300-second lease and five-attempt limit.
Database/provider operations each have a 10-second deadline; the configured SES client makes one SDK
attempt and the runner reserves lease time for finalization. The Supabase adapter limits response bodies to
2 MiB and disables SDK database retries. SQL claims use `FOR UPDATE SKIP LOCKED` and token-bound finalization,
and reviewed local PostgreSQL acceptance covers competing claims and post-lock lease expiry.
After the separate scheduling gate, start with one invocation at a time; choose frequency from measured run duration,
backlog and provider/database costs. The command contains no scheduler and no cost-creating background loop.

Additional local recovery fixture `44990f8` **awaits independent review/integration**.
[Its 15-scenario run](checkpoints/J1-uncertain-send-recovery-20261004.md), against reviewed production
`1a4ab65`, demonstrates two accepted fake sends for one event when finalization never commits and the
lease is reclaimed. Immediate retry cannot claim live processing; successful recovery finalization prevents
a third send. This is fake-provider evidence, not real SES or actual HTTP-loss acceptance.

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

## Disposable operator regression reproduction

New harness checkpoint `832d9c7` is locally validated and **awaits independent review/integration**.
[Its record](checkpoints/J1-operator-reproduction-20261004.md) supplies an exact-source reproduction of
the resolution checks without a shared stack or deployed rows:

```text
node scripts/acceptance/notification-worker-operator.mjs --source-ref <reviewed-40-character-commit>
```

It requires the existing local PostgreSQL image, creates a uniquely owned network-disabled fixture with no
ports/host binds, reads committed SQL and removes the fixture/anonymous volumes in finally. Final acceptance
against `1a4ab65`: 59 assertions passed; a commit-for-rehearsal negative control failed as expected. This
harness is test infrastructure, not approval to execute the procedure on real deliveries.

## Exhausted-backlog investigation and terminal resolution

This procedure is code-reviewed and has recorded disposable PostgreSQL acceptance. Operational use still
requires the scoped environment/row/investigation/reviewer decision below; code review does not authorize
scheduling or changes to deployed data. Exit semantics remain unchanged: exhausted rows keep exit code 1;
an incident acknowledgement never turns a failed report into success or hides the backlog counters.

1. Open a private incident and acknowledge the aggregate alert. Record the target environment, delivery
   ID, state/attempts, lease expiry, investigation evidence, decision, operator and reviewer. Keep recipient
   data, errors and provider evidence out of public docs/scheduler logs. Acknowledge duplicate alerts in
   that incident while continuing to investigate new work and infrastructure failures independently.
2. For expired processing, determine provider acceptance from restricted provider records. Timeout/lease
   expiry is not proof that no email was sent. If the outcome is unknown, record it as uncertain. Never
   mark it sent without evidence or reset/requeue automatically. A replacement send requires a separately
   reviewed procedure with consent/relevance checks and explicit acceptance of duplicate-send risk.
3. If the reviewed decision is to **abandon this delivery permanently**, preserve necessary sanitized
   failure evidence in the private incident before suppression clears `last_error`. Use an authorized
   database administrator connection to rehearse `scripts/sql/resolve-exhausted-email-delivery.sql` with
   `psql -X -v delivery_id=<uuid> -v resolution_reference=<incident-reference> -f <script>`.
   Supply connection credentials through the protected connection environment, never command arguments.
   The script defaults to ROLLBACK. The reference is validated but not stored in the database; the private
   incident is the audit record and must include the resulting state and execution time.
4. After confirming the exact environment/row and receiving the scoped resolution review, repeat with
   `-v commit_resolution=true`. Only that explicit invocation commits terminal suppression. The script
   locks one email row, then uses database wall time to require a failed or expired-processing delivery
   with at least five attempts. Absent, live, retryable or already-terminal rows produce a nonzero psql exit with no
   changes. Attempts, last-attempt time, event and available-at are preserved; claims are cleared. This
   records a decision not to attempt delivery again, not whether the provider actually sent a message.
5. Confirm the row is suppressed, append the result to the private incident and re-read aggregate
   backlog through `inspect_email_notification_delivery_backlog(5)`. Resolve all separately reviewed
   rows; any remaining exhausted counts still cause exit 1. A later deliberate pass may also fail for
   independent work; zero backlog alone does not establish worker success or authorize scheduling.

No worker or scheduled process invokes this procedure. It does not change grants, delete deliveries,
reset attempts or requeue events. Suppression is terminal; rollback after commitment requires a separate
reviewed recovery decision, not a reverse update or rerun of this script.
