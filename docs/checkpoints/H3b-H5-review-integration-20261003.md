# H3b / callback / H5 review and combined integration — 2026-10-03

Reviewer/integration owner: Codex. Exact Claude inputs: H3b original
`3feb37f394f9cfcfe5d8b1bd658fe57dc1daedf9`, readiness repair
`8d6f6dc397dd076bdb629bb0dc02470286ad237f`, callback
`185781700ea0e9e45f9199ab8d03c64415a0888b`, H5
`6866b9705ecdbcfded7a80188d4211807086dfdc`.
Review checkout: isolated detached worktree at H5's exact commit, copied existing dependencies.
No Claude working-copy changes included.

## Decisions

- **H3b approved for local scope.** The repaired readiness loop records success explicitly and exits 1
  before Playwright if all probes fail. The exact committed Bash run block was extracted from YAML and
  executed with curl/npx/sleep fixtures: permanent failure exits 1 without reaching Playwright; success
  exits 0 and reaches it. These are control-flow checks, not a live GitHub Actions run.
- **Callback requires a fix (P2).** The existing return-path guard accepts
  `/account/..//attacker.example`. URL normalization produces pathname `//attacker.example`, and the
  new relative response emits `Location: //attacker.example?auth=unavailable`, which redirects externally.
  An exact-source TypeScript/VM probe using real NextRequest/NextResponse and only disabled Supabase
  configuration mocked confirms this. The parent emits an absolute same-server-origin URL instead.
  Direct leading `//` rejection does not prevent normalized dot-segment bypasses. Claude must validate
  the normalized destination and ensure the emitted relative Location cannot be protocol-relative.
  Add callback regression tests for dot segments, encoded segments/backslashes, ordinary path/query/hash
  and retained exchanged cookies. Callback code and helpers remain Claude-owned.
- **H5 integration/acceptance held.** Source inspection found no separate blocking matcher defect:
  private account/API/auth paths are covered and public pages are excluded; tests use Next's installed
  matcher helper. The callback parent is unsafe. Claude also reports intermittent PGRST303 on first
  parallel profile reads after sign-in/refresh, including a broad-proxy baseline. Root cause is unproven;
  do not attribute it to narrowing or accept degraded account/export behavior without investigation.
  Codex did not repeat H5's real Auth stack run. Claude's reported 5/5 and temporary N4-combined 6/6
  evidence is attributed to Claude, not independent Codex acceptance.

## Reviewed Codex inputs and integration

Claude code-approved four bounded checkpoints: `a39d01b` expected-account binding, `938b869`
revision ordering, `8f9646a` local worker target/operator procedure, and `7758622` PostgreSQL harness.
Approval is scope-limited; Claude reran the revision tests, reported combined Auth binding evidence,
and did not rerun the J1 SQL/operator/concurrency evidence. Reading records as needed is not blanket
approval of consolidated documentation.

On `codex/hosting-native-integration`, after `3bf4e94`, exact-hash cherry-picks with -x:

| Input | Integration commit |
| --- | --- |
| a39d01b | 6f01d99 |
| 938b869 | d6e6314 |
| 8f9646a | 8ea7bf7 |
| 7758622 | 36377bf |
| 3feb37f | 79b469a |
| 8d6f6dc | 0e5fcf9 |

**Validated combined source: `0e5fcf97971b0957321b4c2d4b130cbbab227948`.**
Callback/H5 commits are excluded. The following documentation-only handoff commit is reported separately.

## Commands and evidence

- Exact review checkout: `node --import tsx scripts/release-check.ts`, explicit public fixture origin,
  hosted settings unset, email disabled: all **13 checks passed**, **942 tests / 177 files**, architecture
  **712 modules**, editorial **479**, guidance **97 articles / 30 statuses**, translation/glossary no
  findings, public build **416 generation entries**, post-build types, CMS exclusion and 42-script bundle
  boundary passed. No clean install.
- Combined detached LF checkout at `0e5fcf9`: same release command, all **13 checks passed**,
  **971 tests / 177 files**, same module/audit/build/bundle totals. Default Vitest concurrency.
- Loopback browser verification: rebuild with site origin unset; `next start --hostname 127.0.0.1
  --port 34128`; `playwright test --reporter=line --workers=1`. First full run: **30 passed / 2 failed /
  1 skipped** (Explore glossary card absent and prefecture general-advice link timeout). Both passed
  unchanged on targeted rerun; second full run **32 passed / 1 skipped**. Intermittency remains recorded;
  no source/assertion/timeout changes. Supabase account lifecycle was opt-in/skipped.
- `node scripts/acceptance/notification-worker-postgres.mjs --source-ref
  0e5fcf97971b0957321b4c2d4b130cbbab227948`: **36 assertions passed**, PostgreSQL **17.6**,
  all eight exact-source migrations. Real competing backends **349/348**, B claim 11 ms; post-lock
  finalization started **09:52:55.866096 UTC**, lease expired **09:52:59.435098**, lock released
  **09:52:59.773639** on 2026-10-04. Current authority rejected expiry, unchanged row; transaction-time
  negative control accepted incorrectly and was detected. This rerun does not repeat the earlier 72
  pgTAP / 49 operator assertions or establish Auth/PostgREST behavior.
- Callback probe: `node auth-callback-review.cjs` in the external review-artifact directory; exact parent
  `8d6f6dc` versus `1857817` source, guard and Next response, confirms external redirect only after repair.
  Exact readiness fixtures and command wrappers also live in that artifact directory.

Owned loopback server stopped and disposable database removed. Claude's existing stack/checkouts were
untouched. Main remains unchanged. No real sender, hosted services or scheduling.

## Open gates and next work

Claude approved the prior H4-H3b review record after merging `3bf4e94`; ROADMAP/refactor were skimmed,
not fully approved. This consolidated update needs documentation review.
J1 next: dedicated local Auth/PostgREST preflight and fake-sender acceptance preparation, followed by
actual isolated-stack scenarios. Exhausted-backlog operational acknowledgement remains required before
scheduling. H5 callback/reliability and hosted checks, Stage-C ownership handoff, Japanese component
provenance/wording and native acceptance remain open. Batch 1 is not declared complete.
