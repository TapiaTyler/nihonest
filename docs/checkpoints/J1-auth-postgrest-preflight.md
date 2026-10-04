# J1 dedicated Auth/PostgREST acceptance preparation — 2026-10-04

Implementer: Codex. Reviewer: Claude. Base: `90804bb` (tree identical to validated handoff `f70069c`).
Bounded implementation complete; review and integration pending. This is read-only preparation, not
completion of the real Auth/PostgREST/fake-sender acceptance gate.

## Read-only entry point

```sh
node --import ./scripts/notification-worker-register.mjs --import tsx scripts/acceptance/notification-worker-auth-preflight.ts --source-ref <exact-40-character-HEAD> --supabase-url http://127.0.0.1:<dedicated-port>
```

Set only `J1_ACCEPTANCE_SECRET_KEY` explicitly from the separately owned disposable stack. The script
does not inherit normal Supabase, site, email or AWS settings. Help reads no credentials or inventory.
Missing/unexpected arguments, dirty checkout, missing key, non-exact/different commit or a non-loopback
origin fail before administrative client construction. Existing H3a job-origin validation also rejects
credentials, paths/query/fragments; production configuration validation is unchanged.

The preflight uses real installed Supabase SDK requests, bounded by the existing 10-second/2-MiB/no-redirect
fetch wrapper with SDK database retries disabled. It reads one Auth admin user at most, exact HEAD counts
for all eleven account/notification/critical-release tables, and the production store's database-clock
RPC. Count metadata and clock must be valid, with all inventories empty. Auth errors, unavailable tables
or clock, and occupied stacks fail closed. CLI output is aggregate-only and sanitizes every failure.

No fixture creation/deletion, generation, preparation, claim, finalization, provider or worker pass occurs.
The clock RPC is a POST that reads database time; table reads are HEAD and Auth inventory is GET.
The successful `ready-for-fixtures` result does not authorize an ordinary local worker run or identify
deployed migration contents. Empty inventory cannot establish exclusivity: independently verify ownership,
exact applied migrations, disposable credentials and absence of other clients before a future mutating
harness. Do not use Claude's H5 stack or a hosted endpoint.

## Validation

- New tests: **16 passed**, including unsafe origin/source/key rejection before inventory construction,
  occupied/incomplete inventories, invalid clock, missing count metadata and denied Auth administration.
- Real SDK requests under a fetch fixture verify the exact read-only endpoint/method inventory, bounded
  fetch options and no worker/provider operations. These are transport fixtures, not a real local Auth run.
- With existing CLI/command tests: **41 passed / three files**. TypeScript, targeted ESLint and architecture
  passed (**713 production modules**). Help and unexpected-argument CLI probes passed; errors do not echo
  the private argument canary. Whitespace passed.
- An initial test expected one specific error while three failing concurrent reads competed; it was
  replaced with isolated Auth-denial and missing-count cases, preserving the failure assertions.
- Existing dependencies; no new packages, clean install, full release/browser repetition, database
  fixtures, Auth user creation, email or hosted execution. Prior validated combined evidence remains
  `0e5fcf9` plus documentation handoff `f70069c`.

## Next isolated-stack scenarios

The next harness must provision its own disposable stack from reviewed source, verify migration identity,
run this preflight and create only its uniquely tagged fixture accounts. Use the actual Auth admin and
PostgREST adapter; inject an in-process fake sender into the existing worker runner, with no SES imports
or enabled email configuration. Cleanup must run in finally and affect only owned fixtures/stack.

| Scenario | Required observation |
| --- | --- |
| Missing notification preferences | Preparation produces no email delivery; defaults remain false. |
| Confirmed opted-in Auth recipient | Address comes from current Auth identity, fake sender receives once, sent row/acknowledgement persists. |
| Unconfirmed or absent email | No sender invocation; terminal suppression, never repeated context failure. Establish valid real Auth fixture capabilities first. |
| Consent/reminder withdrawn after claim | Mutate only owned fixture between actual claim and context read; no send, suppression persists. |
| Critical target no longer relevant | Actual saved/preference state changes before context read; no send. |
| Fake provider failure/timeout | Persisted retry state, attempt count and database-authoritative retry availability; bounded pass continues as specified. |
| Finalization response lost after commit | Actual finalizer commits, wrapper loses its acknowledgement; report uncertainty while database remains sent and cannot be reclaimed. |
| Lease reclaimed / expired before finalization | Adapter reports rejection with no row mutation or additional send; complements existing SQL concurrency evidence. |

Do not claim these scenarios passed from the preflight or mock tests. J1 scheduling additionally requires
the exhausted-backlog incident acknowledgement/resolution contract and operational host decisions.
H5 callback/PGRST303 investigation, final hosted acceptance, Stage-C ownership transfer and Japanese
component provenance gates stay open. No main merge or activation.
