# J1 real local Auth/PostgREST and fake-sender acceptance — 2026-10-04

Implementer: Codex. Reviewer: Claude. Harness base: `759a4e4` (preflight now code-approved by Claude).
**Tested production source: `f70069c4bb7b2d63548181cfe5d9e03e182a894d`**, the validated integration
handoff. New harness/evidence review and integration remain pending; no automatic promotion of ancestors.

## Isolation and source verification

Installed Supabase CLI **2.116.0** and existing images were used. A new external artifact directory
`j1-auth-stack-20261004` had exact `git show` copies of all eight reviewed migrations and the source's
Supabase config. Only local setup settings changed: unique project `nihonest-j1-auth-20261004`, API/DB/
shadow/studio/SMTP ports **55431/55432/55430/55433/55434**, studio and local SMTP disabled.
The repo's Claude-owned config and Claude's running `nihonest-h5` stack were untouched.

Start command, from the Codex repo (the stack directory is an absolute external artifact path):

```sh
node node_modules/supabase/dist/supabase.js start --workdir <owned-stack-dir> --exclude realtime,storage-api,imgproxy,mailpit,postgres-meta,studio,edge-runtime,logflare,vector,supavisor
```

Only the owned database, Auth, PostgREST and Kong services started. No SMTP, browser site, SES client,
resident worker or scheduler was used. Existing dependencies/images; no clean install. Provisioning was
manual and separate from the committed scenario harness; it is not yet a one-command stack lifecycle.

The harness requires an exact 40-hex source commit. It checks production `src`, migrations, packages,
TypeScript configuration and standalone bootstrap files against that commit (including tracked working-copy
changes and untracked production files), excluding
only the two separately reviewed preflight files. Its own script is test infrastructure under review.
It requires a `nihonest-j1-auth-*` project, independently verifies the database container's project/workdir
labels, compares every copied migration byte-for-byte after LF normalization and verifies the database's
eight migration-history versions. Administrative credentials come only from that verified local CLI
project's status, stay in memory and are never printed. Preflight then requires loopback and empty Auth/
eleven-table inventories plus valid database time before any fixtures are created.

```sh
node --import ./scripts/notification-worker-register.mjs --import tsx scripts/acceptance/notification-worker-auth.ts --source-ref f70069c4bb7b2d63548181cfe5d9e03e182a894d --stack-dir <owned-stack-dir>
```

The real production runner/adapter calls actual Auth admin and PostgREST with bounded I/O. Only the
email sender is fake. After-claim hooks and the lost-response wrapper delegate to the actual store first;
they mutate only the current fixture or deliberately drop an acknowledgement after the actual RPC commits.

## Final result: 14 scenarios passed

| Scenario | Observed persisted behavior |
| --- | --- |
| Missing preferences, duplicate pass | One suppressed delivery; zero claims/sends. Second pass generates/prepares nothing. |
| Confirmed opted-in recipient | Actual Auth email reaches fake sender once; sent row, attempt 1, provider ID and cleared claim persist; repeat does not resend. |
| Delivery disabled | Real generation/preparation creates pending work, attempt 0; zero claims. Disabled delivery is not a dry run. |
| Unconfirmed email | Actual unconfirmed Auth account is suppressed on attempt 1, no context error or fake send; repeat remains terminal. |
| Phone-only/no email | Auth admin creates a phone-confirmed account without sending SMS; absent email is suppressed on attempt 1, no fake send/retry loop. |
| Email consent withdrawn after claim | Actual SQL claim occurs, fixture preferences change before real context read; terminal suppression, zero send. |
| Deadline consent withdrawn after claim | Same for deadline preference; this is not deletion/cancellation of a fulfilled reminder. |
| Relevant critical saved target | Real saved-state context permits one fake send and persisted sent state. |
| Critical saved target removed after claim | Real saved-state read observes removed target; suppression, zero send. |
| Fake provider rejects | Failed row, attempt 1, cleared claim and database-computed retry at least 59 seconds beyond updated time; immediate pass cannot resend. |
| Fake provider times out | Abort-aware fake receives runner deadline cancellation; same bounded retry persistence and no immediate resend. |
| Finalization acknowledgement lost | Actual finalizer commits sent, wrapper throws; report has one infrastructure error and zero acknowledged sends, exit 1. Next pass cannot reclaim/resend. |
| Expired token finalization | Actual adapter/RPC rejects finalization and full row snapshot is unchanged. |
| Reclaimed old token | Reclaim increments attempt to 2 and changes token. Old token rejects without any row mutation; new token can suppress. |

The last two cases shorten only an owned processing fixture's database expiry after an actual 300-second
claim, avoiding a five-minute wait. They exercise adapter rejection, not a guarantee of atomicity between
provider send and database lease expiry. Existing separate SQL concurrency evidence covers real competing
connections and post-lock expiry. No uncertain real email delivery occurred.

Each scenario creates one Auth fixture (random unique email for email identities), records its returned ID, and deletes only that
ID in finally. Cascading cleanup is followed by another complete empty-inventory preflight before the next
global generation/claim pass. An outer finally retries cleanup for recorded remaining IDs. Final full
inventory was empty. This guards leftover fixtures; operators must still exclusively own the disposable
stack throughout the run. The first ten-scenario run also passed before the four extra cases were added.

## Checks, negative control and cleanup

- TypeScript and targeted ESLint passed; help starts no clients. Whitespace passed. No production runtime,
  SQL, translation or dependency implementation changed; full web release/build/browser suites were not repeated.
- A comment was temporarily appended to the copied authority migration, then the harness was run unchanged:
  it failed at `migration-source` before reading credentials/creating fixtures. Exact bytes were restored
  in finally. This is a source-verification negative control, not an altered-SQL runtime test.
- Stop command: `node node_modules/supabase/dist/supabase.js stop --workdir <owned-stack-dir>
  --project-id nihonest-j1-auth-20261004 --no-backup`. Owned containers and disposable volumes removed;
  external setup files retained as artifacts. Claude's stack was not stopped, restarted or modified.

This establishes local worker Auth-admin/PostgREST/fake-sender behavior for the listed cases. It does not
establish browser/user-JWT refresh or account RLS/session behavior (H5), hosted signing keys, real SES
acceptance, every critical-update targeting branch, HTTP response-loss injection, or provider acceptance
followed by recovery of an unfinalized claim. The lost-acknowledgement fixture wraps a real committed RPC;
it is not an actual broken network connection. Backlog operational acknowledgement/resolution and host/
schedule decisions remain gates. Source integration stays `f70069c` until exact-hash review/integration;
no main merge, activation, Stage-C transfer or Japanese artifact approval.
