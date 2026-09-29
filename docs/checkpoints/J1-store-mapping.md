# J1 Supabase store mapping handoff

Implementer: Codex. Intended reviewer: Claude. Branch: `codex/hosting-native-refactor`.
Base: `861ee5fc9c0364563f73dd078a48b920db3908fc`. Date: 2026-09-28.

Bounded adapter mapping/transport checkpoint; review and integration are pending. **J1 remains incomplete.**
This layer is not wired into a live command or application consumer. H3a is integrated, so the adapter accepts
its explicit validated job settings. Final command wiring waits for database-authoritative finalization time
and exhausted-claim inspection; these are still acceptance requirements, not addressed by this checkpoint.

## Scope

- `supabase-notification-worker-store.ts` creates an administrative SDK client from H3a's job URL/secret
  contract, with session persistence/refresh/URL detection disabled and PostgREST automatic retries disabled.
  It reads no environment, requires no publishable key, constructs no email provider, and performs no network
  I/O at construction. Existing Supabase/configuration modules and shared database types are unchanged.
- Generation/preparation/claims omit `p_now` and use the existing RPC database-time defaults. RPC names and
  limits map to the reviewed runner contract. Claim rows must be processing and stay within the requested
  limit. PostgreSQL offsets and fractional timestamps become ISO UTC before domain validation.
- Context reads filter the event by both event ID and claimed owner. Current preferences are validated;
  absent preferences default to disabled consent. The recipient is read only through Auth admin by user ID,
  with owner/email checks, and never from an event payload. Deleted accounts and malformed/mismatched rows
  fail closed. Critical relevance reads only the affected saved target (limit one) and current journey/route.
- Existing finalizer mapping passes the original token and only state-compatible metadata; incompatible
  completion metadata fails before a request. The acknowledged row must match the delivery ID and state.
  The existing finalizer still requires caller-supplied time. This is explicitly not the final live-worker
  clock design: valid-but-skewed time and database-authoritative finalization need a separate service-only
  database contract before a run-once command can use this layer.
- `worker-database-fetch.ts` applies a 10-second default request deadline (validated maximum 30 seconds)
  to PostgREST and administrative Auth, retaining it through response-body consumption. It forwards caller
  cancellation, refuses redirects, caps response bodies at 2 MiB, and sanitizes transport errors. Abort is
  passed to native fetch; this is not a race that leaves a request running. SDK retries are disabled so each
  operation has one bounded attempt. The eventual command must enforce a combined context/provider/finalizer
  budget shorter than its claim lease; this module alone does not establish that complete budget.

Only four new adapter/transport source/test files and this record change. No SQL, migrations, dependencies,
package scripts, translations, shared configuration/types, or Claude-owned rendering files change.
Installed Next.js server-only guidance and the installed Supabase SDK implementation/options were consulted.

## Verification

- Focused adapter/transport/runner suites: **48 tests across three files passed** (20 new mapping/transport
  cases plus 28 reviewed worker fixtures). Tests exercise the real SDK request serialization through an injected
  fixture fetch, not a handwritten substitute SDK: RPC names/arguments, H3a job-only settings, timestamp
  normalization, owner filters, Auth recipient source, missing consent, malformed/deleted/mismatched data,
  critical-target query bounds, completion metadata/token mapping, claim overrun, error privacy, disabled
  delivery, and disabled request retries. The body-deadline fixture uses a temporary loopback HTTP server,
  confirms headers arrive, then leaves the body open and verifies native fetch cancellation.
- Targeted ESLint, `tsc --noEmit`, and architecture (681 production modules) passed. Full
  `vitest run --maxWorkers=4` passed **587 tests across 151 files**; whitespace checks passed.
  Existing dependencies are used; no clean installation or live Supabase/email call is involved.
- Read-only Docker availability check found the installed client but no running daemon; no daemon, database,
  or other contributor's local stack was started/reset. Isolated PostgreSQL tests remain pending. Mocks do not
  prove RPC permissions, transactional claim exclusivity, RLS, finalizer expiry checks, or real SQL timestamps.
- Build/CMS exclusion are not repeated for this unconsumed server-only adapter checkpoint; final J1 acceptance
  requires the actual command and complete combined gates. No canonical/localized content changed.

## Next work

1. Agree and implement service-only database clock/finalization and exhausted-claim inspection contracts,
   preserving existing SQL idempotency, leases, consent, and stale-token rejection. Include expired attempt-five
   processing rows left by a clock failure or uncertain provider send.
2. Resolve standalone server-only loading without uncoordinated dependency changes; wire H3a into the run-once
   command with bounded provider I/O, sanitized reports, and no accidental provider construction when disabled.
3. Provision an isolated local database test setup with its own project identity/ports; prove SQL concurrency,
   stale/expired tokens, deduplication, and authorization using a fake provider. Do not reset another stack.
4. Complete operator/recovery/scheduling documentation and obtain full J1 review before integration/activation.

No schedule, hosted service, real email, production database, translation approval, or main merge is activated.
