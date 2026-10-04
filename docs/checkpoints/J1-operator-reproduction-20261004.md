# J1 repository-backed operator regression acceptance — 2026-10-04

Implementer: Codex. Base: `58bbc57`. New harness review/integration pending. **Tested SQL/procedure source:
`1a4ab65bc24161d0cd8db68c408f09a33d893735`**, the reviewed integration handoff. This checkpoint adds test
infrastructure, not an operator authorization, procedure change or production migration.

## Portable, owned fixture

`scripts/acceptance/notification-worker-operator.mjs` replaces reliance on the session-only hardcoded
operator harness for reproduction. Its only accepted execution argument is an exact 40-hex source commit;
`--help` exits before source/Docker work. The script resolves its own repository directory rather than
changing to a hardcoded Windows path. Commit validation and all SQL extraction precede Docker startup.

```text
node scripts/acceptance/notification-worker-operator.mjs --source-ref 1a4ab65bc24161d0cd8db68c408f09a33d893735
```

It reads migrations and the actual resolution procedure with `git show` from the supplied commit, preserving
the committed SQL text rather than copying a possibly dirty checkout. The operator selects reviewed source;
the harness cannot infer review approval from a commit hash. Output includes source, procedure/migration
SHA-256 identities, server version, assertion count and cleanup result. It prints no real identity/credential.

The existing local image `public.ecr.aws/supabase/postgres:17.6.1.165` is required; `--pull=never` prevents
downloads. A UUID-labeled unique container is created with network `none`, no published ports or host binds.
The harness verifies that configuration before start/migrations. Only PostgreSQL with its image's Auth schema
is used; no Auth server, PostgREST, SMTP, AWS client, real email or scheduler starts. Seven explicit synthetic
rows are seeded independently of the pgTAP fixture's layout. No shared or Claude-owned stack is accepted.

Child commands have 30-second timeouts and initialization has bounded polling. Finally checks the exact
ownership label before removing the owned container and anonymous volumes, even after a failed create/start.
A foreign name collision is never removed. Temporary files are individually tracked/deleted, followed by
their empty generated directory; no recursive filesystem deletion. Success JSON is emitted only after cleanup
completes. Forced termination/daemon loss can still require manual investigation of the uniquely labeled
fixture; the harness is not a general container cleanup service.

## Real result: 59 assertions passed

PostgreSQL **17.6**, all **eight exact-source migrations**, procedure SHA-256
`a4bb8e373035aa588e98ffcdc07cec0b2a3a05c4910c504d26abd50886623730`.

The original 49 assertion behaviors are retained: default rehearsal rolls back with the whole table unchanged;
missing/blank reference/ID and invalid commit flag fail; retryable failures, live processing, below-limit
expired processing, sent rows and absent IDs fail without changes; exhausted failed and expired fifth-claim
rows can become suppressed with attempts/last-attempt/available-at/event/owner retained and claims/error/sent
metadata cleared; terminal replay fails; final aggregate exhausted backlog becomes zero.

Ten added assertions cover explicit `false` rollback, malformed UUID, reference length above 80, unchanged
unrelated rows after each eligible resolution, and unchanged terminal row after each rejected replay.
Expected rejections require **psql exit 3** under the procedure's ON_ERROR_STOP, not merely a nonzero Docker
or timeout exit. The initial run passed 55 assertions; after adding unrelated-row/replay checks and stricter
rejection classification, the final run passed all 59 and reported `cleanup: removed`.

## Negative control and other checks

- A temporary harness variant substituted an explicit `true` commit for the first default rehearsal call.
  It failed at the full-table rollback snapshot assertion with exit 1 and emitted no success JSON. This
  demonstrates that the rehearsal preservation assertion detects an unexpected committed change; it is
  not an altered-production-SQL test. Variant removed in finally and the actual harness bytes verified unchanged.
- Missing arguments, non-exact `main` reference and nonexistent all-zero full reference each exited 1 before
  fixture creation. Exact full commit references are checked as commits, not trees/tags or branch names.
- `node --check scripts/acceptance/notification-worker-operator.mjs`, targeted `npx eslint` and `--help` passed.
- `docker ps --all --filter label=nihonest.operator-acceptance --format '{{.ID}}'` returned no containers after
  the successful runs and expected-failing negative control. Cleanup used only owned fixture IDs/volumes.
- Whitespace passed. No production code, SQL, dependency, translation or configuration change. No new unit
  tests were added: real psql assertions verify the procedure. No full web suite/types/build/browser, pgTAP,
  concurrency, real Auth/PostgREST, hosted or real-provider acceptance was repeated here.

The procedure code was previously reviewed/integrated; this new harness/evidence still needs Claude review
before integration. Scoped resolution approval for real rows, host/scheduler/credentials/monitoring choices
and real-provider/hosted gates remain unchanged. Hold the consolidated handoff at the user's request.
Integration stays `1a4ab65` / `4372d4a`. No main merge, deployed-row mutation, hosted activation or scheduling.
