# J1 PostgreSQL concurrency acceptance — 2026-10-03

Implementer: Codex. Reviewer: Claude. Harness checkpoint base: `8f9646a` (still unreviewed).
**Tested SQL source: reviewed integration `3bf4e94c7b6093e3b5292fc241578f827daff5be`.**
Checkpoint hash is reported separately. Harness/evidence review and integration remain pending.

## Reproducible command and isolation

```sh
node scripts/acceptance/notification-worker-postgres.mjs --source-ref 3bf4e94c7b6093e3b5292fc241578f827daff5be
```

The harness requires an explicit 40-character commit and loads migrations with `git show` from that
commit, not the current working tree. It verifies commit resolution and applies all seven migrations
at the reviewed source. No unreviewed N4, N1 or operator changes enter the tested SQL.

The existing Docker engine and installed image `public.ecr.aws/supabase/postgres:17.6.1.165` are required.
The harness uses `--pull=never`, `--rm`, `--network none`, a unique process-specific container name, no
published ports and no host volumes. It starts no Supabase Auth/PostgREST/SES or resident worker. Existing
containers, including Claude's H5 stack, are untouched. Temporary migration files are deleted individually;
sessions and the owned container are closed/stopped on success or failure. Help starts nothing.

Real PostgreSQL **17.6** was used, with the image's existing auth schema/roles/helper. Committed fixture
rows and JWT-independent service-role RPC calls establish database behavior, not token verification or
Auth/RLS transport through a full Supabase stack. Observer queries use separate administrator connections.

## Results: 36 assertions passed

1. **Competing claims:** independent backends **337 / 338**. A claims one row and leaves its transaction
   open. B claims a different row and commits while A is still holding the lock, with a two-second SQL
   statement timeout. B returned in **7 ms** in this run; that is an observation, not a performance budget.
   A then commits. Each row persisted exactly one attempt and its returned unique token. Claim calls omit
   `p_now`, as the production adapter does, and use the five-attempt/300-second lease contract.
2. **Exhausted work:** failed and expired-processing fifth-attempt rows appear as aggregate counts of
   one each and remain unclaimed. Full row snapshots are unchanged both before and after the other cases.
3. **Reclaim and old-token rejection:** the first fixture lease is made expired, then another connection
   reclaims it. Attempts increase once to two and the token changes. The original token raises `P0002`;
   the complete reclaimed row snapshot is unchanged by that rejected finalization.
4. **Post-lock expiry:** A locks a processing row; B invokes the current finalizer while its lease is
   valid. `pg_stat_activity` and `pg_blocking_pids` prove B is waiting on A, and its query started before
   expiry. A retains the lock until database wall time passes expiry, then commits. B raises `P0002`;
   all row columns remain unchanged. Backends **465 / 464**; database UTC evidence:

   | Event | UTC timestamp |
   | --- | --- |
   | B query starts | 2026-10-04 09:18:49.954838 |
   | Lease expires | 2026-10-04 09:18:53.626544 |
   | A releases lock | 2026-10-04 09:18:54.006159 |

5. **Negative control:** only inside the disposable database, replace the finalizer's completion clock
   with `transaction_timestamp()`. Repeat the lock-wait scenario: it incorrectly suppresses the expired
   row using pre-wait time. Backends **618 / 619**; B begins at **09:18:55.461025 UTC**, expiry is
   **09:18:59.116861 UTC**, release is **09:18:59.472609 UTC**. The harness requires this wrong acceptance
   to demonstrate sensitivity to the original clock defect. The reviewed function is restored in finally,
   then the disposable database is removed. No committed SQL or production clock is modified.

The lock-wait fixture shortens an already claimed row's expiry to four seconds solely to bound the test;
it does not pass an unsupported short lease or artificial `p_now` to the production RPC. Database-time
polls establish that expiry has passed; independent session markers and actual lock observations avoid
assuming a fixed sleep proves concurrency. Calls and observation waits are bounded.

## Other checks and limits

- Final ESM harness syntax check, targeted ESLint and whitespace passed. The first CommonJS draft passed
  31 assertions but lint rejected require imports; it was converted to ESM and strengthened with persisted
  token/backend/release-time assertions before the final **36-assertion** run.
- No app/runtime/migration/translation changes. Full web suites/build/types/browser/content/localization
  gates were not repeated for this standalone database acceptance harness/documentation checkpoint.
- The four pgTAP fixtures were not repeated here: the prior `8f9646a` checkpoint reports **72 passed**
  against all working-branch migrations. This run separately establishes concurrency against exact
  **reviewed** SQL at `3bf4e94`; it is not a combined gate for unreviewed ancestors.
- No isolated Auth/PostgREST/fake-sender execution or hosted acceptance. In particular, this does not prove
  SDK request timing, Auth recipient lookups, consent/relevance changes or uncertain provider acceptance.

The local PostgreSQL competing-claim, post-lock expiry and old-token checks now have direct evidence;
Claude must review the harness/results. Full-stack acceptance, combined reviewed-source validation and
host/scheduler/operator decisions remain open before scheduling. Earlier unreviewed checkpoints remain
separate gates; integration remains H4 `52f8a08` / documentation `3bf4e94`. No main merge or activation.
