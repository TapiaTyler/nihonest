# J1 preparation handoff

Implementer: Codex. Intended reviewer: Claude. Branch: `codex/hosting-native-refactor`.
Base: `4bc3df9`. Date: 2026-09-28.

Local preparation is implemented; review and integration are pending. **J1 is not complete.**
Configuration wiring requires Claude's reviewed H3a commit to be integrated through the designated
integration checkout and brought into this branch. No completion message substitutes for that commit.
This record is supplied to the integration owner; shared `docs/refactor.md` and `docs/ROADMAP.md`
statuses are intentionally left for consolidated updates at the gate.

## Delivered scope

- `src/lib/notifications/notification-worker.ts`: injectable server-only orchestration, narrow store and
  provider contracts, validated SQL-compatible limits, aggregate reporting, and an exit-code result.
- `src/lib/notifications/notification-worker.test.ts`: in-memory fixtures with no Supabase, AWS, or email I/O.
- Jobs disabled: no store/provider calls. Delivery disabled: generate events and prepare durable decisions,
  but do not claim work, consume attempts, construct providers, or send messages.
- Enabled delivery: claim one message just before processing, read current account context, reuse existing
  consent/relevance/dispatch rules, check lease expiry before sending, and finalize with the original token.
- Context errors become generic failed completions with bounded backoff. Provider failures use existing
  sanitized dispatch errors. Finalization failures leave claims for SQL recovery; other work can continue.
  Counts reflect acknowledged finalizations, so provider acceptance alone does not increment `sent`.
- Failure, expired claims, and infrastructure errors produce exit code 1. Reports contain only counters
  and fixed statuses; raw exceptions, recipient addresses, titles, payloads, tokens, and IDs are excluded.

No configuration, Supabase modules, SQL migrations, translations, shared tests, package scripts/dependencies,
or Claude-owned rendering files changed. Installed Next.js server/client boundary and server-only guidance
were read before implementation. The eventual CLI still needs an appropriate server-only module bootstrap.

## SQL contract inspected

| Store operation | Existing SQL function | Meaning of limit/result |
| --- | --- | --- |
| `generateDueReminderEvents` | `generate_due_reminder_events` | Limit 1–1000 reminders; result counts fulfilled reminders, not newly inserted events. |
| `generateTargetedCriticalUpdateEvents` | `generate_targeted_critical_update_events` | Limit 1–100 published releases; result counts inserted recipient events. |
| `prepareEmailDeliveries` | `prepare_email_notification_deliveries` | Limit 1–1000 events; result counts inserted decisions including suppressed ones. |
| `claimEmailDeliveries` | `claim_email_notification_deliveries` | Runner requests one row, max 5 attempts, lease 30–3600 seconds (default 300). |
| `finalizeEmailDelivery` | `finalize_email_notification_delivery` | Pass delivery ID, original token, terminal state, completion time, and only applicable result metadata. |

The adapter must normalize PostgreSQL timestamps to ISO UTC strings, map snake-case rows to existing domain
schemas, load event/preferences by the claimed owner, look up the current auth recipient using server
credentials, and load current saved items/journey context for critical updates. Missing preferences should
use the existing disabled defaults; deleted accounts, lookup failures, and malformed events must fail closed.
Recipient addresses must never come from event payloads or be persisted into delivery records.

SQL owns unique event/decision constraints, reminder fulfillment, release eligibility, atomic `skip locked`
claims, attempts, retry eligibility, lease reclaim, token replacement, and stale finalizer rejection.
The runner owns call order, input validation, current consent/relevance checks, provider invocation, bounded
delivery passes, sanitized results, and passing the original claim token. The store adapter must enforce
bounded network I/O. Fixtures model leases to test orchestration; they **do not prove SQL concurrency**.

## Recovery and workload findings for review

1. Exactly-once email is not guaranteed. Provider acceptance followed by a lost/failed finalization or lease
   expiry leaves a processing row that can be reclaimed and sent again. SES acceptance and PostgreSQL
   finalization are separate operations. Do not immediately resend after a finalization error; surface the
   nonzero result and inspect uncertain attempts. No provider-side deduplication has been added.
2. Critical generation's limit bounds releases, not recipients. One published release may generate an event
   for every matching topic subscriber. This needs database workload assessment at the hosted gate; the
   per-pass delivery cap bounds sends but does not bound that SQL fan-out.
3. Consent/relevance is loaded immediately before dispatch, but an account can change after the read.
   There is no transaction spanning the account read and external provider call. Tests establish the
   existing read-before-send behavior, not atomic withdrawal during an in-flight request.
4. Claim expiry is checked before and after dispatch. A request that exceeds its lease can still be accepted
   externally. The real database/provider adapters must use timeouts shorter than the lease, account for
   provider retries, and reserve time for finalization. A `Promise.race` alone does not cancel a send.

## Validation

- Focused Vitest: worker fixtures plus existing dispatch/delivery tests pass (30 tests across 3 files).
  Covers enabled/disabled jobs/delivery, opt-in/out and withdrawn consent, duplicate and overlapping runs,
  expired/reclaimed claims, critical relevance fail-closed, provider failure/backoff/attempt ceiling,
  slow failures, partial context/finalization errors, mismatched owners, invalid recipients, and limits.
- `npx tsc --noEmit`: passed.
- Targeted ESLint for both added TypeScript files: passed.
- `npm run architecture:check`: passed for 678 production modules.
- `git diff --check`: passed.
- Full suite, production build, CMS exclusion, isolated database integration, and hosted/manual checks
  are pending the complete J1 implementation and combined review gate. This module has no application
  consumer yet; preparation checks do not establish deployment or batch acceptance.

## Next steps after the H3a handoff

1. Record the reviewed H3a hash, changed files, public settings interface, feature flags, runtime/build-time
   settings, job-only credentials, and disabled-feature tests. Integrate the reviewed result into this branch
   without discarding this independent commit.
2. Implement the real store adapter and run-once command against that configuration contract. Announce any
   `package.json` script addition; do not reorder scripts or modify dependency sections without coordination.
3. Add command/RPC mapping tests and an isolated local database/runner integration run with a fake provider,
   including actual PostgreSQL concurrent claims, expired/stale tokens, deduplication, and RLS. Do not reuse
   or reset another worktree's database. Record exact environment, migration set, and results.
4. Complete scheduler/operator documentation with settings from H3a: least-privilege server credentials,
   no public job endpoint, finite run frequency and batch limits, per-operation timeouts, overlap/recovery,
   aggregate logs, nonzero-exit alerts, SES spend controls, and backlog/terminal-failure inspection. Scheduling
   location and frequency remain operating decisions; no schedule is created by this preparation.
5. Obtain Claude's J1 review, integrate only reviewed commits into the integration branch, run applicable
   combined gates, record the validated commit, and bring it into working branches before dependent work.

Staging validation and production activation are pending. Real email, hosted jobs, and public deployment
remain disabled; an explicitly authorized opt-in hosted test is a separate gate. J2 waits for its execution
location decision. No merge into `main` is part of this work.
